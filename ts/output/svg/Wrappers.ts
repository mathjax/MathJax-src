/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file  An object listing all the SvgWrapper classes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { SvgWrapper, SvgWrapperClass } from './Wrapper.js';
import { SvgMath } from './Wrappers/math.js';
import { SvgMrow, SvgInferredMrow } from './Wrappers/mrow.js';
import { SvgMi } from './Wrappers/mi.js';
import { SvgMo } from './Wrappers/mo.js';
import { SvgMn } from './Wrappers/mn.js';
import { SvgMs } from './Wrappers/ms.js';
import { SvgMtext } from './Wrappers/mtext.js';
import { SvgMerror } from './Wrappers/merror.js';
import { SvgMspace } from './Wrappers/mspace.js';
import { SvgMpadded } from './Wrappers/mpadded.js';
import { SvgMphantom } from './Wrappers/mphantom.js';
import { SvgMfrac } from './Wrappers/mfrac.js';
import { SvgMsqrt } from './Wrappers/msqrt.js';
import { SvgMroot } from './Wrappers/mroot.js';
import { SvgMfenced } from './Wrappers/mfenced.js';
import { SvgMsub, SvgMsup, SvgMsubsup } from './Wrappers/msubsup.js';
import { SvgMover, SvgMunder, SvgMunderover } from './Wrappers/munderover.js';
import { SvgMmultiscripts } from './Wrappers/mmultiscripts.js';

import { SvgMtable } from './Wrappers/mtable.js';
import { SvgMtr, SvgMlabeledtr } from './Wrappers/mtr.js';
import { SvgMtd } from './Wrappers/mtd.js';

import { SvgMaction } from './Wrappers/maction.js';
import { SvgMenclose } from './Wrappers/menclose.js';
import {
  SvgSemantics,
  SvgAnnotation,
  SvgAnnotationXML,
  SvgXmlNode,
} from './Wrappers/semantics.js';
import { SvgMglyph } from './Wrappers/mglyph.js';
import { SvgTeXAtom } from './Wrappers/TeXAtom.js';
import { SvgTextNode } from './Wrappers/TextNode.js';
import { SvgHtmlNode } from './Wrappers/HtmlNode.js';

export const SvgWrappers: { [kind: string]: SvgWrapperClass<any, any, any> } = {
  [SvgMath.kind]: SvgMath,
  [SvgMrow.kind]: SvgMrow,
  [SvgInferredMrow.kind]: SvgInferredMrow,
  [SvgMi.kind]: SvgMi,
  [SvgMo.kind]: SvgMo,
  [SvgMn.kind]: SvgMn,
  [SvgMs.kind]: SvgMs,
  [SvgMtext.kind]: SvgMtext,
  [SvgMerror.kind]: SvgMerror,
  [SvgMspace.kind]: SvgMspace,
  [SvgMpadded.kind]: SvgMpadded,
  [SvgMphantom.kind]: SvgMphantom,
  [SvgMfrac.kind]: SvgMfrac,
  [SvgMsqrt.kind]: SvgMsqrt,
  [SvgMroot.kind]: SvgMroot,
  [SvgMfenced.kind]: SvgMfenced,
  [SvgMsub.kind]: SvgMsub,
  [SvgMsup.kind]: SvgMsup,
  [SvgMsubsup.kind]: SvgMsubsup,
  [SvgMunder.kind]: SvgMunder,
  [SvgMover.kind]: SvgMover,
  [SvgMunderover.kind]: SvgMunderover,
  [SvgMmultiscripts.kind]: SvgMmultiscripts,
  [SvgMtable.kind]: SvgMtable,
  [SvgMtr.kind]: SvgMtr,
  [SvgMlabeledtr.kind]: SvgMlabeledtr,
  [SvgMtd.kind]: SvgMtd,
  [SvgMaction.kind]: SvgMaction,
  [SvgMenclose.kind]: SvgMenclose,
  [SvgSemantics.kind]: SvgSemantics,
  [SvgAnnotation.kind]: SvgAnnotation,
  [SvgAnnotationXML.kind]: SvgAnnotationXML,
  [SvgXmlNode.kind]: SvgXmlNode,
  [SvgMglyph.kind]: SvgMglyph,
  [SvgTeXAtom.kind]: SvgTeXAtom,
  [SvgTextNode.kind]: SvgTextNode,
  [SvgHtmlNode.kind]: SvgHtmlNode,
  [SvgWrapper.kind]: SvgWrapper,
};
