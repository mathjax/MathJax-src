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
 * @fileoverview A simple tree class for reading MathJax's current internal
 *    structure
 *
 * @author volker.sorge@gmail.com (Volker Sorge)
 */

/// <reference path="tree_node.ts" />

import {TreeNode} from './tree_node';
import {LeafNode} from './leaf_node';
import {Visitable, Visitor} from './visitor';
import {NodeFactory} from './node_factory';

export class Tree implements Visitable {

  private root: TreeNode;
  private position: TreeNode;
  private current: TreeNode;

  /**
   * Parses a Tree from JSON.
   * @param {JSON} json The JSON structure of a tree.
   * @return {Tree} The newly constructed tree.
   */
  public static parse(json: any): Tree {
    let root = Tree.parseNode(json);
    let tree = new Tree();
    tree.root = root;
    return tree;
  }

  /**
   * Parses a Node from JSON.
   * @param {JSON} json The JSON structure of a node.
   * @return {TreeNode} The newly constructed node.
   */
  public static parseNode(json: any) {
    let node = NodeFactory.getNode(json['type']);
    // TODO: Error if node is empty!
    let children: TreeNode[] = (json['children'] || []).map(Tree.parseNode);
    node.setChildren(children);
    if (node.isLeaf()) {
      (<LeafNode>node).setText(json.text || '');
    }
    children.forEach(x => x.setParent(node));
    return node;
  }

  /**
   * @return {TreeNode} The root node of the tree.
   */
  public getRoot(): TreeNode {
    return this.root;
  }

  /**
   * @return {TreeNode} The last node added to the tree.
   */
  public getPosition(): TreeNode {
    return this.position;
  }

  /**
   * @override
   */
  public accept(visitor: Visitor) {
    console.log('here in tree');
    visitor.visitTree(this);
  }

}
