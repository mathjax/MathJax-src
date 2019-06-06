// import {MathJax} from 'mathjax3/mathjax.js';

import ParseUtil from 'mathjax3/input/tex/ParseUtil.js';
import {Test} from './tests.js';


class KeyvalTest extends Test {

  runTest(name, options, expected) {
    this.test(
      name,
      t => {
        try {
          let keyval = ParseUtil.keyvalOptions(options);
          t.deepEqual(keyval, expected, name);
        } catch (e) {
          t.deepEqual(e.message, expected, name);
        }
      }
    );
  }

}

let keyvalTest = new KeyvalTest();

keyvalTest.runTest(
  'Keyval Trival', 'key={{}}',
  {key: true}
);

keyvalTest.runTest(
  'Keyval Trivial 2', 'key1={{}},key2={{{{}}}}',
  {key1: true, key2: true}
);


keyvalTest.runTest(
  'Keyval Trival3', 'key={{}{}}',
  {key: '{}{}'}
);

keyvalTest.runTest(
  'Keyval Trivial 4', 'key1= { { }   },key2= {{ { {  }} } }',
  {key1: true, key2: true}
);


keyvalTest.runTest(
  'Keyval Single', 'key=a',
  {key: 'a'}
);

keyvalTest.runTest(
  'Keyval Double', 'key1=a,key2=b',
  {key1: 'a', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Space', 'key1 = a   , key2 =    b',
  {key1: 'a', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Single True', 'key1',
  {key1: true}
);

keyvalTest.runTest(
  'Keyval Double True', 'key1,key2',
  {key1: true, key2: true}
);

keyvalTest.runTest(
  'Keyval Mixed', 'key1=a,key2,key3=c',
  {key1: 'a', key2: true, key3: 'c'}
);

keyvalTest.runTest(
  'Keyval Empty Comma Begin', ',key1=a,key2,key3=c',
  {key1: 'a', key2: true, key3: 'c'}
);

keyvalTest.runTest(
  'Keyval Empty Comma Mid', 'key1=a,,key2,key3=c',
  {key1: 'a', key2: true, key3: 'c'}
);

keyvalTest.runTest(
  'Keyval Empty Comma End', 'key1=a,key2,key3=c,',
  {key1: 'a', key2: true, key3: 'c'}
);

keyvalTest.runTest(
  'Keyval Empty Comma Multi', ',,key1=a,,,,key2,key3=c,,',
  {key1: 'a', key2: true, key3: 'c'}
);

keyvalTest.runTest(
  'Keyval Braces', 'key1={a},key2=b',
  {key1: 'a', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces 2', 'key1={{a}},key2=b',
  {key1: 'a', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces 3', 'key1={{{a}}},key2=b',
  {key1: 'a', key2: 'b'}
);


keyvalTest.runTest(
  'Keyval Braces Comma', 'key1={a,b,c},key2=b',
  {key1: 'a,b,c', key2: 'b'}
);


keyvalTest.runTest(
  'Keyval Braces Equal', 'key1={a=c},key2=b',
  {key1: 'a=c', key2: 'b'}
);


keyvalTest.runTest(
  'Keyval Braces Comma Equal', 'key1={a=c,b},key2=b',
  {key1: 'a=c,b', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces Simple 1', 'key1={{a}}',
  {key1: 'a'}
);

keyvalTest.runTest(
  'Keyval Braces Simple 2', 'key1={{a{b}}}',
  {key1: 'a{b}'}
);

keyvalTest.runTest(
  'Keyval Braces Simple 3', 'key1={{a={b}}}',
  {key1: 'a={b}'}
);

keyvalTest.runTest(
  'Keyval Braces Prefix', 'key1={{}a}',
  {key1: '{}a'}
);

keyvalTest.runTest(
  'Keyval Braces Prefix 2', 'key1={{{}}a}',
  {key1: '{{}}a'}
);

keyvalTest.runTest(
  'Keyval Braces Prefix 3', 'key1={{}{}a}',
  {key1: '{}{}a'}
);

keyvalTest.runTest(
  'Keyval Braces Prefix 4', 'key1={{{}{}a}}',
  {key1: '{}{}a'}
);

keyvalTest.runTest(
  'Keyval Braces Prefix 5', 'key1={{}{a}}',
  {key1: '{}{a}'}
);

keyvalTest.runTest(
  'Keyval Braces Prefix 6', 'key1={{{}}{a}}',
  {key1: '{{}}{a}'}
);

keyvalTest.runTest(
  'Keyval Braces Mixed 1', 'key1={{a},{b}},key2=b',
  {key1: '{a},{b}', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces Mixed 2', 'key1={{{a},{b}}},key2=b',
  {key1: '{a},{b}', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces Mixed 3', 'key1={{{a}},{{b},{c}}},key2=b',
  {key1: '{{a}},{{b},{c}}', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces Mixed 3 Spaces', 'key1 = { { { a}},{{b},{c} } }   ,key2=b',
  {key1: '{ { a}},{{b},{c} }', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces Mixed 4 Spaces', 'key1 = { { { { { { a}},{{b},{c} } } } } }   ,key2=b',
  {key1: '{ { a}},{{b},{c} }', key2: 'b'}
);

keyvalTest.runTest(
  'Keyval Braces Equals Mixed 3', 'key1={{{a}}={{b},{c}}},key2=b',
  {key1: '{{a}}={{b},{c}}', key2: 'b'}
);


keyvalTest.runTest(
  'Keyval Error 1', 'key={{a}',
  'Extra open brace or missing close brace'
);

keyvalTest.runTest(
  'Keyval Error 2', 'key={{a}{}',
  'Extra open brace or missing close brace'
);

keyvalTest.runTest(
  'Keyval Error 3', 'key1=}, key2={',
  'Extra open brace or missing close brace'
);

keyvalTest.runTest(
  'Keyval Unbalanced 1', 'key={a}}',
  {key: 'a}'}
);

keyvalTest.runTest(
  'Keyval Unbalanced 2', 'key1={a}}, key2=}b',
  {key1: 'a}', key2: '}b'}
);

keyvalTest.runTest(
  'Keyval Unbalanced 3', 'key1=}, key2={}}',
  {key1: true, key2: true}
);
