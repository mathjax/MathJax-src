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
 * @file  Implements the SvgFontData class for font data in SVG output.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {
  CharMap,
  CharOptions,
  CharDataArray,
  VariantData,
  DelimiterData,
  FontData,
  FontExtensionData,
  mergeOptions,
} from '../common/FontData.js';

export * from '../common/FontData.js';

export type CharStringMap = { [name: number]: string };

/**
 * Add the extra data needed for CharOptions in SVG
 */
export interface SvgCharOptions extends CharOptions {
  c?: string; // the character value (overrides default value)
  p?: string; // svg path
}

/**
 * Shorthands for SVG char maps and char data
 */
export type SvgCharMap = CharMap<SvgCharOptions>;
export type SvgCharData = CharDataArray<SvgCharOptions>;

/**
 * The extra data needed for a Variant in SVG output
 */
export interface SvgVariantData extends VariantData<SvgCharOptions> {
  cacheID: string;
}

/**
 * the extra data neede for a Delimiter in SVG output
 */
export interface SvgDelimiterData extends DelimiterData {}

/**
 * Includes the data needed for SVG font extensions
 */
export interface SvgFontExtensionData<
  C extends SvgCharOptions,
  D extends SvgDelimiterData,
> extends FontExtensionData<C, D> {
  cacheIds?: { [variant: string]: string };
}

/****************************************************************************/

/**
 * The SVG FontData class
 */
export class SvgFontData extends FontData<
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData
> {
  /**
   * @override
   */
  public static OPTIONS = {
    ...FontData.OPTIONS,
    dynamicPrefix: './svg/dynamic',
  };

  /**
   * @override
   */
  public static JAX = 'SVG';

  /**
   * @override
   */
  public static charOptions(font: SvgCharMap, n: number) {
    return super.charOptions(font, n) as SvgCharOptions;
  }

  /**
   * @override
   */
  public static addExtension(
    data: SvgFontExtensionData<SvgCharOptions, SvgDelimiterData>,
    prefix: string = ''
  ) {
    super.addExtension(data, prefix);
    mergeOptions(this, 'variantCacheIds', data.cacheIds);
  }
}

export type SvgFontDataClass = typeof SvgFontData;

/****************************************************************************/

/**
 * @param {CharMap} font        The font to augment
 * @param {CharStringMap} paths     The path data to use for each character
 * @param {CharStringMap} content   The string to use for remapped characters
 * @returns {SvgCharMap}            The augmented font
 */
export function AddPaths(
  font: SvgCharMap,
  paths: CharStringMap,
  content: CharStringMap
): SvgCharMap {
  for (const c of Object.keys(paths)) {
    const n = parseInt(c);
    SvgFontData.charOptions(font, n).p = paths[n];
  }
  for (const c of Object.keys(content)) {
    const n = parseInt(c);
    SvgFontData.charOptions(font, n).c = content[n];
  }
  return font;
}
