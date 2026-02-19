/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the AsciiMath InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractInputJax } from '../core/InputJax.js';
import { userOptions, separateOptions, OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MmlFactory } from '../core/MmlTree/MmlFactory.js';
import { Property } from '../core/Tree/Node.js';

import { FindAsciiMath } from './asciimath/FindAsciiMath.js';
import AsciiMathError from './asciimath/AsciiMathError.js';
import ParseOptions from './asciimath/ParseOptions.js';
import { AsciiMathParser } from '#asciimathml/AsciiMathParser.js';
import { INodeAdapter, IParseOptions } from '#asciimathml/NodeAdapter.js';

export class MmlNodeAdapter implements INodeAdapter {
  constructor(private node: MmlNode) {}
  
  get kind() { return this.node.kind; }
  get text() { return (this.node as any).text; }
  get childNodes() { 
    return this.node.childNodes.map(n => new MmlNodeAdapter(n)); 
  }
  
  setAttribute(name: string, value: string): void {
    this.node.attributes.set(name, value);
  }
  
  getAttribute(name: string): Property {
    return this.node.attributes.get(name);
  }

  appendChild(child: INodeAdapter): void {
    if ((child as MmlNodeAdapter).node.parent !== null) {
      const childNode = (child as MmlNodeAdapter).node.parent.removeChild((child as MmlNodeAdapter).node);
      this.node.appendChild(childNode);
    } else {
      this.node.appendChild((child as MmlNodeAdapter).node);
    }
  }
  
  replaceChild(newChild: INodeAdapter, oldChild: INodeAdapter): void {
    this.node.replaceChild(
      (newChild as MmlNodeAdapter).node, 
      (oldChild as MmlNodeAdapter).node
    );
  }

  removeFirstChild(): void {
    this.node.removeChild(this.node.childNodes[0]);
  }

  removeLastChild(): void {
    this.node.removeChild(this.node.childNodes[this.node.childNodes.length - 1]);
  }
  
  // Expose underlying node when needed
  get underlyingNode() { return this.node; }
}


/*****************************************************************/
/**
 *  Implements the AsciiMath class (extends AbstractInputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class AsciiMath<N, T, D> extends AbstractInputJax<N, T, D> {
  /**
   * Name of input jax.
   *
   * @type {string}
   */
  public static NAME: string = 'AsciiMath';

  /**
   * Default options for the jax.
   *
   * @type {OptionList}
   */
  public static OPTIONS: OptionList = {
    ...AbstractInputJax.OPTIONS,
    FindAsciiMath: null,
    // Decimal sign character
    decimalsign: '.',
    // Display style (for limits)
    displaystyle: true,
    // Additional symbols to add
    additionalSymbols: [],
    formatError: (jax: AsciiMath<any, any, any>, err: AsciiMathError) =>
      jax.formatError(err),
  };

  /**
   * The FindAsciiMath instance used for locating AsciiMath in strings
   */
  protected findAsciiMath: FindAsciiMath<N, T, D>;

  /**
   * The AsciiMath code that is parsed.
   *
   * @type {string}
   */
  protected asciimath: string;

  /**
   * The Math node that results from parsing.
   *
   * @type {MmlNode}
   */
  protected mathNode: MmlNode;

  private _parseOptions: ParseOptions;

  /**
   * @override
   */
  constructor(options: OptionList = {}) {
    const [rest, am, find] = separateOptions(
      options,
      AsciiMath.OPTIONS,
      FindAsciiMath.OPTIONS
    );
    super(am);
    this.findAsciiMath =
      this.options['FindAsciiMath'] || new FindAsciiMath(find);
    this._parseOptions = new ParseOptions(this.mmlFactory, [this.options]);
    userOptions(this._parseOptions.options, rest);
  }

  /**
   * @override
   */
  public setMmlFactory(mmlFactory: MmlFactory) {
    super.setMmlFactory(mmlFactory);
    this._parseOptions.mmlFactory = mmlFactory;
  }

  /**
   * @returns {ParseOptions} The parse options that configure this JaX instance.
   */
  public get parseOptions(): ParseOptions {
    return this._parseOptions;
  }

  /**
   * @override
   */
  public compile(
    math: MathItem<N, T, D>,
    document: MathDocument<N, T, D>
  ): MmlNode {
    this.parseOptions.clear();
    this.parseOptions.mathItem = math;
    this.executeFilters(this.preFilters, math, document, this.parseOptions);
    this.asciimath = math.math;
    let node: MmlNode;

    const mmlConfig: IParseOptions<MmlNodeAdapter> = {
      create: (tag, children) => {
        const node = this.mmlFactory.create(tag);
        children?.forEach(c => node.appendChild(c.underlyingNode));
        return new MmlNodeAdapter(node);
      },
      createText: (text) => {
        const textNode = this.mmlFactory.create('text');
        (textNode as any).text = text;
        return new MmlNodeAdapter(textNode);
      },
      options: { 
        decimalsign: this.parseOptions.options.decimalsign, 
        displaystyle: this.parseOptions.options.displaystyle,
        additionalSymbols: this.parseOptions.options?.additionalSymbols || []
      }
    };

    try {
      const parser = new AsciiMathParser(mmlConfig);
      const result = parser.mml(this.asciimath);
      node = (result as MmlNodeAdapter).underlyingNode;
    } catch (err) {
      if (!(err instanceof AsciiMathError)) {
        throw err;
      }
      this.parseOptions.error = true;
      node = this.options.formatError(this, err);
    }

    node = this.parseOptions.create('math', [node]);
    node.attributes.set('data-asciimath', this.asciimath);
    node.setInheritedAttributes({}, false, 0, false);

    if (math.display) {
      node.attributes.set('display', 'block')
    }
    
    this.parseOptions.root = node;
    this.executeFilters(this.postFilters, math, document, this.parseOptions);
    this.mathNode = this.parseOptions.root;
    return this.mathNode;
  }

  /**
   * @override
   */
  public findMath(strings: string[]) {
    return this.findAsciiMath.findMath(strings);
  }

  /**
   * Default formatter for error messages:
   * wrap an error into a node for output.
   *
   * @param {AsciiMathError} err The AsciiMathError.
   * @returns {MmlNode} The merror node.
   */
  public formatError(err: AsciiMathError): MmlNode {
    const message = err.message.replace(/\n.*/, '');
    return this.parseOptions.createError(message, err.id, this.asciimath);
  }
}
