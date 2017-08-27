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
//Promise.promisifyAll(nano);
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
const bodyParser = require('body-parser');
app.use(bodyParser());
app.use(cors());






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
var arr=[];
for (var index = 0; index < 20; index++) {
    arr.push(index+1);
    
}
show(0);
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




// app.listen(88, function listening() {
//     console.log('Listening on ');
//   });