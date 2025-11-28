import { describe, test, expect } from '@jest/globals';
import {Styles, StyleList} from '#js/util/Styles.js';

function cssTest(css: string, list: StyleList, text: string = css + ';') {
  const styles = new Styles(css);
  expect(styles.styleList).toEqual(list);
  expect(styles.cssText).toBe(text);
}

function cssFontTest(css: string, list: StyleList) {
  const test = Array.from(Object.keys(list)).map((k) => `${k}: ${list[k]};`).join(' ');
  return cssTest(css, list, test);
}

describe('CssStyles object', () => {

  test('Styles parsing', () => {
    cssTest('', {}, ''); // emtpy list
    cssTest('font-size: 150%', {'font-size': '150%'}); // one style
    cssTest('abc-def: 0', {'abc-def': '0'}); // unknown style is retained
    cssTest('a: 0; b: 1px', {a: '0', b: '1px'}); // multiple styles
    cssTest('a: 0; /*b: 1px*/ c: bold', {a: '0', c: 'bold'}, 'a: 0; c: bold;'); // comments
    cssTest('  a  : \n  0  ;   b\n :   1px \n ', {a: '0', b: '1px'}, 'a: 0; b: 1px;'); // extra spaces
    cssTest('abc: ; xyz: 0', {xyz: '0'}, 'xyz: 0;'); // missing value
    cssTest('abc xyz: 1px', {}, ''); // malformed CSS string

    cssTest(`abc: xy 'pqr`, {abc: `xy 'pqr'`}, `abc: xy 'pqr';`);            // append missing '
    cssTest(`abc: xy "pqr`, {abc: `xy "pqr"`}, `abc: xy "pqr";`);            // append missing "
    cssTest(`abc: xy '\\'pqr`, {abc: `xy '\\'pqr'`}, `abc: xy '\\'pqr';`);   // handle quoted '
    cssTest(`abc: xy "\\"pqr`, {abc: `xy "\\"pqr"`}, `abc: xy "\\"pqr";`);   // handle quoted "
    cssTest(`abc: ';'`, {abc: `';'`});               // handle quoted ;
    cssTest(`abc: ';`, {abc: `';'`}, `abc: ';';`);   // and missing '

    cssTest('\nabc\n:\n xyz \n; \n def \n : \n pqr\n ; \n ', {
      abc: 'xyz',
      def: 'pqr'
    }, 'abc: xyz; def: pqr;');
    cssTest(`abc: \n xy \n 'pqr\n`, {abc: `xy   'pqr '`}, `abc: xy   'pqr ';`);

    //
    // Remove unquoted ; and beyond
    //
    const styles = new Styles();
    styles.set('abc', 'xy ; z');
    expect(styles.styleList).toEqual({abc: 'xy'});
    expect(styles.cssText).toBe('abc: xy;');
  });

  test('padding', () => {
    cssTest('padding: 3px', {
      'padding': '3px',
      'padding-bottom': '3px',
      'padding-left': '3px',
      'padding-right': '3px',
      'padding-top': '3px'
    });
    cssTest('padding: 3px; padding-right: 1px', {
      'padding': '3px 1px 3px 3px',
      'padding-bottom': '3px',
      'padding-left': '3px',
      'padding-right': '1px',
      'padding-top': '3px'
    }, 'padding: 3px 1px 3px 3px;');
    cssTest('padding-top: 0; padding-right: 1px; padding-bottom: 0; padding-left: 1px', {
      'padding': '0 1px',
      'padding-bottom': '0',
      'padding-left': '1px',
      'padding-right': '1px',
      'padding-top': '0'
    }, 'padding: 0 1px;');
    cssTest('padding-top: 0; padding-right: 1px; padding-bottom: 2px; padding-left: 1px', {
      'padding': '0 1px 2px',
      'padding-bottom': '2px',
      'padding-left': '1px',
      'padding-right': '1px',
      'padding-top': '0'
    }, 'padding: 0 1px 2px;');
    cssTest('padding-top: 0; padding-right: 0; padding-bottom: 0; padding-left: 0', {
      'padding': '0',
      'padding-bottom': '0',
      'padding-left': '0',
      'padding-right': '0',
      'padding-top': '0'
    }, 'padding: 0;');
    cssTest('padding-left: 2px; padding: 0', {
      'padding': '0',
      'padding-bottom': '0',
      'padding-left': '0',
      'padding-right': '0',
      'padding-top': '0'
    }, 'padding: 0;');
    cssTest('padding:', {}, '');
  });

  test('margin', () => {
    cssTest('margin-left: 2px; margin: 0', {
      'margin': '0',
      'margin-bottom': '0',
      'margin-left': '0',
      'margin-right': '0',
      'margin-top': '0'
    }, 'margin: 0;');
    cssTest('margin: 3px', {
      'margin': '3px',
      'margin-bottom': '3px',
      'margin-left': '3px',
      'margin-right': '3px',
      'margin-top': '3px'
    });
    cssTest('margin: 3px; margin-right: 1px', {
      'margin': '3px 1px 3px 3px',
      'margin-bottom': '3px',
      'margin-left': '3px',
      'margin-right': '1px',
      'margin-top': '3px'
    }, 'margin: 3px 1px 3px 3px;');
    cssTest('margin-top: 0; margin-right: 1px; margin-bottom: 0; margin-left: 1px', {
      'margin': '0 1px',
      'margin-bottom': '0',
      'margin-left': '1px',
      'margin-right': '1px',
      'margin-top': '0'
    }, 'margin: 0 1px;');
    cssTest('margin-top: 0; margin-right: 1px; margin-bottom: 2px; margin-left: 1px', {
      'margin': '0 1px 2px',
      'margin-bottom': '2px',
      'margin-left': '1px',
      'margin-right': '1px',
      'margin-top': '0'
    }, 'margin: 0 1px 2px;');
    cssTest('margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0', {
      'margin': '0',
      'margin-bottom': '0',
      'margin-left': '0',
      'margin-right': '0',
      'margin-top': '0'
    }, 'margin: 0;');
    cssTest('margin-left: 2px; margin: 0', {
      'margin': '0',
      'margin-bottom': '0',
      'margin-left': '0',
      'margin-right': '0',
      'margin-top': '0'
    }, 'margin: 0;');
    cssTest('margin:', {}, '');
  }),

  test('border', () => {
    cssTest('border: 3px solid red', {
      'border': '3px solid red',
      'border-top': '3px solid red',
      'border-top-color': 'red',
      'border-top-style': 'solid',
      'border-top-width': '3px',
      'border-right': '3px solid red',
      'border-right-color': 'red',
      'border-right-style': 'solid',
      'border-right-width': '3px',
      'border-bottom': '3px solid red',
      'border-bottom-color': 'red',
      'border-bottom-style': 'solid',
      'border-bottom-width': '3px',
      'border-left': '3px solid red',
      'border-left-color': 'red',
      'border-left-style': 'solid',
      'border-left-width': '3px'
    });
    cssTest('border: 3px solid red; border-top: inset blue 2px', {
      'border-top': 'inset blue 2px',
      'border-top-color': 'blue',
      'border-top-style': 'inset',
      'border-top-width': '2px',
      'border-right': '3px solid red',
      'border-right-color': 'red',
      'border-right-style': 'solid',
      'border-right-width': '3px',
      'border-bottom': '3px solid red',
      'border-bottom-color': 'red',
      'border-bottom-style': 'solid',
      'border-bottom-width': '3px',
      'border-left': '3px solid red',
      'border-left-color': 'red',
      'border-left-style': 'solid',
      'border-left-width': '3px'
    }, [
      'border-top: inset blue 2px; border-right: 3px solid red;',
      'border-bottom: 3px solid red; border-left: 3px solid red;'
    ].join(' '));
    cssTest('border: 3px solid red; border-top-color: blue', {
      'border-top': '3px solid blue',
      'border-top-color': 'blue',
      'border-top-style': 'solid',
      'border-top-width': '3px',
      'border-right': '3px solid red',
      'border-right-color': 'red',
      'border-right-style': 'solid',
      'border-right-width': '3px',
      'border-bottom': '3px solid red',
      'border-bottom-color': 'red',
      'border-bottom-style': 'solid',
      'border-bottom-width': '3px',
      'border-left': '3px solid red',
      'border-left-color': 'red',
      'border-left-style': 'solid',
      'border-left-width': '3px'
    }, [
      'border-top: 3px solid blue; border-right: 3px solid red;',
      'border-bottom: 3px solid red; border-left: 3px solid red;'
    ].join(' '));
    cssTest('border-top: 3px solid red; border-top-color: blue', {
      'border-top': '3px solid blue',
      'border-top-color': 'blue',
      'border-top-style': 'solid',
      'border-top-width': '3px',
    }, 'border-top: 3px solid blue;');
    cssTest('border-top: 3px solid red; border-top-style: groove', {
      'border-top': '3px groove red',
      'border-top-color': 'red',
      'border-top-style': 'groove',
      'border-top-width': '3px',
    }, 'border-top: 3px groove red;');
    cssTest('border-top: 3px solid red; border-top-width: 2px', {
      'border-top': '2px solid red',
      'border-top-color': 'red',
      'border-top-style': 'solid',
      'border-top-width': '2px',
    }, 'border-top: 2px solid red;');
    cssTest('border: 3px solid', {
      'border': '3px solid',
      'border-bottom': '3px solid',
      'border-bottom-style': 'solid',
      'border-bottom-width': '3px',
      'border-left': '3px solid',
      'border-left-style': 'solid',
      'border-left-width': '3px',
      'border-right': '3px solid',
      'border-right-style': 'solid',
      'border-right-width': '3px',
      'border-top': '3px solid',
      'border-top-style': 'solid',
      'border-top-width': '3px',
    });
    cssTest('border: 3px blue', {
      'border': '3px blue',
      'border-bottom': '3px blue',
      'border-bottom-color': 'blue',
      'border-bottom-width': '3px',
      'border-left': '3px blue',
      'border-left-color': 'blue',
      'border-left-width': '3px',
      'border-right': '3px blue',
      'border-right-color': 'blue',
      'border-right-width': '3px',
      'border-top': '3px blue',
      'border-top-color': 'blue',
      'border-top-width': '3px',
    });
    cssTest('border: solid blue', {
      'border': 'solid blue',
      'border-bottom': 'solid blue',
      'border-bottom-color': 'blue',
      'border-bottom-style': 'solid',
      'border-left': 'solid blue',
      'border-left-color': 'blue',
      'border-left-style': 'solid',
      'border-right': 'solid blue',
      'border-right-color': 'blue',
      'border-right-style': 'solid',
      'border-top': 'solid blue',
      'border-top-color': 'blue',
      'border-top-style': 'solid',
    });
    cssTest('border-top: red; border-right: red; border-bottom: red; border-left: red', {
      'border': 'red',
      'border-bottom': 'red',
      'border-bottom-color': 'red',
      'border-left': 'red',
      'border-left-color': 'red',
      'border-right': 'red',
      'border-right-color': 'red',
      'border-top': 'red',
      'border-top-color': 'red',
    }, 'border: red;');
    cssTest('border: 3px solid red; border-width: 2px', {
      'border': '2px solid red',
      'border-bottom': '2px solid red',
      'border-bottom-color': 'red',
      'border-bottom-style': 'solid',
      'border-bottom-width': '2px',
      'border-left': '2px solid red',
      'border-left-color': 'red',
      'border-left-style': 'solid',
      'border-left-width': '2px',
      'border-right': '2px solid red',
      'border-right-color': 'red',
      'border-right-style': 'solid',
      'border-right-width': '2px',
      'border-top': '2px solid red',
      'border-top-color': 'red',
      'border-top-style': 'solid',
      'border-top-width': '2px',
    }, 'border: 2px solid red;');
    cssTest('border: red; border-left-color:', {
      'border-bottom': 'red',
      'border-bottom-color': 'red',
      'border-right': 'red',
      'border-right-color': 'red',
      'border-top': 'red',
      'border-top-color': 'red',
    }, 'border-top: red; border-right: red; border-bottom: red;');
    cssTest('border-radius: 3px', {
      'border-radius': '3px',
    });
    cssTest('background: red; background-clip: none', {
      'background': 'red',
      'background-clip': 'none',
    });
    cssTest(' border-top: inset blue 2px; border: 3px solid red', {
      'border': '3px solid red',
      'border-top': '3px solid red',
      'border-top-color': 'red',
      'border-top-style': 'solid',
      'border-top-width': '3px',
      'border-right': '3px solid red',
      'border-right-color': 'red',
      'border-right-style': 'solid',
      'border-right-width': '3px',
      'border-bottom': '3px solid red',
      'border-bottom-color': 'red',
      'border-bottom-style': 'solid',
      'border-bottom-width': '3px',
      'border-left': '3px solid red',
      'border-left-color': 'red',
      'border-left-style': 'solid',
      'border-left-width': '3px',
    }, 'border: 3px solid red;');
    cssTest('border-top-color: blue; border-top: 3px solid red', {
      'border-top': '3px solid red',
      'border-top-color': 'red',
      'border-top-style': 'solid',
      'border-top-width': '3px',
    }, 'border-top: 3px solid red;');
  });

  test('font', () => {
    cssFontTest('font-family: arial', {'font-family': 'arial'});
    cssFontTest('font-size: 120%', {'font-size': '120%'});
    cssFontTest('font-style: italic', {'font-style': 'italic'});
    cssFontTest('font-weight: bold', {'font-weight': 'bold'});
    cssFontTest('font: arial 120%', {
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font:   arial   120%', {
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: 120% arial', {
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial small', {
      'font-size': 'small',
      'font-family': 'arial'
    });
    cssFontTest('font: arial 16px', {
      'font-size': '16px',
      'font-family': 'arial'
    });
    cssFontTest('font: arial bold 120%', {
      'font-weight': 'bold',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial lighter 120%', {
      'font-weight': 'lighter',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial italic 120%', {
      'font-style': 'italic',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial bold italic 120%', {
      'font-style': 'italic',
      'font-weight': 'bold',
      'font-size': '120%',
      'font-family': 'arial',
    });
    cssFontTest('font: arial full-width 120%', {
      'font-variant': 'full-width',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial full-width simplified 120%', {
      'font-variant': 'full-width simplified',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial condensed 120%', {
      'font-stretch': 'condensed',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial semi-condensed 120%', {
      'font-stretch': 'semi-condensed',
      'font-size': '120%',
      'font-family': 'arial'
    });
    cssFontTest('font: arial small/.75', {
      'line-height': '.75',
      'font-size': 'small',
      'font-family': 'arial'
    });
    cssFontTest('font: arial small/12px', {
      'line-height': '12px',
      'font-size': 'small',
      'font-family': 'arial'
    });
    cssFontTest('font: arial small/75%', {
      'line-height': '75%',
      'font-size': 'small',
      'font-family': 'arial'
    });
    cssFontTest('font: arial bold 120%; font-style: italic', {
      'font-weight': 'bold',
      'font-size': '120%',
      'font-family': 'arial',
      'font-style': 'italic'
    });
  });

  test('get()', () => {
    const styles = new Styles('padding: 0; padding-left: 1px');
    expect(styles.get('padding')).toBe('0 0 0 1px');
    expect(styles.get('padding-top')).toBe('0');
    expect(styles.get('padding-right')).toBe('0');
    expect(styles.get('padding-bottom')).toBe('0');
    expect(styles.get('padding-left')).toBe('1px');
    expect(styles.get('border')).toBe('');
  });

  test('set()', () => {
    const styles = new Styles('padding-left: 2px');
    styles.set('padding-left', '3px');
    expect(styles.get('padding-left')).toBe('3px');
    expect(styles.get('padding')).toBe('');
    expect(styles.cssText).toBe('padding-left: 3px;');
    styles.set('padding', '');
    expect(styles.get('padding-left')).toBe('');
    expect(styles.get('padding')).toBe('');
    expect(styles.cssText).toBe('');
  });

});
