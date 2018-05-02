import {ParserTest} from './parser-tests.js';

class ParserAmserrorTest extends ParserTest {

  constructor() {
    super();
  }

}

let parserTest = new ParserAmserrorTest();

parserTest.runTest(
  'Center Fraction Error', '\\cfrac[c]{a}{b}',
  {}
);


parserTest.runTest(
  'Genfrac Error', '\\genfrac{(}{)}{0pt}{4}{a}{b}',
  {}
);
