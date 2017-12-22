var http = require('http');
var url  = require('url');
var fs=require("fs");
var qrString = require('querystring');
var redis    = require('redis');
var client   = redis.createClient();
var file ;
    client.on('connect',function(){
        console.log('connected');
    });
http.createServer(function(req,res){
    res.writeHead(200 , {'content-type':'text/html'});
    var body = "";
    if (req.url === "/"||req.url=="/signup"){
        file = fs.readFileSync('signup.html').toString();
        res.write(file);
        res.end();
    }
    else if (req.url == "/signin"){
        if(req.headers.cookie===undefined){
        file = fs.readFileSync('signin.html').toString();
        res.write(file);
        res.end();
        }
        else{
         file = fs.readFileSync('home.html').toString();
         res.write(file);
         res.end();    
        }
    }
    else if(req.url=="/home"){
        file = fs.readFileSync('home.html').toString();
        res.write(file);
        res.end(); 
    }
    else if(req.url=="/signout"){
        res.writeHead(200,{"content-type":"text/html","set-cookie":req.headers.cookie+'; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
         file = fs.readFileSync('signin.html').toString();
        res.write(file);
        res.end();
    }
    else if(req.url=="/edit"){
        client.hgetall("users",function(err,reply){
             b=req.headers.cookie;
             c=b.split("=");
             d=reply[c[1]];
             d=JSON.parse(d);
             file=fs.readFileSync("edit.html").toString();
             file1=file.replace(/id='inp1'/g, "id='inp1' value='"+d.Name+"'");
             file1=file1.replace(/id='inp2'/g, "id='inp2' value='"+d.Age+"'");
             res.write(file1);
             res.end();
        });
           }
    else if (req.method == 'POST')
    {
        req.on('data',function(chunk){
            body += chunk;
        });
        req.on('end',function(){
           redis(body);
        });
    }
    
    function redis(returnVal){
        var b,c;
        var query=qrString.parse(returnVal);
        client.hgetall("users",function(err,reply){
            console.log(reply);
           if(reply===null || reply[query.Email]===undefined){ 
               if(req.url=="/record"){
               client.hmset("users",query.Email,JSON.stringify(query),function(err,rep){
                   res.write('Signup successfully');   
                   res.end();
               });
               }
           }
           else{
               res.write("Email already exists");
               res.end();
           }
           if(req.url=="/login"){
             var a=reply[query.email];
             if(a===undefined){
                 res.write("Invalid user");     
                 res.end();
             }
             else{
                 a=JSON.parse(a);
                 if(a.Password==query.passwd){
                     res.writeHead(200,{"content-type":"text/html","set-cookie":"Email="+query.email});
                     res.write('sign in successfully');
                     res.end();
                 }
                 else{
                     res.write("invalid password");
                     res.end();
                 }
             }
             }
           else if(req.url=="/delete"){
                res.writeHead(200,{"content-type":"text/html","set-cookie":req.headers.cookie+'; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
                b=req.headers.cookie;
                c=b.split("=");
                client.hdel("users",c[1],function(err,rep){
                    if(rep==1){
                            res.write('deleted successfully');
                            res.end();
                        }
               });
           }
           else if(req.url=="/edited"){
               b=req.headers.cookie;
               c=b.split("=");
               reply1=reply[c[1]];
               reply1=JSON.parse(reply1);
               e=reply1.Email;
               f=reply1.Password;
               query.Email=e;
               query.Password=f;
               client.hmset("users",c[1],JSON.stringify(query),function(err,rep){
                   res.write("edited successfuly");
                   res.end();
                 });
           }
    });
    }
}).listen(8080);
