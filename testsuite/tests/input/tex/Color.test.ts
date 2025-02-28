import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml, expectTexError } from '#helpers';
import '#js/input/tex/color/ColorConfiguration';

beforeEach(() => setupTex(['base', 'color']));

/**********************************************************************************/
/**********************************************************************************/

describe('Color named', () => {

  /********************************************************************************/

  test('Color extent', () => {
    toXmlMatch(
      tex2mml('\\color{red} x+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color{red} x+y" display="block">
         <mstyle mathcolor="red" data-latex="\\color{red} x+y">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Color limited', () => {
    toXmlMatch(
      tex2mml('{\\color{red} x}+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\color{red} x}+y" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{}">
           <mstyle mathcolor="red">
             <mi data-latex="x">x</mi>
           </mstyle>
         </mrow>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Color known', () => {
    toXmlMatch(
      tex2mml('{\\color{Peach} x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\color{Peach} x}" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{\\color{Peach} x}">
           <mstyle mathcolor="#F7965A">
             <mi data-latex="x">x</mi>
           </mstyle>
         </mrow>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor', () => {
    toXmlMatch(
      tex2mml('\\textcolor{red}{a b} + c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor{red}{a b} + c" display="block">
         <mstyle mathcolor="red" data-latex="\\textcolor{red}{a b}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mstyle>
         <mo data-latex="+">+</mo>
         <mi data-latex="c">c</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor nested', () => {
    toXmlMatch(
      tex2mml('\\textcolor{red}{\\textcolor{blue}{a} b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor{red}{\\textcolor{blue}{a} b}" display="block">
         <mstyle mathcolor="red" data-latex="\\textcolor{red}{\\textcolor{blue}{a} b}">
           <mstyle mathcolor="blue" data-latex="\\textcolor{blue}{a}">
             <mi data-latex="a">a</mi>
           </mstyle>
           <mi data-latex="b">b</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colorbox', () => {
    toXmlMatch(
      tex2mml('\\colorbox{red}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\colorbox{red}{a b}" display="block">
         <mpadded mathbackground="red" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\colorbox{red}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Fcolorbox', () => {
    toXmlMatch(
      tex2mml('\\fcolorbox{red}{yellow}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fcolorbox{red}{yellow}{a b}" display="block">
         <mpadded mathbackground="yellow" style="border: 2px solid red" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\fcolorbox{red}{yellow}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Definecolor', () => {
    toXmlMatch(
      tex2mml('\\definecolor{test}{named}{#48C}\\color{test} a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\definecolor{test}{named}{#48C}\\color{test} a" display="block">
         <mstyle mathcolor="#48C" data-latex="\\definecolor{test}{named}{#48C}\\color{test} a">
           <mi data-latex="a">a</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Color rgb', () => {

  /********************************************************************************/

  test('Color extent', () => {
    toXmlMatch(
      tex2mml('\\color[rgb]{1,0,0} x+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color[rgb]{1,0,0} x+y" display="block">
         <mstyle mathcolor="#ff0000" data-latex="\\color[rgb]{1,0,0} x+y">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Color limited', () => {
    toXmlMatch(
      tex2mml('{\\color[rgb]{1,0,0} x}+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\color[rgb]{1,0,0} x}+y" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{}">
           <mstyle mathcolor="#ff0000">
             <mi data-latex="x">x</mi>
           </mstyle>
         </mrow>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor', () => {
    toXmlMatch(
      tex2mml('\\textcolor[rgb]{1,0,0}{a b} + c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor[rgb]{1,0,0}{a b} + c" display="block">
         <mstyle mathcolor="#ff0000" data-latex="\\textcolor[rgb]{1,0,0}{a b}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mstyle>
         <mo data-latex="+">+</mo>
         <mi data-latex="c">c</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor nested', () => {
    toXmlMatch(
      tex2mml('\\textcolor[rgb]{1,0,0}{\\textcolor[rgb]{0,0,1}{a} b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor[rgb]{1,0,0}{\\textcolor[rgb]{0,0,1}{a} b}" display="block">
         <mstyle mathcolor="#ff0000" data-latex="\\textcolor[rgb]{1,0,0}{\\textcolor[rgb]{0,0,1}{a} b}">
           <mstyle mathcolor="#0000ff" data-latex="\\textcolor[rgb]{0,0,1}{a}">
             <mi data-latex="a">a</mi>
           </mstyle>
           <mi data-latex="b">b</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colorbox', () => {
    toXmlMatch(
      tex2mml('\\colorbox[rgb]{1,0,0}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\colorbox[rgb]{1,0,0}{a b}" display="block">
         <mpadded mathbackground="#ff0000" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\colorbox[rgb]{1,0,0}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Fcolorbox', () => {
    toXmlMatch(
      tex2mml('\\fcolorbox[rgb]{1,0,0}[rgb]{1,1,0}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fcolorbox[rgb]{1,0,0}[rgb]{1,1,0}{a b}" display="block">
         <mpadded mathbackground="#ffff00" style="border: 2px solid #ff0000" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\fcolorbox[rgb]{1,0,0}[rgb]{1,1,0}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Definecolor', () => {
    toXmlMatch(
      tex2mml('\\definecolor{test}{rgb}{.25,.5,.75}\\color{test} a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\definecolor{test}{rgb}{.25,.5,.75}\\color{test} a" display="block">
         <mstyle mathcolor="#3f7fbf" data-latex="\\definecolor{test}{rgb}{.25,.5,.75}\\color{test} a">
           <mi data-latex="a">a</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Color RGB', () => {

  /********************************************************************************/

  test('Color extent', () => {
    toXmlMatch(
      tex2mml('\\color[RGB]{255,0,0} x+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color[RGB]{255,0,0} x+y" display="block">
         <mstyle mathcolor="#ff0000" data-latex="\\color[RGB]{255,0,0} x+y">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Color limited', () => {
    toXmlMatch(
      tex2mml('{\\color[RGB]{255,0,0} x}+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\color[RGB]{255,0,0} x}+y" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{}">
           <mstyle mathcolor="#ff0000">
             <mi data-latex="x">x</mi>
           </mstyle>
         </mrow>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor', () => {
    toXmlMatch(
      tex2mml('\\textcolor[RGB]{255,0,0}{a b} + c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor[RGB]{255,0,0}{a b} + c" display="block">
         <mstyle mathcolor="#ff0000" data-latex="\\textcolor[RGB]{255,0,0}{a b}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mstyle>
         <mo data-latex="+">+</mo>
         <mi data-latex="c">c</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor nested', () => {
    toXmlMatch(
      tex2mml('\\textcolor[RGB]{255,0,0}{\\textcolor[RGB]{0,0,255}{a} b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor[RGB]{255,0,0}{\\textcolor[RGB]{0,0,255}{a} b}" display="block">
         <mstyle mathcolor="#ff0000" data-latex="\\textcolor[RGB]{255,0,0}{\\textcolor[RGB]{0,0,255}{a} b}">
           <mstyle mathcolor="#0000ff" data-latex="\\textcolor[RGB]{0,0,255}{a}">
             <mi data-latex="a">a</mi>
           </mstyle>
           <mi data-latex="b">b</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colorbox', () => {
    toXmlMatch(
      tex2mml('\\colorbox[RGB]{255,0,0}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\colorbox[RGB]{255,0,0}{a b}" display="block">
         <mpadded mathbackground="#ff0000" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\colorbox[RGB]{255,0,0}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Fcolorbox', () => {
    toXmlMatch(
      tex2mml('\\fcolorbox[RGB]{255,0,0}[RGB]{255,255,0}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fcolorbox[RGB]{255,0,0}[RGB]{255,255,0}{a b}" display="block">
         <mpadded mathbackground="#ffff00" style="border: 2px solid #ff0000" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\fcolorbox[RGB]{255,0,0}[RGB]{255,255,0}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Definecolor', () => {
    toXmlMatch(
      tex2mml('\\definecolor{test}{RGB}{8,128,200}\\color{test} a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\definecolor{test}{RGB}{8,128,200}\\color{test} a" display="block">
         <mstyle mathcolor="#0880c8" data-latex="\\definecolor{test}{RGB}{8,128,200}\\color{test} a">
           <mi data-latex="a">a</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Color gray', () => {

  /********************************************************************************/

  test('Color extent', () => {
    toXmlMatch(
      tex2mml('\\color[gray]{.5} x+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\color[gray]{.5} x+y" display="block">
         <mstyle mathcolor="#7f7f7f" data-latex="\\color[gray]{.5} x+y">
           <mi data-latex="x">x</mi>
           <mo data-latex="+">+</mo>
           <mi data-latex="y">y</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Color limited', () => {
    toXmlMatch(
      tex2mml('{\\color[gray]{.5} x}+y'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="{\\color[gray]{.5} x}+y" display="block">
         <mrow data-mjx-texclass="ORD" data-latex="{}">
           <mstyle mathcolor="#7f7f7f">
             <mi data-latex="x">x</mi>
           </mstyle>
         </mrow>
         <mo data-latex="+">+</mo>
         <mi data-latex="y">y</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor', () => {
    toXmlMatch(
      tex2mml('\\textcolor[gray]{.5}{a b} + c'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor[gray]{.5}{a b} + c" display="block">
         <mstyle mathcolor="#7f7f7f" data-latex="\\textcolor[gray]{.5}{a b}">
           <mi data-latex="a">a</mi>
           <mi data-latex="b">b</mi>
         </mstyle>
         <mo data-latex="+">+</mo>
         <mi data-latex="c">c</mi>
       </math>`
    );
  });

  /********************************************************************************/

  test('Textcolor nested', () => {
    toXmlMatch(
      tex2mml('\\textcolor[gray]{.5}{\\textcolor[gray]{.75}{a} b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\textcolor[gray]{.5}{\\textcolor[gray]{.75}{a} b}" display="block">
         <mstyle mathcolor="#7f7f7f" data-latex="\\textcolor[gray]{.5}{\\textcolor[gray]{.75}{a} b}">
           <mstyle mathcolor="#bfbfbf" data-latex="\\textcolor[gray]{.75}{a}">
             <mi data-latex="a">a</mi>
           </mstyle>
           <mi data-latex="b">b</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

  test('Colorbox', () => {
    toXmlMatch(
      tex2mml('\\colorbox[gray]{.5}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\colorbox[gray]{.5}{a b}" display="block">
         <mpadded mathbackground="#7f7f7f" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\colorbox[gray]{.5}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Fcolorbox', () => {
    toXmlMatch(
      tex2mml('\\fcolorbox[gray]{.5}[gray]{.25}{a b}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\fcolorbox[gray]{.5}[gray]{.25}{a b}" display="block">
         <mpadded mathbackground="#3f3f3f" style="border: 2px solid #7f7f7f" width="+10px" height="+5px" depth="+5px" lspace="5px" data-latex="\\fcolorbox[gray]{.5}[gray]{.25}{a b}">
           <mtext>a b</mtext>
         </mpadded>
       </math>`
    );
  });

  /********************************************************************************/

  test('Definecolor', () => {
    toXmlMatch(
      tex2mml('\\definecolor{test}{gray}{.02}\\color{test} a'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\definecolor{test}{gray}{.02}\\color{test} a" display="block">
         <mstyle mathcolor="#050505" data-latex="\\definecolor{test}{gray}{.02}\\color{test} a">
           <mi data-latex="a">a</mi>
         </mstyle>
       </math>`
    );
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

describe('Color errors', () => {

  /********************************************************************************/

  test('UndefinedColormodel', () => {
    expectTexError('\\color[error]{error} x')
      .toBe("Color model 'error' not defined");
  });

  /********************************************************************************/

  test('ModelArg1 rgb', () => {
    expectTexError('\\definecolor{test}{rgb}{1}')
      .toBe('Color values for the rgb model require 3 numbers');
  });

  /********************************************************************************/

  test('InvalidDecimalNumber rgb', () => {
    expectTexError('\\definecolor{test}{rgb}{x,x,x}')
      .toBe('Invalid decimal number');
  });

  /********************************************************************************/

  test('ModelArg2 rgb', () => {
    expectTexError('\\definecolor{test}{rgb}{10,10,10}')
      .toBe('Color values for the rgb model must be between 0 and 1');
  });

  /********************************************************************************/

  test('ModelArg1 RGB', () => {
    expectTexError('\\definecolor{test}{RGB}{1}')
      .toBe('Color values for the RGB model require 3 numbers');
  });

  /********************************************************************************/

  test('InvalidDecimalNumber RGB', () => {
    expectTexError('\\definecolor{test}{RGB}{x,x,x}')
      .toBe('Invalid number');
  });

  /********************************************************************************/

  test('ModelArg2 RGB', () => {
    expectTexError('\\definecolor{test}{RGB}{1000,1000,1000}')
      .toBe('Color values for the RGB model must be between 0 and 255');
  });

  /********************************************************************************/

  test('InvalidDecimalNumber gray', () => {
    expectTexError('\\definecolor{test}{gray}{x}')
      .toBe('Invalid decimal number');
  });

  /********************************************************************************/

  test('ModelArg2 gray', () => {
    expectTexError('\\definecolor{test}{gray}{10}')
      .toBe('Color values for the gray model must be between 0 and 1');
  });

  /********************************************************************************/

  test('BadColorValue', () => {
    expectTexError('\\definecolor{error}{}{a;b}')
      .toBe('Invalid color value');
  });

  /********************************************************************************/

  test('BadColorValue named', () => {
    expectTexError('\\color[named]{a;b}{x}')
      .toBe('Invalid color value');
  });

  /********************************************************************************/

});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('color'));
