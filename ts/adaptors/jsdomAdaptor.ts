/*************************************************************
 *
 *  Copyright (c) 2018-2021 The MathJax Consortium
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
 * @fileoverview  Implements the jdsom DOM adaptor
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {HTMLAdaptor} from './HTMLAdaptor.js';
import {userOptions, defaultOptions, OptionList} from '../util/Options.js';

export class JsdomAdaptor extends HTMLAdaptor<HTMLElement, Text, Document> {

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
    let CLASS = this.constructor as typeof JsdomAdaptor;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
  }

  /**
   * JSDOM's getComputedStyle() implementation is badly broken, and only
   *   return the styles explicitly set on the given node, not the
   *   inherited values frmo the cascading style sheets (so it is pretty
   *   useless).  This is somethig we can't really work around, so use
   *   the default value given in the options instead.  Sigh
   *
   * @override
   */
  public fontSize(_node: HTMLElement) {
    return this.options.fontSize;
  }

  /**
   * JSDOM's getComputedStyle() implementation is badly broken, and only
   *   return the styles explicitly set on the given node, not the
   *   inherited values frmo the cascading style sheets (so it is pretty
   *   useless).  This is somethig we can't really work around, so use
   *   the default value given in the options instead.  Sigh
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
    const non = Array.from(text.replace(JsdomAdaptor.cjkPattern, '')).length; // # of non-CJK chars
    const CJK = Array.from(text).length - non;                                // # of cjk chars
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
 * @param {any} JSDOM      The jsdom object to use for this adaptor
 * @return {HTMLAdaptor}   The newly created adaptor
 */
export function jsdomAdaptor(JSDOM: any, options: OptionList = null): HTMLAdaptor<HTMLElement, Text, Document> {
  return new JsdomAdaptor(new JSDOM().window, options);
}
