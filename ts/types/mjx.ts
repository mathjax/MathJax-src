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
 * @file  Conversion of type lists to MathJax object types.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import type {
  DOM_TYPES,
  COMPONENT_DEF,
  COMBINE,
  TYPES2MJX,
  TYPES2MJX_OBJECT,
  TYPES2MJX_CONFIG,
} from './Types.js';
import { COMPONENTS } from './Components.js';

/**
 * A union of component names, array of names, or explicit component definitions.
 */
export type COMPONENT_LIST<D extends DOM_TYPES> =
  COMPONENT_DEF | keyof COMPONENTS<D> | (keyof COMPONENTS<D>)[];

/**
 * Map component names to their type defintions, leaving explicit definitions as they are.
 *
 * @template T   A union of compnent names and/or explicit definitions.
 * @template D   The DOM node types to use in the types that need them.
 */
/* prettier-ignore */
export type MJX_TYPES<T extends COMPONENT_LIST<D>, D extends DOM_TYPES> =
  T extends keyof COMPONENTS<D>
    ? MJX_TYPES<COMPONENTS<D>[T], D>
    : T;

/**
 * Map compent names or array of names or explicit definitions
 * to a combined definition object (the intersection of all the definitions).
 *
 * @template T   A union of compnent names and/or explicit definitions.
 * @template D   The DOM node types to use in the types that need them.
 */
/* prettier-ignore */
export type MJX_DEF<T extends COMPONENT_LIST<D>, D extends DOM_TYPES> =
  COMBINE<MJX_TYPES<T extends (keyof COMPONENTS<D>)[] ? T[number] : T, D>>;

/**
 * The type for the MathJax object based on a collection of component names and DOM element types.
 * This is for both configuration and after Mathjax is loaded.
 *
 * @template T   The union of component names, array of names, or definitions.
 * @template D   The DOM node types to use in the types that need them.
 */
/* prettier-ignore */
export type MJX<T extends COMPONENT_LIST<D>, D extends DOM_TYPES> =
  TYPES2MJX<MJX_DEF<T, D>, D>;

/**
 * The type for the completed MathJax object (after MathJax is loaded).
 *
 * @template T   The union of component names, array of names, or definitions.
 * @template D   The DOM node types to use in the types that need them.
 */
/* prettier-ignore */
export type MJX_OBJECT<T extends COMPONENT_LIST<D>, D extends DOM_TYPES> =
  TYPES2MJX_OBJECT<MJX_DEF<T, D>, D>;

/**
 * The type for the MathJax object as a config object (before loading MathJax).
 *
 * @template T   The union of component names, array of names, or definitions.
 * @template D   The DOM node types to use in the types that need them.
 */
/* prettier-ignore */
export type MJX_CONFIG<T extends COMPONENT_LIST<D>, D extends DOM_TYPES> =
  TYPES2MJX_CONFIG<MJX_DEF<T, D>>;
