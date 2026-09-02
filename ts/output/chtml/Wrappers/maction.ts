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
 * @file  Implements the ChtmlMaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { CHTML, CHTML_FONT } from '../../chtml.js';
import { ChtmlWrapper, ChtmlWrapperClass } from '../Wrapper.js';
import { ChtmlWrapperFactory } from '../WrapperFactory.js';
import {
  CommonMaction,
  CommonMactionClass,
  CommonMactionMixin,
} from '../../common/Wrappers/maction.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMaction } from '../../../core/MmlTree/MmlNodes/maction.js';
import { ActionDef } from '../../common/Wrappers/maction.js';
import { TooltipData } from '../../common/Wrappers/maction.js';
import { TextNode } from '../../../core/MmlTree/MmlNode.js';
import { StyleJson } from '../../../util/StyleJson.js';
import { MACTION } from '../../../a11y/semantic-enrich/maction.js';
import { DOM, DOM_TYPES, N } from '../../../types/Types.js';

/*****************************************************************/
/**
 * The ChtmlMaction interface for the CHTML Maction wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMactionNTD<DOM extends DOM_TYPES>
  extends
    ChtmlWrapper<DOM>,
    CommonMaction<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {}

/**
 * The ChtmlMactionClass interface for the CHTML Maction wrapper
 *
 * @template DOM   The DOM node types
 */
export interface ChtmlMactionClass<DOM extends DOM_TYPES>
  extends
    ChtmlWrapperClass<DOM>,
    CommonMactionClass<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>
    > {
  new (
    factory: ChtmlWrapperFactory<DOM>,
    node: MmlNode,
    parent?: ChtmlWrapper<DOM>
  ): ChtmlMactionNTD<DOM>;
}

/*****************************************************************/

/**
 * The ChtmlMaction wrapper class for the MmlMaction class
 */
export const ChtmlMaction = (function (): ChtmlMactionClass<DOM> {
  const Base = CommonMactionMixin<
    DOM,
    CHTML_FONT,
    CHTML<DOM>,
    ChtmlWrapper<DOM>,
    ChtmlWrapperFactory<DOM>,
    ChtmlWrapperClass<DOM>,
    ChtmlMactionClass<DOM>
  >(ChtmlWrapper);

  // @ts-expect-error Avoid message about base constructors not having the same type
  return class ChtmlMaction extends Base implements ChtmlMactionNTD<DOM> {
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
      [`mjx-container [${MACTION.COLLAPSED}]`]: {
        color: '#55F',
      },

      '@media (prefers-color-scheme: dark) /* chtml maction */': {
        'mjx-tool > mjx-tip': {
          border: '1px solid #888',
          'background-color': '#303030',
          color: '#E0E0E0',
          'box-shadow': '2px 2px 5px #000',
        },
        'mjx-status': {
          'background-color': '#303030',
          color: '#E0E0E0',
        },
        [`mjx-container [${MACTION.COLLAPSED}]`]: {
          color: '#88F',
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
                ) as N<DOM>;
                tip.toCHTML([adaptor.firstChild(tool) as N<DOM>]);
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
    ] as ActionDef<
      DOM,
      CHTML_FONT,
      CHTML<DOM>,
      ChtmlWrapper<DOM>,
      ChtmlWrapperFactory<DOM>,
      ChtmlWrapperClass<DOM>,
      ChtmlMactionNTD<DOM>
    >[]);

    /*************************************************************/

    /**
     * @override
     */
    public toCHTML(parents: N<DOM>[]) {
      if (this.toEmbellishedCHTML(parents)) return;
      const chtml = this.standardChtmlNodes(parents);
      const child = this.selected;
      child.toCHTML(chtml);
      this.action(this, this.data);
    }
  };
})();
