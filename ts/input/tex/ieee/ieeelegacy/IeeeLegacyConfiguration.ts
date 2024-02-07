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
  
  /* Don't use dsmath macros, use correct syntax \mathds{x} */
  dsmathA: ['Macro', '\\unicode[serif]{x1D538}'],
  dsmathB: ['Macro', '\\unicode[serif]{x1D539}'],
  dsmathC: ['Macro', '\\unicode[serif]{x02102}'],
  dsmathD: ['Macro', '\\unicode[serif]{x1D53B}'],
  dsmathE: ['Macro', '\\unicode[serif]{x1D53C}'],
  dsmathF: ['Macro', '\\unicode[serif]{x1D53D}'],
  dsmathG: ['Macro', '\\unicode[serif]{x1D53E}'],
  dsmathH: ['Macro', '\\unicode[serif]{x0210D}'],
  dsmathI: ['Macro', '\\unicode[serif]{x1D540}'],
  dsmathJ: ['Macro', '\\unicode[serif]{x1D541}'],
  dsmathK: ['Macro', '\\unicode[serif]{x1D542}'],
  dsmathL: ['Macro', '\\unicode[serif]{x1D543}'],
  dsmathM: ['Macro', '\\unicode[serif]{x1D544}'],
  dsmathN: ['Macro', '\\unicode[serif]{x02115}'],
  dsmathO: ['Macro', '\\unicode[serif]{x1D546}'],
  dsmathP: ['Macro', '\\unicode[serif]{x02119}'],
  dsmathQ: ['Macro', '\\unicode[serif]{x0211A}'],
  dsmathR: ['Macro', '\\unicode[serif]{x0211D}'],
  dsmathS: ['Macro', '\\unicode[serif]{x1D54A}'],
  dsmathT: ['Macro', '\\unicode[serif]{x1D54B}'],
  dsmathU: ['Macro', '\\unicode[serif]{x1D54C}'],
  dsmathV: ['Macro', '\\unicode[serif]{x1D54D}'],
  dsmathW: ['Macro', '\\unicode[serif]{x1D54E}'],
  dsmathX: ['Macro', '\\unicode[serif]{x1D54F}'],
  dsmathY: ['Macro', '\\unicode[serif]{x1D550}'],
  dsmathZ: ['Macro', '\\unicode[serif]{x02124}'],
  dsmatha: ['Macro', '\\unicode[serif]{x1D552}'],
  dsmathb: ['Macro', '\\unicode[serif]{x1D553}'],
  dsmathc: ['Macro', '\\unicode[serif]{x1D554}'],
  dsmathd: ['Macro', '\\unicode[serif]{x1D555}'],
  dsmathe: ['Macro', '\\unicode[serif]{x1D556}'],
  dsmathf: ['Macro', '\\unicode[serif]{x1D557}'],
  dsmathg: ['Macro', '\\unicode[serif]{x1D558}'],
  dsmathh: ['Macro', '\\unicode[serif]{x1D559}'],
  dsmathi: ['Macro', '\\unicode[serif]{x1D55A}'],
  dsmathj: ['Macro', '\\unicode[serif]{x1D55B}'],
  dsmathk: ['Macro', '\\unicode[serif]{x1D55C}'],
  dsmathl: ['Macro', '\\unicode[serif]{x1D55D}'],
  dsmathm: ['Macro', '\\unicode[serif]{x1D55E}'],
  dsmathn: ['Macro', '\\unicode[serif]{x1D55F}'],
  dsmatho: ['Macro', '\\unicode[serif]{x1D560}'],
  dsmathp: ['Macro', '\\unicode[serif]{x1D561}'],
  dsmathq: ['Macro', '\\unicode[serif]{x1D562}'],
  dsmathr: ['Macro', '\\unicode[serif]{x1D563}'],
  dsmaths: ['Macro', '\\unicode[serif]{x1D564}'],
  dsmatht: ['Macro', '\\unicode[serif]{x1D565}'],
  dsmathu: ['Macro', '\\unicode[serif]{x1D566}'],
  dsmathv: ['Macro', '\\unicode[serif]{x1D567}'],
  dsmathw: ['Macro', '\\unicode[serif]{x1D568}'],
  dsmathx: ['Macro', '\\unicode[serif]{x1D569}'],
  dsmathy: ['Macro', '\\unicode[serif]{x1D56A}'],
  dsmathz: ['Macro', '\\unicode[serif]{x1D56B}'],
  dsmath1: ['Macro', '\\unicode[serif]{x1D7D9}'],
  dsmathtwo: ['Macro', '\\unicode[serif]{x1D7DA}'],
  dsmaththree: ['Macro', '\\unicode[serif]{x1D7DB}'],
  dsmathfour: ['Macro', '\\unicode[serif]{x1D7DC}'],
  dsmathfive: ['Macro', '\\unicode[serif]{x1D7DD}'],
  dsmathsix: ['Macro', '\\unicode[serif]{x1D7DE}'],
  dsmathseven: ['Macro', '\\unicode[serif]{x1D7DF}'],
  dsmatheight: ['Macro', '\\unicode[serif]{x1D7E0}'],
  dsmathnine: ['Macro', '\\unicode[serif]{x1D7E1}'],
  dsmathzero: ['Macro', '\\unicode[serif]{x1D7D8}'],

  /* Don't use bbmssmath, use correct syntax \mathbbmss{x} */
  bbmssmathA: ['Macro', '\\unicode[sans-serif]{x1D538}'],
  bbmssmathB: ['Macro', '\\unicode{x1D539}'],
  bbmssmathC: ['Macro', '\\unicode{x02102}'],
  bbmssmathD: ['Macro', '\\unicode{x1D53B}'],
  bbmssmathE: ['Macro', '\\unicode{x1D53C}'],
  bbmssmathF: ['Macro', '\\unicode{x1D53D}'],
  bbmssmathG: ['Macro', '\\unicode{x1D53E}'],
  bbmssmathH: ['Macro', '\\unicode{x0210D}'],
  bbmssmathI: ['Macro', '\\unicode{x1D540}'],
  bbmssmathJ: ['Macro', '\\unicode{x1D541}'],
  bbmssmathK: ['Macro', '\\unicode{x1D542}'],
  bbmssmathL: ['Macro', '\\unicode{x1D543}'],
  bbmssmathM: ['Macro', '\\unicode{x1D544}'],
  bbmssmathN: ['Macro', '\\unicode{x02115}'],
  bbmssmathO: ['Macro', '\\unicode{x1D546}'],
  bbmssmathP: ['Macro', '\\unicode{x02119}'],
  bbmssmathQ: ['Macro', '\\unicode{x0211A}'],
  bbmssmathR: ['Macro', '\\unicode{x0211D}'],
  bbmssmathS: ['Macro', '\\unicode{x1D54A}'],
  bbmssmathT: ['Macro', '\\unicode{x1D54B}'],
  bbmssmathU: ['Macro', '\\unicode{x1D54C}'],
  bbmssmathV: ['Macro', '\\unicode{x1D54D}'],
  bbmssmathW: ['Macro', '\\unicode{x1D54E}'],
  bbmssmathX: ['Macro', '\\unicode{x1D54F}'],
  bbmssmathY: ['Macro', '\\unicode{x1D550}'],
  bbmssmathZ: ['Macro', '\\unicode{x02124}'],
  bbmssmatha: ['Macro', '\\unicode{x1D552}'],
  bbmssmathb: ['Macro', '\\unicode{x1D553}'],
  bbmssmathc: ['Macro', '\\unicode{x1D554}'],
  bbmssmathd: ['Macro', '\\unicode{x1D555}'],
  bbmssmathe: ['Macro', '\\unicode{x1D556}'],
  bbmssmathf: ['Macro', '\\unicode{x1D557}'],
  bbmssmathg: ['Macro', '\\unicode{x1D558}'],
  bbmssmathh: ['Macro', '\\unicode{x1D559}'],
  bbmssmathi: ['Macro', '\\unicode{x1D55A}'],
  bbmssmathj: ['Macro', '\\unicode{x1D55B}'],
  bbmssmathk: ['Macro', '\\unicode{x1D55C}'],
  bbmssmathl: ['Macro', '\\unicode{x1D55D}'],
  bbmssmathm: ['Macro', '\\unicode{x1D55E}'],
  bbmssmathn: ['Macro', '\\unicode{x1D55F}'],
  bbmssmatho: ['Macro', '\\unicode{x1D560}'],
  bbmssmathp: ['Macro', '\\unicode{x1D561}'],
  bbmssmathq: ['Macro', '\\unicode{x1D562}'],
  bbmssmathr: ['Macro', '\\unicode{x1D563}'],
  bbmssmaths: ['Macro', '\\unicode{x1D564}'],
  bbmssmatht: ['Macro', '\\unicode{x1D565}'],
  bbmssmathu: ['Macro', '\\unicode{x1D566}'],
  bbmssmathv: ['Macro', '\\unicode{x1D567}'],
  bbmssmathw: ['Macro', '\\unicode{x1D568}'],
  bbmssmathx: ['Macro', '\\unicode{x1D569}'],
  bbmssmathy: ['Macro', '\\unicode{x1D56A}'],
  bbmssmathz: ['Macro', '\\unicode{x1D56B}'],
  bbmssmathzero: ['Macro', '\\unicode{x1D7D8}'],
  bbmssmathone: ['Macro', '\\unicode{x1D7D9}'],
  bbmssmathtwo: ['Macro', '\\unicode{x1D7DA}'],
  bbmssmaththree: ['Macro', '\\unicode{x1D7DB}'],
  bbmssmathfour: ['Macro', '\\unicode{x1D7DC}'],
  bbmssmathfive: ['Macro', '\\unicode{x1D7DD}'],
  bbmssmathsix: ['Macro', '\\unicode{x1D7DE}'],
  bbmssmathseven: ['Macro', '\\unicode{x1D7DF}'],
  bbmssmatheight: ['Macro', '\\unicode{x1D7E0}'],
  bbmssmathnine: ['Macro', '\\unicode{x1D7E1}'],

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
