/*************************************************************
 *
 *  Copyright (c) 2018-2021 The MathJax Consortium
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
 * @fileoverview  Provides the interface functionality to SRE.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

export {engineReady as sreReady, setupEngine, engineSetup, toEnriched} from 'speech-rule-engine/js/common/system.js';
export {Walker} from 'speech-rule-engine/js/walker/walker.js';
export * as WalkerFactory from 'speech-rule-engine/js/walker/walker_factory.js';
export {SpeechGenerator} from 'speech-rule-engine/js/speech_generator/speech_generator.js';
export * as SpeechGeneratorFactory from 'speech-rule-engine/js/speech_generator/speech_generator_factory.js';
export {EngineConst} from 'speech-rule-engine/js/common/engine.js';
export {ClearspeakPreferences} from 'speech-rule-engine/js/speech_rules/clearspeak_preferences.js';
export {Highlighter} from 'speech-rule-engine/js/highlighter/highlighter.js';
export * as HighlighterFactory from 'speech-rule-engine/js/highlighter/highlighter_factory.js';

import {Variables} from 'speech-rule-engine/js/common/variables.js';

export const Locales = Variables.LOCALES;
