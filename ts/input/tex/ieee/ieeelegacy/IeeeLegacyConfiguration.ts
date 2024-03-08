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
 * @fileoverview Configuration file for the IEEE Legacy Macros package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import BaseMethods from '../../base/BaseMethods.js';
import {CommandMap} from '../../TokenMap.js';
import {Configuration} from '../../Configuration.js';

/**
 * Obsolete macros from the former IEEE extension package.
 */
new CommandMap('ieee-legacy', {
  // Table 1
  BBA: ['Macro', '{\\Bbb A}'],
  BBB: ['Macro', '{\\Bbb B}'],
  BBC: ['Macro', '{\\Bbb C}'],
  BBD: ['Macro', '{\\Bbb D}'],
  BBE: ['Macro', '{\\Bbb E}'],
  BBF: ['Macro', '{\\Bbb F}'],
  BBG: ['Macro', '{\\Bbb G}'],
  BBH: ['Macro', '{\\Bbb H}'],
  BBI: ['Macro', '{\\Bbb I}'],
  BBJ: ['Macro', '{\\Bbb J}'],
  BBK: ['Macro', '{\\Bbb K}'],
  BBL: ['Macro', '{\\Bbb L}'],
  BBM: ['Macro', '{\\Bbb M}'],
  BBN: ['Macro', '{\\Bbb N}'],
  BBO: ['Macro', '{\\Bbb O}'],
  BBP: ['Macro', '{\\Bbb P}'],
  BBQ: ['Macro', '{\\Bbb Q}'],
  BBR: ['Macro', '{\\Bbb R}'],
  BBS: ['Macro', '{\\Bbb S}'],
  BBT: ['Macro', '{\\Bbb T}'],
  BBU: ['Macro', '{\\Bbb U}'],
  BBV: ['Macro', '{\\Bbb V}'],
  BBW: ['Macro', '{\\Bbb W}'],
  BBX: ['Macro', '{\\Bbb X}'],
  BBY: ['Macro', '{\\Bbb Y}'],
  BBZ: ['Macro', '{\\Bbb Z}'],
  
  // Table 17
  /* Needs dsfont package */
  /* Don't use dsmath macros, use correct syntax \mathds{x} */
  dsmathA: ['Macro', '\\mathds{A}'],
  dsmathB: ['Macro', '\\mathds{B}'],
  dsmathC: ['Macro', '\\mathds{C}'],
  dsmathD: ['Macro', '\\mathds{D}'],
  dsmathE: ['Macro', '\\mathds{E}'],
  dsmathF: ['Macro', '\\mathds{F}'],
  dsmathG: ['Macro', '\\mathds{G}'],
  dsmathH: ['Macro', '\\mathds{H}'],
  dsmathI: ['Macro', '\\mathds{I}'],
  dsmathJ: ['Macro', '\\mathds{J}'],
  dsmathK: ['Macro', '\\mathds{K}'],
  dsmathL: ['Macro', '\\mathds{L}'],
  dsmathM: ['Macro', '\\mathds{M}'],
  dsmathN: ['Macro', '\\mathds{N}'],
  dsmathO: ['Macro', '\\mathds{O}'],
  dsmathP: ['Macro', '\\mathds{P}'],
  dsmathQ: ['Macro', '\\mathds{Q}'],
  dsmathR: ['Macro', '\\mathds{R}'],
  dsmathS: ['Macro', '\\mathds{S}'],
  dsmathT: ['Macro', '\\mathds{T}'],
  dsmathU: ['Macro', '\\mathds{U}'],
  dsmathV: ['Macro', '\\mathds{V}'],
  dsmathW: ['Macro', '\\mathds{W}'],
  dsmathX: ['Macro', '\\mathds{X}'],
  dsmathY: ['Macro', '\\mathds{Y}'],
  dsmathZ: ['Macro', '\\mathds{Z}'],
  dsmatha: ['Macro', '\\mathds{a}'],
  dsmathb: ['Macro', '\\mathds{b}'],
  dsmathc: ['Macro', '\\mathds{c}'],
  dsmathd: ['Macro', '\\mathds{d}'],
  dsmathe: ['Macro', '\\mathds{e}'],
  dsmathf: ['Macro', '\\mathds{f}'],
  dsmathg: ['Macro', '\\mathds{g}'],
  dsmathh: ['Macro', '\\mathds{h}'],
  dsmathi: ['Macro', '\\mathds{i}'],
  dsmathj: ['Macro', '\\mathds{j}'],
  dsmathk: ['Macro', '\\mathds{k}'],
  dsmathl: ['Macro', '\\mathds{l}'],
  dsmathm: ['Macro', '\\mathds{m}'],
  dsmathn: ['Macro', '\\mathds{n}'],
  dsmatho: ['Macro', '\\mathds{o}'],
  dsmathp: ['Macro', '\\mathds{p}'],
  dsmathq: ['Macro', '\\mathds{q}'],
  dsmathr: ['Macro', '\\mathds{r}'],
  dsmaths: ['Macro', '\\mathds{s}'],
  dsmatht: ['Macro', '\\mathds{t}'],
  dsmathu: ['Macro', '\\mathds{u}'],
  dsmathv: ['Macro', '\\mathds{v}'],
  dsmathw: ['Macro', '\\mathds{w}'],
  dsmathx: ['Macro', '\\mathds{x}'],
  dsmathy: ['Macro', '\\mathds{y}'],
  dsmathz: ['Macro', '\\mathds{z}'],
  dsmathone: ['Macro', '\\mathds{1}'],
  dsmathtwo: ['Macro', '\\mathds{2}'],
  dsmaththree: ['Macro', '\\mathds{3}'],
  dsmathfour: ['Macro', '\\mathds{4}'],
  dsmathfive: ['Macro', '\\mathds{5}'],
  dsmathsix: ['Macro', '\\mathds{6}'],
  dsmathseven: ['Macro', '\\mathds{7}'],
  dsmatheight: ['Macro', '\\mathds{8}'],
  dsmathnine: ['Macro', '\\mathds{9}'],
  dsmathzero: ['Macro', '\\mathds{0}'],
  dsmath: ['Macro', '\\mathds{#1}', 1],

  // Table 16
  /* Needs bbm package */
  /* Don't use bbmssmath, use correct syntax \mathbbmss{x} */
  bbmssmathA: ['Macro', '\\mathbbmss{A}'],
  bbmssmathB: ['Macro', '\\mathbbmss{B}'],
  bbmssmathC: ['Macro', '\\mathbbmss{C}'],
  bbmssmathD: ['Macro', '\\mathbbmss{D}'],
  bbmssmathE: ['Macro', '\\mathbbmss{E}'],
  bbmssmathF: ['Macro', '\\mathbbmss{F}'],
  bbmssmathG: ['Macro', '\\mathbbmss{G}'],
  bbmssmathH: ['Macro', '\\mathbbmss{H}'],
  bbmssmathI: ['Macro', '\\mathbbmss{I}'],
  bbmssmathJ: ['Macro', '\\mathbbmss{J}'],
  bbmssmathK: ['Macro', '\\mathbbmss{K}'],
  bbmssmathL: ['Macro', '\\mathbbmss{L}'],
  bbmssmathM: ['Macro', '\\mathbbmss{M}'],
  bbmssmathN: ['Macro', '\\mathbbmss{N}'],
  bbmssmathO: ['Macro', '\\mathbbmss{O}'],
  bbmssmathP: ['Macro', '\\mathbbmss{P}'],
  bbmssmathQ: ['Macro', '\\mathbbmss{Q}'],
  bbmssmathR: ['Macro', '\\mathbbmss{R}'],
  bbmssmathS: ['Macro', '\\mathbbmss{S}'],
  bbmssmathT: ['Macro', '\\mathbbmss{T}'],
  bbmssmathU: ['Macro', '\\mathbbmss{U}'],
  bbmssmathV: ['Macro', '\\mathbbmss{V}'],
  bbmssmathW: ['Macro', '\\mathbbmss{W}'],
  bbmssmathX: ['Macro', '\\mathbbmss{X}'],
  bbmssmathY: ['Macro', '\\mathbbmss{Y}'],
  bbmssmathZ: ['Macro', '\\mathbbmss{Z}'],
  bbmssmatha: ['Macro', '\\mathbbmss{a}'],
  bbmssmathb: ['Macro', '\\mathbbmss{b}'],
  bbmssmathc: ['Macro', '\\mathbbmss{c}'],
  bbmssmathd: ['Macro', '\\mathbbmss{d}'],
  bbmssmathe: ['Macro', '\\mathbbmss{e}'],
  bbmssmathf: ['Macro', '\\mathbbmss{f}'],
  bbmssmathg: ['Macro', '\\mathbbmss{g}'],
  bbmssmathh: ['Macro', '\\mathbbmss{h}'],
  bbmssmathi: ['Macro', '\\mathbbmss{i}'],
  bbmssmathj: ['Macro', '\\mathbbmss{j}'],
  bbmssmathk: ['Macro', '\\mathbbmss{k}'],
  bbmssmathl: ['Macro', '\\mathbbmss{l}'],
  bbmssmathm: ['Macro', '\\mathbbmss{m}'],
  bbmssmathn: ['Macro', '\\mathbbmss{n}'],
  bbmssmatho: ['Macro', '\\mathbbmss{o}'],
  bbmssmathp: ['Macro', '\\mathbbmss{p}'],
  bbmssmathq: ['Macro', '\\mathbbmss{q}'],
  bbmssmathr: ['Macro', '\\mathbbmss{r}'],
  bbmssmaths: ['Macro', '\\mathbbmss{s}'],
  bbmssmatht: ['Macro', '\\mathbbmss{t}'],
  bbmssmathu: ['Macro', '\\mathbbmss{u}'],
  bbmssmathv: ['Macro', '\\mathbbmss{v}'],
  bbmssmathw: ['Macro', '\\mathbbmss{w}'],
  bbmssmathx: ['Macro', '\\mathbbmss{x}'],
  bbmssmathy: ['Macro', '\\mathbbmss{y}'],
  bbmssmathz: ['Macro', '\\mathbbmss{z}'],
  bbmssmathzero: ['Macro', '\\mathbbmss{0}'],
  bbmssmathone: ['Macro', '\\mathbbmss{1}'],
  bbmssmathtwo: ['Macro', '\\mathbbmss{2}'],
  bbmssmaththree: ['Macro', '\\mathbbmss{3}'],
  bbmssmathfour: ['Macro', '\\mathbbmss{4}'],
  bbmssmathfive: ['Macro', '\\mathbbmss{5}'],
  bbmssmathsix: ['Macro', '\\mathbbmss{6}'],
  bbmssmathseven: ['Macro', '\\mathbbmss{7}'],
  bbmssmatheight: ['Macro', '\\mathbbmss{8}'],
  bbmssmathnine: ['Macro', '\\mathbbmss{9}'],
}, {
  Macro: BaseMethods.Macro
});

export const IeeeLegacyConfiguration = Configuration.create(
  'ieeelegacy', {
    handler: {
      macro: ['ieee-legacy']
    }
  }
)
