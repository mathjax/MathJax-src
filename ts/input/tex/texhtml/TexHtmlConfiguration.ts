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
 * @fileoverview Configuration file for the texhtml package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';
import ParseOptions from '../ParseOptions.js';
import TexError from '../TexError.js';
import {HTMLDocument} from '../../../handlers/html/HTMLDocument.js';
import {HtmlNode} from '../../../core/MmlTree/MmlNodes/HtmlNode.js';
import {HTMLDomStrings} from '../../../handlers/HTML/HTMLDomStrings.js';

export const TexHtmlMethods: Record<string, ParseMethod> = {
  /**
   * Handle the \texHTML macro
   *
   * @param {TexParser} parser  The active TeX parser
   * @param {string} name       The name of the macro
   */
  TexHtml(parser: TexParser, name: string) {
    if (!parser.options.allowTexHTML) {
      throw new TexError('NoTexHtml', '%1 is not allowed in the current configuration', name);
    }
    //
    //  get and parse the HTML fragment.
    //
    const html = parser.GetArgument(name)
      .trim()
      .replace(/^<tex-html>(.*)<\/tex-html>/, '$1')   // remove redundant <tex-html> node
      .replace(/^\\texHTML\{(.*)\}$/, '$1');          // remove \texHTML introduced by <tex-html> by FindTeX
    const adaptor = parser.configuration.packageData.get('texhtml').adaptor;
    const nodes = adaptor.childNodes(adaptor.body(adaptor.parse(html)));
    if (nodes.length === 0) return;
    //
    // Create an mtext element containing the HtmlNode internal node and push it.
    //
    const DOM = (nodes.length === 1 ? nodes[0] : adaptor.node('div', {}, nodes));
    const node = (parser.create('node', 'html') as HtmlNode<any>).setHTML(DOM, adaptor);
    parser.Push(parser.create('node', 'mtext', [node]));
  }
};

new CommandMap('texhtml', {texHTML: 'TexHtml'}, TexHtmlMethods);

export const TexHtmlConfiguration = Configuration.create(
  'texhtml', {
    handler: {macro: ['texhtml']},
    options: {
      allowTexHTML: false    // Must turn this on explicitly, since it allows unfiltered HTML insertion.
    },
    config: () => {
      if (HTMLDomStrings) {
        const include = HTMLDomStrings.OPTIONS.includeHtmlTags;
        if (!include['tex-html']) {
          include['tex-html'] = ['\\texHTML{', '}'];
        }
      }
    },
    preprocessors: [(data: {document: HTMLDocument<any, any, any>, data: ParseOptions}) => {
      data.data.packageData.set('texhtml', {adaptor: data.document.adaptor});  // save the DOMadaptor
    }],
    postprocessors: [(data: {data: ParseOptions}) => {
      data.data.packageData.set('texhtml', {adaptor: null});                   // clear the DOMadaptor
    }]
  }
);

