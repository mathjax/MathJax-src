/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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

import {CHTMLWrapper} from './Wrapper.js';
import {CHTMLmo} from './Wrappers/mo.js';
import {CHTMLms} from './Wrappers/ms.js';
import {CHTMLmspace} from './Wrappers/mspace.js';
import {CHTMLmpadded} from './Wrappers/mpadded.js';
import {CHTMLmrow, CHTMLinferredMrow} from './Wrappers/mrow.js';
import {CHTMLmfrac} from './Wrappers/mfrac.js';
import {CHTMLmsqrt} from './Wrappers/msqrt.js';
import {CHTMLmroot} from './Wrappers/mroot.js';
import {CHTMLmsub, CHTMLmsup, CHTMLmsubsup} from './Wrappers/msubsup.js';
import {CHTMLmover, CHTMLmunder, CHTMLmunderover} from './Wrappers/munderover.js';
import {CHTMLmtable} from './Wrappers/mtable.js';
import {CHTMLmtr, CHTMLmlabeledtr} from './Wrappers/mtr.js';
import {CHTMLmtd} from './Wrappers/mtd.js';
import {CHTMLsemantics, CHTMLannotation, CHTMLannotationXML, CHTMLxml} from './Wrappers/semantics.js';
import {CHTMLTeXAtom} from './Wrappers/TeXAtom.js';
import {CHTMLTextNode} from './Wrappers/TextNode.js';

export const CHTMLWrappers: {[kind: string]: typeof CHTMLWrapper}  = {
    [CHTMLmrow.kind]: CHTMLmrow,
    [CHTMLinferredMrow.kind]: CHTMLinferredMrow,
    [CHTMLmo.kind]: CHTMLmo,
    [CHTMLms.kind]: CHTMLms,
    [CHTMLmspace.kind]: CHTMLmspace,
    [CHTMLmpadded.kind]: CHTMLmpadded,
    [CHTMLmfrac.kind]: CHTMLmfrac,
    [CHTMLmsqrt.kind]: CHTMLmsqrt,
    [CHTMLmroot.kind]: CHTMLmroot,
    [CHTMLmsub.kind]: CHTMLmsub,
    [CHTMLmsup.kind]: CHTMLmsup,
    [CHTMLmsubsup.kind]: CHTMLmsubsup,
    [CHTMLmunder.kind]: CHTMLmunder,
    [CHTMLmover.kind]: CHTMLmover,
    [CHTMLmunderover.kind]: CHTMLmunderover,
    [CHTMLmtable.kind]: CHTMLmtable,
    [CHTMLmtr.kind]: CHTMLmtr,
    [CHTMLmlabeledtr.kind]: CHTMLmlabeledtr,
    [CHTMLmtd.kind]: CHTMLmtd,
    [CHTMLsemantics.kind]: CHTMLsemantics,
    [CHTMLannotation.kind]: CHTMLannotation,
    [CHTMLannotationXML.kind]: CHTMLannotationXML,
    [CHTMLxml.kind]: CHTMLxml,
    [CHTMLTeXAtom.kind]: CHTMLTeXAtom,
    [CHTMLTextNode.kind]: CHTMLTextNode,
    [CHTMLWrapper.kind]: CHTMLWrapper
};
