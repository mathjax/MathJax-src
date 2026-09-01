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

import type { ExplorerMathDocument } from '../explorer.js';
import {
  DummyRegion,
  Region,
  HoverRegion,
  ToolTip,
} from './Region.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
import { ExplorerPool } from './ExplorerPool.js';
import type { ExplorerMathItem } from '../explorer.js';
import { SEM } from '../semantic-enrich/strings.js';
import { MACTION } from '../semantic-enrich/maction.js';
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
   * The currently selected element
   */
  protected current: HTMLElement;

  /**
   * The mousemove event handler (added after a mouseover)
   */
  protected listener = this.MouseMove.bind(this);

  /**
   * True if the mousemove listener has been added
   */
  protected listening: boolean = false;

  /**
   * @class
   * @augments {AbstractMouseExplorer<T>}
   *
   * @param {ExplorerMathDocument} document The current document.
   * @param {ExplorerPool} pool The explorer pool.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {ExplorerMathItem} item The MathItem for this explorer
   * @param {(node: HTMLElement) => boolean} nodeQuery Predicate on nodes that
   *    will fire the hoverer.
   * @param {(node: HTMLElement) => T} nodeAccess Accessor to extract node value
   *    that is passed to the region.
   */
  protected constructor(
    public document: ExplorerMathDocument,
    public pool: ExplorerPool,
    public region: Region<T>,
    protected node: HTMLElement,
    protected item: ExplorerMathItem = null,
    protected nodeQuery: (node: HTMLElement) => boolean,
    protected nodeAccess: (node: HTMLElement) => T
  ) {
    super(document, pool, region, node);
  }

  /**
   * @override
   */
  public MouseOut(event: MouseEvent) {
    const top =
      this.node.querySelector('[data-semantic-structure]') || this.node;
    const topBBox = top.getBoundingClientRect();
    const nodeBBox = this.node.getBoundingClientRect();
    if (!this.inBBox(event.x, event.y, topBBox)) {
      this.highlighter.unhighlight();
      this.region.Hide();
      super.MouseOut(event);
      this.current = null;
    }
    if (!this.inBBox(event.x, event.y, nodeBBox)) {
      this.node.removeEventListener('mousemove', this.listener);
      this.listening = false;
    }
  }

  /**
   * @override
   */
  public MouseOver(event: MouseEvent) {
    const nodeBBox = this.node.getBoundingClientRect();
    if (!this.listening && this.inBBox(event.x, event.y, nodeBBox)) {
      super.MouseOver(event);
      this.node.addEventListener('mousemove', this.listener);
      this.listening = true;
    }
  }

  /**
   * Process a mousemove event to see if the node under the mouse has
   * changed, and if so, unhighlight the old one and highlight the new
   * one.
   *
   * @param {MouseEvent} event   The move event
   */
  public MouseMove(event: MouseEvent) {
    const node = this.nodeAtXY(event, this.nodeQuery);
    if (node && node !== this.current) {
      this.current = node;
      this.highlighter.unhighlight();
      this.display(node, this.nodeAccess(node));
    }
  }

  /**
   * @param {HTMLElement} node   The target node to update
   * @param {T} kind             The target kind to update
   */
  protected display(node: HTMLElement, kind: T) {
    this.item.parseSemanticNodes();
    let parts = this.item.getSplitNodes(node);
    if (this.region instanceof HoverRegion) {
      this.region.splitNodes = parts;
    }
    parts = this.highlighter.encloseNodes([...parts], this.node);
    this.highlighter.highlight(parts);
    if (typeof kind === 'string') {
      this.region.Update(kind);
    }
    this.region.Show(node);
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
    document: ExplorerMathDocument,
    pool: ExplorerPool,
    region: ToolTip,
    node: HTMLElement,
    item: ExplorerMathItem,
    attr: string
  ) {
    super(
      document,
      pool,
      region,
      node,
      item,
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
    document: ExplorerMathDocument,
    pool: ExplorerPool,
    region: HoverRegion,
    node: HTMLElement,
    item: ExplorerMathItem
  ) {
    super(
      document,
      pool,
      region,
      node,
      item,
      (x) => x.hasAttribute?.(SEM.ID),
      (x) => x
    );
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
    document: ExplorerMathDocument,
    pool: ExplorerPool,
    _ignore: any,
    node: HTMLElement,
    item: ExplorerMathItem
  ) {
    super(
      document,
      pool,
      new DummyRegion(document),
      node,
      item,
      (x) => x.hasAttribute(MACTION.COLLAPSIBLE),
      () => {}
    );
  }

  display(node: HTMLElement) {
    const id = node.getAttribute(MACTION.GROUPID);
    if (id) {
      node = this.node.querySelector(`#${id}`);
    }
    let parts: HTMLElement[] = node.hasAttribute(MACTION.GROUP)
      ? this.highlighter.getMactionGroup(this.node, node)
      : [node];
    parts = this.highlighter.encloseNodes([...parts], this.node);
    this.highlighter.highlight(parts);
    this.region.Show(node);
  }
}
