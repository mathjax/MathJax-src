import {MathJax} from '../../mathjax.js';

import {MathItem, AbstractMathItem} from '../../core/MathItem.js';
import {MathDocument, AbstractMathDocument} from '../../core/MathDocument.js';
import {Handler} from '../../core/Handler.js';
import {ComplexityMathDocument} from '../../a11y/complexity.js';

import {Menu} from './Menu.js';

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/*==========================================================================*/

/**
 * The funtions added to MathItem for adding the context menu
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

        public addMenu(document: MenuMathDocument<N, T, D>) {
            document.menu.addMenu(this);
        }

    }
}

/*==========================================================================*/

/**
 * The funtions added to MathDocument for context menus
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

    /**
     * Rerender the math on the page using the rerender option
     *
     * @return {MathDocument}   The MathDocument (so calls can be chained)
     */
    rerender(): MathDocument<N, T, D>;

    /**
     * The default rerender function
     *
     * @return {MathDocument}   The MathDocument (so calls can be chained)
     */
    defaultRerender(): MathDocument<N, T, D>;
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
export function MenuMathDocumentMixin<N, T, D, B extends Constructor<ComplexityMathDocument<N, T, D>>>(
    BaseDocument: B
): Constructor<MenuMathDocument<N, T, D>> & B {

    return class extends BaseDocument {

        public static OPTIONS = {
            ...(BaseDocument as any).OPTIONS,
            rerender: (document: MenuMathDocument<any, any, any>) => document.rerender(),
            MenuClass: Menu,
            menuOptions: Menu.OPTIONS
        }

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

        public addMenu() {
            if (!this.processed.isSet('context-menu')) {
                for (const math of this.math) {
                    (math as MenuMathItem<N, T, D>).addMenu(this);
                }
                this.processed.set('context-menu');
            }
            return this;
        }

        public state(state: number, restore: boolean = false) {
            super.state(state, restore);
            if (state <= AbstractMathDocument.STATE.TYPESET) {
                this.processed.clear('context-menu');
            }
            return this;
        }

        public updateDocument() {
            super.updateDocument();
            (this.menu.menu.getStore() as any).sort();
            return this;
        }

        public rerender() {
            this.options.rerender(this);
            return this;
        }

        public defaultRerender() {
            this.state(AbstractMathDocument.STATE.COMPILED);
            this.typeset();
            this.addMenu();
            this.updateDocument();
            return this;
        }

        public complexity() {
            if (this.menu.settings.collapsible) {
                super.complexity();
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
        MenuMathDocumentMixin<N, T, D, Constructor<ComplexityMathDocument<N, T, D>>>(handler.documentClass as any);
    return handler;
}
