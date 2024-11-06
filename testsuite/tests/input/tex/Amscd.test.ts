import { afterAll, beforeEach, describe, it } from '@jest/globals';
import { getTokens, toXmlMatch, setupTex, tex2mml } from '#helpers';
import '#js/input/tex/amscd/AmsCdConfiguration';

beforeEach(() => setupTex(['base', 'amscd']));

describe('AmsCD', () => {
  it('AmsCD-1', () =>
    toXmlMatch(
      tex2mml('\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="a">a</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="B">B</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{b}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{b}">
              <mpadded width="0">
                <mi data-latex="b">b</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mrow>
          <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{c}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{c}">
              <mpadded width="0">
                <mi data-latex="c">c</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="C">C</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="d">d</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="D">D</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-2', () =>
    toXmlMatch(
      tex2mml('\\begin{CD}A @<<< B @>>> C\\\\@. @| @AAA\\\\@. D @= E\\end{CD}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD}A @&lt;&lt;&lt; B @&gt;&gt;&gt; C\\\\@. @| @AAA\\\\@. D @= E\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\begin{CD}A @&lt;&lt;&lt; B @&gt;&gt;&gt; C\\\\@. @| @AAA\\\\@. D @= E\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2190;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mspace width="2.75em" linebreak="nobreak" data-latex="\\kern 2.75em"></mspace>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="B">B</mi>
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
        <mi data-latex="C">C</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd></mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" stretchy="true" symmetric="true" lspace="0" rspace="0">&#x2225;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2191;</mo>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mi data-latex="D">D</mi>
      </mtd>
      <mtd>
        <mo minsize="2.75em" stretchy="true">=</mo>
      </mtd>
      <mtd>
        <mi data-latex="E">E</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-3', () =>
    toXmlMatch(
      tex2mml('\\begin{CD}A @>a>b> B\\\\@VlVrV @AlArA\\\\C @<a<b< D\\end{CD}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD}A @&gt;a&gt;b&gt; B\\\\@VlVrV @AlArA\\\\C @&lt;a&lt;b&lt; D\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\begin{CD}A @&gt;a&gt;b&gt; B\\\\@VlVrV @AlArA\\\\C @&lt;a&lt;b&lt; D\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <munderover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em">
            <mi data-latex="b">b</mi>
          </mpadded>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="a">a</mi>
          </mpadded>
        </munderover>
      </mtd>
      <mtd>
        <mi data-latex="B">B</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\llap{l}">
            <mrow data-mjx-texclass="ORD" data-latex="\\llap{l}">
              <mpadded width="0" lspace="-1width">
                <mi data-latex="l">l</mi>
              </mpadded>
            </mrow>
          </mstyle>
          <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{r}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{r}">
              <mpadded width="0">
                <mi data-latex="r">r</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mrow>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\llap{l}">
            <mrow data-mjx-texclass="ORD" data-latex="\\llap{l}">
              <mpadded width="0" lspace="-1width">
                <mi data-latex="l">l</mi>
              </mpadded>
            </mrow>
          </mstyle>
          <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2191;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{r}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{r}">
              <mpadded width="0">
                <mi data-latex="r">r</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="C">C</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <munderover>
          <mo minsize="2.75em">&#x2190;</mo>
          <mpadded width="+.67em" lspace=".33em">
            <mi data-latex="b">b</mi>
          </mpadded>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="a">a</mi>
          </mpadded>
        </munderover>
      </mtd>
      <mtd>
        <mi data-latex="D">D</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-4', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{CD}A @>>> B@>\\text{very long label}>>C\\\\@VVV @VVV @VVV\\\\D @>>> E@>>> F\\end{CD}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD}A @&gt;&gt;&gt; B@&gt;\\text{very long label}&gt;&gt;C\\\\@VVV @VVV @VVV\\\\D @&gt;&gt;&gt; E@&gt;&gt;&gt; F\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\begin{CD}A @&gt;&gt;&gt; B@&gt;\\text{very long label}&gt;&gt;C\\\\@VVV @VVV @VVV\\\\D @&gt;&gt;&gt; E@&gt;&gt;&gt; F\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
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
        <mi data-latex="B">B</mi>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mtext data-latex="\\text{very long label}">very long label</mtext>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="C">C</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="D">D</mi>
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
        <mi data-latex="E">E</mi>
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
        <mi data-latex="F">F</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-5', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{CD}A @>>> B @>{\\text{very long label}}>> C \\\\@VVV @VVV @VVV \\\\D @>>> E @>{\\phantom{\\text{very long label}}}>> F\\end{CD}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD}A @&gt;&gt;&gt; B @&gt;{\\text{very long label}}&gt;&gt; C \\\\@VVV @VVV @VVV \\\\D @&gt;&gt;&gt; E @&gt;{\\phantom{\\text{very long label}}}&gt;&gt; F\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\begin{CD}A @&gt;&gt;&gt; B @&gt;{\\text{very long label}}&gt;&gt; C \\\\@VVV @VVV @VVV \\\\D @&gt;&gt;&gt; E @&gt;{\\phantom{\\text{very long label}}}&gt;&gt; F\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
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
        <mi data-latex="B">B</mi>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mrow data-mjx-texclass="ORD" data-latex="{\\text{very long label}}">
              <mtext data-latex="\\text{very long label}">very long label</mtext>
            </mrow>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="C">C</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="D">D</mi>
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
        <mi data-latex="E">E</mi>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mrow data-mjx-texclass="ORD" data-latex="{\\phantom{\\text{very long label}}}">
              <mrow data-mjx-texclass="ORD" data-latex="\\phantom{\\text{very long label}}">
                <mphantom>
                  <mtext data-latex="\\text{very long label}">very long label</mtext>
                </mphantom>
              </mrow>
            </mrow>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="F">F</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-6', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{CD}A @>>> B @>{\\text{very long label}}>> C \\\\@VVV @VVV @VVV \\\\D @>>> E @>{\\rlap{\\scriptstyle{\\ \\ \\ \\text{shorter}}}\\phantom{\\text{very long label}}}>> F\\end{CD}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{CD}A @&gt;&gt;&gt; B @&gt;{\\text{very long label}}&gt;&gt; C \\\\@VVV @VVV @VVV \\\\D @&gt;&gt;&gt; E @&gt;{\\rlap{\\scriptstyle{\\ \\ \\ \\text{shorter}}}\\phantom{\\text{very long label}}}&gt;&gt; F\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\begin{CD}A @&gt;&gt;&gt; B @&gt;{\\text{very long label}}&gt;&gt; C \\\\@VVV @VVV @VVV \\\\D @&gt;&gt;&gt; E @&gt;{\\rlap{\\scriptstyle{\\ \\ \\ \\text{shorter}}}\\phantom{\\text{very long label}}}&gt;&gt; F\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
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
        <mi data-latex="B">B</mi>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mrow data-mjx-texclass="ORD" data-latex="{\\text{very long label}}">
              <mtext data-latex="\\text{very long label}">very long label</mtext>
            </mrow>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="C">C</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="D">D</mi>
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
        <mi data-latex="E">E</mi>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mrow data-mjx-texclass="ORD" data-latex="{\\rlap{\\scriptstyle{\\ \\ \\ \\text{shorter}}}\\phantom{\\text{very long label}}}">
              <mrow data-mjx-texclass="ORD" data-latex="\\rlap{\\scriptstyle{\\ \\ \\ \\text{shorter}}}">
                <mpadded width="0">
                  <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle{\\ \\ \\ \\text{shorter}}">
                    <mrow data-mjx-texclass="ORD" data-latex="{\\text{shorter}}">
                      <mtext>&#xA0;</mtext>
                      <mtext>&#xA0;</mtext>
                      <mtext>&#xA0;</mtext>
                      <mtext data-latex="\\text{shorter}">shorter</mtext>
                    </mrow>
                  </mstyle>
                </mpadded>
              </mrow>
              <mrow data-mjx-texclass="ORD" data-latex="\\phantom{\\text{very long label}}">
                <mphantom>
                  <mtext data-latex="\\text{very long label}">very long label</mtext>
                </mphantom>
              </mrow>
            </mrow>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="F">F</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-width', () =>
    toXmlMatch(
      tex2mml(
        '\\minCDarrowwidth{5cm}\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\minCDarrowwidth{5cm}\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\minCDarrowwidth{5cm}\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="5cm">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="a">a</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="B">B</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{b}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{b}">
              <mpadded width="0">
                <mi data-latex="b">b</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mrow>
          <mo minsize="1.75em" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{c}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{c}">
              <mpadded width="0">
                <mi data-latex="c">c</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="C">C</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="5cm">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="d">d</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="D">D</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-height', () =>
    toXmlMatch(
      tex2mml(
        '\\minCDarrowheight{4cm}\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\minCDarrowheight{4cm}\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\minCDarrowheight{4cm}\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="a">a</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="B">B</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mo minsize="4cm" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{b}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{b}">
              <mpadded width="0">
                <mi data-latex="b">b</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mrow>
          <mo minsize="4cm" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{c}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{c}">
              <mpadded width="0">
                <mi data-latex="c">c</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="C">C</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="2.75em">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="d">d</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="D">D</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('AmsCD-both', () =>
    toXmlMatch(
      tex2mml(
        '\\minCDarrowheight{4cm}\\minCDarrowwidth{5cm}\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\minCDarrowheight{4cm}\\minCDarrowwidth{5cm}\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}" display="block">
  <mtable columnspacing="5pt" rowspacing="5pt" displaystyle="true" data-latex-item="{CD}" data-latex="\\minCDarrowheight{4cm}\\minCDarrowwidth{5cm}\\begin{CD}A @&gt;a&gt;&gt; B\\\\@VVbV @VVcV\\\\C @&gt;d&gt;&gt; D\\end{CD}">
    <mtr>
      <mtd>
        <mi data-latex="A">A</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="5cm">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="a">a</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="B">B</mi>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mo minsize="4cm" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{b}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{b}">
              <mpadded width="0">
                <mi data-latex="b">b</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
      <mtd>
        <mrow>
          <mo minsize="4cm" symmetric="true" lspace="0" rspace="0">&#x2193;</mo>
          <mstyle displaystyle="false" scriptlevel="1" data-latex="\\scriptstyle\\rlap{c}">
            <mrow data-mjx-texclass="ORD" data-latex="\\rlap{c}">
              <mpadded width="0">
                <mi data-latex="c">c</mi>
              </mpadded>
            </mrow>
          </mstyle>
        </mrow>
      </mtd>
      <mtd></mtd>
    </mtr>
    <mtr>
      <mtd>
        <mi data-latex="C">C</mi>
        <mpadded height="8.5pt" depth="2pt"></mpadded>
      </mtd>
      <mtd>
        <mover>
          <mo minsize="5cm">&#x2192;</mo>
          <mpadded width="+.67em" lspace=".33em" voffset=".1em">
            <mi data-latex="d">d</mi>
          </mpadded>
        </mover>
      </mtd>
      <mtd>
        <mi data-latex="D">D</mi>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Suspicious Return', () =>
    toXmlMatch(
      tex2mml('\\begin{CD}A @Ra>> BaD\\end{CD}'),
      `<math xmlns=\"http://www.w3.org/1998/Math/MathML\" data-latex=\"\\begin{CD}A @Ra&gt;&gt; BaD\\end{CD}\" display=\"block\">
      <mtable columnspacing=\"5pt\" rowspacing=\"5pt\" displaystyle=\"true\" data-latex-item=\"{CD}\" data-latex=\"\\begin{CD}A @Ra&gt;&gt; BaD\\end{CD}\">
        <mtr>
          <mtd>
            <mi data-latex=\"A\">A</mi>
            <mrow data-mjx-texclass=\"ORD\">
              <mo data-latex=\"@\">@</mo>
            </mrow>
            <mi data-latex=\"R\">R</mi>
            <mi data-latex=\"a\">a</mi>
            <mo data-latex=\"&gt;\">&gt;&gt;</mo>
            <mi data-latex=\"B\">B</mi>
            <mi data-latex=\"a\">a</mi>
            <mi data-latex=\"D\">D</mi>
          </mtd>
        </mtr>
      </mtable>
    </math>`
    ));
});

describe.skip('AmsCD Options', () => {
  beforeEach(() => setupTex(['base', 'amscd'], { amscd: {hideHorizontalLabels: true } }));
  it('Hide Horizontal Labels', () =>
    toXmlMatch(
      tex2mml('\\begin{CD}A @>a>> B\\\\@VVbV @VVcV\\\\C @>d>> D\\end{CD}'),
      ``
    ));
});

afterAll(() => getTokens('amscd'));
