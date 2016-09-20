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
 * @fileoverview A simple MathML output visitor.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Visitor, AbstractVisitor} from './visitor';
import {TreeNode, Kind, Tag} from './tree_node';
import {LeafNode, EmptyNode} from './leaf_node';
import * as nf from './node_factory';
import {document} from './external';


export class MathmlVisitor extends AbstractVisitor {

  private indent = 0;
  private result: Element = document.createElement('top');
  private current: Element = this.result;

  /**
   * @return {Element} The XML representation of the tree.
   */
  public getResult(): Element {
    return <Element>(this.result.firstChild);
  }

  /**
   * @override
   */
  protected visitNodeMi(node: nf.NodeMi) {
    this.xmlLeaf(node, super.visitNodeMi.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMo(node: nf.NodeMo) {
    this.xmlLeaf(node, super.visitNodeMo.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMn(node: nf.NodeMn) {
    this.xmlLeaf(node, super.visitNodeMn.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtext(node: nf.NodeMtext) {
    this.xmlLeaf(node, super.visitNodeMtext.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMspace(node: nf.NodeMspace) {
    this.xmlEmpty(node, super.visitNodeMspace.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMs(node: nf.NodeMs) {
    this.xmlLeaf(node, super.visitNodeMs.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMrow(node: nf.NodeMrow) {
    this.xmlBranch(node, super.visitNodeMrow.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMfrac(node: nf.NodeMfrac) {
    this.xmlBranch(node, super.visitNodeMfrac.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsqrt(node: nf.NodeMsqrt) {
    this.xmlBranch(node, super.visitNodeMsqrt.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMroot(node: nf.NodeMroot) {
    this.xmlBranch(node, super.visitNodeMroot.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMstyle(node: nf.NodeMstyle) {
    this.xmlEmpty(node, super.visitNodeMstyle.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMerror(node: nf.NodeMerror) {
    this.xmlBranch(node, super.visitNodeMerror.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMpadded(node: nf.NodeMpadded) {
    this.xmlBranch(node, super.visitNodeMpadded.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMphantom(node: nf.NodeMphantom) {
    this.xmlBranch(node, super.visitNodeMphantom.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMfenced(node: nf.NodeMfenced) {
    this.xmlBranch(node, super.visitNodeMfenced.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMenclose(node: nf.NodeMenclose) {
    this.xmlBranch(node, super.visitNodeMenclose.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsub(node: nf.NodeMsub) {
    this.xmlBranch(node, super.visitNodeMsub.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsup(node: nf.NodeMsup) {
    this.xmlBranch(node, super.visitNodeMsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsubsup(node: nf.NodeMsubsup) {
    this.xmlBranch(node, super.visitNodeMsubsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMunder(node: nf.NodeMunder) {
    this.xmlBranch(node, super.visitNodeMunder.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMover(node: nf.NodeMover) {
    this.xmlBranch(node, super.visitNodeMover.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMunderover(node: nf.NodeMunderover) {
    this.xmlBranch(node, super.visitNodeMunderover.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMmultiscripts(node: nf.NodeMmultiscripts) {
    this.xmlBranch(node, super.visitNodeMmultiscripts.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMprescripts(node: nf.NodeMprescripts) {
    this.xmlEmpty(node, super.visitNodeMprescripts.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtable(node: nf.NodeMtable) {
    this.xmlBranch(node, super.visitNodeMtable.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMlabeledtr(node: nf.NodeMlabeledtr) {
    this.xmlBranch(node, super.visitNodeMlabeledtr.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtr(node: nf.NodeMtr) {
    this.xmlBranch(node, super.visitNodeMtr.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMtd(node: nf.NodeMtd) {
    this.xmlBranch(node, super.visitNodeMtd.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMaligngroup(node: nf.NodeMaligngroup) {
    this.xmlEmpty(node, super.visitNodeMaligngroup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMalignmark(node: nf.NodeMalignmark) {
    this.xmlEmpty(node, super.visitNodeMalignmark.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMstack(node: nf.NodeMstack) {
    this.xmlBranch(node, super.visitNodeMstack.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMlongdiv(node: nf.NodeMlongdiv) {
    this.xmlBranch(node, super.visitNodeMlongdiv.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsgroup(node: nf.NodeMsgroup) {
    this.xmlBranch(node, super.visitNodeMsgroup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsrow(node: nf.NodeMsrow) {
    this.xmlBranch(node, super.visitNodeMsrow.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMscarries(node: nf.NodeMscarries) {
    this.xmlBranch(node, super.visitNodeMscarries.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMscarry(node: nf.NodeMscarry) {
    this.xmlBranch(node, super.visitNodeMscarry.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsline(node: nf.NodeMsline) {
    this.xmlEmpty(node, super.visitNodeMsline.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMaction(node: nf.NodeMaction) {
    this.xmlBranch(node, super.visitNodeMaction.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMath(node: nf.NodeMath) {
    this.xmlBranch(node, super.visitNodeMath.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeSemantics(node: nf.NodeSemantics) {
    this.xmlBranch(node, super.visitNodeSemantics.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeAnnotation(node: nf.NodeAnnotation) {
    this.xmlBranch(node, super.visitNodeAnnotation.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeAnnotationXml(node: nf.NodeAnnotationXml) {
    this.xmlBranch(node, super.visitNodeAnnotationXml.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeNone(node: nf.NodeNone) {
    this.xmlEmpty(node, super.visitNodeNone.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeDummy(node: nf.NodeDummy) {
    this.xmlBranch(node, super.visitNodeDummy.bind(this));
  }

  /**
   * Creates a new XML element for the tree node and attaches it to the current
   * structure.
   * @param {TreeNode} node The node to output.
   * @param {Function} func The super function to call.
   * @param {string} text The content of the text element.
   */
  private xmlNode(node: TreeNode, func: Function, text: string) {
    let save = this.current;
    this.current = document.createElement(Tag.get(node.getKind()));
    save.appendChild(this.current);
    this.addAttributes(node.getAttributes());
    if (text) {
      this.current.appendChild(document.createTextNode(text));
    }
    func(node);
    this.current = save;
  }

  /**
   * Adds the attributes to the XML node.
   * @param {Object.<string, string>} attributes The attributes.
   */
  private addAttributes(attributes: {[key: string]: string}): void {
    for (let key in attributes) {
      this.current.setAttribute(key, attributes[key]);
    }
  }

  /**
   * Prints output for a leaf node.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private xmlLeaf(node: LeafNode, func: Function) {
    this.xmlNode(node, func, node.getText());
  }

  /**
   * Prints output for an empty node.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private xmlEmpty(node: EmptyNode, func: Function) {
    this.xmlNode(node, func, '');
  }

  /**
   * Prints output for a branching node.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private xmlBranch(node: TreeNode, func: Function) {
    this.xmlNode(node, func, '');
  }

}
