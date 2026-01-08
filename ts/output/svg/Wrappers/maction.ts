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
 * @file  Implements the SvgMaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  SvgCharOptions,
  SvgVariantData,
  SvgDelimiterData,
  SvgFontData,
  SvgFontDataClass,
} from '../FontData.js';
import {
  CommonMaction,
  CommonMactionClass,
  CommonMactionMixin,
} from '../../common/Wrappers/maction.js';
import { ActionDef } from '../../common/Wrappers/maction.js';
import { EventHandler, TooltipData } from '../../common/Wrappers/maction.js';
import { MmlMaction } from '../../../core/MmlTree/MmlNodes/maction.js';
import {
  MmlNode,
  TextNode,
  AbstractMmlNode,
} from '../../../core/MmlTree/MmlNode.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { STATE } from '../../../core/MathItem.js';

/*****************************************************************/
/**
 * The SvgMaction interface for the SVG maction wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMactionNTD<N, T, D>
  extends
    SvgWrapper<N, T, D>,
    CommonMaction<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  /**
   * Add an event handler to the output for this maction
   */
  setEventHandler(type: string, handler: EventHandler, dom?: N): void;

  /**
   * @param {number} m   The number to convert to pixels
   * @returns {string}    The dimension with "px" units
   */
  Px(m: number): string;
}

/**
 * The SvgMactionClass interface for the SVG maction wrapper
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface SvgMactionClass<N, T, D>
  extends
    SvgWrapperClass<N, T, D>,
    CommonMactionClass<
      N,
      T,
      D,
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass
    > {
  new (
    factory: SvgWrapperFactory<N, T, D>,
    node: MmlNode,
    parent?: SvgWrapper<N, T, D>
  ): SvgMactionNTD<N, T, D>;
}

/*****************************************************************/

/**
 * The SvgMaction wrapper for the MmlMaction class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export const SvgMaction = (function <N, T, D>(): SvgMactionClass<N, T, D> {
  const Base = CommonMactionMixin<
    N,
    T,
    D,
    SVG<N, T, D>,
    SvgWrapper<N, T, D>,
    SvgWrapperFactory<N, T, D>,
    SvgWrapperClass<N, T, D>,
    SvgCharOptions,
    SvgVariantData,
    SvgDelimiterData,
    SvgFontData,
    SvgFontDataClass,
    SvgMactionClass<N, T, D>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same
  //   type (they should both be SvgWrapper<N, T, D>, but are thought of as
  //   different by typescript)
  return class SvgMaction extends Base implements SvgMactionNTD<N, T, D> {
    /**
     * @override
     */
    public static kind = MmlMaction.prototype.kind;

    /**
     * @override
     */
    public static styles: StyleJson = {
      '[jax="SVG"] mjx-tool': {
        display: 'inline-block',
        position: 'relative',
        width: 0,
        height: 0,
      },
      '[jax="SVG"] mjx-tool > mjx-tip': {
        position: 'absolute',
        top: 0,
        left: 0,
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
      'g[data-mml-node="maction"][data-toggle]': {
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
      'g[data-mjx-collapsed]': {
        fill: '#55F',
      },

      '@media (prefers-color-scheme: dark) /* svg maction */': {
        'mjx-tool > mjx-tip': {
          'background-color': '#303030',
          color: '#E0E0E0',
          'box-shadow': '2px 2px 5px #000',
        },
        'mjx-status': {
          'background-color': '#303030',
          color: '#E0E0E0',
        },
        'g[data-mjx-collapsed]': {
          fill: '#88F',
        },
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
                'data-toggle',
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
            for (const dom of node.dom) {
              const rect = node.firstChild(dom);
              if (tip.node.isKind('mtext')) {
                //
                // Text tooltips are handled through title nodes
                //
                const text = (tip.node as TextNode).getText();
                node.adaptor.insert(
                  node.svg('title', {}, [node.text(text)]),
                  rect
                );
              } else {
                //
                // Math tooltips are handled through hidden nodes and event handlers
                //
                const adaptor = node.adaptor;
                const container = node.jax.container;
                const math = (node.node as AbstractMmlNode).factory.create(
                  'math',
                  {},
                  [node.childNodes[1].node]
                );
                const tool = node.html('mjx-tool', {}, [node.html('mjx-tip')]);
                const hidden = adaptor.append(
                  rect,
                  node.svg('foreignObject', { style: { display: 'none' } }, [
                    tool,
                  ])
                ) as N;
                node.jax.processMath(
                  node.jax.factory.wrap(math),
                  adaptor.firstChild(tool) as N
                );
                node.childNodes[1].node.parent = node.node;
                //
                // Set up the event handlers to display and remove the tooltip
                //
                node.setEventHandler(
                  'mouseover',
                  (event: Event) => {
                    data.stopTimers(dom, data);
                    data.hoverTimer.set(
                      dom,
                      setTimeout(() => {
                        adaptor.setStyle(tool, 'left', '0');
                        adaptor.setStyle(tool, 'top', '0');
                        adaptor.append(container, tool);
                        const tbox = adaptor.nodeBBox(tool);
                        const nbox = adaptor.nodeBBox(dom);
                        const dx =
                          (nbox.right - tbox.left) / node.metrics.em +
                          node.tipDx;
                        const dy =
                          (nbox.bottom - tbox.bottom) / node.metrics.em +
                          node.tipDy;
                        adaptor.setStyle(tool, 'left', node.Px(dx));
                        adaptor.setStyle(tool, 'top', node.Px(dy));
                      }, data.postDelay)
                    );
                    event.stopPropagation();
                  },
                  dom
                );
                node.setEventHandler(
                  'mouseout',
                  (event: Event) => {
                    data.stopTimers(dom, data);
                    const timer = setTimeout(
                      () => adaptor.append(hidden, tool),
                      data.clearDelay
                    );
                    data.clearTimer.set(dom, timer);
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
                adaptor.setAttribute(dom, 'data-statusline', text)
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
      SVG<N, T, D>,
      SvgWrapper<N, T, D>,
      SvgWrapperFactory<N, T, D>,
      SvgWrapperClass<N, T, D>,
      SvgCharOptions,
      SvgVariantData,
      SvgDelimiterData,
      SvgFontData,
      SvgFontDataClass,
      SvgMactionNTD<N, T, D>
    >[]);

    /*************************************************************/

    /**
     * Add an event handler to the output for this maction
     *
     * @param {string} type The event handler type.
     * @param {EventHandler} handler The actual event handler.
     * @param {N=} dom The DOM node. If not provided goes over all elements of
     *    the dom tree of this wrapper.
     */
    public setEventHandler(type: string, handler: EventHandler, dom: N = null) {
      (dom ? [dom] : this.dom).forEach((node) =>
        (node as any).addEventListener(type, handler)
      );
    }

    /**
     * @override
     */
    public Px(m: number): string {
      return this.px(m);
    }

    /*************************************************************/

    /**
     * @override
     */
    public toSVG(parents: N[]) {
      if (this.toEmbellishedSVG(parents)) return;
      const svg = this.standardSvgNodes(parents);
      const child = this.selected;
      let i = 0;
      this.dom.forEach((node) => {
        const { h, d, w } = child.getLineBBox(i++);
        this.adaptor.append(
          node,
          this.svg('rect', {
            width: this.fixed(w),
            height: this.fixed(h + d),
            x: i === 1 ? this.fixed(-this.dx) : 0,
            y: this.fixed(-d),
            fill: 'none',
            'pointer-events': 'all',
          })
        );
      });
      child.toSVG(svg);
      const bbox = child.getOuterBBox();
      if (child.dom) {
        child.place(bbox.L * bbox.rscale, 0);
      }
      this.action(this, this.data);
    }
  };
})<any, any, any>();
