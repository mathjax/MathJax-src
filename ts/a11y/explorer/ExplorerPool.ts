/*************************************************************
 *
 *  Copyright (c) 2022-2024 The MathJax Consortium
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
 * @fileoverview Class for handling all explorers on a single Math Item.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {LiveRegion, SpeechRegion, ToolTip, HoverRegion} from './Region.js';
import type { ExplorerMathDocument, ExplorerMathItem } from '../explorer.js';

import {Explorer} from './Explorer.js';
import {SpeechExplorer} from './KeyExplorer.js';
import * as me from './MouseExplorer.js';
import {TreeColorer, FlameColorer} from './TreeExplorer.js';

import {Sre} from '../sre.js';

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
   * @param document The document the handler belongs to.
   */
  constructor(public document: ExplorerMathDocument) { }

}


/**
 * Type of explorer initialization methods.
 * @type {(ExplorerMathDocument, HTMLElement, any[]): Explorer}
 */
type ExplorerInit = (doc: ExplorerMathDocument, pool: ExplorerPool,
                     node: HTMLElement, ...rest: any[]) => Explorer;

/**
 *  Generation methods for all MathJax explorers available via option settings.
 */
let allExplorers: {[options: string]: ExplorerInit} = {
  speech: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ...rest: any[]) => {
    let explorer = SpeechExplorer.create(
      doc, pool, doc.explorerRegions.speechRegion, node,
      doc.explorerRegions.brailleRegion, doc.explorerRegions.magnifier, rest[0], rest[1]) as SpeechExplorer;
    explorer.sound = true;
    return explorer;
  },
  mouseMagnifier: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ..._rest: any[]) =>
    me.ContentHoverer.create(doc, pool, doc.explorerRegions.magnifier, node,
                             (x: HTMLElement) => x.hasAttribute('data-semantic-type'),
                             (x: HTMLElement) => x),
  hover: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ..._rest: any[]) =>
    me.FlameHoverer.create(doc, pool, null, node),
  infoType: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ..._rest: any[]) =>
    me.ValueHoverer.create(doc, pool, doc.explorerRegions.tooltip1, node,
                           (x: HTMLElement) => x.hasAttribute('data-semantic-type'),
                           (x: HTMLElement) => x.getAttribute('data-semantic-type')),
  infoRole: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ..._rest: any[]) =>
    me.ValueHoverer.create(doc, pool, doc.explorerRegions.tooltip2, node,
                           (x: HTMLElement) => x.hasAttribute('data-semantic-role'),
                           (x: HTMLElement) => x.getAttribute('data-semantic-role')),
  infoPrefix: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ..._rest: any[]) =>
    me.ValueHoverer.create(doc, pool, doc.explorerRegions.tooltip3, node,
                           (x: HTMLElement) => x.hasAttribute('data-semantic-prefix'),
                           (x: HTMLElement) => x.getAttribute('data-semantic-prefix')),
  flame: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ..._rest: any[]) =>
    FlameColorer.create(doc, pool, null, node),
  treeColoring: (doc: ExplorerMathDocument, pool: ExplorerPool, node: HTMLElement, ...rest: any[]) =>
    TreeColorer.create(doc, pool, null, node, ...rest)
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
  public secondaryHighlighter: Sre.highlighter;

  /**
   * The explorer dictionary.
   */
  public explorers: {[key: string]: Explorer} = {};

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
   * The corresponding Mathml node as a string.
   */
  protected mml: string;

  /**

   * The primary highlighter shared by all explorers.
   */
  private _highlighter: Sre.highlighter;

  /**
   * The name of the current output jax.
   */
  private _renderer: string;

  /**
   * All explorers that need to be restarted on a rerendered element.
   */
  private _restart: string[] = [];

  /**
   * @return {Sre.highlighter} The primary highlighter shared by all explorers.
   */
  public get highlighter(): Sre.highlighter {
    if (this._renderer !== this.document.outputJax.name) {
      this._renderer = this.document.outputJax.name;
      this.setPrimaryHighlighter();
      return this._highlighter;
    }
    let [foreground, background] = this.colorOptions();
    Sre.updateHighlighter(background, foreground, this._highlighter);
    return this._highlighter;
  }

  /**
   * @param  document The target document.
   * @param  node The node explorers will be attached to.
   * @param  mml The corresponding Mathml node as a string.
   */
  public init(document: ExplorerMathDocument,
              node: HTMLElement, mml: string,
              item: ExplorerMathItem) {
    this.document = document;
    this.mml = mml;
    this.node = node;
    this.setPrimaryHighlighter();
    for (let key of Object.keys(allExplorers)) {
      this.explorers[key] = allExplorers[key](this.document, this, this.node, this.mml, item);
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
    let keyExplorers = [];
    const a11y = this.document.options.a11y;
    for (let [key, explorer] of Object.entries(this.explorers)) {
      if (explorer instanceof SpeechExplorer) {
        explorer.AddEvents();
        explorer.stoppable = false;
        keyExplorers.unshift(explorer);
        if (this.speechExplorerKeys.some(
          exKey => this.document.options.a11y[exKey])) {
          explorer.Attach();
          this.attached.push(key);
        } else {
          explorer.Detach();
        }
        continue;
      }
      if (a11y[key] || (key === 'speech' && (a11y.braille || a11y.keyMagnifier))) {
        explorer.Attach();
        this.attached.push(key);
      } else {
        explorer.Detach();
      }
    }
    // Ensure that the last currently attached key explorer stops propagating
    // key events.
    for (let explorer of keyExplorers) {
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
     for (let key of this.attached) {
       let explorer = this.explorers[key];
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
    this._restart.forEach(x => {
      this.explorers[x].Start(); 
    });
    this._restart = [];
  }

  /**
   * A highlighter for the explorer.
   */
  protected setPrimaryHighlighter() {
    let [foreground, background] = this.colorOptions();
    this._highlighter = Sre.getHighlighter(
      background, foreground,
      {renderer: this.document.outputJax.name, browser: 'v3'});
  }

  /**
   * Sets the secondary highlighter for marking nodes during autovoicing.
   */
  protected setSecondaryHighlighter() {
    this.secondaryHighlighter = Sre.getHighlighter(
      {color: 'red'}, {color: 'black'},
      {renderer: this.document.outputJax.name, browser: 'v3'}
    );
    (this.speech.region as SpeechRegion).highlighter =
      this.secondaryHighlighter;
  }

  /**
   * Highlights a set of DOM nodes.
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
   * @return {SpeechExplorer}
   */
  public get speech(): SpeechExplorer {
    return this.explorers['speech'] as SpeechExplorer;
  }

  /**
   * Retrieves color assignment for the document options.
   *
   * @return {[foreground, background]} Color assignments for fore and
   *     background colors.
   */
  private colorOptions(): [{color: string, alpha: number},
                           {color: string, alpha: number}] {
    let opts = this.document.options.a11y;
    let foreground = {color: opts.foregroundColor.toLowerCase(),
                      alpha: opts.foregroundOpacity / 100};
    let background = {color: opts.backgroundColor.toLowerCase(),
                      alpha: opts.backgroundOpacity / 100};
    return [foreground, background];
  }

}
