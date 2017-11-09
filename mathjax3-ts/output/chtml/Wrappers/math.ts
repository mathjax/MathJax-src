/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview  Implements the CHTMLmath wrapper for the MmlMath object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {MmlMath} from '../../../core/MmlTree/MmlNodes/math.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../CssStyles.js';

/*****************************************************************/
/*
 *  The CHTMLmath wrapper for the MmlMath object
 */

export class CHTMLmath extends CHTMLWrapper {
    public static kind = MmlMath.prototype.kind;

    public static styles: StyleList = {
        'mjx-math': {
            display: 'inline-block',
            'line-height': '0px',
            'text-align': 'left'
        },
        'mjx-chtml.MJX-DISPLAY': {
            display: 'block',
            margin: '1em 0',
            'text-align': 'center'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        super.toCHTML(parent);
        if (this.node.attributes.get('display') === 'block') {
            this.chtml.setAttribute('display', 'true');
            parent.classList.add('MJX-DISPLAY');
        }
    }

}
