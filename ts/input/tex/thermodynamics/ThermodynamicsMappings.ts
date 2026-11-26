/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file Mappings file for the thermodynamics package.
 *
 * @author kaiserkarl31@yahoo.com (Karl D. Hammond)
 * Updated by dpvc@mathjax.org (Davide P. Cervone)
 */

import ParseMethods from '../ParseMethods.js';
import {
  ThermodynamicsMethods as TDM,
  ThermodynamicsDelimiters as delimiters,
} from './ThermodynamicsMethods.js';
import { CommandMap, EnvironmentMap } from '../TokenMap.js';

/*
 * These reduce the final file size, since they can be reduced
 * to smaller strings when webpacked.
 */
const Latex = TDM.Latex;
const Macro = TDM.Macro;
const SupSymbol = TDM.SuperscriptedSymbol;
const SubSymbol = TDM.SubscriptedSymbol;
const PMSuped = TDM.PartialMolarSuperscripted;
const PMSubed = TDM.PartialMolarSubscripted;
const Change = TDM.ChangeonSomething;
const Partial = TDM.Partial;
const Partial2 = TDM.PartialSecond;
const PartialM2 = TDM.PartialMixSecond;
const All = TDM.AllThings;
const AllBut = TDM.AllThingsExcept;
const AllButLast = TDM.AllThingsExceptLastAnd;
const Jacobian = TDM.JacobianMatrix;

/**
 * Macros for the [tex]/thermodynamics package
 */
new CommandMap('thermodynamics-macros', {
  //
  // Internal macros
  //

  //
  // These 6 (plus Nt below) are defined during package initialization
  // based on the symbol-set that is specified in the options.
  //
  // AreaSymbol: [Latex, 'a'],
  // TotalEnergySymbol: [Latex, 'E'],
  // EnthalpySymbol: [Latex, 'H'],
  // GibbsSymbol: [Latex, 'G'],
  // HelmholtzSymbol: [Latex, 'A'],
  // InternalEnergySymbol: [Latex, 'U'],

  EntropySymbol: [Latex, 'S'],
  VolumeSymbol: [Latex, 'V'],
  heatcapacitysymbol: [Latex, 'C'],
  ncomponents: TDM.NComponents,
  compressibilitysymbol: [Latex, '\\kappa'],
  expansivitysymbol: [Latex, '\\alpha'],
  extensive: [TDM.EISProperty, 'extensive'],
  intensive: [TDM.EISProperty, 'intensive'],
  specific: [TDM.EISProperty, 'specific'],

  //
  // User-facing symbols
  //
  dbar: [Latex, '\u0111'],
  residual: [Latex, 'R'],
  excess: [Latex, 'E'],
  partialmolar: TDM.PartialMolar,
  NewExtensiveProperty: TDM.NewExtensiveProperty,
  NewPartialMolarProperty: TDM.NewPartialMolarProperty,
  NewExcessProperty: TDM.NewExcessProperty,
  NewResidualProperty: TDM.NewResidualProperty,
  NewThermodynamicProperty: TDM.NewThermodynamicProperty,
  At: [Latex, '\\extensive{\\AreaSymbol}'],
  Am: [Latex, '\\intensive{\\AreaSymbol}'],
  As: [Latex, '\\specific{\\AreaSymbol}'],
  Apm: [Macro, '\\partialmolar{\\AreaSymbol}'],
  Et: [Latex, '\\extensive{\\TotalEnergySymbol}'],
  Em: [Latex, '\\intensive{\\TotalEnergySymbol}'],
  Es: [Latex, '\\specific{\\TotalEnergySymbol}'],
  Epm: [Macro, '\\partialmolar{\\TotalEnergySymbol}'],
  EEt: [SupSymbol, '\\extensive{\\TotalEnergySymbol}', '\\excess'],
  EE: [SupSymbol, '\\intensive{\\TotalEnergySymbol}', '\\excess'],
  EEs: [SupSymbol, '\\specific{\\TotalEnergySymbol}', '\\excess'],
  EEpm: [PMSuped, '\\intensive{\\TotalEnergySymbol}', '\\excess'],
  ERt: [SupSymbol, '\\extensive{\\TotalEnergySymbol}', '\\residual'],
  ER: [SupSymbol, '\\intensive{\\TotalEnergySymbol}', '\\residual'],
  ERs: [SupSymbol, '\\specific{\\TotalEnergySymbol}', '\\residual'],
  ERpm: [PMSuped, '\\intensive{\\TotalEnergySymbol}', '\\residual'],
  Ft: [Latex, '\\extensive{\\HelmholtzSymbol}'],
  Fm: [Latex, '\\intensive{\\HelmholtzSymbol}'],
  Fs: [Latex, '\\specific{\\HelmholtzSymbol}'],
  FRt: [SupSymbol, '\\extensive{\\HelmholtzSymbol}', '\\residual'],
  FR: [SupSymbol, '\\intensive{\\HelmholtzSymbol}', '\\residual'],
  FRs: [SupSymbol, '\\specific{\\HelmholtzSymbol}', '\\residual'],
  FEt: [SupSymbol, '\\extensive{\\HelmholtzSymbol}', '\\excess'],
  FE: [SupSymbol, '\\intensive{\\HelmholtzSymbol}', '\\excess'],
  FEs: [SupSymbol, '\\specific{\\HelmholtzSymbol}', '\\excess'],
  Fpm: [Macro, '\\partialmolar{\\HelmholtzSymbol}'],
  FRpm: [PMSuped, '\\intensive{\\HelmholtzSymbol}', '\\residual'],
  FEpm: [PMSuped, '\\intensive{\\HelmholtzSymbol}', '\\excess'],
  Gt: [Latex, '\\extensive{\\GibbsSymbol}'],
  Gm: [Latex, '\\intensive{\\GibbsSymbol}'],
  Gs: [Latex, '\\specific{\\GibbsSymbol}'],
  Gpm: [Macro, '\\partialmolar{\\GibbsSymbol}'],
  GRt: [SupSymbol, '\\extensive{\\GibbsSymbol}', '\\residual'],
  GR: [SupSymbol, '\\intensive{\\GibbsSymbol}', '\\residual'],
  GRs: [SupSymbol, '\\specific{\\GibbsSymbol}', '\\residual'],
  GEt: [SupSymbol, '\\extensive{\\GibbsSymbol}', '\\excess'],
  GE: [SupSymbol, '\\intensive{\\GibbsSymbol}', '\\excess'],
  GEs: [SupSymbol, '\\specific{\\GibbsSymbol}', '\\excess'],
  GRpm: [PMSuped, '\\intensive{\\GibbsSymbol}', '\\residual'],
  GEpm: [PMSuped, '\\intensive{\\GibbsSymbol}', '\\excess'],
  Ht: [Latex, '\\extensive{\\EnthalpySymbol}'],
  Hm: [Latex, '\\intensive{\\EnthalpySymbol}'],
  Hs: [Latex, '\\specific{\\EnthalpySymbol}'],
  Hpm: [Macro, '\\partialmolar{\\EnthalpySymbol}'],
  HRt: [SupSymbol, '\\extensive{\\EnthalpySymbol}', '\\residual'],
  HR: [SupSymbol, '\\intensive{\\EnthalpySymbol}', '\\residual'],
  HRs: [SupSymbol, '\\specific{\\EnthalpySymbol}', '\\residual'],
  HEt: [SupSymbol, '\\extensive{\\EnthalpySymbol}', '\\excess'],
  HE: [SupSymbol, '\\intensive{\\EnthalpySymbol}', '\\excess'],
  HEs: [SupSymbol, '\\specific{\\EnthalpySymbol}', '\\excess'],
  HRpm: [PMSuped, '\\intensive{\\EnthalpySymbol}', '\\residual'],
  HEpm: [PMSuped, '\\intensive{\\EnthalpySymbol}', '\\excess'],
  Lt: [Latex, '\\extensive{\\Omega}'],
  Lm: [Latex, '\\intensive{\\Omega}'],
  Ls: [Latex, '\\specific{\\Omega}'],
  Lpm: [Macro, '\\partialmolar{\\Omega}'],
  LEt: [SupSymbol, '\\extensive{\\Omega}', '\\excess'],
  LE: [SupSymbol, '\\intensive{\\Omega}', '\\excess'],
  LEs: [SupSymbol, '\\specific{\\Omega}', '\\excess'],
  LEpm: [PMSuped, '\\intensive{\\Omega}', '\\excess'],
  LRt: [SupSymbol, '\\extensive{\\Omega}', '\\residual'],
  LR: [SupSymbol, '\\intensive{\\Omega}', '\\residual'],
  LRs: [SupSymbol, '\\specific{\\Omega}', '\\residual'],
  LRpm: [PMSuped, '\\intensive{\\Omega}', '\\residual'],
  // Nt: [Latex, 'n'], // This defined during package initialization
  Qt: [Latex, '\\extensive{Q}'],
  Qm: [Latex, '\\intensive{Q}'],
  Qs: [Latex, '\\specific{Q}'],
  St: [Latex, '\\extensive{\\EntropySymbol}'],
  Sm: [Latex, '\\intensive{\\EntropySymbol}'],
  Ss: [Latex, '\\specific{\\EntropySymbol}'],
  Spm: [Macro, '\\partialmolar{\\EntropySymbol}'],
  SRt: [SupSymbol, '\\extensive{\\EntropySymbol}', '\\residual'],
  SR: [SupSymbol, '\\intensive{\\EntropySymbol}', '\\residual'],
  SRs: [SupSymbol, '\\specific{\\EntropySymbol}', '\\residual'],
  SRpm: [PMSuped, '\\intensive{\\EntropySymbol}', '\\residual'],
  SEt: [SupSymbol, '\\specific{\\EntropySymbol}', '\\excess'],
  SE: [SupSymbol, '\\intensive{\\EntropySymbol}', '\\excess'],
  SEs: [SupSymbol, '\\specific{\\EntropySymbol}', '\\excess'],
  SEpm: [PMSuped, '\\intensive{\\EntropySymbol}', '\\excess'],
  Ut: [Latex, '\\extensive{\\InternalEnergySymbol}'],
  Um: [Latex, '\\intensive{\\InternalEnergySymbol}'],
  Us: [Latex, '\\specific{\\InternalEnergySymbol}'],
  Upm: [Macro, '\\partialmolar{\\InternalEnergySymbol}'],
  URt: [SupSymbol, '\\extensive{\\InternalEnergySymbol}', '\\residual'],
  UR: [SupSymbol, '\\intensive{\\InternalEnergySymbol}', '\\residual'],
  URs: [SupSymbol, '\\specific{\\InternalEnergySymbol}', '\\residual'],
  URpm: [PMSuped, '\\InternalEnergySymbol', '\\residual'],
  UEt: [SupSymbol, '\\extensive{\\InternalEnergySymbol}', '\\excess'],
  UE: [SupSymbol, '\\intensive{\\InternalEnergySymbol}', '\\excess'],
  UEs: [SupSymbol, '\\specific{\\InternalEnergySymbol}', '\\excess'],
  UEpm: [PMSuped, '\\InternalEnergySymbol', '\\excess'],
  Vt: [Latex, '\\extensive{\\VolumeSymbol}'],
  Vm: [Latex, '\\intensive{\\VolumeSymbol}'],
  Vs: [Latex, '\\specific{\\VolumeSymbol}'],
  Vpm: [Macro, '\\partialmolar{\\VolumeSymbol}'],
  VRt: [SupSymbol, '\\extensive{\\VolumeSymbol}', '\\residual'],
  VR: [SupSymbol, '\\intensive{\\VolumeSymbol}', '\\residual'],
  VRs: [SupSymbol, '\\specific{\\VolumeSymbol}', '\\residual'],
  VRpm: [PMSuped, '\\VolumeSymbol', '\\residual'],
  VEt: [SupSymbol, '\\extensive{\\VolumeSymbol}', '\\excess'],
  VE: [SupSymbol, '\\intensive{\\VolumeSymbol}', '\\excess'],
  VEs: [SupSymbol, '\\specific{\\VolumeSymbol}', '\\excess'],
  VEpm: [PMSuped, '\\VolumeSymbol', '\\excess'],
  Wt: [Latex, '\\extensive{W}'],
  Wm: [Latex, '\\intensive{W}'],
  Ws: [Latex, '\\specific{W}'],
  cP: [SubSymbol, '\\intensive{\\heatcapacitysymbol}', 'P'],
  cPt: [SubSymbol, '\\extensive{\\heatcapacitysymbol}', 'P'],
  cPs: [SubSymbol, '\\specific{\\heatcapacitysymbol}', 'P'],
  cPpm: [PMSubed, '\\intensive{\\heatcapacitysymbol}', 'P'],
  cVpm: [PMSubed, '\\intensive{\\heatcapacitysymbol}', '\\VolumeSymbol'],
  cV: [SubSymbol, '\\intensive{\\heatcapacitysymbol}', '\\VolumeSymbol'],
  cVt: [SubSymbol, '\\extensive{\\heatcapacitysymbol}', '\\VolumeSymbol'],
  cVs: [SubSymbol, '\\specific{\\heatcapacitysymbol}', '\\VolumeSymbol'],
  kappaT: [SubSymbol, '\\compressibilitysymbol', 'T'],
  kappaS: [SubSymbol, '\\compressibilitysymbol', 'S'],
  alphaP: [SubSymbol, '\\expansivitysymbol', 'P'],
  alphaS: [SubSymbol, '\\expansivitysymbol', '\\EntropySymbol'],
  muJT: [SubSymbol, '\\mu', '\\text{JT}'],
  fpure: [Latex, 'f'],
  fmix: [Latex, '\\hat f'],
  phipure: [Latex, '\\phi'],
  phimix: [Latex, '\\hat\\phi'],
  actabs: [Latex, '\\lambda'],
  actrel: [Latex, 'a'],
  muit: [Latex, '\\mu'],
  gammait: [Latex, '\\gamma'],
  gammarat: [Latex, '\\gamma^*'],
  gammamol: [Latex, '\\gamma^\\Box'],
  Henryrat: [Latex, 'h'],
  Henrymol: [Latex, '\\mathcal{H}'],
  sat: [Latex, '\\text{sat}'],
  fsat: [Latex, 'f^{\\sat}'],
  Psat: [Latex, 'P^{\\sat}'],
  Pvap: [Latex, 'P^{\\sat}'],
  phisat: [Latex, '\\phi^{\\sat}'],
  std: [Latex, '\\circ'],
  Cstd: [Latex, 'C^{\\std}'],
  fstd: [Latex, 'f^{\\std}'],
  Pstd: [Latex, 'P^{\\std}'],
  mustd: [Latex, '\\mu^{\\std}'],
  mixing: [Latex, '\\text{mix}'],
  formation: [Latex, 'f'],
  fusion: [Latex, '\\text{fus}'],
  reaction: [Latex, '\\text{rxn}'],
  sublimation: [Latex, '\\text{sub}'],
  vaporization: [Latex, '\\text{vap}'],
  Deltaf: [Change, '\\formation'],
  Deltamix: [Change, '\\mixing'],
  Deltarxn: [Change, '\\reaction'],
  Deltafus: [Change, null, '\\fusion'],
  Deltasub: [Change, null, '\\sublimation'],
  Deltavap: [Change, null, '\\vaporization'],
  xrxn: [Latex, '\\xi'],
  Partial: Partial,
  PartialSecond: Partial2,
  PartialMixSecond: PartialM2,
  Partialinline: [Partial, true],
  PartialSecondinline: [Partial2, true],
  PartialMixSecondinline: [PartialM2, true],
  PartialBigg: [Partial, false, false, '\\Biggl', '\\Biggr'],
  PartialSecondBigg: [Partial2, false, false, '\\Biggl', '\\Biggr'],
  PartialMixSecondBigg: [PartialM2, false, false, '\\Biggl', '\\Biggr'],
  Partialbigg: [Partial, false, false, '\\biggl', '\\biggr'],
  PartialSecondbigg: [Partial2, false, false, '\\biggl', '\\biggr'],
  PartialMixSecondbigg: [PartialM2, false, false, '\\biggl', '\\biggr'],
  Partialinlinetext: [Partial, true, true],
  PartialSecondinlinetext: [Partial2, true, true],
  PartialMixSecondinlinetext: [PartialM2, true, true],
  allbut: [AllBut, null],
  allbutlastand: [AllButLast, null],
  allNs: [All, '\\Nt'],
  allNsbut: [AllBut, '\\Nt'],
  allmus: [All, '\\mu'],
  allmusbut: [AllBut, '\\mu'],
  allXs: [All, 'x'],
  allXsbut: [AllButLast, 'x'],
  allYs: [All, 'y'],
  allYsbut: [AllButLast, 'y'],
  allMs: [All, 'm'],
  allMsbut: [AllBut, 'm'],
  allWs: [All, 'w'],
  allWsbut: [AllBut, 'w'],
  Jacobian: [Macro, '\\frac{\\partial(#1)}{\\partial(#2)}', 2],
  Jacobiandet: [Jacobian, 'vmatrix'],
  Jacobianmatrix: [Jacobian, 'matrix'],
  Jacobianbmatrix: [Jacobian, 'bmatrix'],
  Jacobianpmatrix: [Jacobian, 'pmatrix'],
  sumall: [Macro, '\\sum_{#2=1}^{\\ncomponents}', 2],
  sumallbutlast: [Macro, '\\sum_{#2=1}^{\\ncomponents-1}', 2],
  prodall: [Macro, '\\prod_{#2=1}^{\\ncomponents}', 2],
  IG: [Latex, '{\\text{IG}}'],
  IS: [Latex, '{\\text{IS}}'],
  IGM: [Latex, '{\\text{IGM}}'],
  Epot: [Latex, 'E'],
});

const LocalEIS = TDM.LocalEISstyle;
const LocalDelims = TDM.LocalPmDelimiters;

/**
 * Environments for the [tex]/thermodynamics package
 */
new EnvironmentMap('thermodynamics-environments', ParseMethods.environment, {
  thermointensiveplain: [LocalEIS, null, 'intensive-plain'],
  thermoextensiveplain: [LocalEIS, null, 'extensive-plain'],
  thermoextensivesuperscript: [LocalEIS, null, 'extensive-superscript'],
  thermointensivelowercase: [LocalEIS, null, 'intensive-lowercase'],
  thermoparentheses: [LocalDelims, null, delimiters.parentheses],
  thermobrackets: [LocalDelims, null, delimiters.brackets],
  thermobraces: [LocalDelims, null, delimiters.braces],
  thermobar: [LocalDelims, null, delimiters.bar],
  thermoplain: [LocalDelims, null, delimiters.plain],
  thermolongpm: [TDM.LocalPmStyle, null, 'long'],
  thermoshortpm: [TDM.LocalPmStyle, null, 'short'],
  thermosubscripts: [TDM.LocalSubscripts, null, true],
  thermoNOsubscripts: [TDM.LocalSubscripts, null, false],
  thermomolesindex: [TDM.LocalMolesStyle, null, 'index'],
  thermomolesrange: [TDM.LocalMolesStyle, null, 'range'],
});
