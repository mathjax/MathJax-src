/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Regions for A11y purposes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {MathDocument} from '../../core/MathDocument.js';
import {CssStyles} from '../../util/StyleList.js';
import Sre from '../sre.js';

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
   * @param {HTMLElement} node
   * @param {Sre.highlighter} highlighter
   */
  Show(node: HTMLElement, highlighter: Sre.highlighter): void;

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
   * @template T
   */
  Update(content: T): void;

}

export abstract class AbstractRegion<T> implements Region<T> {

  /**
   * CSS Classname of the element.
   * @type {String}
   */
  protected static className: string;

  /**
   * True if the style has already been added to the document.
   * @type {boolean}
   */
  protected static styleAdded: boolean = false;

  /**
   * The CSS style that needs to be added for this type of region.
   * @type {CssStyles}
   */
  protected static style: CssStyles;

  /**
   * The outer div node.
   * @type {HTMLElement}
   */
  protected div: HTMLElement;

  /**
   * The inner node.
   * @type {HTMLElement}
   */
  protected inner: HTMLElement;

  /**
   * The actual class name to refer to static elements of a class.
   * @type {typeof AbstractRegion}
   */
  protected CLASS: typeof AbstractRegion;

  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    this.CLASS = this.constructor as typeof AbstractRegion;
    this.AddStyles();
    this.AddElement();
  }


  /**
   * @override
   */
  public AddStyles() {
    if (this.CLASS.styleAdded) {
      return;
    }
    // TODO: should that be added to document.documentStyleSheet()?
    let node = this.document.adaptor.node('style');
    node.innerHTML = this.CLASS.style.cssText;
    this.document.adaptor.head(this.document.adaptor.document).
      appendChild(node);
    this.CLASS.styleAdded = true;
  }


  /**
   * @override
   */
  public AddElement() {
    let element = this.document.adaptor.node('div');
    element.classList.add(this.CLASS.className);
    element.style.backgroundColor = 'white';
    this.div = element;
    this.inner = this.document.adaptor.node('div');
    this.div.appendChild(this.inner);
    this.document.adaptor.
      body(this.document.adaptor.document).
      appendChild(this.div);

  }


  /**
   * @override
   */
  public Show(node: HTMLElement, highlighter: Sre.highlighter) {
    this.position(node);
    this.highlight(highlighter);
    this.div.classList.add(this.CLASS.className + '_Show');
  }


  /**
   * Computes the position where to place the element wrt. to the given node.
   * @param {HTMLElement} node The reference node.
   */
  protected abstract position(node: HTMLElement): void;


  /**
   * Highlights the region.
   * @param {Sre.highlighter} highlighter The Sre highlighter.
   */
  protected abstract highlight(highlighter: Sre.highlighter): void;


  /**
   * @override
   */
  public Hide() {
    this.div.classList.remove(this.CLASS.className + '_Show');
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
   * @param {HTMLElement} node The reference node.
   */
  protected stackRegions(node: HTMLElement) {
    // TODO: This could be made more efficient by caching regions of a class.
    const rect = node.getBoundingClientRect();
    let baseBottom = 0;
    let baseLeft = Number.POSITIVE_INFINITY;
    let regions = this.document.adaptor.document.getElementsByClassName(
      this.CLASS.className + '_Show');
    // Get all the shown regions (one is this element!) and append at bottom.
    for (let i = 0, region; region = regions[i]; i++) {
      if (region !== this.div) {
        baseBottom = Math.max(region.getBoundingClientRect().bottom, baseBottom);
        baseLeft = Math.min(region.getBoundingClientRect().left, baseLeft);
      }
    }
    const bot = (baseBottom ? baseBottom : rect.bottom + 10) + window.pageYOffset;
    const left = (baseLeft < Number.POSITIVE_INFINITY ? baseLeft : rect.left) + window.pageXOffset;
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

  /**
   * @override
   */
  public highlight(_highlighter: Sre.highlighter) {}
}


export class StringRegion extends AbstractRegion<string> {

  /**
   * @override
   */
  public Clear(): void {
    this.Update('');
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }


  /**
   * @override
   */
  public Update(speech: string) {
    this.inner.textContent = '';
    this.inner.textContent = speech;
  }

  /**
   * @override
   */
  protected position(node: HTMLElement) {
    this.stackRegions(node);
  }


  /**
   * @override
   */
  protected highlight(highlighter: Sre.highlighter) {
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
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
  protected static style: CssStyles =
    new CssStyles({
      ['.' + ToolTip.className]: {
        position: 'absolute', display: 'inline-block',
        height: '1px', width: '1px'
      },
      ['.' + ToolTip.className + '_Show']: {
        width: 'auto', height: 'auto', opacity: 1, 'text-align': 'center',
        'border-radius': '6px', padding: '0px 0px',
        'border-bottom': '1px dotted black', position: 'absolute',
        'z-index': 202
      }
    });

}


export class LiveRegion extends StringRegion {

  /**
   * @override
   */
  protected static className = 'MJX_LiveRegion';

  /**
   * @override
   */
  protected static style: CssStyles =
    new CssStyles({
      ['.' + LiveRegion.className]: {
        position: 'absolute', top: '0', height: '1px', width: '1px',
        padding: '1px', overflow: 'hidden'
      },
      ['.' + LiveRegion.className + '_Show']: {
        top: '0', position: 'absolute', width: 'auto', height: 'auto',
        padding: '0px 0px', opacity: 1, 'z-index': '202',
        left: 0, right: 0, 'margin': '0 auto',
        'background-color': 'rgba(0, 0, 255, 0.2)', 'box-shadow': '0px 5px 20px #888',
        border: '2px solid #CCCCCC'
      }
    });


  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    super(document);
    this.div.setAttribute('aria-live', 'assertive');
  }

}


const ProsodyKeys = [ 'pitch', 'rate', 'volume' ];

interface ProsodyElement {
  [propName: string]: string | boolean | number;
  pitch?: number;
  rate?: number;
  volume?: number;
}

interface SsmlElement extends ProsodyElement {
  [propName: string]: string | boolean | number;
  pause?: string;
  text?: string;
  mark?: string;
  character?: boolean;
  kind?: string;
}

/**
 * Region class that enables auto voicing of content via SSML markup.
 */
export class SpeechRegion extends LiveRegion {

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
   * The highlighter to use.
   */
  public highlighter: Sre.highlighter = Sre.getHighlighter(
    {color: 'red'}, {color: 'black'},
    {renderer: this.document.outputJax.name, browser: 'v3'}
  );

  /**
   * @override
   */
  public Clear(): void {
    super.Clear();
  }

  /**
   * @override
   */
  public Show(node: HTMLElement, highlighter: Sre.highlighter) {
    this.node = node;
    super.Show(node, highlighter);
  }

  /**
   * @override
   */
  public Update(speech: string) {
    this.active = this.document.options.a11y.voicing &&
      !!speechSynthesis.getVoices().length;
    speechSynthesis.cancel();
    this.clear = true;
    let [text, ssml] = this.ssmlParsing(speech);
    super.Update(text);
    if (this.active && text) {
      this.makeUtterances(ssml, this.document.options.sre.locale);
    }
  }

  /**
   * Generates the utterance chain.
   * @param {SsmlElement[]} ssml The list of ssml annotations.
   * @param {string} locale The locale to use.
   */
  private makeUtterances(ssml: SsmlElement[], locale: string) {
    let utterance = null;
    for (let utter of ssml) {
      if (utter.mark) {
        if (!utterance) {
          this.highlightNode(utter.mark, true);
          continue;
        }
        utterance.addEventListener('end', (_event: Event) => {
          this.highlightNode(utter.mark);
        });
        continue;
      }
      if (utter.pause) {
        let time = parseInt(utter.pause.match(/^[0-9]+/)[0]);
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
   * Highlighting the node that is being marked in the SSML.
   * @param {string} id The id of the node to highlight.
   * @param {boolean} init
   */
  private highlightNode(id: string, init: boolean = false) {
    this.highlighter.unhighlight();
    let nodes = Array.from(
      this.node.querySelectorAll(`[data-semantic-id="${id}"]`));
    if (!this.clear || init) {
      this.highlighter.highlight(nodes as HTMLElement[]);
    }
    this.clear = false;
  }


  /**
   * Parses a string containing an ssml structure into a list of text strings
   * with associated ssml annotation elements.
   *
   * @param {string} speech The speech string.
   * @return {[string, SsmlElement[]]} The annotation structure.
   */
  private ssmlParsing(speech: string): [string, SsmlElement[]] {
    let dp = new DOMParser();
    let xml = dp.parseFromString(speech, 'text/xml');
    let instr: SsmlElement[] = [];
    let text: String[] = [];
    this.recurseSsml(Array.from(xml.documentElement.childNodes), instr, text);
    return [text.join(' '), instr];
  }

  /**
   * Tail recursive combination of SSML components.
   *
   * @param {Node[]} nodes A list of SSML nodes.
   * @param {SsmlElement[]} instr Accumulator for collating Ssml annotation
   *    elements.
   * @param {String[]} text A list of text elements.
   * @param {ProsodyElement?} prosody The currently active prosody elements.
   */
  private recurseSsml(nodes: Node[], instr: SsmlElement[], text: String[],
                      prosody: ProsodyElement = {}) {
    for (let node of nodes) {
      if (node.nodeType === 3) {
        let content = node.textContent.trim();
        if (content) {
          text.push(content);
          instr.push(Object.assign({text: content}, prosody));
        }
        continue;
      }
      if (node.nodeType === 1) {
        let element = node as Element;
        let tag = element.tagName;
        if (tag === 'speak') {
          continue;
        }
        if (tag === 'prosody') {
          this.recurseSsml(
            Array.from(node.childNodes), instr, text,
            this.getProsody(element, prosody));
          continue;
        }
        switch (tag) {
          case 'break':
            instr.push({pause: element.getAttribute('time')});
            break;
          case 'mark':
            instr.push({mark: element.getAttribute('name')});
            break;
          case 'say-as':
            let txt = element.textContent;
            instr.push(Object.assign({text: txt, character: true}, prosody));
            text.push(txt);
            break;
          default:
            break;
        }
      }
    }
  }

  /**
   * Maps prosody types to scaling functions.
   */
  // TODO: These should be tweaked after more testing.
  private static combinePros: {[key: string]: (x: number, sign: string) => number} = {
    pitch: (x: number, _sign: string) => 1 * (x / 100),
    volume: (x: number, _sign: string) => .5 * (x / 100),
    rate: (x: number, _sign: string) =>  1 * (x / 100)
  };

  /**
   * Retrieves prosody annotations from and SSML node.
   * @param {Element} element The SSML node.
   * @param {ProsodyElement} prosody The prosody annotation.
   */
  private getProsody(element: Element, prosody: ProsodyElement) {
    let combine: ProsodyElement = {};
    for (let pros of ProsodyKeys) {
      if (element.hasAttribute(pros)) {
        let [sign, value] = SpeechRegion.extractProsody(element.getAttribute(pros));
        if (!sign) {
          // TODO: Sort out the base value. It is .5 for volume!
          combine[pros] = (pros === 'volume') ? .5 : 1;
          continue;
        }
        let orig = prosody[pros] as number;
        orig = orig ? orig : ((pros === 'volume') ? .5 : 1);
        let relative = SpeechRegion.combinePros[pros](parseInt(value, 10), sign);
        combine[pros] = (sign === '-') ? orig - relative : orig + relative;
      }
    }
    return combine;
  }

  /**
   * Extracts the prosody value from an attribute.
   */
  private static prosodyRegexp = /([\+|-]*)([0-9]+)%/;

  /**
   * Extracts the prosody value from an attribute.
   * @param {string} attr
   */
  private static extractProsody(attr: string) {
    let match = attr.match(SpeechRegion.prosodyRegexp);
    if (!match) {
      console.warn('Something went wrong with the prosody matching.');
      return ['', '100'];
    }
    return [match[1], match[2]];
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
  protected static style: CssStyles =
    new CssStyles({
      ['.' + HoverRegion.className]: {
        position: 'absolute', height: '1px', width: '1px',
        padding: '1px', overflow: 'hidden'
      },
      ['.' + HoverRegion.className + '_Show']: {
        position: 'absolute', width: 'max-content', height: 'auto',
        padding: '0px 0px', opacity: 1, 'z-index': '202', 'margin': '0 auto',
        'background-color': 'rgba(0, 0, 255, 0.2)',
        'box-shadow': '0px 10px 20px #888', border: '2px solid #CCCCCC'
      }
    });


  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    super(document);
    this.inner.style.lineHeight = '0';
  }

  /**
   * Sets the position of the region with respect to align parameter.  There are
   * three options: top, bottom and center. Center is the default.
   *
   * @param {HTMLElement} node The node that is displayed.
   */
  protected position(node: HTMLElement) {
    const nodeRect = node.getBoundingClientRect();
    const divRect = this.div.getBoundingClientRect();
    const xCenter = nodeRect.left + (nodeRect.width / 2);
    let left = xCenter - (divRect.width / 2);
    left = (left < 0) ? 0 : left;
    left = left + window.pageXOffset;
    let top;
    switch (this.document.options.a11y.align) {
    case 'top':
      top = nodeRect.top - divRect.height - 10 ;
      break;
    case 'bottom':
      top = nodeRect.bottom + 10;
      break;
    case 'center':
    default:
      const yCenter = nodeRect.top + (nodeRect.height / 2);
      top = yCenter - (divRect.height / 2);
    }
    top = top + window.pageYOffset;
    top = (top < 0) ? 0 : top;
    this.div.style.top = top + 'px';
    this.div.style.left = left + 'px';
  }

  /**
   * @override
   */
  protected highlight(highlighter: Sre.highlighter) {
    // TODO Do this with styles to avoid the interaction of SVG/CHTML.
    if (this.inner.firstChild &&
        !(this.inner.firstChild as HTMLElement).hasAttribute('sre-highlight')) {
      return;
    }
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }

  /**
   * @override
   */
  public Show(node: HTMLElement, highlighter: Sre.highlighter) {
    this.div.style.fontSize = this.document.options.a11y.magnify;
    this.Update(node);
    super.Show(node, highlighter);
  }

  /**
   * @override
   */
  public Clear() {
    this.inner.textContent = '';
    this.inner.style.top = '';
    this.inner.style.backgroundColor = '';
  }

  /**
   * @override
   */
  public Update(node: HTMLElement) {
    this.Clear();
    let mjx = this.cloneNode(node);
    this.inner.appendChild(mjx);
  }

  /**
   * Clones the node to put into the hover region.
   * @param {HTMLElement} node The original node.
   * @return {HTMLElement} The cloned node.
   */
  private cloneNode(node: HTMLElement): HTMLElement {
    let mjx = node.cloneNode(true) as HTMLElement;
    if (mjx.nodeName !== 'MJX-CONTAINER') {
      // remove element spacing (could be done in CSS)
      if (mjx.nodeName !== 'g') {
        mjx.style.marginLeft = mjx.style.marginRight = '0';
      }
      let container = node;
      while (container && container.nodeName !== 'MJX-CONTAINER') {
        container = container.parentNode as HTMLElement;
      }
      if (mjx.nodeName !== 'MJX-MATH' && mjx.nodeName !== 'svg') {
        const child = container.firstChild;
        mjx = child.cloneNode(false).appendChild(mjx).parentNode as HTMLElement;
        //
        // SVG specific
        //
        if (mjx.nodeName === 'svg') {
          (mjx.firstChild as HTMLElement).setAttribute('transform', 'matrix(1 0 0 -1 0 0)');
          const W = parseFloat(mjx.getAttribute('viewBox').split(/ /)[2]);
          const w = parseFloat(mjx.getAttribute('width'));
          const {x, y, width, height} = (node as any).getBBox();
          mjx.setAttribute('viewBox', [x, -(y + height), width, height].join(' '));
          mjx.removeAttribute('style');
          mjx.setAttribute('width', (w / W * width) + 'ex');
          mjx.setAttribute('height', (w / W * height) + 'ex');
          container.setAttribute('sre-highlight', 'false');
        }
      }
      mjx = container.cloneNode(false).appendChild(mjx).parentNode as HTMLElement;
      //  remove displayed math margins (could be done in CSS)
      mjx.style.margin = '0';
    }
    return mjx;
  }

}
