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
 * @fileoverview Postfilter utility for the Bussproofs package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import ParseOptions from '../ParseOptions.js';
import NodeUtil from '../NodeUtil.js';
import ParseUtil from '../ParseUtil.js';

import {CHTML} from '../../../output/chtml.js';
import {HTMLDocument} from '../../../handlers/html/HTMLDocument.js';
import {HTMLMathItem} from '../../../handlers/html/HTMLMathItem.js';
import {browserAdaptor} from '../../../adaptors/browserAdaptor.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MathJax} from '../../../mathjax.js';
import {RegisterHTMLHandler} from '../../../handlers/html.js';
import {chooseAdaptor} from '../../../adaptors/chooseAdaptor.js';
import {Property, PropertyList} from '../../../core/Tree/Node.js';


// Trying to create a dummy output jax.
// 
// export class Dummy<N, T, D> extends CHTMLOutputJax<N, T, D, CHTMLWrapper<any, any, any>, CHTMLWrapperFactory<any, any, any>> {
//   public static OPTIONS = {};

//   public escaped(item: any, document?: any): N {
//     return null;
//   }

//   public processMath() {}
// }


/**
 *  Global constants local the module. They instantiate an output jax for
 *  bounding box computation.
 */
const adaptor: any = chooseAdaptor();
RegisterHTMLHandler(adaptor);
const jax = new CHTML();
const doc = MathJax.document('<html></html>', {
  OutputJax: jax
});
let item: any = null;


/**
 * Get the bounding box of a node.
 * @param {MmlNode} node The target node.
 */
let getBBox = function(node: MmlNode) {
  item.root = node;
  let {w: width} = jax.getBBox(item, doc);
  return width;
};


/**
 * Get the table that is part of an inference rule, i.e., the rule without the
 * label. We ignore preceding elements or spaces.
 * 
 * @param {MmlNode} node The out node representing the inference rule.
 * @return {MmlNode} The inner node which is the actual table.
 */
let getTable = function(node: MmlNode): MmlNode {
  let i = 0;
  while (node && !NodeUtil.isType(node, 'mtable')) {
    if (NodeUtil.isType(node, 'text')) {
      return null;
    }
    if (NodeUtil.isType(node, 'mrow')) {
      node = node.childNodes[0] as MmlNode;
      i = 0;
      continue;
    }
    node = node.parent.childNodes[i] as MmlNode;
    i++;
  }
  return node;
};


/**
 * 
 * @param {MmlNode} table 
 * @return {MmlNode} The premises in the table rule.
 */
let getPremises = function(table: MmlNode): MmlNode {
    return table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as MmlNode;
};

let getPremise = function(premises: MmlNode, n: number): MmlNode {
  return premises.childNodes[n].childNodes[0].childNodes[0] as MmlNode;
};

let firstPremise = function(premises: MmlNode): MmlNode {
  return getPremise(premises, 0) as MmlNode;
};


let lastPremise = function(premises: MmlNode): MmlNode {
  return getPremise(premises, premises.childNodes.length - 1);
};


let getConclusion = function(table: MmlNode): MmlNode {
  return table.childNodes[1].childNodes[0].childNodes[0].childNodes[0] as MmlNode;
};

let getColumn = function(inf: MmlNode): MmlNode {
  while (inf && !NodeUtil.isType(inf, 'mtd')) {
    inf = inf.parent as MmlNode;
  }
  return inf;
};

let nextSibling = function(inf: MmlNode): MmlNode {
  return inf.parent.childNodes[inf.parent.childNodes.indexOf(inf) + 1] as MmlNode;
};

let previousSibling = function(inf: MmlNode): MmlNode {
  return inf.parent.childNodes[inf.parent.childNodes.indexOf(inf) - 1] as MmlNode;
};

let getParentInf = function(inf: MmlNode): MmlNode {
  while (inf && getProperty(inf, 'inference') == null) {
    inf = inf.parent as MmlNode;
  }
  return inf;
};


let getSpaces = function(inf: MmlNode, table: MmlNode, right: boolean = false): number {
  if (inf === table) {
    return 0;
  }
  // Now inf is an mrow!
  let index = inf.childNodes.indexOf(table);
  return (right ? inf.childNodes.slice(index + 1) : inf.childNodes.slice(0, index))
    .map(getBBox)
    .reduce((x, y) => { return x + y; }, 0);
};

// - Get table T from Wrapper W.
// - Get conclusion C in T.
// - w: Preceding/following space/label.
// - |x - y|/2: Distance from left boundary to middle of conclusion. 
let adjustValue = function(inf: MmlNode, right: boolean = false): number {
  let table = getTable(inf);
  let conc = getConclusion(table);
  let w = getSpaces(inf, table, right);
  let x = getBBox(table);
  let y = getBBox(conc);
  return w + ((x - y) / 2);
};


let addSpace = function(config: ParseOptions, inf: MmlNode,
                        space: number, right: boolean = false) {
  if (NodeUtil.isType(inf, 'mrow')) {
    const index = right ? inf.childNodes.length - 1 : 0;
    let mspace = inf.childNodes[index] as MmlNode;
    if (NodeUtil.isType(mspace, 'mspace')) {
      NodeUtil.setAttribute(
        mspace, 'width',
        ParseUtil.Em(ParseUtil.dimen2em(
          NodeUtil.getAttribute(mspace, 'width') as string) + space));
      return;
    }
  }
  const mspace = config.nodeFactory.create('node', 'mspace', [],
                                           {width: ParseUtil.Em(space)});
  if (NodeUtil.isType(inf, 'mrow')) {
    if (right) {
      inf.appendChild(mspace);
      return;
    }
    mspace.parent = inf;
    inf.childNodes.unshift(mspace);
    return;
  }
  const mrow = config.nodeFactory.create('node', 'mrow');
  inf.parent.replaceChild(mrow, inf);
  mrow.setChildren(right ? [inf, mspace] : [mspace, inf]);
  moveProperties(inf, mrow);
};


let moveProperties = function(src: MmlNode, dest: MmlNode) {
  let props = ['inference', 'labelledRule', 'proof', 'maxAdjust'];
  props.forEach(x => {
    let value = getProperty(src, x);
    if (value != null) {
      setProperty(dest, x, value);
      removeProperty(src, x);
    }
  });
};


// For every inference rule we adjust the width of ruler by subtracting and
// adding suitable spaces around the rule. The algorithm in detail.
// 
// Notions that we need:
//
// * Inference: The inference rule consisting either of a single table or a list
//              containing the table plus 0 - 2 labels and spacing elements.
//              s_1....s_n l{0,1} t r{0,1} s'_1....s'_m, m,n \in IN_0
// 
// * Table: The rule without the labels and spacing.
// 
// * Wrapper: The part of the rule that contains the table. I.e., without
//            the labels but it can contain additonal spacing elements.
//            (Do we need this?) 
// * Conclusion: The element forming the conclusion of the rule. In
//               downwards inferences this is the final row of the table.
//
// * Premises: The premises of the rule. In downwards inferences this is the
//             first row of the table. Note that this is a table itself,
//             with one column for each premise and an empty column
//             inbetween.
//
// * |x|: Width of bounding box of element x.
// 
// Left adjustment:
// 
// * For the given inference rule I:
//    + compute wrapper W of I
//    + compute table T of I
//    + compute premises P of I
//    + compute premise P_f, P_l as first and last premise of I
// 
// * If P_f is an inference rule:
//    + compute adjust value a_f for wrapper W_f of P_f
//    + add -a_f space to wrapper W_f
//    + add  a_f space to wrapper W
// 
// * If P_l is an inference rule:
//   + compute adjust value a_l for wrapper W_l of P_l
//   + if I has (right) label L: a_l = a_l + |L|
//   + add -a_l space to P_l
//   + a_l = max(a_l, A_I), where A_I is saved ajust value in the
//     "maxAdjust" attribute of I.
//
//   + Case I is proof: Add a_l space to inf. (Correct after proof.)
//   + Case I has sibling: Add a_l space to sibling.  (Correct after column.)
//   + Otherwise: Propagate a_l by
//                ++ find direct parent infererence rule I'
//                ++ Set A_{I'} = a_l.
// 
/**
 * Implements the above algorithm.
 * @param {{data: ParseOptions, math: any}} arg The parser configuration and
 *     mathitem to filter.
 */
export let balanceRules = function(arg: {data: ParseOptions, math: any}) {
  let config = arg.data;
  item = new HTMLMathItem('', null, arg.math.display);
  let inferences = config.nodeLists['inference'] || [];
  let topAdjust = 0;
  for (let inf of inferences) {
    let isProof = getProperty(inf, 'proof');
    let label = getProperty(inf, 'labelledRule');
    // This currently only works with downwards rules.
    let table = getTable(inf);
    let premises = getPremises(table);
    let premiseF = firstPremise(premises);
    if (getProperty(premiseF, 'inference')) {
      let adjust = adjustValue(premiseF);
      if (adjust) {
        addSpace(config, premiseF, -1 * adjust);
        let w = getSpaces(inf, table, false);
        addSpace(config, inf, adjust - w);
      }
    }
    // Right adjust:
    let premiseL = lastPremise(premises);
    if (getProperty(premiseL, 'inference') == null) {
      continue;
    }
    let adjust = adjustValue(premiseL, true);
    addSpace(config, premiseL, -1 * adjust, true);
    let w = getSpaces(inf, table, true);
    let maxAdjust = getProperty(inf, 'maxAdjust') as number;
    if (maxAdjust != null) {
      adjust = Math.max(adjust, maxAdjust);
    }
    let column: MmlNode;
    if (isProof || !(column = getColumn(inf))) {
      // After the tree we add a space with the accumulated max value.
      // If the element is not in a column, we know we have some noise and the
      // proof is an mrow around the final inference.
      addSpace(config, inf, adjust - w, true);
      continue;
    }
    let sibling = nextSibling(column);
    if (sibling) {
      // If there is a next column, it is the empty one and we make it wider by
      // the accumulated max value.
      const pos = config.nodeFactory.create('node', 'mspace', [],
                                            {width: adjust - w + 'em'});
      sibling.appendChild(pos);
      inf.removeProperty('maxAdjust');
      continue;
    }
    let parentRule = getParentInf(column);
    if (!parentRule) {
      continue;
    }
    // We are currently in rightmost inference, so we propagate the max
    // correction value up in the tree.
    adjust = getProperty(parentRule, 'maxAdjust') ?
      Math.max(getProperty(parentRule, 'maxAdjust') as number, adjust) : adjust;
    setProperty(parentRule, 'maxAdjust', adjust);
  }
};


// Facilities for semantically relevant properties.
let property_prefix = 'bspr_';
let blacklistedProperties = {
  [property_prefix + 'maxAdjust']: true
};

// Maybe expand the node utils to extend the list of attributes that can be
// properties. Use init method to add them.

export let setProperty = function(node: MmlNode, property: string, value: Property){
  NodeUtil.setProperty(node, property_prefix + property, value);
};


export let getProperty = function(node: MmlNode, property: string): Property {
  return NodeUtil.getProperty(node, property_prefix + property);
};


export let removeProperty = function(node: MmlNode, property: string) {
  node.removeProperty(property_prefix + property);
};


export let makeBsprAttributes = function(arg: {data: ParseOptions, math: any}) {
  arg.data.root.walkTree((mml: MmlNode, data?: any) => {
    let attr: string[] = [];
    mml.getPropertyNames().forEach(x => {
      if (!blacklistedProperties[x] && x.match(RegExp('^' + property_prefix))) {
        attr.push(x + ':' + mml.getProperty(x));
      }
    });
    if (attr.length) {
      NodeUtil.setAttribute(mml, 'semantics', attr.join(';'));
    }
  });
};
