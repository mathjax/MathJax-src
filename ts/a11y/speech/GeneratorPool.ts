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
import { buildLabel, buildSpeech, updateAria, honk } from '../speech/SpeechUtil.js';
// import { MathItem } from '../../core/MathItem.js';

/**
 * @fileoverview Speech generator collections for enrichment and explorers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

export class GeneratorPool {

  private _node: Element;

  set node(node: Element) {
    this._node = node;
    const rebuilt = this.speechGenerator.computeRebuilt(node);
    this.brailleGenerator.setRebuilt(rebuilt);
    this.summaryGenerator.setRebuilt(rebuilt);
  }

  get node() {
    return this._node;
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

  public init(options: OptionList) {
    this.options = options;
    if (this._update(options)) {
      mathjax.retryAfter(Sre.sreReady());
    }
  }

  public update(options: OptionList) {
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

  public summary(node: Element) {
    return this.summaryGenerator.getSpeech(node, this.node);
  }

  public UpdateSpeech(
    node: Element,
    speechRegion: LiveRegion,
    brailleRegion: LiveRegion
  ) {
    console.log(0);
    speechRegion.Update(
      buildLabel(
        node.getAttribute('data-semantic-speech'),
        node.getAttribute('data-semantic-prefix'),
        node.getAttribute('data-semantic-postfix')
      ));
    brailleRegion.Update(node.getAttribute('aria-braillelabel'));
  }

}
