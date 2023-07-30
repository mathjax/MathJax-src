const ProsodyKeys = [ 'pitch', 'rate', 'volume' ];

interface ProsodyElement {
  [propName: string]: string | boolean | number;
  pitch?: number;
  rate?: number;
  volume?: number;
}

export interface SsmlElement extends ProsodyElement {
  [propName: string]: string | boolean | number;
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
    let dp = new DOMParser();
    let xml = dp.parseFromString(speech, 'text/xml');
    let instr: SsmlElement[] = [];
    let text: String[] = [];
    recurseSsml(Array.from(xml.documentElement.childNodes), instr, text);
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
          default:
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
const prosodyRegexp = /([\+|-]*)([0-9]+)%/;

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

