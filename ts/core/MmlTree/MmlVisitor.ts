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
 * @file  A visitor class that visits MmlNode trees
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  MmlNode,
  TextNode,
  XMLNode,
  TEXCLASS,
  TEXCLASSNAMES,
} from './MmlNode.js';
import { MmlMo } from './MmlNodes/mo.js';
import { MmlMi } from './MmlNodes/mi.js';
import { HtmlNode } from './MmlNodes/HtmlNode.js';
import { MmlFactory } from './MmlFactory.js';
import { AbstractVisitor } from '../Tree/Visitor.js';
import { PropertyList } from '../Tree/Node.js';
import { lookup } from '../../util/Options.js';

export const DATAMJX = 'data-mjx-';

/*****************************************************************/
/**
 *  Implements the MmlVisitor (subclass of Visitor, and base class
 *  for visitors that accept MmlNode trees)
 */

export class MmlVisitor extends AbstractVisitor<MmlNode> {
  /**
   * MmlNode kinds to replace with other names
   */
  public static rename: PropertyList = {
    TeXAtom: 'mrow',
  };

  /**
   * Translations for the internal mathvariants
   */
  public static variants: PropertyList = {
    '-tex-calligraphic': 'script',
    '-tex-bold-calligraphic': 'bold-script',
    '-tex-oldstyle': 'normal',
    '-tex-bold-oldstyle': 'bold',
    '-tex-mathit': 'italic',
  };

  /**
   * Attributes to include on every element of a given kind
   */
  public static defaultAttributes: { [kind: string]: PropertyList } = {
    math: {
      xmlns: 'http://www.w3.org/1998/Math/MathML',
    },
  };

  /**
   * @param {MmlFactory} factory  The MmlNode factory (defaults to MmlFactory if not given)
   *
   * @class
   * @augments {AbstractVisitor}
   */
  constructor(factory: MmlFactory = null) {
    if (!factory) {
      factory = new MmlFactory();
    }
    super(factory);
  }

  /***********************************************/
  /**
   * Stubs for overriding in subclasses
   */

  /**
   * @param {TextNode} _node  The TextNode to visit
   * @param {any[]} _args  Any arguments needed by the visitor
   * @returns {any}  Any return value needed for the visitor
   */
  public visitTextNode(_node: TextNode, ..._args: any[]): any {}

  /**
   * @param {XMLNode} _node   The XMLNode to visit
   * @param {any[]} _args     Any arguments needed by the visitor
   * @returns {any}           Any return value needed for the visitor
   */
  public visitXMLNode(_node: XMLNode, ..._args: any[]): any {}

  /**
   * @param {HtmlNode} _node  The XMLNode to visit
   * @param {any[]} _args     Any arguments needed by the visitor
   * @returns {any}           Any return value needed for the visitor
   */
  public visitHtmlNode(_node: HtmlNode<any>, ..._args: any[]): any {}

  /***********************************************/
  /**
   * Utilities for handling attributes
   */

  /**
   * @param {MmlNode} node  The node whose kind is needed
   * @returns {string}       The MamlML node name for that kind
   */
  protected getKind(node: MmlNode): string {
    const kind = node.kind;
    return lookup(kind, (this.constructor as typeof MmlVisitor).rename, kind);
  }

  /***********************************************/
  /**
   * Utilities for handling attributes
   */

  /**
   * @param {MmlNode} node    The node whose attributes are to be produced
   * @returns {PropertyList}   The attribute list
   */
  protected getAttributeList(node: MmlNode): PropertyList {
    const CLASS = this.constructor as typeof MmlVisitor;
    const defaults = lookup(node.kind, CLASS.defaultAttributes, {});
    const attributes = Object.assign(
      {},
      defaults,
      this.getDataAttributes(node),
      node.attributes.getAllAttributes()
    ) as PropertyList;
    const variants = CLASS.variants;
    if (Object.hasOwn(attributes, 'mathvariant')) {
      if (Object.hasOwn(variants, attributes.mathvariant as string)) {
        attributes.mathvariant = variants[attributes.mathvariant as string];
      } else if (node.getProperty('ignore-variant')) {
        delete attributes.mathvariant;
      }
    }
    return attributes;
  }

  /**
   * Create the list of data-mjx-* attributes
   *
   * @param {MmlNode} node    The node whose data list is to be generated
   * @returns {PropertyList}   The final class attribute list
   */
  protected getDataAttributes(node: MmlNode): PropertyList {
    const data = {} as PropertyList;
    const variant = node.attributes.getExplicit('mathvariant') as string;
    const variants = (this.constructor as typeof MmlVisitor).variants;
    if (
      variant &&
      (node.getProperty('ignore-variant') || Object.hasOwn(variants, variant))
    ) {
      this.setDataAttribute(data, 'variant', variant);
    }
    if (node.getProperty('variantForm')) {
      this.setDataAttribute(data, 'alternate', '1');
    }
    if (node.getProperty('pseudoscript')) {
      this.setDataAttribute(data, 'pseudoscript', 'true');
    }
    if (node.getProperty('autoOP') === false) {
      this.setDataAttribute(data, 'auto-op', 'false');
    }
    const vbox = node.getProperty('vbox') as string;
    if (vbox) {
      this.setDataAttribute(data, 'vbox', vbox);
    }
    const scriptalign = node.getProperty('scriptalign') as string;
    if (scriptalign) {
      this.setDataAttribute(data, 'script-align', scriptalign);
    }
    const accent = node.getProperty('mathaccent') as boolean;
    if (accent !== undefined) {
      if (
        (accent && !(node as MmlMo).isMathAccent()) ||
        (!accent && !(node as MmlMo).isMathAccentWithWidth())
      ) {
        this.setDataAttribute(data, 'mathaccent', accent.toString());
      }
    }
    const texclass = node.getProperty('texClass') as number;
    if (texclass !== undefined) {
      let setclass = true;
      if (texclass === TEXCLASS.OP && node.isKind('mi')) {
        const name = (node as MmlMi).getText();
        setclass = !(name.length > 1 && name.match(MmlMi.operatorName));
      }
      if (setclass) {
        this.setDataAttribute(
          data,
          'texclass',
          texclass < 0 ? 'NONE' : TEXCLASSNAMES[texclass]
        );
      }
    }
    if (node.getProperty('smallmatrix')) {
      this.setDataAttribute(data, 'smallmatrix', 'true');
    }
    return data;
  }

  /**
   * @param {PropertyList} data   The class attribute list
   * @param {string} name         The name for the data-mjx-name attribute
   * @param {string} value        The value of the attribute
   */
  protected setDataAttribute(data: PropertyList, name: string, value: string) {
    data[DATAMJX + name] = value;
  }
}
