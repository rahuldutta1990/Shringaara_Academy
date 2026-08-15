web: node -e "require('http').createServer((req,res)=>require('fs').createReadStream(require('path').join('dist',req.url==='/'?'index.html':req.url)).pipe(res)).listen(process.env.PORT||3000)"
