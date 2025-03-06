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

/**
 * @file Speech generator collections for enrichment and explorers.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { OptionList } from '../../util/Options.js';
import { LiveRegion } from '../explorer/Region.js';
import {
  buildLabel,
  buildSpeech,
  InPlace,
  SemAttr,
} from '../speech/SpeechUtil.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { MathItem } from '../../core/MathItem.js';
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
    this._options = Object.assign(
      {},
      options?.sre || {},
      {
        enableSpeech: options.enableSpeech,
        enableBraille: options.enableBraille
      }
    );
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
    if (this._init) return;
    this.adaptor = adaptor;
    this.options = options;
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
   * @param {MathItem} item   The MathItem to add speech to
   * @returns {Promise<void>}   The promise that resolves when the command is complete
   */
  public Speech(item: MathItem<N, T, D>): Promise<void> {
    const mml = item.outputData.mml;
    const options = Object.assign({}, this.options, { modality: 'speech' });
    return (this.promise = this.webworker.Speech(mml, options, item));
  }

  /**
   * Cancel a pending speech task
   *
   * @param {MathItem} item   The MathItem whose task is to be cancelled
   */
  public cancel(item: MathItem<N, T, D>) {
    this.webworker.Cancel(item);
  }

  /**
   * Computes the summary for the current node. Summary computations are very
   * fast, and we recompute in case the rule sets have changed and there is a
   * different summary.
   *
   * @param {N} node The typeset node.
   */
  public summary(node: N) {
    if (this.lastMove === InPlace.SUMMARY) {
      this.CleanUp(node);
      return;
    }
    this.lastSpeech.set(
      SemAttr.SPEECH,
      this.adaptor.getAttribute(node, SemAttr.SPEECH)
    );
    this.lastSpeech.set(
      SemAttr.SPEECH_SSML,
      this.adaptor.getAttribute(node, SemAttr.SPEECH_SSML)
    );
    this.adaptor.setAttribute(
      node,
      SemAttr.SPEECH_SSML,
      this.adaptor.getAttribute(node, SemAttr.SUMMARY_SSML)
    );
    this.adaptor.setAttribute(
      node,
      SemAttr.SPEECH,
      this.adaptor.getAttribute(node, SemAttr.SUMMARY)
    );
  }

  /**
   * Cleans up after an explorer move by replacing the aria-label with the
   * original speech again.
   *
   * @param {N} node The node to clean up.
   */
  public CleanUp(node: N) {
    if (this.lastMove) {
      this.adaptor.setAttribute(
        node,
        SemAttr.SPEECH,
        this.lastSpeech.get(SemAttr.SPEECH)
      );
      this.adaptor.setAttribute(
        node,
        SemAttr.SPEECH_SSML,
        this.lastSpeech.get(SemAttr.SPEECH_SSML)
      );
      // TODO (volker): Do this with the speech element only.
      this.adaptor.setAttribute(
        node,
        'aria-label',
        buildSpeech(this.getLabel(node))[0]
      );
      this.lastSpeech.clear();
    }
  }

  /**
   * Remembers the last speech element after a summary computation.
   */
  private lastSpeech: Map<SemAttr, string> = new Map();

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
   * Setter for last move. This implements toggling. If the current move is the
   * same as the previous it cancels out.
   *
   * @param {InPlace} move The latest move.
   */
  public set lastMove(move: InPlace) {
    this.lastMove_ = move !== this.lastMove_ ? move : InPlace.NONE;
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
    const speech = this.getLabel(node);
    speechRegion.Update(speech);
    this.adaptor.setAttribute(node, 'aria-label', buildSpeech(speech)[0]);
    brailleRegion.Update(this.adaptor.getAttribute(node, 'aria-braillelabel'));
  }

  /**
   * Retrieves the last options from the node.
   *
   * @param {N} node The root node of the expression.
   * @returns {OptionList} The relevant SRE options.
   */
  private getOptions(node: N): OptionList {
    return {
      locale: this.adaptor.getAttribute(node, 'data-semantic-locale') ?? '',
      domain: this.adaptor.getAttribute(node, 'data-semantic-domain') ?? '',
      style: this.adaptor.getAttribute(node, 'data-semantic-style') ?? '',
    };
  }

  /**
   * Cycles rule sets for the speech generator.
   *
   * @param {MathItem} item The MathItem whose rule set is changing
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public nextRules(item: MathItem<N, T, D>): Promise<void> {
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
   * @param {N} node The typeset node.
   * @param {MathItem} item The MathItem whose preferences are changing
   * @returns {Promise<void>} A promise that resolves when the command completes
   */
  public nextStyle(node: N, item: MathItem<N, T, D>): Promise<void> {
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
   * @param {N} node The typeset node.
   * @param {string=} _center Core speech. Defaults to `data-semantic-speech`.
   * @param {string=} sep The speech separator. Defaults to space.
   * @returns {string} The assembled label.
   */
  public getLabel(node: N, _center: string = '', sep: string = ' '): string {
    return buildLabel(
      this.adaptor.getAttribute(node, SemAttr.SPEECH_SSML),
      this.adaptor.getAttribute(node, SemAttr.PREFIX_SSML),
      // TODO: check if we need this or if it is automatic by the screen readers.
      this.adaptor.getAttribute(node, SemAttr.POSTFIX_SSML),
      sep
    );
  }

  /**
   * Outputs the depth of the node in the overal math expression. Computes it,
   * if necessary for a collapsed element.
   *
   * @param {N} node The node.
   * @param {N} root The root node of the expression.
   * @param {boolean} actionable If the node actionable (e.g., collapse).
   */
  public depth(node: N, root: N, actionable: boolean) {
    if (this.lastMove === InPlace.DEPTH) {
      this.CleanUp(node);
      return;
    }
    let postfix = '';
    let sep = '';
    if (actionable) {
      postfix =
        this.adaptor.getAttribute(
          root,
          this.adaptor.childNodes(node).length === 0
            ? 'data-semantic-expandable'
            : 'data-semantic-collapsible'
        ) ?? '';
      sep = ' ';
    }
    const depth =
      (this.adaptor.getAttribute(root, 'data-semantic-level') ?? '') +
      ' ' +
      (this.adaptor.getAttribute(node, 'aria-level') ?? '0');
    this.lastSpeech.set(
      SemAttr.SPEECH,
      this.adaptor.getAttribute(node, SemAttr.SPEECH)
    );
    this.lastSpeech.set(
      SemAttr.SPEECH_SSML,
      this.adaptor.getAttribute(node, SemAttr.SPEECH_SSML)
    );
    this.adaptor.setAttribute(
      node,
      SemAttr.SPEECH_SSML,
      `${depth}${sep}${postfix}`
    );
    this.adaptor.setAttribute(node, SemAttr.SPEECH, `${depth}${sep}${postfix}`);
  }
}
