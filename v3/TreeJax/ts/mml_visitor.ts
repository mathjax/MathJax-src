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
 * @fileoverview A visitor to convert to old internal format.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Visitor} from './visitor';
import {Tree} from './tree';
import {TreeNode, Tag} from './tree_node';
import {LeafNode} from './leaf_node';

declare var MathJax: any;
let MML = MathJax.ElementJax.mml;

export class MmlVisitor implements Visitor {

  private result: any = null;
  private current: any = this.result;

  /**
   * @return {Element} The old-style internal representation of the tree.
   */
  public getResult(): any {
    return (this.result.data.length > 1 ? this.result : this.result.data[0]);
  }
  
  /**
   * Creates the result from the tree
   * @param {Tree} tree The tree to convert
   */
  public visitTree(tree: Tree) {
    this.result = MML.mrow();
    this.visitNode(tree.getRoot());
  }

  /**
   * Adds the node to the result tree
   * @param {TreeNode} node The node to add to the result
   */
  public visitNode(node: TreeNode) {
    let kind = Tag.get(node.getKind());
    if (!(MML[kind] && MML[kind].isa && MML[kind].isa(MML.mbase))) {
      throw Error('No implementation for nodes of type "'+kind+'"');
    }
    let result = this.result;
    if (!node.isInferred()) {
      var atom = node.getTexAtom();
      if (atom) kind = 'TeXAtom';
      let mml = this.result = MML[kind]();
      if (atom) mml.texClass = MML.TEXCLASS[atom];
      result.Append(mml);
      if (mml.isToken) {
        this.addText(<LeafNode>node);
      }
    }
    this.addAttributes(node);
    this.addChildren(node);
    this.result = result;
  }
  
  private addText(node: LeafNode) {
    let text = node.getText();
    if (text) this.result.Append(text);
  }
  
  private addChildren(node: TreeNode) {
    let children = node.getChildren();
    for (let child of children) {
      child.accept(this);
    }
  }
  
  private addAttributes(node: TreeNode) {
    let attributes = node.getAttributes();
    for (let key in attributes) {
      this.result[key] = attributes[key];
    }
  }
}
