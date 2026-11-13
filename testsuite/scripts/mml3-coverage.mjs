#!/usr/bin/env node
/**
 * @file  Reports branch coverage of the MathML3 XSLT stylesheet.
 *
 * Extracts the XSLT from ts/input/mathml/mml3/mml3.ts, adds a marker message to
 * every xsl:template, xsl:when, xsl:otherwise and xsl:if, compiles it with
 * xslt3, runs the MathML inputs from testsuite/tests/input/mathml/Mml3.test.ts
 * through it, and lists the points that were never reached.
 *
 * Usage:  node scripts/mml3-coverage.mjs [tests-file ...]
 *
 * Additional files may be given as a Markdown file with ``` fenced MathML
 * examples, or a text file with examples separated by lines of "=====".
 * Requires saxon-js and xslt3 (from the repository's node_modules).
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const source = path.join(root, 'ts/input/mathml/mml3/mml3.ts');
const testFile = path.join(root, 'testsuite/tests/input/mathml/Mml3.test.ts');
const NS = 'http://www.w3.org/1998/Math/MathML';

/**
 * @returns {object} The Saxon-JS module (found directly or in the pnpm store)
 */
function loadSaxon() {
  const bases = [path.join(root, 'package.json')];
  const store = path.join(root, 'node_modules/.pnpm');
  if (fs.existsSync(store)) {
    for (const dir of fs.readdirSync(store)) {
      if (dir.startsWith('saxon-js@')) {
        bases.push(path.join(store, dir, 'node_modules/x.js'));
      }
    }
  }
  for (const base of bases) {
    try {
      return createRequire(base)('saxon-js');
    } catch (_err) {
      // try the next location
    }
  }
  throw new Error('saxon-js not found; run "pnpm install saxon-js"');
}

/**
 * @returns {string} The XSLT, as the template literal in mml3.ts evaluates it
 */
function getXSLT() {
  const text = fs.readFileSync(source, 'utf8');
  const raw = text.split('Mml3.XSLT = `')[1].split('`;')[0];
  return new Function('return `' + raw + '`')().trim();
}

/**
 * Add COV:n marker messages (after any leading xsl:param elements in templates).
 *
 * @param {string} xsl  The stylesheet
 * @returns {{xsl: string, points: string[]}}  The instrumented XSLT and point descriptions
 */
function instrument(xsl) {
  const points = [];
  const add = (match) => {
    points.push(match.replace(/\s+/g, ' ').slice(0, 80));
    return `<xsl:message>COV:${points.length - 1}</xsl:message>`;
  };
  xsl = xsl.replace(
    /<xsl:template\b[^>]*[^/]>(?:\s*<xsl:param\b[^>]*\/>)*/g,
    (m) => m + add(m)
  );
  xsl = xsl.replace(
    /<xsl:(?:when|if)\b[^>]*[^/]>|<xsl:otherwise>/g,
    (m) => m + add(m)
  );
  return { xsl, points };
}

/**
 * @param {string} file  A Jest test file, a Markdown file, or a ===== separated file
 * @returns {string[]}   The MathML inputs it contains
 */
function getInputs(file) {
  const text = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.test.ts')) {
    const examples = [...text.matchAll(/mml3\(`\n([\s\S]*?)\n`\)/g)].map(
      (m) => m[1]
    );
    const cases = text.match(
      /const cases: \[string, string\]\[\] = (\[[\s\S]*?\n {2}\]);/
    );
    const more = cases
      ? new Function('return ' + cases[1])().map(([, mml]) => mml)
      : [];
    return [...examples, ...more];
  }
  if (file.endsWith('.md')) {
    return [...text.matchAll(/^```\n([\s\S]*?)^```$/gm)].map((m) => m[1]);
  }
  return text.split(/\n=====\n/);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mml3-cov-'));
try {
  const { xsl, points } = instrument(getXSLT());
  fs.writeFileSync(path.join(tmp, 'inst.xsl'), xsl);
  execFileSync(
    path.join(root, 'node_modules/.bin/xslt3'),
    [
      `-xsl:${path.join(tmp, 'inst.xsl')}`,
      `-export:${path.join(tmp, 'inst.sef.json')}`,
      '-nogo',
    ],
    { stdio: 'inherit' }
  );
  const sef = JSON.parse(
    fs.readFileSync(path.join(tmp, 'inst.sef.json'), 'utf8')
  );
  const Saxon = loadSaxon();

  const files = process.argv.length > 2 ? process.argv.slice(2) : [testFile];
  const inputs = files.flatMap(getInputs);
  const hit = new Set();
  let failures = 0;
  for (let mml of inputs) {
    if (!/ xmlns[=:]/.test(mml)) {
      mml = mml.replace(/<(?:(\w+)(:))?math/, `<$1$2math xmlns$2$1="${NS}"`);
    }
    try {
      Saxon.transform({
        stylesheetInternal: sef,
        sourceText: mml,
        destination: 'serialized',
        deliverMessage: (msg) => {
          const m = String(msg.textContent ?? msg).match(/COV:(\d+)/);
          if (m) {
            hit.add(Number(m[1]));
          }
        },
      });
    } catch (err) {
      failures++;
      console.error('Transform failed:', err.message.slice(0, 100));
    }
  }
  const missed = points.map((p, i) => [i, p]).filter(([i]) => !hit.has(i));
  console.log(
    `${inputs.length} inputs, ${failures} failures, ` +
      `${points.length - missed.length}/${points.length} points covered`
  );
  for (const [i, p] of missed) {
    console.log(`  missed #${i}: ${p}`);
  }
  process.exitCode = missed.length ? 1 : 0;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
