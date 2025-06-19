/*************************************************************
 *
 *  Copyright (c) 2022-2025 The MathJax Consortium
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
 * @file  Implements the LineBBox class
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { BBox, BBoxData } from '../../util/BBox.js';
import { StringMap } from './Wrapper.js';

/*****************************************************************/

/**
 * align and indent values
 */
export type IndentData = [string, string];

/**
 * A BBox with extra data about line breaking
 */
export class LineBBox extends BBox {
  /**
   * Indentation data for the line break
   */
  public indentData: IndentData[] = null;

  /**
   * the lineleading for this break
   */
  public lineLeading: number;

  /**
   * The original BBox.L value
   */
  public originalL: number;

  /**
   * True if this bbox is at the beginning of a line
   */
  public isFirst: boolean = false;

  /**
   * The index of the child node containing this starting line break and the line within that child
   */
  public start: [number, number];
  /**
   * The index of the child node containing the ending line break and the line within that child
   */
  public end: [number, number];

  /**
   * @param {BBox} bbox           The bbox to extend
   * @param {number} leading      The lineleading value for the break
   * @param {IndentData} indent   The align/shift information
   * @returns {LineBBox}          The extended bbox
   */
  public static from(
    bbox: BBox,
    leading: number,
    indent: IndentData[] = null
  ): LineBBox {
    const nbox = new this();
    Object.assign(nbox, bbox);
    nbox.lineLeading = leading;
    if (indent) {
      nbox.indentData = indent;
    }
    return nbox;
  }

  /**
   * @override
   */
  constructor(def?: BBoxData, start: [number, number] = null) {
    super(def);
    this.originalL = this.L;
    if (start) {
      this.start = start;
    }
  }

  /**
   * @override
   */
  public append(cbox: LineBBox) {
    if (this.isFirst) {
      cbox.originalL += cbox.L;
      cbox.L = 0; // remove spacing after an operator with a linebreak after it
    }
    if (cbox.indentData) {
      this.indentData = cbox.indentData;
    }
    this.lineLeading = cbox.lineLeading;
    super.append(cbox);
    this.isFirst = cbox.isFirst;
  }

  /**
   * @override
   */
  public copy(): LineBBox {
    const bbox = LineBBox.from(this, this.lineLeading);
    bbox.indentData = this.indentData;
    bbox.lineLeading = this.lineLeading;
    return bbox;
  }

  /**
   * @param {MmlNode} node    The MmlNode to get attributes from
   */
  public getIndentData(node: MmlNode) {
    let {
      indentalign,
      indentshift,
      indentalignfirst,
      indentshiftfirst,
      indentalignlast,
      indentshiftlast,
    } = node.attributes.getAllAttributes() as StringMap;
    if (indentalignfirst === 'indentalign') {
      indentalignfirst = node.attributes.getInherited('indentalign') as string;
    }
    if (indentshiftfirst === 'indentshift') {
      indentshiftfirst = node.attributes.getInherited('indentshift') as string;
    }
    if (indentalignlast === 'indentalign') {
      indentalignlast = indentalign;
    }
    if (indentshiftlast === 'indentshift') {
      indentshiftlast = indentshift;
    }
    this.indentData = [
      [indentalignfirst, indentshiftfirst],
      [indentalign, indentshift],
      [indentalignlast, indentshiftlast],
    ] as IndentData[];
  }

  /**
   * @param {LineBBox} bbox   The LineBBox whose indentData is to be copied
   * @returns {IndentData[]}   The copied array
   */
  protected copyIndentData(bbox: LineBBox): IndentData[] {
    return bbox.indentData.map(([align, indent]) => [align, indent]);
  }
}
