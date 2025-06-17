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
}

interface ChannelColor {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

const namedColors: { [key: string]: ChannelColor } = {
  red: { red: 255, green: 0, blue: 0 },
  green: { red: 0, green: 255, blue: 0 },
  blue: { red: 0, green: 0, blue: 255 },
  yellow: { red: 255, green: 255, blue: 0 },
  cyan: { red: 0, green: 255, blue: 255 },
  magenta: { red: 255, green: 0, blue: 255 },
  white: { red: 255, green: 255, blue: 255 },
  black: { red: 0, green: 0, blue: 0 },
};

/**
 * Turns a named color into a channel color.
 *
 * @param {NamedColor} color The definition.
 * @param {NamedColor} deflt The default color name if the named color does not exist.
 * @returns {string} The channel color.
 */
function getColorString(color: NamedColor, deflt: NamedColor): string {
  const channel = namedColors[color.color] || namedColors[deflt.color];
  channel.alpha = color.alpha ?? deflt.alpha;
  return rgba(channel);
}

/**
 * RGBa string version of the channel color.
 *
 * @param {ChannelColor} color The channel color.
 * @returns {string} The color in RGBa format.
 */
function rgba(color: ChannelColor): string {
  return `rgba(${color.red},${color.green},${color.blue},${color.alpha ?? 1})`;
}

/**
 * The default background color if a none existing color is provided.
 */
const DEFAULT_BACKGROUND: NamedColor = { color: 'blue', alpha: 1 };

/**
 * The default color if a none existing color is provided.
 */
const DEFAULT_FOREGROUND: NamedColor = { color: 'black', alpha: 1 };

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
  protected ATTR = 'sre-highlight-' + this.counter.toString();

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
      node.style.backgroundColor = this.background;
      node.style.color = this.foreground;
      return info;
    }
    // This is a hack for v4.
    // TODO: v4 Change
    // const rect = (document ?? DomUtil).createElementNS(
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute(
      'sre-highlighter-added', // Mark highlighting rect.
      'true'
    );
    const padding = 40;
    const bbox: SVGRect = (node as any as SVGGraphicsElement).getBBox();
    rect.setAttribute('x', (bbox.x - padding).toString());
    rect.setAttribute('y', (bbox.y - padding).toString());
    rect.setAttribute('width', (bbox.width + 2 * padding).toString());
    rect.setAttribute('height', (bbox.height + 2 * padding).toString());
    const transform = node.getAttribute('transform');
    if (transform) {
      rect.setAttribute('transform', transform);
    }
    rect.setAttribute('fill', this.background);
    node.setAttribute(this.ATTR, 'true');
    node.parentNode.insertBefore(rect, node);
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
    const previous = info.node.previousSibling as HTMLElement;
    if (previous && previous.hasAttribute('sre-highlighter-added')) {
      info.foreground
        ? info.node.setAttribute('fill', info.foreground)
        : info.node.removeAttribute('fill');
      info.node.parentNode.removeChild(previous);
      return;
    }
    info.node.style.backgroundColor = info.background;
    info.node.style.color = info.foreground;
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
      node.style.backgroundColor = this.background;
      node.style.color = this.foreground;
    }
    return info;
  }

  /**
   * @override
   */
  public unhighlightNode(info: Highlight) {
    info.node.style.backgroundColor = info.background;
    info.node.style.color = info.foreground;
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
