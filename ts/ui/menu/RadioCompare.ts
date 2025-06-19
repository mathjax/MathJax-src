/*************************************************************
 *
 *  Copyright (c) 2022-2025 The MathJax Consortium
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
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { Menu, Radio, ParserFactory } from './mj-context-menu.js';

// Extend the radio buttons with a customizable comparator to work for CS
// preferences
export class RadioCompare extends Radio {
  /**
   * @override
   */
  protected role = 'menuitemradiocompare';

  /**
   * @override
   */
  public static fromJson(
    _factory: ParserFactory,
    {
      content: content,
      variable: variable,
      id: id,
      comparator: comparator,
    }: {
      content: string;
      variable: string;
      id: string;
      comparator: (variable: string, id: string) => boolean;
    },
    menu: Menu
  ): Radio {
    return new this(menu, content, variable, id, comparator);
  }

  /**
   * @override
   */
  constructor(
    menu: Menu,
    content: string,
    variable: string,
    id: string,
    private comparator: (variable: string, id: string) => boolean
  ) {
    super(menu, content, variable, id);
  }

  /**
   * Toggles the aria checked attribute.
   *
   * @override
   */
  protected updateAria() {
    this.html.setAttribute(
      'aria-checked',
      this.comparator(this.variable.getValue(), this.id) ? 'true' : 'false'
    );
  }

  /**
   * Toggles the checked tick.
   *
   * @override
   */
  protected updateSpan() {
    this.span.style.display = this.comparator(this.variable.getValue(), this.id)
      ? ''
      : 'none';
  }
}
