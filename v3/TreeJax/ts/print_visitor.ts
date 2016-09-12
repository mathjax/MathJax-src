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
 * @fileoverview A simple ASCII print visitor.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Visitor, AbstractVisitor} from './visitor';
import {TreeNode, Kind, Tag} from './tree_node';
import {LeafNode, EmptyNode} from './leaf_node';
import * as nf from './node_factory';


export class PrintVisitor extends AbstractVisitor {

  private indent = 0;
  private result: string[] = [];

  /**
   * @return {string} The simple string representation of the tree.
   */
  public getResult(): string {
    return this.result.join('\n');
  }

  /**
   * @override
   */
  protected visitNodeMi(node: nf.NodeMi) {
    this.printLeaf(node, super.visitNodeMi.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMo(node: nf.NodeMo) {
    this.printLeaf(node, super.visitNodeMo.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMn(node: nf.NodeMn) {
    this.printLeaf(node, super.visitNodeMn.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtext(node: nf.NodeMtext) {
    this.printLeaf(node, super.visitNodeMtext.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMspace(node: nf.NodeMspace) {
    this.printEmpty(node, super.visitNodeMspace.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMs(node: nf.NodeMs) {
    this.printLeaf(node, super.visitNodeMs.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMrow(node: nf.NodeMrow) {
    this.printBranch(node, super.visitNodeMrow.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMfrac(node: nf.NodeMfrac) {
    this.printBranch(node, super.visitNodeMfrac.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsqrt(node: nf.NodeMsqrt) {
    this.printBranch(node, super.visitNodeMsqrt.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMroot(node: nf.NodeMroot) {
    this.printBranch(node, super.visitNodeMroot.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMstyle(node: nf.NodeMstyle) {
    this.printEmpty(node, super.visitNodeMstyle.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMerror(node: nf.NodeMerror) {
    this.printBranch(node, super.visitNodeMerror.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMpadded(node: nf.NodeMpadded) {
    this.printBranch(node, super.visitNodeMpadded.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMphantom(node: nf.NodeMphantom) {
    this.printBranch(node, super.visitNodeMphantom.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMfenced(node: nf.NodeMfenced) {
    this.printBranch(node, super.visitNodeMfenced.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMenclose(node: nf.NodeMenclose) {
    this.printBranch(node, super.visitNodeMenclose.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsub(node: nf.NodeMsub) {
    this.printBranch(node, super.visitNodeMsub.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsup(node: nf.NodeMsup) {
    this.printBranch(node, super.visitNodeMsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsubsup(node: nf.NodeMsubsup) {
    this.printBranch(node, super.visitNodeMsubsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMunder(node: nf.NodeMunder) {
    this.printBranch(node, super.visitNodeMunder.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMover(node: nf.NodeMover) {
    this.printBranch(node, super.visitNodeMover.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMunderover(node: nf.NodeMunderover) {
    this.printBranch(node, super.visitNodeMunderover.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMmultiscripts(node: nf.NodeMmultiscripts) {
    this.printBranch(node, super.visitNodeMmultiscripts.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMprescripts(node: nf.NodeMprescripts) {
    this.printEmpty(node, super.visitNodeMprescripts.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtable(node: nf.NodeMtable) {
    this.printBranch(node, super.visitNodeMtable.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMlabeledtr(node: nf.NodeMlabeledtr) {
    this.printBranch(node, super.visitNodeMlabeledtr.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtr(node: nf.NodeMtr) {
    this.printBranch(node, super.visitNodeMtr.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtd(node: nf.NodeMtd) {
    this.printBranch(node, super.visitNodeMtd.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMaligngroup(node: nf.NodeMaligngroup) {
    this.printEmpty(node, super.visitNodeMaligngroup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMalignmark(node: nf.NodeMalignmark) {
    this.printEmpty(node, super.visitNodeMalignmark.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMstack(node: nf.NodeMstack) {
    this.printBranch(node, super.visitNodeMstack.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMlongdiv(node: nf.NodeMlongdiv) {
    this.printBranch(node, super.visitNodeMlongdiv.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsgroup(node: nf.NodeMsgroup) {
    this.printBranch(node, super.visitNodeMsgroup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsrow(node: nf.NodeMsrow) {
    this.printBranch(node, super.visitNodeMsrow.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMscarries(node: nf.NodeMscarries) {
    this.printBranch(node, super.visitNodeMscarries.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMscarry(node: nf.NodeMscarry) {
    this.printBranch(node, super.visitNodeMscarry.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsline(node: nf.NodeMsline) {
    this.printEmpty(node, super.visitNodeMsline.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMaction(node: nf.NodeMaction) {
    this.printBranch(node, super.visitNodeMaction.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMath(node: nf.NodeMath) {
    this.printBranch(node, super.visitNodeMath.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeSemantics(node: nf.NodeSemantics) {
    this.printBranch(node, super.visitNodeSemantics.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeAnnotation(node: nf.NodeAnnotation) {
    this.printBranch(node, super.visitNodeAnnotation.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeAnnotationXml(node: nf.NodeAnnotationXml) {
    this.printBranch(node, super.visitNodeAnnotationXml.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeNone(node: nf.NodeNone) {
    this.printEmpty(node, super.visitNodeNone.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeDummy(node: nf.NodeDummy) {
    this.printBranch(node, super.visitNodeDummy.bind(this));
  }

  /**
   * Constructs a printable string for the node and an recurses on the tree.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   * @param {string} output The text output.
   */
  private printNode(node: TreeNode, func: Function, output: string) {
    let str = (new Array(this.indent + 1)).join(' ');
    str += Tag.get(node.getKind());
    str += output;
    this.result.push(str);
    this.indent++;
    func(node);
    this.indent--;
  }

  /**
   * Prints output for a leaf node.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private printLeaf(node: LeafNode, func: Function) {
    this.printNode(node, func, ': ' + (<LeafNode>node).getText());
  }

  /**
   * Prints output for an empty node.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private printEmpty(node: EmptyNode, func: Function) {
    this.printNode(node, func, '');
  }

  /**
   * Prints output for a branching node.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private printBranch(node: TreeNode, func: Function) {
    this.printNode(node, func, '');
  }

}
