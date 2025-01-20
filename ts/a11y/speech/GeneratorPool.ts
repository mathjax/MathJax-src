/*************************************************************
 *
 *  Copyright (c) 2009-2024 The MathJax Consortium
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

import { mathjax } from '../../mathjax.js';
import * as Sre from '../sre.js';
import { OptionList } from '../../util/Options.js';
import { LiveRegion } from '../explorer/Region.js';
import { buildLabel, buildSpeech, InPlace } from '../speech/SpeechUtil.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';

/**
 * @file Speech generator collections for enrichment and explorers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

/**
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class GeneratorPool<N, T, D> {
  private _element: Element;

  set element(element: Element) {
    this._element = element;
    // We always force a rebuild of the semantic tree, in case the element was
    // re-rendered. Otherwise we might have incorrect maction links etc.
    const rebuilt = this.speechGenerator.computeRebuilt(element, true);
    this.brailleGenerator.setRebuilt(rebuilt);
    this.summaryGenerator.setRebuilt(rebuilt);
  }

  get element() {
    return this._element;
  }

  /**
   * The adaptor to work with typeset nodes.
   */
  public adaptor: DOMAdaptor<N, T, D> = null;

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
  private static currentLocale = 'none';
  private static currentBraille = 'none';
  private _options: OptionList = {};

  /**
   * Option setter that takes care of setting up SRE and assembling the options
   * for the speech generators.
   *
   * @param {OptionList} options The option list.
   */
  public set options(options: OptionList) {
    this._options = options;
    Sre.setupEngine(options.sre);
    this.speechGenerator.setOptions(
      Object.assign({}, options?.sre || {}, {
        modality: 'speech',
        markup: 'ssml',
        automark: true,
      })
    );
    this.summaryGenerator.setOptions(
      Object.assign({}, options?.sre || {}, {
        modality: 'summary',
        markup: 'ssml',
        automark: true,
      })
    );
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

  private _init = false;

  /**
   * Init method for speech generation. Runs a retry until locales have been
   * loaded.
   *
   * @param {OptionList} options A list of options.
   * @param {DOMAdaptor} adaptor The DOM adaptor providing access to nodes.
   */
  public init(options: OptionList, adaptor: DOMAdaptor<N, T, D>) {
    if (this._init) return;
    this.adaptor = adaptor;
    this.options = options;
    this._init = true;
    if (this._update(options)) {
      mathjax.retryAfter(Sre.sreReady());
    }
  }

  /**
   * Update method for speech generation options. Runs a retry until locales have been
   * loaded.
   *
   * @param {OptionList} options A list of options.
   * @returns {boolean} True if the speech or Braille locale needed updating.
   */
  public update(options: OptionList): boolean {
    this.options = options;
    return this._update(options);
  }

  /**
   * Updates locales for Braille and speech if necessary.
   *
   * @param {OptionList} options A list of options.
   * @returns {boolean} True if the speech or Braille locale needed updating.
   */
  private _update(options: OptionList): boolean {
    if (!options || !options.sre) return false;
    let update = false;
    if (options.sre.braille !== GeneratorPool.currentBraille) {
      GeneratorPool.currentBraille = options.sre.braille;
      update = true;
      Sre.setupEngine({ locale: options.sre.braille });
    }
    if (options.sre.locale !== GeneratorPool.currentLocale) {
      GeneratorPool.currentLocale = options.sre.locale;
      update = true;
      Sre.setupEngine({ locale: options.sre.locale });
    }
    return update;
  }

  // /**
  //  * Compute speech using the original MathML element as reference.
  //  *
  //  * @param {N} node The typeset node.
  //  * @param {string} mml The serialized mml node.
  //  * @returns {[string, string]} Speech and Braille expression pair.
  //  */
  // public computeSpeech(node: N, mml: string, worker: WorkerHandler): [string, string] {
  //   const id = worker.counter;
  //   this.adaptor.setAttribute(node, 'data-worker', id);
  //   // TODO: attach all the speech elements here!
  //   worker.Speech(mml, id);

  //   // this.element = Sre.parseDOM(mml);
  //   // const xml = this.prepareXml(node);
  //   // const speech = this.options.enableSpeech
  //   //   ? this.speechGenerator.getSpeech(xml, this.element)
  //   //   : '';
  //   // const braille = this.options.enableBraille
  //   //   ? this.brailleGenerator.getSpeech(xml, this.element)
  //   //   : '';
  //   // if (speech || braille) {
  //   //   // this.setAria(node, xml, this.options.sre.locale);
  //   // }
  //   // return [speech, braille];
  // }

  /**
   * Computes the summary for the current node. Summary computations are very
   * fast, and we recompute in case the rule sets have changed and there is a
   * different summary.
   *
   * @param {N} node The typeset node.
   * @returns {string} The last computed speech elements.
   */
  public summary(node: N): string {
    if (this.lastMove === InPlace.SUMMARY) {
      this.CleanUp(node);
      return this.lastSpeech;
    }
    const xml = this.prepareXml(node);
    this.lastSpeech = this.summaryGenerator.getSpeech(xml, this.element);
    return this.lastSpeech;
  }

  /**
   * Cleans up after an explorer move by replacing the aria-label with the
   * original speech again.
   *
   * @param {N} node The node to clean up.
   */
  public CleanUp(node: N) {
    if (this.lastMove) {
      // TODO: Remember the speech.
      this.adaptor.setAttribute(
        node,
        'aria-label',
        buildSpeech(this.getLabel(node))[0]
      );
    }
    this.lastMove = InPlace.NONE;
  }

  /**
   * Remembers the last speech element after a summary computation.
   */
  private lastSpeech = '';

  /**
   * Remembers whether the last speech computation was in-place, i.e., a summary
   * or depth computation.
   */
  private lastMove_ = InPlace.NONE;

  /**
   * Getter for last move.
   *
   * @returns {InPlace} The move value.
   */
  public get lastMove(): InPlace {
    return this.lastMove_;
  }

  /**
   * Setter for last move.
   *
   * @param {InPlace} move The latest move.
   */
  public set lastMove(move: InPlace) {
    this.lastMove_ = this.lastSpeech ? move : InPlace.NONE;
  }

  /**
   * Updates the given speech regions, possibly reinstanting previously saved
   * speech.
   *
   * @param {N} node The typeset node
   * @param {LiveRegion} speechRegion The speech region.
   * @param {LiveRegion} brailleRegion The braille region.
   */
  public updateRegions(
    node: N,
    speechRegion: LiveRegion,
    brailleRegion: LiveRegion
  ) {
    const speech = this.getLabel(node, this.lastSpeech);
    speechRegion.Update(speech);
    this.adaptor.setAttribute(node, 'aria-label', buildSpeech(speech)[0]);
    this.lastSpeech = '';
    brailleRegion.Update(this.adaptor.getAttribute(node, 'aria-braillelabel'));
  }

  /**
   * Updates the speech in the give node.
   *
   * Refactor: This is called when we change rule sets
   *
   * @param {N} node The typeset node.
   * @returns {string} The aria label to speak.
   */
  public updateSpeech(node: N): string {
    const xml = this.prepareXml(node);
    const speech = this.speechGenerator.getSpeech(xml, this.element);
    // this.setAria(node, xml, this.options.sre.locale);
    const label = buildSpeech(speech)[0];
    this.adaptor.setAttribute(node, 'aria-label', label);
    return label;
  }

  /**
   * Cycles rule sets for the speech generator.
   *
   * @param {N} _node The typeset node.
   */
  public nextRules(_node: N) {
    this.speechGenerator.nextRules();
    this.updateSummaryGenerator();
  }

  /**
   * Cycles style or preference settings for the speech generator.
   *
   * @param {N} node The typeset node.
   */
  public nextStyle(node: N) {
    this.speechGenerator.nextStyle(
      this.adaptor.getAttribute(node, 'data-semantic-id')
    );
    this.updateSummaryGenerator();
  }

  /**
   * Copies domain and style option from speech to summary generator. This is
   * necessary after when either option is changed on the fly.
   */
  private updateSummaryGenerator() {
    const options = this.speechGenerator.getOptions();
    this.summaryGenerator.setOption('domain', options['domain']);
    this.summaryGenerator.setOption('style', options['style']);
  }

  /**
   * Makes a node amenable for SRE computations by reparsing.
   *
   * @param {N} node The node.
   * @returns {Element} The reparsed element.
   */
  private prepareXml(node: N): Element {
    return Sre.parseDOM(this.adaptor.serializeXML(node));
  }

  /**
   * Speech, labels and aria
   */

  /**
   * Computes the speech label from the node combining prefixes and postfixes.
   *
   * @param {N} node The typeset node.
   * @param {string=} center Core speech. Defaults to `data-semantic-speech`.
   * @param {string=} sep The speech separator. Defaults to space.
   * @returns {string} The assembled label.
   */
  public getLabel(node: N, center: string = '', sep: string = ' '): string {
    return buildLabel(
      center || this.adaptor.getAttribute(node, 'data-semantic-speech'),
      this.adaptor.getAttribute(node, 'data-semantic-prefix'),
      // TODO: check if we need this or if it is automatic by the screen readers.
      this.adaptor.getAttribute(node, 'data-semantic-postfix'),
      sep
    );
  }

  /**
   * Copies an attribute from the enriched element to the current typeset node.
   *
   * @param {Element} xml The enriched XML.
   * @param {N} node The typeset node.
   * @param {string} attr The attribute to copy.
   */
  private copyAttributes(xml: Element, node: N, attr: string) {
    const value = xml.getAttribute(attr);
    if (value !== undefined && value !== null) {
      this.adaptor.setAttribute(node, attr, value);
    }
  }

  /**
   * Attributes to be copied after updating speech.
   */
  private attrList: string[] = [
    'data-semantic-prefix',
    'data-semantic-postfix',
    'data-semantic-speech',
    'data-semantic-braille',
  ];

  /**
   * Attributes to be copied after an element was collapsed.
   */
  private dummyList: string[] = [
    'data-semantic-id',
    'data-semantic-parent',
    'data-semantic-type',
    'data-semantic-role',
    'role',
  ];

  /**
   * Retrieve and sets aria and braille labels recursively.
   *
   * @param {N} node The root node to search from.
   * @param {Element} xml The enriched XML node.
   * @param {string} locale The locale to use for Aria labels.
   */
  public setAria(node: N, xml: Element, locale: string) {
    const kind = xml.getAttribute('data-semantic-type');
    if (kind) {
      this.attrList.forEach((attr) => this.copyAttributes(xml, node, attr));
      if (kind === 'dummy') {
        this.dummyList.forEach((attr) => this.copyAttributes(xml, node, attr));
      }
    }
    if (this.options.a11y.speech) {
      const speech = this.getLabel(node);
      if (speech) {
        this.adaptor.setAttribute(
          node,
          'aria-label',
          buildSpeech(speech, locale)[0]
        );
      }
    }
    if (this.options.a11y.braille) {
      const braille = this.adaptor.getAttribute(node, 'data-semantic-braille');
      if (braille) {
        this.adaptor.setAttribute(node, 'aria-braillelabel', braille);
      }
    }
    const xmlChildren = Array.from(xml.childNodes);
    Array.from(this.adaptor.childNodes(node)).forEach((child, index) => {
      if (
        this.adaptor.kind(child) !== '#text' &&
        this.adaptor.kind(child) !== '#comment'
      ) {
        this.setAria(child as N, xmlChildren[index] as Element, locale);
      }
    });
  }

  /**
   * Computes the depth of the node in the overal math expression.
   *
   * @param {N} node The node.
   * @param {boolean} actionable If the node actionable (e.g., link, collapse).
   * @returns {string} The last speech.
   */
  public depth(node: N, actionable: boolean) {
    if (this.lastMove === InPlace.DEPTH) {
      this.CleanUp(node);
      return this.lastSpeech;
    }
    const postfix = this.summaryGenerator.getActionable(
      actionable ? (this.adaptor.childNodes(node).length === 0 ? -1 : 1) : 0
    );
    const depth = this.summaryGenerator.getLevel(
      this.adaptor.getAttribute(node, 'aria-level')
    );
    this.lastSpeech = `${depth} ${postfix}`;
    return this.lastSpeech;
  }
}
