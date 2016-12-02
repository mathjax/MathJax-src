# Test branch for proposed v3 struture #

There are two bootstrap files for running the code:

* `test.js` for running in node (`node test.js`), and 
* `test.html` for running in a browser.

Each loads `System.js` to manage the module loading, and then runs `main.js`.  So you should edit `main.js` for your top-level code.

In some browsers (e.g., Firefox), you get syntax errors for the files as they load, but that seems to be some side-effect of how `System.js` works.  The code is OK and runs properly anyway.

There is a tiny document in the `docs` directory that gives the basic structures and some sample code, but it is woefully inadequate at the moment.  More to come later.
