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
 * @fileoverview A visitor that turns tree into JSON structure. Mainly to test
 *     if the output is the same as JSON input.
 * 
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Visitor} from './visitor';
import {Tree} from './tree';
import {TreeNode, Tag} from './tree_node';
import {LeafNode} from './leaf_node';


export class JsonVisitor implements Visitor {

  private result: any;

  /**
   * @return {Element} The JSON representation of the tree.
   */
  public getResult(): JSON {
    return this.result as JSON;
  }

  public visitTree(tree: Tree) {
    this.visitNode(tree.getRoot());
  }
  
  public visitNode(node: TreeNode) {
    let json: any = {};
    json['type'] = Tag.get(node.getKind());
    json['attributes'] = node.getAttributes();
    let texAtom = node.getTexAtom();
    if (node.isInferred()) {
      json['inferred'] = true;
    }
    if (texAtom) {
      json['TeXAtom'] = texAtom;
    }
    if (node.isLeaf()) {
      json['text'] = (node as LeafNode).getText();
    }
    let children = [];
    for (let child of node.getChildren()) {
      this.visitNode(child);
      children.push(this.result);
    }
    if (children.length) {
      json['children'] = children;
    }
    this.result = json;
  }

}
