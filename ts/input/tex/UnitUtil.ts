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
 * @file Utilities for units.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

class UnitMap {
  public num = '([-+]?([.,]\\d+|\\d+([.,]\\d*)?))';
  public unit = '';
  public dimenEnd = /./;
  public dimenRest = /./;

  private map: Map<string, number>;

  /**
   * @override
   */
  constructor(map: [string, number][]) {
    this.map = new Map(map);
    this.updateDimen();
  }

  /**
   * Updates the regular expressions for the unit.
   */
  private updateDimen() {
    this.unit = `(${Array.from(this.map.keys()).join('|')})`;
    this.dimenEnd = RegExp('^\\s*' + this.num + '\\s*' + this.unit + '\\s*$');
    this.dimenRest = RegExp('^\\s*' + this.num + '\\s*' + this.unit + ' ?');
  }

  /**
   * @override
   */
  public set(name: string, ems: number) {
    this.map.set(name, ems);
    this.updateDimen();
    return this;
  }

  /**
   * Retrieves conversion value for an existing dimension. If the dimension does
   * not exist, `pt` is used, similar to TeX behaviour. However, no error is thrown.
   *
   * @override
   */
  public get(name: string) {
    return this.map.get(name) || this.map.get('pt');
  }

  /**
   * @override
   */
  public delete(name: string) {
    if (this.map.delete(name)) {
      this.updateDimen();
      return true;
    }
    return false;
  }
}

const emPerInch = 7.2;
const pxPerInch = 72;

/**
 * Transforms mu dimension to em if necessary.
 *
 * @param {[string, string, number]} arg The dimension triple.
 * @returns {[string, string, number]} The transformed triple.
 */
function muReplace([value, unit, length]: [string, string, number]): [
  string,
  string,
  number,
] {
  if (unit !== 'mu') {
    return [value, unit, length];
  }
  const em = UnitUtil.em(UnitUtil.UNIT_CASES.get(unit) * parseFloat(value));
  return [em.slice(0, -2), 'em', length];
}

export const UnitUtil = {
  // Note, the following are TeX CM font values.
  /* prettier-ignore */
  UNIT_CASES: new UnitMap([
    ['em', 1],
    ['ex', .43],
    ['pt', 1 / 10],           // 10 pt to an em
    ['pc', 1.2],              // 12 pt to a pc
    ['px', emPerInch / pxPerInch],
    ['in', emPerInch],
    ['cm', emPerInch / 2.54], // 2.54 cm to an inch
    ['mm', emPerInch / 25.4], // 10 mm to a cm
    ['mu', 1 / 18],
  ]),

  /**
   * Matches for a dimension argument.
   *
   * @param {string} dim The argument.
   * @param {boolean} rest Allow for trailing garbage in the dimension string.
   * @returns {[string, string, number]} The match result as (Anglosaxon) value,
   *     unit name, length of matched string. The latter is interesting in the
   *     case of trailing garbage.
   */
  matchDimen(dim: string, rest: boolean = false): [string, string, number] {
    const match = dim.match(
      rest ? UnitUtil.UNIT_CASES.dimenRest : UnitUtil.UNIT_CASES.dimenEnd
    );
    return match
      ? muReplace([match[1].replace(/,/, '.'), match[4], match[0].length])
      : [null, null, 0];
  },

  /**
   * Convert a dimension string into standard em dimension.
   *
   * @param {string} dim The attribute string.
   * @returns {number} The numerical value.
   */
  dimen2em(dim: string): number {
    const [value, unit] = UnitUtil.matchDimen(dim);
    const m = parseFloat(value || '1');
    const factor = UnitUtil.UNIT_CASES.get(unit);
    return factor * m;
  },

  /**
   * Turns a number into an em value.
   *
   * @param {number} m The number.
   * @returns {string} The em dimension string.
   */
  em(m: number): string {
    if (Math.abs(m) < 0.0006) {
      return '0em';
    }
    return m.toFixed(3).replace(/\.?0+$/, '') + 'em';
  },

  /**
   * Trim spaces from a string.
   *
   * @param {string} text The string to clean.
   * @returns {string} The string with leading and trailing whitespace removed.
   */
  trimSpaces(text: string): string {
    if (typeof text !== 'string') {
      return text;
    }
    let TEXT = text.trim();
    if (TEXT.match(/\\$/) && text.match(/ $/)) {
      TEXT += ' ';
    }
    return TEXT;
  },
};
