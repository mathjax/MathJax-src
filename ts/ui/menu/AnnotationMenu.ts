/*************************************************************
 *
 *  Copyright (c) 2019-2025 The MathJax Consortium
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
 * @file  The annotations submenus.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { SubMenu, Submenu } from './mj-context-menu.js';
import { MJContextMenu } from './MJContextMenu.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { SelectableInfo } from './SelectableInfo.js';
import * as MenuUtil from './MenuUtil.js';

/**
 * The annotation types to look for in a MathItem. These are options set in the
 * Menu object.
 */
type AnnotationTypes = { [type: string]: string[] };

/*======================================================================*/

/**
 * Returns a method to create the dynamic submenu for showing annotations.
 *
 * @param {SelectableInfo} box The info box in which to post annotation info.
 * @param {AnnotationTypes} types The legitimate annotation types.
 * @param {[string, string][]} cache We cache annotations of a math item, so we
 *    only have to compute them once for the two annotation menus.
 * @returns {(menu: MJContextMenu, sub: Submenu) => SubMenu} Method generating
 *    the show annotations submenu.
 */
export function showAnnotations(
  box: SelectableInfo,
  types: AnnotationTypes,
  cache: [string, string][]
): (menu: MJContextMenu, sub: Submenu) => SubMenu {
  return (menu: MJContextMenu, sub: Submenu) => {
    getAnnotation(getSemanticNode(menu), types, cache);
    box.attachMenu(menu);
    return createAnnotationMenu(menu, sub, cache, () => box.post());
  };
}

/**
 * Returns a method to create the dynamic submenu for copying annotations.
 * Clears the annotation cache parameter.
 *
 * @param {[string, string][]} cache The annotation cache.
 * @returns {(menu: MJContextMenu, sub: Submenu) => SubMenu} Method generating
 *    the copy annotations submenu.
 */
export function copyAnnotations(cache: [string, string][]) {
  return (menu: MJContextMenu, sub: Submenu) => {
    const annotations = cache.slice();
    cache.length = 0;
    return createAnnotationMenu(menu, sub, annotations, () =>
      MenuUtil.copyToClipboard(annotation.trim())
    );
  };
}

/**
 * Find the top-most semantics element that encloses the contents of the expression (if any)
 *
 * @param {MJContextMenu} menu The MathJax context menu
 * @returns {MmlNode | null} The semantics node that was found (or null)
 */
function getSemanticNode(menu: MJContextMenu): MmlNode | null {
  let node: MmlNode = menu.mathItem?.root;
  while (node && !node.isKind('semantics')) {
    if (node.isToken || node.childNodes.length !== 1) return null;
    node = node.childNodes[0];
  }
  return node;
}

/**
 * Computes the annotations for the math item the context menu is opened on.
 *
 * @param {MmlNode} node           The semantics node whose annotations are to be obtained
 * @param {AnnotationTypes} types The legitimate annotation types.
 * @param {[string, string][]} annotations The annoations cache of [type, text]
 *    where the type is the annotation type and text is the content of the
 *    annotation of that type.
 */
function getAnnotation(
  node: MmlNode,
  types: AnnotationTypes,
  annotations: [string, string][]
) {
  if (!node) return;
  for (const child of node.childNodes) {
    if (child.isKind('annotation')) {
      const match = annotationMatch(child, types);
      if (match) {
        const value = child.childNodes.reduce(
          (text, chars) => text + chars.toString(),
          ''
        );
        annotations.push([match, value]);
      }
    }
  }
}

/**
 * @param {MmlNode} child The annotation node to check if its encoding is one
 *     of the displayable ones.
 * @param {AnnotationTypes} types The annotation types.
 * @returns {string | null} The annotation type if it exists, o/w null.
 */
function annotationMatch(
  child: MmlNode,
  types: AnnotationTypes
): string | null {
  const encoding = child.attributes.get('encoding') as string;
  for (const type of Object.keys(types)) {
    if (types[type].includes(encoding)) {
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
 * @param {[string, string][]} annotations The annotations to use for the submenu.
 * @param {() => void} action The action to perform when the annotation is selected.
 * @returns {Submenu} The newly created submenu.
 */
function createAnnotationMenu(
  menu: MJContextMenu,
  submenu: Submenu,
  annotations: [string, string][],
  action: () => void
): SubMenu {
  return menu.factory.get('subMenu')(
    menu.factory,
    {
      items: annotations.map(([type, value]) => {
        return {
          type: 'command',
          id: type,
          content: type,
          action: () => {
            annotation = value;
            action();
          },
        };
      }),
      id: 'annotations',
    },
    submenu
  );
}
