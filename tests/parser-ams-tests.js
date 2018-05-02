import {ParserTest} from './parser-tests.js';

class ParserAmsTest extends ParserTest {

  constructor() {
    super();
  }

}

let parserTest = new ParserAmsTest();

parserTest.runTest(
  'Symbol', '\\digamma',
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
        {"kind": "mi",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
            "scriptlevel": 0,
            "mathvariant": "italic"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "ϝ"}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Operator', '\\dotplus',
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
        {"kind": "mo",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "form": "infix"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "∔"}],
          "isEmbellished": true}],
      "isInferred": true,
      "isEmbellished": true}],
  "isEmbellished": true}
);

parserTest.runTest(
  'Delimiter', '\\ulcorner',
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
        {"kind": "mo",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "form": "infix"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "⌜"}],
          "isEmbellished": true}],
      "isInferred": true,
      "isEmbellished": true}],
  "isEmbellished": true}
);


parserTest.runTest(
  'Delimiter-left-right', '\\left\\ulcorner A \\right\\urcorner',
  {"kind": "math",
   "texClass": 7,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 7,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mrow",
         "texClass": 7,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {"open": "⌜",
                        "close": "⌝"},
         "childNodes": [
           {"kind": "mo",
            "texClass": 0,
            "attributes": {"fence": true,
                           "stretchy": true,
                           "symmetric": true},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0,
                          "form": "prefix"},
            "properties": {},
            "childNodes": [
              {"kind": "text",
               "text": "⌜"}],
            "isEmbellished": true},
           {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "A"}]},
            {"kind": "mo",
              "texClass": 0,
              "attributes": {"fence": true,
                "stretchy": true,
                "symmetric": true},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0,
                "form": "postfix"},
              "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "⌝"}],
              "isEmbellished": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Macro', 'A\\implies B',
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
        {"kind": "mi",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "mathvariant": "italic"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "A"}]},
        {"kind": "mspace",
         "texClass": 0,
         "attributes": {"width": "thickmathspace"},
         "inherited": {"displaystyle": true},
         "properties": {},
         "childNodes": [],
         "isSpacelike": true},
        {"kind": "mo",
         "texClass": 3,
         "attributes": {"stretchy": false},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "form": "infix",
                       "accent": true,
                       "stretchy": true},
         "properties": {},
         "childNodes": [
            {"kind": "text",
              "text": "⟹"}],
          "isEmbellished": true},
        {"kind": "mspace",
          "texClass": 0,
          "attributes": {"width": "thickmathspace"},
          "inherited": {"displaystyle": true},
          "properties": {},
          "childNodes": [],
          "isSpacelike": true},
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
      "isInferred": true}]}
);

parserTest.runTest(
  'AMS-math-mo', '\\iiiint',
  {"kind": "math",
   "texClass": 1,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 1,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mo",
         "texClass": 1,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "form": "infix",
                       "largeop": true,
            "symmetric": true},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "⨌"}],
          "isEmbellished": true}],
      "isInferred": true,
      "isEmbellished": true}],
  "isEmbellished": true}
);

parserTest.runTest(
  'AMS-math-macro', '\\ddddot{1}',
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
        {"kind": "TeXAtom",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": -1,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
              {"kind": "mover",
               "texClass": -1,
               "attributes": {},
               "inherited": {"displaystyle": true,
                             "scriptlevel": 0,
                             "accent": true},
               "properties": {},
               "childNodes": [
                    {"kind": "mn",
                      "texClass": 0,
                      "attributes": {},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0},
                      "properties": {"texprimestyle": true},
                      "childNodes": [
                        {"kind": "text",
                          "text": "1"}]},
                    {"kind": "mo",
                      "texClass": 0,
                      "attributes": {},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0,
                        "form": "infix",
                        "accent": true},
                      "properties": {},
                      "childNodes": [
                        {"kind": "text",
                          "text": "⃜"}],
                      "isEmbellished": true}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);


parserTest.printTime();
