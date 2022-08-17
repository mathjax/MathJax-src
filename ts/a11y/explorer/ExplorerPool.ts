/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
import type { ExplorerMathDocument } from '../explorer.js';

import {Explorer} from './Explorer.js';
import * as ke from './KeyExplorer.js';
import * as me from './MouseExplorer.js';
import {TreeColorer, FlameColorer} from './TreeExplorer.js';

import Sre from '../sre.js';

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
type ExplorerInit = (doc: ExplorerMathDocument,
                     node: HTMLElement, ...rest: any[]) => Explorer;

/**
 *  Generation methods for all MathJax explorers available via option settings.
 */
let allExplorers: {[options: string]: ExplorerInit} = {
  speech: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) => {
    let explorer = ke.SpeechExplorer.create(
      doc, doc.explorerRegions.speechRegion, node, ...rest) as ke.SpeechExplorer;
    explorer.speechGenerator.setOptions({
      automark: true as any, markup: 'ssml_step',
      locale: doc.options.sre.locale, domain: doc.options.sre.domain,
      style: doc.options.sre.style, modality: 'speech'});
    // This weeds out the case of providing a non-existent locale option.
    let locale = explorer.speechGenerator.getOptions().locale;
    if (locale !== Sre.engineSetup().locale) {
      doc.options.sre.locale = Sre.engineSetup().locale;
      explorer.speechGenerator.setOptions({locale: doc.options.sre.locale});
    }
    explorer.showRegion = 'subtitles';
    return explorer;
  },
  braille: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) => {
    let explorer = ke.SpeechExplorer.create(
      doc, doc.explorerRegions.brailleRegion, node, ...rest) as ke.SpeechExplorer;
    explorer.speechGenerator.setOptions({automark: false as any, markup: 'none',
                                         locale: 'nemeth', domain: 'default',
                                         style: 'default', modality: 'braille'});
    explorer.showRegion = 'viewBraille';
    return explorer;
  },
  keyMagnifier: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
    ke.Magnifier.create(doc, doc.explorerRegions.magnifier, node, ...rest),
  mouseMagnifier: (doc: ExplorerMathDocument, node: HTMLElement, ..._rest: any[]) =>
    me.ContentHoverer.create(doc, doc.explorerRegions.magnifier, node,
                             (x: HTMLElement) => x.hasAttribute('data-semantic-type'),
                             (x: HTMLElement) => x),
  hover: (doc: ExplorerMathDocument, node: HTMLElement, ..._rest: any[]) =>
    me.FlameHoverer.create(doc, null, node),
  infoType: (doc: ExplorerMathDocument, node: HTMLElement, ..._rest: any[]) =>
    me.ValueHoverer.create(doc, doc.explorerRegions.tooltip1, node,
                           (x: HTMLElement) => x.hasAttribute('data-semantic-type'),
                           (x: HTMLElement) => x.getAttribute('data-semantic-type')),
  infoRole: (doc: ExplorerMathDocument, node: HTMLElement, ..._rest: any[]) =>
    me.ValueHoverer.create(doc, doc.explorerRegions.tooltip2, node,
                           (x: HTMLElement) => x.hasAttribute('data-semantic-role'),
                           (x: HTMLElement) => x.getAttribute('data-semantic-role')),
  infoPrefix: (doc: ExplorerMathDocument, node: HTMLElement, ..._rest: any[]) =>
    me.ValueHoverer.create(doc, doc.explorerRegions.tooltip3, node,
                           (x: HTMLElement) => x.hasAttribute('data-semantic-prefix'),
                           (x: HTMLElement) => x.getAttribute('data-semantic-prefix')),
  flame: (doc: ExplorerMathDocument, node: HTMLElement, ..._rest: any[]) =>
    FlameColorer.create(doc, null, node),
  treeColoring: (doc: ExplorerMathDocument, node: HTMLElement, ...rest: any[]) =>
    TreeColorer.create(doc, null, node, ...rest)
};

export class ExplorerPool {

  /**
   * The currently attached explorers
   */
  protected attached: string[] = [];

  /**
   * True when a rerendered element should restart these explorers
   */
  protected restart: string[] = [];


  /**
   * The explorer dictionary.
   */
  public explorers: {[key: string]: Explorer} = {};

  /**
   *
   * @param  document The target document.
   * @param  node The node explorers will be attached to.
   * @param  mml The corresponding Mathml node as a string.
   */
  constructor(document: ExplorerMathDocument, node: HTMLElement, mml: string) {
    for (let key of Object.keys(allExplorers)) {
      this.explorers[key] = allExplorers[key](document, node, mml);
    }
  }

  /**
   * Attaches the explorers that are currently meant to be active given
   * the document options. Detaches all others.
   * @param {ExplorerMathDocument} document The current document.
   */
  public attach(document: ExplorerMathDocument) {
    this.attached = [];
    let keyExplorers = [];
    for (let key of Object.keys(this.explorers)) {
      let explorer = this.explorers[key];
      if (explorer instanceof ke.AbstractKeyExplorer) {
        explorer.AddEvents();
        explorer.stoppable = false;
        keyExplorers.unshift(explorer);
      }
      if (document.options.a11y[key]) {
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

  public reattach() {
    for (let key of this.attached) {
      let explorer = this.explorers[key];
      if (explorer.active) {
        this.restart.push(key);
        explorer.Stop();
      }
    }
  }

  public Restart() {
    this.restart.forEach(x => this.explorers[x].Start());
    this.restart = [];
  }

}
