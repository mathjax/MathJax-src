/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
 * @file  The DOMAdaptor interface and abstract class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { OptionList } from '../util/Options.js';
import { DOM_TYPES, N, T, D } from '../types/Types.js';

type NT<DOM extends DOM_TYPES> = N<DOM> | T<DOM>;

/**
 * The data for an attribute
 */
export type AttributeData = {
  name: string;
  value: string;
};

/**
 * The data for an elements page-based bounding box
 */
export type PageBBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/**
 * Specifier for a (set of) containers
 */
export type ContainerSpec<DOM extends DOM_TYPES> = string | N<DOM> | N<DOM>[];

/**
 * A minimal webworker interface
 */
export interface minWorker {
  addEventListener(kind: string, listener: (event: Event) => void): void;
  postMessage(msg: any): void;
  terminate(): Promise<any> | void;
}

/*****************************************************************/
/**
 *  The interface for the DOMAdaptor
 *
 * @template DOM   The DOM node types
 */
export interface DOMAdaptor<DOM extends DOM_TYPES> {
  /**
   * Document in which the nodes are to be created
   */
  document: D<DOM>;

  /**
   * True when the adaptor can measure DOM node sizes
   */
  canMeasureNodes: boolean;

  /**
   * @param {string} text    The serialized document to be parsed
   * @param {string} format  The format (e.g., 'text/html' or 'text/xhtml')
   * @returns {D<DOM>}       The parsed document
   */
  parse(text: string, format?: string): D<DOM>;

  /**
   * @param {string} kind      The tag name of the HTML node to be created
   * @param {OptionList} def   The properties to set for the created node
   * @param {(N|T)[]} children The child nodes for the created HTML node
   * @param {string} ns        The namespace in which to create the node
   * @returns {N}              The generated HTML tree
   */
  node(
    kind: string,
    def?: OptionList,
    children?: NT<DOM>[],
    ns?: string
  ): N<DOM>;

  /**
   * @param {string} text   The text from which to create an HTML text node
   * @returns {T}           The generated text node with the given text
   */
  text(text: string): T<DOM>;

  /**
   * @param {D} doc   The document whose head is to be obtained
   * @returns {N}     The document.head element
   */
  head(doc?: D<DOM>): N<DOM>;

  /**
   * @param {D} doc   The document whose body is to be obtained
   * @returns {N}     The document.body element
   */
  body(doc?: D<DOM>): N<DOM>;

  /**
   * @param {D} doc   The document whose documentElement is to be obtained
   * @returns {N}     The documentElement
   */
  root(doc?: D<DOM>): N<DOM>;

  /**
   * @param {D} doc      The document whose doctype is to be obtained
   * @returns {string}   The DOCTYPE comment
   */
  doctype(doc?: D<DOM>): string;

  /**
   * @param {N} node        The node to search for tags
   * @param {string} name   The name of the tag to search for
   * @param {string} ns     The namespace to search in (or null for no namespace)
   * @returns {N[]}         The list of tags found
   */
  tags(node: N<DOM>, name: string, ns?: string): N<DOM>[];

  /**
   * Get a list of containers (to be searched for math).  These can be
   *  specified by CSS selector, or as actual DOM elements or arrays of such.
   *
   * @param {ContainerSpec[]} nodes   The array of items to make into a container list
   * @param {D} document              The document in which to search
   * @returns {N[]}                   The array of containers to search
   */
  getElements(nodes: ContainerSpec<DOM>[], document: D<DOM>): N<DOM>[];

  /**
   * Get an element specified by CSS selector.
   *
   * @param {string} selector   The selector to locate
   * @param {D | N} node        The document or element in which to search
   * @returns {N | null}        The first matching element
   */
  getElement(selector: string, node?: D<DOM> | N<DOM>): N<DOM> | null;

  /**
   * Determine if a container node contains a given node somewhere in its DOM tree
   *
   * @param {N} container   The container to search
   * @param {N|T} node      The node to look for
   * @returns {boolean}     True if the node is in the container's DOM tree
   */
  contains(container: N<DOM>, node: NT<DOM>): boolean;

  /**
   * @param {N|T} node   The HTML node whose parent is to be obtained
   * @returns {N}        The parent node of the given one
   */
  parent(node: NT<DOM>): N<DOM>;

  /**
   * @param {N} node      The HTML node to be appended to
   * @param {N|T} child   The node or text to be appended
   * @returns {N|T}       The appended node
   */
  append(node: N<DOM>, child: NT<DOM>): NT<DOM>;

  /**
   * @param {N|T} nchild  The node or text to be inserted
   * @param {N|T} ochild  The node or text where the new child is to be added before it
   */
  insert(nchild: NT<DOM>, ochild: NT<DOM>): void;

  /**
   * @param {N|T} child   The node or text to be removed from its parent
   * @returns {N|T}       The removed node
   */
  remove(child: NT<DOM>): NT<DOM>;

  /**
   * @param {N|T} nnode   The node to replace with
   * @param {N|T} onode   The child to be replaced
   * @returns {N|T}       The removed node
   */
  replace(nnode: NT<DOM>, onode: NT<DOM>): NT<DOM>;

  /**
   * @param {N} node         The HTML node to be cloned
   * @param {boolean} deep   True if children should be cloned
   * @returns {N}            The copied node
   */
  clone(node: N<DOM>, deep?: boolean): N<DOM>;

  /**
   * @param {T} node    The HTML text node to be split
   * @param {number} n  The index of the character where the split will occur
   */
  split(node: T<DOM>, n: number): T<DOM>;

  /**
   * @param {N|T} node   The HTML node whose sibling is to be obtained
   * @returns {N|T}      The node following the given one (or null)
   */
  next(node: NT<DOM>): NT<DOM>;

  /**
   * @param {N|T} node   The HTML node whose sibling is to be obtained
   * @returns {N|T}      The node preceding the given one (or null)
   */
  previous(node: NT<DOM>): NT<DOM>;

  /**
   * @param {N} node   The HTML node whose child is to be obtained
   * @returns {N|T}    The first child of the given node (or null)
   */
  firstChild(node: N<DOM>): NT<DOM>;

  /**
   * @param {N} node   The HTML node whose child is to be obtained
   * @returns {N}      The last child of the given node (or null)
   */
  lastChild(node: N<DOM>): NT<DOM>;

  /**
   * @param {N} node      The HTML node whose children are to be obtained
   * @returns {(N|T)[]}   Array of children for the given node (not a live list)
   */
  childNodes(node: N<DOM>): NT<DOM>[];

  /**
   * @param {N} node     The HTML node whose child is to be obtained
   * @param {number} i   The index of the child to return
   * @returns {N|T}      The i-th child node of the given node (or null)
   */
  childNode(node: N<DOM>, i: number): NT<DOM>;

  /**
   * @param {N|T} node   The HTML node whose tag or node name is to be obtained
   * @returns {string}   The tag or node name of the given node
   */
  kind(node: NT<DOM>): string;

  /**
   * @param {N|T} node   The HTML node whose value is to be obtained
   * @returns {string}   The value of the given node
   */
  value(node: NT<DOM>): string;

  /**
   * @param {N} node     The HTML node whose text content is to be obtained
   * @returns {string}   The text content of the given node
   */
  textContent(node: N<DOM>): string;

  /**
   * @param {N} node    The HTML node whose inner HTML string is to be obtained
   * @returns {string}  The serialized content of the node
   */
  innerHTML(node: N<DOM>): string;

  /**
   * @param {N} node    The HTML node whose outer HTML string is to be obtained
   * @returns {string}  The serialized node and its content
   */
  outerHTML(node: N<DOM>): string;

  /**
   * @param {N} node    The HTML node whose serialized string is to be obtained
   * @returns {string}  The serialized node and its content
   */
  serializeXML(node: N<DOM>): string;

  /**
   * @param {N} node        The HTML node whose property is to be set
   * @param {string} name   The property to set
   * @param {any} value     The property's new value
   */
  setProperty(node: N<DOM>, name: string, value: any): void;

  /**
   * @param {N} node        The HTML node whose property is to be retrieved
   * @param {string} name   The property to get
   * @returns {any}         The property's value
   */
  getProperty(node: N<DOM>, name: string): any;

  /**
   * @param {N} node               The HTML node whose attribute is to be set
   * @param {string|number} name   The name of the attribute to set
   * @param {string} value         The new value of the attribute
   * @param {string=} ns           The namespace to use for the attribute
   */
  setAttribute(
    node: N<DOM>,
    name: string,
    value: string | number,
    ns?: string
  ): void;

  /**
   * @param {N} node           The HTML element whose attributes are to be set
   * @param {OptionList} def   The attributes to set on that node
   */
  setAttributes(node: N<DOM>, def: OptionList): void;

  /**
   * @param {N} node        The HTML node whose attribute is to be obtained
   * @param {string} name   The name of the attribute to get
   * @returns {string}      The value of the given attribute of the given node
   */
  getAttribute(node: N<DOM>, name: string): string;

  /**
   * @param {N} node        The HTML node whose attribute is to be removed
   * @param {string} name   The name of the attribute to remove
   */
  removeAttribute(node: N<DOM>, name: string): void;

  /**
   * @param {N} node        The HTML node whose attribute is to be tested
   * @param {string} name   The name of the attribute to test
   * @returns {boolean}     True of the node has the given attribute defined
   */
  hasAttribute(node: N<DOM>, name: string): boolean;

  /**
   * @param {N} node              The HTML node whose attributes are to be returned
   * @returns {AttributeData[]}   The list of attributes
   */
  allAttributes(node: N<DOM>): AttributeData[];

  /**
   * @param {N} node        The HTML node whose class is to be augmented
   * @param {string} name   The class to be added
   */
  addClass(node: N<DOM>, name: string): void;

  /**
   * @param {N} node        The HTML node whose class is to be changed
   * @param {string} name   The class to be removed
   */
  removeClass(node: N<DOM>, name: string): void;

  /**
   * @param {N} node        The HTML node whose class is to be tested
   * @param {string} name   The class to test
   * @returns {boolean}     True if the node has the given class
   */
  hasClass(node: N<DOM>, name: string): boolean;

  /**
   * @param {N} node       The HTML node whose class list is needed
   * @returns {string[]}   An array of the class names for this node
   */
  allClasses(node: N<DOM>): string[];

  /**
   * @param {N} node        The HTML node whose style is to be changed
   * @param {string} name   The style to be set
   * @param {string} value  The new value of the style
   */
  setStyle(node: N<DOM>, name: string, value: string): void;

  /**
   * @param {N} node        The HTML node whose style is to be obtained
   * @param {string} name   The style to be obtained
   * @returns {string}      The value of the style
   */
  getStyle(node: N<DOM>, name: string): string;

  /**
   * @param {N} node     The HTML node whose styles are to be returned
   * @returns {string}   The cssText for the styles
   */
  allStyles(node: N<DOM>): string;

  /**
   * @param {N} node           The stylesheet node where the rule will be added
   * @param {string[]} rules   The rule to add at the beginning of the stylesheet
   */
  insertRules(node: N<DOM>, rules: string[]): void;

  /**
   * @param {N} node     The stylesheet node whose rules are to be returned
   * @returns {string}   The string version of the stylesheet rules
   */
  cssText(node: N<DOM>): string;

  /**
   * @param {N} node     The HTML node whose font size is to be determined
   * @returns {number}   The font size (in pixels) of the node
   */
  fontSize(node: N<DOM>): number;

  /**
   * @param {N} node     The HTML node whose font family is to be determined
   * @returns {string}   The font family
   */
  fontFamily(node: N<DOM>): string;

  /**
   * @param {N} node               The HTML node whose dimensions are to be determined
   * @param {number} em            The number of pixels in an em
   * @param {boolean} local        True if local coordinates are to be used in SVG elements
   * @returns {[number, number]}   The width and height (in ems) of the element
   */
  nodeSize(node: N<DOM>, em?: number, local?: boolean): [number, number];

  /**
   * @param {N} node       The HTML node whose BBox is to be determined
   * @returns {PageBBox}   BBox as {left, right, top, bottom} position on the page (in pixels)
   */
  nodeBBox(node: N<DOM>): PageBBox;

  /**
   * @param {(event: any) => void} listener  The event listener for messages from the worker
   * @param {OptionList} options             The worker options (for path and worker name)
   * @returns {Promise<minWorker>}           A promise for the worker instance that was created
   */
  createWorker(
    listener: (event: any) => void,
    options: OptionList
  ): Promise<minWorker>;
}

/*****************************************************************/
/**
 *  Abstract DOMAdaptor class for creating HTML elements
 *
 * @template DOM   The DOM node types
 */
export abstract class AbstractDOMAdaptor<
  DOM extends DOM_TYPES,
> implements DOMAdaptor<DOM> {
  /**
   * The document in which the HTML nodes will be created
   */
  public document: D<DOM>;

  /**
   * True when the adaptor can measure DOM node sizes
   */
  public canMeasureNodes: boolean = true;

  /**
   * @param {D} document  The document in which the nodes will be created
   */
  constructor(document: D<DOM> = null) {
    this.document = document;
  }

  /**
   * @override
   */
  public abstract parse(text: string, format?: string): D<DOM>;

  /**
   * @override
   */
  public node(
    kind: string,
    def: OptionList = {},
    children: NT<DOM>[] = [],
    ns?: string
  ) {
    const node = this.create(kind, ns);
    this.setAttributes(node, def);
    for (const child of children) {
      this.append(node, child);
    }
    return node as N<DOM>;
  }

  /**
   * @param {string} kind   The type of the node to create
   * @param {string} ns     The optional namespace in which to create the node
   * @returns {N}           The created node
   */
  protected abstract create(kind: string, ns?: string): N<DOM>;

  /**
   * @override
   */
  public abstract text(text: string): T<DOM>;

  /**
   * @override
   */
  public setProperty(node: N<DOM>, name: string, value: any) {
    (node as any)[name] = value;
  }

  /**
   * @override
   */
  public getProperty(node: N<DOM>, name: string): any {
    return (node as any)[name];
  }

  /**
   * @param {N} node           The HTML element whose attributes are to be set
   * @param {OptionList} def   The attributes to set on that node
   */
  public setAttributes(node: N<DOM>, def: OptionList) {
    if (def.style && typeof def.style !== 'string') {
      for (const key of Object.keys(def.style)) {
        this.setStyle(
          node,
          key.replace(/-([a-z])/g, (_m, c) => c.toUpperCase()),
          def.style[key]
        );
      }
    }
    if (def.properties) {
      for (const key of Object.keys(def.properties)) {
        (node as OptionList)[key] = def.properties[key];
      }
    }
    for (const key of Object.keys(def)) {
      if (
        (key !== 'style' || typeof def.style === 'string') &&
        key !== 'properties'
      ) {
        this.setAttribute(node, key, def[key]);
      }
    }
  }

  /**
   * @override
   */
  public abstract head(doc?: D<DOM>): N<DOM>;

  /**
   * @override
   */
  public abstract body(doc?: D<DOM>): N<DOM>;

  /**
   * @override
   */
  public abstract root(doc?: D<DOM>): N<DOM>;

  /**
   * @override
   */
  public abstract doctype(doc?: D<DOM>): string;

  /**
   * @override
   */
  public abstract tags(node: N<DOM>, name: string, ns?: string): N<DOM>[];

  /**
   * @override
   */
  public abstract getElements(
    nodes: ContainerSpec<DOM>[],
    document: D<DOM>
  ): N<DOM>[];

  /**
   * @override
   */
  public abstract getElement(selector: string, node?: D<DOM> | N<DOM>): N<DOM>;

  /**
   * @override
   */
  public abstract contains(container: N<DOM>, node: NT<DOM>): boolean;

  /**
   * @override
   */
  public abstract parent(node: NT<DOM>): N<DOM>;

  /**
   * @override
   */
  public abstract append(node: N<DOM>, child: NT<DOM>): NT<DOM>;

  /**
   * @override
   */
  public abstract insert(nchild: NT<DOM>, ochild: NT<DOM>): void;

  /**
   * @override
   */
  public abstract remove(child: NT<DOM>): NT<DOM>;

  /**
   * @override
   */
  public replace(nnode: NT<DOM>, onode: NT<DOM>) {
    this.insert(nnode, onode);
    this.remove(onode);
    return onode;
  }

  /**
   * @override
   */
  public abstract clone(node: N<DOM>, deep: boolean): N<DOM>;

  /**
   * @override
   */
  public abstract split(node: T<DOM>, n: number): T<DOM>;

  /**
   * @override
   */
  public abstract next(node: NT<DOM>): NT<DOM>;

  /**
   * @override
   */
  public abstract previous(node: NT<DOM>): NT<DOM>;

  /**
   * @override
   */
  public abstract firstChild(node: N<DOM>): NT<DOM>;

  /**
   * @override
   */
  public abstract lastChild(node: N<DOM>): NT<DOM>;

  /**
   * @override
   */
  public abstract childNodes(node: N<DOM>): NT<DOM>[];

  /**
   * @override
   */
  public childNode(node: N<DOM>, i: number) {
    return this.childNodes(node)[i];
  }

  /**
   * @override
   */
  public abstract kind(node: NT<DOM>): string;

  /**
   * @override
   */
  public abstract value(node: NT<DOM>): string;

  /**
   * @override
   */
  public abstract textContent(node: N<DOM>): string;

  /**
   * @override
   */
  public abstract innerHTML(node: N<DOM>): string;

  /**
   * @override
   */
  public abstract outerHTML(node: N<DOM>): string;

  /**
   * @override
   */
  public abstract serializeXML(node: N<DOM>): string;

  /**
   * @override
   */
  public abstract setAttribute(
    node: N<DOM>,
    name: string,
    value: string,
    ns?: string
  ): void;

  /**
   * @override
   */
  public abstract getAttribute(node: N<DOM>, name: string): string;

  /**
   * @override
   */
  public abstract removeAttribute(node: N<DOM>, name: string): void;

  /**
   * @override
   */
  public abstract hasAttribute(node: N<DOM>, name: string): boolean;

  /**
   * @override
   */
  public abstract allAttributes(node: N<DOM>): AttributeData[];

  /**
   * @override
   */
  public abstract addClass(node: N<DOM>, name: string): void;

  /**
   * @override
   */
  public abstract removeClass(node: N<DOM>, name: string): void;

  /**
   * @override
   */
  public abstract hasClass(node: N<DOM>, name: string): boolean;

  /**
   * @override
   */
  public allClasses(node: N<DOM>) {
    const classes = this.getAttribute(node, 'class');
    return !classes
      ? ([] as string[])
      : classes
          .replace(/  +/g, ' ')
          .replace(/^ /, '')
          .replace(/ $/, '')
          .split(/ /);
  }

  /**
   * @override
   */
  public abstract setStyle(node: N<DOM>, name: string, value: string): void;

  /**
   * @override
   */
  public abstract getStyle(node: N<DOM>, name: string): string;

  /**
   * @override
   */
  public abstract allStyles(node: N<DOM>): string;

  /**
   * @override
   */
  public abstract insertRules(node: N<DOM>, rules: string[]): void;

  /**
   * @override
   */
  public cssText(node: N<DOM>) {
    return this.kind(node) === 'style' ? this.textContent(node) : '';
  }

  /**
   * @override
   */
  public abstract fontSize(node: N<DOM>): number;

  /**
   * @override
   */
  public abstract fontFamily(node: N<DOM>): string;

  /**
   * @override
   */
  public abstract nodeSize(
    node: N<DOM>,
    em?: number,
    local?: boolean
  ): [number, number];

  /**
   * @override
   */
  public abstract nodeBBox(node: N<DOM>): PageBBox;

  /**
   * @override
   */
  public abstract createWorker(
    listener: (event: any) => void,
    options: OptionList
  ): Promise<minWorker>;
}
