import { beforeEach, expect, describe, it } from '@jest/globals';
import {TeX} from '#js/input/tex';
import {HTMLDocument} from '#js/handlers/html/HTMLDocument.js';
import {liteAdaptor} from '#js/adaptors/liteAdaptor.js';
import {SerializedMmlVisitor} from '#js/core/MmlTree/SerializedMmlVisitor.js';
import { toXmlMatch } from '#helpers';
import {RegisterHTMLHandler} from '#js/handlers/html.js';

let html: any, tex: any, toMml: any;

beforeEach(() => {
  tex = new TeX({packages: ['base']});
  const visitor = new SerializedMmlVisitor();
  toMml = ((node: any) => visitor.visitTree(node));
});

describe('Base', () => {
  beforeEach(() => {
    html = new HTMLDocument('', liteAdaptor(), {InputJax: tex});
  })
  it('Identifier', () => {
    toXmlMatch(
      toMml(html.convert('x')),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x" display="block">
  <mi data-latex="x">x</mi>
</math>`
    );
  });
});


describe('Base Render Action', () => {
  beforeEach(() => {
    html = new HTMLDocument('', liteAdaptor(), {InputJax: tex, renderActions: {
      typeset: [150, (doc: any) => {for (const math of doc.math) {console.log('HERE1'); console.log(math)}}, () => console.log('HERE2')]
    }});
  })
  it('Identifier', () => {
    toXmlMatch(
      toMml(html.convert('x')),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x" display="block">
  <mi data-latex="x">x</mi>
</math>`
    );
  });
});

describe('Base Render Action', () => {
  beforeEach(() => {
    html = new HTMLDocument('', liteAdaptor(), {InputJax: tex, renderActions: {
      typeset: [150, (doc: any) => {for (const math of doc.math) {console.log('HERE1'); console.log(math)}}, () => console.log('HERE2')]
    }});
  })
  it('Identifier', () => {
    toXmlMatch(
      toMml(html.convert('x')),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x" display="block">
  <mi data-latex="x">x</mi>
</math>`
    );
  });
});

describe('Base Render Action Math', () => {
  beforeEach(() => {
    html = new HTMLDocument('', liteAdaptor(), {InputJax: tex, renderActions: {
      typeset: [150,
                (doc: any) => {for (const math of doc.math) {console.log('HERE1'); console.log(math)}},
                (_math: any, _doc: any) => {console.log('HERE3');}, true]
    }});
  })
  it('Identifier', () => {
    toXmlMatch(
      toMml(html.convert('x')),
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x" display="block">
  <mi data-latex="x">x</mi>
</math>`
    );
  });
});

describe('Base Math Document', () => {
  beforeEach(() => {
    RegisterHTMLHandler(liteAdaptor());
    html = new HTMLDocument('<html><body>$$x$$</body></html>', liteAdaptor(), {InputJax: tex, renderActions: {
      typeset: [150,
                (doc: any) => {for (const math of doc.math) {console.log('HERE1'); console.log(math.root.toString())}},
                (_math: any, _doc: any) => {console.log('HERE3');}, true]
    }});
  })
  it.only('Identifier', () => {
    try{
      html.render();
    } catch (_e) {}
    expect(html.typeset()).toBe(
      `<math xmlns="http://www.w3.org/1998/Math/MathML" data-latex="x" display="block">
  <mi data-latex="x">x</mi>
</math>`)
  });
});
