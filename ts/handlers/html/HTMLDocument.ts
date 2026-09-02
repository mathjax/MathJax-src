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
 * @file  Implements the HTMLDocument class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  AbstractMathDocument,
  RenderActions,
  DOCUMENT_OPTIONS,
} from '../../core/MathDocument.js';
import {
  userOptions,
  separateOptions,
  OptionList,
  expandable,
} from '../../util/Options.js';
import { HTMLMathItem } from './HTMLMathItem.js';
import { HTMLMathList } from './HTMLMathList.js';
import { HTMLDomStrings } from './HTMLDomStrings.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { InputJax } from '../../core/InputJax.js';
import { STATE, newState, ProtoItem, Location } from '../../core/MathItem.js';
import { StyleJson } from '../../util/StyleJson.js';
import {
  DOM as ANY_DOM,
  DOM_TYPES,
  N,
  NT,
  Constructor,
} from '../../types/Types.js';

/*****************************************************************/
/**
 * List of Lists of pairs consisting of a DOM node and its text length
 *
 * These represent the Text elements that make up a single
 * string in the list of strings to be searched for math
 * (multiple consecutive Text nodes can form a single string).
 *
 * @template DOM   The DOM node types
 */
export type HTMLNodeArray<DOM extends DOM_TYPES> = [NT<DOM>, number][][];

/**
 * Add STATE value for adding the stylesheets (after INSERTED)
 */
newState('STYLES', STATE.INSERTED + 1);

/*****************************************************************/

/**
 * The new HTMLDocument option types.
 */
export type OPTIONS<DOM extends DOM_TYPES> = {
  DomStrings: HTMLDomStrings<DOM>; // The DomStrings parser
};

/**
 * The HTMLDocument option types.
 */
export interface HTMLDOCUMENT_OPTIONS<DOM extends DOM_TYPES>
  extends OPTIONS<DOM>, DOCUMENT_OPTIONS<DOM> {
  MathItem: Constructor<HTMLMathItem<DOM>>;
}

/**
 * The HTMLDocument option defaults.
 */
const options: OPTIONS<ANY_DOM> = {
  DomStrings: null, // Use the default DomString parser
};

/*****************************************************************/
/**
 *  The HTMLDocument class (extends AbstractMathDocument)
 *
 * @template DOM   The DOM node types
 */
export class HTMLDocument<
  DOM extends DOM_TYPES,
> extends AbstractMathDocument<DOM> {
  /**
   * The kind of document
   */
  public static KIND: string = 'HTML';

  /**
   * The default options for HTMLDocument
   */
  public static OPTIONS = {
    ...AbstractMathDocument.OPTIONS,
    ...options,
    renderActions: expandable<RenderActions<ANY_DOM>>({
      ...AbstractMathDocument.OPTIONS.renderActions,
      styles: [STATE.STYLES, '', 'updateStyleSheet', false], // update styles on a rerender() call
    }),
    MathList: HTMLMathList, // Use the HTMLMathList for MathLists
    MathItem: HTMLMathItem, // Use the HTMLMathItem for MathItem
  };

  /**
   * @override
   */
  public options: HTMLDOCUMENT_OPTIONS<DOM> & { elements?: N<DOM>[] };

  /**
   * Extra styles to be included in the document's stylesheet (added by extensions)
   */
  protected styles: StyleJson[];

  /**
   * The DomString parser for locating the text in DOM trees
   */
  public domStrings: HTMLDomStrings<DOM>;

  /**
   * @override
   * @class
   * @augments {AbstractMathDocument}
   */
  constructor(document: any, adaptor: DOMAdaptor<DOM>, options: OptionList) {
    const [html, dom] = separateOptions(options, HTMLDomStrings.OPTIONS);
    super(document, adaptor, html);
    this.domStrings = this.options.DomStrings || new HTMLDomStrings<DOM>(dom);
    this.domStrings.adaptor = adaptor;
    this.styles = [];
  }

  /**
   * Creates a Location object for a delimiter at the position given by index in the N's string
   *  of the array of strings searched for math, recovering the original DOM node where the delimiter
   *  was found.
   *
   * @param {number} N             The index of the string in the string array
   * @param {number} index         The position within the N's string that needs to be found
   * @param {string} delim         The delimiter for this position
   * @param {HTMLNodeArray} nodes  The list of node lists representing the string array
   * @returns {Location}           The Location object for the position of the delimiter in the document
   */
  protected findPosition(
    N: number,
    index: number,
    delim: string,
    nodes: HTMLNodeArray<DOM>
  ): Location<DOM> {
    const adaptor = this.adaptor;
    const inc = 1 / (nodes[N].length || 1);
    let i = N;
    for (const [node, n] of nodes[N]) {
      if (index <= n && adaptor.kind(node) === '#text') {
        return { i, node, n: Math.max(index, 0), delim };
      }
      index -= n;
      i += inc;
    }
    return { node: null, n: 0, delim };
  }

  /**
   * Convert a ProtoItem to a MathItem (i.e., determine the actual Location
   *  objects for its start and end)
   *
   * @param {ProtoItem} item       The proto math item to turn into an actual MathItem
   * @param {InputJax} jax         The input jax to use for the MathItem
   * @param {HTMLNodeArray} nodes  The array of node lists that produced the string array
   * @returns {HTMLMathItem}       The MathItem for the given proto item
   */
  protected mathItem(
    item: ProtoItem<DOM>,
    jax: InputJax<DOM>,
    nodes: HTMLNodeArray<DOM>
  ): HTMLMathItem<DOM> {
    const math = item.math;
    const start = this.findPosition(item.n, item.start.n, item.open, nodes);
    const end = this.findPosition(item.n, item.end.n, item.close, nodes);
    return new this.options.MathItem(
      math,
      jax,
      item.display,
      start,
      end
    ) as HTMLMathItem<DOM>;
  }

  /**
   * Find math within the document:
   *  Get the list of containers (default is document.body), and for each:
   *    For each input jax:
   *      Make a new MathList to store the located math
   *      If the input jax processes strings:
   *        If we haven't already made the string array and corresponding node list, do so
   *        Ask the jax to find the math in the string array, and
   *          for each one, push it onto the math list
   *      Otherwise (the jax processes DOM nodes):
   *        Ask the jax to find the math in the container, and
   *          for each one, make the result into a MathItem, and push it on the list
   *      Merge the new math list into the document's math list
   *        (we use merge to maintain a sorted list of MathItems)
   *
   * @override
   */
  public findMath(options: OptionList) {
    if (!this.processed.isSet('findMath')) {
      this.adaptor.document = this.document;
      options = userOptions(
        {
          elements: this.options.elements || [this.adaptor.body(this.document)],
        },
        options
      );
      const containers = this.adaptor.getElements(
        options.elements,
        this.document
      );
      for (const jax of this.inputJax) {
        const list = jax.processStrings
          ? this.findMathFromStrings(jax, containers)
          : this.findMathFromDOM(jax, containers);
        this.math.merge(list);
      }
      this.processed.set('findMath');
    }
    return this;
  }

  /**
   * Get the MathItems from the containers by searching DOM strings
   *
   * @param {InputJax} jax     The jax being used
   * @param {N[]} containers   The containers to be searched in order
   * @returns {HTMLMathList}   The list of MathItems found
   */
  protected findMathFromStrings(
    jax: InputJax<DOM>,
    containers: N<DOM>[]
  ): HTMLMathList<DOM> {
    const strings = [] as string[];
    const nodes = [] as HTMLNodeArray<DOM>;
    for (const container of containers) {
      const [slist, nlist] = this.domStrings.find(container);
      strings.push(...slist);
      nodes.push(...nlist);
    }
    const list = new this.options.MathList() as HTMLMathList<DOM>;
    for (const math of jax.findMath(strings)) {
      list.push(this.mathItem(math, jax, nodes));
    }
    return list;
  }

  /**
   * Get the MathItems from the containers by searching DOM elements themselves
   *
   * @param {InputJax} jax     The jax being used
   * @param {N[]} containers   The containers to be searched in order
   * @returns {HTMLMathList}   The list of MathItems found
   */
  protected findMathFromDOM(
    jax: InputJax<DOM>,
    containers: N<DOM>[]
  ): HTMLMathList<DOM> {
    const items = [] as HTMLMathItem<DOM>[];
    for (const container of containers) {
      for (const math of jax.findMath(container)) {
        items.push(
          new this.options.MathItem(
            math.math,
            jax,
            math.display,
            math.start,
            math.end
          )
        );
      }
    }
    return new this.options.MathList(...items) as HTMLMathList<DOM>;
  }

  /**
   * @override
   */
  public updateDocument() {
    if (!this.processed.isSet('updateDocument')) {
      this.addPageElements();
      this.addStyleSheet();
      super.updateDocument();
      this.processed.set('updateDocument');
    }
    return this;
  }

  /**
   *  Add any elements needed for the document
   */
  protected addPageElements() {
    const adaptor = this.adaptor;
    const body = adaptor.body(this.document);
    const node = this.documentPageElements();
    if (node) {
      const child = adaptor.firstChild(body);
      if (child) {
        adaptor.insert(node, child);
      } else {
        adaptor.append(body, node);
      }
    }
  }

  /**
   * Add the stylesheet to the document
   */
  public addStyleSheet() {
    const sheet = this.documentStyleSheet();
    const adaptor = this.adaptor;
    if (sheet && !adaptor.parent(sheet)) {
      const head = adaptor.head(this.document);
      const styles = this.findSheet(head, adaptor.getAttribute(sheet, 'id'));
      if (styles) {
        adaptor.replace(sheet, styles);
      } else {
        adaptor.append(head, sheet);
      }
    }
  }

  /**
   * @param {N} head     The document <head>
   * @param {string} id  The id of the stylesheet to find
   * @returns {N|null}   The stylesheet with the given ID
   */
  protected findSheet(head: N<DOM>, id: string): N<DOM> {
    if (id) {
      for (const sheet of this.adaptor.tags(head, 'style')) {
        if (this.adaptor.getAttribute(sheet, 'id') === id) {
          return sheet;
        }
      }
    }
    return null as N<DOM>;
  }

  /**
   * @override
   */
  public removeFromDocument(restore: boolean = false) {
    if (this.processed.isSet('updateDocument')) {
      for (const math of this.math) {
        if (math.state() >= STATE.INSERTED) {
          math.state(STATE.TYPESET, restore);
        }
      }
    }
    this.processed.clear('updateDocument');
    return this;
  }

  /**
   * @override
   */
  public documentStyleSheet() {
    return this.outputJax.styleSheet(this);
  }

  /**
   * @override
   */
  public documentPageElements() {
    return this.outputJax.pageElements(this);
  }

  /**
   * Add styles to be included in the document's stylesheet
   *
   * @param {StyleJson} styles   The styles to include
   */
  public addStyles(styles: StyleJson) {
    this.styles.push(styles);
    if ('insertStyles' in this.outputJax) {
      (this.outputJax as any).insertStyles(styles);
    }
  }

  /**
   * @returns {StyleJson[]}   The array of document-specific styles
   */
  public getStyles(): StyleJson[] {
    return this.styles;
  }
}
