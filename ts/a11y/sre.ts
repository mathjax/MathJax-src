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
 * @file  Provides the interface functionality to SRE.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { Engine } from '#sre/common/engine.js';
import { parseInput } from '#sre/common/dom_util.js';
import { Variables } from '#sre/common/variables.js';
import { semanticMathmlSync } from '#sre/enrich_mathml/enrich.js';
import {
  addPreference as addPref,
  fromPreference as fromPref,
  toPreference as toPref,
} from '#sre/speech_rules/clearspeak_preference_string.js';

export const locales = Variables.LOCALES;

export const setupEngine = (x: { [key: string]: string | boolean }) => {
  return Engine.getInstance().setup(x);
};

export const engineSetup = () => {
  return Engine.getInstance().json();
};

export const toEnriched = (mml: string) => {
  return semanticMathmlSync(mml, Engine.getInstance().options);
};

export const parseDOM = parseInput;

//
// webpack doesn't seem to pick these up when building the ui/menu
// component when they are exported directly, so import first
// and then export.
//
export const addPreference = addPref;
export const fromPreference = fromPref;
export const toPreference = toPref;
