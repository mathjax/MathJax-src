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

/// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />

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
      [Kind.msup, this.visitNodeMsup.bind(this)],
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
    // TODO: Replace by efficient mapping.
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
   * Visits an Msup node.
   * @param {NodeMsup} node The Msup node.
   * @protected
   */
  protected visitNodeMsup(node: nf.NodeMsup) {
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
