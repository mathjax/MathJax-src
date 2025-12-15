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
 * @file  Implements the InfoDialog class.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { DraggableDialog, DialogArgs } from './DraggableDialog.js';

export type InfoDialogArgs = DialogArgs;

/**
 * A generic info dialog box
 */
export class InfoDialog extends DraggableDialog {
  /**
   * Create and display a dialog with the given args
   *
   * @param {DialogArgs} args     The data describing the dialog
   * @returns {DraggableDialog}   The dialog instance
   */
  public static post(args: DialogArgs): DraggableDialog {
    const dialog = new this(args);
    dialog.attach();
    return dialog;
  }
}
