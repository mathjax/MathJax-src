/*************************************************************
 *
 *  Copyright (c) 2009-2018 The MathJax Consortium
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
import {CssStyles, StyleList} from '../../output/common/CssStyles.js';

import '../sre.js';

export type A11yDocument = MathDocument<HTMLElement, Text, Document>;

export interface Region {

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
   * @param {sre.Highlighter} highlighter
   */
  Show(node: HTMLElement, highlighter: sre.Highlighter): void;

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
   */
  Update(content: string): void;

}

export abstract class AbstractRegion implements Region {

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
  public Show(node: HTMLElement, highlighter: sre.Highlighter) {
    this.position(node);
    this.highlight(highlighter);
    this.div.classList.add(this.CLASS.className + '_Show');
  }

  protected abstract position(node: HTMLElement): void;

  protected abstract highlight(highlighter: sre.Highlighter): void;

  /**
   * @override
   */
  public Hide() {
    this.div.classList.remove(this.CLASS.className + '_Show');
  }


  /**
   * @override
   */
  public Clear() {
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


}

export class ToolTip extends AbstractRegion {

  protected static className = 'MJX_ToolTip';
  protected static style: CssStyles =
    new CssStyles({['.' + ToolTip.className]: {
      position: 'absolute',
      display: 'inline-block',
      height: '1px', width: '1px'
    },
                   ['.' + ToolTip.className + '_Show']: {
                     width: 'auto', height: 'auto',
                     opacity: 1,
                     'text-align': 'center',
                     'border-radius': '6px',
                     padding: '0px 0px',
                     'border-bottom': '1px dotted black',
                     position: 'absolute',
                     'z-index': 202
                   }
                  }
                 );

  protected position(node: HTMLElement) {
    const rect = node.getBoundingClientRect();
    let baseBottom = 0;
    let baseLeft = Number.POSITIVE_INFINITY;
    let tooltips = this.document.adaptor.document.getElementsByClassName(this.CLASS.className + '_Show');
    for (let i = 0, tooltip; tooltip = tooltips[i]; i++) {
      if (tooltip !== this.div) {
        baseBottom = Math.max(tooltip.getBoundingClientRect().bottom, baseBottom);
        baseLeft = Math.min(tooltip.getBoundingClientRect().left, baseLeft);
      }
    }
    // Get all the shown tooltips and then put at the bottom. One of which is
    // the element itself!
    const bot = (baseBottom ? baseBottom : rect.bottom + 10) + window.pageYOffset;
    const left = (baseLeft < Number.POSITIVE_INFINITY ? baseLeft : rect.left) + window.pageXOffset;
    this.div.style.top = bot + 'px';
    this.div.style.left = left + 'px';
  }

  protected highlight(highlighter: sre.Highlighter) {
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }

}


export class LiveRegion extends AbstractRegion {

  /**
   * @override
   */
  protected static className = 'MJX_LiveRegion';

  /**
   * @override
   */
  protected static style: CssStyles =
    new CssStyles({['.' + LiveRegion.className]: {
      position: 'absolute', top: '0', height: '1px', width: '1px',
      padding: '1px', overflow: 'hidden'
    },
                   ['.' + LiveRegion.className + '_Show']:
                   {
                     top: '0', position: 'absolute', width: 'auto', height: 'auto',
                     padding: '0px 0px', opacity: 1, 'z-index': '202',
                     left: 0, right: 0, 'margin': '0 auto',
                     'background-color': 'rgba(0, 0, 255, 0.2)', 'box-shadow': '0px 10px 20px #888',
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

  /**
   * Shows the live region as a subtitle of a node.
   * @override
   */
  public Show(node: HTMLElement, highlighter: sre.Highlighter) {
    super.Show(node, highlighter);
  }


  protected position(node: HTMLElement) {
    const rect = node.getBoundingClientRect();
    const bot = rect.bottom + 10 + window.pageYOffset;
    const left = rect.left + window.pageXOffset;
    this.div.style.top = bot + 'px';
    this.div.style.left = left + 'px';
  }

  protected highlight(highlighter: sre.Highlighter) {
    const color = highlighter.colorString();
    this.inner.style.backgroundColor = color.background;
    this.inner.style.color = color.foreground;
  }

}


// Regions that overlays the current element.
export class HoverRegion extends AbstractRegion {

  /**
   * @override
   */
  protected static className = 'MJX_HoverRegion';

  /**
   * @override
   */
  protected static style: CssStyles =
    new CssStyles({['.' + HoverRegion.className]: {
      position: 'absolute', top: '0', height: '1px', width: '1px',
      padding: '1px', overflow: 'hidden'
    },
                   ['.' + HoverRegion.className + '_Show']:
                   {
                     top: '0', position: 'absolute', width: 'max-content', height: 'auto',
                     padding: '0px 0px', opacity: 1, 'z-index': '202',
                     left: 0, right: 0, 'margin': '0 auto',
                     'background-color': 'rgba(0, 0, 255, 0.2)',
                     'box-shadow': '0px 10px 20px #888',
                     border: '2px solid #CCCCCC'
                   }
                  });


  /**
   * @constructor
   * @param {A11yDocument} document The document the live region is added to.
   */
  constructor(public document: A11yDocument) {
    super(document);
    this.div.style.fontSize = '800%';
    this.inner.classList.add('MJX-TEX');
  }

  /**
   * Shows the live region as a subtitle of a node.
   * @override
   */
  public Show(node: HTMLElement, highlighter: sre.Highlighter) {
    super.Show(node, highlighter);
  }


  protected position(node: HTMLElement) {
    const rect = node.getBoundingClientRect();
    const top = rect.top;
    const left = rect.left;
    this.div.style.top = top + 'px';
    this.div.style.left = left + 'px';
  }

  protected highlight(highlighter: sre.Highlighter) {
    // const color = highlighter.colorString();
    // this.inner.style.backgroundColor = color.background;
    // this.inner.style.color = color.foreground;
  }

  public AddNode(node: HTMLElement): void {
    this.Clear();
    this.inner.appendChild(node);
  }

}
