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
import {mathjax} from '../../../mathjax.js';
import {RegisterHTMLHandler} from '../../../handlers/html.js';
import {chooseAdaptor} from '../../../adaptors/chooseAdaptor.js';
import {Property, PropertyList} from '../../../core/Tree/Node.js';


/**
 *  Global constants local to the module. They instantiate an output jax for
 *  bounding box computation.
 */
const adaptor: any = chooseAdaptor();
RegisterHTMLHandler(adaptor);
const jax = new CHTML();
const doc = mathjax.document('<html></html>', {
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
 * Get the actual table that represents the inference rule, i.e., the rule
 * without the label. We ignore preceding elements or spaces.
 * 
 * @param {MmlNode} node The out node representing the inference.
 * @return {MmlNode} The actual table representing the inference rule.
 */
let getRule = function(node: MmlNode): MmlNode {
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


/*******************************
 * Convenience methods for retrieving bits of the proof tree.
 */

/**
 * 
 * @param {MmlNode} table 
 * @return {MmlNode} The premises in the table rule.
 */
let getPremises = function(rule: MmlNode, direction: string): MmlNode {
  return rule.childNodes[direction === 'up' ? 1 : 0].childNodes[0].
    childNodes[0].childNodes[0].childNodes[0] as MmlNode;
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


let getConclusion = function(rule: MmlNode, direction: string): MmlNode {
  return rule.childNodes[direction === 'up' ? 0 : 1].childNodes[0].childNodes[0].childNodes[0] as MmlNode;
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


// Computes bbox spaces
// In the case of
// right: right space + right label
// left: left space + left label
// 
let getSpaces = function(inf: MmlNode, rule: MmlNode, right: boolean = false): number {
  console.log('Getting spaces: ');
  console.log(inf);
  let result = 0;
  if (inf === rule) {
    return result;
  }
  if (inf !== rule.parent) {
    let children = inf.childNodes as MmlNode[];
    let index = right ? children.length - 1 : 0;
    if (NodeUtil.isType(children[index], 'mspace')) {
      result += getBBox(children[index]);
    }
    inf = rule.parent;
  }
  if (inf === rule) {
    return result;
  }
  let children = inf.childNodes as MmlNode[];
  let index = right ? children.length - 1 : 0;
  if (children[index] !== rule) {
    result += getBBox(children[index]);
  }
  return result;
};

// - Get rule T from Wrapper W.
// - Get conclusion C in T.
// - w: Preceding/following space/label.
// - |x - y|/2: Distance from left boundary to middle of conclusion. 
let adjustValue = function(inf: MmlNode, right: boolean = false): number {
  let rule = getRule(inf);
  let conc = getConclusion(rule, getProperty(rule, 'inferenceRule') as string);
  // Here we have to consider sequent adjustment!
  console.log('Adjusting Values:');
  console.log(conc);
  // console.log(getProperty(conc, 'sequentAdjust_left'));
  // console.log(getProperty(conc, 'sequentAdjust_right'));
  // let sequentAdjust = right ?
  //   (getProperty(conc, 'sequentAdjust_left') as number) :
  //   (getProperty(conc, 'sequentAdjust_right') as number);
  // console.log(sequentAdjust);
  // let w = getSpaces(inf, rule, right) + sequentAdjust;
  let w = getSpaces(inf, rule, right);
  let x = getBBox(rule);
  let y = getBBox(conc);
  // console.log(`Bounding box: ${y}`);
  return w + ((x - y) / 2);
};


  // if (getProperty(conc, 'sequent')) {
  //   console.log(conc);
  //   console.log(right);
  //   console.log(y);
  //   if (right) {
  //     console.log(conc.childNodes[0].childNodes[2].childNodes[0].childNodes[conc.childNodes.length - 1]);
  //     let children = conc.childNodes[0].childNodes[2].childNodes[0].childNodes;
  //     y = y - getBBox(children[children.length - 1] as MmlNode);
  //   } else {
  //     y = y - getBBox(conc.childNodes[0].childNodes[0].childNodes[0].childNodes[0] as MmlNode);
  //   }
  //   console.log(y);
  // }


let addSpace = function(config: ParseOptions, inf: MmlNode,
                        space: number, right: boolean = false) {
  console.log(inf);
  if (getProperty(inf, 'inferenceRule') ||
      getProperty(inf, 'labelledRule')) {
    const mrow = config.nodeFactory.create('node', 'mrow');
    inf.parent.replaceChild(mrow, inf);
    mrow.setChildren([inf]);
    moveProperties(inf, mrow);
    inf = mrow;
  }
  // TODO: Simplify below as we now have a definite mrow.
  const index = right ? inf.childNodes.length - 1 : 0;
  let mspace = inf.childNodes[index] as MmlNode;
  if (NodeUtil.isType(mspace, 'mspace')) {
    NodeUtil.setAttribute(
      mspace, 'width',
      ParseUtil.Em(ParseUtil.dimen2em(
        NodeUtil.getAttribute(mspace, 'width') as string) + space));
    return;
  }
  mspace = config.nodeFactory.create('node', 'mspace', [],
                                     {width: ParseUtil.Em(space)});
  if (right) {
    inf.appendChild(mspace);
    return;
  }
  mspace.parent = inf;
  inf.childNodes.unshift(mspace);
};


let moveProperties = function(src: MmlNode, dest: MmlNode) {
  let props = ['inference', 'proof', 'maxAdjust', 'labelledRule']; // 
  props.forEach(x => {
    let value = getProperty(src, x);
    if (value != null) {
      setProperty(dest, x, value);
      removeProperty(src, x);
    }
  });
};


// Sequents look like this: table row 3 cells
// The table has the 'sequent' property.
// The row is the node that is actually saved in the config object.
let adjustSequents = function(config: ParseOptions) {
  let sequents = config.nodeLists['sequent'];
  if (!sequents) {
    return;
  }
  for (let i = sequents.length - 1, seq; seq = sequents[i]; i--) {
    if (getProperty(seq, 'sequentProcessed')) {
      removeProperty(seq, 'sequentProcessed');
      continue;
    }
    let collect = [];
    let inf = getParentInf(seq);
    if (getProperty(inf, 'inference') !== 1) {
      continue;
    }
    collect.push(seq);
    while (getProperty(inf, 'inference') === 1) {
      // In case we have a table with a label.
      inf = getRule(inf);
      let premise = firstPremise(getPremises(inf, getProperty(inf, 'inferenceRule') as string));
      console.log('Axiom: ' + getProperty(premise, 'axiom'));
      console.log('Sequent: ' + getProperty(premise, 'sequent'));
      let sequent = (getProperty(premise, 'inferenceRule')) ?
        // If the first premise is an inference rule, check the conclusions for a sequent.
        getConclusion(premise, getProperty(premise, 'inferenceRule') as string) :
        // Otherwise it is a hyp and we have to check the formula itself.
        premise;
      if (getProperty(sequent, 'sequent')) {
        seq = sequent.childNodes[0] as MmlNode;
        collect.push(seq);
        setProperty(seq, 'sequentProcessed', true);
      }
      inf = premise;
    }
    // addSequentMax(config, collect, 0, 'left');
    // addSequentMax(config, collect, 2, 'right');
    adjustSequentPairwise(config, collect);
  }
};

const getSequentMax = function(sequents: MmlNode[], position: number): number {
  let max = 0;
  for (let sequent of sequents) {
    max = Math.max(max, getBBox(sequent.childNodes[position] as MmlNode));
  }
  return max;
};

const addSequentMax = function(config: ParseOptions, sequents: MmlNode[],
                               position: number, direction: string) {
  let max = getSequentMax(sequents, position);
  for (let sequent of sequents) {
    console.log(sequent.toString());
    let width = getBBox(sequent.childNodes[position] as MmlNode);
    addSequentSpace(config, sequent, position, direction, max - width);
    setProperty(sequent.parent, 'sequentAdjust_' + direction, width);
  }
};

const addSequentSpace = function(config: ParseOptions, sequent: MmlNode,
                                 position: number, direction: string, width: number) {
  let mspace = config.nodeFactory.create('node', 'mspace', [],
                                         {width: ParseUtil.Em(width)});
  if (direction === 'left') {
    let row = sequent.childNodes[position].childNodes[0] as MmlNode;
    mspace.parent = row;
    row.childNodes.unshift(mspace);
  } else {
    sequent.childNodes[position].appendChild(mspace);
  }
  setProperty(sequent.parent, 'sequentAdjust_' + direction, width);
};


const adjustSequentPairwise = function(config: ParseOptions, sequents: MmlNode[]) {
  console.log('HERE');
  let top = sequents.pop();
  console.log(top);
  while (sequents.length) {
    let bottom = sequents.pop();
    console.log(bottom);
    // let [width, direction, remainder] = compareSequents(top, bottom);
    // console.log(width);
    // console.log(direction);
    let [left, right] = compareSequents(top, bottom);
    if (getProperty(top.parent, 'axiom')) {
      addSequentSpace(config, left < 0 ? top : bottom, 0, 'left', Math.abs(left));
      addSequentSpace(config, right < 0 ? top : bottom, 2, 'right', Math.abs(right));
      // addSequentSpace(config, top, direction === 'left' ? 0 : 2, direction as string, width as number);
      // addSequentSpace(config, bottom, direction === 'left' ? 2 : 0, 'right', remainder as number);
      // addSpace(config, top.parent, -1 * (width as number), direction === 'right');
    } else {
      let inf = getParentInf(top);
      let conc = getConclusion(inf, getProperty(inf, 'inferenceRule') as string);
      console.log('Top rule');
      console.log(inf);
      console.log(conc);
      // addSpace(config, inf, width as number, direction === 'right');
    }
    // setProperty(top.parent, 'sequentAdjust', width);
    // setProperty(top.parent, 'sequentSide', direction);
    top = bottom;
  }
};


const compareSequents = function(top: MmlNode, bottom: MmlNode) {
  // Should that be getConclusion?
  // Remove left/right spaces, if there are any!
  const tr = getBBox(top.childNodes[2] as MmlNode);
  const br = getBBox(bottom.childNodes[2] as MmlNode);
  const tl = getBBox(top.childNodes[0] as MmlNode);
  const bl = getBBox(bottom.childNodes[0] as MmlNode);
  // Deltas
  const dl = tl - bl;
  const dr = tr - br;
  return [dl, dr];
  // const dt = tr - tl;
  // const db = br - bl;
  // const delta = Math.abs(dt - db);
  // console.log(`${tr} ${tl} ${br} ${bl} ${tr - tl} ${br - bl}`);
  // return (dt > db) ? [delta - (bl - tl) , 'left', delta - (tr - br)] :
  //   [delta ? 'right' : delta - br];
};

// For every inference rule we adjust the width of ruler by subtracting and
// adding suitable spaces around the rule. The algorithm in detail.
// 
// Notions that we need:
//
//
// * Inference: The inference consisting either of an inference rule or a
//              structure containing the rule plus 0 - 2 labels and spacing
//              elements.  s l{0,1} t r{0,1} s', m,n \in IN_0
// 
//              Technically this is realised as nested rows, if the spaces
//              and/or labels exist:
//              mr s mr l t r /mr s' /mr
// 
// * InferenceRule: The rule without the labels and spacing.
// 
// * Conclusion: The element forming the conclusion of the rule. In
//               downwards inferences this is the final row of the table.
//
// * Premises: The premises of the rule. In downwards inferences this is the
//             first row of the rule. Note that this is a rule itself,
//             with one column for each premise and an empty column
//             inbetween.
//
// * |x|: Width of bounding box of element x.
// 
// Left adjustment:
// 
// * For the given inference I:
//    + compute rule R of I
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
  item = new HTMLMathItem('', null, arg.math.display);
  let config = arg.data;
  adjustSequents(config);
  let inferences = config.nodeLists['inference'] || [];
  let topAdjust = 0;
  for (let inf of inferences) {
    let isProof = getProperty(inf, 'proof');
    let label = getProperty(inf, 'labelledRule');
    // This currently only works with downwards rules.
    let rule = getRule(inf);
    let premises = getPremises(rule, getProperty(rule, 'inferenceRule') as string);
    let premiseF = firstPremise(premises);
    if (getProperty(premiseF, 'inference')) {
      let adjust = adjustValue(premiseF);
      if (adjust) {
        let num = getProperty(getConclusion(inf, getProperty(rule, 'inferenceRule') as string), 'sequentAdjust_left') as number;
        console.log(getProperty(getConclusion(inf, getProperty(rule, 'inferenceRule') as string), 'sequentAdjust_left'));
        console.log(getProperty(inf, 'sequentAdjust_right'));
        console.log('Adjusting Inference');
        console.log(inf);
        console.log(premiseF);
        addSpace(config, premiseF, -1 * adjust);
        let w = getSpaces(inf, rule, false);
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
    let w = getSpaces(inf, rule, true);
    let maxAdjust = getProperty(inf, 'maxAdjust') as number;
    if (maxAdjust != null) {
      adjust = Math.max(adjust, maxAdjust);
    }
    let column: MmlNode;
    if (isProof || !(column = getColumn(inf))) {
      // After the tree we add a space with the accumulated max value.
      // If the element is not in a column, we know we have some noise and the
      // proof is an mrow around the final inference.
      addSpace(config,
               // in case the rule has been moved into an mrow in Left Adjust.
               getProperty(inf, 'proof') ? inf : inf.parent, adjust - w, true);
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
