import {ParserTest} from './parser-tests.js';
import 'mathjax3/input/tex/html/HtmlConfiguration.js';


class ParserHtmlTest extends ParserTest {

  constructor() {
    super();
    this.packages = ['base', 'html'];
  }

}

let parserTest = new ParserHtmlTest();


parserTest.runTest(
  'Html Href Simple', '\\href{https://mathjax.org}{a}',
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
         "attributes": {"href": "https://mathjax.org"},
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
  'Html Href Complex', '\\href{https://mathjax.org}{\\frac{a}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {"href": "https://mathjax.org"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Href Inner', '\\frac{a}{\\href{https://mathjax.org}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
            "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {"href": "https://mathjax.org"},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Style Simple', '\\style{color:green;background-color:blue}{a}',
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
         "attributes": {"style": "color:green;background-color:blue"},
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
  'Html Style Complex', '\\style{color:green;background-color:blue}{\\frac{a}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {"style": "color:green;background-color:blue"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Style Inner', '\\frac{a}{\\style{color:green;background-color:blue}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
            "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {"style": "color:green;background-color:blue"},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Class Simple', '\\class{myclass}{a}',
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
         "attributes": {"class": "myclass"},
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
  'Html Class Simple', '\\class{myclass}{\\frac{a}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {"class": "myclass"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Class Complex', '\\frac{a}{\\class{myclass}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {"class": "myclass"},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Id Inner', '\\cssId{myid-0}{a}',
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
         "attributes": {"id": "myid-0"},
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
  'Html Id Simple', '\\cssId{myid-1}{\\frac{a}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {"id": "myid-1"},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);

parserTest.runTest(
  'Html Id Complex', '\\frac{a}{\\cssId{myid-2}{b}}',
  {"kind": "math",
   "texClass": null,
   "attributes": {"display": "block"},
   "inherited": {"displaystyle": true,
                 "scriptlevel": 0},
   "properties": {},
   "childNodes": [
     {"kind": "mrow",
      "texClass": null,
      "attributes": {},
      "inherited": {"displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "mfrac",
         "texClass": null,
         "attributes": {},
         "inherited": {"displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mi",
            "texClass": 0,
            "attributes": {},
            "inherited": {"displaystyle": false,
                          "scriptlevel": 0,
                          "mathvariant": "italic"},
            "properties": {},
              "childNodes": [
                {"kind": "text",
                  "text": "a"}]},
            {"kind": "mi",
              "texClass": 0,
              "attributes": {"id": "myid-2"},
              "inherited": {"displaystyle": false,
                "scriptlevel": 0,
                "mathvariant": "italic"},
              "properties": {"texprimestyle": true},
              "childNodes": [
                {"kind": "text",
                  "text": "b"}]}]}],
      "isInferred": true}]}
);
