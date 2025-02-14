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
 * Add an event listener so that we can act on commands from Iframe.
 * We extract the command and data from the event, and look for the
 * command in the Commands object below.  If the command is defined,
 * we try to run the command, and if there is an error, we send it to
 * the calling Rule. If the command was not found in the list of valid
 * commands, we produce an error.
 */
self.addEventListener('message',async function (event) {
  if (event.data?.debug) {
    console.log('Iframe  >>>  Worker:', event.data);
  }
  const {cmd, data} = event.data;
  if (Commands.hasOwnProperty(cmd)) {
    Pool('Log',`running ${cmd}`);
    try {
      await (Commands[cmd])(data);
    } catch (err) {
      Pool('Error', copyError(err));
      Finished(cmd, false);
      return;
    }
    Finished(cmd, true);
  } else {
    Pool('Error', {message: `Invalid worker command: ${cmd}`});
    Finished(cmd, false);
  }
}, false);

/**
 * These are the commands that can be sent from the main window via the iframe.
 */
const Commands = {

  /**
   * This loads one or more libraries.
   * @param data The data object
   */
  import: function(data) {
    if (data.imports) {
      Import(data.imports);
    }
  },

  /**
   * Sets the SRE feature vector in the worker. Useful for presetting mathmaps
   * path or custom loader.
   * @param data The data object
   */
  feature: function(data) {
    SREfeature = {
      json: data.json
    };
  },

  /**
   * Setup the speech rule engine.
   * @param data The feature vector for SRE.
   */
  setup: function(data) {
    if (data) {
      SRE.setupEngine(data);
    }
  },

  /**
   * Compute speech
   * @param data The data object
   */
  speech: async function(data) {
    return Speech(SRE.workerSpeech, data.workerId, data.mml, data.options);
  },

  /**
   * Compute speech for the next rule set
   * @param data The data object
   */
  nextRules: async function(data) {
    return Speech(SRE.workerNextRules, data.workerId, data.mml, data.options);
  },

  /**
   * Compute speech for the next style or preference
   * @param data The data object
   */
  nextStyle: async function(data) {
    return Speech(SRE.workerNextStyle, data.workerId, data.mml, data.options, data.nodeId);
  },

};

/**
 * Post a command back to the pool. Catches the error in case the data cannot be
 * JSON stringified.
 * @param cmd The command to be posted.
 * @param data The data object to be send.
 */
function Pool(cmd, data) {
  const msg = {cmd: cmd, data: data};
  try {
    self.postMessage(msg);
  } catch (err) {
    console.log('Posting error in worker', copyError(err));
  }
}

/**
 * Post a command back to the client.
 * @param cmd The client command to be sent to the client.
 * @param data The payload data to be sent to the client.
 */
function Client(cmd, data) {
  Pool('Client', {cmd: cmd, data: data});
}

/**
 * Post that the current command is finished to the client.
 */
function Finished(cmd, success = true) {
  Pool('Client', {cmd: 'Finished', data: {cmd: cmd, success: success}});
}

/**
 * Post a command that returns a new speech structure.
 * @param func The function to call for speech computation.
 * @param id The worker-id of the node.
 * @param mml The mml expression.
 * @param options Setup options for SRE.
 * @param rest Remaining arguments.
 */
async function Speech(func, id, mml, options, ...rest) {
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
 * @param error The error object.
 * @returns The copied error object.
 */
function copyError(error) {
  return {
    message: error.message,
    stack: error.stack,
    fileName: error.fileName,
    lineNumber: error.lineNumber
  };
}

/**
 * We keep track of the imported libraries, so that we don't
 * load them again if another rules asks for them.
 */
const imported = {};

/**
 * The actual Import method.
 *
 * @param data List of libraries to import.
 * @returns {boolean} True if the library is loaded.
 */
function Import(imp) {
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
