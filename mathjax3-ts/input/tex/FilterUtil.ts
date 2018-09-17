/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Utility functions for standard pre and post filters.
 *
 * @author sorge@mathjax.org (Volker Sorge)
 */


import {TEXCLASS, MmlNode, TextNode} from '../../core/MmlTree/MmlNode.js';
import NodeUtil from './NodeUtil.js';
import ParseOptions from './ParseOptions.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';


namespace FilterUtil {

  /**
   * Visitor to set stretchy attributes to false on <mo> elements, if they are
   * not used as delimiters. Also wraps non-stretchy infix delimiters into a
   * TeXAtom.
   * @param {MmlNode} node The node to rewrite.
   * @param {ParseOptions} options The parse options.
   */
  export let cleanStretchy = function(arg: {math: any, data: ParseOptions}) {
    let options = arg.data;
    for (let mo of options.getList('fixStretchy')) {
      if (NodeUtil.getProperty(mo, 'fixStretchy')) {
        let symbol = NodeUtil.getForm(mo);
        if (symbol && symbol[3] && symbol[3]['stretchy']) {
          NodeUtil.setAttribute(mo, 'stretchy', false);
        }
        const parent = mo.parent;
        if (!NodeUtil.getTexClass(mo) && (!symbol || !symbol[2])) {
          const texAtom = options.nodeFactory.create('node', 'TeXAtom', [mo]);
          parent.replaceChild(texAtom, mo);
          texAtom.setInheritedAttributes({}, arg.math['display'],
                                         parent.attributes.get('scriptlevel') as number,
                                         parent.getProperty('texprimestyle') as boolean);
        }
        NodeUtil.removeProperties(mo, 'fixStretchy');
      }
    }
  };


  /**
   * Visitor that removes superfluous attributes from nodes. I.e., if a node has
   * an attribute, which is also an inherited attribute it will be removed. This
   * is necessary as attributes are set bottom up in the parser.
   * @param {MmlNode} mml The node to clean.
   * @param {ParseOptions} options The parse options.
   */
  // TODO (DC): Move this maybe into setInheritedAttributes method?
  export let cleanAttributes = function(arg: {data: ParseOptions}) {
    let node = arg.data.root as MmlNode;
    node.walkTree((mml: MmlNode, d: any) => {
      let attribs = mml.attributes as any;
      for (const key of attribs.getExplicitNames()) {
        if (attribs.attributes[key] === mml.attributes.getInherited(key)) {
          delete attribs.attributes[key];
        }
      }
    }, {});
  };


  /**
   * Combine adjacent <mo> elements that are relations (since MathML treats the
   * spacing very differently)
   * @param {MmlNode} mml The node in which to combine relations.
   * @param {ParseOptions} options The parse options.
   */
  export let combineRelations = function(arg: {data: ParseOptions}) {
    for (let mo of arg.data.getList('mo')) {
      if (mo.getProperty('relationsCombined') || !mo.parent ||
          (mo.parent && !NodeUtil.isType(mo.parent, 'mrow'))) {
        continue;
      }
      let mml = mo.parent;
      let m1: MmlNode, m2: MmlNode;
      let children = mml.childNodes as (MmlNode|TextNode)[];
      for (let i = 0, m = children.length; i < m; i++) {
        if (!children[i]) {
          break;
        }
        while (i + 1 < m && (m1 = children[i]) && (m2 = children[i + 1]) &&
               NodeUtil.isType(m1, 'mo') && NodeUtil.isType(m2, 'mo') &&
               NodeUtil.getTexClass(m1) === TEXCLASS.REL &&
               NodeUtil.getTexClass(m2) === TEXCLASS.REL) {
          m2.setProperty('relationsCombined', true);
          if (NodeUtil.getProperty(m1, 'variantForm') ===
              NodeUtil.getProperty(m2, 'variantForm') &&
              NodeUtil.getAttribute(m1, 'mathvariant') ===
              NodeUtil.getAttribute(m2, 'mathvariant')) {
            // @test Shift Left, Less Equal
            NodeUtil.appendChildren(m1, NodeUtil.getChildren(m2));
            children.splice(i + 1, 1);
            m2.parent = null;
            m1.attributes.setInherited('form', (m1 as MmlMo).getForms()[0]);
            m--;
          } else {
            // TODO (VS): Find a test.
            NodeUtil.setAttribute(m1, 'rspace', '0pt');
            NodeUtil.setAttribute(m2, 'lspace', '0pt');
            i++;
          }
        }
      }
    }
  };


  /**
   * Cleans msubsup and munderover elements.
   * @param {ParseOptions} options The parse options.
   * @param {string} low String representing the lower part of the expression.
   * @param {string} up String representing the upper part.
   */
  let _cleanSubSup = function(options: ParseOptions, low: string, up: string) {
    for (let mml of options.getList('m' + low + up) as any[]) {
      const children = mml.childNodes;
      if (children[mml[low]] && children[mml[up]]) {
        continue;
      }
      const parent = mml.parent;
      let newNode = (children[mml[low]] ?
                 options.nodeFactory.create('node', 'm' + low, [children[mml.base], children[mml[low]]]) :
                 options.nodeFactory.create('node', 'm' + up, [children[mml.base], children[mml[up]]]));
      NodeUtil.copyAttributes(mml, newNode);
      if (parent) {
        parent.replaceChild(newNode, mml);
      } else {
        options.root = newNode;
      }
    }
  };


  /**
   * Visitor that rewrites incomplete msubsup/munderover elements in the given
   * node into corresponding msub/sup/under/over nodes.
   * @param {MmlNode} node The node to rewrite.
   * @param {ParseOptions} options The parse options.
   */
  export let cleanSubSup = function(arg: {math: any, data: ParseOptions}) {
    let options = arg.data;
    if (options.error) {
      return;
    }
    _cleanSubSup(options, 'sub', 'sup');
    _cleanSubSup(options, 'under', 'over');
    options.root.setInheritedAttributes({}, arg.math['display'], 0, false);
  };

}


export default FilterUtil;
