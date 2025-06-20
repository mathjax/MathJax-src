/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file Methods for the Html package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import TexParser from '../TexParser.js';
import { ParseMethod } from '../Types.js';
import NodeUtil from '../NodeUtil.js';
import { ParseUtil } from '../ParseUtil.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import TexError from '../TexError.js';

/** Regexp for matching non-characters as specified by {@link https://infra.spec.whatwg.org/#noncharacter}. */
const nonCharacterRegexp =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  /[\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;

/**
 * Whether the string is a valid HTML attribute name according to {@link
 * https://html.spec.whatwg.org/multipage/syntax.html#attributes-2}.
 *
 * @param {string} name String to validate.
 * @returns {boolean} True if name is a valid attribute name.
 */
function isLegalAttributeName(name: string): boolean {
  return !(
    name.match(/[\x00-\x1f\x7f-\x9f "'>/=]/) || // eslint-disable-line no-control-regex
    name.match(nonCharacterRegexp)
  );
}

// Namespace
const HtmlMethods: { [key: string]: ParseMethod } = {
  /**
   * Implements \data{dataset}{content}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Data(parser: TexParser, name: string) {
    const dataset = parser.GetArgument(name);
    const arg = GetArgumentMML(parser, name);
    const data = ParseUtil.keyvalOptions(dataset);
    for (const key in data) {
      // remove illegal attribute names
      if (!isLegalAttributeName(key)) {
        throw new TexError(
          'InvalidHTMLAttr',
          'Invalid HTML attribute: %1',
          `data-${key}`
        );
      }
      NodeUtil.setAttribute(arg, `data-${key}`, data[key]);
    }
    parser.Push(arg);
  },

  /**
   * Implements \href{url}{math}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Href(parser: TexParser, name: string) {
    const url = parser.GetArgument(name);
    const arg = GetArgumentMML(parser, name);
    NodeUtil.setAttribute(arg, 'href', url);
    parser.Push(arg);
  },

  /**
   * Implements \class{name}{math}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Class(parser: TexParser, name: string) {
    let CLASS = parser.GetArgument(name);
    const arg = GetArgumentMML(parser, name);
    const oldClass = NodeUtil.getAttribute(arg, 'class');
    if (oldClass) {
      CLASS = oldClass + ' ' + CLASS;
    }
    NodeUtil.setAttribute(arg, 'class', CLASS);
    parser.Push(arg);
  },

  /**
   * Implements \style{style-string}{math}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Style(parser: TexParser, name: string) {
    let style = parser.GetArgument(name);
    const arg = GetArgumentMML(parser, name);
    // check that it looks like a style string
    let oldStyle = NodeUtil.getAttribute(arg, 'style') as string;
    if (oldStyle) {
      if (oldStyle.charAt(style.length - 1) !== ';') {
        oldStyle += ';';
      }
      style = oldStyle + ' ' + style;
    }
    NodeUtil.setAttribute(arg, 'style', style);
    parser.Push(arg);
  },

  /**
   * Implements \cssId{id}{math}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Id(parser: TexParser, name: string) {
    const ID = parser.GetArgument(name);
    const arg = GetArgumentMML(parser, name);
    NodeUtil.setAttribute(arg, 'id', ID);
    parser.Push(arg);
  },
};

/**
 * Parses the math argument of the above commands and returns it as single
 * node (in an mrow if necessary). The HTML attributes are then
 * attached to this element.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The calling macro name.
 * @returns {MmlNode} The math node.
 */
const GetArgumentMML = function (parser: TexParser, name: string): MmlNode {
  const arg = parser.ParseArg(name);
  if (!NodeUtil.isInferred(arg)) {
    return arg;
  }
  const mrow = parser.create('node', 'mrow');
  NodeUtil.copyChildren(arg, mrow);
  NodeUtil.copyAttributes(arg, mrow);
  return mrow;
};

export default HtmlMethods;
