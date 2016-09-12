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
import {LeafNode} from './leaf_node';
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
    this.printNode(node, super.visitNodeMi.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMo(node: nf.NodeMo) {
    this.printNode(node, super.visitNodeMo.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMn(node: nf.NodeMn) {
    this.printNode(node, super.visitNodeMn.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMsup(node: nf.NodeMsup) {
    this.printNode(node, super.visitNodeMsup.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeMath(node: nf.NodeMath) {
    this.printNode(node, super.visitNodeMath.bind(this));
  }

  /**
   * @override
   */
  protected visitNodeDummy(node: nf.NodeDummy) {
    this.printNode(node, super.visitNodeDummy.bind(this));
  }

  /**
   * Constructs a printable string for the node and an recurses on the tree.
   * @param {TreeNode} node The node to print.
   * @param {Function} func The super function to call.
   */
  private printNode(node: TreeNode, func: Function) {
    let str = (new Array(this.indent + 1)).join(' ');
    str += Tag.get(node.getKind());
    if (node.isLeaf()) {
      str += ': ' + (<LeafNode>node).getText();
    }
    this.result.push(str);
    this.indent++;
    func(node);
    this.indent--;
  }

}
