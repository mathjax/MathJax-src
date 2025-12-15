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

import { LiveRegion } from './Region.js';

export interface NamedColor {
  color: string;
  alpha?: number;
}

/**
 * The default background color if a none existing color is provided.
 */
const DEFAULT_BACKGROUND: NamedColor = { color: 'blue', alpha: 0.2 };

/**
 * The default color if a none existing color is provided.
 */
const DEFAULT_FOREGROUND: NamedColor = { color: 'black', alpha: 1 };

/**
 * The attributes for various markers
 */
export const ATTR = {
  ENCLOSED: 'data-sre-enclosed',
  BBOX: 'data-sre-highlighter-bbox',
  ADDED: 'data-sre-highlighter-added',
};

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
   * Returns the maction sub nodes of a given node.
   *
   * @param {HTMLElement} node The root node.
   * @returns {HTMLElement[]} The list of maction sub nodes.
   */
  getMactionNodes(node: HTMLElement): HTMLElement[];

  /**
   * Sets of the color the highlighter is using.
   *
   * @param {NamedColor} background The new background color to use.
   * @param {NamedColor} foreground The new foreground color to use.
   */
  setColor(background: NamedColor, foreground: NamedColor): void;
}

abstract class AbstractHighlighter implements Highlighter {
  /**
   * The Attribute for marking highlighted nodes.
   */
  protected ATTR: string;

  /**
   * The CSS selector to use to find the line-box container.
   */
  protected static lineSelector: string;

  /**
   * The attribute name for the line number.
   */
  protected static lineAttr: string;

  /**
   * Primary highlighter = 1, secondary highlighter = 2
   */
  protected priority: number;

  /**
   * List of currently highlighted nodes and their original background color.
   */
  private currentHighlights: HTMLElement[][] = [];

  /**
   * @param {number} priority   1 = primary, 2 = secondary
   */
  constructor(priority: number) {
    this.priority = priority;
    this.ATTR = 'data-sre-highlight-' + priority;
  }

  /**
   * Highlights a single node.
   *
   * @param {HTMLElement} node The node to be highlighted.
   */
  protected abstract highlightNode(node: HTMLElement): void;

  /**
   * Unhighlights a single node.
   *
   * @param {HTMLElement} node  The highlight info for the node to be unhighlighted.
   */
  protected abstract unhighlightNode(node: HTMLElement): void;

  /**
   * @override
   */
  public highlight(nodes: HTMLElement[]) {
    this.currentHighlights.push(nodes);
    for (const node of nodes) {
      this.highlightNode(node);
      this.setHighlighted(node);
    }
  }

  /**
   * @override
   */
  public highlightAll(node: HTMLElement) {
    const mactions = this.getMactionNodes(node);
    for (const maction of mactions) {
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
    nodes.forEach((node: HTMLElement) => {
      if (this.isHighlighted(node)) {
        this.unhighlightNode(node);
        this.unsetHighlighted(node);
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
          part.setAttribute(ATTR.ENCLOSED, 'true');
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
   * @param {string} type        fg or bg
   * @param {NamedColor} color   The color to set
   * @param {NamedColor} def     The defaults to use for missing parts of the color
   */
  protected setColorCSS(type: string, color: NamedColor, def: NamedColor) {
    const name = color.color ?? def.color;
    const alpha = color.alpha ?? def.alpha;
    LiveRegion.setColor(type, this.priority, name, alpha);
  }

  /**
   * @override
   */
  public setColor(background: NamedColor, foreground: NamedColor) {
    this.setColorCSS('fg', foreground, DEFAULT_FOREGROUND);
    this.setColorCSS('bg', background, DEFAULT_BACKGROUND);
  }

  /**
   * Returns the maction sub nodes of a given node.
   *
   * @param {HTMLElement} node The root node.
   * @returns {HTMLElement[]} The list of maction sub nodes.
   */
  public abstract getMactionNodes(node: HTMLElement): HTMLElement[];

  /**
   * @override
   */
  public abstract isMactionNode(node: Element): boolean;

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
    node.removeAttribute(ATTR.ENCLOSED);
  }
}

class SvgHighlighter extends AbstractHighlighter {
  protected static lineSelector = '[data-mjx-linebox]';
  protected static lineAttr = 'data-mjx-lineno';

  /**
   * @override
   */
  public highlightNode(node: HTMLElement) {
    if (
      this.isHighlighted(node) ||
      node.tagName === 'svg' ||
      node.tagName === 'MJX-CONTAINER' ||
      node.hasAttribute(ATTR.BBOX) ||
      node.hasAttribute(ATTR.ENCLOSED)
    ) {
      return;
    }
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
    this.setHighlighted(rect);
    node.parentNode.insertBefore(rect, node);
  }

  /**
   * @override
   */
  public unhighlightNode(node: HTMLElement) {
    if (node.hasAttribute(ATTR.BBOX)) {
      node.remove();
      return;
    }
    const previous = node.previousSibling as HTMLElement;
    if (previous?.hasAttribute(ATTR.ADDED)) {
      previous.remove();
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
    rect.setAttribute(ATTR.BBOX, 'true');
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
    rect.setAttribute(ATTR.ADDED, 'true'); // Mark highlighting rect.
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
    return node.getAttribute('data-mml-node') === 'maction';
  }

  /**
   * @override
   */
  public getMactionNodes(node: HTMLElement): HTMLElement[] {
    return Array.from(node.querySelectorAll('[data-mml-node="maction"]'));
  }
}

class ChtmlHighlighter extends AbstractHighlighter {
  protected static lineSelector = 'mjx-linebox';
  protected static lineAttr = 'lineno';

  /**
   * @override
   */
  public highlightNode(_node: HTMLElement) {}

  /**
   * @override
   */
  public unhighlightNode(node: HTMLElement) {
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
    return node.tagName?.toLowerCase() === 'mjx-maction';
  }

  /**
   * @override
   */
  public getMactionNodes(node: HTMLElement): HTMLElement[] {
    return Array.from(node.querySelectorAll('mjx-maction'));
  }
}

/**
 * Highlighter factory that returns the highlighter that goes with the current
 * Mathjax renderer.
 *
 * @param {number} priority 1 = primary, 2 = secondary highlighter.
 * @param {NamedColor} back A background color specification.
 * @param {NamedColor} fore A foreground color specification.
 * @param {string} renderer The renderer name.
 * @returns {Highlighter} A new highlighter.
 */
export function getHighlighter(
  priority: number,
  back: NamedColor,
  fore: NamedColor,
  renderer: string
): Highlighter {
  const highlighter = new highlighterMapping[renderer](priority);
  highlighter.setColor(back, fore);
  return highlighter;
}

/**
 * Mapping renderer names to highlighter constructor.
 */
const highlighterMapping: {
  [key: string]: new (priority: number) => Highlighter;
} = {
  SVG: SvgHighlighter,
  CHTML: ChtmlHighlighter,
  generic: ChtmlHighlighter,
};
