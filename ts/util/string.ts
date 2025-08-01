/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  Implements some string utility functions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/**
 * Sort strings by length
 *
 * @param {string} a  First string to be compared
 * @param {string} b  Second string to be compared
 * @returns {number}  -1 id a < b, 0 of a === b, 1 if a > b
 */
export function sortLength(a: string, b: string): number {
  return a.length !== b.length
    ? b.length - a.length
    : a === b
      ? 0
      : a < b
        ? -1
        : 1;
}

/**
 * Quote a string for use in regular expressions
 *
 * @param {string} text  The text whose regex characters are to be quoted
 * @returns {string}     The quoted string
 */
export function quotePattern(text: string): string {
  return text.replace(/([\^$(){}.+*?\-|[\]:\\])/g, '\\$1');
}

/**
 * Convert a UTF-8 string to an array of unicode code points
 *
 * @param {string} text  The string to be turned into unicode positions
 * @returns {number[]}   Array of numbers representing the string's unicode character positions
 */
export function unicodeChars(text: string): number[] {
  return Array.from(text).map((c) => c.codePointAt(0));
}

/**
 * Convert an array of unicode code points to a string
 *
 * @param {number[]} data   The array of unicode code points
 * @returns {string}        The string consisting of the characters at those points
 */
export function unicodeString(data: number[]): string {
  return String.fromCodePoint(...data);
}

/**
 * Test if a value is a percentage
 *
 * @param {string} x    The string to test
 * @returns {boolean}   True if the string ends with a percent sign
 */
export function isPercent(x: string): boolean {
  return !!x.match(/%\s*$/);
}

/**
 * Split a space-separated string of values
 *
 * @param {string} x    The string to be split
 * @returns {string[]}  The list of white-space-separated "words" in the string
 */
export function split(x: string): string[] {
  return x.trim().split(/\s+/);
}

/**
 * Replace \U{...} with the specified unicode character and \\ with \
 *
 * @param {string} text   The string to be scanned for \U{...} and \\
 * @returns {string}      The string with the unicode characters in place of \U{...}
 */
export function replaceUnicode(text: string): string {
  return text.replace(
    /\\U(?:([0-9A-Fa-f]{4})|\{\s*([0-9A-Fa-f]{1,6})\s*\})|\\./g,
    (m, h1, h2) =>
      m === '\\\\' ? '\\' : String.fromCodePoint(parseInt(h1 || h2, 16))
  );
}

/**
 * Turn a character into its numeric entity for HTML
 *
 * @param {string} c   The character to convert
 * @returns {string}   The entity string for the character
 */
export function toEntity(c: string): string {
  return `&#x${c.codePointAt(0).toString(16).toUpperCase()};`;
}
