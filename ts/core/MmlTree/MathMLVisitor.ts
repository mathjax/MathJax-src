/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  A visitor that produces MathML DOM nodes from the internal nodes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MmlVisitor } from './MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from './MmlNode.js';
import { HtmlNode } from './MmlNodes/HtmlNode.js';

/*****************************************************************/
/**
 *  Implements the MathMLVisitor (subclass of MmlVisitor)
 */

export class MathMLVisitor extends MmlVisitor {
  /**
   * The document in which the nodes are being made
   */
  protected document: Document = null;

  /**
   * Convert the tree rooted at a particular node into DOM nodes.
   *
   * @param {MmlNode} node  The node to use as the root of the tree to traverse
   * @param {Document} document  The document in which the nodes are created
   * @returns {Node}  The MathML DOM nodes representing the internal tree
   */
  public visitTree(node: MmlNode, document: Document): Node {
    this.document = document;
    const root = document.createElement('top');
    this.visitNode(node, root);
    this.document = null;
    return root.firstChild;
  }

  /**
   * @param {TextNode} node  The text node to visit
   * @param {Element} parent  The DOM parent to which this node should be added
   */
  public visitTextNode(node: TextNode, parent: Element) {
    parent.appendChild(this.document.createTextNode(node.getText()));
  }

  /**
   * @param {XMLNode} node  The XML node to visit
   * @param {Element} parent  The DOM parent to which this node should be added
   */
  public visitXMLNode(node: XMLNode, parent: Element) {
    parent.appendChild((node.getXML() as Element).cloneNode(true));
  }

  /**
   * @param {HtmlNode} node  The HTML node to visit
   * @param {Element} parent  The DOM parent to which this node should be added
   */
  public visitHtmlNode(node: HtmlNode<any>, parent: Element) {
    parent.appendChild((node.getHTML() as Element).cloneNode(true));
  }

  /**
   * Visit an inferred mrow, but don't add the inferred row itself (since
   * it is supposed to be inferred).
   *
   * @param {MmlNode} node  The inferred mrow to visit
   * @param {Element} parent  The DOM parent to which this node's children should be added
   */
  public visitInferredMrowNode(node: MmlNode, parent: Element) {
    for (const child of node.childNodes) {
      this.visitNode(child, parent);
    }
  }

  /**
   * The generic visiting function:
   *   Create a DOM node of the correct type.
   *   Add its explicit attributes.
   *   Append its children nodes.
   *   Append the new node to the DOM parent.
   *
   * @param {MmlNode} node  The node to visit
   * @param {Element} parent  The DOM parent to which this node should be added
   */
  public visitDefault(node: MmlNode, parent: Element) {
    const mml = this.document.createElement(this.getKind(node));
    this.addAttributes(node, mml);
    for (const child of node.childNodes) {
      this.visitNode(child, mml);
    }
    parent.appendChild(mml);
  }

  /**
   * @param {MmlNode} node  The node who attributes are to be copied
   * @param {Element} mml  The MathML DOM node to which attributes are being added
   */
  public addAttributes(node: MmlNode, mml: Element) {
    const attributes = this.getAttributeList(node);
    for (const name of Object.keys(attributes)) {
      mml.setAttribute(name, attributes[name].toString());
    }
  }
}
