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

parserTest.printTime();
