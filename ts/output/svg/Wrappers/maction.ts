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
 * @file  Implements the SvgMaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SVG, SVG_FONT } from '../../svg.js';
import { SvgWrapper, SvgWrapperClass } from '../Wrapper.js';
import { SvgWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMaction,
  CommonMactionClass,
  CommonMactionMixin,
} from '../../common/Wrappers/maction.js';
import { ActionDef } from '../../common/Wrappers/maction.js';
import { TooltipData } from '../../common/Wrappers/maction.js';
import { MmlMaction } from '../../../core/MmlTree/MmlNodes/maction.js';
import {
  MmlNode,
  TextNode,
  AbstractMmlNode,
} from '../../../core/MmlTree/MmlNode.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { MACTION } from '../../../a11y/semantic-enrich/maction.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The SvgMaction interface for the SVG maction wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMactionNTD<DOM extends DOM_TYPES>
  extends
    SvgWrapper<DOM>,
    CommonMaction<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {}

/**
 * The SvgMactionClass interface for the SVG maction wrapper
 *
 * @template DOM   The DOM node types
 */
export interface SvgMactionClass<DOM extends DOM_TYPES>
  extends
    SvgWrapperClass<DOM>,
    CommonMactionClass<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>
    > {
  new (
    factory: SvgWrapperFactory<DOM>,
    node: MmlNode,
    parent?: SvgWrapper<DOM>
  ): SvgMactionNTD<DOM>;
}

/*****************************************************************/

/**
 * The SvgMaction wrapper for the MmlMaction class
 */
export const SvgMaction = (function (): SvgMactionClass<DOM> {
  const Base = CommonMactionMixin<
    DOM,
    SVG_FONT,
    SVG<DOM>,
    SvgWrapper<DOM>,
    SvgWrapperFactory<DOM>,
    SvgWrapperClass<DOM>,
    SvgMactionClass<DOM>
  >(SvgWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class SvgMaction extends Base implements SvgMactionNTD<DOM> {
    /**
     * @override
     */
    public static kind = MmlMaction.prototype.kind;

    /**
     * @override
     */
    public get prefix(): string {
      return 'data-';
    }

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
      [`g[${MACTION.COLLAPSED}]`]: {
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
        [`g[${MACTION.COLLAPSED}]`]: {
          fill: '#88F',
        },
      },
    };

    /**
     * @override
     */
    public static actions = new Map([
      ...Base.actions, // override tooltip from the base actions
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
                ) as N<DOM>;
                node.jax.processMath(
                  node.jax.factory.wrap(math),
                  adaptor.firstChild(tool) as N<DOM>
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
    ] as ActionDef<
      DOM,
      SVG_FONT,
      SVG<DOM>,
      SvgWrapper<DOM>,
      SvgWrapperFactory<DOM>,
      SvgWrapperClass<DOM>,
      SvgMactionNTD<DOM>
    >[]);

    /*************************************************************/

    /**
     * @override
     */
    public toSVG(parents: N<DOM>[]) {
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
})();
