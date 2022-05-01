/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  An object listing all the SVGWrapper classes
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGWrapperClass} from './Wrapper.js';
import {SVGMath} from './Wrappers/math.js';
import {SVGMrow, SVGInferredMrow} from './Wrappers/mrow.js';
import {SVGMi} from './Wrappers/mi.js';
import {SVGMo} from './Wrappers/mo.js';
import {SVGMn} from './Wrappers/mn.js';
import {SVGMs} from './Wrappers/ms.js';
import {SVGMtext} from './Wrappers/mtext.js';
import {SVGMerror} from './Wrappers/merror.js';
import {SVGMspace} from './Wrappers/mspace.js';
import {SVGMpadded} from './Wrappers/mpadded.js';
import {SVGMphantom} from './Wrappers/mphantom.js';
import {SVGMfrac} from './Wrappers/mfrac.js';
import {SVGMsqrt} from './Wrappers/msqrt.js';
import {SVGMroot} from './Wrappers/mroot.js';
import {SVGMfenced} from './Wrappers/mfenced.js';
import {SVGMsub, SVGMsup, SVGMsubsup} from './Wrappers/msubsup.js';
import {SVGMover, SVGMunder, SVGMunderover} from './Wrappers/munderover.js';
import {SVGMmultiscripts} from './Wrappers/mmultiscripts.js';

import {SVGMtable} from './Wrappers/mtable.js';
import {SVGMtr, SVGMlabeledtr} from './Wrappers/mtr.js';
import {SVGMtd} from './Wrappers/mtd.js';

import {SVGMaction} from './Wrappers/maction.js';
import {SVGMenclose} from './Wrappers/menclose.js';
import {SVGSemantics, SVGAnnotation, SVGAnnotationXML, SVGXmlNode} from './Wrappers/semantics.js';
import {SVGMglyph} from './Wrappers/mglyph.js';
import {SVGTeXAtom} from './Wrappers/TeXAtom.js';
import {SVGTextNode} from './Wrappers/TextNode.js';

export const SVGWrappers: {[kind: string]: SVGWrapperClass<any, any, any>} = {
  [SVGMath.kind]: SVGMath,
  [SVGMrow.kind]: SVGMrow,
  [SVGInferredMrow.kind]: SVGInferredMrow,
  [SVGMi.kind]: SVGMi,
  [SVGMo.kind]: SVGMo,
  [SVGMn.kind]: SVGMn,
  [SVGMs.kind]: SVGMs,
  [SVGMtext.kind]: SVGMtext,
  [SVGMerror.kind]: SVGMerror,
  [SVGMspace.kind]: SVGMspace,
  [SVGMpadded.kind]: SVGMpadded,
  [SVGMphantom.kind]: SVGMphantom,
  [SVGMfrac.kind]: SVGMfrac,
  [SVGMsqrt.kind]: SVGMsqrt,
  [SVGMroot.kind]: SVGMroot,
  [SVGMfenced.kind]: SVGMfenced,
  [SVGMsub.kind]: SVGMsub,
  [SVGMsup.kind]: SVGMsup,
  [SVGMsubsup.kind]: SVGMsubsup,
  [SVGMunder.kind]: SVGMunder,
  [SVGMover.kind]: SVGMover,
  [SVGMunderover.kind]: SVGMunderover,
  [SVGMmultiscripts.kind]: SVGMmultiscripts,
  [SVGMtable.kind]: SVGMtable,
  [SVGMtr.kind]: SVGMtr,
  [SVGMlabeledtr.kind]: SVGMlabeledtr,
  [SVGMtd.kind]: SVGMtd,
  [SVGMaction.kind]: SVGMaction,
  [SVGMenclose.kind]: SVGMenclose,
  [SVGSemantics.kind]: SVGSemantics,
  [SVGAnnotation.kind]: SVGAnnotation,
  [SVGAnnotationXML.kind]: SVGAnnotationXML,
  [SVGXmlNode.kind]: SVGXmlNode,
  [SVGMglyph.kind]: SVGMglyph,
  [SVGTeXAtom.kind]: SVGTeXAtom,
  [SVGTextNode.kind]: SVGTextNode,
  [SVGWrapper.kind]: SVGWrapper
};
