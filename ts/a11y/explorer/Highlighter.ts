//
// Copyright 2025 Volker Sorge
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @file Highlighter for exploring nodes.
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

interface NamedColor {
  color: string;
  alpha?: number;
  type?: string;
}

/**
 * Turns a named color into a channel color.
 *
 * @param {NamedColor} color The definition.
 * @param {NamedColor} deflt The default color name if the named color does not exist.
 * @returns {string} The channel color.
 */
function getColorString(color: NamedColor, deflt: NamedColor): string {
  const type = deflt.type;
  const name = color.color ?? deflt.color;
  const opacity = color.alpha ?? deflt.alpha;
  const alpha = opacity === 1 ? 1 : `var(--mjx-${type}-alpha)`;
  return `rgba(var(--mjx-${type}-${name}), ${alpha})`;
}

/**
 * The default background color if a none existing color is provided.
 */
const DEFAULT_BACKGROUND: NamedColor = { color: 'blue', alpha: 1, type: 'bg' };

/**
 * The default color if a none existing color is provided.
 */
const DEFAULT_FOREGROUND: NamedColor = { color: 'black', alpha: 1, type: 'fg' };

export interface Highlighter {
  /**
   * Sets highlighting on a node.
   *
   * @param {HTMLElement} nodes The nodes to highlight.
   */
  highlight(nodes: HTMLElement[]): void;

  /**
   * Unhighlights the last nodes that were highlighted.
   */
  unhighlight(): void;

  /**
   * Sets highlighting on all maction-like sub nodes of the given node.
   *
   * @param {HTMLElement} node The node to highlight.
   */
  highlightAll(node: HTMLElement): void;

  /**
   * Unhighlights all currently highlighted nodes.
   */
  unhighlightAll(): void;

  /**
   * Encloses multiple nodes if they in the same line
   *
   * @param {HTMLElement[]} parts   The elements to be selected
   * @param {HTMLElement} node      The root node of the expression
   * @returns {HTMLElement[]}       The elements that shoudl be highlighted
   */
  encloseNodes(parts: HTMLElement[], node: HTMLElement): HTMLElement[];

  /**
   * Predicate to check if a node is an maction node.
   *
   * @param {Element} node A DOM node.
   * @returns {boolean} True if the node is an maction node.
   */
  isMactionNode(node: Element): boolean;

  /**
   * @returns {string} The foreground color as rgba string.
   */
  get foreground(): string;

  /**
   * @returns {string} The background color as rgba string.
   */
  get background(): string;

  /**
   * Sets of the color the highlighter is using.
   *
   * @param {NamedColor} background The new background color to use.
   * @param {NamedColor} foreground The new foreground color to use.
   */
  setColor(background: NamedColor, foreground: NamedColor): void;
}

/**
 * Highlight information consisting of node, fore and background color.
 */
interface Highlight {
  node: HTMLElement;
  background?: string;
  foreground?: string;
}

let counter = 0;

abstract class AbstractHighlighter implements Highlighter {
  /**
   * This counter creates a unique highlighter name. This is important in case
   * we have more than a single highlighter on a node, e.g., during auto voicing
   * with synchronised highlighting.
   */
  public counter = counter++;

  /**
   * The Attribute for marking highlighted nodes.
   */
  protected ATTR = 'data-sre-highlight-' + this.counter.toString();

  /**
   * The foreground color.
   */
  private _foreground: string;

  /**
   * The background color.
   */
  private _background: string;

  /**
   * The maction name/class for a highlighter.
   */
  protected mactionName = '';

  /**
   * The CSS selector to use to find the line-box container.
   */
  protected static lineSelector = '';

  /**
   * The attribute name for the line number.
   */
  protected static lineAttr = '';

  /**
   * List of currently highlighted nodes and their original background color.
   */
  private currentHighlights: Highlight[][] = [];

  /**
   * Highlights a single node.
   *
   * @param node The node to be highlighted.
   * @returns The old node information.
   */
  protected abstract highlightNode(node: HTMLElement): Highlight;

  /**
   * Unhighlights a single node.
   *
   * @param highlight The highlight info for the node to be unhighlighted.
   */
  protected abstract unhighlightNode(highlight: Highlight): void;

  /**
   * @override
   */
  public highlight(nodes: HTMLElement[]) {
    this.currentHighlights.push(
      nodes.map((node) => {
        const info = this.highlightNode(node);
        this.setHighlighted(node);
        return info;
      })
    );
  }

  /**
   * @override
   */
  public highlightAll(node: HTMLElement) {
    const mactions = this.getMactionNodes(node);
    for (let i = 0, maction; (maction = mactions[i]); i++) {
      this.highlight([maction]);
    }
  }

  /**
   * @override
   */
  public unhighlight() {
    const nodes = this.currentHighlights.pop();
    if (!nodes) {
      return;
    }
    nodes.forEach((highlight: Highlight) => {
      if (this.isHighlighted(highlight.node)) {
        this.unhighlightNode(highlight);
        this.unsetHighlighted(highlight.node);
      }
    });
  }

  /**
   * @override
   */
  public unhighlightAll() {
    while (this.currentHighlights.length > 0) {
      this.unhighlight();
    }
  }

  /**
   * Create a container of a given size and position.
   *
   * @param {number} x           The x-coordinate for the container
   * @param {number} y           The y-coordinate for the container
   * @param {number} w           The width for the container
   * @param {number} h           The height for the container
   * @param {HTMLElement} node   The mjx-container element
   * @param {HTMLElement} part   The first node in the line to be enclosed
   * @returns {HTMLElement}      The element of the given size
   */
  protected abstract createEnclosure(
    x: number,
    y: number,
    w: number,
    h: number,
    node: HTMLElement,
    part: HTMLElement
  ): HTMLElement;

  /**
   * @override
   */
  public encloseNodes(parts: HTMLElement[], node: HTMLElement): HTMLElement[] {
    if (parts.length === 1) {
      return parts;
    }
    const CLASS = this.constructor as typeof AbstractHighlighter;
    const selector = CLASS.lineSelector;
    const lineno = CLASS.lineAttr;
    const lines: Map<string, HTMLElement[]> = new Map();
    for (const part of parts) {
      const line = part.closest(selector);
      const n = line ? line.getAttribute(lineno) : '';
      if (!lines.has(n)) {
        lines.set(n, []);
      }
      lines.get(n).push(part);
    }
    for (const list of lines.values()) {
      if (list.length > 1) {
        let [L, T, R, B] = [Infinity, Infinity, -Infinity, -Infinity];
        for (const part of list) {
          part.setAttribute('data-mjx-enclosed', 'true');
          const { left, top, right, bottom } = part.getBoundingClientRect();
          if (top === bottom && left === right) continue;
          if (left < L) L = left;
          if (top < T) T = top;
          if (bottom > B) B = bottom;
          if (right > R) R = right;
        }
        const enclosure = this.createEnclosure(
          L,
          B,
          R - L,
          B - T,
          node,
          list[0]
        );
        parts.push(enclosure);
      }
    }
    return parts;
  }

  /**
   * @override
   */
  public setColor(background: NamedColor, foreground: NamedColor) {
    this._foreground = getColorString(foreground, DEFAULT_FOREGROUND);
    this._background = getColorString(background, DEFAULT_BACKGROUND);
  }

  /**
   * @override
   */
  public get foreground(): string {
    return this._foreground;
  }

  /**
   * @override
   */
  public get background(): string {
    return this._background;
  }

  /**
   * Returns the maction sub nodes of a given node.
   *
   * @param {HTMLElement} node The root node.
   * @returns {HTMLElement[]} The list of maction sub nodes.
   */
  public getMactionNodes(node: HTMLElement): HTMLElement[] {
    return Array.from(
      node.getElementsByClassName(this.mactionName)
    ) as HTMLElement[];
  }

  /**
   * @override
   */
  public isMactionNode(node: Element): boolean {
    const className = node.className || node.getAttribute('class');
    return className ? !!className.match(new RegExp(this.mactionName)) : false;
  }

  /**
   * Check if a node is already highlighted.
   *
   * @param {HTMLElement} node The node.
   * @returns {boolean} True if already highlighted.
   */
  public isHighlighted(node: HTMLElement): boolean {
    return node.hasAttribute(this.ATTR);
  }

  /**
   * Sets the indicator attribute that node is already highlighted.
   *
   * @param {HTMLElement} node The node.
   */
  public setHighlighted(node: HTMLElement) {
    node.setAttribute(this.ATTR, 'true');
  }

  /**
   * Removes the indicator attribute that node is already highlighted.
   *
   * @param {HTMLElement} node The node.
   */
  public unsetHighlighted(node: HTMLElement) {
    node.removeAttribute(this.ATTR);
  }
}

class SvgHighlighter extends AbstractHighlighter {
  protected static lineSelector = '[data-mjx-linebox]';
  protected static lineAttr = 'data-mjx-lineno';

  /**
   * @override
   */
  constructor() {
    super();
    this.mactionName = 'maction';
  }

  /**
   * @override
   */
  public highlightNode(node: HTMLElement) {
    let info: Highlight;
    if (this.isHighlighted(node)) {
      info = {
        node: node,
        background: this.background,
        foreground: this.foreground,
      };
      return info;
    }
    if (node.tagName === 'svg' || node.tagName === 'MJX-CONTAINER') {
      info = {
        node: node,
        background: node.style.backgroundColor,
        foreground: node.style.color,
      };
      if (!node.hasAttribute('data-mjx-enclosed')) {
        node.style.backgroundColor = this.background;
      }
      node.style.color = this.foreground;
      return info;
    }
    if (node.hasAttribute('data-sre-highlighter-bbox')) {
      node.setAttribute(this.ATTR, 'true');
      node.setAttribute('fill', this.background);
      return { node: node, foreground: 'none' };
    }
    if (!node.hasAttribute('data-mjx-enclosed')) {
      const { x, y, width, height } = (
        node as any as SVGGraphicsElement
      ).getBBox();
      const rect = this.createRect(
        x,
        y,
        width,
        height,
        node.getAttribute('transform')
      );
      rect.setAttribute('fill', this.background);
      node.parentNode.insertBefore(rect, node);
    }
    node.setAttribute(this.ATTR, 'true');
    info = { node: node, foreground: node.getAttribute('fill') };
    if (node.nodeName !== 'rect') {
      // We currently do not change foreground of collapsed nodes.
      node.setAttribute('fill', this.foreground);
    }
    return info;
  }

  /**
   * @override
   */
  public setHighlighted(node: HTMLElement) {
    if (node.tagName === 'svg') {
      super.setHighlighted(node);
    }
  }

  /**
   * @override
   */
  public unhighlightNode(info: Highlight) {
    const node = info.node;
    if (node.hasAttribute('data-sre-highlighter-bbox')) {
      node.remove();
      return;
    }
    if (node.tagName === 'svg' || node.tagName === 'MJX-CONTAINER') {
      if (!node.hasAttribute('data-mjx-enclosed')) {
        node.style.backgroundColor = info.background;
      }
      node.removeAttribute('data-mjx-enclosed');
      node.style.color = info.foreground;
      return;
    }
    const previous = node.previousSibling as HTMLElement;
    if (previous?.hasAttribute('data-sre-highlighter-added')) {
      previous.remove();
    }
    node.removeAttribute('data-mjx-enclosed');
    if (info.foreground) {
      node.setAttribute('fill', info.foreground);
    } else {
      node.removeAttribute('fill');
    }
  }

  /**
   * @override
   */
  protected createEnclosure(
    x: number,
    y: number,
    w: number,
    h: number,
    _node: HTMLElement,
    part: HTMLElement
  ): HTMLElement {
    const [x1, y1] = this.screen2svg(x, y, part);
    const [x2, y2] = this.screen2svg(x + w, y - h, part);
    const rect = this.createRect(
      x1,
      y1,
      x2 - x1,
      y2 - y1,
      part.getAttribute('transform')
    );
    rect.setAttribute('data-sre-highlighter-bbox', 'true');
    part.parentNode.insertBefore(rect, part);
    return rect;
  }

  /**
   * Convert screen coordinates in px to local SVG coordinates.
   *
   * @param {number} x           The screen x coordinate
   * @param {number} y           The screen y coordinate
   * @param {HTMLElement} part   The element whose coordinate system is to be used
   * @returns {number[]}         The x,y coordinates in the coordinates of part
   */
  protected screen2svg(x: number, y: number, part: HTMLElement): number[] {
    const node = part as any as SVGGraphicsElement;
    const P = DOMPoint.fromPoint({ x, y }).matrixTransform(
      node.getScreenCTM().inverse()
    );
    return [P.x, P.y];
  }

  /**
   * Create a rectangle of the given size and position.
   *
   * @param {number} x           The x position of the rectangle
   * @param {number} y           The y position of the rectangle
   * @param {number} w           The width of the rectangle
   * @param {number} h           The height of the rectangle
   * @param {string} transform   The transform to apply, if any
   * @returns {HTMLElement}      The generated rectangle element
   */
  protected createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    transform: string
  ): HTMLElement {
    const padding = 40;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute(
      'data-sre-highlighter-added', // Mark highlighting rect.
      'true'
    );
    rect.setAttribute('x', String(x - padding));
    rect.setAttribute('y', String(y - padding));
    rect.setAttribute('width', String(w + 2 * padding));
    rect.setAttribute('height', String(h + 2 * padding));
    if (transform) {
      rect.setAttribute('transform', transform);
    }
    return rect as any as HTMLElement;
  }

  /**
   * @override
   */
  public isMactionNode(node: HTMLElement) {
    return node.getAttribute('data-mml-node') === this.mactionName;
  }

  /**
   * @override
   */
  public getMactionNodes(node: HTMLElement) {
    return Array.from(
      node.querySelectorAll(`[data-mml-node="${this.mactionName}"]`)
    ) as HTMLElement[];
  }
}

class ChtmlHighlighter extends AbstractHighlighter {
  protected static lineSelector = 'mjx-linebox';
  protected static lineAttr = 'lineno';

  /**
   * @override
   */
  constructor() {
    super();
    this.mactionName = 'mjx-maction';
  }

  /**
   * @override
   */
  public highlightNode(node: HTMLElement) {
    const info = {
      node: node,
      background: node.style.backgroundColor,
      foreground: node.style.color,
    };
    if (!this.isHighlighted(node)) {
      if (!node.hasAttribute('data-mjx-enclosed')) {
        node.style.backgroundColor = this.background;
      }
      node.style.color = this.foreground;
    }
    return info;
  }

  /**
   * @override
   */
  public unhighlightNode(info: Highlight) {
    const node = info.node;
    node.style.backgroundColor = info.background;
    node.style.color = info.foreground;
    node.removeAttribute('data-mjx-enclosed');
    if (node.tagName.toLowerCase() === 'mjx-bbox') {
      node.remove();
    }
  }

  /**
   * @override
   */
  protected createEnclosure(
    x: number,
    y: number,
    w: number,
    h: number,
    node: HTMLElement
  ): HTMLElement {
    const base = node.getBoundingClientRect();
    const enclosure = document.createElement('mjx-bbox');
    enclosure.style.width = w + 'px';
    enclosure.style.height = h + 'px';
    enclosure.style.left = x - base.left + 'px';
    enclosure.style.top = y - h - base.top + 'px';
    enclosure.style.position = 'absolute';
    node.prepend(enclosure);
    return enclosure;
  }

  /**
   * @override
   */
  public isMactionNode(node: HTMLElement) {
    return node.tagName?.toUpperCase() === this.mactionName.toUpperCase();
  }

  /**
   * @override
   */
  public getMactionNodes(node: HTMLElement) {
    return Array.from(
      node.getElementsByTagName(this.mactionName)
    ) as HTMLElement[];
  }
}

/**
 * Highlighter factory that returns the highlighter that goes with the current
 * Mathjax renderer.
 *
 * @param {NamedColor} back A background color specification.
 * @param {NamedColor} fore A foreground color specification.
 * @param {string} renderer The renderer name.
 * @returns {Highlighter} A new highlighter.
 */
export function getHighlighter(
  back: NamedColor,
  fore: NamedColor,
  renderer: string
): Highlighter {
  const highlighter = new highlighterMapping[renderer]();
  highlighter.setColor(back, fore);
  return highlighter;
}

/**
 * Mapping renderer names to highlighter constructor.
 */
const highlighterMapping: { [key: string]: new () => Highlighter } = {
  SVG: SvgHighlighter,
  CHTML: ChtmlHighlighter,
  generic: ChtmlHighlighter,
};
