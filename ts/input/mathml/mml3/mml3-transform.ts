/*************************************************************
 *
 *  Copyright (c) 2021-2026 The MathJax Consortium
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
 * @file  A TypeScript implementation of David Carlisle's MathML3 elementary
 *        math (mstack, mlongdiv, etc.) and right-to-left (dir="rtl")
 *        transformation, originally written as an XSLT stylesheet.
 *
 *        The transform works on a light-weight tree (XElement/XNode) that
 *        is created from the DOM node and converted back to DOM nodes at
 *        the end, so it doesn't depend on the particular DOM in use.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { DOMAdaptor } from '../../../core/DOMAdaptor.js';

/**
 * The MathML namespace.
 */
const MATHML = 'http://www.w3.org/1998/Math/MathML';

/*****************************************************************/
/*
 *  The light-weight tree
 */

/**
 * The attributes of an element
 */
export type Attrs = { [name: string]: string };

/**
 * An element in the tree
 */
export interface XElement {
  name: string;
  attrs: Attrs;
  children: XNode[];
  parent?: XElement;
}

/**
 * A node is an element or a string (for text)
 */
export type XNode = XElement | string;

/**
 * Items that can be passed as children when creating an element.
 */
type Child = XNode | Child[] | null | undefined;

/**
 * @param {XNode} node  The node to test
 * @returns {boolean}   True if the node is an element
 */
const isEl = (node: XNode): node is XElement => typeof node !== 'string';

/**
 * Create an element (flattening arrays of children and merging adjacent text)
 *
 * @param {string} name       The element name
 * @param {Attrs} attrs       The attributes for the element (copied)
 * @param {Child[]} children  The children (nodes or arrays of nodes)
 * @returns {XElement}        The new element
 */
function el(name: string, attrs: Attrs = {}, ...children: Child[]): XElement {
  const list: XNode[] = [];
  const add = (child: Child) => {
    if (child === null || child === undefined) return;
    if (Array.isArray(child)) {
      child.forEach(add);
    } else if (
      typeof child === 'string' &&
      typeof list[list.length - 1] === 'string'
    ) {
      list[list.length - 1] += child;
    } else {
      list.push(child);
    }
  };
  children.forEach(add);
  return { name, attrs: { ...attrs }, children: list };
}

/**
 * @param {XElement} node  The element whose children are wanted
 * @returns {XElement[]}   Just the element children
 */
function elements(node: XElement): XElement[] {
  return node.children.filter(isEl);
}

/**
 * @param {XNode} node  The node whose text is wanted
 * @returns {string}    The string value of the node (all descendant text)
 */
function text(node: XNode): string {
  return isEl(node) ? node.children.map(text).join('') : node;
}

/**
 * @param {XElement} node  The element to check
 * @param {string} name    The name of the child to look for
 * @returns {boolean}      True if the element has a child element with that name
 */
function hasChild(node: XElement | undefined, name: string): boolean {
  return (
    !!node && node.children.some((child) => isEl(child) && child.name === name)
  );
}

/**
 * Convert a string to a number the way XPath does (no exponents, no hex,
 * empty string is NaN).
 *
 * @param {string} value  The string to convert
 * @returns {number}      The number (or NaN)
 */
function xnum(value: string): number {
  return /^\s*-?(\d+(\.\d*)?|\.\d+)\s*$/.test(value) ? parseFloat(value) : NaN;
}

/**
 * @param {XElement} node  The element whose attribute is wanted
 * @param {string} name    The attribute name
 * @returns {number}       The numeric value (0 if the attribute is missing)
 */
function sum(node: XElement, name: string): number {
  const value = node.attrs[name];
  return value === undefined ? 0 : xnum(value);
}

/**
 * @param {number} n  A number
 * @returns {number}  The number of items that XPath's position() <= n would select
 */
function count(n: number): number {
  return n >= 1 ? Math.floor(n) : 0;
}

/**
 * @param {number} n    The number of copies
 * @param {Function} f  The function to create the i-th item
 * @returns {XNode[]}   The list of created items
 */
function repeat<T>(n: number, f: (i: number) => T): T[] {
  return Array.from({ length: count(n) }, (_x, i) => f(i + 1));
}

/**
 * @param {XElement[]} list  A list of elements
 * @param {number} i         The (1-based) position wanted
 * @returns {XElement}       The element at that position (or undefined)
 */
function at<T>(list: T[], i: number): T | undefined {
  return Number.isInteger(i) && i >= 1 && i <= list.length
    ? list[i - 1]
    : undefined;
}

/**
 * @param {XElement} node  The element whose decimalpoint is wanted
 * @returns {string}       The decimalpoint attribute on the element or its nearest ancestor
 */
function nearestDecimalPoint(node: XElement): string | undefined {
  for (let n: XElement | undefined = node; n; n = n.parent) {
    if (n.attrs.decimalpoint !== undefined) return n.attrs.decimalpoint;
  }
  return undefined;
}

/*****************************************************************/
/*
 *  Conversion to and from the DOM
 */

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 *
 * @param {DOMAdaptor} adaptor  The adaptor for the DOM
 * @param {N} node              The DOM node to convert
 * @param {XElement} parent     The parent of the node (if any)
 * @returns {XElement}          The tree for the DOM node
 */
export function fromDOM<N, T, D>(
  adaptor: DOMAdaptor<N, T, D>,
  node: N,
  parent?: XElement
): XElement {
  const attrs: Attrs = {};
  for (const { name, value } of adaptor.allAttributes(node)) {
    if (name !== 'xmlns' && !name.startsWith('xmlns:')) {
      attrs[name] = value;
    }
  }
  const xnode: XElement = {
    name: adaptor.kind(node).replace(/^.*:/, ''),
    attrs,
    children: [],
    parent,
  };
  for (const child of adaptor.childNodes(node)) {
    const kind = adaptor.kind(child);
    if (kind === '#text') {
      xnode.children.push(adaptor.value(child));
    } else if (kind !== '#comment') {
      xnode.children.push(fromDOM(adaptor, child as N, xnode));
    }
  }
  return xnode;
}

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 *
 * @param {DOMAdaptor} adaptor  The adaptor for the DOM
 * @param {XNode} node          The tree to convert
 * @returns {N | T}             The DOM node for the tree
 */
export function toDOM<N, T, D>(
  adaptor: DOMAdaptor<N, T, D>,
  node: XNode
): N | T {
  if (!isEl(node)) {
    return adaptor.text(node);
  }
  return adaptor.node(
    node.name,
    node.attrs,
    node.children.map((child) => toDOM(adaptor, child)),
    MATHML
  );
}

/*****************************************************************/
/*
 *  The default mode: converts elementary math and right-to-left markup
 */

/**
 * Process a node (mstack, mlongdiv and dir="rtl" are transformed, and
 * everything else is copied, with its children processed).
 *
 * @param {XNode} node  The node to process
 * @returns {XNode[]}   The resulting nodes
 */
function apply(node: XNode): XNode[] {
  if (!isEl(node)) return [node];
  switch (node.name) {
    case 'mstack':
      return mstack(node);
    case 'mlongdiv':
      return mlongdiv(node);
  }
  if (node.attrs.dir === 'rtl') {
    return rtl(node);
  }
  return [el(node.name, node.attrs, node.children.flatMap(apply))];
}

/**
 * Transform the MathML tree.
 *
 * @param {XElement} math  The root of the MathML tree
 * @returns {XElement}     The transformed tree
 */
export function transform(math: XElement): XElement {
  const result = apply(math).find(isEl);
  return result || math;
}

/*****************************************************************/
/*
 *  Right-to-left mode
 */

/**
 * Text that is mirrored in right-to-left mode.
 */
const RTL_TEXT = new Map([
  ['(', ')'],
  [')', '('],
  ['{', '}'],
  ['}', '{'],
  ['<', '>'],
  ['>', '<'],
  ['∈', '∋'],
  ['∋', '∈'],
]);

/**
 * Brackets that are mirrored in the open and close attributes
 */
const RTL_FENCE = new Map([
  ['(', ')'],
  [')', '('],
  ['[', ']'],
  [']', '['],
  ['{', '}'],
  ['}', '{'],
]);

/**
 * @param {XElement} node  The element whose attributes are to be processed
 * @returns {Attrs}        The right-to-left versions of the attributes
 */
function rtlAttrs(node: XElement): Attrs {
  const attrs: Attrs = {};
  for (const [name, value] of Object.entries(node.attrs)) {
    if (name === 'open' || name === 'close') {
      attrs[name === 'open' ? 'close' : 'open'] = RTL_FENCE.get(value) ?? value;
    } else if (name === 'notation' && value === 'radical') {
      attrs.notation = 'top right';
    } else {
      attrs[name] = value;
      attrs.dir = 'ltr';
    }
  }
  return attrs;
}

/**
 * @param {XElement} node  The (optional) node to process in right-to-left mode
 * @returns {XNode[]}      The resulting nodes (none if there is no node)
 */
function rtlOf(node?: XElement): XNode[] {
  return node ? rtl(node) : [];
}

/**
 * Process a node in right-to-left mode.
 *
 * @param {XNode} node  The node to process
 * @returns {XNode[]}   The resulting nodes
 */
function rtl(node: XNode): XNode[] {
  if (!isEl(node)) {
    return [RTL_TEXT.get(node) ?? node];
  }
  const kids = elements(node);
  switch (node.name) {
    case 'mfrac':
      if (node.attrs.bevelled === 'true') {
        return [
          el(
            'mrow',
            {},
            el('msub', {}, el('mi'), rtlOf(kids[1])),
            el('mo', {}, '\\'),
            el('msup', {}, el('mi'), rtlOf(kids[0]))
          ),
        ];
      }
      return [el('mfrac', rtlAttrs(node), kids.flatMap(rtl))];
    case 'mroot':
      return [
        el(
          'msup',
          {},
          el(
            'menclose',
            { notation: 'top right', ...rtlAttrs(node) },
            rtlOf(kids[0])
          ),
          rtlOf(kids[1])
        ),
      ];
    case 'msqrt':
      return [
        el(
          'menclose',
          { notation: 'top right', ...rtlAttrs(node) },
          rtlOf(kids[0])
        ),
      ];
    case 'mtable':
    case 'munder':
    case 'mover':
    case 'munderover':
      return [el(node.name, rtlAttrs(node), node.children.flatMap(rtl))];
    case 'msup':
      return [
        el(
          'mmultiscripts',
          {},
          rtlOf(kids[0]),
          el('mprescripts'),
          el('none'),
          rtlOf(kids[1])
        ),
      ];
    case 'msub':
      return [
        el(
          'mmultiscripts',
          {},
          rtlOf(kids[0]),
          el('mprescripts'),
          rtlOf(kids[1]),
          el('none')
        ),
      ];
    case 'msubsup':
      return [
        el(
          'mmultiscripts',
          {},
          rtlOf(kids[0]),
          el('mprescripts'),
          rtlOf(kids[1]),
          rtlOf(kids[2])
        ),
      ];
    case 'mmultiscripts':
      return [rtlMultiscripts(kids)];
    case 'mlongdiv':
    case 'mstack':
      return [el('mrow', { dir: 'ltr' }, apply(node))];
    case 'menclose':
      if (node.attrs.notation === 'madruwb') {
        return [
          el(
            'menclose',
            { notation: 'bottom right' },
            node.children.flatMap(rtl)
          ),
        ];
      }
  }
  const children: XNode[] = [];
  for (let i = node.children.length - 1; i >= 0; i--) {
    children.push(' ', ...rtl(node.children[i]));
  }
  return [el(node.name, rtlAttrs(node), children)];
}

/**
 * Mirror an mmultiscripts element: the pre-scripts become post-scripts (and
 * vice versa) with the order of the script pairs reversed.
 *
 * @param {XElement[]} kids  The child elements of the mmultiscripts element
 * @returns {XElement}       The mirrored element
 */
function rtlMultiscripts(kids: XElement[]): XElement {
  const pre = kids.findIndex((kid) => kid.name === 'mprescripts');
  const pair = (kid: XElement) => [
    ...rtl(kid),
    ...rtlOf(kids[kids.indexOf(kid) + 1]),
  ];
  if (pre < 0) {
    const scripts = kids.filter((_kid, i) => i % 2 === 1);
    return el(
      'mmultiscripts',
      {},
      rtlOf(kids[0]),
      el('mprescripts'),
      scripts.reverse().flatMap(pair)
    );
  }
  const post = kids.slice(pre + 1).filter((_kid, i) => i % 2 === 0);
  const before = kids
    .slice(0, pre)
    .reverse()
    .slice(0, -1)
    .filter((_kid, i) => i % 2 === 1);
  return el(
    'mmultiscripts',
    {},
    rtlOf(kids[0]),
    post.reverse().flatMap(pair),
    el('mprescripts'),
    before.flatMap(pair)
  );
}

/*****************************************************************/
/*
 *  mstack
 */

/**
 * The context for processing the rows of an mstack
 */
interface Context {
  align: string;
  dp?: string;
}

/**
 * A row (or part of a row) of an mstack
 */
interface Row {
  cls?: string;
  l: number | '*';
  cells: XElement[];
}

/**
 * The properties of an mpadded for a carry or line
 */
const SCRIPT_WIDTH = { width: '0em', lspace: '-0.5width' };

/**
 * Convert an mstack to an mtable
 *
 * @param {XElement} node  The mstack element
 * @returns {XNode[]}      The resulting mtable
 */
function mstack(node: XElement): XNode[] {
  const ctx: Context = {
    align: node.attrs.stackalign ?? '',
    dp: nearestDecimalPoint(node),
  };
  const rows = elements(node).flatMap((child) => mstack1(child, 0, ctx));
  const ls = rows
    .map((row) => row.l)
    .filter((l): l is number => l !== '*' && !isNaN(l));
  const maxl = ls.length ? Math.max(...ls) : NaN;
  const children: XNode[] = [];
  rows.forEach((row, i) => {
    const next = rows[i + 1];
    if (row.cls === 'mscarries' && next?.cls !== 'mscarries') return;
    const prev = rows[i - 1];
    const carries = prev?.cls === 'mscarries' ? prev : undefined;
    children.push(
      '\n',
      el(
        'mtr',
        row.cls === 'msline' ? { class: 'msline' } : {},
        stackRow(row, carries, maxl)
      )
    );
  });
  const attrs: Attrs = { columnspacing: '0em', rowspacing: '0em' };
  if (node.attrs.align !== undefined) {
    attrs.align = node.attrs.align;
  }
  return ml(el('mtable', attrs, children));
}

/**
 * Create the cells for a row of the mtable.
 *
 * @param {Row} row         The row to be converted
 * @param {Row} carries     The carries row just before this one (if any)
 * @param {number} maxl     The maximum l value for the rows
 * @returns {XNode[]}       The cells for the mtr
 */
function stackRow(row: Row, carries: Row | undefined, maxl: number): XNode[] {
  if (row.cls === 'msline' && row.l === '*') {
    return repeat(maxl, () => row.cells[0]);
  }
  const l = row.l as number;
  const offset = maxl - l;
  if (!carries) {
    return [...repeat(offset, () => el('mtd')), ...row.cells];
  }
  const cl = carries.l as number;
  const ldiff = cl - l;
  const loffset = maxl - cl;
  return [
    ...repeat(offset, (pn) => {
      const cy = at(carries.cells, pn - loffset);
      const kids = cy ? elements(cy) : [];
      return el(
        'mtd',
        {},
        kids.length
          ? el(
              'mover',
              {},
              el('mphantom', {}, el('mn', {}, '0')),
              el('mpadded', SCRIPT_WIDTH, kids)
            )
          : []
      );
    }),
    ...row.cells.map((cell, i) =>
      el(cell.name, cell.attrs, carried(cell, at(carries.cells, i + 1 + ldiff)))
    ),
  ];
}

/**
 * Combine a cell with its carry.
 *
 * @param {XElement} cell  The cell for the row
 * @param {XElement} cy    The cell from the carries row (if any)
 * @returns {XNode[]}      The contents for the new cell
 */
function carried(cell: XElement, cy?: XElement): XNode[] {
  const kids = cy ? elements(cy) : [];
  const crossout = cy?.attrs.crossout;
  const inner = elements(cell);
  const b: XNode[] = crossout
    ? [el('menclose', { notation: crossout }, inner)]
    : inner;
  if (!kids.length || hasChild(cy, 'none')) return b;
  const location = cy?.attrs.location;
  const script = (attrs: Attrs) => el('mpadded', attrs, kids);
  switch (location) {
    case undefined:
    case '':
    case 'n':
      return [el('mover', {}, b, script(SCRIPT_WIDTH))];
    case 'nw':
      return [
        el(
          'mmultiscripts',
          {},
          b,
          el('mprescripts'),
          el('none'),
          script({ lspace: '-1width', width: '0em' })
        ),
      ];
    case 's':
      return [el('munder', {}, b, script(SCRIPT_WIDTH))];
    case 'sw':
      return [
        el(
          'mmultiscripts',
          {},
          b,
          el('mprescripts'),
          script({ lspace: '-1width', width: '0em' }),
          el('none')
        ),
      ];
    case 'ne':
      return [el('msup', {}, b, script({ width: '0em' }))];
    case 'se':
      return [el('msub', {}, b, script({ width: '0em' }))];
    case 'w':
      return [
        el('msup', {}, el('mrow'), script({ lspace: '-1width', width: '0em' })),
        ...b,
      ];
    case 'e':
      return [...b, el('msup', {}, el('mrow'), script({ width: '0em' }))];
    default:
      return b;
  }
}

/**
 * Convert a row of an mstack to (one or more) rows for the table.
 *
 * @param {XElement} node  The child of the mstack (or msgroup, etc.)
 * @param {number} p       The position offset for the row
 * @param {Context} ctx    The context for the rows
 * @returns {Row[]}        The resulting rows
 */
function mstack1(node: XElement, p: number, ctx: Context): Row[] {
  switch (node.name) {
    case 'msrow':
      return [msrow(node, p, ctx)];
    case 'mn':
      return [mn(node, p, ctx)];
    case 'msgroup':
      return msgroup(node, p, ctx);
    case 'msline':
      return [msline(node, p, ctx)];
    case 'mscarries':
      return [mscarries(node, p, ctx)];
  }
  return [
    {
      l: ctx.align === 'left' ? p : 1 + p,
      cells: [el('mtd', {}, apply(node))],
    },
  ];
}

/**
 * @param {XElement} node  The element whose context is wanted
 * @param {Context} ctx    The current context
 * @returns {Context}      The context for the children of the node
 */
function childContext(node: XElement, ctx: Context): Context {
  return node.attrs.decimalpoint === undefined
    ? ctx
    : { ...ctx, dp: node.attrs.decimalpoint };
}

/**
 * @param {XElement} node  The msrow
 * @param {number} p       The position offset
 * @param {Context} ctx    The context for the stack
 * @returns {Row}          The row for the msrow
 */
function msrow(node: XElement, p: number, ctx: Context): Row {
  const align = ctx.align || 'decimalpoint';
  const rows = elements(node).flatMap((child) =>
    mstack1(child, 0, childContext(node, ctx))
  );
  let l1 = 0;
  if (align === 'decimalpoint' && hasChild(node, 'mn')) {
    const i = rows.findIndex((row) =>
      row.cells.some((cell) => hasChild(cell, 'mn'))
    );
    l1 = i < 0 ? NaN : (rows[i].l as number) + i;
  } else if (align === 'right' || align === 'decimalpoint') {
    l1 = rows.reduce((n, row) => n + row.cells.length, 0);
  }
  return {
    cls: 'msrow',
    l: l1 + sum(node, 'position') + p,
    cells: rows.flatMap((row) => row.cells),
  };
}

/**
 * @param {XElement} node  The mn element
 * @param {number} p       The position offset
 * @param {Context} ctx    The context for the stack
 * @returns {Row}          The row for the number (one cell per digit)
 */
function mn(node: XElement, p: number, ctx: Context): Row {
  const align = ctx.align || 'decimalpoint';
  const dp = ctx.dp ? ctx.dp : '.';
  const value = text(node).replace(/\s+/g, ' ').trim();
  const digits = Array.from(value);
  const len = digits.length;
  let l = p;
  if (align === 'right' || (align === 'decimalpoint' && !value.includes(dp))) {
    l = p + len;
  } else if (align === 'center') {
    l = Math.round((p + len) / 2);
  } else if (align === 'decimalpoint') {
    l = p + Array.from(value.substring(0, value.indexOf(dp))).length;
  }
  return {
    l,
    cells: digits.map((digit) =>
      el(
        'mtd',
        {},
        digit === '.' || digit === ',' ? el('mspace', { width: '.15em' }) : [],
        el('mn', {}, digit)
      )
    ),
  };
}

/**
 * @param {XElement} node  The msgroup
 * @param {number} p       The position offset
 * @param {Context} ctx    The context for the stack
 * @returns {Row[]}        The rows for the children of the group
 */
function msgroup(node: XElement, p: number, ctx: Context): Row[] {
  const s = sum(node, 'shift');
  const thisp = sum(node, 'position');
  return elements(node).flatMap((child, i) =>
    mstack1(child, p + thisp + i * s, childContext(node, ctx))
  );
}

/**
 * @param {XElement} node  The msline
 * @param {number} p       The position offset
 * @param {Context} ctx    The context for the stack
 * @returns {Row}          The row for the line
 */
function msline(node: XElement, p: number, ctx: Context): Row {
  const align = ctx.align || 'decimalpoint';
  const length = node.attrs.length;
  const noLength = !length || xnum(length) === 0;
  const thickness = node.attrs.mslinethickness;
  const w =
    { thin: '0.1em', medium: '0.15em', thick: '0.2em' }[thickness as string] ??
    (thickness !== undefined ? thickness : '0.15em');
  const cell = (cls: string) =>
    el(
      'mtd',
      { class: cls },
      el(
        'mpadded',
        { lspace: '-0.2em', width: '0em', height: '0em' },
        el(
          'mfrac',
          { linethickness: w },
          el('mspace', { width: '.5em' }),
          el('mrow')
        )
      )
    );
  return {
    cls: 'msline',
    l: noLength
      ? '*'
      : align === 'right' || align === 'decimalpoint'
        ? p + xnum(length)
        : p,
    cells: noLength
      ? [cell('mslinemax')]
      : repeat(xnum(length), () => cell('msline')),
  };
}

/**
 * @param {XElement} node  The mscarries
 * @param {number} p       The position offset
 * @param {Context} ctx    The context for the stack
 * @returns {Row}          The row for the carries
 */
function mscarries(node: XElement, p: number, ctx: Context): Row {
  const kids = elements(node);
  const l1 = ctx.align === 'left' ? 0 : kids.length;
  const size = node.attrs.scriptsizemultiplier;
  const wrap = (content: XNode[]): XNode[] =>
    size === undefined
      ? content
      : [
          el(
            'mstyle',
            { mathsize: `${Math.round(xnum(size) / 0.007)}%` },
            content
          ),
        ];
  const pick = (from: XElement) => {
    const attrs: Attrs = {};
    for (const name of Object.keys(from.attrs)) {
      if (name === 'location' || name === 'crossout') {
        attrs[name] = from.attrs[name];
      }
    }
    return attrs;
  };
  return {
    cls: 'mscarries',
    l: p + l1 + sum(node, 'position'),
    cells: kids.map((kid) =>
      kid.name === 'mscarry'
        ? el('mtd', pick(kid), wrap(kid.children.flatMap(apply)))
        : el('mtd', pick(node), wrap(apply(kid)))
    ),
  };
}

/*****************************************************************/
/*
 *  Post-processing of the table for mstack (draws the lines)
 */

/**
 * Process the children of a node (handling mtr elements that
 * depend on their siblings).
 *
 * @param {XNode[]} children  The children to process
 * @returns {XNode[]}         The processed children
 */
function mlChildren(children: XNode[]): XNode[] {
  const els = children.filter(isEl);
  let i = 0;
  return children.flatMap((child) => {
    if (!isEl(child)) return [child];
    const first = i === 0;
    const next = els[++i];
    return mlElement(child, first, next);
  });
}

/**
 * @param {XElement} node  An element to process
 * @returns {XElement[]}   The mtd children of the node
 */
function cellsOf(node: XElement): XElement[] {
  return elements(node).filter((kid) => kid.name === 'mtd');
}

/**
 * @param {XElement} node   The element to process
 * @param {boolean} first   True if the node is the first element child of its parent
 * @param {XElement} next   The next element sibling (if any)
 * @returns {XNode[]}       The processed node
 */
function mlElement(node: XElement, first: boolean, next?: XElement): XNode[] {
  if (node.name === 'none') {
    return [el('mrow')];
  }
  if (node.name === 'mtr') {
    if (node.attrs.class === 'msline') {
      return first ? [mlFirstLine(node)] : [];
    }
    if (next?.attrs.class === 'msline') {
      return [mlBeforeLine(node, next)];
    }
  }
  return [el(node.name, node.attrs, mlChildren(node.children))];
}

/**
 * @param {XElement} node  An mtr that is an msline and is the first row
 * @returns {XElement}     The mtr with the line drawn as a border
 */
function mlFirstLine(node: XElement): XElement {
  return el(
    'mtr',
    node.attrs,
    cellsOf(node).map((cell) =>
      el(
        'mtd',
        cell.attrs,
        hasChild(cell, 'mpadded')
          ? el(
              'menclose',
              { notation: 'bottom' },
              el(
                'mpadded',
                { depth: '.1em', height: '1em', width: '.5em' },
                el('mspace', { width: '.2em' })
              )
            )
          : []
      )
    )
  );
}

/**
 * @param {XElement} node  An mtr that is followed by an msline row
 * @param {XElement} line  The msline row
 * @returns {XElement}     The mtr with the line drawn below it
 */
function mlBeforeLine(node: XElement, line: XElement): XElement {
  const lineCells = cellsOf(line);
  return el(
    'mtr',
    node.attrs,
    cellsOf(node).map((cell, i) =>
      el(
        'mtd',
        cell.attrs,
        hasChild(lineCells[i], 'mpadded')
          ? el(
              'mpadded',
              { depth: '+.2em' },
              el(
                'menclose',
                { notation: 'bottom' },
                el(
                  'mpadded',
                  { depth: '.1em', height: '.8em', width: '.8em' },
                  el('mspace', { width: '.15em' }),
                  elements(cell)
                )
              )
            )
          : elements(cell)
      )
    )
  );
}

/**
 * Post-process a table produced by mstack.
 *
 * @param {XElement} table  The table to process
 * @returns {XNode[]}       The processed table
 */
function ml(table: XElement): XNode[] {
  return mlElement(table, true);
}

/*****************************************************************/
/*
 *  mlongdiv
 */

/**
 * The table that holds the divisor and the quotient for the stacked styles
 *
 * @param {XElement} c1  The divisor
 * @param {XElement} c2  The quotient
 * @param {string} notation  The enclose notation for the divisor
 * @returns {XElement}   The table
 */
function divisorTable(
  c1: XElement | undefined,
  c2: XElement | undefined,
  notation: string
): XElement {
  return el(
    'mtable',
    { align: 'top' },
    el('mtr', {}, el('menclose', { notation }, c1)),
    el('mtr', {}, el('mtd', {}, c2))
  );
}

/**
 * Convert an mlongdiv to an mstack (and the elements that go with it).
 *
 * @param {XElement} node  The mlongdiv element
 * @returns {XNode[]}      The resulting nodes
 */
function mlongdiv(node: XElement): XNode[] {
  const [c1, c2, c3, ...rest] = elements(node);
  const style = node.attrs.longdivstyle;
  const attrs: Attrs = {};
  const dp = nearestDecimalPoint(node);
  if (dp !== undefined) attrs.decimalpoint = dp;
  const len3 = Array.from(c3 ? text(c3) : '').length;
  let content: XNode[];
  switch (style) {
    case 'left)(right':
      content = [
        el(
          'msrow',
          {},
          el('mrow', {}, c1),
          el('mo', {}, ')'),
          c3,
          el('mo', {}, '('),
          c2
        ),
      ];
      break;
    case 'left/\\right':
      content = [
        el(
          'msrow',
          {},
          el('mrow', {}, c1),
          el('mo', {}, '/'),
          c3,
          el('mo', {}, '\\'),
          c2
        ),
      ];
      break;
    case ':right=right':
      content = [
        el('msrow', {}, c3, el('mo', {}, ':'), c1, el('mo', {}, '='), c2),
      ];
      break;
    case 'stackedrightright':
    case 'mediumstackedrightright':
    case 'shortstackedrightright':
    case 'stackedleftleft':
      attrs.align = 'top';
      content = [c3];
      break;
    case 'stackedleftlinetop':
      content = [
        c2,
        el('msline', { length: `${len3}` }),
        el(
          'msrow',
          {},
          el('mrow', {}, el('menclose', { notation: 'bottom right' }, c1)),
          c3
        ),
      ];
      break;
    case 'righttop':
      content = [
        c2,
        el('msline', { length: `${len3}` }),
        el(
          'msrow',
          {},
          c3,
          el('menclose', { notation: 'top left bottom' }, c1)
        ),
      ];
      break;
    default:
      content = [
        c2,
        el('msline', { length: `${len3 + 1}` }),
        el(
          'msrow',
          {},
          el('mrow', {}, c1, el('mspace', { width: '.2em' })),
          el(
            'mpadded',
            {
              voffset: '.1em',
              lspace: '-.15em',
              depth: '-.2em',
              height: '-.2em',
            },
            el('mo', { minsize: '1.2em' }, ')')
          ),
          c3
        ),
      ];
  }
  const stack = () => mstack(el('mstack', attrs, content, rest));
  switch (style) {
    case 'stackedrightright':
      return [
        el('menclose', { notation: 'right' }, stack()),
        divisorTable(c1, c2, 'bottom'),
      ];
    case 'mediumstackedrightright':
      return [
        ...stack(),
        el('menclose', { notation: 'left' }, divisorTable(c1, c2, 'bottom')),
      ];
    case 'shortstackedrightright':
      return [...stack(), divisorTable(c1, c2, 'left bottom')];
    case 'stackedleftleft':
      return [
        divisorTable(c1, c2, 'bottom'),
        el('menclose', { notation: 'left' }, stack()),
      ];
  }
  return stack();
}
