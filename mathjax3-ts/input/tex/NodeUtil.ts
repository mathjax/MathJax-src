/*************************************************************
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
 * @fileoverview Node utility methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {TextNode, MmlNode, AbstractMmlNode, AbstractMmlEmptyNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';
import {Args} from './Types.js';
import {OperatorDef} from '../../core/MmlTree/OperatorDictionary.js';


namespace NodeUtil {

  const attrs: String[] = ['autoOP',
                           'fnOP',
                           'movesupsub',
                           'subsupOK',
                           'texprimestyle',
                           'useHeight',
                           'variantForm',
                           'withDelims',
                           'open',
                           'close'
                          ];

  const methodOut: boolean = false;

  export function createEntity(code: string): string  {
    return String.fromCharCode(parseInt(code, 16));
  };

  export function getChildren(node: MmlNode): (MmlNode|TextNode)[] {
    return (node.childNodes as (MmlNode|TextNode)[]);
  };


  export function getText(node: TextNode): string {
    return node.getText();
  };


  export function appendChildren(node: MmlNode, children: (MmlNode|TextNode)[]): void  {
    for (let child of children) {
      node.appendChild(child);
    }
  };


  export function setAttribute(node: MmlNode, attribute: string, value: Args): void {
    node.attributes.set(attribute, value);
  };


  export function setProperty(node: MmlNode, attribute: string, value: Args): void {
    node.setProperty(attribute, value);
  };


  // Sets properties and attributes.
  export function setProperties(node: MmlNode, properties: PropertyList): void {
    for (const name of Object.keys(properties)) {
      let value = properties[name];
      if (name === 'texClass') {
        node.texClass = (value as number);
      } else if (name === 'movablelimits') {
        node.setProperty('movablelimits', value);
        if (node.isKind('mo') || node.isKind('mstyle')) {
          node.attributes.set('movablelimits', value);
        }
      } else if (name === 'inferred') {
        // ignore
      } else if (attrs.indexOf(name) !== -1) {
        node.setProperty(name, value);
      } else {
        node.attributes.set(name, value);
      }
    }
  };


  export function getProperty(node: MmlNode, property: string): Property  {
    return node.getProperty(property);
  };


  export function getAttribute(node: MmlNode, attr: string): Property  {
    return node.attributes.get(attr);
  }


  export function removeProperties(node: MmlNode, ...properties: string[]): void {
    node.removeProperty(...properties);
  }

  
  export function getChildAt(node: MmlNode, position: number): MmlNode|TextNode {
    return (node.childNodes[position] as MmlNode|TextNode) ;
  };


  export function setData(node: MmlNode, position: number, child: MmlNode): void  {
    let children = node.childNodes;
    children[position] = child;
    if (child) {
      child.parent = node;
    }
  };


  export function copyChildren(oldNode: MmlNode, newNode: MmlNode): void {
    let children = oldNode.childNodes as (TextNode|MmlNode)[];
    for (let i = 0; i < children.length; i++) {
      setData(newNode, i, children[i]);
    }
  };


  export function copyAttributes(oldNode: MmlNode, newNode: MmlNode): void  {
    newNode.attributes = oldNode.attributes;
    setProperties(newNode, oldNode.getAllProperties());
  };


  export function isType(node: MmlNode, kind: string)  {
    return node.isKind(kind);
  };

  export function isEmbellished(node: MmlNode): boolean {
    return node.isEmbellished;
  };
  
  export function getTexClass(node: MmlNode): number  {
    return node.texClass;
  };

  export function getCoreMO(node: MmlNode): MmlNode  {
    return node.coreMO();
  };

  export function isNode(item: any): boolean  {
    return item instanceof AbstractMmlNode || item instanceof AbstractMmlEmptyNode;
  };

  
  export function isInferred(node: MmlNode): boolean {
    return node.isInferred;
  };

  export function getForm(node: MmlNode): OperatorDef {
    if (!isType(node, 'mo')) {
      return null;
    }
    let mo = node as MmlMo;
    let forms = mo.getForms();
    for (let form of forms) {
      let symbol = MmlMo.OPTABLE[form][mo.getText()];
      if (symbol) {
        return symbol;
      }
    }
    return null;
  };

}

export default NodeUtil;
