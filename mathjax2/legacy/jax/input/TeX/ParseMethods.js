// import * as sitem from './StackItem.js';
import * as sitem from '../../../../../mathjax3/input/tex/StackItem.js';
import {imp} from './imp.js';
import TexError from '../../../../../mathjax3/input/tex/TexError.js';
import {TEXCLASS} from '../../../../../mathjax3/core/MmlTree/MmlNode.js';
import {TexConstant} from '../../../../../mathjax3/input/tex/TexConstants.js';
import {ParserUtil} from './ParserUtil.js';
import {OldParser} from './Parser.js';


// Namespace
export let ParseMethods = {};
// Legacy objects.
ParseMethods.STACKITEM = null;
ParseMethods.OLD_PARSER = null;
ParseMethods.NEW_PARSER = null;

ParseMethods.PRIME = "\u2032";
ParseMethods.SMARTQUOTE = "\u2019";
ParseMethods.NUMBER = /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/;
ParseMethods.NBSP = "\u00A0"; 
ParseMethods.P_HEIGHT = 1.2 / .85;   // cmex10 height plus depth over .85


/************************************************************************/
/*
 *   Handle various token classes
 */

/*
 *  Lookup a control-sequence and process it
 */
ParseMethods.ControlSequence = function(parser, c) {
  imp.printMethod("ControlSequence");
  var name = parser.GetCS();
  ParseMethods.NEW_PARSER.parse('macro', [name, this]);
};

//
//  Look up a macro in the macros list
//  (overridden in begingroup extension)
//
// csFindMacro: function(name) {return TEXDEF.macros[name]},
//
//  Handle normal mathchar (as an mi)
//
ParseMethods.csMathchar0mi = function(parser, mchar) {
  imp.printMethod("csMathchar0mi");
  var def = mchar.attributes || {mathvariant: TexConstant.Variant.ITALIC};
  // @test Greek
  var textNode = imp.createText(mchar.char);
  var node = imp.createNode('mi', [], def, textNode);
  // VS: OLD
  // var node = parser.mmlToken(MML.mi(mchar.char).With(def));
  parser.Push(parser.mmlToken(node));
};

//
//  Handle normal mathchar (as an mo)
//
ParseMethods.csMathchar0mo = function(parser, mchar) {
  imp.printMethod("csMathchar0mo");
  var def = mchar.attributes || {};
  def.stretchy = false;
  // @test Large Set
  var textNode = imp.createText(mchar.char);
  var node = imp.createNode('mo', [], def, textNode);
  // PROBLEM: Attributes stop working when Char7 are explicitly set.
  // VS: OLD
  // var node = parser.mmlToken(MML.mo(mchar.char).With(def))
  parser.Push(parser.mmlToken(node));
};
//
//  Handle mathchar in current family
//
ParseMethods.csMathchar7 = function(parser, mchar) {
  imp.printMethod("csMathchar7");
  var def = mchar.attributes || {mathvariant: TexConstant.Variant.NORMAL};
  if (parser.stack.env.font) {
    // @test MathChar7 Single Font
    def.mathvariant = parser.stack.env.font;
  }
  // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
  var textNode = imp.createText(mchar.char);
  var node = imp.createNode('mi', [], def, textNode);
  // setVariant(node, def.mathvariant);
  // PROBLEM: Attributes have to be explicitly set, but then interfere with
  // AMS tests. Try setting variant of node!
  // for (var x in def) {
  //   node.attributes.set(x, def[x]);
  // }
  // VS: OLD
  // var node = MML.mi(mchar.char).With(def);
  parser.Push(parser.mmlToken(node));
};
//
//  Handle delimiter
//
ParseMethods.csDelimiter = function(parser, delim) {
  imp.printMethod("csDelimiter");
  var def = delim.attributes || {};
  // @test Fenced2, Delimiter (AMS)
  def = Object.assign({fence: false, stretchy: false}, def);
  var textNode = imp.createText(delim.char);
  var node = imp.createNode('mo', [], def, textNode);
  // var node = MML.mo(textNode).With({fence: false, stretchy: false}).With(def); 
  // VS: OLD
  // var node = MML.mo(delim.char).With({fence: false, stretchy: false}).With(def); 
  parser.Push(parser.mmlToken(node));
};
//
//  Handle undefined control sequence
//  (overridden in noUndefined extension)
//
ParseMethods.csUndefined = function(parser, name) {
  imp.printMethod("csUndefined");
  throw new TexError(["UndefinedControlSequence","Undefined control sequence %1",'\\' + name]);
};

ParseMethods.envUndefined = function(parser, env) {
  imp.printMethod("envUndefined");
  throw new TexError(["UnknownEnv", "Unknown environment '%1'", env]);
};

/*
 *  Handle a variable (a single letter)
 */
ParseMethods.Variable = function(parser, c) {
  imp.printMethod("Variable");
  var def = {};
  if (parser.stack.env.font) {
    // @test Identifier Font
    def.mathvariant = parser.stack.env.font;
  }
  // @test Identifier
  var textNode = imp.createText(c);
  var node = imp.createNode('mi', [], def, textNode);
  // VS: OLD
  // node = MML.mi(MML.chars(c)).With(def);
  parser.Push(parser.mmlToken(node));
};

/*
 *  Determine the extent of a number (pattern may need work)
 */
ParseMethods.Number = function(parser, c) {
  imp.printMethod("Number");
  var mml, n = parser.string.slice(parser.i-1).match(ParseMethods.NUMBER);
  var def = {};
  if (parser.stack.env.font) {
    // @test Integer Font
    def.mathvariant = parser.stack.env.font;
  }
  if (n) {
    // @test Integer, Number
    var textNode = imp.createText(n[0].replace(/[{}]/g,""));
    mml = imp.createNode('mn', [], def, textNode);
    parser.i += n[0].length - 1;
  } else {
    // @test Decimal
    var textNode = imp.createText(c);
    mml = imp.createNode('mo', [], def, textNode);
  }
  parser.Push(parser.mmlToken(mml));
  // VS: OLD
  // if (n) {mml = MML.mn(n[0].replace(/[{}]/g,"")); parser.i += n[0].length - 1}
  // else {mml = MML.mo(MML.chars(c))}
  // if (parser.stack.env.font) {mml.mathvariant = parser.stack.env.font}
  // parser.Push(parser.mmlToken(mml));
};

/*
 *  Handle { and }
 */
ParseMethods.Open = function(parser, c) {
  parser.Push(imp.STACKS ? new sitem.OpenItem() : ParseMethods.STACKITEM.open());
};
ParseMethods.Close = function(parser, c) {
  parser.Push(imp.STACKS ? new sitem.CloseItem() : ParseMethods.STACKITEM.close());
};

/*
 *  Handle tilde and spaces
 */
ParseMethods.Tilde = function(parser, c) {
  // @test Tilde, Tilde2
  // 
  // TODO: Once we can properly load AllEntities, this should be the line.
  // var textNode = imp.createText(MmlEntities.ENTITIES.nbsp);
  var textNode = imp.createText(ParseMethods.NBSP);
  var node = imp.createNode('mtext', [], {}, textNode);
  // VS: OLD
  // node = MML.mtext(MML.chars(NBSP))
  parser.Push(node);
};
ParseMethods.Space = function(parser, c) {};

/*
 *  Handle ^, _, and '
 */
ParseMethods.Superscript = function(parser, c) {
  imp.printMethod("Superscript");
  if (parser.GetNext().match(/\d/)) {
    // don't treat numbers as a unit
    parser.string = parser.string.substr(0,parser.i+1)+" "+parser.string.substr(parser.i+1);
  }
  var primes, base, top = parser.stack.Top();
  if (top.hasType('prime')) {
    // @test Prime on Prime
    base = top.data[0];
    primes = top.data[1];
    parser.stack.Pop();
  } else {
    // @test Empty base2, Square, Cube
    base = parser.stack.Prev();
    if (!base) {
      // @test Empty base
      var textNode = imp.createText("");
      base = imp.createNode('mi', [], {}, textNode);
      // VS: OLD
      // base = MML.mi("");
    }
  }
  if (base.isEmbellishedWrapper) {
    // TODO: Warning, those are childNodes now!
    // base = base.data[0].data[0];
    base = imp.getChildAt(imp.getChildAt(base, 0), 0);
  }
  var movesupsub = imp.getProperty(base, 'movesupsub');
  var position = imp.isType(base, "msubsup") ? base.sup : base.over;
  // var movesupsub = base.movesupsub, position = base.sup;
  if ((imp.isType(base, "msubsup") && imp.getChildAt(base, base.sup)) ||
      (imp.isType(base, "munderover") && imp.getChildAt(base, base.over) && !imp.getProperty(base, 'subsupOK'))) {
    // @test Double-super-error, Double-over-error
    throw new TexError(["DoubleExponent","Double exponent: use braces to clarify"]);
  }
  if (!imp.isType(base, "msubsup")) {
    imp.printSimple('Case 1');
    if (movesupsub) {
      imp.printSimple('Case 2');
      // @test Move Superscript, Large Operator
      if (!imp.isType(base, "munderover") || imp.getChildAt(base, base.over)) {
        imp.printSimple('Case 3');
        if (imp.getProperty(base, 'movablelimits') && imp.isType(base, 'mi')) {
          // @test Mathop Super
          base = ParseMethods.mi2mo(base);
        }
        // @test Large Operator
        base = imp.createNode('munderover', [base], {movesupsub:true});
        // VS: OLD
        // base = MML.munderover(base,null,null).With({movesupsub:true});
      }
      position = base.over;
    } else {
      imp.printSimple('Case 4');
      // @test Empty base, Empty base2, Square, Cube
      base = imp.createNode('msubsup', [base], {});
      // VS: OLD
      // base = MML.msubsup(base,null,null);
      position = base.sup;
    }
  }
  parser.Push(imp.STACKS ?
            new sitem.SubsupItem(base).With({
              position: position, primes: primes, movesupsub: movesupsub
            }) :
            ParseMethods.STACKITEM.subsup(base).With({
              position: position, primes: primes, movesupsub: movesupsub
            }));
};
ParseMethods.Subscript = function(parser, c) {
  imp.printMethod("Subscript");
  if (parser.GetNext().match(/\d/)) {
    // don't treat numbers as a unit
    parser.string = parser.string.substr(0,parser.i+1)+" "+parser.string.substr(parser.i+1);
  }
  var primes, base, top = parser.stack.Top();
  if (top.hasType('prime')) {
    // @test Prime on Sub
    base = top.data[0]; primes = top.data[1];
    parser.stack.Pop();
  } else {
    base = parser.stack.Prev();
    if (!base) {
      // @test Empty Base Indes
      var textNode = imp.createText("");
      base = imp.createNode('mi', [], {}, textNode);
      // VS: OLD
      // base = MML.mi("");
    }
  }
  if (base.isEmbellishedWrapper) {
    // TODO: Warning, those are childNodes now!
    base = imp.getChildAt(imp.getChildAt(base, 0), 0);
  }
  var movesupsub = imp.getProperty(base, 'movesupsub');
  var position = imp.isType(base, "msubsup") ? base.sub : base.under;
  // var movesupsub = base.movesupsub, position = base.sub;
  if ((imp.isType(base, "msubsup") && imp.getChildAt(base, base.sub)) ||
      (imp.isType(base, "munderover") && imp.getChildAt(base, base.under) &&
       !imp.getProperty(base, 'subsupOK'))) {
    // @test Double-sub-error, Double-under-error
    throw new TexError(["DoubleSubscripts","Double subscripts: use braces to clarify"]);
  }
  if (!imp.isType(base, "msubsup")) {
    if (movesupsub) {
      // @test Large Operator, Move Superscript
      if (!imp.isType(base, "munderover") || imp.getChildAt(base, base.under)) {
        if (imp.getProperty(base, 'movablelimits') && imp.isType(base, 'mi')) {
          // @test Mathop Sub
          base = ParseMethods.mi2mo(base);
        }
        // @test Move Superscript
        base = imp.createNode('munderover', [base], {movesupsub:true});
        // VS: OLD
        // base = MML.munderover(base,null,null).With({movesupsub:true});
      }
      position = base.under;
    } else {
      // @test Empty Base Index, Empty, Base Index2, Index
      base = imp.createNode('msubsup', [base], {});
      // VS: OLD
      // base = MML.msubsup(base,null,null);
      position = base.sub;
    }
  }
  parser.Push(imp.STACKS ?
            new sitem.SubsupItem(base).With({
              position: position, primes: primes, movesupsub: movesupsub
            }) :
            ParseMethods.STACKITEM.subsup(base).With({
              position: position, primes: primes, movesupsub: movesupsub
            }));
};

ParseMethods.Prime = function(parser, c) {
  // @test Prime
  var base = parser.stack.Prev();
  if (!base) {
    // @test PrimeSup, PrePrime, Prime on Sup
    base = imp.createNode('mi', [], {});
    // VS: OLD
    // base = MML.mi();
  }
  if (imp.isType(base, "msubsup") && imp.getChildAt(base, base.sup)) {
    // @test Double Prime Error
    throw new TexError(["DoubleExponentPrime",
                        "Prime causes double exponent: use braces to clarify"]);
  }
  var sup = ""; parser.i--;
  do {sup += ParseMethods.PRIME; parser.i++, c = parser.GetNext()}
  while (c === "'" || c === ParseMethods.SMARTQUOTE);
  sup = ["","\u2032","\u2033","\u2034","\u2057"][sup.length] || sup;
  var textNode = imp.createText(sup);
  var node = imp.createNode('mo', [], {}, textNode);
  // VS: OLD
  // var node = MML.mo(sup);
  parser.Push(imp.STACKS ?
            new sitem.PrimeItem(base, parser.mmlToken(node)) :
            ParseMethods.STACKITEM.prime(base, parser.mmlToken(node)));
};

/*
 *  Handle comments
 */
ParseMethods.Comment = function(parser, c) {
  imp.printMethod("Comment");
  while (parser.i < parser.string.length && parser.string.charAt(parser.i) != "\n") {parser.i++}
};

/*
 *  Handle hash marks outside of definitions
 */
ParseMethods.Hash = function(parser, c) {
  imp.printMethod("Hash");
  // @test Hash Error
  throw new TexError(["CantUseHash1",
                      "You can't use 'macro parameter character #' in math mode"]);
};

/*
 *  Handle other characters (as <mo> elements)
 */
ParseMethods.Other = function(parser, c) {
  imp.printMethod("Other");
  var def = {}, mo;
  if (parser.stack.env.font) {
    // @test Other Font
    def = {mathvariant: parser.stack.env.font};
  }

  var remap = parser.remap.lookup(c);
  // @test Other
  // @test Other Remap
  var textNode = imp.createText(remap ? remap.char : c);
  mo = imp.createNode('mo', [], def, textNode);
  // VS: OLD
  // mo = remap ? MML.mo(remap.char).With(def) : MML.mo(c).With(def);
  // VS: Question: What do these autoDefault methods do exactly.
  //     Is there a modern equivalent in v3?
  // 
  //   This changes the operator class, when fences are put around it. Just
  //   propagate from the inherited attributes or properties.
  // TODO: Currently just omitted!
  if (!imp.NEW && mo.autoDefault("stretchy",true)) {
    // @test A Rogers-Ramanujan Identity
    mo.stretchy = false;
  }
  if (!imp.NEW && mo.autoDefault("texClass",true) == "") {
    // @test A Rogers-Ramanujan Identity
    mo = imp.createNode('TeXAtom', [mo], {});
    // VS: OLD
    // mo = MML.TeXAtom(mo);
  }
  parser.Push(parser.mmlToken(mo));
};

/************************************************************************/
/*
 *   Macros
 */

ParseMethods.SetFont = function(parser, name,font) {parser.stack.env.font = font};
ParseMethods.SetStyle = function(parser, name,texStyle,style,level) {
  imp.printMethod("SetStyle: " + name + " texStyle: " + texStyle +
                  " style: " + style + " level: " + level);
  parser.stack.env.style = texStyle; parser.stack.env.level = level;
  parser.Push(imp.STACKS ?
            new sitem.StyleItem().With({styles: {displaystyle: style, scriptlevel: level}}) :
            ParseMethods.STACKITEM.style().With({styles: {displaystyle: style, scriptlevel: level}}));
};
ParseMethods.SetSize = function(parser, name,size) {
  imp.printMethod("SetSize");
  parser.stack.env.size = size;
  parser.Push(imp.STACKS ?
            new sitem.StyleItem().With({styles: {mathsize: size+"em"}}) :
            ParseMethods.STACKITEM.style().With({styles: {mathsize: size+"em"}})); // convert to absolute?
};

// Look at color extension!
ParseMethods.Color = function(parser, name) {
  imp.printMethod("Color");
  // @test Color Frac
  var color = parser.GetArgument(name);
  var old = parser.stack.env.color;
  parser.stack.env.color = color;
  var math = parser.ParseArg(name);
  if (old) {parser.stack.env.color} else {delete parser.stack.env.color}
  var node = imp.createNode('mstyle', [math], {mathcolor: color});
  // VS: OLD
  // var node = MML.mstyle(math).With({mathcolor: color});
  parser.Push(node);
};

ParseMethods.Spacer = function(parser, name,space) {
  // @test Positive Spacing, Negative Spacing
  var node = imp.createNode('mspace', [],
                            {width: space, mathsize: TexConstant.Size.NORMAL, scriptlevel:0});
  // VS: OLD
  // var node = MML.mspace().With({width: space, mathsize: MML.SIZE.NORMAL, scriptlevel:0});
  parser.Push(node);
};

ParseMethods.LeftRight = function(parser, name) {
  imp.printMethod("LeftRight");
  // @test Fenced, Fenced3
  var alpha = name.substr(1);
  parser.Push(imp.STACKS ?
            // TODO: Sort this out: Uppercase the first character and add Item!
            new sitem[alpha[0].toUpperCase() + alpha.slice(1) + 'Item']()
            .With({delim: parser.GetDelimiter(name)}) :
            ParseMethods.STACKITEM[alpha]().With({delim: parser.GetDelimiter(name)}));
};

ParseMethods.Middle = function(parser, name) {
  imp.printMethod("Middle");
  // @test Middle
  var delim = parser.GetDelimiter(name);
  var node = imp.createNode('TeXAtom', [], {texClass:TEXCLASS.CLOSE});
  // VS: OLD
  // var node = MML.TeXAtom().With({texClass:TEXCLASS.CLOSE});
  parser.Push(node);
  if (!parser.stack.Top().hasType('left')) {
    // @test Orphan Middle, Middle with Right
    throw new TexError(["MisplacedMiddle","%1 must be within \\left and \\right",name]);
  }
  var textNode = imp.createText(delim);
  node = imp.createNode('mo', [], {stretchy:true}, textNode);
  // VS: OLD
  // node = MML.mo(delim).With({stretchy:true});
  parser.Push(node);
  node = imp.createNode('TeXAtom', [], {texClass:TEXCLASS.OPEN});
  // VS: OLD
  // node = MML.TeXAtom().With({texClass:MML.TEXCLASS.OPEN});
  parser.Push(node);
};

ParseMethods.NamedFn = function(parser, name,id) {
  imp.printMethod("NamedFn");
  // @test Named Function
  if (!id) {id = name.substr(1)};
  var textNode = imp.createText(id);
  var mml = imp.createNode('mi', [], {texClass: TEXCLASS.OP}, textNode);
  // VS: OLD
  // var mml = MML.mi(id).With({texClass: MML.TEXCLASS.OP});
  parser.Push(imp.STACKS ? new sitem.FnItem(parser.mmlToken(mml)) :
            ParseMethods.STACKITEM.fn(parser.mmlToken(mml)));
};
ParseMethods.NamedOp = function(parser, name,id) {
  imp.printMethod("NamedOp");
  // @test Limit
  if (!id) {id = name.substr(1)};
  id = id.replace(/&thinsp;/,"\u2006");
  var text = imp.createText(id);
  var mml = imp.createNode('mo', [], {
    movablelimits: true,
    movesupsub: true,
    form: TexConstant.Form.PREFIX,
    texClass: TEXCLASS.OP
  }, text);
  // VS: OLD
  // var mml = MML.mo(id).With({
  //   movablelimits: true,
  //   movesupsub: true,
  //   form: MML.FORM.PREFIX,
  //   texClass: MML.TEXCLASS.OP
  // });
  // TODO: Sort this out with get('form');
  // mml.useMMLspacing &= ~mml.SPACE_ATTR.form;  // don't count this explicit form setting
  parser.Push(parser.mmlToken(mml));
};

ParseMethods.Limits = function(parser, name,limits) {
  imp.printMethod("Limits");
  // @test Limits
  var op = parser.stack.Prev("nopop");
  if (!op || (imp.getTexClass(op) !== TEXCLASS.OP &&
              imp.getProperty(op, 'movesupsub') == null)) {
    // @test Limits Error
    throw new TexError(["MisplacedLimits","%1 is allowed only on operators",name]);
  }
  var top = parser.stack.Top();
  if (imp.isType(op, "munderover") && !limits) {
    // @test Limits UnderOver
    var node = imp.createNode('msubsup', [], {});
    imp.copyChildren(op, node);
    // VS: OLD
    // var node = MML.msubsup.apply(MML.subsup,op.data);
    op = top.data[top.data.length-1] = node;
  } else if (imp.isType(op, "msubsup") && limits) {
    // @test Limits SubSup
    // node = imp.createNode('munderover', imp.getChildren(op), {});
    // Needs to be copied, otherwise we get an error in MmlNode.appendChild!
    node = imp.createNode('munderover', [], {});
    imp.copyChildren(op, node);
    // VS: OLD
    // node = MML.munderover.apply(MML.underover,op.data);
    op = top.data[top.data.length-1] = node;
  }
  // TODO: Turns this into properties.
  imp.setProperties(op, {'movesupsub': limits ? true : false});
  imp.setProperties(imp.getCore(op), {'movablelimits': false});
  if (imp.getProperty(op, 'movablelimits')) {
    imp.setProperties(op, {'movablelimits': false});
  }
};

ParseMethods.Over = function(parser, name,open,close) {
  imp.printMethod("Over");
  // @test Over
  var mml = imp.STACKS ?
      new sitem.OverItem().With({name: name}) :
      ParseMethods.STACKITEM.over().With({name: name});
  if (open || close) {
    // @test Choose
    mml.open = open; mml.close = close;
  } else if (name.match(/withdelims$/)) {
    // @test Over With Delims, Above With Delims
    mml.open  = parser.GetDelimiter(name);
    mml.close = parser.GetDelimiter(name);
  }
  if (name.match(/^\\above/)) {
    // @test Above, Above With Delims
    mml.thickness = parser.GetDimen(name);
  }
  else if (name.match(/^\\atop/) || open || close) {
    // @test Choose
    mml.thickness = 0;
  }
  parser.Push(mml);
};

ParseMethods.Frac = function(parser, name) {
  imp.printMethod("Frac");
  // @test Frac
  var num = parser.ParseArg(name);
  var den = parser.ParseArg(name);
  var node = imp.createNode('mfrac', [num, den], {});
  // VS: OLD
  // var node = MML.mfrac(num, den);
  parser.Push(node);
};

ParseMethods.Sqrt = function(parser, name) {
  imp.printMethod("Sqrt");
  var n = parser.GetBrackets(name), arg = parser.GetArgument(name);
  if (arg === "\\frac") {arg += "{"+parser.GetArgument(arg)+"}{"+parser.GetArgument(arg)+"}"}
  var mml = new OldParser(arg,parser.stack.env, [], {}).mml();
  if (!n) {
    // @test Square Root
    // mml = imp.createNode('msqrt', imp.NEW ? [mml] : mml.array(), {});
    // .array call never seemed to be necessary!
    mml = imp.createNode('msqrt', [mml], {});
    // VS: OLD
    // mml = MML.msqrt.apply(MML,mml.array());
  } else {
    // @test General Root
    mml = imp.createNode('mroot', [mml, ParseMethods.parseRoot(parser, n)], {});
    // VS: OLD
    // mml = MML.mroot(mml,parser.parseRoot(n));
  }
  parser.Push(mml);
};
ParseMethods.Root = function(parser, name) {
  imp.printMethod("Root");
  var n = parser.GetUpTo(name,"\\of");
  var arg = parser.ParseArg(name);
  var node = imp.createNode('mroot', [arg, ParseMethods.parseRoot(parser, n)], {});
  // VS: OLD
  // var node = MML.mroot(arg,parser.parseRoot(n));
  parser.Push(node);
};


// Utility?
ParseMethods.parseRoot = function(parser, n) {
  imp.printMethod("parseRoot");
  // @test General Root, Explicit Root
  var env = parser.stack.env, inRoot = env.inRoot; env.inRoot = true;
  // TODO: This parser call might change!
  var parser = new OldParser(n,env, [], {});
  n = parser.mml();
  imp.printJSON(n);
  var global = parser.stack.global;
  if (global.leftRoot || global.upRoot) {
    // @test Tweaked Root
    var def = {};
    if (global.leftRoot) {
      def.width = global.leftRoot;
    }
    if (global.upRoot) {
      def.voffset = global.upRoot;
      def.height = global.upRoot;
    }
    
    n = imp.createNode('mpadded', [n], def);
    // VS: OLD
    // n = MML.mpadded(n);
    // if (global.leftRoot) {
    //   n.width = global.leftRoot;
    // }
    // if (global.upRoot) {
    //   n.voffset = global.upRoot;
    //   n.height = global.upRoot;
    // }
  }
  env.inRoot = inRoot;
  return n;
};
ParseMethods.MoveRoot = function(parser, name,id) {
  imp.printMethod("MoveRoot");
  // @test Tweaked Root
  if (!parser.stack.env.inRoot) {
    // @test Misplaced Move Root
    throw new TexError(["MisplacedMoveRoot","%1 can appear only within a root",name]);
  }
  if (parser.stack.global[id]) {
    // @test Multiple Move Root
    throw new TexError(["MultipleMoveRoot","Multiple use of %1",name]);
  }
  var n = parser.GetArgument(name);
  if (!n.match(/-?[0-9]+/)) {
    // @test Incorrect Move Root
    throw new TexError(["IntegerArg","The argument to %1 must be an integer",name]);
  }
  n = (n/15)+"em";
  if (n.substr(0,1) !== "-") {n = "+"+n}
  parser.stack.global[id] = n;
};

ParseMethods.Accent = function(parser, name,accent,stretchy) {
  imp.printMethod("Accent");
  // @test Vector
  var c = parser.ParseArg(name);
  var def = {accent: true};
  if (parser.stack.env.font) {
    // @test Vector Font
    def.mathvariant = parser.stack.env.font;
  }
  var entity = imp.createEntity(accent);
  var moNode = imp.createNode('mo', [], def, entity);
  // VS: OLD
  // var entity = MML.entity("#x"+accent);
  // var moNode = MML.mo(entity).With(def);
  var mml = parser.mmlToken(moNode);
  // TODO: This should be property?
  imp.setProperties(mml, {stretchy: (stretchy ? true : false)});
  // @test Vector Op, Vector
  var mo = (imp.isEmbellished(c) ? imp.getCoreMO(c) : c);
  if (imp.isType(mo, 'mo')) {
    // @test Vector Op
    imp.setProperties(mo, {'movablelimits': false});
  }
  var muoNode = imp.createNode('munderover', [], {accent: true});
  // TODO: This is necessary to get the empty element into the children.
  imp.setData(muoNode, 0, c);
  imp.setData(muoNode, 1, null);
  imp.setData(muoNode, 2, mml);
  var texAtom = imp.createNode('TeXAtom', [muoNode], {});
  // VS: OLD
  // var muoNode = MML.munderover(c,null,mml).With({accent: true});
  // var texAtom = MML.TeXAtom(muoNode);
  parser.Push(texAtom);
};

ParseMethods.UnderOver = function(parser, name,c,stack,noaccent) {
  imp.printMethod("UnderOver");
  // @test Overline
  var pos = {o: "over", u: "under"}[name.charAt(1)];
  var base = parser.ParseArg(name);
  // TODO: Sort this one out!
  if (imp.getProperty(base, 'movablelimits')) {
    // @test Overline Sum
    imp.setProperties(base, {'movablelimits': false});
  }
  if (imp.isType(base, 'munderover') && imp.isEmbellished(base)) {
    // @test Overline Limits
    // TODO: Sort these properties out!
    imp.setProperties(imp.getCore(base), {lspace:0,rspace:0}); // get spacing right for NativeMML
    var mo = imp.createNode('mo', [], {rspace:0});
    base = imp.createNode('mrow', [mo,base], {});  // add an empty <mi> so it's not embellished any more
    // VS: OLD
    // var mo = MML.mo().With({rspace:0});
    // base = MML.mrow(mo,base);  // add an empty <mi> so it's not embellished any more
  }
  var mml = imp.createNode('munderover', [base], {});
  var entity = imp.createEntity(c);
  mo = imp.createNode('mo', [], {stretchy:true, accent:!noaccent}, entity);
  // VS: OLD
  // var mml = MML.munderover(base,null,null);
  // var entity = MML.entity("#x"+c);
  // mo = MML.mo(entity).With({stretchy:true, accent:!noaccent});

  imp.setData(mml, mml[pos], parser.mmlToken(mo));

  if (stack) {
    imp.untested(8);
    mml = imp.createNode('TeXAtom', [mml], {texClass:TEXCLASS.OP, movesupsub:true});
    // VS: OLD
    // mml = MML.TeXAtom(mml).With({texClass:MML.TEXCLASS.OP, movesupsub:true});
  }
  // TODO: Sort these properties out!
  imp.setProperties(mml, {subsupOK: true});
  parser.Push(mml);
};

ParseMethods.Overset = function(parser, name) {
  imp.printMethod("Overset");
  // @test Overset
  var top = parser.ParseArg(name), base = parser.ParseArg(name);
  if (imp.getProperty(base, 'movablelimits')) {
    imp.setProperties(base, {'movablelimits': false});
  }
  var node = imp.createNode('mover', [base, top], {});
  // VS: OLD
  // var node = MML.mover(base,top); 
  parser.Push(node);
};
ParseMethods.Underset = function(parser, name) {
  imp.printMethod("Underset");
  // @test Underset
  var bot = parser.ParseArg(name), base = parser.ParseArg(name);
  if (imp.getProperty(base, 'movablelimits')) {
    // @test Overline Sum
    imp.setProperties(base, {'movablelimits': false});
  }
  var node = imp.createNode('munder', [base, bot], {});
  // VS: OLD
  // var node = MML.munder(base,bot);
  parser.Push(node);
};

ParseMethods.TeXAtom = function(parser, name,mclass) {
  imp.printMethod("TeXAtom");
  var def = {texClass: mclass}, mml, node;
  if (mclass == TEXCLASS.OP) {
    def.movesupsub = def.movablelimits = true;
    var arg = parser.GetArgument(name);
    var match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
    if (match) {
      // @test Mathop
      def.mathvariant = TexConstant.Variant.NORMAL;
      var textNode = imp.createText(match[1]);
      node = imp.createNode('mi', [], def, textNode);
      // VS: OLD
      // node = MML.mi(match[1]).With(def);
      mml = imp.STACKS ?
        new sitem.FnItem(parser.mmlToken(node)) :
        ParseMethods.STACKITEM.fn(parser.mmlToken(node));
    } else {
      // @test Mathop Cal
      var parsed = new OldParser(arg,parser.stack.env, [], {}).mml();
      node = imp.createNode('TeXAtom', [parsed], def);
      // VS: OLD
      // node = MML.TeXAtom(parsed).With(def);
      mml = imp.STACKS ? new sitem.FnItem(node) : ParseMethods.STACKITEM.fn(node);
    }
  } else {
    // @test Mathrel
    parsed = parser.ParseArg(name);
    mml = imp.createNode('TeXAtom', [parsed], def);
    // VS: OLD
    // mml = MML.TeXAtom(parsed).With(def);
  }
  parser.Push(mml);
};

// VS: This method is only called during a macro call: AMS Math and \\mod.
ParseMethods.MmlToken = function(parser, name) {
  if (imp.NEW) {
    ParseMethods.MmlTokenNew(parser, name);
  } else {
    ParseMethods.MmlTokenOld(parser, name);
  }
};
ParseMethods.MmlTokenNew = function(parser, name) {
  imp.printMethod("MmlToken");
  // @test Modulo
  var type = parser.GetArgument(name),
      attr = parser.GetBrackets(name,"").replace(/^\s+/,""),
      data = parser.GetArgument(name),
      def = {}, match;
  var node;
  try {
    node = imp.createNode(type, [], {});
  } catch (e) {
    node = null;
  }
  if (!node || !node.isToken) {
    // @test Token Illegal Type, Token Wrong Type
    throw new TexError(["NotMathMLToken","%1 is not a token element",type]);
  }
  while (attr !== "") {
    match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
    if (!match) {
      // @test Token Invalid Attribute
      throw new TexError(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr]);
    }
    if (node.attributes.getAllDefaults()[match[1]] == null && !ParseMethods.MmlTokenAllow[match[1]]) {
      // @test Token Unknown Attribute, Token Wrong Attribute
      throw new TexError(["UnknownAttrForElement",
                          "%1 is not a recognized attribute for %2",
                          match[1],type]);
    }
    var value = parser.MmlFilterAttribute(match[1],match[2].replace(/^(['"])(.*)\1$/,"$2"));
    if (value) {
      if (value.toLowerCase() === "true") {value = true}
      else if (value.toLowerCase() === "false") {value = false}
      def[match[1]] = value;
    }
    attr = attr.substr(match[0].length);
  }
  imp.printSimple("End mmlToken: type: " + type + " data: " + data + ' def: ');
  var textNode = imp.createText(data);
  node.appendChild(textNode);
  imp.setProperties(node, def);
  parser.Push(parser.mmlToken(node));
};
ParseMethods.MmlTokenOld = function(parser, name) {
  imp.printMethod("MmlToken");
  // @test Modulo
  var type = parser.GetArgument(name),
      attr = parser.GetBrackets(name,"").replace(/^\s+/,""),
      data = parser.GetArgument(name),
      def = {attrNames:[]}, match;
  imp.printSimple("Start mmlToken: type: " + type + " data: " + data);
  if (!imp.MML[type] || !imp.MML[type].prototype.isToken) {
    // @test Token Illegal Type, Token Wrong Type
    throw new TexError(["NotMathMLToken","%1 is not a token element",type])}
  while (attr !== "") {
    match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
    if (!match) {
      // @test Token Invalid Attribute
      throw new TexError(["InvalidMathMLAttr","Invalid MathML attribute: %1",attr]);
    }
    if (imp.MML[type].prototype.defaults[match[1]] == null && !ParseMethods.MmlTokenAllow[match[1]]) {
      // @test Token Unknown Attribute, Token Wrong Attribute
      throw new TexError(["UnknownAttrForElement",
                          "%1 is not a recognized attribute for %2",
                          match[1],type]);
    }
    var value = ParseMethods.MmlFilterAttribute(match[1],match[2].replace(/^(['"])(.*)\1$/,"$2"));
    if (value) {
      if (value.toLowerCase() === "true") {value = true}
      else if (value.toLowerCase() === "false") {value = false}
      def[match[1]] = value;
      def.attrNames.push(match[1]);
    }
    attr = attr.substr(match[0].length);
  }
  imp.printSimple("End mmlToken: type: " + type + " data: " + data);
  parser.Push(parser.mmlToken(imp.MML[type](data).With(def)));
};

// Utilities?
ParseMethods.MmlFilterAttribute = function(parser, name,value) {return value};
ParseMethods.MmlTokenAllow = {
  fontfamily:1, fontsize:1, fontweight:1, fontstyle:1,
  color:1, background:1,
  id:1, "class":1, href:1, style:1
};
// End Utilities?

ParseMethods.Strut = function(parser, name) {
  imp.printMethod("Strut");
  // @test Strut
  // TODO: Do we still need this row as it is implicit?
  var row = imp.createNode('mrow', [], {});
  var padded = imp.createNode('mpadded', [row],
                              {height: "8.6pt", depth: "3pt", width: 0});
  // VS: OLD
  // var padded = MML.mpadded(MML.mrow()).With({height: "8.6pt", depth: "3pt", width: 0});
  parser.Push(padded);
};

ParseMethods.Phantom = function(parser, name,v,h) {
  imp.printMethod("Phantom");
  // @test Phantom
  var box = imp.createNode('mphantom', [parser.ParseArg(name)], {});
  if (v || h) {
    box = imp.createNode('mpadded', [box], {});
    if (h) {
      // @test Horizontal Phantom
      box.height = box.depth = 0;
    }
    if (v) {
      // @test Vertical Phantom
      box.width = 0;
    }
  }
  var atom = imp.createNode('TeXAtom', [box], {});
  parser.Push(atom);
  // VS: OLD
  // parser.Push(MML.TeXAtom(box));
};

ParseMethods.Smash = function(parser, name) {
  imp.printMethod("Smash");
  // @test Smash, Smash Top, Smash Bottom
  var bt = parser.trimSpaces(parser.GetBrackets(name,""));
  var smash = imp.createNode('mpadded', [parser.ParseArg(name)], {});
  // VS: OLD
  // var smash = MML.mpadded(parser.ParseArg(name));
  switch (bt) {
  case "b": smash.depth = 0; break;
  case "t": smash.height = 0; break;
  default: smash.height = smash.depth = 0;
  }
  var atom = imp.createNode('TeXAtom', [smash], {});
  parser.Push(atom);
  // VS: OLD
  // parser.Push(MML.TeXAtom(smash));
};

ParseMethods.Lap = function(parser, name) {
  imp.printMethod("Lap");
  // @test Llap, Rlap
  var mml = imp.createNode('mpadded', [parser.ParseArg(name)], {width: 0});
  // VS: OLD
  // var mml = MML.mpadded(parser.ParseArg(name)).With({width: 0});
  if (name === "\\llap") {
    // @test Llap
    imp.setAttribute(mml, 'lspace', '-1width');
  }
  var atom = imp.createNode('TeXAtom', [mml], {});
  parser.Push(atom);
  // VS: OLD
  // parser.Push(MML.TeXAtom(mml));
};

ParseMethods.RaiseLower = function(parser, name) {
  imp.printMethod("RaiseLower");
  // @test Raise, Lower, Raise Negative, Lower Negative
  var h = parser.GetDimen(name);
  var item = imp.STACKS ?
      new sitem.PositionItem().With({name: name, move: 'vertical'}) :
      ParseMethods.STACKITEM.position().With({name: name, move: 'vertical'});
  if (h.charAt(0) === '-') {
    // @test Raise Negative, Lower Negative
    h = h.slice(1);
    name = {raise: "\\lower", lower: "\\raise"}[name.substr(1)];
  }
  if (name === "\\lower") {
    // @test Raise, Raise Negative
    item.dh = '-'+h; item.dd = '+'+h;
  } else {
    // @test Lower, Lower Negative
    item.dh = '+'+h; item.dd = '-'+h;
  }
  parser.Push(item);
};

ParseMethods.MoveLeftRight = function(parser, name) {
  imp.printMethod("MoveLeftRight");
  // @test Move Left, Move Right, Move Left Negative, Move Right Negative
  var h = parser.GetDimen(name);
  var nh = (h.charAt(0) === '-' ? h.slice(1) : '-'+h);
  if (name === "\\moveleft") {
    var tmp = h;
    h = nh;
    nh = tmp;
  }
  parser.Push(imp.STACKS ?
            new sitem.PositionItem().With({
              name: name, move: 'horizontal',
              left:  imp.createNode('mspace', [], {width: h, mathsize: TexConstant.Size.NORMAL}),
              right: imp.createNode('mspace', [], {width: nh, mathsize: TexConstant.Size.NORMAL})}) :
            ParseMethods.STACKITEM.position().With({
              name: name, move: 'horizontal',
              left:  imp.createNode('mspace', [], {width: h, mathsize: TexConstant.Size.NORMAL}),
              right: imp.createNode('mspace', [], {width: nh, mathsize: TexConstant.Size.NORMAL})}));
  // VS: OLD
  // left:  MML.mspace().With({width: h, mathsize: MML.SIZE.NORMAL}),
  // right: MML.mspace().With({width: nh, mathsize: MML.SIZE.NORMAL})
};

ParseMethods.Hskip = function(parser, name) {
  imp.printMethod("Hskip");
  // @test Modulo
  var node = imp.createNode('mspace', [],
                            {width: parser.GetDimen(name),
                             mathsize: TexConstant.Size.NORMAL});
  // VS: OLD
  // var node = MML.mspace().With({width: parser.GetDimen(name), mathsize: TexConstant.Size.NORMAL});
  parser.Push(node);
};

ParseMethods.Rule = function(parser, name,style) {
  imp.printMethod("Rule");
  // @test Rule 3D, Space 3D
  var w = parser.GetDimen(name),
      h = parser.GetDimen(name),
      d = parser.GetDimen(name);
  var def = {width:w, height:h, depth:d};
  if (style !== 'blank') {
    def.mathbackground = (parser.stack.env.color || "black");
  }
  var node = imp.createNode('mspace', [], def);
  // VS: OLD
  // var node = MML.mspace().With(def);
  parser.Push(node);
};
ParseMethods.rule = function(parser, name) {
  imp.printMethod("rule");
  // @test Rule 2D
  var v = parser.GetBrackets(name),
      w = parser.GetDimen(name),
      h = parser.GetDimen(name);
  var mml = imp.createNode('mspace', [], {
    width: w, height:h,
    mathbackground: (parser.stack.env.color || "black") });
  // VS: OLD
  // var mml = MML.mspace().With({
  //   width: w, height:h,
  //   mathbackground: (parser.stack.env.color || "black")
  // });
  if (v) {
    mml = imp.createNode('mpadded', [mml], {voffset: v});
    // VS: OLD
    // mml = MML.mpadded(mml).With({voffset: v});
    if (v.match(/^\-/)) {
      mml.height = v;
      mml.depth = '+' + v.substr(1);
    } else {
      mml.height = '+' + v;
    }
  }
  parser.Push(mml);
};

ParseMethods.MakeBig = function(parser, name,mclass,size) {
  imp.printMethod("MakeBig");
  // @test Choose, Over With Delims, Above With Delims
  size *= ParseMethods.P_HEIGHT;
  size = String(size).replace(/(\.\d\d\d).+/,'$1')+"em";
  var delim = parser.GetDelimiter(name,true);
  var text = imp.createText(delim);
  var mo = imp.createNode('mo', [], {
    minsize: size, maxsize: size,
    fence: true, stretchy: true, symmetric: true
  }, text);
  var node = imp.createNode('TeXAtom', [mo], {texClass: mclass});
  // VS: OLD
  // var node = MML.TeXAtom(MML.mo(delim).With({
  //   minsize: size, maxsize: size,
  //   fence: true, stretchy: true, symmetric: true
  // })).With({texClass: mclass});
  parser.Push(node);
};

ParseMethods.BuildRel = function(parser, name) {
  imp.printMethod("BuildRel");
  // @test BuildRel, BuildRel Expression
  var top = parser.ParseUpTo(name,"\\over");
  var bot = parser.ParseArg(name);
  var node = imp.createNode('munderover', [], {});
  // TODO: This is necessary to get the empty element into the children.
  imp.setData(node, 0, bot);
  imp.setData(node, 1, null);
  imp.setData(node, 2, top);
  var atom = imp.createNode('TeXAtom', [node], {texClass: TEXCLASS.REL});
  // VS: OLD
  // parser.Push(MML.TeXAtom(MML.munderover(bot,null,top)).With({texClass: MML.TEXCLASS.REL}));
  parser.Push(atom);
};

ParseMethods.HBox = function(parser, name,style) {
  imp.printMethod("HBox");
  // @test Hbox
  // VS: OLD
  // parser.PushAll(parser.InternalMath(parser.GetArgument(name),style));
  // TODO: Sort out internal math first!
  parser.PushAll(parser.InternalMath(parser.GetArgument(name),style));
};

ParseMethods.FBox = function(parser, name) {
  imp.printMethod("FBox");
  // @test Fbox
  var internal = parser.InternalMath(parser.GetArgument(name));
  var node = imp.createNode('menclose', internal, {notation:"box"});
  // VS: OLD
  // parser.Push(MML.menclose.apply(MML,parser.InternalMath(parser.GetArgument(name))).With({notation:"box"}));
  parser.Push(node);
};

ParseMethods.Not = function(parser, name) {
  imp.printMethod("Not");
  // @test Negation Simple, Negation Complex, Negation Explicit,
  //       Negation Large
  parser.Push(imp.STACKS ? new sitem.NotItem() : ParseMethods.STACKITEM.not());
};

ParseMethods.Dots = function(parser, name) {
  imp.printMethod("Dots");
  // @test Operator Dots
  var ldotsEntity = imp.createEntity('2026');
  var cdotsEntity = imp.createEntity('22EF');
  var ldots = imp.createNode('mo', [], {stretchy:false}, ldotsEntity);
  var cdots = imp.createNode('mo', [], {stretchy:false}, cdotsEntity);
  // VS: OLD
  // var ldots = MML.mo(MML.entity("#x2026")).With({stretchy:false});
  // var cdots = MML.mo(MML.entity("#x22EF")).With({stretchy:false});
  parser.Push(imp.STACKS ?
            new sitem.DotsItem().With({
              ldots: parser.mmlToken(ldots),
              cdots: parser.mmlToken(cdots)
            }) :
            ParseMethods.STACKITEM.dots().With({
              ldots: parser.mmlToken(ldots),
              cdots: parser.mmlToken(cdots)
            }));
};

ParseMethods.Matrix = function(parser, name,open,close,align,spacing,vspacing,style,cases,numbered) {
  imp.printMethod("Matrix");
  // imp.untested(36);
  var c = parser.GetNext();
  if (c === "")
  {throw new TexError(["MissingArgFor","Missing argument for %1",name])}
  if (c === "{") {parser.i++} else {parser.string = c+"}"+parser.string.slice(parser.i+1); parser.i = 0}
  var array = imp.STACKS ?
      new sitem.ArrayItem().With({
        requireClose: true,
        arraydef: {
          rowspacing: (vspacing||"4pt"),
          columnspacing: (spacing||"1em")
        }}) :
      ParseMethods.STACKITEM.array().With({
        requireClose: true,
        arraydef: {
          rowspacing: (vspacing||"4pt"),
          columnspacing: (spacing||"1em")
        }
      });
  if (cases)         {array.isCases = true}
  if (numbered)      {array.isNumbered = true; array.arraydef.side = numbered}
  if (open || close) {array.open = open; array.close = close}
  if (style === "D") {array.arraydef.displaystyle = true}
  if (align != null) {array.arraydef.columnalign = align}
  parser.Push(array);
};

ParseMethods.Entry = function(parser, name) {
  imp.printMethod("Entry");
  // @test Label, Array, Cross Product Formula
  parser.Push(imp.STACKS ?
            new sitem.CellItem().With({isEntry: true, name: name}) :
            ParseMethods.STACKITEM.cell().With({isEntry: true, name: name}));
  if (parser.stack.Top().isCases) {
    //
    //  Make second column be in \text{...} (unless it is already
    //  in a \text{...}, for backward compatibility).
    //
    var string = parser.string;
    var braces = 0, close = -1, i = parser.i, m = string.length;
    //
    //  Look through the string character by character...
    //
    while (i < m) {
      var c = string.charAt(i);
      if (c === "{") {
        //
        //  Increase the nested brace count and go on
        //
        braces++;
        i++;
      } else if (c === "}") {
        //
        //  If there are too many close braces, just end (we will get an
        //    error message later when the rest of the string is parsed)
        //  Otherwise
        //    decrease the nested brace count,
        //    if it is now zero and we haven't already marked the end of the
        //      first brace group, record the position (use to check for \text{} later)
        //    go on to the next character.
        //
        if (braces === 0) {
          m = 0;
        } else {
          braces--;
          if (braces === 0 && close < 0) {
            close = i - parser.i;
          }
          i++;
        }
      } else if (c === "&" && braces === 0) {
        //
        //  Extra alignment tabs are not allowed in cases
        //
        throw new TexError(["ExtraAlignTab","Extra alignment tab in \\cases text"]);
      } else if (c === "\\") {
        //
        //  If the macro is \cr or \\, end the search, otherwise skip the macro
        //  (multi-letter names don't matter, as we will skip the rest of the
        //   characters in the main loop)
        //
        if (string.substr(i).match(/^((\\cr)[^a-zA-Z]|\\\\)/)) {m = 0} else {i += 2}
      } else {
        //
        //  Go on to the next character
        //
        i++;
      }
    }
    //
    //  Check if the second column text is already in \text{};
    //  If not, process the second column as text and continue parsing from there,
    //    (otherwise process the second column as normal, since it is in \text{}
    //
    var text = string.substr(parser.i,i-parser.i);
    if (!text.match(/^\s*\\text[^a-zA-Z]/) || close !== text.replace(/\s+$/,'').length - 1) {
      var internal = parser.InternalMath(text,0);
      parser.PushAll(internal);
      parser.i = i;
    }
  }
};

ParseMethods.Cr = function(parser, name) {
  imp.printMethod("Cr");
  imp.untested(15);
  parser.Push(imp.STACKS ?
            new sitem.CellItem().With({isCR: true, name: name}) :
            ParseMethods.STACKITEM.cell().With({isCR: true, name: name}));
};

ParseMethods.CrLaTeX = function(parser, name) {
  imp.printMethod("CrLaTeX");
  var n;
  if (parser.string.charAt(parser.i) === "[") {
    n = parser.GetBrackets(name,"").replace(/ /g,"").replace(/,/,".");
    if (n && !ParserUtil.matchDimen(n)) {
      throw new TexError(["BracketMustBeDimension",
                          "Bracket argument to %1 must be a dimension",name]);
    }
  }
  parser.Push(imp.STACKS ?
            new sitem.CellItem().With({isCR: true, name: name, linebreak: true}) :
            ParseMethods.STACKITEM.cell().With({isCR: true, name: name, linebreak: true}));
  var top = parser.stack.Top();
  if (imp.STACKS ? top instanceof sitem.ArrayItem : top instanceof ParseMethods.STACKITEM.array) {
    // @test Array
    if (n && top.arraydef.rowspacing) {
      var rows = top.arraydef.rowspacing.split(/ /);
      if (!top.rowspacing) {top.rowspacing = ParserUtil.dimen2em(rows[0])}
      while (rows.length < top.table.length) {rows.push(ParserUtil.Em(top.rowspacing))}
      rows[top.table.length-1] = ParserUtil.Em(Math.max(0,top.rowspacing+ParserUtil.dimen2em(n)));
      top.arraydef.rowspacing = rows.join(' ');
    }
  } else {
    if (n) {
      // @test Custom Linebreak
      var node = imp.createNode('mspace', [], {depth:n});
      // VS: OLD
      // var node = MML.mspace().With({depth:n});
      parser.Push(node);
    }
    // @test Linebreak
    node = imp.createNode('mspace', [], {linebreak:TexConstant.LineBreak.NEWLINE});
    // VS: OLD
    // node = MML.mspace().With({linebreak:MML.LINEBREAK.NEWLINE});
    parser.Push(node);
  }
};

ParseMethods.HLine = function(parser, name,style) {
  imp.printMethod("HLine");
  if (style == null) {style = "solid"}
  var top = parser.stack.Top();
  if (!(imp.STACKS ? top instanceof sitem.ArrayItem : top instanceof ParseMethods.STACKITEM.array) ||
      top.data.length)
  {throw new TexError(["Misplaced","Misplaced %1",name])}
  if (top.table.length == 0) {
    top.frame.push("top");
  } else {
    var lines = (top.arraydef.rowlines ? top.arraydef.rowlines.split(/ /) : []);
    while (lines.length < top.table.length) {
      lines.push("none");
    }
    lines[top.table.length-1] = style;
    top.arraydef.rowlines = lines.join(' ');
  }
};

ParseMethods.HFill = function(parser, name) {
  imp.printMethod("HFill");
  var top = parser.stack.Top();
  if ((imp.STACKS ? top instanceof sitem.ArrayItem : top instanceof ParseMethods.STACKITEM.array))
    top.hfill.push(top.data.length);
  else throw new TexError(["UnsupportedHFill","Unsupported use of %1",name]);
};


// Utilities:

ParseMethods.mi2mo = function(mi) {
  imp.printMethod("mi2mo");
  // @test Mathop Sub, Mathop Super
  var mo = imp.createNode('mo', [], {});
  imp.copyChildren(mi, mo);
  // TODO: Figure out how to copy these attributes.
  imp.copyAttributes(mi, mo);
  // TODO: Do this with get('lspace') etc.
  imp.setProperties(mo, {lspace: '0', rspace: '0'});
  // mo.lspace = mo.rspace = "0";  // prevent mo from having space in NativeMML
  // mo.useMMLspacing &= ~(mo.SPACE_ATTR.lspace | mo.SPACE_ATTR.rspace);  // don't count these explicit settings
  return mo;
};






/************************************************************************/
/*
 *   LaTeX environments
 */

ParseMethods.MAXMACROS = 10000;    // maximum number of macro substitutions per equation
ParseMethods.MAXBUFFER = 5*1024;   // maximum size of TeX string to process


ParseMethods.BeginEnd = function(parser, name) {
  imp.printMethod("BeginEnd");
  // @test Array1, Array2, Array Test
  var env = parser.GetArgument(name);
  var regexp = /^\\end\\/;
  if (env.match(regexp)) {env = env.substr(5)} // special \end{} for \newenvironment environments
  if (env.match(/\\/i)) {
    throw new TexError(["InvalidEnv","Invalid environment name '%1'",env]);
  }
  if (name === "\\end") {
    var mml = imp.STACKS ?
        new sitem.EndItem().With({name: env}) :
        ParseMethods.STACKITEM.end().With({name: env});
    parser.Push(mml);
  } else {
    if (++parser.macroCount > ParseMethods.MAXMACROS) {
      throw new TexError(["MaxMacroSub2",
                          "MathJax maximum substitution count exceeded; " +
                          "is there a recursive latex environment?"]);
    }
    ParseMethods.NEW_PARSER.parse('environment', [env, this]);
  }
};


ParseMethods.BeginEnvironment = function(parser, func, env, args) {
  imp.printMethod("BeginEnvironment");
  var end = args[0];
  var mml = imp.STACKS ?
      new sitem.BeginItem().With({name: env, end: end}) :
      ParseMethods.STACKITEM.begin().With({name: env, end: end});
  mml = func.apply(this,[parser, mml].concat(args.slice(1)));
  parser.Push(mml);
};

ParseMethods.Equation = function(parser, begin,row) {
  return row;
};

ParseMethods.ExtensionEnv = function(parser, begin,file) {
  parser.Extension(begin.name,file,"environment");
};

ParseMethods.Array = function(parser, begin,open,close,align,spacing,vspacing,style,raggedHeight) {
  imp.printMethod("Array");
  // @test Array1, Array2, Array Test
  if (!align) {align = parser.GetArgument("\\begin{"+begin.name+"}")}
  var lines = ("c"+align).replace(/[^clr|:]/g,'').replace(/[^|:]([|:])+/g,'$1');
  align = align.replace(/[^clr]/g,'').split('').join(' ');
  align = align.replace(/l/g,'left').replace(/r/g,'right').replace(/c/g,'center');
  var array = imp.STACKS ?
      new sitem.ArrayItem().With({
        arraydef: {
          columnalign: align,
          columnspacing: (spacing||"1em"),
          rowspacing: (vspacing||"4pt")
        }
      }) :
      ParseMethods.STACKITEM.array().With({
        arraydef: {
          columnalign: align,
          columnspacing: (spacing||"1em"),
          rowspacing: (vspacing||"4pt")
        }
      });
  if (lines.match(/[|:]/)) {
    if (lines.charAt(0).match(/[|:]/)) {array.frame.push("left"); array.frame.dashed = lines.charAt(0) === ":"}
    if (lines.charAt(lines.length-1).match(/[|:]/)) {array.frame.push("right")}
    lines = lines.substr(1,lines.length-2);
    array.arraydef.columnlines =
      lines.split('').join(' ').replace(/[^|: ]/g,'none').replace(/\|/g,'solid').replace(/:/g,'dashed');
  }
  if (open)  {array.open  = parser.convertDelimiter(open)}
  if (close) {array.close = parser.convertDelimiter(close)}
  if (style === "D") {array.arraydef.displaystyle = true}
  else if (style) {array.arraydef.displaystyle = false}
  if (style === "S") {array.arraydef.scriptlevel = 1} // FIXME: should use mstyle?
  if (raggedHeight)  {array.arraydef.useHeight = false}
  parser.Push(begin);
  return array;
};


ParseMethods.AlignedArray = function(parser, begin) {
  imp.printMethod("AlignedArray");
  // @test Array1, Array2, Array Test
  var align = parser.GetBrackets("\\begin{"+begin.name+"}");
  return ParseMethods.setArrayAlign(parser,
                                    ParseMethods.Array.apply(parser,arguments),align);
};


ParseMethods.setArrayAlign = function(parser, array,align) {
  imp.printMethod("setArrayAlign");
  // @test Array1, Array2, Array Test
  align = parser.trimSpaces(align||"");
  if (align === "t") {array.arraydef.align = "baseline 1"}
  else if (align === "b") {array.arraydef.align = "baseline -1"}
  else if (align === "c") {array.arraydef.align = "center"}
  else if (align) {array.arraydef.align = align} // FIXME: should be an error?
  return array;
};


/**************
 * Macros and Extension functionality.
 *************/
// TODO: 
// Most of this is untested and should probably go into a separate file.
// We should probably loose require.

ParseMethods.EXTENSION_DIR = "";


ParseMethods.Require = function(parser, name) {
  imp.printMethod("Require");
  var file = parser.GetArgument(name)
      .replace(/.*\//,"")            // remove any leading path
      .replace(/[^a-z0-9_.-]/ig,""); // remove illegal characters
  ParseMethods.Extension(null,file);
};


ParseMethods.Extension = function(parser, name,file,array) {
  imp.printMethod("Extension");
  if (name && !typeof(name) === "string") {name = name.name}
  // file = TEX.extensionDir+"/"+file;
  file = ParseMethods.EXTENSION_DIR + "/" + file;
  if (!file.match(/\.js$/)) {file += ".js"}
};


ParseMethods.Macro = function(parser, name,macro,argcount,def) {
  imp.printMethod("Macro");
  if (argcount) {
    var args = [];
    if (def != null) {
      var optional = parser.GetBrackets(name);
      args.push(optional == null ? def : optional);
    }
    for (var i = args.length; i < argcount; i++) {args.push(parser.GetArgument(name))}
    macro = ParseMethods.SubstituteArgs(args,macro);
  }
  parser.string = ParseMethods.AddArgs(macro,parser.string.slice(parser.i));
  parser.i = 0;
  if (++parser.macroCount > ParseMethods.MAXMACROS) {
    throw new TexError(["MaxMacroSub1",
                        "MathJax maximum macro substitution count exceeded; " +
                        "is there a recursive macro call?"]);
  }
};


// These two are Macro Utility functions
/**
 *  Replace macro paramters with their values
 */
ParseMethods.SubstituteArgs = function (args,string) {
  imp.printMethod("SubstituteArgs");
  var text = ''; var newstring = ''; var c; var i = 0;
  while (i < string.length) {
    c = string.charAt(i++);
    if (c === "\\") {text += c + string.charAt(i++)}
    else if (c === '#') {
      c = string.charAt(i++);
      if (c === '#') {text += c} else {
        if (!c.match(/[1-9]/) || c > args.length) {
          throw new TexError(["IllegalMacroParam",
                              "Illegal macro parameter reference"]);
        }
        newstring = ParseMethods.AddArgs(this.AddArgs(newstring,text),args[c-1]);
        text = '';
      }
    } else {text += c}
  }
  return this.AddArgs(newstring,text);
};

/**
 *  Make sure that macros are followed by a space if their names
 *  could accidentally be continued into the following text.
 */
ParseMethods.AddArgs = function (s1,s2) {
  imp.printMethod("AddArgs");
  if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {s1 += ' '}
  if (s1.length + s2.length > ParseMethods.MAXBUFFER) {
    throw new TexError(["MaxBufferSize",
                        "MathJax internal buffer size exceeded; is there a recursive macro call?"]);
  }
  return s1+s2;
};


// AMS Math
ParseMethods.TAG_SIDE = 'right';
ParseMethods.TAG_INDENT = '0.8em';

ParseMethods.AMSarray = function(parser, begin,numbered,taggable,align,spacing) {
  imp.printMethod('AMS-AMSarray');
  // @test The Lorenz Equations, Maxwell's Equations, Cubic Binomial
  parser.Push(begin);
  if (taggable) {
    ParseMethods.checkEqnEnv(parser);
  }
  align = align.replace(/[^clr]/g,'').split('').join(' ');
  align = align.replace(/l/g,'left').replace(/r/g,'right').replace(/c/g,'center');
  return imp.STACKS ?
    new sitem.AMSarrayItem(begin.name,numbered,taggable, parser.stack).With({
      arraydef: {
        displaystyle: true,
        rowspacing: ".5em",
        columnalign: align,
        columnspacing: (spacing||"1em"),
        rowspacing: "3pt",
        side: ParseMethods.TAG_SIDE,
        minlabelspacing: ParseMethods.TAG_INDENT
      }
    }) :
  ParseMethods.STACKITEM.AMSarray(begin.name,numbered,taggable,parser.stack).With({
    arraydef: {
      displaystyle: true,
      rowspacing: ".5em",
      columnalign: align,
      columnspacing: (spacing||"1em"),
      rowspacing: "3pt",
      side: ParseMethods.TAG_SIDE,
      minlabelspacing: ParseMethods.TAG_INDENT
    }
  });
};


/**
 *  Check for bad nesting of equation environments
 */
ParseMethods.checkEqnEnv = function (parser) {
  imp.printMethod('AMS-checkEqnEnv');
  if (parser.stack.global.eqnenv) {
    throw TexError(["ErroneousNestingEq","Erroneous nesting of equation structures"]);
  }
  parser.stack.global.eqnenv = true;
};


ParseMethods.HandleOperatorName = function (parser, name) {
  imp.printMethod('AMS-HandleOperatorName');
  // @test Operatorname
  var limits = (parser.GetStar() ? "" : "\\nolimits\\SkipLimits");
  var op = parser.trimSpaces(parser.GetArgument(name));
  op = op.replace(/\*/g,'\\text{*}').replace(/-/g,'\\text{-}');
  parser.string = '\\mathop{\\rm '+op+'}'+limits+" "+parser.string.slice(parser.i);
  parser.i = 0;
};
    

ParseMethods.SkipLimits = function (parser, name) {
  imp.printMethod('AMS-SkipLimits');
  // @test Operatorname
  var c = parser.GetNext(), i = parser.i;
  if (c === "\\" && ++parser.i && parser.GetCS() !== "limits") parser.i = i;
};
