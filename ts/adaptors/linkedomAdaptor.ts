/*************************************************************
 *
 *  Copyright (c) 2022 The MathJax Consortium
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
 * @fileoverview  Implements the linkedom DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {HTMLAdaptor} from './HTMLAdaptor.js';
import {userOptions, defaultOptions, OptionList} from '../util/Options.js';

export class LinkedomAdaptor extends HTMLAdaptor<HTMLElement, Text, Document> {

  /**
   * The default options
   */
  public static OPTIONS: OptionList = {
    fontSize: 16,          // We can't compute the font size, so always use this
    fontFamily: 'Times',   // We can't compute the font family, so always use this
    cjkCharWidth: 1,       // Width (in em units) of full width characters
    unknownCharWidth: .6,  // Width (in em units) of unknown (non-full-width) characters
    unknownCharHeight: .8, // Height (in em units) of unknown characters
  };

  /**
   * Pattern to identify CJK (i.e., full-width) characters
   */
  public static cjkPattern = new RegExp([
    '[',
    '\u1100-\u115F', // Hangul Jamo
    '\u2329\u232A',  // LEFT-POINTING ANGLE BRACKET, RIGHT-POINTING ANGLE BRACKET
    '\u2E80-\u303E', // CJK Radicals Supplement ... CJK Symbols and Punctuation
    '\u3040-\u3247', // Hiragana ... Enclosed CJK Letters and Months
    '\u3250-\u4DBF', // Enclosed CJK Letters and Months ... CJK Unified Ideographs Extension A
    '\u4E00-\uA4C6', // CJK Unified Ideographs ... Yi Radicals
    '\uA960-\uA97C', // Hangul Jamo Extended-A
    '\uAC00-\uD7A3', // Hangul Syllables
    '\uF900-\uFAFF', // CJK Compatibility Ideographs
    '\uFE10-\uFE19', // Vertical Forms
    '\uFE30-\uFE6B', // CJK Compatibility Forms ... Small Form Variants
    '\uFF01-\uFF60\uFFE0-\uFFE6', // Halfwidth and Fullwidth Forms
    '\u{1B000}-\u{1B001}', // Kana Supplement
    '\u{1F200}-\u{1F251}', // Enclosed Ideographic Supplement
    '\u{20000}-\u{3FFFD}', // CJK Unified Ideographs Extension B ... Tertiary Ideographic Plane
    ']'
  ].join(''), 'gu');

  /**
   * The options for the instance
   */
  public options: OptionList;

  /**
   * @param {Window} window   The window to work with
   * @param {OptionList} options  The options for the jsdom adaptor
   * @constructor
   */
  constructor(window: Window, options: OptionList = null) {
    super(window);
    window.constructor.prototype.HTMLCollection = class {};  // add fake class for missing HTMLCollecton
    let CLASS = this.constructor as typeof LinkedomAdaptor;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
  }

  /**
   * @override
   */
  public parse(text: string, format: string = 'text/html') {
    if (!text.match(/^(?:\s|\n)*</)) text = '<html>' + text + '</html>';
    return this.parser.parseFromString(text, format);
  }

  /**
   * @override
   *
   * This will do an HTML serialization, which may be good enough, but
   *   won't necessarily close some tags properly.
   */
  public serializeXML(node: HTMLElement) {
    return this.outerHTML(node);
  }

  /**
   * Linkedom doesn't implement getComputedStyle(), so just
   * use the default value (unfortunately).
   *
   * @override
   */
  public fontSize(_node: HTMLElement) {
    return this.options.fontSize;
  }

  /**
   * Linkedom doesn't implement getComputedStyle(), so just
   * use the default value (unfortunately).
   *
   * @override
   */
  public fontFamily(_node: HTMLElement) {
    return this.options.fontFamily;
  }

  /**
   * @override
   */
  public nodeSize(node: HTMLElement, _em: number = 1, _local: boolean = null) {
    const text = this.textContent(node);
    const non = Array.from(text.replace(LinkedomAdaptor.cjkPattern, '')).length; // # of non-CJK chars
    const CJK = Array.from(text).length - non;                                   // # of cjk chars
    return [
      CJK * this.options.cjkCharWidth + non * this.options.unknownCharWidth,
      this.options.unknownCharHeight
    ] as [number, number];
  }

  /**
   * @override
   */
  public nodeBBox(_node: HTMLElement) {
    return {left: 0, right: 0, top: 0, bottom: 0};
  }

}

/**
 * Function for creating an HTML adaptor using jsdom
 *
 * @param {any} parseHTML   The linkedom HTML parser to use for this adaptor
 * @return {HTMLAdaptor}    The newly created adaptor
 */
export function linkedomAdaptor(parseHTML: any, options: OptionList = null): HTMLAdaptor<HTMLElement, Text, Document> {
  return new LinkedomAdaptor(parseHTML('<html></html>'), options);
}
