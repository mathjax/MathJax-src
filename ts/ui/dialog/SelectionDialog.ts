/*************************************************************
 *
 *  Copyright (c) 2025 The MathJax Consortium
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
 * @file Implements a selection info dialog box
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { InfoDialog } from './InfoDialog.js';
import { MJContextMenu } from '../menu/MJContextMenu.js';
import {
  SelectionOrder,
  SelectionGrid,
  SelectionBox,
} from '#menu/selection_box.js';
export { SelectionOrder, SelectionGrid } from '#menu/selection_box.js';

export type selection = { title: string; values: string[]; variable: string };

/**
 * The Selection dialog class
 */
export class SelectionDialog extends SelectionBox {
  /**
   * @override
   */
  constructor(
    title: string,
    signature: string,
    selections: selection[],
    order: SelectionOrder,
    grid: SelectionGrid,
    menu: MJContextMenu
  ) {
    super(title, signature, order, grid);
    this.attachMenu(menu);
    const factory = menu.factory;
    this.selections = selections.map((x) =>
      factory.get('selectionMenu')(factory, x, this)
    );
  }

  /**
   * @override
   */
  public post() {
    //
    // Get the active output jax (to get its adaptor)
    //
    const jax = Array.from(Object.values((this.menu as any).jax)).filter(
      (j) => !!j
    )[0] as any;
    //
    // Use an InfoDialog rather than the mj-context-menu Info object
    //
    const dialog = new InfoDialog({
      title: (this as any).title, // should be protected rather than private
      message: '',
      adaptor: jax.adaptor,
      styles: {
        'mjx-dialog > div': {
          padding: 0,
        },
      },
    });
    dialog.attach();
    //
    // Use the SelectionBox display function
    //
    this.contentDiv = (dialog as any).content as HTMLElement;
    this.display();
  }

  /**
   * @override
   */
  public display() {
    //
    // This is the same as teh SelectionBox() function, but without the super.display() call.
    //
    const THIS = this as any; // the methods below are private, so work around that.
    THIS.order();
    if (!this.selections.length) {
      return;
    }
    const outerDivs: HTMLElement[] = [];
    let maxWidth = 0;
    let balancedColumn: number[] = [];
    const chunks = THIS.getChunkSize(this.selections.length);
    for (let i = 0; i < this.selections.length; i += chunks) {
      const sels = this.selections.slice(i, i + chunks);
      const [div, width, height, column] = THIS.rowDiv(sels);
      outerDivs.push(div);
      maxWidth = Math.max(maxWidth, width);
      sels.forEach((sel) => (sel.html.style.height = height + 'px'));
      balancedColumn = THIS.combineColumn(balancedColumn, column);
    }
    if (THIS._balanced) {
      THIS.balanceColumn(outerDivs, balancedColumn);
      maxWidth = balancedColumn.reduce((x, y) => x + y - 2, 20); // remove 2px for borders
    }
    outerDivs.forEach((div) => (div.style.width = maxWidth + 'px'));
  }
}
