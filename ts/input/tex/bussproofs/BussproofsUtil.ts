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
 * @file Postfilter utility for the Bussproofs package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import ParseOptions from '../ParseOptions.js';
import NodeUtil from '../NodeUtil.js';
import { UnitUtil } from '../UnitUtil.js';

import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { Property } from '../../../core/Tree/Node.js';
import { MathItem } from '../../../core/MathItem.js';
import { MathDocument } from '../../../core/MathDocument.js';

type MATHITEM = MathItem<any, any, any>;
type MATHDOCUMENT = MathDocument<any, any, any>;

type FilterData = {
  math: MATHITEM;
  document: MATHDOCUMENT;
  data: ParseOptions;
};

/**
 *  Global constants local to the module. They instantiate an output jax for
 *  bounding box computation.
 */
let doc: MATHDOCUMENT = null;
let item: MATHITEM = null;

/**
 * Get the bounding box of a node.
 *
 * @param {MmlNode} node The target node.
 * @returns {number} Width of the proof node.
 */
const getBBox = function (node: MmlNode) {
  item.root = node;
  const { w: width } = (doc.outputJax as any).getBBox(item, doc);
  return width;
};

/**
 * Get the actual table that represents the inference rule, i.e., the rule
 * without the label. We ignore preceding elements or spaces.
 *
 * @param {MmlNode} node The out node representing the inference.
 * @returns {MmlNode} The actual table representing the inference rule.
 */
const getRule = function (node: MmlNode): MmlNode {
  let i = 0;
  while (node && !NodeUtil.isType(node, 'mtable')) {
    if (NodeUtil.isType(node, 'text')) {
      return null;
    }
    if (NodeUtil.isType(node, 'mrow')) {
      node = node.childNodes[0];
      i = 0;
      continue;
    }
    node = node.parent.childNodes[i];
    i++;
  }
  return node;
};

/*******************************
 * Convenience methods for retrieving bits of the proof tree.
 */

/**
 * Gets premises of an inference rule.
 *
 * @param {MmlNode} rule The rule.
 * @param {string} direction Up or down.
 * @returns {MmlNode} The premisses.
 */
const getPremises = function (rule: MmlNode, direction: string): MmlNode {
  return rule.childNodes[direction === 'up' ? 1 : 0].childNodes[0].childNodes[0]
    .childNodes[0].childNodes[0];
};

/**
 * Gets nth premise.
 *
 * @param {MmlNode} premises The premises.
 * @param {number} n Number of premise to get.
 * @returns {MmlNode} The nth premise.
 */
const getPremise = function (premises: MmlNode, n: number): MmlNode {
  return premises.childNodes[n].childNodes[0].childNodes[0];
};

/**
 * Gets first premise.
 *
 * @param {MmlNode} premises The premises.
 * @returns {MmlNode} The first premise.
 */
const firstPremise = function (premises: MmlNode): MmlNode {
  return getPremise(premises, 0);
};

/**
 * Gets last premise.
 *
 * @param {MmlNode} premises The premises.
 * @returns {MmlNode} The last premise.
 */
const lastPremise = function (premises: MmlNode): MmlNode {
  return getPremise(premises, premises.childNodes.length - 1);
};

/**
 * Get conclusion in an inference rule.
 *
 * @param {MmlNode} rule The rule.
 * @param {string} direction Up or down.
 * @returns {MmlNode} The conclusion.
 */
const getConclusion = function (rule: MmlNode, direction: string): MmlNode {
  return rule.childNodes[direction === 'up' ? 0 : 1].childNodes[0].childNodes[0]
    .childNodes[0];
};

/**
 * Gets the actual column element in an inference rule. I.e., digs down through
 * row, padding and space elements.
 *
 * @param {MmlNode} inf The rule.
 * @returns {MmlNode} The mtd element.
 */
const getColumn = function (inf: MmlNode): MmlNode {
  while (inf && !NodeUtil.isType(inf, 'mtd')) {
    inf = inf.parent;
  }
  return inf;
};

/**
 * Gets the next sibling of an inference rule.
 *
 * @param {MmlNode} inf The inference rule.
 * @returns {MmlNode} The next sibling.
 */
const nextSibling = function (inf: MmlNode): MmlNode {
  return inf.parent.childNodes[inf.parent.childNodes.indexOf(inf) + 1];
};

/**
 * Gets the previous sibling of an inference rule.
 *
 * @param {MmlNode} inf The inference rule.
 * @returns {MmlNode} The previous sibling.
 */
// TODO: Currently not used, but left there for a future extension.
// @ts-expect-error unused
const _previousSibling = function (inf: MmlNode): MmlNode {
  return inf.parent.childNodes[inf.parent.childNodes.indexOf(inf) - 1];
};

/**
 * Get the parent inference rule.
 *
 * @param {MmlNode} inf The inference rule.
 * @returns {MmlNode} Its parent.
 */
const getParentInf = function (inf: MmlNode): MmlNode {
  while (inf && getProperty(inf, 'inference') == null) {
    inf = inf.parent;
  }
  return inf;
};

// Computes bbox spaces
//
//

/**
 * Computes spacing left or right of an inference rule. In the case of
 * right: right space + right label
 * left: left space + left label
 *
 * @param {MmlNode} inf The overall proof tree.
 * @param {MmlNode} rule The particular inference rule.
 * @param {boolean=} right True for right, o/w left.
 * @returns {number} The spacing next to the rule.
 */
const getSpaces = function (
  inf: MmlNode,
  rule: MmlNode,
  right: boolean = false
): number {
  let result = 0;
  if (inf === rule) {
    return result;
  }
  if (inf !== rule.parent) {
    const children = inf.childNodes;
    const index = right ? children.length - 1 : 0;
    if (NodeUtil.isType(children[index], 'mspace')) {
      result += getBBox(children[index]);
    }
    inf = rule.parent;
  }
  if (inf === rule) {
    return result;
  }
  const children = inf.childNodes;
  const index = right ? children.length - 1 : 0;
  if (children[index] !== rule) {
    result += getBBox(children[index]);
  }
  return result;
};

// - Get rule T from Wrapper W.
// - Get conclusion C in T.
// - w: Preceding/following space/label.
// - (x - y)/2: Distance from left boundary to middle of C.
/**
 * Computes a space adjustment value to move the inference rule.
 *
 * @param {MmlNode} inf The inference rule.
 * @param {boolean=} right True if adjustments are on the right.
 * @returns {number} The adjustment value.
 */
const adjustValue = function (inf: MmlNode, right: boolean = false): number {
  const rule = getRule(inf);
  const conc = getConclusion(
    rule,
    getProperty(rule, 'inferenceRule') as string
  );
  // TODO:  Here we have to improve sequent adjustment!
  const w = getSpaces(inf, rule, right);
  const x = getBBox(rule);
  const y = getBBox(conc);
  return w + (x - y) / 2;
};

/**
 * Adds (positive or negative) space in the column containing the inference rule.
 *
 * @param {ParseOptions} config The parser configuration.
 * @param {MmlNode} inf The inference rule to place.
 * @param {number} space The space to be added.
 * @param {boolean=} right True if adjustment is on the right.
 */
const addSpace = function (
  config: ParseOptions,
  inf: MmlNode,
  space: number,
  right: boolean = false
) {
  if (space === 0) return;
  if (getProperty(inf, 'inferenceRule') || getProperty(inf, 'labelledRule')) {
    const mrow = config.nodeFactory.create('node', 'mrow');
    inf.parent.replaceChild(mrow, inf);
    mrow.setChildren([inf]);
    moveProperties(inf, mrow);
    inf = mrow;
  }
  // TODO: Simplify below as we now have a definite mrow.
  const index = right ? inf.childNodes.length - 1 : 0;
  let mspace = inf.childNodes[index];
  if (NodeUtil.isType(mspace, 'mspace')) {
    NodeUtil.setAttribute(
      mspace,
      'width',
      UnitUtil.em(
        UnitUtil.dimen2em(NodeUtil.getAttribute(mspace, 'width') as string) +
          space
      )
    );
    return;
  }
  mspace = config.nodeFactory.create('node', 'mspace', [], {
    width: UnitUtil.em(space),
  });
  if (right) {
    inf.appendChild(mspace);
    return;
  }
  mspace.parent = inf;
  inf.childNodes.unshift(mspace);
};

/**
 * Propagates properties up the tree.
 *
 * @param {MmlNode} src The source node.
 * @param {MmlNode} dest The destination node.
 */
const moveProperties = function (src: MmlNode, dest: MmlNode) {
  const props = ['inference', 'proof', 'labelledRule'];
  props.forEach((x) => {
    const value = getProperty(src, x);
    if (value != null) {
      setProperty(dest, x, value);
      removeProperty(src, x);
    }
  });
};

/********************************
 * The following methods deal with sequents. There are still issues with the
 * spatial layout, though.
 */
// Sequents look like this: table row 3 cells
// The table has the 'sequent' property.
// The row is the node that is actually saved in the config object.
/**
 * Method to adjust sequent positioning after the tree is computed.
 *
 * @param {ParseOptions} config Parser configuration options.
 */
const adjustSequents = function (config: ParseOptions) {
  const sequents = config.nodeLists['sequent'];
  if (!sequents) {
    return;
  }
  for (let i = sequents.length - 1, seq; (seq = sequents[i]); i--) {
    if (getProperty(seq, 'sequentProcessed')) {
      removeProperty(seq, 'sequentProcessed');
      continue;
    }
    const collect = [];
    let inf = getParentInf(seq);
    if (getProperty(inf, 'inference') !== 1) {
      continue;
    }
    collect.push(seq);
    while (getProperty(inf, 'inference') === 1) {
      // In case we have a table with a label.
      inf = getRule(inf);
      const premise = firstPremise(
        getPremises(inf, getProperty(inf, 'inferenceRule') as string)
      );
      const sequent = getProperty(premise, 'inferenceRule')
        ? // If the first premise is an inference rule, check the conclusions for a sequent.
          getConclusion(
            premise,
            getProperty(premise, 'inferenceRule') as string
          )
        : // Otherwise it is a hyp and we have to check the formula itself.
          premise;
      if (getProperty(sequent, 'sequent')) {
        seq = sequent.childNodes[0];
        collect.push(seq);
        setProperty(seq, 'sequentProcessed', true);
      }
      inf = premise;
    }
    adjustSequentPairwise(config, collect);
  }
};

/**
 * Add spaces to the sequents where necessary.
 *
 * @param {ParseOptions} config Parser configuration options.
 * @param {MmlNode} sequent The sequent inference rule.
 * @param {number} position Position of formula to adjust (0 or 2).
 * @param {string} direction Left or right of the turnstyle.
 * @param {number} width The space to add to the formulas.
 */
const addSequentSpace = function (
  config: ParseOptions,
  sequent: MmlNode,
  position: number,
  direction: string,
  width: number
) {
  const mspace = config.nodeFactory.create('node', 'mspace', [], {
    width: UnitUtil.em(width),
  });
  if (direction === 'left') {
    const row = sequent.childNodes[position].childNodes[0];
    mspace.parent = row;
    row.childNodes.unshift(mspace);
  } else {
    sequent.childNodes[position].appendChild(mspace);
  }
  setProperty(sequent.parent, 'sequentAdjust_' + direction, width);
};

/**
 * Adjusts the sequent positioning for a list of inference rules by pairwise
 * adjusting the width of formulas in sequents. I.e.,
 *    A,B |- C
 * ------------
 *    A |- B,C
 *
 * will be adjusted to
 *
 *    A, B |- C
 * ----------------
 *       A |- B,C
 *
 * @param {ParseOptions} config Parser configuration options.
 * @param {MmlNode[]} sequents The list of sequents.
 */
const adjustSequentPairwise = function (
  config: ParseOptions,
  sequents: MmlNode[]
) {
  let top = sequents.pop();
  while (sequents.length) {
    const bottom = sequents.pop();
    const [left, right] = compareSequents(top, bottom);
    if (getProperty(top.parent, 'axiom')) {
      addSequentSpace(
        config,
        left < 0 ? top : bottom,
        0,
        'left',
        Math.abs(left)
      );
      addSequentSpace(
        config,
        right < 0 ? top : bottom,
        2,
        'right',
        Math.abs(right)
      );
    }
    top = bottom;
  }
};

/**
 * Compares the top and bottom sequent of a inference rule
 * Top:     A |- B
 *        ----------
 * Bottom:  C |- D
 *
 * @param {MmlNode} top Top sequent.
 * @param {MmlNode} bottom Bottom sequent.
 * @returns {[number, number]} The delta for left and right side of the sequents.
 */
const compareSequents = function (
  top: MmlNode,
  bottom: MmlNode
): [number, number] {
  const tr = getBBox(top.childNodes[2]);
  const br = getBBox(bottom.childNodes[2]);
  const tl = getBBox(top.childNodes[0]);
  const bl = getBBox(bottom.childNodes[0]);
  // Deltas
  const dl = tl - bl;
  const dr = tr - br;
  return [dl, dr];
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
 *
 * @param {FilterData} arg The parser configuration and mathitem to filter.
 */
export const balanceRules = function (arg: FilterData) {
  item = new arg.document.options.MathItem('', null, arg.math.display);
  const config = arg.data;
  adjustSequents(config);
  const inferences = config.nodeLists['inference'] || [];
  let maxAdjust = 0; // accumulated adjsutment for complete proof
  for (const inf of inferences) {
    const isProof = getProperty(inf, 'proof');
    // This currently only works with downwards rules.
    const rule = getRule(inf);
    const premises = getPremises(
      rule,
      getProperty(rule, 'inferenceRule') as string
    );
    const premiseF = firstPremise(premises);
    let leftAdjust = 0;
    if (getProperty(premiseF, 'inference')) {
      const adjust = adjustValue(premiseF);
      if (adjust) {
        addSpace(config, premiseF, -adjust);
        const w = getSpaces(inf, rule, false);
        addSpace(config, inf, adjust - w);
        leftAdjust = adjust - w;
      }
    }
    // Right adjust:
    const premiseL = lastPremise(premises);
    if (getProperty(premiseL, 'inference') == null) {
      continue;
    }
    const adjust = adjustValue(premiseL, true);
    addSpace(config, premiseL, -adjust, true);
    const w = getSpaces(inf, rule, true);
    const delta = (getBBox(rule) - getBBox(premises.parent)) / 2; // offset from position above rule to end of rule
    addSpace(config, inf, delta < leftAdjust ? -delta : -leftAdjust);
    maxAdjust = Math.max(0, Math.max(0, maxAdjust + adjust - w) - delta);
    let column: MmlNode;
    if (isProof || !(column = getColumn(inf))) {
      // After the tree we add a space with the accumulated max value.
      // If the element is not in a column, we know we have some noise and the
      // proof is an mrow around the final inference.
      addSpace(
        config,
        // in case the rule has been moved into an mrow in Left Adjust.
        getProperty(inf, 'proof') ? inf : inf.parent,
        maxAdjust,
        true
      );
      continue;
    }
    const sibling = nextSibling(column);
    if (sibling) {
      // If there is a next column, it is the empty one and we make it wider by
      // the accumulated max value.
      const pos = config.nodeFactory.create('node', 'mspace', [], {
        width: UnitUtil.em(maxAdjust),
      });
      sibling.appendChild(pos);
      maxAdjust = 0;
      continue;
    }
    if (!getParentInf(column)) {
      continue;
    }
  }
};

/**
 * Facilities for semantically relevant properties. These are used by SRE and
 * are always prefixed with bspr_.
 */
const property_prefix = 'bspr_';
const prefix_pattern = RegExp('^' + property_prefix);

/**
 * Sets a bussproofs property used for postprocessing and to convey
 * semantics. Uses the bspr prefix.
 *
 * @param {MmlNode} node The node.
 * @param {string} property The property to set.
 * @param {Property} value Its value.
 */
export const setProperty = function (
  node: MmlNode,
  property: string,
  value: Property
) {
  NodeUtil.setProperty(node, property_prefix + property, value);
};

/**
 * Gets a bussproofs property.
 *
 * @param {MmlNode} node The node.
 * @param {string} property The property to retrieve.
 * @returns {Property} The property object.
 */
export const getProperty = function (
  node: MmlNode,
  property: string
): Property {
  return NodeUtil.getProperty(node, property_prefix + property);
};

/**
 * Removes a bussproofs property.
 *
 * @param {MmlNode} node The proof node.
 * @param {string} property The property name.
 */
export const removeProperty = function (node: MmlNode, property: string) {
  node.removeProperty(property_prefix + property);
};

/**
 * Postprocessor that adds properties as attributes to the nodes.
 *
 * @param {FilterData} arg The object to post-process.
 */
export const makeBsprAttributes = function (arg: FilterData) {
  arg.data.root.walkTree((mml: MmlNode, _data?: any) => {
    const attr: string[] = [];
    mml.getPropertyNames().forEach((x) => {
      if (x.match(prefix_pattern)) {
        attr.push(x + ':' + mml.getProperty(x));
      }
    });
    if (attr.length) {
      NodeUtil.setAttribute(mml, 'semantics', attr.join(';'));
    }
  });
};

/**
 * Preprocessor that sets the document and jax for bounding box computations
 *
 * @param {FilterData} arg The object to pre-process.
 */
export const saveDocument = function (arg: FilterData) {
  doc = arg.document;
  if (!('getBBox' in doc.outputJax)) {
    throw Error(
      'The bussproofs extension requires an output jax with a getBBox() method'
    );
  }
};

/**
 * Clear the document when we are done
 *
 * @param {FilterData} _arg The object to pre-process.
 */
export const clearDocument = function (_arg: FilterData) {
  doc = null;
};
