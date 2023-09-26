/*************************************************************
 *
 *  Copyright (c) 2018-2023 The MathJax Consortium
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
 * @fileoverview  Mixin that adds semantic enrichment to internal MathML
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {mathjax} from '../mathjax.js';
import {Handler} from '../core/Handler.js';
import {MathDocument, AbstractMathDocument, MathDocumentConstructor} from '../core/MathDocument.js';
import {MathItem, AbstractMathItem, STATE, newState} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {MathML} from '../input/mathml.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';
import {OptionList, expandable} from '../util/Options.js';
import {Sre} from './sre.js';
import { buildSpeech, setAria } from './SpeechUtil.js';

/*==========================================================================*/

/**
 *  The current speech setting for Sre
 */
let currentLocale = 'none';
let currentBraille = 'none';

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/*==========================================================================*/

/**
 * Add STATE value for being enriched (after COMPILED and before TYPESET)
 */
newState('ENRICHED', 30);

/**
 * Add STATE value for adding speech (after TYPESET)
 */
newState('ATTACHSPEECH', 155);

/*==========================================================================*/

export class enrichVisitor<N, T, D> extends SerializedMmlVisitor {

  protected mactionId: number;

  public visitTree(node: MmlNode, math?: MathItem<N, T, D>) {
    this.mactionId = 1;
    const mml = super.visitTree(node);
    if (this.mactionId) {
      math.inputData.hasMaction = true;
    }
    return mml;
  }

  public visitMactionNode(node: MmlNode, space: string) {
    let [nl, endspace] = (node.childNodes.length === 0 ? ['', ''] : ['\n', space]);
    const children = this.childNodeMml(node, space + '  ', nl);
    let attributes = this.getAttributes(node);
    if (node.attributes.get('actiontype') === 'toggle') {
      const id = this.mactionId++;
      node.setProperty('mactionId', id);
      //
      // Add maction id and make sure selection is the next attribute
      //
      attributes = ` data-maction-id="${id}" selection="${node.attributes.get('selection')}"`
        + attributes.replace(/ selection="\d+"/, '');
    }
    return space + '<maction' + attributes + '>'
                 + (children.match(/\S/) ? nl + children + endspace : '')
                 + '</maction>';
  }
}

/*==========================================================================*/


/**
 * The functions added to MathItem for enrichment
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface EnrichedMathItem<N, T, D> extends MathItem<N, T, D> {

  /**
   * The speech generator for this math item.
   */
  speechGenerator: Sre.speechGenerator;

  /**
   * The braille generator for this math item.
   */
  brailleGenerator: Sre.speechGenerator;

  /**
   * @param {MathDocument} document  The document where enrichment is occurring
   * @param {boolean} force          True to force the enrichment even if not enabled
   */
  enrich(document: MathDocument<N, T, D>, force?: boolean): void;

  /**
   * @param {MathDocument} document  The document where enrichment is occurring
   */
  attachSpeech(document: MathDocument<N, T, D>): void;
}

/**
 * The mixin for adding enrichment to MathItems
 *
 * @param {B} BaseMathItem     The MathItem class to be extended
 * @param {MathML} MmlJax      The MathML input jax used to convert the enriched MathML
 * @param {Function} toMathML  The function to serialize the internal MathML
 * @return {EnrichedMathItem}  The enriched MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function EnrichedMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(
  BaseMathItem: B,
  MmlJax: MathML<N, T, D>,
  toMathML: (node: MmlNode, math: MathItem<N, T, D>) => string
): Constructor<EnrichedMathItem<N, T, D>> & B {

  return class extends BaseMathItem {

    /**
     * @override
     */
    public speechGenerator = Sre.getSpeechGenerator('Tree');

    /**
     * @override
     */
    public brailleGenerator = Sre.getSpeechGenerator('Tree');

    /**
     * @param {any} node  The node to be serialized
     * @return {string}   The serialized version of node
     */
    protected serializeMml(node: any): string {
      if ('outerHTML' in node) {
        return node.outerHTML;
      }
      //
      //  For IE11
      //
      if (typeof Element !== 'undefined' && typeof window !== 'undefined' && node instanceof Element) {
        const div = window.document.createElement('div');
        div.appendChild(node);
        return div.innerHTML;
      }
      //
      //  For NodeJS version of Sre
      //
      return node.toString();
    }

    /**
     * @param {MathDocument} document   The MathDocument for the MathItem
     * @param {boolean} force           True to force the enrichment even if not enabled
     */
    public enrich(document: MathDocument<N, T, D>, force: boolean = false) {
      if (this.state() >= STATE.ENRICHED) return;
      if (!this.isEscaped && (document.options.enableEnrichment || force)) {
          // TODO: Sort out the loading of the locales better
        if (document.options.sre.locale !== currentLocale) {
          currentLocale = document.options.sre.locale;
          // TODO: Sort out the loading of the locales better
          mathjax.retryAfter(
            Sre.setupEngine({locale: document.options.sre.locale}).then(
              () => {
                return Sre.sreReady(); }));
        }
        if (document.options.sre.braille !== currentBraille) {
          currentBraille = document.options.sre.braille;
          mathjax.retryAfter(
            Sre.setupEngine({locale: document.options.sre.braille})
              .then(() => Sre.sreReady()));
        }
        const math = new document.options.MathItem('', MmlJax);
        try {
          let mml;
          if (!this.inputData.originalMml) {
            mml = this.inputData.originalMml = toMathML(this.root, this);
          } else {
            mml = this.adjustSelections();
          }
          Sre.setupEngine(document.options.sre);
          const enriched = Sre.toEnriched(mml);
          this.speechGenerator.setOptions(Object.assign(
            {}, document.options.sre, {
              modality: 'speech',
              markup: 'ssml',
              automark: true,
            }));
          this.brailleGenerator.setOptions({
            locale: document.options.sre.braille,
            domain: 'default',
            style: 'default',
            modality: 'braille',
            markup: 'none',
          });
          this.outputData.speech = buildSpeech(
            this.speechGenerator.getSpeech(enriched, enriched),
            document.options.sre.locale,
            document.options.sre.rate)[0];
          this.outputData.braille = this.brailleGenerator.getSpeech(enriched, enriched);
          this.inputData.enrichedMml = math.math = this.serializeMml(enriched);
          math.display = this.display;
          math.compile(document);
          this.root = math.root;
        } catch (err) {
          document.options.enrichError(document, this, err);
        }
      }
      setAria(this.root, document.options.sre.locale);
      this.state(STATE.ENRICHED);
    }

    /**
     * Correct the selection values for the maction items from the original MathML
     */
    protected adjustSelections() {
      let mml = this.inputData.originalMml;
      if (!this.inputData.hasMaction) return mml;
      const maction = [] as MmlNode[];
      this.root.walkTree((node: MmlNode) => {
        if (node.isKind('maction')) {
          maction[node.attributes.get('data-maction-id') as number] = node;
        }
      });
      return mml.replace(
        /(data-maction-id="(\d+)" selection=)"\d+"/g,
        (_match: string, prefix: string, id: number) => `${prefix}"${maction[id].attributes.get('selection')}"`
      );
    }

    /**
     * @param {MathDocument} document   The MathDocument for the MathItem
     */
    public attachSpeech(document: MathDocument<N, T, D>) {
      if (this.state() >= STATE.ATTACHSPEECH) return;
      const attributes = this.root.attributes;
      const speech = (attributes.get('aria-label') || this.outputData.speech);
      const braille = (attributes.get('aria-braillelabel') || this.outputData.braille);
      if (!speech && !braille) {
        this.state(STATE.ATTACHSPEECH);
        return;
      }
      const adaptor = document.adaptor;
      const node = this.typesetRoot;
      if (speech) {
        adaptor.setAttribute(node, 'aria-label', speech as string);
      }
      if (braille) {
        adaptor.setAttribute(node, 'aria-braillelabel', braille as string);
      }
      for (const child of adaptor.childNodes(node) as N[]) {
        adaptor.setAttribute(child, 'aria-hidden', 'true');
      }
      this.outputData.speech = speech;
      this.outputData.braille = braille;
      this.state(STATE.ATTACHSPEECH);
    }

    /**
     * Retrieves the actual speech element that should be used as aria label.
     * @param {MmlNode} node The root node to search from.
     * @return {string} The speech content.
     */
    protected getSpeech(node: MmlNode): string {
      const attributes = node.attributes;
      if (!attributes) return '';
      const speech = attributes.getExplicit('data-semantic-speech') as string;
      // TODO (explorer) For tree role move all speech etc. to container
      // element.
      if (!attributes.getExplicit('data-semantic-parent') && speech) {
        return speech;
      }
      for (let child of node.childNodes) {
        let value = this.getSpeech(child);
        if (value) {
          return value;
        }
      }
      return '';
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
export interface EnrichedMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {

  /**
   * Perform enrichment on the MathItems in the MathDocument
   *
   * @return {EnrichedMathDocument}   The MathDocument (so calls can be chained)
   */
  enrich(): EnrichedMathDocument<N, T, D>;

  /**
   * Attach speech to the MathItems in the MathDocument
   *
   * @return {EnrichedMathDocument}   The MathDocument (so calls can be chained)
   */
  attachSpeech(): EnrichedMathDocument<N, T, D>;

  /**
   * @param {EnrichedMathDocument} doc   The MathDocument for the error
   * @paarm {EnrichedMathItem} math      The MathItem causing the error
   * @param {Error} err                  The error being processed
   */
  enrichError(doc: EnrichedMathDocument<N, T, D>, math: EnrichedMathItem<N, T, D>, err: Error): void;
}

/**
 * The mixin for adding enrichment to MathDocuments
 *
 * @param {B} BaseDocument     The MathDocument class to be extended
 * @param {MathML} MmlJax          The MathML input jax used to convert the enriched MathML
 * @return {EnrichedMathDocument}  The enriched MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function EnrichedMathDocumentMixin<N, T, D, B extends MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(
  BaseDocument: B,
  MmlJax: MathML<N, T, D>,
): MathDocumentConstructor<EnrichedMathDocument<N, T, D>> & B {

  return class extends BaseDocument {

    /**
     * @override
     */
    public static OPTIONS: OptionList = {
      ...BaseDocument.OPTIONS,
      enableEnrichment: true,
      enrichError: (doc: EnrichedMathDocument<N, T, D>,
                    math: EnrichedMathItem<N, T, D>,
                    err: Error) => doc.enrichError(doc, math, err),
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        enrich:       [STATE.ENRICHED],
        attachSpeech: [STATE.ATTACHSPEECH]
      }),
      sre: expandable({
        speech: 'none',                    // by default no speech is included
        locale: 'en',                      // switch the locale
        domain: 'mathspeak',               // speech rules domain
        style: 'default',                  // speech rules style
        braille: 'nemeth',                 // TODO: Dummy switch for braille
      }),
    };

    /**
     * Enrich the MathItem class used for this MathDocument, and create the
     *   temporary MathItem used for enrchment
     *
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      MmlJax.setMmlFactory(this.mmlFactory);
      const ProcessBits = (this.constructor as typeof AbstractMathDocument).ProcessBits;
      if (!ProcessBits.has('enriched')) {
        ProcessBits.allocate('enriched');
        ProcessBits.allocate('attach-speech');
      }
      const visitor = new enrichVisitor<N, T, D>(this.mmlFactory);
      const toMathML = ((node: MmlNode, math: MathItem<N, T, D>) => visitor.visitTree(node, math));
      this.options.MathItem =
        EnrichedMathItemMixin<N, T, D, Constructor<AbstractMathItem<N, T, D>>>(
          this.options.MathItem, MmlJax, toMathML
        );
    }

    /**
     * Attach speech from a MathItem to a node
     */
    public attachSpeech() {
      if (!this.processed.isSet('attach-speech')) {
        for (const math of this.math) {
          (math as EnrichedMathItem<N, T, D>).attachSpeech(this);
        }
        this.processed.set('attach-speech');
      }
      return this;
    }

    /**
     * Enrich the MathItems in this MathDocument
     */
    public enrich() {
      if (!this.processed.isSet('enriched')) {
        if (this.options.enableEnrichment) {
          for (const math of this.math) {
            (math as EnrichedMathItem<N, T, D>).enrich(this);
          }
        }
        this.processed.set('enriched');
      }
      return this;
    }

    /**
     */
    public enrichError(_doc: EnrichedMathDocument<N, T, D>, _math: EnrichedMathItem<N, T, D>, err: Error) {
      console.warn('Enrichment error:', err);
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.ENRICHED) {
        this.processed.clear('enriched');
      }
      return this;
    }

  };

}

/*==========================================================================*/

/**
 * Add enrichment a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @param {MathML} MmlJax     The MathML input jax to use for reading the enriched MathML
 * @return {Handler}          The handler that was modified (for purposes of chainging extensions)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function EnrichHandler<N, T, D>(handler: Handler<N, T, D>, MmlJax: MathML<N, T, D>): Handler<N, T, D> {
  MmlJax.setAdaptor(handler.adaptor);
  handler.documentClass =
    EnrichedMathDocumentMixin<N, T, D, MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(
      handler.documentClass, MmlJax
    );
  return handler;
}
