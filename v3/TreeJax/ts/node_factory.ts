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
 * @fileoverview A factory for constructing nodes of various classes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Kind, TreeNode, AbstractNode} from './tree_node';
import {LeafNode, AbstractLeaf} from './leaf_node';


export namespace NodeFactory {

  /**
   * Constructs a node of the correct class for the given kind.
   * @param {string} kind The kind of node to be constructed.
   * @return {TreeNode} The newly constructed node. If kind is unknown we
   *     construct a dummy node.
   */
  export function getNode(kind: string): TreeNode {
    switch (kind) {
    case 'mi':
      return new NodeMi();
    case 'mo':
      return new NodeMo();
    case 'mn':
      return new NodeMn();
    case 'msup':
      return new NodeMsup();
    default:
      return new NodeDummy();
    }
  }

}


export class NodeMi extends AbstractLeaf {

  /**
   * @constructor
   * @extends{AbstractLeaf}
   */
  constructor() {
    super(Kind.mi);
  }

}


export class NodeMo extends AbstractLeaf {

  /**
   * @constructor
   * @extends{AbstractLeaf}
   */
  constructor() {
    super(Kind.mo);
  }

}

export class NodeMn extends AbstractLeaf {

  /**
   * @constructor
   * @extends{AbstractLeaf}
   */
  constructor() {
    super(Kind.mn);
  }

}

export class NodeMsup extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msup, 2);
  }

}

export class NodeDummy extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.dummy, true);
  }

}

