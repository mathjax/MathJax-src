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
 * @file Configuration file for the texhtml package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import TexParser from '../TexParser.js';
import { MacroMap } from '../TokenMap.js';
import { ParseMethod } from '../Types.js';
import ParseOptions from '../ParseOptions.js';
import TexError from '../TexError.js';
import { HTMLDocument } from '../../../handlers/html/HTMLDocument.js';
import { HtmlNode } from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import { HTMLDomStrings } from '../../../handlers/html/HTMLDomStrings.js';
import { DOMAdaptor } from '../../../core/DOMAdaptor.js';

export const HtmlNodeMethods: { [key: string]: ParseMethod } = {
  /**
   * Handle a serialized <tex-html> tag
   *
   * @param {TexParser} parser  The active TeX parser
   * @param {string} _name       The name of the macro
   * @returns {boolean} Success value
   */
  TexHTML(parser: TexParser, _name: string): boolean {
    //
    //  Check that <tex-html> is allowed and that that is what we have
    //
    if (!parser.options.allowTexHTML) return false;
    const match = parser.string
      .slice(parser.i)
      .match(/^tex-html(?: n="(\d+)")?>/);
    if (!match) return false;
    //
    //  Get the serialized HTML that <tex-html> contains
    //  (If there are nested <tex-html>, they are marked using an n="x" attribute and
    //   an associated comment <!x> that marks which </tex-html> goes with it.)
    //
    parser.i += match[0].length;
    const end = (match[1] ? `<!${match[1]}>` : '') + '</tex-html>';
    const i = parser.string.slice(parser.i).indexOf(end);
    if (i < 0) {
      throw new TexError(
        'TokenNotFoundForCommand',
        'Could not find %1 for %2',
        end,
        '<' + match[0]
      );
    }
    const html = parser.string.substring(parser.i, parser.i + i).trim();
    parser.i += i + 11 + (match[1] ? 3 + match[1].length : 0);
    //
    // Parse the HTML and check that there is something there
    //
    const adaptor = parser.configuration.packageData.get('texhtml').adaptor;
    const nodes = adaptor.childNodes(adaptor.body(adaptor.parse(html)));
    if (nodes.length === 0) return true;
    //
    // Create an mtext element containing the HtmlNode internal node and push it.
    //
    const DOM = nodes.length === 1 ? nodes[0] : adaptor.node('div', {}, nodes);
    const node = (parser.create('node', 'html') as HtmlNode<any>).setHTML(
      DOM,
      adaptor
    );
    parser.Push(parser.create('node', 'mtext', [node]));
    return true;
  },
};

new MacroMap('tex-html', { '<': HtmlNodeMethods.TexHTML });

export const TexHtmlConfiguration = Configuration.create('texhtml', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.CHARACTER]: ['tex-html'],
  },
  [ConfigurationType.OPTIONS]: {
    allowTexHTML: false, // Must turn this on explicitly, since it allows unfiltered HTML insertion.
  },
  [ConfigurationType.CONFIG]: () => {
    if (HTMLDomStrings) {
      //
      //  Add the needed includeHtmlTags definition to handle <tex-html> tags
      //
      const include = HTMLDomStrings.OPTIONS.includeHtmlTags;
      if (!include['tex-html']) {
        include['tex-html'] = (
          node: any,
          adaptor: DOMAdaptor<any, any, any>
        ) => {
          //
          // Use the node's serialized contents, and check if there are
          //   nested <tex-html> nodes; if so, mark the one that we are using
          //   so that we match the correct one when we look for it later
          //   (such comments are removed from the DOM by the browser, so can't
          //   be spoofed).
          //
          const html = adaptor.innerHTML(node);
          const n = html.split(/<\/tex-html>/).length;
          const N = n > 1 ? ` n="${n}"` : '';
          return (
            `<tex-html${N}>` + html + (n > 1 ? `<!${n}>` : '') + `</tex-html>`
          );
        };
      }
    }
  },
  [ConfigurationType.PREPROCESSORS]: [
    (data: { document: HTMLDocument<any, any, any>; data: ParseOptions }) => {
      data.data.packageData.set('texhtml', { adaptor: data.document.adaptor }); // save the DOMadaptor
    },
  ],
  [ConfigurationType.POSTPROCESSORS]: [
    (data: { data: ParseOptions }) => {
      data.data.packageData.set('texhtml', { adaptor: null }); // clear the DOMadaptor
    },
  ],
});
