/************************************************************************/
/*
 *  The TaskPool object.
 *  
 *  This manages the connection between Tasks and the remote Worker Pool.
 *  You begin by calling
 *  
 *      import * as TaskPool from "taskpool.js";
 *      TaskPool.Create(m,M).Start(callback[,timeout]);
 *  
 *  where m is the minimum number of webworkers to start initially, M is
 *  the maximum number of webworkers allowed to be running at once
 *  (requests for more will be cached until previous ones become
 *  available for re-use), callback is a function to be called when the
 *  worker pool is ready, and timeout is the time (in milliseconds)
 *  to wait for the pool to start up before quitting (the default is
 *  10 seconds).
 *  
 *  The callback will be called with an argument that is either true
 *  (meaning the pool is ready) or false (meaning the pool was not able
 *  to start within the specified timeout).  Within the callback, "this"
 *  refers to the TaskPool object.
 *  
 *  Once the pool is started, you can use this.Task() to start
 *  tasks in the pool.  You can also call this.Stop() to shut 
 *  down the pool.  This kills all running tasks.
 *  
 *  Example:
 *  
 *  TaskPool.Create(1,4).Start(function (ok) {
 *    if (!ok) {
 *      console.log("TaskPool failed to load!");
 *      return;
 *    }
 *    
 *    this.Task("echo","I didn't do anything",{
 *      echo: function (data) {console.log("echoed",data)}
 *    }).Stop();
 *  });
 *
 */

import {Task} from "task.js";

//
//  Create a TaskPool object
//
export function Create(min,max) {return new TaskPool(min,max)};

//
//  The main TaskPool class
//
export class TaskPool {
  constructor(min,max) {
    this.min = min || 0;            // the minimum number of workers to start
    this.max = max || 4;            // the maximum number of simultaneous workers
    this.iframe = null;             // the hidden iframe
    this.pool = null;               // window of the iframe for the pool
    this.ready = null;              // callback for ready signal
    this.tasks = [];                // tasks in the pool
    this.free = 0;                  // first available task index
    this.domain = "";               // the domain of the pool
    this.wait = null;               // waiting for timeout?
  }
  
  //
  //  This starts the task pool so that you can create tasks within the
  //  pool.  This works by creating an iframe that loads a file
  //  (potentially from the CDN) where the webworkers are launched.  Since
  //  the webworkers are created from the iframe, they can use resources
  //  from the CDN, even though the page with the WorkerPool is from a
  //  different origin.
  //  
  //  Since the iframe comes (or may come) from a different origin, we use
  //  the iframe window's postMessage() command and our own onmessage handler
  //  to communicate with the iframe.
  //  
  Start(callback,timeout) {
    if (this.ready) throw Error("TaskPool already stared");
    this.ready = (callback || function () {});
    //
    //  Set up the iframe
    //
    this.iframe = document.createElement("iframe");
    this.iframe.style.display = "none";
    this.iframe.id = "TaskPool-"+(++TaskPool.ID);
    //
    //  Get the domains (for use with the postMessage() function)
    //
    var domain = location.protocol+"//"+location.host+(location.port?":"+location.port:"");
    if (domain === "file://") domain = "*";            // Firefox doesn't match this
    var hash = this.min + "&" + this.max + "&" + encodeURIComponent(domain);
    this.iframe.src = this.POOL + "#" + hash; // pass the min, max, and doman to the pool
    this.domain = this.iframe.src.replace(/^(.*?:\/\/.*?)\/.*/,"$1");  // the pool's domain
    if (this.domain === "file://") this.domain = "*";  // Firefox doesn't match this
    //
    //  Add a listener for the messages from the iframe
    //
    window.addEventListener("message",this.Listener.bind(this));
    //
    //  Add the iframe to the page (starting the process of loading its content)
    //  
    document.body.appendChild(this.iframe);
    //
    //  Start a timer to call the callback if the iframe doesn't
    //  load in a reasonable amount of time.
    //
    if (callback) {
      this.wait = setTimeout((function () {this.ready.call(this,false)}).bind(this),
                                timeout||this.timeout);
    }
    //
    //  Return the TaskPool so that we can chain commands
    //
    return this;
  }

  //
  //  Listener for the messages from the iframe.
  //  We check that the origin of the message is correct (since
  //  any window could send messages to us).
  //  The message will contain a command and data, and we look
  //  in the list of commands to see if we have an implementation for the
  //  given one.  If so, we run the command on the data from the message,
  //  otherwise we throw an error.
  //
  Listener(event) {
    var origin = (event.origin || event.originalEvent.origin);
    if (origin === "null" || origin === "file://") origin = "*";
    if (origin !== this.domain) return;  // make sure the message is from the WorkerPool
    if (Commands.hasOwnProperty(event.data.cmd)) {
      Commands[event.data.cmd].call(this,event.data);
    } else {
      throw Error("Invalid command from pool: "+event.data.cmd);
    }
  }
    
  //
  //  Tasks use this to send messages to their workers.
  //
  Post(msg) {
    this.pool.postMessage(msg,this.domain);
  }

  //
  //  Create a new task.
  //  Get the next free id for the task.
  //  Save the task for future reference.
  //  Tell the pool to start a worker for the task with the required imports.
  //  Return the Task object.
  //
  Task(cmd,data,callbacks,nonstop) {
    if (!this.pool) throw Error("TaskPool has not been started");
    var task = new Task(this,cmd,data,callbacks,nonstop);
    var i = this.free;
    if (i >= this.tasks.length) {
      this.free = i+1;
    } else {
      this.free = this.tasks[this.free];
    }
    this.tasks[i] = task; task.task = i;
    this.Post({cmd:"Start", data:this.imports, task:i});
    return task;
  }
  
  //
  //  Stop the pool from running by removing and freeing the iframe.
  //  Clear the values so that the pool can be restarted, if desired.
  //
  Stop() {
    if (!this.iframe) throw Error("TaskPool has not been started");
    document.body.removeChild(this.iframe);
    this.iframe = this.pool = this.ready = null;
    this.tasks = [];  // force error callbacks of all pending tasks?
    this.free = 0;
  }
};

TaskPool.ID = 0;  // the id number of the pool

//
//  The list of valid commands from the WorkerPool in the iframe.
//
export const Commands = {
  //
  //  This signals that the pool in the iframe is loaded and ready
  //  (we clear the timeout, save the pool window, and signal
  //  the callback that everything is OK).
  //
  Ready: function (msg) {
    if (this.wait) clearTimeout(this.wait);
    this.pool = this.iframe.contentWindow;
    this.ready.call(this,true);
  },
  //
  //  Workers send messages to the Task objects via this command.
  //  The message has the task id and the action to perform.
  //  We look up the action from the Actions object below,
  //  and if there is one, we perform a pre-action or a post-action.
  //  Then we ask the task to dispatch the callback for the given action.
  //  
  Task: function (msg) {
    var i = msg.task, action = msg.action;
    action = (Actions.hasOwnProperty(msg.action) ? Actions[msg.action] : null);
    if (action && action.before) action.method.call(this,msg,"before");
    this.tasks[i]._dispatch(msg);
    if (action && action.after) action.method.call(this,msg,"after");
  },
  //
  //  Can be used to send messages to the console that can be trapped
  //  via this function.
  //
  Log: function (msg) {console.log(msg.data)}
};

//
//  The list of actions to be taken automatically in response
//  to messages from the woker (in addition to the Task handlers).
//
export const Actions = {
  //
  //  The worker is ready.
  //  Inform the worker of the associated worker id.
  //
  ready: {
    before: true,
    method: function (msg) {
      this.tasks[msg.task]._ready(msg.worker);
    }
  },
  //
  //  The worker is done with its task.
  //  Inform the task that the worker is done.
  //  Tell the worker to stop running.
  //  Free up the task id for re-use.
  //
  done: {
    after: true,
    method: function (msg) {
      this.tasks[msg.task]._done(msg.worker);
      this.Post({cmd: "Stop", task:msg.task, worker:msg.worker});
      this.tasks[msg.task] = this.free;
      this.free = msg.task;
    }
  },
  //
  //  An error occurred.
  //  If the task stops for errors, call the done method above.
  //
  error: {
    after: true,
    method: function (msg) {
      var task = this.tasks[msg.task];
      if (!task.nonstop) Actions.done.method.call(this,msg);
    }
  }
};

TaskPool.prototype.POOL = "workerpool.html";  // the URL for the worker pool
TaskPool.prototype.timeout = 10*1000;         // delay (ms) to wait for pool to start
TaskPool.prototype.import = null;             // libraries to import automatically

