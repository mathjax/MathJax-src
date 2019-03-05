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

import {MathItem, AbstractMathItem, STATE, newState} from '../../core/MathItem.js';
import {MathDocument, AbstractMathDocument} from '../../core/MathDocument.js';
import {Handler} from '../../core/Handler.js';
import {ComplexityMathDocument} from '../../a11y/complexity.js';
import {ExplorerMathDocument} from '../../a11y/explorer.js';
import {OptionList} from '../../util/Options.js';

import {Menu} from './Menu.js';

/*==========================================================================*/

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * Constructor for base document for MenuMathDocument
 */
export type A11yDocumentConstructor<N, T, D> = {
    OPTIONS: OptionList;
    new(...args: any[]): ComplexityMathDocument<N, T, D> & ExplorerMathDocument;
}

/*==========================================================================*/

/**
 * Add STATE value for menus being added (after TYPESET and before INSERTED)
 */
newState('CONTEXT_MENU', 170);

/**
 * The new function for MathItem that adds the context menu
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface MenuMathItem<N, T, D> extends MathItem<N, T, D> {

    /**
     * @param {MathDocument} document  The document where the menu is being added
     */
    addMenu(document: MathDocument<N, T, D>): void;
}

/**
 * The mixin for adding context menus to MathItems
 *
 * @param {B} BaseMathItem   The MathItem class to be extended
 * @return {MathMathItem}    The extended MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function MenuMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(
    BaseMathItem: B
): Constructor<MenuMathItem<N, T, D>> & B {

    return class extends BaseMathItem {

        /**
         * @param {MathDocument} document  The document where the menu is being added
         */
        public addMenu(document: MenuMathDocument<N, T, D>) {
            if (this.state() < STATE.CONTEXT_MENU) {
                document.menu.addMenu(this);
                this.state(STATE.CONTEXT_MENU);
            }
        }

        /**
         * @override
         */
        public rerender(document: MenuMathDocument<N, T, D>) {
            super.rerender(document);
            this.addMenu(document);
        }

    }
}

/*==========================================================================*/

/**
 * The properties needed in the MathDocument for context menus
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface MenuMathDocument<N, T, D> extends ComplexityMathDocument<N, T, D> {

    /**
     * The menu associated with this document
     */
    menu: Menu<N, T, D>;

    /**
     * Add context menus to the MathItems in the MathDocument
     *
     * @return {MathDocument}   The MathDocument (so calls can be chained)
     */
    addMenu(): MathDocument<N, T, D>;

}

/**
 * The mixin for adding context menus to MathDocuments
 *
 * @param {B} BaseMathDocument     The MathDocument class to be extended
 * @return {MenuMathDocument}      The extended MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function MenuMathDocumentMixin<N, T, D, B extends A11yDocumentConstructor<N, T, D>>(
    BaseDocument: B
): Constructor<MenuMathDocument<N, T, D>> & B {

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
        public menu: Menu<N, T, D>;

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
            this.options.MathItem =
                MenuMathItemMixin<N, T, D, Constructor<AbstractMathItem<N, T, D>>>(this.options.MathItem);
        }

        /**
         * Add context menus to the MathItems in the MathDocument
         *
         * @return {MathDocument}   The MathDocument (so calls can be chained)
         */
        public addMenu() {
            if (!this.processed.isSet('context-menu')) {
                for (const math of this.math) {
                    (math as MenuMathItem<N, T, D>).addMenu(this);
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
export function MenuHandler<N, T, D>(handler: Handler<N, T, D>) {
    handler.documentClass =
        MenuMathDocumentMixin<N, T, D, A11yDocumentConstructor<N, T, D>>(handler.documentClass as any);
    return handler;
}
