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

export interface StringColor {
  background: string;
  alphaback?: string;
  foreground: string;
  alphafore?: string;
}

export type Color = ChannelColor | NamedColor;

const namedColors: { [key: string]: ChannelColor } = {
  red: { red: 255, green: 0, blue: 0 },
  green: { red: 0, green: 255, blue: 0 },
  blue: { red: 0, green: 0, blue: 255 },
  yellow: { red: 255, green: 255, blue: 0 },
  cyan: { red: 0, green: 255, blue: 255 },
  magenta: { red: 255, green: 0, blue: 255 },
  white: { red: 255, green: 255, blue: 255 },
  black: { red: 0, green: 0, blue: 0 }
};

/**
 * Turns a color definition a channel color definition. Augments it if
 * necessary.
 *
 * @param color The definition.
 * @param deflt The default color if color does not exist.
 * @returns The augmented color definition.
 */
function getChannelColor(color: Color, deflt: string): ChannelColor {
  const col = color || { color: deflt };
  let channel = Object.prototype.hasOwnProperty.call(col, 'color')
    ? namedColors[(col as NamedColor).color]
    : col;
  if (!channel) {
    channel = namedColors[deflt];
  }
  channel.alpha = Object.prototype.hasOwnProperty.call(col, 'alpha')
    ? col.alpha
    : 1;
  return normalizeColor(channel as ChannelColor);
}

/**
 * Normalizes the color channels, i.e., rgb in [0,255] and alpha in [0,1].
 *
 * @param color The color definition.
 * @returns The normalized color definition.
 */
function normalizeColor(color: ChannelColor): ChannelColor {
  const normalizeCol = (col: number) => {
    col = Math.max(col, 0);
    col = Math.min(255, col);
    return Math.round(col);
  };
  color.red = normalizeCol(color.red);
  color.green = normalizeCol(color.green);
  color.blue = normalizeCol(color.blue);
  color.alpha = Math.max(color.alpha, 0);
  color.alpha = Math.min(1, color.alpha);
  return color;
}

export class ColorPicker {
  /**
   * The default background color if a none existing color is provided.
   */
  private static DEFAULT_BACKGROUND_ = 'blue';

  /**
   * The default color if a none existing color is provided.
   */
  private static DEFAULT_FOREGROUND_ = 'black';

  /**
   * The foreground color in RGBa.
   */
  public foreground: ChannelColor;

  /**
   * The background color in RGBa.
   */
  public background: ChannelColor;

  /**
   * Color picker class.
   *
   * @param background The background color definition.
   * @param foreground The optional foreground color definition.
   */
  constructor(background: Color, foreground?: Color) {
    this.foreground = getChannelColor(
      foreground,
      ColorPicker.DEFAULT_FOREGROUND_
    );
    this.background = getChannelColor(
      background,
      ColorPicker.DEFAULT_BACKGROUND_
    );
  }

  /**
   * RGBa version of the colors.
   *
   * @returns The color in RGBa format.
   */
  public rgba(): StringColor {
    const rgba = function (col: ChannelColor) {
      return (
        'rgba(' +
        col.red +
        ',' +
        col.green +
        ',' +
        col.blue +
        ',' +
        col.alpha +
        ')'
      );
    };
    return {
      background: rgba(this.background),
      foreground: rgba(this.foreground)
    };
  }

  // /**
  //  * RGB version of the colors.
  //  *
  //  * @returns The color in Rgb format.
  //  */
  // public rgb(): StringColor {
  //   const rgb = function (col: ChannelColor) {
  //     return 'rgb(' + col.red + ',' + col.green + ',' + col.blue + ')';
  //   };
  //   return {
  //     background: rgb(this.background),
  //     alphaback: this.background.alpha.toString(),
  //     foreground: rgb(this.foreground),
  //     alphafore: this.foreground.alpha.toString()
  //   };
  // }

}

export interface Highlighter {
  /**
   * Sets highlighting on a node.
   *
   * @param nodes The nodes to highlight.
   */
  highlight(nodes: HTMLElement[]): void;

  /**
   * Unhighlights the last nodes that were highlighted.
   */
  unhighlight(): void;

  /**
   * Sets highlighting on all maction-like sub nodes of the given node.
   *
   * @param node The node to highlight.
   */
  highlightAll(node: HTMLElement): void;

  /**
   * Unhighlights all currently highlighted nodes.
   */
  unhighlightAll(): void;

  /**
   * Predicate to check if a node is an maction node.
   *
   * @param node A DOM node.
   * @returns True if the node is an maction node.
   */
  isMactionNode(node: Element): boolean;

  /**
   * Sets of the color the highlighter is using.
   *
   * @param color The new color to use.
   */
  setColor(color: ColorPicker): void;

  /**
   * Turns the current color into a string representation.
   *
   * @returns The color string, by default as rgba.
   */
  colorString(): StringColor;

}

/**
 * Highlight information consisting of node, opacity, fore and background color.
 */
export interface Highlight {
  node: HTMLElement;
  opacity?: string;
  background?: string;
  foreground?: string;
  // The following is for the CSS highlighter
  box?: HTMLElement;
  position?: string;
}

let counter = 0;

export abstract class AbstractHighlighter implements Highlighter {
  public counter = counter++;

  /**
   * The Attribute for marking highlighted nodes.
   */
  protected ATTR = 'sre-highlight-' + this.counter.toString();

  /**
   * The color picker.
   */
  protected color: ColorPicker = null;

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
  public setColor(color: ColorPicker) {
    this.color = color;
  }

  /**
   * @override
   */
  public colorString(): StringColor {
    return this.color.rgba();
  }

  /**
   * Returns the maction sub nodes of a given node.
   *
   * @param node The root node.
   * @returns The list of maction sub nodes.
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
   * @param node The node.
   * @returns True if already highlighted.
   */
  public isHighlighted(node: HTMLElement): boolean {
    return node.hasAttribute(this.ATTR);
  }

  /**
   * Sets the indicator attribute that node is already highlighted.
   *
   * @param node The node.
   */
  public setHighlighted(node: HTMLElement) {
    node.setAttribute(this.ATTR, 'true');
  }

  /**
   * Removes the indicator attribute that node is already highlighted.
   *
   * @param node The node.
   */
  public unsetHighlighted(node: HTMLElement) {
    node.removeAttribute(this.ATTR);
  }

}

export class SvgHighlighter extends AbstractHighlighter {
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
        background: this.colorString().background,
        foreground: this.colorString().foreground
      };
      return info;
    }
    if (node.tagName === 'svg' || node.tagName === 'MJX-CONTAINER') {
      info = {
        node: node,
        background: node.style.backgroundColor,
        foreground: node.style.color
      };
      node.style.backgroundColor = this.colorString().background;
      node.style.color = this.colorString().foreground;
      return info;
    }
    // This is a hack for v4.
    // TODO: v4 Change
    // const rect = (document ?? DomUtil).createElementNS(
    const rect = (document).createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
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
    rect.setAttribute('fill', this.colorString().background);
    node.setAttribute(this.ATTR, 'true');
    node.parentNode.insertBefore(rect, node);
    info = { node: node, foreground: node.getAttribute('fill') };
    if (node.nodeName !== 'rect') {
      // We currently do not change foreground of collapsed nodes.
      node.setAttribute('fill', this.colorString().foreground);
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

export class ChtmlHighlighter extends AbstractHighlighter {

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
      foreground: node.style.color
    };
    if (!this.isHighlighted(node)) {
      const color = this.colorString();
      node.style.backgroundColor = color.background;
      node.style.color = color.foreground;
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
 * Produces a highlighter that goes with the current Mathjax renderer if
 * highlighting is possible.
 *
 * @param back A background color specification.
 * @param fore A foreground color specification.
 * @param rendererInfo Information on renderer,
 * browser. Has to at least contain the renderer field.
 * @param rendererInfo.renderer The renderer name.
 * @param rendererInfo.browser The browser name.
 * @returns A new highlighter.
 */
export function getHighlighter(
  back: Color,
  fore: Color,
  renderer: string
): Highlighter {
  const colorPicker = new ColorPicker(back, fore);
  const highlighter = new (highlighterMapping[renderer] ||
    highlighterMapping['NativeMML'])();
  highlighter.setColor(colorPicker);
  return highlighter;
}

/**
 * Updates the color setting for the given highlighter using named colors.
 * Note, this is only used outside SRE, hence exported!
 *
 * @param back Background color as a named color.
 * @param fore Foreground color as a named color.
 * @param highlighter The highlighter to update.
 */
export function updateHighlighter(back: Color, fore: Color, highlighter: Highlighter) {
  const colorPicker = new ColorPicker(back, fore);
  highlighter.setColor(colorPicker);
}

const highlighterMapping: { [key: string]: new () => Highlighter } = {
  SVG: SvgHighlighter,
  CHTML: ChtmlHighlighter
};
