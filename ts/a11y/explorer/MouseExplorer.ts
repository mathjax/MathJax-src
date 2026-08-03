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
 * @file Explorers based on mouse events.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { A11yDocument, DummyRegion, Region, HoverRegion, ToolTip } from './Region.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
import { ExplorerPool } from './ExplorerPool.js';
import type { ExplorerMathItem } from '../explorer.js';
import '../sre.js';

/**
 * Interface for mouse explorers. Adds the necessary mouse events.
 *
 * @interface
 * @augments {Explorer}
 */
export interface MouseExplorer extends Explorer {
  /**
   * Function to be executed on mouse over.
   *
   * @param {MouseEvent} event The mouse event.
   */
  MouseOver(event: MouseEvent): void;

  /**
   * Function to be executed on mouse out.
   *
   * @param {MouseEvent} event The mouse event.
   */
  MouseOut(event: MouseEvent): void;
}

/**
 * @class
 * @augments {AbstractExplorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export abstract class AbstractMouseExplorer<T>
  extends AbstractExplorer<T>
  implements MouseExplorer
{
  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] = super.Events().concat([
    ['mouseover', this.MouseOver.bind(this)],
    ['mouseout', this.MouseOut.bind(this)],
  ]);

  /**
   * @override
   */
  public MouseOver(_event: MouseEvent) {
    this.Start();
  }

  /**
   * @override
   */
  public MouseOut(_event: MouseEvent) {
    this.Stop();
  }
}

/**
 * Exploration via hovering.
 *
 * @class
 * @augments {AbstractMouseExplorer}
 *
 * @template T
 */
export abstract class Hoverer<T> extends AbstractMouseExplorer<T> {
  /**
   * @class
   * @augments {AbstractMouseExplorer<T>}
   *
   * @param {A11yDocument} document The current document.
   * @param {ExplorerPool} pool The explorer pool.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {(node: HTMLElement) => boolean} nodeQuery Predicate on nodes that
   *    will fire the hoverer.
   * @param {(node: HTMLElement) => T} nodeAccess Accessor to extract node value
   *    that is passed to the region.
   * @param {ExplorerMathItem} item The MathItem for this explorer
   */
  protected constructor(
    public document: A11yDocument,
    public pool: ExplorerPool,
    public region: Region<T>,
    protected node: HTMLElement,
    protected nodeQuery: (node: HTMLElement) => boolean,
    protected nodeAccess: (node: HTMLElement) => T,
    protected item: ExplorerMathItem = null
  ) {
    super(document, pool, region, node);
    const top = this.node.querySelector('[data-semantic-structure]') || this.node;
    this.topBBox = top.getBoundingClientRect();
    this.nodeBBox = this.node.getBoundingClientRect();
  }

  protected current: HTMLElement;
  protected listener = this.MouseMove.bind(this);
  protected listening: boolean = false;
  protected topBBox: DOMRect;
  protected nodeBBox: DOMRect;

  protected inBBox(x: number, y:number, bbox: DOMRect) {
    const {left, right, top, bottom} = bbox;
    return x >= left && x <= right && y >=top && y <= bottom;
  }

  /**
   * @override
   */
  public MouseOut(event: MouseEvent) {
    if (!this.inBBox(event.x, event.y, this.topBBox)) {
      this.highlighter.unhighlight();
      this.region.Hide();
      super.MouseOut(event);
      this.current = null;
    }
    if (!this.inBBox(event.x, event.y, this.nodeBBox)) {
      this.node.removeEventListener('mousemove', this.listener);
      this.listening = false;
    }
  }

  public MouseMove(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const node = this.findClicked(target, event.x, event.y);
      if (node && node !== this.current) {
        this.current = node;
        this.highlighter.unhighlight();
        this.display(node, this.nodeAccess(node));
      }
  }

  /**
   * @override
   */
  public MouseOver(event: MouseEvent) {
    if (!this.listening && this.inBBox(event.x, event.y, this.nodeBBox)) {
      super.MouseOver(event);
      this.node.addEventListener('mousemove', this.listener);
      this.listening = true;
    }
  }

  /**
   * @param {HTMLElement} node   The target node to update
   * @param {T} kind             The target kind to update
   */
  protected display(node: HTMLElement, kind: T) {
    this.highlighter.highlight([node]);
    this.region.Update(kind);
    this.region.Show(node);
  }

  protected findClicked(
    node: HTMLElement,
    x: number,
    y: number,
    skip: HTMLElement[] = [],
    icon: HTMLElement = null
  ): HTMLElement {
    let found = null;
    //
    // Check if the click is on the info icon and return that if it is.
    //
    if (icon && (icon === node || icon.contains(node))) {
      return icon;
    }
    //
    // For SVG, look through the tree to find the element whose bounding box
    // contains the click (x,y) position.
    //
    let clicked = this.node;
    while (clicked) {
      if (clicked.matches('[data-semantic-id]')) {
        found = clicked; // could be this node, but check if (x,y) is in a child
      }
      const nodes = Array.from(clicked.childNodes) as HTMLElement[];
      clicked = null;
      for (let child of nodes) {
        //
        // Skip text or comment nodes
        //
        if (child.nodeName.charAt(0) === '#') {
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

/**
 * Hoverer that displays information on nodes (e.g., as tooltips).
 *
 * @class
 * @augments {Hoverer}
 */
export class ValueHoverer extends Hoverer<string> {
  /**
   * @override
   */
  protected constructor(
    document: A11yDocument,
    pool: ExplorerPool,
    region: ToolTip,
    node: HTMLElement,
    attr: string,
  ) {
    super(
      document,
      pool,
      region,
      node,
      (x) => x.hasAttribute?.(attr),
      (x) => x.getAttribute?.(attr)
    );
  }
}

/**
 * Hoverer that displays node content (e.g., for magnification).
 *
 * @class
 * @augments {Hoverer}
 */
export class ContentHoverer extends Hoverer<HTMLElement> {
  /**
   * @override
   */
  protected constructor(
    document: A11yDocument,
    pool: ExplorerPool,
    public region: HoverRegion,
    node: HTMLElement,
    item: ExplorerMathItem,
  ) {
    super(
      document,
      pool,
      region,
      node,
      (x) => x.hasAttribute?.('data-semantic-id'),
      (x) => x,
      item
    );
  }

  /**
   * @override
   */
  display(node: HTMLElement) {
    this.item.parseSemanticNodes();
    let parts = this.region.splitNodes = this.item.getSplitNodes(node);
    parts = this.highlighter.encloseNodes([...parts], this.node);
    this.highlighter.highlight(parts);
    this.region.Show(node);
  }
}

/**
 * Highlights maction nodes on hovering.
 *
 * @class
 * @augments {Hoverer}
 */
export class FlameHoverer extends Hoverer<void> {
  /**
   * @override
   */
  protected constructor(
    document: A11yDocument,
    pool: ExplorerPool,
    _ignore: any,
    node: HTMLElement
  ) {
    super(
      document,
      pool,
      new DummyRegion(document),
      node,
      (x) => this.highlighter.isMactionNode(x),
      () => {}
    );
  }
}
