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
 *  The WorkerPool object.
 *
 *  This implements the remote worker pool that lives in an iframe
 *  within the main page.  It is what creates the actual webworker,
 *  and it uses messages to and from the main window to coordinate the
 *  worker.
 *
 */

/**
 * The WorkerPool object (currently we only implement a single speech worker)
 */
export class WorkerPool {

  /**
   * Creates a new WorkerPool (though only one is ever used) using the location
   * hash to determine the domain values and the source of the base worker code
   * passed to us by the parent window. Additionally we can send a flag for
   * debugging.
   */
  static Create() {
    let data = (location.hash.substr(1)).split(/&/);
    let domain = decodeURIComponent(data[0]); // the domain of the parent
    return new WorkerPool(domain, data[1], data[2]);
  }

  /**
   * @param {string} domain The parent window domain
   * @param {string} src Location of the base worker code
   * @param {boolean} debug Optionally a debug flag for logging.
   */
  constructor(domain, src, debug = true) {
    this.domain = domain;
    this.parent = window.parent; // the parent window
    this.WORKER = src;
    this.DEBUG = debug.toLowerCase() === 'true';
    this.worker = null; // We really only have one worker for now.
  }


  /**
   * Debug output if flag ist set.
   *
   * @param {string} msg Logs the message.
   * @param {any[]} rest Arbitrary remaining arguments.
   */
  debug(msg, ...rest) {
    if (this.DEBUG) {
      console.info(msg, ...rest);
    }
  }

  /**
   * Starts the Worker
   *   Adds the event listener for the messages from the WorkerPool
   *   Signals that the pool is ready
   */
  Start() {
    window.addEventListener('message', this.Listener.bind(this), false);
    this.createWorker();
    this.parent.postMessage({ cmd: 'Ready' }, this.domain);
    return this;
  }

  /**
   * The handler for messages from the parent window.
   *   Check the message origin to make sure it is correct (since any
   *     window can send us messages).
   *   If it is OK, then check to see if there is a Pool command for the message
   *   If so, run it, otherwise produce an error.
   */
  Listener(event) {
    this.debug('Client  >>>  Iframe:', event.data);
    let origin = event.origin || event.originalEvent.origin;
    if (origin === 'null' || origin === 'file://') {
      origin = '*';
    }
    if (origin !== this.domain) {
      return; //  make sure message is from TaskPool
    }
    this.Execute(event.data);
  }

  /**
   * Execute a command on the Pool.
   *
   * @param data The data for the command.
   */
  Execute(data) {
    if (Object.hasOwn(PoolCommands, data.cmd)) {
      PoolCommands[data.cmd](this, data);
    } else {
      this.Log(`WorkerPool: invalid Pool command: ${data.cmd}`);
    }
  }

  /**
   * Send a Log message to the parent window
   *
   * @param {string} msg The message.
   */
  Log(msg) {
    this.parent.postMessage({ cmd: 'Log', data: {msg: msg} }, this.domain);
  }

  /**
   *   Create the worker and save it.  Add an event listener for the worker that
   *   executes worker commands by checking if the worker command exists for
   *   that message.  If so, run the command otherwise log the error.
   */
  createWorker() {
    this.worker = new Worker(this.WORKER);
    this.worker.addEventListener(
      'message',
      (event) => {
        this.debug('Worker  >>>  Iframe:', event.data);
        let data = event.data;
        if (WorkerCommands.hasOwnProperty(data.cmd)) {
          WorkerCommands[data.cmd](this, data);
        } else {
          this.Log(
            `WorkerPool: invalid Worker command ${data.cmd}`
          );
        }
      }
    );
  }

  /**
   * Terminates the worker.
   */
  Terminate() {
    if (this.workers) {
      this.Log(`Terminate worker`);
      this.worker.terminate();
      this.worker = null;
    }
  }

}

/**
 *  This is the list of commands that the parent page can send to the pool.
 */
export const PoolCommands = {
  /**
   *  Start the webworker.
   */
  Start: function (pool, msg) {
    pool.Log('WorkerPool: starting worker.');
    pool.worker.postMessage({ cmd: 'start', data: msg.data });
  },
  /**
   * Sends commands to the worker associated with the rule.
   * Check that the worker exists, if not start it.
   */
  Worker: function (pool, msg) {
    if (!pool.worker) {
      pool.Start();
    }
    pool.worker.postMessage(msg.data);
  },
  /**
   *  Terminates the worker.
   */
  Terminate: function (pool, _msg) {
    pool.Terminate();
  },

};


/**
 * This is the list of commands that can come from the workers
 */
export const WorkerCommands = {
  /**
   * Send a client command.
   */
  Client: function (pool, msg) {
    pool.parent.postMessage(msg.data, pool.domain);
  },
  /**
   * Execute a pool command.
   */
  Pool: function (pool, msg) {
    pool.Execute(msg);
  },
  /**
   * Logging a worker message.
   */
  Log: function (pool, msg) {
    pool.Log(`Worker log: ${msg.data}`);
  },
  /**
   * Logging a worker error.
   */
  Error: function (pool, msg) {
    pool.Log(`Worker error: ${msg.data}`);
  },
  
};
