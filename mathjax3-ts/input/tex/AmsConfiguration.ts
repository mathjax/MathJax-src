/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview The Fallback Methods for the subhandlers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from './Configuration.js';
import {TreeHelper} from './TreeHelper.js';
import TexParser from './TexParser.js';
import {MultlineItem} from './AmsItems.js';
import {AbstractTags} from './Tags.js';
import './AmsMappings.js';

// This is from the 'no undefined' extension.
function noUndefined(parser: TexParser, name: string) {
  const textNode = TreeHelper.createText('\\' + name);
  parser.Push(TreeHelper.createNode('mtext', [], {mathcolor: 'red'}, textNode));
};


/**
 * Standard AMS style tagging.
 * @constructor
 * @extends {AbstractTags}
 */
export class AmsTags extends AbstractTags { }


export const AmsConfiguration = new Configuration(
  'ams',
  {
    delimiter: ['AMSsymbols-delimiter', 'AMSmath-delimiter'],
    macro: ['AMSsymbols-mathchar0mi', 'AMSsymbols-mathchar0m0',
            'AMSsymbols-delimiter', 'AMSsymbols-macros',
            'AMSmath-mathchar0mo', 'AMSmath-macros', 'AMSmath-delimiter'],
    environment: ['AMSmath-environment']
  }, {
    // macro: noUndefined
  }, {[MultlineItem.prototype.kind]: MultlineItem}, {'AMS': AmsTags},
  {}
);


