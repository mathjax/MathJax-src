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
 * @fileoverview  Implements some string utility functions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */


/*
 *  Sort strings by length
 */
export function sortLength(a: string, b: string) {
    return a.length !== b.length ? b.length - a.length : a === b ? 0 : a < b ? -1 : 1;
}

/*
 *  Quote a string for use in regular expressions
 */
export function quotePattern(text: string) {
    return text.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, '\\$1');
}

