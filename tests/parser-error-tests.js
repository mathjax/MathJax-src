import {ParserTest} from './parser-tests.js';


class ParserErrorTest extends ParserTest {

  constructor() {
    super();
  }

}

let parserTest = new ParserErrorTest();

// Errors

// Error in checkItem.
parserTest.runTest(
  'Ampersand-error', '&',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":false,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{"display":"block",
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"merror",
         "texClass":0,
         "attributes":{},
         "inherited":{"display":"block",
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{},
         "childNodes":[
           {"kind":"mrow",
            "texClass":null,
            "attributes":{},
            "inherited":{"display":"block",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtext",
               "texClass":0,
               "attributes":{},
               "inherited":{"display":"block",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"text",
                  "text":"Misplaced &"}],
               "isSpacelike":true}],
            "isInferred":true,
            "isSpacelike":true}]}],
      "isInferred":true}]}
);

// Error in GetArgument
parserTest.runTest(
  'Argument-error', '\\frac{b}',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":false,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{"display":"block",
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"merror",
         "texClass":0,
         "attributes":{},
         "inherited":{"display":"block",
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{},
         "childNodes":[
           {"kind":"mrow",
            "texClass":null,
            "attributes":{},
            "inherited":{"display":"block",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtext",
               "texClass":0,
               "attributes":{},
               "inherited":{"display":"block",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"text",
                  "text":"Missing argument for \\frac"}],
               "isSpacelike":true}],
            "isInferred":true,
            "isSpacelike":true}]}],
      "isInferred":true}]}
);

// Control sequence error: csUndefined
parserTest.runTest(
  'Undefined-CS', '\\nonsense',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":false,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{"display":"block",
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"merror",
         "texClass":0,
         "attributes":{},
         "inherited":{"display":"block",
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{},
         "childNodes":[
           {"kind":"mrow",
            "texClass":null,
            "attributes":{},
            "inherited":{"display":"block",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtext",
               "texClass":0,
               "attributes":{},
               "inherited":{"display":"block",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"text",
                  "text":"Undefined control sequence \\nonsense"}],
               "isSpacelike":true}],
            "isInferred":true,
            "isSpacelike":true}]}],
      "isInferred":true}]}
);

// Environment sequence error: envUndefined
parserTest.runTest(
  'Undefined-Env', '\\begin{nonsense} a \\end{nonsense}',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":false,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{"display":"block",
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"merror",
         "texClass":0,
         "attributes":{},
         "inherited":{"display":"block",
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{},
         "childNodes":[
           {"kind":"mrow",
            "texClass":null,
            "attributes":{},
            "inherited":{"display":"block",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtext",
               "texClass":0,
               "attributes":{},
               "inherited":{"display":"block",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"text",
                  "text":"Unknown environment 'nonsense'"}],
               "isSpacelike":true}],
            "isInferred":true,
            "isSpacelike":true}]}],
      "isInferred":true}]}
);

parserTest.runTest(
  'Double-super-error', 'x^2^3',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Double exponent: use braces to clarify"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Double-over-error', '\\sum^2^3',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Double exponent: use braces to clarify"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Limits Error', '+\\limits^2',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "\\limits is allowed only on operators"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Double sub error', 'x_2_3',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Double subscripts: use braces to clarify"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Double under error', '\\sum_2_3',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Double subscripts: use braces to clarify"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Brace Superscript Error', 'x\'^\'',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Missing open brace for superscript"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Double Prime Error', 'x^\\prime\'',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Prime causes double exponent: use braces to clarify"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Hash Error', '#',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "You can't use 'macro parameter character #' in math mode"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Missing Right', '\\left(\\middle|',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Extra \\left or missing \\right"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Orphan Middle', '\\middle|',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "\\middle must be within \\left and \\right"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Middle with Right', '\\middle|\\right)',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "\\middle must be within \\left and \\right"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Misplaced Move Root', '\\uproot{2}\\sqrt[3]{a}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "\\uproot can appear only within a root"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Multiple Move Root', '\\sqrt[\\uproot{-2}\\uproot{2}\\beta]{k}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Multiple use of \\uproot"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Incorrect Move Root', '\\sqrt[\\uproot-2.5\\beta]{k}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "The argument to \\uproot must be an integer"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Double Over', '1 \\over 2 \\over 3',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Ambiguous use of \\over"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Token Illegal Type', '\\mmlToken{mk}[]{}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "mk is not a token element"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Token Wrong Type', '\\mmlToken{mrow}[]{}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "mrow is not a token element"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Token Invalid Attribute', '\\mmlToken{mi}[m1=true]{}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "Invalid MathML attribute: m1=true"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Token Unknown Attribute', '\\mmlToken{mo}[nothing="something"]{}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
              "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "nothing is not a recognized attribute for mo"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Token Wrong Attribute', '\\mmlToken{mi}[movablelimit=true]{}',
  {"kind": "math",
   "texClass": 0,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": false,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": 0,
      "attributes": {},
      "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "merror",
         "texClass": 0,
         "attributes": {},
         "inherited": {"display": "block",
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": null,
            "attributes": {},
            "inherited": {"display": "block",
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
                {"kind": "mtext",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"display": "block",
                    "displaystyle": true,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "movablelimit is not a recognized attribute for mi"}],
                  "isSpacelike": true}],
              "isInferred": true,
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.printTime();
