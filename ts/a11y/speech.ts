/*************************************************************
 *
 *  Copyright (c) 2018-2026 The MathJax Consortium
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
import {
  MathDocument,
  MathDocumentConstructor,
  RenderActions,
} from '../core/MathDocument.js';
import {
  EnrichedMathItem,
  EnrichedMathDocument,
  EnrichHandler,
  ENRICH_OPTIONS,
} from './semantic-enrich.js';
import { STATE, newState } from '../core/MathItem.js';
import { MathML } from '../input/mathml.js';
import { expandable } from '../util/Options.js';
import { GeneratorPool } from './speech/GeneratorPool.js';
import { WorkerHandler } from './speech/WebWorker.js';
import { sreRoot } from '#root/sre-root.js';
import { localize } from './speech/__locales__/Component.js';
import { DOM, DOM_TYPES, Constructor } from '../types/Types.js';

/*==========================================================================*/

/**
 * Add STATE value for adding speech (after INSERTED)
 */
newState('ATTACHSPEECH', STATE.INSERTED + 10);

/*==========================================================================*/

/**
 * The functions added to MathItem for enrichment
 *
 * @template DOM   The DOM node types
 */
export interface SpeechMathItem<
  DOM extends DOM_TYPES,
> extends EnrichedMathItem<DOM> {
  /**
   * The speech generators for this math item.
   */
  generatorPool: GeneratorPool<DOM>;

  /**
   * @param {MathDocument} document  The document where speech is added
   */
  attachSpeech(document: MathDocument<DOM>): void;

  /**
   * @param {MathDocument} document The MathDocument for the MathItem
   */
  detachSpeech(document: MathDocument<DOM>): void;

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
 * @template DOM   The DOM node types
 * @template B     The MathItem class to extend
 */
export function SpeechMathItemMixin<
  DOM extends DOM_TYPES,
  B extends Constructor<EnrichedMathItem<DOM>>,
>(EnrichedMathItem: B): Constructor<SpeechMathItem<DOM>> & B {
  return class extends EnrichedMathItem {
    /**
     * @override
     */
    public generatorPool = new GeneratorPool<DOM>();

    /**
     * Attaches the aria labels for speech and braille.
     *
     * @param {MathDocument} document   The MathDocument for the MathItem
     */
    public attachSpeech(document: SpeechMathDocument<DOM>) {
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
    public detachSpeech(document: SpeechMathDocument<DOM>) {
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
 * The speech A11Y option types.
 */
export type A11Y_SPEECH_OPTIONS = {
  speech: boolean;
  braille: boolean;
};

/**
 * The speech option types.
 */
export type OPTIONS<DOM extends DOM_TYPES> = {
  enableSpeech: boolean;
  enableBraille: boolean;
  speechError: (
    doc: SpeechMathDocument<DOM>,
    math: SpeechMathItem<DOM>,
    err: string
  ) => void;
  worker: {
    path: string;
    maps: string;
    worker: string;
    debug: boolean;
  };
};

/**
 * The A11Y option object.
 */
export type A11Y_OPTIONS = {
  a11y: A11Y_SPEECH_OPTIONS;
};

/**
 * The SpeechMathDocument option types.
 */
export interface SPEECH_OPTIONS<DOM extends DOM_TYPES>
  extends OPTIONS<DOM>, A11Y_OPTIONS, ENRICH_OPTIONS<DOM> {
  MathItem: Constructor<SpeechMathItem<DOM>>;
}

/**
 * The speech option defaults.
 */
const options: OPTIONS<DOM> = {
  enableSpeech: true,
  enableBraille: true,
  speechError: (doc, math, err) => doc.speechError(doc, math, err),
  worker: {
    path: sreRoot(),
    maps: sreRoot().replace(/[cm]js\/a11y\/sre$/, 'bundle/sre/mathmaps'),
    worker: 'speech-worker.js',
    debug: false,
  },
};

/*==========================================================================*/

/**
 * The functions added to MathDocument for enrichment
 *
 * @template DOM   The DOM node types
 */
export interface SpeechMathDocument<
  DOM extends DOM_TYPES,
> extends EnrichedMathDocument<DOM> {
  /**
   * @override
   */
  options: SPEECH_OPTIONS<DOM>;

  /**
   * The webworker handler for the document
   */
  webworker: WorkerHandler<DOM>;

  /**
   * Attach speech to the MathItems in the MathDocument
   *
   * @returns {SpeechMathDocument}   The MathDocument (so calls can be chained)
   */
  attachSpeech(): this;

  /**
   * @param {SpeechMathDocument} doc   The MathDocument for the error
   * @param {SpeechMathItem} math      The MathItem causing the error
   * @param {string} err               The error message being processed
   */
  speechError(
    doc: SpeechMathDocument<DOM>,
    math: SpeechMathItem<DOM>,
    err: string
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
 * @template DOM   The DOM node types
 * @template B     The MathDocument class to extend
 */
export function SpeechMathDocumentMixin<
  DOM extends DOM_TYPES,
  B extends MathDocumentConstructor<EnrichedMathDocument<DOM>, DOM>,
>(
  EnrichedMathDocument: B
): MathDocumentConstructor<SpeechMathDocument<DOM>, DOM> & B {
  return class extends EnrichedMathDocument {
    /**
     * @override
     */
    public static OPTIONS = {
      ...EnrichedMathDocument.OPTIONS,
      ...options,
      renderActions: expandable<RenderActions<DOM>>({
        ...EnrichedMathDocument.OPTIONS.renderActions,
        attachSpeech: [STATE.ATTACHSPEECH],
      }),
      a11y: expandable<A11Y_SPEECH_OPTIONS>({
        speech: true,
        braille: true,
      }),
    };

    /**
     * @override
     */
    public options: SPEECH_OPTIONS<DOM>;

    /**
     * The webworker handler for the document
     */
    public webworker: WorkerHandler<DOM> = null;

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
        DOM,
        Constructor<EnrichedMathItem<DOM>>
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
    public attachSpeech(): this {
      if (!this.processed.isSet('attach-speech')) {
        const options = this.options;
        if (
          options.enableEnrichment &&
          (options.enableSpeech || options.enableBraille)
        ) {
          this.getWebworker();
          for (const math of this.math) {
            (math as SpeechMathItem<DOM>).attachSpeech(this);
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
      _doc: SpeechMathDocument<DOM>,
      _math: SpeechMathItem<DOM>,
      err: string
    ) {
      if (err) {
        console.warn(localize('SpeechError'), err);
      }
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
            (math as SpeechMathItem<DOM>).detachSpeech(this);
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
 * @template DOM   The DOM node types
 */
export function SpeechHandler<DOM extends DOM_TYPES>(
  handler: Handler<DOM>,
  MmlJax: MathML<DOM>
): Handler<DOM> {
  if (!handler.documentClass.prototype.enrich && MmlJax) {
    handler = EnrichHandler(handler, MmlJax);
  }
  handler.documentClass = SpeechMathDocumentMixin<
    DOM,
    MathDocumentConstructor<EnrichedMathDocument<DOM>, DOM>
  >(handler.documentClass as any);
  return handler;
}
