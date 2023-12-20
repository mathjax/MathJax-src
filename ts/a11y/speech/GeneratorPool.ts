/*************************************************************
 *
 *  Copyright (c) 2009-2023 The MathJax Consortium
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

import {mathjax} from '../../mathjax.js';
import {Sre} from '../sre.js';
import {OptionList} from '../../util/Options.js';
import {LiveRegion} from '../explorer/Region.js';
import { getLabel, buildSpeech } from '../speech/SpeechUtil.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';

/**
 * @fileoverview Speech generator collections for enrichment and explorers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

export class GeneratorPool {

  private _element: Element;

  set element(element: Element) {
    this._element = element;
    const rebuilt = this.speechGenerator.computeRebuilt(element);
    this.brailleGenerator.setRebuilt(rebuilt);
    this.summaryGenerator.setRebuilt(rebuilt);
  }

  get element() {
    return this._element;
  }

  public constructor(public node: MmlNode) {
  }
  /**
   * The speech generator for a math item.
   */
  public speechGenerator = Sre.getSpeechGenerator('Tree');

  /**
   * The braille generator for a math item.
   */
  public brailleGenerator = Sre.getSpeechGenerator('Tree');

  /**
   * The summary generator for a math item.
   */
  public summaryGenerator = Sre.getSpeechGenerator('Summary');

  /**
   *  The current speech setting for Sre
   */
  private currentLocale = 'none';
  private currentBraille = 'none';
  private _options: OptionList = {};

  public set options(options: OptionList) {
    this._options = options;
    this.speechGenerator.setOptions(Object.assign(
      {}, options?.sre || {}, {
        modality: 'speech',
        markup: 'ssml',
        automark: true
      }));
    this.summaryGenerator.setOptions(Object.assign(
      {}, options?.sre || {}, {
        modality: 'summary',
        markup: 'ssml',
        automark: true,
      }));
    this.brailleGenerator.setOptions({
      locale: options?.sre?.braille,
      domain: 'default',
      style: 'default',
      modality: 'braille',
      markup: 'none',
    });
  }

  public get options() {
    return this._options;
  }

  /**
   * Init method for speech generation. Runs a retry until locales have been
   * loaded.
   *
   * @param {OptionList} options A list of options.
   */
  public init(options: OptionList) {
    this.options = options;
    if (this._update(options)) {
      mathjax.retryAfter(Sre.sreReady());
    }
  }

  /**
   * Update method for speech generation options. Runs a retry until locales have been
   * loaded.
   *
   * @param {OptionList} options A list of options.
   */
  public async update(options: OptionList) {
    this.options = options;
    return this._update(options) ? Sre.sreReady() : Promise.resolve();
  }

  private _update(options: OptionList) {
    let update = false;
    if (options?.sre?.locale !== this.currentLocale) {
      this.currentLocale = options.sre.locale;
      update = true;
      // TODO: Sort out the loading of the locales better
      Sre.setupEngine({locale: options.sre.locale})
    }
    if (options?.sre?.braille !== this.currentBraille) {
      this.currentBraille = options.sre.braille;
      update = true;
      Sre.setupEngine({locale: options.sre.braille})
    }
    return update;
  }

  public CleanUp(node: Element) {
    if (this.lastSummary) {
      // TODO: Remember the speech.
      node.setAttribute('aria-label', buildSpeech(getLabel(node))[0]);
    }
    this.lastSummary = false;
  }
  
  // Summary computations are very fast, and we recompute in case the rule sets
  // have changed and there is a different summary.
  public summary(node: Element) {
    this.lastSpeech = this.summaryGenerator.getSpeech(node, this.element)
    return this.lastSpeech;
  }

  private lastSpeech = '';
  private lastSummary = false;
  
  public UpdateSpeech(
    node: Element,
    speechRegion: LiveRegion,
    brailleRegion: LiveRegion
  ) {
    let speech = getLabel(node, this.lastSpeech);
    speechRegion.Update(speech);
    // TODO: See if we can reuse the speech from the speech region.
    node.setAttribute('aria-label', buildSpeech(speech)[0]);
    if (this.lastSpeech) {
      this.lastSummary = true;
    }
    this.lastSpeech = '';
    brailleRegion.Update(node.getAttribute('aria-braillelabel'));
  }

  public nextRules(_node: Element) {
    this.speechGenerator.nextRules();
  }

  public nextStyle(node: Element) {
    this.speechGenerator.nextStyle(node.getAttribute('data-semantic-id'));
  }

}
