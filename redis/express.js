var express=require('express');
var app=express();

app.use("/project",express.static(__dirname+"/project"));
app.listen(8443);
