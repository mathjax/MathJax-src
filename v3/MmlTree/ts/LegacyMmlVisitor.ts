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
 * @fileoverview A visitor to convert to old internal format.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MmlVisitor} from './MmlVisitor';
import {MmlNode, TextNode, XMLNode} from './MmlNode';

declare var MathJax: any;
let MML = MathJax.ElementJax.mml;

export class LegacyMmlVisitor extends MmlVisitor {

    visitTree(node: MmlNode) {
        let root = MML.mrow();
        this.visitNode(node, root);
        root = root.data[0];
        root.parent = null;
        return root;
    }
    visitTextNode(node: TextNode, parent: any) {
        parent.Append(MML.chars(node.getText()));
    }
    visitXMLNode(node: XMLNode, parent: any) {
        parent.Append(MML.xml(node.getXML()));
    }
    visitInferredMrowNode(node: MmlNode, parent: any) {
        for (const child of node.childNodes) {
            this.visitNode(child, parent);
        }
    }
    visitDefault(node: MmlNode, parent: any) {
        let mml = MML[node.kind]();
        this.addAttributes(node, mml);
        this.addProperties(node, mml);
        for (const child of node.childNodes) {
            this.visitNode(child, mml);
        }
        parent.Append(mml);
    }
    addAttributes(node: MmlNode, mml: any) {
        let attributes = node.attributes;
        let names = attributes.getExplicitNames();
        for (const name of names) {
            mml[name] = attributes.get(name);
        }
    }
    addProperties(node: MmlNode, mml: any) {
        let names = node.getPropertyNames();
        for (const name of names) {
            mml[name] = node.getProperty(name);
        }
    }

}
