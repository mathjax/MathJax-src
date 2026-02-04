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
 * @file  Utility functions for standard pre and post filters.
 *
 * @author sorge@mathjax.org (Volker Sorge)
 */

import { TEXCLASS, MMLNODE, MmlNode } from '../../core/MmlTree/MmlNode.js';
import NodeUtil from './NodeUtil.js';
import ParseOptions from './ParseOptions.js';
import { TexConstant } from './TexConstants.js';
import { MmlMo } from '../../core/MmlTree/MmlNodes/mo.js';
import { Attributes } from '../../core/MmlTree/Attributes.js';

/**
 * Copies the specified explicit attributes from node2 to node1.
 *
 * @param {string[]} attrs List of explicit attribute names.
 * @param {MmlNode} node1 The goal node.
 * @param {MmlNode} node2 The source node.
 */
function _copyExplicit(attrs: string[], node1: MmlNode, node2: MmlNode) {
  const attr1 = node1.attributes;
  const attr2 = node2.attributes;
  attrs.forEach((x) => {
    const attr = attr2.getExplicit(x);
    if (attr != null) {
      // @test Infix Stretchy Right, Preset Lspace Rspace
      attr1.set(x, attr);
    }
  });
}

/**
 * Compares the explicit attributes of two nodes. Returns true if they
 * coincide, with the following exceptions:
 * - lspace attribute of node1 is ignored.
 * - rspace attribute of node2 is ignored.
 * - stretchy=false attributes are ignored.
 * - data-latex and -data-latex-item are ignored.
 *
 * @param {MmlNode} node1 The first node.
 * @param {MmlNode} node2 Its next sibling.
 * @returns {boolean} The true of attribute equal.
 */
function _compareExplicit(node1: MmlNode, node2: MmlNode): boolean {
  const filter = (attr: Attributes, space: string): string[] => {
    const exp = attr.getExplicitNames();
    return exp.filter((x) => {
      return (
        x !== space &&
        (x !== 'stretchy' || attr.getExplicit('stretchy')) &&
        x !== 'data-latex' &&
        x !== 'data-latex-item'
      );
    });
  };
  const attr1 = node1.attributes;
  const attr2 = node2.attributes;
  const exp1 = filter(attr1, 'lspace');
  const exp2 = filter(attr2, 'rspace');
  if (exp1.length !== exp2.length) {
    return false;
  }
  for (const name of exp1) {
    if (attr1.getExplicit(name) !== attr2.getExplicit(name)) {
      return false;
    }
  }
  return true;
}

/**
 * Cleans msubsup and munderover elements.
 *
 * @param {ParseOptions} options The parse options.
 * @param {string} low String representing the lower part of the expression.
 * @param {string} up String representing the upper part.
 */
function _cleanSubSup(options: ParseOptions, low: string, up: string) {
  const remove: MmlNode[] = [];
  for (const mml of options.getList('m' + low + up) as any[]) {
    const children = mml.childNodes;
    if (children[mml[low]] && children[mml[up]]) {
      continue;
    }
    const parent = mml.parent;
    const newNode = children[mml[low]]
      ? options.nodeFactory.create('node', 'm' + low, [
          children[mml.base],
          children[mml[low]],
        ])
      : options.nodeFactory.create('node', 'm' + up, [
          children[mml.base],
          children[mml[up]],
        ]);
    NodeUtil.copyAttributes(mml, newNode);
    parent.replaceChild(newNode, mml);
    remove.push(mml);
  }
  options.removeFromList('m' + low + up, remove);
}

/**
 * Looks through the list of munderover elements for ones that have
 * movablelimits and bases that are not mo's, and creates new msubsup
 * elements to replace them if they aren't in displaystyle.
 *
 * @param {ParseOptions} options The parse options.
 * @param {string} underover The name of the under over element.
 * @param {string} subsup The name of the sub superscript element.
 */
function _moveLimits(options: ParseOptions, underover: string, subsup: string) {
  const remove: MmlNode[] = [];
  for (const mml of options.getList(underover)) {
    if (mml.attributes.get('displaystyle')) {
      continue;
    }
    const base = mml.childNodes[(mml as any).base];
    const mo = base.coreMO();
    if (
      base.getProperty('movablelimits') &&
      !mo.attributes.hasExplicit('movablelimits')
    ) {
      const node = options.nodeFactory.create('node', subsup, mml.childNodes);
      NodeUtil.copyAttributes(mml, node);
      mml.parent.replaceChild(node, mml);
      remove.push(mml);
    }
  }
  options.removeFromList(underover, remove);
}

const FilterUtil = {
  /**
   * Visitor to set stretchy attributes to false on <mo> elements, if they are
   * not used as delimiters. Also wraps non-stretchy infix delimiters into a
   * TeXAtom.
   *
   * @param {object} arg The argument object.
   * @param {MmlNode} arg.math The node to rewrite.
   * @param {ParseOptions} arg.data The parse options.
   */
  cleanStretchy(arg: { math: any; data: ParseOptions }) {
    const options = arg.data;
    for (const mo of options.getList('fixStretchy')) {
      if (NodeUtil.getProperty(mo, 'fixStretchy')) {
        const symbol = NodeUtil.getForm(mo);
        if (symbol?.[3]?.['stretchy']) {
          NodeUtil.setAttribute(mo, 'stretchy', false);
        }
        NodeUtil.removeProperties(mo, 'fixStretchy');
      }
    }
  },

  /**
   * Visitor that removes superfluous attributes from nodes. I.e., if a node has
   * an attribute, which is also an inherited attribute it will be removed. This
   * is necessary as attributes are set bottom up in the parser.
   *
   * @param {object} arg The argument object.
   * @param {ParseOptions} arg.data   The parse options.
   */
  cleanAttributes(arg: { data: ParseOptions }) {
    const node = arg.data.root;
    node.walkTree((mml: MmlNode) => {
      const keep = new Set(
        ((mml.getProperty('keep-attrs') as string) || '').split(/ /)
      );
      const attribs = mml.attributes;
      attribs.unset(TexConstant.Attr.LATEXITEM);
      for (const key of attribs.getExplicitNames()) {
        if (!keep.has(key) && attribs.get(key) === attribs.getInherited(key)) {
          attribs.unset(key);
        }
      }
    });
  },

  /**
   * Combine adjacent <mo> elements that are relations (since MathML treats the
   * spacing very differently)
   *
   * @param {object} arg The argument object.
   * @param {ParseOptions} arg.data The parse options.
   */
  combineRelations(arg: { data: ParseOptions }) {
    const remove: MmlNode[] = [];
    for (const mo of arg.data.getList('mo')) {
      if (
        mo.getProperty('relationsCombined') ||
        !mo.parent ||
        (mo.parent && !NodeUtil.isType(mo.parent, 'mrow')) ||
        NodeUtil.getTexClass(mo) !== TEXCLASS.REL
      ) {
        // @test Prime, PrimeSup, Named Function
        continue;
      }
      const mml = mo.parent;
      let m2: MmlNode;
      const children = mml.childNodes as MMLNODE[];
      const next = children.indexOf(mo) + 1;
      const variantForm = NodeUtil.getProperty(mo, 'variantForm');
      while (
        next < children.length &&
        (m2 = children[next]) &&
        NodeUtil.isType(m2, 'mo') &&
        NodeUtil.getTexClass(m2) === TEXCLASS.REL
      ) {
        if (
          variantForm === NodeUtil.getProperty(m2, 'variantForm') &&
          _compareExplicit(mo, m2)
        ) {
          // @test Shift Left, Less Equal,
          //       Multirel Font X, Multirel Mathvariant X
          NodeUtil.appendChildren(mo, NodeUtil.getChildren(m2));
          // This treatment means we might loose some inheritance structure, but
          // no properties.
          _copyExplicit(['stretchy', 'rspace'], mo, m2);
          for (const name of m2.getPropertyNames()) {
            mo.setProperty(name, m2.getProperty(name));
          }
          if (m2.attributes.get('data-latex')) {
            mo.attributes.set(
              'data-latex',
              (mo.attributes.get('data-latex') as string) +
                (m2.attributes.get('data-latex') as string)
            );
          }
          children.splice(next, 1);
          remove.push(m2);
          m2.parent = null;
          m2.setProperty('relationsCombined', true);
          mo.setProperty('texClass', TEXCLASS.REL);
        } else {
          // @test Preset Rspace Lspace
          if (!mo.attributes.hasExplicit('rspace')) {
            // @test Mulitrel Mathvariant 3, Mulitrel Mathvariant 4
            NodeUtil.setAttribute(mo, 'rspace', '0pt');
          }
          if (!m2.attributes.hasExplicit('lspace')) {
            // @test Mulitrel Mathvariant 3, Mulitrel Mathvariant 4
            NodeUtil.setAttribute(m2, 'lspace', '0pt');
          }
          break;
        }
      }
      mo.attributes.setInherited('form', (mo as MmlMo).getForms()[0]);
    }
    arg.data.removeFromList('mo', remove);
  },

  /**
   * Visitor that rewrites incomplete msubsup/munderover elements in the given
   * node into corresponding msub/sup/under/over nodes.
   *
   * @param {object} arg The argument object.
   * @param {MmlNode} arg.math The node to rewrite.
   * @param {ParseOptions} arg.data The parse options.
   */
  cleanSubSup(arg: { math: any; data: ParseOptions }) {
    const options = arg.data;
    if (options.error) {
      return;
    }
    _cleanSubSup(options, 'sub', 'sup');
    _cleanSubSup(options, 'under', 'over');
  },

  /**
   * Visitor that rewrites in-line munderover elements with movablelimits but bases
   * that are not mo's into explicit msubsup elements.
   *
   * @param {object} arg The argument object.
   * @param {ParseOptions} arg.data  The parse options to use
   */
  moveLimits(arg: { data: ParseOptions }) {
    const options = arg.data;
    _moveLimits(options, 'munderover', 'msubsup');
    _moveLimits(options, 'munder', 'msub');
    _moveLimits(options, 'mover', 'msup');
  },

  /**
   * Recursively sets the inherited attributes on the math tree.
   *
   * @param {object} arg The argument object.
   * @param {MmlNode} arg.math The node to rewrite.
   * @param {ParseOptions} arg.data The parse options.
   */
  setInherited(arg: { math: any; data: ParseOptions }) {
    arg.data.root.setInheritedAttributes({}, arg.math['display'], 0, false);
  },

  /**
   * Removes unneeded mstyle elements that just set the scriptlevel
   *
   * @param {object} arg The argument object.
   * @param {ParseOptions} arg.data The parse options.
   */
  checkScriptlevel(arg: { data: ParseOptions }) {
    const options = arg.data;
    const remove: MmlNode[] = [];
    for (const mml of options.getList('mstyle')) {
      if (mml.childNodes[0].childNodes.length !== 1) {
        continue;
      }
      const attributes = mml.attributes;
      for (const key of ['displaystyle', 'scriptlevel']) {
        if (attributes.getExplicit(key) === attributes.getInherited(key)) {
          attributes.unset(key);
        }
      }
      const names = attributes.getExplicitNames();
      if (
        names.filter((key) => key.substring(0, 10) !== 'data-latex').length ===
        0
      ) {
        const child = mml.childNodes[0].childNodes[0];
        names.forEach((key) => child.attributes.set(key, attributes.get(key)));
        mml.parent.replaceChild(child, mml);
        remove.push(mml);
      }
    }
    options.removeFromList('mstyle', remove);
  },
};

export default FilterUtil;
