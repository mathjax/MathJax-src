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
import {LeafNode, AbstractLeaf, AbstractEmpty} from './leaf_node';


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
    case 'mtext':
      return new NodeMtext();
    case 'mspace':
      return new NodeMspace();
    case 'ms':
      return new NodeMs();
    case 'mrow':
      return new NodeMrow();
    case 'mfrac':
      return new NodeMfrac();
    case 'msqrt':
      return new NodeMsqrt();
    case 'mroot':
      return new NodeMroot();
    case 'mstyle':
      return new NodeMstyle();
    case 'merror':
      return new NodeMerror();
    case 'mpadded':
      return new NodeMpadded();
    case 'mphantom':
      return new NodeMphantom();
    case 'mfenced':
      return new NodeMfenced();
    case 'menclose':
      return new NodeMenclose();
    case 'msub':
      return new NodeMsub();
    case 'msup':
      return new NodeMsup();
    case 'msubsup':
      return new NodeMsubsup();
    case 'munder':
      return new NodeMunder();
    case 'mover':
      return new NodeMover();
    case 'munderover':
      return new NodeMunderover();
    case 'mmultiscripts':
      return new NodeMmultiscripts();
    case 'mprescripts':
      return new NodeMprescripts();
    case 'mtable':
      return new NodeMtable();
    case 'mlabeledtr':
      return new NodeMlabeledtr();
    case 'mtr':
      return new NodeMtr();
    case 'mtd':
      return new NodeMtd();
    case 'maligngroup':
      return new NodeMaligngroup();
    case 'malignmark':
      return new NodeMalignmark();
    case 'mstack':
      return new NodeMstack();
    case 'mlongdiv':
      return new NodeMlongdiv();
    case 'msgroup':
      return new NodeMsgroup();
    case 'msrow':
      return new NodeMsrow();
    case 'mscarries':
      return new NodeMscarries();
    case 'mscarry':
      return new NodeMscarry();
    case 'msline':
      return new NodeMsline();
    case 'maction':
      return new NodeMaction();
    case 'math':
      return new NodeMath();
    case 'semantics':
      return new NodeSemantics();
    case 'annotation':
      return new NodeAnnotation();
    case 'annotation-xml':
      return new NodeAnnotationXml();
    case 'none':
      return new NodeNone();
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

export class NodeMtext extends AbstractLeaf {

  /**
   * @constructor
   * @extends{AbstractLeaf}
   */
  constructor() {
    super(Kind.mtext);
  }

}


export class NodeMspace extends AbstractEmpty {

  /**
   * @constructor
   * @extends{AbstractEmpty}
   */
  constructor() {
    super(Kind.mspace);
  }

}


export class NodeMs extends AbstractLeaf {

  /**
   * @constructor
   * @extends{AbstractLeaf}
   */
  constructor() {
    super(Kind.ms);
  }

}


export class NodeMrow extends AbstractNode {

  private inferred = false;

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mrow, true);
  }

  /**  
   * Sets the inferred flag.
   */
  public setInferred() {
    this.inferred = true;
  }

  /**
   * @override
   */
  public isInferred() {
    return this.inferred;
  }

}


export class NodeMfrac extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mfrac, 2);
  }

}


export class NodeMsqrt extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msqrt, true);
  }

}


export class NodeMroot extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mroot, true);
  }

}


export class NodeMstyle extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mstyle, true);
  }

}


export class NodeMerror extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.merror, true);
  }

}


export class NodeMpadded extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mpadded, true);
  }

}


export class NodeMphantom extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mphantom, true);
  }

}


export class NodeMfenced extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mfenced, true);
  }

}


export class NodeMenclose extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.menclose, true);
  }

}


export class NodeMsub extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msub, 2);
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


export class NodeMsubsup extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msubsup, 3);
  }

}


export class NodeMunder extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.munder, 2);
  }

}


export class NodeMover extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mover, 2);
  }

}


export class NodeMunderover extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.munderover, 3);
  }

}


export class NodeMmultiscripts extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mmultiscripts, true);
  }

}


export class NodeMprescripts extends AbstractEmpty {

  /**
   * @constructor
   * @extends{AbstractEmpty}
   */
  constructor() {
    super(Kind.mprescripts);
  }

}


export class NodeMtable extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mtable, true);
  }

}


export class NodeMlabeledtr extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mlabeledtr, true);
  }

}


export class NodeMtr extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mtr, true);
  }

}


export class NodeMtd extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mtd, true);
  }

}


export class NodeMaligngroup extends AbstractEmpty {

  /**
   * @constructor
   * @extends{AbstractEmpty}
   */
  constructor() {
    super(Kind.maligngroup);
  }

}


export class NodeMalignmark extends AbstractEmpty {

  /**
   * @constructor
   * @extends{AbstractEmpty}
   */
  constructor() {
    super(Kind.malignmark);
  }

}


export class NodeMstack extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mstack, true);
  }

}


export class NodeMlongdiv extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mlongdiv, true);
  }

}


export class NodeMsgroup extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msgroup, true);
  }

}


export class NodeMsrow extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msrow, true);
  }

}


export class NodeMscarries extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mscarries, true);
  }

}


export class NodeMscarry extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.mscarry, true);
  }

}


export class NodeMsline extends AbstractEmpty {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.msline);
  }

}


export class NodeMaction extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.maction, true);
  }

}


export class NodeMath extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.math, true);
  }

}


export class NodeSemantics extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.semantics, true);
  }

}


export class NodeAnnotation extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.annotation, 1);
  }

}

export class NodeAnnotationXml extends AbstractNode {

  /**
   * @constructor
   * @extends{AbstractNode}
   */
  constructor() {
    super(Kind.annotation, 1);
  }

}

export class NodeNone extends AbstractEmpty {

  /**
   * @constructor
   * @extends{AbstractEmpty}
   */
  constructor() {
    super(Kind.none);
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

