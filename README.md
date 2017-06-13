Proof of Concept Node.js src virus
==================================

## Files

### `payload.js`

This script defines a global function: `global.infect`, taking some URI encoded JS code as input.

`global.infect` works as follows:

  1. It recursively searches for folders (from the home directory) that contain a `package.json` file up until a maximum depth of 10.
  2. For each candidate folder, it attempts to find a main script using the `main` key inside of `package.json`, or failing that: `index.js`. After it finds the main script, it does the following things:
      1. decodes the URI encoded input.
      2. executes the decoded input.
      3. expecting the result of the above execution to have defined a `global.infect` function, calls it on the encoded input.

### `build.js`

This script leverages `payload.js` to create a minified, self replicating source code virus. It works by:
  1. compiling `payload.js` to `ES2015`
  2. compressing the result 
  3. encoding the result (using `encodeURI`)
  3. creating a file called `payload.built.js` that:
      1. executes the decoded `payload.js`
      2. passes the encoded `payload.js` into payload's `infect` function

### `payload.built.js`

This file contains the minimized payload injected into an empty file. Running this script will cause the virus to propagate to all projects in the home folder.







