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
 * @file  Implements a bounding-box object and operations on it
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { BIGDIMEN } from './lengths.js';

/**
 *  The data used to initialize a BBox
 */
export type BBoxData = {
  w?: number;
  h?: number;
  d?: number;
};

/*****************************************************************/
/**
 *  The BBox class
 */

export class BBox {
  /**
   * Constant for pwidth of full width box
   */
  public static fullWidth = '100%';

  /**
   * The side names, indices, and which dimension they affect
   */
  public static boxSides: [string, number, string][] = [
    ['Top', 0, 'h'],
    ['Right', 1, 'w'],
    ['Bottom', 2, 'd'],
    ['Left', 3, 'w'],
  ];

  /**
   *  These are the data stored for a bounding box
   */
  public w: number;
  public h: number;
  public d: number;
  public scale: number;
  public rscale: number; // scale relative to the parent's scale
  public L: number; // extra space on the left
  public R: number; // extra space on the right
  public pwidth: string; // percentage width (for tables)
  public ic: number; // italic correction
  public oc: number; // alternate italic correction for -tex-mit variant
  public sk: number; // skew
  public dx: number; // offset for combining characters as accents

  /**
   * @returns {BBox}  A BBox initialized to zeros
   */
  public static zero(): BBox {
    return new BBox({ h: 0, d: 0, w: 0 });
  }

  /**
   * @returns {BBox}  A BBox with height and depth not set
   */
  public static empty(): BBox {
    return new BBox();
  }

  /**
   * @param {BBoxData} def  The data with which to initialize the BBox
   *
   * @class
   */
  constructor(def: BBoxData = { w: 0, h: -BIGDIMEN, d: -BIGDIMEN }) {
    this.w = def.w || 0;
    this.h = 'h' in def ? def.h : -BIGDIMEN;
    this.d = 'd' in def ? def.d : -BIGDIMEN;
    this.L = this.R = this.ic = this.oc = this.sk = this.dx = 0;
    this.scale = this.rscale = 1;
    this.pwidth = '';
  }

  /**
   * Set up a bbox for append() and combine() operations
   *
   * @returns {BBox}  the bbox itself (for chaining calls)
   */
  public empty(): BBox {
    this.w = 0;
    this.h = this.d = -BIGDIMEN;
    return this;
  }

  /**
   * Convert any unspecified values into zeros
   */
  public clean() {
    if (this.w === -BIGDIMEN) this.w = 0;
    if (this.h === -BIGDIMEN) this.h = 0;
    if (this.d === -BIGDIMEN) this.d = 0;
  }

  /**
   * @param {number} scale  The scale to use to modify the bounding box size
   */
  public rescale(scale: number) {
    this.w *= scale;
    this.h *= scale;
    this.d *= scale;
  }

  /**
   * @param {BBox} cbox  A bounding to combine with this one
   * @param {number} x   An x-offest for the child bounding box
   * @param {number} y   A y-offset for the child bounding box
   */
  public combine(cbox: BBox, x: number = 0, y: number = 0) {
    const rscale = cbox.rscale;
    const w = x + rscale * (cbox.w + cbox.L + cbox.R);
    const h = y + rscale * cbox.h;
    const d = rscale * cbox.d - y;
    if (w > this.w) this.w = w;
    if (h > this.h) this.h = h;
    if (d > this.d) this.d = d;
  }

  /**
   * @param {BBox} cbox  A bounding box to be added to the right of this one
   */
  public append(cbox: BBox) {
    const scale = cbox.rscale;
    this.w += scale * (cbox.w + cbox.L + cbox.R);
    if (scale * cbox.h > this.h) {
      this.h = scale * cbox.h;
    }
    if (scale * cbox.d > this.d) {
      this.d = scale * cbox.d;
    }
  }

  /**
   * @param {BBox} cbox  The bounding box to use to overwrite this one
   */
  public updateFrom(cbox: BBox) {
    this.h = cbox.h;
    this.d = cbox.d;
    this.w = cbox.w;
    if (cbox.pwidth) {
      this.pwidth = cbox.pwidth;
    }
  }

  /**
   * @returns {BBox}   A copy of the current BBox
   */
  public copy(): BBox {
    const bbox = new BBox();
    Object.assign(bbox, this);
    return bbox;
  }
}
