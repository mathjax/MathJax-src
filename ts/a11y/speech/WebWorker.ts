/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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

import { DOMAdaptor, minWorker } from '../../core/DOMAdaptor.js';
import { OptionList } from '../../util/Options.js';
import { Message, ClientCommand, Structure } from './MessageTypes.js';
import { SpeechMathItem } from '../speech.js';
import { SemAttr } from './SpeechUtil.js';

/**
 * Class for relevant task information.
 */
class Task<N, T, D> {
  constructor(
    public cmd: ClientCommand,
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
  /**
   * Callback for ready signal
   */
  public ready: boolean = false;

  /**
   * The task queue
   */
  private tasks: Task<N, T, D>[] = [];

  /**
   * The webworker
   */
  protected worker: minWorker;

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
   * This starts the worker.
   */
  public async Start() {
    if (this.ready) throw Error('Worker already started');
    this.worker = await this.adaptor.createWorker(
      this.Listener.bind(this),
      this.options
    );
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
   * Listener for the messages from the worker.
   * The message will contain a command and data, and we look
   * in the list of commands to see if we have an implementation for the
   * given one.  If so, we run the command on the data from the message,
   * otherwise we throw an error.
   *
   * @param {MessageEvent} event The message event.
   */
  public Listener(event: MessageEvent) {
    this.debug('Worker  >>>  Client:', event.data);
    if (Object.hasOwn(this.Commands, event.data.cmd)) {
      this.Commands[event.data.cmd](this, event.data.data);
    } else {
      this.debug('Invalid command from worker: ' + event.data.cmd);
    }
  }

  /**
   * Send messages to the worker.
   *
   * @param {ClientCommand} msg The command message.
   * @param {SpeechMathItem} item Optional SpeechMathItem that is being processed
   *     command name as input.
   * @returns {Promise<any>} A promise that resolves when the command completes
   */
  public Post(
    msg: ClientCommand,
    item?: SpeechMathItem<N, T, D>
  ): Promise<any> {
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
      const msg = Object.assign({}, this.tasks[0].cmd, {
        debug: this.options.debug,
      });
      this.worker.postMessage(msg);
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
      cmd: 'setup',
      data: {
        domain: options.domain,
        style: options.style,
        locale: options.locale,
        modality: options.modality,
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
          cmd: 'speech',
          data: { mml: math, options: options },
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
          cmd: 'nextRules',
          data: { mml: math, options: options },
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
          cmd: 'nextStyle',
          data: {
            mml: math,
            options: options,
            nodeId: nodeId,
          },
        },
        item
      )
    );
  }

  /**
   * Return speech structure for an arbitrary MathML string
   *
   * @param {string} math The linearized mml expression.
   * @param {OptionList} options The options list.
   * @param {SpeechMathItem} item The mathitem for reattaching the speech.
   * @returns {Promise<Structure>} A promise that resolves when the command completes
   */
  public async speechFor(
    math: string,
    options: OptionList,
    item: SpeechMathItem<N, T, D>
  ): Promise<Structure> {
    const data = await this.Post(
      {
        cmd: 'speech',
        data: { mml: math, options: options },
      },
      item
    );
    return JSON.parse(data);
  }

  /**
   * Attach the speech structure to an item's DOM
   *
   * @param {SpeechMathItem} item       The SpeechMathItem to attach to
   * @param {boolean} speech            True when speech should be added
   * @param {boolean} braille           True when Braille should be added
   * @param {string} structure          The speech JSON structure to attach
   */
  public Attach(
    item: SpeechMathItem<N, T, D>,
    speech: boolean,
    braille: boolean,
    structure: string
  ) {
    const data = JSON.parse(structure) as Structure;
    const container = item.typesetRoot;
    if (!container) return; // Element is gone, maybe retypeset or removed.
    this.setSpecialAttributes(container, data.options, 'data-semantic-', [
      'locale',
      'domain',
      'style',
      'domain2style',
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
      if (adaptor.kind(node) === 'rect') {
        node = adaptor.next(node) as N;
      }
      adaptor.setAttribute(node, 'data-semantic-type', 'dummy');
      this.setSpecialAttributes(node, sid, '');
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
        adaptor.setAttribute(container, SemAttr.SPEECH_SSML, data.ssml);
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
    adaptor.removeAttribute(node, 'data-speech-node');
    if (speech && data.speech[id]['speech-none']) {
      adaptor.setAttribute(node, 'data-speech-node', 'true');
      for (let [key, value] of Object.entries(data.speech[id])) {
        key = key.replace(/-ssml$/, '');
        if (value) {
          adaptor.setAttribute(node, `data-semantic-${key}`, value as string);
        }
      }
    }
    if (braille && data.braille?.[id]?.['braille-none']) {
      adaptor.setAttribute(node, 'data-speech-node', 'true');
      const value = data.braille[id]['braille-none'];
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
   * @returns {Promise<any>}  The promise for the worker termination.
   */
  public Terminate(): Promise<any> | void {
    this.debug('Terminating pending tasks');
    for (const task of this.tasks) {
      task.reject(
        `${task.cmd.data.cmd} cancelled by WorkerHandler termination`
      );
    }
    this.tasks = [];
    this.debug('Terminating worker');
    return this.worker.terminate();
  }

  /**
   * Stop the worker and clear the values so that the worker can be
   * restarted, if desired.
   */
  public async Stop() {
    if (!this.worker) {
      throw Error('Worker has not been started');
    }
    await this.Terminate();
    this.worker = null;
    this.ready = false;
  }

  /**
   * Worker call to compute clearspeak preferences for the current locale.
   *
   * @param {OptionList} options The options list.
   * @param {Map<string, { [prop: string]: string[] }>} prefs Map to store the compute preferences.
   * @returns {Promise<void>} The promise that resolves when the command is complete
   */
  public async clearspeakLocalePreferences(
    options: OptionList,
    prefs: Map<string, { [prop: string]: string[] }>
  ): Promise<void> {
    await this.Post({
      cmd: 'localePreferences',
      data: {
        options: options,
      },
    }).then((data) => {
      prefs.set(options.locale, JSON.parse(data));
    });
  }

  /**
   * Computes the clearspeak preference category that are semantically relevant
   * for the currently focused node.
   *
   * @param {string} math The linearized mml expression.
   * @param {string} nodeId The semantic id of node to compute the preference for.
   * @param {Map<number, string>} prefs Map for recording the computed preference.
   * @param {number} counter Counter for storing the result in the map.
   * @returns {Promise<void>} The promise that resolves when the command is complete
   */
  public async clearspeakRelevantPreferences(
    math: string,
    nodeId: string,
    prefs: Map<number, string>,
    counter: number
  ): Promise<void> {
    await this.Post({
      cmd: 'relevantPreferences',
      data: {
        mml: math,
        id: nodeId,
      },
    }).then((e) => {
      prefs.set(counter, e);
    });
  }

  /**
   * The list of valid commands from the Worker.
   */
  public Commands: {
    [id: string]: (handler: WorkerHandler<N, T, D>, data: Message) => void;
  } = {
    /**
     * This signals that the worker in the iframe is loaded and ready
     *
     * @param {WorkerHandler} handler The active handler for the worker.
     * @param {Message} _data The data received from the worker. Ignored.
     */
    Ready(handler: WorkerHandler<N, T, D>, _data: Message) {
      handler.ready = true;
      handler.postNext();
    },

    /**
     * Signals that the worker has finished its last task.
     *
     * @param {WorkerHandler} handler The active handler for the worker.
     * @param {Message} data The data received from the worker.
     */
    Finished(handler: WorkerHandler<N, T, D>, data: Message) {
      const task = handler.tasks.shift();
      if (data.success) {
        task.resolve(data.result);
      } else {
        task.reject(data.error);
      }
      handler.postNext();
    },

    /**
     * Logs a message from the worker
     *
     * @param {WorkerHandler} handler The active handler for the worker.
     * @param {Message} data The data received from the worker.
     */
    Log(handler: WorkerHandler<N, T, D>, data: Message) {
      if (handler.options.debug) {
        console.log('Log:', data);
      }
    },
  };
}
