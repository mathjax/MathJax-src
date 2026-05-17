import { afterAll, beforeEach, describe, expect, it } from '@jest/globals';
import { getTokens, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/physics/PhysicsConfiguration';

beforeEach(() => setupTex(['base', 'physics']));

/**********************************************************************************/

describe('Physics1_0', () => {
  it('Quantities_Quantities_0', () => {
    expect(tex2mml('\\quantity')).toMatchSnapshot();
  });

  it('Quantities_Quantities_1', () => {
    expect(tex2mml('\\quantity a')).toMatchSnapshot();
  });

  it('Quantities_Quantities_2', () => {
    expectTexError('\\quantity\\bigg a').toBe(
      'Missing or unrecognized delimiter for \\bigg'
    );
  });

  it('Quantities_Quantities_3', () => {
    expect(tex2mml('\\quantity[c]')).toMatchSnapshot();
  });

  it('Quantities_Quantities_4', () => {
    expect(tex2mml('\\quantity\\sin')).toMatchSnapshot();
  });

  it('Quantities_Quantities_5', () => {
    expectTexError('\\qty\\Bigg ab').toBe(
      'Missing or unrecognized delimiter for \\Bigg'
    );
  });

  it('Quantities_Quantities_6', () => {
    expectTexError('\\quantity\\bigg\\sin').toBe(
      'Missing or unrecognized delimiter for \\bigg'
    );
  });

  it('Quantities_Quantities_7', () => {
    expect(tex2mml('\\qty(a)')).toMatchSnapshot();
  });

  it('Quantities_Quantities_8', () => {
    expect(tex2mml('\\qty(\\frac{a}{\\frac{c}{b}})')).toMatchSnapshot();
  });

  it('Quantities_Quantities_9', () => {
    expect(tex2mml('\\qty[\\frac{a}{\\frac{c}{b}}]')).toMatchSnapshot();
  });

  it('Quantities_Quantities_10', () => {
    expect(tex2mml('\\qty\\Bigg{a}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_1', () => {
  it('Quantities_Empty_0', () => {
    expect(tex2mml('\\qty\\big{}[]')).toMatchSnapshot();
  });

  it('Quantities_Empty_1', () => {
    expect(tex2mml('\\qty\\Bigg{}[]')).toMatchSnapshot();
  });

  it('Quantities_Empty_2', () => {
    expect(tex2mml('\\qty\\Bigg{}\\Bigg[]')).toMatchSnapshot();
  });

  it('Quantities_Empty_3', () => {
    expect(tex2mml('\\qty\\Bigg{}\\qty\\Bigg[]')).toMatchSnapshot();
  });

  it('Quantities_Empty_4', () => {
    expect(tex2mml('\\Bigg[]')).toMatchSnapshot();
  });

  it('Quantities_Empty_5', () => {
    expect(tex2mml('\\Bigg[ \\times \\Bigg]')).toMatchSnapshot();
  });

  it('Quantities_Empty_6', () => {
    expect(tex2mml('\\Biggl[ \\times \\Biggr]')).toMatchSnapshot();
  });

  it('Quantities_Empty_7', () => {
    expect(tex2mml('\\qty\\Bigg[\\times]')).toMatchSnapshot();
  });

  it('Quantities_Empty_8', () => {
    expect(tex2mml('\\qty\\Bigg{\\times}')).toMatchSnapshot();
  });

  it('Quantities_Empty_9', () => {
    expect(tex2mml('\\qty(\\frac{a}{b})\\langle\\rangle')).toMatchSnapshot();
  });

  it('Quantities_Empty_10', () => {
    expect(tex2mml('\\qty<\\frac{a}{b}>\\langle\\rangle')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_2', () => {
  it('Quantities_Big_0', () => {
    expect(tex2mml('\\quantity\\big(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Quantities_Big_1', () => {
    expect(tex2mml('\\quantity\\bigg(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Quantities_Big_2', () => {
    expect(tex2mml('\\quantity\\Big(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Quantities_Big_3', () => {
    expect(tex2mml('\\quantity\\Bigg(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Quantities_Big_4', () => {
    expect(tex2mml('\\pqty\\Bigg{} ')).toMatchSnapshot();
  });

  it('Quantities_Big_5', () => {
    expect(tex2mml('\\pqty{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Big_6', () => {
    expect(tex2mml('\\pqty\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Big_7', () => {
    expect(tex2mml('\\pqty\\big{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Big_8', () => {
    expect(tex2mml('\\Bqty{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Big_9', () => {
    expect(tex2mml('\\Bqty\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Big_10', () => {
    expect(tex2mml('\\Bqty\\big{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Big_11', () => {
    expect(tex2mml('\\quantity*\\Bigg(\\frac{a}{b})')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_3', () => {
  it('Quantities_Absval_0', () => {
    expect(tex2mml('\\absolutevalue\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Absval_1', () => {
    expect(tex2mml('\\absolutevalue{}')).toMatchSnapshot();
  });

  it('Quantities_Absval_2', () => {
    expect(tex2mml('\\abs\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Absval_3', () => {
    expect(tex2mml('\\abs*\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Absval_4', () => {
    expect(tex2mml('\\norm\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Absval_5', () => {
    expect(tex2mml('\\norm*\\Bigg{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Quantities_Absval_6', () => {
    expect(tex2mml('\\norm{}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_4', () => {
  it('Quantities_Eval_0', () => {
    expect(tex2mml('\\evaluated{x}_0^\\infty')).toMatchSnapshot();
  });

  it('Quantities_Eval_1', () => {
    expect(tex2mml('\\eval{x}_0^\\infty')).toMatchSnapshot();
  });

  it('Quantities_Eval_2', () => {
    expect(tex2mml('\\eval*{x}_0^\\infty')).toMatchSnapshot();
  });

  it('Quantities_Eval_3', () => {
    expect(tex2mml('\\eval[x|_0^\\infty')).toMatchSnapshot();
  });

  it('Quantities_Eval_4', () => {
    expect(tex2mml('\\eval*(x|_0^\\infty')).toMatchSnapshot();
  });

  it('Quantities_Eval_5', () => {
    expect(
      tex2mml('\\eval*{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty')
    ).toMatchSnapshot();
  });

  it('Quantities_Eval_6', () => {
    expect(
      tex2mml('\\eval{\\frac{A}{\\frac{A}{\\int x}}}_0^\\infty')
    ).toMatchSnapshot();
  });

  it('Quantities_Eval_7', () => {
    expect(
      tex2mml('\\eval*(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty')
    ).toMatchSnapshot();
  });

  it('Quantities_Eval_8', () => {
    expect(
      tex2mml('\\eval(\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty')
    ).toMatchSnapshot();
  });

  it('Quantities_Eval_9', () => {
    expect(
      tex2mml('\\eval*[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty')
    ).toMatchSnapshot();
  });

  it('Quantities_Eval_10', () => {
    expect(
      tex2mml('\\eval[\\frac{A}{\\frac{A}{\\int x}}|_0^\\infty')
    ).toMatchSnapshot();
  });

  it('Quantities_Eval_11', () => {
    expect(tex2mml('\\eval_0^\\infty')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_5', () => {
  it('Quantities_Order_0', () => {
    expect(tex2mml('\\order{}')).toMatchSnapshot();
  });

  it('Quantities_Order_1', () => {
    expect(tex2mml('\\order{x^2}')).toMatchSnapshot();
  });

  it('Quantities_Order_2', () => {
    expect(tex2mml('\\order\\Bigg{x^2}')).toMatchSnapshot();
  });

  it('Quantities_Order_3', () => {
    expect(tex2mml('\\order{\\frac{A}{\\frac{A}{\\int x}}}')).toMatchSnapshot();
  });

  it('Quantities_Order_4', () => {
    expect(
      tex2mml('\\order*{\\frac{A}{\\frac{A}{\\int x}}}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_6', () => {
  it('Quantities_Comm_0', () => {
    expect(tex2mml('\\comm{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Comm_1', () => {
    expect(
      tex2mml('\\comm{\\frac{A}{\\frac{A}{\\int x}}}{B}')
    ).toMatchSnapshot();
  });

  it('Quantities_Comm_2', () => {
    expect(tex2mml('\\comm\\Bigg{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Comm_3', () => {
    expect(
      tex2mml('\\comm*{\\frac{A}{\\frac{A}{\\int x}}}{B}')
    ).toMatchSnapshot();
  });

  it('Quantities_Comm_4', () => {
    expect(tex2mml('\\comm*\\Bigg{\\frac{X}{Y}}{B}')).toMatchSnapshot();
  });

  it('Quantities_Comm_5', () => {
    expect(tex2mml('\\comm{A}B')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics1_7', () => {
  it('Quantities_Acomm_0', () => {
    expect(tex2mml('\\acomm{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Acomm_1', () => {
    expect(tex2mml('\\anticommutator{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Acomm_2', () => {
    expect(tex2mml('\\poissonbracket{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Acomm_3', () => {
    expect(tex2mml('\\pb{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Acomm_4', () => {
    expect(
      tex2mml('\\acomm{\\frac{A}{\\frac{A}{\\int x}}}{B}')
    ).toMatchSnapshot();
  });

  it('Quantities_Acomm_5', () => {
    expect(tex2mml('\\acomm\\Bigg{A}{B}')).toMatchSnapshot();
  });

  it('Quantities_Acomm_6', () => {
    expect(
      tex2mml('\\acomm*{\\frac{A}{\\frac{A}{\\int x}}}{B}')
    ).toMatchSnapshot();
  });

  it('Quantities_Acomm_7', () => {
    expect(tex2mml('\\acomm{A}B')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_0', () => {
  it('Vector_Bold_0', () => {
    expect(tex2mml('\\vectorbold{a}')).toMatchSnapshot();
  });

  it('Vector_Bold_1', () => {
    expect(tex2mml('\\vectorbold*{a}')).toMatchSnapshot();
  });

  it('Vector_Bold_2', () => {
    expect(tex2mml('\\vb{a}')).toMatchSnapshot();
  });

  it('Vector_Bold_3', () => {
    expect(tex2mml('\\vb{\\Gamma}\\Gamma')).toMatchSnapshot();
  });

  it('Vector_Bold_4', () => {
    expect(tex2mml('\\vb{2}2')).toMatchSnapshot();
  });

  it('Vector_Bold_5', () => {
    expect(tex2mml('\\vb{\\theta}')).toMatchSnapshot();
  });

  it('Vector_Bold_6', () => {
    expect(
      tex2mml(
        '\\vb{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      )
    ).toMatchSnapshot();
  });

  it('Vector_Bold_7', () => {
    expect(tex2mml('\\vb*{a}')).toMatchSnapshot();
  });

  it('Vector_Bold_8', () => {
    expect(tex2mml('\\vb*{2}')).toMatchSnapshot();
  });

  it('Vector_Bold_9', () => {
    expect(tex2mml('\\vb*{\\Gamma}')).toMatchSnapshot();
  });

  it('Vector_Bold_10', () => {
    expect(tex2mml('\\vb*{\\theta}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_1', () => {
  it('Vector_Special_0', () => {
    expect(tex2mml('\\vb{\\mbox{ab}}')).toMatchSnapshot();
  });

  it('Vector_Special_1', () => {
    expect(tex2mml('\\vb{B}')).toMatchSnapshot();
  });

  it('Vector_Special_2', () => {
    expect(tex2mml('\\vb{\\mathcal{B}}')).toMatchSnapshot();
  });

  it('Vector_Special_3', () => {
    expect(tex2mml('\\mathcal{\\vb{B}}')).toMatchSnapshot();
  });

  it('Vector_Special_4', () => {
    expect(tex2mml('\\mathit{\\vb{B}}')).toMatchSnapshot();
  });

  it('Vector_Special_5', () => {
    expect(tex2mml('\\vb{\\mathit{B}}')).toMatchSnapshot();
  });

  it('Vector_Special_6', () => {
    expect(tex2mml('\\vb{\\mathit{a}b}')).toMatchSnapshot();
  });

  it('Vector_Special_7', () => {
    expect(tex2mml('\\vb{a+\\theta}{\\bf +}')).toMatchSnapshot();
  });

  it('Vector_Special_8', () => {
    expect(tex2mml('\\vb{\\hat{a}}')).toMatchSnapshot();
  });

  it('Vector_Special_9', () => {
    expect(tex2mml('\\vb{[}[')).toMatchSnapshot();
  });

  it('Vector_Special_10', () => {
    expect(tex2mml('\\vb{\\hat{}}')).toMatchSnapshot();
  });

  it('Vector_Special_11', () => {
    expect(tex2mml('\\vb{=}')).toMatchSnapshot();
  });

  it('Vector_Special_12', () => {
    expect(tex2mml('\\vb{\\hat{=}}\\hat{=}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_2', () => {
  it('Vector_Arrow_0', () => {
    expect(tex2mml('\\va{=}')).toMatchSnapshot();
  });

  it('Vector_Arrow_1', () => {
    expect(tex2mml('\\vectorarrow{a}')).toMatchSnapshot();
  });

  it('Vector_Arrow_2', () => {
    expect(tex2mml('\\va{a}')).toMatchSnapshot();
  });

  it('Vector_Arrow_3', () => {
    expect(tex2mml('\\va{\\Gamma}\\Gamma')).toMatchSnapshot();
  });

  it('Vector_Arrow_4', () => {
    expect(tex2mml('\\va{2}2')).toMatchSnapshot();
  });

  it('Vector_Arrow_5', () => {
    expect(tex2mml('\\va{\\theta}')).toMatchSnapshot();
  });

  it('Vector_Arrow_6', () => {
    expect(
      tex2mml(
        '\\va{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      )
    ).toMatchSnapshot();
  });

  it('Vector_Arrow_7', () => {
    expect(tex2mml('\\vectorarrow*{a}')).toMatchSnapshot();
  });

  it('Vector_Arrow_8', () => {
    expect(tex2mml('\\va*{a}')).toMatchSnapshot();
  });

  it('Vector_Arrow_9', () => {
    expect(tex2mml('\\va*{2}')).toMatchSnapshot();
  });

  it('Vector_Arrow_10', () => {
    expect(tex2mml('\\va*{\\Gamma}')).toMatchSnapshot();
  });

  it('Vector_Arrow_11', () => {
    expect(tex2mml('\\va*{\\theta}')).toMatchSnapshot();
  });

  it('Vector_Arrow_12', () => {
    expect(tex2mml('\\va{a}\\vec{a}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_3', () => {
  it('Vector_Unit_0', () => {
    expect(tex2mml('\\vu{=}')).toMatchSnapshot();
  });

  it('Vector_Unit_1', () => {
    expect(tex2mml('\\vectorunit{a}')).toMatchSnapshot();
  });

  it('Vector_Unit_2', () => {
    expect(tex2mml('\\vu{a}')).toMatchSnapshot();
  });

  it('Vector_Unit_3', () => {
    expect(tex2mml('\\vu{\\Gamma}\\Gamma')).toMatchSnapshot();
  });

  it('Vector_Unit_4', () => {
    expect(tex2mml('\\vu{2}2')).toMatchSnapshot();
  });

  it('Vector_Unit_5', () => {
    expect(tex2mml('\\vu{\\theta}')).toMatchSnapshot();
  });

  it('Vector_Unit_6', () => {
    expect(
      tex2mml(
        '\\vu{\\theta\\Gamma a\\delta \\frac{\\theta}{b}}\\frac{\\theta}{b}'
      )
    ).toMatchSnapshot();
  });

  it('Vector_Unit_7', () => {
    expect(tex2mml('\\vectorunit*{a}')).toMatchSnapshot();
  });

  it('Vector_Unit_8', () => {
    expect(tex2mml('\\vu*{a}')).toMatchSnapshot();
  });

  it('Vector_Unit_9', () => {
    expect(tex2mml('\\vu*{2}')).toMatchSnapshot();
  });

  it('Vector_Unit_10', () => {
    expect(tex2mml('\\vu*{\\Gamma}')).toMatchSnapshot();
  });

  it('Vector_Unit_11', () => {
    expect(tex2mml('\\vu*{\\theta}')).toMatchSnapshot();
  });

  it('Vector_Unit_12', () => {
    expect(tex2mml('\\vu{a}\\hat{a}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_4', () => {
  it('Vector_Gradient_0', () => {
    expect(tex2mml('\\gradient ')).toMatchSnapshot();
  });

  it('Vector_Gradient_1', () => {
    expect(tex2mml('\\gradient(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Vector_Gradient_2', () => {
    expect(tex2mml('\\gradient[\\frac{a}{b}]')).toMatchSnapshot();
  });

  it('Vector_Gradient_3', () => {
    expect(tex2mml('\\gradient{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('Vector_Gradient_4', () => {
    expect(tex2mml('\\grad ')).toMatchSnapshot();
  });

  it('Vector_Gradient_5', () => {
    expect(tex2mml('\\grad(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Vector_Gradient_6', () => {
    expect(tex2mml('\\grad[\\frac{a}{b}]')).toMatchSnapshot();
  });

  it('Vector_Gradient_7', () => {
    expect(tex2mml('\\grad{\\frac{a}{b}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_5', () => {
  it('Vector_Divergence_0', () => {
    expect(tex2mml('a\\dotproduct b \\vdot c')).toMatchSnapshot();
  });

  it('Vector_Divergence_1', () => {
    expect(tex2mml('\\divergence{\\frac{a}{b}c}')).toMatchSnapshot();
  });

  it('Vector_Divergence_2', () => {
    expect(tex2mml('\\div{\\frac{a}{b}c}')).toMatchSnapshot();
  });

  it('Vector_Divergence_3', () => {
    expect(tex2mml('\\div{(\\frac{a}{b}c)}')).toMatchSnapshot();
  });

  it('Vector_Divergence_4', () => {
    expect(tex2mml('\\div(\\frac{a}{b}c)')).toMatchSnapshot();
  });

  it('Vector_Divergence_5', () => {
    expect(
      tex2mml('{\\bf\\nabla} \\cdot \\left(\\frac{a}{b}c\\right)')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_6', () => {
  it('Vector_Curl_0', () => {
    expect(tex2mml('\\curl ')).toMatchSnapshot();
  });

  it('Vector_Curl_1', () => {
    expect(tex2mml('\\curl(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Vector_Curl_2', () => {
    expect(tex2mml('\\curl[\\frac{a}{b}]')).toMatchSnapshot();
  });

  it('Vector_Curl_3', () => {
    expect(tex2mml('\\curl{\\frac{a}{b}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics2_7', () => {
  it('Vector_Laplace_0', () => {
    expect(tex2mml('\\laplacian ')).toMatchSnapshot();
  });

  it('Vector_Laplace_1', () => {
    expect(tex2mml('\\laplacian(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Vector_Laplace_2', () => {
    expect(tex2mml('\\laplacian[\\frac{a}{b}]')).toMatchSnapshot();
  });

  it('Vector_Laplace_3', () => {
    expect(tex2mml('\\laplacian{\\frac{a}{b}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_0', () => {
  it('Operators_Trig_0', () => {
    expect(tex2mml('\\sin(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_1', () => {
    expect(tex2mml('\\sinh(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_2', () => {
    expect(tex2mml('\\arcsin(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_3', () => {
    expect(tex2mml('\\asin(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_4', () => {
    expect(tex2mml('\\cos(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_5', () => {
    expect(tex2mml('\\cosh(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_6', () => {
    expect(tex2mml('\\arccos(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_7', () => {
    expect(tex2mml('\\acos(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_8', () => {
    expect(tex2mml('\\tan(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_9', () => {
    expect(tex2mml('\\tanh(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_10', () => {
    expect(tex2mml('\\arctan(x)')).toMatchSnapshot();
  });

  it('Operators_Trig_11', () => {
    expect(tex2mml('\\atan(x)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_1', () => {
  it('Operators_Arc_0', () => {
    expect(tex2mml('\\csc(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_1', () => {
    expect(tex2mml('\\csch(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_2', () => {
    expect(tex2mml('\\arccsc(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_3', () => {
    expect(tex2mml('\\acsc(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_4', () => {
    expect(tex2mml('\\sec(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_5', () => {
    expect(tex2mml('\\sech(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_6', () => {
    expect(tex2mml('\\arcsec(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_7', () => {
    expect(tex2mml('\\asec(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_8', () => {
    expect(tex2mml('\\cot(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_9', () => {
    expect(tex2mml('\\coth(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_10', () => {
    expect(tex2mml('\\arccot(x)')).toMatchSnapshot();
  });

  it('Operators_Arc_11', () => {
    expect(tex2mml('\\acot(x)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_2', () => {
  it('Operators_TrigLarge_0', () => {
    expect(tex2mml('\\sin(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_1', () => {
    expect(tex2mml('\\sinh(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_2', () => {
    expect(tex2mml('\\arcsin(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_3', () => {
    expect(tex2mml('\\asin(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_4', () => {
    expect(tex2mml('\\cos(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_5', () => {
    expect(tex2mml('\\cosh(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_6', () => {
    expect(tex2mml('\\arccos(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_7', () => {
    expect(tex2mml('\\acos(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_8', () => {
    expect(tex2mml('\\tan(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_9', () => {
    expect(tex2mml('\\tanh(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_10', () => {
    expect(tex2mml('\\arctan(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_TrigLarge_11', () => {
    expect(tex2mml('\\atan(\\frac{x}{y})')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_3', () => {
  it('Operators_ArcLarge_0', () => {
    expect(tex2mml('\\csc(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_1', () => {
    expect(tex2mml('\\csch(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_2', () => {
    expect(tex2mml('\\arccsc(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_3', () => {
    expect(tex2mml('\\acsc(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_4', () => {
    expect(tex2mml('\\sec(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_5', () => {
    expect(tex2mml('\\sech(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_6', () => {
    expect(tex2mml('\\arcsec(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_7', () => {
    expect(tex2mml('\\asec(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_8', () => {
    expect(tex2mml('\\cot(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_9', () => {
    expect(tex2mml('\\coth(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_10', () => {
    expect(tex2mml('\\arccot(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_ArcLarge_11', () => {
    expect(tex2mml('\\acot(\\frac{x}{y})')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_4', () => {
  it('Operators_Exp_0', () => {
    expect(tex2mml('\\sin x')).toMatchSnapshot();
  });

  it('Operators_Exp_1', () => {
    expect(tex2mml('\\sin{x}')).toMatchSnapshot();
  });

  it('Operators_Exp_2', () => {
    expect(tex2mml('\\sin[x]')).toMatchSnapshot();
  });

  it('Operators_Exp_3', () => {
    expect(tex2mml('\\sin[2]{x}')).toMatchSnapshot();
  });

  it('Operators_Exp_4', () => {
    expect(tex2mml('\\sin[2]x')).toMatchSnapshot();
  });

  it('Operators_Exp_5', () => {
    expect(tex2mml('\\sin[2]')).toMatchSnapshot();
  });

  it('Operators_Exp_6', () => {
    expect(tex2mml('\\sin|\\frac{x}{y}|')).toMatchSnapshot();
  });

  it('Operators_Exp_7', () => {
    expect(tex2mml('\\sin[\\frac{x}{y}]')).toMatchSnapshot();
  });

  it('Operators_Exp_8', () => {
    expect(tex2mml("\\sin['](\\frac{x}{y})")).toMatchSnapshot();
  });

  it('Operators_Exp_9', () => {
    expect(tex2mml("\\sin[']{\\frac{x}{y}}")).toMatchSnapshot();
  });

  it('Operators_Exp_10', () => {
    expect(tex2mml('\\sine(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Exp_11', () => {
    expect(tex2mml('\\hypsine')).toMatchSnapshot();
  });

  it('Operators_Exp_12', () => {
    expect(tex2mml('\\log[2](x)')).toMatchSnapshot();
  });

  it('Operators_Exp_13', () => {
    expect(tex2mml('\\ln[2](x)')).toMatchSnapshot();
  });

  it('Operators_Exp_14', () => {
    expect(tex2mml('\\exp[2](x)')).toMatchSnapshot();
  });

  it('Operators_Exp_15', () => {
    expect(tex2mml('\\det[2](x)')).toMatchSnapshot();
  });

  it('Operators_Exp_16', () => {
    expect(tex2mml('\\Pr[2](x)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_5', () => {
  it('Operators_Operators_0', () => {
    expect(tex2mml('\\tr\\rho')).toMatchSnapshot();
  });

  it('Operators_Operators_1', () => {
    expect(tex2mml('\\tr(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_2', () => {
    expect(tex2mml('\\tr[2](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_3', () => {
    expect(tex2mml('\\rank\\rho')).toMatchSnapshot();
  });

  it('Operators_Operators_4', () => {
    expect(tex2mml('\\rank(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_5', () => {
    expect(tex2mml('\\rank[2](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_6', () => {
    expect(tex2mml('\\erf\\rho')).toMatchSnapshot();
  });

  it('Operators_Operators_7', () => {
    expect(tex2mml('\\erf(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_8', () => {
    expect(tex2mml('\\erf[2](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_9', () => {
    expect(tex2mml('\\Res\\rho')).toMatchSnapshot();
  });

  it('Operators_Operators_10', () => {
    expect(tex2mml('\\Res(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Operators_11', () => {
    expect(tex2mml('\\Res[\\frac{x}{y}]')).toMatchSnapshot();
  });

  it('Operators_Operators_12', () => {
    expect(tex2mml('\\Res{\\frac{x}{y}}')).toMatchSnapshot();
  });

  it('Operators_Operators_13', () => {
    expect(tex2mml('\\Res|\\frac{x}{y}|')).toMatchSnapshot();
  });

  it('Operators_Operators_14', () => {
    expect(tex2mml('\\Res \\frac{x}{y}')).toMatchSnapshot();
  });

  it('Operators_Operators_15', () => {
    expect(tex2mml('\\Res[2](\\frac{x}{y})')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_6', () => {
  it('Operators_PV_0', () => {
    expect(tex2mml('\\principalvalue{\\int f(z) \\dd{z}}')).toMatchSnapshot();
  });

  it('Operators_PV_1', () => {
    expect(tex2mml('\\pv{\\int f(z) \\dd{z}}')).toMatchSnapshot();
  });

  it('Operators_PV_2', () => {
    expect(tex2mml('\\pv{\\int f(z) \\dd{z}}a')).toMatchSnapshot();
  });

  it('Operators_PV_3', () => {
    expect(tex2mml('\\pv\\int f(z) \\dd{z}a')).toMatchSnapshot();
  });

  it('Operators_PV_4', () => {
    expect(tex2mml('\\pv(\\int f(z))')).toMatchSnapshot();
  });

  it('Operators_PV_5', () => {
    expect(tex2mml('\\pv|\\int f(z)|')).toMatchSnapshot();
  });

  it('Operators_PV_6', () => {
    expect(tex2mml('\\pv[\\int f(z)]')).toMatchSnapshot();
  });

  it('Operators_PV_7', () => {
    expect(tex2mml('\\PV{\\int f(z) \\dd{z}}')).toMatchSnapshot();
  });

  it('Operators_PV_8', () => {
    expect(tex2mml('\\PV{\\int f(z) \\dd{z}}a')).toMatchSnapshot();
  });

  it('Operators_PV_9', () => {
    expect(tex2mml('\\PV\\int f(z) \\dd{z}a')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics3_7', () => {
  it('Operators_Imaginary_0', () => {
    expect(tex2mml('\\Re\\rho')).toMatchSnapshot();
  });

  it('Operators_Imaginary_1', () => {
    expect(tex2mml('\\Re(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Imaginary_2', () => {
    expect(tex2mml('\\Re[\\frac{x}{y}]')).toMatchSnapshot();
  });

  it('Operators_Imaginary_3', () => {
    expect(tex2mml('\\Re{\\frac{x}{y}}')).toMatchSnapshot();
  });

  it('Operators_Imaginary_4', () => {
    expect(tex2mml('\\Re|\\frac{x}{y}|')).toMatchSnapshot();
  });

  it('Operators_Imaginary_5', () => {
    expect(tex2mml('\\Re \\frac{x}{y}')).toMatchSnapshot();
  });

  it('Operators_Imaginary_6', () => {
    expect(tex2mml('\\Re[2](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Imaginary_7', () => {
    expect(tex2mml('\\real')).toMatchSnapshot();
  });

  it('Operators_Imaginary_8', () => {
    expect(tex2mml('\\real{x}')).toMatchSnapshot();
  });

  it('Operators_Imaginary_9', () => {
    expect(tex2mml('\\Im\\rho')).toMatchSnapshot();
  });

  it('Operators_Imaginary_10', () => {
    expect(tex2mml('\\Im(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Imaginary_11', () => {
    expect(tex2mml('\\Im[\\frac{x}{y}]')).toMatchSnapshot();
  });

  it('Operators_Imaginary_12', () => {
    expect(tex2mml('\\Im{\\frac{x}{y}}')).toMatchSnapshot();
  });

  it('Operators_Imaginary_13', () => {
    expect(tex2mml('\\Im|\\frac{x}{y}|')).toMatchSnapshot();
  });

  it('Operators_Imaginary_14', () => {
    expect(tex2mml('\\Im \\frac{x}{y}')).toMatchSnapshot();
  });

  it('Operators_Imaginary_15', () => {
    expect(tex2mml('\\Im[2](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Operators_Imaginary_16', () => {
    expect(tex2mml('\\imaginary')).toMatchSnapshot();
  });

  it('Operators_Imaginary_17', () => {
    expect(tex2mml('\\imaginary{x}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics4_0', () => {
  it('QuickQuad_0_0', () => {
    expect(tex2mml('\\qcc')).toMatchSnapshot();
  });

  it('QuickQuad_0_1', () => {
    expect(tex2mml('\\qand')).toMatchSnapshot();
  });

  it('QuickQuad_0_2', () => {
    expect(tex2mml('a\\qc b')).toMatchSnapshot();
  });

  it('QuickQuad_0_3', () => {
    expect(tex2mml('a\\qqtext{hello}b')).toMatchSnapshot();
  });

  it('QuickQuad_0_4', () => {
    expect(tex2mml('a\\qqtext*{hello}b')).toMatchSnapshot();
  });

  it('QuickQuad_0_5', () => {
    expect(tex2mml('a\\qqtext ab')).toMatchSnapshot();
  });

  it('QuickQuad_0_6', () => {
    expect(tex2mml('a\\qqtext* ab')).toMatchSnapshot();
  });

  it('QuickQuad_0_7', () => {
    expect(tex2mml('three\\qif two')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics5_0', () => {
  it('Derivatives_Deriv_0', () => {
    expect(tex2mml('\\dv x')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_1', () => {
    expect(tex2mml('\\dv x(ll)')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_2', () => {
    expect(tex2mml('\\dv{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_3', () => {
    expect(tex2mml('\\dv[n]{f}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_4', () => {
    expect(tex2mml('\\dv{f}{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_5', () => {
    expect(tex2mml('\\dv{f}{x}y')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_6', () => {
    expect(tex2mml('\\dv{x}y')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_7', () => {
    expect(tex2mml('\\dv[n]{f}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_8', () => {
    expect(tex2mml('\\dv[n]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_9', () => {
    expect(tex2mml('\\dv*[n]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_10', () => {
    expect(tex2mml('\\dv*[]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_11', () => {
    expect(tex2mml('\\dv[]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_12', () => {
    expect(tex2mml('\\dv[5](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_13', () => {
    expect(tex2mml('\\dv[5]{f}')).toMatchSnapshot();
  });

  it('Derivatives_Deriv_14', () => {
    expect(tex2mml('\\dv{f}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics5_1', () => {
  it('Derivatives_Partial_0', () => {
    expect(tex2mml('\\flatfrac{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_1', () => {
    expect(tex2mml('\\flatfrac{x^2}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_2', () => {
    expect(tex2mml('\\pdv x')).toMatchSnapshot();
  });

  it('Derivatives_Partial_3', () => {
    expect(tex2mml('\\pdv x(ll)')).toMatchSnapshot();
  });

  it('Derivatives_Partial_4', () => {
    expect(tex2mml('\\pdv{f}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_5', () => {
    expect(tex2mml('\\pdv{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_6', () => {
    expect(tex2mml('\\pdv[n]{f}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_7', () => {
    expect(tex2mml('\\pdv{f}{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_8', () => {
    expect(tex2mml('\\pdv{f}{x}y')).toMatchSnapshot();
  });

  it('Derivatives_Partial_9', () => {
    expect(tex2mml('\\pdv{x}y')).toMatchSnapshot();
  });

  it('Derivatives_Partial_10', () => {
    expect(tex2mml('\\pdv*{f}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_11', () => {
    expect(tex2mml('\\pdv*[3]{f}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Partial_12', () => {
    expect(tex2mml('\\pdv[n]{f}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Partial_13', () => {
    expect(tex2mml('\\pdv[n]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Partial_14', () => {
    expect(tex2mml('\\pdv*[n]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Partial_15', () => {
    expect(tex2mml('\\pdv*[]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Partial_16', () => {
    expect(tex2mml('\\pdv[]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Partial_17', () => {
    expect(tex2mml('\\pdv[5](\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Partial_18', () => {
    expect(tex2mml('\\pdv[5]{f}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics5_2', () => {
  it('Derivatives_Functional_0', () => {
    expect(tex2mml('\\fdv x')).toMatchSnapshot();
  });

  it('Derivatives_Functional_1', () => {
    expect(tex2mml('\\fdv x(ll)')).toMatchSnapshot();
  });

  it('Derivatives_Functional_2', () => {
    expect(tex2mml('\\fdv{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_3', () => {
    expect(tex2mml('\\fdv{f}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_4', () => {
    expect(tex2mml('\\fdv[n]{f}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_5', () => {
    expect(tex2mml('\\fdv{f}{x}{y}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_6', () => {
    expect(tex2mml('\\fdv{f}{x}y')).toMatchSnapshot();
  });

  it('Derivatives_Functional_7', () => {
    expect(tex2mml('\\fdv{x}y')).toMatchSnapshot();
  });

  it('Derivatives_Functional_8', () => {
    expect(tex2mml('\\functionalderivative*{F}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_9', () => {
    expect(tex2mml('\\fderivative*{F}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_10', () => {
    expect(tex2mml('\\fdv*{F}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_11', () => {
    expect(tex2mml('\\fdv{F}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_12', () => {
    expect(tex2mml('\\fdv[2]{F}{x}')).toMatchSnapshot();
  });

  it('Derivatives_Functional_13', () => {
    expect(tex2mml('\\fdv[n]{f}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Functional_14', () => {
    expect(tex2mml('\\fdv[n]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Functional_15', () => {
    expect(tex2mml('\\fdv*[n]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Functional_16', () => {
    expect(tex2mml('\\fdv*[]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Functional_17', () => {
    expect(tex2mml('\\fdv[]{f}{x}{y}(\\frac{x}{y})')).toMatchSnapshot();
  });

  it('Derivatives_Functional_18', () => {
    expect(tex2mml('\\fdv[5]{f}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics5_3', () => {
  it('Derivatives_Var_0', () => {
    expect(tex2mml('\\var A')).toMatchSnapshot();
  });

  it('Derivatives_Var_1', () => {
    expect(tex2mml('\\var{A}')).toMatchSnapshot();
  });

  it('Derivatives_Var_2', () => {
    expect(tex2mml('\\var{A}{B}')).toMatchSnapshot();
  });

  it('Derivatives_Var_3', () => {
    expect(tex2mml('\\var[4]{A} B')).toMatchSnapshot();
  });

  it('Derivatives_Var_4', () => {
    expect(tex2mml('\\var{F[g(x)]}')).toMatchSnapshot();
  });

  it('Derivatives_Var_5', () => {
    expect(tex2mml('\\var(E-TS)')).toMatchSnapshot();
  });

  it('Derivatives_Var_6', () => {
    expect(tex2mml('\\var{F[g(\\frac{x}{y})]}')).toMatchSnapshot();
  });

  it('Derivatives_Var_7', () => {
    expect(tex2mml('\\var{F[g\\left(\\frac{x}{y}\\right)]}')).toMatchSnapshot();
  });

  it('Derivatives_Var_8', () => {
    expect(tex2mml('\\var(\\frac{a}{b})')).toMatchSnapshot();
  });

  it('Derivatives_Var_9', () => {
    expect(tex2mml('A \\var A B')).toMatchSnapshot();
  });

  it('Derivatives_Var_10', () => {
    expect(tex2mml('A \\var{A} B')).toMatchSnapshot();
  });

  it('Derivatives_Var_11', () => {
    expect(tex2mml('A \\var{A}{B} B')).toMatchSnapshot();
  });

  it('Derivatives_Var_12', () => {
    expect(tex2mml('A \\var[4]{A} B')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics5_4', () => {
  it('Derivatives_Differ_0', () => {
    expect(tex2mml('\\dd')).toMatchSnapshot();
  });

  it('Derivatives_Differ_1', () => {
    expect(tex2mml('\\dd x')).toMatchSnapshot();
  });

  it('Derivatives_Differ_2', () => {
    expect(tex2mml('\\dd{x}')).toMatchSnapshot();
  });

  it('Derivatives_Differ_3', () => {
    expect(tex2mml('\\dd[3]{x}')).toMatchSnapshot();
  });

  it('Derivatives_Differ_4', () => {
    expect(tex2mml('\\dd[3]x')).toMatchSnapshot();
  });

  it('Derivatives_Differ_5', () => {
    expect(
      tex2mml('\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta})')
    ).toMatchSnapshot();
  });

  it('Derivatives_Differ_6', () => {
    expect(
      tex2mml('\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})')
    ).toMatchSnapshot();
  });

  it('Derivatives_Differ_7', () => {
    expect(
      tex2mml('\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})')
    ).toMatchSnapshot();
  });

  it('Derivatives_Differ_8', () => {
    expect(
      tex2mml('\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})')
    ).toMatchSnapshot();
  });

  it('Derivatives_Differ_9', () => {
    expect(tex2mml('\\dd[5]')).toMatchSnapshot();
  });

  it('Derivatives_Differ_10', () => {
    expect(tex2mml('{\\dd}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics5_5', () => {
  it('Derivatives_PDiff_0', () => {
    expect(tex2mml('A\\dd A')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_1', () => {
    expect(tex2mml('A\\dd x A')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_2', () => {
    expect(tex2mml('A\\dd{x} A')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_3', () => {
    expect(tex2mml('A\\dd xA')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_4', () => {
    expect(tex2mml('A{{\\rm d}(\\it x)}A')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_5', () => {
    expect(tex2mml('A\\dd[3]{x} A')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_6', () => {
    expect(tex2mml('A\\dd[3]x A')).toMatchSnapshot();
  });

  it('Derivatives_PDiff_7', () => {
    expect(
      tex2mml('A\\dd(\\frac{\\frac{\\cos}{\\theta}}{\\theta}) A')
    ).toMatchSnapshot();
  });

  it('Derivatives_PDiff_8', () => {
    expect(
      tex2mml('A\\dd[4](\\frac{\\frac{\\cos}{\\theta}}{\\theta})A')
    ).toMatchSnapshot();
  });

  it('Derivatives_PDiff_9', () => {
    expect(
      tex2mml('A\\dd{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A')
    ).toMatchSnapshot();
  });

  it('Derivatives_PDiff_10', () => {
    expect(
      tex2mml('A\\dd[4]{x}(\\frac{\\frac{\\cos}{\\theta}}{\\theta})A')
    ).toMatchSnapshot();
  });

  it('Derivatives_PDiff_11', () => {
    expect(
      tex2mml(
        'A{\\rm d}\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right) A'
      )
    ).toMatchSnapshot();
  });

  it('Derivatives_PDiff_12', () => {
    expect(
      tex2mml(
        'A{\\rm d}{\\left(\\frac{\\frac{\\cos}{\\theta}}{\\theta}\\right)} A'
      )
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics6_0', () => {
  it('BraKet_Bra_0', () => {
    expect(tex2mml('\\bra{\\phi}\\ket{\\psi}')).toMatchSnapshot();
  });

  it('BraKet_Bra_1', () => {
    expect(tex2mml('\\bra{A}\\ket{B}')).toMatchSnapshot();
  });

  it('BraKet_Bra_2', () => {
    expect(tex2mml('\\bra{\\phi}\\dyad{\\psi}{\\xi}')).toMatchSnapshot();
  });

  it('BraKet_Bra_3', () => {
    expect(tex2mml('\\bra A  \\ket B')).toMatchSnapshot();
  });

  it('BraKet_Bra_4', () => {
    expect(
      tex2mml('\\bra*{\\frac{a}{b}}  \\ket{\\frac{a}{b}}')
    ).toMatchSnapshot();
  });

  it('BraKet_Bra_5', () => {
    expect(
      tex2mml('\\bra{\\frac{a}{b}}  \\ket*{\\frac{a}{b}}')
    ).toMatchSnapshot();
  });

  it('BraKet_Bra_6', () => {
    expect(tex2mml('\\bra A\\ket{B}')).toMatchSnapshot();
  });

  it('BraKet_Bra_7', () => {
    expect(tex2mml('\\bra A\\ket ')).toMatchSnapshot();
  });

  it('BraKet_Bra_8', () => {
    expect(tex2mml('\\bra {A}\\ket ')).toMatchSnapshot();
  });

  it('BraKet_Bra_9', () => {
    expect(tex2mml('\\bra {A}\\ket B')).toMatchSnapshot();
  });

  it('BraKet_Bra_10', () => {
    expect(tex2mml('\\bra {\\frac{a}{b}} \\ket* \\alpha')).toMatchSnapshot();
  });

  it('BraKet_Bra_11', () => {
    expect(tex2mml('\\ket{A}')).toMatchSnapshot();
  });

  it('BraKet_Bra_12', () => {
    expect(tex2mml('\\ket{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('BraKet_Bra_13', () => {
    expect(tex2mml('\\ket*{A}')).toMatchSnapshot();
  });

  it('BraKet_Bra_14', () => {
    expect(tex2mml('\\ket a')).toMatchSnapshot();
  });

  it('BraKet_Bra_15', () => {
    expect(tex2mml('\\ket* a')).toMatchSnapshot();
  });

  it('BraKet_Bra_16', () => {
    expect(tex2mml('\\ket \\alpha')).toMatchSnapshot();
  });

  it('BraKet_Bra_17', () => {
    expect(tex2mml('\\bra*{\\frac{1}{2}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics6_1', () => {
  it('BraKet_Braket_0', () => {
    expect(tex2mml('\\braket{A}')).toMatchSnapshot();
  });

  it('BraKet_Braket_1', () => {
    expect(tex2mml('\\braket{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('BraKet_Braket_2', () => {
    expect(tex2mml('\\braket*{A}')).toMatchSnapshot();
  });

  it('BraKet_Braket_3', () => {
    expect(tex2mml('\\braket*{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('BraKet_Braket_4', () => {
    expect(tex2mml('\\braket a')).toMatchSnapshot();
  });

  it('BraKet_Braket_5', () => {
    expect(tex2mml('\\braket* a')).toMatchSnapshot();
  });

  it('BraKet_Braket_6', () => {
    expect(tex2mml('\\braket \\alpha')).toMatchSnapshot();
  });

  it('BraKet_Braket_7', () => {
    expect(tex2mml('\\braket{\\frac{a}{b}}{A}')).toMatchSnapshot();
  });

  it('BraKet_Braket_8', () => {
    expect(tex2mml('\\braket*{\\frac{a}{b}}{A}')).toMatchSnapshot();
  });

  it('BraKet_Braket_9', () => {
    expect(tex2mml('\\braket{\\frac{a}{b}}  A')).toMatchSnapshot();
  });

  it('BraKet_Braket_10', () => {
    expect(tex2mml('\\braket*{\\frac{a}{b}}   A')).toMatchSnapshot();
  });

  it('BraKet_Braket_11', () => {
    expect(tex2mml('\\braket{\\frac{a}{b}}{} ')).toMatchSnapshot();
  });

  it('BraKet_Braket_12', () => {
    expect(tex2mml('\\braket*{\\frac{a}{b}}{}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics6_2', () => {
  it('BraKet_Ketbra_0', () => {
    expect(tex2mml('\\ketbra{A}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_1', () => {
    expect(tex2mml('\\ketbra{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_2', () => {
    expect(tex2mml('\\ketbra*{A}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_3', () => {
    expect(tex2mml('\\ketbra*{\\frac{a}{b}}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_4', () => {
    expect(tex2mml('\\ketbra a')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_5', () => {
    expect(tex2mml('\\ketbra* a')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_6', () => {
    expect(tex2mml('\\ketbra \\alpha')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_7', () => {
    expect(tex2mml('\\ketbra{\\frac{a}{b}}{A}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_8', () => {
    expect(tex2mml('\\ketbra*{\\frac{a}{b}}{A}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_9', () => {
    expect(tex2mml('\\ketbra{\\frac{a}{b}}  A')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_10', () => {
    expect(tex2mml('\\ketbra*{\\frac{a}{b}}   A')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_11', () => {
    expect(tex2mml('\\ketbra{\\frac{a}{b}}{} ')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_12', () => {
    expect(tex2mml('\\ketbra*{\\frac{a}{b}}{}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_13', () => {
    expect(
      tex2mml('\\left\\vert A \\middle\\rangle\\middle\\langle B\\right\\vert')
    ).toMatchSnapshot();
  });

  it('BraKet_Ketbra_14', () => {
    expect(tex2mml('\\ketbra{A}{B}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_15', () => {
    expect(tex2mml('\\outerproduct{A}{B}')).toMatchSnapshot();
  });

  it('BraKet_Ketbra_16', () => {
    expect(tex2mml('\\dyad{a}{b}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics6_3', () => {
  it('BraKet_Expect_0', () => {
    expect(tex2mml('\\ev{A}')).toMatchSnapshot();
  });

  it('BraKet_Expect_1', () => {
    expect(tex2mml('\\ev{\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_2', () => {
    expect(tex2mml('\\ev*{\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_3', () => {
    expect(tex2mml('\\ev**{\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_4', () => {
    expect(tex2mml('\\ev{A}{\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_5', () => {
    expect(tex2mml('\\ev{\\frac{A}{B}}{A}')).toMatchSnapshot();
  });

  it('BraKet_Expect_6', () => {
    expect(tex2mml('\\ev*{A}{\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_7', () => {
    expect(tex2mml('\\ev**{A} {\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_8', () => {
    expect(tex2mml('\\ev A B')).toMatchSnapshot();
  });

  it('BraKet_Expect_9', () => {
    expect(tex2mml('\\ev A {\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_10', () => {
    expect(tex2mml('\\ev {\\frac{A}{B}} A')).toMatchSnapshot();
  });

  it('BraKet_Expect_11', () => {
    expect(tex2mml('\\ev* A {\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_12', () => {
    expect(tex2mml('\\ev** A {\\frac{A}{B}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_13', () => {
    expect(
      tex2mml('\\ev{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}')
    ).toMatchSnapshot();
  });

  it('BraKet_Expect_14', () => {
    expect(tex2mml('\\ev{\\frac{A}{B}}{{\\Psi}}')).toMatchSnapshot();
  });

  it('BraKet_Expect_15', () => {
    expect(
      tex2mml('\\ev*{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}')
    ).toMatchSnapshot();
  });

  it('BraKet_Expect_16', () => {
    expect(
      tex2mml('\\ev**{\\frac{A}{B}}{\\frac{\\Psi}{\\Phi}}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics6_4', () => {
  it('BraKet_MatrixEl_0', () => {
    expect(tex2mml('\\matrixel{n}{A}{m}')).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_1', () => {
    expect(tex2mml('\\mel{n}{A}{m}')).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_2', () => {
    expect(
      tex2mml('\\mel{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}')
    ).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_3', () => {
    expect(tex2mml('\\mel A B C')).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_4', () => {
    expect(tex2mml('\\mel*{n}{\\frac{a}{b}}{m}')).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_5', () => {
    expect(
      tex2mml('\\mel*{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}')
    ).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_6', () => {
    expect(tex2mml('\\mel**{n}{\\frac{a}{b}}{m}')).toMatchSnapshot();
  });

  it('BraKet_MatrixEl_7', () => {
    expect(
      tex2mml('\\mel**{\\frac{a}{b}}{\\frac{a}{b}}{\\frac{a}{b}}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_0', () => {
  it('Matrices_Quantity_0', () => {
    expect(tex2mml('\\matrixquantity{Q}')).toMatchSnapshot();
  });

  it('Matrices_Quantity_1', () => {
    expect(tex2mml('\\matrixquantity*{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Quantity_2', () => {
    expect(tex2mml('\\matrixquantity*(a & b \\\\ c & d)')).toMatchSnapshot();
  });

  it('Matrices_Quantity_3', () => {
    expect(tex2mml('\\matrixquantity(a & b \\\\ c & d)')).toMatchSnapshot();
  });

  it('Matrices_Quantity_4', () => {
    expect(tex2mml('\\matrixquantity[a & b \\\\ c & d]')).toMatchSnapshot();
  });

  it('Matrices_Quantity_5', () => {
    expect(tex2mml('\\matrixquantity|a & b \\\\ c & d|')).toMatchSnapshot();
  });

  it('Matrices_Quantity_6', () => {
    expect(tex2mml('\\mqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Quantity_7', () => {
    expect(tex2mml('\\mqty(a & b \\\\ c & d)')).toMatchSnapshot();
  });

  it('Matrices_Quantity_8', () => {
    expect(tex2mml('\\mqty*(a & b \\\\ c & d)')).toMatchSnapshot();
  });

  it('Matrices_Quantity_9', () => {
    expect(tex2mml('\\mqty[a & b \\\\ c & d]')).toMatchSnapshot();
  });

  it('Matrices_Quantity_10', () => {
    expect(tex2mml('\\mqty|a & b \\\\ c & d|')).toMatchSnapshot();
  });

  it('Matrices_Quantity_11', () => {
    expect(tex2mml('\\mqty*|a & b\\\\ c& d|')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_10', () => {
  it('Matrices_Adiag_0', () => {
    expect(tex2mml('\\mqty(\\admat{1,2&3\\\\4&5})')).toMatchSnapshot();
  });

  it('Matrices_Adiag_1', () => {
    expect(tex2mml('\\mqty(\\admat 1)')).toMatchSnapshot();
  });

  it('Matrices_Adiag_2', () => {
    expect(tex2mml('\\mqty(\\admat 1,2)')).toMatchSnapshot();
  });

  it('Matrices_Adiag_3', () => {
    expect(tex2mml('\\mqty(\\admat{1,2&3\\\\4&5&6,7,8})')).toMatchSnapshot();
  });

  it('Matrices_Adiag_4', () => {
    expect(tex2mml('\\mqty(\\admat{1,2&3\\\\4&5,6,7,8})')).toMatchSnapshot();
  });

  it('Matrices_Adiag_5', () => {
    expect(
      tex2mml('\\mqty(\\admat{1,2&3\\\\4&5&6,7,8,\\dmat{9,10}})')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_11', () => {
  it('Matrices_Other_0', () => {
    expect(tex2mml('\\mqty a')).toMatchSnapshot();
  });

  it('Matrices_Other_1', () => {
    expect(tex2mml('\\mqty1')).toMatchSnapshot();
  });

  it('Matrices_Other_2', () => {
    expect(tex2mml('\\pmqty* 34')).toMatchSnapshot();
  });

  it('Matrices_Other_3', () => {
    expect(
      tex2mml(
        '\\mqty(\\dmat{1,2&3,4&4&5\\\\4&5,33,4,5,7,8\\\\0\\\\10&20\\\\3,200}) '
      )
    ).toMatchSnapshot();
  });

  it('Matrices_Other_4', () => {
    expect(tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5}) ')).toMatchSnapshot();
  });

  it('Matrices_Other_5', () => {
    expect(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,\\imat{3},7,8,\\dmat{9,10}})')
    ).toMatchSnapshot();
  });

  it('Matrices_Other_6', () => {
    expect(
      tex2mml(
        '\\mqty(\\mqty{1}\\\\ & \\mqty{2 & 3\\\\ 4 & 5 & 6}\\\\ & & \\mqty{\\imat{3}} \\\\ & & & \\mqty{7})'
      )
    ).toMatchSnapshot();
  });

  it('Matrices_Other_7', () => {
    expect(
      tex2mml('\\left\\lgroup\\frac{a}{b}\\right\\rgroup')
    ).toMatchSnapshot();
  });

  it('Matrices_Other_8', () => {
    expect(
      tex2mml('\\begin{smallmatrix} a & b \\\\ c & d \\end{smallmatrix}')
    ).toMatchSnapshot();
  });

  it('Matrices_Other_9', () => {
    expect(tex2mml('\\smqty{\\imat{3}}')).toMatchSnapshot();
  });

  it('Matrices_Other_10', () => {
    expect(tex2mml('\\mqty{\\imat{10}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_1', () => {
  it('Matrices_Fenced_0', () => {
    expect(tex2mml('\\pmqty{Q} \\mqty(R)')).toMatchSnapshot();
  });

  it('Matrices_Fenced_1', () => {
    expect(tex2mml('\\Pmqty{Q} \\mqty*(R)')).toMatchSnapshot();
  });

  it('Matrices_Fenced_2', () => {
    expect(tex2mml('\\bmqty{Q} \\mqty[R]')).toMatchSnapshot();
  });

  it('Matrices_Fenced_3', () => {
    expect(tex2mml('\\vmqty{Q} \\mqty|R|')).toMatchSnapshot();
  });

  it('Matrices_Fenced_4', () => {
    expect(tex2mml('\\pmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Fenced_5', () => {
    expect(tex2mml('\\Pmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Fenced_6', () => {
    expect(tex2mml('\\bmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Fenced_7', () => {
    expect(tex2mml('\\vmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_2', () => {
  it('Matrices_Small_0', () => {
    expect(tex2mml('\\smallmatrixquantity{Q}')).toMatchSnapshot();
  });

  it('Matrices_Small_1', () => {
    expect(
      tex2mml('\\smallmatrixquantity*{a & b \\\\ c & d}')
    ).toMatchSnapshot();
  });

  it('Matrices_Small_2', () => {
    expect(
      tex2mml('\\smallmatrixquantity*(a & b \\\\ c & d)')
    ).toMatchSnapshot();
  });

  it('Matrices_Small_3', () => {
    expect(
      tex2mml('\\smallmatrixquantity(a & b \\\\ c & d)')
    ).toMatchSnapshot();
  });

  it('Matrices_Small_5', () => {
    expect(
      tex2mml('\\smallmatrixquantity|a & b \\\\ c & d|')
    ).toMatchSnapshot();
  });

  it('Matrices_Small_6', () => {
    expect(tex2mml('\\smqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Small_7', () => {
    expect(tex2mml('\\smqty(a & b \\\\ c & d)')).toMatchSnapshot();
  });

  it('Matrices_Small_8', () => {
    expect(tex2mml('\\smqty*(a & b \\\\ c & d)')).toMatchSnapshot();
  });

  it('Matrices_Small_9', () => {
    expect(tex2mml('\\smqty[a & b \\\\ c & d]')).toMatchSnapshot();
  });

  it('Matrices_Small_10', () => {
    expect(tex2mml('\\smqty|a & b \\\\ c & d|')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_3', () => {
  it('Matrices_SmallFenced_0', () => {
    expect(tex2mml('\\spmqty{Q} \\smqty(R)')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_1', () => {
    expect(tex2mml('\\sPmqty{Q} \\smqty*(R)')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_2', () => {
    expect(tex2mml('\\sbmqty{Q} \\smqty[R]')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_3', () => {
    expect(tex2mml('\\svmqty{Q} \\smqty|R|')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_4', () => {
    expect(tex2mml('\\spmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_5', () => {
    expect(tex2mml('\\sPmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_6', () => {
    expect(tex2mml('\\sbmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_SmallFenced_7', () => {
    expect(tex2mml('\\svmqty{a & b \\\\ c & d}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_4', () => {
  it('Matrices_Det_0', () => {
    expect(tex2mml('\\matrixdeterminant{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Det_1', () => {
    expect(tex2mml('\\mdet{a & b \\\\ c & d}')).toMatchSnapshot();
  });

  it('Matrices_Det_2', () => {
    expect(tex2mml('\\smdet{a & b \\\\ c & d} ')).toMatchSnapshot();
  });

  it('Matrices_Det_3', () => {
    expect(tex2mml('\\matrixdeterminant a b')).toMatchSnapshot();
  });

  it('Matrices_Det_4', () => {
    expect(tex2mml('\\mdet a b')).toMatchSnapshot();
  });

  it('Matrices_Det_5', () => {
    expect(tex2mml('\\smdet a b')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_5', () => {
  it('Matrices_Identity_0', () => {
    expect(tex2mml('\\mqty{\\imat{3}}')).toMatchSnapshot();
  });

  it('Matrices_Identity_1', () => {
    expect(tex2mml('\\vmqty{\\imat{5}}')).toMatchSnapshot();
  });

  it('Matrices_Identity_2', () => {
    expect(tex2mml('\\vmqty{\\imat{0}}')).toMatchSnapshot();
  });

  it('Matrices_Identity_3', () => {
    expect(tex2mml('\\vmqty{\\imat{1}}')).toMatchSnapshot();
  });

  it('Matrices_Identity_4', () => {
    expect(tex2mml('\\vmqty{\\imat{-1}}')).toMatchSnapshot();
  });

  it('Matrices_Identity_5', () => {
    expect(tex2mml('\\pmqty{\\imat{3}\\pmat{0}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_6', () => {
  it('Matrices_XMatrix_0', () => {
    expect(tex2mml('\\smqty(\\xmat{1}{2}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_1', () => {
    expect(tex2mml('\\smqty(\\xmat{a}{3}{3}) ')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_2', () => {
    expect(tex2mml('\\smqty(\\xmat{a}{3}{1}) ')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_3', () => {
    expect(tex2mml('\\smqty(\\xmat{a}{1}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_4', () => {
    expect(tex2mml('\\smqty(\\xmat*{1}{2}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_5', () => {
    expect(tex2mml('\\smqty(\\xmat*{a}{3}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_6', () => {
    expect(tex2mml('\\smqty(\\xmat*{a}{3}{1})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_7', () => {
    expect(tex2mml('\\smqty(\\xmat*{a}{1}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_8', () => {
    expect(tex2mml('\\smqty(\\xmat*{a}{1}{1})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_9', () => {
    expect(tex2mml('\\smqty(\\xmat*{a}{-1}{-1})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_10', () => {
    expect(tex2mml('\\smqty(\\zmat{1}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_11', () => {
    expect(tex2mml('\\smqty(\\zmat{2}{3})')).toMatchSnapshot();
  });

  it('Matrices_XMatrix_12', () => {
    expect(tex2mml('\\smqty(\\zmat{3}{1})')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_7', () => {
  it('Matrices_Pauli_0', () => {
    expect(tex2mml('\\mqty{\\pmat{0}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_1', () => {
    expect(tex2mml('\\pmqty{\\pmat{0}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_2', () => {
    expect(tex2mml('\\mqty{\\pmat{1}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_3', () => {
    expect(tex2mml('\\mqty{\\pmat{2}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_4', () => {
    expect(tex2mml('\\mqty{\\pmat{3}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_5', () => {
    expect(tex2mml('\\mqty{\\pmat{4}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_6', () => {
    expect(tex2mml('\\mqty{\\pmat{x}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_7', () => {
    expect(tex2mml('\\mqty{\\pmat{y}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_8', () => {
    expect(tex2mml('\\mqty{\\pmat{z}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_9', () => {
    expect(tex2mml('\\mqty{\\pmat{a}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_10', () => {
    expect(tex2mml('\\pmqty{\\pmat{a}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_11', () => {
    expect(tex2mml('\\mqty{\\pmat{aa}}')).toMatchSnapshot();
  });

  it('Matrices_Pauli_12', () => {
    expect(tex2mml('\\pmqty{\\pmat{0.a}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_8', () => {
  it('Matrices_PauliFenced_0', () => {
    expect(tex2mml('\\pmqty{\\pmat{1}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_1', () => {
    expect(tex2mml('\\pmqty{\\pmat{2}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_2', () => {
    expect(tex2mml('\\pmqty{\\pmat{3}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_3', () => {
    expect(tex2mml('\\pmqty{\\pmat{4}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_4', () => {
    expect(tex2mml('\\pmqty{\\pmat{x}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_5', () => {
    expect(tex2mml('\\pmqty{\\pmat{y}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_6', () => {
    expect(tex2mml('\\pmqty{\\pmat{z}}')).toMatchSnapshot();
  });

  it('Matrices_PauliFenced_7', () => {
    expect(tex2mml('\\pmqty{\\pmat{aa}}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics7_9', () => {
  it('Matrices_Diag_0', () => {
    expect(tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5})')).toMatchSnapshot();
  });

  it('Matrices_Diag_1', () => {
    expect(tex2mml('\\mqty(\\dmat 1)')).toMatchSnapshot();
  });

  it('Matrices_Diag_2', () => {
    expect(tex2mml('\\mqty(\\dmat 1,2)')).toMatchSnapshot();
  });

  it('Matrices_Diag_3', () => {
    expect(tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,7,8})')).toMatchSnapshot();
  });

  it('Matrices_Diag_4', () => {
    expect(tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5,6,7,8})')).toMatchSnapshot();
  });

  it('Matrices_Diag_5', () => {
    expect(
      tex2mml('\\mqty(\\dmat{1,2\\\\3\\\\4\\\\5\\\\6,7,8})')
    ).toMatchSnapshot();
  });

  it('Matrices_Diag_6', () => {
    expect(
      tex2mml('\\mqty(\\dmat{1,2&3\\\\4&5&6,7,8,\\dmat{9,10}})')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Physics Errors', () => {
  it('MissingArgFor Quantity', () => {
    expectTexError('\\pqty').toBe('Missing argument for \\pqty');
  });

  it('MissingArgFor Commutator 1', () => {
    expectTexError('\\commutator\\nix').toBe(
      'Missing argument for \\commutator'
    );
  });

  it('MissingArgFor Commutator 2', () => {
    expectTexError('\\commutator').toBe('Missing argument for \\commutator');
  });

  it('InvalidNumber IdentityMatrix', () => {
    expectTexError('\\smqty(\\identitymatrix{a})').toBe('Invalid number');
  });

  it('InvalidNumber XMatrix n', () => {
    expectTexError('\\smqty(\\xmatrix{a}{a}{2})').toBe('Invalid number');
  });

  it('InvalidNumber XMatrix m', () => {
    expectTexError('\\smqty(\\xmatrix{a}{2}{a})').toBe('Invalid number');
  });

  it('InvalidNumber XMatrix n+', () => {
    expectTexError('\\smqty(\\xmatrix{a}{2.0}{2})').toBe('Invalid number');
  });

  it('InvalidNumber XMatrix m+', () => {
    expectTexError('\\smqty(\\xmatrix{a}{2}{2.0})').toBe('Invalid number');
  });

  it('Missing Closing Delimiter', () => {
    expect(
      tex2mml('\\sin(1\\over2')
    ).toMatchSnapshot();
  });

  it('Extra Open Delimiter', () => {
    expect(
      tex2mml('\\sin((1\\over2)')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Automatic Bracing Macros Rest', () => {
  it('Quantities_Bracket', () => {
    expect(tex2mml('\\bqty\\Bigg{a}')).toMatchSnapshot();
  });

  it('Quantities_Vert', () => {
    expect(tex2mml('\\vqty\\Bigg{a}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Vector Mo Rest', () => {
  it('dotproduct', () => {
    expect(tex2mml('A \\dotproduct B')).toMatchSnapshot();
  });

  it('vdot', () => {
    expect(tex2mml('A \\vdot B')).toMatchSnapshot();
  });

  it('cross', () => {
    expect(tex2mml('A \\cross B')).toMatchSnapshot();
  });

  it('cp', () => {
    expect(tex2mml('A \\cp B')).toMatchSnapshot();
  });

  it('divsymbol', () => {
    expect(tex2mml('A \\divsymbol B')).toMatchSnapshot();
  });

  it('divisionsymbol', () => {
    expect(tex2mml('A \\divisionsymbol B')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Expressions Macros Rest', () => {
  it('trace', () => {
    expect(tex2mml('\\trace(x)')).toMatchSnapshot();
  });

  it('Tr', () => {
    expect(tex2mml('\\Tr(x)')).toMatchSnapshot();
  });

  it('Trace', () => {
    expect(tex2mml('\\Trace(x)')).toMatchSnapshot();
  });

  it('arcsine', () => {
    expect(tex2mml('\\arcsine(x)')).toMatchSnapshot();
  });

  it('asine', () => {
    expect(tex2mml('\\asine(x)')).toMatchSnapshot();
  });

  it('cosine', () => {
    expect(tex2mml('\\cosine(x)')).toMatchSnapshot();
  });

  it('hypcosine', () => {
    expect(tex2mml('\\hypcosine(x)')).toMatchSnapshot();
  });

  it('arccosine', () => {
    expect(tex2mml('\\arccosine(x)')).toMatchSnapshot();
  });

  it('acosine', () => {
    expect(tex2mml('\\acosine(x)')).toMatchSnapshot();
  });

  it('tangent', () => {
    expect(tex2mml('\\tangent(x)')).toMatchSnapshot();
  });

  it('hyptangent', () => {
    expect(tex2mml('\\hyptangent(x)')).toMatchSnapshot();
  });

  it('arctangent', () => {
    expect(tex2mml('\\arctangent(x)')).toMatchSnapshot();
  });

  it('atangent', () => {
    expect(tex2mml('\\atangent(x)')).toMatchSnapshot();
  });

  it('cosecant', () => {
    expect(tex2mml('\\cosecant(x)')).toMatchSnapshot();
  });

  it('hypcosecant', () => {
    expect(tex2mml('\\hypcosecant(x)')).toMatchSnapshot();
  });

  it('arccosecant', () => {
    expect(tex2mml('\\arccosecant(x)')).toMatchSnapshot();
  });

  it('acosecant', () => {
    expect(tex2mml('\\acosecant(x)')).toMatchSnapshot();
  });

  it('secant', () => {
    expect(tex2mml('\\secant(x)')).toMatchSnapshot();
  });

  it('hypsecant', () => {
    expect(tex2mml('\\hypsecant(x)')).toMatchSnapshot();
  });

  it('arcsecant', () => {
    expect(tex2mml('\\arcsecant(x)')).toMatchSnapshot();
  });

  it('asecant', () => {
    expect(tex2mml('\\asecant(x)')).toMatchSnapshot();
  });

  it('cotangent', () => {
    expect(tex2mml('\\cotangent(x)')).toMatchSnapshot();
  });

  it('hypcotangent', () => {
    expect(tex2mml('\\hypcotangent(x)')).toMatchSnapshot();
  });

  it('arccotangent', () => {
    expect(tex2mml('\\arccotangent(x)')).toMatchSnapshot();
  });

  it('acotangent', () => {
    expect(tex2mml('\\acotangent(x)')).toMatchSnapshot();
  });

  it('exponential', () => {
    expect(tex2mml('\\exponential(x)')).toMatchSnapshot();
  });

  it('logarithm', () => {
    expect(tex2mml('\\logarithm(x)')).toMatchSnapshot();
  });

  it('naturallogarithm', () => {
    expect(tex2mml('\\naturallogarithm(x)')).toMatchSnapshot();
  });

  it('determinant', () => {
    expect(tex2mml('\\determinant(x)')).toMatchSnapshot();
  });

  it('Probability', () => {
    expect(tex2mml('\\Probability(x)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Derivative Macros Rest', () => {
  it('differential', () => {
    expect(tex2mml('\\differential')).toMatchSnapshot();
  });

  it('variation', () => {
    expect(tex2mml('\\variation')).toMatchSnapshot();
  });

  it('derivative one arg', () => {
    expect(tex2mml('\\derivative{x}')).toMatchSnapshot();
  });

  it('derivative two arg', () => {
    expect(tex2mml('\\derivative{x}{y}')).toMatchSnapshot();
  });

  it('derivative three arg', () => {
    expect(tex2mml('\\derivative{x}{y}{z}')).toMatchSnapshot();
  });

  it('partialderivative one arg', () => {
    expect(tex2mml('\\partialderivative{x}')).toMatchSnapshot();
  });

  it('partialderivative two arg', () => {
    expect(tex2mml('\\partialderivative{x}{y}')).toMatchSnapshot();
  });

  it('partialderivative three arg', () => {
    expect(tex2mml('\\partialderivative{x}{y}{z}')).toMatchSnapshot();
  });

  it('partialderivative four arg', () => {
    expect(tex2mml('\\partialderivative{x}{y}{z}{a}')).toMatchSnapshot();
  });

  it('pderivative one arg', () => {
    expect(tex2mml('\\pderivative{x}')).toMatchSnapshot();
  });

  it('pderivative two arg', () => {
    expect(tex2mml('\\pderivative{x}{y}')).toMatchSnapshot();
  });

  it('pderivative three arg', () => {
    expect(tex2mml('\\pderivative{x}{y}{z}')).toMatchSnapshot();
  });

  it('pderivative four arg', () => {
    expect(tex2mml('\\pderivative{x}{y}{z}{a}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Quick Quad Macros Rest', () => {
  it('qq', () => {
    expect(tex2mml('A \\qq B')).toMatchSnapshot();
  });

  it('qcomma', () => {
    expect(tex2mml('A \\qcomma B')).toMatchSnapshot();
  });

  it('qthen', () => {
    expect(tex2mml('A \\qthen B')).toMatchSnapshot();
  });

  it('qelse', () => {
    expect(tex2mml('A \\qelse B')).toMatchSnapshot();
  });

  it('qotherwise', () => {
    expect(tex2mml('A \\qotherwise B')).toMatchSnapshot();
  });

  it('qunless', () => {
    expect(tex2mml('A \\qunless B')).toMatchSnapshot();
  });

  it('qgiven', () => {
    expect(tex2mml('A \\qgiven B')).toMatchSnapshot();
  });

  it('qusing', () => {
    expect(tex2mml('A \\qusing B')).toMatchSnapshot();
  });

  it('qassume', () => {
    expect(tex2mml('A \\qassume B')).toMatchSnapshot();
  });

  it('qsince', () => {
    expect(tex2mml('A \\qsince B')).toMatchSnapshot();
  });

  it('qlet', () => {
    expect(tex2mml('A \\qlet B')).toMatchSnapshot();
  });

  it('qfor', () => {
    expect(tex2mml('A \\qfor B')).toMatchSnapshot();
  });

  it('qall', () => {
    expect(tex2mml('A \\qall B')).toMatchSnapshot();
  });

  it('qeven', () => {
    expect(tex2mml('A \\qeven B')).toMatchSnapshot();
  });

  it('qodd', () => {
    expect(tex2mml('A \\qodd B')).toMatchSnapshot();
  });

  it('qinteger', () => {
    expect(tex2mml('A \\qinteger B')).toMatchSnapshot();
  });

  it('qor', () => {
    expect(tex2mml('A \\qor B')).toMatchSnapshot();
  });

  it('qas', () => {
    expect(tex2mml('A \\qas B')).toMatchSnapshot();
  });

  it('qin', () => {
    expect(tex2mml('A \\qin B')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Bra-Ket Macros Rest', () => {
  it('innerproduct arg one', () => {
    expect(tex2mml('\\innerproduct{A}')).toMatchSnapshot();
  });

  it('innerproduct arg two', () => {
    expect(tex2mml('\\innerproduct{A}{B}')).toMatchSnapshot();
  });

  it('innerproduct arg three', () => {
    expect(tex2mml('\\innerproduct{A}{B}{C}')).toMatchSnapshot();
  });

  it('ip arg one', () => {
    expect(tex2mml('\\ip{A}')).toMatchSnapshot();
  });

  it('ip arg two', () => {
    expect(tex2mml('\\ip{A}{B}')).toMatchSnapshot();
  });

  it('ip arg three', () => {
    expect(tex2mml('\\ip{A}{B}{C}')).toMatchSnapshot();
  });

  it('op arg one', () => {
    expect(tex2mml('\\op{A}')).toMatchSnapshot();
  });

  it('op arg two', () => {
    expect(tex2mml('\\op{A}{B}')).toMatchSnapshot();
  });

  it('op arg three', () => {
    expect(tex2mml('\\op{A}{B}{C}')).toMatchSnapshot();
  });

  it('expectationvalue arg one', () => {
    expect(tex2mml('\\expectationvalue{A}')).toMatchSnapshot();
  });

  it('expectationvalue arg two', () => {
    expect(tex2mml('\\expectationvalue{A}{B}')).toMatchSnapshot();
  });

  it('expectationvalue arg three', () => {
    expect(tex2mml('\\expectationvalue{A}{B}{C}')).toMatchSnapshot();
  });

  it('expval arg one', () => {
    expect(tex2mml('\\expval{A}')).toMatchSnapshot();
  });

  it('expval arg two', () => {
    expect(tex2mml('\\expval{A}{B}')).toMatchSnapshot();
  });

  it('expval arg three', () => {
    expect(tex2mml('\\expval{A}{B}{C}')).toMatchSnapshot();
  });

  it('matrixelement arg three', () => {
    expect(tex2mml('\\matrixelement{A}{B}{C}')).toMatchSnapshot();
  });

  it('matrixelement arg four', () => {
    expect(tex2mml('\\matrixelement{A}{B}{C}{D}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Matrix Macros Rest', () => {
  it('zeromatrix', () => {
    expect(tex2mml('\\pmqty{\\zeromatrix{2}{3}}')).toMatchSnapshot();
  });

  it('paulimatrix 0', () => {
    expect(tex2mml('\\pmqty{\\paulimatrix{0}}')).toMatchSnapshot();
  });

  it('paulimatrix 1', () => {
    expect(tex2mml('\\pmqty{\\paulimatrix{1}}')).toMatchSnapshot();
  });

  it('paulimatrix 2', () => {
    expect(tex2mml('\\pmqty{\\paulimatrix{2}}')).toMatchSnapshot();
  });

  it('paulimatrix 3', () => {
    expect(tex2mml('\\pmqty{\\paulimatrix{3}}')).toMatchSnapshot();
  });

  it('paulimatrix 4', () => {
    expect(tex2mml('\\pmqty{\\paulimatrix{4}}')).toMatchSnapshot();
  });

  it('diagonalmatrix', () => {
    expect(tex2mml('\\pmqty{\\diagonalmatrix{0,1\\\\2&3}}')).toMatchSnapshot();
  });

  it('antidiagonalmatrix', () => {
    expect(
      tex2mml('\\pmqty{\\antidiagonalmatrix{0,1\\\\2&3}}')
    ).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Rest for Completion', () => {
  it('Issue 2831', () => {
    expect(tex2mml('\\exp((\\frac{a}{a}a){a})')).toMatchSnapshot();
  });

  it('Issue 3000', () => {
    expect(tex2mml('\\sin(1\\over2)')).toMatchSnapshot();
  });
});

/**********************************************************************************/

describe('Options', () => {
  beforeEach(() =>
    setupTex(['base', 'physics'], {
      physics: { arrowdel: true, italicdiff: true },
    })
  );

  it('Arrowdel true', () => {
    expect(tex2mml('\\vnabla')).toMatchSnapshot();
  });

  it('Italicdif true', () => {
    expect(tex2mml('\\dd{x}')).toMatchSnapshot();
  });
});

/**********************************************************************************/

afterAll(() => getTokens('physics'));
