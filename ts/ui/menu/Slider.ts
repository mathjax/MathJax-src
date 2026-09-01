/*************************************************************
 *
 *  Copyright (c) 2022-2026 The MathJax Consortium
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
 * @file  Implements a radio button with customizable comparator.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Slider } from './mj-context-menu.js';

//
// Fix slider actions (FIXME: remove when mj-context-menu is merged into MathJax-src repo)
//
export class mjSlider extends Slider {
  /**
   * @override
   */
  focus() {
    super.focus();
    this.html.focus(); // needed since super.focus uses setTimout for this
    (this as any).input.focus();
  }

  /**
   * @override
   */
  mouseup(event: MouseEvent) {
    super.mouseup(event);
    this.stop(event); // needs to prevent default action
  }

  /**
   * @override
   */
  keydown(event: KeyboardEvent) {
    let value = parseInt(((this as any).input as HTMLInputElement).value);
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        if (!event.shiftKey) {
          super.keydown(event);
          return;
        }
      /* @eslint-ignore: no-fallthrough */
      case '-':
        value = Math.max(0, value - (event.ctrlKey ? 5 : 1));
        break;

      case 'ArrowRight':
      case 'ArrowUp':
        if (!event.shiftKey) {
          super.keydown(event);
          return;
        }
      /* @eslint-ignore: no-fallthrough */
      case '+':
        value = Math.min(100, value + (event.ctrlKey ? 5 : 1));
        break;

      case 'PageDown':
        value = Math.max(0, value - 5);
        break;

      case 'PageUp':
        value = Math.max(0, value + 5);
        break;

      case 'Home':
        value = 0;
        break;

      case 'End':
        value = 100;
        break;

      default:
        super.keydown(event);
        return;
    }
    this.variable.setValue(String(value));
    this.stop(event);
  }
}
