const async= require('async');
const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4');
//const nano = require('nano')('http://admin:admin@localhost:5984');
const nano = require('nano')('http://localhost:5984');
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

//moment.tz.setDefault("Asia/Vientiane");


 console.log(new Date());
 console.log(convertTZ(new Date()));
 console.log(new Date(convertTZ(new Date())));

//console.log(moment.tz.guess());

const requestIp = require('request-ip');

var __client_ip="";
app.use(requestIp.mw());
var __master_user={};
var __cur_client={};

function convertTZ(fromTZ){
  return moment.tz(fromTZ,"Asia/Vientiane").format();
}
// Add headers
var __master_user={
  "_id": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "gui":"d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "username": "souk@TheFriendd",
  "password": "123456",
  "ID": "",
  "fullname": "",
  "birthdate": "",
  "gender": "",
  "address": "",
  "bankaccount": "",
  "bank": "",
  "usercode": "TheFriendd",
  "createddate": "2017-08-19T12:16:12.563Z",
  "gui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "email": "souk@TheFriendd.com",
  "phone1": "02059918889",
  "phone2": "",
  "photo": "",
  "memberlevel": 0,
  "ispaired": false,
  "parentgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "isleft": null,
  "aboveparents": "",
  "leftside": "",
  "rightside": "",
  "packagevalue": 0,
  "packagename": "",
  "packagegui": "",
  "balancevalue": 0,
  "Lcoupling": 0,
  "Rcoupling": 0,
  "couplingbalance": 0,
  "couplingtotalmoney": 0,
  "introductorgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "introductorcode": "souk@TheFriendd",
  "isfreeuser": false,
  "registeredby": "master",
  "maxproduct": 100000,
  "maxpaid": -1
}
// __master_user.parentname=__master_user.username;

// create_db('user').insert(__master_user,__master_user.gui,function(err,res){
//   if(err)
//     console.log("create master failed");
//   else
//     console.log("create master completedly");
// });


app.get('/', function (req, res) {

  res.send("hello");
});
// CHANGE PASSWORD
app.get('/change_password', function (req, res) {

    res.send("hello");
    var js={};
    js.client=req.body;
    js.resp=res;
    js.client.data.user.phone1=js.client.secret;
    //js.client.oldpassword1==js.client.oldpassword2;
    //js.client.data.user.password=js.client.oldpassword1;
    change_password(js);
 });


app.get('/initclient',function(req,res){
  client_ip = req.clientIp;
  res.send(get_init_client(client_ip));
});

app.post('/get_balance', function (req, res) {
  var client=req.body;
  var user=client;
  var page =client.page;
  var maxpage=client.page;

  get_balance(user,page,maxpage,resp);
});
app.post('/get_count_balance',function(req,res){
  var user=req.body;
  get_count_balance(user,res)
});
app.post('/register', function (req, res) {
 register(req.body,res);
});

app.post('/login', function (req, res) {
  console.log("LOGIN ");
  login(req.body,res);
});
app.post('/logout',function (req,res){
  logout(req.body,res);
});

app.post('/heartbeat', function (req, res) {
 heartbeat(req.body,res);
});


app.post('/get_userdata', function (req, res) {
  var client=req.body;
  var user=client;
 showUserInfo(user,res);
});

app.post('/get_package', function (req, res) {
  var js={};
  js.resp=res;
  get_package(js);
});

app.post('/get_package_details', function (req, res) {
  var js={};
  js.user=req.body;
  js.resp=res;
  get_package_details(js);

});

app.post('/get_payment_list',function (req,res){
  var js={};
  js.user=req.body;
  js.res=res;
  get_payment_list(js,page,maxpage);
});

app.post('/get_user_binary',function (req,res){
  var js={};
  js.user=req.body;
  js.resp=res
  get_user_binary(js);
});


app.post('/show_user_binary_tree',function (req,res){
  var user=req.body;
  client=user;
  showBinaryTree(user,client,res);
});

app.post('/get_coupling_score',function (req,res){
  var js={};
  js.user=req.body;
  js.resp=res;
  var page=js.page;
  var maxpage=js.maxpage;
  get_coupling_score(js,page,maxpage);
});
app.post('get_topup_balance',function(req,res){
  var user=req.body;
  var client=user;
  client.resp;
  showTopupBalance(user,client);
});
app.post('get_main_balance',function(req,res){
  var user=req.body;
  var client=user;
  client.resp;
  showMainBalance(user,client);
});

app.post('check_main_balance',function(req,res){
  var user=req.body;
  var client=user;
  client.resp;
  var package=client.package;
  checkMainBalance(user,package,client);
});

app.post('get_bonus_balance',function(req,res){
  var user=req.body;
  var client=user;
  client.resp;
  showBonusBalance(user,client);
});
app.post('get_bonus_topup_balance',function(req,res){
  var user=req.body;
  var client=user;
  client.resp;
  showBonusTopupBalance(user,client);
});
app.post('upgrade',function(req,res){
  var user=req.body;
  var client=user;
  client.resp;
  upgradePackage(user,package,resp);
});


function create_db(dbname){
    var db;
    nano.db.create(dbname, function(err,body) {
        // specify the database we are going to use    
        if (!err) {
            console.log('database '+dbname+' created!');
        }
        else
            console.log(dbname+" could not be created!");   
    });
    db = nano.use(dbname);
    return db;
};

//****************************************BALANCE */
var __balance_doc={
      username:"",
      usergui:"",
      gui:uuidV4(),
      balance:0,
      updated:convertTZ(new Date()),
      diffbalance:0
    };

__design_view="objectList";
var __desing_system={
  "_id": "_design/objectList",
  "views": {
    "getCouchDBTime": {
      "map": "function (doc) {\n  emit(null,new Date());\n}"
    }
  }, 
  "language": "javascript"
}; 
var __design_balance={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username)\n    emit(doc.username,null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username)\n emit(doc.username,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    },
    "findBalanceByDateAndUser": {
      "map": "function (doc) {\n   var d = new Date(doc.updated);\n                if (d != null) {\n                    var key = [d.getFullYear(),\n                               d.getMonth(),\n                               d.getDate(),\n                               doc.username];\n                        emit(key, doc);\n                }\n}"
    }
  },
  "language": "javascript"
};
var __design_user={
  "_id": "_design/objectList",
  "views": {
    "containText": {
      "map": "function(doc) {\r\n  var txt = doc.username;\r\n  var words = txt.replace(/[!.,;]+/g,\"\").toLowerCase().split(\" \");\r\n    for(var word in words) {\r\n        emit(words[word],doc);\r\n    }\r\n}"
    },
    "findByEmail": {
      "map": "function(doc) {\r\n    if(doc.email) {\r\n        emit(doc.email,doc);\r\n    }\r\n}"
    },
    "findByPhone": {
      "map": "function(doc) {\r\n    if(doc.phone1) {\r\n        emit(doc.phone1,doc);\r\n    }\r\n}"
    },
    "findByParent": {
      "map": "function(doc) {\r\n    if(doc.parent) {\r\n        emit(doc.parent,doc);\r\n    }\r\n}"
    },
    "findTopUser": {
      "map": "function(doc) {\r\n    if(doc.memberlevel==0&&doc.parentgui==doc.gui) {\r\n        emit(doc);\r\n    }\r\n}"
    },
    "authentication": {
      "map": "function(doc) {\r\n    if(doc.username&&doc.password) {\r\n        emit([doc.username,doc.password],doc);\r\n    }\r\n}"
    },
    "findByUserAndPhone": {
      "map": "function(doc) {\r\n    if(doc.username&&doc.phone1) {\r\n        emit([doc.username,doc.phone1],doc);\r\n    }\r\n}"
    },
    "findByUserName": {
      "map": "function(doc) {\r\n    if(doc.username) {\r\n        emit(doc.username,doc);\r\n    }\r\n}"
    },
    "findByUserGui": {
      "map": "function(doc) {\r\n    if(doc.gui) {\r\n        emit(doc.gui,doc);\r\n    }\r\n}"
    },
    "findExist": {
      "map": "function (doc) {\n if(doc.username) \n emit(doc.username, doc);\n}"
    },
    "getCouchDBTime": {
      "map": "function (doc) {\n  emit(null, new Date());\n}"
    },
    "findByIntroductorcode": {
      "map": "function (doc) {\n if(doc.introductorcode) {\r\n emit([doc.introductorcode],doc); \r\n } \r\n }"
    },
    "findAll": {
      "map": "function (doc) {\r\n  emit(null,doc);\n}"
    },
    "findQualifiedParents": {
      "map": "function(doc) {\r\n  // permutation func by Jonas Raoni Soares Silva\r\n  var permute = function( v, m ){\r\n    for( var j, l = v.length, i = ( 1 << l ) - 1, r = new Array( i ); i; )\r\n      for( r[--i] = [], j = l; j; i + 1 & 1 << --j && ( r[i].push( m ? j : v[j] ) ) );\r\n    return r;\r\n  };\r\n  var txt = doc.username;\r\n  txt.replace(/[!.,;]+/g, \"\");\r\n  var raw_words = txt.split(\" \");\r\n  var words = {};\r\n  for (var i in raw_words) {\r\n    var word = raw_words[i];\r\n    if (word == \"\") continue;\r\n    if (!words[word]) { words[word] = 1; }\r\n    else { words[word]++; }\r\n  }\r\n  var word_set = [];\r\n  for (var word in words) {\r\n    word_set.push(word);\r\n  }\r\n  var permutations = permute(word_set,0);\r\n  for (var i in permutations) {\r\n    if(doc.couplingbalance>0)\r\n    emit(permutations[i],doc);\r\n  }\r\n}"
    },
    "searchForQualifiedParents": {
      "map": "function (doc) {\n  if(doc.username&&doc.couplingbalance>0)\n  emit(doc.username, doc);\n}"
    },
    "changePassword":{
      "map": "function (doc) {\n  if(doc.username&&doc.password&&doc.phone1)\n  emit([doc.username,doc.password,doc.phone1], doc);\n}"
    },
  },
  "language": "javascript"
};
var __design_binary={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.username,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    },

  },
  "language": "javascript"
};
var __design_package={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.packagename,1);\n}"
    },
    "findByGUI": {
      "map": "function (doc) {\n  emit(doc.gui, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_package_details={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc._id,1);\n}"
    },
    "findByUserGUI": {
      "map": "function (doc) {\n  emit(doc.usergui, doc);\n}"
    },
    "findByGUI": {
      "map": "function (doc) {\n  emit(doc.packagegui, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_coupling_score={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n if(doc.username)\n emit(doc.username,null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.username,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  if(doc.username)\n emit(doc.username, doc);\n}"
    }
    ,
    "findByUserGui": {
      "map": "function (doc) {\n  emit(doc.usergui, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_packagedetails={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc._id,1);\n}"
    },
    "findByGui": {
      "map": "function (doc) {\n if(doc.packagegui)\n emit(doc.packagegui, doc);\n}"
    },
    "findByUserGui": {
      "map": "function (doc) {\n if(doc.usergui)\n emit(doc.usergui, doc);\n}"
    },
    "findActiveByUserGui": {
      "map": "function (doc) {\n  if(doc.isactivated) \n emit(doc.usergui, doc);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    }
  },
  "language": "javascript"
};


//console.log(createTodayRange());
//insertTest();
//fetchTest();
function createTodayRange(){
  var dateobj= new Date() ;
  var day = dateobj.getDate() ;
  var year = dateobj.getFullYear();
  var month=dateobj.getMonth()+1;
  console.log(dateobj);
  var startTime=[year,month,day];
  console.log(startTime);
  return new Date();
}

function insertTest(){
  db=create_db("test");
  db.view(__design_view,"findByName",{key:[new Date("2017-08-23T15:26:27.001Z")],include_docs:true},function(err,res){
    if(err) console.log(err);
    else{
      if(res.rows.length){
        res.rows.forEach(function(element) {
          console.log(element.value);
          //element.value.createddate=new Date();
          //db.insert(element.value,element.value._id,function(err,res){});
        }, this); 
      }
      else{
        console.log("no test record");
      }
    }
  });
}
function fetchTest(){ 
  db=create_db("test");
  db.view(__design_view,"findByName",{keys:["a","ab"],include_docs:true},function(err,res){
    if(err) console.log(err);
    else{
      if(res.rows.length){
        res.rows.forEach(function(element) {
          console.log(element.value);
        }, this);
      }
      else{
        console.log("no test record");
      }
    }
  });
}

















function init_db(dbname,design){
  // create a new database
  var db;
  async.eachSeries([
    db=create_db(dbname),
    db=nano.use(dbname),
    db.insert(design,function (err,res){
      if(err)
        console.log('could not create design '+dbname+" "+err.message);
      else 
        console.log('created design '+dbname);
    })
  ],function (err){
    console.log('exist '+dbname);
  });
  //db = nano.use(dbname);
  //return db;
}
function get_init_client(client_ip){
  const browser = require('detect-browser');
  
  var c={
    username:"",
    logintoken:"",
    logintime:null,
    logintimeout:null,
    clientuid:uuidV4(),
    registeruid:null,
    confirmregisteruid:null,
    browserinfo:browser,
    ip:client_ip,
    other:"",
    lastaccess:convertTZ(new Date()),
    isexist:false,
    clientjs:"",
    fingerprint:"",
    data:""
    };
  return c;
}

function set_client(client,resp){
   
  /*
    client.data={
      user:"",
      couplingscore:"",
      balance:"",
      package:"",
      packagedetails:"",
      payment:"",
      userbinary:"",
    };
    client.message:"ERROR, OK, GOOD, SUCCESS";
  */
  var keyword="Authen";
  console.log("client.clientuid"+client.clientuid)
  
  if(client.clientuid==""){
    client.clientuid="";
    keyword="NOBODY";
    throw new Error("Client not init, please check");
  } 

  r_client.getAsync(keyword+client.clientuid).then(function(res) {
    console.log("res"+JSON.stringify(res));
    if(res!=null){
      r_client.del(keyword+client.clientuid);
      client.clientuid=uuidV4();
      //client.logintoken=uuidV4();
    }
    r_client.setAsync(keyword+client.clientuid, JSON.stringify(client)).then(function(res) {
      __cur_client=JSON.stringify(res);
      if(resp)
        resp.send(res);     
    });
  }); 
  
}
function change_password(js){
  if(js.client.data.user.oldpassword1==js.client.data.user.oldpassword2){
    changePassword(js).then(function(body){
      js.client.message=body;
      resp.send(js.client);
    }).catch(function(err){
      if(err)
        js.resp.send(err);
    }).done();
  }
}
function changePassword(js){
  var deferred=Q.defer();
  var db=create_db('user');
  var username=js.client.data.user.username;
  var phone1=js.client.data.user.phone1;
  var password=js.client.data.user.oldpassword1;
  db.view(__design_view,'changePassword',{key:[username,password,phone1],include_docs:true},function(err,res){
    if(err) deferred.reject(err);
    else{
      if(res.rows.length){
        u=res.rows[0].value;
        //delete u._rev;
        u.password=js.client.data.user.password;
        db.insert(u,u._id,function(err,res){
          if(err) deferred.reject(err);
          else{
            deferred.resolve({message:"OK"});
          }
        });      
      }
      else{
        deferred.reject(new Error("User not found"));
      }
    }
  });
  return deferred.promise;
}
/**HEARTBEAT */
function heartbeat(client,resp){
  // UPDATE HEARTBEAT
  if(client.logintoken){
    var js =client.data;
    check_authentication(js).then(function(body){
    if(body.user.username==client.data.user.username&&body.user.password==client.data.user.password){

      client.data={};
      client.username=body.user.username;
      client.logintime=convertTZ(new Date());
      client.logintoken=uuidV4();
      client.lastaccess=convertTZ(new Date());
      //set_client(client,resp);
      set_client(client);
      resp.send(client);
    }
    else{
      client.data={}; 
      client.message="NO this Username and password";
      resp.send(client);
    }
    }).catch(function(err){
      console.log(err);
    }).done(); 
  }
}
// function set_heartbeat_interval(client,resp){
//       client.clientuid=uuidV4();
      
//       set_client(client,resp);
//       set_authentication(client);
// }
/** */


init_db('bonusbalance',__design_balance);
init_db('mainbalance',__design_balance);
init_db('topupbalance',__design_balance);
init_db('bonustopupbalance',__design_balance);
init_db('packagedetails',__design_packagedetails);
//init_db("system",__desing_system); 
init_db('user',__design_user);
init_db('package',__design_package);
init_master_user();

function init_master_user(){
    var db=create_db("user");
    console.log("init master");
    r_client.getAsync("__Master").then(function(body){
      //console.log("body: "+body);
      if(!body)
      db.view(__design_view,"findTopUser",function(err,res){
       // console.log("res"+JSON.stringify(res.rows[0].value));
        if(err){
          //insert a top user
          db.insert(__master_user,__master_user.gui,function(err,res){
            if(err){
              throw new Error(err);
            }
            else{
              r_client.setAsync("__Master",JSON.stringify(__master_user)).then(function(body){

              }).catch(function(err){
                throw new Error("could not set master user for redis"+err);
              }).done();
              console.log("top user created!");
            }
          });
        }
          
        else if(res.rows.length){
          r_client.setAsync("__Master",JSON.stringify(res.rows[0].value)).then(function (body){
            console.log('setAsync');
            console.log("Master has been set");
          }).catch(function(err){
            throw new Error("could not set master user for redis"+err);
          }).done();
        }
        else
          throw new Error("Sorry no master found");
      });
      else __master_user=body;
    });
}
function login(client,resp){
  console.log("HI LOGIN");
  var js=client.data;
   console.log(js);
  check_authentication(js).then(function(body){
    // console.log("body:"+JSON.stringify(body));
    // console.log("client.data:"+JSON.stringify(client.data));
    if(body.user.username==client.data.user.username&&body.user.password==client.data.user.password){
      client.data={};
      client.username=body.user.username;
      client.logintime=convertTZ(new Date());
      client.logintoken=uuidV4();
      //set_client(client,resp);
      client.lastaccess=convertTZ(new Date());
      set_client(client);
      resp.send(client);
    }
    else{  
      client.data={}; 
      client.message="NO this Username and password";
      resp.send(client);
    }
  }).catch(function(err){
    console.log(err);
  }).done(); 
}
function check_authentication(js){
  var deferred=Q.defer();
  var db=create_db("user");
  db.view(__design_view,"authentication",{
      key: [js.user.username,js.user.password],
      include_docs: true
    },function(err,body){
      if (err) {
        deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          
          deferred.resolve({user:{username:null,password:null}});
          //TEST when no record yet
          //deferred.resolve({username:"nou",password:"123456"});
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(js);
        }
      }
    });
    return deferred.promise;
}
function get_balance(user,page,maxpage,resp){
     var __doc={
      username:"",
      usergui:"",
      gui:"",
      balance:0,
      updated:convertTZ(new Date()),
      diffbalance:0
    };    
    var db=create_db("balance");
    var js={db:db,user:user,resp:resp};
    
    findBalanceByUsername(js).then(function(arr){      
        js.resp.send(arr);
    }).catch(function(err){
      js.resp.send(JSON.stringify(err));
    }).done();

}
function get_count_balance(user,resp){
  var db=create_db("balance");
  var js={db:db,user:user,resp:resp};
  
  countBalanceByUsername(js).then(function(arr){      
      js.resp.send(arr);
  }).catch(function(err){
    js.resp.send(JSON.stringify(err));
  }).done();
}
function countBalanceByUsername(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findCount",{
      key: js.user.username,
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);          
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
function findBalanceByUsername(js,page,maxpage){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByUsername",{
      key: js.user.username,
      include_docs: true,
      descending:true,
      limit:maxpage,
      skip:page
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);          
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
};

function addBalanceByUser(js,user){
  var deferred=Q.defer();
  
  if(!user) user=js.user;
  
  if(!js.balance) throw new Error("empty balance object")
  if(js.balance.type.indexOf('main')){
    js.db=create_db('mainBalance');
  };
  js.db.view(__design_view,"findByUsername",{
      key: user.username,
      include_docs: true,
      limit:1,
      skip:0,
      descending:false
    },function(err,body){
    if(error){
      deferred.reject(new Error(error));
    }
    else if(body.rows.length){
      var b={
        username:body.rows[0].value.username,
        usergui:body.rows[0].value.usergui,
        gui:uuidV4(),
        balance:body.rows[0].value.balance+js.balance.diffbalance,
        updated:convertTZ(new Date()),
        diffbalance:js.balance.diffbalance,
        type:js.balance.type
      };
      js.db.insert(js.balance,js.balance.gui,function(err,body){
        if (err) {
          deferred.reject(new Error(err));
        } else {
          var db=create_db("user");
          db.view(__design_view,"findByUsername",{
          key:user.username,
          include_docs:true
          },function(err,res){
            if(err) deferred.reject(err);
            else{
              if(res.rows.length){
                var u=res.rows[0].value;
                if(b.balance.indexOf('main')){
                  u.mainbalance+=b.balance;
                }
                else{
                  u.balancevalue+=b.balance;
                }                                
                if(b.type=="score"){
                  u.couplingbalance=0;
                  u.couplingtotalmoney+=b.diffbalance      
                }                
                db.insert(u,u.gui,function(err,res){
                  if(err) deferred.reject(err);
                  else deferred.resolve(js);
                });
              }
              else
                deferred.reject(new Error("Could not find this user"));
            }
          });
          //deferred.resolve(js);
        }
      });
    }
    else{
      var b={
        username:user.username,
        usergui:user.gui,
        gui:uuidV4(),
        balance:js.balance.diffbalance,
        updated:convertTZ(new Date()),
        diffbalance:js.balance.diffbalance,
        type:js.balance.type
      };      
      js.db.insert(js.balance,js.balance.gui,function(err,body){
        if (err) {
          deferred.reject(new Error(err));
        } else {          
          var db=create_db("user");
          db.view(__design_view,"findByUsername",{
          key:user.username,
          include_docs:true
          },function(err,res){
            if(err) deferred.reject(err);
            else{
              if(res.rows.length){
                var u=res.rows[0].value;
                
                if(b.type.indexOf('main')){
                  u.mainbalance=b.balance;
                }
                else
                  u.balancevalue+=b.balance;
                

                if(js.balance.type=="score"){
                  u.couplingbalance=0;
                  u.couplingtotalmoney+=js.balance.diffbalance      
                }
                db.insert(u,u.gui,function(err,res){
                  if(err) deferred.reject(err);
                  else deferred.resolve(js);
                });
              }
              else
                deferred.reject(new Error("Could not find this user"));
            }
          });
          //deferred.resolve(js);
        }
      });
    }
  });
  
  return deferred.promise;
}
/***********************END BALANCE */

/**REGISTER */
function addNewUser(js,parent,package,introductor,client){
  var deferred=Q.defer();
  js.user.gui=uuidV4();
  js.user.usercode=js.user.username;
  js.user.createddate=convertTZ(new Date());
  js.user.memberlevel=parent.memberlevel+1;
  js.user.parentname=parent.username;
  js.user.aboveparents=[];
  
  if(js.user.isleft&&parent.userleftgui==""){
    parent.userleftgui=js.user.gui; // add a new member as the left side
    //parent.leftside.push(user.gui); // push new member as left side range
    js.user.aboveparents.push(parent.aboveparents); // push parent's parent first
    js.user.aboveparents.push(parent.username);//push the latest parent at last
  }
  else if(!js.user.isleft&&parent.userrightgui==""){
    parent.userrightgui=js.user.gui; // add a new member as the right side
    //parent.rightside.push(user.gui); // push new member as right side range
    js.user.aboveparents.push(parent.aboveparents); // push parent's parent first
    js.user.aboveparents.push(parent.username);//push the latest parent at last
  }
  else deferred.reject(new Error("position not correct"));
  
  js.user.packagevalue=package.packageValue;
  js.user.packagename=package.packagename;
  js.user.packagegui=package.gui;
  
  /*** INIT */
  js.user.introductorgui=introductor.gui;
  js.user.introductorcode=introductor.usercode;
  js.user.registeredby=client.username;
  /*** */
  
  js.db.insert(js.user,js.user.username,function(err,body){
      if (err) {
        deferred.reject(new Error(err));
      } else {
        js.message="inserted "+JSON.stringify(body);
        js.db.insert(parent,parent.gui,function(err,res){
          if(err){
            deferred.reject(new Error(err));
          }
          else if(res){
            js.db=create_db('userbinary');
            addBinaryTree(js,parent).then(function(body){
              if(body){
                console.log("add userbinary completely , + update parent");
                var db=create_db("packagedetails");
                var __doc={
                  gui:uuidV4(),
                  userui:js.user.gui,
                  packageui:js.package.gui,
                  registerdate:convertTZ(new Date()),
                  updateddate:convertTZ(new Date()),
                  isactive:true,
                  notactivedate:null,
                  };
                // new package details
                db.insert(__doc,__doc.gui,function(err,res){
                  if(err) deferred.reject(err);
                  else{
                    deferred.resolve(res);
                  }
                });                
              }
            });            
            console.log("add user completely");
          }
        });        
      }
    });
  return deferred.promise;
}
function addBinaryTree(js,parent){
  var deferred = Q.defer();
  var __doc={ // for current user
    usergui:js.user.gui,
    username:js.user.username,
    createddate:convertTZ(new Date()),
    updateddate:convertTZ(new Date()),
    luser:"",
    ruser:"",
    level:parent.memberlevel+1,
    gui:uuidV4()
    };
  var p={ // for parents
    usergui:"",
    username:"",
    createddate:null,
    updateddate:null,
    luser:"",
    ruser:"",
    level:0,
    gui:uuidV4()
  };
  //js.db=create_db('userbinary');
  js.db.view(__design_view,"findUserByUsername",{key:parent.username,include_docs:true},function(err,res){
    if(err)
      deferred.reject(err);
    else{
      if(res.rows.length){
        p=res.row[0].value;
        p.updateddate=convertTZ(new Date());
        if(js.user.isleft){
          if(!p.luser)
            p.luser=js.user.username;
          else 
            deferred.reject(new Error('left user exist for '+p.usergui));
        }
        else{
          if(!p.ruser)
            p.ruser=js.user.username;
          else
            deferred.reject(new Error('right user exist for '+p.usergui));
        }
        //p.level++;
        js.db.insert(p,p.gui,function(err,res){
          if(err)
            throw new Error(err);
          else{
            js.db.insert(__doc,__doc.gui,function(err,res){
              if(err)
                throw new Error(err);
              else
                deferred.resolve(__doc);
            });
          }
        });        
      }
      else{
        deferred.reject(new Error('could not find a user by this GUI'));
      }
    }
  });

  return deferred.promise;
}
function register(register,needbalance,resp){//needbalance={main:0.5,bunus:0.5}
  var __doc={
    username:"",// show *
    password:"",//show*
    usercode:"",
    createddate:new convertTZ(new Date()),//not show
    gui:uuidV4(),//not show
    email:"",//show *
    phone1:"",//show *
    phone2:"",// show
    address:"", //show
    photo:"", //show
    memberlevel:"", // show , current level + 1
    ispaired:false,// not show
    parentname:"",//as a userid or parentid  as a client GUI or current user gui
    isleft:false, // not show
    //isB:false,
    userleftgui:"" ,// not show
    userrightgui:"",// not show
    aboveparents:"",
    //leftside:"",
    //rightside:"",

    packagevalue:0, //not show
    packagename:"", // not show
    packagegui:"",// not show
    balancevalue:0,// total the rest balance from all income: introduction, bonus , coupoling
    Lcoupling:0,//not show
    Rcoupling:0,// not show
    couplingbalance:0,// the rest balance after get from couplingscore , need to consider when need to pay, 
    couplingtotalmoney:0, // the money collected from couplingscore
    introductorgui:"",//not show
    introductorcode:"", 
    isfreeuser:true,
    registeredby:"",
    maxproduct:0,
    maxpaid:0,
    firstbalance:0,
    mainbalance:0,
    offeredbonus:0,
    topupbalance:0,
    bonustopupbalance:0
    };
    var payment={
      usergui:"",
      username:"",
      paymentdate:convertTZ(new Date()),
      paymentvalue:0,
      paymentby:"",
      paidbygui:"",
      payreason:"",
      description:"",
      gui:uuidV4()
      };
    var bonusBalance={ // score , introduction
        username:"",
        usergui:"",
        gui:"",
        balance:0,
        updated:convertTZ(new Date()),
        diffbalance:0,
        remark:""
      };
    var topupBalance={// for topup only, 
        username:"",
        usergui:"",
        gui:"",
        balance:0,
        updated:convertTZ(new Date()),
        diffbalance:0,
        remark:""
      };
    var mainBalancet={// real money from pe-paid at company, 
      username:"",
      usergui:"",
      gui:"",
      balance:0,
      updated:convertTZ(new Date()),
      diffbalance:0,
      remark:""
    };
    var bonusTopupBalance= {// for topup only, 
      username:"",
      usergui:"",
      gui:"",
      balance:0,
      updated:convertTZ(new Date()),
      diffbalance:0,
      remark:""
    };
    var client=__cur_client;
    var js={db:create_db("user"),client:client,resp:resp,user:register,needbalance:needbalance};
    js.topuser=__master_user;

     // find client exist ==>
    findClientExist(js).then(function(body){
      // find user  ==>
      var registra=body;
      js.registra=registra;
      findByUserName(js).then(function(body){    
        // find if a new user is qualify for max phone number  ==>
        if(body.length>0)
          throw Error('you could not use this username')
        // FIND max number can use to register a new account ==>
        findMaxPhoneNumber(js).then(function(body){
          
          if(body.length>3) throw new Error("this number could not be registered in more than 3 accounts");   
          // find a parent
          findParentByGui(js).then(function (body){
            // find introductioncode
            var parent=body;
            
            // MUST be UPLINE ONLY TODO* MUST BE UPLINE, PUT aboveparents property to solve this problem ==>
            findUserByIntroductionCode(js).then(function (body){
              var introductor=body;
              
              if(introductor.gui!=parent.gui || parent.aboveparents.indexOf(introductor.gui)<1){
                throw new Error("introductor code is not in the same upline");   
              }
              // find register package , later use this for upgrade ==>
              js.db=create_db("packages");
              findRegisterPackageByUser(js).then(function (body){
                var package=body;

                //js.db=create_db("bonusBalance");// find both bonus balance and register balance for registration
                findNeedBalanceByUserGui(js,registra).then(function(body){
                  var registrabalance=body;
                  
                  if(/*registrabalance.bonus.balance!=registra.balancevalue||*/registrabalance.main.balance!=registra.mainbalance){
                    throw new Error('balance is abnormal please contact admin');
                  }
                  // TODO** IF BALANCE NOT ENOUGH COULD NOT MAKE A REGISTER  ==>OK
                  // need to check if bonus balance or main balance must be use not less than 50% of each, and sum of both must be enough for register
                  
                  if(/*js.needbalance.main>registrabalance.main.balance||*/js.needbalance.bonus>registrabalance.bonus.balance)
                    throw new Error('balance is abnormal please contact admin');
                  
                  // if(js.needbalance.bonus.balance>package.packagevalue/2){
                  //   throw new Error("max register amount is 50%");
                  // }                  
                  if((js.needbalance.main/*+js.needbalance.bonus*/)!=package.packagevalue){
                    throw new Error("register value and package has not equal value");
                  }
                  //completeRegistration(js,parent,package,introductor,client,maxproduct,maxpaid,firstbalance,introductionvalue,fee,theregistrabalance,score)
                  switch(registra.packagevalue){
                    case 1750000:
                      switch (package.packagevalue){
                          case 1750000:{                          
                            completeRegistration(js,parent,package,introductor,client,registrabalance,registra,false,75,1750000,125000,250000,5*107500,837500,100000);
                          // process payment on other processinvoice
                          }
                          case 350000:{
                            completeRegistration(js,parent,package,introductor,client,registrabalance,registra,false,15,350000,25000,50000,107500,167500,20000);
                          }
                          case 100000:{
                            completeRegistration(js,parent,package,introductor,client,registrabalance,registra,true,0,0,25000,40000,35000,0,0);                              
                          }  
                      }
                    case 350000:
                      switch (package.packagevalue) {
                        case 1750000:{                          
                          completeRegistration(js,parent,package,introductor,client,registrabalance,registra,false,75,1750000,125000,200000,5*107500,837500,100000);
                        // process payment on other processinvoice
                        }
                        case 350000:{
                          completeRegistration(js,parent,package,introductor,client,registrabalance,registra,false,15,350000,25000,40000,107500,167500,20000);
                        }
                        case 100000:{
                          completeRegistration(js,parent,package,introductor,client,registrabalance,registra,true,0,0,25000,40000,35000,0,0);                              
                        }
                        };
                    case 100000:{
                      js.resp.send(JSON.stringify(new Error("could not be registered please upgrade your package")));
                    }
                      
                  }                                                                                   
                });
              });
            });
          });
        });
      });
  }).catch(function(err){
    js.resp.send(JSON.stringify(err));
  }).done();

}
function completeRegistration(js,parent,package,introductor,client,isfree,maxproduct,maxpaid,firstbalance,introductionvalue,fee,theregistrabalance,score){
    /////// Insert a new user

  //var isfree=false;
  js.user.gui=uuidV4();
  js.user.isfreeuser=isfree;
  js.user.maxproduct=maxproduct;
  //js.user.isB=parent.isB;
  js.user.maxpaid=maxpaid;//// 1750000 daily max payment                          
  js.user.memberlevel=parent.memberlevel+1;
  js.user.createddate=convertTZ(new Date());

  js.db=create_db("user");
  // add a new user
  // add new binary tree 
  
  addNewUser(js,parent,package,introductor,client).then(function(body){

    js.user.firstbalance=firstbalance;// 125.000 top-up new user added
    js.balance={
      username:js.user.username,
      usergui:js.user.gui,
      gui:uuidV4(),
      balance:0,
      updated:convertTZ(new Date()),
      diffbalance:0,
      type:"none"
    };
    
    //js.balance.balance+=js.balance.diffbalance;
    //var js={db:create_db('balance'),balance:balance};
    js.db=create_db('bonusBalance');                                                     
    // add top up value for a new user 125.000 --- OK
    addBalanceByUser(js,js.user).then(function(body){
      console.log(body);
      //// insert  to introductor 250.000 ---OK
      js.balance={
        username:introductor.username,
        usergui:introductor.gui,
        gui:uuidV4(),
        balance:0,
        updated:convertTZ(new Date()),
        diffbalance:introductionvalue,
        type:"intro"
      };
      js.balance.balance+=js.balance.diffbalance;
      js.introductor=introductor;

      addBalanceByUser(js,introductor).then(function(body){
        console.log(body); 
        js.balance={
          username:js.topuser.username,
          usergui:js.topuser.gui,
          gui:uuidV4(),
          balance:0,
          updated:convertTZ(new Date()),
          diffbalance:fee,
          type:"fee"
        };
        js.balance.balance+=js.balance.diffbalance;
        addBalanceByUser(js,js.topuser).then(function(body){                                                                                                            
          //// the rest money===> 1750000- 125000- 250.000- 107500 -100000 =1.167.500
          // normally each parent get 100.000 max, but limit by max pay and total parent will get average value 
          // by total number of parent.
          //js.db=create_db("user");
          js.parent=parent;
          js.theregistrabalance=theregistrabalance;
          // get all above parent , 
          
          var totalparent=0;
          js.db=create_db("user");
          js.score=score;
        ////return score to all parent 100.000 OK
        addCouplingScore(js,parent).then(function(body){
          //********************TODO */
          var pArr=parent.aboveparents;
          pArr.push(parent.username);
          //pArr=pArr.reverse();
          // find qualified above parents
          //js.theregistrabalance
          //TODO: qualifiedParents
          // - balance >0 on couplingscore
          js.db=create_db("user");
          
          searchForQualifiedParents(js,pArr).then(function(body){
            var qp=body;
            var averageValue=js.theregistrabalance/qp.length;
            var theRestValue=0;
            // pretend overppay  
            if(averageValue>js.score){
              theRestValue=(js.score-averageValue)*qp.length;//add to topuser
              averageValue=js.score;//this value add to every above qualified parent
              // TODO : NEED TO ADD TO TOPUSER here
              js.balance={
                username:js.topuser.username,
                usergui:js.topuser.gui,
                gui:uuidV4(),
                balance:0,
                updated:convertTZ(new Date()),
                diffbalance:theRestValue,
                type:"rest"
              };
              js.db=create_db("bonusBalance");
              addBalanceByUser(js,js.topuser).then(function(body){
                  if(body){
                    console.log("rest value has been added to topup ")
                  }
              }); 
            }
              // - under limit of max paid per day
            qp.forEach(function(element) {
              var db=create_db("bonusBalance");
              var now=convertTZ(new Date());
              var nowArr=[now.getFullYear(),(now.getMonth()+1),now.getDate()];
              db.view(__design_view,"findBalanceByDateAndUser",{
                key:[nowArr,qp.username],// create a funtion today value only
                include_docs:true,
              },function(err,res){
                if(err) throw new Error(err);
                else{
                  if(res.rows.length){
                    var sum=0;
                    for (var i = 0, len = res.rows.length; i < len; i++) {
                      if(rews.rows[i].value.type=="score")// score, introduction, fee ,
                      sum+=res.rows[i].value.balance;
                    }
                    if(sum>qp.maxpaid){ // ignore payment for this transaction
                      // insert to topuser balance
                      // update topuser
                      js.balance={
                        username:js.topuser.username,
                        usergui:js.topuser.gui,
                        gui:uuidV4(),
                        balance:0,
                        updated:convertTZ(new Date()),
                        diffbalance:averageValue,
                        type:"over-recieved"
                      };
                      addBalanceByUser(js,js.topuser).then(function(body){
                        if(body){
                          // insert to qp balance
                          // update qp
                          js.balance={
                            username:qp.username,
                            usergui:qp.gui,
                            gui:uuidV4(),
                            balance:0,
                            updated:convertTZ(new Date()),
                            diffbalance:0,
                            type:"score"
                          };
                          addBalanceByUser(js,qp).then(function(body){
                            if(body){
                              deductBalance(js);
                              console.log("update user couplingscore completed");                                                        
                            }
                          });
                        }
                      });
                    }
                    if(sum+averageValue>qp.maxpaid){
                      var averageValue2=(sum+averageValue)-qp.maxpaid
                      // insert to topuser balance
                      // update topuser
                        js.balance={
                          username:js.topuser.username,
                          usergui:js.topuser.gui,
                          gui:uuidV4(),
                          balance:0,
                          updated:convertTZ(new Date()),
                          diffbalance:averageValue2,
                          type:"over-recieved"
                        };
                        addBalanceByUser(js,js.topuser).then(function(body){
                          if(body){
                            // insert to qp balance
                            // update qp
                            js.balance={
                              username:qp.username,
                              usergui:qp.gui,
                              gui:uuidV4(),
                              balance:0,
                              updated:convertTZ(new Date()),
                              diffbalance:averageValue-averageValue2,
                              type:"score"
                            };
                            addBalanceByUser(js,qp).then(function(body){
                              if(body){
                                deductBalance(js);
                                console.log("update user couplingscore completed"+qp.username);

                              }
                            });
                          }
                        });
                      
                    }
                    else{
                      
                      js.balance={
                        username:qp.username,
                        usergui:qp.gui,
                        gui:uuidV4(),
                        balance:0,
                        updated:convertTZ(new Date()),
                        diffbalance:averageValue,
                        type:"score"
                      };
                      addBalanceByUser(js,qp).then(function(body){
                        if(body){
                            // update couplingscore of qp current user
                            js.db=create_db("user");
                            qp.couplingbalance=0;
                            js.db.insert(qp,qp.gui,function(err,res){
                              if(err)
                                throw new Error(err);
                              else{
                                deductBalance(js);
                                console.log("update user couplingscore completed"+qp.username);
                              }                                                            
                            });
                        }
                      });
                    }
                  }
                  console.log("no balance record for "+qp.username);
                }
              });
            }, this);
            
          });
          
          });                                  
        });
      });  
    });
  }).catch(function(error){
    js.resp.send(error);
  }).done();                          
}
function deductBalance(js){
  // deduct money from registra user
  //mainBalance
  js.db=create_db("mainBalance");
  js.balance={
    username:js.regsi.registra.username,
    usergui:js.regsi.registra.gui,
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:-1*(js.needbalance.main),
    type:"registermain"
  };
  console.log("update user couplingscore completed"+js.registra.username);
  addBalanceByUser(js,js.registra).then(function(boy){
    if(body){
      // deduct money from registra user
      // bonus balance
      if(js.needbalance.bonus>0){
        js.db=create_db("bonusBalance");
        js.balance={
          username:js.registra.username,
          usergui:js.registra.gui,
          gui:uuidV4(),
          balance:0,
          updated:convertTZ(new Date()),
          diffbalance:-1*(js.needbalance.bonus),
          type:"registerbonus"
        };
        addBalanceByUser(js,js.registra).then(function(boy){
          if(body){
            console.log("deduct bonuse from registra completed "+registra.username);
          }
        });
      }
      console.log("deduct main balance from registra completed "+registra.username);
      js.resp.send("registratrion was completed");
    }
  });
}

function findByUserName(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByUserName",{
      key:js.user.username,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
function findMaxPhoneNumber(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByPhone",{
      key:js.user.phone1,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}


function findUserByIntroductionCode(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByIntroductorcode",{
      key: js.user.introductorcode,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(js);
        }
      }
    });
    return deferred.promise;
}
function findClientExist(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findExist",{
      key: js.client.username,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(js);
        }
      }
    });
    return deferred.promise;
}
function findNeedBalanceByUserGui(js,registra){
  //var userCurrentBalance=0;
  //js.needbalance={main:0.5,bonus:0.5}
  var deferred=Q.defer();
  js.db=create_db("mainBalance");
  js.db.view(__design_view,"findByGui",{
      key: registra.gui,
      include_docs: true,
      descending:true,
      limit:1
    },function(err,body){
      if (err) {
      deferred.reject(err);
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          mainBalance=body.rows[0].value;
          js.db=create_db("bonusBalance");
          js.db.view(__design_view,"findByGui",{
            key:registra.gui,
            include_docs:true,
            descending:true,
            limit:1
          },function(err,body){
            if(err) deferred.reject(err);
            else{
              bonusBalance=body.rows[0].value;
              deferred.resolve({main:mainBalance,bonus:bonusBalance});
            }
          });
          
        }
      }
    });
    return deferred.promise;  
}
function findRegisterPackageByUser(js){
  var packageValue=0;
  var deferred=Q.defer();
  js.db.view(__design_view,"findByGui",{
      key: js.package.gui,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
function findPackageDetailsByUser(js){
  var packageValue=0;
  var deferred=Q.defer();
  js.db.view(__design_view,"findByUserGui",{
      key:js.user.gui,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
function findByUserGui(js){
   var deferred=Q.defer();
  js.db.view(__design_view,"findByUserGui",{
      key:js.user.gui,
      include_docs: true
    },function(err,body){
      if (err) {
      deferred.reject(new Error(err));
      } else {
        if (!body.rows.length) {
          deferred.reject(new Error("no record"));
        } else {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.body=arr;
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
/** */
function get_package(js){
  js.db=create_db('package')
  getPackage().then(function(body){
    if(body)
      js.resp.send(body);
  }).catch(function(err){
    js.resp.send(err);
  });
  
}
function getPackage(){
  var deferred=Q.defer();
    js.db.view(__design_view,"findAll", {
      include_docs:true,
    },function(err,res){
      if(err)
        deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
        else{
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise();
}
function get_package_details(js){
  js.db=create_db('packagedetails')
  getPackageDetailsByUser(js.user).then(function(body){
    if(body)
      js.resp.send(body);
  }).catch(function(err){
    js.resp.send(err);
  });
}
function getPackageDetailsByUser(user){
  var deferred=Q.defer();
    js.db.view(__design_view,"findByUsername", {
      key:js.user.username,
      include_docs:true,
      descending:true
    },function(err,res){
      if(err)
        deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
        else{
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise();
}

function get_payment_list(js,page,maxpage){
  js.db=create_db('payment');
  getPaymentListByUser(js.user).then(function(body){
    if(body) js.resp.send(body);
  }).then(function(err){
    if(err) js.resp.send(err);
  });
}
function getPaymentListByUser(user,page,maxpage){
  var deferred=Q.defer();
  db.view(__design_view,"findByUsername",{
      key: user.username,
      include_docs: true,
      limit:maxpage,
      skip:page
    },function(err,body){
      if (err) {
        deferred.reject(new Error(err));
      } else {
        if (body.rows.length) {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
function make_payment(js){
  js.db=create_db('payment');
  js.payment={};
  makePayemntForUser(js).then(function(body){
    if(body) js.resp.send(body);
  }).catch(function(err){
    if(err) js.resp.send(err);
  })
}
function makePayemntForUser(js){
  var deferred=Q.defer();
  js.db.insert(js.payment,js.payment.gui,function(err,body){
      if (err) {
        deferred.reject(new Error(err));
      } else {
        if (body.rows.length) {
          var arr=[];
          body.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          js.db=create_db('user');
          findByUserName(js).then(function(body){
            if(body){
              js.db.insert(body,body.gui,function(err,res){
                if(err) deferred.reject(err);
                else{
                  if(res.rows.count){
                    // TODO : deduct money from user
                    
                    //deferred.resolve()
                  }
                }
              });
            }
          }).catch(function(err){
            if(err) deferred.reject(err);
          });
          
        }
      }
    });
    return deferred.promise;
}


function get_user_binary(js){
  getUserBinaryByUser(js.user).then(function(body){
    if(body)
      js.resp.send(body);
  }).catch(function(err){
    if(err)
      js.resp.send(err);
  })
}
function getUserBinaryByUser(user){
  var deferred=Q.defer();
    js.db.view(__design_view,"findByUsername", {
      key:user.username,
      include_docs:true,
      descending:true,
    },function(err,res){
      if(err)
        deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
        else{
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise();
}



function get_count_coupling_score(js){
    js.db=create_db('couplingscore');
    getCountCouplingScoreByUser(js.user).then(function(body){
      js.resp.send(body);
    }).catch(function(err){
      js.resp.send(err);
    });
}
function getCountCouplingScoreByUser(user){
  var deferred=Q.defer();
  js.db.view(__design_view,"findCount", {
    key:user.username,
    include_docs:true,
    descending:true,
  },function(err,res){
    if(err)
      deferred.reject(err);
    else{
      if(res.rows.length){
        var arr=[];
        res.rows.forEach(function(element) {
          arr.push(element.value);
        }, this);
        deferred.resolve(arr);
      }
      else{
        deferred.resolve(arr);
      }
    }
  });
  return deferred.promise;
}
function get_coupling_score(js,page,maxpage){
  js.db=create_db('couplingscore');
  getCouplingScoreByUser(js.user,page,maxpage).then(function(body){
    if(body)
      js.resp.send(body);
  }).catch(function(err){
    js.resp.send(err);
  })
}
function getCouplingScoreByUser(user,page,maxpage){
  var deferred=Q.defer();
  var __doc={
    usergui:"",
    username:"",
    Lscore:0,
    Rscore:0,
    balance:0,
    createddate:convertTZ(new Date()),
    gui:uuidV4()
    };
    js.db.view(__design_view,"findByUsername", {
      key:user.username,
      include_docs:true,
      descending:true,
      limit:maxpage,
      skip:page
    },function(err,res){
      if(err)
        deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
        else{
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise();
}
function addCouplingScore(js,parent){//add for above parent only, which search from first parent 
  //find exsit coupling score
  var deferred=Q.defer();
  //if(!parent) parent=js.user;
  // find first parent looks for all above parents
  js.db.view(__design_view,"findByUsername",{
      key: parent.username,
      include_docs: true,
      descending: false,
    },function(error,result){            
      if(error)
        deferred.reject(error);      
      if(result.rows.length){
        //var p=[];
        //p=result.rows[0].value.aboveparents;
        //p.push(parent.username);
        //var curUser="";   
        //p=p.reverse();     
        //for(i=0;l=p.length,i<l;i++){
          u=result.rows[0];          
          // loop searching for each parent object and update it
          // js.db.view(__design_view,"findByUsername",{
          //   key: element,
          //   include_docs: true,
          //   descending: false,
          // },function(err,res){
          //   if(err) deferred.reject(err);
          //   else{
              //var u=res.rows[0].value;
              var db=create_db("couplingscore");
              // search for couplingscore data of each parent
              db.view(__design_view,"findByUsername",{
                key:u.username,
                include_docs:true,
                descending:false,
                limit:1
              },function(err,res){                
                if(err) deferred.reject(error); 
                else{
                  c=res.rows[0].value;                  
                  //if(curUser=="")
                    curUser=js.user;
          
                  if(curUser.isleft)
                    c.Lscore+=js.score;
                  else{
                    c.Rscore+=js.score;          
                  } 
                  if(c.Lscore>c.Rscore&&(c.Lscore&&c.Rscore)){
                    c.balance=c.Lscore-c.Rscore
                    c.Lscore-=c.balance;
                  }
                  else if(c.Lscore<c.Rscore&&(c.Lscore&&c.Rscore)){
                    c.balance=c.Rscore-c.Lscore;
                    c.Rscore-=c.balance;
                  }                                                 
                  // insert new couplingscore 
                  js.db.insert(c,c.gui,function(err,res){
                    if(err) deferred.reject(err);
                    else{
                      // add coupling score to above user
                      u.Lcoupling=c.Lscore,//not show
                      u.Rcoupling=c.Rscore,// not show
                      u.couplingbalance+=c.balance,// this must be total money of balance
                      //u.balancevalue=c.balance;
                      //u.couplingtotalmoney+=u.balancevalue;
                      //update coupling score for current user;
                      js.db.insert(u,u.gui,function(err,res){
                        if(err) deferred.reject(err);
                        else{                          
                          console.log("add coupling score to user completely "+u.username+" score:"+c.balance);
                          if(u.username!=__master_user.username){
                            js.user=curUser;
                            addCouplingScore(js,{username:curUser.parentname}).then(function(body){
                              console.log("finish add coupling for "+u.username+" score:"+c.balance);
                            });
                          }
                          else
                            deferred.resolve(res);
                          //deferred.resolve(res);
                        }                          
                      });
                      
                    }
                  }); 
                }
              });
              //curUser=u;            
              //deferred.resolve(res);
          //   }
          // });
        //}
        //deferred.resolve("above parents has been added scores "+parent.username);
      }       
    });
    return deferred.promise;
}

function findParentByGui(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByUsername",{
      key: js.user.parentname,
      include_docs: true,
      descending: false,
      limit: 1,
      skip: 0
    },function(error,result){
      if(error)
        deferred.reject(new Error(error));
      if(result.rows.length){    
        var arr=[];    
        array.forEach(function(element) {
          arr.push(element.value);
        }, this);
        js.body=arr;
        deferred.resolve(js);
      }
    });
    return deferred.promise;
}
function searchForQualifiedParents(js,pArr){
  var deferred=Q.defer();
  var db=create_db('user');
  db.view(__design_view,"searchForQualifiedParents",{
    keys:pArr},
    function(err,res){
      if(err)
        deferred.reject(err);
      else{
        var arr=[];
        if(res.rows.length){
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
        else{
          deferred.reject(new Error("found no ones"));
        }
      }

  });
  return deferred.promise;  
}
function findQualifiedParents(js,pArr){
  var deferred=Q.defer();
  var db=create_db('user');
  db.view(__design_view,"findQualifiedParents",{
    key:pArr,include_docs:true},
    function(err,res){
      if(err)
        deferred.reject(err);
      else{
        var arr=[];
        if(res.rows.length){
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          deferred.resolve(arr);
        }
        else{
          deferred.reject(new Error("found no ones"));
        }
      }

  });
  return deferred.promise;
}


// ສິ່ງທີ່ຈະໃຫ້ແລ້ວໃນທິດນີ້ ຫນ້າຕາແລະການເຮັດວຽກ
// - ລົງທະບຽນ ==> OK

// - ອັບເກດ
function upgradePackage(user,package,resp,client){
  var db=create_db("user");
  //find user if exist
  db.view(__design_view,"findByUsername",function(err,res){
    if(err)
      resp.send(err);
    else{
      if(res.rows.length){
        db=create_db("packagedetails");
        u=res.rows[0].value;
        //find if user has a registeration of package
        db.view(__design_view,"findActiveByUserGUI",{key:user.gui,descending:true},function(err,res){
          if(err){
            client.data.message=JSON.stringify(err);
            resp.send(client);
          }
          else{
            if(res.rows.length){
              var d=res.rows[0].value;
              var __doc={
                gui:uuidV4(),
                userui:user.username,
                packageui:package.gui,
                registerdate:convertTZ(new Date()),
                updateddate:convertTZ(new Date()),
                isactive:true,
                notactivedate:null,
                };
              d.updateddate=convertTZ(new Date());
              d.notactivedate=convertTZ(new Date());
              d.isactive=false;
              db.insert(d,d.gui,function(err,res){
                if(err) resp.send(err);
                else{
                  db.insert(__doc,__doc.gui,function(err,res){
                    if(err){
                      client.data.message=JSON.stringify(err);
                      resp.send(client);
                    } 
                    else{
                      u.packageValue=package.packageValue;
                      u.packagegui=package.gui;
                      u.packagename=package.packagename;
                      updateUser(u).then(function(body){
                        if(body){
                          client.data.message="Upgrade package was completed";
                          resp.send(client);
                        }
                      }).catch(function(err){
                        client.data.message=JSON.stringify(err);
                        resp.send(client);
                      });                      
                    }
                  });
                }
              });
              
            }
            else{
              var __doc={
                gui:uuidV4(),
                userui:user.username,
                packageui:package.gui,
                registerdate:convertTZ(new Date()),
                updateddate:convertTZ(new Date()),
                isactive:true,
                notactivedate:null,
                };
              db.insert(__doc,__doc.gui,function(err,res){
                if(err) {
                  client.data.message=JSON.stringify(err);
                  resp.send(client);
                }
                else{
                  client.data.message="Upgrade package was completed";
                  resp.send(client);
                }
              });
            }                    
          }
        });
      }
      
    }
  });
}
// - ລາຍຊື່ຕາມ ຕົ້ນໄມ້ binary
function showBinaryTree(user,client,resp){
  var db=create_db("userbinary");
  db.view(__design_view,"findByUsername",{key:user.username,descending:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        client.data.userbinary=res.rows[0].value;
        client.data.message="OK";
        resp.send(client);
      }
    }
  });
}
// - ລາຍງານ, ຄະແນນ ເງິນ ຈຳນວນ ສະມາຊິກຂອງຜູ້ໃຊ້ເອງ
function showBonusBalance(user,client,resp,page,maxpage){
  var __balance_doc={
    username:"",
    usergui:"",
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:0
  };
  var db=create_db("bonusBalance");
  db.view(__design_view,"findCount",{key:user.username,reduce:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:user.username,descending:true,limit:maxpage,skip:page},function(err,res){
          if(err) resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              client.data.balance={arr:arr,count:count};
              client.data.message="OK";
              resp.send(client);  
            }
          }
        });
      }
    }
  });  
}

function checkMainBalance(user,package,client){
  var __balance_doc={
    username:"",
    usergui:"",
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:0
  };
  var db=create_db("mainBalance");
  db.view(__design_view,"findCount",{key:user.username,reduce:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:user.username,descending:true,limi:1},function(err,res){
          if(err) resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              if(arr.balance>package.packagevalue)
                client.data.message="insufficient funds";
              else{
                client.data.balance={arr:arr,count:count};
                client.data.message="OK";
              }                
              resp.send(client);  
            }
          }
        });
      }
    }
  });
}

function showMainBalance(user,client){
  var __balance_doc={
    username:"",
    usergui:"",
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:0
  };
  var db=create_db("mainBalance");
  db.view(__design_view,"findCount",{key:user.username,reduce:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:user.username,descending:true,limit:maxpage,skip:page},function(err,res){
          if(err) resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              client.data.balance={arr:arr,count:count};
              client.data.message="OK";
              resp.send(client);  
            }
          }
        });
      }
    }
  });
}
function showTopupBalance(user,client){
  var __balance_doc={
    username:"",
    usergui:"",
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:0
  };
  var db=create_db("topupBalance");
  db.view(__design_view,"findCount",{key:user.username,reduce:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:user.username,descending:true,limit:maxpage,skip:page},function(err,res){
          if(err) resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              client.data.balance={arr:arr,count:count};
              client.data.message="OK";
              resp.send(client);  
            }
          }
        });
      }
    }
  });
}
function showBonusTopupBalance(user,client){
  var __balance_doc={
    username:"",
    usergui:"",
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:0
  };
  var db=create_db("bonusTopupBalance");
  db.view(__design_view,"findCount",{key:user.username,reduce:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:user.username,descending:true,limit:maxpage,skip:page},function(err,res){
          if(err) resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              client.data.balance={arr:arr,count:count};
              client.data.message="OK";
              resp.send(client);  
            }
          }
        });
      }
    }
  });
}
// - ຂໍ້ມູນຜູ້ໃຊ້
function showUserInfo(user,client,resp){
  viewUser(user).then(function(body){
    if(body){
      client.data.message={message:"OK"};
      client.data.user=body;
      resp.send(client);  
    }
  }).catch(function(err){
    resp.data.message=JSON.stringify(err);
    resp.send(client);
  });
}
function viewUser(user){
  var deferred=Q.defer();
  db=create_db("user");
  db.insert(__design_view,"findByUsername",{key:user.username},function(err,res){
    if(err){
      var l={
        log:("error %s",JSON.stringify(err)),
        logdate:new Date(),
        type:"error",
        gui:uuidV4()
      };
      logging(l);
      deferred.reject(err);
    }
    else{
      if(res.rows.length){
        var l={
          log:("info %s",JSON.stringify({message:"OK"})),
          logdate:new Date(),
          type:"info",
          gui:uuidV4()
        };
        logging(l);
        deferred.resolve(res.rows[0].value);
      }
      else{
        var l={
          log:("error %s",JSON.stringify({message:"user was not found "+user.username})),
          logdate:new Date(),
          type:"error",
          gui:uuidV4()
        };
        logging(l);
        deferred.resolve({message:("username %s was not found",user.username)});
      }
    }
  });
  return deferred.promise();
}
function redeem(user,client,redeemtype,resp){// redeemtype: offer , first balance
  var db=create_db("user");
  viewUser(user).then(function(body){
    client.data.user=res.rows[0].value;
    if(redeemtype=="firstBalance"){                    
      var topres=topupbalance(client.data.user.phone1,client.data.user.firstbalance);
      if(topres) {
        var l={
          log:("info %s",JSON.stringify(topres)),
          logdate:new Date(),
          type:"ifno",
          gui:uuidV4()
        };
        logging(l);
        client.data.message="redeem was not completed";
        client.data.user=user;
        resp.send(client);
        return;
      }
      client.data.message="redeem was completed";
      client.data.user.firstbalance=0;
      updateUser(client).then(function(body){
        var l={
          log:("info %s",JSON.stringify(body)),
          logdate:new Date(),
          type:"info",
          gui:uuidV4()
        };
        logging(l);
        client.data.message=JSON.stringify(body);
        client.data.user=user;
        resp.send(client);
      }).catch(function(err){
        var l={
          log:("error %s",JSON.stringify(err)),
          logdate:new Date(),
          type:"error",
          gui:uuidV4()
        };
        logging(l);
        client.data.message=JSON.stringify(err);
        client.data.user=user;
        resp.send(client);
      });          
    }
    else if(redeemtype=="offer"){
      var topres=topupbalance(client.data.user.phone1,client.data.user.offeredbonus);
      if(topres) {
        var l={
          log:("info %s",JSON.stringify(topres)),
          logdate:new Date(),
          type:"error",
          gui:uuidV4()
        };
        logging(l);
        client.data.message="offer was not completed";
        client.data.user=user;
        resp.send(client);
        return;
      }
      client.data.message="offer was completed";
      client.data.user.offeredbonus=0;
      updateUser(client.user).then(function(body){
        var l={
          log:("info %s",JSON.stringify(body)),
          logdate:new Date(),
          type:"info",
          gui:uuidV4()
        };
        logging(l);
        client.data.message=JSON.stringify(body);
        client.data.user=user;
        resp.send(client);
      }).catch(function(err){
        var l={
          log:("error %s",JSON.stringify(err)),
          logdate:new Date(),
          type:"error",
          gui:uuidV4()
        };
        logging(l);
        client.data.message=JSON.stringify(err);
        client.data.user=user;
        resp.send(client);
      });          
    }
  }).catch(function(err){
    var l={
      log:("error %s",JSON.stringify(err)),
      logdate:new Date(),
      type:"error",
      gui:uuidV4()
    };
    logging(l);
    client.data.message=JSON.stringify(err);
    client.data.user=user;
    resp.send(client);
  });        


}
function updateUser(user){
  var deferred=Q.defer();
  db=create_db("user");
  db.insert(user,user.gui,function(err,res){
    if(err){
      deferred.reject(err);
    }
    else{
      if(res.rows.length){
        var l={
          log:("update user %s was completed",user.username),
          logdate:new Date(),
          type:"info",
          gui:uuidV4()
        };
        logging(l);
        deferred.resolve({message:("update user %s was completed",user.username)});
      }
      else{
        var l={
          log:("update user %s was not completed",user.username),
          logdate:new Date(),
          type:"info",
          gui:uuidV4()
        };
        logging(l);
        deferred.resolve({message:("update user %s was not completed",user.username)});
      }
    }
  });
  return deferred.promise();
}
//
function transferBalance(user,touser,client,balancetype){// Bonusbalance, MainBalance, TopupBalance, BonusTopupBalance


}
function checkphone(phone){
  if(phone){
    return 5;
  }
  return 0;
}
function topupbalance(phone,value){
  switch (checkphone(phone)) {
    case 2:
      return topupETL(phone,value);
      break;
    case 5:
    return topupLaotel(phone,value);
      break;
    case 7:
    return topupBeeline(phone,value);
      break;
    case 9:
    return topupUnitel(phone,value);
      break;
  }
}
// TOPUP
function topupLaotel(phone,value){
// transfer balance from master user 
// use target service to tranfer 
// update master user account banlance 
// sync with target service
}
// TOPUP
function topupUnitel(phone,value){
  // transfer balance from master user 
// use target service to tranfer 
// update master user account banlance 
// sync with target service
  }
  // TOPUP
function topupBeeline(phone,value){
  // transfer balance from master user 
// use target service to tranfer 
// update master user account banlance 
// sync with target service
  }
  // TOPUP
function topupETL(phone,value){
  // transfer balance from master user 
// use target service to tranfer 
// update master user account banlance 
// sync with target service
  }
// ແລ້ວລະ ເປັນ alpha ທົດລອງໃຊ້




function Logging(log){
  var l={
    log:"",
    logdate:"",
    type:"",
    gui:uuidV4()
  };
  var db=create_db("logs");
  db.insert(log,log.gui,function(err,body){
    if(err)console.log(err);
    else{
      console.log("log oK"+body);
    }
  });
}











app.listen(3000,"0.0.0.0", function () {
  console.log('Example app listening on port 3000!')
});