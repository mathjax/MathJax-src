/**********************************************************************/
/*
 * Some Aux functions for parsing the semantic structure sexpression
 */

export type StructureMap = Map<string, Set<string>>;
type SexpTree = string | SexpTree[];

export class StructureUtil {
  /**
   * Create the subtree mapping for an expression's structure sexp.
   *
   * @param {string} sexp      The structure sexp to process
   * @returns {StructureMap}   The map from element ids to related ids
   */
  public static getStructure(sexp: string): StructureMap {
    const map: StructureMap = new Map();
    this.buildMap(this.parse(this.tokenize(sexp)), map);
    for (const x of map.keys()) {
      if (map.get(x).size === 0) {
        map.delete(x);
      }
    }
    return map;
  }

  /**
   * Helper to tokenize input
   *
   * @param {string} str   The semantic structure.
   * @returns {string[]}   The tokenized list.
   */
  public static tokenize(str: string): string[] {
    return str.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/);
  }

  /**
   * Recursive parser to convert tokens into a tree
   *
   * @param {string} tokens   The tokens from the semantic structure.
   * @returns {SexpTree}      Array list for the semantic structure sexpression.
   */
  public static parse(tokens: string[]): SexpTree {
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
   * Flattens the tree and builds the map.
   *
   * @param {SexpTree} tree                  The sexpression tree.
   * @param {Map<string, Set<string>>} map   The map to populate.
   * @returns {Set<string>}                  The descendant map.
   */
  public static buildMap(tree: SexpTree, map: StructureMap): Set<string> {
    if (typeof tree === 'string') {
      if (!map.has(tree)) map.set(tree, new Set());
      return new Set();
    }
    const [root, ...children] = tree;
    const rootId = root as string;
    const descendants: Set<string> = new Set();
    for (const child of children) {
      const childRoot = typeof child === 'string' ? child : child[0];
      const childDescendants = this.buildMap(child, map);
      descendants.add(childRoot as string);
      childDescendants.forEach((d: string) => descendants.add(d));
    }
    map.set(rootId, descendants);
    return descendants;
  }

  // Can be replaced with ES2024 implementation of Set.prototype.difference
  /**
   * Set difference between two sets A and B: A\B.
   *
   * @param {Set<string>} a   Initial set.
   * @param {Set<string>} b   Set to remove from A.
   * @returns {Set<string>}   The difference A\B.
   */
  public static setdifference(a: Set<string>, b: Set<string>): Set<string> {
    if (!a) {
      return new Set();
    }
    if (!b) {
      return a;
    }
    if ((a as any).difference) {
      return (a as any).difference(b);
    }
    return new Set([...a].filter((x) => !b.has(x)));
  }

}
