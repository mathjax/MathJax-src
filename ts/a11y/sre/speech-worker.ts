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

import { OptionList } from '../../util/Options.js';
import { Message } from '../speech/MessageTypes.js';

declare const SRE: any;
declare let SREfeature: Message; // eslint-disable-line @typescript-eslint/no-unused-vars

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
    if (event.data?.debug) {
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
   */
  import: function (data: Message) {
    if (data.imports) {
      Import(data.imports);
    }
  },

  /**
   * Sets the SRE feature vector in the worker. Useful for presetting mathmaps
   * path or custom loader.
   *
   * @param {Message} data The data object
   */
  feature: function (data: Message) {
    SREfeature = {
      json: data.json,
    };
  },

  /**
   * Setup the speech rule engine.
   *
   * @param {Message} data The feature vector for SRE.
   */
  setup: function (data: Message) {
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
  speech: async function (data: Message): Promise<void> {
    return Speech(SRE.workerSpeech, data.workerId, data.mml, data.options);
  },

  /**
   * Compute speech for the next rule set
   *
   * @param {Message} data The data object
   * @returns {Promise<void>} Promise fulfilled when computation is complete.
   */
  nextRules: async function (data: Message) {
    return Speech(SRE.workerNextRules, data.workerId, data.mml, data.options);
  },

  /**
   * Compute speech for the next style or preference
   *
   * @param {Message} data The data object
   * @returns {Promise<void>} Promise fulfilled when computation is complete.
   */
  nextStyle: async function (data: Message) {
    return Speech(
      SRE.workerNextStyle,
      data.workerId,
      data.mml,
      data.options,
      data.nodeId
    );
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
  const msg = { cmd: cmd, data: data };
  try {
    self.postMessage(msg);
  } catch (err) {
    console.log('Posting error in worker', copyError(err));
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
  Pool('Client', { cmd: 'Finished', data: { cmd: cmd, success: success } });
}

/**
 * Post a command that returns a new speech structure.
 *
 * @param {(mml: string, options: OptionList, rest: string[]) =>
 *             {[id: string]: string}} func
 *     The function to call for speech computation.
 * @param {string} id The worker-id of the node.
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
  id: string,
  mml: string,
  options: OptionList,
  ...rest: string[]
) {
  if (mml) {
    let structure = await func.call(null, mml, options, ...rest);
    structure = structure ?? {};
    structure.id = id;
    Client('Attach', structure);
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
 * We keep track of the imported libraries, so that we don't
 * load them again if another rules asks for them.
 */
const imported: { [lib: string]: boolean } = {};

declare const importScripts: (lib: string) => void;

/**
 * The actual Import method.
 *
 * @param {string} imp List of libraries to import.
 */
function Import(imp: string) {
  if (!imported[imp]) {
    try {
      importScripts(imp);
    } catch (err) {
      imported[imp] = false;
      throw err;
    }
    imported[imp] = true;
  }
}
