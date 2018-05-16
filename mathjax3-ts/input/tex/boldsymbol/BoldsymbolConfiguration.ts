/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview Configuration file for the boldsymbol package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TextNode, MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {Configuration} from '../Configuration.js';
import {TreeHelper} from '../TreeHelper.js';
import TexParser from '../TexParser.js';
import {TexConstant} from '../TexConstants.js';
import {CommandMap} from '../SymbolMap.js';
import {ParseMethod} from '../Types.js';

let BOLDVARIANT: {[key: string]: string} = {};
BOLDVARIANT[TexConstant.Variant.NORMAL] = TexConstant.Variant.BOLD;
BOLDVARIANT[TexConstant.Variant.ITALIC]    = TexConstant.Variant.BOLDITALIC;
BOLDVARIANT[TexConstant.Variant.FRAKTUR]   = TexConstant.Variant.BOLDFRAKTUR;
BOLDVARIANT[TexConstant.Variant.SCRIPT]    = TexConstant.Variant.BOLDSCRIPT;
BOLDVARIANT[TexConstant.Variant.SANSSERIF] = TexConstant.Variant.BOLDSANSSERIF;
BOLDVARIANT['-tex-caligraphic']    = '-tex-caligraphic-bold';
BOLDVARIANT['-tex-oldstyle']       = '-tex-oldstyle-bold';


// Namespace
export let BoldsymbolMethods: Record<string, ParseMethod> = {};

BoldsymbolMethods.Boldsymbol = function (parser: TexParser, name: string) {
  // TODO: This is a hack! Get rid of it once we have a proper node factory.
  TreeHelper.parser = parser;
  let boldsymbol = parser.stack.env.boldsymbol,
  font = parser.stack.env.font;
  parser.stack.env.boldsymbol = true;
  parser.stack.env.font = null;
  let mml = parser.ParseArg(name);
  parser.stack.env.font = font;
  parser.stack.env.boldsymbol = boldsymbol;
  parser.Push(mml);
  TreeHelper.parser = null;
};


new CommandMap('boldsymbol', {boldsymbol: 'Boldsymbol'}, BoldsymbolMethods);


export function createBoldToken(kind: string, def: any, text: string): MmlNode  {
  let token = TreeHelper._createToken(kind, def, text);
  if (kind !== 'mtext' &&
      TreeHelper.parser && TreeHelper.parser.stack.env.boldsymbol) {
    TreeHelper.setProperties(token, {'fixBold': true});
  }
  return token;
}


export function rewriteBoldTokens(mml: MmlNode): MmlNode  {
  mml.walkTree((node: MmlNode, d: any) => {
    if (TreeHelper.getProperty(node, 'fixStretchy')) {
      let variant = TreeHelper.getAttribute(node, 'mathvariant') as string;
      if (variant == null) {
        TreeHelper.setProperties(node, {mathvariant: TexConstant.Variant.BOLD});
      } else {
        TreeHelper.setProperties(node, {mathvariant: BOLDVARIANT[variant] || variant});
      }
    }}, {});
  return mml;
}


export const BoldsymbolConfiguration = Configuration.create(
  'boldsymbol', {handler: {macro: ['boldsymbol']},
                 nodes: {'createToken': createBoldToken},
                 postprocessors: [rewriteBoldTokens]}
);


