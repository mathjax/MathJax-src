/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview  The annotations submenus.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Submenu} from 'mj-context-menu/js/item_submenu.js';
import {MJContextMenu} from './MJContextMenu.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {SelectableInfo} from './SelectableInfo.js';
import * as MenuUtil from './MenuUtil.js';

/**
 * The annotation types to look for in a MathItem. These are options set in the
 * Menu object.
 */
type ANNOTATIONTYPES = {[type: string]: string[]};
let annotationTypes: ANNOTATIONTYPES = {};

/**
 * Sets the connected annotation box.
 * @param {SelectableInfo} box The info box.
 */
export function setAnnotationBox(box: SelectableInfo) {
  annotationBox = box;
}

/**
 * The info box for showing annotations (created by the Menu object that
 * contains this MJContextMenu)
 */
let annotationBox: SelectableInfo = null;

/**
 * Sets the allowed annotation types.
 * @param {ANNOTATIONTYPES} types The association list of types.
 */
export function setAnnotationTypes(types: ANNOTATIONTYPES) {
  annotationTypes = types;
}

/*======================================================================*/

/**
 * Creates the dynamic submenu for showing annotations.
 *
 * @param {MJContextMenu} menu The context menu for which the submenu is constructed.
 * @param {Submenu} sub The submenu to attach elements to.
 */
export function showAnnotations(menu: MJContextMenu, sub: Submenu) {
  const annotations = getAnnotations(menu);
  annotationBox.attachMenu(menu);
  return createAnnotationMenu(menu, sub, annotations,
                              () => annotationBox.post());
}

/**
 * Creates the dynamic submenu for copying annotations.
 *
 * @param {MJContextMenu} menu The context menu for which the submenu is constructed.
 * @param {Submenu} sub The submenu to attach elements to.
 */
export function copyAnnotations(menu: MJContextMenu, sub: Submenu) {
  const annotations = getAnnotations(menu);
  return createAnnotationMenu(menu,  sub, annotations,
                              () => MenuUtil.copyToClipboard(annotation.trim()));
}

/**
 * We cache annotations of a math item, so we only have to compute them once for
 * the two annotation menus.
 */
let cachedAnnotation: [string, string][] = null;

/**
 * Computes the annotations for the math item the context menu is opened on.
 *
 * @param {MJContextMenu} menu The context menu.
 * @return {[string, string][]} The association list of annotation.
 */
function getAnnotations(menu: MJContextMenu): [string, string][] {
  if (cachedAnnotation) {
    let save = cachedAnnotation;
    cachedAnnotation = null;
    return save;
  }
  cachedAnnotation = getAnnotation(getSemanticNode(menu));
  return cachedAnnotation;
}

/**
 * Find the top-most semantics element that encloses the contents of the expression (if any)
 *
 * @returns {MmlNode | null} The semantics node that was found (or null)
 */
function getSemanticNode(menu: MJContextMenu): MmlNode | null {
  let node: MmlNode = menu.mathItem?.root;
  while (node && !node.isKind('semantics'))  {
    if (node.isToken || node.childNodes.length !== 1) return null;
    node = node.childNodes[0];
  }
  return node;
}

/**
 * @param {MmlNode} node           The semantics node whose annotations are to be obtained
 * @returns {[string, string][]}   Array of [type, text] where the type is the annotation type
 *                                   and text is the content of the annotation of that type
 */
function getAnnotation(node: MmlNode): [string, string][] {
  const annotations = [] as [string, string][];
  if (!node) return annotations;
  for (const child of node.childNodes) {
    if (child.isKind('annotation')) {
      const match = annotationMatch(child);
      if (match) {
        const value = child.childNodes.reduce((text, chars) => text + chars.toString(), '');
        annotations.push([match, value]);
      }
    }
  }
  return annotations;
}

/**
 * @param {MmlNode} child The annotation node to check if its encoding is one
 *     of the displayable ones.
 * @returns {string | null} The annotation type if it exists, o/w null.
 */
function annotationMatch(child: MmlNode): string | null {
  const encoding = child.attributes.get('encoding') as string;
  for (const type of Object.keys(annotationTypes)) {
    if (annotationTypes[type].indexOf(encoding) >= 0) {
      return type;
    }
  }
  return null;
}

/**
 * The annotation selected in the Annotation submenu (needed for the info box to
 * be able to show it)
 */
export let annotation: string = '';

/**
 * Create a submenu from the available annotations and attach it to the proper menu item
 *
 * @param {MJContextMenu} menu The context menu for which the submenu is constructed.
 * @param {Submenu} submenu The submenu to attach elements to.
 * @param {[string, string][]} annotations The annotations to use for the submenu
 * @param {() => void} action The action to perform when the annotation is selected
 */
function createAnnotationMenu(menu: MJContextMenu, submenu: Submenu,
                              annotations: [string, string][],
                              action: () => void) {
  return menu.factory.get('subMenu')(menu.factory, {
    items: annotations.map(([type, value]) => {
      return {
        type: 'command',
        id: type,
        content: type,
        action: () => {
          annotation = value;
          action();
        }
      };
    }),
    id: 'annotations'
  }, submenu);
}
