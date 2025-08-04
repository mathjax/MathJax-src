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
 * @file Stack items for the physics package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { CheckType, BaseItem, StackItem } from '../StackItem.js';
import { ParseUtil } from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import TexParser from '../TexParser.js';
import { AbstractMmlTokenNode } from '../../../core/MmlTree/MmlNode.js';

export class AutoOpen extends BaseItem {
  /**
   * @override
   */
  protected static errors = Object.assign(Object.create(BaseItem.errors), {
    stop: ['ExtraOrMissingDelims', 'Extra open or missing close delimiter'],
  });

  /**
   * The number of unpaired open delimiters that need to be matched before
   *   a close delimiter will close this item. (#2831)
   */
  public openCount: number = 0;

  /**
   * @override
   */
  public get kind() {
    return 'auto open';
  }

  /**
   * @override
   */
  get isOpen() {
    return true;
  }

  /**
   * @override
   */
  public toMml(inferred: boolean = true, forceRow?: boolean) {
    if (!inferred) {
      //
      // When toMml() is being called from processing an \over item, we don't want to
      // add the delimiters, so just do the super toMml() method. (Issue #3000)
      //
      return super.toMml(inferred, forceRow);
    }
    // Smash and right/left
    const parser = this.factory.configuration.parser;
    const right = this.getProperty('right') as string;
    if (this.getProperty('smash')) {
      const mml = super.toMml();
      const smash = parser.create('node', 'mpadded', [mml], {
        height: 0,
        depth: 0,
      });
      this.Clear();
      this.Push(parser.create('node', 'TeXAtom', [smash]));
    }
    if (right) {
      this.Push(
        new TexParser(right, parser.stack.env, parser.configuration).mml()
      );
    }
    const mml = ParseUtil.fenced(
      this.factory.configuration,
      this.getProperty('open') as string,
      super.toMml(),
      this.getProperty('close') as string,
      this.getProperty('big') as string
    );
    //
    //  Remove fence markers that would cause it to be TeX class INNER,
    //  so it is treated as a regular mrow when setting the tex class (#2760)
    //
    NodeUtil.removeProperties(mml, 'open', 'close', 'texClass');
    return mml;
  }

  /**
   * Test whether a fence is a closing one for this item,
   * decrementing the open count if appropriate.
   *
   * @param {string} fence The fence character.
   * @returns {boolean} True if the fence is the appropriate closing one.
   */
  public closing(fence: string): boolean {
    return fence === this.getProperty('close') && !this.openCount--;
  }

  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    //
    // If we are closing \over items, we are done
    //
    if (item.getProperty('pre-autoclose')) {
      return BaseItem.fail;
    }
    //
    // If this is the closing fence, produce the proper output
    //
    if (item.getProperty('autoclose')) {
      if (this.getProperty('ignore')) {
        this.Clear();
        return [[], true];
      }
      return [[this.toMml()], true];
    }
    //
    //  Check for nested open delimiters (#2831)
    //
    if (item.isKind('mml') && item.Size() === 1) {
      const mml = item.toMml();
      if (
        mml.isKind('mo') &&
        (mml as AbstractMmlTokenNode).getText() === this.getProperty('open')
      ) {
        this.openCount++;
      }
    }
    //
    // Do the default check
    //
    return super.checkItem(item);
  }
}
