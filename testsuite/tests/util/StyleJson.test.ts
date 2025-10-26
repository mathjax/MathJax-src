import { describe, test, expect } from '@jest/globals';
import {StyleJsonSheet} from '#js/util/StyleJson.js';

describe('StyleJsonSheet object', () => {

  test('CssStyle creation', () => {
    expect(new StyleJsonSheet().cssText).toBe('');
    expect(new StyleJsonSheet({'.mjx': {padding: '0px'}}).cssText).toBe('.mjx {\n  padding: 0px;\n}');
    expect(new StyleJsonSheet({
      '.mjx': {
        padding: '0px',
        'font-size': '150%'
      },
      p: {
        'font-weight': 'bold'
      }
    }).cssText).toBe([
      '.mjx {',
      '  padding: 0px;',
      '  font-size: 150%;',
      '}',
      '',
      'p {',
      '  font-weight: bold;',
      '}'
    ].join('\n'));
  });

  test('Add/remove styles', () => {
    const styles = new StyleJsonSheet();
    styles.addStyles({p: {'font-weight': 'bold'}, h1: {'font-size': '150%'}, 'h2': {}});
    expect(styles.cssText).toBe('p {\n  font-weight: bold;\n}\n\nh1 {\n  font-size: 150%;\n}\n\nh2 {\n\n}');
    styles.removeStyles('h1', 'h2');
    expect(styles.cssText).toBe('p {\n  font-weight: bold;\n}');
    styles.clear();
    expect(styles.cssText).toBe('');
  });

  test('Compound style', () => {
    expect(new StyleJsonSheet({
      '@media (prefers-color-scheme: dark)': {
        'mjx-container': {
          'color': '#E0E0E0',
        },
      }
    }).cssText).toBe([
      '@media (prefers-color-scheme: dark) {',
      '  mjx-container {',
      '    color: #E0E0E0;',
      '  }',
      '}'
    ].join('\n'));
  });

});
