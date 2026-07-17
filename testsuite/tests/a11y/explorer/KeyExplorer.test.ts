import { describe, expect, test } from '@jest/globals';
import { SpeechExplorer } from '#js/a11y/explorer/KeyExplorer.js';

class TestSpeechExplorer extends SpeechExplorer {
  public setRole(node: HTMLElement, description: string) {
    this.setRoleDescription(node, description);
  }

  public setBrailleRole(node: HTMLElement, description: string) {
    this.setBrailleRoleDescription(node, description);
  }
}

function makeExplorer() {
  return new TestSpeechExplorer(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    { none: '\u0091', brailleNone: '\u2800' } as any
  );
}

function makeNode() {
  const attributes = new Map<string, string>();
  return {
    attributes,
    node: {
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
    } as HTMLElement,
  };
}

describe('SpeechExplorer role descriptions', () => {
  test('omits placeholder role descriptions', () => {
    const explorer = makeExplorer();
    const { attributes, node } = makeNode();

    explorer.setRole(node, 'math');
    expect(attributes.get('aria-roledescription')).toBe('math');

    explorer.setRole(node, '\u0091');
    expect(attributes.has('aria-roledescription')).toBe(false);

    explorer.setRole(node, '\u2800');
    expect(attributes.has('aria-roledescription')).toBe(false);
  });

  test('omits placeholder braille role descriptions', () => {
    const explorer = makeExplorer();
    const { attributes, node } = makeNode();

    explorer.setBrailleRole(node, 'math');
    expect(attributes.get('aria-brailleroledescription')).toBe('math');

    explorer.setBrailleRole(node, '\u0091');
    expect(attributes.has('aria-brailleroledescription')).toBe(false);

    explorer.setBrailleRole(node, '\u2800');
    expect(attributes.has('aria-brailleroledescription')).toBe(false);
  });
});
