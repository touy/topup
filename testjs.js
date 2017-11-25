const async= require('async');
const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4');
const nano = require('nano')('http://admin:admin@localhost:5984');
const cors = require('cors');
var redis = require("redis");
var bluebird = require('bluebird');
r_client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var moment = require('moment-timezone');
//const Promise=require ('promise');
// var Promise = require('nano-promise');
const Q=require('q');
var Promise = require('bluebird');
const _current_picture_path = './_doc_item_/';
//Promise.promisifyAll(nano);
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
const bodyParser = require('body-parser');
app.use(bodyParser());
app.use(cors());
var multer  = require('multer');
var path = require('path');
var upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, _current_picture_path);
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname +'-'+ Date.now() + path.extname(file.originalname));
      }
    }),
    fileFilter: function(req, file, callback) {
      var ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(res.end('Only images are allowed'), null);
      }
      callback(null, true);
    }
  }).single('userFile');
  app.get('/',function(req,res){
    var html="<html><head></head><body>"
    html='<form id="uploadForm" enctype="multipart/form-data" method="post" action="/upload_img">'
    html+='<input type="file" name="userFile" />'
    html+='<input type="submit" value="Upload File" name="submit">'
    html+='</form>'
    html+='</body></html>'
    res.send(html);
  });
  // UPLOAD image file
  app.post('/upload_img',upload, function(req, res) {
    // client
    // <form id="uploadForm" enctype="multipart/form-data" method="post">
    // <input type="file" name="userFile" />   
    // </form>
    // return client 
    // client.data.file
    var js = {};
    js.client = req.body;
    js.resp = res;    	
    js.client.data={};
    js.client.data.message="OK file uploaded";
    js.client.data.file=_current_picture_path+req.file.filename;
    js.resp.send(js.client);
  });





var calculate = function(a) {
    var deferred = Q.defer();
    var test_data = "Hello World!"

    // SIMULATE SOME TIME TO PROCESS FUNCTION
    setTimeout(function () {
        // This line is what resolves the deferred object
        // and it triggers the .done to execute
        deferred.resolve(a);
    }, 2000);// AFTER 2 SECONDS IT WILL RETURN
    
    return deferred.promise;
}
//var arr=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
// var arr=[];
// for (var index = 0; index < 20; index++) {
//     arr.push(index+1);
    
// }
//show(0);
function show(i){
    var db=create_db("user");
    db.view("objectList","findByUserName",{key:"souk@TheFriendd",decending:true},function(err,res){
        if(i<20){
            console.log("i:"+(++i)+" user"+res.rows[0].value.username);
            show(i);
        }
    });

}
var __doc={
    username:"u1",
    createddate:new Date(),
    updateddate:new Date(),
    luser:"u2",
    ruser:"u3",
    //level:0,
    gui:uuidV4()
    };

// var value=0;
// for(i=0;l=arr.length,i<l;i++){
//     var db=create_db('user');

//     async.eachSeries([
//         calculate(arr[i]).done(function (result) {
//             //value+=i;
//             plusvalue(i);
//             console.log("value3 :"+value)
//         }),        
//         db.view("objectList","findByUserName",{key:"souk@TheFriendd",decending:true},function(err,res){
//             if(err) throw err;
//             else{
//                 if(res.rows.length){                    
//                     console.log("value: "+value);
//                 }
//                 else{
//                     //console.log("no user found");
//                 }
//             }
//         })
//       ],function (err){
//         setTimeout(function () {
//         console.log("value2: "+value);},5000);
//       });
    
//    // setTimeout(function () {
//         // This line is what resolves the deferred object
//         // and it triggers the .done to execute
//         console.log(value);
//     //}, 2000);
// }
// function plusvalue(v){
//     value+=v;
// }

function create_db(dbname){
    var db;
    nano.db.create(dbname, function(err,body) {
        // specify the database we are going to use    
        if (!err) {
            //console.log('database '+dbname+' created!');
        }
        else{

        }
            //console.log(dbname+" could not be created!");   
    });
    db = nano.use(dbname);
    return db;
};

function calculateRange(level){
    r=0;
    for (var index = 0; index < level; index++) {
        r+=Math.pow(2,index);// total range is 31 including master user
        //console.log(r +' index'+index);
    }
    return r;
}
// // var maxlevel = 5; // 4 levels
// // var range = calculateRange(maxlevel);

// // var level=1;
// // for (var index = 1; index < range; index++) {
// //     if (calculateRange(level) <= index) {
// //         level++;
// //     }
// //     console.log('level '+level+'index '+(index));
    
// // }

// // app.listen(88, function listening() {
// //     console.log('Listening on ');
// //   });
// var dbu=[];
// var client=[];
// client.data={};
// client.data.user={};
// client.data.userbinary={};

// function getBinaryDataByUser(lusername,rusername,level=0,i=0){
//     client.data.user.username=lusername;
//     //if(lusername)    
//     $.jpost("http://localhost:3000/get_default_binary_tree",client,function(res){
//         console.log("LEFT"+res+"\n");
//         client.data.user.username=rusername;    
//         if(res){              
//             arr[i++]=res.data.userbinary;        
//             arr[i--].index=i;                
//             //if(rusername)    
//             if(rusername)         
//             $.jpost("http://localhost:3000/get_default_binary_tree",client,function(res){                
//                 console.log("right"+res+"\n");
//                 if(res){                    
//                     arr[i]=res.data.userbinary;       
//                     arr[i].index=i;                                              
//                 }
//                 getBinaryDataByUser(arr[i-1].luser,arr[i-1].ruser,++level,((i-1)*2)+1);
//                 getBinaryDataByUser(arr[i].luser,arr[i].ruser,level,((i-1)*2)+2);
//             });
//             else{
//                 getBinaryDataByUser(arr[i-1].luser,arr[i-1].ruser,++level,((i-1)*2)+1);
//             }
//         }
//     });
// };

// getBinaryDataByUser("souk@TheFriendd",'',0,0);


app.listen(5000, "0.0.0.0", function () {
    console.log('Example app listening on port 5000!')
  });