import { MmlNode } from '../../core/MmlTree/MmlNode.js';

/**********************************************************************/
/*
 * Some Aux functions for parsing the semantic structure sexpression
 */

export type SexpTree = string | SexpTree[];
export type ParentMap = Map<string, string>;
export type SemanticMap = Map<string, string[]>;

export class StructureUtil {
  /**
   * Helper to tokenize input
   *
   * @param {string} str   The semantic structure.
   * @returns {string[]}   The tokenized list.
   */
  protected static tokenize(str: string): string[] {
    return str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/);
  }

  /**
   * Recursive parser to convert tokens into a tree
   *
   * @param {string} tokens   The tokens from the semantic structure.
   * @returns {SexpTree}      Array list for the semantic structure sexpression.
   */
  protected static parse(tokens: string[]): SexpTree {
    const stack: SexpTree[][] = [[]];
    for (const token of tokens) {
      if (token === '(') {
        const newNode: SexpTree = [];
        stack[stack.length - 1].push(newNode);
        stack.push(newNode);
      } else if (token === ')') {
        stack.pop();
      } else {
        stack[stack.length - 1].push(token);
      }
    }
    return stack[0][0];
  }

  /**
   * Recursively map semantic ids to the nearest parent ids
   *
   * @param {MmlNode} node    The node to process
   * @param {string} id       The id of the parent node
   * @param {ParentMap} map   The map being built
   * @returns {ParentMap}     The map of semantic ids to their nearset parent ids
   */
  protected static mapParents(
    node: MmlNode,
    id: string = '',
    map: ParentMap = new Map()
  ): ParentMap {
    const nid = node.attributes.get('data-semantic-id') as string;
    if (nid) {
      map.set(nid, id);
    }
    if (node.isToken) return map;
    for (const child of node.childNodes) {
      this.mapParents(child, nid ?? id, map);
    }
    return map;
  }

  /**
   * Map the semantic ids to themselves and any nodes outside their MathML tree
   *
   * @param {MmlNode} root    The root node to process.
   * @returns {SemanticMap}   The map of node ids to arrays of node ids for those that have
   *                          nodes outside their MathML subtree.
   */
  public static semanticNodes(root: MmlNode): SemanticMap {
    let sexp = '';
    root.walkTree((node) => {
      sexp = node.attributes?.get('data-semantic-structure') as string;
      return !!sexp;
    });
    const tree = this.parse(this.tokenize(sexp));
    const parents = this.mapParents(root);
    const map = new Map() as SemanticMap;
    this.mapExtras(tree, parents, map);
    return map;
  }

  /**
   * Recursive helper function for semanticNodes().
   *
   * @param {SexpTree} tree       The semantic structure array.
   * @param {ParentMap} parents   The map from semantic ids to their parent ids.
   * @param {SemanticMap} map     The map being built.
   * @returns {string[]}          The semantic nodes outside the MathML subtree.
   */
  protected static mapExtras(
    tree: SexpTree,
    parents: ParentMap,
    map: SemanticMap
  ): string[] {
    if (!Array.isArray(tree)) return [tree];
    const id = tree[0] as string;
    const extra: string[] = [];
    for (const child of tree.slice(1)) {
      for (const nid of this.mapExtras(child, parents, map)) {
        if (parents.get(nid) !== id) {
          extra.push(nid);
        }
      }
    }
    if (extra.length) {
      map.set(id, [id, ...extra]);
    }
    return extra;
  }
}
