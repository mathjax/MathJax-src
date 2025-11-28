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
 * @file  Implements the MmlMspace node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { PropertyList } from '../../Tree/Node.js';
import { MmlNode, AbstractMmlTokenNode, TEXCLASS } from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMspace node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMspace extends AbstractMmlTokenNode {
  /**
   * Attributes that make an mpsace not spacelike
   */
  public static NONSPACELIKE = [
    /* 'width' */ // spec says not to allow breaks here, but we allow it
    'height',
    'depth',
    'style',
    'mathbackground',
    'background',
  ];

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults,
    width: '0em',
    height: '0ex',
    depth: '0ex',
    linebreak: 'auto',
    indentshift: 'auto', // Use user configuration
    indentalign: 'auto',
    indenttarget: '',
    indentalignfirst: 'indentalign',
    indentshiftfirst: 'indentshift',
    indentalignlast: 'indentalign',
    indentshiftlast: 'indentshift',
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.NONE;

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode): MmlNode {
    return prev;
  }

  /**
   * @override
   */
  public get kind() {
    return 'mspace';
  }

  /**
   * mspace can't have children
   *
   * @override
   */
  public get arity() {
    return 0;
  }

  /**
   * Only make mspace be space-like if it doesn't have certain attributes
   *
   * @override
   */
  public get isSpacelike() {
    return !this.attributes.hasExplicit('linebreak') && this.canBreak;
  }

  /**
   * Only process linebreak if the space has no explicit dimensions (according to spec)
   *
   * @override
   */
  public get hasNewline() {
    const linebreak = this.attributes.get('linebreak');
    return (
      this.canBreak &&
      (linebreak === 'newline' || linebreak === 'indentingnewline')
    );
  }

  /**
   * @returns {boolean}  True if mspace is allowed to break, i.e.,
   *                     no height/depth, no styles, no background color,
   *                     and width non-negative.
   */
  public get canBreak(): boolean {
    return (
      !this.attributes.hasOneOf(MmlMspace.NONSPACELIKE) &&
      String(this.attributes.get('width')).trim().charAt(0) !== '-'
    );
  }
}
