# Development repository for MathJax v3 #

MathJax v3 is now in beta release; see the [beta branch](https://github.com/mathjax/mathjax-v3/tree/beta) for details.  See the [https://github.com/mathjax/mj3-demos](https://github.com/mathjax/mj3-demos) for examples and webpacked files for the beta release.

The `master` branch is not the beta release.  It is the current development copy, set up for development testing, as described below.

---

There are two bootstrap files for running the code:

* `load.js` for running in node (`node load`), and 
* `load.html` for running in a browser.

These allow you to specify a test file to run.  For example,

    node load samples/filename.js

will run the file `samples/filename.js`, while entering

    load.html?samples/filename.js

in your browser will run the same file in your browser.  If you leave off the file to load, then it defaults to `main.js`.

Additional arguments get passed to the script in the `process.argv` array.  For example

    node load samples/tex2html.js 'x+1'

or

    load.html?samples/tex2html.js&x+1

would load `tex2html.js` passing it `x+1` in `process.argv[3]`.

Both `load.js` and `load.html` use `System.js` to manage the loading of version 3 files.  In some browsers (e.g., Firefox), you get syntax errors for the files as they load, but that seems to be some side-effect of how `System.js` works.  The code is OK and runs properly anyway.

There is a tiny document in the `docs` directory that gives the basic structures and some sample code, but it is woefully inadequate at the moment, and may be out of date.  More to come later.
