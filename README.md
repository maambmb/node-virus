Proof of Concept Node.js src virus
==================================

## `payload.js`

This script defines a function called `infect`, taking some JS code as input (encoded using `encodeURI`).

`infect` works as follows:

  1. It recursively searches for all `package.json` files from the user's home folder
  2. From the `package.json` it tries to find a candidate file to infect. It searches, in order for the following files (stopping at the first match):
      1. `index.js`
      2. `${packagejson.name}.js`
      3. `app.js`
      4. `${packagejson.main}`
  3. For each target file, if it hasn't already been injected (check via `str.indexOf`), inject code that:
      1. executes the decoded input JS code
      2. expecting the code to have defined an `infect` function, calls it on the encoded input JS code

## `build.js`

This script leverages `payload.js` to create a minified, self replicating source code virus. It works by:
  1. compiling `payload.js` to `ES2016`
  2. minifying the result (ensuring that the name `infect` is not mangled)
  3. encoding the result (using `encodeURI`)
  3. creating a file called `virus.js` that:
      1. executes the decoded `payload.js`
      2. passes the encoded `payload.js` into payload's `infect` function

## `virus.js`

This script actually sparks the virus and will cause all applicable node.js projects to become infected






