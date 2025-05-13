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
import {
  Message,
  PoolCommand,
  Structure,
  StructureData,
} from './MessageTypes.js';
import { SpeechMathItem } from '../speech.js';
import { hasWindow } from '../../util/context.js';
import { SemAttr } from './SpeechUtil.js';

/**
 * Class for relevant task information.
 */
class Task<N, T, D> {
  constructor(
    public cmd: PoolCommand,
    public item: SpeechMathItem<N, T, D>,
    public resolve: (value: any) => void,
    public reject: (cmd: string) => void
  ) {}
}

/**
 * The main WorkerHandler class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class WorkerHandler<N, T, D> {
  private static ID = 0;

  /**
   * The hidden iframe
   */
  public iframe: N = null;

  /**
   * Document of the iframe for the pool
   */
  public pool: D = null;

  /**
   * Callback for ready signal
   */
  public ready: boolean = false;

  /**
   * The domain for the worker functions
   */
  public domain = '';

  /**
   * The task queue
   */
  private tasks: Task<N, T, D>[] = [];

  /**
   * The adaptor to work with typeset nodes.
   *
   * @param {DOMAdaptor} adaptor The adaptor to use for DOM access.
   * @param {OptionList} options The worker options.
   */
  constructor(
    public adaptor: DOMAdaptor<N, T, D>,
    private options: OptionList
  ) {}

  /**
   * Set up the basic iframe
   */
  private createIframe() {
    const src = this.computeSrc(
      this.rewriteFirefox(this.adaptor.domain()),
      this.options.worker,
      this.options.debug.toString()
    );
    this.iframe = this.adaptor.node('iframe', {
      style: { display: 'none' },
      id: 'WorkerHandler-' + ++WorkerHandler.ID,
      properties: { src },
    });
    if (!hasWindow) {
      //
      // Make the worker options available to the iframe in node applications
      //
      this.adaptor.setProperty(this.iframe, 'options', this.options);
    }
  }

  /**
   * Computes the URL passed to the worker pool.
   *
   * @param {string[]} parameters Additional parameters to encode.
   * @returns {string} The source URL with all the parameters.
   */
  private computeSrc(...parameters: string[]): string {
    const hash = parameters.map((part) => encodeURIComponent(part)).join('&');
    return this.options.path + '/' + this.options.pool + '#' + hash;
  }

  /**
   * Firefox is tricky if we run from File protocol.
   *
   * @param {string} domain The domain to rewrite.
   * @returns {string} The source URL rewritten for Firefox.
   */
  private rewriteFirefox(domain: string): string {
    return domain.substring(0, 7) === 'file://' ? '*' : domain;
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
  public Start() {
    if (this.ready) throw Error('WorkerHandler already started');
    this.createIframe();
    this.adaptor.listener(this.Listener.bind(this)); //    // listen for messages from iframe
    this.adaptor.append(this.adaptor.body(), this.iframe); // add iframe to page (start loading its contents)
    this.domain = this.rewriteFirefox(this.adaptor.domain(this.iframe));
  }

  /**
   * Debug output when debug flag is set.
   *
   * @param {string} msg Base message
   * @param {...any} rest Remaining arguments
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
   * @param {SpeechMathItem} item Optional SpeechMathItem that is being processed
   *     command name as input.
   * @returns {Promise<any>} A promise that resolves when the command completes
   */
  public Post(msg: PoolCommand, item?: SpeechMathItem<N, T, D>): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.tasks.push(new Task(msg, item, resolve, reject));
    });
    if (this.ready && this.tasks.length === 1) {
      this.postNext();
    }
    return promise;
  }

  /**
   * Post the next available task, if there is one.
   */
  private postNext() {
    if (this.tasks.length) {
      this.adaptor.post(this.tasks[0].cmd, this.domain, this.pool);
    }
  }

  /**
   * Remove a task from the task list.
   *
   * @param {SpeechMathItem} item   The item whose task is to be canceled.
   */
  public Cancel(item: SpeechMathItem<N, T, D>) {
    const i = this.tasks.findIndex((task) => task.item === item);
    if (i > 0) {
      this.tasks[i].reject(`Task ${this.tasks[i].cmd.cmd} cancelled`);
      this.tasks.splice(i, 1);
    }
  }

  /**
   * Setup the engine in the SRE worker.
   *
   * @param {OptionList} options The options list.
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public Setup(options: OptionList): Promise<void> {
    return this.Post({
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
   * Compute speech structure for the math.
   *
   * @param {string} math The mml string.
   * @param {OptionList} options The options list.
   * @param {SpeechMathItem} item The mathitem for reattaching the speech.
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public async Speech(
    math: string,
    options: OptionList,
    item: SpeechMathItem<N, T, D>
  ): Promise<void> {
    this.Attach(
      item,
      options.enableSpeech,
      options.enableBraille,
      await this.Post(
        {
          cmd: 'Worker',
          data: {
            cmd: 'speech',
            debug: this.options.debug,
            data: { mml: math, options: options },
          },
        },
        item
      )
    );
  }

  /**
   * Computes the next rule set for this particular SRE setting. We assume that
   * the engine has been set to the options of the current expression.
   *
   * @param {string} math The mml string.
   * @param {OptionList} options The options list.
   * @param {SpeechMathItem} item The mathitem for reattaching the speech.
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public async nextRules(
    math: string,
    options: OptionList,
    item: SpeechMathItem<N, T, D>
  ): Promise<void> {
    this.Attach(
      item,
      options.enableSpeech,
      options.enableBraille,
      await this.Post(
        {
          cmd: 'Worker',
          data: {
            cmd: 'nextRules',
            debug: this.options.debug,
            data: { mml: math, options: options },
          },
        },
        item
      )
    );
  }

  /**
   * Computes the next style for the particular SRE settings and the currently
   * focused node. We pass the options of the current expression.
   *
   * Note, that we compute not only the next style but also the next speech
   * structure in the method, as smart computation is done wrt. the semantic
   * node, and we do not want to reconstruct the semantic XML tree on the SRE
   * side twice. Hence we pass the math expression, plus the semantic ID of the
   * currently focused node.
   *
   * @param {string} math The linearized mml expression.
   * @param {OptionList} options The options list.
   * @param {string} nodeId The semantic Id of the currenctly focused node.
   * @param {SpeechMathItem} item The mathitem for reattaching the speech.
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public async nextStyle(
    math: string,
    options: OptionList,
    nodeId: string,
    item: SpeechMathItem<N, T, D>
  ): Promise<void> {
    this.Attach(
      item,
      options.enableSpeech,
      options.enableBraille,
      await this.Post(
        {
          cmd: 'Worker',
          data: {
            cmd: 'nextStyle',
            debug: this.options.debug,
            data: {
              mml: math,
              options: options,
              nodeId: nodeId,
            },
          },
        },
        item
      )
    );
  }

  /**
   * Attach the speech structure to an item's DOM
   *
   * @param {SpeechMathItem} item       The SpeechMathItem to attach to
   * @param {boolean} speech            True when speech should be added
   * @param {boolean} braille           True when Braille should be added
   * @param {StructureData} structure   The speech structure to attach
   */
  public Attach(
    item: SpeechMathItem<N, T, D>,
    speech: boolean,
    braille: boolean,
    structure: StructureData
  ) {
    const data = (
      typeof structure === 'string' ? JSON.parse(structure) : structure
    ) as Structure;
    const container = item.typesetRoot;
    if (!container) return; // Element is gone, maybe retypeset or removed.
    this.setSpecialAttributes(container, data.options, 'data-semantic-', [
      'locale',
      'domain',
      'style',
    ]);
    const adaptor = this.adaptor;
    this.setSpecialAttributes(container, data.translations, 'data-semantic-');
    // Sort out Mactions
    for (const [id, sid] of Object.entries(data.mactions)) {
      let node = adaptor.getElement('#' + id, container);
      if (!node || !adaptor.childNodes(node)[0]) {
        continue;
      }
      node = adaptor.childNodes(node)[0] as N;
      adaptor.setAttribute(node, 'data-semantic-type', 'dummy');
      this.setSpecialAttributes(node, sid, '');
      adaptor.setAttribute(node, 'data-speech-node', 'true');
    }
    this.setSpeechAttributes(
      adaptor.childNodes(container)[0],
      '',
      data,
      speech,
      braille
    );
    if (speech) {
      if (data.label) {
        adaptor.setAttribute(container, SemAttr.SPEECH, data.label);
        item.outputData.speech = data.label;
      }
      adaptor.setAttribute(container, 'data-speech-attached', 'true');
    }
    if (braille) {
      if (data.braillelabel) {
        adaptor.setAttribute(container, SemAttr.BRAILLE, data.braillelabel);
        item.outputData.braille = data.braillelabel;
      }
      if (data.braille) {
        adaptor.setAttribute(container, 'data-braille-attached', 'true');
      }
    }
  }

  /**
   * Add the speech attributes to a node
   *
   * @param {N} node           The node to add speech to
   * @param {Structure} data   The speech data to use
   * @param {boolean} speech   True when speech should be added
   * @param {boolean} braille  True when Braille should be added
   */
  protected setSpeechAttribute(
    node: N,
    data: Structure,
    speech: boolean,
    braille: boolean
  ) {
    const adaptor = this.adaptor;
    const id = adaptor.getAttribute(node, 'data-semantic-id');
    if (speech) {
      for (let [key, value] of Object.entries(data.speech[id])) {
        key = key.replace(/-ssml$/, '');
        if (value) {
          adaptor.setAttribute(node, `data-semantic-${key}`, value as string);
        }
      }
    }
    if (braille && data.braille?.[id]) {
      const value = data.braille[id]['braille-none'] || '';
      adaptor.setAttribute(node, SemAttr.BRAILLE, value);
    }
  }

  /**
   * Add the speech attributes to a node's DOM tree
   *
   * @param {N|T} root         The node to add speech to
   * @param {string} rootId    The root nodes's ID
   * @param {Structure} data   The speech data to use
   * @param {boolean} speech   True when speech should be added
   * @param {boolean} braille  True when Braille should be added
   * @returns {string}         The updated root ID
   */
  protected setSpeechAttributes(
    root: N | T,
    rootId: string,
    data: Structure,
    speech: boolean,
    braille: boolean
  ): string {
    const adaptor = this.adaptor;
    if (
      !root ||
      adaptor.kind(root) === '#text' ||
      adaptor.kind(root) === '#comment'
    ) {
      return rootId;
    }
    root = root as N;
    if (adaptor.hasAttribute(root, 'data-semantic-id')) {
      this.setSpeechAttribute(root, data, speech, braille);
      if (!rootId && !adaptor.hasAttribute(root, 'data-semantic-parent')) {
        rootId = adaptor.getAttribute(root, 'data-semantic-id');
      }
    }
    for (const child of Array.from(adaptor.childNodes(root))) {
      rootId = this.setSpeechAttributes(child, rootId, data, speech, braille);
    }
    return rootId;
  }

  /**
   * Adds a set of attributes to the given node.
   *
   * @param {N} node The node on which to set attributes.
   * @param {OptionList} map The attribute to value map.
   * @param {string} prefix A possible prefix for the attribute name.
   * @param {string[]} keys An optional list to select only those attributes.
   */
  protected setSpecialAttributes(
    node: N,
    map: OptionList,
    prefix: string,
    keys?: string[]
  ) {
    if (!map) return;
    keys = keys || Object.keys(map);
    for (const key of keys) {
      const value = map[key];
      if (value) {
        this.adaptor.setAttribute(node, `${prefix}${key.toLowerCase()}`, value);
      }
    }
  }

  /**
   * Remove speech attributes from a MathItem
   *
   * @param {SpeechMathItem} item   The MathItem whose speech attributes should be removed.
   */
  public Detach(item: SpeechMathItem<N, T, D>) {
    const container = item.typesetRoot;
    this.adaptor.removeAttribute(container, 'data-speech-attached');
    this.adaptor.removeAttribute(container, 'data-braille-attached');
    this.detachSpeech(container);
  }

  /**
   * Recursively remove speech attributes from a DOM tree
   *
   * @param {N} node  The root node of the tree to modify
   */
  public detachSpeech(node: N) {
    const adaptor = this.adaptor;
    const children = adaptor.childNodes(node);
    if (!children) return;
    if (adaptor.kind(node) !== '#text') {
      for (const key of [
        'none',
        'summary-none',
        'speech',
        'speech-none',
        'summary',
        'braille',
      ]) {
        adaptor.removeAttribute(node, `data-semantic-${key}`);
      }
    }
    for (const child of children) {
      this.detachSpeech(child as N);
    }
  }

  /**
   * Terminates the worker.
   *
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public Terminate(): Promise<void> {
    this.debug('Terminating pending tasks');
    for (const task of this.tasks) {
      task.reject(
        `${task.cmd.data.cmd} cancelled by WorkerHandler termination`
      );
    }
    this.tasks = [];
    this.debug('Terminating WorkerPool');
    return this.Post({ cmd: 'Terminate', data: {} });
  }

  /**
   * Stop the pool from running by removing and freeing the iframe.
   * Clear the values so that the pool can be restarted, if desired.
   */
  public async Stop() {
    if (!this.iframe) {
      throw Error('WorkerHandler has not been started');
    }
    await this.Terminate();
    this.adaptor.remove(this.iframe);
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
     * @param {WorkerHandler} pool The active handler for the worker.
     * @param {Message} _data The data received from the worker. Ignored.
     */
    Ready(pool: WorkerHandler<N, T, D>, _data: Message) {
      pool.pool = pool.adaptor.getProperty(
        pool.iframe,
        'contentWindow'
      ).document;
      pool.ready = true;
      pool.postNext();
    },

    /**
     * Signals that the worker has finished its last task.
     *
     * @param {WorkerHandler} pool The active handler for the worker.
     * @param {Message} data The data received from the worker. Ignored.
     */
    Finished(pool: WorkerHandler<N, T, D>, data: Message) {
      const task = pool.tasks.shift();
      if (data.success) {
        task.resolve(data.result);
      } else {
        task.reject(data.error);
      }
      pool.postNext();
    },
  };
}
