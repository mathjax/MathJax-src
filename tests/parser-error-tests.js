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

parserTest.printTime();
