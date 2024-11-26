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
export type Callbacks = { [name: string]: (data: {}) => void };
export type Message = { post: string; action: string; data: {}; task?: number };
export type Command = { cmd: string; data: {}; task?: number; worker?: number };

// These need to become options.
const DOMAIN = 'https://88.166.18.204';
// const DOMAIN = 'https://88.174.118.32';
// const DOMAIN = 'https://localhost';
const BASEDIR = 'workers';
const POOL = 'workerpool2.html';
const WORKER = 'worker2.js'; // the URL for the webworkers
const SRE = 'sre.js'; // SRE library to import

//
//  The main WorkerHandler class
//
export class WorkerHandler {
  private static TIMEOUT = 200; // delay (ms) to wait for pool to start
  private static REPEAT = 20; // repeat wait

  static ID = 0;

  public iframe: HTMLIFrameElement = null; // the hidden iframe
  public pool: Window = null; // window of the iframe for the pool
  public ready: boolean = false; // callback for ready signal
  public domain = ''; // the domain of the pool
  public url = '';
  public wait: Promise<void>; // waiting for timeout?

  // the minimum number of workers to start
  // the maximum number of simultaneous workers
  constructor() {
    this.url = DOMAIN + '/' + BASEDIR + '/';
  }

  //
  //  Set up the iframe
  //
  // TODO: make this a getter/setter
  private createIframe() {
    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    this.iframe.id = 'WorkerHandler-' + ++WorkerHandler.ID;
  }

  private computeSrc(domain: string, parameters: string[]) {
    const hash = encodeURIComponent(domain);
    parameters.unshift(hash);
    return this.url + POOL + '#' + parameters.join('&');
  }

  private rewriteFirefox(domain: string) {
    // Firefox doesn't match this
    return domain === 'file://' ? '*' : domain;
  }

  //
  //  Get the domains (for use with the postMessage() function)
  //
  private computeDomain() {
    let domain =
      location.protocol +
      '//' +
      location.host +
      (location.port ? ':' + location.port : '');
    domain = this.rewriteFirefox(domain);
    this.iframe.src = this.computeSrc(domain, [WORKER]);
    this.domain = this.iframe.src.replace(/^(.*?:\/\/.*?)\/.*/, '$1'); // the pool's domain
    this.domain = this.rewriteFirefox(this.domain);
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
  public async Start() {
    if (this.ready) throw Error('WorkerHandler already started');
    this.createIframe();
    this.computeDomain();
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
    this.wait = this.Wait();
    return this.wait;
  }

  private async Wait() {
    return new Promise<void>((res, rej) => {
      let n = 0;
      /* eslint-disable-next-line @typescript-eslint/no-this-alias */
      const POOL = this;
      /**
       *
       */
      function checkReady() {
        if (POOL.ready) {
          res();
        } else {
          if (n >= WorkerHandler.REPEAT) {
            rej('Something went wrong loading web worker.');
          } else {
            n++;
            setTimeout(checkReady, WorkerHandler.TIMEOUT);
          }
        }
      }
      checkReady();
    }).catch((err) => console.log(err));
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
  public Listener(event: MessageEvent) {
    console.log('Iframe  >>>  Client:', event.data);
    let origin = event.origin;
    if (origin === 'null' || origin === 'file://') origin = '*';
    if (origin !== this.domain) return; // make sure the message is from the WorkerPool
    if (Object.hasOwn(Commands, event.data.cmd)) {
      Commands[event.data.cmd](this, event.data);
    } else {
      console.error('Invalid command from pool: ' + event.data.cmd);
    }
  }

  //
  //  Tasks use this to send messages to their workers.
  //
  public Post(msg: Command) {
    this.wait.then(() => this.pool.postMessage(msg, this.domain));
  }

  public Import(library: string = this.url + SRE) {
    this.Post({
      cmd: 'Worker',
      data: { cmd: 'import', data: { imports: library } },
    });
  }

  public Speech(math: string) {
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'speech',
        data: { mml: math },
      },
    });
  }

  //
  //  Stop the pool from running by removing and freeing the iframe.
  //  Clear the values so that the pool can be restarted, if desired.
  //
  public Stop() {
    if (!this.iframe) throw Error('WorkerHandler has not been started');
    document.body.removeChild(this.iframe);
    this.iframe = this.pool = null;
    this.ready = false;
  }
}

WorkerHandler.ID = 0; // the id number of the pool

//
//  The list of valid commands from the WorkerPool in the iframe.
//

export const Commands: {
  [id: string]: (pool: WorkerHandler, msg: Message) => void;
} = {
  //
  //  This signals that the pool in the iframe is loaded and ready
  //  (we clear the timeout, save the pool window, and signal
  //  the callback that everything is OK).
  //
  Ready: function (pool: WorkerHandler, _msg: Message) {
    pool.pool = pool.iframe.contentWindow;
    pool.ready = true;
  },
  // Setup: function (_pool: WorkerHandler, _msg: Message) {
  //   console.log(7);
  // },
  //
  //  Workers send messages to the Task objects via this command.
  //  The message has the task id and the action to perform.
  //  We look up the action from the Actions object below,
  //  and if there is one, we perform a pre-action or a post-action.
  //  Then we ask the task to dispatch the callback for the given action.
  //
  Task: function (pool: WorkerHandler, msg: Message) {
    console.log(1);
    console.log('Running a task!');
    console.log(pool);
    console.log(msg);
    // const i = msg.task;
    // const action = Object.hasOwn(Actions, msg.action)
    //   ? Actions[msg.action]
    //   : null;
    // if (action && action.before) action.method.call(this, msg, 'before');
    // // pool.tasks[i]._dispatch(msg);
    // if (action && action.after) action.method.call(this, msg, 'after');
  },
  //
  //  Can be used to send messages to the console that can be trapped
  //  via this function.
  //
  Log: function (_pool: WorkerHandler, msg: Message) {
    console.log(msg.data);
  },
};
