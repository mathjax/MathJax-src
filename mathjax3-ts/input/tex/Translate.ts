/*************************************************************
 *
 *  MathJax/jax/input/TeX/Translate.js
 *
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2009-2017 The MathJax Consortium
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

import {TreeHelper} from './TreeHelper.js';
import TexParser from './TexParser.js';
import ParseUtil from './ParseUtil.js';
import TexError from './TexError.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {OperatorDef} from '../../core/MmlTree/OperatorDictionary.js';
import {TagsFactory, DefaultTags} from './Tags.js';

import './BaseMappings.js';
import './AmsMappings.js';
import './AmsSymbols.js';

// A wrapper for translating scripts with LaTeX content.
// 
// TODO: This needs to be put into a proper object, so we can run multiple
//       translations in parallel, otherwise there might be interference with
//       the secondPass global variable.

export namespace NewTex {

  export type Script = {type: string, innerText: string, MathJax: any};

  export let display: boolean = false;
  export let secondPass: MmlMo[] = [];

  export function Compile(tex: string, display: boolean): MmlNode {
    let script = {
      type: 'math/tex' + (display ? '; mode=display' : ''),
      innerText: tex,
      MathJax: {}
    };
    secondPass = [];
    let node = Translate(script, [], {});
    (node as any).setInheritedAttributes();
    (node as any).setTeXclass();
    // Cleanup:
    traverse(node);
    ParseUtil.combineRelations(node);
    return node;
  }

  let formatError = function (err: TexError, math: string, display: boolean, script: Script) {
    let message = err.message.replace(/\n.*/, '');
    return TreeHelper.createError(message);
  };

  export function Translate(
    script: Script, configurations: string[] = [], stackitem?: any): MmlNode {
    // TODO: This has to become a configuration option!
    TagsFactory.getDefault();
      TreeHelper.printMethod('Translate');
      TreeHelper.printSimple(script.toString());
      let mml: MmlNode;
      let parser: TexParser;
      let math = script.innerText;
      display = script.type.replace(/\n/g, ' ').
        match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null;
      try {
        parser = new TexParser(math, null);
        mml = parser.mml();
        TreeHelper.printSimple(mml.toString());
      } catch (err) {
        if (!(err instanceof TexError)) {
          throw err;
        }
        mml = formatError(err, math, display, script);
      }
      mml = TreeHelper.cleanSubSup(mml);
      if (TreeHelper.isType(mml, 'mtable') &&
          TreeHelper.getAttribute(mml, 'displaystyle') === 'inherit') {
        // for tagged equations
        TreeHelper.untested('Tagged equations');
        TreeHelper.setAttribute(mml, 'displaystyle', display);
      }
      let mathNode = TreeHelper.createNode('math', [mml], {});
      let root = TreeHelper.getRoot(mathNode);
      if (display) {
        TreeHelper.setAttribute(root, 'display', 'block');
      }
      mathNode.setInheritedAttributes({}, false, 0, false);
      mathNode.setTeXclass(null);
      if (!parser) {
        // In case we have a caught error, parser will be undefined.
        return mathNode;
      }
      TreeHelper.printJSON(TreeHelper.getChildren(mathNode)[0]);
      for (let mo of NewTex.secondPass) {
        let symbol = TreeHelper.getForm(mo);
        if (symbol && symbol[3] && symbol[3]['stretchy']) {
          TreeHelper.setAttribute(mo, 'stretchy', false);
        }
        if (!TreeHelper.getTexClass(mo) && (!symbol || !symbol[2])) {
          const parent = mo.parent;
          const texAtom = TreeHelper.createNode('TeXAtom', [mo], {});
          texAtom.parent = parent;
          parent.replaceChild(texAtom, mo);
        }
      }
      return mathNode;
    };

  function traverse(mml: MmlNode) {
    let attribs = mml.attributes as any;
    let keys = Object.keys(attribs.attributes);
    for (let i = 0, key: string; key = keys[i]; i++) {
      if (attribs.attributes[key] === mml.attributes.getInherited(key)) {
        // console.log('Same: ' + key + ': ' + attribs.attributes[key]);
        delete attribs.attributes[key];
      }
    }
    if (!mml.isToken) {
      let children = TreeHelper.getChildren(mml);
      for (let i = 0, m = children.length; i < m; i++) {
        traverse(children[i]);
      }
    }
  };

  
}
