/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmsubsup wrapper for the MmlMsubsup object
 *                and the special cases CHTMLmsub and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTML} from '../../chtml.js';
import {CHTMLWrapper, CHTMLWrapperClass} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData,
        CHTMLFontData, CHTMLFontDataClass} from '../FontData.js';
import {CommonMsub, CommonMsubClass, CommonMsubMixin,
        CommonMsup, CommonMsupClass, CommonMsupMixin,
        CommonMsubsup, CommonMsubsupClass, CommonMsubsupMixin} from '../../common/Wrappers/msubsup.js';
import {CHTMLScriptbase, CHTMLScriptbaseClass, CHTMLScriptbaseNTD} from './scriptbase.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLMsub interface for the CHTML Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsubNTD<N, T, D> extends CHTMLScriptbaseNTD<N, T, D>, CommonMsub<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMsubClass interface for the CHTML Msub wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsubClass<N, T, D> extends CHTMLScriptbaseClass<N, T, D>, CommonMsubClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMsubNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMsub wrapper class for the MmlMsub class
 */
export const CHTMLMsub = (function <N, T, D>(): CHTMLMsubClass<N, T, D> {

  const Base = CommonMsubMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMsubClass<N, T, D>
    >(CHTMLScriptbase);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMsub extends Base implements CHTMLMsubNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsub.prototype.kind;

  };

})<any, any, any>();


/*****************************************************************/
/*****************************************************************/

/**
 * The CHTMLMsup interface for the CHTML Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsupNTD<N, T, D> extends CHTMLScriptbaseNTD<N, T, D>, CommonMsup<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMsupClass interface for the CHTML Msup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsupClass<N, T, D> extends CHTMLScriptbaseClass<N, T, D>, CommonMsupClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMsupNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMsup wrapper class for the MmlMsup class
 */
export const CHTMLMsup = (function <N, T, D>(): CHTMLMsupClass<N, T, D> {

  const Base = CommonMsupMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMsupClass<N, T, D>
    >(CHTMLScriptbase);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMsup extends Base implements CHTMLMsupNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsup.prototype.kind;

  };

})<any, any, any>();


/*****************************************************************/
/*****************************************************************/

/**
 * The CHTMLMsubsup interface for the CHTML Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsubsupNTD<N, T, D> extends CHTMLScriptbaseNTD<N, T, D>, CommonMsubsup<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {}

/**
 * The CHTMLMsubsupClass interface for the CHTML Msubsup wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface CHTMLMsubsupClass<N, T, D> extends CHTMLScriptbaseClass<N, T, D>, CommonMsubsupClass<
  N, T, D,
  CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
  CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass
> {
  new(factory: CHTMLWrapperFactory<N, T, D>, node: MmlNode, parent?: CHTMLWrapper<N, T, D>): CHTMLMsubsupNTD<N, T, D>;
}


/*****************************************************************/

/**
 * The CHTMLMsubsup wrapper class for the MmlMsubsup class
 */
export const CHTMLMsubsup = (function <N, T, D>(): CHTMLMsubsupClass<N, T, D> {

  const Base = CommonMsubsupMixin<
      N, T, D,
      CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperFactory<N, T, D>, CHTMLWrapperClass<N, T, D>,
      CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData, CHTMLFontData, CHTMLFontDataClass,
      CHTMLMsubsupClass<N, T, D>
    >(CHTMLScriptbase);

  // Avoid message about base constructors not having the same type
  //   (they should both be CHTMLWrapper<N, T, D>, but are thought of as different by typescript)
  // @ts-ignore
  return class CHTMLMsubsup extends Base implements CHTMLMsubsupNTD<N, T, D> {

    /**
     * @override
     */
    public static kind = MmlMsubsup.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleList = {
      'mjx-script': {
        display: 'inline-block',
        'padding-right': '.05em',  // scriptspace
        'padding-left': '.033em'   // extra_ic
      },
      'mjx-script > mjx-spacer': {
        display: 'block'
      }
    };

    /**
     * @override
     */
    public toCHTML(parent: N) {
      const adaptor = this.adaptor;
      const chtml = this.standardCHTMLnode(parent);
      const [base, sup, sub] = [this.baseChild, this.supChild, this.subChild];
      const [ , v, q] = this.getUVQ();
      const style = {'vertical-align': this.em(v)};
      base.toCHTML(chtml);
      const stack = adaptor.append(chtml, this.html('mjx-script', {style})) as N;
      sup.toCHTML(stack);
      adaptor.append(stack, this.html('mjx-spacer', {style: {'margin-top': this.em(q)}}));
      sub.toCHTML(stack);
      const ic = this.getAdjustedIc();
      if (ic) {
        adaptor.setStyle(sup.dom, 'marginLeft', this.em(ic / sup.bbox.rscale));
      }
      if (this.baseRemoveIc) {
        adaptor.setStyle(stack, 'marginLeft', this.em(-this.baseIc));
      }
    }

  };

})<any, any, any>();
