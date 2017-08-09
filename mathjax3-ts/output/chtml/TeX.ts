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
 * @fileoverview  The TeX font parameters as an object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

export const TexFontParams = {
    x_height:         .442,
    quad:             1,
    num1:             .676508,
    num2:             .393732,
    num3:             .44373,
    denom1:           .685951,
    denom2:           .344841,
    sup1:             .412892,
    sup2:             .362892,
    sup3:             .288888,
    sub1:             .15,
    sub2:             .247217,
    sup_drop:         .386108,
    sub_drop:         .05,
    delim1:          2.39,
    delim2:          1.0,
    axis_height:      .25,
    rule_thickness:   .06,
    big_op_spacing1:  .111111,
    big_op_spacing2:  .166666,
    big_op_spacing3:  .2,
    big_op_spacing4:  .45, // .6,  // better spacing for under arrows and braces
    big_op_spacing5:  .1,

    surd_height:      .075,

    scriptspace:         .05,
    nulldelimiterspace:  .12,
    delimiterfactor:     901,
    delimitershortfall:   .3,

    min_rule_thickness:  1.25     // in pixels
};
