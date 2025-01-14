/**************************************************************************/
/*
 *  The WorkerPool object.
 *
 *  This implements the remote worker pool that lives in an iframe
 *  within the main page.  It is what creates the actual webworkers,
 *  and it uses messages to and from the main window to coordinate the
 *  workers with the tasks in the main window.
 *
 */

//
//  The WorkerPool object (currently we only implement a single speech worker)
//
export class WorkerPool {
  //
  //  Creates a new WorkerPool (though only one is ever used)
  //  using the location hash to determine the min, max, and domain
  //  values passed to us by the parent window
  //
  static Create() {
    let data = (location.hash.substr(1)).split(/&/);
    let domain = decodeURIComponent(data[0]); // the domain of the parent
    return new WorkerPool(domain, data.slice(1));
  }

  constructor(domain, [src, debug]) {
    this.domain = domain; // the parent window domain
    this.parent = window.parent; // the parent window
    this.WORKER = src;  // 'worker2.js'; // the URL for the webworkers
    this.DEBUG = debug === 'true';
    this.worker = null;
  }

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
    this.parent.postMessage({ cmd: 'Log', data: msg }, this.domain);
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
}

//
//  This is the list of commands that the parent page can send us.
//
export const PoolCommands = {
  //
  //  This starts a task in a webworker.
  //    If there are no free workers, cache the task.
  //    Otherwise, get the next free worker and save the associated task.
  //    Create the webworker, if needed.
  //    Log the action.
  //    Send the worker a start message so that it lets us know when it is ready.
  //
  Start: function (pool, msg) {
    pool.Log('WorkerPool: starting worker.');
    pool.worker.postMessage({ cmd: 'start', data: msg.data });
  },
  //
  //  This is how the Task sends commands to its associated worker
  //    Check that the worker is defined and assigned to the task.
  //    If so, send the worker the message, otherwise produce an error.
  //
  Worker: function (pool, msg) {
    if (!pool.worker) {
      pool.Start();
    }
    pool.worker.postMessage(msg.data);
  },
  //
  //  This stops the given webworker.
  //    Add the worker to the free list, clear its task, and log the action.
  //    If there are any pending tasks, start the first one.
  //
  Stop: function (pool, msg) {
    pool.worker.terminate();
  },

};

//
//  This is the list of commands that can come from the workers
//
export const WorkerCommands = {
  // Post to client
  //
  Client: function (pool, msg) {
    pool.parent.postMessage(msg.data, pool.domain);
  },
  //
  // Exexute a command on pool
  //
  Pool: function (pool, msg) {
    pool.Execute(msg);
  },
  //
  //  This can be used to log messages to the parent
  //
  Log: function (pool, msg) {
    pool.Log(`Worker log: ${msg.data}`);
  },
  error: function (pool, msg) {
    console.log(2);
    console.log(msg.data);
    pool.Log(`EEEEEEEEEEEEEError log: ${msg.data}`);
  },
  
};
