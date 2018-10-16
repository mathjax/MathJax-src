import {ParserTest} from './parser-tests.js';
import 'mathjax3/input/tex/noundefined/NoUndefinedConfiguration.js';

class ParserNoundefinedTest extends ParserTest {

  constructor() {
    super();
    this.packages = ['base', 'noundefined'];
  }

}

let parserTest = new ParserNoundefinedTest();

parserTest.runTest(
  'Noundefined Single', '\\a',
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
         "attributes": {"mathcolor": "red"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "\\a"}],
          "isSpacelike": true}],
      "isInferred": true,
      "isSpacelike": true}],
  "isSpacelike": true}
);

parserTest.runTest(
  'Noundefined Context', 'a\\b c',
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
            "text": "a"}]},
        {"kind": "mtext",
         "texClass": 0,
         "attributes": {"mathcolor": "red"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "\\b"}],
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
              "text": "c"}]}],
      "isInferred": true}]}
);


parserTest.printTime();
