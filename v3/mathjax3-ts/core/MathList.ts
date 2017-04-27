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
 * @fileoverview  Implements the interface and abstract class for MathList objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {LinkedList, LinkedListClass} from '../util/LinkedList.js';
import {MathItem, AbstractMathItem} from './MathItem.js';

/*****************************************************************/
/*
 *  The MathList interface (extends LinkedList<MathItem>)
 */

export interface MathList extends LinkedList<MathItem> {
    /*
     * Test if one math item is before the other in the document (a < b)
     *
     * @param{MathItem} a   The first MathItem
     * @param{MathItem} b   The second MathItem
     */
    isBefore(a: MathItem, b: MathItem): boolean;
}

/*****************************************************************/
/*
 *  The MathList class interface (extends LinkedListClass<MathItem>)
 */

export interface MathListClass extends LinkedListClass<MathItem> {
    new(...args: MathItem[]): MathList;
}

/*****************************************************************/
/*
 *  The MathList abstract class (extends LinkedList<MathItem>)
 */

export abstract class AbstractMathList extends LinkedList<MathItem> {

    /*
     * @override
     */
    public isBefore(a: MathItem, b: MathItem) {
        return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
    }

}

