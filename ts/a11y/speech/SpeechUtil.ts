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
 * @file  Provides utility functions for speech handling.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import * as Sre from '../sre.js';

const ProsodyKeys = ['pitch', 'rate', 'volume'];

interface ProsodyElement {
  [propName: string]: string | boolean | number;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export interface SsmlElement extends ProsodyElement {
  pause?: string;
  text?: string;
  mark?: string;
  character?: boolean;
  kind?: string;
}

/**
 * Parses a string containing an ssml structure into a list of text strings
 * with associated ssml annotation elements.
 *
 * @param {string} speech The speech string.
 * @returns {[string, SsmlElement[]]} The annotation structure.
 */
export function ssmlParsing(speech: string): [string, SsmlElement[]] {
  const xml = Sre.parseDOM(speech);
  const instr: SsmlElement[] = [];
  const text: string[] = [];
  recurseSsml(Array.from(xml.childNodes), instr, text);
  return [text.join(' '), instr];
}

/**
 * Tail recursive combination of SSML components.
 *
 * @param {Node[]} nodes A list of SSML nodes.
 * @param {SsmlElement[]} instr Accumulator for collating Ssml annotation
 *    elements.
 * @param {string[]} text A list of text elements.
 * @param {ProsodyElement?} prosody The currently active prosody elements.
 */
function recurseSsml(
  nodes: Node[],
  instr: SsmlElement[],
  text: string[],
  prosody: ProsodyElement = {}
) {
  for (const node of nodes) {
    if (node.nodeType === 3) {
      const content = node.textContent.trim();
      if (content) {
        text.push(content);
        instr.push(Object.assign({ text: content }, prosody));
      }
      continue;
    }
    if (node.nodeType === 1) {
      const element = node as Element;
      const tag = element.tagName;
      if (tag === 'speak') {
        continue;
      }
      if (tag === 'prosody') {
        recurseSsml(
          Array.from(node.childNodes),
          instr,
          text,
          getProsody(element, prosody)
        );
        continue;
      }
      switch (tag) {
        case 'break':
          instr.push({ pause: element.getAttribute('time') });
          break;
        case 'mark':
          instr.push({ mark: element.getAttribute('name') });
          break;
        case 'say-as': {
          const txt = element.textContent;
          instr.push(Object.assign({ text: txt, character: true }, prosody));
          text.push(txt);
          break;
        }
      }
    }
  }
}

/**
 * Maps prosody types to scaling functions.
 */
// TODO: These should be tweaked after more testing.
const combinePros: { [key: string]: (x: number, sign: string) => number } = {
  pitch: (x: number, _sign: string) => 1 * (x / 100),
  volume: (x: number, _sign: string) => 0.5 * (x / 100),
  rate: (x: number, _sign: string) => 1 * (x / 100),
};

/**
 * Retrieves prosody annotations from an SSML node.
 *
 * @param {Element} element The SSML node.
 * @param {ProsodyElement} prosody The prosody annotation.
 * @returns {ProsodyElement} The combined prosody element.
 */
function getProsody(element: Element, prosody: ProsodyElement): ProsodyElement {
  const combine: ProsodyElement = {};
  for (const pros of ProsodyKeys) {
    if (element.hasAttribute(pros)) {
      const [sign, value] = extractProsody(element.getAttribute(pros));
      if (!sign) {
        // TODO: Sort out the base value. It is .5 for volume!
        combine[pros] = pros === 'volume' ? 0.5 : 1;
        continue;
      }
      let orig = prosody[pros] as number;
      orig = orig ? orig : pros === 'volume' ? 0.5 : 1;
      const relative = combinePros[pros](parseInt(value, 10), sign);
      combine[pros] = sign === '-' ? orig - relative : orig + relative;
    }
  }
  return combine;
}

/**
 * Extracts the prosody value from an attribute.
 */
const prosodyRegexp = /([+-]?)([0-9]+)%/;

/**
 * Extracts the prosody value from an attribute.
 *
 * @param {string} attr The prosody attribute.
 * @returns {[string, string]} The in terms of sign and value.
 */
function extractProsody(attr: string): [string, string] {
  const match = attr.match(prosodyRegexp);
  if (!match) {
    console.warn('Something went wrong with the prosody matching.');
    return ['', '100'];
  }
  return [match[1], match[2]];
}

/**
 * Speech, labels and aria
 */

/**
 * Builds a speech label from input components.
 *
 * @param {string} speech The speech string.
 * @param {string} prefix The prefix expression.
 * @param {string} postfix The postfix expression.
 * @param {string=} sep The separator string. Defaults to space.
 * @returns {string} The assembled label.
 */
export function buildLabel(
  speech: string,
  prefix: string,
  postfix: string,
  sep: string = ' '
): string {
  if (!speech) {
    return '';
  }
  const label = [speech];
  if (prefix) {
    label.unshift(prefix);
  }
  if (postfix) {
    label.push(postfix);
  }
  // TODO: Do we need to merge wrt. locale in SRE.
  return label.join(sep);
}

/**
 * Builds speechs from SSML markup strings.
 *
 * @param {string} speech The speech string.
 * @param {string=} locale An optional locale.
 * @param {string=} rate The base speech rate.
 * @returns {[string, SsmlElement[]]} The speech with the ssml annotation structure
 */
export function buildSpeech(
  speech: string,
  locale: string = 'en',
  rate: string = '100'
): [string, SsmlElement[]] {
  return ssmlParsing(
    '<?xml version="1.0"?><speak version="1.1"' +
      ' xmlns="http://www.w3.org/2001/10/synthesis"' +
      ` xml:lang="${locale}">` +
      `<prosody rate="${rate}%">${speech}` +
      '</prosody></speak>'
  );
}

/**
 * Creates a honking sound.
 */
export function honk() {
  const ac = new AudioContext();
  const os = ac.createOscillator();
  os.frequency.value = 300;
  os.connect(ac.destination);
  os.start(ac.currentTime);
  os.stop(ac.currentTime + 0.05);
}

/**
 * In place speech computations.
 */
export enum InPlace {
  NONE,
  DEPTH,
  SUMMARY,
}

/**
 * Speech attributes.
 */
export enum SemAttr {
  SPEECH = 'data-semantic-speech-none',
  SPEECH_SSML = 'data-semantic-speech',
  SUMMARY = 'data-semantic-summary-none',
  SUMMARY_SSML = 'data-semantic-summary',
  PREFIX = 'data-semantic-prefix-none',
  PREFIX_SSML = 'data-semantic-prefix',
  POSTFIX = 'data-semantic-postfix-none',
  POSTFIX_SSML = 'data-semantic-postfix',
  BRAILLE = 'data-semantic-braille',
}
