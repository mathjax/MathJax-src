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
 * @fileoverview  Implements functions for handling option lists
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */


/*****************************************************************/
/**
 *  Check if an object is an object literal (as opposed to an instance of a class)
 */

const OBJECT = {}.constructor;
function isObject(obj: any) {
    return typeof obj === 'object' && obj !== null && obj.constructor === OBJECT;
}

/*****************************************************************/
/**
 * Generic list of options
 */
export type OptionList = {[name: string]: any};

/*****************************************************************/
/**
 *  Used to append an array to an array in default options
 *  E.g., an option of the form
 *
 *    {
 *      name: {APPEND: [1, 2, 3]}
 *    }
 *
 *  where 'name' is an array in the default options would end up with name having its
 *  original value with 1, 2, and 3 appended.
 */
export const APPEND = Symbol('Append to option array');


/*****************************************************************/
/**
 *  Make sure an option is an Array
 */
export function makeArray(x: any): any[] {
    return Array.isArray(x) ? x : [x];
}

/*****************************************************************/
/**
 * Get all keys and symbols from an object
 *
 * @param {Optionlist} def        The object whose keys are to be returned
 * @return {(string | symbol)[]}  The list of keys for the object
 */
export function keys(def: OptionList) {
    if (!def) {
        return [];
    }
    return (Object.keys(def) as (string | symbol)[]).concat(Object.getOwnPropertySymbols(def));
}

/*****************************************************************/
/**
 * Make a deep copy of an object
 *
 * @param {OptionList} def  The object to be copied
 * @return {OptionList}     The copy of the object
 */
export function copy(def: OptionList): OptionList {
    let props: OptionList = {};
    for (const key of keys(def)) {
        let prop = Object.getOwnPropertyDescriptor(def, key);
        let value = prop.value;
        if (Array.isArray(value)) {
            prop.value = insert([], value, false);
        } else if (isObject(value)) {
            prop.value = copy(value);
        }
        if (prop.enumerable) {
            props[key] = prop;
        }
    }
    return Object.defineProperties({}, props);
}

/*****************************************************************/
/**
 * Insert one object into another (with optional warnings about
 * keys that aren't in the original)
 *
 * @param {OptionList} dst  The option list to merge into
 * @param {OptionList} src  The options to be merged
 * @param {boolean} warn    True if a warning should be issued for a src option that isn't already in dst
 * @return {OptionList}     The modified destination option list (dst)
 */
export function insert(dst: OptionList, src: OptionList, warn: boolean = true) {
    for (let key of keys(src)) {
        if (warn && dst[key] === undefined) {
            if (typeof key === 'symbol') {
                key = key.toString();
            }
            throw new Error('Invalid option "' + key + '" (no default value).');
        }
        let sval = src[key], dval = dst[key];
        if (isObject(sval) && dval !== null &&
            (typeof dval === 'object' || typeof dval === 'function')) {
            if (Array.isArray(dval) && Array.isArray(sval[APPEND]) && keys(sval).length === 1) {
                dval.push(...sval[APPEND]);
            } else {
                insert(dval, sval, warn);
            }
        } else if (Array.isArray(sval)) {
            dst[key] = [];
            insert(dst[key], sval, false);
        } else if (isObject(sval)) {
            dst[key] = copy(sval);
        } else {
            dst[key] = sval;
        }
    }
    return dst;
}

/*****************************************************************/
/**
 * Merge options without warnings (so we can add new default values into an
 * existing default list)
 *
 * @param {OptionList} options  The option list to be merged into
 * @param {OptionList[]} defs   The option lists to merge into the first one
 * @return {OptionList}         The modified options list
 */
export function defaultOptions(options: OptionList, ...defs: OptionList[]) {
    defs.forEach(def => insert(options, def, false));
    return options;
}

/*****************************************************************/
/**
 * Merge options with warnings about undefined ones (so we can merge
 * user options into the default list)
 *
 * @param {OptionList} options  The option list to be merged into
 * @param {OptionList[]} defs   The option lists to merge into the first one
 * @return {OptionList}         The modified options list
 */
export function userOptions(options: OptionList, ...defs: OptionList[]) {
    defs.forEach(def => insert(options, def, true));
    return options;
}

/*****************************************************************/
/**
 * Select a subset of options by key name
 *
 * @param {OptionList} options  The option list from which option values will be taken
 * @param {string[]} keys       The names of the options to extract
 * @return {OptionList}         The option list consisting of only the ones whose keys were given
 */
export function selectOptions(options: OptionList, ...keys: string[]) {
    let subset: OptionList = {};
    for (const key of keys) {
        if (options.hasOwnProperty(key)) {
            subset[key] = options[key];
        }
    }
    return subset;
}

/*****************************************************************/
/**
 * Select a subset of options by keys from an object
 *
 * @param {OptionList} options  The option list from which the option values will be taken
 * @param {OptionList} object   The option list whose keys will be used to select the options
 * @return {OptionList}         The option list consisting of the option values from the first
 *                               list whose keys are those from the second list.
 */
export function selectOptionsFromKeys(options: OptionList, object: OptionList) {
    return selectOptions(options, ...Object.keys(object));
}

/*****************************************************************/
/**
 *  Separate options into sets: the ones having the same keys
 *  as the second object, the third object, etc, and the ones that don't.
 *  (Used to separate an option list into the options needed for several
 *   subobjects.)
 *
 * @param {OptionList} options    The option list to be split into parts
 * @param {OptionList[]} objects  The list of option lists whose keys are used to break up
 *                                 the original options into separate pieces.
 * @return {OptionList[]}         The option lists taken from the original based on the
 *                                 keys of the other objects.  The first one in the list
 *                                 consists of the values not appearing in any of the others
 *                                 (i.e., whose keys were not in any of the others).
 */
export function separateOptions(options: OptionList, ...objects: OptionList[]) {
    let results: OptionList[] = [];
    for (const object of objects) {
        let exists: OptionList = {}, missing: OptionList = {};
        for (const key of Object.keys(options || {})) {
            (object[key] === undefined ? missing : exists)[key] = options[key];
        }
        results.push(exists);
        options = missing;
    }
    results.unshift(options);
    return results;
}
