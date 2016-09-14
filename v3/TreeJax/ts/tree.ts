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
/// <reference path="node.d.ts" />

import {TreeNode} from './tree_node';
import {LeafNode} from './leaf_node';
import {Visitable, Visitor} from './visitor';
import {NodeFactory} from './node_factory';

import fs = require('fs');

export class Tree implements Visitable {

  /**
   * Alphapetically sorted list of keys that are expected in the input JSON.
   * @type {Array.<string>}
   */
  private static treeAllowedKeys: string[] = [
    'TeXAtom',
    'attributes',
    'children',
    'inferred',
    'text',
    'type'
  ];
  private static currentKeys: {[key: string]: any} = {};

  private root: TreeNode;
  private position: TreeNode;
  private current: TreeNode;
  private containedKeys: string[] = [];


  /**
   * Parses a Tree from a JSON file.
   * @param {string} filename Name of the JSON file.
   * @return {Tree} The newly constructed tree.
   */
  public static parseFile(filename: string): Tree {
    let json: {[key: string]: any};
    try {
      json = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));
    } catch (err) {
      throw new Error('Can not open file: ' + filename);
    }
    return Tree.parse(json);
  }

  /**
   * Parses a Tree from JSON.
   * @param {JSON} json The JSON structure of a tree.
   * @return {Tree} The newly constructed tree.
   */
  public static parse(json: {[key: string]: any}): Tree {
    Tree.currentKeys = {};
    let root = Tree.parseNode(json);
    let tree = new Tree();
    tree.root = root;
    tree.containedKeys = Object.keys(Tree.currentKeys).sort();
    return tree;
  }

  /**
   * Parses a Node from JSON.
   * @param {JSON} json The JSON structure of a node.
   * @return {TreeNode} The newly constructed node.
   * @private
   */
  private static parseNode(json: {[key: string]: any}) {
    for (let key in json) {
      Tree.currentKeys[key] = true;
    }
    let node = NodeFactory.getNode(json['type']);
    // TODO: Error if node is empty!
    let children: TreeNode[] = (json['children'] || []).map(Tree.parseNode);
    node.setChildren(children);
    if (node.isLeaf()) {
      (<LeafNode>node).setText(json['text'] || '');
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
