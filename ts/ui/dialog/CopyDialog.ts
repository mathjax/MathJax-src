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
 * @file  Implements the CopyDialog class (InfoDialog with copy button).
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { InfoDialog, InfoDialogArgs } from './InfoDialog.js';

/**
 * The args for a CopyDialog
 */
export type CopyDialogArgs = InfoDialogArgs & { code?: boolean };

/**
 * The CopyDialog subclass of InfoDialog
 */
export class CopyDialog extends InfoDialog {
  /**
   * @override
   */
  public static post(args: CopyDialogArgs) {
    return super.post(args);
  }

  /**
   * @override
   */
  protected html(args: CopyDialogArgs) {
    //
    // Add a copy-to-clipboard button
    //
    args.extraNodes ??= [];
    const copy = args.adaptor.node('input', {
      type: 'button',
      value: 'Copy to Clipboard',
      'data-drag': 'none',
    });
    copy.addEventListener('click', this.copyToClipboard.bind(this));
    args.extraNodes.push(copy);
    //
    // If this is a code dialog, format the source and set in a pre element
    //
    if (args.code) {
      args.message = '<pre>' + this.formatSource(args.message) + '</pre>';
    }
    return super.html(args);
  }

  /**
   * @param {string} text   The text to be displayed in the Info box
   * @returns {string}      The text with HTML specials being escaped
   */
  protected formatSource(text: string): string {
    return text
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
