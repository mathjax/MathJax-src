// Depends on typescript 1.7.3

classParser = {};
classParser.extern = {};

classParser.extern.fs = require('fs');
classParser.extern.path = require('path');
classParser.extern.ts = require('typescript');

var ts = classParser.extern.ts;
var fs = classParser.extern.fs;
var path = classParser.extern.path;

//
// Some general utility files.
//
classParser.properties = function(expr) {
  for (var i in expr) {
    if (expr.hasOwnProperty(i)) {
      console.log(i);
    }
  }
};

classParser.filter = function(sources, name) {
  var kind = ts.SyntaxKind[name];
  return sources.filter(x => x.statements[0].body.statements[0].kind === kind);
};


classParser.findSource = function(sources, name) {
  return sources.find(x => x.baseName === name);
};

//
// Building UML Diagrams with dot
//

classParser.store = {};

classParser.sources = {};

classParser.WITH_METHODS = false;

/**
 *
 * @param {Source} source Source file.
 */
classParser.source = function(source) {
  classParser.sources[source.baseName] = [];
  source.statements.forEach(
    x => classParser.node(x, 0, source));
};

classParser.node = function(node, indentation, source) {
  var indent = new Array(indentation).join(' ');
  var store = {attrs: [], mods: [], node: node};
  switch (node.kind) {
  case ts.SyntaxKind['InterfaceDeclaration']:
    store.type = 'interface';
    store.attrs.push('color=green');
    break;
  case ts.SyntaxKind['ClassDeclaration']:
    store.type = 'class';
    break;
  case ts.SyntaxKind['EnumDeclaration']:
    store.type = 'enum';
    store.attrs.push('color=magenta');
    break;
  case ts.SyntaxKind['ModuleDeclaration']:
    if (node.parent.kind !== ts.SyntaxKind['SourceFile']) {
      store.type = 'namespace';
      store.attrs.push('color=cyan');
      break;
    }
  default:
    let name = classParser.getEnumName(source, node);
    if (name) {
      store.type = 'enum';
      store.attrs.push('color=magenta');
      classParser.store[name] = store;
      classParser.sources[source.baseName].push(store);
      classParser.modifiers(
        node.declarationList.declarations[0].mofifiers, store);
      store.extends = [];
      store.implements = [];
      if (classParser.WITH_METHODS) {
        classParser.methods(
          node.declarationList.declarations[0].initializer.properties, store);
      }
      return;
    }
    if (node.body) {
      node.body.statements.forEach(function(x) {
        classParser.node(x, indentation + 1, source);});
    }
    return;
  }
  classParser.block(node, store);
  classParser.store[node.name.text] = store;
  classParser.sources[source.baseName].push(store);
};

// Begin: Getting enums

classParser.getEnumName = function(source, statement) {
  let comments = ts.getJsDocComments(statement, source);
  if (!comments || !comments.length) {
    return '';
  }
  if (comments.some(x => classParser.jsDocIsEnum(source.text, x))) {
    return statement.declarationList.declarations[0].name.text;
  }
  return '';
};

classParser.jsDocIsEnum = function(str, doc) {
  let jsdoc = ts.parseIsolatedJSDocComment(
    str, doc.pos, doc.end - doc.pos);
  if (!jsdoc || !jsdoc.jsDocComment || !jsdoc.jsDocComment.tags) {
    return;
  }
  return jsdoc.jsDocComment.tags.some(x => x.tagName.text === 'enum');
};

// End: Getting enums

classParser.block = function(expr, store) {
  classParser.heritageClauses(expr.heritageClauses, store);
  classParser.modifiers(expr.modifiers, store);
  if (classParser.WITH_METHODS) {
    classParser.methods(expr.members ||
                        (expr.body && expr.body.statements), store);
  }
};

classParser.methods = function(members, store) {
  store.members = [];
  var valid = ['MethodDeclaration', 'MethodSignature',
               'EnumMember', 'PropertyAssignment', 'FunctionDeclaration'].
        map(x => ts.SyntaxKind[x]);
  for (var i = 0, member; member = members[i]; i++) {
    if (valid.indexOf(member.kind) === -1) {
      continue;
    }
    let meth = {name: member.name.text, attrs: [], mods: []};
    classParser.modifiers(member.modifiers, meth);
    store.members.push(meth);
  }
};


classParser.modifiers = function(modifiers, store) {
  store.modifiers = [];
  if (!modifiers) {
    return;
  }
  modifiers.forEach(x => store.modifiers.push(x.kind));
};

classParser.heritageClauses = function(clauses, store) {
  store.extends = [];
  store.implements = [];
  if (!clauses) {
    return;
  }
  for (var i = 0, clause; clause = clauses[i]; i++) {
    if (ts.SyntaxKind['ImplementsKeyword'] === clause.token) {
      clause.types.forEach(function(type) {
        store.implements.push(type.expression.text);
      });
    }
    if (ts.SyntaxKind['ExtendsKeyword'] === clause.token) {
      clause.types.forEach(function(type) {
        store.extends.push(type.expression.text);
      });
    }
  }
};

classParser.program = function(sources) {
  classParser.store = {};
  classParser.sources = {};
  sources.forEach(x => classParser.source(x));
};

classParser.dotFile = function(filename) {
  fs.writeFileSync(filename, classParser.dotOutput());
};

classParser.dotOutput = function() {
  let result = 'digraph structs {\n' +
        '  edge [dir=back];\n' +
        '  node [shape=record];\n';
  const rew = function(x) {return x === 'Node' ? '"Node"' : x;};
  for (let id in classParser.store) {
    let value = classParser.store[id];
    classParser.outputModifiers(value.modifiers, value);
    result += rew(id) + ' [';
    result += value.attrs.length ? value.attrs.join(', ') + ', ' : '';
    result += 'label="{ ';
    result += value.mods.length ? value.mods.join(' ') + ' ' : '';
    result += value.type + ' ' + id + ' | ';
    if (classParser.WITH_METHODS) {
      result += value.members.map(classParser.outputMethod).join('\\n');
    }
    result += '}"];\n';
    value.extends.forEach(x => result += rew(x) + ' -> ' + id +
                          '[label="extends"]\n');
    value.implements.forEach(x => result += rew(x) + ' -> ' + id +
                             '[label="implements"]\n');
  }
  result += '}\n';
  return result;
};

classParser.outputMethod = function(method) {
  classParser.outputModifiers(method.modifiers, method);
  return (method.mods.length ? method.mods.join(' ') + ' ' : '') + method.name;
};

classParser.outputModifiers = function(modifiers, store) {
  for (var i = 0, modifier; modifier = modifiers[i]; i++) {
    switch (modifier) {
    case ts.SyntaxKind['ExportKeyword']:
      break;
    case ts.SyntaxKind['AbstractKeyword']:
      store.attrs.push('color=blue');
      store.mods.push('abstract');
      break;
    case ts.SyntaxKind['PrivateKeyword']:
      store.attrs.push('color=red');
      store.mods.push('abstract');
      break;
    case ts.SyntaxKind['ProtectedKeyword']:
      store.mods.push('protected');
      break;
    case ts.SyntaxKind['StaticKeyword']:
      store.mods.push('static');
      break;
    default:
      break;
    }
  }
};

classParser.methodGraph = function(directory, output) {
  classParser.WITH_METHODS = true;
  classParser.transform(directory, output);
};

classParser.classGraph = function(directory, output) {
  classParser.WITH_METHODS = false;
  classParser.transform(directory, output);
};

classParser.transform = function(directory, output) {
  var sources = classParser.readDirectory(directory, 'ts');
  classParser.program(sources);
  classParser.dotFile(output);
};

// Current test directory.
// var directory = '/home/sorge/git/context-menu/scripts/ts/';


//
// The following code rewrites a Typescript interface spec into a closure style
// interface spec. This is useful for JSDoc generation and maybe later for
// closure compilation.
//
////TODO: Insert namespace prefix.

classParser.rewriteInterfaceFile = function(file) {
  var headerComments = ts.getJsDocComments(file.statements[0], file);
  var header = classParser.combinePartialContent(file.text, headerComments, '\n\n');

  ////TODO:  Here we have to search for the correct interface first!
  var base = file.statements[0].body.statements[0];
  var interfaceStr = classParser.rewriteInterface(base, file);
  return header + '\n\n\n\n' + interfaceStr;
};
  
classParser.rewriteInterface = function(interface, file) {
  var name = interface.name.text;
  var store = {};
  classParser.heritageClauses(interface.heritageClauses, store);

  var interfaceStr = '';
  interfaceStr += '/**\n * @interface\n';
  store.extends.forEach(x => interfaceStr += ' * @extends {' + x + '}\n');
  interfaceStr += ' */\n';
  interfaceStr += name + ' = function() {}\n';
  classParser.methods(interface.members, store);
  var methods = interface.members.map(
    x => classParser.interfaceMethod(x, name, file.text, file));
  return interfaceStr + '\n' + methods.join('\n');
};

classParser.interfaceMethod = function(method, name, string, interface) {
  var jsdoc = classParser.combinePartialContent(
    string, ts.getJsDocComments(method, interface));
  var methodStr = jsdoc ? jsdoc + '\n' : '';
  methodStr += name + '.prototype.' + method.name.text;
  methodStr += ' = function() {};\n';
  return methodStr;
};

classParser.combinePartialContent = function(str, positions, opt_separator) {
  var separator = (typeof opt_separator === 'undefined') ?
        '\n' : opt_separator;
  return positions.length ?
    positions.map(
      pos => classParser.getPartialContent(str, pos)).join(separator) :
    '';
};

classParser.getPartialContent = function(str, position) {
  return str.slice(position.pos, position.end);
};


//
// Reading files.
//
classParser.extMap = {
  'ts': 'ES6',
  'js': 'ES2015'
};

classParser.readFile = function(filename, ext) {
  var lang = classParser.extMap[ext];
  var file = ts.createSourceFile(filename, fs.readFileSync(filename).toString(),
                                 ts.ScriptTarget[lang], true);
  file.baseName = path.basename(filename, '.' + ext);
  return file;
};

classParser.readDirectory = function(directory, ext) {
  var files = classParser.walkDirectory(directory, ext);

  // fs.readdirSync(directory).
  //       filter(x => x.match(RegExp('.' + ext + '$')));
  return files.map(x => classParser.readFile(x, ext));
};


classParser.walkDirectory = function(dir, ext) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(classParser.walkDirectory(file, ext));
    } else if (file.match(RegExp('\.' + ext + '$')) &&
               !file.match(RegExp('\.d\.' + ext + '$'))) {
      results.push(file);
    }
  });
  return results;
};


//
// Rewriting transpiled Javascript files.
// NOTE: Needs info from store, i.e., ts files need to be parsed first!
//
classParser.cleanJSFile2015 = function(js) {
  if (js.statements.length !== 2) {
    throw 'Not a class definition';
  }
  let file = [];
  let expression = js.statements[1].expression.expression.expression.
        body.statements[0];
  if (expression.kind !== ts.SyntaxKind['ClassDeclaration']) {
    throw 'Not a class definition';
  }
  // The constructor computation. Can be very fragile!
  let classExpr = expression.members;
  let constructor = classExpr[0];
  let isConst = constructor.kind === ts.SyntaxKind['Constructor'];
  if (isConst && ts.getJsDocComments(constructor, js)) {
    file = file.concat(expression);
    return js.text;
  }
  var conStr = classParser.getPartialContent(js.text, constructor);
  var ws = conStr.match(/^\s+/)[0] || '\n';
  var commentStr = '';
  var store = classParser.store[expression.name.text];
  commentStr += ws + '/**' + ws + ' * @constructor';
  store.extends.forEach(x => commentStr += ws + ' * @extends {' + x + '}');
  store.implements.forEach(x => commentStr += ws + ' * @implements {' + x + '}');
  commentStr += ws + ' */';

  if (!isConst) {
    commentStr += ws + 'constructor(...args) {';
    commentStr += ws + '    super(...args);';
    commentStr += ws + '}';
  }
  var pos = constructor.pos;
  var start = classParser.getPartialContent(
    js.text, {pos: 0, end: pos});
  var end = classParser.getPartialContent(js.text, {pos: pos, end: js.end});
  return start + commentStr + end;
};


// Generate JSDoc with proper enums and interface handling.
//
// Parse .ts sources.
// Find all interfaces and enums.
//
// Parse .js and rewrite sources.
// Add
//
// What if we have a real typescript enum?
// 
// Some issues:
//
// - JSDoc includes the JS sources, which we want to replace by .ts source
// files.
// - Links into the sources will be wrong but we will ignore that for now
//

classParser.makeJSDoc = function(tsDir, jsDir, outDir) {
  var tsFiles = classParser.readDirectory(tsDir, 'ts');
  var jsFiles = classParser.readDirectory(jsDir, 'js');
  var cleanJS = {};
  classParser.program(tsFiles);
  for (var i = 0, file; file = jsFiles[i]; i++) {
    try {
      cleanJS[file.baseName] = classParser.cleanJSFile2015(file);
    } catch (e) {
      cleanJS[file.baseName] =
        classParser.addInterfacesEnums(
          classParser.findSource(tsFiles, file.baseName),
          file.baseName, file);
    }
    var dir = outDir + file.baseName + '.js';
    if (cleanJS[file.baseName]) {
      fs.writeFileSync(dir, cleanJS[file.baseName]);
    }
  }
};

// test multiple namespaces!
classParser.addInterfacesEnums = function(src, name, js) {
  var elements = classParser.sources[name];
  var comment = classParser.getComment(js, src);
  var file = '';
  for (var i = 0, element; element = elements[i]; i++) {
    switch (element.type) {
    case 'enum':
      file += classParser.rewriteEnum(element.node, src);
      break;
    case 'interface':
      file += classParser.rewriteInterface(element.node, src);
      break;
    case 'namespace':
      file += classParser.rewriteNamespace(element.node, js);
      break;
    default:
      break;
    }
  }
  return comment + '\n' + file;
};

classParser.rewriteEnum = function(node, src) {
  var commentNode = ts.getJsDocComments(node, src);
  var comment = classParser.combinePartialContent(src.text, commentNode);
  if (node.kind === ts.SyntaxKind['EnumDeclaration']) {
    var members = classParser.getPartialContent(src.text, node.members);
    return comment + '\nconst ' + node.name.text + ' = {' +
      members.replace(/ = /, ' : ') + '\n}\n\n';
  }
  var declaration = node.declarationList.declarations[0];
  var body = classParser.getPartialContent(src.text, declaration.initializer);
  return comment + '\n' + declaration.name.text + ' = ' + body + '\n\n';
};


classParser.getComment = function(jsFile, tsFile) {
  if (!jsFile.statements.length) {
    return classParser.combinePartialContent(
      tsFile.text, ts.getJsDocComments(tsFile.statements[0], tsFile));
  }
  let comment = classParser.getPartialContent(
    jsFile.text, jsFile.statements[0]);
  let newline = comment.lastIndexOf('\n');
  return classParser.getPartialContent(jsFile.text, {pos: 0, end: newline + 1});
};

/**
 * Rewrites an ordinary utility function namespace.
 */
classParser.rewriteNamespace = function(node, js) {
  if (js.statements.length !== 2) {
    throw 'Not a namespace definition';
  }
  // Top level comment
  let file = [];
  let expression = js.statements[1].expression.expression.expression.
        body.statements[0];
  let body = js.statements[1].expression.expression.expression.
        body.statements[1];
  if (body.kind !== ts.SyntaxKind['ExpressionStatement']) {
    throw 'Not a namespace definition';
  }
  file.push(expression);
  let namespaceExpr = expression.declarationList.declarations[0].name.text;
  let functions = body.expression.expression.expression.body.statements;
  file.push({pos: body.pos, end: functions[0] ? functions[0].pos : body.end});
  let output = '';
  for (var i = 0, expr; expr = functions[i]; i++) {
    var equation = functions[i + 1];
    if (expr.kind === ts.SyntaxKind['FunctionDeclaration'] &&
        equation && equation.kind === ts.SyntaxKind['ExpressionStatement'] &&
        equation.expression.kind === ts.SyntaxKind['BinaryExpression'] &&
        equation.expression.left.name.text === expr.name.text) {
      output += classParser.swapExpressions(js, expr, equation);
      i++;
    } else {
      output += classParser.getPartialContent(js.text, expr);
    }
  }
  var end = functions.length ?
        classParser.getPartialContent(
          js.text, {pos: functions[functions.length - 1].end, end: body.end}) :
      '';
  return classParser.combinePartialContent(js.text, file) + output + end;
};


classParser.swapExpressions = function(js, func, equ) {
  var commentNode = ts.getJsDocComments(func, js);
  var min = commentNode.map(x => x.pos).reduce(Math.min) || func.pos;
  var max = commentNode.map(x => x.end).reduce(Math.max) || func.pos;
  var start = classParser.getPartialContent(js.text, {pos: func.pos, end: min});
  var comment = classParser.combinePartialContent(js.text, commentNode);
  var funcBody = classParser.getPartialContent(
    js.text, {pos: max + 1, end: func.end});
  var equString = classParser.getPartialContent(js.text, equ);
  return start + comment + equString + '\n' + funcBody;
};
