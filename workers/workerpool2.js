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

  //
  //  Starts the WorkerPool
  //    Add the event listener for the messages from the TaskPool
  //    Create the required minimum number of workers
  //    Signal that the pool is ready
  //
  Start() {
    window.addEventListener('message', this.Listener.bind(this), false);
    this.createWorker();
    this.parent.postMessage({ cmd: 'Ready' }, this.domain);
    return this;
  }

  //
  //  The handler for messages from the parent window.
  //    Check the message origin to make sure it is correct (since any
  //      window can send us messages).
  //    If it is OK, then check to see if there is a Pool command for the message
  //    If so, run it, otherwise produce an error.
  //
  Listener(event) {
    this.debug('Client  >>>  Iframe:', event.data);
    let origin = event.origin || event.originalEvent.origin;
    if (origin === 'null' || origin === 'file://') {
      origin = '*';
    }
    if (origin !== this.domain) {
      return; //  make sure message is from TaskPool
    }
    if (Object.hasOwn(TaskCommands, event.data.cmd)) {
      TaskCommands[event.data.cmd](this, event.data);
    } else {
      this.Log(`WorkerPool: invalid Task command: ${event.data.cmd}`);
    }
  }

  //
  //  Send a Log message to the parent window
  //
  Log(msg) {
    this.parent.postMessage({ cmd: 'Log', data: msg }, this.domain);
  }

  //
  //  Get the given worker, starting it, if necessary.
  //  If the worker needs to be started,
  //    Create the worker and save it.
  //    Add an event listener for the worker that
  //      adds the worker id to the message
  //      and checks to see if the worker command exists for that message.
  //      If so, run the command otherwise log the error.
  //  Return the worker.
  //
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
export const TaskCommands = {
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
  //
  //  This is how the worker sends commands to the associated Task.
  //    Add the task id to the messaage and post it to the parent window
  //
  Task: function (pool, msg) {
    pool.parent.postMessage(msg, pool.domain);
  },
  //
  //  This can be used to log messages to the parent
  //
  Log: function (pool, msg) {
    pool.Log(`Worker log: ${msg.data}`);
  },
};
