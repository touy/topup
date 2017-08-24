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

//moment.tz.setDefault("Asia/Vientiane");


 console.log(new Date());
 console.log(convertTZ(new Date()));
 console.log(new Date(convertTZ(new Date())));

//console.log(moment.tz.guess());

const requestIp = require('request-ip');

var client_ip="";
app.use(requestIp.mw())
var __master_user={};
var __cur_client={};

function convertTZ(fromTZ){
  return moment.tz(fromTZ,"Asia/Vientiane").format();
}
// Add headers
// var __master_user={
//   "_id": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
//   "_rev": "6-5aa11a075b88da5bd92aa4e5a0306bc9",
//   "username": "souk@TheFriendd",
//   "password": "123456",
//   "usercode": "TheFriendd",
//   "createddate": "2017-08-19T12:16:12.563Z",
//   "gui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
//   "email": "souk@TheFriendd.com",
//   "phone1": "02059918889",
//   "phone2": "",
//   "address": "",
//   "photo": "",
//   "memberlevel": 0,
//   "ispaired": false,
//   "parentgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
//   "isleft": null,
//   "aboveparents": "",
//   "leftside": "",
//   "rightside": "",
//   "packagevalue": 0,
//   "packagename": "",
//   "packagegui": "",
//   "balancevalue": 0,
//   "Lcoupling": 0,
//   "Rcoupling": 0,
//   "couplingbalance": 0,
//   "couplingtotalmoney": 0,
//   "introductorgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
//   "introductorcode": "souk@TheFriendd",
//   "isfreeuser": false,
//   "registeredby": "master",
//   "maxproduct": 100000,
//   "maxpaid": -1
// }
// __master_user.parentgui=__master_user.gui;

// create_db('user').insert(__master_user,__master_user.gui,function(err,res){
//   if(err)
//     console.log("create master failed");
//   else
//     console.log("create master completedly");
// });


app.get('/', function (req, res) {

  res.send("hello");
});
app.get('/initclient',function(req,res){
  client_ip = req.clientIp;
  res.send(get_init_client(client_ip));
});

app.post('/get_balance', function (req, res) {
 get_balance(req.body,res);
});
app.post('/set_balance', function (req, res) {
 set_balance(req.body,res);
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
 res.send(get_userdata(req.body));
});

app.post('/get_package', function (req, res) {
 res.send(get_package(req.body));
});

app.post('/get_package_details', function (req, res) {
 res.send(get_package_details(req.body));
});

app.post('/get_payment_list',function (req,res){
  res.send(get_payment_list(req.body));
});

app.post('/get_user_binary',function (req,res){
  res.send(get_user_binary(req.body));
});

app.post('/get_coupling',function (req,res){
  res.send(get_coupling(req.body));
});

app.post('/get_coupling_score',function (req,res){
  res.send(get_coupling_score(req.body));
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
      updated:new Date(),
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
  "_rev": "2-b7a003863a2437a207507518eee280dd",
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
      "map": "function (doc) {\n  emit([doc.username,doc.email,doc.phone1], doc);\n}"
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
    }
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
      "map": "function (doc) {\n  emit(null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.username,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    }
    ,
    "findByUserGui": {
      "map": "function (doc) {\n  emit(doc.usergui, doc);\n}"
    }
  },
  "language": "javascript"
};



console.log(createTodayRange());
insertTest();
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
    lastaccess:Date(),
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


/**HEARTBEAT */
function heartbeat(client,resp){
  // UPDATE HEARTBEAT
  if(client.logintoken){
    var js =client.data;
    check_authentication(js).then(function(body){
    if(body.user.username==client.data.user.username&&body.user.password==client.data.user.password){

      client.data={};
      client.username=body.user.username;
      client.logintime=Date();
      client.logintoken=uuidV4();
      client.lastaccess=Date();
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
      client.logintime=Date();
      client.logintoken=uuidV4();
      //set_client(client,resp);
      client.lastaccess=Date();
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

init_db('balance',__design_balance);
//init_db("system",__desing_system); 
init_db('user',__design_user);
init_db('package',__design_package);
init_db('packagedetails',__design_package_details);
init_master_user();

function init_master_user(){
    var db=create_db("user");
    console.log("init master");
    r_client.getAsync("__Master").then(function(body){
      //console.log("body: "+body);
      if(!body)
      db.view(__design_view,"findTopUser",function(err,res){
        console.log("res"+JSON.stringify(res.rows[0].value));
        if(err)
          throw new Error(err);
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
function get_balance(user,resp)
{
     var __doc={
      username:"",
      usergui:"",
      gui:"",
      balance:0,
      updated:new Date(),
      diffbalance:0
    };
    //check authorization
    
    //check user exist
    var db=create_db("balance");
    var js={db:db,user:user,resp:resp};
    
    findBalanceByUsername(js).then(function(js){
        console.log('here');  
        js.resp.send(js.body);
    }).catch(function(err){
      js.resp.send(JSON.stringify(err));
    }).done();

}
function findBalanceByUsername(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByUsername",{
      key: js.user.username,
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
};

function set_balance(balance,resp){
  var __doc={
      username:"",
      usergui:"",
      gui:"",
      balance:0,
      updated:new Date(),
      diffbalance:0
    };
    //check authorization
    
    //check user exist

    var db=create_db("balance");
    var js={db:db,balance:balance,resp:resp};
    addBalanceByUser(js).then(function(js){
        console.log('here');  
        js.resp.send(js.body);
    }).catch(function(err){
      js.resp.send(JSON.stringify(err));
    }).done();
}

function addBalanceByUser(js,user){
  var deferred=Q.defer();
  //db=create_db('balance');
  if(!user) user=js.user;
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
        diffbalance:js.balance.diffbalance
      };
      js.db.insert(js.balance,js.balance.gui,function(err,body){
        if (err) {
          deferred.reject(new Error(err));
        } else {
          js.message="inserted ";
          js.body=body;
          var db=create_db("user");
          db.view(__design_view,"findByUsername",{
          key:user.username,
          include_docs:true
          },function(err,res){
            if(err) deferred.reject(err);
            else{
              if(res.rows.length){
                var u=res.rows[0].value;
                u.balancevalue+=b.balance;
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
        balance:s.balance.balance,
        updated:convertTZ(new Date()),
        diffbalance:js.balance.diffbalance
      };      
      js.db.insert(js.balance,js.balance.gui,function(err,body){
        if (err) {
          deferred.reject(new Error(err));
        } else {
          js.message="inserted ";
          js.body=body;
          var db=create_db("user");
          db.view(__design_view,"findByUsername",{
          key:user.username,
          include_docs:true
          },function(err,res){
            if(err) deferred.reject(err);
            else{
              if(res.rows.length){
                var u=res.rows[0].value;
                u.balancevalue+=b.balance;
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

function upgradePackageForAUser(js,package){
  var deferred=Q.defer();

  return deferred.promise;
}


/**REGISTER */
function addNewUser(js,parent,package,introductor,client){
  var deferred=Q.defer();
  js.user.gui=uuidV4();
  js.user.usercode=js.user.username;
  js.user.createddate=new Date();
  js.user.memberlevel=parent.memberlevel+1;
  js.user.parentgui=parent.gui;
  
  
  if(js.user.isleft&&parent.userleftgui==""){
    parent.userleftgui=js.user.gui; // add a new member as the left side
    //parent.leftside.push(user.gui); // push new member as left side range
    user.aboveparents.push(parent.aboveparents); // push parent's parent first
    user.aboveparents.push(parent.username);//push the latest parent at last
  }
  else if(!js.user.isleft&&parent.userrightgui==""){
    parent.userrightgui=js.user.gui; // add a new member as the right side
    //parent.rightside.push(user.gui); // push new member as right side range
    user.aboveparents.push(parent.aboveparents); // push parent's parent first
    user.aboveparents.push(parent.username);//push the latest parent at last
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
                deferred.resolve(js);
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
  var __doc={
    usergui:js.gui,
    username:js.username,
    createddate:new Date(),
    updateddate:new Date(),
    luser:"",
    ruser:"",
    level:parent.memberlevel+1,
    gui:uuidV4()
    };
  var __p={
    usergui:js.gui,
    username:js.username,
    createddate:new Date(),
    updateddate:new Date(),
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
        __p=res.row[0].value;
        p.updateddate=Date();
        if(js.user.isleft){
          if(!p.luser)
            p.luser=js.user.gui;
          else 
            deferred.reject(new Error('left user exist for '+p.usergui));
        }
        else{
          if(!p.ruser)
            p.ruser=js.user.gui;
          else
            deferred.reject(new Error('right user exist for '+p.usergui));
        }
        //p.level++;
        js.db.insert(__p,__p.gui,function(err,res){
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
function register(register,resp){
  var __doc={
    username:"",// show *
    password:"",//show*
    usercode:"",
    createddate:new Date(),//not show
    gui:uuidV4(),//not show
    email:"",//show *
    phone1:"",//show *
    phone2:"",// show
    address:"", //show
    photo:"", //show
    memberlevel:"", // show , current level + 1
    ispaired:false,// not show
    parentgui:"",//as a userid or parentid  as a client GUI or current user gui
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
    couplingtotalmoney:0, // the money collected from couplingsocre
    introductorgui:"",//not show
    introductorcode:"", 
    isfreeuser:true,
    registeredby:"",
    maxproduct:0,
    maxpaid:0
    };
   
    var client=__cur_client;
    var js={db:create_db("user"),client:client,resp:resp,user:register};
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

                js.db=create_db("balance");
                findBalanceByUserGui(js,registra).then(function(body){
                  var registrabalance=body;
                  if(registrabalance.balance!=registra.balancevalue){
                    throw new Error('balance is abnormal please contact admin');
                  }
                  // TODO** IF BALANCE NOT ENOUGH COULD NOT MAKE A REGISTER  ==>OK
                  if(registra.balancevalue<package.packagevalue){
                    throw new Error("Insufficience fund to register a new member");
                  }                  

                  switch(registra.packagevalue){
                    case 1750000:
                      switch (package.packagevalue){
                          case 1750000:{                          
                          /////// Insert a new user
                          
                          //var isfree=false;
                          js.user.gui=uuidV4();
                          js.user.isfreeuser=false;
                          js.user.maxproduct=75;
                          //js.user.isB=parent.isB;
                          js.user.maxpaid=1750000;//// 1750000 daily max payment                          
                          js.user.memberlevel=parent.memberlevel+1;
                          js.user.createddate=convertTZ(new Date());

                          js.db=create_db("user");
                          // add a new user
                          // add new binary tree 
                          
                          addNewUser(js,parent,package,introductor,client).then(function(body){

                            var firstbalance=125000;// 125.000 top-up new user added
                            js.balance={
                              username:js.user.username,
                              usergui:js.user.gui,
                              gui:uuidV4(),
                              balance:0,
                              updated:new Date(),
                              diffbalance:firstbalance
                            };
                            
                            js.balance.balance+=js.balance.diffbalance;
                            //var js={db:create_db('balance'),balance:balance};
                            js.db=create_db('balance');                                                     
                            // add top up value for a new user 125.000 --- OK
                            addBalanceByUser(js,js.user).then(function(body){
                              console.log(body);
                              //// insert  to introductor 250.000 ---OK
                              js.balance={
                                username:introductor.username,
                                usergui:introductor.gui,
                                gui:uuidV4(),
                                balance:0,
                                updated:new Date(),
                                diffbalance:250000
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
                                  updated:new Date(),
                                  diffbalance:107500
                                };
                                js.balance.balance+=js.balance.diffbalance;
                                addBalanceByUser(js,js.topuser).then(function(body){                                                                                                            
                                  //// the rest money===> 1750000- 125000- 250.000- 107500 -100000 =1.167.500
                                  // normally each parent get 100.000 max, but limit by max pay and total parent will get average value 
                                  // by total number of parent.
                                  //js.db=create_db("user");
                                  js.parent=parent;
                                  js.theregistrabalance=1167500;
                                  // get all above parent , 
                                  
                                  var totalparent=0;
                                  js.db=create_db("user");
                                  js.score=100000;
                                ////return score to all parent 100.000 OK
                                addCouplingScore(js,parent).then(function(body){
                                  //********************TODO */
                                  var pArr=body;
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
                                    }
                                     // - under limit of max paid per day
                                    qp.forEach(function(element) {
                                      var db=create_db("balance");
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
                                              sum+=res.rows[i].value.balance;
                                            }
                                            if(sum>qp.maxpaid){ // ignore payment for this transaction
                                              // insert to topuser balance
                                              // update topuser
                                              js.balance={
                                                username:qp.username,
                                                usergui:qp.gui,
                                                gui:uuidV4(),
                                                balance:0,
                                                updated:new Date(),
                                                diffbalance:theRestValue
                                              };
                                              js.db=create_db("balance");
                                              addBalanceByUser(js,js.topuser).then(function(body){
                                                  if(body){
                                                    js.balance={
                                                      username:qp.username,
                                                      usergui:qp.gui,
                                                      gui:uuidV4(),
                                                      balance:0,
                                                      updated:new Date(),
                                                      diffbalance:averageValue
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
                                                          updated:new Date(),
                                                          diffbalance:0
                                                        };
                                                        addBalanceByUser(js,qp).then(function(body){
                                                          if(body){
                                                             // update couplingscore of qp current user
                                                             js.db=create_db("user");
                                                             qp.couplingbalance=0;
                                                             js.db.insert(qp,qp.gui,function(err,res){
                                                              if(err)
                                                                throw new Error(err);
                                                              else
                                                                console.log("update user couplingscore completed");
                                                             });
                                                          }
                                                        });
                                                      }
                                                    });
                                                  }
                                              });                                                                                           
                                              
                                            }
                                            if(sum+averageValue>qp.maxpaid){
                                              var averageValue2=(sum+averageValue)-js.score
                                              // insert to topuser balance
                                              // update topuser
                                              js.balance={
                                                username:qp.username,
                                                usergui:qp.gui,
                                                gui:uuidV4(),
                                                balance:0,
                                                updated:new Date(),
                                                diffbalance:theRestValue
                                              };
                                              js.db=create_db("balance");
                                              addBalanceByUser(js,js.topuser).then(function(body){
                                                  if(body){
                                                    js.balance={
                                                      username:qp.username,
                                                      usergui:qp.gui,
                                                      gui:uuidV4(),
                                                      balance:0,
                                                      updated:new Date(),
                                                      diffbalance:averageValue-averageValue2
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
                                                          updated:new Date(),
                                                          diffbalance:averageValue2
                                                        };
                                                        addBalanceByUser(js,qp).then(function(body){
                                                          if(body){
                                                             // update couplingscore of qp current user
                                                             js.db=create_db("user");
                                                             qp.couplingbalance=0;
                                                             js.db.insert(qp,qp.gui,function(err,res){
                                                              if(err)
                                                                throw new Error(err);
                                                              else
                                                                console.log("update user couplingscore completed");
                                                             });
                                                          }
                                                        });
                                                      }
                                                    });
                                                  }
                                              });
                                              
                                            }
                                            else{
                                              
                                              //var averageValue2=(sum+averageValue)-js.score
                                              // insert to topuser balance
                                              // update topuser
                                              js.balance={
                                                username:qp.username,
                                                usergui:qp.gui,
                                                gui:uuidV4(),
                                                balance:0,
                                                updated:new Date(),
                                                diffbalance:theRestValue
                                              };
                                              js.db=create_db("balance");
                                              addBalanceByUser(js,js.topuser).then(function(body){
                                                  if(body){
                                                  // insert to qp balance
                                                  // update qp
                                                  js.balance={
                                                    username:qp.username,
                                                    usergui:qp.gui,
                                                    gui:uuidV4(),
                                                    balance:0,
                                                    updated:new Date(),
                                                    diffbalance:averageValue
                                                  };
                                                  addBalanceByUser(js,qp).then(function(body){
                                                    if(body){
                                                        // update couplingscore of qp current user
                                                        js.db=create_db("user");
                                                        qp.couplingbalance=0;
                                                        js.db.insert(qp,qp.gui,function(err,res){
                                                        if(err)
                                                          throw new Error(err);
                                                        else
                                                          console.log("update user couplingscore completed");
                                                        });
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
                          
                          // process payment on other processinvoice
                      }
                      case 350000:{
                          // no bonus
                          // 50.000 introduction
                          // 20.000 coupling
                          // 350.000 daily max payment
                          // 25.000 top-up new user added
                          // 75.000 top-up to company
                          // 15 post on online-store

                          // calculate bonus per package and binary, level    
                      
                          // process coupling
                          
                          // process couplingscore
                              
                          // process balance
                          
                          // process payment

                      }
                      case 100000:{
                          // no bonus
                          // 40.000 introduction
                          // 0 coupling
                          // 0 daily max payment
                          // 25.000 top-up new user added
                          // 35.000 top-up to company
                          // 0 post on online-store

                          // calculate bonus per package and binary, level    
                      
                          // process coupling
                          
                          // process couplingscore
                              
                          // process balance
                          
                          // process payment
                          
                      }  
                      }
                      
                      ;
                      case 350000:
                      switch (_all_d.data.package.packagevalue) {
                          case 1750000 :{
                          // no bonus
                          // 200.000 introduction
                          // 100.000 coupling
                          // 1750000 daily max payment
                          // 125.000 top-up new user added
                          // 75.000 top-up to company
                          // 60 post on online-store

                          // calculate bonus per package and binary, level    
                          
                          // process coupling
                              
                          // process couplingscore
                                  
                          // process balance
                              
                          // process payment
                          }
                          case 350000 :{
                          // no bonus
                          // 40.000 introduction
                          // 20.000 coupling
                          // 350.000 daily max payment
                          // 25.000 top-up new user added
                          // 75.000 top-up to company
                          // 15 post on online-store

                              // calculate bonus per package and binary, level    
                          
                              // process coupling
                              
                              // process couplingscore
                                  
                              // process balance
                              
                              // process payment
                          }
                          case 100000:{
                          // no bonus
                          // 40.000 introduction
                          // 0 coupling
                          // 0 daily max payment
                          // 25.000 top-up new user added
                          // 35.000 top-up to company
                          // 0 post on online-store

                          // calculate bonus per package and binary, level    
                          
                          // process coupling
                          
                          // process couplingscore
                              
                          // process balance
                          
                          // process payment
                          }
                      };
                      case 100000:
                      // no bonus
                      // no introduction
                      // no coupling
                      // no daily max payment
                      // top-up new user added
                      // no post on online-store

                      
                      // calculate bonus per package and binary, level    
                      
                      // process coupling
                      
                      // process couplingscore
                          
                      // process balance
                      
                      // process payment
                      ;
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
      key: [js.client.username,js.client.email,js.client.phone1],
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
function findBalanceByUserGui(js,registra){
  //var userCurrentBalance=0;
  var deferred=Q.defer();
  js.db.view(__design_view,"findByGui",{
      key: registra.gui,
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




function get_userdata(user){
  var __doc={
    username:"",// show *
    password:"",//show*
    usercode:"",
    createddate:new Date(),//not show
    gui:uuidV4(),//not show
    email:"",//show *
    phone1:"",//show *
    phone2:"",// show
    address:"", //show
    photo:"", //show
    memberlevel:"", // show , current level + 1
    ispaired:false,// not show
    parentgui:"",//as a userid or parentid  as a client GUI or current user gui
    parentname:"",
    isleft:false, // not show
    userleftgui:"" ,// not show
    userrightgui:"",// not show
    packagevalue:0, //not show
    packagename:"", // not show
    packagegui:"",// not show
    balancevalue:0,// not show
    Lcoupling:0,//not show
    Rcoupling:0,// not show
    couplingbalance:0,// not show
    introductorgui:"",//not show
    introductorcode:"", //not show
    isfreeuser:true
    };
    //check authorization
    //check user exist
    //return user
  return __doc;
}
function get_package(){
  var __doc={
        gui:uuidV4(),
        packagename:"P1",
        packagevalue:"",
        isactive:"",
        createddate:new Date(), 
        relationvalue:"",
        bonusbalance:0, // new member get instantly balance after register
        introductionscore:0, // only the introductor got balance instantly after got a new member
        memberscorebonus:0, // all upline members got score but not yet the balance till coupling happen.
      };
  //check authorization
  //check user exist
  //return user
  return [__doc];
}
function get_package_details(user){
var __doc={
    gui:uuidV4(),
    userui:"",
    packageui:"",
    registerdate:new Date(),
    updateddate:new Date(),
    isactive:true,
    notactivedate:null,
    };
  //check authorization
  //check user exist
  if(user.username=="nou"){
    user.username+=Date();
    return __doc;
  }
  else
    return {user:"ok"};
  //return user
  return __doc;
}
function get_payment_list(user){
  var __doc={
    usergui:"",
    username:"",
    paymentdate:Date(),
    paymentvalue:0,
    paymentby:"",
    paidbygui:"",
    payreason:"",
    description:"",
    gui:uuidV4()
    };
    //check authorization
    //check user exist
    if(user.username=="nou"){
      user.username+=Date();
      return __doc;
    }
    else
      return {user:"ok"};
    //return user
    return __doc;

}
function get_user_binary(user){
  var __doc={
    usergui:"",
    username:"u1",
    createddate:new Date(),
    updateddate:new Date(),
    luser:"",
    ruser:"",
    level:0,
    gui:uuidV4()
    };
    __doc.luser={
    usergui:"",
    username:"u1",
    createddate:new Date(),
    updateddate:new Date(),
    luser:"",
    ruser:"",
    level:0,
    gui:uuidV4()
    };
    __doc.ruser={
    usergui:"",
    username:"u1",
    createddate:new Date(),
    updateddate:new Date(),
    luser:"",
    ruser:"",
    level:0,
    gui:uuidV4()
    };
   //check authorization
    //check user exist
    if(user.username=="nou"){
      user.username+=Date();
      return __doc;
    }
    else
      return {user:"ok"};
    //return user
    return __doc;
}
function binary_tree(usergui){
  var __doc={
    usergui:"",
    username:"u1",
    createddate:new Date(),
    updateddate:new Date(),
    luser:"",
    ruser:"",
    level:0,
    gui:uuidV4()
    };
  //find sub user account
  return __doc;
}

function get_coupling(user){
  var __doc={
    username:"",
    username1:"",
    username2:"",
    level:0,
    couplingdate:Date(),
    couplingvalue:0,
    gui:uuidV4(),
    isacouple:false
    };
    //check authorization
    //check user exist
    if(user.username=="nou"){
      user.username+=Date();
      return __doc;
    }
    else
      return {user:"ok"};
    //return user
    return __doc;
}

function get_coupling_score(js){
  var deferred=Q.defer();
  var __doc={
    usergui:"",
    username:"",
    Lscore:0,
    Rscore:0,
    balance:0,
    createddate:new Date(),
    gui:uuidV4()
    };
    js.db.view(__design_view,"findByUserGui", {
      key:js.user.gui,
      include_docs:true,
      descending:false,
      limit:1,
      skip:0
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
        var p=[];
        p=result.rows[0].value.aboveparents;
        p.push(parent.username);
        var curUser="";        
        p.reverse().forEach(function(element) {
          // loop searching for each parent object and update it
          js.db.view(__design_view,"findByUsername",{
            key: element,
            include_docs: true,
            descending: false,
          },function(err,res){
            if(err) deferred.reject(err);
            else{
              var u=res.rows[0].value;
              var db=create_db("couplingscore");
              // search for balance data of each parent
              db.view(__design_view,"findByUsername",{
                key:u.username,
                include_docs:true,
                descending:false,
                limit:1
              },function(err,res){                
                if(err) deferred.reject(error); 
                else{
                  c=res.rows[0].value;                  
                  if(curUser=="")
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
                    if(err)
                      deferred.reject(err);
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
                          console.log("add coupling score to user completely");
                          deferred.resolve(res);
                          //deferred.resolve(res);
                        }                          
                      });
                      
                    }
                  });
                  curUser=u;
                }
              });
              
              //deferred.resolve(res);
            }
          });
        }, this); 
        //deferred.resolve("above parents has been added scores "+parent.username);
      }       
    });
    return deferred.promise;
}
function updateUserSccoreAndBalance(js,balance){
  var deferred=Q.defer(); 
  //var __doc=c;        
  //var js2=js;
  
  // insert/update balance for current parent
  // update user info

  // insert/update couplingscore for current parent
  
  //find a current user here 
  findByUserGui(js).then(function(body){
    if(body.rows.length){
      js.user=body.rows[0].value;
      js.db=create_db("couplingscore");
      get_coupling_score(js);
      //check max payment per day per package 
      
      body.rows[0].value.couplingtotalmoney=__doc.totalmoney;
      //update user info
      
      js.db.insert(body.rows[0].value,body.rows[0].value.gui,function(e,r){
        if(e) throw new Error("Can't update user:"+JSON.stringify(e));
        else{
          //insert new balance
          var __doc={

          }

          js.db.insert(__doc,__doc.gui,function(err,res){
            if(!err)
              //throw new Error('could not add coupling score');
              deferred.reject(new Error(err));
            else{
              deferred.resolve(res);            
              console.log('inserted coupling completely');            
            }
          });                    
          console.log(r);
        } 
      });
    }
    
  });
  return deferred.promise;
}
function findParentByGui(js){
  var deferred=Q.defer();
  js.db.view(__design_view,"findByUserGui",{
      key: js.parent.gui,
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



















app.listen(3000,"0.0.0.0", function () {
  console.log('Example app listening on port 3000!')
});