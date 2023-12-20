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
 * @fileoverview  Provides utility functions for speech handling.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import Sre from '../sre.js';

const ProsodyKeys = [ 'pitch', 'rate', 'volume' ];

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
 * @return {[string, SsmlElement[]]} The annotation structure.
 */
export function ssmlParsing(speech: string): [string, SsmlElement[]] {
  let xml = Sre.parseDOM(speech);
  let instr: SsmlElement[] = [];
  let text: String[] = [];
  recurseSsml(Array.from(xml.childNodes), instr, text);
  return [text.join(' '), instr];
}

/**
 * Tail recursive combination of SSML components.
 *
 * @param {Node[]} nodes A list of SSML nodes.
 * @param {SsmlElement[]} instr Accumulator for collating Ssml annotation
 *    elements.
 * @param {String[]} text A list of text elements.
 * @param {ProsodyElement?} prosody The currently active prosody elements.
 */
function recurseSsml(nodes: Node[], instr: SsmlElement[], text: String[],
                     prosody: ProsodyElement = {}) {
  for (let node of nodes) {
    if (node.nodeType === 3) {
      let content = node.textContent.trim();
      if (content) {
        text.push(content);
        instr.push(Object.assign({text: content}, prosody));
      }
      continue;
    }
    if (node.nodeType === 1) {
      let element = node as Element;
      let tag = element.tagName;
      if (tag === 'speak') {
        continue;
      }
      if (tag === 'prosody') {
        recurseSsml(
          Array.from(node.childNodes), instr, text,
          getProsody(element, prosody));
        continue;
      }
      switch (tag) {
        case 'break':
          instr.push({pause: element.getAttribute('time')});
          break;
        case 'mark':
          instr.push({mark: element.getAttribute('name')});
          break;
        case 'say-as':
          let txt = element.textContent;
          instr.push(Object.assign({text: txt, character: true}, prosody));
          text.push(txt);
          break;
      }
    }
  }
}

/**
 * Maps prosody types to scaling functions.
 */
// TODO: These should be tweaked after more testing.
const combinePros: {[key: string]: (x: number, sign: string) => number} = {
  pitch: (x: number, _sign: string) => 1 * (x / 100),
  volume: (x: number, _sign: string) => .5 * (x / 100),
  rate: (x: number, _sign: string) =>  1 * (x / 100)
};

/**
 * Retrieves prosody annotations from and SSML node.
 * @param {Element} element The SSML node.
 * @param {ProsodyElement} prosody The prosody annotation.
 */
function getProsody(element: Element, prosody: ProsodyElement) {
  let combine: ProsodyElement = {};
  for (let pros of ProsodyKeys) {
    if (element.hasAttribute(pros)) {
      let [sign, value] = extractProsody(element.getAttribute(pros));
      if (!sign) {
        // TODO: Sort out the base value. It is .5 for volume!
        combine[pros] = (pros === 'volume') ? .5 : 1;
        continue;
      }
      let orig = prosody[pros] as number;
      orig = orig ? orig : ((pros === 'volume') ? .5 : 1);
      let relative = combinePros[pros](parseInt(value, 10), sign);
      combine[pros] = (sign === '-') ? orig - relative : orig + relative;
    }
  }
  return combine;
}

/**
 * Extracts the prosody value from an attribute.
 */
const prosodyRegexp = /([\+-]?)([0-9]+)%/;

/**
 * Extracts the prosody value from an attribute.
 * @param {string} attr
 */
function extractProsody(attr: string) {
  let match = attr.match(prosodyRegexp);
  if (!match) {
    console.warn('Something went wrong with the prosody matching.');
    return ['', '100'];
  }
  return [match[1], match[2]];
}


/**
 *
 * Speech, labels and aria
 *
 */

function getAttribute(node: MmlNode | Element, attr: string): string {
  return (node instanceof Element) ?
    node.getAttribute(attr) :
    node.attributes.getExplicit(attr) as string;
}

/**
 * Computes the aria-label from the node.
 * @param {MmlNode} node The Math element.
 * @param {string=} sep The speech separator. Defaults to space.
 */
export function getLabel(node: MmlNode | Element,
                  center: string = 'data-semantic-speech',
                  sep: string = ' ') {
  return buildLabel(
    getAttribute(node, center),
    getAttribute(node, 'data-semantic-prefix'),
    // TODO: check if we need this or if it is automatic by the screen readers.
    getAttribute(node, 'data-semantic-postfix'),
    sep
  );
}

/**
 * Builds a speech label from input components.
 *
 * @param speech The speech string.
 * @param prefix The prefix expression.
 * @param postfix The postfix expression.
 * @param sep The separator string. Defaults to space.
 */
export function buildLabel(
  speech: string, prefix: string, postfix: string, sep: string = ' ') {
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
 * @return {[string, SsmlElement[]]} The speech with the ssml annotation structure 
 */
export function buildSpeech(speech: string, locale: string = 'en',
                            rate: string = '100'): [string, SsmlElement[]] {
  return ssmlParsing('<?xml version="1.0"?><speak version="1.1"' +
    ' xmlns="http://www.w3.org/2001/10/synthesis"' +
    ` xml:lang="${locale}">` +
    `<prosody rate="${rate}%">${speech}`+
    '</prosody></speak>');
}

/**
 * Retrieve and sets aria and braille labels recursively.
 * @param {MmlNode} node The root node to search from.
 */
export function setAria(node: MmlNode, locale: string) {
  const attributes = node.attributes;
  if (!attributes) return;
  const speech = getLabel(node);
  if (speech) {
    attributes.set('aria-label', buildSpeech(speech, locale)[0]);
  }
  const braille = getAttribute(node, 'data-semantic-braille');
  if (braille) {
    attributes.set('aria-braillelabel', braille);
  }
  for (let child of node.childNodes) {
    setAria(child, locale);
  }
}

/**
 * Updates Aria labels.
 * @param {MmlNode} node The root node to search from.
 */
export function updateAria(node: HTMLElement, locale: string) { 
  let speech = node.getAttribute('data-semantic-speech');
  if (speech) {
    node.setAttribute('aria-label', buildSpeech(speech, locale)[0]);
  }
  for (let child of Array.from(node.childNodes)) {
    if (child instanceof HTMLElement) {
      updateAria(child, locale);
    }
  }
}

/**
 * Creates a honking sound.
 */
export function honk() {
  let ac = new AudioContext();
  let os = ac.createOscillator();
  os.frequency.value = 300;
  os.connect(ac.destination);
  os.start(ac.currentTime);
  os.stop(ac.currentTime + .05);
}
