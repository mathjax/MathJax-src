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
 * @file  Implements a lightweight HTML Element replacement
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { OptionList } from '../../util/Options.js';
import { Styles } from '../../util/Styles.js';
import { LiteText } from './Text.js';
import { LiteDocument } from './Document.js';
import { LiteWindow } from './Window.js';

import { asyncLoad } from '../../util/AsyncLoad.js';
import { mathjax } from '../../mathjax.js';

declare const MathJax: any;

/**
 * A minimal webworker interface
 */
interface WebWorker {
  on(kind: string, listener: (event: Event) => void): void;
  postMessage(msg: any): void;
  terminate(): void;
}

/**
 * Type for attribute lists
 */
export type LiteAttributeList = OptionList;

/**
 * Type for generic nodes in LiteAdaptor
 */
export type LiteNode = LiteElement | LiteText;

/************************************************************/
/**
 * Implements a lightweight HTML element replacement
 */
export class LiteElement {
  /**
   * The type of element (tag name)
   */
  public kind: string;

  /**
   * The element's attribute list
   */
  public attributes: LiteAttributeList;

  /**
   * The element's children
   */
  public children: LiteNode[];

  /**
   * The element's parent
   */
  public parent: LiteElement;

  /**
   * The styles for the element
   */
  public styles: Styles;

  /**
   * @param {string} kind  The type of node to create
   * @param {LiteAttributeList} attributes  The list of attributes to set (if any)
   * @param {LiteNode[]} children  The children for the node (if any)
   * @class
   */
  constructor(
    kind: string,
    attributes: LiteAttributeList = {},
    children: LiteNode[] = []
  ) {
    this.kind = kind;
    this.attributes = { ...attributes };
    this.children = [...children];
    for (const child of this.children) {
      child.parent = this;
    }
    this.styles = null;
  }
}

/**
 * An implemenation of an iframe that has enough to handle message passing
 * as used in the web-worker code for SRE
 */
export class LiteIFrame extends LiteElement {
  /**
   * The src field for the iframe
   */
  public src: string = '';

  /**
   * The window for the iframe
   */
  public contentWindow: LiteWindow;

  /**
   * Options passed by the web-worker code
   */
  public options: OptionList = {};

  /**
   * @class
   * @param {string} kind                    The kind (should be 'iframe')
   * @param {LiteAttributeList} attributes   The list of attributes to set
   * @param {LiteNode[]} children            The childnodes (should be empty)
   */
  constructor(
    kind: string,
    attributes: LiteAttributeList = {},
    children: LiteNode[] = []
  ) {
    super(kind, attributes, children);
    this.contentWindow = new LiteWindow();
  }

  /**
   * Implements loading the worker script (only called when the id is a worker-handler id)
   *
   * @param {LiteDocument} parent   The document where the iframe lives
   */
  public async loadWorker(parent: LiteDocument) {
    //
    // Subclass the Worker from node:worder_threads to include
    //  addEventListener and postMessage methods
    //
    const { Worker } = await asyncLoad('node:worker_threads');
    class LiteWorker {
      protected worker: WebWorker;
      constructor(url: string, options: OptionList = {}) {
        this.worker = new Worker(url, options);
      }
      addEventListener(kind: string, listener: (event: any) => void) {
        this.worker.on(kind, listener);
      }
      postMessage(msg: any) {
        this.worker.postMessage({ data: msg, origin: '*' });
      }
      terminate() {
        this.worker.terminate();
      }
    }
    //
    // Set the context for the fake iframe code
    //
    const hash = [
      '*',
      `${this.options.path}/${this.options.worker}`,
      this.options.debug,
    ];
    const pool = `${this.options.path}/speech-workerpool.js`;
    if (typeof MathJax !== 'undefined' && MathJax.loader) {
      MathJax.loader.versions.set(pool, mathjax.version);
    }
    const { WorkerPool, setContext } = await asyncLoad(pool);
    setContext({
      Worker: LiteWorker,
      window: this.contentWindow,
      parent: parent,
      hash: hash.map((part) => encodeURIComponent(part)).join('&'),
    });
    //
    // Make the WorkerPool and start it
    //
    WorkerPool.Create().Start();
  }
}
