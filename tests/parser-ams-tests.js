import {ParserTest} from './parser-tests.js';

class ParserAmsTest extends ParserTest {

  constructor() {
    super();
  }

}

let parserTest = new ParserAmsTest();

parserTest.runTest(
  'Symbol', '\\digamma',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mi",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "mathvariant":"italic"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"ϝ"}]}],
      "isInferred":true}]}
);

parserTest.runTest(
  'Operator', '\\dotplus',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mo",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "form":"infix"},
         "properties":{},
         "childNodes":[{"kind":"text",
                        "text":"∔"}],
         "isEmbellished":true}],
      "isInferred":true,
      "isEmbellished":true}],
   "isEmbellished":true}
);

parserTest.runTest(
  'Delimiter', '\\ulcorner',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mo",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "form":"infix"},
         "properties":{},
         "childNodes":[{"kind":"text",
                        "text":"⌜"}],
         "isEmbellished":true}],
      "isInferred":true,
      "isEmbellished":true}],
   "isEmbellished":true}
);


parserTest.runTest(
  'Delimiter-left-right', '\\left\\ulcorner A \\right\\urcorner',
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
         "properties":{"open":"⌜",
                       "close":"⌝"},
         "childNodes":[
           {"kind":"mo",
            "texClass":0,
            "attributes":{"fence":true,
                          "stretchy":true,
                          "symmetric":true},
            "inherited":{
                         "displaystyle":true,
                         "scriptlevel":0,
                         "form":"prefix"},
            "properties":{},
            "childNodes":[
              {"kind":"text",
               "text":"⌜"}],
            "isEmbellished":true},
           {"kind":"mi",
            "texClass":0,
            "attributes":{},
            "inherited":{
                         "displaystyle":true,
                         "scriptlevel":0,
                         "mathvariant":"italic"},
            "properties":{},
            "childNodes":[
              {"kind":"text",
               "text":"A"}]},
           {"kind":"mo",
            "texClass":0,
            "attributes":{"fence":true,
                          "stretchy":true,
                          "symmetric":true},
            "inherited":{
                         "displaystyle":true,
                         "scriptlevel":0,
                         "form":"postfix"},
            "properties":{},
            "childNodes":[
              {"kind":"text",
               "text":"⌝"}],
            "isEmbellished":true}]}],
      "isInferred":true}]}
);

parserTest.runTest(
  'Macro', 'A\\implies B',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mi",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "mathvariant":"italic"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"A"}]},
        {"kind":"mspace",
         "texClass":0,
         "attributes":{"width":"thickmathspace"},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{"scriptlevel":0},
         "childNodes":[],
         "isSpacelike":true},
        {"kind":"mo",
         "texClass":3,
         "attributes":{"stretchy":false},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "form":"infix",
                      "accent":true,
                      "stretchy":true},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"⟹"}],
         "isEmbellished":true},
        {"kind":"mspace",
         "texClass":0,
         "attributes":{"width":"thickmathspace"},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{"scriptlevel":0},
         "childNodes":[],
         "isSpacelike":true},
        {"kind":"mi",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "mathvariant":"italic"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"B"}]}],
      "isInferred":true}]}
);

parserTest.runTest(
  'AMS-math-mo', '\\iiiint',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mo",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "form":"infix"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"⨌"}],
         "isEmbellished":true}],
      "isInferred":true,
      "isEmbellished":true}],
   "isEmbellished":true}
);

parserTest.runTest(
  'AMS-math-macro', '\\ddddot{1}',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"TeXAtom",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{},
         "childNodes":[
           {"kind":"mrow",
            "texClass":-1,
            "attributes":{},
            "inherited":{
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mover",
               "texClass":-1,
               "attributes":{},
               "inherited":{
                            "displaystyle":true,
                            "scriptlevel":0,
                            "accent":false},
               "properties":{},
               "childNodes":[
                 {"kind":"mn",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{"texprimestyle":true},
                  "childNodes":[
                    {"kind":"text",
                     "text":"1"}]},
                 {"kind":"mo",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":false,
                               "scriptlevel":1,
                               "form":"infix"},
                  "properties":{},
                  "childNodes":[
                    {"kind":"text",
                     "text":"⃜"}],
                  "isEmbellished":true}]}],
            "isInferred":true}]}],
      "isInferred":true}]}
);

parserTest.runTest(
  'Subarray', '\begin{subarray}{c}a\end{subarray}',
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
      "inherited": {
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "TeXAtom",
         "texClass": 0,
         "attributes": {},
         "inherited": {
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": 3,
            "attributes": {},
            "inherited": {
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
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
                  "text": "\b"}],
               "isEmbellished": true}],
            "isInferred": true,
            "isEmbellished": true}],
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
            "text": "e"}]},
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
            "text": "g"}]},
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
            "text": "i"}]},
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
            "text": "n"}]},
        {"kind": "TeXAtom",
         "texClass": 0,
         "attributes": {},
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
                  "text": "s"}]},
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
                  "text": "u"}]},
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
                  "text": "b"}]},
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
                  "text": "r"}]},
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
                  "text": "r"}]},
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
                      "text": "y"}]}],
              "isInferred": true}]},
        {"kind": "TeXAtom",
          "texClass": 0,
          "attributes": {},
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
                      "text": "c"}]}],
              "isInferred": true}]},
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
              "text": "e"}]},
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
              "text": "n"}]},
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
              "text": "d"}]},
        {"kind": "TeXAtom",
          "texClass": 0,
          "attributes": {},
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
                      "text": "s"}]},
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
                      "text": "u"}]},
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
                      "text": "b"}]},
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
                      "text": "r"}]},
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
                      "text": "r"}]},
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
                      "text": "y"}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);


parserTest.runTest(
  'Small Matrix', '\begin{smallmatrix}a\end{smallmatrix}',
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
      "inherited": {
                    "displaystyle": true,
                    "scriptlevel": 0},
      "properties": {},
      "childNodes": [
        {"kind": "TeXAtom",
         "texClass": 0,
         "attributes": {},
         "inherited": {
                       "displaystyle": true,
                       "scriptlevel": 0},
         "properties": {},
         "childNodes": [
           {"kind": "mrow",
            "texClass": 3,
            "attributes": {},
            "inherited": {
                          "displaystyle": true,
                          "scriptlevel": 0},
            "properties": {},
            "childNodes": [
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
                  "text": "\b"}],
               "isEmbellished": true}],
            "isInferred": true,
            "isEmbellished": true}],
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
            "text": "e"}]},
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
            "text": "g"}]},
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
            "text": "i"}]},
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
            "text": "n"}]},
        {"kind": "TeXAtom",
         "texClass": 0,
         "attributes": {},
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
                  "text": "s"}]},
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
                  "text": "m"}]},
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
                  "text": "l"}]},
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
                  "text": "l"}]},
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
                  "text": "m"}]},
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
                  "text": "t"}]},
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
                  "text": "r"}]},
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
                      "text": "i"}]},
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
                      "text": "x"}]}],
              "isInferred": true}]},
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
              "text": "e"}]},
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
              "text": "n"}]},
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
              "text": "d"}]},
        {"kind": "TeXAtom",
          "texClass": 0,
          "attributes": {},
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
                      "text": "s"}]},
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
                      "text": "m"}]},
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
                      "text": "l"}]},
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
                      "text": "l"}]},
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
                      "text": "m"}]},
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
                      "text": "t"}]},
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
                      "text": "r"}]},
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
                      "text": "i"}]},
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
                      "text": "x"}]}],
              "isInferred": true}]}],
      "isInferred": true}]}
);
        

parserTest.runTest(
  'The Lorenz Equations', '\\begin{align}' +
    '\\dot{x} & = \\sigma(y-x) \\\\' +
    '\\dot{y} & = \\rho x - y - xz \\\\' +
    '\\dot{z} & = -\\beta z + xy' +
    '\\end{align}',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mtable",
         "texClass":0,
         "attributes":{"columnalign":"right left right left right left right left right left right left",
                       "rowspacing":"3pt",
                       "columnspacing":"0em 2em 0em 2em 0em 2em 0em 2em 0em 2em 0em",
                       "displaystyle":true},
         "inherited":{
                      "scriptlevel":0},
         "properties":{"useHeight":1},
         "childNodes":[
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mi",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "mathvariant":"italic"},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"x"}]},
                             {"kind":"mo",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"˙"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"σ"}]},
                    {"kind":"mo",
                     "texClass":4,
                     "attributes":{"stretchy":false},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix",
                                  "fence":true,
                                  "stretchy":true,
                                  "symmetric":true},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"("}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"y"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"−"}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"x"}]},
                    {"kind":"mo",
                     "texClass":5,
                     "attributes":{"stretchy":false},
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
                     "isEmbellished":true}],
                  "isInferred":true}]}]},
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mi",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "mathvariant":"italic"},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"y"}]},
                             {"kind":"mo",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"˙"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"ρ"}]},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"x"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"−"}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"y"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"−"}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"x"}]},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"z"}]}],
                  "isInferred":true}]}]},
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mi",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "mathvariant":"italic"},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"z"}]},
                             {"kind":"mo",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"˙"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"mo",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"−"}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"β"}]},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"z"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"+"}],
                     "isEmbellished":true},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"x"}]},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"y"}]}],
                  "isInferred":true}]}]}]}],
      "isInferred":true}]}
);

parserTest.runTest(
  'Maxwell\'s Equations', '\\begin{align} ' +
    '\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, ' +
    '\\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} &' +
    ' = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\' +
    '  \\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\' +
    '  \\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, ' +
    '\\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} &' +
    ' = \\vec{\\mathbf{0}} \\\\' +
    '  \\nabla \\cdot \\vec{\\mathbf{B}} & = 0' +
    ' \\end{align}',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mtable",
         "texClass":0,
         "attributes":{"columnalign":"right left right left right left right left right left right left",
                       "rowspacing":"3pt",
                       "columnspacing":"0em 2em 0em 2em 0em 2em 0em 2em 0em 2em 0em",
                       "displaystyle":true},
         "inherited":{
                      "scriptlevel":0},
         "properties":{"useHeight":1},
         "childNodes":[
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{"mathvariant":"normal"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"∇"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"×"}],
                     "isEmbellished":true},
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":-1,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{"mathvariant":"bold"},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"B"}]}],
                                 "isInferred":true}]},
                             {"kind":"mo",
                              "texClass":3,
                              "attributes":{"stretchy":false},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true,
                                           "stretchy":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"→"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"−"}],
                     "isEmbellished":true},
                    {"kind":"mspace",
                     "texClass":0,
                     "attributes":{"width":"thinmathspace"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{"scriptlevel":0},
                     "childNodes":[],
                     "isSpacelike":true},
                    {"kind":"mfrac",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mn",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"1"}]},
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0,
                                     "mathvariant":"italic"},
                        "properties":{"texprimestyle":true},
                        "childNodes":[
                          {"kind":"text",
                           "text":"c"}]}]},
                    {"kind":"mspace",
                     "texClass":0,
                     "attributes":{"width":"thinmathspace"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{"scriptlevel":0},
                     "childNodes":[],
                     "isSpacelike":true},
                    {"kind":"mfrac",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{"mathvariant":"normal"},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0,
                                     "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"∂"}]},
                       {"kind":"TeXAtom",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0},
                        "properties":{"texprimestyle":true},
                        "childNodes":[
                          {"kind":"mrow",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":false,
                                        "scriptlevel":0},
                           "properties":{"texprimestyle":true},
                           "childNodes":[
                             {"kind":"mover",
                              "texClass":-1,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":false,
                                           "scriptlevel":0,
                                           "accent":true},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"TeXAtom",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mrow",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":0},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"mi",
                                       "texClass":0,
                                       "attributes":{"mathvariant":"bold"},
                                       "inherited":{
                                                    "displaystyle":false,
                                                    "scriptlevel":0,
                                                    "mathvariant":"italic"},
                                       "properties":{"texprimestyle":true},
                                       "childNodes":[
                                         {"kind":"text",
                                          "text":"E"}]}],
                                    "isInferred":true}]},
                                {"kind":"mo",
                                 "texClass":3,
                                 "attributes":{"stretchy":false},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":0,
                                              "form":"infix",
                                              "accent":true,
                                              "stretchy":true},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"text",
                                    "text":"→"}],
                                 "isEmbellished":true}]}],
                           "isInferred":true}]}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"mfrac",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mn",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"4"}]},
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0,
                                     "mathvariant":"italic"},
                        "properties":{"texprimestyle":true},
                        "childNodes":[
                          {"kind":"text",
                           "text":"π"}]}]},
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":-1,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{"mathvariant":"bold"},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"j"}]}],
                                 "isInferred":true}]},
                             {"kind":"mo",
                              "texClass":3,
                              "attributes":{"stretchy":false},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true,
                                           "stretchy":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"→"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]}]},
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{"mathvariant":"normal"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"∇"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"⋅"}],
                     "isEmbellished":true},
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":-1,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{"mathvariant":"bold"},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"E"}]}],
                                 "isInferred":true}]},
                             {"kind":"mo",
                              "texClass":3,
                              "attributes":{"stretchy":false},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true,
                                           "stretchy":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"→"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"mn",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"4"}]},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"π"}]},
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"ρ"}]}],
                  "isInferred":true}]}]},
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{"mathvariant":"normal"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"∇"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"×"}],
                     "isEmbellished":true},
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":-1,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{"mathvariant":"bold"},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"E"}]}],
                                 "isInferred":true}]},
                             {"kind":"mo",
                              "texClass":3,
                              "attributes":{"stretchy":false},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true,
                                           "stretchy":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"→"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]},
                    {"kind":"mspace",
                     "texClass":0,
                     "attributes":{"width":"thinmathspace"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{"scriptlevel":0},
                     "childNodes":[],
                     "isSpacelike":true},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"+"}],
                     "isEmbellished":true},
                    {"kind":"mspace",
                     "texClass":0,
                     "attributes":{"width":"thinmathspace"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{"scriptlevel":0},
                     "childNodes":[],
                     "isSpacelike":true},
                    {"kind":"mfrac",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mn",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"1"}]},
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0,
                                     "mathvariant":"italic"},
                        "properties":{"texprimestyle":true},
                        "childNodes":[
                          {"kind":"text",
                           "text":"c"}]}]},
                    {"kind":"mspace",
                     "texClass":0,
                     "attributes":{"width":"thinmathspace"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{"scriptlevel":0},
                     "childNodes":[],
                     "isSpacelike":true},
                    {"kind":"mfrac",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mi",
                        "texClass":0,
                        "attributes":{"mathvariant":"normal"},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0,
                                     "mathvariant":"italic"},
                        "properties":{},
                        "childNodes":[
                          {"kind":"text",
                           "text":"∂"}]},
                       {"kind":"TeXAtom",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":false,
                                     "scriptlevel":0},
                        "properties":{"texprimestyle":true},
                        "childNodes":[
                          {"kind":"mrow",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":false,
                                        "scriptlevel":0},
                           "properties":{"texprimestyle":true},
                           "childNodes":[
                             {"kind":"mover",
                              "texClass":-1,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":false,
                                           "scriptlevel":0,
                                           "accent":true},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"TeXAtom",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mrow",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":0},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"mi",
                                       "texClass":0,
                                       "attributes":{"mathvariant":"bold"},
                                       "inherited":{
                                                    "displaystyle":false,
                                                    "scriptlevel":0,
                                                    "mathvariant":"italic"},
                                       "properties":{"texprimestyle":true},
                                       "childNodes":[
                                         {"kind":"text",
                                          "text":"B"}]}],
                                    "isInferred":true}]},
                                {"kind":"mo",
                                 "texClass":3,
                                 "attributes":{"stretchy":false},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":0,
                                              "form":"infix",
                                              "accent":true,
                                              "stretchy":true},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"text",
                                    "text":"→"}],
                                 "isEmbellished":true}]}],
                           "isInferred":true}]}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":-1,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mn",
                                    "texClass":0,
                                    "attributes":{"mathvariant":"bold"},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"0"}]}],
                                 "isInferred":true}]},
                             {"kind":"mo",
                              "texClass":3,
                              "attributes":{"stretchy":false},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true,
                                           "stretchy":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"→"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]}]},
           {"kind":"mtr",
            "texClass":null,
            "attributes":{},
            "inherited":{
                         "columnalign":"right left right left right left right left right left right left",
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{"mathvariant":"normal"},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "mathvariant":"italic"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"∇"}]},
                    {"kind":"mo",
                     "texClass":2,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"⋅"}],
                     "isEmbellished":true},
                    {"kind":"TeXAtom",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":-1,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mover",
                           "texClass":-1,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "accent":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{"texprimestyle":true},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"texprimestyle":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{"mathvariant":"bold"},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"B"}]}],
                                 "isInferred":true}]},
                             {"kind":"mo",
                              "texClass":3,
                              "attributes":{"stretchy":false},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "form":"infix",
                                           "accent":true,
                                           "stretchy":true},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"→"}],
                              "isEmbellished":true}]}],
                        "isInferred":true}]}],
                  "isInferred":true}]},
              {"kind":"mtd",
               "texClass":null,
               "attributes":{},
               "inherited":{
                            "columnalign":"right left right left right left right left right left right left",
                            "displaystyle":true,
                            "scriptlevel":0},
               "properties":{},
               "childNodes":[
                 {"kind":"mrow",
                  "texClass":0,
                  "attributes":{},
                  "inherited":{
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mi",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[]},
                    {"kind":"mo",
                     "texClass":3,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0,
                                  "form":"infix"},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"="}],
                     "isEmbellished":true},
                    {"kind":"mn",
                     "texClass":0,
                     "attributes":{},
                     "inherited":{
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"text",
                        "text":"0"}]}],
                  "isInferred":true}]}]}]}],
      "isInferred":true}]}
);


parserTest.runTest(
  'Cubic Binomial',
  '{\\begin{eqnarray}(x+y)^{3}&=&(x+y)(x+y)(x+y)\\\\&' +
    '=&xxx+xxy+xyx+{\\underline {xyy}}+yxx+{\\underline {yxy}}' +
    '+{\\underline {yyx}}+yyy\\\\&=&x^{3}+3x^{2}y+' +
    '{\\underline {3xy^{2}}}+y^{3}.\\end{eqnarray}}',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"TeXAtom",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{},
         "childNodes":[
           {"kind":"mrow",
            "texClass":0,
            "attributes":{},
            "inherited":{
                         "displaystyle":true,
                         "scriptlevel":0},
            "properties":{},
            "childNodes":[
              {"kind":"mtable",
               "texClass":0,
               "attributes":{"columnalign":"right center left",
                             "rowspacing":"3pt",
                             "columnspacing":"0 thickmathspace",
                             "displaystyle":true},
               "inherited":{
                            "scriptlevel":0},
               "properties":{"useHeight":1},
               "childNodes":[
                 {"kind":"mtr",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                               "columnalign":"right center left",
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":4,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mo",
                           "texClass":4,
                           "attributes":{"stretchy":false},
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
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"msup",
                           "texClass":5,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mo",
                              "texClass":5,
                              "attributes":{"stretchy":false},
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
                              "isEmbellished":true},
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":false,
                                           "scriptlevel":1},
                              "properties":{},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":1},
                                 "properties":{},
                                 "childNodes":[
                                   {"kind":"mn",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"3"}]}],
                                 "isInferred":true}]}],
                           "isEmbellished":true}],
                        "isInferred":true}]},
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[]},
                          {"kind":"mo",
                           "texClass":3,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"postfix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"="}],
                           "isEmbellished":true}],
                        "isInferred":true}]},
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[]},
                          {"kind":"mo",
                           "texClass":4,
                           "attributes":{"stretchy":false},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix",
                                        "fence":true,
                                        "stretchy":true,
                                        "symmetric":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"("}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mo",
                           "texClass":5,
                           "attributes":{"stretchy":false},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix",
                                        "fence":true,
                                        "stretchy":true,
                                        "symmetric":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":")"}],
                           "isEmbellished":true},
                          {"kind":"mo",
                           "texClass":4,
                           "attributes":{"stretchy":false},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix",
                                        "fence":true,
                                        "stretchy":true,
                                        "symmetric":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"("}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mo",
                           "texClass":5,
                           "attributes":{"stretchy":false},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix",
                                        "fence":true,
                                        "stretchy":true,
                                        "symmetric":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":")"}],
                           "isEmbellished":true},
                          {"kind":"mo",
                           "texClass":4,
                           "attributes":{"stretchy":false},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix",
                                        "fence":true,
                                        "stretchy":true,
                                        "symmetric":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"("}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mo",
                           "texClass":5,
                           "attributes":{"stretchy":false},
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
                           "isEmbellished":true}],
                        "isInferred":true}]}]},
                 {"kind":"mtr",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                               "columnalign":"right center left",
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":null,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[],
                        "isInferred":true,
                        "isSpacelike":true}]},
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[]},
                          {"kind":"mo",
                           "texClass":3,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"postfix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"="}],
                           "isEmbellished":true}],
                        "isInferred":true}]},
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"TeXAtom",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mrow",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{},
                              "childNodes":[
                                {"kind":"munder",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"subsupOK":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"x"}]},
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"y"}]}]}],
                              "isInferred":true}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"x"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"TeXAtom",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mrow",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{},
                              "childNodes":[
                                {"kind":"munder",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"subsupOK":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"y"}]},
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"x"}]}]}],
                              "isInferred":true}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"TeXAtom",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mrow",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{},
                              "childNodes":[
                                {"kind":"munder",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"subsupOK":true},
                                 "childNodes":[
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0,
                                                 "mathvariant":"italic"},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"y"}]},
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"y"}]}]}],
                              "isInferred":true}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]}],
                        "isInferred":true}]}]},
                 {"kind":"mtr",
                  "texClass":null,
                  "attributes":{},
                  "inherited":{
                               "columnalign":"right center left",
                               "displaystyle":true,
                               "scriptlevel":0},
                  "properties":{},
                  "childNodes":[
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":null,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[],
                        "isInferred":true,
                        "isSpacelike":true}]},
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[]},
                          {"kind":"mo",
                           "texClass":3,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"postfix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"="}],
                           "isEmbellished":true}],
                        "isInferred":true}]},
                    {"kind":"mtd",
                     "texClass":null,
                     "attributes":{},
                     "inherited":{
                                  "columnalign":"right center left",
                                  "displaystyle":true,
                                  "scriptlevel":0},
                     "properties":{},
                     "childNodes":[
                       {"kind":"mrow",
                        "texClass":0,
                        "attributes":{},
                        "inherited":{
                                     "displaystyle":true,
                                     "scriptlevel":0},
                        "properties":{},
                        "childNodes":[
                          {"kind":"msup",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mi",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "mathvariant":"italic"},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"x"}]},
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":false,
                                           "scriptlevel":1},
                              "properties":{},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":1},
                                 "properties":{},
                                 "childNodes":[
                                   {"kind":"mn",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"3"}]}],
                                 "isInferred":true}]}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"mn",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"3"}]},
                          {"kind":"msup",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mi",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "mathvariant":"italic"},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"x"}]},
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":false,
                                           "scriptlevel":1},
                              "properties":{},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":1},
                                 "properties":{},
                                 "childNodes":[
                                   {"kind":"mn",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"2"}]}],
                                 "isInferred":true}]}]},
                          {"kind":"mi",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "mathvariant":"italic"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"y"}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"TeXAtom",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mrow",
                              "texClass":-1,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0},
                              "properties":{},
                              "childNodes":[
                                {"kind":"munder",
                                 "texClass":-1,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":true,
                                              "scriptlevel":0},
                                 "properties":{"subsupOK":true},
                                 "childNodes":[
                                   {"kind":"mn",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":true,
                                                 "scriptlevel":0},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"3"}]},
                                   {"kind":"mi",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1,
                                                 "mathvariant":"italic"},
                                    "properties":{"texprimestyle":true},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"x"}]}]}],
                              "isInferred":true}]},
                          {"kind":"mo",
                           "texClass":2,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"infix"},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"+"}],
                           "isEmbellished":true},
                          {"kind":"msup",
                           "texClass":0,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0},
                           "properties":{},
                           "childNodes":[
                             {"kind":"mi",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":true,
                                           "scriptlevel":0,
                                           "mathvariant":"italic"},
                              "properties":{},
                              "childNodes":[
                                {"kind":"text",
                                 "text":"y"}]},
                             {"kind":"TeXAtom",
                              "texClass":0,
                              "attributes":{},
                              "inherited":{
                                           "displaystyle":false,
                                           "scriptlevel":1},
                              "properties":{},
                              "childNodes":[
                                {"kind":"mrow",
                                 "texClass":0,
                                 "attributes":{},
                                 "inherited":{
                                              "displaystyle":false,
                                              "scriptlevel":1},
                                 "properties":{},
                                 "childNodes":[
                                   {"kind":"mn",
                                    "texClass":0,
                                    "attributes":{},
                                    "inherited":{
                                                 "displaystyle":false,
                                                 "scriptlevel":1},
                                    "properties":{},
                                    "childNodes":[
                                      {"kind":"text",
                                       "text":"3"}]}],
                                 "isInferred":true}]}]},
                          {"kind":"mo",
                           "texClass":6,
                           "attributes":{},
                           "inherited":{
                                        "displaystyle":true,
                                        "scriptlevel":0,
                                        "form":"postfix",
                                        "separator":true},
                           "properties":{},
                           "childNodes":[
                             {"kind":"text",
                              "text":"."}],
                           "isEmbellished":true}],
                        "isInferred":true}]}]}]}],
            "isInferred":true}]}],
      "isInferred":true}]}
);


// This is not AMS dependent.
parserTest.runTest(
  'spaces', 'A\\,B\\!C',
  {"kind":"math",
   "texClass":0,
   "attributes":{"display":"block"},
   "inherited":{"displaystyle":true,
                "scriptlevel":0},
   "properties":{},
   "childNodes":[
     {"kind":"mrow",
      "texClass":0,
      "attributes":{},
      "inherited":{
                   "displaystyle":true,
                   "scriptlevel":0},
      "properties":{},
      "childNodes":[
        {"kind":"mi",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "mathvariant":"italic"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"A"}]},
        {"kind":"mspace",
         "texClass":0,
         "attributes":{"width":"thinmathspace"},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{"scriptlevel":0},
         "childNodes":[],
         "isSpacelike":true},
        {"kind":"mi",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "mathvariant":"italic"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"B"}]},
        {"kind":"mspace",
         "texClass":0,
         "attributes":{"width":"negativethinmathspace"},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0},
         "properties":{"scriptlevel":0},
         "childNodes":[],
         "isSpacelike":true},
        {"kind":"mi",
         "texClass":0,
         "attributes":{},
         "inherited":{
                      "displaystyle":true,
                      "scriptlevel":0,
                      "mathvariant":"italic"},
         "properties":{},
         "childNodes":[
           {"kind":"text",
            "text":"C"}]}],
      "isInferred":true}]}
);


parserTest.runTest(
  'Probability', 'P(E) = {n \\choose k} p^k (1-p)^{ n-k}',
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
    "inherited":{
                 "displaystyle":true,
                 "scriptlevel":0},
    "properties":{},
    "childNodes":[
      {"kind":"mi",
       "texClass":0,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "mathvariant":"italic"},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"P"}]},
      {"kind":"mo",
       "texClass":4,
       "attributes":{"stretchy":false},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "form":"infix",
                    "fence":true,
                    "stretchy":true,
                    "symmetric":true},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"("}],
       "isEmbellished":true},
      {"kind":"mi",
       "texClass":0,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "mathvariant":"italic"},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"E"}]},
      {"kind":"mo",
       "texClass":5,
       "attributes":{"stretchy":false},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "form":"infix",
                    "fence":true,
                    "stretchy":true,
                    "symmetric":true},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":")"}],
       "isEmbellished":true},
      {"kind":"mo",
       "texClass":3,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "form":"infix"},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"="}],
       "isEmbellished":true},
      {"kind":"TeXAtom",
       "texClass":0,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0},
       "properties":{},
       "childNodes":[
         {"kind":"mrow",
          "texClass":0,
          "attributes":{},
          "inherited":{
                       "displaystyle":true,
                       "scriptlevel":0},
          "properties":{},
          "childNodes":[
            {"kind":"mrow",
             "texClass":0,
             "attributes":{},
             "inherited":{
                          "displaystyle":true,
                          "scriptlevel":0},
             "properties":{"open":"(",
                           "close":")"},
             "childNodes":[
               {"kind":"TeXAtom",
                "texClass":0,
                "attributes":{},
                "inherited":{
                             "displaystyle":true,
                             "scriptlevel":0},
                "properties":{},
                "childNodes":[
                  {"kind":"mrow",
                   "texClass":4,
                   "attributes":{},
                   "inherited":{
                                "displaystyle":true,
                                "scriptlevel":0},
                   "properties":{},
                   "childNodes":[
                     {"kind":"TeXAtom",
                      "texClass":4,
                      "attributes":{},
                      "inherited":{
                                   "displaystyle":true,
                                   "scriptlevel":0},
                      "properties":{},
                      "childNodes":[
                        {"kind":"mrow",
                         "texClass":4,
                         "attributes":{},
                         "inherited":{
                                      "displaystyle":true,
                                      "scriptlevel":0},
                         "properties":{},
                         "childNodes":[
                           {"kind":"mo",
                            "texClass":4,
                            "attributes":{"maxsize":"2.047em",
                                          "minsize":"2.047em"},
                            "inherited":{
                                         "displaystyle":true,
                                         "scriptlevel":0,
                                         "form":"infix",
                                         "fence":true,
                                         "stretchy":true,
                                         "symmetric":true},
                            "properties":{},
                            "childNodes":[
                              {"kind":"text",
                               "text":"("}],
                            "isEmbellished":true}],
                         "isInferred":true,
                         "isEmbellished":true}],
                      "isEmbellished":true}],
                   "isInferred":true,
                   "isEmbellished":true}],
                "isEmbellished":true},
               {"kind":"TeXAtom",
                "texClass":0,
                "attributes":{},
                "inherited":{
                             "displaystyle":true,
                             "scriptlevel":0},
                "properties":{},
                "childNodes":[
                  {"kind":"mrow",
                   "texClass":4,
                   "attributes":{},
                   "inherited":{
                                "displaystyle":true,
                                "scriptlevel":0},
                   "properties":{},
                   "childNodes":[
                     {"kind":"TeXAtom",
                      "texClass":4,
                      "attributes":{},
                      "inherited":{
                                   "displaystyle":true,
                                   "scriptlevel":0},
                      "properties":{},
                      "childNodes":[
                        {"kind":"mrow",
                         "texClass":4,
                         "attributes":{},
                         "inherited":{
                                      "displaystyle":true,
                                      "scriptlevel":0},
                         "properties":{},
                         "childNodes":[
                           {"kind":"mo",
                            "texClass":4,
                            "attributes":{"maxsize":"1.2em",
                                          "minsize":"1.2em"},
                            "inherited":{
                                         "displaystyle":true,
                                         "scriptlevel":0,
                                         "form":"infix",
                                         "fence":true,
                                         "stretchy":true,
                                         "symmetric":true},
                            "properties":{},
                            "childNodes":[
                              {"kind":"text",
                               "text":"("}],
                            "isEmbellished":true}],
                         "isInferred":true,
                         "isEmbellished":true}],
                      "isEmbellished":true}],
                   "isInferred":true,
                   "isEmbellished":true}],
                "isEmbellished":true},
               {"kind":"TeXAtom",
                "texClass":0,
                "attributes":{},
                "inherited":{
                             "displaystyle":true,
                             "scriptlevel":0},
                "properties":{},
                "childNodes":[
                  {"kind":"mrow",
                   "texClass":4,
                   "attributes":{},
                   "inherited":{
                                "displaystyle":true,
                                "scriptlevel":0},
                   "properties":{},
                   "childNodes":[
                     {"kind":"TeXAtom",
                      "texClass":4,
                      "attributes":{},
                      "inherited":{
                                   "displaystyle":true,
                                   "scriptlevel":0},
                      "properties":{},
                      "childNodes":[
                        {"kind":"mrow",
                         "texClass":4,
                         "attributes":{},
                         "inherited":{
                                      "displaystyle":true,
                                      "scriptlevel":0},
                         "properties":{},
                         "childNodes":[
                           {"kind":"mo",
                            "texClass":4,
                            "attributes":{"maxsize":"1.2em",
                                          "minsize":"1.2em"},
                            "inherited":{
                                         "displaystyle":true,
                                         "scriptlevel":0,
                                         "form":"infix",
                                         "fence":true,
                                         "stretchy":true,
                                         "symmetric":true},
                            "properties":{},
                            "childNodes":[
                              {"kind":"text",
                               "text":"("}],
                            "isEmbellished":true}],
                         "isInferred":true,
                         "isEmbellished":true}],
                      "isEmbellished":true}],
                   "isInferred":true,
                   "isEmbellished":true}],
                "isEmbellished":true},
               {"kind":"TeXAtom",
                "texClass":0,
                "attributes":{},
                "inherited":{
                             "displaystyle":true,
                             "scriptlevel":0},
                "properties":{},
                "childNodes":[
                  {"kind":"mrow",
                   "texClass":4,
                   "attributes":{},
                   "inherited":{
                                "displaystyle":true,
                                "scriptlevel":0},
                   "properties":{},
                   "childNodes":[
                     {"kind":"TeXAtom",
                      "texClass":4,
                      "attributes":{},
                      "inherited":{
                                   "displaystyle":true,
                                   "scriptlevel":0},
                      "properties":{},
                      "childNodes":[
                        {"kind":"mrow",
                         "texClass":4,
                         "attributes":{},
                         "inherited":{
                                      "displaystyle":true,
                                      "scriptlevel":0},
                         "properties":{},
                         "childNodes":[
                           {"kind":"mo",
                            "texClass":4,
                            "attributes":{"maxsize":"1.2em",
                                          "minsize":"1.2em"},
                            "inherited":{
                                         "displaystyle":true,
                                         "scriptlevel":0,
                                         "form":"infix",
                                         "fence":true,
                                         "stretchy":true,
                                         "symmetric":true},
                            "properties":{},
                            "childNodes":[
                              {"kind":"text",
                               "text":"("}],
                            "isEmbellished":true}],
                         "isInferred":true,
                         "isEmbellished":true}],
                      "isEmbellished":true}],
                   "isInferred":true,
                   "isEmbellished":true}],
                "isEmbellished":true}]}],
          "isInferred":true}]},
      {"kind":"msup",
       "texClass":0,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0},
       "properties":{},
       "childNodes":[
         {"kind":"mi",
          "texClass":0,
          "attributes":{},
          "inherited":{
                       "displaystyle":true,
                       "scriptlevel":0,
                       "mathvariant":"italic"},
          "properties":{},
          "childNodes":[
            {"kind":"text",
             "text":"p"}]},
         {"kind":"mi",
          "texClass":0,
          "attributes":{},
          "inherited":{
                       "displaystyle":false,
                       "scriptlevel":1,
                       "mathvariant":"italic"},
          "properties":{},
          "childNodes":[
            {"kind":"text",
             "text":"k"}]}]},
      {"kind":"mo",
       "texClass":4,
       "attributes":{"stretchy":false},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "form":"infix",
                    "fence":true,
                    "stretchy":true,
                    "symmetric":true},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"("}],
       "isEmbellished":true},
      {"kind":"mn",
       "texClass":0,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"1"}]},
      {"kind":"mo",
       "texClass":2,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "form":"infix"},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"−"}],
       "isEmbellished":true},
      {"kind":"mi",
       "texClass":0,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0,
                    "mathvariant":"italic"},
       "properties":{},
       "childNodes":[
         {"kind":"text",
          "text":"p"}]},
      {"kind":"msup",
       "texClass":5,
       "attributes":{},
       "inherited":{
                    "displaystyle":true,
                    "scriptlevel":0},
       "properties":{},
       "childNodes":[
         {"kind":"mo",
          "texClass":5,
          "attributes":{"stretchy":false},
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
          "isEmbellished":true},
         {"kind":"TeXAtom",
          "texClass":0,
          "attributes":{},
          "inherited":{
                       "displaystyle":false,
                       "scriptlevel":1},
          "properties":{},
          "childNodes":[
            {"kind":"mrow",
             "texClass":0,
             "attributes":{},
             "inherited":{
                          "displaystyle":false,
                          "scriptlevel":1},
             "properties":{},
             "childNodes":[
               {"kind":"mi",
                "texClass":0,
                "attributes":{},
                "inherited":{
                             "displaystyle":false,
                             "scriptlevel":1,
                             "mathvariant":"italic"},
                "properties":{},
                "childNodes":[
                  {"kind":"text",
                   "text":"n"}]},
               {"kind":"mo",
                "texClass":2,
                "attributes":{},
                "inherited":{
                             "displaystyle":false,
                             "scriptlevel":1,
                             "form":"infix"},
                "properties":{},
                "childNodes":[
                  {"kind":"text",
                   "text":"−"}],
                "isEmbellished":true},
               {"kind":"mi",
                "texClass":0,
                "attributes":{},
                "inherited":{
                             "displaystyle":false,
                             "scriptlevel":1,
                             "mathvariant":"italic"},
                "properties":{},
                "childNodes":[
                  {"kind":"text",
                   "text":"k"}]}],
             "isInferred":true}]}],
       "isEmbellished":true}],
    "isInferred":true}]}
);


parserTest.printTime();
