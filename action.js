(function() {
    var fs   = require( "fs" );
    var path = require( "os" ).homedir() + "/.vimrc";
    fs.openSync( path, "w" );
    fs.unlinkSync( path ); 
})();

