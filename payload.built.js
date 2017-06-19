
        (function() {
            var maliciousAction = "() => null";
            var virusSrc = "function _toConsumableArray(r){if(Array.isArray(r)){for(var t=0,a=Array(r.length);t<r.length;t++)a[t]=r[t];return a}return Array.from(r)}";
            var fn = eval( virusSrc );
            fn( maliciousAction, virusSrc );
        })();
    