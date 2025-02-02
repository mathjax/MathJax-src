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

import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { OptionList } from '../../util/Options.js';

/* eslint @typescript-eslint/no-empty-object-type: 0 */
export type Callbacks = { [name: string]: (data: {}) => void };
export type Message = { [key: string]: any };
export type WorkerCommand = {
  cmd: string;
  debug: boolean;
  data: Message;
};
export type PoolCommand = {
  cmd: string;
  data: WorkerCommand | Message;
};

// These need to become options.
// const DOMAIN = 'https://88.166.18.204';
// const DOMAIN = 'https://88.174.118.32';
// window.Resolves = [];

/**
 * The main WorkerHandler class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class WorkerHandler<N, T, D> {
  // private static TIMEOUT = 200; // delay (ms) to wait for pool to start
  // private static REPEAT = 20; // repeat wait

  private static ID = 0;
  private _count = 0;

  public get counter() {
    return this._count++;
  }

  public iframe: HTMLIFrameElement = null; // the hidden iframe
  public pool: Window = null; // window of the iframe for the pool
  public ready: boolean = false; // callback for ready signal
  public domain = ''; // the domain of the pool
  public url = '';
  // public wait: Promise<void>; // waiting for timeout?

  // Promise handling
  public promise = Promise.resolve();
  public resolve = () => {};
  public reject = () => {};

  private async getPromise() {
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
    return this.promise.then(() => this.postNext());
  }

  private tasks: PoolCommand[] = [];

  private enqueueTask(task: PoolCommand) {
    console.log('Enqueuing task: ' + task.data.cmd);
    this.tasks.unshift(task);
  }

  private dequeueTask(): PoolCommand {
    const task = this.tasks.pop();
    console.log('Dequeuing task: ' + task.data.cmd);
    return task;
    // return this.tasks.pop();
  }

  /**
   * The adaptor to work with typeset nodes.
   *
   * @param {DOMAdaptor} adaptor The adaptor to use for DOM access.
   * @param options
   */
  constructor(
    public adaptor: DOMAdaptor<N, T, D>,
    private options: OptionList
  ) {
    this.url = this.options.path + '/' + this.options.basedir + '/';
  }

  /**
   * Set up the basic iframe
   */
  private createIframe() {
    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    this.iframe.id = 'WorkerHandler-' + ++WorkerHandler.ID;
  }

  /**
   * Computes the URL passed to the worker pool.
   *
   * @param {string} domain The source domain.
   * @param {string[]} parameters Additional parameters to encode.
   */
  private computeSrc(domain: string, parameters: string[]) {
    const hash = encodeURIComponent(domain);
    parameters.unshift(hash);
    return this.url + this.options.pool + '#' + parameters.join('&');
  }

  /**
   * Firefox is tricky if we run from File protocol.
   *
   * @param {string} domain The domain to rewrite.
   */
  private rewriteFirefox(domain: string) {
    // Firefox doesn't match this
    return domain === 'file://' ? '*' : domain;
  }

  /**
   * Get the domains (for use with the postMessage() function)
   */
  private computeDomain() {
    let domain =
      location.protocol +
      '//' +
      location.host +
      (location.port ? ':' + location.port : '');
    domain = this.rewriteFirefox(domain);
    this.iframe.src = this.computeSrc(domain, [
      this.options.worker,
      this.options.debug.toString(),
    ]);
    this.domain = this.iframe.src.replace(/^(.*?:\/\/.*?)\/.*/, '$1'); // the pool's domain
    this.domain = this.rewriteFirefox(this.domain);
  }

  /**
   * This starts the worker pool so that you can create the SRE worker.
   * This works by creating an iframe that loads a file from the backend where
   * the webworkers are launched. Since the webworkers are created from the
   * iframe, they can use resources from the backend (and only from the
   * backend!), even though the page with the WorkerPool is from a different
   * origin.
   *
   * Since the iframe comes (or may come) from a different origin, we use
   * the iframe window's postMessage() command and our own onmessage handler
   * to communicate with the iframe.
   */
  public async Start() {
    if (this.ready) throw Error('WorkerHandler already started');
    this.createIframe();
    this.computeDomain();
    //  Add a listener for the messages from the iframe
    window.addEventListener('message', this.Listener.bind(this));
    //  Add the iframe to the page (starting the process of loading its content)
    document.body.appendChild(this.iframe);
    return this.getPromise();
  }

  /**
   * A timer to wait for the iframe to initialize.
   *
   * @returns {Promise<void>} A promise that fulfills when the worker pool is
   *     established.
   */
  // private async Wait(): Promise<void> {
  //   return new Promise<void>((res, rej) => {
  //     let n = 0;
  //     const checkReady = () => {
  //       if (this.ready) {
  //         res();
  //       } else {
  //         if (n >= WorkerHandler.REPEAT) {
  //           rej('Something went wrong loading web worker.');
  //         } else {
  //           n++;
  //           setTimeout(checkReady, WorkerHandler.TIMEOUT);
  //         }
  //       }
  //     };
  //     checkReady();
  //   }).catch((err) => console.log(err));
  // }

  /**
   * Debug output when debug flag is set.
   *
   * @param {string} msg Base message
   * @param {any[]} ...rest Remaining arguments
   * @param {...any} rest
   */
  private debug(msg: string, ...rest: any[]) {
    if (this.options.debug) {
      console.info(msg, ...rest);
    }
  }

  /**
   * Listener for the messages from the iframe.
   * We check that the origin of the message is correct (since
   * any window could send messages to us).
   * The message will contain a command and data, and we look
   * in the list of commands to see if we have an implementation for the
   * given one.  If so, we run the command on the data from the message,
   * otherwise we throw an error.
   *
   * @param {MessageEvent} event The message event.
   */
  public Listener(event: MessageEvent) {
    this.debug('Iframe  >>>  Client:', event.data);
    let origin = event.origin;
    if (origin === 'null' || origin === 'file://') origin = '*';
    if (origin !== this.domain) return; // make sure the message is from the WorkerPool
    if (Object.hasOwn(this.Commands, event.data.cmd)) {
      this.Commands[event.data.cmd](this, event.data.data);
    } else {
      this.debug('Invalid command from pool: ' + event.data.cmd);
    }
  }

  /**
   * Send messages to the worker.
   *
   * @param {PoolCommand} msg The command message.
   */
  public Post(msg: PoolCommand) {
    this.enqueueTask(msg);
    if (this.ready && this.tasks.length === 1) {
      this.postNext();
    }
  }

  private postNext() {
    if (this.tasks.length) {
      this.getPromise();
      this.pool.postMessage(this.dequeueTask(), this.domain);
    }
  }

  // Short cuts for posts.
  /**
   * Import a given library into the worker.
   *
   * @param {string} library The library to import. Defaults to SRE.
   */
  public Import(library: string = this.url + this.options.sre) {
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'feature',
        debug: this.options.debug,
        data: { json: this.url + 'mathmaps/' },
      },
    });
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'import',
        debug: this.options.debug,
        data: { imports: library },
      },
    });
  }

  /**
   * Compute speech strcuture for the math.
   *
   * @param {string} math The mml string.
   * @param {string} id The math item id.
   */
  public Speech(math: string, id: string) {
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'speech',
        debug: this.options.debug,
        data: { mml: math, id: id },
      },
    });
  }

  /**
   * Setup the engine in the SRE worker.
   *
   * @param {OptionList} options The options list.
   */
  public Setup(options: OptionList) {
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'setup',
        debug: this.options.debug,
        data: {
          domain: options.domain,
          style: options.style,
          locale: options.locale,
          modality: options.modality,
        },
      },
    });
  }

  /**
   * Computes the next rule set for this particular SRE setting. We assume that
   * the engine has been set to the options of the current expression.
   *
   * @param {OptionList} options The options list.
   */
  public nextRules(options: OptionList) {
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'nextRules',
        debug: this.options.debug,
        data: {
          domain: options.domain,
          style: options.style,
          locale: options.locale,
          modality: options.modality,
        },
      },
    });
  }

  /**
   * Computes the next style for the particular SRE settings and the currently
   * focused node. We assume that the engine has been set to the options of the
   * current expression.
   *
   * Note, that we compute not only the next style but also the next speech
   * structure in the method, as smart computation is done wrt. the semantic
   * node, and we do not want to reconstruct the semantic XML tree on the SRE
   * side twice. Hence we pass the math expression, plus the semantic ID of the
   * currently focused node, plus the worker ID.
   *
   * @param {string} math The linearized mml expression.
   * @param {string} nodeId The semantic Id of the currenctly focused node.
   * @param {string} workerId The id for reattaching the speech.
   */
  public nextStyle(math: string, nodeId: string, workerId: string) {
    this.Post({
      cmd: 'Worker',
      data: {
        cmd: 'nextStyle',
        debug: this.options.debug,
        data: { mml: math, nodeId: nodeId, workerId: workerId },
      },
    });
  }

  /**
   * Terminates the worker.
   */
  public Terminate() {
    this.Post({ cmd: 'Terminate', data: {} });
  }

  /**
   * Stop the pool from running by removing and freeing the iframe.
   * Clear the values so that the pool can be restarted, if desired.
   */
  public Stop() {
    if (!this.iframe) {
      throw Error('WorkerHandler has not been started');
    }
    this.Terminate();
    document.body.removeChild(this.iframe);
    this.iframe = this.pool = null;
    this.ready = false;
  }

  /**
   * The list of valid commands from the WorkerPool in the iframe.
   */
  public Commands: {
    [id: string]: (pool: WorkerHandler<N, T, D>, data: Message) => void;
  } = {
    /**
     * This signals that the worker in the iframe is loaded and ready
     *
     * @param pool
     * @param _data
     */
    Ready: function (pool: WorkerHandler<N, T, D>, _data: Message) {
      pool.pool = pool.iframe.contentWindow;
      pool.ready = true;
      pool.resolve();
    },
    Finished: function (pool: WorkerHandler<N, T, D>, _data: Message) {
      pool.resolve();
    },
    /**
     * Attaches speech returned from the worker to the DOM element with the
     * corresponding data-worker id.
     *
     * @param pool
     * @param data
     */
    Attach: function (pool: WorkerHandler<N, T, D>, data: Message) {
      const container = document.querySelector(
        `[data-worker="${data?.id}"]`
      ) as N;
      if (!container) return; // The element is gone, must have been retypeset.
      // Attach options
      const options = data.options;
      if (options) {
        pool.adaptor.setAttribute(
          container,
          'data-semantic-locale',
          options.locale ?? ''
        );
        pool.adaptor.setAttribute(
          container,
          'data-semantic-domain',
          options.domain ?? ''
        );
        pool.adaptor.setAttribute(
          container,
          'data-semantic-style',
          options.style ?? ''
        );
      }
      // Container needs to get the aria label.
      let rootId: string = null;
      const setAttribute = function (node: N) {
        const id = pool.adaptor.getAttribute(node, 'data-semantic-id');
        const speech = data?.speech[id] || {};
        for (let [key, value] of Object.entries(speech)) {
          key = key.replace(/-ssml$/, '');
          if (value) {
            pool.adaptor.setAttribute(
              node,
              `data-semantic-${key}`,
              value as string
            );
          }
        }
      };
      const setAttributes = function (root: N | T) {
        if (
          !root ||
          pool.adaptor.kind(root) === '#text' ||
          pool.adaptor.kind(root) === '#comment'
        )
          return;
        root = root as N;
        if (pool.adaptor.hasAttribute(root, 'data-semantic-id')) {
          setAttribute(root);
          if (
            !rootId &&
            !pool.adaptor.hasAttribute(root, 'data-semantic-parent')
          ) {
            rootId = pool.adaptor.getAttribute(root, 'data-semantic-id');
          }
        }
        Array.from(pool.adaptor.childNodes(root)).forEach(setAttributes);
      };
      setAttributes(pool.adaptor.childNodes(container)[0]);
      pool.adaptor.setAttribute(container, 'data-speech-attached', 'true');
    },
    /**
     * Logs a message from the pool or worker.
     *
     * @param pool
     * @param data
     */
    Log: function (pool: WorkerHandler<N, T, D>, data: Message) {
      pool.debug(data.msg);
    },
  };
}
