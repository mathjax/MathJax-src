/************************************************************************/
/*
 *  The Task object.
 *
 *  A Task is connected to a webworker, and the task asks the worker to
 *  perform actions on its behalf.  These are named commands that are
 *  defined in the worker.js file (or are loaded later by the task).
 *
 *  You start a task by setting up a TaskPool, and calling its Task() method
 *  
 *      taskpool.Task(cmd,data,callbacks);
 *  
 *  where cmd is the named command for the task to perform, data is the data
 *  that the command needs (it could be a string, or an array, or an object
 *  that can be JSON stringified), and callbacks is a object containing named
 *  callbacks to handle communication from the worker that is handling the task.
 *  E.g.
 *  
 *      taskpool.Task("import","myLibrary.js",{
 *        error: function (data) {console.log("Error: "+data.message)},
 *        imported: function (data) {
 *          this.Run("myCommand",{x:1, y:3}); // myCommand defined in myLibrary.js
 *                                            //  (it calls Task("done",data) to end the task)
 *        },
 *        done: function (data) {console.log("Done: ",data)}
 *      });
 *  
 *  Alternatively, you can just create the Task and post commands later:
 *  
 *      var task = taskpool.Taks();
 *      task.Run("echo","This came from the worker",{
 *        echo: function (data) {console.log("Echoed",data)}
 *      });
 *  
 *  Or even:
 *  
 *      taskpool.Task()
 *        .Callbacks({
 *          error: function (data) {console.log("Error: "+data.message)},
 *          imported: function (data) {
 *            this.Run("myCommand",{x:1, y:3});
 *          },
 *          done: function (data) {
 *            // do something with the response of myCommand
 *          }
 *        })
 *        .Run("import","myLibrary.js");
 * 
 *  Or:
 *  
 *      taskpool.Task()
 *        .Callbacks({
 *          error: function (data) {console.log("Error: "+data.message)},
 *          done: function (data) {
 *            // do something with the response of myCommand
 *          }
 *        })
 *        .Run("import","myLibrary.js")
 *        .Run("myCommand",{x:1, y:2});
 * 
 */


//
//  The Task object
//
export class Task {

  constructor(pool,cmd,data,callbacks,nonstop) {
    this.pool = pool;       // the WorkerPool this task belongs to
    this.cache = [];        // a cache of commands to send once the worker is started
    this.worker = -1;       // the worker number assigned to this task
    this.nonstop = nonstop; // true means errors don't terminate the task
    this.callbacks = [[typeof(callbacks) === "function" ? {done:callbacks} : (callbacks || {})]];
    this.callback = 0;      // the active set of callbacks
    //
    //  Cache the command and data to be used when the worker is ready.
    //
    if (cmd) this.cache.push({cmd:cmd, data:data});
  }

  //
  //  Run a command in the associated worker.  The command must be defined in
  //  the worker.js file, or have been loaded by running a previous import or eval
  //  command.  The data is whatever data the command needs (a JSON stringifyable
  //  object), and callbacks is a collection of callbacks that will be used
  //  (in addition to the ones from the original Task() call) to handle any
  //  messages from the worker or any messages from any Run() commands performed
  //  within those callbacks.
  //
  Run(cmd,data,callbacks) {
    if (this.task < 0) throw Error("Task is not running");
    if (this.worker < 0) {
      //
      //  If the worker hasn't stared yet, cache the commands
      //  to be run when it is ready.
      //
      this.cache.push({cmd:cmd, data:data, callbacks:callbacks});
    } else {
      //
      //  Get the index of the collection of callback objects currently in play
      //  If there are new callbacks
      //    Add a new callback array to this.callbacks that consists of
      //      the new collback block followed by the current list of callbacks
      //      and use that new list as the actuive one
      //
      var post = this.callback;
      if (callbacks) {
        post = this.callbacks.length;
        this.callbacks.push(
          [typeof(callbacks) === "function" ? {done:callbacks} : callbacks]
            .concat(this.callbacks[this.callback])
        );
      }
      //
      //  Send the worker a message consisting of the
      //  command and data, with the id of the callback list
      //  and some meta data about the task and worker involved.
      //
      this.pool.Post({
        cmd: "Worker", task: this.task, worker: this.worker,
        data: {cmd:cmd, data:data, post:post}
      });
    }
    return this;
  }

  //
  //  Shorthands for the pre-defined commands
  //
  Stop(callbacks)        {return this.Run("stop",null,callbacks)}
  Eval(code,callbacks)   {return this.Run("eval",code,callbacks)}
  Import(libs,callbacks) {return this.Run("import",libs,callbacks)}
  Echo(msg,callbacks)    {return this.Run("echo",msg,callbacks)}

  //
  //  Add more default callbacks (like the ones created with the
  //  original task).
  //
  Callbacks(callbacks) {
    for (var id in callbacks) {
      if (callbacks.hasOwnProperty(id)) {
        this.callbacks[0][0][id] = callbacks[id];
      }
    }
    return this;
  }

  //
  //  Internal routine for dispatching the messages
  //  from the worker (using the lists of callbacks)
  //
  _dispatch(msg) {
    var i = msg.post || 0, action = msg.action;
    this.callback = i;
    var callbacks = this.callbacks[i] || [];
    for (var j = 0, m = callbacks.length; j < m; j++) {
      if (callbacks[j].hasOwnProperty(action)) {
        callbacks[j][action].call(this,msg.data);
        break;
      }
    }
  }

  //
  //  Called by WorkerPool when the worker is ready.
  //  Save the worker id, and post any cached messages.
  //  
  _ready(worker) {
    this.worker = worker;
    var msg; while ((msg = this.cache.shift())) this.Run(msg.cmd,msg.data,msg.callbacks);
  }

  //
  //  Called by WorkerPool when the worker is done
  //  Mark the task so that it won't run any more actions.
  //
  _done() {
    this.worker = this.task = -1;
    this.callbacks = []; this.callback = 0;
  }

};