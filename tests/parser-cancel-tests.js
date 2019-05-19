import {ParserTest} from './parser-tests.js';
import 'mathjax3/input/tex/cancel/CancelConfiguration.js';


class ParserCancelTest extends ParserTest {

  constructor() {
    super();
    this.packages = ['base', 'cancel'];
  }

}

let parserTest = new ParserCancelTest();

parserTest.runTest(
  'Cancel', '\\cancel{x}',
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
        {"kind": "menclose",
         "texClass": 0,
         "attributes": {"notation": "updiagonalstrike"},
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
                      "text": "x"}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'BCancel', '\\bcancel{x}',
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
        {"kind": "menclose",
         "texClass": 0,
         "attributes": {"notation": "downdiagonalstrike"},
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
                      "text": "x"}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'XCancel', '\\xcancel{x}',
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
        {"kind": "menclose",
         "texClass": 0,
         "attributes": {"notation": "updiagonalstrike downdiagonalstrike"},
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
                      "text": "x"}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'CancelTo', '\\cancelto{x}{y}',
  {"kind": "math",
   "texClass": -1,
   "attributes": {"display": "block"},
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
        {"kind": "msup",
         "texClass": -1,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "menclose",
            "texClass": 0,
            "attributes": {"notation": "updiagonalstrike updiagonalarrow"},
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
                          "text": "y"}]}],
                  "isInferred": true}]},
            {"kind": "mpadded",
              "texClass": 0,
              "attributes": {"depth": "-.1em",
                "height": " + .1em",
                "voffset": ".1em"},
              "inherited": {"displaystyle": false,
                "scriptlevel": 1},
              "properties": {},
              "childNodes": [
                {"kind": "mrow",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {"displaystyle": false,
                    "scriptlevel": 1},
                  "properties": {},
                  "childNodes": [
                    {"kind": "mi",
                      "texClass": 0,
                      "attributes": {},
                      "inherited": {"displaystyle": false,
                        "scriptlevel": 1,
                        "mathvariant": "italic"},
                      "properties": {},
                      "childNodes": [
                        {"kind": "text",
                          "text": "x"}]}],
                  "isInferred": true}]}]}],
      "isInferred": true}]}
);
