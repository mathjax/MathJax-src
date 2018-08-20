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
 * @fileoverview  Implements the abstract class for the CommonOutputJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractOutputJax} from '../../core/OutputJax.js';
import {MathDocument} from '../../core/MathDocument.js';
import {MathItem} from '../../core/MathItem.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';

/**
 *  The CommonOutputJax class on which the CHTML and SVG jax are built
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template W  The Wrapper class
 */
export abstract class CommonOutputJax<N, T, D, W> extends AbstractOutputJax<N, T, D> {
    /**
     * The MathDocument for the math we find
     * and the MathItem currently being processed
     */
    public document: MathDocument<N, T, D>;
    public math: MathItem<N, T, D>;

    public font: any;
    public nodeMap: Map<MmlNode, W>;
}
