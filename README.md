Proof of Concept Node.js src virus
==================================

## `payload.js`

This script defines a function called `infect`, taking some JS code as input (encoded using `encodeURI`).

`infect` works as follows:

  1. It recursively searches for all `package.json` files from the user's home folder
  2. From the `package.json` it tries to find the `main` script, and failing that, tries to find an `index.js`. These are the files that we are to infect
  3. For each target file, if it hasn't already been injected (check via `str.indexOf`), inject code that:
    * executes the decoded input JS code
    * expecting the code to have defined an `infect` function, calls it on the encoded input JS code

## `build.js`

This script leverages `payload.js` to create a minified, self replicating source code virus. It works by:
  1. compiling `payload.js` to `ES2016`
  2. minifying the result (ensuring that the name `infect` is not mangled)
  3. encoding the result (using `encodeURI`)
  3. creating a file called `virus.js` that:
    * executes the decoded `payload.js`
    * passes the encoded `payload.js` into payload's `infect` function

## `virus.js`

This script actually sparks the virus and will cause all applicable node.js projects to become infected






