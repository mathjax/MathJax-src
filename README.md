# Development repository for MathJax v3 #

MathJax v3 is now in beta release.  The `master` branch is not the beta release; it is the current development copy, set up for development testing.

The [https://github.com/mathjax/mj3-demos](https://github.com/mathjax/mj3-demos) repository includes examples and webpacked files for the beta release.  See the instructions there for how to use them.

The [https://github.com/mathjax/mj3-demos-node](https://github.com/mathjax/mj3-demos-node) repository includes examples for how to use MathJax version 3 with NodeJS.

## What's Included

This beta version includes two input processors (TeX and MathML) and one output processor (CommonHTML).  Other input and output processors (e.g., AsciiMath input and SVG output) will be added in the future.

The current TeX input processor has all the core functionality of the MathJax v2 TeX input, and several of the extensions built in, but some extensions are still to come.  For example, `\unicode`, `\bbox`, and the `color` extension are not yet available.

The CommonHTML output implements all the MathML elements that v2 does, but does not yet include support for line breaking (neither automatic nor explicit ones); this will be implemented in a later beta version.  Currently, there is no support for characters that are not within the MathJax TeX fonts, but that will be included in the future.

The MathJax contextual menu is not yet implemented.

The ability to configure MathJax through a configuration object, as in v2, is limited at the moment.  In version 3, this type of customization is handled through building custom packed versions of MathJax, and that is not yet fully documented.

## Overview

MathJax v3 is a complete rewrite of MathJax from the ground up, using Typescript and ES6 modules, and our experience from version 2.  There is still a lot to do, but a significant portion of MathJax is now available in this beta release.

The way that MathJax operates in version 3 is significanly different from version 2.  Instead of dynamically loading extensions and other pieces based on your configuration, in version 3 you load the components you need and explicitly request the actions you wish MathJax to take.  

The `samples` directory contains some examples of how this works, but most of these are for testing purposes.  The files in [https://github.com/mathjax/mj3-demos](https://github.com/mathjax/mj3-demos) are a better place to look for practical examples.

In particular, you can use webpack or other similar tools to create a custom single-file build of the components of MathJax that you need for your situation.  Some examples are included in the mj3-demos repository linked above.

MathJax v3 is designed to work as easily in NodeJS on a server as it is in a browser.  The Typescript files can be down-compiled to ES5 (the default configuration distributed here), or you can edit `tsconfig.json` file to compile to ES6, for example.

## Getting Started

Check out a copy of this repository using `git` and cd into its directory:

    git clone https://github.com/mathjax/mathjax-v3.git mathjax-v3
    cd mathjax-v3

Install the needed components using `npm`:

    npm install

Compile the Typescript source:

    npx tsc

This should convert the typescript files into the `mathjax3` directory, where you can include them into your own scripts.

## A Sample Script

Here is a sample NodeJS script that can be used to convert TeX notation to MathML.  Call it `tex2mml`.

    //
    //  Load the packages needed for MathJax
    //
    const TeX = require('./mathjax3/input/tex.js').TeX;
    const AbstractMathItem = require('./mathjax3/core/MathItem.js').AbstractMathItem;
    const LiteDocument = require('./mathjax3/adaptors/lite/Document.js').LiteDocument;
    const MmlVisitor = require('./mathjax3/core/MmlTree/SerializedMmlVisitor.js').SerializedMmlVisitor;
        
    require('./mathjax3/input/tex/base/BaseConfiguration.js');
    require('./mathjax3/input/tex/ams/AmsConfiguration.js');
    require('./mathjax3/input/tex/newcommand/NewcommandConfiguration.js');
    require('./mathjax3/input/tex/boldsymbol/BoldsymbolConfiguration.js');
    
    //
    //  A generic math item
    //
    class GenericMathItem extends AbstractMathItem {};
    
    //
    //  Create the input jax and document
    //
    const tex = new TeX({
      packages: ['base', 'ams', 'newcommand', 'boldsymbol']
    });
    const document = new LiteDocument();
    
    //
    //  Create a MathML serializer
    //
    const visitor = new MmlVisitor();
    const toMathML = (node => visitor.visitTree(node, document));
    
    //
    //  Typeset a TeX string and return the serialized MathML
    //
    const Typeset = (string, display) => {
        const math = new GenericMathItem(string, tex, display);
        math.compile();
        return toMathML(math.root);
    };
    
    //
    //  Convert the math provided by the user
    //
    console.log(Typeset(process.argv[2] || '', true));

You can run this by using

    node tex2mml 'x+1'

See the [mj3-demos-node](https://github.com/mathjax/mj3-demos-node) repository for additional examples.
