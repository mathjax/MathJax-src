/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements the StyleJson class for handling style definitions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * The data for a selector
 */
export type StyleJsonData = {
  [property: string]: string | number;
};

/**
 * A list of selectors and their data (basically a stylesheet)
 */
export type StyleJson = {
  [selector: string]: StyleJsonData | StyleJson;
};

/******************************************************************************/
/**
 * The StyleJsonSheet class (for managing a collection of style definitions)
 */
export class StyleJsonSheet {
  /**
   * The styles as they currently stand
   */
  protected styles: StyleJson = {};

  /**
   * @returns {string}  The styles as a CSS string
   */
  get cssText(): string {
    return this.getStyleString();
  }

  /**
   * @param {StyleJson} styles  The initial styles to use, if any
   * @class
   */
  constructor(styles: StyleJson = null) {
    this.addStyles(styles);
  }

  /**
   * @param {StyleJson} styles  The styles to combine with the existing ones
   */
  public addStyles(styles: StyleJson) {
    if (!styles) return;
    for (const style of Object.keys(styles)) {
      if (!this.styles[style]) {
        this.styles[style] = {};
      }
      Object.assign(this.styles[style], styles[style]);
    }
  }

  /**
   * @param {string[]} selectors  The selectors for the styles to remove
   */
  public removeStyles(...selectors: string[]) {
    for (const selector of selectors) {
      delete this.styles[selector];
    }
  }

  /**
   * Clear all the styles
   */
  public clear() {
    this.styles = {};
  }

  /**
   * @returns {string} The CSS string for the style list
   */
  public getStyleString(): string {
    return this.getStyleRules().join('\n\n');
  }

  /**
   * @param {StyleJson} styles   The style list to convert
   * @param {string} spaces      The spaces to put at the beginning of each line
   * @returns {string[]}         An array of rule strings for the style list
   */
  public getStyleRules(
    styles: StyleJson = this.styles,
    spaces: string = ''
  ): string[] {
    const selectors = Object.keys(styles);
    const defs: string[] = new Array(selectors.length);
    let i = 0;
    for (const selector of selectors) {
      const data = styles[selector];
      defs[i++] =
        `${spaces}${selector} {\n${this.getStyleDefString(data, spaces)}\n${spaces}}`;
    }
    return defs;
  }

  /**
   * @param {StyleJsonData | StyleJson} styles  The style data to be stringified
   * @param {string} spaces                     The spaces to put at the beginning of each line
   * @returns {string}                          The CSS string for the given data
   */
  public getStyleDefString(
    styles: StyleJsonData | StyleJson,
    spaces: string
  ): string {
    const properties = Object.keys(styles);
    const values: string[] = new Array(properties.length);
    let i = 0;
    for (const property of properties) {
      values[i++] =
        styles[property] instanceof Object
          ? spaces +
            this.getStyleRules(
              {
                [property]: styles[property],
              } as StyleJson,
              spaces + '  '
            ).join('\n' + spaces)
          : '  ' + spaces + property + ': ' + styles[property] + ';';
    }
    return values.join('\n' + spaces);
  }
}
