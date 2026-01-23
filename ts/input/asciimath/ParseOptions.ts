/*************************************************************
 *
 *  Copyright (c) 2025 The MathJax Consortium
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
 * @file Factory generating options for the AsciiMath parser.
 *
 * @author mathjax@mathjax.org (MathJax Consortium)
 */

import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { MmlFactory } from '../../core/MmlTree/MmlFactory.js';
import { MathItem } from '../../core/MathItem.js';
import { defaultOptions, OptionList } from '../../util/Options.js';

/**
 * @class ParseOptions for AsciiMath parser
 */
export default class ParseOptions {
  /**
   * A set of options, mapping names to string or boolean values.
   *
   * @type {OptionList}
   */
  public options: OptionList = {};

  /**
   * The MML factory for creating nodes
   *
   * @type {MmlFactory}
   */
  public mmlFactory: MmlFactory;

  /**
   * The root node of the parsed expression
   *
   * @type {MmlNode}
   */
  public root: MmlNode;

  /**
   * The current math item being processed
   *
   * @type {MathItem}
   */
  public mathItem: MathItem<any, any, any>;

  /**
   * Flag indicating if an error occurred during parsing
   *
   * @type {boolean}
   */
  public error: boolean = false;

  /**
   * @constructor
   * @param {MmlFactory} factory The MML factory to use
   * @param {OptionList[]} options Array of option lists to merge
   */
  constructor(factory: MmlFactory, options: OptionList[] = []) {
    this.mmlFactory = factory;
    for (const opts of options) {
      defaultOptions(this.options, opts);
    }
  }

  /**
   * Clear the parse state
   */
  public clear() {
    this.error = false;
    this.root = null;
    this.mathItem = null;
  }

  /**
   * Create an MML node
   *
   * @param {string} kind The kind of node to create
   * @param {any[]} children The children of the node
   * @returns {MmlNode} The created node
   */
  public create(kind: string, children?: any[]): MmlNode {
    return this.mmlFactory.create(kind, {}, children);
  }

  /**
   * Create a text node
   *
   * @param {string} text The text content
   * @returns {MmlNode} The text node
   */
  public createText(text: string): MmlNode {
    const textNode = this.mmlFactory.create('text');
    (textNode as any).text = text;
    return textNode;
  }

  /**
   * Create an error node
   *
   * @param {string} message The error message
   * @param {string} _id The error id
   * @param {string} _input The original input
   * @returns {MmlNode} The error node
   */
  public createError(message: string, _id: string, _input: string): MmlNode {
    const merror = this.create('merror');
    const mtext = this.create('mtext');
    mtext.appendChild(this.createText(message));
    merror.appendChild(mtext);
    return merror;
  }
}
