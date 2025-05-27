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
 * @file  Provides the interface functionality to SRE.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { Engine } from '#sre/common/engine.js';
import { ClearspeakPreferences } from '#sre/speech_rules/clearspeak_preferences.js';
import { parseInput } from '#sre/common/dom_util.js';
import { Variables } from '#sre/common/variables.js';
import { semanticMathmlSync } from '#sre/enrich_mathml/enrich.js';

export const locales = Variables.LOCALES;

export const setupEngine = (x: { [key: string]: string | boolean }) => {
  return Engine.getInstance().setup(x);
};

export const engineSetup = () => {
  return Engine.getInstance().json();
};

// export const toEnriched = Api.toEnriched;
export const toEnriched = (mml: string) => {
  return semanticMathmlSync(mml, Engine.getInstance().options);
};

export const clearspeakPreferences = ClearspeakPreferences;

export const parseDOM = parseInput;
