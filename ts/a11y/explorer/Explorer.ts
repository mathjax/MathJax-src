/*************************************************************
 *
 *  Copyright (c) 2009-2026 The MathJax Consortium
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
 * @file Explorers for A11Y purposes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import type { ExplorerMathDocument } from '../explorer.js';
import { Region } from './Region.js';
import { Highlighter } from './Highlighter.js';
import { HILITE } from './strings.js';

import type { ExplorerPool } from './ExplorerPool.js';

/**
 * A11y explorers.
 *
 * @interface
 */
export interface Explorer {
  /**
   * Flag indicating if the explorer is active.
   *
   * @type {boolean}
   */
  active: boolean;

  /**
   * Flag indicating if event bubbling is stopped.
   *
   * @type {boolean}
   */
  stoppable: boolean;

  /**
   * The pool the explorer belongs to.
   *
   * @type {ExplorerPool}
   */
  pool: ExplorerPool;

  /**
   * Attaches navigator and its event handlers to a node.
   */
  Attach(): void;

  /**
   * Detaches navigator and its event handlers to a node.
   */
  Detach(): void;

  /**
   * Starts the explorer.
   */
  Start(): void;

  /**
   * Stops the explorer.
   */
  Stop(): void;

  /**
   * Adds the events of the explorer to the node's event listener.
   */
  AddEvents(): void;

  /**
   * Removes the events of the explorer from the node's event listener.
   */
  RemoveEvents(): void;

  /**
   * Update the explorer after state changes.
   *
   * @param {boolean=} force Forces the update in any case. (E.g., even if
   *     explorer is inactive.)
   */
  Update(force?: boolean): void;
}

/**
 * Abstract class implementing the very basic explorer functionality.
 *
 * Explorers use creator pattern to ensure they automatically attach themselves
 * to their node. This class provides the create method and is consequently not
 * declared abstract.
 *
 * @class
 * @implements {Explorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export class AbstractExplorer<T> implements Explorer {
  /**
   * @override
   */
  public stoppable: boolean = true;

  /**
   * Named events and their functions.
   *
   * @type {[string, (x: Event) => void][]}
   */
  protected events: [string, (x: Event) => void][] = [];

  /**
   * @returns {Highlighter} The Sre highlighter associated with the walker.
   */
  protected get highlighter(): Highlighter {
    return this.pool.highlighter;
  }

  /**
   * Flag if explorer is active.
   *
   * @type {boolean}
   */
  private _active: boolean = false;

  /**
   * Stops event bubbling.
   *
   * @param {Event} event The event that is stopped.
   */
  protected static stopEvent(event: Event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else if (event.stopPropagation) {
      event.stopPropagation();
    }
    event.cancelBubble = true;
  }

  /**
   * Creator pattern for explorers.
   *
   * @param {ExplorerMathDocument} document The current document.
   * @param {ExplorerPool} pool The explorer pool.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {any[]} rest Remaining information.
   * @returns {Explorer} An object of the particular explorer class.
   *
   * @template T
   */
  public static create<T>(
    document: ExplorerMathDocument,
    pool: ExplorerPool,
    region: Region<T>,
    node: HTMLElement,
    ...rest: any[]
  ): Explorer {
    const explorer = new this(document, pool, region, node, ...rest);
    return explorer;
  }

  /**
   * @class
   * @param {ExplorerMathDocument} document The current document.
   * @param {ExplorerPool} pool The explorer pool.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {any[]} _rest Remaining information.
   */
  protected constructor(
    public document: ExplorerMathDocument,
    public pool: ExplorerPool,
    public region: Region<T>,
    protected node: HTMLElement,
    ..._rest: any[]
  ) {}

  /**
   * @returns {[string, (x: Event) => void][]} The events associated with this
   *     explorer.
   */
  protected Events(): [string, (x: Event) => void][] {
    return this.events;
  }

  /**
   * @override
   */
  public get active(): boolean {
    return this._active;
  }

  /**
   * @override
   */
  public set active(flag: boolean) {
    this._active = flag;
  }

  /**
   * @override
   */
  public Attach() {
    this.AddEvents();
  }

  /**
   * @override
   */
  public Detach() {
    this.RemoveEvents();
  }

  /**
   * @override
   */
  public Start() {
    this.active = true;
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.region.Clear();
      this.region.Hide();
      this.active = false;
    }
  }

  /**
   * @override
   */
  public AddEvents() {
    for (const [eventkind, eventfunc] of this.events) {
      this.node.addEventListener(eventkind, eventfunc);
    }
  }

  /**
   * @override
   */
  public RemoveEvents() {
    for (const [eventkind, eventfunc] of this.events) {
      this.node.removeEventListener(eventkind, eventfunc);
    }
  }

  /**
   * @override
   */
  public Update(_force: boolean = false): void {}

  /**
   * Stops the events of this explorer from bubbling.
   *
   * @param {Event} event The event to stop.
   */
  protected stopEvent(event: Event) {
    if (this.stoppable) {
      AbstractExplorer.stopEvent(event);
    }
  }

  /**
   * @param {number} x       The x-coordinate of the point to test
   * @param {number} y       The y-coordinate of the point to test
   * @param {DOMRect} bbox   The bounding box to test
   * @returns {boolean}      True if (x,y) is inside the bounding box
   */
  protected inBBox(x: number, y: number, bbox: DOMRect): boolean {
    const { left, right, top, bottom } = bbox;
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  /**
   * Find the smallest item in the expression's DOM tree that contains am event's point.
   *
   * @param {MouseEvent} event                    The event whose (x,y) is to be used
   * @param {(node:HTMLElement)=>boolean} query   A test for which nodes to accept
   * @param {HTMLElement[]} skip                  Optional list of nodes to ignore
   * @param {HTMLElement} icon                    The info icon, if there is one
   * @returns {HTMLElement}                       The smallest matching element
   *                                                containing the event's point
   */
  protected nodeAtXY(
    event: MouseEvent,
    query: (node: HTMLElement) => boolean,
    skip: HTMLElement[] = [],
    icon: HTMLElement = null
  ): HTMLElement {
    const { x, y, target } = event;
    let found = null;
    //
    // Check if the click is on the info icon and return that if it is.
    //
    if (icon && (icon === target || icon.contains(target as HTMLElement))) {
      return icon;
    }
    //
    // For SVG, look through the tree to find the element whose bounding box
    // contains the click (x,y) position.
    //
    let clicked = this.node;
    while (clicked) {
      if (query(clicked)) {
        found = clicked; // could be this node, but check if (x,y) is in a child
      }
      const nodes = Array.from(clicked.childNodes) as HTMLElement[];
      clicked = null;
      for (let child of nodes) {
        //
        // Skip text or comment nodes
        //
        if (
          child.nodeName.charAt(0) === '#' ||
          child.hasAttribute?.(HILITE.ADDED)
        ) {
          continue;
        }
        //
        // Move inside nodes used for tables with labels
        // (for HTML they have 0 height and for SVG they are huge)
        //
        if (
          child.nodeName.toLowerCase() === 'mjx-labels' ||
          child.hasAttribute?.('data-table') ||
          child.hasAttribute?.('data-labels')
        ) {
          child = child.firstChild as HTMLElement;
        }
        if (
          !skip.includes(child) &&
          child.nodeName.toLowerCase() !== 'rect' &&
          this.inBBox(x, y, child.getBoundingClientRect() as DOMRect)
        ) {
          clicked = child;
          break;
        }
      }
    }
    return found;
  }
}
