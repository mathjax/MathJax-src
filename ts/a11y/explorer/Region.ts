/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
 * @file Regions for A11y purposes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { MathDocument } from '../../core/MathDocument.js';
import { StyleJsonSheet } from '../../util/StyleJson.js';
import { Highlighter } from './Highlighter.js';
import { SsmlElement, buildSpeech } from '../speech/SpeechUtil.js';

export type A11yDocument = MathDocument<HTMLElement, Text, Document>;

export interface Region<T> {
  /**
   * Adds a style sheet for the live region to the document.
   */
  AddStyles(): void;

  /**
   * Adds the region element to the document.
   */
  AddElement(): void;

  /**
   * Shows the live region in the document.
   *
   * @param {HTMLElement} node
   */
  Show(node: HTMLElement): void;

  /**
   * Takes the element out of the document flow.
   */
  Hide(): void;

  /**
   * Clears the content of the region.
   */
  Clear(): void;

  /**
   * Updates the content of the region.
   *
   * @template T
   */
  Update(content: T): void;
}

export abstract class AbstractRegion<T> implements Region<T> {
  /**
   * CSS Classname of the element.
   *
   * @type {string}
   */
  protected static className: string;

  /**
   * The CSS style that needs to be added for this type of region.
   *
   * @type {StyleJsonSheet}
   */
  protected static style: StyleJsonSheet;

  /**
   * The outer div node.
   *
   * @type {HTMLElement}
   */
  public div: HTMLElement;

  /**
   * The inner node.
   *
   * @type {HTMLElement}
   */
  protected inner: HTMLElement;

  /**
   * The actual class name to refer to static elements of a class.
   *
   * @type {typeof AbstractRegion}
   */
  protected CLASS: typeof AbstractRegion;

  /**
   * @class
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    this.CLASS = this.constructor as typeof AbstractRegion;
    this.AddStyles();
  }

  /**
   * @returns {string}   The stylesheet ID
   */
  public static get sheetId(): string {
    return 'MJX-' + this.name + '-styles';
  }

  /**
   * @returns {HTMLStyleElement}   The stylesheet for this region
   */
  public static get styleSheet(): HTMLStyleElement {
    return document.head.querySelector('#' + this.sheetId) as HTMLStyleElement;
  }

  /**
   * @override
   */
  public AddStyles() {
    const id = this.CLASS.sheetId;
    if (
      !this.CLASS.style ||
      this.document.adaptor.head().querySelector('#' + id)
    ) {
      return;
    }
    const node = this.document.adaptor.node('style', { id });
    node.innerHTML = this.CLASS.style.cssText;
    this.document.adaptor.head().appendChild(node);
  }

  /**
   * @override
   */
  public AddElement() {
    if (this.div) return;
    const element = this.document.adaptor.node('div');
    element.classList.add(this.CLASS.className);
    this.div = element;
    this.inner = this.document.adaptor.node('div');
    this.div.appendChild(this.inner);
    this.document.adaptor
      .body(this.document.adaptor.document)
      .appendChild(this.div);
  }

  /**
   * @override
   */
  public Show(node: HTMLElement) {
    this.AddElement();
    this.position(node);
    this.div.classList.add(this.CLASS.className + '_Show');
  }

  /**
   * Computes the position where to place the element wrt. to the given node.
   *
   * @param {HTMLElement} node The reference node.
   */
  protected abstract position(node: HTMLElement): void;

  /**
   * @override
   */
  public Hide() {
    if (!this.div) return;
    this.div.remove();
    this.div = null;
    this.inner = null;
  }

  /**
   * @override
   */
  public abstract Clear(): void;

  /**
   * @override
   */
  public abstract Update(content: T): void;

  /**
   * Auxiliary position method that stacks shown regions of the same type.
   *
   * @param {HTMLElement} node The reference node.
   */
  protected stackRegions(node: HTMLElement) {
    // TODO: This could be made more efficient by caching regions of a class.
    const rect = node.getBoundingClientRect();
    let baseBottom = 0;
    let baseLeft = Number.POSITIVE_INFINITY;
    const regions = this.document.adaptor.document.getElementsByClassName(
      this.CLASS.className + '_Show'
    );
    // Get all the shown regions (one is this element!) and append at bottom.
    for (let i = 0, region; (region = regions[i]); i++) {
      if (region !== this.div) {
        baseBottom = Math.max(
          region.getBoundingClientRect().bottom,
          baseBottom
        );
        baseLeft = Math.min(region.getBoundingClientRect().left, baseLeft);
      }
    }

    const bot = (baseBottom ? baseBottom : rect.bottom + 10) + window.scrollY;
    const left =
      (baseLeft < Number.POSITIVE_INFINITY ? baseLeft : rect.left) +
      window.scrollX;
    this.div.style.top = bot + 'px';
    this.div.style.left = left + 'px';
  }
}

export class DummyRegion extends AbstractRegion<void> {
  /**
   * @override
   */
  public Clear() {}

  /**
   * @override
   */
  public Update() {}

  /**
   * @override
   */
  public Hide() {}

  /**
   * @override
   */
  public Show() {}

  /**
   * @override
   */
  public AddElement() {}

  /**
   * @override
   */
  public AddStyles() {}

  /**
   * @override
   */
  public position() {}
}

export class StringRegion extends AbstractRegion<string> {
  /**
   * @override
   */
  public Clear(): void {
    if (!this.div) return;
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }

  /**
   * @override
   */
  public Update(speech: string) {
    if (speech) {
      this.AddElement();
    }
    if (this.inner) {
      this.inner.textContent = '';
      this.inner.textContent = speech || '\u00a0';
    }
  }

  /**
   * @override
   */
  protected position(node: HTMLElement) {
    this.stackRegions(node);
  }
}

export class ToolTip extends StringRegion {
  /**
   * @override
   */
  protected static className = 'MJX_ToolTip';

  /**
   * @override
   */
  protected static style: StyleJsonSheet = new StyleJsonSheet({
    [`.${ToolTip.className}`]: {
      width: 'auto',
      height: 'auto',
      opacity: 1,
      'text-align': 'center',
      'border-radius': '4px',
      padding: 0,
      'border-bottom': '1px dotted black',
      position: 'absolute',
      display: 'inline-block',
      'background-color': 'white',
      'z-index': 202,
    },
    [`.${ToolTip.className} > div`]: {
      'border-radius': 'inherit',
      padding: '0 2px',
    },
    '@media (prefers-color-scheme: dark)': {
      ['.' + ToolTip.className]: {
        'background-color': '#222025',
        'box-shadow': '0px 5px 20px #000',
        border: '1px solid #7C7C7C',
      },
    },
  });
}

export class LiveRegion extends StringRegion {
  /**
   * @override
   */
  protected static className = 'MJX_LiveRegion';

  public static priority = {
    primary: 1,
    secondary: 2,
  };

  /**
   * @override
   */
  protected static style: StyleJsonSheet = new StyleJsonSheet({
    ':root': {
      '--mjx-fg-red': '255, 0, 0',
      '--mjx-fg-green': '0, 255, 0',
      '--mjx-fg-blue': '0, 0, 255',
      '--mjx-fg-yellow': '255, 255, 0',
      '--mjx-fg-cyan': '0, 255, 255',
      '--mjx-fg-magenta': '255, 0, 255',
      '--mjx-fg-white': '255, 255, 255',
      '--mjx-fg-black': '0, 0, 0',
      '--mjx-bg-red': '255, 0, 0',
      '--mjx-bg-green': '0, 255, 0',
      '--mjx-bg-blue': '0, 0, 255',
      '--mjx-bg-yellow': '255, 255, 0',
      '--mjx-bg-cyan': '0, 255, 255',
      '--mjx-bg-magenta': '255, 0, 255',
      '--mjx-bg-white': '255, 255, 255',
      '--mjx-bg-black': '0, 0, 0',
      '--mjx-live-bg-color': 'white',
      '--mjx-live-shadow-color': '#888',
      '--mjx-live-border-color': '#CCCCCC',
      '--mjx-bg1-color': 'rgba(var(--mjx-bg-blue), var(--mjx-bg-alpha))',
      '--mjx-fg1-color': 'rgba(var(--mjx-fg-black), 1)',
      '--mjx-bg2-color': 'rgba(var(--mjx-bg-red), 1)',
      '--mjx-fg2-color': 'rgba(var(--mjx-fg-black), 1)',
      '--mjx-bg1-alpha': 0.2,
      '--mjx-fg1-alpha': 1,
      '--mjx-bg2-alpha': 1,
      '--mjx-fg2-alpha': 1,
    },
    '@media (prefers-color-scheme: dark)': {
      ':root': {
        '--mjx-bg-blue': '132, 132, 255',
        '--mjx-bg-white': '0, 0, 0',
        '--mjx-bg-black': '255, 255, 255',
        '--mjx-fg-white': '0, 0, 0',
        '--mjx-fg-black': '255, 255, 255',
        '--mjx-live-bg-color': '#222025',
        '--mjx-live-shadow-color': 'black',
        '--mjx-live-border-color': '#7C7C7C',
        '--mjx-bg1-alpha': 0.3,
        '--mjx-fg1-alpha': 1,
        '--mjx-bg2-alpha': 1,
        '--mjx-fg2-alpha': 1,
      },
    },
    [`.${LiveRegion.className}`]: {
      position: 'absolute',
      top: 0,
      display: 'none',
      width: 'auto',
      height: 'auto',
      padding: 0,
      opacity: 1,
      'z-index': '202',
      left: 0,
      right: 0,
      margin: '0 auto',
      'background-color': 'var(--mjx-live-bg-color)',
      'box-shadow': '0px 5px 20px var(--mjx-live-shadow-color)',
      border: '2px solid var(--mjx-live-border-color)',
    },
    [`.${LiveRegion.className}_Show`]: {
      display: 'block',
    },
    [`.${LiveRegion.className} > div`]: {
      color: 'var(--mjx-fg1-color)',
      'background-color': 'var(--mjx-bg1-color)',
    },
    //
    // Primary highlighting colors
    //
    'mjx-container [data-sre-highlight-1]:not([data-mjx-collapsed], rect)': {
      color: 'var(--mjx-fg1-color) ! important', //                   // CHTML
      fill: 'var(--mjx-fg1-color) ! important', //                    // SVG
    },
    [[
      'mjx-container:not([data-mjx-clone-container])',
      '[data-sre-highlight-1]:not([data-sre-enclosed], rect)',
    ].join(' ')]: {
      'background-color': 'var(--mjx-bg1-color) ! important', //      // CHTML
    },
    'mjx-container rect[data-sre-highlight-1]:not([data-sre-enclosed])': {
      fill: 'var(--mjx-bg1-color) ! important', //                    // SVG
    },
    //
    // Secondary highlighting colors
    //
    'mjx-container [data-sre-highlight-2]': {
      color: 'var(--mjx-fg2-color) ! important', //                   // CHTML
      'background-color': 'var(--mjx-bg2-color) ! important', //      // CHTML
      fill: 'var(--mjx-fg2-color) ! important', //                    // SVG
    },
    'mjx-container rect[data-sre-highlight-2]': {
      fill: 'var(--mjx-bg2-color) ! important', //                    // SVG
    },
  });

  /**
   * Set the CSS styles for a given color type and priority
   *
   * @param {string} type      The color type (fg or bg)
   * @param {number} priority  1 = primary, 2 = secondary
   * @param {string} color     The color name (blue, red, black, etc.)
   * @param {number} opacity   The alpha channel for the color
   */
  public static setColor(
    type: string,
    priority: number,
    color: string,
    opacity: number
  ) {
    const style = this.styleSheet;
    if (style) {
      const css = (style.sheet.cssRules[0] as any).style;
      const alpha = opacity === 1 ? 1 : `var(--mjx-${type}${priority}-alpha)`;
      const name = `--mjx-${type}${priority}-color`;
      const value = `rgba(var(--mjx-${type}-${color}), ${alpha})`;
      if (css.getPropertyValue(name) !== value) {
        css.setProperty(name, value);
      }
      const oname = `--mjx-${type}${priority}-alpha`;
      if (css.getPropertyValue(oname) !== String(opacity)) {
        css.setProperty(oname, opacity);
        (style.sheet.cssRules[1] as any).cssRules[0].style.setProperty(
          oname,
          opacity ** 0.7071
        );
      }
    }
  }
}

/**
 * Region class that enables auto voicing of content via SSML markup.
 */
export class SpeechRegion extends LiveRegion {
  protected static style: StyleJsonSheet = null;

  /**
   * Flag to activate auto voicing.
   */
  public active: boolean = false;

  /**
   * The math expression that is currently explored. Other regions do not need
   * this node as the explorer administers both node and region, while only
   * pushing output into the region. But in the case autovoicing the speech
   * regions needs to mark elements in the node directly.
   */
  public node: Element = null;

  /**
   * Flag to indicate if a node is marked as being spoken.
   */
  private clear: boolean = false;

  /**
   * The highlighter to use. (Set by ExplorerPool)
   */
  public highlighter: Highlighter;

  /**
   * @override
   */
  public Show(node: HTMLElement) {
    super.Update('\u00a0'); // Ensures region shown and cannot be overwritten.
    this.node = node;
    super.Show(node);
  }

  /**
   * Have we already requested voices from the browser?
   */
  private voiceRequest: boolean = false;

  /**
   * Has the auto voicing been cancelled?
   */
  private voiceCancelled: boolean = false;

  /**
   * @override
   */
  public Update(speech: string) {
    // TODO (Volker): Make sure we use speech and ssml!
    if (this.voiceRequest) {
      this.makeVoice(speech);
      return;
    }
    speechSynthesis.onvoiceschanged = (() => (this.voiceRequest = true)).bind(
      this
    );
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        if (this.voiceRequest) {
          resolve(true);
        } else {
          // This case is to make FF and Safari work.
          setTimeout(() => {
            this.voiceRequest = true;
            resolve(true);
          }, 100);
        }
      }, 100);
    });
    promise.then(() => this.makeVoice(speech));
  }

  /**
   * @param {string} speech  The speech string to voice
   */
  private makeVoice(speech: string) {
    this.active =
      this.document.options.a11y.voicing &&
      !!speechSynthesis.getVoices().length;
    speechSynthesis.cancel();
    this.clear = true;
    const [text, ssml] = buildSpeech(
      speech,
      this.document.options.sre.locale,
      this.document.options.sre.rate
    );
    super.Update(text);
    if (this.active && text) {
      this.makeUtterances(ssml, this.document.options.sre.locale);
    }
  }

  /**
   * Generates the utterance chain.
   *
   * @param {SsmlElement[]} ssml The list of ssml annotations.
   * @param {string} locale The locale to use.
   */
  protected makeUtterances(ssml: SsmlElement[], locale: string) {
    this.voiceCancelled = false;
    let utterance = null;
    for (const utter of ssml) {
      if (utter.mark) {
        if (!utterance) {
          // First utterance, call with init = true.
          this.highlightNode(utter.mark, true);
          continue;
        }
        utterance.addEventListener('end', (_event: Event) => {
          if (!this.voiceCancelled) {
            this.highlightNode(utter.mark);
          }
        });
        continue;
      }
      if (utter.pause) {
        const time = parseInt(utter.pause.match(/^[0-9]+/)[0]);
        if (isNaN(time) || !utterance) {
          continue;
        }
        // TODO: Ensure pausing does not advance the highlighting.
        utterance.addEventListener('end', (_event: Event) => {
          speechSynthesis.pause();
          setTimeout(() => {
            speechSynthesis.resume();
          }, time);
        });
        continue;
      }
      utterance = new SpeechSynthesisUtterance(utter.text);
      if (utter.rate) {
        utterance.rate = utter.rate;
      }
      if (utter.pitch) {
        utterance.pitch = utter.pitch;
      }
      utterance.lang = locale;
      speechSynthesis.speak(utterance);
    }
    if (utterance) {
      utterance.addEventListener('end', (_event: Event) => {
        this.highlighter.unhighlight();
      });
    }
  }

  /**
   * @override
   */
  public Hide() {
    this.cancelVoice();
    super.Hide();
  }

  /**
   * Cancel the auto-voicing
   */
  public cancelVoice() {
    this.voiceCancelled = true;
    speechSynthesis.cancel();
    this.highlighter.unhighlight();
  }

  /**
   * Highlighting the node that is being marked in the SSML.
   *
   * @param {string} id The id of the node to highlight.
   * @param {boolean} init Flag to indicate the very first utterance where there
   *     is no need for unhighlighting.
   */
  private highlightNode(id: string, init: boolean = false) {
    this.highlighter.unhighlight();
    const nodes = Array.from(
      this.node.querySelectorAll(`[data-semantic-id="${id}"]`)
    );
    if (!this.clear || init) {
      this.highlighter.highlight(nodes as HTMLElement[]);
    }
    this.clear = false;
  }
}

// Region that overlays the current element.
export class HoverRegion extends AbstractRegion<HTMLElement> {
  /**
   * @override
   */
  protected static className = 'MJX_HoverRegion';

  /**
   * @override
   */
  protected static style: StyleJsonSheet = new StyleJsonSheet({
    [`.${HoverRegion.className}`]: {
      display: 'block',
      position: 'absolute',
      width: 'max-content',
      height: 'auto',
      padding: 0,
      opacity: 1,
      'z-index': '202',
      margin: '0 auto',
      'background-color': 'white',
      'line-height': 0,
      'box-shadow': '0px 10px 20px #888',
      border: '2px solid #CCCCCC',
    },
    [`.${HoverRegion.className} > div`]: {
      overflow: 'hidden',
      color: 'var(--mjx-fg1-color)',
      'background-color': 'var(--mjx-bg1-color)',
    },
    '@media (prefers-color-scheme: dark)': {
      ['.' + HoverRegion.className]: {
        'background-color': '#222025',
        'box-shadow': '0px 5px 20px #000',
        border: '1px solid #7C7C7C',
      },
    },
    'mjx-container[data-mjx-clone-container]': {
      padding: '2px ! important',
    },
    'mjx-math > mjx-mlabeledtr': {
      display: 'inline-block',
      'margin-right': '.5em ! important',
    },
    'mjx-math > mjx-mtd': {
      float: 'right',
    },
  });

  /**
   * Sets the position of the region with respect to align parameter.  There are
   * three options: top, bottom and center. Center is the default.
   *
   * @param {HTMLElement} node The node that is displayed.
   */
  protected position(node: HTMLElement) {
    const nodeRect = node.getBoundingClientRect();
    const divRect = this.div.getBoundingClientRect();
    const xCenter = nodeRect.left + nodeRect.width / 2;
    let left = xCenter - divRect.width / 2;
    left = left < 0 ? 0 : left;
    left = left + window.scrollX;
    let top;
    switch (this.document.options.a11y.align) {
      case 'top':
        top = nodeRect.top - divRect.height - 10;
        break;
      case 'bottom':
        top = nodeRect.bottom + 10;
        break;
      case 'center':
      default: {
        const yCenter = nodeRect.top + nodeRect.height / 2;
        top = yCenter - divRect.height / 2;
      }
    }
    top = top + window.scrollY;
    top = top < 0 ? 0 : top;
    this.div.style.top = top + 'px';
    this.div.style.left = left + 'px';
  }

  /**
   * @override
   */
  public Show(node: HTMLElement) {
    this.AddElement();
    this.div.style.fontSize = this.document.options.a11y.magnify;
    this.Update(node);
    super.Show(node);
  }

  /**
   * @override
   */
  public Clear() {
    if (!this.div) return;
    this.inner.textContent = '';
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }

  /**
   * @override
   */
  public Update(node: HTMLElement) {
    if (!this.div) return;
    this.Clear();
    const mjx = this.cloneNode(node);
    const selected = mjx.querySelector('[data-mjx-clone]') as HTMLElement;
    this.inner.style.backgroundColor = node.style.backgroundColor;
    selected.style.backgroundColor = '';
    selected.classList.remove('mjx-selected');
    this.inner.appendChild(mjx);
    this.position(node);
  }

  /**
   * Clones the node to put into the hover region.
   *
   * @param {HTMLElement} node The original node.
   * @returns {HTMLElement} The cloned node.
   */
  protected cloneNode(node: HTMLElement): HTMLElement {
    let mjx = node.cloneNode(true) as HTMLElement;
    mjx.setAttribute('data-mjx-clone', 'true');
    if (mjx.nodeName !== 'MJX-CONTAINER') {
      if (mjx.nodeName !== 'g') {
        mjx.style.marginLeft = mjx.style.marginRight = '0';
      }
      const container = node.closest('mjx-container');
      if (mjx.nodeName !== 'MJX-MATH' && mjx.nodeName !== 'svg') {
        let math = container.firstChild;
        if (math.nodeName === 'MJX-BBOX') {
          math = math.nextSibling;
        }
        mjx = math.cloneNode(false).appendChild(mjx).parentElement;
        const enclosed = Array.from(
          container.querySelectorAll('[data-sre-enclosed]')
        );
        math.nodeName === 'svg'
          ? this.svgClone(node, enclosed, mjx, container)
          : this.chtmlClone(node, enclosed, mjx);
      }
      mjx = container.cloneNode(false).appendChild(mjx).parentElement;
      mjx.style.margin = '0';
      mjx.style.minWidth = '';
    }
    mjx.setAttribute('data-mjx-clone-container', 'true');
    return mjx;
  }

  /**
   * @param {HTMLElement} node     The main node being shown
   * @param {Element[]} enclosed   The elements to be cloned
   * @param {HTMLElement} mjx      The container for the clones
   */
  protected chtmlClone(
    node: HTMLElement,
    enclosed: Element[],
    mjx: HTMLElement
  ) {
    for (const child of enclosed) {
      if (child !== node) {
        const id = child.getAttribute('data-semantic-id');
        if (!id || !mjx.querySelector(`[data-semantic-id="${id}"]`)) {
          mjx.appendChild(child.cloneNode(true));
        }
      }
    }
  }

  /**
   * @param {HTMLElement} node     The main node being shown
   * @param {Element[]} enclosed   The elements to be cloned
   * @param {HTMLElement} mjx      The container for the clones
   * @param {Element} container    The container for node
   */
  protected svgClone(
    node: Element,
    enclosed: Element[],
    mjx: HTMLElement,
    container: Element
  ) {
    let { x, y, width, height } = (node as SVGGraphicsElement).getBBox();
    if (enclosed.length) {
      mjx.firstChild.remove();
      const g = container.querySelector('g').cloneNode(false);
      for (const child of enclosed) {
        const clone = g.appendChild(child.cloneNode(true)) as HTMLElement;
        if (child === node) {
          clone.setAttribute('data-mjx-clone', 'true');
        }
        const [cx, cy] = this.xy(child);
        clone.setAttribute('transform', `translate(${cx}, ${cy})`);
      }
      mjx.appendChild(g);
      const rect = node.previousSibling as SVGRectElement;
      const bbox = rect.getBBox();
      width = bbox.width;
      height = bbox.height;
      const [X, Y] = this.xy(rect);
      x = X;
      y = Y + bbox.y;
    }
    //
    // Handle top-level expression with a tag
    //
    const g = container.querySelector('g');
    if (
      container.getAttribute('width') === 'full' &&
      g.firstChild.lastChild === node
    ) {
      mjx.innerHTML = '';
      mjx.appendChild(container.cloneNode(true).firstChild);
      mjx.querySelector('.mjx-selected').setAttribute('data-mjx-clone', 'true');
      mjx.querySelector('[data-sre-highlighter-added]')?.remove();
      return;
    }
    //
    // All other expressions
    //
    (mjx.firstChild as HTMLElement).setAttribute('transform', 'scale(1, -1)');
    const W = parseFloat(
      (
        mjx.getAttribute('viewBox') || mjx.getAttribute('data-mjx-viewBox')
      ).split(/ /)[2]
    );
    const w = parseFloat(mjx.style.minWidth || mjx.getAttribute('width'));
    mjx.setAttribute('viewBox', [x, -(y + height), width, height].join(' '));
    mjx.removeAttribute('style');
    mjx.setAttribute('width', (w / W) * width + 'ex');
    mjx.setAttribute('height', (w / W) * height + 'ex');
  }

  /**
   * @param {Element} node         The node whose position is needed
   * @returns {[number, number]}   The position in viewport coordinates
   */
  protected xy(node: Element): number[] {
    const P = DOMPoint.fromPoint({ x: 0, y: 0 }).matrixTransform(
      (node as SVGGraphicsElement).getCTM().inverse()
    );
    return [-P.x, -P.y];
  }
}
