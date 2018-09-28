import {ParserTest} from './parser-tests.js';


class ParserMultirelTest extends ParserTest {

  constructor() {
    super();
  }

}

let parserTest = new ParserMultirelTest();


parserTest.runTest(
  'Shift Left', 'a<<b',
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
      "inherited": {
        "displaystyle": true,
        "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mi",
         "texClass": 0,
         "attributes": {},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0,
           "mathvariant": "italic"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "a"}]},
        {"kind": "mo",
         "texClass": 3,
         "attributes": {},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0,
           "form": "infix"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "<"},
           {"kind": "text",
            "text": "<"}],
         "isEmbellished": true},
        {"kind": "mi",
         "texClass": 0,
         "attributes": {},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0,
           "mathvariant": "italic"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Less Equal', 'a<=b',
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
      "inherited": {
        "displaystyle": true,
        "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mi",
         "texClass": 0,
         "attributes": {},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0,
           "mathvariant": "italic"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "a"}]},
        {"kind": "mo",
         "texClass": 3,
         "attributes": {},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0,
           "form": "infix"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "<"},
           {"kind": "text",
            "text": "="}],
         "isEmbellished": true},
        {"kind": "mi",
         "texClass": 0,
         "attributes": {},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0,
           "mathvariant": "italic"},
         "properties": {},
         "childNodes": [
           {"kind": "text",
            "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Infix Op Op", "a++b",
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
      {"kind": "mo",
       "texClass": 0,
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
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Infix Op Rel", "a+=b",
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
      {"kind": "mo",
       "texClass": 0,
       "attributes": {},
       "inherited": {"displaystyle": true,
                     "scriptlevel": 0,
                     "form": "infix"},
       "properties": {},
       "childNodes": [
         {"kind": "text",
          "text": "+"}],
       "isEmbellished": true},
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
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Postfix Op Op", "a++",
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
        {"kind": "mo",
          "texClass": 0,
          "attributes": {},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0,
            "form": "postfix"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "+"}],
          "isEmbellished": true}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Postfix Rel Rel", "a==",
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
      {"kind": "mo",
          "texClass": 3,
          "attributes": {},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0,
            "form": "postfix"},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "="},
            {"kind": "text",
              "text": "="}],
          "isEmbellished": true}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Infix Bars", "a||b",
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
             "attributes": {"stretchy": false},
             "inherited": {"displaystyle": true,
                           "scriptlevel": 0,
                           "form": "infix",
                           "fence": true,
                           "stretchy": true,
                           "symmetric": true},
             "properties": {},
             "childNodes": [
               {"kind": "text",
                "text": "|"}],
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
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": true,
                "scriptlevel": 0},
              "properties": {},
              "childNodes": [
                {"kind": "mo",
                  "texClass": 0,
                  "attributes": {"stretchy": false},
                  "inherited": {"displaystyle": true,
                    "scriptlevel": 0,
                    "form": "infix",
                    "fence": true,
                    "stretchy": true,
                    "symmetric": true},
                  "properties": {},
                  "childNodes": [
                    {"kind": "text",
                      "text": "|"}],
                  "isEmbellished": true}],
              "isInferred": true,
              "isEmbellished": true}],
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
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Infix Fences", "a))b",
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
      {"kind": "mo",
       "texClass": 5,
       "attributes": {"stretchy": false},
       "inherited": {"displaystyle": true,
                     "scriptlevel": 0,
                     "form": "infix",
                     "fence": true,
                     "stretchy": true,
                     "symmetric": true},
       "properties": {},
       "childNodes": [
         {"kind": "text",
          "text": ")"}],
       "isEmbellished": true},
      {"kind": "mo",
       "texClass": 5,
          "attributes": {"stretchy": false},
          "inherited": {"displaystyle": true,
            "scriptlevel": 0,
            "form": "infix",
            "fence": true,
            "stretchy": true,
            "symmetric": true},
          "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": ")"}],
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
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Infix Rel Rel", "a\\rightarrow=b",
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
      {"kind": "mo",
       "texClass": 3,
       "attributes": {"stretchy": false},
       "inherited": {"displaystyle": true,
                     "scriptlevel": 0,
                     "stretchy": true,
                     "accent": true,
                     "form": "infix"},
       "properties": {},
          "childNodes": [
            {"kind": "text",
              "text": "→"},
            {"kind": "text",
              "text": "="}],
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
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Infix 4Rel", "a=<>=b",
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
      {"kind": "mo",
       "texClass": 3,
       "attributes": {},
       "inherited": {"displaystyle": true,
                     "scriptlevel": 0,
                     "form": "infix"},
       "properties": {},
       "childNodes": [
         {"kind": "text",
              "text": "="},
            {"kind": "text",
              "text": "<"},
            {"kind": "text",
              "text": ">"},
            {"kind": "text",
              "text": "="}],
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
              "text": "b"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Prefix Rel Rel", "==a",
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
                     "form": "prefix"},
       "properties": {},
       "childNodes": [
         {"kind": "text",
          "text": "="},
         {"kind": "text",
              "text": "="}],
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
              "text": "a"}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  "Prefix Op Op", "++a",
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
                     "form": "prefix"},
       "properties": {},
       "childNodes": [
         {"kind": "text",
          "text": "+"}],
       "isEmbellished": true},
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
              "text": "a"}]}],
      "isInferred": true}]}
);
