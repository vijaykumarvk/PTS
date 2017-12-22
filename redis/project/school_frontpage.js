var slideIndex = 1;
$(document).ready(function(){
var cookies;
var Month=["January","February","March","April","May","June","July","August","September",'October',"November","December"];
$("#login").click(function(){
    if(document.cookie===""){
       $("#box").show();
    }
    else{
        cookies=document.cookie.split("=");
        $.get("/cookieGet",{
           "Email":cookies[1] 
        },function(data,status){
            data=JSON.parse(data);
            difflogin(data);
        });
     }
});
$("#sign").click(function(){
    $("#box2").show();
});
$(".empty1").click(function(){
    $("#box2").hide();
});
 $("#addteach").click(function(){
     class1();
    $(".temp1").show();
    $(".signup").show();
});
 $(".imgdiv").click(function(){
    $("#box").hide();
});
$("#next").click(function(){
    transfrom(".user",".key");
});
$("#lback").click(function(){
    transfrom(".key",".user");
});
$("#signup").click(function(){
    $("#box2").show();
});
$("#master").click(function(){
    $("#box1").show();
});
$("#box1").click(function(){
    $(".empty").hide();
});
$("#ssignup").click(function(){
    count2=0;
    $("#alert1,#alert2,#alert3,#alert4").css("color","white");
    d=$("#sinp4").val();
    c=$("#sinp3").val();
    b=$("#sinp2").val();
    a=$("#sinp1").val();
    if((/^([\s\.]?[a-zA-Z]+)+$/gi).test($("#sinp1").val())!==true){
        count2++;
        $("#alert1").text("use alphabets with spaces or dots").css("color","red");
    }
    if((/^[\d]{2,5}(-)?[\d]{1,8}$/gi).test($("#sinp2").val())!==true){
        count2++;
        $("#alert2").text("Enter a valid contact number").css("color","red");
    }
    if((/^[a-zA-Z0-9]{3,15}[\.]{0,1}[a-zA-Z0-9]{0,10}[@][a-zA-Z0-9]{4,8}(.com)$/gi).test(c)!==true){
         count2++;
         $("#alert3").text("Enter a valid email").css("color","red");
    }
     if(d.length>=8&&d.indexOf("<")==-1&&d.indexOf(">")==-1){
    }
    else{
        count2++;
        $("#alert4").text("use atleast 8 characters").css("color","red");
    }
    if(count2===0){
        $.post("/signup",{
            "Role":"admin","Name":a,"Phone":b,"Email":c,"Password":d
        },function(data,status){
            if(data=="Signup successfully"){
                $("#salert").text(data);
                $("#sinp1,#sinp2,#sinp3,#sinp4").val("");
                location.href="/login1";
            }
        });
    }
});
$("#login1").click(function(){
   $.post("/login",{
       "email":$("#lemail").val(),
       "password":$("#lpass").val()
   },function(data,status){
       if((data!=="No account is found")&&(data!=="invalid password")&&(data!=="Invalid user")){
           $("#lerror").text("signin successfully").show().fadeOut(3000);
           data=JSON.parse(data);
           difflogin(data);
       }
       else{
           $("#lerror").text(data).show().fadeOut(3000);
       }
   });
});
$("#circle4").click(function(){
   classTime();
   setTimeout(classic,1000);
   function classic(){
     $("#empty3").show();
   }
});
$(".words1").click(function(){
    b=$(this).text();
    b=b.substring(0,b.length-8);
    cookies=document.cookie.split("=");
    $.post("/getstud",{
        "email":cookies[1],
        "Class":b
    },function(data,status){
       if(data===""){
        $("#special1").html("<table><tr><th>Student Name</th><th>Class</th><th>Parent Name</th></tr><tr><td>-------</td><td>-------</td><td>----</td></tr></table>");
        $("#students,#student").show();
       }
       else{
           html3=fnreuse(data);
           html1="<table><tr><th>Student Name</th><th>Class</th><th>Parent Name</th></tr>";
           $("#special1").html(html1+html3+"</table>");
           $("#students,#student").show();
       }
        $("#empty3").hide();
    });
});
$("#empty3").click(function(){
   $(this).hide(); 
});
$("#homepost").click(function(){
   location.href="/posts"; 
});
//parent------------------------------------------
$("#but4").click(function(){
    location.href="/signout";
});
$("#meet,#kids").click(function(){
    id1=$(this).attr('id');
     $.get("/viewpar",{
       "Email":document.cookie.split("=")[1]
   },function(data,status){
       data=data.split(",");
       if(data.length==1&&data[0]!==""){
           $("#sendreq,#sendreq2").text(data[0]).show();
       }
       else if(data.length==2){
           $("#sendreq,#sendreq2").text(data[0]).show();
           $("#sendreq1,#sendreq3").text(data[1]).show();
       }
       else if(data.length==1&&data[0]===""){
           $("#ptmeet,#kidclass").html("No student found").css("text-align","center");
       }
   });
   $.post("/ptsmeet",{"Email":document.cookie.split("=")[1]},function(data,status){
       if(data=="no"){
           $("#ptmeet").html("");
       }
       else{
           data=JSON.parse(data);
           $("#a1").text(data.email);
           $("#b1").text(data.Date);
           $("#c1").text(data.Time);
       }
       $(".box3,.box4").hide();
       if(id1=="meet"){
           $(".box").show();
           $(".box2").hide();
       }
       else{
             $(".box2").show();
             $(".box").hide();
       }
   });
});
$("#sendreq2,#sendreq3").click(function(){
    b2=$(this).text();
    $.get("/cookieGet",{"Email":b2},function(data1,status){
        data1=JSON.parse(data1);
        class1=data1.Class;
        i1="";
        $.get("/leavestudent",{"Class":class1},function(data2,status){
            if(data2!==null){
                a="<table class='table1 table2'><tr><th>Days</th><th>Count</th></tr>";
                 alert(data2);
                 alert(b2);
                data2=JSON.parse(data2);
                if(data2[b2]==undefined){
                    alert("david");
                    $(".table2").html(a+"</table>");
                }
                else{
                   for(i=0;i<data2[b2].length;i++){
                       if(i==0){
                           a+="<tr><td>"+data2[b2][i]+"</td><td>"+data2[b2].length+"</td><tr>";
                       }
                       else{
                           a+="<tr><td>"+data2[b2][i]+"</td><tr>";
                       }
                   }
                   $(".table2").html(a+"</table>");
                }
            }
            else{
                 $(".table2").html(a+"</table>");
            }
            $(".box4").show();
            $(".box2").hide();
        });
    });
});
$(".font").click(function(){
    $(".profile").show();
    event.stopPropagation();
});
$("body").click(function(){
   $(".profile").hide(); 
    $(".userdiv").hide();
   if(document.cookie==""&&location.href!="http://vijaykumar-7336.zcodeusers.com/"){
       location.href="/";
   }
});
$("#sendreq,#sendreq1").click(function(){
    b1=$(this).text();
    $.get("/cookieGet",{"Email":$(this).text()},function(data,status){
        data=JSON.parse(data);
        $("#req6").val(data.Name);
        $("#req5").val(b1);
        $(".box,.box2").hide();
        $(".box3").show();
    });
});
$("#req3").click(function(){
   $("#req4").text("");
   if($("#req1").val()!==""&&$("#req2").val()!==""){
       $.post("/parmeet",{
          "Email":document.cookie.split("=")[1],
          "TEmail":$("#req1").val(),
          "Description":$("#req2").val(),"SEmail":$("#req5").val(),
          "SName":$("#1h2").text(),"SCName":$("#2h2").text(),
          "PName":$("#p3").text(),"STName":$("#req6").val()
       },function(data,status){
           if(data=="request sent"){
               $("#req1,#req2").val("");
           }
           $("#req4").text(data).show().fadeOut(3000);
       });
   }
   else{
       $("#req4").text('Enter all the fields').show().fadeOut(3000);
   }
});
//-----------------------------------------
$(".user").click(function(){
    $(".userdiv").show();
    event.stopPropagation();
});    
$(".empty").click(function(){
    $(".userdiv,.empty,#box2,.profile").hide();
});
$("#circle1").click(function(){
    classTime();
    $("#empty1").show();
});
$("#empty1").click(function(){
    $("#empty1").hide();
});
$(".cross").click(function(){
    $(".tablediv").hide();
});
$("#todayt").click(function(){
    variable=[],variable1="";
    $.post("/todayClass",{"School":$("#scname").text(),"Subject":$("#subjectName").text()},
        function(data,status){
        if(data=="no class"){
         $("#toclass").html("<b>no class").css("text-align","center");
        }
        else{
        a1=$("#subjectName").text().substring(10,13);
        data=JSON.parse(data);
        keys=Object.keys(data);
        for(i=0;i<keys.length;i++){
          a2=keys[i].lastIndexOf(".");
          array=data[keys[i]];
          for(j=0;j<array.length;j++){
                if(array[j].substring(0,3)==a1){
                    variable1+=j+1+" ";
                }
          }
         if(variable1!==""){
             variable.push(keys[i].substring(a2+1,keys[i].length));
             variable.push(variable1);
         }
         variable1="";
        }
        if(variable.length>1){
            html1="";
            html1="<table><tr><th>Class Name</th><th>Hours</th>";
         for(i=0;i<variable.length;i=i+2){
             html1+="<tr><td>"+variable[i]+"</td><td>"+variable[i+1]+"</td></tr>"
         } 
         $("#toclass").html(html1+"</table>");
        }
        }
        $("#myCLass,.box3,.bo,#times").hide();
        $(".box4").show();
    });
});
$("#circle2").click(function(){
    cookies=document.cookie.split("=");
    $.post("/getteach",{
        "email":cookies[1]
    },function(data,status){
       if(data===""){
        $("#special").html("<table><tr><th>Teacher Name</th><th>Subject</th><th>Class</th></tr><tr><td>-------</td><td>-------</td><td>----</td></tr></table>");
       }
       else{
        html3=fnreuse(data);
        html1="<table><tr><th>Teacher Name</th><th>Subject</th><th>Class</th></tr>";
        $("#special").html(html1+html3+"</table>");
       }
       $("#teachers").show();
    });
});
$("#closepro").click(function(){
   $("#profile").hide();
});
$("#close").click(function(){
   $("#studdiv").hide(); 
});
$("#addstudent").click(function(){
   class1();
   $("#studdiv").show(); 
});
$(".close").click(function(){
    $(this).parent().hide();
});
$("#tables").click(function(){
  class2=Number($("#classlett").text().substring(7,$("#classlett").text().length));
  word2=$("#SName").text();
  a1=["W","U","X","Y","Z"];
  $.get("/timeTable",function(data,status){
  class1=classfunc(class2);
    if(data!==null){
      data=JSON.parse(data);
      data1=data[word2+"."+class1];
      if(data1!==undefined){
          i1=0;
          var array=data1.split("*");
          for(j=0;j<a1.length;j++){
                for(i=1;i<9;i++){
                    $("#"+a1[j]+i).text(array[i1]);
                     i1++;
                }
           }
      }
      else{
          $(".timetable").html("<b>Your class time table is not assigned");
      }
    }
      else{
           $(".timetable").html("<b>Your class time table is not assigned");
      }
    $("#box3").show();
    $("#box1,#box5").hide();
    });
});
$("#leaves").click(function(){
    $.post("/cookiesget",{
      "Email":document.cookie.split("=")[1]  
    },function(data,status){
        if(data!==""){
            $("#acceptleave").text("Leave request sent by you is  "+data).show();
        }
    });
    $("#box5").show();
    $("#box1,#box3").hide();
});
$("#btn2").click(function(){
    array1=[];//https://repl.it/repls/QualifiedHeartyGadwall
    array1.push(new Date().getDate(),new Date().getMonth(), new Date().getFullYear());
    $("#leavealert").text("");
    if($("#Dayes").val()!==""&&$("#reason").val()!==""){
     /* $.post("/leavereq",{
          "Name":$("#stuname").text(),
          "Email": document.cookie.split("=")[1],
          "email":$("#hidden").text(),
          "Class":$("#classlett").text().substring(7,$("#classlett").text().length),
          "Days":$("#dayes").val(),
          "Reason":$("#reason").val()
      },function(data,status){
            $("#leavealert").text(data);
      });*/
      $.get("/viewstu",{
          "Email":document.cookie.split("=")[1]
      },function(data,status){
          alert(data);
          if(data!=="null"){
              $.post("/indiviparent",{
                  "Email":data,
                  "Days":$("#dayes").val(),
                  "Reason":$("#reason").val()
              },function(data1,status){
                $("#Dayes,#Dayes1,#reason").val("");
              });
          }
          else{
            $("#Dayes,#Dayes1,#reason").val("");
          }
      });
    }
    else{
       $("#leavealert").text("Enter how many days & reason");
    }
   });
$("#exam").click(function(){
    $(".box2").show();
    $(".box,.box3,.box4,.box5").hide();
});
$("#attaend").click(function(){
    $(".box3,.box2,.box,.box5").hide();
    $(".box4").show();
});
$("#myclasss").click(function(){
    class1=Number($("#classlett").text().substring(7,$("#classlett").text().length));
    $.post("/teachname",{"classs":class1},function(data,status){
            $("#classteacher").text("Teacher name="+data);
    });
    html2="<table ><tr><th>Subject Name</th><th>Teacher Name</th></tr>";
    class2=$("#classlett").text().substring(7,$("#classlett").text().length);
    html1="";
    word1=classfunc(class2);
    word2=$("#SName").text();
    $.get("/subjects1",function(data,status){
        if(data!==null){
          data=JSON.parse(data);
          data1=data[word2+"."+word1];
          if(data1!==undefined){
            i1=0;
            var array=data1.split("*");
            for(i=0;i<6;i++){
                if(array[i].indexOf("---")==-1){
                    html1+="<tr><th>"+array[i+6]+"</th><th>"+array[i]+"</th></tr>";
                }
            }
              $(".table3").html(html2+html1+"</table>");
          }
          else{
               $(".table3").html(html2+"</table>");
          }
        }else{
             $(".table3").html(html2+"</table>");
        }
    $("#box5,#box3").hide();
    $("#box1").show();
});
});
$(".but4").click(function(){
    location.href="/signout";
})
$(".font").click(function(){
    $(".empty").show();
    $(".profile").show();
});
$("#addstud").click(function(){
    if($("#stinp1").val()!==""&&$("#stinp2").val()!==""&&$("#stinp3").val()!==""&&$("#stinp4").val()!==""&&$("#stinp4").val()!==""){
    $.get("/stupar",{"Email":$("#stinp2").val(),"parent_email":$("#stinp6").val()},function(data,status){
        if(data=="ok"){
            $.post("/signups",{
                "Role":"Student",
                "Name":$("#stinp1").val(),
                "Class":$("#stinp4").val(),
                "Email":$("#stinp2").val(),
                "Password":$("#stinp3").val(),
                "email":document.cookie.split("=")[1],
                "Parent_Name":$("#stinp5").val(),
                "Parent_Email":$("#stinp6").val()
            },function(data2,status){
                if(data2=="add successfully"){
                     x=$("#stinp2").val();
                     y=$("#stinp3").val();
                     sending_email(x,y);
                     $("#stinp1,#stinp2,#stinp3,#stinp4,#stinp5,#stinp6").val("");
                }
                else{
                    $("#demoal").text(data2); 
                    $("#palert").text("");
                    $.post("deletestud",{"Email":$("#stinp2").val()},function(data1,status){
                    });
                }
            });
        }
        else if(data=="notok"){
            $("#demoal").text("parent email already exist for two student email");
        }
        else{
             $("#demoal").text(data);
        }
    });
    }
    else{
        $("#demoal").text("fill all the fields");
    }
});
 $("#circle3").click(function(){
    cookies=document.cookie.split("=");
    $.get("/cookieGet",{
        Email:cookies[1]
    },function(data,status){
        if(data.indexOf("{")!==-1&&data.indexOf("}")!==-1){
          data=JSON.parse(data);
        }
         $("#empty2").show();
        class_hide(data);
    });
});
$("#empty2").click(function(){
    $("#empty2").hide();
});
$("#view").click(function(){
   location.href="/signout";
});
$("#viewEdit").click(function(){
   $.get("/cookieGet",{Email:document.cookie.split("=")[1]},function(data,status){
       data=JSON.parse(data);
       $("#proinp1").val(data.Name);
       $("#proinp2").val(data.HM);
       $("#proinp3").html("<option>"+data.Type+"</option> <option>Primary school</option><option>Middle school</option><option>High school</option><option>Higher secondary school</option>");
       $("#proinp4").val(data.Add);
       $("#proinp5").val(data.Estab);
       $("#proinp6").val(data.Phone);
       $("#profile").show(); 
   });
});
$("#backimg").click(function(){
   $("#form").hide(); 
});
$("#prosignup").click(function(){
   if(($("#proinp1").val()!=="")&&($("#proinp2").val()!=="")&&($("#proinp3").val()!=="")&&($("#proinp4").val()!=="")&&($("#proinp5").val()!=="")&&($("#proinp6").val()!=="")){
       $.post("/editpro",{
          "Name":$("#proinp1").val(),
          "Email": document.cookie.split("=")[1],
          "HM":$("#proinp2").val(),"Type":$("#proinp3").val(),
          "Add":$("#proinp4").val(),"Estab":$("#proinp5").val(),
          "Phone":$("#proinp6").val()
       },function(data,status){
            alert("edited successfully");
            $("#profile").hide(); 
       });
   } 
   else{
       alert("Please fill all the fields");
   }
});
$("#viewPass").click(function(){
   $("#passwrd").show(); 
});
$("#changed").click(function(){
    if($("#newpass").val()!==""&&$("#currpass").val()!==""){
           $.post("/changepass",{
              "Email": document.cookie.split("=")[1],
              "Password":$("#newpass").val(),
              "CPassword":$("#curpass").val()
           },function(data,status){
              $("#passwrd").hide();
           }); 
    }
    else{
        alert('enter both the fields');
    }
});
$("#esignup").click(function(){
    cookies=document.cookie.split("=");
    count3=0;
    $("#alertd2,#alertd3,#alertd4,#alertd5").css("color","white");
    b1=$("#dinp2").val(),c1=$("#dinp3").val();
    d1=$("#dinp4").val(),e1=$("#dinp5").val();
    if(b1.indexOf("-")!==-1){
        count3++;
         $("#alertd2").text("select one option").css("color","red");
    }
    if((/^([ ]?[\s\.\-,]?[ ]?[a-zA-Z0-9]+)+$/gi).test(c1)!==true){
        count3++;
         $("#alertd3").text("enter address in correct format").css("color","red");
    }
    if((/^[\d]{4}$/gi).test(d1)===true){
        if(d1>2017){
            count3++;
            $("#alertd4").text("enter numbers only").css("color","red");
        }
    }
    else{
        count3++;
         $("#alertd4").text("enter numbers only").css("color","red");
    }
    if((/^([\s\.]?[a-zA-Z]+)+$/gi).test(e1)!==true){
        count3++;
        $("#alertd5").text("enter a name in correct format").css("color","red");
    }
    if(count3==0){
        $.post("/extrad",{"Email":cookies[1],"Type":b1,"Add":c1,"Estab":d1,"HM":e1
        },function(data,status){ 
             $(".form").hide();
          });
    }
});
var count=0;
$(".tds").click(function(){
  if($(this).html().substring(0,6)=='<input'){
      if(count==1){
      if($("#temp").val()!==""){
          id1=$(this).attr("id");
          if(id1[0]!=="C"){
            $(this).text($("#temp").val().charAt(0).toUpperCase()+$("#temp").val().substring(1,$("#temp").val().length));
          }
          else{
             $(this).text($("#temp").val()); 
          }
        id1=$(this).attr("id");
        if(id1[0]=="C"){
            $.post("/getteach",{
              "email":document.cookie.split("=")[1]  
            },function(data,status){
               data=data.split(";");
               if(data.length==1){
                   data.length=2;
               }
               for(i=0;i<data.length-1;i++){
                array3=data[i].split("-");
                if($("#"+id1).text()==array3[2]){
                    $("#A"+id1[1]).text(array3[0]);
                    $("#B"+id1[1]).text(array3[1]);
                }           
               }
            });
        }
      }
      else{
          $(this).text("----------");
      }
      count=0;
      }
    }else{
        if(count==0){
            count=1;
            var inptext=$(this).text();
            $(this).empty();
            $(this).append('<input value="'+inptext+'" id="temp">');
            inptext="";
        }
    }
   $("#temp").click(function(event){
        event.stopPropagation();
    });
});
$("#save").click(function(){
    a=$("#sname").text();
    b=$("#htime").text();
    c=a+"."+b;
    var b1="";
    var a1=["M","T","W","TH","F"];
    for(j=0;j<a1.length;j++){
    for(i=1;i<9;i++){
        b1+=$("#"+a1[j]+i).text()+"*";
    }
    }
    $.post("/timeta",{
      "name":c+";"+b1
    },function(data,status){
        $("#timeshow").show().text("saved successfully").fadeOut(3000);
    });
});
$("#profile").click(function(){
    $(this).hide();
    event.stopPropagation();
})
$("#save1").click(function(){
    a=$("#sname").text();
    b=$("#cname").text();
    c=a+"."+b;
    b1="";
    array=[],coun=0;
    a1="ABC";
    for(i=1;i<6;i++){
        if($("#C"+i).text().indexOf("-")==-1){
        if(array.indexOf($("#C"+i).text())==-1){
            array.push($("#C"+i).text());
        }
        else{
            coun++;
        }
        }
    }
    if(coun==0){
    for(j=0;j<a1.length;j++){
            for(i=1;i<=6;i++){
                b1+=$("#"+a1[j]+i).text()+"*";
            }
            }
            $.post("/subjects",{
              "name":c+";"+b1
            },function(data,status){
              $("#sample").show().text("saved successfully").fadeOut(3000);
            });
}
else{
    $("#sample").text("Teacher name repeated");
}
});
 $(".signup,select").click(function(){
       event.stoppropagation();
});
$(".word").click(function(){
    var word1=$(this).text();
    word2=$("#sname").text();
    word1=word1.replace (/ /g, "_");
    $("#htime").text(word1);
     a1=["M","T","W","TH","F"];
    $.get("/timeTable",function(data,status){
    if(data!=="null"){
      data=JSON.parse(data);
      data1=data[word2+"."+word1];
      if(data1!==undefined){
          i1=0;
      var array=data1.split("*");
      for(j=0;j<a1.length;j++){
            for(i=1;i<9;i++){
                $("#"+a1[j]+i).text(array[i1]);
                 i1++;
            }
            }
             $("#timetable").show();
      }
      else{
           checksa();
      }
    }else{
        checksa();
    }
    function checksa(){
            for(j=0;j<a1.length;j++){
            for(i=1;i<9;i++){
                $("#"+a1[j]+i).text('subject');
            }
            }
            $("#timetable").show();
    }
    });
    });
$(".words").click(function(){
    $("#sample").text("");
    $("#cname").text($(this).text());
    $.post("/teachname",{"classs":$("#cname").text()[0]},function(data,status){
        $("#Tname").text("Teacher name="+data);
    });
    var word1=$(this).text();
    word2=$("#sname").text();
    word1=word1.replace (/ /g, "_");
    $("#cname").text(word1);
    a1="ABC";
    $.get("/subjects1",function(data,status){
    if(data!=="null"){
      data=JSON.parse(data);
      data1=data[word2+"."+word1];
      if(data1!==undefined){
          i1=0;
      var array=data1.split("*");
      for(j=0;j<a1.length;j++){
            for(i=1;i<7;i++){
                $("#"+a1[j]+i).text(array[i1]);
                 i1++;
            }
            }
              $("#class").show();
      }
      else{
           checksb();
      }
    }else{
        checksb();
}
function checksb(){
    for(j=0;j<a1.length;j++){
    for(i=1;i<7;i++){
        $("#"+a1[j]+i).text('---------');
    }
    }
     $("#class").show();
}
});
});
$("#circle5").click(function(){
    $("#adpar").show();
});
 $(".temp1").click(function(){
     $(".signup,.temp1").hide();
 });
$("#addpar").click(function(){
       if($("#pinp2").val()!==""&&$("#pinp3").val()!==""&&$("#pinp4").val()!==""){
        $.post("/signups",{
            "Role":"Parent","Name":$("#pinp2").val(),
            "Email":$("#pinp3").val(),"Password":$("#pinp4").val(),
            "email":document.cookie.split("=")[1]
        },function(data,status){
            if(data=="add successfully"){
                 x=$("#pinp3").val();
                 y=$("#pinp4").val();
                 sending_email(x,y);
                 $("#pinp2,#pinp3,#pinp4").val("");
            }
        });
}
else{
    $("#palert").text("fill all the fields");
}
});
 $("#tsignup").click(function(){
    a=$("#tinp5").val();
    if($("#tinp1").val()!==""&&$("#tinp2").val()!==""&&$("#tinp3").val()!==""&&$("#tinp4").val()!==""&&$("#tinp6").val()!==""){
       if(a.indexOf("-")!==-1){
           a="";
       }
        $.post("/adteach",{
           "Role":"Teacher","Name": $("#tinp1").val(),
           "Email":$("#tinp2").val(),
           "Password":$("#tinp3").val(),"Class":a,
           "email":document.cookie.split("=")[1],
           "Qualif":$("#tinp6").val(),
           "Subject":$("#tinp4").val().charAt(0).toUpperCase()+$("#tinp4").val().substring(1,$("#tinp4").val().length)
        },function(data,status){
            $("#demo").text(data);
            x=$("#tinp2").val();
            y=$("#tinp3").val();
            if(data==="Signup successfully"){
                sending_email(x,y);
                $("#tinp1,#tinp2,#tinp3,#tinp4,#tinp6").val("");
                $("#demo").text("");
            }
        });
    }
    else{
        alert("Enter all the fields");
    }
});
$("#tinp5").change(function(){
   if($("#tinp5").val()>10){
       $("#tinp7").show();
       $("#tinp4").hide();
   } 
   else{
       $("#tinp7").hide();
       $("#tinp4").show();
   }
});
$(".postfeed").click(function(){
    /*$.get("/posts",{"Email":"sdfsdfddf"}function(){
    });*/
});
});
function sending_email(email,password){
    var objects={"fromAddress": "vijay.kumar@zohouniv.com",
                 "toAddress":email,
                 "subject": "This is your password",
                 "content":"please use this password in the pts app  <h1 style='color:blue;'>"+password+"<h1>"};
    $.post("/sendemail",objects,function(data3,status){
        $("#palert").text(data3);
        $("#demoal").text(data3);
    });
}
function classTime(){
    cookies=document.cookie.split("=");
    $.get("/cookieGet",{
        Email:cookies[1]
    },function(data,status){
        data=JSON.parse(data);
        class_hide(data);
    });
}
function class1(){
    cookies=document.cookie.split("=");
    $.get("/cookieGet",{
        Email:cookies[1]
    },function(data,status){
       data = JSON.parse(data);
      if(data.Type=="Primary school"){
          four(5);
      }                                                                                  
       else if(data.Type=="Middle school"){
          four(8);
      }                             
      else if(data.Type=="High school"){
          four(10);                                                            
      }
      else if(data.Type=="Higher secondary school"){
          four(12);
      }
    });
}
function four(n){
     add='<select><option>-----------</option>';
     add1="",add2="";
     for(i=1;i<=n;i++){
         add1+='<option>'+i+"</option>"
     }
     $("#stinp4").html(add+add1+"</select>");
     $("#tinp5").html(add+add1+"</select>");
}
function fnreuse(data){
   array=data.split(";");
   var html2="";
   for(i=0;i<array.length-1;i++){
       array1=array[i].split("-");
       if(array1[0]===""){
           array1[0]="-------";
       }
       if(array1[1]===""){
           array1[1]="-------";
       }
       if(array1[3]===""){
           array1[3]="-------";
       }
    html2+="<tr><td>"+array1[0]+"</td><td>"+array1[1]+"</td><td>"+array1[3]+"</td></tr>";
   }
return html2;
}
function classfunc(class1){
    if(class1>=1&&class1<=12){
      if(class1==1){
         class1=class1+"st_class";
      }
      else if(class1==2){
          class1=class1+"nd_class";
      }
      else if(class1==3){
          class1=class1+"rd_class";
      }
      else{
          class1=class1+"th_class";
      }
      return class1;
   }
}
function difflogin(data){
    if(data.Role=="admin"){
       location.href="/login1";
    }
    else if(data.Role=="Teacher"){
        location.href="/logint";
    }
    else if(data.Role=="Student"){
        location.href="/logins";
    }
    else if(data.Role=="Parent"){
        location.href="/loginp";
    }
}
function class_hide(data){
    if(data.Type=="Primary school"){
        $(".eleven,.ten,#eight,#seven,#six").hide();
        $(".eleven,.ten,#eighth,#seventh,#sixth").hide();
        $(".eleven,.ten,#eig,#sev,#six").hide();
    }
    else if(data.Type=="Middle school"){
        $(".eleven,.ten").hide();
    }
    else if(data.Type=="High school"){
       $(".eleven").hide();
    }
}
function transfrom(a,b){
    $(a).css({'transform':'rotateX(90deg)'});
    setTimeout(function(){
    $(b).css({'transform':'rotateX(0deg)'});},400);
}