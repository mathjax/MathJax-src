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
 * @fileoverview Leaf node classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Kind, TreeNode, AbstractNode} from './tree_node';

export interface LeafNode extends TreeNode {

  /**
   * @return {string} The content of the leaf.
   */
  getText(): string;

  /**
   * Sets the leafs text content.
   * @param {string} text The new content of the leaf.
   */
  setText(text: string): void;

}


export abstract class AbstractLeaf extends AbstractNode implements LeafNode {

  private text = '';

  /**
   * @param {string} kind The type of node.
   * @constructor
   * @implements {LeafNode}
   * @extends {AbstractNode}
   */
  constructor(kind: Kind) {
    super(kind, 0);
  };

  /**
   * @override
   */
  public getText() {
    return this.text;
  }

  /**
   * @override
   */
  public setText(text: string) {
    this.text = text;
  }

  /**
   * @override
   */
  public isLeaf() {
    return true;
  }

}


export interface EmptyNode extends TreeNode { }


export abstract class AbstractEmpty extends AbstractLeaf implements EmptyNode {

  /**
   * @param {string} kind The type of node.
   * @constructor
   * @implements {LeafNode}
   * @extends {AbstractNode}
   */
  constructor(kind: Kind) {
    super(kind);
  };


  // TODO: Throw exception on access?
  /**
   * @override
   */
  public getText() {
    return '';
  }

  /**
   * @override
   */
  public setText(text: string) { }

  /**
   * @override
   */
  public isEmpty() {
    return true;
  }

}
