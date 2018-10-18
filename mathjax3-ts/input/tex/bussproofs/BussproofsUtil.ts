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

import {CHTML} from '../../../output/chtml.js';
import {HTMLDocument} from '../../../handlers/html/HTMLDocument.js';
import {HTMLMathItem} from '../../../handlers/html/HTMLMathItem.js';
import {browserAdaptor} from '../../../adaptors/browserAdaptor.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MathJax} from '../../../mathjax.js';
import {RegisterHTMLHandler} from '../../../handlers/html.js';
import {chooseAdaptor} from '../../../adaptors/chooseAdaptor.js';


const adaptor: any = chooseAdaptor();
RegisterHTMLHandler(adaptor);
let jax = new CHTML();
let doc = MathJax.document('<html></html>', {
  OutputJax: jax
});
let item: any = null;

let getBBox = function(node: MmlNode) {
  item.root = node;
  let {w: width} = jax.getBBox(item, doc);
  return width;
};


let getTable = function(node: MmlNode): MmlNode {
  let i = 0;
  while (!NodeUtil.isType(node, 'mtable')) {
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


let getConclusion = function(table: MmlNode): MmlNode {
  return table.childNodes[1].childNodes[0].childNodes[0].childNodes[0] as MmlNode;
};

let getWrapped = function(inf: MmlNode): MmlNode {
  return NodeUtil.isType(inf, 'mtable') ? inf : inf.childNodes[0] as MmlNode;
};

let appendInference = function(inf: MmlNode, space: MmlNode, config: ParseOptions) {
  if (NodeUtil.isType(inf, 'mrow')) {
    inf.appendChild(space);
    return;
  }
  const mrow = config.nodeFactory.create('node', 'mrow');
  inf.parent.replaceChild(mrow, inf);
  mrow.setChildren([inf, space]);
  mrow.setProperty('inference', inf.getProperty('inference'));
};

export let balanceRules = function(arg: {data: ParseOptions, math: any}) {
  let config = arg.data;
  item = new HTMLMathItem('', null, arg.math.display);
  let inferences = config.nodeLists['inference'] || [];
  for (let inf of inferences) {

    // Left adjust:
    let wrapped1 = getWrapped(inf); //  First node in row is a (wrapped) table.
    let table1 = getTable(wrapped1);         // Unpack the table in the wrapper.
    let conc1 = getConclusion(table1);  // Get the conclusion.
    let frow = table1.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    let inf2 = frow.childNodes[0].childNodes[0].childNodes[0] as MmlNode;
    if (inf2.getProperty('inference')) {
      getBBox(inf2 as MmlNode);
      let i = 0;
      let wrapped2 = getWrapped(inf2);
      let table2 = getTable(wrapped2);
      let conc2 = getConclusion(table2);
      let w = getBBox(wrapped2);
      let x = getBBox(table2);
      let y = getBBox(conc2);
      let adjust = (w - x) + ((x - y) / 2);
      if (adjust) {
        const pos = config.nodeFactory.create('node', 'mspace', [], {width: adjust + 'em'});
        const neg = config.nodeFactory.create('node', 'mspace', [], {width: '-' + adjust + 'em'});
        const mrow1 = config.nodeFactory.create('node', 'mrow');
        const mrow2 = config.nodeFactory.create('node', 'mrow');
        wrapped1.parent.replaceChild(mrow1, wrapped1);
        wrapped2.parent.replaceChild(mrow2, wrapped2);
        mrow1.setChildren([pos, wrapped1]);
        mrow2.setChildren([neg, wrapped2]);
      }
    }
    // Right adjust:
    let inf3 = frow.childNodes[frow.childNodes.length - 1].childNodes[0].childNodes[0] as MmlNode;
    // console.log('Inf3: ' + getBBox(inf3));
    if (inf3.getProperty('inference') == null) {
      continue;
    }
    let oldInf = getBBox(inf);
    console.log('Inf: ' + inf);
    console.log('Inf: ' + oldInf);
    let wrapped3 = getWrapped(inf3);
    let table3 = getTable(wrapped3);
    let conc3 = getConclusion(table3);
    let x = getBBox(table3);
    let y = getBBox(conc3);
    let adjust = (x - y) / 2;
    if (NodeUtil.isType(inf3, 'mrow') && inf3.childNodes[1]) {
      adjust += getBBox(inf3.childNodes[1] as MmlNode);
      // adjust += inf3.childNodes.slice(1).
      //   map(getBBox).
      //   reduce((x, y) => {return x + y; }, 0);
    }
    const neg = config.nodeFactory.create('node', 'mspace', [], {width: '-' + adjust + 'em'});
    appendInference(inf3, neg, config);
    //
    // Works well up to here!
    //
    let maxAdjust = inf.getProperty('maxAdjust') as number;
    console.log('MaxAdjust: ' + maxAdjust);
    console.log(typeof maxAdjust);
    console.log('normal adjust: ' + adjust);
    if (maxAdjust != null) {
      adjust = Math.max(adjust, maxAdjust);
      console.log('New adjust: ' + adjust);
    }
    if (inf.getProperty('proof')) {
      console.log('The Proof');
      console.log(adjust);
      // We only need to correct the last inference rule in the tree.
      // 
      // TODO: Currently we only use the last correction value. We need to
      //       account for overhang of the proof tree on the right.
      // adjust = inf.getProperty('proof') ? adjust : ((oldInf - newInf) / 2);
      const pos = config.nodeFactory.create('node', 'mspace', [],
                                            {width: adjust + 'em'});
      appendInference(inf, pos, config);
      continue;
    }
    let srow = inf.parent.parent;  // That should be the mtd node!
    let sibling = srow.parent.childNodes[srow.parent.childNodes.indexOf(srow) + 1] as MmlNode;
    console.log(srow);
    console.log(sibling);
    if (sibling) {
      console.log('Sibling');
      const pos = config.nodeFactory.create('node', 'mspace', [],
                                            {width: adjust + 'em'});
      sibling.appendChild(pos);
      inf.removeProperty('maxAdjust');
      continue;
    }
    while (srow && srow.getProperty('inference') == null) {
      srow = srow.parent as MmlNode;
    }
    console.log('No sibling! inference: ' + srow);
    adjust = srow.getProperty('maxAdjust') ?
      Math.max(srow.getProperty('maxAdjust') as number, adjust) : adjust;
    console.log('Setting property: ' + adjust);
    srow.setProperty('maxAdjust', adjust);
    // console.log('Inf3: ' + getBBox(inf3));
    // if (inf.getProperty('proof')) {
    // if (newInf < oldInf) {
      // We only need to correct the last inference rule in the tree.
      // 
      // TODO: Currently we only use the last correction value. We need to
      //       account for overhang of the proof tree on the right.
      // adjust = inf.getProperty('proof') ? adjust : ((oldInf - newInf) / 2);
      // const pos = config.nodeFactory.create('node', 'mspace', [],
      //                                       {width: adjust + 'em'});
      // appendInference(inf, pos, config);
    // }
  }
};
