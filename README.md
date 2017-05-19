Proof of Concept Node.js src virus
==================================

## Files

### `payload.js`

This script defines a function called `infect`, taking some JS code as input (encoded using `encodeURI`).

`infect` works as follows:

  1. It recursively searches for folders that contain a `package.json` file.
  2. For each candidate folder, if there exists an `index.js` and it hasn't already been injected (check via `str.indexOf`), inject code that:
      1. decodes the URI encoded input.
      2. executes the decoded input.
      3. expecting the result of the above execution to have defined an `infect` function as a global variable, calls it on the encoded input.

### `build.js`

This script leverages `payload.js` to create a minified, self replicating source code virus. It works by:
  1. compiling `payload.js` to `ES2016`
  2. minifying the result (ensuring that the name `infect` is not mangled)
  3. encoding the result (using `encodeURI`)
  3. creating a file called `virus.js` that:
      1. executes the decoded `payload.js`
      2. passes the encoded `payload.js` into payload's `infect` function

### `virus.js`

This file contains the minimized payload injected into an empty file. Running this script will cause the virus to propagate to all projects in the home folder.







