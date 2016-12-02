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
//  Creates a new WorkerPool (though only one is ever used)
//  using the location hash to determine the min, max, and domain
//  values passed to us by the parent window
//
export function Create() {
  var data = (location.hash.substr(1)||"1&5&*").split(/&/,3);
  var min = parseInt(data[0]),  // initial number of workers to start
      max = parseInt(data[1]),  // maximum workers allowed to be running at once
      domain = decodeURIComponent(data[2]);  // the domain of the parent
  return new WorkerPool(min,max,domain);
}

//
//  The WorkerPool object
//
export class WorkerPool {
  constructor(min,max,domain) {
    this.min = min;                // the minimum workers to start
    this.domain = domain;          // the parent window domain
    this.parent = window.parent;   // the parent window
    this.WORKER = "worker.js";     // the URL for the webworkers

    this.workers = Array(max);     // the running workers
    this.tasks   = Array(max);     // the task assigned to each worker
    this.free    = Array(max);     // the workers that are free
    for (var i = 0; i < max; i++) this.free[i] = i;

    this.cache = [];               // tasks that are cached until a worker is available
  }
  
  //
  //  Starts the WorkerPool
  //    Add the event listener for the messages from the TaskPool
  //    Create the required minimum number of workers
  //    Signal that the pool is ready
  //  
  Start() {
    window.addEventListener("message",this.Listener.bind(this),false);
    for (var i = 0; i < this.min; i++) this.WebWorker(i);
    this.parent.postMessage({cmd:"Ready"},this.domain);
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
    var origin = (event.origin || event.originalEvent.origin);
    if (origin === "null" || origin === "file://") origin = "*";
    if (origin !== this.domain) return;  //  make sure message is from TaskPool
    if (TaskCommands.hasOwnProperty(event.data.cmd)) {
      TaskCommands[event.data.cmd].call(this,event.data);
    } else {
      this.Log("WorkerPool: invalid Task command: "+event.data.cmd);
    }
  }

  //
  //  Send a Log message to the parent window
  //
  Log(msg) {this.parent.postMessage({cmd:"Log",data:msg},this.domain)}

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
  WebWorker(i) {
    if (!this.workers[i]) {
      this.workers[i] = new Worker(this.WORKER);
      this.workers[i].addEventListener("message",function (event) {
        var data = event.data;
        data.worker = i;
        if (WorkerCommands.hasOwnProperty(data.cmd)) {
          WorkerCommands[data.cmd].call(this,data);
        } else {
          this.Log("WorkerPool: invalid Worker command from worker "+i+": "+data.cmd);
        }
      }.bind(this));
    }
    return this.workers[i];
  }

};

//
//  This is the list of commands that the parent page can send us.
//
export var TaskCommands = {
  //
  //  This starts a task in a webworker.
  //    If there are no free workers, cache the task.
  //    Otherwise, get the next free worker and save the associated task.
  //    Create the webworker, if needed.
  //    Log the action.
  //    Send the worker a start message so that it lets us know when it is ready.
  //
  Start: function (msg) {
    if (this.free.length == 0) {this.cache.push(msg); return}
    var i = this.free.shift();
    this.tasks[i] = msg.task;
    var worker = this.WebWorker(i);
    this.Log("WorkerPool: starting worker "+i+" on task "+msg.task);
    worker.postMessage({cmd:"start", data:msg.data, task:msg.task});
  },
  //
  //  This is the how the Task sends commands to its associated worker
  //    Check that the worker is defined and assigned to the task.
  //    If so, send the worker the message, otherwise produce an error.
  //
  Worker: function (msg) {
    var worker = this.workers[msg.worker];
    if (worker && this.tasks[msg.worker] == msg.task) {
      worker.postMessage(msg.data);
    } else {
      this.Log("Worker "+msg.worker+" is not assigned to task "+msg.task);
      this.parent.postMessage({
        cmd: "Task", data: {message: "Worker "+msg.worker+" is not assigned to this task"},
        action: "error", task:msg.task, worker: msg.worker, post: msg.post
      },this.domain);
    }
  },
  //
  //  This stops the given webworker.
  //    Add the worker to the free list, clear its task, and log the action.
  //    If there are any pending tasks, start the first one.
  //
  Stop: function (msg) {
    this.free.unshift(msg.worker);
    this.tasks[msg.worker] = null;
    this.Log("WorkerPool: ending task "+msg.worker);
    var msg = this.cache.shift();
    if (msg) PoolCommands.Start.call(this,msg);
  }
};

//
//  This is the list of commands that can come from the workers
//
export var WorkerCommands = {
  //
  //  This is how the worker sends commands to the associated Task.
  //    Add the task id to the messaage and post it to the parent window
  //
  Task: function (msg) {
    msg.task = this.tasks[msg.worker];
    this.parent.postMessage(msg,this.domain);
  },
  //
  //  This can be used to log messages to the parent
  //
  Log: function (msg) {
    this.Log("Worker "+msg.worker+": "+msg.data);
  }
};

