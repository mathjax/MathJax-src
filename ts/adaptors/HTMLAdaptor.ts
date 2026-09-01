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
 * @file  Implements the HTML DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { OptionList } from '../util/Options.js';
import {
  AttributeData,
  AbstractDOMAdaptor,
  DOMAdaptor,
  PageBBox,
} from '../core/DOMAdaptor.js';
import { Locale } from '../util/Locale.js';
import { COMPONENT } from '../core/__locales__/Component.js';
import { DOM as DOM_OF, DOM_TYPES, N, T, D } from '../types/Types.js';

type NT<DOM extends DOM_TYPES> = N<DOM> | T<DOM>;

/*****************************************************************/
/**
 * The minimum fields needed for a Document
 *
 * @template DOM   The DOM node types
 */
export interface MinDocument<DOM extends DOM_TYPES> {
  documentElement: N<DOM>;
  head: N<DOM>;
  body: N<DOM>;
  title: string;
  doctype: { name: string };
  defaultView: MinWindow<DOM>;
  location: { protocol: string; host: string };
  createElement(kind: string): N<DOM>;
  createElementNS(ns: string, kind: string): N<DOM>;
  createTextNode(text: string): T<DOM>;
  querySelectorAll(selector: string): ArrayLike<N<DOM>>;
  querySelector(selector: string): N<DOM> | null;
}

/*****************************************************************/
/**
 * The minimum fields needed for an HTML Element
 *
 * @template DOM   The DOM node types
 */
export interface MinHTMLElement<DOM extends DOM_TYPES> {
  nodeType: number;
  nodeName: string;
  nodeValue: string;
  textContent: string;
  innerHTML: string;
  outerHTML: string;
  parentNode: N<DOM> | Node;
  nextSibling: NT<DOM> | Node;
  previousSibling: NT<DOM> | Node;
  offsetWidth: number;
  offsetHeight: number;

  attributes: AttributeData[] | NamedNodeMap;
  className: string;
  classList: DOMTokenList;
  style: OptionList;
  sheet?: {
    insertRule: (rule: string, index?: number) => void;
    cssRules: Array<{ cssText: string }>;
  };
  childNodes: NT<DOM>[] | NodeList;
  firstChild: NT<DOM> | Node;
  lastChild: NT<DOM> | Node;
  getElementsByTagName(name: string): N<DOM>[] | HTMLCollectionOf<Element>;
  getElementsByTagNameNS(
    ns: string,
    name: string
  ): N<DOM>[] | HTMLCollectionOf<Element>;
  contains(child: NT<DOM>): boolean;
  appendChild(child: NT<DOM>): NT<DOM> | Node;
  removeChild(child: NT<DOM>): NT<DOM> | Node;
  replaceChild(nnode: NT<DOM>, onode: NT<DOM>): NT<DOM> | Node;
  insertBefore(nchild: NT<DOM>, ochild: NT<DOM>): void;
  cloneNode(deep: boolean): N<DOM> | Node;
  setAttribute(name: string, value: string): void;
  setAttributeNS(ns: string, name: string, value: string): void;
  getAttribute(name: string): string;
  removeAttribute(name: string): void;
  hasAttribute(name: string): boolean;
  getBoundingClientRect(): object;
  getBBox?(): { x: number; y: number; width: number; height: number };
  querySelector(selector: string): N<DOM> | null;
  src?: string;
}

/*****************************************************************/
/**
 * The minimum fields needed for a Text element
 *
 * @template DOM   The DOM node types
 */
export interface MinText<DOM extends DOM_TYPES> {
  nodeType: number;
  nodeName: string;
  nodeValue: string;
  parentNode: N<DOM> | Node;
  nextSibling: NT<DOM> | Node;
  previousSibling: NT<DOM> | Node;
  splitText(n: number): T<DOM>;
}

/*****************************************************************/
/**
 * The minimum fields needed for a DOMParser
 *
 * @template DOM   The DOM node types
 */
export interface MinDOMParser<DOM extends DOM_TYPES> {
  parseFromString(text: string, format?: string): D<DOM>;
}

/*****************************************************************/
/**
 * The minimum fields needed for a DOMParser
 *
 * @template DOM   The DOM node types
 */
export interface MinXMLSerializer<DOM extends DOM_TYPES> {
  serializeToString(node: N<DOM>): string;
}

/*****************************************************************/
/**
 * The minimum fields needed for a Window
 *
 * @template DOM   The DOM node types
 */
export interface MinWindow<DOM extends DOM_TYPES> {
  document: D<DOM>;
  DOMParser: {
    new (): MinDOMParser<DOM>;
  };
  XMLSerializer: {
    new (): MinXMLSerializer<DOM>;
  };
  NodeList: any;
  HTMLCollection: any;
  HTMLElement: any;
  DocumentFragment: any;
  Document: any;
  getComputedStyle(node: N<DOM>): any;
  addEventListener(kind: string, listener: (event: any) => void): void;
  postMessage(msg: any, domain: string): void;
}

/*****************************************************************/
/**
 * The minimum needed for an HTML Adaptor
 *
 * @template DOM   The DOM node types
 */
export interface MinHTMLAdaptor<DOM extends DOM_TYPES> extends DOMAdaptor<DOM> {
  window: MinWindow<DOM>;
}

/*****************************************************************/
/**
 *  Abstract HTMLAdaptor class for manipulating HTML elements
 *  (subclass of AbstractDOMAdaptor)
 *
 * @template DOM   The DOM types
 */
export class HTMLAdaptor<
  DOM extends DOM_OF<MinHTMLElement<DOM>, MinText<DOM>, MinDocument<DOM>>,
>
  extends AbstractDOMAdaptor<DOM>
  implements MinHTMLAdaptor<DOM>
{
  /**
   * The font size to use when it can't be measured (e.g., the element
   * isn't in the DOM).
   */
  public static DEFAULT_FONT_SIZE = 16;

  /**
   * The HTML adaptor can measure DOM node sizes
   */
  public canMeasureNodes: boolean = true;

  /**
   * The window object for this adaptor
   */
  public window: MinWindow<DOM>;

  /**
   * The DOMParser used to parse a string into a DOM tree
   */
  public parser: MinDOMParser<DOM>;

  /**
   * @override
   * @class
   */
  constructor(window: MinWindow<DOM>) {
    super(window.document);
    this.window = window;
    this.parser = new (window.DOMParser as any)();
  }

  /**
   * @override
   */
  public parse(text: string, format: string = 'text/html') {
    return this.parser.parseFromString(text, format);
  }

  /**
   * @override
   */
  protected create(kind: string, ns?: string) {
    return ns
      ? this.document.createElementNS(ns, kind)
      : this.document.createElement(kind);
  }

  /**
   * @override
   */
  public text(text: string) {
    return this.document.createTextNode(text);
  }

  /**
   * @override
   */
  public head(doc: D<DOM> = this.document) {
    return doc.head || (doc as any as N<DOM>);
  }

  /**
   * @override
   */
  public body(doc: D<DOM> = this.document) {
    return doc.body || (doc as any as N<DOM>);
  }

  /**
   * @override
   */
  public root(doc: D<DOM> = this.document) {
    return doc.documentElement || (doc as any as N<DOM>);
  }

  /**
   * @override
   */
  public doctype(doc: D<DOM> = this.document) {
    return doc.doctype ? `<!DOCTYPE ${doc.doctype.name}>` : '';
  }

  /**
   * @override
   */
  public tags(node: N<DOM>, name: string, ns: string = null) {
    const nodes = ns
      ? node.getElementsByTagNameNS(ns, name)
      : node.getElementsByTagName(name);
    return Array.from(nodes as N<DOM>[]) as N<DOM>[];
  }

  /**
   * @override
   */
  public getElements(nodes: (string | N<DOM> | N<DOM>[])[], _document: D<DOM>) {
    let containers: N<DOM>[] = [];
    for (const node of nodes) {
      if (typeof node === 'string') {
        containers = containers.concat(
          Array.from(this.document.querySelectorAll(node))
        );
      } else if (Array.isArray(node)) {
        containers = containers.concat(Array.from(node) as N<DOM>[]);
      } else if (
        node instanceof this.window.NodeList ||
        node instanceof this.window.HTMLCollection
      ) {
        containers = containers.concat(Array.from(node as any as N<DOM>[]));
      } else {
        containers.push(node);
      }
    }
    return containers;
  }

  /**
   * @override
   */
  public getElement(
    selector: string,
    node: D<DOM> | N<DOM> = this.document
  ): N<DOM> {
    return node.querySelector(selector);
  }

  /**
   * @override
   */
  public contains(container: N<DOM>, node: NT<DOM>) {
    return container.contains(node);
  }

  /**
   * @override
   */
  public parent(node: NT<DOM>) {
    return node.parentNode as N<DOM>;
  }

  /**
   * @override
   */
  public append(node: N<DOM>, child: NT<DOM>) {
    return node.appendChild(child) as NT<DOM>;
  }

  /**
   * @override
   */
  public insert(nchild: NT<DOM>, ochild: NT<DOM>) {
    return this.parent(ochild).insertBefore(nchild, ochild);
  }

  /**
   * @override
   */
  public remove(child: NT<DOM>) {
    return this.parent(child).removeChild(child) as NT<DOM>;
  }

  /**
   * @override
   */
  public replace(nnode: NT<DOM>, onode: NT<DOM>) {
    return this.parent(onode).replaceChild(nnode, onode) as NT<DOM>;
  }

  /**
   * @override
   */
  public clone(node: N<DOM>, deep: boolean = true) {
    return node.cloneNode(deep) as N<DOM>;
  }

  /**
   * @override
   */
  public split(node: T<DOM>, n: number) {
    return node.splitText(n);
  }

  /**
   * @override
   */
  public next(node: NT<DOM>) {
    return node.nextSibling as NT<DOM>;
  }

  /**
   * @override
   */
  public previous(node: NT<DOM>) {
    return node.previousSibling as NT<DOM>;
  }

  /**
   * @override
   */
  public firstChild(node: N<DOM>) {
    return node.firstChild as NT<DOM>;
  }

  /**
   * @override
   */
  public lastChild(node: N<DOM>) {
    return node.lastChild as NT<DOM>;
  }

  /**
   * @override
   */
  public childNodes(node: N<DOM>) {
    return Array.from(node.childNodes as NT<DOM>[]);
  }

  /**
   * @override
   */
  public childNode(node: N<DOM>, i: number) {
    return node.childNodes[i] as NT<DOM>;
  }

  /**
   * @override
   */
  public kind(node: NT<DOM>) {
    const n = node.nodeType;
    return n === 1 || n === 3 || n === 8 ? node.nodeName.toLowerCase() : '';
  }

  /**
   * @override
   */
  public value(node: NT<DOM>) {
    return node.nodeValue || '';
  }

  /**
   * @override
   */
  public textContent(node: N<DOM>) {
    return node.textContent;
  }

  /**
   * @override
   */
  public innerHTML(node: N<DOM>) {
    return node.innerHTML;
  }

  /**
   * @override
   */
  public outerHTML(node: N<DOM>) {
    return node.outerHTML;
  }

  /**
   * @override
   */
  public serializeXML(node: N<DOM>) {
    const serializer = new this.window.XMLSerializer();
    return serializer.serializeToString(node) as string;
  }

  /**
   * @override
   */
  public setAttribute(
    node: N<DOM>,
    name: string,
    value: string,
    ns: string = null
  ) {
    if (!ns) {
      if (name === 'style') {
        value = value.replace(/\n/g, ' ');
      }
      return node.setAttribute(name, value);
    }
    name = ns.replace(/.*\//, '') + ':' + name.replace(/^.*:/, '');
    return node.setAttributeNS(ns, name, value);
  }

  /**
   * @override
   */
  public getAttribute(node: N<DOM>, name: string) {
    return node.getAttribute(name);
  }

  /**
   * @override
   */
  public removeAttribute(node: N<DOM>, name: string) {
    return node.removeAttribute(name);
  }

  /**
   * @override
   */
  public hasAttribute(node: N<DOM>, name: string) {
    return node.hasAttribute(name);
  }

  /**
   * @override
   */
  public allAttributes(node: N<DOM>) {
    return Array.from(node.attributes).map((x: AttributeData) => {
      return { name: x.name, value: x.value } as AttributeData;
    });
  }

  /**
   * @override
   */
  public addClass(node: N<DOM>, name: string) {
    if (node.classList) {
      node.classList.add(name);
    } else {
      node.className = (node.className + ' ' + name).trim();
    }
  }

  /**
   * @override
   */
  public removeClass(node: N<DOM>, name: string) {
    if (node.classList) {
      node.classList.remove(name);
    } else {
      node.className = node.className
        .split(/ /)
        .filter((c) => c !== name)
        .join(' ');
    }
  }

  /**
   * @override
   */
  public hasClass(node: N<DOM>, name: string) {
    if (node.classList) {
      return node.classList.contains(name);
    }
    return node.className.split(/ /).includes(name);
  }

  /**
   * @override
   */
  public setStyle(node: N<DOM>, name: string, value: string) {
    node.style[name] = String(value).replace(/\n/g, ' ');
  }

  /**
   * @override
   */
  public getStyle(node: N<DOM>, name: string) {
    return node.style[name];
  }

  /**
   * @override
   */
  public allStyles(node: N<DOM>) {
    return node.style.cssText;
  }

  /**
   * @override
   */
  public insertRules(node: N<DOM>, rules: string[]) {
    for (const rule of rules) {
      try {
        node.sheet.insertRule(rule, node.sheet.cssRules.length);
      } catch (e) {
        Locale.warn(COMPONENT, 'CantInsertCSS', rule, e.message);
      }
    }
  }

  /**
   * @override
   */
  public cssText(node: N<DOM>) {
    if (this.kind(node) !== 'style') {
      return '';
    }
    return Array.from(node.sheet.cssRules)
      .map((rule) => rule.cssText)
      .join('\n');
  }

  /**
   * @override
   */
  public fontSize(node: N<DOM>) {
    const style = this.window.getComputedStyle(node);
    return parseFloat(
      style.fontSize ||
        String((this.constructor as typeof HTMLAdaptor).DEFAULT_FONT_SIZE)
    );
  }

  /**
   * @override
   */
  public fontFamily(node: N<DOM>) {
    const style = this.window.getComputedStyle(node);
    return style.fontFamily || '';
  }

  /**
   * @override
   */
  public nodeSize(node: N<DOM>, em: number = 1, local: boolean = false) {
    if (local && node.getBBox) {
      const { width, height } = node.getBBox();
      return [width / em, height / em] as [number, number];
    }
    return [node.offsetWidth / em, node.offsetHeight / em] as [number, number];
  }

  /**
   * @override
   */
  public nodeBBox(node: N<DOM>) {
    const { left, right, top, bottom } =
      node.getBoundingClientRect() as PageBBox;
    return { left, right, top, bottom };
  }

  /**
   * @override
   */
  public async createWorker(
    listener: (event: any) => void,
    options: OptionList
  ) {
    const { path, maps, worker } = options;
    const file = `${path}/${worker}`;
    const content = `
      self.maps = '${quoted(maps)}';
      try {
        importScripts('${quoted(file)}');
      } catch (e) {
        postMessage({cmd: 'Failed', data: e.message});
      }
    `;
    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/javascript' })
    );
    const webworker = new Worker(url);
    webworker.onmessage = listener;
    URL.revokeObjectURL(url);
    return webworker;
  }
}

/**
 * Quote any backslashes or single quotes, and turn non-ASCII
 * characters into \u{...}  so that the result can be inserted into
 * single quotes and return the original string when evaluated.
 *
 * @param {string} text   The text to be quoted
 * @returns {string}      The quoted text
 */
function quoted(text: string): string {
  return [...text]
    .map((c) => {
      if (c === '\\' || c === "'") {
        c = '\\' + c;
      } else if (c < ' ' || c > '\u007e') {
        c = `\\u{${c.codePointAt(0).toString(16)}}`;
      }
      return c;
    })
    .join('');
}
