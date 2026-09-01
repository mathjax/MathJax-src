/*************************************************************
 *
 *  COPYRIGHT (c) 2022-2024 The MathJax Consortium
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
 * @file Class for handling all explorers on a single Math Item.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { LiveRegion, SpeechRegion, ToolTip, HoverRegion } from './Region.js';
import type { ExplorerMathDocument, ExplorerMathItem } from '../explorer.js';
import { SEM } from '../semantic-enrich/strings.js';

import { Explorer } from './Explorer.js';
import { SpeechExplorer } from './KeyExplorer.js';
import { ValueHoverer, ContentHoverer, FlameHoverer } from './MouseExplorer.js';
import { TreeColorer, FlameColorer } from './TreeExplorer.js';

import { Highlighter, getHighlighter } from './Highlighter.js';

/**
 * The regions objects needed for the explorers.
 */
export class RegionPool {
  /**
   * The speech region.
   */
  public speechRegion: SpeechRegion = new SpeechRegion(this.document);

  /**
   * The Braille region.
   */
  public brailleRegion: LiveRegion = new LiveRegion(this.document);

  /**
   * Hover region for all magnifiers.
   */
  public magnifier: HoverRegion = new HoverRegion(this.document);

  /**
   * A tooltip region.
   */
  public tooltip1: ToolTip = new ToolTip(this.document);

  /**
   * A tooltip region.
   */
  public tooltip2: ToolTip = new ToolTip(this.document);

  /**
   * A tooltip region.
   */
  public tooltip3: ToolTip = new ToolTip(this.document);

  /**
   * @param {ExplorerMathDocument} document The document the handler belongs to.
   */
  constructor(public document: ExplorerMathDocument) {}
}

/**
 * Type of explorer initialization methods.
 *
 * @type {(doc: ExplorerMathDocument,
 *         pool: ExplorerPool,
 *         node: HTMLElement,
 *         ...rest: any[]
 *        ) => Explorer}
 */
type ExplorerInit = (
  doc: ExplorerMathDocument,
  pool: ExplorerPool,
  node: HTMLElement,
  item: ExplorerMathItem
) => Explorer;

/**
 *  Generation methods for all MathJax explorers available via option settings.
 */
const allExplorers: { [options: string]: ExplorerInit } = {
  speech: (doc, pool, node, item) => {
    const explorer = SpeechExplorer.create(
      doc,
      pool,
      doc.explorerRegions.speechRegion,
      node,
      doc.explorerRegions.brailleRegion,
      doc.explorerRegions.magnifier,
      item
    ) as SpeechExplorer;
    explorer.sound = true;
    return explorer;
  },
  mouseMagnifier: (doc, pool, node, item) =>
    ContentHoverer.create(doc, pool, doc.explorerRegions.magnifier, node, item),
  hover: (doc, pool, node) => FlameHoverer.create(doc, pool, null, node),
  infoType: (doc, pool, node, item) =>
    ValueHoverer.create(
      doc,
      pool,
      doc.explorerRegions.tooltip1,
      node,
      item,
      SEM.TYPE
    ),
  infoRole: (doc, pool, node, item) =>
    ValueHoverer.create(
      doc,
      pool,
      doc.explorerRegions.tooltip2,
      node,
      item,
      SEM.ROLE
    ),
  infoPrefix: (doc, pool, node, item) =>
    ValueHoverer.create(
      doc,
      pool,
      doc.explorerRegions.tooltip3,
      node,
      item,
      SEM.PREFIX_NONE
    ),
  flame: (doc, pool, node) => FlameColorer.create(doc, pool, null, node),
  treeColoring: (doc, pool, node) => TreeColorer.create(doc, pool, null, node),
};

/**
 * Class to bundle and handle all explorers on a Math item. This in particular
 * means that all explorer share the same highlighter, meaning that there is no
 * uncontrolled interaction between highlighting of different explorers.
 */
export class ExplorerPool {
  /**
   * A highlighter that is used to mark nodes during auto voicing.
   */
  public secondaryHighlighter: Highlighter;

  /**
   * The explorer dictionary.
   */
  public explorers: { [key: string]: Explorer } = {};

  /**
   * The currently attached explorers
   */
  protected attached: string[] = [];

  /**
   * The target document.
   */
  protected document: ExplorerMathDocument;

  /**
   * The node explorers will be attached to.
   */
  protected node: HTMLElement;

  /**
   * The primary highlighter shared by all explorers.
   */
  private _highlighter: Highlighter;

  /**
   * The name of the current output jax.
   */
  private _renderer: string;

  /**
   * All explorers that need to be restarted on a rerendered element.
   */
  private _restart: string[] = [];

  /**
   * @returns {Highlighter} The primary highlighter shared by all explorers.
   */
  public get highlighter(): Highlighter {
    if (this._renderer !== this.document.outputJax.name) {
      this._renderer = this.document.outputJax.name;
      this.setPrimaryHighlighter();
      return this._highlighter;
    }
    const [foreground, background] = this.colorOptions();
    this._highlighter.setColor(background, foreground);
    return this._highlighter;
  }

  /**
   * @param {ExplorerMathDocument} document The target document.
   * @param {HTMLElement} node The node explorers will be attached to.
   * @param {ExplorerMathItem} item The current math item.
   */
  public init(
    document: ExplorerMathDocument,
    node: HTMLElement,
    item: ExplorerMathItem
  ) {
    this.document = document;
    this.node = node;
    this.setPrimaryHighlighter();
    for (const key of Object.keys(allExplorers)) {
      this.explorers[key] = allExplorers[key](
        this.document,
        this,
        this.node,
        item
      );
    }
    this.setSecondaryHighlighter();
    this.attach();
  }

  /**
   * A11y options keys associated with the speech explorer.
   */
  private speechExplorerKeys = ['speech', 'braille', 'keyMagnifier'];

  /**
   * Attaches the explorers that are currently meant to be active given
   * the document options. Detaches all others.
   */
  public attach() {
    this.attached = [];
    const keyExplorers = [];
    const a11y = this.document.options.a11y as {
      [name: string]: string | number | boolean;
    };
    for (const [key, explorer] of Object.entries(this.explorers)) {
      if (explorer instanceof SpeechExplorer) {
        explorer.stoppable = false;
        keyExplorers.unshift(explorer);
        if (this.speechExplorerKeys.some((exKey) => a11y[exKey])) {
          explorer.Attach();
          this.attached.push(key);
        } else {
          explorer.Detach();
        }
        continue;
      }
      if (
        a11y[key] ||
        (key === 'speech' && (a11y.braille || a11y.keyMagnifier))
      ) {
        explorer.Attach();
        this.attached.push(key);
      } else {
        explorer.Detach();
      }
    }
    // Ensure that the last currently attached key explorer stops propagating
    // key events.
    for (const explorer of keyExplorers) {
      if (explorer.attached) {
        explorer.stoppable = true;
        break;
      }
    }
  }

  /**
   * Computes the explorers that need to be reattached after a MathItem is
   * rerendered.
   */
  public reattach() {
    for (const key of this.attached) {
      const explorer = this.explorers[key];
      if (explorer.active) {
        this._restart.push(key);
        explorer.Stop();
      }
    }
  }

  /**
   * Restarts explorers after a MathItem is rerendered.
   */
  public restart() {
    this._restart.forEach((x) => {
      this.explorers[x].Start();
    });
    this._restart = [];
  }

  /**
   * A highlighter for the explorer.
   */
  protected setPrimaryHighlighter() {
    const [foreground, background] = this.colorOptions();
    this._highlighter = getHighlighter(
      LiveRegion.priority.primary,
      background,
      foreground,
      this.document.outputJax.name
    );
  }

  /**
   * Sets the secondary highlighter for marking nodes during autovoicing.
   */
  protected setSecondaryHighlighter() {
    this.secondaryHighlighter = getHighlighter(
      LiveRegion.priority.secondary,
      { color: 'red', alpha: 0.8 },
      { color: 'black' },
      this.document.outputJax.name
    );
    (this.speech.region as SpeechRegion).highlighter =
      this.secondaryHighlighter;
  }

  /**
   * Highlights a set of DOM nodes.
   *
   * @param {HTMLElement[]} nodes The array of HTML nodes to be highlighted.
   */
  public highlight(nodes: HTMLElement[]) {
    this.highlighter.highlight(nodes);
  }

  /**
   * Unhighlights the currently highlighted DOM nodes.
   */
  public unhighlight() {
    this.secondaryHighlighter.unhighlight();
    this.highlighter.unhighlight();
  }

  /**
   * Convenience method to return the speech explorer of the pool with the
   * correct type.
   *
   * @returns {SpeechExplorer} The speech explorer.
   */
  public get speech(): SpeechExplorer {
    return this.explorers['speech'] as SpeechExplorer;
  }

  /**
   * Retrieves color assignment for the document options.
   *
   * @returns {[ { color: string; alpha: number }, { color: string; alpha:
   *             number } ]} Color assignments for fore and background colors.
   */
  private colorOptions(): [
    { color: string; alpha: number },
    { color: string; alpha: number },
  ] {
    const opts = this.document.options.a11y;
    const foreground = {
      color: opts.foregroundColor.toLowerCase(),
      alpha: opts.foregroundOpacity / 100,
    };
    const background = {
      color: opts.backgroundColor.toLowerCase(),
      alpha: opts.backgroundOpacity / 100,
    };
    return [foreground, background];
  }
}
