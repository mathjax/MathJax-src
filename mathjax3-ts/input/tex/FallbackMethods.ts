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
 * @fileoverview The Fallback Methods for the subhandlers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {TreeHelper} from './TreeHelper.js';
import TexError from './TexError.js';
import TexParser from './TexParser.js';
import {ParseMethod} from './Types.js';


/**
 *  Handle other characters (as <mo> elements)
 */
function Other(parser: TexParser, c: string) {
  TreeHelper.printMethod('Other');
  let def = {};
  if (parser.stack.env['font']) {
    // @test Other Font
    def = {mathvariant: parser.stack.env['font']};
  }

  const remap = parser.GetRemap(c);
  // @test Other
  // @test Other Remap
  const textNode = TreeHelper.createText(remap ? remap.char : c);
  let mo = TreeHelper.createNode('mo', [], def, textNode) as MmlMo;
  parser.toClean(mo);

  // VS: Question: What do these autoDefault methods do exactly.
  //     Is there a modern equivalent in v3?
  //
  //   This changes the operator class, when fences are put around it. Just
  //   propagate from the inherited attributes or properties.
  // TODO: Currently just omitted!
  // if (!TreeHelper.NEW && mo.autoDefault('stretchy',true)) {
  //   // @test A Rogers-Ramanujan Identity
  //   mo.stretchy = false;
  // }
  // if (!TreeHelper.NEW && mo.autoDefault('texClass',true) == '') {
  //   // @test A Rogers-Ramanujan Identity
  //   mo = TreeHelper.createNode('TeXAtom', [mo], {});
  // }
  parser.Push(parser.mmlToken(mo));
};

//
//  Handle undefined control sequence
//  (overridden in noUndefined extension)
//
function csUndefined(parser: TexParser, name: string) {
  TreeHelper.printMethod('csUndefined');
  throw new TexError(['UndefinedControlSequence',
                      'Undefined control sequence %1', '\\' + name]);
};

function envUndefined(parser: TexParser, env: string) {
  TreeHelper.printMethod('envUndefined');
  throw new TexError(['UnknownEnv', 'Unknown environment \'%1\'', env]);
};


let FallbackMethods: Map<string, (parser: TexParser, c: string) => void> = new Map([
  ['character', Other],
  ['macro', csUndefined],
  ['environment', envUndefined]]);


export default FallbackMethods;
