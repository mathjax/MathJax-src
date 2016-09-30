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
 * @fileoverview A simple Semantic output visitor.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

/// <reference path="semantic.d.ts" />

import {Visitor, AbstractVisitor} from './visitor';
import {TreeNode, Kind, Tag} from './tree_node';
import {LeafNode, EmptyNode} from './leaf_node';
import * as nf from './node_factory';
import sem = require('semantic');

export class SemanticVisitor extends AbstractVisitor {

  private factory: sem.NodeFactory;
  private result: sem.Tree = sem.emptyTree();
  private childrenStack: sem.Node[][] = [[]];

  /**
   * @constructor
   * @extends {AbstractVisitor}
   */
  constructor() {
    super();
    this.factory = new sem.NodeFactory();
    sem.Processor.setFactory(this.factory);
  }

  /**
   * @return {SemanticTree} The semantic tree.
   */
  public getResult(): sem.Tree {
    this.result.root = this.childrenStack[0][0];
    return this.result;
  }

  /**
   * @override
   */
  protected visitNodeMi(node: nf.NodeMi) {
    let attributes = node.getAttributes();
    let semNode = sem.Processor.identifierNode(
      node.getText(), attributes['mathvariant'], attributes['class']);
    // TODO: Do we need this for leaf nodes?
    this.appendChild(semNode);
    this.stackChildren();
    super.visitNodeMi(node);
    this.unstackChildren();
  }

  /**
   * @override
   */
  protected visitNodeMo(node: nf.NodeMo) {
    let semNode = this.factory.makeLeafNode(
      node.getText(), node.getAttributes()['mathvariant']);
    if (semNode.type === sem.Type.UNKNOWN) {
      semNode.type = sem.Type.OPERATOR;
    }
    // TODO: Do we need this for leaf nodes?
    this.appendChild(semNode);
    this.stackChildren();
    super.visitNodeMo(node);
    this.unstackChildren();
  }

  /**
   * @override
   */
  protected visitNodeMn(node: nf.NodeMn) {
    let semNode = this.factory.makeLeafNode(
      node.getText(), node.getAttributes()['mathvariant']);
    sem.Processor.number(semNode);
    this.appendChild(semNode);
    this.stackChildren();
    super.visitNodeMn(node);
    this.unstackChildren();
  }

  /**
   * @override
   */
  protected visitNodeMtext(node: nf.NodeMtext) {
    this.textNode('MTEXT', node, super.visitNodeMtext.bind(this));
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeMspace(node: nf.NodeMspace) {
  //   super.visitNodeMspace(node);
  // }

  /**
   * @override
   */
  protected visitNodeMs(node: nf.NodeMs) {
    this.textNode('MS', node, super.visitNodeMs.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMrow(node: nf.NodeMrow) {
    this.inferredRow(node, super.visitNodeMrow.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMfrac(node: nf.NodeMfrac) {
    this.stackChildren();
    super.visitNodeMfrac(node);
    let children = this.childrenStack[0];
    let semNode = sem.Processor.fractionLikeNode(
      node.getAttributes()['linethickness'], children[0], children[1]);
    this.unstackChildren();
    this.appendChild(semNode);
  }

  /**
   * @override
   */
  protected visitNodeMsqrt(node: nf.NodeMsqrt) {
    this.stackChildren();
    super.visitNodeMsqrt(node);
    let children = this.childrenStack[0];
    let semNode = this.factory.makeBranchNode(
      sem.Type.SQRT, [sem.Processor.row(children)], []);
    this.unstackChildren();
    this.appendChild(semNode);
  }

  /**
   * @override
   */
  protected visitNodeMroot(node: nf.NodeMroot) {
    this.stackChildren();
    super.visitNodeMroot(node);
    let children = this.childrenStack[0];
    let semNode = this.factory.makeBranchNode(
      sem.Type.ROOT, [children[1], children[0]], []);
    this.unstackChildren();
    this.appendChild(semNode);
  }

  /**
   * @override
   */
  protected visitNodeMstyle(node: nf.NodeMstyle) {
    this.inferredRow(node, super.visitNodeMstyle.bind(this));
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeMerror(node: nf.NodeMerror) {
  //   super.visitNodeMerror(node);
  // }

  /**
   * @override
   */
  protected visitNodeMpadded(node: nf.NodeMpadded) {
    this.inferredRow(node, super.visitNodeMpadded.bind(this));
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeMphantom(node: nf.NodeMphantom) {
  //   super.visitNodeMphantom(node);
  // }

  /**
   * @override
   */
  protected visitNodeMfenced(node: nf.NodeMfenced) {
    this.stackChildren();
    super.visitNodeMfenced(node);
    let children = this.childrenStack[0];
    let attributes = node.getAttributes();
    let sepValue = this.getAttributeDefault(attributes, 'separators', ',');
    let open = this.getAttributeDefault(attributes, 'open', '(');
    let close = this.getAttributeDefault(attributes, 'close', ')');
    let semNode = sem.Processor.mfenced(open, close, sepValue, children);
    this.unstackChildren();
    this.appendChild(semNode);
  }

  /**
   * @override
   */
  protected visitNodeMenclose(node: nf.NodeMenclose) {
    this.stackChildren();
    super.visitNodeMenclose(node);
    let children = this.childrenStack[0];
    let semNode = this.factory.makeBranchNode(
      sem.Type.ENCLOSE, [sem.Processor.row(children)], []);
    semNode.role = node.getAttributes()['notation'] || sem.Role.UNKNOWN;
    this.unstackChildren();
    this.appendChild(semNode);
  }

  /**
   * @override
   */
  protected visitNodeMsub(node: nf.NodeMsub) {
    this.limitNode('MSUB', node, super.visitNodeMsub.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsup(node: nf.NodeMsup) {
    this.limitNode('MSUP', node, super.visitNodeMsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsubsup(node: nf.NodeMsubsup) {
    this.limitNode('MSUBSUP', node, super.visitNodeMsubsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMunder(node: nf.NodeMunder) {
    this.limitNode('MUNDER', node, super.visitNodeMunder.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMover(node: nf.NodeMover) {
    this.limitNode('MOVER', node, super.visitNodeMover.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMunderover(node: nf.NodeMunderover) {
    this.limitNode('MUNDEROVER', node, super.visitNodeMunderover.bind(this));
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeMmultiscripts(node: nf.NodeMmultiscripts) {
  //   super.visitNodeMmultiscripts(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMprescripts(node: nf.NodeMprescripts) {
  //   super.visitNodeMprescripts(node);
  // }

  /**
   * @override
   */
  protected visitNodeMtable(node: nf.NodeMtable) {
    this.stackChildren();
    super.visitNodeMtable(node);
    let children = this.childrenStack[0];
    let semNode = this.factory.makeBranchNode(sem.Type.TABLE, children, []);
    sem.Processor.tableToMultiline(semNode);
    this.unstackChildren();
    this.appendChild(semNode);
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeMlabeledtr(node: nf.NodeMlabeledtr) {
  //   super.visitNodeMlabeledtr(node);
  // }

  /**
   * @override
   */
  protected visitNodeMtr(node: nf.NodeMtr) {
    this.stackChildren();
    super.visitNodeMtr(node);
    let children = this.childrenStack[0];
    let semNode = this.factory.makeBranchNode(sem.Type.ROW, children, []);
    semNode.role = sem.Role.TABLE;
    this.unstackChildren();
    this.appendChild(semNode);
  }

  /**
   * @override
   */
  protected visitNodeMtd(node: nf.NodeMtd) {
    this.stackChildren();
    super.visitNodeMtd(node);
    let children = this.childrenStack[0];
    let semNode = this.factory.makeBranchNode(
      sem.Type.CELL, [sem.Processor.row(children)], []);
    semNode.role = sem.Role.TABLE;
    this.unstackChildren();
    this.appendChild(semNode);
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeMaligngroup(node: nf.NodeMaligngroup) {
  //   super.visitNodeMaligngroup(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMalignmark(node: nf.NodeMalignmark) {
  //   super.visitNodeMalignmark(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMstack(node: nf.NodeMstack) {
  //   super.visitNodeMstack(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMlongdiv(node: nf.NodeMlongdiv) {
  //   super.visitNodeMlongdiv(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMsgroup(node: nf.NodeMsgroup) {
  //   super.visitNodeMsgroup(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMsrow(node: nf.NodeMsrow) {
  //   super.visitNodeMsrow(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMscarries(node: nf.NodeMscarries) {
  //   super.visitNodeMscarries(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMscarry(node: nf.NodeMscarry) {
  //   super.visitNodeMscarry(node);
  // }

  // /**
  //  * @override
  //  */
  // protected visitNodeMsline(node: nf.NodeMsline) {
  //   super.visitNodeMsline(node);
  // }

  /**
   * @override
   */
  protected visitNodeMaction(node: nf.NodeMaction) {
    if (node.getChildren().length <= 1) {
      this.appendChild(this.factory.makeUnprocessed(node));
      return;
    }
    this.visitNode(node.getChildren()[1]);
  }

  /**
   * @override
   */
  protected visitNodeMath(node: nf.NodeMath) {
    this.inferredRow(node, super.visitNodeMath.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeSemantics(node: nf.NodeSemantics) {
    node.getChildren().length ?
      super.visitNodeSemantics(node) :
      this.appendChild(this.factory.makeEmptyNode());
  }

  /**
   * @override
   */
  protected visitNodeAnnotation(node: nf.NodeAnnotation) {
    this.appendChild(this.factory.makeEmptyNode());
  }

  /**
   * @override
   */
  protected visitNodeAnnotationXml(node: nf.NodeAnnotationXml) {
    this.textNode('ANNOTATION-XML', node,
                  super.visitNodeAnnotationXml.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeNone(node: nf.NodeNone) {
    this.appendChild(this.factory.makeEmptyNode());
  }

  // /**
  //  * @override
  //  */
  // protected visitNodeDummy(node: nf.NodeDummy) {
  //   super.visitNodeDummy(node);
  // }

  /**
   * Adds a level to the child structure.
   */
  private stackChildren() {
    this.childrenStack.unshift([]);
  }

  /**
   * Removes the current level from the child structure.
   */
  private unstackChildren() {
    this.childrenStack.shift();
  }

  /**
   * Appends a node at the current level in the child structure.
   */
  private appendChild(node: sem.Node) {
    this.childrenStack[0].push(node);
  }

  private limitNode(tag: string, node: TreeNode, func: Function) {
    this.stackChildren();
    func(node);
    let semNode = sem.Processor.limitNode(tag, this.childrenStack[0]);
    this.unstackChildren();
    this.appendChild(semNode);
  }

  private inferredRow(node: TreeNode, func: Function) {
    this.stackChildren();
    func(node);
    let children = this.childrenStack[0];
    let semNode = (children.length !== 1) ?
      sem.Processor.row(children) : children[0];
    this.unstackChildren();
    this.appendChild(semNode);
  }

  private textNode(tag: string, node: LeafNode, func: Function) {
    let semNode = sem.Processor.text(
      node.getText(), node.getAttributes()['mathvariant'], tag);
    this.appendChild(semNode);
    this.stackChildren();
    func(node);
    this.unstackChildren();
  }

  private getAttributeDefault(
    attributes: {[kind: string]: string}, attr: string, def: string) {
    let value = attributes[attr];
    if (value === undefined) {
      return def;
    }
    if (value.match(/^\s*$/)) {
      return null;
    }
    return value;
  };

}
