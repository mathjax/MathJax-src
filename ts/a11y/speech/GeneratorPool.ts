/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
 * @file Speech generator collections for enrichment and explorers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { OptionList } from '../../util/Options.js';
import { LiveRegion } from '../explorer/Region.js';
import { buildLabel, SemAttr } from '../speech/SpeechUtil.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { SpeechMathItem } from '../speech.js';
import { WorkerHandler } from './WebWorker.js';

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class GeneratorPool<N, T, D> {
  private webworker: WorkerHandler<N, T, D>;
  private _element: Element;

  set element(element: Element) {
    this._element = element;
  }

  get element() {
    return this._element;
  }

  /**
   * The initial start of the promise chain.
   */
  public promise: Promise<void> = Promise.resolve();

  /**
   * The adaptor to work with typeset nodes.
   */
  public adaptor: DOMAdaptor<N, T, D> = null;

  /**
   *  The current speech setting for Sre
   */
  private _options: OptionList = {};

  /**
   * Option setter that takes care of setting up SRE and assembling the options
   * for the speech generators.
   *
   * @param {OptionList} options The option list.
   */
  public set options(options: OptionList) {
    this._options = Object.assign({}, options?.sre || {}, {
      enableSpeech: options.enableSpeech,
      enableBraille: options.enableBraille,
    });
    delete this._options.custom;
  }

  public get options() {
    return this._options;
  }

  private _init = false;

  /**
   * Init method for speech generation.
   *
   * @param {OptionList} options A list of options.
   * @param {DOMAdaptor} adaptor The DOM adaptor providing access to nodes.
   * @param {WorkerHandler} webworker The webworker with SRE.
   */
  public init(
    options: OptionList,
    adaptor: DOMAdaptor<N, T, D>,
    webworker: WorkerHandler<N, T, D>
  ) {
    this.options = options;
    if (this._init) return;
    this.adaptor = adaptor;
    this.webworker = webworker;
    this._init = true;
  }

  /**
   * Update method for speech generation options. Runs a retry until locales have been
   * loaded.
   *
   * @param {OptionList} options A list of options.
   */
  public update(options: OptionList) {
    Object.assign(this.options, options);
  }

  /**
   * Compute speech using the original MathML element as reference.
   *
   * @param {SpeechMathItem} item   The SpeechMathItem to add speech to
   * @returns {Promise<void>}       The promise that resolves when the command is complete
   */
  public Speech(item: SpeechMathItem<N, T, D>): Promise<void> {
    const mml = item.outputData.mml;
    const options = Object.assign({}, this.options, { modality: 'speech' });
    return (this.promise = this.webworker.Speech(mml, options, item));
  }

  public SpeechFor(item: SpeechMathItem<N, T, D>, mml: string): Promise<any> {
    const options = Object.assign({}, this.options, { modality: 'speech' });
    return this.webworker.speechFor(mml, options, item);
  }

  /**
   * Cancel a pending speech task
   *
   * @param {SpeechMathItem} item   The SpeechMathItem whose task is to be cancelled
   */
  public cancel(item: SpeechMathItem<N, T, D>) {
    this.webworker?.Cancel(item);
  }

  /**
   * Updates the given speech regions, possibly reinstanting previously saved
   * speech.
   *
   * @param {N} node                     The typeset node
   * @param {LiveRegion} speechRegion    The speech region.
   * @param {LiveRegion} brailleRegion   The braille region.
   */
  public updateRegions(
    node: N,
    speechRegion: LiveRegion,
    brailleRegion: LiveRegion
  ) {
    speechRegion.Update(this.getLabel(node));
    brailleRegion.Update(this.getBraille(node));
  }

  /**
   * Retrieves the last options from the node.
   *
   * @param {N} node         The root node of the expression.
   * @returns {OptionList}   The relevant SRE options.
   */
  private getOptions(node: N): OptionList {
    return {
      locale: this.adaptor.getAttribute(node, 'data-semantic-locale') ?? '',
      domain: this.adaptor.getAttribute(node, 'data-semantic-domain') ?? '',
      style: this.adaptor.getAttribute(node, 'data-semantic-style') ?? '',
      domain2style:
        this.adaptor.getAttribute(node, 'data-semantic-domain2style') ?? '',
    };
  }

  /**
   * Cycles rule sets for the speech generator.
   *
   * @param {SpeechMathItem} item   The SpeechMathItem whose rule set is changing
   * @returns {Promise<void>}       A promise that resolves when the command completes
   */
  public nextRules(item: SpeechMathItem<N, T, D>): Promise<void> {
    const options = this.getOptions(item.typesetRoot);
    this.update(options);
    return (this.promise = this.webworker.nextRules(
      item.outputData.mml,
      Object.assign({}, this.options, { modality: 'speech' }),
      item
    ));
  }

  /**
   * Cycles style or preference settings for the speech generator.
   *
   * @param {N} node                The typeset node.
   * @param {SpeechMathItem} item   The SpeechMathItem whose preferences are changing
   * @returns {Promise<void>}       A promise that resolves when the command completes
   */
  public nextStyle(node: N, item: SpeechMathItem<N, T, D>): Promise<void> {
    const options = this.getOptions(item.typesetRoot);
    this.update(options);
    return (this.promise = this.webworker.nextStyle(
      item.outputData.mml,
      Object.assign({}, this.options, { modality: 'speech' }),
      this.adaptor.getAttribute(node, 'data-semantic-id'),
      item
    ));
  }

  /**
   * Computes the speech label from the node combining prefixes and postfixes.
   *
   * @param {N} node            The typeset node.
   * @param {string=} _center   Core speech. Defaults to `data-semantic-speech`.
   * @param {string=} sep       The speech separator. Defaults to space.
   * @returns {string}          The assembled label.
   */
  public getLabel(node: N, _center: string = '', sep: string = ' '): string {
    const adaptor = this.adaptor;
    return (
      buildLabel(
        adaptor.getAttribute(node, SemAttr.SPEECH_SSML),
        adaptor.getAttribute(node, SemAttr.PREFIX_SSML),
        // TODO: check if we need this or if it is automatic by the screen readers.
        adaptor.getAttribute(node, SemAttr.POSTFIX_SSML),
        sep
      ) || adaptor.getAttribute(node, 'aria-label')
    );
  }

  /**
   * Computes the braille label from the node.
   *
   * @param {N} node            The typeset node.
   * @returns {string}          The assembled label.
   */
  public getBraille(node: N): string {
    const adaptor = this.adaptor;
    return (
      adaptor.getAttribute(node, 'aria-braillelabel') ||
      adaptor.getAttribute(node, SemAttr.BRAILLE)
    );
  }

  /*********************************************************/
  /**
   * Menu related functions.
   */
  /**
   * Computes the clearspeak preferences for the current locale.
   *
   * @param {Map<string, { [prop: string]: string[] }>} prefs Map to store the compute preferences.
   * @returns {Promise<void>} The promise that resolves when the command is complete
   */
  public getLocalePreferences(
    prefs: Map<string, { [prop: string]: string[] }>
  ): Promise<void> {
    return (this.promise = this.webworker.clearspeakLocalePreferences(
      this.options,
      prefs
    ));
  }

  /**
   * Computes the clearspeak preferences that are semantically relevant for the
   * currently focused node.
   *
   * @param {SpeechMathItem} item The SpeechMathItem where is menu is opened.
   * @param {string} semantic The semantic id of the last focused node.
   * @param {Map<number, string>} prefs Map for recording the computed preference.
   * @param {number} counter Counter for storing the result in the map.
   * @returns {Promise<void>} The promise that resolves when the command is complete
   */
  public getRelevantPreferences(
    item: SpeechMathItem<N, T, D>,
    semantic: string,
    prefs: Map<number, string>,
    counter: number
  ): Promise<void> {
    const mml = item.outputData.mml;
    return (this.promise = this.webworker.clearspeakRelevantPreferences(
      mml,
      semantic,
      prefs,
      counter
    ));
  }
}
