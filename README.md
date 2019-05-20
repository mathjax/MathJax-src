# Development repository for MathJax v3 #

MathJax v3 is now in beta release; see the [beta branch](https://github.com/mathjax/mathjax-v3/tree/beta) for details.  See the [mj3-demos repository](https://github.com/mathjax/mj3-demos) for examples of using MathJax v3 in webpages, and the [mj3-demos-node repository](https://github.com/mathjax/mj3-demos-node) for examples of using MathJax v3 in node applications.

See the [release notes](https://github.com/mathjax/mathjax-v3/releases) for details of the changes in this beta release.  See the examples linked above for documentation on how to use and configure MathJax for use in browsers or node applications.  More documentation will be forthcoming as part of the official version 3.0.0 release currently being prepared.

The `master` branch is not the beta release.  It is the current development copy, set up for development testing, as described below.  Check out the `beta.4` branch to obtain the beta release code.

---

Clone the repository and compile the files using the commands

    git clone https://github.com/mathjax/mathjax-v3.git mathjax-v3
    cd mathjax-v3
    npm install
    npm run compile
    npm run make-components

There are three bootstrap files for running the code:

* `load.js` for running in node (`node load`), 
* `load.mjs` for running node in ES6 module mode, and 
* `load.html` for running in a browser.

These allow you to specify a test file to run.  For example,

    node load samples/filename.js

or

    node load.mjs samples/filename.js

will run the file `samples/filename.js`, while entering

    load.html?samples/filename.js

in your browser will run the same file in your browser.  If you leave off the file to load, then it defaults to `main.js`.

Additional arguments get passed to the script in the `process.argv` array.  For example

    node load samples/tex2html.js 'x+1'

or

    load.html?samples/tex2html.js&x+1

would load `tex2html.js` passing it `x+1` in `process.argv[3]`.

Both `load.js` and `load.html` use `System.js` to manage the loading of version 3 files.  In some browsers (e.g., Firefox), you get syntax errors for the files as they load, but that seems to be some side-effect of how `System.js` works.  The code is OK and runs properly anyway.

The `load.mjs` file uses node's native implementation of ES6 modules, and processes the `import` and `export` commands automatically.  To write files that don't rely on `load.mjs`, you can use

    node -r esm filename.js

and simply import the needed MathJax code.

The file `v3-lab.html` is an interactive lab that you can open in a browser to experiment with MathJax v3.
