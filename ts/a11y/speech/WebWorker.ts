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
 * @file  Web worker utilities.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

/* eslint @typescript-eslint/no-empty-object-type: 0 */
type Callbacks = { [name: string]: (data: {}) => void };
type Message = { post: string; action: string; data: {}; task?: number };
type Command = { cmd: string; data: {}; task?: number; worker?: number };

//
//  The Task object
//
export class Task {
  // a cache of commands to send once the worker is started
  public cache: { cmd: string; data: {}; callbacks?: Callbacks }[] = [];
  // the worker number assigned to this task
  public worker = -1;
  // the active set of callbacks
  public task = 0;
  public callback: number = 0;

  constructor(
    // the WorkerPool this task belongs to
    public pool: TaskPool,
    public cmd: string,
    public data: {},
    public callbacks: Callbacks,
    // true means errors don't terminate the task
    public nonstop: boolean
  ) {
    //
    //  Cache the command and data to be used when the worker is ready.
    //
    if (cmd) {
      this.cache.push({ cmd: cmd, data: data });
    }
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
  public Run(cmd: string, data: {}, callbacks: Callbacks = {}) {
    if (this.task < 0) throw Error('Task is not running');
    if (this.worker < 0) {
      //
      //  If the worker hasn't stared yet, cache the commands
      //  to be run when it is ready.
      //
      this.cache.push({ cmd: cmd, data: data, callbacks: callbacks });
    } else {
      //
      //  Get the index of the collection of callback objects currently in play
      //  If there are new callbacks
      //    Add a new callback array to this.callbacks that consists of
      //      the new collback block followed by the current list of callbacks
      //      and use that new list as the actuive one
      //
      const post = this.callback;
      if (callbacks) {
        this.Callbacks(callbacks);
      }
      //
      //  Send the worker a message consisting of the
      //  command and data, with the id of the callback list
      //  and some meta data about the task and worker involved.
      //
      this.pool.Post({
        cmd: 'Worker',
        task: this.task,
        worker: this.worker,
        data: { cmd: cmd, data: data, post: post },
      });
    }
    return this;
  }

  //
  //  Shorthands for the pre-defined commands
  //
  public Stop(callbacks: Callbacks) {
    return this.Run('stop', null, callbacks);
  }
  public Eval(code: string, callbacks: Callbacks) {
    return this.Run('eval', code, callbacks);
  }

  public Import(libs: string, callbacks: Callbacks) {
    return this.Run('import', libs, callbacks);
  }

  public Echo(msg: string, callbacks: Callbacks) {
    return this.Run('echo', msg, callbacks);
  }

  //
  //  Add more default callbacks (like the ones created with the
  //  original task).
  //
  Callbacks(callbacks: Callbacks) {
    for (const [id, callback] of Object.entries(callbacks)) {
      callbacks[id] = callback;
    }
    return this;
  }

  //
  //  Internal routine for dispatching the messages
  //  from the worker (using the lists of callbacks)
  //
  _dispatch(msg: Message) {
    // let i = msg.post || 0,
    const action = msg.action;
    if (this.callbacks[action]) {
      this.callbacks[action](msg.data);
    }
    // this.callback = i;
    // var callbacks = this.callbacks[i] || [];
    // for (var j = 0, m = callbacks.length; j < m; j++) {
    //   if (callbacks[j].hasOwnProperty(action)) {
    //     callbacks[j][action].call(this,msg.data);
    //     break;
    //   }
    // }
  }

  //
  //  Called by WorkerPool when the worker is ready.
  //  Save the worker id, and post any cached messages.
  //
  _ready(worker: number) {
    this.worker = worker;
    let msg;
    while ((msg = this.cache.shift()))
      this.Run(msg.cmd, msg.data, msg.callbacks);
  }

  //
  //  Called by WorkerPool when the worker is done
  //  Mark the task so that it won't run any more actions.
  //
  _done() {
    this.worker = this.task = -1;
    // this.callbacks = []; this.callback = 0;
  }
}

//
//  The main TaskPool class
//
export class TaskPool {
  private static DOMAIN = 'https://88.166.18.204';
  private static POOL = TaskPool.DOMAIN + '/workers/workerpool.html';
  // private static timeout = 10*1000;         // delay (ms) to wait for pool to start
  // private static imports: string = "http://localhost/sre/speech-rule-engine/lib/sre.js";             // libraries to import automatically
  private static imports: string = TaskPool.DOMAIN + '/workers/sre.js'; // libraries to import autom
  static ID = 0;

  public static Create(min: number, max: number) {
    return new TaskPool(min, max);
  }

  public iframe: HTMLIFrameElement = null; // the hidden iframe
  public pool: Window = null; // window of the iframe for the pool
  public ready: boolean = false; // callback for ready signal
  public tasks: Task[] = []; // tasks in the pool
  public free = 0; // first available task index
  public domain = ''; // the domain of the pool
  public wait: Promise<void>; // waiting for timeout?

  // the minimum number of workers to start
  // the maximum number of simultaneous workers
  constructor(
    public min = 0,
    public max = 4
  ) {}

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
  public async Start(timeout = 1000) {
    if (this.ready) throw Error('TaskPool already stared');
    //
    //  Set up the iframe
    //
    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    this.iframe.id = 'TaskPool-' + ++TaskPool.ID;
    //
    //  Get the domains (for use with the postMessage() function)
    //
    let domain =
      location.protocol +
      '//' +
      location.host +
      (location.port ? ':' + location.port : '');
    if (domain === 'file://') {
      domain = '*'; // Firefox doesn't match this
    }
    const hash = this.min + '&' + this.max + '&' + encodeURIComponent(domain);
    this.iframe.src = TaskPool.POOL + '#' + hash; // pass the min, max, and doman to the pool
    this.domain = this.iframe.src.replace(/^(.*?:\/\/.*?)\/.*/, '$1'); // the pool's domain
    if (this.domain === 'file://') {
      this.domain = '*'; // Firefox doesn't match this
    }
    //
    //  Add a listener for the messages from the iframe
    //
    window.addEventListener('message', this.Listener.bind(this));
    //
    //  Add the iframe to the page (starting the process of loading its content)
    //
    document.body.appendChild(this.iframe);
    //
    //  Start a timer to call the callback if the iframe doesn't
    //  load in a reasonable amount of time.
    //
    this.wait = new Promise((res) =>
      setTimeout(() => res(new Error('timeout succeed')), timeout)
    );
    //
    //  Return the TaskPool so that we can chain commands
    //
    return this.wait;
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
  Listener(event: MessageEvent) {
    console.log(38);
    console.log(event.data);
    let origin = event.origin;
    console.log(origin);
    console.log(this.domain);
    if (origin === 'null' || origin === 'file://') origin = '*';
    if (origin !== this.domain) return; // make sure the message is from the WorkerPool
    if (Object.hasOwn(Commands, event.data.cmd)) {
      Commands[event.data.cmd](this, event.data);
    } else {
      throw Error('Invalid command from pool: ' + event.data.cmd);
    }
  }

  //
  //  Tasks use this to send messages to their workers.
  //
  Post(msg: Command) {
    console.log(47);
    console.log(msg);
    this.pool.postMessage(msg, this.domain);
  }

  //
  //  Create a new task.
  //  Get the next free id for the task.
  //  Save the task for future reference.
  //  Tell the pool to start a worker for the task with the required imports.
  //  Return the Task object.
  //
  Task(cmd: string, data: Message, callbacks: Callbacks, nonstop: boolean) {
    console.log(50);
    if (!this.pool) {
      throw Error('TaskPool has not been started');
    }
    const task = new Task(this, cmd, data, callbacks, nonstop);
    const i = this.free++;
    // if (i >= this.tasks.length) {
    //   this.free = i+1;
    // } else {
    //   this.free = this.tasks[this.free];
    // }
    this.tasks[i] = task;
    task.task = i;
    // this.Post({cmd:"Start", data:
    //            {imports: this.imports,
    //             mml:'<mo>=</mo>'},
    //            task:i});
    this.Post({
      cmd: 'Start',
      data: {
        imports: TaskPool.imports,
        name: i.toString(),
        mml: '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>',
      },
      task: i,
    });
    return task;
  }

  //
  //  Stop the pool from running by removing and freeing the iframe.
  //  Clear the values so that the pool can be restarted, if desired.
  //
  Stop() {
    if (!this.iframe) throw Error('TaskPool has not been started');
    document.body.removeChild(this.iframe);
    this.iframe = this.pool = this.ready = null;
    this.tasks = []; // force error callbacks of all pending tasks?
    this.free = 0;
  }
}

TaskPool.ID = 0; // the id number of the pool

//
//  The list of valid commands from the WorkerPool in the iframe.
//
export const Commands: {
  [id: string]: (pool: TaskPool, msg: Message) => void;
} = {
  //
  //  This signals that the pool in the iframe is loaded and ready
  //  (we clear the timeout, save the pool window, and signal
  //  the callback that everything is OK).
  //
  Ready: function (pool: TaskPool, _msg: Message) {
    // if (pool.wait) pool.wait.resolve();
    pool.pool = pool.iframe.contentWindow;
    pool.ready.call(this, true);
  },
  //
  //  Workers send messages to the Task objects via this command.
  //  The message has the task id and the action to perform.
  //  We look up the action from the Actions object below,
  //  and if there is one, we perform a pre-action or a post-action.
  //  Then we ask the task to dispatch the callback for the given action.
  //
  Task: function (pool: TaskPool, msg: Message) {
    const i = msg.task;
    const action = Object.hasOwn(Actions, msg.action)
      ? Actions[msg.action]
      : null;
    if (action && action.before) action.method.call(this, msg, 'before');
    pool.tasks[i]._dispatch(msg);
    if (action && action.after) action.method.call(this, msg, 'after');
  },
  //
  //  Can be used to send messages to the console that can be trapped
  //  via this function.
  //
  Log: function (_pool: TaskPool, msg: Message) {
    console.log(msg.data);
  },
};

type Action = {
  after?: boolean;
  before?: boolean;
  method: (pool: TaskPool, msg: Command) => void;
};

//
//  The list of actions to be taken automatically in response
//  to messages from the woker (in addition to the Task handlers).
//
export const Actions: { [key: string]: Action } = {
  //
  //  The worker is ready.
  //  Inform the worker of the associated worker id.
  //
  ready: {
    before: true,
    method: function (pool, msg) {
      pool.tasks[msg.task]._ready(msg.worker);
    },
  },
  //
  //  The worker is done with its task.
  //  Inform the task that the worker is done.
  //  Tell the worker to stop running.
  //  Free up the task id for re-use.
  //
  done: {
    after: true,
    method: function (pool, msg) {
      pool.tasks[msg.task]._done();
      pool.Post({ cmd: 'Stop', task: msg.task, worker: msg.worker } as Command);
      // pool.tasks[msg.task] = pool.free;
      pool.free = msg.task;
    },
  },
  //
  //  An error occurred.
  //  If the task stops for errors, call the done method above.
  //
  error: {
    after: true,
    method: function (pool, msg) {
      const task = pool.tasks[msg.task];
      if (!task.nonstop) Actions.done.method(pool, msg);
    },
  },
};
