/*************************************************************
 *
 *  Copyright (c) 2015-2016 The MathJax Consortium
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
 * @fileoverview An Abstract Visitor.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Tree} from './tree';
import {Kind, TreeNode} from './tree_node';
import * as nf from './node_factory';


export interface Visitor {

  /**
   * The basic visitor function for trees.
   * @param {Tree} tree The tree to be visited.
   */
  visitTree(tree: Tree): void;

  /**
   * The basic visitor function for nodes.
   * @param {TreeNode} node The node to be visited.
   */
  visitNode(node: TreeNode): void;

}


export interface Visitable {

  /**
   * The acceptance function that makes a structur visitable.
   * @param {Visitor} visitor The accepted visitor.
   */
  accept(visitor: Visitor): void;

}


export abstract class AbstractVisitor implements Visitor {


  private mapIterator: [Kind, Function][] =
    [
      [Kind.mi, this.visitNodeMi.bind(this)],
      [Kind.mo, this.visitNodeMo.bind(this)],
      [Kind.mn, this.visitNodeMn.bind(this)],
      [Kind.mtext, this.visitNodeMtext.bind(this)],
      [Kind.mspace, this.visitNodeMspace.bind(this)],
      [Kind.ms, this.visitNodeMs.bind(this)],
      [Kind.mrow, this.visitNodeMrow.bind(this)],
      [Kind.mfrac, this.visitNodeMfrac.bind(this)],
      [Kind.msqrt, this.visitNodeMsqrt.bind(this)],
      [Kind.mroot, this.visitNodeMroot.bind(this)],
      [Kind.mstyle, this.visitNodeMstyle.bind(this)],
      [Kind.merror, this.visitNodeMerror.bind(this)],
      [Kind.mpadded, this.visitNodeMpadded.bind(this)],
      [Kind.mphantom, this.visitNodeMphantom.bind(this)],
      [Kind.mfenced, this.visitNodeMfenced.bind(this)],
      [Kind.menclose, this.visitNodeMenclose.bind(this)],
      [Kind.msub, this.visitNodeMsub.bind(this)],
      [Kind.msup, this.visitNodeMsup.bind(this)],
      [Kind.msubsup, this.visitNodeMsubsup.bind(this)],
      [Kind.munder, this.visitNodeMunder.bind(this)],
      [Kind.mover, this.visitNodeMover.bind(this)],
      [Kind.munderover, this.visitNodeMunderover.bind(this)],
      [Kind.mmultiscripts, this.visitNodeMmultiscripts.bind(this)],
      [Kind.mprescripts, this.visitNodeMprescripts.bind(this)],
      [Kind.mtable, this.visitNodeMtable.bind(this)],
      [Kind.mlabeledtr, this.visitNodeMlabeledtr.bind(this)],
      [Kind.mtr, this.visitNodeMtr.bind(this)],
      [Kind.mtd, this.visitNodeMtd.bind(this)],
      [Kind.maligngroup, this.visitNodeMaligngroup.bind(this)],
      [Kind.malignmark, this.visitNodeMalignmark.bind(this)],
      [Kind.mstack, this.visitNodeMstack.bind(this)],
      [Kind.mlongdiv, this.visitNodeMlongdiv.bind(this)],
      [Kind.msgroup, this.visitNodeMsgroup.bind(this)],
      [Kind.msrow, this.visitNodeMsrow.bind(this)],
      [Kind.mscarries, this.visitNodeMscarries.bind(this)],
      [Kind.mscarry, this.visitNodeMscarry.bind(this)],
      [Kind.msline, this.visitNodeMsline.bind(this)],
      [Kind.maction, this.visitNodeMaction.bind(this)],
      [Kind.math, this.visitNodeMath.bind(this)],
      [Kind.semantics, this.visitNodeSemantics.bind(this)],
      [Kind.annotation, this.visitNodeAnnotation.bind(this)],
      [Kind['annotation-xml'], this.visitNodeAnnotationXml.bind(this)],
      [Kind.none, this.visitNodeNone.bind(this)],
      [Kind.dummy, this.visitNodeDummy.bind(this)]
    ];
  private visitorMap: Map<Kind, Function> =
    new Map<Kind, Function>(this.mapIterator);

  /**
   * @override
   */
  public visitTree(tree: Tree) {
    this.visitNode(tree.getRoot());
  }

  /**
   * @override
   */
  public visitNode(node: TreeNode) {
    let func = this.visitorMap.get(node.getKind());
    if (func) {
      func(node);
    }
  }

  /**
   * Visits an Mi node.
   * @param {NodeMi} node The Mi node.
   * @protected
   */
  protected visitNodeMi(node: nf.NodeMi) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mo node.
   * @param {NodeMo} node The Mo node.
   * @protected
   */
  protected visitNodeMo(node: nf.NodeMo) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mn node.
   * @param {NodeMn} node The Mn node.
   * @protected
   */
  protected visitNodeMn(node: nf.NodeMn) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mtext node.
   * @param {NodeMtext} node The Mtext node.
   * @protected
   */
  protected visitNodeMtext(node: nf.NodeMtext) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mspace node.
   * @param {NodeMspace} node The Mspace node.
   * @protected
   */
  protected visitNodeMspace(node: nf.NodeMspace) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Ms node.
   * @param {NodeMs} node The Ms node.
   * @protected
   */
  protected visitNodeMs(node: nf.NodeMs) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mrow node.
   * @param {NodeMrow} node The Mrow node.
   * @protected
   */
  protected visitNodeMrow(node: nf.NodeMrow) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mfrac node.
   * @param {NodeMfrac} node The Mfrac node.
   * @protected
   */
  protected visitNodeMfrac(node: nf.NodeMfrac) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msqrt node.
   * @param {NodeMsqrt} node The Msqrt node.
   * @protected
   */
  protected visitNodeMsqrt(node: nf.NodeMsqrt) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mroot node.
   * @param {NodeMroot} node The Mroot node.
   * @protected
   */
  protected visitNodeMroot(node: nf.NodeMroot) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mstyle node.
   * @param {NodeMstyle} node The Mstyle node.
   * @protected
   */
  protected visitNodeMstyle(node: nf.NodeMstyle) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Merror node.
   * @param {NodeMerror} node The Merror node.
   * @protected
   */
  protected visitNodeMerror(node: nf.NodeMerror) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mpadded node.
   * @param {NodeMpadded} node The Mpadded node.
   * @protected
   */
  protected visitNodeMpadded(node: nf.NodeMpadded) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mphantom node.
   * @param {NodeMphantom} node The Mphantom node.
   * @protected
   */
  protected visitNodeMphantom(node: nf.NodeMphantom) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mfenced node.
   * @param {NodeMfenced} node The Mfenced node.
   * @protected
   */
  protected visitNodeMfenced(node: nf.NodeMfenced) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Menclose node.
   * @param {NodeMenclose} node The Menclose node.
   * @protected
   */
  protected visitNodeMenclose(node: nf.NodeMenclose) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msub node.
   * @param {NodeMsub} node The Msub node.
   * @protected
   */
  protected visitNodeMsub(node: nf.NodeMsub) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msup node.
   * @param {NodeMsup} node The Msup node.
   * @protected
   */
  protected visitNodeMsup(node: nf.NodeMsup) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msubsup node.
   * @param {NodeMsubsup} node The Msubsup node.
   * @protected
   */
  protected visitNodeMsubsup(node: nf.NodeMsubsup) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Munder node.
   * @param {NodeMunder} node The Munder node.
   * @protected
   */
  protected visitNodeMunder(node: nf.NodeMunder) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mover node.
   * @param {NodeMover} node The Mover node.
   * @protected
   */
  protected visitNodeMover(node: nf.NodeMover) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Munderover node.
   * @param {NodeMunderover} node The Munderover node.
   * @protected
   */
  protected visitNodeMunderover(node: nf.NodeMunderover) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mmultiscripts node.
   * @param {NodeMmultiscripts} node The Mmultiscripts node.
   * @protected
   */
  protected visitNodeMmultiscripts(node: nf.NodeMmultiscripts) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mprescripts node.
   * @param {NodeMprescripts} node The Mprescripts node.
   * @protected
   */
  protected visitNodeMprescripts(node: nf.NodeMprescripts) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mtable node.
   * @param {NodeMtable} node The Mtable node.
   * @protected
   */
  protected visitNodeMtable(node: nf.NodeMtable) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mlabeledtr node.
   * @param {NodeMlabeledtr} node The Mlabeledtr node.
   * @protected
   */
  protected visitNodeMlabeledtr(node: nf.NodeMlabeledtr) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mtr node.
   * @param {NodeMtr} node The Mtr node.
   * @protected
   */
  protected visitNodeMtr(node: nf.NodeMtr) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mtd node.
   * @param {NodeMtd} node The Mtd node.
   * @protected
   */
  protected visitNodeMtd(node: nf.NodeMtd) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Maligngroup node.
   * @param {NodeMaligngroup} node The Maligngroup node.
   * @protected
   */
  protected visitNodeMaligngroup(node: nf.NodeMaligngroup) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Malignmark node.
   * @param {NodeMalignmark} node The Malignmark node.
   * @protected
   */
  protected visitNodeMalignmark(node: nf.NodeMalignmark) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mstack node.
   * @param {NodeMstack} node The Mstack node.
   * @protected
   */
  protected visitNodeMstack(node: nf.NodeMstack) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mlongdiv node.
   * @param {NodeMlongdiv} node The Mlongdiv node.
   * @protected
   */
  protected visitNodeMlongdiv(node: nf.NodeMlongdiv) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msgroup node.
   * @param {NodeMsgroup} node The Msgroup node.
   * @protected
   */
  protected visitNodeMsgroup(node: nf.NodeMsgroup) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msrow node.
   * @param {NodeMsrow} node The Msrow node.
   * @protected
   */
  protected visitNodeMsrow(node: nf.NodeMsrow) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mscarries node.
   * @param {NodeMscarries} node The Mscarries node.
   * @protected
   */
  protected visitNodeMscarries(node: nf.NodeMscarries) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Mscarry node.
   * @param {NodeMscarry} node The Mscarry node.
   * @protected
   */
  protected visitNodeMscarry(node: nf.NodeMscarry) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Msline node.
   * @param {NodeMsline} node The Msline node.
   * @protected
   */
  protected visitNodeMsline(node: nf.NodeMsline) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Maction node.
   * @param {NodeMaction} node The Maction node.
   * @protected
   */
  protected visitNodeMaction(node: nf.NodeMaction) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Math node.
   * @param {NodeMath} node The Math node.
   * @protected
   */
  protected visitNodeMath(node: nf.NodeMath) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Semantics node.
   * @param {NodeSemantics} node The Semantics node.
   * @protected
   */
  protected visitNodeSemantics(node: nf.NodeSemantics) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Annotation node.
   * @param {NodeAnnotation} node The Annotation node.
   * @protected
   */
  protected visitNodeAnnotation(node: nf.NodeAnnotation) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an XML Annotation node.
   * @param {NodeAnnotationXml} node The XML Annotation node.
   * @protected
   */
  protected visitNodeAnnotationXml(node: nf.NodeAnnotationXml) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an None node.
   * @param {NodeNone} node The None node.
   * @protected
   */
  protected visitNodeNone(node: nf.NodeNone) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits an Dummy node.
   * @param {NodeDummy} node The Dummy node.
   * @protected
   */
  protected visitNodeDummy(node: nf.NodeDummy) {
    this.visitChildren(node.getChildren());
  }

  /**
   * Visits a list of child nodes.
   * @param {Array.<TreeNode>} nodes The node list.
   * @private
   */
  private visitChildren(nodes: TreeNode[]) {
    for (let node of nodes) {
      node.accept(this);
    }
  }

}
