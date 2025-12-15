/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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
 * @file  Implements a subclass of ContextMenu specific to MathJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { MathItem } from '../../core/MathItem.js';
import { OptionList } from '../../util/Options.js';
import { JaxList } from './Menu.js';
import { ExplorerMathItem } from '../../a11y/explorer.js';

import {
  ContextMenu,
  SubMenu,
  Submenu,
  Menu,
  Item,
} from './mj-context-menu.js';

export type SubmenuCallback = (sub: SubMenu) => void;

export type DynamicSubmenu = (
  menu: MJContextMenu,
  sub: Submenu,
  callback: SubmenuCallback
) => void;

/*==========================================================================*/

/**
 * The subclass of ContextMenu that handles the needs of the MathJax
 *   contextual menu (in particular, tying it to a MathItem).
 */
export class MJContextMenu extends ContextMenu {
  /**
   * Static map to hold methods for re-computing dynamic submenus.
   *
   * @type {Map<string, [DynamicSubmenu, string]>}
   */
  public static DynamicSubmenus: Map<string, [DynamicSubmenu, string]> =
    new Map();

  /**
   * The MathItem that has posted the menu
   */
  public mathItem: MathItem<HTMLElement, Text, Document> = null;

  /**
   * Records the mathItem's nofocus value when a SelectInfo dialog is opened
   */
  public nofocus: boolean = false;

  /**
   * The document options
   */
  public settings: OptionList;

  /**
   * The error message for the current MathItem
   */
  public errorMsg: string = '';

  /**
   * The jax object from the parent menu item
   */
  protected jax: JaxList;

  /*======================================================================*/

  /**
   * Before posting the menu, set the name for the ShowAs and CopyToClipboard menus,
   *   enable/disable the semantics check item, and set the dynamic submenus.
   *
   * @override
   */
  public post(x?: any, y?: number) {
    if (this.mathItem) {
      const speech = (this.mathItem as ExplorerMathItem)?.explorers?.speech;
      if (speech?.active) {
        speech.restarted = speech.semanticFocus();
      }
      if (y !== undefined) {
        this.getOriginalMenu();
        this.getSemanticsMenu();
        this.getSpeechMenu();
        this.getBrailleMenu();
        this.getSvgMenu();
        this.getErrorMessage();
        this.dynamicSubmenus();
      }
      super.post(x, y);
    }
  }

  /**
   * Clear the stored MathItem when the menu is removed
   *
   * @override
   */
  public unpost() {
    if ((this as any).posted) {
      super.unpost();
    }
    if (this.mathItem) {
      this.mathItem.outputData.nofocus = this.nofocus;
    }
    this.mathItem = null;
    this.nofocus = false;
  }

  /*======================================================================*/

  /**
   * Find an item in the menu (recursively descending into submenus, if needed)
   *
   * @param {string[]} names   The menu IDs to look for
   * @returns {Item}         The menu item (or null if not found)
   */
  public findID(...names: string[]): Item {
    let menu = this as Menu;
    let item = null as Item;
    for (const name of names) {
      if (!menu) return null;
      for (item of menu.items) {
        if (item.id === name) {
          menu = item instanceof Submenu ? item.submenu : null;
          break;
        }
        menu = item = null;
      }
    }
    return item;
  }

  /*======================================================================*/

  /**
   * @param {JaxList} jax   The jax being maintained by the parent Menu item
   */
  public setJax(jax: JaxList) {
    this.jax = jax;
  }

  /*======================================================================*/

  /**
   * Set up original-form menu
   */
  protected getOriginalMenu() {
    const input = this.mathItem.inputJax.name;
    const original = this.findID('Show', 'Original');
    original.content =
      input === 'MathML' ? 'Original MathML' : input + ' Commands';
    const clipboard = this.findID('Copy', 'Original');
    clipboard.content = original.content;
  }

  /**
   * Enable/disable the semantics settings item
   */
  protected getSemanticsMenu() {
    const semantics = this.findID('Settings', 'MathmlIncludes', 'semantics');
    this.mathItem.inputJax.name === 'MathML'
      ? semantics.disable()
      : semantics.enable();
  }

  /**
   * Enable/disable the speech menus
   */
  protected getSpeechMenu() {
    const speech = this.mathItem.outputData.speech;
    this.findID('Show', 'Speech')[speech ? 'enable' : 'disable']();
    this.findID('Copy', 'Speech')[speech ? 'enable' : 'disable']();
  }

  /**
   * Enable/disable the Braille menus
   */
  protected getBrailleMenu() {
    const braille = this.mathItem.outputData.braille;
    this.findID('Show', 'Braille')[braille ? 'enable' : 'disable']();
    this.findID('Copy', 'Braille')[braille ? 'enable' : 'disable']();
  }

  /**
   * Enable/disable the svg menus
   */
  protected getSvgMenu() {
    const svg = this.jax.SVG;
    this.findID('Show', 'SVG')[svg ? 'enable' : 'disable']();
    this.findID('Copy', 'SVG')[svg ? 'enable' : 'disable']();
  }

  /**
   * Get any error message and enable/disable the menu items for it
   */
  protected getErrorMessage() {
    const children = this.mathItem.root.childNodes[0].childNodes;
    let disable = true;
    this.errorMsg = '';
    if (children.length === 1 && children[0].isKind('merror')) {
      const attributes = children[0].attributes;
      this.errorMsg = (attributes.get('data-mjx-error') ||
        attributes.get('data-mjx-message') ||
        '') as string;
      disable = !this.errorMsg;
    }
    this.findID('Show', 'Error')[disable ? 'disable' : 'enable']();
    this.findID('Copy', 'Error')[disable ? 'disable' : 'enable']();
  }

  /*======================================================================*/

  /**
   * Renews the dynamic submenus.
   */
  public dynamicSubmenus() {
    for (const [id, [method, option]] of MJContextMenu.DynamicSubmenus) {
      const menu = this.find(id) as Submenu;
      if (!menu) continue;
      method(this, menu, (sub: SubMenu) => {
        menu.submenu = sub;
        if (sub?.items?.length && (!option || this.settings[option])) {
          menu.enable();
        } else {
          menu.disable();
        }
      });
    }
  }
}
