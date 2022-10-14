/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview  Implements a subclass of ContextMenu specific to MathJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathItem} from '../../core/MathItem.js';

import {ContextMenu} from 'mj-context-menu/js/context_menu.js';
import {SubMenu} from 'mj-context-menu/js/sub_menu.js';
import {Submenu} from 'mj-context-menu/js/item_submenu.js';
import {Menu} from 'mj-context-menu/js/menu.js';
import {Item} from 'mj-context-menu/js/item.js';

/*==========================================================================*/

/**
 * The subclass of ContextMenu that handles the needs of the MathJax
 *   contextual menu (in particular, tying it to a MathItem).
 */
export class MJContextMenu extends ContextMenu {

  /**
   * Static map to hold methods for re-computing dynamic submenus.
   * @type {Map<string, (menu: MJContextMenu, sub: Submenu)}
   */
  public static DynamicSubmenus: Map<string,
  (menu: MJContextMenu, sub: Submenu) =>
    SubMenu> = new Map();

  /**
   * The MathItem that has posted the menu
   */
  public mathItem: MathItem<HTMLElement, Text, Document> = null;

  /*======================================================================*/

  /**
   * Before posting the menu, set the name for the ShowAs and CopyToClipboard menus,
   *   enable/disable the semantics check item, and get the annotations for the MathItem
   *
   * @override
   */
  public post(x?: any, y?: number) {
    if (this.mathItem) {
      if (y !== undefined) {
        // FIXME:  handle error output jax
        const input = this.mathItem.inputJax.name;
        const original = this.findID('Show', 'Original');
        original.content = (input === 'MathML' ? 'Original MathML' : input + ' Commands');
        const clipboard = this.findID('Copy', 'Original');
        clipboard.content = original.content;
        const semantics = this.findID('Settings', 'semantics');
        input === 'MathML' ? semantics.disable() : semantics.enable();
        // this.getAnnotationMenu();
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
    super.unpost();
    this.mathItem = null;
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
      if (menu) {
        item = menu.find(name);
        menu = (item instanceof Submenu ? item.submenu : null);
      } else {
        item = null;
      }
    }
    return item;
  }

  /*======================================================================*/

  /**
   * Renews the dynamic submenus.
   */
  public dynamicSubmenus() {
    for (const [id, method] of MJContextMenu.DynamicSubmenus) {
      console.log(id);
      const menu = this.find(id) as Submenu;
      if (!menu) continue;
      const sub = method(this, menu);
      menu.submenu = sub;
      if (sub.items.length) {
        menu.enable();
      } else {
        menu.disable();
      }
    }
  }

}
