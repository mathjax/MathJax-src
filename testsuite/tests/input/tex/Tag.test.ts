import { beforeEach, describe, expect, it } from '@jest/globals';
import {
  setupTex,
  tex2mml,
  setupTexPage,
  page2mml,
  setupComponents,
  expectTexError,
} from '#helpers';
import '#js/input/tex/ams/AmsConfiguration';

/**********************************************************************************/

describe('TagAll', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'all' }));

  it('Single Expression', () => {
    expect(tex2mml('a')).toMatchSnapshot();
  });

  it('Align', () => {
    expect(tex2mml('\\begin{align}a\\end{align}')).toMatchSnapshot();
  });

  it('MultLine', () => {
    expect(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}')
    ).toMatchSnapshot();
  });

  it('Label Empty', () => {
    expect(tex2mml('\\begin{align}a\\label{}\\end{align}')).toMatchSnapshot();
  });

  it('Label', () => {
    expect(tex2mml('\\begin{align}a\\label{A}\\end{align}')).toMatchSnapshot();
  });

  it('Notag Align', () => {
    expect(tex2mml('\\begin{align}a\\notag\\end{align}')).toMatchSnapshot();
  });

  it('Notag Multline', () => {
    expect(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}')
    ).toMatchSnapshot();
  });

  it('Notag Tag', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}')
    ).toMatchSnapshot();
  });

  it('Ref', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Unknown', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}')
    ).toMatchSnapshot();
  });

  it('Eqref', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}')
    ).toMatchSnapshot();
  });

  it('Align Two labels', () => {
    expect(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Illegal Tag Error', () => {
    expectTexError('\\begin{split}a\\tag{A}\\end{split}').toBe(
      '\\tag not allowed in split environment'
    );
  });

  it('Double Tag Error', () => {
    expectTexError('\\begin{align}a\\tag{A}\\tag{B}\\end{align}').toBe(
      'Multiple \\tag'
    );
  });

  it('Double Label Error', () => {
    expectTexError('\\begin{align}a\\label{A}\\label{B}\\end{align}').toBe(
      'Multiple \\label'
    );
  });

  it('Duplicate Label Error', () => {
    expectTexError(
      '\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'
    ).toBe("Label 'A' multiply defined");
  });

  it('Tag Default', () => {
    expect(tex2mml('\\begin{align}a\\end{align}')).toMatchSnapshot();
  });

  it('Tag Named', () => {
    expect(tex2mml('\\begin{align}a\\tag{A}\\end{align}')).toMatchSnapshot();
  });

  it('Tag Named Default', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}')
    ).toMatchSnapshot();
  });

  it('Tag Named Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Default', () => {
    expect(tex2mml('\\begin{align}a\\label{A}\\end{align}')).toMatchSnapshot();
  });

  it('Label Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Named Default', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Named Named', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      )
    ).toMatchSnapshot();
  });

  it('Ref Default', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Named Default', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      )
    ).toMatchSnapshot();
  });

  it('Ref Named Named', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      )
    ).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('TagNone', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'none' }));

  it('Single Expression', () => {
    expect(tex2mml('a')).toMatchSnapshot();
  });

  it('Simple Tag', () => {
    expect(tex2mml('a\\tag{0}')).toMatchSnapshot();
  });

  it('Align', () => {
    expect(tex2mml('\\begin{align}a\\end{align}')).toMatchSnapshot();
  });

  it('Split', () => {
    expect(tex2mml('\\begin{split}a\\end{split}')).toMatchSnapshot();
  });

  it('MultLine', () => {
    expect(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}')
    ).toMatchSnapshot();
  });

  it('Label Empty', () => {
    expect(tex2mml('\\begin{align}a\\label{}\\end{align}')).toMatchSnapshot();
  });

  it('Label', () => {
    expect(tex2mml('\\begin{align}a\\label{A}\\end{align}')).toMatchSnapshot();
  });

  it('Notag Align', () => {
    expect(tex2mml('\\begin{align}a\\notag\\end{align}')).toMatchSnapshot();
  });

  it('Notag Multline', () => {
    expect(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}')
    ).toMatchSnapshot();
  });

  it('Notag Tag', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}')
    ).toMatchSnapshot();
  });

  it('Ref', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Unknown', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}')
    ).toMatchSnapshot();
  });

  it('Eqref', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}')
    ).toMatchSnapshot();
  });

  it('Align Two labels', () => {
    expectTexError(
      '\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}'
    ).toBe('Multiple \\label');
  });

  it('Illegal Tag Error', () => {
    expectTexError('\\begin{split}a\\tag{A}\\end{split}').toBe(
      '\\tag not allowed in split environment'
    );
  });

  it('Double Tag Error', () => {
    expectTexError('\\begin{align}a\\tag{A}\\tag{B}\\end{align}').toBe(
      'Multiple \\tag'
    );
  });

  it('Double Label Error', () => {
    expectTexError('\\begin{align}a\\label{A}\\label{B}\\end{align}').toBe(
      'Multiple \\label'
    );
  });

  it('Duplicate Label Error', () => {
    expectTexError(
      '\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'
    ).toBe('Multiple \\label');
  });

  it('Tag Default', () => {
    expect(tex2mml('\\begin{align}a\\end{align}')).toMatchSnapshot();
  });

  it('Tag Named', () => {
    expect(tex2mml('\\begin{align}a\\tag{A}\\end{align}')).toMatchSnapshot();
  });

  it('Tag Named Default', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}')
    ).toMatchSnapshot();
  });

  it('Tag Named Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Default', () => {
    expect(tex2mml('\\begin{align}a\\label{A}\\end{align}')).toMatchSnapshot();
  });

  it('Label Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Named Default', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Named Named', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      )
    ).toMatchSnapshot();
  });

  it('Ref Default', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Named Default', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      )
    ).toMatchSnapshot();
  });

  it('Ref Named Named', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      )
    ).toMatchSnapshot();
  });

});

/**********************************************************************************/

describe('TagAms', () => {
  beforeEach(() => setupTex(['ams', 'base'], { tags: 'ams' }));

  it('Single Expression', () => {
    expect(tex2mml('a')).toMatchSnapshot();
  });

  it('Align', () => {
    expect(tex2mml('\\begin{align}a\\end{align}')).toMatchSnapshot();
  });

  it('Split', () => {
    expect(tex2mml('\\begin{split}a\\end{split}')).toMatchSnapshot();
  });

  it('MultLine', () => {
    expect(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\end{multline}')
    ).toMatchSnapshot();
  });

  it('Label Empty', () => {
    expect(tex2mml('\\begin{align}a\\label{}\\end{align}')).toMatchSnapshot();
  });

  it('Label', () => {
    expect(tex2mml('\\begin{align}a\\label{A}\\end{align}')).toMatchSnapshot();
  });

  it('Notag Align', () => {
    expect(tex2mml('\\begin{align}a\\notag\\end{align}')).toMatchSnapshot();
  });

  it('Notag Multline', () => {
    expect(
      tex2mml('\\begin{multline}a\\\\ b\\\\ c\\notag\\end{multline}')
    ).toMatchSnapshot();
  });

  it('Notag Tag', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\notag\\end{align}')
    ).toMatchSnapshot();
  });

  it('Ref', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Unknown', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{B}')
    ).toMatchSnapshot();
  });

  it('Eqref', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\eqref{A}')
    ).toMatchSnapshot();
  });

  it('Align Two labels', () => {
    expect(
      tex2mml('\\begin{align}a=b\\label{A}\\\\ c&=d \\label{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Illegal Tag Error', () => {
    expectTexError('\\begin{split}a\\tag{A}\\end{split}').toBe(
      '\\tag not allowed in split environment'
    );
  });

  it('Double Tag Error', () => {
    expectTexError('\\begin{align}a\\tag{A}\\tag{B}\\end{align}').toBe(
      'Multiple \\tag'
    );
  });

  it('Double Label Error', () => {
    expectTexError('\\begin{align}a\\label{A}\\label{B}\\end{align}').toBe(
      'Multiple \\label'
    );
  });

  it('Duplicate Label Error', () => {
    expectTexError(
      '\\begin{align}a\\label{A}\\\\ b\\label{A}\\end{align}'
    ).toBe("Label 'A' multiply defined");
  });

  it('Tag Default', () => {
    expect(tex2mml('\\begin{align}a\\end{align}')).toMatchSnapshot();
  });

  it('Tag Named', () => {
    expect(tex2mml('\\begin{align}a\\tag{A}\\end{align}')).toMatchSnapshot();
  });

  it('Tag Named Default', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\end{align}')
    ).toMatchSnapshot();
  });

  it('Tag Named Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\\\b\\tag{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Default', () => {
    expect(tex2mml('\\begin{align}a\\label{A}\\end{align}')).toMatchSnapshot();
  });

  it('Label Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Named Default', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}')
    ).toMatchSnapshot();
  });

  it('Label Named Named', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}'
      )
    ).toMatchSnapshot();
  });

  it('Ref Default', () => {
    expect(
      tex2mml('\\begin{align}a\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Named', () => {
    expect(
      tex2mml('\\begin{align}a\\tag{A}\\label{A}\\end{align}\\ref{A}')
    ).toMatchSnapshot();
  });

  it('Ref Named Default', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\label{B}\\end{align}\\ref{A}\\ref{B}'
      )
    ).toMatchSnapshot();
  });

  it('Ref Named Named', () => {
    expect(
      tex2mml(
        '\\begin{align}a\\tag{A}\\label{A}\\\\b\\tag{B}\\label{B}\\end{align}\\ref{A}\\ref{B}'
      )
    ).toMatchSnapshot();
  });

});

/**********************************************************************************/

setupComponents({
  loader: { load: ['input/tex-base', '[tex]/ams'] },
});

describe('Page References', () => {
  beforeEach(() => setupTexPage(['base', 'ams']));

  it('Forward Reference', async () => {
    expect(
      await page2mml(
        '<p>$$a=b\\label{eq1}\\tag{1}$$</p><p>Refer to \\eqref{eq1}</p>'
      )
    ).toMatchSnapshot();
  });

  it('Forward Reference', async () => {
    expect(
      await page2mml(
        '<p>Refer to \\eqref{eq1}</p><p>$$a=b\\label{eq1}\\tag{1}$$</p>'
      )
    ).toMatchSnapshot();
  });

  it('LabelIds', () => {
    setupTex(['base', 'ams'], { useLabelIds: false });
    expect(tex2mml('a\\label{eq1}\\tag{1}')).toMatchSnapshot();
  });

});
