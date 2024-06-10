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
 * @fileoverview  Mixin that adds semantic enrichment to internal MathML
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Handler} from '../core/Handler.js';
import {MathDocument, AbstractMathDocument, MathDocumentConstructor} from '../core/MathDocument.js';
import {MathItem, AbstractMathItem, STATE, newState} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {HtmlNode} from '../core/MmlTree/MmlNodes/HtmlNode.js';
import {MathML} from '../input/mathml.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';
import {OptionList, expandable} from '../util/Options.js';
import {Sre} from './sre.js';
import { buildSpeech, Timing } from './speech/SpeechUtil.js';
import { GeneratorPool } from './speech/GeneratorPool.js';

/*==========================================================================*/

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
newState('ATTACHSPEECH', 205);

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

  public visitHtmlNode(node: HtmlNode<any>, _space: string): string {
    return node.getSerializedXML();
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
        + attributes.replace(/ selection="\d+"/, '').replace(/ data-maction-id="\d+"/, '');
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
   * The speech generators for this math item.
   */
  generatorPool: GeneratorPool<N, T, D>;

  /**
   * @param {MathDocument} document  The document where enrichment is occurring
   * @param {boolean} force          True to force the enrichment even if not enabled
   */
  enrich(document: MathDocument<N, T, D>, force?: boolean): void;

  /**
   * @param {MathDocument} document  The document where enrichment is occurring
   */
  attachSpeech(document: MathDocument<N, T, D>): void;

  /**
   * @param {MathDocument} document   The MathDocument for the MathItem
   */
  unEnrich(document: MathDocument<N, T, D>): void;
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
    public generatorPool = new GeneratorPool<N, T, D>();

    /**
     *  The MathML adaptor.
     */
    public toMathML = toMathML;

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
        this.generatorPool.init(document.options, document.adaptor);
        const math = new document.options.MathItem('', MmlJax);
        try {
          let mml;
          if (!this.inputData.originalMml) {
            mml = this.inputData.originalMml = toMathML(this.root, this);
          } else {
            mml = this.adjustSelections();
          }
          const enriched = Sre.toEnriched(mml);
          this.inputData.enrichedMml = math.math = this.serializeMml(enriched);
          math.display = this.display;
          math.compile(document);
          this.root = math.root;
        } catch (err) {
          document.options.enrichError(document, this, err);
        }
      }
      this.state(STATE.ENRICHED);
    }

    /**
     * @param {MathDocument} document   The MathDocument for the MathItem
     */
    public unEnrich(document: MathDocument<N, T, D>) {
      const mml = this.inputData.originalMml;
      if (!mml) return;
      const math = new document.options.MathItem('', MmlJax);
      math.math = mml;
      math.display = this.display;
      math.compile(document);
      this.root = math.root;
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
     * Computes speech and braille label content if the information is already
     * on the node. In particular it respects existing labels.
     *
     * @return {[string, string]} Pair comprising speech and braille.
     */
    private existingSpeech(): [string, string] {
      const attributes = this.root.attributes;
      let speech = attributes.get('aria-label') as string;
      if (!speech) {
        speech = buildSpeech(
          attributes.get('data-semantic-speech') as string || '')[0];
      }
      let braille = (attributes.get('aria-braillelabel') ||
        attributes.get('data-semantic-braille') || '') as string;
      return [speech, braille];
    }

    /**
     * Attaches the aria labels for speech and braille.
     *
     * @param {MathDocument} document   The MathDocument for the MathItem
     */
    public attachSpeech(document: MathDocument<N, T, D>) {
      if (this.state() >= STATE.ATTACHSPEECH) return;
      this.state(STATE.ATTACHSPEECH);
      if (this.isEscaped || !document.options.enableEnrichment) return;
      let [speech, braille] = this.existingSpeech();
      let [newSpeech, newBraille] = ['', ''];
      const options = document.options;
      if ((!speech && options.enableSpeech) ||
          (!braille && options.enableBraille)) {
        try {
          [newSpeech, newBraille] = this.generatorPool.computeSpeech(
            this.typesetRoot, this.toMathML(this.root, this));
          if (newSpeech) {
            newSpeech = buildSpeech(newSpeech)[0];
          }
        } catch (err) {
          document.options.speechError(document, this, err);
        }
      }
      speech = speech || newSpeech;
      braille = braille || newBraille;
      if (!speech && !braille) return;
      const adaptor = document.adaptor;
      const node = this.typesetRoot;
      if (speech && options.enableSpeech) {
        adaptor.setAttribute(node, 'aria-label', speech as string);
      }
      if (braille && options.enableBraille) {
        adaptor.setAttribute(node, 'aria-braillelabel', braille as string);
      }
      for (const child of adaptor.childNodes(node) as N[]) {
        adaptor.setAttribute(child, 'aria-hidden', 'true');
      }
      this.outputData.speech = speech;
      this.outputData.braille = braille;
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

  /**
   * @param {EnrichedMathDocument} doc   The MathDocument for the error
   * @paarm {EnrichedMathItem} math      The MathItem causing the error
   * @param {Error} err                  The error being processed
   */
  speechError(doc: EnrichedMathDocument<N, T, D>, math: EnrichedMathItem<N, T, D>, err: Error): void;
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
      enableSpeech: true,
      enableBraille: true,
      enrichError: (doc: EnrichedMathDocument<N, T, D>,
                    math: EnrichedMathItem<N, T, D>,
                    err: Error) => doc.enrichError(doc, math, err),
      speechError: (doc: EnrichedMathDocument<N, T, D>,
                    math: EnrichedMathItem<N, T, D>,
                    err: Error) => doc.speechError(doc, math, err),
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        enrich:       [STATE.ENRICHED],
        attachSpeech: [STATE.ATTACHSPEECH]
      }),
      sre: expandable({
        speech: 'none',                    // by default no speech is included
        locale: 'en',                      // switch the locale
        domain: 'clearspeak',              // speech rules domain
        style: 'default',                  // speech rules style
        braille: 'nemeth',                 // TODO: Dummy switch for braille
      }),
      a11y: expandable({
        speech: true,                      // switch on speech output
        braille: true,                     // switch on Braille output
      })
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

    private DELAY: number = Timing.INITIAL;
    private awaitingSpeech: MathItem<N, T, D>[] = [];

    /**
     * Attach speech from a MathItem to a node
     */
    public attachSpeech() {
      if (!this.processed.isSet('attach-speech')) {
        if (this.options.enableSpeech || this.options.enableBraille) {
          this.awaitingSpeech = Array.from(this.math);
          this.attachSpeechStart();
        }
      }
      return this;
    }

    /**
     * Start attaching speech to nodes.
     */
    private attachSpeechStart() {
      if (this.awaitingSpeech.length) {
        setTimeout(
          () => this.attachSpeechLoop(),
          this.DELAY);
      } else {
        this.processed.set('attach-speech');
      }
    }

    /**
     * Loops through math items to attach speech until the timeout threshold is reached.
     */
    private attachSpeechLoop() {
      const timeStart = new Date().getTime();
      const timeEnd = timeStart + Timing.THRESHOLD;
      while (this.awaitingSpeech.length && new Date().getTime() < timeEnd) {
        const math = this.awaitingSpeech.shift();
        (math as EnrichedMathItem<N, T, D>).attachSpeech(this);
      }
      this.DELAY = Timing.INTERMEDIATE;
      this.attachSpeechStart();
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
     */
    public speechError(_doc: EnrichedMathDocument<N, T, D>, _math: EnrichedMathItem<N, T, D>, err: Error) {
      console.warn('Speech generation error:', err);
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.ENRICHED) {
        this.processed.clear('enriched');
        if (state >= STATE.COMPILED) {
          for (const item of this.math) {
            (item as EnrichedMathItem<N, T, D>).unEnrich(this);
          }
        }
      }
      if (state < STATE.ATTACHSPEECH) {
        this.processed.clear('attach-speech');
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
