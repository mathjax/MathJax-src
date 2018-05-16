/*************************************************************
 *
 *  MathJax/jax/input/TeX/imp.js
 *  
 *  Implements the TeX InputJax that reads mathematics in
 *  TeX and LaTeX format and converts it to the MML ElementJax
 *  internal format.
 *
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2009-2017 The MathJax Consortium
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


import {AbstractMmlNode, AbstractMmlEmptyNode} from '../../../../../mathjax3/core/MmlTree/MmlNode.js';
import {MmlFactory} from '../../../../../mathjax3/core/MmlTree/MmlFactory.js';
import {JsonMmlVisitor} from '../../../../../mathjax3/core/MmlTree/JsonMmlVisitor.js';

// Intermediate parser namespace
export let imp = {};

imp.NEW = true;
imp.STACKS = true;
imp.MML = null;
imp.factory = new MmlFactory();
imp.visitor = new JsonMmlVisitor();
imp.attrs = ['autoOP',
             'fnOP',
             'movesupsub',
             'subsupOK',
             'texprimestyle',
             'useHeight',
             'variantForm',
             'texWithDelims',
             'open',
             'close'
            ];
imp.methodOut = false;
imp.defOut = false;
imp.jsonOut = false;
imp.simpleOut = false;


imp.createNode = function(type, children, def, text) {
  if (imp.NEW) {
    var node = imp.factory.create(type, def, children);
    if (text) {
      node.appendChild(text);
    }
  } else {
    node = (typeof text === 'undefined') ?
      imp.MML[type].apply(imp.MML, children) : imp.MML[type](text);
  }
  imp.setProperties(node, def);
  imp.printJSON(node);
  return node;
};


imp.createText = function(text) {
  if (text == null) {
    return null;
  }
  var node = imp.NEW ? imp.factory.create('text').setText(text) : imp.MML.chars(text);
  imp.printJSON(node);
  return node;
};


imp.createEntity = function(code) {
  return imp.createText(String.fromCharCode(parseInt(code,16)));
};


imp.createError = function(message) {
  if (!imp.NEW) {
    return imp.MML.Error(message);
  }
  var text = imp.createText(message);
  var mtext = imp.createNode('mtext', [], {}, text);
  var error = imp.createNode('merror', [mtext], {});
  return error;
};


imp.createMath = function(math) {
  if (!imp.NEW) {
    return math.inferred ? imp.MML.apply(imp.MML, math.data) : imp.MML(math);
  }
  if (math.isInferred) {
    var mathNode = imp.createNode('math', [math], {});
  } else {
    // TODO: We should not need this case!
    if (math.isKind('mrow') && !math.isKind('math')) {
      mathNode = imp.createNode('math', [], {});
      var inferredMrow = mathNode.childNodes[0];
      inferredMrow.attributes = math.attributes;
      imp.setProperties(inferredMrow, math.getAllProperties());
      mathNode.setChildren(math.childNodes);
    } else if (!math.isKind('math')) {
      mathNode = imp.createNode('math', [math], {});
    } else {
      mathNode = math;
    }
  }
  return mathNode;
};


imp.getRoot = function(tree) {
  return imp.NEW ? tree : tree.root;
};

imp.getChildren = function(node) {
  return imp.NEW ? node.childNodes : node.data;
};


imp.getText = function(node) {
  return imp.NEW ? node.getText() : node.data.join('');
};


imp.appendChildren = function(node, children) {
  if (imp.NEW) {
    for (let child of children) {
      node.appendChild(child);
    }
  } else {
    node.Append.apply(node, children);
  }
};


imp.setAttribute = function(node, attribute, value) {
  if (imp.NEW) {
    node.attributes.set(attribute, value);
  } else {
    node[attribute] = value;
  }
};


// Sets properties and attributes.
imp.setProperties = function(node, properties) {
  imp.printDef(properties);
  if (imp.NEW) {
    for (const name of Object.keys(properties)) {
      let value = properties[name];
      if (name === 'texClass') {
        node.texClass = value;
      } else if (name === 'movablelimits') {
        node.setProperty('movablelimits', value);
        if (node.isKind('mo') || node.isKind('mstyle')) {
          node.attributes.set('movablelimits', value);
        }
      } else if (name === 'inferred') {
        // ignore
      } else if (imp.attrs.indexOf(name) !== -1) {
        node.setProperty(name, value);
      } else {
        // TODO: Check with Davide if this is correct.
        let inherited = node.attributes.getInherited(name);
        if (inherited !== value) {
          node.attributes.set(name, value);
        }
      }
    }
  } else {
    node.With(properties);
  }
};


imp.getProperty = function(node, property) {
  return imp.NEW ? node.getProperty(property) : node.Get(property);
};


imp.getAttribute = function(node, attr) {
  return imp.NEW ? node.attributes.get(attr) : node.Get(attr);
}


imp.getChildAt = function(node, position) {
  return imp.NEW ? node.childNodes[position] : node.data[position];
};


imp.setData = function(node, position, item) {
  if (imp.NEW) {
    let children = node.childNodes;
    children[position] = item;
    if (item) {
      item.parent = node;
    }
    node.setTeXclass(null);
    // for (let child of node.childNodes) {
    //   if (child) {console.log(child.parent)};
    // }
  } else {
    node.SetData(position, item);
  }
};


imp.copyChildren = function(oldNode, newNode) {
  let children = imp.NEW ? oldNode.childNodes : oldNode.data;
  for (let i = 0; i < children.length; i++) {
    imp.setData(newNode, i, children[i]);
  }
};


imp.copyAttributes = function(oldNode, newNode) {
  if (imp.NEW) {
    newNode.attributes = oldNode.attributes;
    imp.setProperties(newNode, oldNode.properties);
  } else {
    for (const id in newNode.defaults) {
      if (newNode.defaults.hasOwnProperty(id) && oldNode[id] != null) {
        newNode[id] = oldNode[id];
      }
    }
    for (const id in imp.MML.copyAttributes) {
      if (imp.MML.copyAttributes.hasOwnProperty(id) && oldNode[id] != null) {
        newNode[id] = oldNode[id];
      }
    }
  }
};


imp.isType = function(node, type) {
  return imp.NEW ? node.isKind(type) : node.isa(imp.MML[type]);
};

imp.isEmbellished = function(node) {
  return imp.NEW ? node.isEmbellished : node.isEmbellished();
};

imp.getTexClass = function(node) {
  return imp.NEW ? node.texClass : node.Get('texClass');
};

imp.getCore = function(node) {
  return imp.NEW ? node.core() : node.Core();
};

imp.getCoreMO = function(node) {
  return imp.NEW ? node.coreMO() : node.CoreMO();
};


imp.cleanSubSup = function(node) {
  if (!imp.NEW) {
    return node;
  }
  let rewrite = [];
  node.walkTree((n, d) => {
    const children = n.childNodes;
    if ((n.isKind('msubsup') && (!children[n.sub] || !children[n.sup])) ||
        (n.isKind('munderover') && (!children[n.under] || !children[n.over]))) {
      d.unshift(n);
    }
  }, rewrite);
  for (const n of rewrite) {
    const children = n.childNodes;
    const parent = n.parent;
    let newNode = (n.isKind('msubsup')) ?
          (children[n.sub] ?
           imp.createNode('msub', [children[n.base], children[n.sub]], {}) :
           imp.createNode('msup', [children[n.base], children[n.sup]], {})) :
        (children[n.under] ?
         imp.createNode('munder', [children[n.base], children[n.under]], {}) :
         imp.createNode('mover', [children[n.base], children[n.over]], {}));
    if (parent) {
      parent.replaceChild(newNode, n);
    } else {
      node = newNode;
    }
  }
  return node;
};

imp.printSimple = function(txt) {
  if (imp.simpleOut) {
    console.log(txt);
  }
};

imp.untested = function(kind) {
  console.log('Untested case ' + kind);
};

imp.printMethod = function(text) {
  if (imp.methodOut) {
    console.log('In ' + text);
  }
};

imp.printNew = function(node) {
  console.log(imp.visitor.visitNode(node));
};

imp.printOld = function(node) {
  var mmlNode = node.toMmlNode(imp.factory);
  console.log(imp.visitor.visitNode(mmlNode));  
};


imp.printJSON = function(node) {
  if (imp.jsonOut) {
    if (imp.NEW) {
      imp.printNew(node);
    } else {
      imp.printOld(node);
    }
  }
};

imp.printDef = function(def) {
  if (imp.methodOut && imp.defOut) {
    console.log('With:');
    for (var x in def) {
      console.log(x + ': ' + def[x]);
    }
  }
};


imp.isNode = function(item) {
  return imp.NEW ?
    (item instanceof AbstractMmlNode || item instanceof AbstractMmlEmptyNode) :
    item instanceof imp.MML.mbase;
};


imp.isInferred = function(node) {
  return imp.NEW ? node.isInferred : node.inferred;
};
