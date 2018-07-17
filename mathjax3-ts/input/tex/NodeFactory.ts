/*************************************************************
 *
 *  MathJax/jax/input/TeX/NodeFactory.js
 *  
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009-2018 The MathJax Consortium
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
 * @fileoverview Node factory for creating MmlNodes. This allows extensin
 *     packages to add node constructors or overwrite existing ones.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TextNode, MmlNode, AbstractMmlNode, AbstractMmlEmptyNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';
import {MmlFactory} from '../../core/MmlTree/MmlFactory.js';
import {Args} from './Types.js';
import {OperatorDef} from '../../core/MmlTree/OperatorDictionary.js';
import TexParser from './TexParser.js';
import ParseOptions from './ParseOptions.js';
import NodeUtil from './NodeUtil.js';



export class NodeFactory {

  public configuration: ParseOptions;

  protected mmlFactory: MmlFactory = new MmlFactory();

  private factory: Map<string, (factory: NodeFactory, kind: string, ...rest: any[]) => MmlNode> =
    new Map([
      ['node', NodeFactory.createNode],
      ['token', NodeFactory.createToken],
      ['text', NodeFactory.createText],
      ['error', NodeFactory.createError],
    ]);

  public static createNode(factory: NodeFactory, kind: string,
                           children: MmlNode[], def: any,
                           text?: TextNode): MmlNode {
    const node = factory.mmlFactory.create(kind, {}, []);
    // If infinity or -1 remove inferred mrow
    //
    // In all other cases replace inferred mrow with a regular mrow, before adding
    // children.
    const arity = node.arity;
    if (arity === Infinity || arity === -1) {
      if (children.length === 1 && children[0].isInferred) {
        node.setChildren(NodeUtil.getChildren(children[0]));
      } else {
        node.setChildren(children);
      }
    } else {
      let cleanChildren = [];
      for (let i = 0, child; child = children[i]; i++) {
        if (child.isInferred) {
          let mrow = factory.mmlFactory.create('mrow', {}, NodeUtil.getChildren(child));
          NodeUtil.copyAttributes(child, mrow);
          cleanChildren.push(mrow);
        } else {
          cleanChildren.push(child);
        }
      }
      node.setChildren(cleanChildren);
    }
    if (text) {
      node.appendChild(text);
    }
    NodeUtil.setProperties(node, def);
    return node;
  };

  public static createToken(factory: NodeFactory, kind: string, def: any,
                            text: string): MmlNode  {
    const textNode = NodeFactory.createText(factory, text);
    return NodeFactory.createNode(factory, kind, [], def, textNode);
  }

  public static createText(factory: NodeFactory, text: string): TextNode  {
    if (text == null) {
      return null;
    }
    return (factory.mmlFactory.create('text') as TextNode).setText(text);
  };

  public static createError(factory: NodeFactory, message: string): MmlNode  {
    let text = NodeFactory.createText(factory, message);
    let mtext = NodeFactory.createNode(factory, 'mtext', [], {}, text);
    let error = NodeFactory.createNode(factory, 'merror', [mtext], {});
    return error;
  };

  public set(name: string, func: (factory: NodeFactory, kind: string, ...rest: any[]) => MmlNode) {
    this.factory.set(name, func);
  }

  public setCreators(maps: {[name: string]: (factory: NodeFactory, kind: string, ...rest: any[]) => MmlNode}) {
    for (let name in maps) {
      this.set(name, maps[name]);
    }
  }

  public create(name: string, ...rest: any[]): MmlNode {
    let func = this.factory.get(name) || this.factory.get('node');
    return func.apply(null, [this].concat(rest));
  }

}
