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
 * @file  Implements the MmlMtext node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { PropertyList } from '../../Tree/Node.js';
import { AbstractMmlTokenNode, TEXCLASS } from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMtext node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMtext extends AbstractMmlTokenNode {
  /**
   * Attributes that make an mpsace not spacelike
   */
  public static NONSPACELIKE = ['style', 'mathbackground', 'background'];

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults,
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.ORD;

  /**
   * @override
   */
  public get kind() {
    return 'mtext';
  }

  /**
   * According to the spec, <mtext> is always space-like,
   * but we make it so only if it contains only spaces and
   * doesn't have certain attributes.
   *
   * @override
   */
  public get isSpacelike() {
    return (
      !!this.getText().match(/^\s*$/) &&
      !this.attributes.hasOneOf(MmlMtext.NONSPACELIKE)
    );
  }
}
