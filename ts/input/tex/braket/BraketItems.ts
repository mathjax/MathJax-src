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
 * @file Stack items for parsing the braket package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { CheckType, BaseItem, StackItem } from '../StackItem.js';
import { TEXCLASS, MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { ParseUtil } from '../ParseUtil.js';
import { MATHSPACE, em } from '../../../util/lengths.js';

const THINSPACE = em(MATHSPACE.thinmathspace);

/**
 * A bra-ket command. Collates elements from the opening brace to the closing
 * brace, adding bars to a given maximal number (e.g., only one in case of
 * set). To finalise it adds the surrounding angle brackets or braces.
 */
export class BraketItem extends BaseItem {
  /**
   * @override
   */
  get kind() {
    return 'braket';
  }

  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * The MathML nodes that appear before the latest bar (so that \over can be handled properly).
   */
  public barNodes: MmlNode[] = [];

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('close')) {
      if (item.getProperty('braketbar')) {
        this.barNodes.push(...super.toMml(true, true).childNodes);
        this.Clear();
        return BaseItem.fail;
      }
      return [[this.factory.create('mml', this.toMml())], true];
    }
    if (item.isKind('mml')) {
      this.Push(item.toMml());
      if (this.getProperty('single')) {
        return [[this.toMml()], true];
      }
      return BaseItem.fail;
    }
    return super.checkItem(item);
  }

  /**
   * @override
   */
  public toMml(inferred: boolean = true, forceRow?: boolean) {
    let inner = super.toMml(inferred, forceRow);
    if (!inferred) {
      //
      // When toMml() is being called from processing an \over item, we don't want to
      // add the delimiters, so just do the super toMml() method.  (Issue #3000)
      //
      return inner;
    }
    const open = this.getProperty('open') as string;
    const close = this.getProperty('close') as string;
    //
    // Add any saved bar nodes
    //
    if (this.barNodes.length) {
      inner = this.create('node', 'inferredMrow', [...this.barNodes, inner]);
    }
    if (this.getProperty('stretchy')) {
      //
      //  Add spacing, if requested
      //
      if (this.getProperty('space')) {
        inner = this.create('node', 'inferredMrow', [
          this.create('token', 'mspace', { width: THINSPACE }),
          inner,
          this.create('token', 'mspace', { width: THINSPACE }),
        ]);
      }
      return ParseUtil.fenced(this.factory.configuration, open, inner, close);
    }
    const attrs = {
      fence: true,
      stretchy: false,
      symmetric: true,
      texClass: TEXCLASS.OPEN,
    };
    const openNode = this.create('token', 'mo', attrs, open);
    attrs.texClass = TEXCLASS.CLOSE;
    const closeNode = this.create('token', 'mo', attrs, close);
    const mrow = this.create('node', 'mrow', [openNode, inner, closeNode], {
      open: open,
      close: close,
    });
    return mrow;
  }
}
