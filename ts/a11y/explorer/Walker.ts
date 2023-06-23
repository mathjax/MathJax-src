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

function isCodeBlock(el) {
  return el.matches(codeSelector);
}

export function click(snippet, e) {
  const clicked = e.target.closest(nav);
  if (snippet.contains(clicked)) {
    const prev = snippet.querySelector('[tabindex="0"][role="tree"],[tabindex="0"][role="group"],[tabindex="0"][role="treeitem"]');
    if (prev) {
      prev.removeAttribute("tabindex");
    }
    clicked.setAttribute("tabindex", "0");
    clicked.focus();
    e.preventDefault();
  }
}

export function move(e) {
  
  function nextFocus() {
    function nextSibling(el) {
      const sib = el.nextElementSibling;
      if (sib) {
	if (sib.matches(nav)) {
          return sib;
	} else {
          const sibChild = sib.querySelector(nav);
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

    function prevSibling(el) {
      const sib = el.previousElementSibling;
      if (sib) {
	if (sib.matches(nav)) {
          return sib;
	} else {
          const sibChild = sib.querySelector(nav);
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

    switch (event.key) {
      case "ArrowDown":
        e.preventDefault();
        return e.target.querySelector(nav);
      case "ArrowUp":
        e.preventDefault();
        return e.target.parentElement.closest(nav);
      case "ArrowLeft":
        e.preventDefault();
        return prevSibling(e.target);
      case "ArrowRight":
        e.preventDefault();
        return nextSibling(e.target);
      default:
        return;
    }
  }

  const next = nextFocus();
  
  
  if (next) {
    e.target.removeAttribute("tabindex");
    next.setAttribute("tabindex", "0");
    next.focus();
    return true;
  }
  return false;
}
