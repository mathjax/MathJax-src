/*************************************************************
 *
 *  Copyright (c) 2018-2024 The MathJax Consortium
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
  enrichVisitor,
} from './semantic-enrich.js';
import { MathItem, STATE, newState } from '../core/MathItem.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MathML } from '../input/mathml.js';
import { OptionList, expandable } from '../util/Options.js';
import { GeneratorPool } from './speech/GeneratorPool.js';
import { WorkerHandler } from './speech/WebWorker.js';

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
  // detachSpeech(document: MathDocument<N, T, D>): void;
}

/**
 * The mixin for adding speech to MathItems
 *
 * @param {B} EnrichedMathItem     The MathItem class to be extended
 * @param {Function} toMathML  The function to serialize the internal MathML
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
>(
  EnrichedMathItem: B,
  toMathML: (node: MmlNode, math: MathItem<N, T, D>) => string
): Constructor<SpeechMathItem<N, T, D>> & B {
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
    public attachSpeech(document: MathDocument<N, T, D>) {
      if (this.state() >= STATE.ATTACHSPEECH) return;
      this.state(STATE.ATTACHSPEECH);
      if (this.isEscaped || !document.options.enableEnrichment) return;
      this.generatorPool.init(
        document.options,
        document.adaptor,
        (document as SpeechMathDocument<N, T, D>).webworker
      );
      if (document.options.enableSpeech || document.options.enableBraille) {
        try {
          this.outputData.mml = toMathML(this.root, this);
          this.generatorPool.Speech(this.typesetRoot, this.outputData.mml);
        } catch (err) {
          document.options.speechError(document, this, err);
        }
      }
    }

    /**
     * @param {MathDocument} document  The MathDocument for the MathItem
     */
    // public detachSpeech(_document: MathDocument<N, T, D>) {
    //   // remove all the speech elements?
    //   // Do we need this. Nothing is stored on the root anymore!
    // }
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
export interface SpeechMathDocument<N, T, D>
  extends EnrichedMathDocument<N, T, D> {
  /**
   * Attach speech to the MathItems in the MathDocument
   *
   * @returns {SpeechMathDocument}   The MathDocument (so calls can be chained)
   */
  attachSpeech(): SpeechMathDocument<N, T, D>;

  /**
   * Attach speech to the MathItems in the MathDocument
   *
   * @returns {SpeechMathDocument}   The MathDocument (so calls can be chained)
   */
  // detachSpeech(): SpeechMathDocument<N, T, D>;

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

  webworker: WorkerHandler<N, T, D>;
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
        path: 'https://localhost',
        basedir: 'sre',
        pool: 'speech-workerpool.html',
        worker: 'speech-worker.js',
        sre: 'sre.js',
        debug: false,
      },
      /* prettier-ignore */
      speechTiming: {
        asynchronous: true,                // true to allow screen updates while adding speech, false to not
        initial: 100,                      // initial delay until starting to add speech
        threshold: 250,                    // time (in milliseconds) to process speech before letting screen update
        intermediate: 10                   // delay after processing speech reaches the threshold
      },
      /* prettier-ignore */
      sre: expandable({
        speech: 'none',                    // by default no speech is included
        locale: 'en',                      // switch the locale
        domain: 'clearspeak',              // speech rules domain
        style: 'default',                  // speech rules style
        braille: 'nemeth',                 // TODO: Dummy switch for braille
        structure: true,                   // Generates full aria structure
        aria: true,
      }),
      /* prettier-ignore */
      a11y: expandable({
        speech: true,                      // switch on speech output
        braille: true,                     // switch on Braille output
      }),
    };

    /**
     * The list of MathItems that need to be processed for speech
     */
    protected awaitingSpeech: MathItem<N, T, D>[];

    /**
     * The identifier from setTimeout for the next speech loop
     */
    protected speechTimeout: number = 0;

    /**
     * The function to resolve when the speech loop finishes
     */
    protected attachSpeechDone: () => void;

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
      const visitor = new enrichVisitor<N, T, D>(this.mmlFactory);
      const toMathML = (node: MmlNode, math: MathItem<N, T, D>) =>
        visitor.visitTree(node, math);
      this.options.MathItem = SpeechMathItemMixin<
        N,
        T,
        D,
        Constructor<EnrichedMathItem<N, T, D>>
      >(this.options.MathItem, toMathML);
    }

    // TODO: Do we still need async handling here?
    /**
     * Attach speech from a MathItem to a node
     *
     * @returns {SpeechMathDocument} The object for chaining.
     */
    public attachSpeech(): SpeechMathDocument<N, T, D> {
      if (!this.processed.isSet('attach-speech')) {
        if (this.options.enableSpeech || this.options.enableBraille) {
          if (!this.webworker) {
            this.webworker = new WorkerHandler(
              this.adaptor,
              this.options.worker
            );
            this.webworker.Start();
            this.webworker.Import();
          }
          if (this.options.speechTiming.asynchronous) {
            this.attachSpeechAsync();
          } else {
            this.attachSpeechSync();
          }
        }
        this.processed.set('attach-speech');
      }
      return this;
    }

    /**
     * Add speech synchronously (e.g., for use in node applications on the server)
     */
    protected attachSpeechSync() {
      for (const math of this.math) {
        (math as SpeechMathItem<N, T, D>).attachSpeech(this);
      }
    }

    /**
     * Add speech in small chunks, allowing screen updates in between
     * (e.g., helpful with lazy typesetting)
     */
    protected attachSpeechAsync() {
      if (this.speechTimeout) {
        clearTimeout(this.speechTimeout);
        this.speechTimeout = 0;
        this.attachSpeechDone();
      }
      this.awaitingSpeech = Array.from(this.math);
      if (this.awaitingSpeech.length === 0) {
        this.awaitingSpeech = null;
        return;
      }
      this.renderPromises.push(
        new Promise<void>((ok, _fail) => {
          this.attachSpeechDone = ok;
        })
      );
      this.speechTimeout = setTimeout(
        () => this.attachSpeechLoop(),
        this.options.speechTiming.initial
      );
    }

    /**
     * Loops through math items to attach speech until the timeout threshold is reached.
     */
    protected attachSpeechLoop() {
      const timing = this.options.speechTiming;
      const awaitingSpeech = this.awaitingSpeech;
      const timeStart = new Date().getTime();
      const timeEnd = timeStart + timing.threshold;
      do {
        const math = awaitingSpeech.shift();
        (math as SpeechMathItem<N, T, D>).attachSpeech(this);
      } while (awaitingSpeech.length && new Date().getTime() < timeEnd);
      if (awaitingSpeech.length) {
        this.speechTimeout = setTimeout(
          () => this.attachSpeechLoop(),
          timing.intermediate
        );
      } else {
        this.speechTimeout = 0;
        this.attachSpeechDone();
      }
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
      }
      return this;
    }
  };
}

/*==========================================================================*/

/**
 * Add a speech Handler instance
 *
 * @param {Handler} handler   The Handler instance to speech
 * @param {MathML} MmlJax     The MathML input jax to use for reading the enriched MathML
 * @returns {Handler}          The handler that was modified (for purposes of chainging extensions)
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
