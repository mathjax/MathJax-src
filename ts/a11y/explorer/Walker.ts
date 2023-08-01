/*************************************************************
 *
 *  Copyright (c) 2009-2023 The MathJax Consortium
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
 * @fileoverview Aria Tree Walker.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { SpeechRegion, LiveRegion } from './Region.js';
import {Sre} from '../sre.js';

// Based on the shellac walker.

const codeSelector = 'mjx-container[role="application"][data-shellac]';
const nav = '[role="application"][data-shellac],[role="tree"],[role="group"],[role="treeitem"]';

function isCodeBlock(el: HTMLElement) {
  return el.matches(codeSelector);
}

type rgbColor = {red: number, green: number, blue: number};
type channelColor = {name: string, alpha: number};

export class Highlighter {

  public foreground: string;
  public background: string;

  public static namedColors: { [key: string]: rgbColor } = {
    red: { red: 255, green: 0, blue: 0 },
    green: { red: 0, green: 255, blue: 0 },
    blue: { red: 0, green: 0, blue: 255 },
    yellow: { red: 255, green: 255, blue: 0 },
    cyan: { red: 0, green: 255, blue: 255 },
    magenta: { red: 255, green: 0, blue: 255 },
    white: { red: 255, green: 255, blue: 255 },
    black: { red: 0, green: 0, blue: 0 }
  };

  constructor(foreground: channelColor, background: channelColor) {
    this.foreground = this.makeColor(foreground);
    this.background = this.makeColor(background);
  }

  // public highlight(node: HTMLElement) {

  // }

  private makeColor({name: name, alpha: alpha}: channelColor) {
    let {red: red, green: green, blue: blue} =
      Highlighter.namedColors[name] || Highlighter.namedColors['blue'];
    return `rgba(${red},${green},${blue},${alpha})`;
  }

}

export class Walker {

  public shown: boolean = false;
  public speechRegion: SpeechRegion;
  public brailleRegion: LiveRegion;
  public highlighter: Sre.highlighter;

  public click(snippet: HTMLElement, e: MouseEvent) {
    const clicked = (e.target as HTMLElement).closest(nav) as HTMLElement;
    if (snippet.contains(clicked)) {
      const prev = snippet.querySelector('[tabindex="0"][role="tree"],[tabindex="0"][role="group"],[tabindex="0"][role="treeitem"]');
      if (prev) {
        prev.removeAttribute('tabindex');
      }
      clicked.setAttribute('tabindex', '0');
      clicked.focus();
      this.UpdateRegions(clicked);
      e.preventDefault();
    }
  }

  public move(e: KeyboardEvent) {

    function nextFocus(): HTMLElement {
      function nextSibling(el: HTMLElement): HTMLElement {
        const sib = el.nextElementSibling as HTMLElement;
        if (sib) {
          if (sib.matches(nav)) {
            return sib;
          } else {
            const sibChild = sib.querySelector(nav) as HTMLElement;
            return sibChild ?? nextSibling(sib);
          }
        } else {
          if (!isCodeBlock(el) && !el.parentElement.matches(nav)) {
            return nextSibling(el.parentElement);
          } else {
            return null;
          }
        }
      }

      function prevSibling(el: HTMLElement): HTMLElement {
        const sib = el.previousElementSibling as HTMLElement;
        if (sib) {
          if (sib.matches(nav)) {
            return sib;
          } else {
            const sibChild = sib.querySelector(nav) as HTMLElement;
            return sibChild ?? prevSibling(sib);
          }
        } else {
          if (!isCodeBlock(el) && !el.parentElement.matches(nav)) {
            return prevSibling(el.parentElement);
          } else {
            return null;
          }
        }
      }

      const target = e.target as HTMLElement;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          return target.querySelector(nav);
        case 'ArrowUp':
          e.preventDefault();
          return target.parentElement.closest(nav);
        case 'ArrowLeft':
          e.preventDefault();
          return prevSibling(target);
        case 'ArrowRight':
          e.preventDefault();
          return nextSibling(target);
        // case 'Esc':
        //   e.preventDefault();
        //   return this.hideRegions();
        default:
          return null;
      }
    }

    const next = nextFocus();

    const target = e.target as HTMLElement;
    if (next) {
      target.removeAttribute('tabindex');
      next.setAttribute('tabindex', '0');
      next.focus();
      this.UpdateHighlight(target, next);
      this.UpdateRegions(next);
      return [next];
    }
    return false;
  }

  private info: Highlight;

  private UpdateHighlight(_target: HTMLElement, next: HTMLElement) {
    if (this.info) {
      (this.highlighter as any).unhighlightNode(this.info);
    }
    this.info = (this.highlighter as any).highlightNode(next);
  }

  private UpdateRegions(element: HTMLElement) {
    this.speechRegion.Update(element.getAttribute('aria-label'));
    this.brailleRegion.Update(element.getAttribute('aria-braillelabel'));
  }

  public ShowRegions(element: HTMLElement, highlighter: Sre.highlighter) {
    if (!this.shown) {
      this.speechRegion.Show(element, highlighter);
      this.brailleRegion.Show(element, highlighter);
    }
    this.shown = true;
  }

  public HideRegions() {
    if (this.shown) {
      this.speechRegion.Hide();
      this.brailleRegion.Hide();
    }
    this.shown = false;
  }
}

export interface Highlight {
  node: HTMLElement;
  opacity?: string;
  background?: string;
  foreground?: string;
  // The following is for the CSS highlighter
  box?: HTMLElement;
  position?: string;
}
