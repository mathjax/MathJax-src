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
 * @file  The MathJax object type construction utilities
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import type { ExtendedMetrics } from '../output/common.js';
import type { PackageConfig } from '../components/package.js';
import type { mathjax } from '../mathjax.js';

/**
 * The types for node, text, and document
 */
export type DOM_TYPES = {
  N: any;
  T: any;
  D: any;
};

/**
 * Extract types from DOM type
 */
export type N<DOM extends DOM_TYPES> = DOM['N'];
export type T<DOM extends DOM_TYPES> = DOM['T'];
export type D<DOM extends DOM_TYPES> = DOM['D'];

/**
 * A DOM_TYPES instance
 */
export type DOM<N = any, T = any, D = any> = { N: N; T: T; D: D };

/**
 * A constructor for a given type
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * An object key
 */
export type KEY = string | number | symbol;

/**
 * An empty configuration object
 */
// eslint-disable-next-line
export type EMPTY = {}; // Record<string, never>;

/**
 * A list with jax names as keys
 */
export type JAXLIST = { [jax: string]: true };

/**
 * A list with component names as keys
 */
export type COMPONENTLIST = { [name: string]: true };

/**
 * A component configuration object
 */
export type COMPONENT_DEF = {
  config?: object;
  properties?: object;
  input?: JAXLIST;
  output?: JAXLIST;
  component?: COMPONENTLIST;
};

/**
 * Combine "|" types into "&" types.
 */
/* prettier-ignore */
export type COMBINE<T> =
  (T extends any ? (x: T) => void : never) extends (x: infer I) => void ? I : never;

/**
 * Recursively makes all object keys optional
 */
/* prettier-ignore */
export type OPTIONAL<T> = {
  [t in keyof T]?:
    T[t] extends Array<any>
      ? T[t]
      : T[t] extends (...args: any) => any
        ? T[t]
        : T[t] extends object
          ? OPTIONAL<T[t]>
          : T[t];
};

/**
 * Recursively add `[+]` and `[-]` options for array configuration options
 */
/* prettier-ignore */
export type CONFIG_ARRAYS<T> = {
  [t in keyof T]?:
    T[t] extends Array<any>
    ? T[t] | { '[+]'?: T[t], '[-]'?: T[t] }
      : T[t] extends (...args: any) => any
        ? T[t]
        : T[t] extends object
          ? CONFIG_ARRAYS<T[t]>
          : T[t];
}

/**
 * The convert() option list
 */
export type CONVERT_OPTIONS = OPTIONAL<{
  format: string;
  display: boolean;
  end: number;
  em: number;
  ex: number;
  containerWidth: number;
  scale: number;
  family: string;
}>;

/**
 * Create input2output and input2outputPromise from jax names
 *
 * @template I   The input jax name
 * @template O   The output jax name
 * @template D   The DOM node types to use
 */
/* prettier-ignore */
export type CONVERT<I extends KEY, O extends KEY, D extends DOM_TYPES> =
  I extends string
    ? O extends string
      ? { [i in I as `${i}2${O}`]?: (math: string, options?: CONVERT_OPTIONS) => N<D> } &
        { [i in I as `${i}2${O}Promise`]?: (math: string, options?: CONVERT_OPTIONS) => Promise<N<D>> }
      : EMPTY
    : EMPTY;

/**
 * Create all input2output and input2outputPromise methods from the jax lists
 *
 * @template I   Object containing the names of the input jax as its keys
 * @template O   Object containing the names of the output jax as its keys
 * @template D   The DOM node types to use
 */
/* prettier-ignore */
export type CONVERTJAX<I, O, D extends DOM_TYPES> =
  I extends JAXLIST
    ? O extends JAXLIST
      ? COMBINE<CONVERT<keyof I, keyof O, D>> &
        {
          typeset?: (elements?: N<D>[]) => void;
          typesetPromise?: (elements?: N<D>[]) => Promise<void>;
          typesetClear?: (elements?: N<D>[]) => void;
        }
      : EMPTY
    : EMPTY;

/**
 * Add the Loader types for a list of component names (as keys of an object)
 *
 * @template T   Object whose keys are the names of the components to add to the loader configuration
 */
/* prettier-ignore */
export type LOADER<T> =
  T extends COMPONENTLIST
    ? {
        loader: {
          [component in keyof T]: PackageConfig;
        };
      }
    : EMPTY;

/**
 * Define document options
 *
 * @template C   The options to define
 */
export type DOC_OPTIONS<C> = {
  config: {
    options: C;
  };
};

/**
 * Define the startup document type
 *
 * @template T   The document type to use
 */
export type DOC_TYPE<T> = {
  properties: {
    startup: {
      document: T;
    };
  };
};

/**
 * Configuration for an empty component.
 *
 * @template N   The name of the component
 */
export type EMPTY_COMPONENT<N extends string> = {
  component: { [name in N]: true };
};

/**
 * Configuration for a TeX package.
 *
 * @template N   The name of the package
 * @template C   The package options
 */
export type TEX_PACKAGE<N extends string, C> = {
  component: { [name in N as `[tex]/${name}`]: true };
  config: { tex: C };
};

/**
 * Configuration for TeX (not from package)
 *
 * @template C   The package options
 */
export type TEX_CONFIG<C> = {
  config: { tex: C };
};

/**
 * Configuration for a MathML package.
 *
 * @template N   The name of the package
 * @template C   The package options
 */
export type MML_PACKAGE<N extends string, C> = {
  component: { [name in N as `[mml]/${name}`]: true };
  config: { mml: C };
};

/**
 * Configuration for an InputJax.
 *
 * @template N   The name of the input jax
 * @template C   The jax options
 * @template M   The name for the component if not the same as the jax
 */
/* prettier-ignore */
export type INPUTJAX<N extends string, C, M extends string = N> = {
  component: { [name in M as `input/${name}`]: true };
  config: { [name in N]: C };
  input: { [name in N]: true };
  properties:
  { [name in N as `${name}2mml`]: (math: string, options?: CONVERT_OPTIONS & { end?: number}) => string } &
    { [name in N as `${name}2mmlPromise`]: (math: string) => Promise<string> } &
    { [name in N as `${name}Reset`]: (...args: any[]) => void };
};

/**
 * Configuration for an OutputJax.
 *
 * @template J   The name of the output jax
 * @template C   The jax options
 */
/* prettier-ignore */
export type OUTPUTJAX<J extends string, C, DOM extends DOM_TYPES> = {
  component: { [name in J as `output/${name}`]: true };
  config: { [name in J]: C } & { output: C };
  output: { [name in J]: true };
  properties:
    { [name in J as `${name}Stylesheet`]: () => N<DOM> } &
    { getMetricsFor: (node: N<DOM>, display: boolean) => ExtendedMetrics };
};

/**
 * Create the `config` property from the definition's `config` and `component` properties
 */
/* prettier-ignore */
export type CONFIG<T extends COMPONENT_DEF> =
  OPTIONAL<T['config'] & LOADER<T['component']>>;

/**
 * Add types for the MathJax.startup.mathjax.document function so its
 * options are checked, and its output reflects the type of the
 * document created by the loaded components.
 *
 * @template T   The typ eobject to modify
 */
/* prettier-ignore */
export type ADD_MATHJAX<T> =
  T extends { config?: {options?: any}; startup: { document: any } }
    ? {
        startup: {
          mathjax: Omit<typeof mathjax, 'document'> &
          {
            document: (doc: any, options: Partial<T['config']['options']>) => T['startup']['document'];
          };
        } & Omit<T['startup'], 'mathjax'>;
      } & Omit<T, 'startup'>
    : T;

/**
 * The type for the MathJax object based on a collection of component definitions.
 * This is for both configuration and after Mathjax is loaded.
 *
 * @template T   The definitions of the components to include (as DEF1 & ... & DEFn)
 * @template D   The DOM node types to use
 */
/* prettier-ignore */
export type TYPES2MJX<T extends COMPONENT_DEF, D extends DOM_TYPES> =
  ADD_MATHJAX<{ version?: string, _?: any } &
  OPTIONAL<T['properties'] & CONFIG_ARRAYS<CONFIG<T>>> &
  { config?: CONFIG<T> } &
  CONVERTJAX<T['input'], T['output'], D>>;

/**
 * The type for the completed MathJax object (after MathJax is loaded).
 *
 * @template T   The definitions of the components to include (as DEF1 & ... & DEFn)
 * @template D   The DOM node types to use
 */
/* prettier-ignore */
export type TYPES2MJX_OBJECT<T extends COMPONENT_DEF, D extends DOM_TYPES> =
  ADD_MATHJAX<{ version: string, _: any } &
  T['properties'] &
  { config: CONFIG_ARRAYS<CONFIG<T>> } &
  CONVERTJAX<T['input'], T['output'], D>>;

/**
 * The type for the MathJax object as a config object (before loading MathJax).
 *
 * @template T   The definitions of the components to include (as DEF1 & ... & DEFn)
 */
export type TYPES2MJX_CONFIG<T extends COMPONENT_DEF> = CONFIG_ARRAYS<
  CONFIG<T>
>;
