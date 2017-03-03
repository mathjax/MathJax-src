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
import {AMmlNode} from './MmlNode';
import {TextNode} from './Node';

declare var MathJax: any;
let MML = MathJax.ElementJax.mml;

export class LegacyMmlVisitor extends MmlVisitor {

    visitTree(node: AMmlNode) {
        let root = MML.mrow();
        this.visitNode(node, root);
        root = root.data[0];
        root.parent = null;
        return root;
    }
    visitTextNode(node: TextNode, parent: any) {
        parent.Append(MML.chars((node as TextNode).getText()));
    }
    visitInferredMrowNode(node: AMmlNode, parent: any) {
        for (const child of node.childNodes) {
            this.visitNode(child, parent);
        }
    }
    visitDefault(node: AMmlNode, parent: any) {
        let mml = MML[node.kind]();
        this.addAttributes(node, mml);
        this.addProperties(node, mml);
        for (const child of node.childNodes) {
            this.visitNode(child, mml);
        }
        parent.Append(mml);
    }
    addAttributes(node: AMmlNode, mml: any) {
        let attributes = node.getAttributes();
        for (const name of Object.keys(attributes)) {
            mml[name] = attributes[name];
        }
    }
    addProperties(node: AMmlNode, mml: any) {
        let properties = node.getProperties();
        for (const name of Object.keys(properties)) {
            mml[name] = properties[name];
        }
    }

}
