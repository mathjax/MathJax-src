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
import { DOM_TYPES, N, T, D } from '../types/Types.js';
import { FunctionList } from '../util/FunctionList.js';

/**
 * Types for filter functions
 */
export type FilterData<U, DOM extends DOM_TYPES> = {
  math: MathItem<N<DOM>, T<DOM>, D<DOM>>;
  document: MathDocument<N<DOM>, T<DOM>, D<DOM>>;
  data: U;
};
export type FilterFunction<T, D extends DOM_TYPES> = (
  arg: FilterData<T, D>
) => boolean | void;
export type FilterFunctionDef<T, D extends DOM_TYPES> =
  FilterFunction<T, D> | [FilterFunction<T, D>, number];
export type FilterFunctionList<T, D extends DOM_TYPES> = FilterFunctionDef<
  T,
  D
>[];
export type FilterFunctions<T, D extends DOM_TYPES> = FunctionList<
  FilterFunction<T, D>
>;
