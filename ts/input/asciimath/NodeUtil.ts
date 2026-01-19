/*************************************************************
 *
 *  Copyright (c) 2025 The MathJax Consortium
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
 * @file Utility functions for manipulating MML nodes in AsciiMath.
 *
 * @author mathjax@mathjax.org (MathJax Consortium)
 */

import { MmlNode } from '../../core/MmlTree/MmlNode.js';

/**
 * Utility class for node operations
 */
export default class NodeUtil {
  /**
   * Set an attribute on a node
   *
   * @param {MmlNode} node The node to set the attribute on
   * @param {string} name The attribute name
   * @param {string} value The attribute value
   */
  public static setAttribute(node: MmlNode, name: string, value: string) {
    node.attributes.set(name, value);
  }

  /**
   * Get an attribute from a node
   *
   * @param {MmlNode} node The node to get the attribute from
   * @param {string} name The attribute name
   * @returns {string} The attribute value
   */
  public static getAttribute(node: MmlNode, name: string): string {
    return node.attributes.get(name) as string;
  }

  /**
   * Remove brackets from a node if it's an mrow with bracket children
   *
   * @param {MmlNode} node The node to remove brackets from
   */
  public static removeBrackets(node: MmlNode) {
    if (!node || !node.childNodes || node.childNodes.length === 0) {
      return;
    }
    if (node.kind === 'mrow' || node.kind === 'inferredMrow') {
      const first = node.childNodes[0];
      if (node.childNodes.length > 1 && node.childNodes[1].kind === 'mtable') {
        return; // matrix case, do not remove brackets
      }
      const last = node.childNodes[node.childNodes.length - 1];
      if (first && first.childNodes[0]) {
        const text = (first.childNodes[0] as any).text;
        if (text === '(' || text === '[' || text === '{') {
          node.childNodes.shift();
        }
      }
      if (last && last.childNodes[0]) {
        const text = (last.childNodes[0] as any).text;
        if (text === ')' || text === ']' || text === '}') {
          node.childNodes.pop();
        }
      }
      console.log(node);
    }
  }

  /**
   * Check if a node has child nodes
   *
   * @param {MmlNode} node The node to check
   * @returns {boolean} True if the node has children
   */
  public static hasChildNodes(node: MmlNode): boolean {
    return node && node.childNodes && node.childNodes.length > 0;
  }
}
