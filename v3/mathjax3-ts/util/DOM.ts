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
 * @fileoverview  Gives access to document, window, DOMParser in both browsers
 *                and nodejs.  (Use the DOM object to replace jsdom with
 *                another implementation if desired.)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

/*
 * Declare the global variables used here
 */
declare var System: {nodeRequire: Function};
declare var document: Document;
declare var window: Window;
declare var require: Function;

/*
 * Typescript's Window doesn't seem to know about DOMParser
 */
interface DOMWindow extends Window {
    DOMParser: typeof DOMParser;
}

/*
 * The DOM object includes pointers to the document, window,
 *   and DOMParser objects.  In the browser, they are the
 *   browser's objects, and in nodejs, they are from jsdom.
 *   You can override these if you want to use an implementation
 *   other than jsdom.
 */
export const DOM: {
    document: Document,
    window: Window,
    DOMParser: typeof DOMParser
} = {
    document: null,
    window: null,
    DOMParser: null
};

try {

    //
    //  Browser version
    //
    document;  // errors if not in browser
    DOM.document = document;
    DOM.window =  window;
    DOM.DOMParser = (window as DOMWindow).DOMParser;

} catch (err) {

    //
    //  Node version
    //
    const jsdom = (typeof(System) === 'undefined' ? require : System.nodeRequire)('jsdom');
    const { JSDOM } = jsdom;

    DOM.window = new JSDOM().window;
    DOM.document = DOM.window.document;
    DOM.DOMParser = (DOM.window as DOMWindow).DOMParser;

}
