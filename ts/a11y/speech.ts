/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  Mixin that adds semantic enrichment to internal MathML
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { Handler } from '../core/Handler.js';
import { MathDocument, MathDocumentConstructor } from '../core/MathDocument.js';
import {
  EnrichedMathItem,
  EnrichedMathDocument,
  EnrichHandler,
} from './semantic-enrich.js';
import { STATE, newState } from '../core/MathItem.js';
import { MathML } from '../input/mathml.js';
import { OptionList, expandable } from '../util/Options.js';
import { GeneratorPool } from './speech/GeneratorPool.js';
import { WorkerHandler } from './speech/WebWorker.js';
import { sreRoot } from '#root/sre-root.js';

/*==========================================================================*/

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new (...args: any[]) => T;

/*==========================================================================*/

/**
 * Add STATE value for adding speech (after INSERTED)
 */
newState('ATTACHSPEECH', STATE.INSERTED + 10);

/*==========================================================================*/

/**
 * The functions added to MathItem for enrichment
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SpeechMathItem<N, T, D> extends EnrichedMathItem<N, T, D> {
  /**
   * The speech generators for this math item.
   */
  generatorPool: GeneratorPool<N, T, D>;

  /**
   * @param {MathDocument} document  The document where speech is added
   */
  attachSpeech(document: MathDocument<N, T, D>): void;

  /**
   * @param {MathDocument} document The MathDocument for the MathItem
   */
  detachSpeech(document: MathDocument<N, T, D>): void;

  /**
   * @param {string} mml The MathML whose speech is needed.
   * @returns {Promise<[string,string]>}  A promise for the speech and braille strings
   */
  speechFor(mml: string): Promise<[string, string]>;
}

/**
 * The mixin for adding speech to MathItems
 *
 * @param {B} EnrichedMathItem     The MathItem class to be extended
 * @returns {SpeechMathItem}  The enriched MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function SpeechMathItemMixin<
  N,
  T,
  D,
  B extends Constructor<EnrichedMathItem<N, T, D>>,
>(EnrichedMathItem: B): Constructor<SpeechMathItem<N, T, D>> & B {
  return class extends EnrichedMathItem {
    /**
     * @override
     */
    public generatorPool = new GeneratorPool<N, T, D>();

    /**
     * Attaches the aria labels for speech and braille.
     *
     * @param {MathDocument} document   The MathDocument for the MathItem
     */
    public attachSpeech(document: SpeechMathDocument<N, T, D>) {
      this.outputData.speechPromise = null;
      if (this.state() >= STATE.ATTACHSPEECH) return;
      this.state(STATE.ATTACHSPEECH);
      if (
        this.isEscaped ||
        !(document.options.enableSpeech || document.options.enableBraille) ||
        !document.options.enableEnrichment
      ) {
        return;
      }
      document.getWebworker();
      this.generatorPool.init(
        document.options,
        document.adaptor,
        document.webworker
      );
      this.outputData.mml = this.toMathML(this.root, this);
      const promise = this.generatorPool
        .Speech(this)
        .catch((err) => document.options.speechError(document, this, err));
      document.savePromise(promise);
      this.outputData.speechPromise = promise;
    }

    /**
     * @param {SpeechMathDocument} document  The MathDocument for the MathItem
     */
    public detachSpeech(document: SpeechMathDocument<N, T, D>) {
      document.webworker.Detach(this);
    }

    /**
     * @param {string} mml The MathML whose speech is needed.
     * @returns {Promise<[string,string]>}  A promise for the speech and braille strings
     */
    public async speechFor(mml: string): Promise<[string, string]> {
      mml = this.toEnriched(mml);
      const data = await this.generatorPool.SpeechFor(this, mml);
      return [data.label, data.braillelabel];
    }

    /**
     * @override
     */
    clear() {
      this.generatorPool.cancel(this);
    }
  };
}

/*==========================================================================*/

/**
 * The functions added to MathDocument for enrichment
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SpeechMathDocument<N, T, D> extends EnrichedMathDocument<
  N,
  T,
  D
> {
  /**
   * The webworker handler for the document
   */
  webworker: WorkerHandler<N, T, D>;

  /**
   * Attach speech to the MathItems in the MathDocument
   *
   * @returns {SpeechMathDocument}   The MathDocument (so calls can be chained)
   */
  attachSpeech(): SpeechMathDocument<N, T, D>;

  /**
   * @param {SpeechMathDocument} doc   The MathDocument for the error
   * @param {SpeechMathItem} math      The MathItem causing the error
   * @param {Error} err                  The error being processed
   */
  speechError(
    doc: SpeechMathDocument<N, T, D>,
    math: SpeechMathItem<N, T, D>,
    err: Error
  ): void;

  /**
   * Set up the worker handler for this document
   */
  getWebworker(): void;
}

/**
 * The mixin for adding enrichment to MathDocuments
 *
 * @param {B} EnrichedMathDocument The MathDocument class to be extended
 * @returns {SpeechMathDocument}  The enriched MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function SpeechMathDocumentMixin<
  N,
  T,
  D,
  B extends MathDocumentConstructor<EnrichedMathDocument<N, T, D>>,
>(
  EnrichedMathDocument: B
): MathDocumentConstructor<SpeechMathDocument<N, T, D>> & B {
  return class extends EnrichedMathDocument {
    /**
     * @override
     */
    public static OPTIONS: OptionList = {
      ...EnrichedMathDocument.OPTIONS,
      enableSpeech: true,
      enableBraille: true,
      speechError: (
        doc: SpeechMathDocument<N, T, D>,
        math: SpeechMathItem<N, T, D>,
        err: Error
      ) => doc.speechError(doc, math, err),
      renderActions: expandable({
        ...EnrichedMathDocument.OPTIONS.renderActions,
        attachSpeech: [STATE.ATTACHSPEECH],
      }),
      worker: {
        path: sreRoot(),
        maps: sreRoot().replace(/[cm]js\/a11y\/sre$/, 'bundle/sre/mathmaps'),
        worker: 'speech-worker.js',
        debug: false,
      },
      a11y: expandable({
        speech: true, //    // switch on speech output
        braille: true, //   // switch on Braille output
      }),
    };

    /**
     * The webworker handler for the document
     */
    public webworker: WorkerHandler<N, T, D> = null;

    /**
     * Enrich the MathItem class used for this MathDocument, and create the
     *   temporary MathItem used for enrchment
     *
     * @override
     * @class
     */
    constructor(...args: any[]) {
      super(...args);
      const ProcessBits = (this.constructor as typeof EnrichedMathDocument)
        .ProcessBits;
      if (!ProcessBits.has('attach-speech')) {
        ProcessBits.allocate('attach-speech');
      }
      this.options.MathItem = SpeechMathItemMixin<
        N,
        T,
        D,
        Constructor<EnrichedMathItem<N, T, D>>
      >(this.options.MathItem);
    }

    /**
     * Set up the worker handler for this document
     */
    public getWebworker() {
      if (this.webworker) return;
      this.webworker = new WorkerHandler(this.adaptor, this.options.worker);
      this.webworker.Start();
    }

    /**
     * Attach speech from a MathItem to a node
     *
     * @returns {SpeechMathDocument} The object for chaining.
     */
    public attachSpeech(): SpeechMathDocument<N, T, D> {
      if (!this.processed.isSet('attach-speech')) {
        const options = this.options;
        if (
          options.enableEnrichment &&
          (options.enableSpeech || options.enableBraille)
        ) {
          this.getWebworker();
          for (const math of this.math) {
            (math as SpeechMathItem<N, T, D>).attachSpeech(this);
          }
        }
        this.processed.set('attach-speech');
      }
      return this;
    }

    /**
     * @override
     */
    public speechError(
      _doc: SpeechMathDocument<N, T, D>,
      _math: SpeechMathItem<N, T, D>,
      err: Error
    ) {
      console.warn('Speech generation error:', err);
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.ATTACHSPEECH) {
        this.processed.clear('attach-speech');
        if (state >= STATE.TYPESET) {
          for (const math of this.math) {
            (math as SpeechMathItem<N, T, D>).detachSpeech(this);
          }
        }
      }
      return this;
    }

    /**
     * @override
     */
    public async done() {
      await this.webworker?.Stop();
      return super.done();
    }
  };
}

/*==========================================================================*/

/**
 * Add a speech Handler instance
 *
 * @param {Handler} handler   The Handler instance to speech
 * @param {MathML} MmlJax     The MathML input jax to use for reading the enriched MathML
 * @returns {Handler}         The handler that was modified (for purposes of chainging extensions)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function SpeechHandler<N, T, D>(
  handler: Handler<N, T, D>,
  MmlJax: MathML<N, T, D>
): Handler<N, T, D> {
  if (!handler.documentClass.prototype.enrich && MmlJax) {
    handler = EnrichHandler(handler, MmlJax);
  }
  handler.documentClass = SpeechMathDocumentMixin(handler.documentClass as any);
  return handler;
}
