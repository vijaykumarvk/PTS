var http = require('http');
var url  = require('url');
var qrString = require('querystring');
var fs       = require('fs');
var redis    = require('redis');
var client   = redis.createClient();
var file ;
    client.on('connect',function(){
        console.log('connected');
    });
http.createServer(ready).listen(8080);
function ready(req,res){
    
    res.writeHead(200,{"content-type":"text/html"});
    res.write("hello world");
    res.end();
    //client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
    client.lrange('f', 0,-1,function(err, reply) {
        console.log(reply);
    });
}
