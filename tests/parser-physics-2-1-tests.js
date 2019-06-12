import {ParserTest} from './parser-tests.js';
import 'mathjax3/input/tex/physics/PhysicsConfiguration.js';

class ParserPhysicsTest2_1 extends ParserTest {

  constructor() {
    super();
    this.packages = ['base', 'physics'];
  }
};

let parserTest = new ParserPhysicsTest2_1();


parserTest.runTest(
  'Vector_Special_0', '\\vb{\\mbox{ab}}',
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
                      "text": "ab"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);


parserTest.runTest(
  'Vector_Special_1', '\\vb{B}',
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
         "attributes": {"mathvariant": "bold"},
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
  'Vector_Special_2', '\\vb{\\mathcal{B}}',
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
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mi",
                  "texClass": 0,
                  "attributes": {"mathvariant": "-tex-caligraphic"},
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
  'Vector_Special_3', '\\mathcal{\\vb{B}}',
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
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mi",
                  "texClass": 0,
                  "attributes": {"mathvariant": "bold"},
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
  'Vector_Special_4', '\\mathit{\\vb{B}}',
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
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mi",
                  "texClass": 0,
                  "attributes": {"mathvariant": "bold"},
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
  'Vector_Special_5', '\\vb{\\mathit{B}}',
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
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mi",
                  "texClass": 0,
                  "attributes": {"mathvariant": "-tex-mathit"},
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
  'Vector_Special_6', '\\vb{\\mathit{a}b}',
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
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
              {"kind": "mi",
               "texClass": 0,
               "attributes": {"mathvariant": "-tex-mathit"},
               "inherited": {"displaystyle": true,
                    "scriptlevel": 0,
                    "mathvariant": "italic"},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "a"}]}],
              "isInferred": true}]},
        {"kind": "mi",
          "texClass": 0,
          "attributes": {"mathvariant": "bold"},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0,
            "mathvariant": "italic"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Vector_Special_7', '\\vb{a+\\theta}{\\bf +}',
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
        {"kind": "mrow",
         "texClass": 0,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {"mathvariant": "bold"},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
            "childNodes": [
              {"kind": "text",
               "text": "a"}]},
           {"kind": "mo",
            "texClass": 2,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0,
                          "form": "infix"},
            "properties": {},
            "childNodes": [
              {"kind": "text",
               "text": "+"}],
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
                  "text": "θ"}]}],
          "isInferred": true},
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
                {"kind": "mo",
                  "texClass": 0,
                  "attributes": {"mathvariant": "bold"},
                  "inherited": {"displaystyle": true,
                    "scriptlevel": 0,
                    "form": "infix"},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "+"}],
                  "isEmbellished": true}],
              "isInferred": true,
              "isEmbellished": true}],
          "isEmbellished": true}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Vector_Special_8', '\\vb{\\hat{a}}',
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
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
              {"kind": "mover",
               "texClass": 0,
               "attributes": {},
               "inherited": {"displaystyle": true,
                             "scriptlevel": 0,
                             "accent": true},
               "properties": {},
               "childNodes": [
                 {"kind": "mi",
                  "texClass": 0,
                      "attributes": {"mathvariant": "bold"},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0,
                        "mathvariant": "italic"},
                      "properties": {"texprimestyle": true},
                      "childNodes": [
                        {"kind": "text",
                          "text": "a"}]},
                    {"kind": "mo",
                      "texClass": 3,
                      "attributes": {"mathvariant": "bold",
                        "stretchy": false},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0,
                        "form": "infix",
                        "accent": true,
                        "stretchy": true},
                      "properties": {},
                      "childNodes": [
                        {"kind": "text",
                          "text": "^"}],
                      "isEmbellished": true}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Vector_Special_9', '\\vb{[}[',
  {"kind": "math",
   "texClass": 4,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 4,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mo",
         "texClass": 4,
         "attributes": {"stretchy": false},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "form": "prefix",
                       "fence": true,
                       "stretchy": true,
                       "symmetric": true},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "["}],
         "isEmbellished": true},
        {"kind": "mo",
          "texClass": 4,
          "attributes": {"stretchy": false},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0,
            "form": "postfix",
            "fence": true,
            "stretchy": true,
            "symmetric": true},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "["}],
          "isEmbellished": true}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Vector_Special_10', '\\vb{\\hat{}}',
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
                 {"kind": "mrow",
                      "texClass": null,
                      "attributes": {},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0},
                      "properties": {"texprimestyle": true},
                      "childNodes": [],
                      "isSpacelike": true},
                    {"kind": "mo",
                      "texClass": 3,
                      "attributes": {"mathvariant": "bold",
                        "stretchy": false},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0,
                        "form": "infix",
                        "accent": true,
                        "stretchy": true},
                      "properties": {},
                      "childNodes": [
                        {"kind": "text",
                          "text": "^"}],
                      "isEmbellished": true}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Vector_Special_11', '\\vb{=}',
  {"kind": "math",
   "texClass": 3,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 3,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mo",
         "texClass": 3,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0,
                       "form": "infix"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "="}],
          "isEmbellished": true}],
      "isInferred": true,
      "isEmbellished": true}],
  "isEmbellished": true}
);


parserTest.runTest(
  'Vector_Special_12', '\\vb{\\hat{=}}\\hat{=}',
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
            "texClass": 3,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
              {"kind": "mover",
               "texClass": 3,
               "attributes": {},
               "inherited": {"displaystyle": true,
                             "scriptlevel": 0,
                             "accent": true},
               "properties": {},
               "childNodes": [
                 {"kind": "mo",
                  "texClass": 3,
                  "attributes": {},
                  "inherited": {"displaystyle": true,
                                "scriptlevel": 0,
                                "form": "infix"},
                  "properties": {"movablelimits": false,
                                 "texprimestyle": true},
                  "childNodes": [
                    {"kind": "text",
                     "text": "="}],
                  "isEmbellished": true},
                 {"kind": "mo",
                  "texClass": 3,
                  "attributes": {"mathvariant": "bold",
                                 "stretchy": false},
                  "inherited": {"displaystyle": true,
                                "scriptlevel": 0,
                                "form": "infix",
                                "accent": true,
                                "stretchy": true},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                     "text": "^"}],
                      "isEmbellished": true}],
                  "isEmbellished": true}],
              "isInferred": true,
              "isEmbellished": true}],
          "isEmbellished": true},
        {"kind": "TeXAtom",
          "texClass": 0,
          "attributes": {},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0},
          "properties": {},
          "childNodes": [
            {"kind": "mrow",
              "texClass": 3,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0},
              "properties": {},
              "childNodes": [
                {"kind": "mover",
                  "texClass": 3,
                  "attributes": {},
                  "inherited": {"displaystyle": true,
                    "scriptlevel": 0,
                    "accent": true},
                  "properties": {},
                  "childNodes": [
                    {"kind": "mo",
                      "texClass": 3,
                      "attributes": {},
                      "inherited": {"displaystyle": true,
                        "scriptlevel": 0,
                        "form": "infix"},
                      "properties": {"movablelimits": false,
                        "texprimestyle": true},
                      "childNodes": [
                        {"kind": "text",
                          "text": "="}],
                      "isEmbellished": true},
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
                          "text": "^"}],
                      "isEmbellished": true}],
                  "isEmbellished": true}],
              "isInferred": true,
              "isEmbellished": true}],
          "isEmbellished": true}],
      "isInferred": true}]}
);


parserTest.printTime();
