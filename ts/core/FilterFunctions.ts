/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file  Types for working with Filter functions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathDocument } from './MathDocument.js';
import { MathItem } from './MathItem.js';
import { DOM_TYPES } from '../types/Types.js';
import { FunctionList } from '../util/FunctionList.js';

/**
 * Data passed to a filter
 */
export type FilterData<U, DOM extends DOM_TYPES> = {
  math: MathItem<DOM>;
  document: MathDocument<DOM>;
  data: U;
};

/**
 * A fulter function itself
 */
export type FilterFunction<T, D extends DOM_TYPES> = (
  arg: FilterData<T, D>
) => boolean | void;

/**
 * A filter function or one with a priority
 */
export type FilterFunctionDef<T, D extends DOM_TYPES> =
  FilterFunction<T, D> | [FilterFunction<T, D>, number];

/**
 * A list of filter function definitions
 */
export type FilterFunctionList<T, D extends DOM_TYPES> = FilterFunctionDef<
  T,
  D
>[];

/**
 * A FunctionList of filter functions
 */
export type FilterFunctions<T, D extends DOM_TYPES> = FunctionList<
  FilterFunction<T, D>
>;
