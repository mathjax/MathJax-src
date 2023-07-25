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

// Based on the shellac walker.

const codeSelector = 'mjx-container[role="application"][data-shellac]';
const nav = '[role="application"][data-shellac],[role="tree"],[role="group"],[role="treeitem"]';

function isCodeBlock(el: HTMLElement) {
  return el.matches(codeSelector);
}

export function click(snippet: HTMLElement, e: MouseEvent) {
  const clicked = (e.target as HTMLElement).closest(nav) as HTMLElement;
  if (snippet.contains(clicked)) {
    const prev = snippet.querySelector('[tabindex="0"][role="tree"],[tabindex="0"][role="group"],[tabindex="0"][role="treeitem"]');
    if (prev) {
      prev.removeAttribute('tabindex');
    }
    clicked.setAttribute('tabindex', '0');
    clicked.focus();
    e.preventDefault();
  }
}

export function move(e: KeyboardEvent) {

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
      default:
        return null;
    }
  }

  const next = nextFocus();


  const target = e.target as HTMLElement;
  console.log(0);
  if (next) {
    target.removeAttribute('tabindex');
    next.setAttribute('tabindex', '0');
    next.focus();
    console.log(next.getAttribute('data-semantic-speech'));
    console.log(next.getAttribute('data-semantic-braille'));
    return true;
  }
  return false;
}
