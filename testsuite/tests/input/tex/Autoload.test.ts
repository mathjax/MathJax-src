import { afterAll, beforeEach, describe, test } from '@jest/globals';
import { getTokens, toXmlMatch, setupTexTypeset, typeset2mml, setupComponents } from '#helpers';

setupComponents({loader: {load: ['input/tex-base', '[tex]/autoload']}});

/**********************************************************************************/
/**********************************************************************************/

beforeEach(() => setupTexTypeset(['base', 'autoload']));

describe('Autoload', () => {

  /********************************************************************************/

  test('Autoload package', async () => {
    toXmlMatch(
      await typeset2mml('\\bbox[red]{x}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\bbox[red]{x}" display="block">
         <mstyle mathbackground="red" data-latex="\\bbox [red]{x}">
           <mi data-latex="x">x</mi>
         </mstyle>
       </math>`
    );
  });

  test('Autoload environment', async () => {
    toXmlMatch(
      await typeset2mml('\\begin{CD} a @>>> b\\end{CD}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD} a @&gt;&gt;&gt; b\\end{CD}" display="block">
         <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex="\\begin{CD} a @&gt;&gt;&gt; b\\end{CD}">
           <mtr>
             <mtd>
               <mi data-latex="a">a</mi>
               <mpadded height="8.5pt" depth="2pt"></mpadded>
             </mtd>
             <mtd>
               <mover>
                 <mo minsize="2.75em">&#x2192;</mo>
                 <mpadded width="+.67em" lspace=".33em" voffset=".1em">
                   <mspace width="2.75em" linebreak="nobreak" data-latex="\\kern 2.75em"></mspace>
                 </mpadded>
               </mover>
             </mtd>
             <mtd>
               <mi data-latex="b">b</mi>
             </mtd>
           </mtr>
         </mtable>
       </math>`
    );
  });
});

/**********************************************************************************/
/**********************************************************************************/

afterAll(() => getTokens('autoload'));
