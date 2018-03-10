import {ParserTest} from './parser-tests.js';


class ParserArrayTest extends ParserTest {

  constructor() {
    super();
  }

}

let parserTest = new ParserArrayTest();

parserTest.runTest(
  'Array Single', '\\begin{array}{c}a\\end{array}',
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
        {"kind": "mtable",
         "texClass": 0,
         "attributes": {"columnalign": "center",
                        "columnspacing": "1em",
                        "rowspacing": "4pt"},
         "inherited": {
           "displaystyle": true,
           "scriptlevel": 0},
         "properties": {"useHeight": 1},
         "childNodes": [
           {"kind": "mtr",
            "texClass": null,
            "attributes": {},
            "inherited": {
              "displaystyle": false,
              "scriptlevel": 0},
            "properties": {},
            "childNodes": [
              {"kind": "mtd",
               "texClass": null,
               "attributes": {},
               "inherited": {
                 "displaystyle": false,
                 "scriptlevel": 0},
               "properties": {},
               "childNodes": [
                 {"kind": "mrow",
                  "texClass": 0,
                  "attributes": {},
                  "inherited": {
                    "displaystyle": false,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "mi",
                     "texClass": 0,
                     "attributes": {},
                     "inherited": {
                       "displaystyle": false,
                       "scriptlevel": 0,
                       "mathvariant": "italic"},
                     "properties": {},
                     "childNodes": [
                       {"kind": "text",
                        "text": "a"}]}],
                  "isInferred": true}]}]}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Enclosed left right', '\\begin{array}{|c|}a\\end{array}',
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
        {"kind": "menclose",
         "texClass": 0,
         "attributes": {"notation": "left right",
                        "isFrame": true,
                        "padding": 0},
         "inherited": {
           "displaystyle": true,
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
              {"kind": "mtable",
               "texClass": 0,
               "attributes": {"columnalign": "center",
                              "columnspacing": "1em",
                              "rowspacing": "4pt",
                              "columnlines": "solid none"},
               "inherited": {
                 "displaystyle": true,
                 "scriptlevel": 0},
               "properties": {"useHeight": 1},
               "childNodes": [
                 {"kind": "mtr",
                  "texClass": null,
                  "attributes": {},
                  "inherited": {
                    "displaystyle": false,
                    "scriptlevel": 0},
                  "properties": {},
                  "childNodes": [
                    {"kind": "mtd",
                     "texClass": null,
                     "attributes": {},
                     "inherited": {
                       "displaystyle": false,
                       "scriptlevel": 0},
                     "properties": {},
                     "childNodes": [
                       {"kind": "mrow",
                        "texClass": 0,
                        "attributes": {},
                        "inherited": {
                          "displaystyle": false,
                          "scriptlevel": 0},
                        "properties": {},
                        "childNodes": [
                          {"kind": "mi",
                           "texClass": 0,
                           "attributes": {},
                           "inherited": {
                             "displaystyle": false,
                             "scriptlevel": 0,
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
  'Enclosed left', '\\begin{array}{|c}a\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed right', '\\begin{array}{c|}a\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed top', '\\begin{array}{c}\\hline a\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed bottom', '\\begin{array}{c} a\\\\hline\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed top bottom', '\\begin{array}{c}\\hline a\\\\hline\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed top bottom', '\\begin{array}{c}\\hline a\\\\hline\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed frame solid', '\\begin{array}{|c|}\\hline a\\\\hline\\end{array}',
  {}
);


parserTest.runTest(
  'Enclosed frame dashed', '\\begin{array}{:c:}\\hline a\\\\hline\\end{array}',
  {}
);


parserTest.runTest(
  'Array dashed column',
  '\\begin{array}{c:c}a&c\\\\b&d\\end{array}',
  {}
);


parserTest.runTest(
  'Array solid column',
  '\\begin{array}{c|c}a&c\\\\b&d\\end{array}',
  {}
);


parserTest.runTest(
  'Array dashed row',
  '\\begin{array}{c}a\\\\\\hdashline b\\end{array}',
  {}
);


parserTest.runTest(
  'Array solid row',
  '\\begin{array}{c}a\\\\\\hline b\\end{array}',
  {}
);


// parserTest.runTest(
//   'Array3', '\\scriptstyle \\frac{1}{\\begin{array}{ccc}a&<&b\\end{array}}',
//   {}
// );

parserTest.runTest(
  'Matrix Test', '\\left( \\begin{array}{ccc}a & b & c \\\\d & e & f \\\\g & h & i \\end{array} \\right)',
  {"kind":"math",
   "texClass":7,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":7,
      "attributes":{},
      "inherited":{
        "displaystyle":true,
        "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mrow",
         "texClass":7,
         "attributes":{},
         "inherited":{
           "displaystyle":true,
           "scriptlevel":0},
         "properties":{"open":"(",
                       "close":")"},
         "childNodes":[
           {"kind":"mo",
            "texClass":4,
            "attributes":{},
            "inherited":{
              "displaystyle":true,
              "scriptlevel":0,
              "form":"prefix",
              "fence":true,
              "stretchy":true,
              "symmetric":true},
            "properties":{},
            "childNodes":[
              {"kind":"text",
               "text":"("}],
            "isEmbellished":true},
           {"kind":"mtable",
            "texClass":0,
            "attributes":{"columnalign":"center center center",
                          "rowspacing":"4pt",
                          "columnspacing":"1em"},
            "inherited":{
              "displaystyle":true,
              "scriptlevel":0},
            "properties":{"useHeight":1},
            "childNodes":[
              {"kind":"mtr",
               "texClass":null,
               "attributes":{},
               "inherited":{
                 "columnalign":"center center center",
                 "displaystyle":false,
                 "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"a"}]}],
                     "isInferred":true}]},
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"b"}]}],
                     "isInferred":true}]},
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"c"}]}],
                     "isInferred":true}]}]},
              {"kind":"mtr",
               "texClass":null,
               "attributes":{},
               "inherited":{
                 "columnalign":"center center center",
                 "displaystyle":false,
                 "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"d"}]}],
                     "isInferred":true}]},
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"e"}]}],
                     "isInferred":true}]},
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"f"}]}],
                     "isInferred":true}]}]},
              {"kind":"mtr",
               "texClass":null,
               "attributes":{},
               "inherited":{
                 "columnalign":"center center center",
                 "displaystyle":false,
                 "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"g"}]}],
                     "isInferred":true}]},
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"h"}]}],
                     "isInferred":true}]},
                 {"kind":"mtd",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                    "columnalign":"center center center",
                    "displaystyle":false,
                    "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mrow",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                       "displaystyle":false,
                       "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                          "displaystyle":false,
                          "scriptlevel":0,
                          "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"i"}]}],
                     "isInferred":true}]}]}]},
           {"kind":"mo",
            "texClass":5,
            "attributes":{},
            "inherited":{
              "displaystyle":true,
              "scriptlevel":0,
              "form":"postfix",
              "fence":true,
              "stretchy":true,
              "symmetric":true},
            "properties":{},
            "childNodes":[
              {"kind":"text",
               "text":")"}],
            "isEmbellished":true}]}],
      "isInferred":true}]}
);
