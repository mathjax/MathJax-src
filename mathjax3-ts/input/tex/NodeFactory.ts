import {TextNode, MmlNode, AbstractMmlNode, AbstractMmlEmptyNode} from '../../core/MmlTree/MmlNode.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';
import {Property, PropertyList} from '../../core/Tree/Node.js';
import {MmlFactory} from '../../core/MmlTree/MmlFactory.js';
import {Args} from './Types.js';
import {OperatorDef} from '../../core/MmlTree/OperatorDictionary.js';
import TexParser from './TexParser.js';
import {TreeHelper} from './TreeHelper.js';


export namespace NodeUtil {
  
  const factory: MmlFactory = new MmlFactory();

  export function createNode(kind: string, children: MmlNode[], def: any, text?: TextNode): MmlNode  {
    const node = factory.create(kind, {}, []);
    // If infinity or -1 remove inferred mrow
    // 
    // In all other cases replace inferred mrow with a regular mrow, before adding
    // children.
    const arity = node.arity;
    if (arity === Infinity || arity === -1) {
      if (children.length === 1 && children[0].isInferred) {
        node.setChildren(TreeHelper.getChildren(children[0]));
      } else {
        node.setChildren(children);
      }
    } else {
      let cleanChildren = [];
      for (let i = 0, child; child = children[i]; i++) {
        if (child.isInferred) {
          let mrow = factory.create('mrow', {}, TreeHelper.getChildren(child));
          TreeHelper.copyAttributes(child, mrow);
          cleanChildren.push(mrow);
        } else {
          cleanChildren.push(child);
        }
      }
      node.setChildren(cleanChildren);
    }
    if (text) {
      node.appendChild(text);
    }
    TreeHelper.setProperties(node, def);
    return node;
  };

  export function createToken(kind: string, def: any, text: string): MmlNode  {
    const textNode = TreeHelper.createText(text);
    return TreeHelper.createNode(kind, [], def, textNode);
  }

  export function createText(text: string): TextNode  {
    if (text == null) {
      return null;
    }
    let node = (factory.create('text') as TextNode).setText(text);
    return node;
  };

  export function createError(message: string): MmlNode  {
    let text = createText(message);
    let mtext = TreeHelper.createNode('mtext', [], {}, text);
    let error = TreeHelper.createNode('merror', [mtext], {});
    return error;
  };

}

export class NodeFactory {

  private factory: Map<string, (kind: string, ...rest: any[]) => MmlNode> =
    new Map([
      ['node', NodeUtil.createNode],
      ['token', NodeUtil.createToken],
      ['text', NodeUtil.createText],
      ['error', NodeUtil.createError],
    ]);

  public set(name: string, func: (kind: string, ...rest: any[]) => MmlNode) {
    this.factory.set(name, func);
  }

  public setCreators(maps: {[name: string]: (kind: string, ...rest: any[]) => MmlNode}) {
    for (let name in maps) {
      this.set(name, maps[name]);
    }
  }
  
  public create(name: string, ...rest: any[]): MmlNode {
    let func = this.factory.get(name) || this.factory.get('node');
    return func.apply(null, rest);
  }

}
