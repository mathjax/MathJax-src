import {ParserTest} from './parser-tests.js';
import 'mathjax3/input/tex/unicode/UnicodeConfiguration.js';

class ParserUnicodeTest extends ParserTest {

  constructor() {
    super();
    this.packages = ['base', 'unicode'];
  }

}

let parserTest = new ParserUnicodeTest();


parserTest.runTest(
  'Unicode Dec', '\\unicode{8922}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "⋚"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Hex', '\\unicode{0x22DA}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "⋚"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Dec A', '\\unicode{65}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "A"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Hex A', '\\unicode{x41}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "A"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Scale', '\\unicode[.55,0.05]{x22D6}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "⋖"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Scale Font', '\\unicode[.55,0.05][Geramond]{x22D6}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {"fontfamily": "Geramond"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "⋖"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Font', '\\unicode[Garamond]{x22D6}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {"fontfamily": "Garamond"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "⋖"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Combined', '\\mbox{A}\\unicode{65}{B}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mstyle",
         "texClass": 0,
         "attributes": {"displaystyle": false,
                        "scriptlevel": 0},
         "inherited": {},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
              {"kind": "mtext",
               "texClass": 0,
               "attributes": {},
               "inherited": {"displaystyle": false,
                             "scriptlevel": 0},
               "properties": {},
               "childNodes": [
                 {"kind": "text",
                  "text": "A"}],
               "isSpacelike": true}],
            "isInferred": true,
            "isSpacelike": true}],
         "isSpacelike": true},
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
            "scriptlevel": 0},
          "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "A"}],
          "isSpacelike": true},
        {"kind": "TeXAtom",
          "texClass": 0,
          "attributes": {},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0},
          "properties": {},
          "childNodes": [
            {"kind": "mrow",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0},
              "properties": {},
              "childNodes": [
                {"kind": "mi",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"displaystyle": true,
                    "scriptlevel": 0,
                    "mathvariant": "italic"},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "B"}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Unicode Surrogate Hex', '\\unicode{x1D5A0}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "𝖠"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Surrogate Dec', '\\unicode{120224}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "𝖠"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Blackboard', '\\unicode{x1D538}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "𝔸"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Unicode Blackboard Geramond', '\\unicode{x1D538}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"unicode": true},
          "childNodes": [
            {"kind": "text",
              "text": "𝔸"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);


