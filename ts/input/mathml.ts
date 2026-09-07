/*************************************************************
 *
 *  Copyright (c) 2017-2026 The MathJax Consortium
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
 * @file  Implements the MathML InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { AbstractInputJax, INPUTJAX_OPTIONS } from '../core/InputJax.js';
import { separateOptions, OptionList } from '../util/Options.js';
import { FunctionList } from '../util/FunctionList.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { DOMAdaptor } from '../core/DOMAdaptor.js';
import { MmlFactory } from '../core/MmlTree/MmlFactory.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { DOM, DOM_TYPES, N, T, D } from '../types/Types.js';
import {
  FilterFunctions,
  FilterFunctionList,
} from '../core/FilterFunctions.js';

import { FindMathML } from './mathml/FindMathML.js';
import { MathMLCompile } from './mathml/MathMLCompile.js';
import { localize } from './mathml/__locales__/Component.js';

/*****************************************************************/

/**
 * The MathML option types.
 */
export interface MATHML_OPTIONS<DOM extends DOM_TYPES> extends INPUTJAX_OPTIONS<
  DOM,
  string,
  MmlNode
> {
  parseAs: 'html' | 'xml';
  forceReparse: boolean;
  mmlFilters: FilterFunctionList<N<DOM> | T<DOM>, DOM>;
  FindMathML: FindMathML<N<DOM>, T<DOM>, D<DOM>>;
  MathMLCompile: MathMLCompile<N<DOM>, T<DOM>, D<DOM>>;
  parseError: (node: Node) => void;
}

/**
 * The MathML option defaults.
 */
const options: MATHML_OPTIONS<DOM> = {
  ...AbstractInputJax.OPTIONS,
  parseAs: 'html', //         Whether to use HTML or XML parsing for the MathML string
  forceReparse: false, //     Whether to force the string to be reparsed, or use the one from the document DOM
  mmlFilters: [], //          Filters to add to the mmlFilters lost
  FindMathML: null, //        The FindMathML instance to override the default one
  MathMLCompile: null, //     The MathMLCompile instance to override the default one
  parseError(node: Node) {
    this.error(this.adaptor.textContent(node).replace(/\n.*/g, ''));
  },
};

/*****************************************************************/
/**
 *  Implements the MathML class (extends AbstractInputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class MathML<N, T, D> extends AbstractInputJax<
  N,
  T,
  D,
  string,
  MmlNode
> {
  /**
   * The name of this input jax
   */
  public static NAME: string = 'MathML';

  /**
   * @override
   */
  public static OPTIONS = options;

  /**
   * The FindMathML instance used to locate MathML in the document
   */
  protected findMathML: FindMathML<N, T, D>;

  /**
   * The MathMLCompile instance used to convert the MathML tree to internal format
   */
  protected mathml: MathMLCompile<N, T, D>;

  /**
   * A list of functions to call on the parsed MathML DOM before conversion to internal structure
   */
  public mmlFilters: FilterFunctions<N | T, DOM<N, T, D>>;

  /**
   * @override
   */
  public options: MATHML_OPTIONS<DOM<N, T, D>>;

  /**
   * @override
   */
  constructor(options: OptionList = {}) {
    const [mml, find, compile] = separateOptions(
      options,
      FindMathML.OPTIONS,
      MathMLCompile.OPTIONS
    );
    super(mml);
    this.findMathML = this.options.FindMathML || new FindMathML<N, T, D>(find);
    this.mathml =
      this.options.MathMLCompile || new MathMLCompile<N, T, D>(compile);
    this.mmlFilters = new FunctionList(this.options.mmlFilters);
  }

  /**
   * Set the adaptor in any of the objects that need it
   *
   * @override
   */
  public setAdaptor(adaptor: DOMAdaptor<N, T, D>) {
    super.setAdaptor(adaptor);
    this.findMathML.adaptor = adaptor;
    this.mathml.adaptor = adaptor;
  }

  /**
   * @param {MmlFactory} mmlFactory  The MmlFactory to use for this MathML input jax
   */
  public setMmlFactory(mmlFactory: MmlFactory) {
    super.setMmlFactory(mmlFactory);
    this.mathml.setMmlFactory(mmlFactory);
  }

  /**
   * Set the filter functions for the Safe extension in the MathCompile class.
   *
   * @param {(string, string) => string} filterAttribute     The function to filter attributes
   * @param {(list: string[]) => string[]} filterClassList   The function to filter classes
   */
  public setFilters(
    filterAttribute: (name: string, value: string) => string,
    filterClassList: (list: string[]) => string[],
  ) : void {
    this.mathml.setFilters(filterAttribute, filterClassList);
  }

  /**
   * Don't process strings (process nodes)
   *
   * @override
   */
  public get processStrings() {
    return false;
  }

  /**
   * Convert a MathItem to internal format:
   *   If there is no existing MathML node, or we are asked to reparse everything
   *     Execute the preFilters on the math
   *     Parse the MathML string in the desired format, and check the result for errors
   *     If we got an HTML document:
   *       Check that it has only one child (the <math> element), and use it
   *     Otherwise
   *       Use the root element from the XML document
   *     If the node is not a <math> node, report the error.
   *   Execute the mmlFilters on the parsed MathML
   *   Compile the MathML to internal format, and execute the postFilters
   *   Return the resulting internal format
   *
   * @override
   */
  public compile(math: MathItem<N, T, D>, document: MathDocument<N, T, D>) {
    let mml = math.start.node;
    if (
      !mml ||
      !math.end.node ||
      this.options.forceReparse ||
      this.adaptor.kind(mml) === '#text'
    ) {
      let mathml = this.executeFilters(
        this.preFilters,
        math,
        document,
        (math.math || '<math></math>').trim()
      );
      if (this.options.parseAs === 'html') {
        mathml = `<html><head></head><body>${mathml}</body></html>`;
      }
      const doc = this.checkForErrors(
        this.adaptor.parse(mathml, 'text/' + this.options.parseAs)
      );
      const body = this.adaptor.body(doc);
      if (this.adaptor.childNodes(body).length !== 1) {
        this.error(localize('SingleNode'));
      }
      mml = this.adaptor.remove(this.adaptor.firstChild(body)) as N;
      if (this.adaptor.kind(mml).replace(/^[a-z]+:/, '') !== 'math') {
        this.error(
          localize('MathNode', '<math>', `<${this.adaptor.kind(mml)}>`)
        );
      }
    }
    mml = this.executeFilters<N | T>(this.mmlFilters, math, document, mml);
    let root = this.mathml.compile(mml as N);
    root = this.executeFilters(this.postFilters, math, document, root);
    math.display = root.attributes.get('display') === 'block';
    return root;
  }

  /**
   * Check a parsed MathML string for errors.
   *
   * @param {D} doc  The document returns from the DOMParser
   * @returns {D}    The document
   */
  protected checkForErrors(doc: D): D {
    const err = this.adaptor.tags(this.adaptor.body(doc), 'parsererror')[0];
    if (err) {
      if (this.adaptor.textContent(err) === '') {
        this.error(localize('MmlError'));
      }
      this.options.parseError.call(this, err);
    }
    return doc;
  }

  /**
   * Throw an error
   *
   * @param {string} message  The error message to produce
   */
  protected error(message: string) {
    throw new Error(message);
  }

  /**
   * @override
   */
  public findMath(node: N) {
    return this.findMathML.findMath(node);
  }
}
