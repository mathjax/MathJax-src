import {Submenu} from 'mj-context-menu/js/item_submenu.js';
import {MJContextMenu} from './MJContextMenu.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {SelectableInfo} from './SelectableInfo.js';
import * as MenuUtil from './MenuUtil.js';


/**
 * The annotation selected in the Annotation submenu (neede for the info box to be able to show it)
 */
export let annotation: string = '';

/**
 * The annotation types to look for in a MathItem
 */
export let annotationTypes: {[type: string]: string[]} = {};

export let annotationBox: SelectableInfo = null;

// /**
//  * The annotation selected in the Annotation submenu (neede for the info box to be able to show it)
//  */
// public annotation: string = '';

// /**
//  * The info box for showing annotations (created by the Menu object that contains this MJContextMenu)
//  */
// public showAnnotation: SelectableInfo;

// /**
//  * The function to copy the selected annotation (set by the containing Menu item)
//  */
// public copyAnnotation: () => void;

// /**
//  * The annotation types to look for in a MathItem
//  */
// public annotationTypes: {[type: string]: string[]} = {};

/**
 * Sets the allowed annotation types.
 * @param {{[type: string]: string[]}} types The association list of types.
 */
export function setAnnotationBox(box: SelectableInfo) {
  annotationBox = box;
}

/**
 * Sets the allowed annotation types.
 * @param {{[type: string]: string[]}} types The association list of types.
 */
export function setAnnotationTypes(types: {[type: string]: string[]}) {
  annotationTypes = types;
}

/*======================================================================*/

/**
 * Look up the annotations in the MathItem and set the ShowAs and CopyToClipboard menus
 */
// function getAnnotationMenu() {
//   MJContextMenu.DynamicSubmenus.set(
//     'ShowAnnotation', this.showAnnotations.bind(this));
//   MJContextMenu.DynamicSubmenus.set(
//     'CopyAnnotation', this.copyAnnotations.bind(this));
// }

export function showAnnotations(menu: MJContextMenu, _sub: Submenu) {
  const annotations = getAnnotations(getSemanticNode(menu));
  annotationBox.attachMenu(menu);
  return createAnnotationMenu(menu, _sub, annotations,
                              () => annotationBox.post());
}

/**
 * 
 * @param {MJContextMenu} menu 
 * @param {Submenu} _sub 
 */
export function copyAnnotations(menu: MJContextMenu, _sub: Submenu) {
  const annotations = getAnnotations(getSemanticNode(menu));
  return createAnnotationMenu(menu,  _sub, annotations,
                              () => MenuUtil.copyToClipboard(annotation.trim()));
}
/**
 * Find the top-most semantics element that encloses the contents of the expression (if any)
 *
 * @returns {MmlNode | null}   The semantics node that was found (or null)
 */
function getSemanticNode(menu: MJContextMenu): MmlNode | null {
  console.log(menu);
  let node: MmlNode = menu.mathItem.root;
  console.log(menu.mathItem);
  console.log(menu.mathItem.root);
  while (node && !node.isKind('semantics'))  {
    if (node.isToken || node.childNodes.length !== 1) return null;
    node = node.childNodes[0];
  }
  console.log(node);
  return node;
}

/**
 * @param {MmlNode} node           The semantics node whose annotations are to be obtained
 * @returns {[string, string][]}   Array of [type, text] where the type is the annotation type
 *                                   and text is the content of the annotation of that type
 */
function getAnnotations(node: MmlNode): [string, string][] {
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
 * @param {MmlNode} child    The annotation node to check if its encoding is one of the displayable ones
 * @returns {string | null}         The annotation type if it does, or null if it doesn't
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
 * Create a submenu from the available annotations and attach it to the proper menu item
 *
 * @param {string} id                        The id of the menu to attach to (Show or Copy)
 * @param {[string, string][]} annotations   The annotations to use for the submenu
 * @param {() => void} action                The action to perform when the annotation is selected
 */
function createAnnotationMenu(menu: MJContextMenu, submenu: Submenu,
                              annotations: [string, string][], action: () => void) {
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

