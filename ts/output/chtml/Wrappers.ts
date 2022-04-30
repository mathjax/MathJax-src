/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  An object listing all the CHTMLWrapper classes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLWrapperClass} from './Wrapper.js';
import {CHTMLMath} from './Wrappers/math.js';
import {CHTMLMi} from './Wrappers/mi.js';
import {CHTMLMo} from './Wrappers/mo.js';
import {CHTMLMn} from './Wrappers/mn.js';
import {CHTMLMs} from './Wrappers/ms.js';
import {CHTMLMtext} from './Wrappers/mtext.js';
import {CHTMLMspace} from './Wrappers/mspace.js';
import {CHTMLMpadded} from './Wrappers/mpadded.js';
import {CHTMLMenclose} from './Wrappers/menclose.js';
import {CHTMLMrow, CHTMLInferredMrow} from './Wrappers/mrow.js';
import {CHTMLMfenced} from './Wrappers/mfenced.js';
import {CHTMLMfrac} from './Wrappers/mfrac.js';
import {CHTMLMsqrt} from './Wrappers/msqrt.js';
import {CHTMLMroot} from './Wrappers/mroot.js';
import {CHTMLMsub, CHTMLMsup, CHTMLMsubsup} from './Wrappers/msubsup.js';
import {CHTMLMover, CHTMLMunder, CHTMLMunderover} from './Wrappers/munderover.js';
import {CHTMLMmultiscripts} from './Wrappers/mmultiscripts.js';
import {CHTMLMtable} from './Wrappers/mtable.js';
import {CHTMLMtr, CHTMLMlabeledtr} from './Wrappers/mtr.js';
import {CHTMLMtd} from './Wrappers/mtd.js';
import {CHTMLMaction} from './Wrappers/maction.js';
import {CHTMLMglyph} from './Wrappers/mglyph.js';
import {CHTMLSemantics, CHTMLAnnotation, CHTMLAnnotationXML, CHTMLXmlNode} from './Wrappers/semantics.js';
import {CHTMLTeXAtom} from './Wrappers/TeXAtom.js';
import {CHTMLTextNode} from './Wrappers/TextNode.js';

export const CHTMLWrappers: {[kind: string]: CHTMLWrapperClass<any, any, any>} = {
  [CHTMLMath.kind]: CHTMLMath,
  [CHTMLMrow.kind]: CHTMLMrow,
  [CHTMLInferredMrow.kind]: CHTMLInferredMrow,
  [CHTMLMi.kind]: CHTMLMi,
  [CHTMLMo.kind]: CHTMLMo,
  [CHTMLMn.kind]: CHTMLMn,
  [CHTMLMs.kind]: CHTMLMs,
  [CHTMLMtext.kind]: CHTMLMtext,
  [CHTMLMspace.kind]: CHTMLMspace,
  [CHTMLMpadded.kind]: CHTMLMpadded,
  [CHTMLMenclose.kind]: CHTMLMenclose,
  [CHTMLMfrac.kind]: CHTMLMfrac,
  [CHTMLMsqrt.kind]: CHTMLMsqrt,
  [CHTMLMroot.kind]: CHTMLMroot,
  [CHTMLMsub.kind]: CHTMLMsub,
  [CHTMLMsup.kind]: CHTMLMsup,
  [CHTMLMsubsup.kind]: CHTMLMsubsup,
  [CHTMLMunder.kind]: CHTMLMunder,
  [CHTMLMover.kind]: CHTMLMover,
  [CHTMLMunderover.kind]: CHTMLMunderover,
  [CHTMLMmultiscripts.kind]: CHTMLMmultiscripts,
  [CHTMLMfenced.kind]: CHTMLMfenced,
  [CHTMLMtable.kind]: CHTMLMtable,
  [CHTMLMtr.kind]: CHTMLMtr,
  [CHTMLMlabeledtr.kind]: CHTMLMlabeledtr,
  [CHTMLMtd.kind]: CHTMLMtd,
  [CHTMLMaction.kind]: CHTMLMaction,
  [CHTMLMglyph.kind]: CHTMLMglyph,
  [CHTMLSemantics.kind]: CHTMLSemantics,
  [CHTMLAnnotation.kind]: CHTMLAnnotation,
  [CHTMLAnnotationXML.kind]: CHTMLAnnotationXML,
  [CHTMLXmlNode.kind]: CHTMLXmlNode,
  [CHTMLTeXAtom.kind]: CHTMLTeXAtom,
  [CHTMLTextNode.kind]: CHTMLTextNode,
  [CHTMLWrapper.kind]: CHTMLWrapper
};
