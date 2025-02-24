/*************************************************************
 *
 *  Copyright (c) 2018-2024 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 *  This is the code run by the webworkers in the iframe.
 *  It can load content from the CDN since the iframe runs from there.
 *  You can add importScripts() commands at the top to preload libraries
 *  or a Task can run the "import" action to load libraries on the fly.
 *
 *  The actions that can be run are listed in the Commands variable, and
 *  imported scripts can add to that object to make more commands available.
 *  If you want to pre-load libraries that add commands, they should be
 *  imported at the bottom of this file using importScripts().
 */

/**
 * Don't want to use imports for these, since this is compiled separately
 * with different parameters, and that would cause the imported files
 * to be compiled with those parameters.
 */
type OptionList = { [name: string]: any };
type Message = { [key: string]: any };

declare let global: any;
declare const SRE: any;

/*****************************************************************/

(async () => {
  //
  // Set up for node worker_threads versus browser webworker
  //
  if (typeof self === 'undefined') {
    self = global.self = global; // for node, make self be the global object

    global.DedicatedWorkerGlobalScope = global.constructor; // so SRE knows we are a worker

    global.copyStructure = (structure: any) => JSON.stringify(structure);

    //
    // Create addEventListener() and postMessage() function
    //
    const { parentPort } = await import(
      /* webpackIgnore: true */ 'node:worker_threads'
    );
    global.addEventListener = (
      kind: string,
      listener: (event: Event) => void
    ) => {
      parentPort.on(kind, listener);
    };
    global.postMessage = (msg: any) => {
      parentPort.postMessage({ data: msg });
    };

    //
    // SRE needs require(), and we use it to load mathmaps
    //
    if (!global.require) {
      await import(/* webpackIgnore: true */ './require.mjs');
    }

    //
    // Custom loader for mathmaps
    //
    global.SREfeature = {
      custom: (locale: string) => {
        const file = 'speech-rule-engine/lib/mathmaps/' + locale + '.json';
        return Promise.resolve(JSON.stringify(global.require(file)));
      },
    };
  } else {
    global = (self as any).global = self; // for web workers make global be the self object
    global.copyStructure = (structure: any) => structure;
    global.SREfeaure = { json: './mathmaps/' };
  }
  global.exports = self; // lets SRE get defined as a global variable

  //
  // Load SRE
  //
  await import('./sre.js')
    .catch((_) => import(/* webpackIgnore: true */ './sre-lab.js')) // for use in the lab
    .then((SRE) => {
      global.SRE = SRE;
    });

  /*****************************************************************/

  /**
   * Add an event listener so that we can act on commands from Iframe.
   * We extract the command and data from the event, and look for the
   * command in the Commands object below.  If the command is defined,
   * we try to run the command, and if there is an error, we send it to
   * the calling Rule. If the command was not found in the list of valid
   * commands, we produce an error.
   */
  self.addEventListener(
    'message',
    async function (event: MessageEvent) {
      if (event.data.debug) {
        console.log('Iframe  >>>  Worker:', event.data);
      }
      const { cmd, data } = event.data;
      if (Object.hasOwn(Commands, cmd)) {
        Pool('Log', `running ${cmd}`);
        try {
          await Commands[cmd](data);
        } catch (err) {
          Pool('Error', copyError(err));
          Finished(cmd, false);
          return;
        }
        Finished(cmd, true);
      } else {
        Pool('Error', { message: `Invalid worker command: ${cmd}` });
        Finished(cmd, false);
      }
    },
    false
  );

  /**
   * These are the commands that can be sent from the main window via the iframe.
   */
  const Commands: {
    [id: string]: (data: Message) => void | Promise<void>;
  } = {
    /**
     * This loads one or more libraries.
     *
     * @param {Message} data The data object
     * @returns {Promise} A promise the completes when the imports are done
     */
    import(data: Message): Promise<void> {
      return Array.isArray(data.imports)
        ? Promise.all(data.imports.map((file: string) => import(file)))
        : import(data.imports);
    },

    /**
     * Sets the SRE feature vector in the worker. Useful for presetting mathmaps
     * path or custom loader.
     *
     * @param {Message} data The data object
     */
    feature(data: Message) {
      global.SREfeature = {
        json: data.json,
      };
    },

    /**
     * Setup the speech rule engine.
     *
     * @param {Message} data The feature vector for SRE.
     */
    setup(data: Message) {
      if (data) {
        SRE.setupEngine(data);
      }
    },

    /**
     * Compute speech
     *
     * @param {Message} data The data object
     * @returns {Promise<void>} Promise fulfilled when computation is complete.
     */
    speech(data: Message): Promise<void> {
      return Speech(SRE.workerSpeech, data.mml, data.options);
    },

    /**
     * Compute speech for the next rule set
     *
     * @param {Message} data The data object
     * @returns {Promise<void>} Promise fulfilled when computation is complete.
     */
    nextRules(data: Message): Promise<void> {
      return Speech(SRE.workerNextRules, data.mml, data.options);
    },

    /**
     * Compute speech for the next style or preference
     *
     * @param {Message} data The data object
     * @returns {Promise<void>} Promise fulfilled when computation is complete.
     */
    nextStyle(data: Message): Promise<void> {
      return Speech(SRE.workerNextStyle, data.mml, data.options, data.nodeId);
    },
  };

  /**
   * Post a command back to the pool. Catches the error in case the data cannot be
   * JSON stringified.
   *
   * @param {string} cmd The command to be posted.
   * @param {Message} data The data object to be send.
   */
  function Pool(cmd: string, data: Message | string) {
    try {
      self.postMessage({ cmd: cmd, data: data });
    } catch (err) {
      console.log('Posting error in worker for ', copyError(err));
    }
  }

  /**
   * Post a command back to the client.
   *
   * @param {string} cmd The client command to be sent to the client.
   * @param {Message} data The payload data to be sent to the client.
   */
  function Client(cmd: string, data: Message) {
    Pool('Client', { cmd: cmd, data: data });
  }

  /**
   * Post that the current command is finished to the client.
   *
   * @param {string} cmd The command that has finished.
   * @param {boolean} success Flag indicating if success of the command.
   */
  function Finished(cmd: string, success: boolean = true) {
    Client('Finished', { cmd: cmd, success: success });
  }

  /**
   * Post a command that returns a new speech structure.
   *
   * @param {(mml: string, options: OptionList, rest: string[]) =>
   *             {[id: string]: string}} func
   *     The function to call for speech computation.
   * @param {string} mml The mml expression.
   * @param {OptionList} options Setup options for SRE.
   * @param {string[]} rest Remaining arguments.
   */
  async function Speech(
    func: (
      mml: string,
      options: OptionList,
      rest: string[]
    ) => { [id: string]: string },
    mml: string,
    options: OptionList,
    ...rest: string[]
  ) {
    if (mml) {
      let structure = await func.call(null, mml, options, ...rest);
      structure = structure ?? {};
      Client('Attach', global.copyStructure(structure));
    }
  }

  /**
   * Make a copy of an Error object (since those can't be stringified).
   *
   * @param {Error} error The error object.
   * @returns {Message} The copied error object.
   */
  function copyError(error: Error): Message {
    return {
      message: error.message,
      stack: error.stack,
      fileName: (error as any).fileName,
      lineNumber: (error as any).lineNumber,
    };
  }

  /**
   * Wait for SRE to set itself up,
   * then tell the WorkerPool that we are ready.
   */
  await SRE.engineReady();
  Pool('Ready', {});
})();
