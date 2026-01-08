/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
 * @file Node utility methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {
  TextNode,
  MMLNODE,
  MmlNode,
  AbstractMmlNode,
  AbstractMmlEmptyNode,
} from '../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../core/MmlTree/MmlNodes/mo.js';
import { Property, PropertyList } from '../../core/Tree/Node.js';
import { Args } from './Types.js';
import { OperatorDef } from '../../core/MmlTree/OperatorDictionary.js';

const NodeUtil = {
  attrs: new Set<string>([
    'autoOP',
    'fnOP',
    'movesupsub',
    'subsupOK',
    'texprimestyle',
    'useHeight',
    'variantForm',
    'withDelims',
    'mathaccent',
    'open',
    'close',
  ]),

  /**
   * Creates a single character from a unicode hex string.
   *
   * @param {string} code The code.
   * @returns {string} The newly created entity.
   */
  createEntity(code: string): string {
    return String.fromCodePoint(parseInt(code, 16));
  },

  /**
   * Get the children of the a node.
   *
   * @param {MmlNode} node The node.
   * @returns {MMLNODE[]} Its children.
   */
  getChildren(node: MmlNode): MMLNODE[] {
    return node.childNodes as MMLNODE[];
  },

  /**
   * Get text content of a node.
   *
   * @param {TextNode} node The node.
   * @returns {string} Its text content.
   */
  getText(node: TextNode): string {
    return node.getText();
  },

  /**
   * Append children to a node.
   *
   * @param {MmlNode} node The node.
   * @param {MMLNODE[]} children A list of new children.
   */
  appendChildren(node: MmlNode, children: MMLNODE[]) {
    for (const child of children) {
      node.appendChild(child);
    }
  },

  /**
   * Sets an attribute of a node.
   *
   * @param {MmlNode} node The node.
   * @param {string} attribute An attribute.
   * @param {Args} value The attribute value.
   */
  setAttribute(node: MmlNode, attribute: string, value: Args) {
    node.attributes.set(attribute, value);
  },

  /**
   * Sets a property of a node.
   *
   * @param {MmlNode} node The node.
   * @param {string} property The property.
   * @param {Args} value The property value.
   */
  setProperty(node: MmlNode, property: string, value: Args) {
    node.setProperty(property, value);
  },

  /**
   * Sets properties and attributes of a node.
   *
   * @param {MmlNode} node The node.
   * @param {PropertyList} properties A list of property/attribute value pairs.
   */
  setProperties(node: MmlNode, properties: PropertyList) {
    for (const name of Object.keys(properties)) {
      const value = properties[name];
      if (name === 'texClass') {
        node.texClass = value as number;
        node.setProperty(name, value);
      } else if (name === 'movablelimits') {
        node.setProperty('movablelimits', value);
        if (node.isKind('mo') || node.isKind('mstyle')) {
          node.attributes.set('movablelimits', value);
        }
      } else if (name === 'inferred') {
        // ignore
      } else if (NodeUtil.attrs.has(name)) {
        node.setProperty(name, value);
      } else {
        node.attributes.set(name, value);
      }
    }
  },

  /**
   * Returns the property of a node.
   *
   * @param {MmlNode} node The node.
   * @param {string} property A property name.
   * @returns {Property} Value of the property.
   */
  getProperty(node: MmlNode, property: string): Property {
    return node.getProperty(property);
  },

  /**
   * Returns the attribute of a node.
   *
   * @param {MmlNode} node The node.
   * @param {string} attr An attribute name.
   * @returns {Property} Value of the attribute.
   */
  getAttribute(node: MmlNode, attr: string): Property {
    return node.attributes.get(attr);
  },

  /**
   * Removes an attribute of a node.
   *
   * @param {MmlNode} node The node.
   * @param {string} attr An attribute name.
   */
  removeAttribute(node: MmlNode, attr: string): void {
    node.attributes.unset(attr);
  },

  /**
   * Removes a set of properties from a node.
   *
   * @param {MmlNode} node The node.
   * @param {string[]} properties  A list of properties.
   */
  removeProperties(node: MmlNode, ...properties: string[]) {
    node.removeProperty(...properties);
  },

  /**
   * Returns a child node at a given position.
   *
   * @param {MmlNode} node The node.
   * @param {number} position The position of the child.
   * @returns {MMLNODE} The child node at position.
   */
  getChildAt(node: MmlNode, position: number): MMLNODE {
    return node.childNodes[position] as MMLNODE;
  },

  /**
   * Set node child at position.
   *
   * @param {MmlNode} node The node.
   * @param {number} position The position of the new child.
   * @param {MmlNode} child The new child.
   */
  setChild(node: MmlNode, position: number, child: MmlNode) {
    const children = node.childNodes;
    children[position] = child;
    if (child) {
      child.parent = node;
    }
  },

  /**
   * Copies children between nodes.
   *
   * @param {MmlNode} oldNode The source node.
   * @param {MmlNode} newNode The target node.
   */
  copyChildren(oldNode: MmlNode, newNode: MmlNode) {
    const children = oldNode.childNodes as (TextNode | MmlNode)[];
    for (let i = 0; i < children.length; i++) {
      this.setChild(newNode, i, children[i]);
    }
  },

  /**
   * Copies attributes between nodes.
   *
   * @param {MmlNode} oldNode The source node.
   * @param {MmlNode} newNode The target node.
   */
  copyAttributes(oldNode: MmlNode, newNode: MmlNode) {
    newNode.attributes = oldNode.attributes;
    for (const [prop, value] of Object.entries(oldNode.getAllProperties())) {
      newNode.setProperty(prop, value);
    }
  },

  /**
   * Checks if node is of a particular type.
   *
   * @param {MmlNode} node The node.
   * @param {string} kind The type to check.
   * @returns {boolean} True if node is of the given type.
   */
  isType(node: MmlNode, kind: string): boolean {
    return node.isKind(kind);
  },

  /**
   * Checks if the node is embellished.
   *
   * @param {MmlNode} node The node.
   * @returns {boolean} True if node is embellished.
   */
  isEmbellished(node: MmlNode): boolean {
    return node.isEmbellished;
  },

  /**
   * Gets the texclass of a node.
   *
   * @param {MmlNode} node The node.
   * @returns {number} Its texclass.
   */
  getTexClass(node: MmlNode): number {
    return node.texClass;
  },

  /**
   * Gets the mo element at the core of the node.
   *
   * @param {MmlNode} node The node.
   * @returns {MmlNode} The MO node at the core.
   */
  getCoreMO(node: MmlNode): MmlNode {
    return node.coreMO();
  },

  /**
   * Checks if an object is a node.
   *
   * @param {any} item The object.
   * @returns {boolean} True if it is a node.
   */
  isNode(item: any): boolean {
    return (
      item instanceof AbstractMmlNode || item instanceof AbstractMmlEmptyNode
    );
  },

  /**
   * Checks if the node is an inferred mrow.
   *
   * @param {MmlNode} node The node.
   * @returns {boolean} True if the node is an inferred mrow.
   */
  isInferred(node: MmlNode): boolean {
    return node.isInferred;
  },

  /**
   * Gets the operator definition of a node.
   *
   * @param {MmlNode} node The node.
   * @returns {OperatorDef} If node is an MO returns the operator definition. O/w
   *    null.
   */
  getForm(node: MmlNode): OperatorDef {
    if (!node.isKind('mo')) {
      return null;
    }
    const mo = node as MmlMo;
    const forms = mo.getForms();
    for (const form of forms) {
      const symbol = this.getOp(mo, form);
      if (symbol) {
        return symbol;
      }
    }
    return null;
  },

  /**
   * Gets the operator definition of an mo node of a particular form.
   *
   * @param {MmlMo} mo The mo node.
   * @param {string=} form The form (infix/prefix/postfix) for the mo.
   * @returns {OperatorDef} If node is an MO returns the operator definition. O/w
   *    null.
   */
  getOp(mo: MmlMo, form: string = 'infix'): OperatorDef {
    return MmlMo.OPTABLE[form][mo.getText()] || null;
  },

  /**
   * Gets an explicit or inherited attribute of an mo, or its default from the
   * operator dictionary, or the default value
   *
   * @param {MmlMo} mo       The mo node.
   * @param {string} attr    The attribute to return.
   * @returns {Property}     The attributes property.
   */
  getMoAttribute(mo: MmlNode, attr: string): Property {
    if (!mo.attributes.isSet(attr)) {
      for (const form of ['infix', 'postfix', 'prefix']) {
        const value = this.getOp(mo, form)?.[3]?.[attr];
        if (value !== undefined) {
          return value;
        }
      }
    }
    return mo.attributes.get(attr);
  },
};

export default NodeUtil;
