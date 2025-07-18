/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
type WorkerResult = Promise<any>;
type WorkerFunction = (data: Message) => WorkerResult;

declare let global: any;
declare const SRE: any;

/*****************************************************************/

(async () => {
  //
  // Set up for node worker_threads versus browser webworker
  //
  if (typeof self === 'undefined') {
    //
    // For node, make self be the global object
    //
    self = global.self = global;

    //
    // This is so SRE knows we are a worker
    //
    global.DedicatedWorkerGlobalScope = global.constructor;

    //
    // Create addEventListener() and postMessage() functions
    //
    const { parentPort, workerData } = await import(
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
    // Get the path to the mathmaps
    //
    global.maps = workerData.maps;

    //
    // We use require() to load mathmaps in node
    //
    if (!global.require) {
      await import(/* webpackIgnore: true */ './require.mjs');
    }
    global.getMap = (file: string) =>
      Promise.resolve(JSON.stringify(global.require(file)));
  } else {
    //
    // For web workers, make global be the self object
    //
    global = (self as any).global = self;
    //
    // We use fetch() to load mathmaps in web workers
    //
    global.getMap = (file: string) =>
      fetch(file)
        .then((data) => data.json())
        .catch((err) => console.log(err));
  }

  //
  // Custom loader for mathmaps
  //
  global.SREfeature = {
    custom: (locale: string) => global.getMap(`${global.maps}/${locale}.json`),
  };

  //
  // Load SRE
  //
  await (
    global.isLab
      ? import(/* webpackIgnore: true */ './sre-lab.js') // for use in the lab
      : import('./sre.js')
  ).then((SRE) => (global.SRE = SRE));

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
    function (event: MessageEvent) {
      if (event.data.debug) {
        console.log('Client  >>>  Worker:', event.data);
      }
      const { cmd, data } = event.data;
      if (Object.hasOwn(Commands, cmd)) {
        Client('Log', `running ${cmd}`);
        Commands[cmd](data)
          .then((result) => Finished(cmd, { result }))
          .catch((error) => Finished(cmd, { error: error.message }));
      } else {
        Finished(cmd, { error: `Invalid worker command: ${cmd}` });
      }
    },
    false
  );

  /**
   * These are the commands that can be sent from the main window via the iframe.
   */
  const Commands: { [id: string]: WorkerFunction } = {
    /**
     * This loads one or more libraries.
     *
     * @param {Message} data The data object
     * @returns {WorkerResult} A promise the completes when the imports are done
     */
    import(data: Message): WorkerResult {
      return Array.isArray(data.imports)
        ? Promise.all(data.imports.map((file: string) => import(file)))
        : import(data.imports);
    },

    /**
     * Setup the speech rule engine.
     *
     * @param {Message} data The feature vector for SRE.
     * @returns {WorkerResult} A promise that completes when the imports are done
     */
    setup(data: Message): WorkerResult {
      if (!data) {
        return Promise.resolve();
      }
      SRE.setupEngine(data);
      return SRE.engineReady();
    },

    /**
     * Compute speech
     *
     * @param {Message} data The data object
     * @returns {WorkerResult} Promise fulfilled when computation is complete.
     */
    speech(data: Message): WorkerResult {
      return Speech(SRE.workerSpeech, data.mml, data.options);
    },

    /**
     * Compute speech for the next rule set
     *
     * @param {Message} data The data object
     * @returns {WorkerResult} Promise fulfilled when computation is complete.
     */
    nextRules(data: Message): WorkerResult {
      return Speech(SRE.workerNextRules, data.mml, data.options);
    },

    /**
     * Compute speech for the next style or preference
     *
     * @param {Message} data The data object
     * @returns {WorkerResult} Promise fulfilled when computation is complete.
     */
    nextStyle(data: Message): WorkerResult {
      return Speech(SRE.workerNextStyle, data.mml, data.options, data.nodeId);
    },

    /**
     * Compute clearspeak preferences for a given locale
     *
     * @param {Message} data The data object
     * @returns {WorkerResult} Promise fulfilled when computation is complete.
     */
    async localePreferences(data: Message): WorkerResult {
      const structure = await SRE.workerLocalePreferences(data.options);
      // Not strictly necessary for the menu as there should not be one in node.
      // However, it allows for getting the preferences in a different context.
      return structure ? JSON.stringify(structure) : structure;
    },

    /**
     * Compute relevant clearspeak preference category for a semantic node.
     *
     * @param {Message} data The data object
     * @returns {WorkerResult} Promise fulfilled when computation is complete.
     */
    async relevantPreferences(data: Message): WorkerResult {
      return (await SRE.workerRelevantPreferences(data.mml, data.id)) ?? '';
    },
  };

  /**
   * Post a command back to the client. Catches the error in case the data cannot be
   * JSON stringified.
   *
   * @param {string} cmd The command to be posted.
   * @param {Message} data The data object to be send.
   */
  function Client(cmd: string, data: Message | string) {
    try {
      self.postMessage({ cmd: cmd, data: data });
    } catch (err) {
      console.log('Posting error in worker for ', copyError(err));
    }
  }

  /**
   * Post that the current command is finished to the client.
   *
   * @param {string} cmd The command that has finished.
   * @param {Message} msg The data to send back (error or result)
   */
  function Finished(cmd: string, msg: Message) {
    Client('Log', `finished ${cmd}`);
    Client('Finished', { ...msg, cmd: cmd, success: !msg.error });
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
   * @returns {Promise<string>} A promise returning the data to be attached to the DOM
   */
  async function Speech(
    func: (mml: string, options: OptionList, rest: string[]) => string,
    mml: string,
    options: OptionList,
    ...rest: string[]
  ): Promise<string> {
    if (!mml) return '';
    const structure = (await func.call(null, mml, options, ...rest)) ?? {};
    return JSON.stringify(structure);
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
  Client('Ready', {});
})();
