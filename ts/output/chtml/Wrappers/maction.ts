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
 * @file  Implements the ChtmlMaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  ChtmlCharOptions,
  ChtmlVariantData,
  ChtmlDelimiterData,
  ChtmlFontData,
  ChtmlFontDataClass,
} from '../FontData.js';
import {
  CommonMaction,
  CommonMactionClass,
  CommonMactionMixin,
} from '../../common/Wrappers/maction.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMaction } from '../../../core/MmlTree/MmlNodes/maction.js';
import { ActionDef } from '../../common/Wrappers/maction.js';
import { EventHandler, TooltipData } from '../../common/Wrappers/maction.js';
import { TextNode } from '../../../core/MmlTree/MmlNode.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { STATE } from '../../../core/MathItem.js';

/*****************************************************************/
/**
 * The ChtmlMaction interface for the CHTML Maction wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMactionNTD<N, T, D>
  extends ChtmlWrapper<N, T, D>,
    CommonMaction<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {
  /**
   * Add an event handler to the output for this maction
   *
   * @param {string} type The event handler type.
   * @param {EventHandler} handler The actual event handler.
   * @param {N=} dom The DOM node. If not provided goes over all elements of
   *the dom tree of this wrapper.
   */
  setEventHandler(type: string, handler: EventHandler, dom?: N): void;

  /**
   * Public access to em method (for use in notation functions)
   *
   * @param {number} m   The number to convert to pixels
   * @returns {string}    The dimension with "px" units
   */
  Em(m: number): string;
}

/**
 * The ChtmlMactionClass interface for the CHTML Maction wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface ChtmlMactionClass<N, T, D>
  extends ChtmlWrapperClass<N, T, D>,
    CommonMactionClass<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass
    > {
  new (
    factory: ChtmlWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: ChtmlWrapper<N, T, D>
  ): ChtmlMactionNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The ChtmlMaction wrapper class for the MmlMaction class
 */
export const ChtmlMaction = (function <N, T, D>(): ChtmlMactionClass<N, T, D> {
  const Base = CommonMactionMixin<
    N,
    T,
    D,
    CHTML<N, T, D>,
    ChtmlWrapper<N, T, D>,
    ChtmlWrapperFactory<N, T, D>,
    ChtmlWrapperClass<N, T, D>,
    ChtmlCharOptions,
    ChtmlVariantData,
    ChtmlDelimiterData,
    ChtmlFontData,
    ChtmlFontDataClass,
    ChtmlMactionClass<N, T, D>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  // type (they should both be ChtmlWrapper<N, T, D>, but are thought of as
  // different by typescript)
  return class ChtmlMaction extends Base implements ChtmlMactionNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMaction.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      'mjx-maction': {
        position: 'relative',
      },
      'mjx-maction > mjx-tool': {
        display: 'none',
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        'z-index': 500,
      },
      'mjx-tool > mjx-tip': {
        display: 'inline-block',
        'line-height': 0,
        padding: '.2em',
        border: '1px solid #888',
        'background-color': '#F8F8F8',
        color: 'black',
        'box-shadow': '2px 2px 5px #AAAAAA',
      },
      'mjx-maction[toggle]': {
        cursor: 'pointer',
      },
      'mjx-status': {
        display: 'block',
        position: 'fixed',
        left: '1em',
        bottom: '1em',
        'min-width': '25%',
        padding: '.2em .4em',
        border: '1px solid #888',
        'font-size': '90%',
        'background-color': '#F8F8F8',
        color: 'black',
      },
    };

    /**
     * @override
     */
    public static actions = new Map([
      [
        'toggle',
        [
          (node, _data) => {
            //
            // Mark which child is selected
            //
            node.dom.forEach((dom) => {
              node.adaptor.setAttribute(
                dom,
                'toggle',
                node.node.attributes.get('selection') as string
              );
            });
            //
            // Cache the data needed to select another node
            //
            const math = node.factory.jax.math;
            const document = node.factory.jax.document;
            const mml = node.node as MmlMaction;
            //
            // Add a click handler that changes the selection and rerenders the expression
            //
            node.setEventHandler('click', (event: Event) => {
              if (!math.end.node) {
                //
                // If the MathItem was created by hand, it might not have a node
                // telling it where to replace the existing math, so set it.
                //
                math.start.node = math.end.node = math.typesetRoot;
                math.start.n = math.end.n = 0;
              }
              mml.nextToggleSelection();
              math.rerender(
                document,
                mml.attributes.get('data-maction-id')
                  ? STATE.ENRICHED
                  : STATE.RERENDER
              );
              event.stopPropagation();
            });
          },
          {},
        ],
      ],

      [
        'tooltip',
        [
          (node, data) => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
              //
              // Text tooltips are handled through title attributes
              //
              const text = (tip.node as TextNode).getText();
              node.dom.forEach((dom) =>
                node.adaptor.setAttribute(dom, 'title', text)
              );
            } else {
              //
              // Math tooltips are handled through hidden nodes and event handlers
              //
              const adaptor = node.adaptor;
              for (const dom of node.dom) {
                const tool = adaptor.append(
                  dom,
                  node.html(
                    'mjx-tool',
                    {
                      style: {
                        bottom: node.Em(-node.tipDy),
                        right: node.Em(-node.tipDx),
                      },
                    },
                    [node.html('mjx-tip')]
                  )
                ) as N;
                tip.toCHTML([adaptor.firstChild(tool) as N]);
                //
                // Set up the event handlers to display and remove the tooltip
                //
                node.setEventHandler(
                  'mouseover',
                  (event: Event) => {
                    data.stopTimers(dom, data);
                    const timeout = setTimeout(
                      () => adaptor.setStyle(tool, 'display', 'block'),
                      data.postDelay
                    );
                    data.hoverTimer.set(dom, timeout);
                    event.stopPropagation();
                  },
                  dom
                );
                node.setEventHandler(
                  'mouseout',
                  (event: Event) => {
                    data.stopTimers(dom, data);
                    const timeout = setTimeout(
                      () => adaptor.setStyle(tool, 'display', ''),
                      data.clearDelay
                    );
                    data.clearTimer.set(dom, timeout);
                    event.stopPropagation();
                  },
                  dom
                );
              }
            }
          },
          TooltipData,
        ],
      ],

      [
        'statusline',
        [
          (node, data) => {
            const tip = node.childNodes[1];
            if (!tip) return;
            if (tip.node.isKind('mtext')) {
              const adaptor = node.adaptor;
              const text = (tip.node as TextNode).getText();
              node.dom.forEach((dom) =>
                adaptor.setAttribute(dom, 'statusline', text)
              );
              //
              // Set up event handlers to change the status window
              //
              node.setEventHandler('mouseover', (event: Event) => {
                if (data.status === null) {
                  const body = adaptor.body(adaptor.document);
                  data.status = adaptor.append(
                    body,
                    node.html('mjx-status', {}, [node.text(text)])
                  );
                }
                event.stopPropagation();
              });
              node.setEventHandler('mouseout', (event: Event) => {
                if (data.status) {
                  adaptor.remove(data.status);
                  data.status = null;
                }
                event.stopPropagation();
              });
            }
          },
          {
            status: null, // cached status line
          },
        ],
      ],
    ] as ActionDef<
      N,
      T,
      D,
      CHTML<N, T, D>,
      ChtmlWrapper<N, T, D>,
      ChtmlWrapperFactory<N, T, D>,
      ChtmlWrapperClass<N, T, D>,
      ChtmlCharOptions,
      ChtmlVariantData,
      ChtmlDelimiterData,
      ChtmlFontData,
      ChtmlFontDataClass,
      ChtmlMactionNTD<N, T, D>
    >[]);

    /*************************************************************/

    /**
     * @override
     */
    public setEventHandler(type: string, handler: EventHandler, dom: N = null) {
      (dom ? [dom] : this.dom).forEach((node) =>
        (node as any).addEventListener(type, handler)
      );
    }

    /**
     * @override
     */
    public Em(m: number): string {
      return this.em(m);
    }

    /*************************************************************/

    /**
     * @override
     */
    public toCHTML(parents: N[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      const chtml = this.standardChtmlNodes(parents);
      const child = this.selected;
      child.toCHTML(chtml);
      this.action(this, this.data);
    }
  };
})<any, any, any>();
