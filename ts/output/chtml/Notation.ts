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
 * @file  Implements utilities for notations for menclose elements
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { ChtmlMencloseNTD } from './Wrappers/menclose.js';
import { DOM_TYPES, N } from '../../types/Types.js';
import * as Notation from '../common/Notation.js';
export * from '../common/Notation.js';

/*
 * Shorthands for common types
 */
export type RENDERER<DOM extends DOM_TYPES> = Notation.Renderer<
  ChtmlMencloseNTD<DOM>,
  N<DOM>
>;
export type DEFPAIR<DOM extends DOM_TYPES> = Notation.DefPair<
  ChtmlMencloseNTD<DOM>,
  N<DOM>
>;

/**
 * Create a named element (handled by CSS), and adjust it if thickness is non-standard
 *
 * @param {string} name    The name of the element to create
 * @param {string} offset  The offset direction to adjust if thickness is non-standard
 * @returns {RENDERER}      The renderer function for the given element name
 */
export const RenderElement = function <DOM extends DOM_TYPES>(
  name: string,
  offset: string = ''
): RENDERER<DOM> {
  return ((node, _child) => {
    const shape = node.adjustBorder(node.html('mjx-' + name));
    if (offset) {
      const d = node.getOffset(offset);
      if (node.thickness !== Notation.THICKNESS || d) {
        const transform = `translate${offset}(${node.Em(node.thickness / 2 - d)})`;
        node.adaptor.setStyle(shape, 'transform', transform);
      }
    }
    node.adaptor.append(node.dom[0], shape);
  }) as Notation.Renderer<ChtmlMencloseNTD<DOM>, N<DOM>>;
};

/**
 * @param {Notation.Side} side   The side on which a border should appear
 * @returns {DEFPAIR}      The notation definition for the notation having a line on the given side
 */
export const Border = function <DOM extends DOM_TYPES>(
  side: Notation.Side
): DEFPAIR<DOM> {
  return Notation.CommonBorder<ChtmlMencloseNTD<DOM>, N<DOM>>((node, child) => {
    node.adaptor.setStyle(
      child,
      'border-' + side,
      node.Em(node.thickness) + ' solid'
    );
  })(side);
};

/**
 * @param {string} name    The name of the notation to define
 * @param {Notation.Side} side1   The first side to get a border
 * @param {Notation.Side} side2   The second side to get a border
 * @returns {DEFPAIR}       The notation definition for the notation having lines on two sides
 */
export const Border2 = function <DOM extends DOM_TYPES>(
  name: string,
  side1: Notation.Side,
  side2: Notation.Side
): DEFPAIR<DOM> {
  return Notation.CommonBorder2<ChtmlMencloseNTD<DOM>, N<DOM>>(
    (node, child) => {
      const border = node.Em(node.thickness) + ' solid';
      node.adaptor.setStyle(child, 'border-' + side1, border);
      node.adaptor.setStyle(child, 'border-' + side2, border);
    }
  )(name, side1, side2);
};

/**
 * @param {string} name  The name of the diagonal strike to define
 * @param {number} neg   1 or -1 to use with the angle
 * @returns {DEFPAIR}     The notation definition for the diagonal strike
 */
export const DiagonalStrike = function <DOM extends DOM_TYPES>(
  name: string,
  neg: number
): DEFPAIR<DOM> {
  return Notation.CommonDiagonalStrike<ChtmlMencloseNTD<DOM>, N<DOM>>(
    (cname: string) => (node, _child) => {
      const { w, h, d } = node.getBBox();
      const [a, W] = node.getArgMod(w, h + d);
      const t = (neg * node.thickness) / 2;
      const strike = node.adjustBorder(
        node.html(cname, {
          style: {
            width: node.Em(W),
            transform:
              'rotate(' + node.fixed(-neg * a) + 'rad) translateY(' + t + 'em)',
          },
        })
      );
      node.adaptor.append(node.dom[0], strike);
    }
  )(name);
};

/**
 * @param {string} name   The name of the diagonal arrow to define
 * @returns {DEFPAIR}      The notation definition for the diagonal arrow
 */
export const DiagonalArrow = function <DOM extends DOM_TYPES>(
  name: string
): DEFPAIR<DOM> {
  return Notation.CommonDiagonalArrow<ChtmlMencloseNTD<DOM>, N<DOM>>(
    (node, arrow) => {
      node.adaptor.append(node.dom[0], arrow);
    }
  )(name);
};

/**
 * @param {string} name   The name of the horizontal or vertical arrow to define
 * @returns {DEFPAIR}      The notation definition for the arrow
 */
export const Arrow = function <DOM extends DOM_TYPES>(
  name: string
): DEFPAIR<DOM> {
  return Notation.CommonArrow<ChtmlMencloseNTD<DOM>, N<DOM>>((node, arrow) => {
    node.adaptor.append(node.dom[0], arrow);
  })(name);
};
