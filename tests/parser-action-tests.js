import {ParserTest} from './parser-tests.js';
import 'mathjax3/input/tex/action/ActionConfiguration.js';

class ParserActionTest extends ParserTest {

  constructor() {
    super();
    this.packages = ['base', 'action'];
  }

}

let parserTest = new ParserActionTest();


parserTest.runTest(
  'TextTip', '\\texttip{A}{B}',
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
        {"kind": "maction",
         "texClass": 0,
         "attributes": {"actiontype": "tooltip"},
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
            {"kind": "mtext",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0},
              "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "B"}],
              "isSpacelike": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'MathTip', '\\mathtip{A}{B}',
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
        {"kind": "maction",
         "texClass": 0,
         "attributes": {"actiontype": "tooltip"},
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
            {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "B"}]}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Toggle', '\\toggle A B C \\endtoggle',
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
        {"kind": "maction",
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
           {"kind": "mi",
            "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "B"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "C"}]}]}],
      "isInferred": true}]}
);
  
