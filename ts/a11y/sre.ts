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

import * as Api from '#sre/common/system.js';
import * as SpeechGeneratorFactory from '#sre/speech_generator/speech_generator_factory.js';
import { Engine } from '#sre/common/engine.js';
import { ClearspeakPreferences } from '#sre/speech_rules/clearspeak_preferences.js';
import { Highlighter } from '#sre/highlighter/highlighter.js';
import * as HighlighterFactory from '#sre/highlighter/highlighter_factory.js';
import { SpeechGenerator } from '#sre/speech_generator/speech_generator.js';
import { SemanticNode } from '#sre/semantic_tree/semantic_node.js';
import { parseInput } from '#sre/common/dom_util.js';
import { Variables } from '#sre/common/variables.js';
import MathMaps from './mathmaps.js';

export type highlighter = Highlighter;

export type speechGenerator = SpeechGenerator;

export type semanticNode = SemanticNode;

export const locales = Variables.LOCALES;

/**
 * A promise that resolves when SRE is loaded and ready, and rejects if
 * SRE can't be loaded, or does not become ready within the timout period.
 *
 * @deprecated
 */
export const sreReady = Api.engineReady;

export const setupEngine = Api.setupEngine;

export const engineSetup = Api.engineSetup;

export const toEnriched = Api.toEnriched;

export const toSpeech = Api.toSpeech;

export const clearspeakPreferences = ClearspeakPreferences;

export const getHighlighter = HighlighterFactory.highlighter;

export const updateHighlighter = HighlighterFactory.update;

export const getSpeechGenerator = SpeechGeneratorFactory.generator;

export const parseDOM = parseInput;

/**
 * Loads locales that are already included in the imported MathMaps. Defaults
 * to standard loading if a locale is not yet preloaded.
 *
 * @param {string} locale A locale to preload from the bundle.
 * @returns {Promise} Promise that resolves when locales are loaded.
 */
export const preloadLocales = async function (locale: string): Promise<string> {
  const json = MathMaps.get(locale);
  return json
    ? new Promise((res, _rej) => res(JSON.stringify(json)))
    : Api.localeLoader()(locale);
};

// Setting delay stops SRE from setting itself up (and loading locales) when it
// is not actually being used. As we are not yet sure in which environment we
// are (browser, node) we can not use a configuration vector.
Engine.getInstance().delay = true;
