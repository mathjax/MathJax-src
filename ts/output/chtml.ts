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
 * @file  Implements the CHTML OutputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CommonOutputJax } from './common.js';
import { CommonWrapper as _CommonWrapper } from './common/Wrapper.js';
import { StyleList } from '../util/Styles.js';
import { StyleJson, StyleJsonSheet } from '../util/StyleJson.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { ChtmlWrapper, ChtmlWrapperClass } from './chtml/Wrapper.js';
import { ChtmlWrapperFactory } from './chtml/WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
  FontExtensionData,
} from './chtml/FontData.js';
import { Usage } from './chtml/Usage.js';
import * as LENGTHS from '../util/lengths.js';
import { unicodeChars } from '../util/string.js';
import { DefaultFont } from './chtml/DefaultFont.js';

/*****************************************************************/
/**
 *  Implements the CHTML class (extends AbstractOutputJax)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTML<N, T, D> extends CommonOutputJax<
  //
  // The HTMLElement, TextNode, and Document classes (for the DOM implementation in use)
  //
  N,
  T,
  D,
  //
  // The Wrapper type and its Factory and Class (these need to know N, T, and D)
  //
  ChtmlWrapper<N, T, D>,
  ChtmlWrapperFactory<N, T, D>,
  ChtmlWrapperClass<N, T, D>,
  //
  // These are font-related objects that depend on the output jax; e,g. the character options
  //   for CHTML and SVG output differ (CHTML contains font information, while SVG has path data)
  //
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass
> {
  /**
   * The name of this output jax
   */
  public static NAME: string = 'CHTML';

  /**
   * @override
   */
  public static OPTIONS: OptionList = {
    ...CommonOutputJax.OPTIONS,
    adaptiveCSS: true, // true means only produce CSS that is used in the processed equations
    matchFontHeight: true, // true to match ex-height of surrounding font
  };

  /**
   *  The default styles for CommonHTML
   */
  public static commonStyles: StyleJson = {
    ...CommonOutputJax.commonStyles,
    'mjx-container[jax="CHTML"]': {
      'white-space': 'nowrap',
    },

    //
    // Clip the token elements' character content,
    //   to remove excessive height and depth of ZERO font
    // Do the same for stretchy characters
    //
    [[
      'mjx-mo > mjx-c',
      'mjx-mi > mjx-c',
      'mjx-mn > mjx-c',
      'mjx-ms > mjx-c',
      'mjx-mtext > mjx-c',
    ].join(', ')]: {
      'clip-path':
        'padding-box xywh(-1em -2px calc(100% + 2em) calc(100% + 4px))',
    },
    'mjx-stretchy-h': {
      'clip-path': 'padding-box xywh(0 -2px 100% calc(100% + 4px))',
    },
    'mjx-stretchy-v': {
      'clip-path': 'padding-box xywh(-2px 0 calc(100% + 4px) 100%)',
    },

    'mjx-container [space="1"]': { 'margin-left': '.111em' },
    'mjx-container [space="2"]': { 'margin-left': '.167em' },
    'mjx-container [space="3"]': { 'margin-left': '.222em' },
    'mjx-container [space="4"]': { 'margin-left': '.278em' },
    'mjx-container [space="5"]': { 'margin-left': '.333em' },

    'mjx-container [rspace="1"]': { 'margin-right': '.111em' },
    'mjx-container [rspace="2"]': { 'margin-right': '.167em' },
    'mjx-container [rspace="3"]': { 'margin-right': '.222em' },
    'mjx-container [rspace="4"]': { 'margin-right': '.278em' },
    'mjx-container [rspace="5"]': { 'margin-right': '.333em' },

    'mjx-container [size="s"]': { 'font-size': '70.7%' },
    'mjx-container [size="ss"]': { 'font-size': '50%' },
    'mjx-container [size="Tn"]': { 'font-size': '60%' },
    'mjx-container [size="sm"]': { 'font-size': '85%' },
    'mjx-container [size="lg"]': { 'font-size': '120%' },
    'mjx-container [size="Lg"]': { 'font-size': '144%' },
    'mjx-container [size="LG"]': { 'font-size': '173%' },
    'mjx-container [size="hg"]': { 'font-size': '207%' },
    'mjx-container [size="HG"]': { 'font-size': '249%' },

    'mjx-container [width="full"]': { width: '100%' },

    'mjx-box': { display: 'inline-block' },
    'mjx-block': { display: 'block' },
    'mjx-itable': { display: 'inline-table' },
    'mjx-row': { display: 'table-row' },
    'mjx-row > *': { display: 'table-cell' },

    'mjx-container [inline-breaks]': { display: 'inline' },

    //
    //  These don't have Wrapper subclasses, so add their styles here
    //
    'mjx-mtext': {
      display: 'inline-block',
    },
    'mjx-mstyle': {
      display: 'inline-block',
    },
    'mjx-merror': {
      display: 'inline-block',
      color: 'red',
      'background-color': 'yellow',
    },
    'mjx-mphantom': {
      visibility: 'hidden',
    },
  };

  /**
   * The ID for the stylesheet element for the styles for the SVG output
   */
  public static STYLESHEETID = 'MJX-CHTML-styles';

  /**
   * The usage information for the wrapper classes
   */
  public wrapperUsage: Usage<string>;

  /**
   * The CHTML stylesheet, once it is constructed
   */
  public chtmlStyles: N = null;

  /**
   * @override
   * @class
   */
  constructor(options: OptionList = {}) {
    super(options, ChtmlWrapperFactory as any, DefaultFont);
    this.font.adaptiveCSS(this.options.adaptiveCSS);
    this.wrapperUsage = new Usage<string>();
  }

  /**
   * @override
   */
  public addExtension(
    font: FontExtensionData<ChtmlCharOptions, ChtmlDelimiterData>,
    prefix: string = ''
  ): string[] {
    const css = super.addExtension(font, prefix);
    if (css.length && this.options.adaptiveCSS && this.chtmlStyles) {
      this.adaptor.insertRules(this.chtmlStyles, css);
    }
    return [];
  }

  /**
   * @override
   */
  public escaped(math: MathItem<N, T, D>, html: MathDocument<N, T, D>) {
    this.setDocument(html);
    return this.html('span', {}, [this.text(math.math)]);
  }

  /**
   * @override
   */
  public styleSheet(html: MathDocument<N, T, D>) {
    if (this.chtmlStyles) {
      const styles = new StyleJsonSheet();
      if (this.options.adaptiveCSS) {
        //
        // Update the style sheet rules
        //
        this.addWrapperStyles(styles);
        this.updateFontStyles(styles);
      }
      styles.addStyles(this.font.updateDynamicStyles());
      this.adaptor.insertRules(this.chtmlStyles, styles.getStyleRules());
      return this.chtmlStyles; // stylesheet is already added to the document
    }
    const sheet = (this.chtmlStyles = super.styleSheet(html));
    this.adaptor.setAttribute(sheet, 'id', CHTML.STYLESHEETID);
    this.wrapperUsage.update();
    return sheet;
  }

  /**
   * @param {StyleJsonSheet} styles   The styles to update with newly used character styles
   */
  protected updateFontStyles(styles: StyleJsonSheet) {
    styles.addStyles(this.font.updateStyles({}));
  }

  /**
   * @override
   */
  protected addWrapperStyles(styles: StyleJsonSheet) {
    if (!this.options.adaptiveCSS) {
      super.addWrapperStyles(styles);
      return;
    }
    for (const kind of this.wrapperUsage.update()) {
      const wrapper = this.factory.getNodeClass(
        kind
      ) as any as typeof _CommonWrapper;
      if (wrapper) {
        this.addClassStyles(wrapper, styles);
      }
    }
  }

  /**
   * @override
   */
  protected addClassStyles(
    wrapper: typeof _CommonWrapper,
    styles: StyleJsonSheet
  ) {
    const CLASS = wrapper as typeof ChtmlWrapper;
    if (CLASS.autoStyle && CLASS.kind !== 'unknown') {
      styles.addStyles({
        ['mjx-' + CLASS.kind]: {
          display: 'inline-block',
          'text-align': 'left',
        },
      });
    }
    this.wrapperUsage.add(CLASS.kind);
    super.addClassStyles(wrapper, styles);
  }

  /**
   * @override
   */
  public insertStyles(styles: StyleJson) {
    if (this.chtmlStyles) {
      this.adaptor.insertRules(
        this.chtmlStyles,
        new StyleJsonSheet(styles).getStyleRules()
      );
    }
  }

  /**
   * @param {ChtmlWrapper} wrapper   The MML node wrapper whose HTML is to be produced
   * @param {N} parent     The HTML node to contain the HTML
   */
  public processMath(wrapper: ChtmlWrapper<N, T, D>, parent: N) {
    wrapper.toCHTML([parent]);
  }

  /**
   * Clear the cache of which items need their styles to be output
   */
  public clearCache() {
    this.styleJson.clear();
    this.font.clearCache();
    this.wrapperUsage.clear();
    this.chtmlStyles = null;
  }

  /**
   * @override
   */
  public reset() {
    this.clearCache();
  }

  /*****************************************************************/

  /**
   * @override
   */
  public unknownText(text: string, variant: string, width: number = null) {
    const styles: StyleList = {};
    const scale = 100 / this.math.metrics.scale;
    if (scale !== 100) {
      styles['font-size'] = this.fixed(scale, 1) + '%';
      styles.padding =
        LENGTHS.em(75 / scale) + ' 0 ' + LENGTHS.em(20 / scale) + ' 0';
    }
    if (variant !== '-explicitFont') {
      const c = unicodeChars(text);
      if (c.length !== 1 || c[0] < 0x1d400 || c[0] > 0x1d7ff) {
        this.cssFontStyles(this.font.getCssFont(variant), styles);
      }
    }
    //
    // Work around Safari bug with the MJXZERO font by forcing the width.
    //   (If MJXZERO can be made to work with Safari, then remove width parameter
    //    and call to getBBox().w in TextNode.ts)
    //
    if (width !== null) {
      styles.width = this.fixed(width * this.math.metrics.scale) + 'em';
    }
    //
    return this.html('mjx-utext', { variant: variant, style: styles }, [
      this.text(text),
    ]);
  }

  /**
   * Measure the width of a text element by placing it in the page
   *  and looking up its size (fake the height and depth, since we can't measure that)
   *
   * @override
   */

  public measureTextNode(textNode: N) {
    const adaptor = this.adaptor;
    const text = adaptor.clone(textNode);
    //
    // Work arround Safari bug with the MJXZERO font.
    //
    adaptor.setStyle(
      text,
      'font-family',
      adaptor.getStyle(text, 'font-family').replace(/MJXZERO, /g, '')
    );
    //
    const em = this.math.metrics.em;
    const style = {
      position: 'absolute',
      top: 0,
      left: 0,
      'white-space': 'nowrap',
      'font-size': this.fixed(em, 3) + 'px',
    };
    const node = this.html('mjx-measure-text', { style }, [text]);
    adaptor.append(adaptor.parent(this.math.start.node), this.container);
    adaptor.append(this.container, node);
    const w = adaptor.nodeSize(text, em)[0];
    adaptor.remove(this.container);
    adaptor.remove(node);
    return { w: w, h: 0.75, d: 0.2 };
  }
}
