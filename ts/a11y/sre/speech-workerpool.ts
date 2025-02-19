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

import { PoolCommand, WorkerCommand } from '../speech/MessageTypes.js';

/**
 *  The WorkerPool object.
 *
 *  This implements the remote worker pool that lives in an iframe within the
 *  main page.  It is what creates the actual webworker, and it uses messages to
 *  and from the main window to coordinate the worker.
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
   *
   * @returns {WorkerPool} The newly created workerpool.
   */
  static Create(): WorkerPool {
    const data = location.hash.substring(1).split(/&/);
    // the domain of the parent
    const domain = decodeURIComponent(data[0]);
    return new WorkerPool(domain, data[1], data[2]);
  }

  public parent: Window;
  public WORKER: string;
  public DEBUG: boolean = false;
  public worker: Worker = null;

  /**
   * @param {string} domain The parent window domain
   * @param {string} src Location of the base worker code
   * @param {string} debug Optionally a debug flag for logging.
   */
  constructor(
    public domain: string,
    src: string,
    debug: string = 'true'
  ) {
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
  debug(msg: string, ...rest: string[]) {
    if (this.DEBUG) {
      console.info(msg, ...rest);
    }
  }

  /**
   * Starts the Worker
   *   Adds the event listener for the messages from the WorkerPool
   *   Signals that the pool is ready
   *
   * @returns {WorkerPool} The workerpool
   */
  Start(): WorkerPool {
    window.addEventListener('message', this.Listener.bind(this), false);
    this.createWorker();
    this.parent.postMessage({ cmd: 'Ready' }, this.domain);
    return this;
  }

  /**
   * The handler for messages from the parent window.
   * Check the message origin to make sure it is correct (since any
   * window can send us messages).
   * If it is OK, then check to see if there is a Pool command for the message
   * If so, run it, otherwise produce an error.
   *
   * @param {MessageEvent} event The message event.
   */
  Listener(event: MessageEvent) {
    this.debug('Client  >>>  Iframe:', event.data);
    let origin = event.origin;
    if (origin === 'null' || origin === 'file://') {
      origin = '*';
    }
    //  make sure message is from TaskPool
    if (origin !== this.domain) {
      return;
    }
    this.Execute(event.data);
  }

  /**
   * Execute a command on the Pool.
   *
   * @param {PoolCommand} data The data for the command.
   */
  Execute(data: PoolCommand) {
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
  Log(msg: string) {
    this.parent.postMessage({ cmd: 'Log', data: { msg: msg } }, this.domain);
  }

  /**
   * Create the worker and save it.  Add an event listener for the worker that
   * executes worker commands by checking if the worker command exists for that
   * message.  If so, run the command otherwise log the error.
   */
  createWorker() {
    this.worker = new Worker(this.WORKER);
    this.worker.addEventListener('message', (event) => {
      this.debug('Worker  >>>  Iframe:', event.data);
      const data = event.data;
      if (Object.hasOwn(WorkerCommands, data.cmd)) {
        WorkerCommands[data.cmd](this, data);
      } else {
        this.Log(`WorkerPool: invalid Worker command ${data.cmd}`);
      }
    });
  }

  /**
   * Terminates the worker.
   */
  Terminate() {
    this.Log(`Terminate worker`);
    this.worker.terminate();
    this.worker = null;
  }
}

/**
 *  This is the list of commands that the parent page can send to the pool.
 */
export const PoolCommands: {
  [cmd: string]: (pool: WorkerPool, msg: PoolCommand) => void;
} = {
  /**
   *  Start the webworker.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {PoolCommand} msg The pool command.
   */
  Start: function (pool: WorkerPool, msg: PoolCommand) {
    pool.Log('WorkerPool: starting worker.');
    pool.worker.postMessage({ cmd: 'start', data: msg.data });
  },

  /**
   * Sends commands to the worker associated with the rule.
   * Check that the worker exists, if not start it.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {PoolCommand} msg The pool command.
   */
  Worker: function (pool: WorkerPool, msg: PoolCommand) {
    if (!pool.worker) {
      pool.Start();
    }
    pool.worker.postMessage(msg.data);
  },

  /**
   *  Terminates the worker.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {PoolCommand} _msg The pool command, which is ignored.
   */
  Terminate: function (pool: WorkerPool, _msg: PoolCommand) {
    pool.Terminate();
  },
};

/**
 * This is the list of commands that can come from the workers
 */
export const WorkerCommands: {
  [cmd: string]: (pool: WorkerPool, msg: WorkerCommand) => void;
} = {
  /**
   * Send a client command.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {WorkerCommand} msg The worker command.
   */
  Client: function (pool: WorkerPool, msg: WorkerCommand) {
    pool.parent.postMessage(msg.data, pool.domain);
  },

  /**
   * Execute a pool command.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {WorkerCommand} msg The worker command.
   */
  Pool: function (pool: WorkerPool, msg: WorkerCommand) {
    pool.Execute(msg);
  },

  /**
   * Logging a worker message.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {WorkerCommand} msg The worker command.
   */
  Log: function (pool: WorkerPool, msg: WorkerCommand) {
    pool.Log(`Worker log: ${msg.data}`);
  },

  /**
   * Logging a worker error.
   *
   * @param {WorkerPool} pool The current workerpool.
   * @param {WorkerCommand} msg The worker command.
   */
  Error: function (pool: WorkerPool, msg: WorkerCommand) {
    pool.Log(`Worker error: ${JSON.stringify(msg.data)}`);
  },
};
