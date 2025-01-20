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
self.addEventListener('message',function (event) {
  if (event.data?.debug) {
    console.log('Iframe  >>>  Worker:', event.data);
  }
  const {cmd, data} = event.data;
  if (Commands.hasOwnProperty(cmd)) {
    Pool('Log',`running ${cmd}`);
    try {
      (Commands[cmd])(data);
    } catch (err) {
      Pool('Error', copyError(err));
    }
  } else {
    Pool('Error', {message: `Invalid worker command: ${cmd}`});
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
  import: function (data) {
    if (data?.imports) {
      Import(data.imports);
    }
  },

  /**
   * Compute speech
   * @param data The data object
   * @param post The call back specification
   */
  speech: function(data) {
    if (data?.mml) {
      SRE.engineReady().then(() => {
        Pool('Client', {
          cmd: 'Attach',
          data: {
            speech: SRE.toSpeechStructure(data.mml),
            id: data.id
          }
        });
      });
    }
  },

  /**
   * Setup the speech rule engine.
   * @param data The feature vector for SRE.
   */
  setup: function(data) {
    if (data) {
      SRE.setupEngine(data);
    }
  }

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
const _imported = {};
/**
 * The actual Import method.
 *
 * @param data List of libraries to import.
 */
function Import(data) {
  if (!(data instanceof Array)) data = [data];
  for (let imp of data) {
    if (!_imported[imp]) {
      importScripts(imp);
      _imported[imp] = true;
    }
  }
}
