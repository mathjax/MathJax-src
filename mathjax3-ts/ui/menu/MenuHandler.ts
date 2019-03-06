/*************************************************************
 *
 *  Copyright (c) 2019 The MathJax Consortium
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
 * @fileoverview  Mixin that adds a context-menu to MathJax output
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathJax} from '../../mathjax.js';

import {MathItem, STATE, newState} from '../../core/MathItem.js';
import {MathDocument, AbstractMathDocument} from '../../core/MathDocument.js';
import {HTMLDocument} from '../../handlers/html/HTMLDocument.js';
import {Handler} from '../../core/Handler.js';
import {ComplexityMathDocument, ComplexityMathItem} from '../../a11y/complexity.js';
import {ExplorerMathDocument, ExplorerMathItem} from '../../a11y/explorer.js';
import {OptionList} from '../../util/Options.js';

import {Menu} from './Menu.js';

/*==========================================================================*/

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * Constructor for base MathItem for MenuMathItem
 */
export type A11yMathItemConstructor = {
    new(...args: any[]): ComplexityMathItem<HTMLElement, Text, Document> & ExplorerMathItem;
}

/**
 * Constructor for base document for MenuMathDocument
 */
export type A11yDocumentConstructor = {
    OPTIONS: OptionList;
    new(...args: any[]): ComplexityMathDocument<HTMLElement, Text, Document> & ExplorerMathDocument;
}

/*==========================================================================*/

/**
 * Add STATE value for menus being added (after TYPESET and before INSERTED)
 */
newState('CONTEXT_MENU', 170);

/**
 * The new function for MathItem that adds the context menu
 */
export interface MenuMathItem extends MathItem<HTMLElement, Text, Document> {

    /**
     * @param {MathDocument} document  The document where the menu is being added
     */
    addMenu(document: MathDocument<HTMLElement, Text, Document>): void;
}

/**
 * The mixin for adding context menus to MathItems
 *
 * @param {B} BaseMathItem   The MathItem class to be extended
 * @return {MathMathItem}    The extended MathItem class
 *
 * @template B  The MathItem class to extend
 */
export function MenuMathItemMixin<B extends A11yMathItemConstructor>(
    BaseMathItem: B
): Constructor<MenuMathItem> & B {

    return class extends BaseMathItem {

        /**
         * @param {MathDocument} document  The document where the menu is being added
         */
        public addMenu(document: MenuMathDocument) {
            if (this.state() < STATE.CONTEXT_MENU) {
                document.menu.addMenu(this);
                this.state(STATE.CONTEXT_MENU);
            }
        }

        /**
         * @override
         */
        public rerender(document: MenuMathDocument, start: number = STATE.TYPESET, end: number = STATE.LAST) {
            const state = STATE.CONTEXT_MENU;
            if (start <= state && state <= end) {
                super.rerender(document, start, state);
                this.addMenu(document);
                super.rerender(document, state + 1, end);
            } else {
                super.rerender(document, start, end);
            }
        }

        /**
         * @override
         */
        public complexity(document: MenuMathDocument) {
            if (document.menu.settings.collapsible) {
                super.complexity(document);
            }
        }

        /**
         * @override
         */
        public explorable(document: MenuMathDocument) {
            if (document.menu.settings.explorer) {
                super.explorable(document as any);
            }
        }

    }
}

/*==========================================================================*/

/**
 * The properties needed in the MathDocument for context menus
 */
export interface MenuMathDocument extends ComplexityMathDocument<HTMLElement, Text, Document> {

    /**
     * The menu associated with this document
     */
    menu: Menu;

    /**
     * Add context menus to the MathItems in the MathDocument
     *
     * @return {MathDocument}   The MathDocument (so calls can be chained)
     */
    addMenu(): MenuMathDocument;

}

/**
 * The mixin for adding context menus to MathDocuments
 *
 * @param {B} BaseMathDocument     The MathDocument class to be extended
 * @return {MenuMathDocument}      The extended MathDocument class
 *
 * @template B  The MathDocument class to extend
 */
export function MenuMathDocumentMixin<B extends A11yDocumentConstructor>(
    BaseDocument: B
): Constructor<MenuMathDocument> & B {

    return class extends BaseDocument {

        /**
         * @override
         */
        public static OPTIONS = {
            ...BaseDocument.OPTIONS,
            MenuClass: Menu,
            menuOptions: Menu.OPTIONS
        }

        /**
         * The menu associated with this document
         */
        public menu: Menu;

        /**
         * Extend the MathItem class used for this MathDocument
         *
         * @override
         * @constructor
         */
        constructor(...args: any[]) {
            super(...args);
            this.menu = new this.options.MenuClass(this, this.options.menuOptions);
            const ProcessBits = (this.constructor as typeof AbstractMathDocument).ProcessBits;
            if (!ProcessBits.has('context-menu')) {
                ProcessBits.allocate('context-menu');
            }
            this.options.MathItem = MenuMathItemMixin<A11yMathItemConstructor>(this.options.MathItem);
        }

        /**
         * Add context menus to the MathItems in the MathDocument
         *
         * @return {MathDocument}   The MathDocument (so calls can be chained)
         */
        public addMenu() {
            if (!this.processed.isSet('context-menu')) {
                for (const math of this.math) {
                    (math as MenuMathItem).addMenu(this);
                }
                this.processed.set('context-menu');
            }
            return this;
        }

        /**
         * @override
         */
        public state(state: number, restore: boolean = false) {
            super.state(state, restore);
            if (state < STATE.CONTEXT_MENU) {
                this.processed.clear('context-menu');
            }
            return this;
        }

        /**
         * @override
         */
        public updateDocument() {
            super.updateDocument();
            (this.menu.menu.getStore() as any).sort();
            return this;
        }

        /**
         * @override
         */
        public complexity() {
            if (this.menu.settings.collapsible) {
                super.complexity();
            }
            return this;
        }

        /**
         * @override
         */
        public explorable() {
            if (this.menu.settings.explorer) {
                super.explorable();
            }
            return this;
        }

    };

}

/*==========================================================================*/

/**
 * Add context-menu support to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chaining extensions)
 */
export function MenuHandler(handler: Handler<HTMLElement, Text, Document>) {
    handler.documentClass = MenuMathDocumentMixin<A11yDocumentConstructor>(handler.documentClass as any);
    return handler;
}
