// Testing environments with AMS labelling to contrast regular and starred
// environments.
import {ParserTest} from './parser-tests.js';
import {TagsFactory} from 'mathjax3/input/tex/Tags.js';

class ParserAmsenvTest extends ParserTest {

  constructor() {
    TagsFactory.setDefault('AMS');
    super();
  }

}

let parserTest = new ParserAmsenvTest();

parserTest.runTest(
  'Subarray', '\\begin{subarray}{c}a\\end{subarray}',
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
         "attributes": {"scriptlevel": 1},
         "inherited": {"displaystyle": true},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 1},
            "properties": {},
            "childNodes": [
              {"kind": "mtable",
               "texClass": 0,
               "attributes": {"rowspacing": "0.1em",
                              "columnspacing": "0em"},
               "inherited": {"scriptlevel": 1},
               "properties": {"useHeight": false},
               "childNodes": [
                 {"kind": "mtr",
                  "texClass": null,
                  "attributes": {},
                  "inherited": {"columnalign": "center",
                                "rowalign": "baseline",
                                "displaystyle": false,
                                "scriptlevel": 1},
                      "properties": {},
                      "childNodes": [
                        {"kind": "mtd",
                          "texClass": null,
                          "attributes": {},
                          "inherited": {"columnalign": "center",
                            "rowalign": "baseline",
                            "displaystyle": false,
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
                                      "text": "a"}]}],
                              "isInferred": true}]}]}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Small Matrix', '\\begin{smallmatrix}a\\end{smallmatrix}',
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
         "attributes": {"scriptlevel": 1},
         "inherited": {"displaystyle": true},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": true,
                          "scriptlevel": 1},
            "properties": {},
            "childNodes": [
              {"kind": "mtable",
               "texClass": 0,
               "attributes": {"rowspacing": ".2em",
                              "columnspacing": "0.333em"},
               "inherited": {"scriptlevel": 1},
               "properties": {"useHeight": false},
               "childNodes": [
                 {"kind": "mtr",
                  "texClass": null,
                  "attributes": {},
                  "inherited": {"columnalign": "center",
                                "rowalign": "baseline",
                                "displaystyle": false,
                                "scriptlevel": 1},
                      "properties": {},
                      "childNodes": [
                        {"kind": "mtd",
                          "texClass": null,
                          "attributes": {},
                          "inherited": {"columnalign": "center",
                            "rowalign": "baseline",
                            "displaystyle": false,
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
                                      "text": "a"}]}],
                              "isInferred": true}]}]}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);


parserTest.printTime();
