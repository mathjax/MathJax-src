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
 * @file  Implements a draggable dialog class.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { StyleJson, StyleJsonSheet } from '../../util/StyleJson.js';
import { context } from '../../util/context.js';

export type ADAPTOR = DOMAdaptor<HTMLElement, Text, Document>;

export type Action = (
  dialog: DraggableDialog,
  event: MouseEvent
) => void | number[];
export type ActionList = { [action: string]: Action };
export type ActionMap = { [type: string]: ActionList };

/**
 * The arguments that control the dialog contents
 */
export type DialogArgs = {
  title?: string; //             // the dialog title HTML
  message: string; //            // the dialog message HTML
  adaptor: ADAPTOR; //           // the adaptor to use to create the dialog
  node?: HTMLElement; //         // the node to focus when the dialog closes, if any
  styles?: StyleJson; //         // extra styles to use for the dialog
  extraNodes?: HTMLElement[]; // // extra HTML nodes to put at the bottom of the dialog
  className?: string; //         // optional class to apply to the dialog
};

/**
 * Type of function that implements a key press action
 */
export type keyMapping = (
  dialog: DraggableDialog,
  event: KeyboardEvent
) => void;

/**
 * True if we can rely on an HTML dialog element.
 */
export const isDialog: boolean = !!context.window?.HTMLDialogElement;

/*========================================================================*/

/**
 * The draggable dialog class
 */
export class DraggableDialog {
  /**
   * The minimum width of the dialog
   */
  protected minW = 200;
  /**
   * The maximum width of the dialog
   */
  protected minH = 80;

  /**
   * The current x translation of the dialog
   */
  protected tx: number = 0;
  /**
   * The current y translation of the dialog
   */
  protected ty: number = 0;

  /**
   * The current mouse x position
   */
  protected x: number;
  /**
   * The current mouse y position
   */
  protected y: number;
  /**
   * The current dialog width
   */
  protected w: number;
  /**
   * The current dialog height
   */
  protected h: number;
  /**
   * True when the dialog is being dragged or sized
   */
  protected dragging: boolean = false;
  /**
   * The drag acction being taken (move, left, right, top, bottom, etc.)
   */
  protected action: string;

  /**
   * Elements where clicking doesn't cause dragging
   */
  protected noDrag: HTMLElement[];
  /**
   * The title element
   */
  protected title: HTMLElement;
  /**
   * The content div element
   */
  protected content: HTMLElement;

  /**
   * The node to focus when dialog closes
   */
  protected node: HTMLElement;
  /**
   * The background element when <dialog> is not available
   */
  protected background: HTMLElement;
  /**
   * The dialog element node
   */
  protected dialog: HTMLDialogElement;

  /**
   * Events to add when dragging and remove when drag completes
   */
  protected events = [
    ['mousemove', this.MouseMove.bind(this)],
    ['mouseup', this.MouseUp.bind(this)],
  ];

  /*
   * Key bindings for when dialog is open
   */
  protected static keyActions: Map<string, keyMapping> = new Map([
    ['Escape', (dialog, event) => dialog.escKey(event)],
    ['a', (dialog, event) => dialog.aKey(event)],
    ['m', (dialog, event) => dialog.mKey(event)],
    ['s', (dialog, event) => dialog.sKey(event)],
    ['ArrowRight', (dialog, event) => dialog.arrowKey(event, 'right')],
    ['ArrowLeft', (dialog, event) => dialog.arrowKey(event, 'left')],
    ['ArrowUp', (dialog, event) => dialog.arrowKey(event, 'up')],
    ['ArrowDown', (dialog, event) => dialog.arrowKey(event, 'down')],
  ]);

  /**
   * The style element ID for dialog styles
   */
  public static styleId: string = 'MJX-DIALOG-styles';
  /**
   * The class name to use for the dialog, if any
   */
  public static className: string = '';

  /**
   * An id incremented for each instance of a dialog
   */
  public static id: number = 0;

  /**
   * The default styles for all dialogs
   */
  public static styles: StyleJson = {
    //
    // For when dialog element is not available
    //
    'mjx-dialog-background': {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      'z-index': 1001,
    },

    //
    // The main dialog box and background
    //
    '.mjx-dialog': {
      'max-width': 'calc(min(60em, 90%))',
      'max-height': 'calc(min(50em, 85%))',
      border: '3px outset',
      'border-radius': '15px',
      color: 'black',
      'background-color': '#DDDDDD',
      'box-shadow': '0px 10px 20px #808080',
      padding: '4px 4px',
      cursor: 'grab',
      overflow: 'visible',
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      position: 'relative',
      top: '-4%',
    },
    '.mjx-dialog.mjx-moving': {
      cursor: 'grabbing',
    },
    '.mjx-dialog > input[type="button"]': {
      width: 'fit-content',
    },
    '.mjx-dialog > mjx-dialog-spacer': {
      display: 'block',
      height: '.75em',
      'flex-shrink': 0,
    },
    '.mjx-dialog::backdrop': {
      opacity: 0,
      cursor: 'default',
    },

    //
    // The contents of the dialog
    //
    'mjx-dialog': {
      all: 'initial',
      cursor: 'inherit',
      width: '100%',
      display: 'flex',
      'flex-direction': 'column',
      'flex-grow': 1,
      'flex-shrink': 1,
      overflow: 'hidden',
    },
    'mjx-dialog > mjx-title': {
      display: 'block',
      'text-align': 'center',
      margin: '.25em 1.75em',
      overflow: 'hidden',
      'white-space': 'nowrap',
      '-webkit-user-select': 'none',
      'user-select': 'none',
      'flex-shrink': 0,
    },
    'mjx-dialog > mjx-title > h1': {
      'font-size': '125%',
      margin: 0,
    },
    'mjx-dialog > div': {
      margin: '0 1em .5em',
      padding: '8px 18px',
      overflow: 'auto',
      border: '2px inset black',
      'background-color': 'white',
      'text-align': 'left',
      cursor: 'default',
      'flex-grow': 1,
      'flex-shrink': 1,
    },
    'mjx-dialog > div > pre': {
      margin: 0,
    },

    //
    // The dialog buttons
    //
    '.mjx-dialog-button': {
      position: 'absolute',
      top: '6px',
      height: '17px',
      width: '17px',
      cursor: 'default',
      display: 'block',
      border: '2px solid #AAA',
      'border-radius': '18px',
      'font-family': '"Courier New", Courier',
      'text-align': 'center',
      color: '#F0F0F0',
      '-webkit-user-select': 'none',
      'user-select': 'none',
    },
    '.mjx-dialog-button:hover': {
      color: 'white !important',
      border: '2px solid #CCC !important',
    },
    '.mjx-dialog-button > mjx-dialog-icon': {
      display: 'block',
      'background-color': '#AAA',
      border: '1.5px solid',
      'border-radius': '18px',
      'line-height': 0,
      padding: '8px 0 6px',
    },
    '.mjx-dialog-button > mjx-dialog-icon:hover': {
      'background-color': '#CCC !important',
    },

    //
    // The close button
    //
    'mjx-dialog-close': {
      right: '6px',
      'font-size': '20px;',
    },

    //
    // The help button
    //
    'mjx-dialog-help': {
      left: '6px',
      'font-size': '14px;',
      'font-weight': 'bold',
    },
    '.mjx-dialog-help mjx-dialog-help': {
      display: 'none',
    },

    //
    // Key icons in the dialogs
    //
    'mjx-dialog kbd': {
      display: 'inline-block',
      padding: '3px 5px',
      'font-size': '11px',
      'line-height': '10px',
      color: '#444d56',
      'vertical-align': 'middle',
      'background-color': '#fafbfc',
      border: 'solid 1.5px #c6cbd1',
      'border-bottom-color': '#959da5',
      'border-radius': '3px',
      'box-shadow': 'inset -.5px -1px 0 #959da5',
    },

    //
    // The drag edges and corners
    //
    'mjx-dialog-drag[data-drag="top"]': {
      height: '5px',
      position: 'absolute',
      top: '-3px',
      left: '10px',
      right: '10px',
      cursor: 'ns-resize',
    },
    'mjx-dialog-drag[data-drag="bottom"]': {
      height: '5px',
      position: 'absolute',
      bottom: '-3px',
      left: '10px',
      right: '10px',
      cursor: 'ns-resize',
    },
    'mjx-dialog-drag[data-drag="left"]': {
      width: '5px',
      position: 'absolute',
      left: '-3px',
      top: '10px',
      bottom: '10px',
      cursor: 'ew-resize',
    },
    'mjx-dialog-drag[data-drag="right"]': {
      width: '5px',
      position: 'absolute',
      right: '-3px',
      top: '10px',
      bottom: '10px',
      cursor: 'ew-resize',
    },
    'mjx-dialog-drag[data-drag="topleft"]': {
      width: '13px',
      height: '13px',
      position: 'absolute',
      left: '-3px',
      top: '-3px',
      cursor: 'nwse-resize',
    },
    'mjx-dialog-drag[data-drag="topright"]': {
      width: '13px',
      height: '13px',
      position: 'absolute',
      right: '-3px',
      top: '-3px',
      cursor: 'nesw-resize',
    },
    'mjx-dialog-drag[data-drag="botleft"]': {
      width: '13px',
      height: '13px',
      position: 'absolute',
      left: '-3px',
      bottom: '-3px',
      cursor: 'nesw-resize',
    },
    'mjx-dialog-drag[data-drag="botright"]': {
      width: '13px',
      height: '13px',
      position: 'absolute',
      right: '-3px',
      bottom: '-3px',
      cursor: 'nwse-resize',
    },

    '@media (prefers-color-scheme: dark)': {
      '.mjx-dialog': {
        'background-color': '#303030',
        'box-shadow': '0px 10px 20px #000',
        border: '3px outset #7C7C7C',
      },
      'mjx-dialog': {
        color: '#E0E0E0',
      },
      'mjx-dialog > div': {
        border: '2px inset #7C7C7C',
        'background-color': '#222025',
      },
      'a[href]': {
        color: '#86A7F5',
      },
      'a[href]:visited': {
        color: '#DD98E2',
      },
      'mjx-dialog kbd': {
        color: '#F8F8F8',
        'background-color': '#545454',
        border: 'solid 1.5px #7A7C7E',
        'border-bottom-color': '#707070',
        'box-shadow': 'inset -.5px -1px 0 #818589',
      },
      '.mjx-dialog-button': {
        border: '2px solid #686868',
        color: '#A4A4A4',
      },
      '.mjx-dialog-button:hover': {
        color: '#CBCBCB !important',
        border: '2px solid #888888 !important',
      },
      '.mjx-dialog-button > mjx-dialog-icon': {
        'background-color': '#646464',
      },
      '.mjx-dialog-button > mjx-dialog-icon:hover': {
        'background-color': '#888888 !important',
      },
    },
  };

  protected static helpMessage: string = `
    <p>The dialog boxes in MathJax are movable and sizeable.</p>

    <p>For mouse users, dragging any of the edges will enlarge or shrink
    the dialog box by moving that side.  Dragging any of the corners
    changes the two sides that meet at that corner.  Dragging elsewhere on
    the dialog frame will move the dialog without changing its size.</p>

    <p>For keyboard users, there are two ways to adjust the position
    and size of the dialog box.  The first is to hold the
    <kbd>Alt</kbd> or <kbd>Option</kbd> key and press any of the arrow
    keys to move the dialog box in the given direction.  Hold the
    <kbd>Win</kbd> or <kbd>Command</kbd> key and press any of the
    arrow keys to enlarge or shrink the dialog box.  Left and right
    move the right-hand edge of the dialog, while up and down move the
    bottom edge of the dialog.
    </p>

    <p>For some users, holding two keys down at once may be difficult,
    so the second way is to press the <kbd>m</kbd> to start "move"
    mode, then use the arrow keys to move the dialog box in the given
    direction.  Press <kbd>m</kbd> again to stop moving the dialog.
    Similarly, press <kbd>s</kbd> to start and stop "sizing" mode,
    where the arrows will change the size of the dialog box.</p>

    <p>Holding a <kbd>shift</kbd> key along with the arrow key will
    make larger changes in the size or position, for either method
    described above.</p>

    <p>Use <kbd>Tab</kbd> to move among the text, buttons, and links
    within the dialog.  The <kbd>Enter</kbd> or <kbd>Space</kbd> key
    activates the focused item.  The <kbd>Escape</kbd> key closes the
    dialog, as does clicking outside the dialog box, or clicking the
    "\u00D7" icon in the upper right-hand corner of the dialog.</p>
  `;

  /**
   * When moving/sizing by keyboard, this gives which is being adjusted.
   */
  protected mode: string = '';

  /**
   * @param {DialogArgs} args   The data describing the dialog
   */
  constructor(args: DialogArgs) {
    const { adaptor, node = null } = args;
    this.init(adaptor);

    this.node = node;
    this.background = isDialog ? null : adaptor.node('mjx-dialog-background');

    this.x = this.y = 0;
    this.dragging = false;
    this.action = '';

    this.dialog = this.html(args);
    this.title = this.dialog.firstChild.firstChild.firstChild as HTMLElement;
    this.content = this.dialog.firstChild.firstChild.nextSibling as HTMLElement;
    const close = this.dialog.lastChild;
    close.addEventListener('click', this.closeDialog.bind(this));
    close.addEventListener(
      'keydown',
      this.actionKey.bind(this, this.closeDialog.bind(this))
    );
    const help = this.dialog.lastChild.previousSibling;
    help.addEventListener('click', this.helpDialog.bind(this, adaptor));
    help.addEventListener(
      'keydown',
      this.actionKey.bind(this, this.helpDialog.bind(this, adaptor))
    );

    this.noDrag = Array.from(
      this.dialog.querySelectorAll('[data-drag="none"]')
    );
  }

  /**
   * Create the stylesheet, if it hasn't already been done
   *
   * @param {ADAPTOR} adaptor   The DOM adaptor to use
   */
  protected init(adaptor: ADAPTOR) {
    const CLASS = this.constructor as typeof DraggableDialog;
    const head = adaptor.document.head;
    if (!head.querySelector('#' + CLASS.styleId)) {
      const style = adaptor.node('style', { id: CLASS.styleId });
      style.textContent = new StyleJsonSheet(CLASS.styles).cssText;
      adaptor.document.head.append(style);
    }
  }

  /**
   * Create the HTML for the dialog layout
   *
   * @param {DialogArgs} args      The data describing the dialog
   * @returns {HTMLDialogElement}  The dialog node
   */
  protected html(args: DialogArgs): HTMLDialogElement {
    //
    // Deconstruct the data for easier access
    //
    const {
      title,
      message,
      adaptor,
      styles = null,
      extraNodes = [],
      className = DraggableDialog.className,
    } = args;

    //
    // Add a styleshee, if needed
    //
    if (styles) {
      const stylesheet = adaptor.node('style');
      stylesheet.textContent = new StyleJsonSheet(styles).cssText;
      extraNodes.unshift(stylesheet);
    }
    //
    // Create the dialog HTML tree
    //
    const label = 'mjx-dialog-label-' + DraggableDialog.id++;
    const dialog = adaptor.node(
      'dialog',
      { closedby: 'any', class: ('mjx-dialog ' + className).trim() },
      [
        adaptor.node('mjx-dialog', { 'aria-labeledby': label }, [
          adaptor.node('mjx-title', {}, [
            adaptor.node('h1', { id: label, tabIndex: 0 }),
          ]),
          adaptor.node('div', { 'data-drag': 'none', tabIndex: 0 }),
        ]),
        ...extraNodes,
        adaptor.node('mjx-dialog-spacer', { 'aria-hidden': true }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'top',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'bottom',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'left',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'right',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'topleft',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'topright',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'botleft',
          'aria-hidden': true,
        }),
        adaptor.node('mjx-dialog-drag', {
          'data-drag': 'botright',
          'aria-hidden': true,
        }),
        adaptor.node(
          'mjx-dialog-help',
          {
            class: 'mjx-dialog-button',
            'data-drag': 'none',
            tabIndex: 0,
            role: 'button',
            'aria-label': 'Dialog Help',
          },
          [
            adaptor.node('mjx-dialog-icon', { 'aria-hidden': true }, [
              adaptor.text('?'),
            ]),
          ]
        ),
        adaptor.node(
          'mjx-dialog-close',
          {
            class: 'mjx-dialog-button',
            'data-drag': 'none',
            tabIndex: 0,
            role: 'button',
            'aria-label': 'Close Dialog Box',
          },
          [
            adaptor.node('mjx-dialog-icon', { 'aria-hidden': true }, [
              adaptor.text('\u00d7'),
            ]),
          ]
        ),
      ]
    ) as HTMLDialogElement;
    //
    // Set the title and message
    //
    (dialog.firstChild.firstChild.firstChild as HTMLElement).innerHTML = title;
    (dialog.firstChild.childNodes[1] as HTMLElement).innerHTML = message;
    return dialog;
  }

  /**
   * Add the dialog to the page and attach the event handlers
   */
  public attach() {
    if (isDialog) {
      //
      // For actual dialog elements, open as a model dialog
      //
      this.dialog.addEventListener('mousedown', this.MouseDown.bind(this));
      this.dialog.addEventListener('keydown', this.KeyDown.bind(this), true);
      document.body.append(this.dialog);
      this.dialog.showModal();
    } else {
      //
      // When a true dialog element isn't available, use the background element
      //
      this.background.addEventListener('mousedown', this.MouseDown.bind(this));
      this.background.addEventListener(
        'keydown',
        this.KeyDown.bind(this),
        true
      );
      this.dialog.setAttribute('tabindex', '0');
      this.dialog.addEventListener('click', this.stop);
      this.background.append(this.dialog);
      document.body.append(this.background);
    }
    context.window.addEventListener(
      'visibilitychange',
      this.Visibility.bind(this)
    );
    //
    // Adjust the min width and height, if the initial dialog is small
    //
    this.minW = Math.min(this.minW, this.dialog.clientWidth - 8);
    this.minH = Math.min(
      this.minH,
      this.dialog.clientHeight - this.title.offsetHeight - 8
    );
    //
    // Focus the title (VoiceOver needs this)
    //
    this.title.focus();
  }

  /**
   * Functions to handle the various mouse events, returning
   * an array [dx, dy, dw, dh] of changes to the position and size
   * od the dialog.
   */
  protected actions: ActionMap = {
    //
    // Mouse actions
    //

    down: {
      move: (d) => {
        d.dialog.classList.add('mjx-moving');
      },
    },

    move: {
      move: (dg, ev) => [ev.x - dg.x, ev.y - dg.y, 0, 0],
      top: (dg, ev) => [0, (ev.y - dg.y) / 2, 0, dg.y - ev.y],
      bottom: (dg, ev) => [0, (ev.y - dg.y) / 2, 0, ev.y - dg.y],
      left: (dg, ev) => [(ev.x - dg.x) / 2, 0, dg.x - ev.x, 0],
      right: (dg, ev) => [(ev.x - dg.x) / 2, 0, ev.x - dg.x, 0],
      topleft: (dg, ev) => [
        (ev.x - dg.x) / 2,
        (ev.y - dg.y) / 2,
        dg.x - ev.x,
        dg.y - ev.y,
      ],
      topright: (dg, ev) => [
        (ev.x - dg.x) / 2,
        (ev.y - dg.y) / 2,
        ev.x - dg.x,
        dg.y - ev.y,
      ],
      botleft: (dg, ev) => [
        (ev.x - dg.x) / 2,
        (ev.y - dg.y) / 2,
        dg.x - ev.x,
        ev.y - dg.y,
      ],
      botright: (dg, ev) => [
        (ev.x - dg.x) / 2,
        (ev.y - dg.y) / 2,
        ev.x - dg.x,
        ev.y - dg.y,
      ],
    },

    up: {
      move: (dg) => {
        dg.dialog.classList.remove('mjx-moving');
      },
    },

    //
    // Keyboard actions
    //

    keymove: {
      left: () => [-5, 0, 0, 0],
      right: () => [5, 0, 0, 0],
      up: () => [0, -5, 0, 0],
      down: () => [0, 5, 0, 0],
    },

    bigmove: {
      left: () => [-20, 0, 0, 0],
      right: () => [20, 0, 0, 0],
      up: () => [0, -20, 0, 0],
      down: () => [0, 20, 0, 0],
    },

    keysize: {
      left: () => [-3, 0, -6, 0],
      right: () => [3, 0, 6, 0],
      up: () => [0, -3, 0, -6],
      down: () => [0, 3, 0, 6],
    },

    bigsize: {
      left: () => [-10, 0, -20, 0],
      right: () => [10, 0, 20, 0],
      up: () => [0, -10, 0, -20],
      down: () => [0, 10, 0, 20],
    },
  };

  /**
   * Perform a drag action (resize or move)
   *
   * @param {string} type        The action type to perform
   * @param {MouseEvent} event   The event causing the action
   */
  protected dragAction(type: string, event: MouseEvent = null) {
    if (event) {
      this.stop(event);
    }
    //
    // Get the move/resize data for the action
    //
    const action = this.actions[type][this.action];
    const result = action ? action(this, event) : null;
    if (!result) {
      return;
    }
    let [dx, dy, dw, dh] = result;
    //
    // Adjust the width
    //
    if (dw) {
      const W = this.w + dw;
      if (W >= this.minW) {
        this.x = event?.x;
        this.w = W;
        this.dialog.style.maxWidth = this.dialog.style.width = W + 'px';
      } else {
        dx = 0;
      }
    }
    //
    // Adjust the height
    //
    if (dh) {
      const H = this.h + dh;
      if (H >= this.minH + this.title.offsetHeight) {
        this.y = event?.y;
        this.h = H;
        this.dialog.style.maxHeight = this.dialog.style.height = H + 'px';
      } else {
        dy = 0;
      }
    }
    //
    // Adjust the position
    //
    if (dx || dy) {
      if (dx) {
        this.x = event?.x;
        this.tx += dx || 0;
      }
      if (dy) {
        this.y = event?.y;
        this.ty += dy || 0;
      }
      this.dialog.style.transform = `translate(${this.tx}px, ${this.ty}px)`;
    }
  }

  /**
   * Handle a mousedown event
   *
   * @param {MouseEvent} event   The mouse event to handle
   */
  protected MouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    //
    // Check that it is a plain click not on the background
    //
    if (
      event.buttons !== 1 ||
      event.shiftKey ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey
    ) {
      return;
    }
    if (!this.inDialog(event)) {
      this.closeDialog(event);
      return;
    }

    //
    // Check that it is not on an element marked as not for dragging
    //
    for (const node of this.noDrag) {
      if (target === node || node.contains(target)) {
        return;
      }
    }
    //
    // Start the drag action
    //
    this.action = target.getAttribute('data-drag') || 'move';
    this.startDrag(event);
    this.dragAction('down', event);
  }

  /**
   * Handle a mousemove event
   *
   * @param {MouseEvent} event   The mouse event to handle
   */
  protected MouseMove(event: MouseEvent) {
    if (event.buttons !== 1) {
      this.endDrag(); // in case the nouse up occurred over a different element
    }
    if (this.dragging) {
      this.dragAction('move', event);
    }
  }

  /**
   * Handle a mouseup event
   *
   * @param {MouseEvent} event   The mouse event to handle
   */
  protected MouseUp(event: MouseEvent) {
    if (this.dragging) {
      this.dragAction('up', event);
      this.endDrag();
    }
  }

  /**
   * Close the dialog if the pages becomes hidden (e.g., moving
   * foreward or backward in the window's history).
   */
  protected Visibility() {
    if (context.document.hidden) {
      this.closeDialog();
    }
  }

  /**
   * Handle a keydown event
   *
   * @param {KeyboardEvent} event   The key event to handle
   */
  protected KeyDown(event: KeyboardEvent) {
    const CLASS = this.constructor as typeof DraggableDialog;
    const action = CLASS.keyActions.get(event.key);
    if (action) {
      action(this, event);
    }
  }

  /**
   * Handle the Escape key
   *
   * @param {KeyboardEvent} event   The key event to handle
   */
  protected escKey(event: KeyboardEvent) {
    this.closeDialog(event);
  }

  /**
   * Handle the "a" key for selecting all
   *
   * @param {KeyboardEvent} event   The key event to handle
   */
  protected aKey(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      this.selectAll();
      this.stop(event);
    }
  }

  /**
   * Start or stop moving the dialog via arrow keys
   *
   * @param {KeyboardEvent} event   The key event to handle
   */
  protected mKey(event: KeyboardEvent) {
    this.mode = this.mode === 'move' ? '' : 'move';
    this.stop(event);
  }

  /**
   * Start or stop sizing the dialog via arrow keys
   *
   * @param {KeyboardEvent} event   The key event to handle
   */
  protected sKey(event: KeyboardEvent) {
    this.mode = this.mode === 'size' ? '' : 'size';
    this.stop(event);
  }

  /**
   * Handle the arrow keys
   *
   * @param {KeyboardEvent} event   The key event to handle
   * @param {string} direction      The direction of the arrow
   */
  protected arrowKey(event: KeyboardEvent, direction: string) {
    if (event.ctrlKey || this.dragging) return;
    this.action = direction;
    this.getWH();
    if (event.altKey || this.mode === 'move') {
      this.dragAction(event.shiftKey ? 'bigmove' : 'keymove');
      this.stop(event);
    } else if (event.metaKey || this.mode === 'size') {
      this.dragAction(event.shiftKey ? 'bigsize' : 'keysize');
      this.stop(event);
    }
    this.action = '';
  }

  /**
   * Handle the enter or space key on a button icon
   *
   * @param {(event: KeyboardEvent) => void} action   The action to take on enter or space
   * @param {KeyboardEvent} event                     The event to check
   */
  protected actionKey(
    action: (event: KeyboardEvent) => void,
    event: KeyboardEvent
  ) {
    if (event.code === 'Enter' || event.code === 'Space') {
      action(event);
    }
  }

  /**
   * Select the content of the dialog for copying
   */
  protected selectAll() {
    const selection = document.getSelection();
    selection.selectAllChildren(this.content);
  }

  /**
   * Implement the copy-to-clipboard action
   */
  public copyToClipboard() {
    this.selectAll();
    try {
      document.execCommand('copy');
    } catch (err) {
      alert(`Can't copy to clipboard: ${err.message}`);
    }
    document.getSelection().removeAllRanges();
  }

  /**
   * Start dragging for a move or resize action.
   *
   * @param {MouseEvent} event   The mousedown event starting the drag
   */
  protected startDrag(event: MouseEvent) {
    //
    // Record the initial data
    //
    this.x = event.x;
    this.y = event.y;
    this.getWH();
    this.dragging = true;
    //
    // Add the mousemove and mouseup handlers
    //
    const node = this.background || this.dialog;
    for (const [name, listener] of this.events) {
      node.addEventListener(name, listener);
    }
  }

  /**
   * Cache the current width and height values.
   */
  protected getWH() {
    this.w = this.dialog.clientWidth - 8; // adjust for the 4px padding on all sides
    this.h = this.dialog.clientHeight - 8;
  }

  /**
   * End a dragging operation
   */
  protected endDrag() {
    //
    // Clear the actions
    //
    this.action = '';
    this.dragging = false;
    //
    // Remove the mousemove and mouseup event handlers
    //
    const node = this.background || this.dialog;
    for (const [name, listener] of this.events) {
      node.removeEventListener(name, listener);
    }
  }

  /**
   * Close the dialog
   *
   * @param {Event} event   The event that caused the closure
   */
  protected closeDialog(event?: Event) {
    if (isDialog) {
      this.dialog.close();
      this.dialog.remove();
    } else {
      this.background.remove();
    }
    this.node?.focus();
    if (event) {
      this.stop(event);
    }
  }

  /**
   * Display the dialog help message
   *
   * @param {ADAPTOR} adaptor   The DOM adaptor to use
   * @param {Event} event       The event that triggered the help
   */
  protected helpDialog(adaptor: ADAPTOR, event: Event) {
    const help = new DraggableDialog({
      title: 'MathJax Dialog Help',
      message: (this.constructor as typeof DraggableDialog).helpMessage,
      adaptor: adaptor,
      className: 'mjx-dialog-help',
      styles: {
        '.mjx-dialog-help': {
          'max-width': 'calc(min(50em, 80%))',
        },
      },
    });
    help.attach();
    this.stop(event);
  }

  /**
   * Check if an event is inside the dialog.
   *
   * @param {MouseEvent} event   The event to check
   * @returns {boolean}          True if the event is in the dialog, false if in the background
   */
  protected inDialog(event: MouseEvent): boolean {
    if (!this.dialog.contains(event.target as HTMLElement)) {
      return false;
    }
    const { x, y } = event;
    const { left, right, top, bottom } = this.dialog.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  /**
   * Stop event propagation
   *
   * @param {Event} event   The event that is to be stopped
   */
  protected stop(event: Event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else if (event.stopPropagation) {
      event.stopPropagation();
    }
  }
}
