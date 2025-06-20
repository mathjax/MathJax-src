/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file  An object listing all the ChtmlWrapper classes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import { ChtmlWrapper, ChtmlWrapperClass } from './Wrapper.js';
import { ChtmlMath } from './Wrappers/math.js';
import { ChtmlMi } from './Wrappers/mi.js';
import { ChtmlMo } from './Wrappers/mo.js';
import { ChtmlMn } from './Wrappers/mn.js';
import { ChtmlMs } from './Wrappers/ms.js';
import { ChtmlMtext } from './Wrappers/mtext.js';
import { ChtmlMspace } from './Wrappers/mspace.js';
import { ChtmlMpadded } from './Wrappers/mpadded.js';
import { ChtmlMenclose } from './Wrappers/menclose.js';
import { ChtmlMrow, ChtmlInferredMrow } from './Wrappers/mrow.js';
import { ChtmlMfenced } from './Wrappers/mfenced.js';
import { ChtmlMfrac } from './Wrappers/mfrac.js';
import { ChtmlMsqrt } from './Wrappers/msqrt.js';
import { ChtmlMroot } from './Wrappers/mroot.js';
import { ChtmlMsub, ChtmlMsup, ChtmlMsubsup } from './Wrappers/msubsup.js';
import {
  ChtmlMover,
  ChtmlMunder,
  ChtmlMunderover,
} from './Wrappers/munderover.js';
import { ChtmlMmultiscripts } from './Wrappers/mmultiscripts.js';
import { ChtmlMtable } from './Wrappers/mtable.js';
import { ChtmlMtr, ChtmlMlabeledtr } from './Wrappers/mtr.js';
import { ChtmlMtd } from './Wrappers/mtd.js';
import { ChtmlMaction } from './Wrappers/maction.js';
import { ChtmlMglyph } from './Wrappers/mglyph.js';
import {
  ChtmlSemantics,
  ChtmlAnnotation,
  ChtmlAnnotationXML,
  ChtmlXmlNode,
} from './Wrappers/semantics.js';
import { ChtmlTeXAtom } from './Wrappers/TeXAtom.js';
import { ChtmlTextNode } from './Wrappers/TextNode.js';
import { ChtmlHtmlNode } from './Wrappers/HtmlNode.js';

export const ChtmlWrappers: {
  [kind: string]: ChtmlWrapperClass<any, any, any>;
} = {
  [ChtmlMath.kind]: ChtmlMath,
  [ChtmlMrow.kind]: ChtmlMrow,
  [ChtmlInferredMrow.kind]: ChtmlInferredMrow,
  [ChtmlMi.kind]: ChtmlMi,
  [ChtmlMo.kind]: ChtmlMo,
  [ChtmlMn.kind]: ChtmlMn,
  [ChtmlMs.kind]: ChtmlMs,
  [ChtmlMtext.kind]: ChtmlMtext,
  [ChtmlMspace.kind]: ChtmlMspace,
  [ChtmlMpadded.kind]: ChtmlMpadded,
  [ChtmlMenclose.kind]: ChtmlMenclose,
  [ChtmlMfrac.kind]: ChtmlMfrac,
  [ChtmlMsqrt.kind]: ChtmlMsqrt,
  [ChtmlMroot.kind]: ChtmlMroot,
  [ChtmlMsub.kind]: ChtmlMsub,
  [ChtmlMsup.kind]: ChtmlMsup,
  [ChtmlMsubsup.kind]: ChtmlMsubsup,
  [ChtmlMunder.kind]: ChtmlMunder,
  [ChtmlMover.kind]: ChtmlMover,
  [ChtmlMunderover.kind]: ChtmlMunderover,
  [ChtmlMmultiscripts.kind]: ChtmlMmultiscripts,
  [ChtmlMfenced.kind]: ChtmlMfenced,
  [ChtmlMtable.kind]: ChtmlMtable,
  [ChtmlMtr.kind]: ChtmlMtr,
  [ChtmlMlabeledtr.kind]: ChtmlMlabeledtr,
  [ChtmlMtd.kind]: ChtmlMtd,
  [ChtmlMaction.kind]: ChtmlMaction,
  [ChtmlMglyph.kind]: ChtmlMglyph,
  [ChtmlSemantics.kind]: ChtmlSemantics,
  [ChtmlAnnotation.kind]: ChtmlAnnotation,
  [ChtmlAnnotationXML.kind]: ChtmlAnnotationXML,
  [ChtmlXmlNode.kind]: ChtmlXmlNode,
  [ChtmlTeXAtom.kind]: ChtmlTeXAtom,
  [ChtmlTextNode.kind]: ChtmlTextNode,
  [ChtmlHtmlNode.kind]: ChtmlHtmlNode,
  [ChtmlWrapper.kind]: ChtmlWrapper,
};
