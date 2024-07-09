import { beforeEach, describe, it } from '@jest/globals';
import { toXmlMatch, setupTexWithOutput, tex2mml } from '#helpers';
import '#js/input/tex/bussproofs/BussproofsConfiguration';
import '#js/input/tex/ams/AmsConfiguration';

beforeEach(() => setupTexWithOutput(['base', 'ams', 'bussproofs']));

describe('BussproofsRegInf', () => {
  it('Single Axiom', () =>
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AxiomC{A}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_axiom:true;bspr_proof:true">
    <mspace width=".5ex"></mspace>
    <mstyle displaystyle="false" scriptlevel="0">
      <mtext>A</mtext>
    </mstyle>
    <mspace width=".5ex"></mspace>
  </mrow>
</math>`
    ));
  it('Unary Inference', () =>
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\UnaryInfC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:1;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>B</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Binary Inference', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\BinaryInfC{C}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:2;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>B</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>C</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Trinary Inference', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\TrinaryInfC{D}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:3;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>B</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{C}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>C</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>D</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Quaternary Inference', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\QuaternaryInfC{E}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:4;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>B</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{C}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>C</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>D</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>E</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Quinary Inference', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{A}\\AxiomC{B}\\AxiomC{C}\\AxiomC{D}\\AxiomC{E}\\QuinaryInfC{F}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:5;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>B</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{C}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>C</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>D</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AxiomC{E}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>E</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>F</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Label Left', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\UnaryInfC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_labelledRule:left;bspr_inference:1;bspr_proof:true">
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>L</mtext>
      </mstyle>
    </mpadded>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\LeftLabel{L}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>A</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>B</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
  </mrow>
</math>`
    ));
  it('Label Right', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_labelledRule:right;bspr_inference:1;bspr_proof:true">
    <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>A</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>B</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>R</mtext>
      </mstyle>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Label Both', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AxiomC{A}\\LeftLabel{L}\\RightLabel{R}\\UnaryInfC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_labelledRule:both;bspr_inference:1;bspr_proof:true">
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>L</mtext>
      </mstyle>
    </mpadded>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>A</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>B</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>R</mtext>
      </mstyle>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Single Axiom Abbr', () =>
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AXC{A}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AXC{A}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_axiom:true;bspr_proof:true">
    <mspace width=".5ex"></mspace>
    <mstyle displaystyle="false" scriptlevel="0">
      <mtext>A</mtext>
    </mstyle>
    <mspace width=".5ex"></mspace>
  </mrow>
</math>`
    ));
  it('Unary Inference Abbr', () =>
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AXC{A}\\UIC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:1;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AXC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>B</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Binary Inference Abbr', () =>
    toXmlMatch(
      tex2mml('\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}'),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\BIC{C}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:2;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AXC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AXC{B}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>B</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>C</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Trinary Inference Abbr', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}" display="block">
  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AXC{A}\\AXC{B}\\AXC{C}\\TIC{D}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down;bspr_inference:3;bspr_proof:true">
    <mtr>
      <mtd>
        <mtable framespacing="0 0">
          <mtr>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AXC{A}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>A</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AXC{B}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>B</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
            <mtd></mtd>
            <mtd rowalign="bottom">
              <mrow data-latex="\\AXC{C}" semantics="bspr_axiom:true">
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mtext>C</mtext>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
      </mtd>
    </mtr>
    <mtr>
      <mtd>
        <mrow>
          <mspace width=".5ex"></mspace>
          <mstyle displaystyle="false" scriptlevel="0">
            <mtext>D</mtext>
          </mstyle>
          <mspace width=".5ex"></mspace>
        </mrow>
      </mtd>
    </mtr>
  </mtable>
</math>`
    ));
  it('Label Left Abbr', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\UIC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_labelledRule:left;bspr_inference:1;bspr_proof:true">
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>L</mtext>
      </mstyle>
    </mpadded>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\LeftLabel{L}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>A</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>B</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
  </mrow>
</math>`
    ));
  it('Label Right Abbr', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AXC{A}\\RightLabel{R}\\UIC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_labelledRule:right;bspr_inference:1;bspr_proof:true">
    <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>A</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>B</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>R</mtext>
      </mstyle>
    </mpadded>
  </mrow>
</math>`
    ));
  it('Label Both Abbr', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}" display="block">
  <mrow data-latex="\\begin{prooftree}\\AXC{A}\\LeftLabel{L}\\RightLabel{R}\\UIC{B}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_labelledRule:both;bspr_inference:1;bspr_proof:true">
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>L</mtext>
      </mstyle>
    </mpadded>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\RightLabel{R}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>A</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>B</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
      <mstyle displaystyle="false" scriptlevel="0">
        <mtext>R</mtext>
      </mstyle>
    </mpadded>
  </mrow>
</math>`
    ));
});

describe('BussproofsRegProofs', () => {
  it('Simple Proof', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true">
    <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>D</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
              <mtd></mtd>
              <mtd rowalign="bottom">
                <mrow semantics="bspr_inference:2">
                  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{E}" semantics="bspr_inferenceRule:down">
                    <mtr>
                      <mtd>
                        <mtable framespacing="0 0">
                          <mtr>
                            <mtd rowalign="bottom">
                              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                <mspace width=".5ex"></mspace>
                                <mstyle displaystyle="false" scriptlevel="0">
                                  <mtext>A</mtext>
                                </mstyle>
                                <mspace width=".5ex"></mspace>
                              </mrow>
                            </mtd>
                            <mtd></mtd>
                            <mtd rowalign="bottom">
                              <mrow semantics="bspr_inference:2">
                                <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}" semantics="bspr_inferenceRule:down">
                                  <mtr>
                                    <mtd>
                                      <mtable framespacing="0 0">
                                        <mtr>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>B</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                          <mtd></mtd>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>R</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mtd>
                                  </mtr>
                                  <mtr>
                                    <mtd>
                                      <mrow>
                                        <mspace width=".5ex"></mspace>
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mrow data-mjx-texclass="ORD">
                                            <mi data-latex="C">C</mi>
                                            <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                            <mi data-latex="D">D</mi>
                                            <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                            <mi data-latex="Q">Q</mi>
                                          </mrow>
                                        </mstyle>
                                        <mspace width=".5ex"></mspace>
                                      </mrow>
                                    </mtd>
                                  </mtr>
                                </mtable>
                                <mspace width="0em"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mrow>
                          <mspace width=".5ex"></mspace>
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>E</mtext>
                          </mstyle>
                          <mspace width=".5ex"></mspace>
                        </mrow>
                      </mtd>
                    </mtr>
                  </mtable>
                  <mspace width="-3.795em"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>F</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mspace width="3.795em"></mspace>
  </mrow>
</math>`
    ));
  it('Simple Proof Noise', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}$\\alpha$\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\$\\alpha\$\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" display="block">
  <mrow data-latex-item="{prooftree}" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\$\\alpha\$\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\BinaryInfC{E}\\BinaryInfC{F}\\end{prooftree}" semantics="bspr_proof:true">
    <mrow data-mjx-texclass="ORD">
      <mo>\$</mo>
    </mrow>
    <mi>&#x3B1;</mi>
    <mrow data-mjx-texclass="ORD">
      <mo>\$</mo>
    </mrow>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{F}" semantics="bspr_inferenceRule:down;bspr_inference:2">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>D</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
              <mtd></mtd>
              <mtd rowalign="bottom">
                <mrow semantics="bspr_inference:2">
                  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{E}" semantics="bspr_inferenceRule:down">
                    <mtr>
                      <mtd>
                        <mtable framespacing="0 0">
                          <mtr>
                            <mtd rowalign="bottom">
                              <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                <mspace width=".5ex"></mspace>
                                <mstyle displaystyle="false" scriptlevel="0">
                                  <mtext>A</mtext>
                                </mstyle>
                                <mspace width=".5ex"></mspace>
                              </mrow>
                            </mtd>
                            <mtd></mtd>
                            <mtd rowalign="bottom">
                              <mrow semantics="bspr_inference:2">
                                <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}" semantics="bspr_inferenceRule:down">
                                  <mtr>
                                    <mtd>
                                      <mtable framespacing="0 0">
                                        <mtr>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>B</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                          <mtd></mtd>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="$" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>R</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mtd>
                                  </mtr>
                                  <mtr>
                                    <mtd>
                                      <mrow>
                                        <mspace width=".5ex"></mspace>
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mrow data-mjx-texclass="ORD">
                                            <mi data-latex="C">C</mi>
                                            <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                            <mi data-latex="D">D</mi>
                                            <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                            <mi data-latex="Q">Q</mi>
                                          </mrow>
                                        </mstyle>
                                        <mspace width=".5ex"></mspace>
                                      </mrow>
                                    </mtd>
                                  </mtr>
                                </mtable>
                                <mspace width="0em"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mrow>
                          <mspace width=".5ex"></mspace>
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>E</mtext>
                          </mstyle>
                          <mspace width=".5ex"></mspace>
                        </mrow>
                      </mtd>
                    </mtr>
                  </mtable>
                  <mspace width="-3.795em"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mtext>F</mtext>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mspace width="3.795em"></mspace>
  </mrow>
</math>`
    ));
  it('Simple Proof Large', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true">
    <mspace width="8.227em"></mspace>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\BinaryInfC{E}\\BinaryInfC{F}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow semantics="bspr_inference:2">
                  <mspace width="-4.953em"></mspace>
                  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{F}" semantics="bspr_inferenceRule:down">
                    <mtr>
                      <mtd>
                        <mtable framespacing="0 0">
                          <mtr>
                            <mtd rowalign="bottom">
                              <mrow semantics="bspr_inference:3">
                                <mspace width="-3.274em"></mspace>
                                <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\TrinaryInfC{Q}" semantics="bspr_inferenceRule:down">
                                  <mtr>
                                    <mtd>
                                      <mtable framespacing="0 0">
                                        <mtr>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>D</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                          <mtd></mtd>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>A1</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                          <mtd></mtd>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>A2</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mtd>
                                  </mtr>
                                  <mtr>
                                    <mtd>
                                      <mrow>
                                        <mspace width=".5ex"></mspace>
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mtext>Q</mtext>
                                        </mstyle>
                                        <mspace width=".5ex"></mspace>
                                      </mrow>
                                    </mtd>
                                  </mtr>
                                </mtable>
                              </mrow>
                            </mtd>
                            <mtd></mtd>
                            <mtd rowalign="bottom">
                              <mrow semantics="bspr_inference:2">
                                <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{E}" semantics="bspr_inferenceRule:down">
                                  <mtr>
                                    <mtd>
                                      <mtable framespacing="0 0">
                                        <mtr>
                                          <mtd rowalign="bottom">
                                            <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>A</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                          <mtd></mtd>
                                          <mtd rowalign="bottom">
                                            <mrow semantics="bspr_inference:2">
                                              <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}" semantics="bspr_inferenceRule:down">
                                                <mtr>
                                                  <mtd>
                                                    <mtable framespacing="0 0">
                                                      <mtr>
                                                        <mtd rowalign="bottom">
                                                          <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                            <mspace width=".5ex"></mspace>
                                                            <mstyle displaystyle="false" scriptlevel="0">
                                                              <mtext>B</mtext>
                                                            </mstyle>
                                                            <mspace width=".5ex"></mspace>
                                                          </mrow>
                                                        </mtd>
                                                        <mtd></mtd>
                                                        <mtd rowalign="bottom">
                                                          <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                            <mspace width=".5ex"></mspace>
                                                            <mstyle displaystyle="false" scriptlevel="0">
                                                              <mtext>R</mtext>
                                                            </mstyle>
                                                            <mspace width=".5ex"></mspace>
                                                          </mrow>
                                                        </mtd>
                                                      </mtr>
                                                    </mtable>
                                                  </mtd>
                                                </mtr>
                                                <mtr>
                                                  <mtd>
                                                    <mrow>
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mrow data-mjx-texclass="ORD">
                                                          <mi data-latex="C">C</mi>
                                                          <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                          <mi data-latex="D">D</mi>
                                                          <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                          <mi data-latex="Q">Q</mi>
                                                        </mrow>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                              <mspace width="0em"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mtd>
                                  </mtr>
                                  <mtr>
                                    <mtd>
                                      <mrow>
                                        <mspace width=".5ex"></mspace>
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mtext>E</mtext>
                                        </mstyle>
                                        <mspace width=".5ex"></mspace>
                                      </mrow>
                                    </mtd>
                                  </mtr>
                                </mtable>
                                <mspace width="-3.795em"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mrow>
                          <mspace width=".5ex"></mspace>
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>F</mtext>
                          </mstyle>
                          <mspace width=".5ex"></mspace>
                        </mrow>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mtd>
              <mtd>
                <mspace width="3.795055555555555em"></mspace>
              </mtd>
              <mtd rowalign="bottom">
                <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                  <mspace width=".5ex"></mspace>
                  <mstyle displaystyle="false" scriptlevel="0">
                    <mtext>M</mtext>
                  </mstyle>
                  <mspace width=".5ex"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mrow data-mjx-texclass="ORD">
                <mi data-latex="N">N</mi>
                <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                <mi data-latex="R">R</mi>
              </mrow>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
  </mrow>
</math>`
    ));
  it('Simple Proofs Right Labels', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\RightLabel{Nowhere}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:right">
    <mspace width="8.227em"></mspace>
    <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\RightLabel{Nowhere}\\end{prooftree}" data-latex-item="{prooftree}">
      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
        <mtr>
          <mtd>
            <mtable framespacing="0 0">
              <mtr>
                <mtd rowalign="bottom">
                  <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                    <mspace width="-8.227em"></mspace>
                    <mrow>
                      <mspace width="3.274em"></mspace>
                      <mrow data-latex="\\RightLabel{QERE}">
                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                          <mtr>
                            <mtd>
                              <mtable framespacing="0 0">
                                <mtr>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:3">
                                      <mspace width="-3.274em"></mspace>
                                      <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\RightLabel{AAAA}" semantics="bspr_inferenceRule:down">
                                        <mtr>
                                          <mtd>
                                            <mtable framespacing="0 0">
                                              <mtr>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>D</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A1</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A2</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                          </mtd>
                                        </mtr>
                                        <mtr>
                                          <mtd>
                                            <mrow>
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>Q</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mrow>
                                  </mtd>
                                  <mtd></mtd>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                      <mrow data-latex="\\RightLabel{CCCCC}">
                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                          <mtr>
                                            <mtd>
                                              <mtable framespacing="0 0">
                                                <mtr>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>A</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                  <mtd></mtd>
                                                  <mtd rowalign="bottom">
                                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                      <mrow data-latex="\\RightLabel{BBB}">
                                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                          <mtr>
                                                            <mtd>
                                                              <mtable framespacing="0 0">
                                                                <mtr>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>B</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                  <mtd></mtd>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>R</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                </mtr>
                                                              </mtable>
                                                            </mtd>
                                                          </mtr>
                                                          <mtr>
                                                            <mtd>
                                                              <mrow>
                                                                <mspace width=".5ex"></mspace>
                                                                <mstyle displaystyle="false" scriptlevel="0">
                                                                  <mrow data-mjx-texclass="ORD">
                                                                    <mi data-latex="C">C</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="D">D</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="Q">Q</mi>
                                                                  </mrow>
                                                                </mstyle>
                                                                <mspace width=".5ex"></mspace>
                                                              </mrow>
                                                            </mtd>
                                                          </mtr>
                                                        </mtable>
                                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mtext>AAAA</mtext>
                                                          </mstyle>
                                                        </mpadded>
                                                      </mrow>
                                                      <mspace width="-3.5em"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                            </mtd>
                                          </mtr>
                                          <mtr>
                                            <mtd>
                                              <mrow>
                                                <mspace width=".5ex"></mspace>
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mtext>E</mtext>
                                                </mstyle>
                                                <mspace width=".5ex"></mspace>
                                              </mrow>
                                            </mtd>
                                          </mtr>
                                        </mtable>
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>BBB</mtext>
                                          </mstyle>
                                        </mpadded>
                                      </mrow>
                                      <mspace width="-6.419em"></mspace>
                                    </mrow>
                                  </mtd>
                                </mtr>
                              </mtable>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd>
                              <mrow>
                                <mspace width=".5ex"></mspace>
                                <mstyle displaystyle="false" scriptlevel="0">
                                  <mtext>F</mtext>
                                </mstyle>
                                <mspace width=".5ex"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>CCCCC</mtext>
                          </mstyle>
                        </mpadded>
                      </mrow>
                    </mrow>
                  </mrow>
                </mtd>
                <mtd>
                  <mspace width="2.309055555555555em"></mspace>
                </mtd>
                <mtd rowalign="bottom">
                  <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                    <mspace width=".5ex"></mspace>
                    <mstyle displaystyle="false" scriptlevel="0">
                      <mtext>M</mtext>
                    </mstyle>
                    <mspace width=".5ex"></mspace>
                  </mrow>
                </mtd>
              </mtr>
            </mtable>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mrow>
              <mspace width=".5ex"></mspace>
              <mstyle displaystyle="false" scriptlevel="0">
                <mrow data-mjx-texclass="ORD">
                  <mi data-latex="N">N</mi>
                  <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                  <mi data-latex="R">R</mi>
                </mrow>
              </mstyle>
              <mspace width=".5ex"></mspace>
            </mrow>
          </mtd>
        </mtr>
      </mtable>
      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
        <mstyle displaystyle="false" scriptlevel="0">
          <mtext>QERE</mtext>
        </mstyle>
      </mpadded>
    </mrow>
  </mrow>
</math>`
    ));
  it('Simple Proofs Left Labels', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\LeftLabel{Nowhere}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:left">
    <mspace width="7.038em"></mspace>
    <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\LeftLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\LeftLabel{QERE}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\LeftLabel{Nowhere}\\end{prooftree}" data-latex-item="{prooftree}">
      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
        <mstyle displaystyle="false" scriptlevel="0">
          <mtext>QERE</mtext>
        </mstyle>
      </mpadded>
      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
        <mtr>
          <mtd>
            <mtable framespacing="0 0">
              <mtr>
                <mtd rowalign="bottom">
                  <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                    <mspace width="-10.414em"></mspace>
                    <mrow>
                      <mspace width="-0.836em"></mspace>
                      <mrow data-latex="\\LeftLabel{QERE}">
                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>CCCCC</mtext>
                          </mstyle>
                        </mpadded>
                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                          <mtr>
                            <mtd>
                              <mtable framespacing="0 0">
                                <mtr>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:3">
                                      <mspace width="-3.274em"></mspace>
                                      <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\LeftLabel{AAAA}" semantics="bspr_inferenceRule:down">
                                        <mtr>
                                          <mtd>
                                            <mtable framespacing="0 0">
                                              <mtr>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>D</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A1</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A2</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                          </mtd>
                                        </mtr>
                                        <mtr>
                                          <mtd>
                                            <mrow>
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>Q</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mrow>
                                  </mtd>
                                  <mtd></mtd>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                                      <mrow data-latex="\\LeftLabel{CCCCC}">
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>BBB</mtext>
                                          </mstyle>
                                        </mpadded>
                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                          <mtr>
                                            <mtd>
                                              <mtable framespacing="0 0">
                                                <mtr>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>A</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                  <mtd></mtd>
                                                  <mtd rowalign="bottom">
                                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                                                      <mrow data-latex="\\LeftLabel{BBB}">
                                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mtext>AAAA</mtext>
                                                          </mstyle>
                                                        </mpadded>
                                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                          <mtr>
                                                            <mtd>
                                                              <mtable framespacing="0 0">
                                                                <mtr>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>B</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                  <mtd></mtd>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>R</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                </mtr>
                                                              </mtable>
                                                            </mtd>
                                                          </mtr>
                                                          <mtr>
                                                            <mtd>
                                                              <mrow>
                                                                <mspace width=".5ex"></mspace>
                                                                <mstyle displaystyle="false" scriptlevel="0">
                                                                  <mrow data-mjx-texclass="ORD">
                                                                    <mi data-latex="C">C</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="D">D</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="Q">Q</mi>
                                                                  </mrow>
                                                                </mstyle>
                                                                <mspace width=".5ex"></mspace>
                                                              </mrow>
                                                            </mtd>
                                                          </mtr>
                                                        </mtable>
                                                      </mrow>
                                                      <mspace width="0em"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                            </mtd>
                                          </mtr>
                                          <mtr>
                                            <mtd>
                                              <mrow>
                                                <mspace width=".5ex"></mspace>
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mtext>E</mtext>
                                                </mstyle>
                                                <mspace width=".5ex"></mspace>
                                              </mrow>
                                            </mtd>
                                          </mtr>
                                        </mtable>
                                      </mrow>
                                      <mspace width="-5.545em"></mspace>
                                    </mrow>
                                  </mtd>
                                </mtr>
                              </mtable>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd>
                              <mrow>
                                <mspace width=".5ex"></mspace>
                                <mstyle displaystyle="false" scriptlevel="0">
                                  <mtext>F</mtext>
                                </mstyle>
                                <mspace width=".5ex"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                      </mrow>
                    </mrow>
                  </mrow>
                </mtd>
                <mtd>
                  <mspace width="5.545055555555556em"></mspace>
                </mtd>
                <mtd rowalign="bottom">
                  <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                    <mspace width=".5ex"></mspace>
                    <mstyle displaystyle="false" scriptlevel="0">
                      <mtext>M</mtext>
                    </mstyle>
                    <mspace width=".5ex"></mspace>
                  </mrow>
                </mtd>
              </mtr>
            </mtable>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mrow>
              <mspace width=".5ex"></mspace>
              <mstyle displaystyle="false" scriptlevel="0">
                <mrow data-mjx-texclass="ORD">
                  <mi data-latex="N">N</mi>
                  <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                  <mi data-latex="R">R</mi>
                </mrow>
              </mstyle>
              <mspace width=".5ex"></mspace>
            </mrow>
          </mtd>
        </mtr>
      </mtable>
    </mrow>
  </mrow>
</math>`
    ));
  it('Simple Proofs Mixed Labels', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{$N \\rightarrow R$}\\LeftLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\LeftLabel{Nowhere}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:both">
    <mspace width="7.511em"></mspace>
    <mrow data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBB}\\BinaryInfC{E}\\LeftLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\LeftLabel{DD}\\AxiomC{M}\\BinaryInfC{\$N \\rightarrow R\$}\\LeftLabel{Nowhere}\\end{prooftree}" data-latex-item="{prooftree}">
      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
        <mstyle displaystyle="false" scriptlevel="0">
          <mtext>DD</mtext>
        </mstyle>
      </mpadded>
      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
        <mtr>
          <mtd>
            <mtable framespacing="0 0">
              <mtr>
                <mtd rowalign="bottom">
                  <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                    <mspace width="-9.539em"></mspace>
                    <mrow>
                      <mspace width="-0.836em"></mspace>
                      <mrow data-latex="\\LeftLabel{DD}">
                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>CCCCC</mtext>
                          </mstyle>
                        </mpadded>
                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                          <mtr>
                            <mtd>
                              <mtable framespacing="0 0">
                                <mtr>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:3">
                                      <mspace width="-3.274em"></mspace>
                                      <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\RightLabel{AAAA}" semantics="bspr_inferenceRule:down">
                                        <mtr>
                                          <mtd>
                                            <mtable framespacing="0 0">
                                              <mtr>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>D</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A1</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A2</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                          </mtd>
                                        </mtr>
                                        <mtr>
                                          <mtd>
                                            <mrow>
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>Q</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mrow>
                                  </mtd>
                                  <mtd></mtd>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:left">
                                      <mrow data-latex="\\LeftLabel{CCCCC}">
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>BBB</mtext>
                                          </mstyle>
                                        </mpadded>
                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                          <mtr>
                                            <mtd>
                                              <mtable framespacing="0 0">
                                                <mtr>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>A</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                  <mtd></mtd>
                                                  <mtd rowalign="bottom">
                                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                      <mrow data-latex="\\LeftLabel{BBB}">
                                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                          <mtr>
                                                            <mtd>
                                                              <mtable framespacing="0 0">
                                                                <mtr>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>B</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                  <mtd></mtd>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>R</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                </mtr>
                                                              </mtable>
                                                            </mtd>
                                                          </mtr>
                                                          <mtr>
                                                            <mtd>
                                                              <mrow>
                                                                <mspace width=".5ex"></mspace>
                                                                <mstyle displaystyle="false" scriptlevel="0">
                                                                  <mrow data-mjx-texclass="ORD">
                                                                    <mi data-latex="C">C</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="D">D</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="Q">Q</mi>
                                                                  </mrow>
                                                                </mstyle>
                                                                <mspace width=".5ex"></mspace>
                                                              </mrow>
                                                            </mtd>
                                                          </mtr>
                                                        </mtable>
                                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mtext>AAAA</mtext>
                                                          </mstyle>
                                                        </mpadded>
                                                      </mrow>
                                                      <mspace width="-3.5em"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                            </mtd>
                                          </mtr>
                                          <mtr>
                                            <mtd>
                                              <mrow>
                                                <mspace width=".5ex"></mspace>
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mtext>E</mtext>
                                                </mstyle>
                                                <mspace width=".5ex"></mspace>
                                              </mrow>
                                            </mtd>
                                          </mtr>
                                        </mtable>
                                      </mrow>
                                      <mspace width="-3.795em"></mspace>
                                    </mrow>
                                  </mtd>
                                </mtr>
                              </mtable>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd>
                              <mrow>
                                <mspace width=".5ex"></mspace>
                                <mstyle displaystyle="false" scriptlevel="0">
                                  <mtext>F</mtext>
                                </mstyle>
                                <mspace width=".5ex"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                      </mrow>
                    </mrow>
                  </mrow>
                </mtd>
                <mtd>
                  <mspace width="3.795055555555555em"></mspace>
                </mtd>
                <mtd rowalign="bottom">
                  <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                    <mspace width=".5ex"></mspace>
                    <mstyle displaystyle="false" scriptlevel="0">
                      <mtext>M</mtext>
                    </mstyle>
                    <mspace width=".5ex"></mspace>
                  </mrow>
                </mtd>
              </mtr>
            </mtable>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mrow>
              <mspace width=".5ex"></mspace>
              <mstyle displaystyle="false" scriptlevel="0">
                <mrow data-mjx-texclass="ORD">
                  <mi data-latex="N">N</mi>
                  <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                  <mi data-latex="R">R</mi>
                </mrow>
              </mstyle>
              <mspace width=".5ex"></mspace>
            </mrow>
          </mtd>
        </mtr>
      </mtable>
      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
        <mstyle displaystyle="false" scriptlevel="0">
          <mtext>QERE</mtext>
        </mstyle>
      </mpadded>
    </mrow>
  </mrow>
</math>`
    ));
  it('Proof Very Right Label', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{$N \\rightarrow R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{\$N \\rightarrow R\$}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true">
    <mspace width="9.977em"></mspace>
    <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\begin{prooftree}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\RightLabel{AAAA}\\TrinaryInfC{Q}\\RightLabel{Nowhere}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\RightLabel{BBB}\\BinaryInfC{E}\\RightLabel{CCCCC}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\UnaryInfC{More and more}\\BinaryInfC{\$N \\rightarrow R\$}\\end{prooftree}" data-latex-item="{prooftree}" semantics="bspr_inferenceRule:down">
      <mtr>
        <mtd>
          <mtable framespacing="0 0">
            <mtr>
              <mtd rowalign="bottom">
                <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                  <mspace width="-9.977em"></mspace>
                  <mrow>
                    <mspace width="3.274em"></mspace>
                    <mrow data-latex="\\RightLabel{QERE}">
                      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                        <mtr>
                          <mtd>
                            <mtable framespacing="0 0">
                              <mtr>
                                <mtd rowalign="bottom">
                                  <mrow semantics="bspr_inference:3;bspr_labelledRule:right">
                                    <mspace width="-3.274em"></mspace>
                                    <mrow data-latex="\\RightLabel{Nowhere}">
                                      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                        <mtr>
                                          <mtd>
                                            <mtable framespacing="0 0">
                                              <mtr>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>D</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A1</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\RightLabel{AAAA}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A2</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                          </mtd>
                                        </mtr>
                                        <mtr>
                                          <mtd>
                                            <mrow>
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>Q</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mtext>AAAA</mtext>
                                        </mstyle>
                                      </mpadded>
                                    </mrow>
                                  </mrow>
                                </mtd>
                                <mtd></mtd>
                                <mtd rowalign="bottom">
                                  <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                    <mrow data-latex="\\RightLabel{CCCCC}">
                                      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                        <mtr>
                                          <mtd>
                                            <mtable framespacing="0 0">
                                              <mtr>
                                                <mtd rowalign="bottom">
                                                  <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mtext>A</mtext>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                                <mtd></mtd>
                                                <mtd rowalign="bottom">
                                                  <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                    <mrow data-latex="\\RightLabel{BBB}">
                                                      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                        <mtr>
                                                          <mtd>
                                                            <mtable framespacing="0 0">
                                                              <mtr>
                                                                <mtd rowalign="bottom">
                                                                  <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                    <mspace width=".5ex"></mspace>
                                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                                      <mtext>B</mtext>
                                                                    </mstyle>
                                                                    <mspace width=".5ex"></mspace>
                                                                  </mrow>
                                                                </mtd>
                                                                <mtd></mtd>
                                                                <mtd rowalign="bottom">
                                                                  <mrow data-latex="\\AxiomC{R}" semantics="bspr_axiom:true">
                                                                    <mspace width=".5ex"></mspace>
                                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                                      <mtext>R</mtext>
                                                                    </mstyle>
                                                                    <mspace width=".5ex"></mspace>
                                                                  </mrow>
                                                                </mtd>
                                                              </mtr>
                                                            </mtable>
                                                          </mtd>
                                                        </mtr>
                                                        <mtr>
                                                          <mtd>
                                                            <mrow>
                                                              <mspace width=".5ex"></mspace>
                                                              <mstyle displaystyle="false" scriptlevel="0">
                                                                <mrow data-mjx-texclass="ORD">
                                                                  <mi data-latex="C">C</mi>
                                                                  <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                  <mi data-latex="D">D</mi>
                                                                  <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                  <mi data-latex="Q">Q</mi>
                                                                </mrow>
                                                              </mstyle>
                                                              <mspace width=".5ex"></mspace>
                                                            </mrow>
                                                          </mtd>
                                                        </mtr>
                                                      </mtable>
                                                      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                        <mstyle displaystyle="false" scriptlevel="0">
                                                          <mtext>Nowhere</mtext>
                                                        </mstyle>
                                                      </mpadded>
                                                    </mrow>
                                                    <mspace width="-4.308em"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                          </mtd>
                                        </mtr>
                                        <mtr>
                                          <mtd>
                                            <mrow>
                                              <mspace width=".5ex"></mspace>
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>E</mtext>
                                              </mstyle>
                                              <mspace width=".5ex"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mtext>BBB</mtext>
                                        </mstyle>
                                      </mpadded>
                                    </mrow>
                                    <mspace width="-6.419em"></mspace>
                                  </mrow>
                                </mtd>
                              </mtr>
                            </mtable>
                          </mtd>
                        </mtr>
                        <mtr>
                          <mtd>
                            <mrow>
                              <mspace width=".5ex"></mspace>
                              <mstyle displaystyle="false" scriptlevel="0">
                                <mtext>F</mtext>
                              </mstyle>
                              <mspace width=".5ex"></mspace>
                            </mrow>
                          </mtd>
                        </mtr>
                      </mtable>
                      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                        <mstyle displaystyle="false" scriptlevel="0">
                          <mtext>CCCCC</mtext>
                        </mstyle>
                      </mpadded>
                    </mrow>
                  </mrow>
                </mrow>
              </mtd>
              <mtd>
                <mspace width="2.309055555555555em"></mspace>
              </mtd>
              <mtd rowalign="bottom">
                <mrow semantics="bspr_inference:1">
                  <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\UnaryInfC{More and more}" semantics="bspr_inferenceRule:down">
                    <mtr>
                      <mtd>
                        <mtable framespacing="0 0">
                          <mtr>
                            <mtd rowalign="bottom">
                              <mrow semantics="bspr_inference:1">
                                <mtable align="top 2" rowlines="solid" framespacing="0 0" data-latex="\\UnaryInfC{More and more}" semantics="bspr_inferenceRule:down">
                                  <mtr>
                                    <mtd>
                                      <mtable framespacing="0 0">
                                        <mtr>
                                          <mtd rowalign="bottom">
                                            <mrow semantics="bspr_inference:1;bspr_labelledRule:right">
                                              <mrow data-latex="\\UnaryInfC{More and more}">
                                                <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                  <mtr>
                                                    <mtd>
                                                      <mtable framespacing="0 0">
                                                        <mtr>
                                                          <mtd rowalign="bottom">
                                                            <mrow data-latex="\\AxiomC{M}" semantics="bspr_axiom:true">
                                                              <mspace width=".5ex"></mspace>
                                                              <mstyle displaystyle="false" scriptlevel="0">
                                                                <mtext>M</mtext>
                                                              </mstyle>
                                                              <mspace width=".5ex"></mspace>
                                                            </mrow>
                                                          </mtd>
                                                        </mtr>
                                                      </mtable>
                                                    </mtd>
                                                  </mtr>
                                                  <mtr>
                                                    <mtd>
                                                      <mrow>
                                                        <mspace width=".5ex"></mspace>
                                                        <mstyle displaystyle="false" scriptlevel="0">
                                                          <mtext>More and more</mtext>
                                                        </mstyle>
                                                        <mspace width=".5ex"></mspace>
                                                      </mrow>
                                                    </mtd>
                                                  </mtr>
                                                </mtable>
                                                <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                  <mstyle displaystyle="false" scriptlevel="0">
                                                    <mtext>QERE</mtext>
                                                  </mstyle>
                                                </mpadded>
                                              </mrow>
                                              <mspace width="-3.376em"></mspace>
                                            </mrow>
                                          </mtd>
                                        </mtr>
                                      </mtable>
                                    </mtd>
                                  </mtr>
                                  <mtr>
                                    <mtd>
                                      <mrow>
                                        <mspace width=".5ex"></mspace>
                                        <mstyle displaystyle="false" scriptlevel="0">
                                          <mtext>More and more</mtext>
                                        </mstyle>
                                        <mspace width=".5ex"></mspace>
                                      </mrow>
                                    </mtd>
                                  </mtr>
                                </mtable>
                                <mspace width="0em"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mrow>
                          <mspace width=".5ex"></mspace>
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>More and more</mtext>
                          </mstyle>
                          <mspace width=".5ex"></mspace>
                        </mrow>
                      </mtd>
                    </mtr>
                  </mtable>
                  <mspace width="0em"></mspace>
                </mrow>
              </mtd>
            </mtr>
          </mtable>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mspace width=".5ex"></mspace>
            <mstyle displaystyle="false" scriptlevel="0">
              <mrow data-mjx-texclass="ORD">
                <mi data-latex="N">N</mi>
                <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                <mi data-latex="R">R</mi>
              </mrow>
            </mstyle>
            <mspace width=".5ex"></mspace>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <mspace width="0em"></mspace>
  </mrow>
</math>`
    ));
  it('Proof Complex', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\AXC{}\\RL{\$Hyp^{1}\$}\\UIC{\$P\$}\\AXC{\$P\\rightarrow Q\$}\\RL{\$\\rightarrow_E\$}\\solidLine\\BIC{\$Q^2\$}\\AXC{\$Q\\rightarrow R\$} \\RL{\$\\rightarrow_E\$} \\BIC{\$R\$} \\AXC{\$Q\$}\\RL{Rit\$^2\$} \\UIC{\$Q\$}\\RL{\$\\wedge_I\$}\\BIC{\$Q\\wedge R\$}\\RL{\${\\rightarrow_I}^1\$}\\UIC{\$P\\rightarrow Q\\wedge R\$}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:1;bspr_proof:true;bspr_labelledRule:right">
    <mrow>
      <mspace width="13.852em"></mspace>
      <mrow data-latex="\\begin{prooftree}\\AXC{}\\RL{\$Hyp^{1}\$}\\UIC{\$P\$}\\AXC{\$P\\rightarrow Q\$}\\RL{\$\\rightarrow_E\$}\\solidLine\\BIC{\$Q^2\$}\\AXC{\$Q\\rightarrow R\$} \\RL{\$\\rightarrow_E\$} \\BIC{\$R\$} \\AXC{\$Q\$}\\RL{Rit\$^2\$} \\UIC{\$Q\$}\\RL{\$\\wedge_I\$}\\BIC{\$Q\\wedge R\$}\\RL{\${\\rightarrow_I}^1\$}\\UIC{\$P\\rightarrow Q\\wedge R\$}\\end{prooftree}" data-latex-item="{prooftree}">
        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
          <mtr>
            <mtd>
              <mtable framespacing="0 0">
                <mtr>
                  <mtd rowalign="bottom">
                    <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                      <mrow>
                        <mspace width="-13.852em"></mspace>
                        <mrow>
                          <mspace width="9.465em"></mspace>
                          <mrow data-latex="\\RL{\${\\rightarrow_I}^1\$}">
                            <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                              <mtr>
                                <mtd>
                                  <mtable framespacing="0 0">
                                    <mtr>
                                      <mtd rowalign="bottom">
                                        <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                          <mspace width="-9.465em"></mspace>
                                          <mrow>
                                            <mspace width="3.734em"></mspace>
                                            <mrow data-latex="\\BIC{\$R\$}">
                                              <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                <mtr>
                                                  <mtd>
                                                    <mtable framespacing="0 0">
                                                      <mtr>
                                                        <mtd rowalign="bottom">
                                                          <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                            <mspace width="-3.734em"></mspace>
                                                            <mrow data-latex="\\BIC{\$Q^2\$}">
                                                              <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                <mtr>
                                                                  <mtd>
                                                                    <mtable framespacing="0 0">
                                                                      <mtr>
                                                                        <mtd rowalign="bottom">
                                                                          <mrow data-latex="\\UIC{\$P\$}" semantics="bspr_labelledRule:right;bspr_inference:0">
                                                                            <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                                              <mtr>
                                                                                <mtd>
                                                                                  <mtable framespacing="0 0">
                                                                                    <mtr>
                                                                                      <mtd rowalign="bottom">
                                                                                        <mrow data-latex="\\RL{\$Hyp^{1}\$}" semantics="bspr_axiom:true"></mrow>
                                                                                      </mtd>
                                                                                    </mtr>
                                                                                  </mtable>
                                                                                </mtd>
                                                                              </mtr>
                                                                              <mtr>
                                                                                <mtd>
                                                                                  <mrow>
                                                                                    <mspace width=".5ex"></mspace>
                                                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                                                      <mrow data-mjx-texclass="ORD">
                                                                                        <mi data-latex="P">P</mi>
                                                                                      </mrow>
                                                                                    </mstyle>
                                                                                    <mspace width=".5ex"></mspace>
                                                                                  </mrow>
                                                                                </mtd>
                                                                              </mtr>
                                                                            </mtable>
                                                                            <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                                              <mstyle displaystyle="false" scriptlevel="0">
                                                                                <mrow data-mjx-texclass="ORD">
                                                                                  <mi data-latex="H">H</mi>
                                                                                  <mi data-latex="y">y</mi>
                                                                                  <msup data-latex="p^{1}">
                                                                                    <mi data-latex="p">p</mi>
                                                                                    <mrow data-mjx-texclass="ORD" data-latex="{1}">
                                                                                      <mn data-latex="1">1</mn>
                                                                                    </mrow>
                                                                                  </msup>
                                                                                </mrow>
                                                                              </mstyle>
                                                                            </mpadded>
                                                                          </mrow>
                                                                        </mtd>
                                                                        <mtd></mtd>
                                                                        <mtd rowalign="bottom">
                                                                          <mrow data-latex="\\solidLine" semantics="bspr_axiom:true">
                                                                            <mspace width=".5ex"></mspace>
                                                                            <mstyle displaystyle="false" scriptlevel="0">
                                                                              <mrow data-mjx-texclass="ORD">
                                                                                <mi data-latex="P">P</mi>
                                                                                <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                                <mi data-latex="Q">Q</mi>
                                                                              </mrow>
                                                                            </mstyle>
                                                                            <mspace width=".5ex"></mspace>
                                                                          </mrow>
                                                                        </mtd>
                                                                      </mtr>
                                                                    </mtable>
                                                                  </mtd>
                                                                </mtr>
                                                                <mtr>
                                                                  <mtd>
                                                                    <mrow>
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mrow data-mjx-texclass="ORD">
                                                                          <msup data-latex="Q^2 ">
                                                                            <mi data-latex="Q">Q</mi>
                                                                            <mn data-latex="2">2</mn>
                                                                          </msup>
                                                                        </mrow>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                </mtr>
                                                              </mtable>
                                                              <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                                <mstyle displaystyle="false" scriptlevel="0">
                                                                  <mrow data-mjx-texclass="ORD">
                                                                    <msub data-latex="\\rightarrow_E">
                                                                      <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                      <mi data-latex="E">E</mi>
                                                                    </msub>
                                                                  </mrow>
                                                                </mstyle>
                                                              </mpadded>
                                                            </mrow>
                                                          </mrow>
                                                        </mtd>
                                                        <mtd></mtd>
                                                        <mtd rowalign="bottom">
                                                          <mrow data-latex="\\RL{\$\\rightarrow_E\$}" semantics="bspr_axiom:true">
                                                            <mspace width=".5ex"></mspace>
                                                            <mstyle displaystyle="false" scriptlevel="0">
                                                              <mrow data-mjx-texclass="ORD">
                                                                <mi data-latex="Q">Q</mi>
                                                                <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                <mi data-latex="R">R</mi>
                                                              </mrow>
                                                            </mstyle>
                                                            <mspace width=".5ex"></mspace>
                                                          </mrow>
                                                        </mtd>
                                                      </mtr>
                                                    </mtable>
                                                  </mtd>
                                                </mtr>
                                                <mtr>
                                                  <mtd>
                                                    <mrow>
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mrow data-mjx-texclass="ORD">
                                                          <mi data-latex="R">R</mi>
                                                        </mrow>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                              <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mrow data-mjx-texclass="ORD">
                                                    <msub data-latex="\\rightarrow_E">
                                                      <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                      <mi data-latex="E">E</mi>
                                                    </msub>
                                                  </mrow>
                                                </mstyle>
                                              </mpadded>
                                            </mrow>
                                          </mrow>
                                        </mrow>
                                      </mtd>
                                      <mtd></mtd>
                                      <mtd rowalign="bottom">
                                        <mrow semantics="bspr_inference:1;bspr_labelledRule:right">
                                          <mrow data-latex="\\RL{\$\\wedge_I\$}">
                                            <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                              <mtr>
                                                <mtd>
                                                  <mtable framespacing="0 0">
                                                    <mtr>
                                                      <mtd rowalign="bottom">
                                                        <mrow data-latex="\\RL{Rit\$^2\$}" semantics="bspr_axiom:true">
                                                          <mspace width=".5ex"></mspace>
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mrow data-mjx-texclass="ORD">
                                                              <mi data-latex="Q">Q</mi>
                                                            </mrow>
                                                          </mstyle>
                                                          <mspace width=".5ex"></mspace>
                                                        </mrow>
                                                      </mtd>
                                                    </mtr>
                                                  </mtable>
                                                </mtd>
                                              </mtr>
                                              <mtr>
                                                <mtd>
                                                  <mrow>
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mrow data-mjx-texclass="ORD">
                                                        <mi data-latex="Q">Q</mi>
                                                      </mrow>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                            <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>Rit</mtext>
                                                <mrow data-mjx-texclass="ORD">
                                                  <msup data-latex="^2 ">
                                                    <mi></mi>
                                                    <mn data-latex="2">2</mn>
                                                  </msup>
                                                </mrow>
                                              </mstyle>
                                            </mpadded>
                                          </mrow>
                                          <mspace width="-2.34em"></mspace>
                                        </mrow>
                                      </mtd>
                                    </mtr>
                                  </mtable>
                                </mtd>
                              </mtr>
                              <mtr>
                                <mtd>
                                  <mrow>
                                    <mspace width=".5ex"></mspace>
                                    <mstyle displaystyle="false" scriptlevel="0">
                                      <mrow data-mjx-texclass="ORD">
                                        <mi data-latex="Q">Q</mi>
                                        <mo data-latex="\\wedge">&#x2227;</mo>
                                        <mi data-latex="R">R</mi>
                                      </mrow>
                                    </mstyle>
                                    <mspace width=".5ex"></mspace>
                                  </mrow>
                                </mtd>
                              </mtr>
                            </mtable>
                            <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                              <mstyle displaystyle="false" scriptlevel="0">
                                <mrow data-mjx-texclass="ORD">
                                  <msub data-latex="\\wedge_I">
                                    <mo data-latex="\\wedge">&#x2227;</mo>
                                    <mi data-latex="I">I</mi>
                                  </msub>
                                </mrow>
                              </mstyle>
                            </mpadded>
                          </mrow>
                        </mrow>
                      </mrow>
                      <mspace width="-5.989em"></mspace>
                    </mrow>
                  </mtd>
                </mtr>
              </mtable>
            </mtd>
          </mtr>
          <mtr>
            <mtd>
              <mrow>
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mrow data-mjx-texclass="ORD">
                    <mi data-latex="P">P</mi>
                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                    <mi data-latex="Q">Q</mi>
                    <mo data-latex="\\wedge">&#x2227;</mo>
                    <mi data-latex="R">R</mi>
                  </mrow>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
          <mstyle displaystyle="false" scriptlevel="0">
            <mrow data-mjx-texclass="ORD">
              <msup data-latex="{\\rightarrow_I}^1 ">
                <mrow data-mjx-texclass="ORD" data-latex="{\\rightarrow_I}">
                  <msub data-latex="\\rightarrow_I">
                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                    <mi data-latex="I">I</mi>
                  </msub>
                </mrow>
                <mn data-latex="1">1</mn>
              </msup>
            </mrow>
          </mstyle>
        </mpadded>
      </mrow>
    </mrow>
    <mspace width="3.618em"></mspace>
  </mrow>
</math>`
    ));
  it('Proof Mixing Order', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{$Hyp^{1}$}\\UIC{$P$}\\AXC{$P\\rightarrow Q$}\\RL{$\\rightarrow_E$}\\solidLine\\BIC{$Q^2$}\\alwaysRootAtBottom\\AXC{$Q\\rightarrow R$} \\RL{$\\rightarrow_E$} \\BIC{$R$} \\AXC{$Q$}\\RL{Rit$^2$} \\UIC{$Q$}\\RL{$\\wedge_I$}\\BIC{$Q\\wedge R$}\\RL{${\\rightarrow_I}^1$}\\UIC{$P\\rightarrow Q\\wedge R$}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{\$Hyp^{1}\$}\\UIC{\$P\$}\\AXC{\$P\\rightarrow Q\$}\\RL{\$\\rightarrow_E\$}\\solidLine\\BIC{\$Q^2\$}\\alwaysRootAtBottom\\AXC{\$Q\\rightarrow R\$} \\RL{\$\\rightarrow_E\$} \\BIC{\$R\$} \\AXC{\$Q\$}\\RL{Rit\$^2\$} \\UIC{\$Q\$}\\RL{\$\\wedge_I\$}\\BIC{\$Q\\wedge R\$}\\RL{\${\\rightarrow_I}^1\$}\\UIC{\$P\\rightarrow Q\\wedge R\$}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:1;bspr_proof:true;bspr_labelledRule:right">
    <mrow>
      <mspace width="13.852em"></mspace>
      <mrow data-latex="\\begin{prooftree}\\alwaysRootAtTop\\AXC{}\\RL{\$Hyp^{1}\$}\\UIC{\$P\$}\\AXC{\$P\\rightarrow Q\$}\\RL{\$\\rightarrow_E\$}\\solidLine\\BIC{\$Q^2\$}\\alwaysRootAtBottom\\AXC{\$Q\\rightarrow R\$} \\RL{\$\\rightarrow_E\$} \\BIC{\$R\$} \\AXC{\$Q\$}\\RL{Rit\$^2\$} \\UIC{\$Q\$}\\RL{\$\\wedge_I\$}\\BIC{\$Q\\wedge R\$}\\RL{\${\\rightarrow_I}^1\$}\\UIC{\$P\\rightarrow Q\\wedge R\$}\\end{prooftree}" data-latex-item="{prooftree}">
        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
          <mtr>
            <mtd>
              <mtable framespacing="0 0">
                <mtr>
                  <mtd rowalign="bottom">
                    <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                      <mrow>
                        <mspace width="-13.852em"></mspace>
                        <mrow>
                          <mspace width="9.465em"></mspace>
                          <mrow data-latex="\\RL{\${\\rightarrow_I}^1\$}">
                            <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                              <mtr>
                                <mtd>
                                  <mtable framespacing="0 0">
                                    <mtr>
                                      <mtd rowalign="bottom">
                                        <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                          <mspace width="-9.465em"></mspace>
                                          <mrow>
                                            <mspace width="3.734em"></mspace>
                                            <mrow data-latex="\\BIC{\$R\$}">
                                              <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                <mtr>
                                                  <mtd>
                                                    <mtable framespacing="0 0">
                                                      <mtr>
                                                        <mtd rowalign="bottom">
                                                          <mrow semantics="bspr_inference:2;bspr_labelledRule:right">
                                                            <mspace width="-3.734em"></mspace>
                                                            <mrow data-latex="\\alwaysRootAtBottom">
                                                              <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:up">
                                                                <mtr>
                                                                  <mtd>
                                                                    <mrow>
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mrow data-mjx-texclass="ORD">
                                                                          <msup data-latex="Q^2 ">
                                                                            <mi data-latex="Q">Q</mi>
                                                                            <mn data-latex="2">2</mn>
                                                                          </msup>
                                                                        </mrow>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                </mtr>
                                                                <mtr>
                                                                  <mtd>
                                                                    <mtable framespacing="0 0">
                                                                      <mtr>
                                                                        <mtd rowalign="top">
                                                                          <mrow data-latex="\\UIC{\$P\$}" semantics="bspr_labelledRule:right;bspr_inference:0">
                                                                            <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:up">
                                                                              <mtr>
                                                                                <mtd>
                                                                                  <mrow>
                                                                                    <mspace width=".5ex"></mspace>
                                                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                                                      <mrow data-mjx-texclass="ORD">
                                                                                        <mi data-latex="P">P</mi>
                                                                                      </mrow>
                                                                                    </mstyle>
                                                                                    <mspace width=".5ex"></mspace>
                                                                                  </mrow>
                                                                                </mtd>
                                                                              </mtr>
                                                                              <mtr>
                                                                                <mtd>
                                                                                  <mtable framespacing="0 0">
                                                                                    <mtr>
                                                                                      <mtd rowalign="top">
                                                                                        <mrow data-latex="\\RL{\$Hyp^{1}\$}" semantics="bspr_axiom:true"></mrow>
                                                                                      </mtd>
                                                                                    </mtr>
                                                                                  </mtable>
                                                                                </mtd>
                                                                              </mtr>
                                                                            </mtable>
                                                                            <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                                              <mstyle displaystyle="false" scriptlevel="0">
                                                                                <mrow data-mjx-texclass="ORD">
                                                                                  <mi data-latex="H">H</mi>
                                                                                  <mi data-latex="y">y</mi>
                                                                                  <msup data-latex="p^{1}">
                                                                                    <mi data-latex="p">p</mi>
                                                                                    <mrow data-mjx-texclass="ORD" data-latex="{1}">
                                                                                      <mn data-latex="1">1</mn>
                                                                                    </mrow>
                                                                                  </msup>
                                                                                </mrow>
                                                                              </mstyle>
                                                                            </mpadded>
                                                                          </mrow>
                                                                        </mtd>
                                                                        <mtd></mtd>
                                                                        <mtd rowalign="top">
                                                                          <mrow data-latex="\\solidLine" semantics="bspr_axiom:true">
                                                                            <mspace width=".5ex"></mspace>
                                                                            <mstyle displaystyle="false" scriptlevel="0">
                                                                              <mrow data-mjx-texclass="ORD">
                                                                                <mi data-latex="P">P</mi>
                                                                                <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                                <mi data-latex="Q">Q</mi>
                                                                              </mrow>
                                                                            </mstyle>
                                                                            <mspace width=".5ex"></mspace>
                                                                          </mrow>
                                                                        </mtd>
                                                                      </mtr>
                                                                    </mtable>
                                                                  </mtd>
                                                                </mtr>
                                                              </mtable>
                                                              <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                                <mstyle displaystyle="false" scriptlevel="0">
                                                                  <mrow data-mjx-texclass="ORD">
                                                                    <msub data-latex="\\rightarrow_E">
                                                                      <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                      <mi data-latex="E">E</mi>
                                                                    </msub>
                                                                  </mrow>
                                                                </mstyle>
                                                              </mpadded>
                                                            </mrow>
                                                          </mrow>
                                                        </mtd>
                                                        <mtd></mtd>
                                                        <mtd rowalign="bottom">
                                                          <mrow data-latex="\\RL{\$\\rightarrow_E\$}" semantics="bspr_axiom:true">
                                                            <mspace width=".5ex"></mspace>
                                                            <mstyle displaystyle="false" scriptlevel="0">
                                                              <mrow data-mjx-texclass="ORD">
                                                                <mi data-latex="Q">Q</mi>
                                                                <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                <mi data-latex="R">R</mi>
                                                              </mrow>
                                                            </mstyle>
                                                            <mspace width=".5ex"></mspace>
                                                          </mrow>
                                                        </mtd>
                                                      </mtr>
                                                    </mtable>
                                                  </mtd>
                                                </mtr>
                                                <mtr>
                                                  <mtd>
                                                    <mrow>
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mrow data-mjx-texclass="ORD">
                                                          <mi data-latex="R">R</mi>
                                                        </mrow>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                              <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mrow data-mjx-texclass="ORD">
                                                    <msub data-latex="\\rightarrow_E">
                                                      <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                      <mi data-latex="E">E</mi>
                                                    </msub>
                                                  </mrow>
                                                </mstyle>
                                              </mpadded>
                                            </mrow>
                                          </mrow>
                                        </mrow>
                                      </mtd>
                                      <mtd></mtd>
                                      <mtd rowalign="bottom">
                                        <mrow semantics="bspr_inference:1;bspr_labelledRule:right">
                                          <mrow data-latex="\\RL{\$\\wedge_I\$}">
                                            <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                              <mtr>
                                                <mtd>
                                                  <mtable framespacing="0 0">
                                                    <mtr>
                                                      <mtd rowalign="bottom">
                                                        <mrow data-latex="\\RL{Rit\$^2\$}" semantics="bspr_axiom:true">
                                                          <mspace width=".5ex"></mspace>
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mrow data-mjx-texclass="ORD">
                                                              <mi data-latex="Q">Q</mi>
                                                            </mrow>
                                                          </mstyle>
                                                          <mspace width=".5ex"></mspace>
                                                        </mrow>
                                                      </mtd>
                                                    </mtr>
                                                  </mtable>
                                                </mtd>
                                              </mtr>
                                              <mtr>
                                                <mtd>
                                                  <mrow>
                                                    <mspace width=".5ex"></mspace>
                                                    <mstyle displaystyle="false" scriptlevel="0">
                                                      <mrow data-mjx-texclass="ORD">
                                                        <mi data-latex="Q">Q</mi>
                                                      </mrow>
                                                    </mstyle>
                                                    <mspace width=".5ex"></mspace>
                                                  </mrow>
                                                </mtd>
                                              </mtr>
                                            </mtable>
                                            <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                              <mstyle displaystyle="false" scriptlevel="0">
                                                <mtext>Rit</mtext>
                                                <mrow data-mjx-texclass="ORD">
                                                  <msup data-latex="^2 ">
                                                    <mi></mi>
                                                    <mn data-latex="2">2</mn>
                                                  </msup>
                                                </mrow>
                                              </mstyle>
                                            </mpadded>
                                          </mrow>
                                          <mspace width="-2.34em"></mspace>
                                        </mrow>
                                      </mtd>
                                    </mtr>
                                  </mtable>
                                </mtd>
                              </mtr>
                              <mtr>
                                <mtd>
                                  <mrow>
                                    <mspace width=".5ex"></mspace>
                                    <mstyle displaystyle="false" scriptlevel="0">
                                      <mrow data-mjx-texclass="ORD">
                                        <mi data-latex="Q">Q</mi>
                                        <mo data-latex="\\wedge">&#x2227;</mo>
                                        <mi data-latex="R">R</mi>
                                      </mrow>
                                    </mstyle>
                                    <mspace width=".5ex"></mspace>
                                  </mrow>
                                </mtd>
                              </mtr>
                            </mtable>
                            <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                              <mstyle displaystyle="false" scriptlevel="0">
                                <mrow data-mjx-texclass="ORD">
                                  <msub data-latex="\\wedge_I">
                                    <mo data-latex="\\wedge">&#x2227;</mo>
                                    <mi data-latex="I">I</mi>
                                  </msub>
                                </mrow>
                              </mstyle>
                            </mpadded>
                          </mrow>
                        </mrow>
                      </mrow>
                      <mspace width="-5.989em"></mspace>
                    </mrow>
                  </mtd>
                </mtr>
              </mtable>
            </mtd>
          </mtr>
          <mtr>
            <mtd>
              <mrow>
                <mspace width=".5ex"></mspace>
                <mstyle displaystyle="false" scriptlevel="0">
                  <mrow data-mjx-texclass="ORD">
                    <mi data-latex="P">P</mi>
                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                    <mi data-latex="Q">Q</mi>
                    <mo data-latex="\\wedge">&#x2227;</mo>
                    <mi data-latex="R">R</mi>
                  </mrow>
                </mstyle>
                <mspace width=".5ex"></mspace>
              </mrow>
            </mtd>
          </mtr>
        </mtable>
        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
          <mstyle displaystyle="false" scriptlevel="0">
            <mrow data-mjx-texclass="ORD">
              <msup data-latex="{\\rightarrow_I}^1 ">
                <mrow data-mjx-texclass="ORD" data-latex="{\\rightarrow_I}">
                  <msub data-latex="\\rightarrow_I">
                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                    <mi data-latex="I">I</mi>
                  </msub>
                </mrow>
                <mn data-latex="1">1</mn>
              </msup>
            </mrow>
          </mstyle>
        </mpadded>
      </mrow>
    </mrow>
    <mspace width="3.618em"></mspace>
  </mrow>
</math>`
    ));
  it('Extreme', () =>
    toXmlMatch(
      tex2mml(
        '\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{$C \\rightarrow D \\rightarrow Q$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{$N \\rightarrow R$}\\RightLabel{Nowhere}\\end{prooftree}'
      ),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{\$N \\rightarrow R\$}\\RightLabel{Nowhere}\\end{prooftree}" display="block">
  <mrow semantics="bspr_inference:2;bspr_proof:true;bspr_labelledRule:both">
    <mspace width="16.672em"></mspace>
    <mrow data-latex="\\begin{prooftree}\\LL{HHHHH}\\RL{11111111111111111}\\AxiomC{D}\\AxiomC{A1}\\AxiomC{A2}\\TrinaryInfC{Q}\\RightLabel{AAAA}\\AxiomC{A}\\AxiomC{B}\\AxiomC{R}\\LL{qqqq}\\BinaryInfC{\$C \\rightarrow D \\rightarrow Q\$}\\LeftLabel{BBBB}\\RightLabel{MMM}\\BinaryInfC{E}\\RightLabel{CCCCC}\\LL{WWW}\\BinaryInfC{F}\\RightLabel{QERE}\\AxiomC{M}\\LL{BBB}\\BinaryInfC{\$N \\rightarrow R\$}\\RightLabel{Nowhere}\\end{prooftree}" data-latex-item="{prooftree}">
      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
        <mstyle displaystyle="false" scriptlevel="0">
          <mtext>BBB</mtext>
        </mstyle>
      </mpadded>
      <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
        <mtr>
          <mtd>
            <mtable framespacing="0 0">
              <mtr>
                <mtd rowalign="bottom">
                  <mrow semantics="bspr_inference:2;bspr_labelledRule:both">
                    <mspace width="-19.296em"></mspace>
                    <mrow>
                      <mspace width="3.94em"></mspace>
                      <mrow data-latex="\\RightLabel{QERE}">
                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>WWW</mtext>
                          </mstyle>
                        </mpadded>
                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                          <mtr>
                            <mtd>
                              <mtable framespacing="0 0">
                                <mtr>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:3;bspr_labelledRule:both">
                                      <mspace width="-7.524em"></mspace>
                                      <mrow data-latex="\\RightLabel{AAAA}">
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>HHHHH</mtext>
                                          </mstyle>
                                        </mpadded>
                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                          <mtr>
                                            <mtd>
                                              <mtable framespacing="0 0">
                                                <mtr>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{D}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>D</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                  <mtd></mtd>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{A1}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>A1</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                  <mtd></mtd>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{A2}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>A2</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                            </mtd>
                                          </mtr>
                                          <mtr>
                                            <mtd>
                                              <mrow>
                                                <mspace width=".5ex"></mspace>
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mtext>Q</mtext>
                                                </mstyle>
                                                <mspace width=".5ex"></mspace>
                                              </mrow>
                                            </mtd>
                                          </mtr>
                                        </mtable>
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>11111111111111111</mtext>
                                          </mstyle>
                                        </mpadded>
                                      </mrow>
                                    </mrow>
                                  </mtd>
                                  <mtd></mtd>
                                  <mtd rowalign="bottom">
                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:both">
                                      <mrow data-latex="\\LL{WWW}">
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>BBBB</mtext>
                                          </mstyle>
                                        </mpadded>
                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                          <mtr>
                                            <mtd>
                                              <mtable framespacing="0 0">
                                                <mtr>
                                                  <mtd rowalign="bottom">
                                                    <mrow data-latex="\\AxiomC{A}" semantics="bspr_axiom:true">
                                                      <mspace width=".5ex"></mspace>
                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                        <mtext>A</mtext>
                                                      </mstyle>
                                                      <mspace width=".5ex"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                  <mtd></mtd>
                                                  <mtd rowalign="bottom">
                                                    <mrow semantics="bspr_inference:2;bspr_labelledRule:both">
                                                      <mrow data-latex="\\RightLabel{MMM}">
                                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:left">
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mtext>qqqq</mtext>
                                                          </mstyle>
                                                        </mpadded>
                                                        <mtable align="top 2" rowlines="solid" framespacing="0 0" semantics="bspr_inferenceRule:down">
                                                          <mtr>
                                                            <mtd>
                                                              <mtable framespacing="0 0">
                                                                <mtr>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\AxiomC{B}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>B</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                  <mtd></mtd>
                                                                  <mtd rowalign="bottom">
                                                                    <mrow data-latex="\\LL{qqqq}" semantics="bspr_axiom:true">
                                                                      <mspace width=".5ex"></mspace>
                                                                      <mstyle displaystyle="false" scriptlevel="0">
                                                                        <mtext>R</mtext>
                                                                      </mstyle>
                                                                      <mspace width=".5ex"></mspace>
                                                                    </mrow>
                                                                  </mtd>
                                                                </mtr>
                                                              </mtable>
                                                            </mtd>
                                                          </mtr>
                                                          <mtr>
                                                            <mtd>
                                                              <mrow>
                                                                <mspace width=".5ex"></mspace>
                                                                <mstyle displaystyle="false" scriptlevel="0">
                                                                  <mrow data-mjx-texclass="ORD">
                                                                    <mi data-latex="C">C</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="D">D</mi>
                                                                    <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                                                                    <mi data-latex="Q">Q</mi>
                                                                  </mrow>
                                                                </mstyle>
                                                                <mspace width=".5ex"></mspace>
                                                              </mrow>
                                                            </mtd>
                                                          </mtr>
                                                        </mtable>
                                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                                          <mstyle displaystyle="false" scriptlevel="0">
                                                            <mtext>AAAA</mtext>
                                                          </mstyle>
                                                        </mpadded>
                                                      </mrow>
                                                      <mspace width="-3.5em"></mspace>
                                                    </mrow>
                                                  </mtd>
                                                </mtr>
                                              </mtable>
                                            </mtd>
                                          </mtr>
                                          <mtr>
                                            <mtd>
                                              <mrow>
                                                <mspace width=".5ex"></mspace>
                                                <mstyle displaystyle="false" scriptlevel="0">
                                                  <mtext>E</mtext>
                                                </mstyle>
                                                <mspace width=".5ex"></mspace>
                                              </mrow>
                                            </mtd>
                                          </mtr>
                                        </mtable>
                                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                                          <mstyle displaystyle="false" scriptlevel="0">
                                            <mtext>MMM</mtext>
                                          </mstyle>
                                        </mpadded>
                                      </mrow>
                                      <mspace width="-8.352em"></mspace>
                                    </mrow>
                                  </mtd>
                                </mtr>
                              </mtable>
                            </mtd>
                          </mtr>
                          <mtr>
                            <mtd>
                              <mrow>
                                <mspace width=".5ex"></mspace>
                                <mstyle displaystyle="false" scriptlevel="0">
                                  <mtext>F</mtext>
                                </mstyle>
                                <mspace width=".5ex"></mspace>
                              </mrow>
                            </mtd>
                          </mtr>
                        </mtable>
                        <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
                          <mstyle displaystyle="false" scriptlevel="0">
                            <mtext>CCCCC</mtext>
                          </mstyle>
                        </mpadded>
                      </mrow>
                    </mrow>
                  </mrow>
                </mtd>
                <mtd>
                  <mspace width="4.242055555555558em"></mspace>
                </mtd>
                <mtd rowalign="bottom">
                  <mrow data-latex="\\LL{BBB}" semantics="bspr_axiom:true">
                    <mspace width=".5ex"></mspace>
                    <mstyle displaystyle="false" scriptlevel="0">
                      <mtext>M</mtext>
                    </mstyle>
                    <mspace width=".5ex"></mspace>
                  </mrow>
                </mtd>
              </mtr>
            </mtable>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mrow>
              <mspace width=".5ex"></mspace>
              <mstyle displaystyle="false" scriptlevel="0">
                <mrow data-mjx-texclass="ORD">
                  <mi data-latex="N">N</mi>
                  <mo stretchy="false" data-latex="\\rightarrow">&#x2192;</mo>
                  <mi data-latex="R">R</mi>
                </mrow>
              </mstyle>
              <mspace width=".5ex"></mspace>
            </mrow>
          </mtd>
        </mtr>
      </mtable>
      <mpadded height="+.5em" width="+.5em" voffset="-.15em" semantics="bspr_prooflabel:right">
        <mstyle displaystyle="false" scriptlevel="0">
          <mtext>QERE</mtext>
        </mstyle>
      </mpadded>
    </mrow>
  </mrow>
</math>`
    ));
});
