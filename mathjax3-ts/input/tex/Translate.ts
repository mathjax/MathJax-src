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
import {TEXCLASS, MmlNode, TextNode} from '../../core/MmlTree/MmlNode.js';
import TexParser from './TexParser.js';
import TexError from './TexError.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {OperatorDef} from '../../core/MmlTree/OperatorDictionary.js';
import {TagsFactory, DefaultTags} from './Tags.js';
import {MmlMsubsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlMunderover} from '../../core/MmlTree/MmlNodes/munderover.js';

import './BaseMappings.js';
import './AmsMappings.js';
import './AmsSymbols.js';

// A wrapper for translating scripts with LaTeX content.
// 
// TODO: This needs to be put into a proper object, so we can run multiple
//       translations in parallel, otherwise there might be interference with
//       the fixStretchy global variable.

export namespace NewTex {

  export type Script = {type: string, innerText: string, MathJax: any};

  export let fixStretchy: MmlMo[] = [];

  export function Compile(tex: string, display: boolean): MmlNode {
    let script = {
      type: 'math/tex' + (display ? '; mode=display' : ''),
      innerText: tex,
      MathJax: {}
    };
    fixStretchy = [];
    let node = Translate(script, [], {});
    (node as any).setInheritedAttributes();
    (node as any).setTeXclass();
    // Cleanup:
    cleanAttributes(node);
    combineRelations(node);
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
    let mml: MmlNode;
    let parser: TexParser;
    let math = script.innerText;
    let display = script.type.replace(/\n/g, ' ').
      match(/(;|\s|\n)mode\s*=\s*display(;|\s|\n|$)/) != null;
    try {
      parser = new TexParser(math, {display: display, isInner: false});
      mml = parser.mml();
    } catch (err) {
      if (!(err instanceof TexError)) {
        throw err;
      }
      mml = formatError(err, math, display, script);
    }
    mml = cleanSubSup(mml);
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
    cleanStretchy(NewTex.fixStretchy);
    return mathNode;
  };

  
  // Cleanup methods. Should be static on the class.
  function cleanStretchy(nodes: MmlMo[]) {
    for (let mo of nodes) {
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
  }


  // TODO: should be done with a visitor and combined with combineRelations.
  function cleanAttributes(mml: MmlNode) {
    let attribs = mml.attributes as any;
    let keys = Object.keys(attribs.attributes);
    for (let i = 0, key: string; key = keys[i]; i++) {
      if (attribs.attributes[key] === mml.attributes.getInherited(key)) {
        delete attribs.attributes[key];
      }
    }
    if (!mml.isToken) {
      let children = TreeHelper.getChildren(mml);
      for (let i = 0, m = children.length; i < m; i++) {
        cleanAttributes(children[i]);
      }
    }
  };

  


  /**
   * Combine adjacent <mo> elements that are relations (since MathML treats the
   * spacing very differently)
   * @param {MmlNode} mml The node in which to combine relations.
   */
  // TODO: should be done with a visitor and combined with cleanAttributes.
  function combineRelations(mml: MmlNode) {
    TreeHelper.printMethod('combineRelations: ');
    let m1: MmlNode, m2: MmlNode;
    let children = TreeHelper.getChildren(mml);
    for (let i = 0, m = children.length; i < m; i++) {
      if (children[i]) {
        if (TreeHelper.isType(mml, 'mrow')) {
          while (i + 1 < m && (m1 = children[i]) && (m2 = children[i + 1]) &&
                 TreeHelper.isType(m1, 'mo') && TreeHelper.isType(m2, 'mo') &&
                 TreeHelper.getTexClass(m1) === TEXCLASS.REL &&
                 TreeHelper.getTexClass(m2) === TEXCLASS.REL) {
            if (TreeHelper.getProperty(m1, 'variantForm') ===
                TreeHelper.getProperty(m2, 'variantForm') &&
                TreeHelper.getAttribute(m1, 'mathvariant') ===
                TreeHelper.getAttribute(m2, 'mathvariant')) {
              // @test Shift Left, Less Equal
              TreeHelper.appendChildren(m1, TreeHelper.getChildren(m2));
              children.splice(i + 1, 1);
              m1.attributes.setInherited('form', (m1 as MmlMo).getForms()[0]);
              m--;
            } else {
              TreeHelper.setAttribute(m1, 'rspace', '0pt');
              TreeHelper.setAttribute(m2, 'lspace', '0pt');
              i++;
            }
          }
        }
        if (!children[i].isToken) {
          combineRelations(children[i]);
        }
      }
    }
  }

  // TODO: reduce some of the casting.
  function cleanSubSup(node: MmlNode): MmlNode  {
    let rewrite: MmlNode[] = [];
    node.walkTree((n, d) => {
      const children = n.childNodes;
      if ((n.isKind('msubsup') && (!children[(n as MmlMsubsup).sub] ||
                                   !children[(n as MmlMsubsup).sup])) ||
          (n.isKind('munderover') && (!children[(n as MmlMunderover).under] ||
                                      !children[(n as MmlMunderover).over]))) {
        d.unshift(n);
      }
    }, rewrite);
    for (const n of rewrite) {
      const children = n.childNodes as (MmlNode|TextNode)[];
      const parent = n.parent;
      let ms, newNode;
      if (n.isKind('msubsup')) {
        ms = n as MmlMsubsup;
        newNode = (children[ms.sub] ?
                   TreeHelper.createNode('msub', [children[ms.base], children[ms.sub]], {}) :
                   TreeHelper.createNode('msup', [children[ms.base], children[ms.sup]], {}));
      } else {
        ms = n as MmlMunderover;
        newNode = (children[ms.under] ?
                   TreeHelper.createNode('munder', [children[ms.base], children[ms.under]], {}) :
                   TreeHelper.createNode('mover', [children[ms.base], children[ms.over]], {}));
      }
      TreeHelper.copyAttributes(n, newNode);
      if (parent) {
        parent.replaceChild(newNode, n);
      } else {
        node = newNode;
      }
    }
    return node;
  };

}
