var http = require('http');
var url = require('url');
var fs = require("fs");
var request = require("request");
var qrString = require('querystring');
var redis = require('redis');
var client = redis.createClient();
var file;
client.on('connect', function(){ console.log('connected'); });
http.createServer(function(req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    var query1 = url.parse(req.url, true);
    var body = "";
    if(req.url=="/favicon.ico"){
    }
    else if (req.url === "/") {
        file = fs.readFileSync('./school_frontpage.html').toString();
        res.write(file);
        res.end();
    } 
    else if (req.method == 'POST') {
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            redis(body);
        });
    }
    else if (req.url == "/login1" ||req.url == "login2"|| query1.pathname == "/login1") {
        user_login('./school_homepage.html');
    }  
    else if (query1.pathname == "/cookieGet") {
        client.hgetall("schools", function(err, reply) {
            if (reply !== null) {
                if (reply[query1.query.Email] !== undefined) {
                    var check = JSON.parse(reply[query1.query.Email]);
                    res.write(JSON.stringify(check));
                    res.end();
                } else {
                    loginCook();
                }
            } else {
                loginCook();
            }
        });
    }
    else if(query1.pathname=="/viewstu"){
        client.hget("studpare",query1.query.Email,function(err,reply){
            res.write(JSON.stringify(reply));
            res.end();
        });
    }
    else if (req.url == "/signout") {
        res.writeHead(200, {"content-type": "text/html",
                            "set-cookie": "Email=" + '; expires=Thu, 01 Jan 1970 00:00:00 GMT'});
        cookie();
    } else if (req.url == "/timeTable") {
        client.hgetall("timetable", function(err, reply) {
            res.write(JSON.stringify(reply));
            res.end();
        });
    } else if (req.url == "/subjects1") {
        client.hgetall("Subjects", function(err, reply) {
            res.write(JSON.stringify(reply));
            res.end();
        });
    } 
    else if(query1.pathname=="/viewpar"){
        array=[];
        client.hgetall("studpare",function(err,reply){
            keys=Object.keys(reply);
            for(i=0;i<keys.length;i++){
                if(reply[keys[i]]==query1.query.Email){
                    array.push(keys[i]);
                }
            }
            res.write(array.toString());
            res.end();
        });
    }
    else if(query1.pathname=="/notifi"){
        client.hgetall("ptmeets",function(err,reps){
        if(reps!==null){
           res.write(JSON.stringify(reps));
           res.end();
        }
        else{
            res.write("no");
            res.end();
        }
        });
    }
    else if(query1.pathname=="/leavestudent"){
        client.hget("leaved",query1.query.Class,function(err,reply){
            if(reply!==null){
                res.write(reply);
                res.end();
            }
            else{
                res.write("no");
                res.end();
            }
        });
    }
    else if(query1.pathname=='/postgets'){
        client.lrange(query1.query.Class,0,-1,function(err,reply){
            if(reply.length>0){
               reply=reply.toString();
               res.write(JSON.stringify(reply));
               res.end();
            }
            else {
                res.write("no posts");
                res.end();
            }
        });
    }
    else if(query1.pathname=="/stupar"){
        count1=0;
        client.hgetall("schools",function(err,reply1){
        keys1=Object.keys(reply1);
        index=keys1.indexOf(query1.query.parent_email);
        if(index!==-1){
            reply1=JSON.parse(reply1[keys1[index]]);
            if(reply1.Role=="Parent"){
                count1=1;
            }
            else{
                count1=-1;
            }
        }
        if((index!==-1&&count1==1)||(index==-1)){
        count=0;
        client.hgetall("studpare",function(err,reply){
            if(reply===null){
                 parents(query1.query.Email,query1.query.parent_email);
            }
            else{
                keys=Object.keys(reply);
                index1=keys.indexOf(query1.query.Email);
                if(index1!==-1){
                        res.write("ok");
                        res.end();
                } 
                else{
                for(i=0;i<keys.length;i++){
                    if(reply[keys[i]]==query1.query.parent_email){
                        count++;
                    }
                }
                if(count===0||count==1){
                    parents(query1.query.Email,query1.query.parent_email);
                }
                else{
                    res.write("notok");
                    res.end();
                }
                }
            }
        });
        }
        else{
            res.write("parent email id is assigned to another role");
            res.end();
        }
        });
    }
    else if (req.url == "/logint") {
        user_login('./thome.html');
    }
    else if (req.url == "/logins") {
        user_login('./shome.html');
    }
    else if (req.url == "/loginp") {
        user_login('./parent.html');
    } 
    else if(req.url=="/posts"){
        user_login('./connect.html');
    }
    else{
         cookie(); 
    }
function redis(returnVal) {
        var b, c;
        var query = qrString.parse(returnVal);
        client.hgetall("schools", function(err, reply) {
        if (req.url == "/signup") {
            if (reply === null || (reply[query.Email] === undefined)) {
            client.hmset("schools", query.Email, JSON.stringify(query), function(err, rep) {
                res.writeHead(200, {
                    "content-type": "text/html",
                    "set-cookie": "Email=" + query.Email
                });
                res.write('Signup successfully');
                res.end();
            });
            } 
            else {
                res.write("Email already exists");
                res.end();
            }
        } 
        else if (req.url == "/login") {
            if (reply !== null) {
                var a = reply[query.email];
                if (a === undefined) {
                    res.write("Invalid user");
                    res.end();
                } else {
                    a = JSON.parse(a);
                    if (a.Password == query.password) {
                        res.writeHead(200, {
                            "content-type": "text/html",
                            "set-cookie": "Email=" + query.email
                        });
                        res.write(JSON.stringify(a));
                        res.end();
                    } else {
                        res.write("invalid password");
                        res.end();
                    }
                }
            } else {
                res.write("No account is found");
                res.end();
            }
        } else if (req.url == "/extrad") {
            cookies = query.Email;
            details = JSON.parse(reply[cookies]);
            keys = Object.keys(query);
            for (i = 0; i < keys.length; i++) {
                details[keys[i]] = query[keys[i]];
            }
            details = JSON.stringify(details);
            client.hmset("schools", query.Email, details, function(err, rep) {
                res.write("ok");
                res.end();
            });
        } else if (req.url == "/timeta") {
            spliting = query.name.split(";");
            client.hmset("timetable", spliting[0], spliting[1]);
            res.write("ok");
            res.end();
        } else if (req.url == "/subjects") {
            spliting = query.name.split(";");
            client.hmset("Subjects", spliting[0], spliting[1]);
            res.write("ok");
            res.end();
        } else if (req.url == "/adteach") {
            plus = "", array1 = [];
            if (reply[query.Email] === undefined) {
                client.hget("class", query.email, function(err, reps) {
                    if (reps === null) {
                        reps = "";
                    }
                plus = reps;
                var checks = class2(plus, query.Class);
                if (checks == "true") {
                    client.hmset("class", query.email, plus + ";" + query.Class + "-" + query.Name);
                    client.hmset("schools", query.Email, JSON.stringify(query), function(err, rep) {
                        res.write('Signup successfully');
                        res.end();
                    });

                } else {
                    res.write("class teacher already exist");
                    res.end();
                }
                });
            } else {
                res.write("Email already exists");
                res.end();
            }
        } else if (req.url == "/sendemail") {
            request.post({
                url: 'https://mail.zoho.com/api/accounts/3610067000000008001/messages',
                headers: {'Authorization': 'Zoho-authtoken ad9bfd73c2155da67d1defb59d990b1c'},
                body: JSON.stringify(query),
                method: 'POST'
            }, function(error, response, body) {
                res.write("Email sent to you");
                res.end();
            });
        }
        else if(req.url=="/indiviparent"){
            client.hgetall(query.Email,function(data,status){
               console.log(status);
            });
            console.log(query.Email);
            client.hmset(query.Email,query.Days,query.Reason,function(err,replise){
               res.write("ok");
               res.end();
            });
        }
        else if(req.url=="/todayClass"){
            cookies=req.headers.cookie.split("=");
            var day=new Date().getDay(),keys1={},object={1:0,2:8,3:16,4:24,5:32,6:40};
            day=Number(day);
            if(day>0&&day<6){
                client.hgetall("Subjects",function(err,reply){
                keys=Object.keys(reply);
                for(i=0;i<keys.length;i++){
                   if(keys[i].indexOf(query.School)==-1){
                       keys.splice(i,1);
                   } 
                }
                for(i=0;i<keys.length;i++){
                  if(reply[keys[i]].indexOf(cookies[1])==-1){
                      keys.splice(i,1);
                  }    
                }
                client.hgetall("timetable",function(err,reply1){
                  for(i=0;i<keys.length;i++){
                      if(reply1[keys[i]]!==undefined){
                      timecut=reply1[keys[i]];
                      timecut=timecut.split("*");
                      keys1[keys[i]]=timecut.slice(object[day],object[day+1]);
                      }
                  } 
                  res.write(JSON.stringify(keys1));
                  res.end();
                });
            });
            }
            else{
                res.write('no class');
                res.end();
            }
        }
        else if (req.url == "/teachname") {
            client.hget("class", req.headers.cookie.split("=")[1], function(err, reply) {
                if (reply !== null) {
                    check = class2(reply, query.classs);
                    if (check == "true") {
                        res.write("Not assigned");
                        res.end();
                    } else {
                        res.write(check);
                        res.end();
                    }
                } else {
                    res.write("Not assigned");
                    res.end();
                }
            });}
        else if (req.url == "/getteach"||req.url=="/getstud") {
            bc = "";
            if (reply !== null) {
                keys = Object.keys(reply);
                for (i = 0; i < keys.length; i++) {
                  ab = JSON.parse(reply[keys[i]]);
                if (ab.email == query.email) {
                    if(req.url=="/getteach"&&ab.Role=="Teacher"){
                    if (ab.Class !== undefined) {
                            bc += ab.Name + "-" + ab.Subject + "-" + ab.Email + "-" + ab.Class + ";";
                    } else {
                        bc += ab.Name + "-" + ab.Subject + "-" + ab.Email + "- -;";
                    }
                }
                else if(req.url=="/getstud"&&ab.Role=="Student"){
                    if(query.Class==ab.Class){
                  bc += ab.Name + "-" + ab.Class + "- -" + ab.Parent_Name + ";";   
                }
                }
                }
            }
            res.write(bc);
            res.end();
        } 
        }
        else if(req.url=="/stuleave"){
            client.hget("leave",query.Email,function(err,reply6){
                    res.write(JSON.stringify(reply6));
                    res.end();
            });
        }
        else if (req.url == "/signups") {
            if (reply[query.Email] == undefined) {
                client.hmset("schools",query.Email,JSON.stringify(query),function(err,reps){
                       res.write("add successfully");
                       res.end();
                });
            } else {
                res.write("Email already exists");
                res.end();
            }
        }
        else if(req.url=="/leavereq"){
            keys1="";
               keys=Object.keys(reply);
               kkeys=[];
               for(i=0;i<keys.length;i++){
                   ab=JSON.parse(reply[keys[i]]);
                   if(ab.Role=="Teacher"){
                        kkeys.push(keys[i]);
                   }
               }
            for(i=0;i<kkeys.length;i++){
                ab=JSON.parse(reply[kkeys[i]]);
                if(ab.email==query.email&&(Number(ab.Class)==Number(query.Class))){
                    keys1=ab;
                }
            }
            if(keys1!==""){
                client.hget("leave",keys1.Email,function(err,reple){
            if(reple==null){
                objects={1:query};
                client.hmset("leave",keys1.Email,JSON.stringify(objects));
                res.write("request succesfully sent");
                res.end();
            }
            else{
                count=0;
                reple=JSON.parse(reple);
                keys=Object.keys(reple);
                for(i=0;i<keys.length;i++){
                    if(reple[keys[i]].Email==query.Email){
                        count++;
                    }
                }
            if(count==0){
                reple[keys.length+1]=query;
                client.hmset("leave",keys1.Email,JSON.stringify(reple));
                res.write("request succesfully sent");
                res.end();
                }
                else{
                    res.write('you already asked leave');
                    res.end();
                }
            }
            });
            }
            else{
                res.write("class teacher not assigned");
                res.end();
            }
        }
        else if(req.url=="/deletestud"){
            client.hdel("studpare",query.Email);
        }
        else if(req.url=="/leaacc"){
            array=[];
            array[0]=query.Date;
            object={};
            client.hget("leaved",query.Class,function(err,rep8){
                if(rep8!==null){
                 rep8=JSON.parse(rep8);
                 if(rep8[query.Student]==undefined){
                     rep8[query.Student]=array;
                 } 
                 else{
                     rep8[query.Student].push(query.Date);
                 }
                 client.hmset("leaved",query.Class,JSON.stringify(rep8));
                }  
                else{
                    object[query.Student]=array;
                    client.hmset("leaved",query.Class,JSON.stringify(object));
                }
            });
            accdny(query.Email,query.key);
            client.hmset("studyLeave",query.email,"accepted");
        }
        else if(req.url=="/cookiesget"){
            client.hget("studyLeave",query.Email,function(err,reps2){
               if(reps2!==null){
                   client.hdel("studyLeave",query.Email);
                   res.write(reps2);
                   res.end();
               } 
            });
        }
        else if(req.url=="/deny"){
            accdny(query.Email,query.key);
            client.hmset("studyLeave",query.email,"Rejected");
        }
        else if(req.url=="/editpro"){
            client.hget("schools",query.Email,function(err,data){
                data=JSON.parse(data);
                keys=Object.keys(query);
                for(i=0;i<keys.length;i++){
                    data[keys[i]]=query[keys[i]];
                }
            client.hmset("schools",query.Email,JSON.stringify(data));
            });
        }
        else if(req.url=="/changepass"){
                client.hget("schools",query.Email,function(err,data){
                data=JSON.parse(data);
                if(data.Password==query.CPassword){
                    data.Password=query.Password;
                    client.hmset("schools",query.Email,JSON.stringify(data));
                    res.write("password changes");
                    res.end();
                }
                else{
                    res.write('password not matched');
                    res.end();
                }
        });
        }
        else if(req.url=="/ptaccept"){
            keys = Object.keys(query);
            if(keys.length>2){
              client.hmset("ptafter",query.Email,JSON.stringify(query));
            }
            else{
                client.hmset("ptafter",query.Email,"Rejected");
            }
             client.hdel("ptmeets",query.Emails);
             res.write("ok");
             res.end();
        }
        else if(req.url=="/ptsmeet"){
            client.hget("ptafter",query.Email,function(err,reply){
               if(reply!==null){
                   client.del("ptafter",query.Email);
                   res.write(reply);
                   res.end();
               } 
               else{
                   client.del("ptafter",query.Email);
                   res.write("no");
                   res.end();
               }
            });
        }
        else if(req.url=="/parmeet"){
            count=0;
            client.hget("schools",query.SEmail,function(err,data1){
            data1=JSON.parse(data1);
            Class=data1.Class;
            query["Class"]=data1.Class;
            client.hget("schools",query.TEmail,function(err,data){
                if(data==null){
                    res.write("No teachers found");
                    res.end();
                }
                else{
                    data=JSON.parse(data);
                    if(data.email==query.SCName&&Class==data.Class&&data.Role=="Teacher"){
                        ptmeeting(query.TEmail+"."+query.Email,query);
                    }
                    else if(data.email==query.SCName&&data.Role=="Teacher"){
                       if(Class==1){
                           Class=Class+"st_class";
                       }
                       else if(Class==2){
                           Class=Class+"nd_class";
                       }
                       else if(Class==3){
                           Class=Class+"rd_class";
                       }
                       else if(Class>=4&&Class<=12){
                           Class=Class+"th_class";
                       }
                        client.hget("Subjects",query.SName+"."+Class,function(err,data2){
                           if(data2.indexOf(query.TEmail)!==-1){
                              ptmeeting(query.TEmail+"."+query.Email,query);
                           } 
                           else {
                               res.write("Teachers not assigned");
                               res.end();
                           }
                        });
                    }
                    else{
                       res.write("No teachers found");
                       res.end(); 
                    }
                }
                });
            });
            function ptmeeting(x,y){
               client.hget("ptmeets",x,function(err,data2){
                    if(data2===null){
                        client.hset("ptmeets",x,JSON.stringify(y));
                        res.write('request sent');
                        res.end();
                    }
                    else{
                        res.write("already request sent");
                        res.end();
                    }
                });
            }
        }
        else if(req.url=="/postget"){
           client.lpush(query.Class,query.Name,query.Details,function(err,reply){
               res.write("posted successfully");
               res.end();
           });
        }
        });
    }
    function loginCook() { 
        res.writeHead(200, {
            "content-type": "text/html",
            "set-cookie": "Email=" + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        });
        cookie();
    }
    function cookie(){
        res.write("<script>location.href='/'</script>");
        res.end();
    }
    function accdny(x,y){
        client.hget("leave",x,function(err,rep7){
           rep7=JSON.parse(rep7);
           delete rep7[y];
           client.hmset("leave",x,JSON.stringify(rep7));
           res.write("ok");
           res.end();
        });
    }
    function class2(m, n) {
        array1 = m.split(";");
        for (i = 1; i < array1.length; i++) {
            if (n.indexOf("-") == -1) {
                if (n == Number(array1[i][0])) {
                    return array1[i].substring(2, array1[i].length);
                }
            }
        }
        return "true";
    }
    function parents(x,y){
            client.hmset("studpare",x,y);
            res.write("ok");
            res.end();
    }
    function user_login(a){
        if(req.headers.cookie===undefined){
           cookie();
        }
        else{
        file = fs.readFileSync(a).toString();
        res.write(file);
        res.end();
        }
    }
}).listen(8080);