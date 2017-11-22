const async = require('async');
const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4');
const nano = require('nano')('http://admin:admin@localhost:5984');
const LTCSERVICE = require('./ltctopup')();
var preUser = require('./pre-users')(10);
//const nano = require('nano')('http://localhost:5984');
const cors = require('cors');
const base64 = require('file-base64');
const fs = require('fs');
var redis = require("redis");
var bluebird = require('bluebird');
const __browser = require('detect-browser');
const _current_picture_path = './_doc_item_/';
r_client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var moment = require('moment-timezone');
//const Promise=require ('promise');
// var Promise = require('nano-promise');
const Q = require('q');
//var Promise = require('bluebird');
//Promise.promisifyAll(nano);
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
const bodyParser = require('body-parser');
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(cors());

var _pp = '/pp';
var _prp = '/prp';
var _ap = '/ap';


//moment.tz.setDefault("Asia/Vientiane");


console.log(new Date());
console.log(convertTZ(new Date()));
console.log(new Date(convertTZ(new Date())));

//console.log(moment.tz.guess());

const requestIp = require('request-ip');

var __login_kw = 'Authen';

var __client_ip = "";
app.use(requestIp.mw());
var __master_user = {};
var __cur_client = {};
var __default_package = {};


function convertTZ(fromTZ) {
  return moment.tz(fromTZ, "Asia/Vientiane").format();
}
// Add headers
__master_user = {
  "_id": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "gui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "username": "souk@TheFriendd",
  "password": "123456",
  "ID": "",
  "fullname": "",
  "birthdate": "",
  "gender": "",
  "address": "",
  "bankaccount": "",
  "bank": "",
  "usercode": "souk@TheFriendd",
  "createddate": "2017-08-19T12:16:12.563Z",
  "gui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "email": "souk@TheFriendd.com",
  "phone1": "02059918889",
  "phone2": "",
  "photo": "",
  "memberlevel": 0,
  "ispaired": false,
  "parentgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "parentname": "souk@TheFriendd",
  "isleft": null,
  "aboveparents": "",
  "leftside": 0,
  "rightside": 0,
  "package1left": 0,
  "package1right": 0,
  "package2left": 0,
  "package2right": 0,
  "package3left": 0,
  "package3right": 0,
  "packagevalue": 0,
  "packagename": "",
  "packagegui": "",
  "balancevalue": 0, //bonus balance
  "mainbalance": 0, // main balance from cash
  "firstbalance": 0,
  "offeredbonus": 0,
  "topupbalance": 0,
  "bonustopupbalance": 0,
  "Lcoupling": 0,
  "Rcoupling": 0,
  "couplingbalance": 0,
  "couplingtotalmoney": 0,
  "sponservalue": 0,
  "introductorgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d",
  "introductorcode": "souk@TheFriendd",
  "isfreeuser": false,
  "registeredby": "master",
  "maxproduct": 100000,
  "maxpaid": 9007199254740992
}
var __balance = {
  username: "",
  usergui: "",
  gui: uuidV4(),
  balance: 0,
  updated: convertTZ(new Date()),
  diffbalance: 0,
  type: "topup first balance"
};
var __client = {
  username: "",
  logintoken: "",
  logintime: null,
  logintimeout: null,
  //clientuid:null,
  registeruid: null,
  confirmregisteruid: null,
  browserinfo: "",
  ip: "",
  other: "",
  lastaccess: null,
  isexist: false,
  clientjs: "",
  fingerprint: "",
  data: {
    user: {},
    balance: {},
    couplingscore: {},
    balance: {},
    package: {},
    packagedetails: {},
    payment: {},
    userbinary: {},
    message: ''
  },
  gui: uuidV4()
}

var __userbinary = {
  "username": "fd0001",
  "usergui": "515b9d4a-8160-45ac-b25a-4686461f06b2",
  "createddate": "2017-11-10T05:02:24.816Z",
  "updateddate": "2017-11-10T05:02:24.816Z",
  "luser": "fd0003",
  "ruser": "fd0004",
  "level": 1,
  "parent": "souk@TheFriendd",
  "index": 1,
  "gui": "4ce4bfed-0338-4ab0-9431-ae5f0e63f787"
}
var __payment = {
  usergui: "",
  username: "",
  paymentdate: convertTZ(new Date()),
  paymentvalue: 0,
  paymentby: "",
  paidbygui: "",
  payreason: "forgot password", // cashing , request confirm, 
  attache: "",
  bankinfo: '',
  targetuser: "",
  status: "approved",
  description: "forgot password fee",
  receiveddate: convertTZ(new Date()), //
  certifieddate: convertTZ(new Date()), //
  approveddate: convertTZ(new Date()), //
  gui: uuidV4()
};
var __package = {
  gui: "4f095522-f461-4a0b-afc4-0ad7cf05c722",
  packagename: "The Best Friend",
  packagevalue: 1750000,
  isactive: true,
  createddate: convertTZ(new Date()),
}
var __packageDetails = {
  gui: uuidV4(),
  userui: "",
  packageui: "",
  registerdate: new Date(),
  updateddate: new Date(),
  isactive: true,
  notactivedate: null,
};
var __couplingScore = {
  usergui: "",
  username: "",
  Lscore: 0,
  Rscore: 0,
  createddate: new Date(),
  gui: uuidV4()
};
var __obj_json = [];
__couplingScore._property_name = 'coupling Score';
__obj_json.push(__couplingScore);
__packageDetails._property_name = 'Package details';
__obj_json.push(__packageDetails);
__package._property_name = 'Package';
__obj_json.push(__package);
__payment._property_name = 'payment'
__obj_json.push(__payment);
__userbinary._property_name = 'user binary';
__obj_json.push(__userbinary);
__client._property_name = 'client';
__obj_json.push(__client);
__obj_json._property_name = 'balance';
__obj_json.push(__balance);
__obj_json._property_name = 'user';
__obj_json.push(__master_user);
// 
__master_user.parentname = __master_user.username;

// create_db('user').insert(__master_user,__master_user.gui,function(err,res){
//   if(err)
//     console.log("create master failed");
//   else
//     console.log("create master completedly");
// });
app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.send("hello");
});

// GET sample data 
app.get('/get_sample', function (req, res) {
  html = displayJson(__obj_json);
  return res.send(html);
});
app.get('/get_routes', function (req, res) {
  var rr = app._router.stack;
  for (var index = 0; index < rr.length; index++) {
    var r = rr[index];
    arr = app._router.stack // registered routes
      .filter(r => r.route) // take out all the middleware
      .map(r => r.route.path); // get all the paths  
  }
  html = displayJson(arr);
  return res.send(html);
});
//GAME
app.get('/game', function (req, res) {
  res.sendfile('random.html');
});

//show tree
app.get('/tree', function (req, res) {
  res.sendfile('tree.html');
});

// CHANGE PASSWORD
app.post('/change_password', function (req, res) {
  //client.data.user
  //client.data.user.password1==client.data.user.password2;
  //client.data.user.oldpassword
  //client.data.user.phone1=client.secret;
  //return client
  // client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  js.client.data.user.phone1 = js.client.data.user.secret;
  delete js.client.data.user.secret;
  change_password(js);
});

function change_password(js) {
  if (js.client.data.user.password1 == js.client.data.user.password2) {
    delete js.client.data.user.password2;
    changePassword(js).then(function (body) {
      var l={
        log: body,
        logdate: convertTZ(new Date()),
        type: "OK change password "+js.client.data.user.username,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = body;
      js.resp.send(js.client);
    }).catch(function (err) {
        var l={
          log: err,
          logdate: convertTZ(new Date()),
          type: "error change password "+js.client.data.user.username,
          gui: uuidV4(),
        }
        logging(l);
        js.client.data.message = err;
        js.resp.send(js.client);      
    });
  } else {
    var l={
      log: "confirm password not match",
      logdate: convertTZ(new Date()),
      type: "error confirm password not match "+js.client.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = 'Confirmed password not match';
    js.resp.send(js.client);
  }

}

function changePassword(js) {
  var deferred = Q.defer();
  var db = create_db('user');
  var username = js.client.data.user.username;
  var phone1 = js.client.data.user.phone1;
  var password = js.client.data.user.oldpassword;
  delete js.client.data.user.oldpassword;
  db.view(__design_view, 'changePassword', {
    key: [username, password, phone1],
    include_docs: true
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      if (res.rows.length) {
        u = res.rows[0].value;
        u.password = js.client.data.user.password1;
        db.insert(u, u._id, function (err, res) {
          if (err) deferred.reject(err);
          else {
            deferred.resolve('OK');
          }
        });
      } else {
        deferred.reject(new Error("User not found"));
      }
    }
  });
  return deferred.promise;
}

// CHANGE DEFAULT USER INFO
app.post('/change_default_user_info', function (req, res) {
  //client.data.user
  //client.data.user.oldusername;  // old username
  //client.data.user.oldphone1; // old phone
  //client.data.user.username;  // old username
  //client.data.user.phone1; // old phone
  //return client
  // client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  changeUserNameAndPhoneNumber(js);
});

function changeUserNameAndPhoneNumber(js) {
  if (js.client.data.user.oldusername && js.client.data.user.oldphone1 && js.client.data.user.username && js.client.data.user.phone1) {
    changeDefaultInfo(js).then(function (body) {
      var l={
        log: body,
        logdate: convertTZ(new Date()),
        type: "OK change username and phone number "+js.client.data.user.username,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = body;
      js.resp.send(js.client);
    }).catch(function (err) {
      if (err) {
        var l={
          log: err,
          logdate: convertTZ(new Date()),
          type: "error change username and phone number "+js.client.data.user.username,
          gui: uuidV4(),
        }
        logging(l);
        js.client.data.message = err;
        js.resp.send(js.client);
      }
    })
  } else {
    var l={
      log: "phone number or username not match",
      logdate: convertTZ(new Date()),
      type: "error change username and phone number "+js.client.data.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = 'Error change username and phone number';
    js.resp.send(js.client);
  }

}

function changeDefaultInfo(js) {
  var deferred = Q.defer();
  var db = create_db('user');
  var username = js.client.data.user.oldusername;
  var phone1 = js.client.data.user.oldphone1;
  db.view(__design_view, 'findUserByUsernameAndPhone1', {
    key: [username, phone1],
    include_docs: true
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      if (res.rows.length) {
        u = res.rows[0].value;
        u.username = js.client.data.user.username;
        u.phone1 = js.client.data.user.phone1;
        findUserByUserName(u).then(function (res) {
          if (res.length)
            deferred.reject('User existed');
          else if (!res.length)
            findMaxPhoneNumber(u).then(function (res) {
              if (res.length > 3) deferred.reject(new Error('this phonenumber has more than 3 in the database'));
              else
                db.insert(u, u._id, function (err, res) {
                  if (err) deferred.reject(err);
                  else {
                    deferred.resolve('OK');
                  }
                });
            });
        });
      } else {
        deferred.reject(new Error("User not found"));
      }
    }
  });
  return deferred.promise;
}

// FORGET PASSWORD
app.post('/forget_password', function (req, res) {
  //client.data.user
  //client.data.user.phone1
  //client.data.user.email
  // return client
  // client.data.message='OK ....' // check SMS on your register phone or check your email
  var js = {};
  js.client = req.body;
  js.resp = res;
  js.client.data.user.phone1 = js.client.data.user.secret;
  delete js.client.data.user.secret;
  forget_password(js);
});
function forget_password(js) {
  viewUser(js.client).then(function (body) {
    var fee = 500;
    if (!body.length) throw new Error('User not found');
    var u = body[0];
    if (u.mainbalance >= fee) {
      u.mainbalance -= fee;
      var b = {
        username: u.username,
        usergui: u.gui,
        gui: uuidV4(),
        balance: 0,
        updated: convertTZ(new Date()),
        diffbalance: -fee,
        type: "forgot password fee"
      };
      updateMainBalance(u, b).then(function (res) {
        updateUser(u).then(function (res) {          
          var p = {
            usergui: __master_user.gui,
            username: __master_user.username,
            paymentdate: convertTZ(new Date()),
            paymentvalue: fee,
            paymentby: u.username,
            paidbygui: u.gui,
            payreason: "forgot password", // cashing , request confirm, 
            attache: "",
            bankinfo: '',
            targetuser: __master_user.username,
            status: "approved",
            description: "forgot password fee",
            receiveddate: convertTZ(new Date()), //
            certifieddate: convertTZ(new Date()), //
            approveddate: convertTZ(new Date()), //
            gui: uuidV4()
          };
          makePayment(p).then(function (res) {
            sendSMSPassword(u.password, u.phone1);
            var l={
              log: "forgot password send password via SMS",
              logdate: convertTZ(new Date()),
              type: "forgot password send SMS "+u.username,
              gui: uuidV4(),
            }
            logging(l);
            js.client.message = 'OK, Password send to your phonenumber please check your register phone number 20' + body.phone1[2] + "xxxx" + body.phone1[6] + body.phone1[7];
            js.client.send(js.client);
          });
        });
      });
    } else {
      throw new Error('need 500 value in main balance');
    }
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error forgot password "+u.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.message = err;
    js.client.send(js.client);
  });
}
function logCenterBalance(res){  
  var l={
    log: res,
    logdate: convertTZ(new Date()),
    type: "log center balance",
    gui: uuidV4(),
  }
  logging(l);
}
function logPhoneBalance(res){
  var l={
    log: res,
    logdate: convertTZ(new Date()),
    type: "log phone balance",
    gui: uuidV4(),
  }
  logging(l);
}
function logSMSResult(res){
  var l={
    log: res,
    logdate: convertTZ(new Date()),
    type: "log SMS result",
    gui: uuidV4(),
  }
  logging(l);
}
function logTelecomError(res){
  var l={
    log: res,
    logdate: convertTZ(new Date()),
    type: "error telecom",
    gui: uuidV4(),
  }
  logging(l);
}
function logTelecomTopup(res){
  var l={
    log: res,
    logdate: convertTZ(new Date()),
    type: "log telecom topup",
    gui: uuidV4(),
  }
  logging(l);
}

function sendSMSPassword(pass, phone) {
  if (phone.length < 8)
    throw new Error('number is not 8 digit and start with 020');
  if (phone.slice(1, phone.length).indexOf('205') == 0) {
    ltc.checkBalanceCenterLTC().then(logCenterBalance).catch(logTelecomError);
    ltc.checkBalanceLTC(phone).then(logPhoneBalance).catch(logTelecomError);
    ltc.sendSMSLTC(phone, 'your password is: ' + pass, '').then(logSMSResult).catch(logTelecomError);
    ltc.checkBalanceLTC(phone).then(logPhoneBalance).catch(logTelecomError);
  }
  else if (phone.slice(1, phone.length).indexOf('209') == 0) {

  }
  else if (phone.slice(1, phone.length).indexOf('207') == 0) {

  }
  else if (phone.slice(1, phone.length).indexOf('202') == 0) {

  }
  else{
    throw new Error('system could not handle this number '+phone);
  }
}

function sendEmailPassword(pass, email) {

}

//RESET bonus topup monthly.
// NEED TO PROPERLY QUERY ERROR FROM DATABASE
app.get('/show_error', function (req, res) {
  res.send(displayJson(error_log));
});
// NEED TO DELETE THIS AFTER BETA
app.get('/clean_user_and_binary', function (req, res) {
  //var db=create_db('user'); 
  nano.db.destroy('user', function (err, body) {
    //db=create_db('userbinary');
    nano.db.destroy('userbinary', function (err, body) {});
  });
});
app.get('/init_default_users', function (req, res) {
  var js = {};
  js.client = req.body;
  js.resp = res;
  restoreBackupFile('d20171115015037.js');
  init_default_users();
});
var members = {};
members.member = [];
members.binarytree = [];
var error_log = [];
var mbin = [];
var mm = [];

function loadMemberBinaryDB() {
  var deferred = Q.defer();
  var db = create_db('userbinary');
  db.view(__design_view, 'findAll', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          var element = res.rows[index].value;
          //delete element._rev;
          //delete element._id;
          arr.push(element);
        }
        if (!members.binarytree.length)
          members.binarytree = arr;
      }
      db = create_db('user');
      db.view(__design_view, 'findAll', {}, function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < res.rows.length; index++) {
              var element = res.rows[index].value;
              //delete element._rev;
              //delete element._id;
              arr.push(element);
            }
            if (!members.member.length)
              members.member = arr;
            deferred.resolve('ok');
          }
        }
      });
    }
  });
  return deferred.promise;
}

function init_default_users() {
  loadMemberBinaryDB().then(function (res) {
    for (var index = 0; index < members.member.length; index++) {
      delete members.member[index]._rev;
    }
    for (var index = 0; index < members.binarytree.length; index++) {
      delete members.binarytree[index]._rev;
    }
    addBulkUser({
      docs: members.member
    }).then(function (res) {
      console.log(res);
    }).catch(function (err) {
      error_log.push(err);
    });
    addBulkUserBinary({
      docs: members.binarytree
    }).then(function (res) {
      console.log(res);
    }).catch(function (err) {
      error_log.push(err);
    });
  }).catch(function (err) {
    error_log.push(err);
  });
}

function restoreBackupFile(bakfile) {
  var fs = require('fs');
  filename = bakfile;
  if (filename)
    fs.readFile('backup/' + filename, 'utf8', function (err, data) {
      if (err) throw err; // we'll not consider error handling for now        
      members = JSON.parse(data);
    });
}


function addBulkUserBinary(userbin) {
  var deferred = Q.defer();
  var db = create_db('userbinary');
  db.bulk(userbin, {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function addBulkUser(user) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.bulk(user, {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function addUserBinary(userbin) {
  var deferred = Q.defer();
  var db = create_db('userbinary');
  db.insert(userbin, userbin.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function addUser(user) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.insert(user, user.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}


// INIT CLIENT GET CIENT GUI
app.get('/init_client', function (req, res) { // GET new GUI
  //return client
  // client.data.message='OK';
  client_ip = req.clientIp;
  __client_ip = client_ip
  if (__cur_client.clientuid != req.body.clientuid)
    res.send(get_init_client(client_ip));
  else
    res.send(get_init_client(client_ip)); // TESTING ONLY
});

function get_init_client(client_ip) {
  var c = {
    username: "",
    logintoken: "",
    logintime: null,
    logintimeout: null,
    clientuid: uuidV4(),
    registeruid: uuidV4(),
    confirmregisteruid: uuidV4(),
    browserinfo: __browser,
    ip: client_ip,
    other: "",
    lastaccess: convertTZ(new Date()),
    isexist: false,
    clientjs: "",
    fingerprint: "",
    data: ""
  };
  c.data = {};
  c.data.message = 'OK';
  __cur_client = c;
  return c;
}

//LOGIN
app.post('/login', function (req, res) { //client.data.user
  //client.data.user.username
  //client.data.user.password
  //return client
  // client.data.message='OK';
  console.log("LOGIN ");
  //var client=req.body;
  var js = {};
  js.client = req.body;
  js.resp = res;
  login(js);
});

function check_authentication(js) {
  var deferred = Q.defer();
  var db = create_db("user");
  //console.log(js);
  db.view(__design_view, "authentication", {
    key: [js.user.username, js.user.password],
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      if (!res.rows.length) {
        deferred.resolve({
          user: {
            username: null,
            password: null
          }
        });
        //TEST when no record yet
        //deferred.resolve({username:"nou",password:"123456"});
      } else {
        deferred.resolve(res.rows[0].value);
      }
    }
  });
  return deferred.promise;
}

function set_client(js) {
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
    client.data.message:"ERROR, OK, GOOD, SUCCESS";
  */
  var keyword = __login_kw;
  console.log("client.clientuid" + js.client.clientuid)

  if (js.client.clientuid == "" || js.client.logintoken == "") {
    js.client.clientuid = "";
    keyword = "NOBODY";
    throw new Error("Client not init, please check");
  }
  r_client.getAsync(keyword + ' ' + js.client.clientuid + ' ' + js.client.logintoken).then(function (res) {
    //console.log("res"+JSON.stringify(res));
    if (res) {
      r_client.del(keyword + ' ' + js.client.clientuid + ' ' + js.client.logintoken);
      js.client.clientuid = uuidV4();
      //client.logintoken=uuidV4();
    }
    delete js.client.data;
    js.client.data = {};
    //js.client.clientuid=uuidV4();
    js.client.logintoken = uuidV4();
    r_client.setAsync(keyword + ' ' + js.client.clientuid + ' ' + js.client.logintoken, JSON.stringify(js.client), 'EX', 15 * 60).then(function (res) {
      if (js.resp && res) {
        __cur_client = js.client;
        var l={
          log: "login completed",
          logdate: convertTZ(new Date()),
          type: "log in completed "+js.client.user.username+" password:"+js.client.data.user.password,
          gui: uuidV4(),
        }
        logging(l);
        js.client.data.message = 'OK';
        js.resp.send(js.client);
      }
    });
  });

}

function login(js) {
  console.log("HI LOGIN");
  //var js=client.data;
  //console.log(js.client.data);
  check_authentication(js.client.data).then(function (body) {
    // console.log("body:"+JSON.stringify(body));
    // console.log("client.data:"+JSON.stringify(client.data));
    // console.log(body);
    // encrypt password and compare here 
    if (body.username == js.client.data.user.username && body.password == js.client.data.user.password) {
      js.client.data = {};
      js.client.username = body.username;
      js.client.logintime = convertTZ(new Date());
      js.client.logintoken = uuidV4();
      js.client.isexist = true;
      //set_client(client,resp);
      js.client.lastaccess = convertTZ(new Date());
      set_client(js);
      //js.resp.send(js.client);
    } else {
      js.client.username = "";
      js.client.logintime = "";
      js.client.logintoken = "";
      js.client.data = {};
      js.client.lastaccess = convertTZ(new Date());
      //set_client(js);
      var l={
        log: "login failed",
        logdate: convertTZ(new Date()),
        type: "login failed "+js.client.user.username+" password:"+js.client.data.user.password,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = "NO this Username and password";
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error log in  "+js.client.user.username+" password:"+js.client.data.user.password,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}
//LOG OUT
app.post('/logout', function (req, res) { //client
  //return client
  // client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  logout(js);
});

function logout(js) {
  var keyword = __login_kw;
  r_client.getAsync(keyword + ' ' + js.client.clientuid + ' ' + js.client.logintoken).then(function (res) {
    //console.log("res"+JSON.stringify(res));
    if (res) {
      r_client.del(keyword + ' ' + js.client.clientuid + ' ' + js.client.logintoken, function (err, res) {
        js.client.logintoken = "";
        js.client.logintime = "";
        js.client.username = "";
        js.client.data = {};
        js.client.data.message = 'OK';
        __cur_client = js.client;
        var l={
          log: "log out completed",
          logdate: convertTZ(new Date()),
          type: "log out "+js.client.user.username+" password:"+js.client.data.user.password,
          gui: uuidV4(),
        }
        logging(l);
        js.resp.send(js.client);
      });
    }
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error log out "+js.client.user.username+" password:"+js.client.data.user.password,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);;
  });
}
// HEART BEAT intervaly sync between client server , SOCKET
app.post('/heartbeat', function (req, res) { //client
  // return client
  // client.data.message='OK';
  var js = {};
  js.client = req;
  js.resp = res;
  heartbeat(js);
});

function heartbeat(js) {
  // UPDATE HEARTBEAT
  var keyword = __login_kw
  if (js.client.logintoken == __cur_client.logintoken) {

    r_client.getAsync(keyword + ' ' + js.client.clientuid + ' ' + js.client.logintoken).then(function (body) {
      if (body.user.username == __cur_client.username) {

        js.client.data = {};
        js.client.username = body.user.username;
        //js.client.logintime=convertTZ(new Date());
        //js.client.logintoken=uuidV4();
        js.client.lastaccess = convertTZ(new Date());
        //set_client(client,resp);
        set_client(js);
        //js.resp.send(js.client);
      } else {
        js.client.data = {};
        js.client.data.message = "NO this Username and password";
        js.resp.send(js.client);
      }
    }).catch(function (err) {
      var l={
        log: err,
        logdate: convertTZ(new Date()),
        type: "error heart beat "+js.client.user.username+" password:"+js.client.data.user.password,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = err;
      js.resp.send(js.client);
    });
  }
}

// GET USER DATA FOR EDITING
app.post('/get_userdata', function (req, res) { //client
  //client
  //return client
  //client.data.user
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  showUserInfo(js, true);
});
// show user data for view only
app.post('/show_userdata', function (req, res) { //client
  //client
  //return client
  //client.data.user
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  showUserInfo(js, false);
});

function showUserInfo(js, isedit) {
  var user = {
    username: js.client.username
  };
  viewUser(user).then(function (body) {
    if (!body.length) throw new Error('User not found');
    if (body.length) {
      body = body[0];
      js.client.data.message = 'OK';
      js.client.data.user = body;
      js.client.data.user.password = "";
      if (!isedit)
        js.client.data.user._rev = '';
      if(isedit){
          var l={
          log: "get user data "+isedit,
          logdate: convertTZ(new Date()),
          type: "get user data "+js.client.user.username,
          gui: uuidV4(),
        }
        logging(l);
      }
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error get user data  "+js.client.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function viewUser(user) {
  var deferred = Q.defer();
  db = create_db("user");
  db.view(__design_view, "findByUserName", {
      key: user.username
    },
    function (err, res) {
      if (err) {
        deferred.reject(err);
      } else {
        var arr = [];
        if (res.rows.length) {
          arr.push(res.rows[0].value);
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}
// UPDATE CURRENT USER INFO
app.post('/update_userdata', function (req, res) {
  //client
  // client.data.user // client.data.user._rev
  // "ID": "",
  // "fullname": "",
  // "birthdate": "",
  // "gender": "",
  // "address": "",
  // "bankaccount": "",
  // "bank": "",  
  // "email": "souk@TheFriendd.com",  
  // "phone2": "",
  // "photo": "", // UPLOAD TO SERVER FIRST THEN GET THE LINK AND INSERT HERE
  //return client
  //client.data.message='OK ...'
  var js = {};
  js.client = req.body;
  js.resp = res;
  editUser(js);
});

function editUser(js) {
  viewUser(js.client.data.user).then(function (res) {
    if (!res.length) throw new Error('User not found');
    var u = res[0];
    var ju = js.client.data.user;
    u.ID = ju.ID;
    u.fullname = ju.fullname;
    u.birthdate = ju.birthdate;
    u.gender = ju.gender;
    u.address = ju.address;
    u.bankaccount = ju.bankaccount;
    u.bank = ju.bank;
    u.email = ju.email;
    u.phone2 = ju.phone2;
    u.photo = ju.photo;
    updateUser(u).then(function (res) {
      var l={
        log: "update user data",
        logdate: convertTZ(new Date()),
        type: "update user data "+js.client.user.username,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = 'OK';
      js.resp.send(js.client);
    });
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error update user data"+js.client.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function updateUser(user) {
  var deferred = Q.defer();
  db = create_db("user");
  db.insert(user, user.gui, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve('OK');
    }
  });
  return deferred.promise;
}
// GET CURRENT USER INFO TO CHECK IF IT'S HAS BEEN LOGGING IN 
// THIS IS FOR TESTING
app.post('/get_current_user', function (req, res) {
  res.send(__cur_client);
});
// CHECK MAX PHONE ALLOW FOR REGISTRATION
app.post('/check_register_max_phone', function (req, res) {
  //client
  //client.data.user.phone1
  //return client
  // client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkRegisterMaxphone(js);
});

function checkRegisterMaxphone(js) {
  findMaxPhoneNumber(js.client.data.user).then(function (body) {
    if (body.length > 3) {
      js.client.data.message = ", could not use this phone number";
    } else {
      js.client.data.message = "OK";
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error check max phone "+js.client.user.phone1,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

// CHECK AVAILABLE USER NAME
app.post('/check_register_available_username', function (req, res) {
  //js.client.data.user.username
  //return client
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkRegisterAvailableUser(js);
});

function checkRegisterAvailableUser(js) { // client.data.user.username
  var user = js.client.data.user;
  findUserByUserName(user).then(function (body) {
    if (body.length > 0) {
      var l={
        log: "user name is existed",
        logdate: convertTZ(new Date()),
        type: "user name is existed "+js.client.user.username,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = "exist user";
      js.resp.send(js.client);
    } else{
      js.client.data.message = "OK";
      js.resp.send(js.client);
    }
      
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error check available user for register "+js.client.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

//show PACKAGE , PACKAGE COULD NOT BE EDITED
app.post('/get_package', function (req, res) { //
  //CLIENT
  // return client
  // client.data.package 
  // client.data.message='OK'
  var js = {};
  js.resp = res;
  showPackages(js);
});

function showPackages(js) {
  if (__default_package) {
    js.resp.send(__default_package);
  } else {
    js.db = create_db('package')
    getPackage().then(function (body) {
      if (body) {
        js.client.data.package = body;
        js.client.data.message = 'OK';
        js.resp.send(js.client);
      }
    }).catch(function (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    });
  }


}

function getPackage() {
  var deferred = Q.defer();
  var db = create_db('package');
  db.view(__design_view, "findAll", {
    include_docs: true,
  }, function (err, res) {
    if (err)
      deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}
// SHOW PACKAGE REGISTERED BY USER, User can have more than 1 package because they 
// can upgrade from copper to silver and to gold
app.post('/get_package_details', function (req, res) {
  //client
  //return client
  // client.data.package=[]
  // client.data.message ='OK';
  var js = {};
  js.user = req.body;
  js.resp = res;
  showPackageDetailsByUser(js);
});

function showPackageDetailsByUser(js) {
  getPackageDetailsByUser(js.client.data.user).then(function (body) {
    if (body) {
      js.client.data.package = body;
      js.client.data.message = 'OK'
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error show package details"+js.client.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function getPackageDetailsByUser(user) {
  var deferred = Q.defer();
  var db = create_db('packagedetails');
  db.view(__design_view, "findByUsername", {
    key: user.username,
    include_docs: true,
    descending: true
  }, function (err, res) {
    if (err)
      deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}


// show Member list by current user
app.post('/get_member_list_by_parent_name', function (req, res) {
  //client.data.user.username
  // return client
  // client.data.user=[]
  // client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res
  showMemberListByParent(js);
});

function showMemberListByParent(js) {
  viewUser(js.client.data.user).then(function (res) {
    //var indexes=findIndexOfMembers(res.index,19-res.memberlevel);// max member should be within 20  , 2^19;
    if (!res.length) throw new Error('User not found');
    res = res[0];
    getMemberListByParent(res.username,js.client.data.page,js.client.data.maxpage).then(
      function (res) {
        getMemberCount(res).then(function(count){
          js.client.data.user = {arr:res,count:count};
          js.client.data.message = 'OK';
          js.resp.send(js.client);
        });
    });
  }).catch(function (err) {
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type: "error show member list by parent"+js.client.user.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getMemberListByParent(username,page,maxpage) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.view(__design_view, 'findMembersByUsername', {
    key: username,
    include_docs: true,
    decending: true,
    skip:page,
    limit:maxpage
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          var element = res.rows[index].value;
          arr.push({
            username: element.username,
            index: element.index
          });
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

//Show user binary data 
app.post('/get_user_binary_tree', function (req, res) {
  //client.data.user.username
  // return client
  // client.data.userbinary=[]
  // client.data.user=[];
  // client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res
  showUserBinaryTree(js);
});

function findIndexOfMembers(x, maxlevel) {
  var arr = [];
  arr.push(x);
  for (var index = 1; index < maxlevel; index++) {
    if (index > 1)
      x = x * 2 + 1;
    for (var i = 0; i < Math.pow(2, index); i++) {
      arr.push(2 * x + 1 + i);
    }
  }
  return arr;
}

function showUserBinaryTree(js) {
  var db = create_db('userbinary');
  checkYourMember(js.client.data.user.username).then(function (res) {
    if (!res) {
      js.client.data.message = 'User not found';
      js.resp.send(js.client);
      return;
    }

    db.view(__design_view, 'findByUsername', {
      key: js.client.data.user.username
    }, function (err, res) {
      if (err) {
        js.client.data.message = err;
        js.resp.send(js.client);
      } else {
        if (res.rows.length) {
          var u = res.rows[0].value;
          var indexes = findIndexOfMembers(u.index, js.client.data.user.memberlevel);
          indexes = findAvailableIndexes(indexes);
          getUserBinaryByUser(indexes, js.client.data.user.memberlevel).then(function (body) {
            if (body) {
              js.client.data.userbinary = body;
              getUserInfoListByUser(indexes).then(function (body) {
                js.client.data.user = body;
                js.client.data.message = 'OK';
                js.resp.send(js.client);
              }).catch(function (err) {
                error_log.push(err);
              });
            }
          }).catch(function (err) {
            console.log(err);
            js.client.data.message = err;
            js.resp.send(js.client);
          });
        }
      }
    });
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();

}
// WHEN RETISTER NEED TO record AVAILABLE INDEX
var __available_indexes = [];

function findAvailableIndexes(indexes) {
  var arr = [];
  for (var index = 0; index < indexes.length; index++) {
    var element = indexes[index];
    if (__available_indexes.indexOf(element) > -1)
      arr.push(element);
  }
  if (__available_indexes.length == 0)
    return indexes; // THIS IS FOR TESTING
  return arr;
}

function getUserInfoListByUser(indexes) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.view(__design_view, 'findMembersByIndexes', {
      keys: indexes,
      include_docs: true,
    },
    function (err, res) {
      if (err)
        deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            var element = res.rows[index].value;
            e = {
              usergui: element.gui,
              username: element.username,
              introductorcode: element.introductorcode,
              packagename: element.packagename,
              packagevalue: element.packagevalue,
              packagegui: element.packageui,
              createddate: element.createddate,
              updateddate: element.updateddate,
              Lcoupling: element.Lcoupling,
              Rcoupling: element.Rcoupling,
              leftside: element.leftside,
              rightside: element.rightside,
              memberlevel: element.memberlevel,
              parentname: element.parentname,
            };
            arr.push(e);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function getUserBinaryMembers(indexes) {
  var deferred = Q.defer();
  var db = create_db('userbinary');
  db.view(__design_view, "findMembersByIndexes", {
      keys: indexes,
      include_docs: true,
    },
    function (err, res) {
      if (err)
        deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            var element = res.rows[index].value;
            e = { // for current user
              usergui: element.usergui,
              username: element.username,
              createddate: element.createddate,
              updateddate: element.updateddate,
              luser: element.luser,
              ruser: element.ruser,
              level: element.level,
              index: element.index,
              gui: element.gui
            };
            arr.push(e);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function getIndexes(n, level) {
  var arr = [];
  for (var index = 1; index < level; index++) {
    if (index > 1)
      n = n * 2 + 1;
    for (var i = 0; i < Math.pow(2, index); i++) {
      arr.push(2 * n + 1 + i);
    }
  }
  return arr;
}

function getUserBinaryByUser(indexes, needlevel) {
  var deferred = Q.defer();
  var db = create_db('userbinary');
  db.view(__design_view, "findMembersByIndexes", {
      keys: indexes,
      include_docs: true
    },
    function (err, res) {
      if (err)
        deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            var element = res.rows[index].value;
            e = { // for current user
              //usergui: element.usergui,
              //username: element.username,
              //createddate: element.createddate,
              //updateddate: element.updateddate,
              //luser: element.luser,
              //ruser: element.ruser,
              //level: element.level,
              index: element.index,
              //gui: element.gui
            };
            arr.push(e);
          }
          var indexes = [];
          indexes.push(arr[0].index);
          indexes = indexes.concat(getIndexes(arr[0].index, needlevel));
          getUserBinaryMembers(indexes).then(function (res) {
            deferred.resolve(res);
          }).catch(function (err) {
            deferred.reject(err);
          }).done();
        }
      }
    });
  return deferred.promise;
}

// show current user topup balance list
app.post('/get_topup_balance_by_user', function (req, res) {
  //client
  //client.username, client.data.maxpage , clieng.data.page
  //return client
  //client.data.balance // balance.balance , balance.count
  //client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  showTopupBalanceByUser(js);
});

function getCountBalanceByUser(user) {
  var deferred = Q.defer();
  var db = create_db('topupbalance');
  db.view(__design_view, "findCountByUsername", {
    key: js.client.username
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function showTopupBalanceByUser(js) {
  var db = create_db("topupbalance");
  getCountBalanceByUser(js.client.username).then(function (body) {
    var count = body[0];
    db.view(__design_view, "findByUsername", {
      key: js.client.username,
      descending: true,
      limit: js.client.data.maxpage,
      skip: js.client.data.page
    }, function (err, res) {
      if (err) {
        js.client.data.message = err;
        js.resp.send(js.client);;
      } else {
        var arr = [];
        if (res.rows.length) {
          for (i = 0; l = res.rows.length, i < l; i++) {
            arr.push(res.rows[i].value);
          }
        }
        js.client.data.balance = {
          arr: arr,
          count: count
        };
        js.client.data.message = "OK";
        js.resp.send(js.client);
      }
    });
  }).catch(function (err) {

  }).done();

}

// show current user main balance list
app.post('/show_main_balance_by_user', function (req, res) {
  //client
  //return client
  // client.data.balance
  ///client.data.maxpage // client.data.page
  //client.data.message='OK'
  //client.data.balance // balance.balance , balance.count
  //client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  showMainBalanceByUser(js);
});

function showMainBalanceByUser(js) {
  getCountMainBalanceByUser(js.client).then(function (res) {
    var count = res.rows[0].value;
    getMainBalanceByUser(js.client).then(function (res) {
      deferred.resolve({
        arr: res,
        count: count
      });
    });
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

// check current user main balance
app.post('/check_main_balance_by_user', function (req, res) {
  //client
  //return client
  // client.data.balance
  //client.data.message='OK'
  //client.data.balance // balance.balance , balance.count
  //client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkMainBalanceByUser(js);
});

function getCountMainBalanceByUser(user) {
  var deferred = Q.defer();
  var db = create_db("mainbalance");
  db.view(__design_view, "findCountByUsername", {
    key: user.username
  }, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      if (res.rows.length) {
        var count = res.rows[0].value;
        deferred.resolve(count);
      }
    }
  });
  return deferred.promise;
}

function getMainBalanceByUser(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db("mainbalance");
  db.view(__design_view, "findByUsername", {
    key: user.username,
    descending: true,
    skip: page,
    limit: maxpage
  }, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          var element = res.rows[index].value;
          arr.push(element);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function checkMainBalanceByUser(js) {
  js.client.data.page = 0;
  js.client.data.maxpage = 1;
  getCountMainBalanceByUser(js.client).then(function (res) {
    var count = res.rows[0].value;
    getMainBalanceByUser(js.client).then(function (res) {
      deferred.resolve({
        arr: res,
        count: count
      });
    });
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

//UPGRADE USER PACKAGE
app.post('/upgrade', function (req, res) {
  //client.data.user 
  //client.data.package
  //return client
  // client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  upgradePackage(js);
});

function checkPackage(p){
  for (var index = 0; index < __default_package.length; index++) {
    var element = __default_package[index];
    if(element.packagename==p.packagename&&element.gui==p.gui&&element.packagevalue==p.packagevalue){
      return element;
    }
  }
  return null;
}
function updatePackageDetails(user, package) {
  var deferred = Q.defer();
  var db = create_db("packagedetails");
  db.view(__design_view, "findActiveByUserName", {
    key: user.username,
    descending: true
  }, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      if (res.rows.length) {
        var d = res.rows[0].value;        
        if(!checkPackage(package)) deferred.reject('Error Package is not correct');
        if(d.packagevalue>=package.packagevalue) deferred.reject('Upgrade to higher package');
        var __doc = {
          gui: uuidV4(),
          userui: user.username,
          packageui: package.gui,
          registerdate: convertTZ(new Date()),
          updateddate: convertTZ(new Date()),
          isactive: true,
          notactivedate: null,
        };
        d.updateddate = convertTZ(new Date());
        d.notactivedate = convertTZ(new Date());
        d.isactive = false;
        db.insert(d, d.gui, function (err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            db.insert(__doc, __doc.gui, function (err, res) {
              if (err) {
                deferred.reject(err);
              } else {
                u.packagevalue = package.packagevalue;
                u.packagegui = package.gui;
                u.packagename = package.packagename;
                updateUser(u).then(function (body) {
                  if (body) {
                    deferred.resolve("OK");
                  }
                }).catch(function (err) {
                  deferred.reject(err);
                });
              }
            });
          }
        });

      } else {
        var __doc = {
          gui: uuidV4(),
          userui: user.username,
          packageui: package.gui,
          registerdate: convertTZ(new Date()),
          updateddate: convertTZ(new Date()),
          isactive: true,
          notactivedate: null,
        };
        db.insert(__doc, __doc.gui, function (err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve('OK');
          }
        });
      }
    }
  });
  return deferred.promise;
}

function upgradePackage(js) {
  viewUser(js.client.data.user).then(function (res) {
    if (!res.length) throw new Error('User not found');
    if (res.length) {
      res = res[0];
      updatePackageDetails(res,js.client.data.package).then(function (res) {
        var l={
          log: "upgraded completely",
          logdate: convertTZ(new Date()),
          type: "upgrade package "+js.client.data.user.username,
          gui: uuidV4(),
        }
        logging(l);
        js.client.data.message ="OK upgraded completely";
        js.resp.send(js.client);
      });
    }
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

// PAY FIRST BALANCE
app.post('/pay_first_balance', function (req, res) { 
  //client
  //return client
  // client.message='OK'; 
  var js = {};
  js.client = req.body;
  js.resp = res;
  payFirstBalance(js);
});
// function getTopUpBalanceByUser(user){
//   var deferred=Q.deferr();
//   db=create_db('topupBalance');
//   db.view(__design_view,'findByUsername',
//   {key:user.username,decending:true,limit:1},
//   function(err,res){
//     if(err)
//       deferred.reject(err);
//     else{
//       if(res.rows.length){
//         t=res.rows[0].value
//         deferred.resolve(t);
//       }
//       else
//         deferred.reject(new Error('No record'));
//     }
//   });
//   return deferred.promise;
// }
function payFirstBalance(js) {
  viewUser(js.client).then(function(res){
    if(res.length){
      var u=res[0];
      js.client.data.user = u;
      js.client.data.topupbalance = {
        username: u.username,
        usergui: u.gui,
        gui: uuidV4(),
        balance: 0,
        updated: convertTZ(new Date()),
        diffbalance: u.firstbalance,
        type: "topup first balance"
      };
      updateTopupBalance(js).then(function (body) {
        u.firstbalance = 0;
        updateUser(u).then(function(res){
          connectOperator(u.phone1, u.firstbalance).then(function(res){
            logTelecomTopup(res).then(function(res){
              var l={
                log: res,
                logdate: convertTZ(new Date()),
                type:"topup "+ u.phone1,
                gui: uuidV4(),
              }
              logging(l);
              var p = {
                usergui: u.gui,
                username: u.username,
                paymentdate: convertTZ(new Date()),
                paymentvalue: u.firstbalance,
                paymentby: u.username,
                paidbygui: u.gui,
                payreason: "topup first balance", 
                attache: "",
                bankinfo: '',
                targetuser: u.username,
                status: "approved",
                description: "",
                receiveddate: convertTZ(new Date()), //
                certifieddate: convertTZ(new Date()), //
                approveddate: convertTZ(new Date()), //
                gui: uuidV4()
              };              
              makePayment(p).then(function(res){                
                js.client.data.message = "OK Pay first balance completely ";
                js.resp.send(js.client);
              });  
            });                          
          }).catch(function(err){
            logTelecomError(err);                  
            db = create_db('topupfailure');
            var f = {
              gui: uuidV4(),
              username: u.username,
              usergui: u.gui,
              phone: js.client.data.topup.phone,
              value: t.balance,
              createddate: convertTZ(new Date()),
              lastretry: convertTZ(new Date()),
              failedreason: 'operator failed, ' + JSON.stringify(err),
              redo: 0,
              status: 'failed' // retry , ok,  
            };
            db.insert(f, f.gui, function (err, res) {
              if (err) {
                var l={
                  log: err,
                  logdate: convertTZ(new Date()),
                  type:"error topup  "+ js.client.username,
                  gui: uuidV4(),
                }
                logging(l);
                js.client.data.message = err;
                js.resp.send(js.client);
              } else {
                js.client.data.message = 'updated top up failed and put to the queue';
                js.resp.send(js.client);
              }
            });
          
          }); 
        });        
      });
    } else {
      var l={
        log:  'username not found!',
        logdate: convertTZ(new Date()),
        type:"error topup "+ u.phone1,
        gui: uuidV4(),
      }
      logging(l);
      js.client.data.message = 'username not found!';
      js.resp.send(js.client);
    }
  }).catch(function(err){
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error pay firstbalance "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l);
    js.client.data.message=err;
    js.resp.send(js.client);
  });     
}
function updateTopupBalance(js) {
  var deferred = Q.defer();
  var db = create_db("topupbalance");
  db.view(__design_view, "findByUsername", {
    key: js.client.data.user.username,
    descending: true,
    limit: 1
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var top = {}
      if (!res.rows.length) //if = null
        top = {
          username: js.client.data.user.username,
          usergui: js.client.data.user.gui,
          gui: uuidV4(),
          balance: 0,
          updated: convertTZ(new Date()),
          diffbalance: js.client.data.topupbalance.diffbalance,
          type: "topup"
        };
      else {
        top.balance += js.client.data.topupbalance.diffbalance;
        top.diffbalance = js.client.data.topupbalance.diffbalance;
        delete top._rev;
        delete top._id;
        top.gui=uuidV4();
        top.updated=convertTZ(new Date());
        type='topup';
      }
      db.insert(top, top.gui, function (err, res) {
        if (err) deferred.reject(err);
        else {
          deferred.resolve(res);
        }
      });

    }
  });
  return deferred.promise;
}
// PAY OFFER 
app.post('/pay_offer', function (req, res) { 
  //client
  // return client 
  // client.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  payOffer(js);
});

function payOffer(js) {
  var db = create_db('user');
  viewUser(js.client).then(function(res){  
    if(res.length){
      var u = res[0];
      js.client.data.user = u;
      js.client.data.topupbalance = {
        username: u.username,
        usergui: u.gui,
        gui: uuidV4(),
        balance: 0,
        updated: convertTZ(new Date()),
        diffbalance: u.offeredbonus,
        type: "topup offered bonus"
      };
      updateTopupBalance(js).then(function (body) {
        u.offeredbonus = 0;
        updateUser(u).then(function(res){
          connectOperator(u.phone1, u.offeredbonus).then(function(res){
            logTelecomTopup(res).then(function(res){
              var l={
                log: res,
                logdate: convertTZ(new Date()),
                type:"topup "+ u.phone1,
                gui: uuidV4(),
              }
              logging(l);    
              var p = {
                usergui: __master_user.gui,
                username: __master_user.username,
                paymentdate: convertTZ(new Date()),
                paymentvalue: u.offeredbonus,
                paymentby: u.username,
                paidbygui: u.gui,
                payreason: "topup offered bonus", 
                attache: "",
                bankinfo: '',
                targetuser: __master_user.username,
                status: "approved",
                description: "",
                receiveddate: convertTZ(new Date()), //
                certifieddate: convertTZ(new Date()), //
                approveddate: convertTZ(new Date()), //
                gui: uuidV4()
              };              
              makePayment(p).then(function(res){                
                js.client.data.message = "OK Pay offer bonus completely";
                js.resp.send(js.client);
              });                            
            });              
          }).catch(function(err){
            logTelecomError(err);                  
            db = create_db('topupfailure');
            var f = {
              gui: uuidV4(),
              username: u.username,
              usergui: u.gui,
              phone: js.client.data.topup.phone,
              value: t.balance,
              createddate: convertTZ(new Date()),
              lastretry: convertTZ(new Date()),
              failedreason: 'operator failed, ' + JSON.stringify(err),
              redo: 0,
              status: 'failed' // retry , ok,  
            };
            db.insert(f, f.gui, function (err, res) {
              if (err) {
                var l={
                  log: err,
                  logdate: convertTZ(new Date()),
                  type:"error topup  "+ js.client.username,
                  gui: uuidV4(),
                }
                logging(l);
                js.client.data.message = err;
                js.resp.send(js.client);
              } else {
                js.client.data.message = 'updated top up failed and put to the queue';
                js.resp.send(js.client);
              }
            });
          
          });  
        });
      });
    } else {      
      var l={
        log: 'Error username not found!',
        logdate: convertTZ(new Date()),
        type:"error topup "+ u.phone1,
        gui: uuidV4(),
      }
      logging(l);  
      js.client.data.message = 'Error username not found!';
      js.resp.send(js.client);
    }
  }).catch(function(err){
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error payoffer "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l); 
    js.client.data.message = err;
    js.resp.send(js.client);
  });      
}



// for admin only
// show offer list ,make target user list and exception list
app.post('/show_offer_list', function (req, res) { 
  // client
  //return client
  //client.message='OK'
  //client.data.user={arr:{},count:0};
  var js = {};
  js.client = req.body;
  js.resp = res;
  showOfferList(js);
});
function showOfferList(js){
  js.client.data.user=__master_user;
  showMemberListByParent(js).then(function(res){
    js.client.data.user=res;//{arr:{},count:0}
    js.client.data.message = "OK";
    js.resp.send(js.client);
  }).catch(function(err){
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error show offer list "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l); 
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}


// for admin only
// show bonus topup list , member who has top up and showed top up value in that month
app.post('/show_bonus_topup_list', function (req, res) { 
  //client
  //client.data.year , client.data.year ,client.data.page , client.data.maxpage
  //return client
  //client.data.bonustopuplist={arr:{},count:0}
  // client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  showBonusTopUpList(js);
});
function countTopupBalanceSumByAllUser(js){
  var deferred=Q.defer();
  var db = create_db('topupbalancesum');
  db.view(__design_view, "countByYearMonth", {
      key: [js.client.data.year, js.client.data.month],
      include_docs: true,
    },
    function (err, res) {
      if (err) {
        deferred.reject(err);
      } else {
        var arr = [];
        if (res.rows.length)
          for (var index = 0; index < res.rows.length; index++) {
            var element = res.rows[index].value;            
            arr.push(element);
          }
        deferred.resolve(arr[0]);
      }
    });
    return deferred.promise;
}
function showTopupBalanceSumByAllUser(js) {
  var deferred=Q.defer();
  var db = create_db('topupbalancesum');
  countTopupBalanceSumByAllUser(js).then(function(res){
    var count=res;
    db.view(__design_view, "findByYearMonth", {
      key: [js.client.data.year, js.client.data.month],
      include_docs: true,
      skip:js.client.data.page,
      limit:js.client.data.maxpage
    },
    function (err, res) {
      if (err) {
        deferred.reject(err);
      } else {
        var arr = [];
        if (res.rows.length)
          for (var index = 0; index < res.rows.length; index++) {
            var element = res.rows[index].value;
            element._rev = "";
            arr.push(element);
          }
        deferred.resolve({arr:arr,count:count});
      }
    });
  });

  return deferred.promise;
}
function getmemberBonusTopUp(js){
  var deferred=Q.defer();
  showTopupBalanceSumByAllUser(js).then(function(res){
    deferred.resolve(res);
  }).catch(function(err){
    deferred.reject(err);
  });
  return deferred.promise;
}
function showBonusTopUpList(js){
  js.client.data.user=__master_user;
  getmemberBonusTopUp(js).then(function(res){
    js.client.data.bonustopuplist=res;//{arr:{},count:0,}
    js.client.data.message = "OK";
    js.resp.send(js.client);
  }).catch(function(err){
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error show bonus topup List "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l); 
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

//admin only
// send offer to all
app.post('/send_offer', function (req, res) { 
  //js.client.data.targetuser=[{username:''}] max 1
  //client.data.targetuser.offeredbonus=0
  //return client
  //client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  sendOffer(js);
});
function sendOffer(js) {
  if(js.client.data.targetuser.length>0&&js.client.data.targetuser.length<1){
    var db = create_db('user');
    for (var index = 0; index < js.client.data.targetuser.length; index++) {
      viewUser(s.client.data.targetuser[index]).then(function(res){
        if (res.length) {
          var u = res[0].value;
          u.offeredbonus = js.client.data.user.offeredbonus;
          updateUser(u).then(function(res){
            var __doc = {
              usergui: u.gui,
              username: u.username,
              paymentdate: convertTZ(new Date()),
              paymentvalue: u.offeredbonus,
              paymentby: __master_user.username,
              paidbygui: __master_user.gui,
              payreason: "system offer", // cashing , request confirm, 
              attache: "",
              bankinfo:'',
              targetuser: u.username,
              status: "approved",
              description: "",
              receiveddate: convertTZ(new Date()), //
              certifieddate: convertTZ(new Date()), //
              approveddate: convertTZ(new Date()), //
              gui: uuidV4()
            };
            makePayment(__doc).then(function (body) {
              js.client.data.message = "OK Send offer bonus completely";
              js.resp.send(js.client);
            });
          });              
        } else {
          var l={
            log: "user not found",
            logdate: convertTZ(new Date()),
            type:"error send offer "+ js.client.username,
            gui: uuidV4(),
          }
          logging(l); 
          js.client.data.message = 'error username not found!';
          js.resp.send(js.client);
        }
      }).catch(function (err) {
        var l={
          log: err,
          logdate: convertTZ(new Date()),
          type:"error send offer bonus "+ js.client.username,
          gui: uuidV4(),
        }
        logging(l); 
        js.client.data.message = err;
        js.resp.send(js.client);;
      });
    }       
  }
  else{
    var l={
      log: 'list is not within 50',
      logdate: convertTZ(new Date()),
      type:"error send offer  "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l); 
    js.client.data.message = 'error the list could not be more than 50 and must be higher than 0';
    js.resp.send(js.client);
  }
}

//admin only
// send bonus topup
app.post('/send_bonus_topup', function (req, res) { 
  //client.data.user , 
  //client.data.bonustopupbalance
  //return client
  //client.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  sendBonusTopUpBalance(js);
});


// db = create_db("topupbalancesum");
// db.view(__design_view, "findByUsernameAndYearMonth", {
//     key: [js.client.data.user.username, js.client.data.year, js.client.data.month]
//   },
//   function (err, res) {
//     if (err) {
//       js.client.data.message = err;
//       js.resp.send(js.client);;
//     } else if (res.rows.length) {
//       var t = res.rows[0].value;
//       t.type = "paidbonus";
//       db.insert(t, t.gui, function (err, res) {
//         if (err) {
//           js.client.data.message = err;
//           js.resp.send(js.client);;
//         } else {
//           js.client.data.message = "completed pay bonus topup balance by this user: " + u.username + "/" + js.client.data.bonustopupbalance.sumvalue;
//           js.resp.send(js.client);
//         }
//       });
//     } else {
//       js.client.data.message = "could not find this bonus topup balance by this user";
//       js.resp.send(js.client);
//     }
//   });
function sendBonusTopUpBalance(js) {
  viewUser(js.client.data.user).then(function(res){
    if (res.length) {
      var u = res[0];
      //update userinfo
      u.bonustopupbalance += js.client.data.bonustopupbalance;
      updateUser(u).then(function(res){
        var p = {
          usergui: u.gui,
          username: u.username,
          paymentdate: convertTZ(new Date()),
          paymentvalue: u.bonustopupbalance,
          paymentby: __master_user.username,
          paidbygui: __master_user.gui,
          payreason: "topup offered bonus", 
          attache: "",
          bankinfo: '',
          targetuser: u.username,
          status: "approved",
          description: "",
          receiveddate: convertTZ(new Date()), //
          certifieddate: convertTZ(new Date()), //
          approveddate: convertTZ(new Date()), //
          gui: uuidV4()
        };              
        makePayment(p).then(function(res){                
          js.client.data.message='OK'
          js.resp.send(js.client);
        });
      });
     } 
     else {
      var l={
        log: err,
        logdate: convertTZ(new Date()),
        type:"error could not find this user"+ js.client.username,
        gui: uuidV4(),
      }
      logging(l); 
      js.client.data.message = "could not find this user";
      js.resp.send(js.client);
    }
  }).catch(function(err){
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error send bonus topup "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l); 
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}
function makePayment(p) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.insert(p, p.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}


// USER
// TRANSFER ALL BONUS TO MAIN BALANCE
app.post('/bonus_to_main_balance', function (req, res) { 
  //js.client , 
  //return client
  // client.message ='OK';
  //
  var js = {};
  js.client = req.body;
  js.resp = res;
  bonusToMainBalance(js);
});

function updateBonusBalance(user, balance) {
  var deferred = Q.defer();
  var db = create_db('bonusbalance');
  findBonusBalanceByUsername(user, 0, 1).then(function (arr) {
    if (arr.length < 1) deferred.reject(new Error('No record'));
    else {
      var b = arr[0];
      balance.balance = b.balance + balance.diffbalance;
      db.insert(balance, balance.gui, function (err, res) {
        if (err) deferred.reject(err);
        else {
          deferred.resolve(res);
        }
      });
    }
  }).catch(function (err) {
    deferred.reject(err);
  }).done();
  return deferred.promise;
}

function updateMainBalance(user, balance) {
  var deferred = Q.defer();
  var db = create_db('mainbalance');
  findMainBalanceByUsername(user, 0, 1).then(function (arr) {
    if (!arr.length) {
      db.insert(balance, balance.gui, function (err, res) {
        if (err) deferred.reject(err);
        else {
          deferred.resolve('OK');
        }
      });
    } else {
      var b = arr[0];
      balance.balance = b.balance + balance.diffbalance;
      db.insert(balance, balance.gui, function (err, res) {
        if (err) deferred.reject(err);
        else {
          deferred.resolve('OK');
        }
      });
    }
  }).catch(function (err) {
    deferred.reject(err);
  }).done();
  return deferred.promise;
}

function bonusToMainBalance(js) {
  viewUser(js.client).then(function(res){
    if (res.length) {
      var u = res[0];
      var __balance_doc = {
        username: u.username,
        usergui: u.gui,
        gui: uuidV4(),
        balance: 0,
        updated: convertTZ(new Date()),
        diffbalance: -js.client.data.balance.diffbalance,
        type: "bonus to main"
      };
      findBonusBalanceByUsername(js.client, 0, 1).then(function (body) {
        var bonusbalance = body[0];
        if (u.balancevalue < js.client.data.balance.diffbalance) {
          var l={
            log: 'error not enough bonus to main balance',
            logdate: convertTZ(new Date()),
            type:"error not enough bonus to main balance "+ js.client.username,
            gui: uuidV4(),
          }
          logging(l); 
          return;
        }
        updateBonusBalance(u, __balance_doc).then(function (body) {
          __balance_doc.diffbalance *= -1;
          updateMainBalance(u, __balance_doc).then(function (body) {
            u.balancevalue -= js.client.data.balance.diffbalance;
            u.mainbalance += js.client.data.balance.diffbalance;
            updateUser(u).then(function(res){
              var p = {
                usergui: u.gui,
                username: u.username,
                paymentdate: convertTZ(new Date()),
                paymentvalue: u.bonustopupbalance,
                paymentby: u.username,
                paidbygui: u.gui,
                payreason: "topup offered bonus", 
                attache: "",
                bankinfo: '',
                targetuser: u.username,
                status: "approved",
                description: "",
                receiveddate: convertTZ(new Date()), //
                certifieddate: convertTZ(new Date()), //
                approveddate: convertTZ(new Date()), //
                gui: uuidV4()
              };              
              makePayment(p).then(function(res){                
                js.client.data.message = "OK Bonus to main balance completely";
                js.resp.send(js.client);
              });
              
            });
          });
        });
      });
    } else {
      var l={
        log: 'error bonus to main balance',
        logdate: convertTZ(new Date()),
        type:"error bonus to main balance "+ js.client.username,
        gui: uuidV4(),
      }
      logging(l); 
      js.client.data.message = 'username not found!';
      js.resp.send(js.client);
    }
  }).catch(function(err){
    var l={
      log: err,
      logdate: convertTZ(new Date()),
      type:"error bonus to main balance "+ js.client.username,
      gui: uuidV4(),
    }
    logging(l); 
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}
// TOP UP
app.post('/topup', function (req, res) { 
  //client.data.user , 
  //client.data.topupbalance.diffbalance=0, 
  //client.topup.phone
  //return client 
  //client.data.message="OK" 
  var js = {};
  js.client = req.body;
  js.resp = res;
  topUp(js);
});

function topUp(js) {
  processTopUp(js);
}

function processTopUp(js) {
  // deduct from main balance
  findMainBalanceByUsername(js.client,0,1).then(function(res){
      var t = {
        username: js.client.data.user.username,
        usergui: js.client.data.user.gui,
        gui: uuidV4(),
        balance: 0,
        updated: convertTZ(new Date()),
        diffbalance: 0,
        type: "topup"
      };
      if (res.rows.length) {
        var mb = [];
        mb.push(res.rows[0].value);
        // need to turn js.client.data.topupbalance.diffbalance to be minus value, before this function
        if (js.client.data.topupbalance.diffbalance >= 0) {
          var l={
            log: 'value to top up must be lower than 0',
            logdate: convertTZ(new Date()),
            type:"error topup  "+ js.client.username,
            gui: uuidV4(),
          }
          logging(l);
          js.resp.send(new Error('value to top up must be lower than 0'));
          return;
        }
        if (mb[0].balance < -1 * js.client.data.topupbalance.diffbalance) {
          var l={
            log: 'not enough for main balance',
            logdate: convertTZ(new Date()),
            type:"error topup  "+ js.client.username,
            gui: uuidV4(),
          }
          logging(l);
          js.client.data.message = "not enough for main balance";
          js.resp.send(js.client);
          return;
        }
        mb[0].balance += js.client.data.topupbalance.diffbalance;
        mb[0].diffbalance = js.client.data.topupbalance.diffbalance;
        t.balance = mb[0].balance;
        t.diffbalance = mb[0].diffbalance;
        // insert new record for main balance
        db.insert(t, t.gui, function (err, res) {
          if (err) {
            js.client.data.message = err;
            js.resp.send(js.client);;
          } else {
            //update userinfo
            viewUser(js.client).then(function(res){
              if (res.length) {
                var u = res[0];
                u.mainbalance = t.balance;
                u.topupbalance += -1 * t.diffbalance;
                u.balance = u.topupbalance;
                updateUser(u).then(function (res) {
                  // update topupbalance
                  updateTopupBalance(js).then(function (err, res) {
                    // view topupbalancesum                    
                    var db = create_db('topupbalancesum');
                    db.view(__design_view, "findByUsernameAndYearMonth", {
                        key: [js.client.username, js.client.data.year, js.client.data.month],
                        include_docs: true,
                        descending: true,
                        limit: 1
                      },
                      function (err, res) {
                        if (err) {
                          var l={
                            log: err,
                            logdate: convertTZ(new Date()),
                            type:"error topup  "+ js.client.username,
                            gui: uuidV4(),
                          }
                          logging(l);
                          js.client.data.message = err;
                          js.resp.send(js.client);
                        } else {
                          var t = {
                            username: js.client.username,
                            usergui: js.client.data.user.gui,
                            gui: uuidV4(),
                            balance: 0,
                            updated: convertTZ(new Date()),
                            diffbalance: 0,
                            type: "topupsum"
                          };
                          if (res.rows.length) {
                            //update
                            t = res.rows[0].value;
                            t.balance += js.client.data.topupbalance.diffbalance;
                            t.diffbalance = js.client.data.topupbalance.diffbalance;
                          } else {
                            //insert new
                            t.balance = js.client.data.topupbalance.diffbalance;
                            t.diffbalance = js.client.data.topupbalance.diffbalance;
                          }
                          db.insert(t, t.gui, function (err, res) {
                            if (err) {
                              js.client.data.message = err;
                              js.resp.send(js.client);;
                            } else {
                              connectOperator(js.client.data.topup.phone, t.balance).then(function(res){
                                logTelecomTopup(res).then(function(res){
                                  var l={
                                    log: res,
                                    logdate: convertTZ(new Date()),
                                    type:"topup "+ js.client.data.topup.phone,
                                    gui: uuidV4(),
                                  }
                                  logging(l);
                                  var __doc = {
                                    usergui: __master_user.gui,
                                    username: __master_user.username,
                                    paymentdate: convertTZ(new Date()),
                                    paymentvalue: t.diffbalance,
                                    paymentby: t.username,
                                    paidbygui: t.gui,
                                    payreason: "top up", // cashing , request confirm, 
                                    attache: "",
                                    bankinfo: '',
                                    targetuser: __master_user.username,
                                    status: "approved",
                                    description: "",
                                    receiveddate: convertTZ(new Date()), //
                                    certifieddate: convertTZ(new Date()), //
                                    approveddate: convertTZ(new Date()), //
                                    gui: uuidV4()
                                  };
                                  makePayment(__doc).then(function(res){
                                    js.client.data.message = "topup completely " + js.client.data.user.username;
                                    js.resp.send(js.client);                                                                                                  
                                  });                                  
                                });
                              }).catch(function(err){            
                                logTelecomError(err);                  
                                db = create_db('topupfailure');
                                var f = {
                                  gui: uuidV4(),
                                  username: u.username,
                                  usergui: u.gui,
                                  phone: js.client.data.topup.phone,
                                  value: t.balance,
                                  createddate: convertTZ(new Date()),
                                  lastretry: convertTZ(new Date()),
                                  failedreason: 'operator failed, ' + JSON.stringify(err),
                                  redo: 0,
                                  status: 'failed' // retry , ok,  
                                };
                                db.insert(f, f.gui, function (err, res) {
                                  if (err) {
                                    var l={
                                      log: err,
                                      logdate: convertTZ(new Date()),
                                      type:"error topup  "+ js.client.username,
                                      gui: uuidV4(),
                                    }
                                    logging(l);
                                    js.client.data.message = err;
                                    js.resp.send(js.client);
                                  } else {
                                    js.client.data.message = 'updated top up failed and put to the queue';
                                    js.resp.send(js.client);
                                  }
                                });
                              
                              });                              
                            }
                          });
                        }
                      });
                  });
                });
              } else {
                var l={
                  log: 'Could not find this username',
                  logdate: convertTZ(new Date()),
                  type:"error topup  "+ js.client.username,
                  gui: uuidV4(),
                }
                logging(l);
                js.client.data.message = "Could not find this username";
                js.resp.send(js.client);
                return;
              }
            });                                            
          }
        });
      } else {
        var l={
          log: 'could not find record',
          logdate: convertTZ(new Date()),
          type:"error topup  "+ js.client.username,
          gui: uuidV4(),
        }
        logging(l);
        js.client.data.message = "could not find record";
        js.resp.send(js.client);
      }
  });
}

app.post('/show_operator_failure_by_user', function (req, res) { //js.client.data.user,js.client.data.page, js.client.data.maxpage
  var js = {};
  js.client = req.body;
  js.resp = res;
  showTopUpFailureByUsername(js).then(function (body) {
    js.client.data.topupfailure = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);;
  }).done();
});
app.post('/show_operator_failure', function (req, res) { //js.client.data.page, js.client.data.maxpage
  var js = {};
  js.client = req.body;
  js.resp = res;
  //admin only
  showTopUpFailure(js).then(function (body) {
    js.client.data.topupfailure = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);;
  }).done();
});

app.post('/transfer', function (req, res) { //js.client, js.client.data.balance , js.client.data.transferbalance
  var js = {};
  js.client = req.body;
  js.resp = res;
  transferBalance(js);
});

app.post('/main_balance_list_by_user', function (req, res) { //js.client
  var js = {};
  js.client = req.body;
  js.resp = res;
  showMainBalance(js)
});
app.post('/bonus_balance_list_by_user', function (req, res) { //js.client 
  var js = {};
  js.client = req.body;
  js.resp = res;
  showBonusBalance(js);
});

app.post('/payment_request', function (req, res) { //js.client.data.payment
  var js = {};
  js.client = req.body;
  js.resp = res;
  sendPaymentRequest(js);
});

function sendPaymentRequest(js) {
  var __doc = {
    usergui: __master_user.gui,
    username: __master_user.username,
    paymentdate: convertTZ(new Date()),
    paymentvalue: js.client.data.payment.paymentvalue,
    paymentby: js.client.data.payment.username,
    paidbygui: js.client.data.payment.usergui,
    payreason: "payment request",
    bankinfo: js.client.data.payment.bankinfo,
    targetuser: js.client.data.payment.targetuser,
    status: "",
    attache: js.client.data.payment.attache,
    description: js.client.data.payment.description,
    receiveddate: '',
    certifieddate: '',
    approveddate: '',
    gui: uuidV4()
  };
  if (__doc.paymentvalue <= 0) {
    js.client.data.message = new Error('payment value must be positive integer');
    js.resp.send(js.client);
    return;
  }
  var users = {};
  users.user = {};
  users.user.username = __doc.targetuser;
  findUserByUserName(users.user).then(function (body) {
    var db = create_db('payment');
    if (!body.length) {
      js.client.data.message = 'NO user found';
      js.resp.send(js.client);
    } else if (body.length)
      db.insert(__doc, __doc.gui, function (err, res) {
        if (err) {
          js.client.data.message = err;
          js.resp.send(js.client);
        } else {
          js.client.data.message = 'OK, request for payment confirmation sent';
          js.resp.send(js.client);
        }
      });
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}
app.post('/update_payment_request', function (req, res) { //js.client.data.payment
  var js = {};
  js.client = req.body;
  js.resp = res;
  updatePaymentRequest(js);
});

function updatePaymentRequest(js) { // js.client.data.payment for admin only
  //check
  //certify
  //approve and send new balance to mainbalance
  var deferred = Q.defer();
  var db = create_db('payment');
  var p = js.client.data.payment;
  var mark = '';
  if (js.client.data.payment.status == 'declined') {
    p.receiveddate = convertTZ(new Date());
    p.certifieddate = convertTZ(new Date());
    p.approveddate = convertTZ(new Date());
    p.description += js.client.username;
  }
  if (p.receiveddate != '' && p.certifieddate != '' && p.approveddate != '') {
    mark = 'approved';
  } else if (p.receiveddate != '' && p.certifieddate != '' && p.approveddate == '') {
    mark = 'certified';
  } else if (p.receiveddate != '' && p.certifieddate == '' && p.approveddate == '') {
    mark = 'checked';
  } else if (p.receiveddate == '' && p.certifieddate == '' && p.approveddate == '') {
    mark = 'nothing';
    mark = 'wrong process, please try again ';
    js.client.data.message = mark;
    js.resp.send(js.client);
    return;
  } else {
    mark = 'wrong process, please try again ';
    js.client.data.message = mark;
    js.resp.send(js.client);
    return;
  }
  if (p._rev)
    makePayment(js.client.data.payment).then(function (body) {
      if (mark == 'approved') {
        //send balance to that user
        var b = {
          username: __master_user.username,
          usergui: __master_user.usergui,
          gui: uuidV4(),
          balance: 0,
          updated: convertTZ(new Date()),
          diffbalance: -js.client.data.payment.paymentvalue,
          type: "payment request"
        };
        updateMainBalance(__master_user, b).then(function (body) {
          b.username = js.client.data.payment.targetuser;
          b.usergui = js.client.data.payment.usergui;
          b.diffbalance *= -1;
          updateMainBalance(js.client.data.payment.targetuser, b).then(function (body) {
            js.client.data.message = 'payment request has been updated ' + mark;
            js.resp.send(js.client);
          }).catch(function (err) {
            js.client.data.message = err;
            js.resp.send(js.client);
          }).done();
        }).catch(function (err) {
          js.client.data.message = err;
          js.resp.send(js.client);
        }).done();
      } else if (mark == 'certified') {
        //notify to user or sms or chat
      } else if (mark == 'checked') {
        //notify to user or sms or chat
      }
    }).catch(function (err) {
      js.client.data.message = err;
      js.resp.send(js.client);
    }).done();
  return deferred.promise;
}


app.post('/cashing_request', function (req, res) { //js.client.data.payment
  var js = {};
  js.client = req.body;
  js.resp = res;
  sendCashingRequest(js);
});

function sendCashingRequest(js) {
  var __doc = {
    usergui: __master_user.gui,
    username: __master_user.username,
    paymentdate: convertTZ(new Date()),
    paymentvalue: -js.client.data.payment.paymentvalue,
    paymentby: js.client.data.payment.username,
    paidbygui: js.client.data.payment.usergui,
    payreason: "cashing",
    bankinfo: js.client.data.payment.bankinfo,
    targetuser: js.client.data.payment.username,
    status: "",
    attache: js.client.data.payment.attache,
    description: js.client.data.payment.description,
    receiveddate: '',
    certifieddate: '',
    approveddate: '',
    gui: uuidV4()
  };
  if (__doc.paymentvalue >= 0) {
    js.client.data.message = new Error('Payment value must be positive integer');
    js.resp.send(js.client);
    return;
  }
  if (js.client.data.payment.targetuser != js.client.data.payment.username || js.client.data.payment.targetuser != js.client.username || js.client.username != js.client.data.payment.username) {
    js.client.data.message = new Error('you could not cash-out to other usernme');
    js.resp.send(js.client);
    return;
  }
  var users = {};
  users.user = {};
  users.user.username = js.client.data.payment.username;
  findUserByUserName(users.user).then(function (body) {
    if (body.length) {
      var u = body[0];
      if (u.bankaccount != __doc.bankinfo) {
        js.client.data.message = new Error('Bank info not the same');
        js.resp.send(js.client);
        return;
      }
      var b = {
        username: js.client.data.payment.targetuser,
        usergui: js.client.data.payment.usergui,
        gui: uuidV4(),
        balance: 0,
        updated: convertTZ(new Date()),
        diffbalance: -js.client.data.payment.paymentvalue,
        type: "cashing request"
      };
      updateMainBalance(js.client.data.payment, b).then(function (body) {
        makePayment(__doc).then(function (body) {
          js.client.data.message = 'OK send Cashing request completely';
          js.resp.send(js.client);
        }).catch(function (err) {
          js.client.data.message = err;
          js.resp.send(js.client);
        }).done();
      }).catch(function (err) {
        js.client.data.message = err;
        js.resp.send(js.client);
      }).done();
    } else {
      js.client.data.message = "user not found"
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}
app.post('/update_cashing_request', function (req, res) { //js.client.data.payment
  var js = {};
  js.client = req.body;
  js.resp = res;
  updateCashingRequest(js);
});

function updateCashingRequest(js) { // js.client.data.payment for admin only
  //check
  //certify
  //approve and send new balance to mainbalance
  var deferred = Q.defer();
  var db = create_db('payment');
  var p = js.client.data.payment;
  var mark = '';
  if (js.client.data.payment.status == 'declined') {
    p.receiveddate = convertTZ(new Date());
    p.certifieddate = convertTZ(new Date());
    p.approveddate = convertTZ(new Date());
    p.description += js.client.username;
  }
  if (p.receiveddate != '' && p.certifieddate != '' && p.approveddate != '') {
    mark = 'approved';
  } else if (p.receiveddate != '' && p.certifieddate != '' && p.approveddate == '') {
    mark = 'certified';
  } else if (p.receiveddate != '' && p.certifieddate == '' && p.approveddate == '') {
    mark = 'checked';
  } else if (p.receiveddate == '' && p.certifieddate == '' && p.approveddate == '') {
    mark = 'nothing';
  } else {
    mark = 'wrong process, please try again ';
    js.client.data.message = mark;
    js.resp.send(js.client);
    return;
  }
  if (js.client.data.payment._rev)
    makePayment(p).then(function (body) {
      js.client.data.message = 'payment request has been updated ' + mark;
      js.resp.send(js.client);
    }).catch(function (err) {
      js.client.message = err;
      js.resp.send(js.client);
    }).done();

  return deferred.promise;
}


app.post('/payment_list_by_username', function (req, res) { //js.client.data.user
  var js = {};
  js.client = req.body;
  js.resp = res;
  showPaymentListByUsername(js);
});

function showPaymentListByUsername(js) {
  getPaymentListByUsername(js.client.data.user, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.payment = body;
    js.client.data.message = 'OK';
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getPaymentListByUsername(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.view(__design_view, 'findCountByUsername', {
    key: user.username
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var count = res.rows[0].value;
      db.view(__design_view, 'findByUsername', {
          key: user.username,
          decending: true,
          skip: page,
          limit: maxpage
        },
        function (err, res) {
          if (err) deferred.reject(err);
          else {
            var arr = [];
            if (res.rows.length)
              for (var index = 0; index < res.rows.length; index++) {
                arr.push(array[index].value);
              }
            deferred.resolve({
              arr: arr,
              count: count
            });
          }
        });
    }
  });
  return deferred.promise;
}

app.post('/payment_list_admin', function (req, res) { //?
  var js = {};
  js.client = req.body;
  js.resp = res;
  showPaymentList(js);
});

function showPaymentList(js) {
  getPaymentList(js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.payment = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getPaymentList(page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.view(__design_view, 'findCount', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var count = res.rows[0].value;
      db.view(__design_view, 'findall', {
        decending: true,
        skip: page,
        limit: maxpage
      }, function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length)
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(array[index].value);
            }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
    }
  });
  return deferred.promise;
}

app.post('/payment_request_list_by_username', function (req, res) { //js.client.data.user 
  var js = {};
  js.client = req.body;
  js.resp = res;
  showPaymentRequestListByUsername(js);
});

function showPaymentRequestListByUsername(js) {
  getPaymentRequestListByUsername(js.client.data.user, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.payment = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getPaymentRequestListByUsername(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.view(__design_view, 'findCountPaymentRequestByUsername', {
    key: user.username
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var count = res.rows[0].value;
      db.view(__design_view, 'findPaymentRequestByUsername', {
        key: user.username,
        decending: true,
        skip: page,
        limit: maxpage
      }, function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length)
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(array[index].value);
            }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
    }
  });
  return deferred.promise;
}

app.post('/cashing_list_by_username', function (req, res) { //js.client.data.user 
  var js = {};
  js.client = req.body;
  js.resp = res;
  showCashingListByUsername(js);
});

function showCashingListByUsername(js) {
  getCashingListByUsername(js.client.data.user, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.payment = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getCashingListByUsername(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.view(__design_view, 'findCountCashingRequestByUsername', {
    key: user.username
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var count = res.rows[0].value;
      db.view(__design_view, 'findCashingRequestByUsername', {
        key: user.username,
        decending: true,
        skip: page,
        limit: maxpage
      }, function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length)
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(array[index].value);
            }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
    }
  });
  return deferred.promise;
}



app.post('/payment_request_list_admin', function (req, res) { //?
  var js = {};
  js.client = req.body;
  js.resp = res;
  showPaymentRequestList(js);
});

function showPaymentRequestList(js) {
  getPaymentRequestList(js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.payment = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getPaymentRequestList(page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.view(__design_view, 'findCountPaymentRequest', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var count = res.rows[0].value;
      db.view(__design_view, 'findPaymentRequest', {
        decending: true,
        skip: page,
        limit: maxpage
      }, function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length)
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(array[index].value);
            }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
    }
  });
  return deferred.promise;
}
app.post('/cashing_request_list_admin', function (req, res) { //?
  var js = {};
  js.client = req.body;
  js.resp = res;
  showCashingList(js);
});

function showCashingList(js) {
  getCashingList(js.client, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.payment = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getCashingList(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('payment');
  db.view(__design_view, 'findCountCashingRequest', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var count = res.rows[0].value;
      db.view(__design_view, 'findCashingRequest', {
        decending: true,
        skip: page,
        limit: maxpage
      }, function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length)
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(array[index].value);
            }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
    }
  });
  return deferred.promise;
}
app.post('/get_member_count_by_package', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember
  var js = {};
  js.client = req.body;
  js.resp = res;
  showTotalMemberByUsername(js);
});
app.post('/get_member_count_by_username', function (req, res) { //js.client.data.user , js.client.data.user.ismember
  var js = {};
  js.client = req.body;
  js.resp = res;
  showMemberCountByUsername(js);
});
app.post('/show_coupling_list_by_user', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  showCouplingScoreByUser(js); // show who has the most introduction codes by month
});
app.post('/show_the_best_friend_by_month_year', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  showTheBestFriendByMonthYear(js); // show who has the most introduction codes by month
});

function findTheBestFriendByMonthYear(user, month, year) {
  var deferred = Q.defer();
  var db = create_db('introductions');
  db.view(__design_view, 'findTheBestFriendByMonthYear', {
      key: [user.username, month, year]
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length)
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function addTheBestFriendByMonthYear(user, month, year) {
  var deferred = Q.defer();
  var db = create_db('introductions');
  findTheBestFriendByMonthYear(user, month, year).then(function (body) {
    var introd = {
      gui: uuidV4(),
      username: '',
      month: 0,
      year: 0,
      count: 0
    };
    if (body.length) {
      introd = body[0];
    }
    introd.count++;
    db.insert(introd, introd.gui,
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          deferred.resolve('OK');
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();

  return deferred.promise;
}

function addTheBestFriendLog(user, introd, month, year) {
  var deferred = Q.defer();
  var db = create_db('introductions');
  var introdlog = {
    gui: uuidV4(),
    username: user.username,
    introductor: introd,
    month: 0,
    year: 0,
    createddate: convertTZ(new Date())
  };
  db.insert(introd, introd.gui,
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        deferred.resolve('OK');
      }
    });
  return deferred.promise;

}

function findCountTheBestFriendByMonthYear(month, year) {
  var deferred = Q.defer();
  var db = create_db('introductions');
  db.view(__design_view, 'findCountByMonthYear', {
      key: [month, year]
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length)
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        deferred.resolve(arr[0].value);
      }
    });
  return deferred.promise;
}

function showTheBestFriendByMonthYear(js) { // get from the most introduction by month  from introductions
  var introd = {
    gui: uuidV4(),
    username: '',
    month: 0,
    year: 0,
    count: 0
  };
  var db = create_db('introductions');
  //TODO
  findCountTheBestFriendByMonthYear(js.client.data.month, js.client.data.year).then(
    function (body) {
      var count = body[0];
      db.view(__design_view, 'findByMonthYear', {
        startkey: [js.client.data.month, js.client.data.year, ""],
        endkey: [js.client.data.month, js.client.data.year, "\u9999"],
        decending: true,
        skip: js.client.data.page,
        limit: js.client.data.maxpage
      }, function (err, res) {
        if (err) {
          js.client.data.message = err;
          js.resp.send(js.client);;
        } else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < array.length; index++) {
              arr.push(array[index].value);
            }
          }
          js.client.data.thebestfriend = {
            arr: arr,
            count: count
          };
          js.client.data.message = 'OK';
          js.resp.send(js.client);
        }
      });
    }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}
//


//for a certain user
app.post('/show_latest_members', function (req, res) { //js.client.data.user , js.client.data.package
  var js = {};
  js.client = req.body;
  js.resp = res;
  showLatestMembers(js).then(
    function (body) {
      js.client.data.latestmember = body;
      js.resp.send(client);
    }).catch(
    function (err) {
      js.client.data.message = err;
      js.resp.send(client);
    }).done(); //{month:0,year:0,package1:0,package2:0,package3:0}
});

function countLatestMember(user, month, year) {
  var deferred = Q.defer();
  var db = create_db('introductionslog');
  db.view(__design_view, 'findCountByIntroductorMonthYear', {
      key: [user.username, month, year]
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function showLatestMembers(js) {
  var deferred = Q.defer();
  var db = create_db('introductionslog');
  countLatestMember(js.client, js.client.data.month, js.client.data.year).then(function (body) {
    var count = body[0];
    db.view(__design_view, 'findByIntroductorMonthYear', {
        key: [js.client.username, js.client.data.month, js.client.data.year],
        decending: true,
        skip: js.client.data.page,
        limit: js.client.data.maxpage
      },
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(res.rows[index].value);
            }
          }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();

  return deferred.promise;

}
// for admin
app.post('/show_latest_members_list', function (req, res) { //js.client.data.user , js.client.data.package
  var js = {};
  js.client = req.body;
  js.resp = res;
  showLatestMembersList(js).then(
    function (body) {
      js.client.data.latestmember = body;
      js.resp.send(client);
    }).catch(
    function (err) {
      js.client.data.message = err;
      js.resp.send(client);
    }).done(); //{month:0,year:0,package1:0,package2:0,package3:0}
});

function countLatestMemberList(month, year) {
  var deferred = Q.defer();
  var db = create_db('introductionslog');
  db.view(__design_view, 'findCountByIntroductorMonthYear', {
      key: [month, year]
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function showLatestMembersList(js) {
  var deferred = Q.defer();
  var db = create_db('introductionslog');
  countLatestMemberList(js.client, js.client.data.month, js.client.data.year).then(function (body) {
    var count = body[0];
    db.view(__design_view, 'findByMonthYear', {
        key: [js.client.data.month, js.client.data.year],
        decending: true,
        skip: js.client.data.page,
        limit: js.client.data.maxpage
      },
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(res.rows[index].value);
            }
          }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();

  return deferred.promise;

}





app.get('/default_master', function (req, res) {
  var js = {};
  js.client = req.body;
  js.resp = res;
  init_default_master_user(js);
});
///*********************** */
app.post('/check_your_member', function (req, res) {
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkYourMember(js.client.data.user.username).then(function (res) {
    js.client.data.message = 'OK';
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
});

function checkYourMember(username) {
  var deferred = Q.defer();
  var db = create_db('user');
  var cu = __cur_client.username;
  //.... need to FIND here
  deferred.resolve(username);

  return deferred.promise;
}



app.post('/check_register_password', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkRegisterPassword(js);
});
app.post('/check_register_sponsor_code', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkRegisterSponserCode(js);
});
app.post('/check_register_need_balance_per_package', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  checkRegisterNeedBalancePerPackage(js);
});

// USER, js.client.data.user 
app.post('/show_user_accessed_log', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  showUserAccessLog(js);
});

function showUserAccessLog(js) {
  displayUserAccessLog(js.client.username).then(function (body) {
    js.client.data.accesslog = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function findCountUserAccessLogUserNameAccessDate(username) {
  var deferred = Q.defer();
  var db = create_db('useraccesslog');
  db.view(__design_view, 'findCountByUserNameAccessedDate', {
      startkey: [username, ""],
      endkey: [username, "\u9999"]
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length)
          arr.push(res.rows[0].value);
        deferred.resolve(arr[0]);
      }
    });
  return deferred.promise;
}

function displayUserAccessLog(u, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('useraccesslog');
  findCountUserAccessLogUserNameAccessDate(u.username).then(function (body) {
    db.view(__design_view, 'findByUserNameAccessedDate', {
      startkey: [u.username, ""],
      endkey: [u.username, "\u9999"],
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();

  return deferred.promise;
}

// ADMIN, js.client.data.user 
app.post('/show_admin_accessed_log', function (req, res) { //js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js = {};
  js.client = req.body;
  js.resp = res;
  showAdminAccessLog(js);
});

function showAdminAccessLog(js) {
  displayAdminAccessLog(js.client.username).then(function (body) {
    js.client.data.accesslog = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function findCountAdminAccessLog(username) {
  var deferred = Q.defer();
  var db = create_db('adminaccesslog');
  db.view(__design_view, 'findCount', {
      key: ""
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length)
          arr.push(res.rows[0].value);
        deferred.resolve(arr[0]);
      }
    });
  return deferred.promise;
}

function displayAdminAccessLog(u, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('adminaccesslog');
  findCountAdminAccessLog(u.username).then(function (body) {
    db.view(__design_view, 'findAll', {
      startkey: [""],
      endkey: ["\u9999"],
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();

  return deferred.promise;
}




app.all('*', function (req, res, next) {
  //common action
  // console.log(res);  
  var client = req.body;
  var keyword = __login_kw;
  var auth = authentication_path(req.path);
  console.log(auth);
  if (auth) {
    __client_ip = req.clientIp;
    r_client.getAsync(keyword + ' ' + client.clientuid + ' ' + __cur_client.logintoken).then(function (body) {
      if (body) { // NEED TO CHECK  USER OR ADMIN
        //next();
        var c = JSON.parse(body);
        if (auth == 1) { //CHECK authorization ADMIN
          checkAdmin(c).then(function (body) {
            if (!body) res.send(new Error('No Authorized'));
            else {
              var a = {
                username: c.username,
                workingpage: req.path,
                clientuid: c.clientuid,
                logintoken: c.logintoken
              }
              updateAdminAccessLog(a).then(function (body) {
                next();
              }).catch(function (err) {
                res.send(err);
              }).done();
            }
          }).catch(function (err) {
            res.send(err);
          }).done();
        } else if (auth == 2) //CHECK authorization User 
          var u = {
            username: c.username,
            workingpage: req.path,
            clientuid: c.clientuid,
            logintoken: c.logintoken
          }
        updateUserAccessLog(c).then(function (body) {
          next();
        }).catch(function (err) {
          res.send(err);
        }).done();
        //   next();
      } else
        res.send("not Allow ");
    }).catch(function (err) {
      res.send(err);
      //render error
    }).done();
  } else if (req.path != '/init_client') {
    // console.log('init_client');
    // console.log(client.clientuid +" != "+ __cur_client.clientuid);
    // if (client.clientuid != __cur_client.clientuid||__cur_client.clientuid=='undefined') /// HERE IF WE NEED TO CHECK IF EVEN PUBLIC NEED CLIENTUID
    //   res.send('not allow!');
    //   //next();
    // else
    next();
  } else
    next();
});

function init_admin() {
  var deferred = Q.defer();
  var db = create_db('authorize');
  var a = {
    gui: "5f15a3119896d245f2562f65ef000801",
    username: 'souk@TheFriendd',
  }
  db.insert(a, a.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function updateUserAccessLog(u) {
  var deferred = Q.defer();
  var db = create_db('userlog');
  u.accesseddate = convertTZ(new Date());
  u.ip = __client_ip;
  //admin.username
  //admin.workingpage

  db.insert(u, u.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function updateAdminAccessLog(a) {
  var deferred = Q.defer();
  var db = create_db('adminlog');
  a.accesseddate = convertTZ(new Date());
  a.ip = __client_ip;
  //admin.username
  //admin.workingpage

  db.insert(a, a.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function checkAdmin(client) {
  var deferred = Q.defer();
  var db = create_db('authorize');
  db.view(__design_view, 'findByUsername', {
    key: client.username
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length)
        arr.push(res.rows[0].value);
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function create_db(dbname) {
  var db;
  nano.db.create(dbname, function (err, body) {
    // specify the database we are going to use    
    if (!err) {
      console.log('database ' + dbname + ' created!');
    } else
      console.log(dbname + " could not be created!");
  });
  db = nano.use(dbname);
  return db;
};

//****************************************BALANCE */
var __balance_doc = {
  username: "",
  usergui: "",
  gui: uuidV4(),
  balance: 0,
  updated: convertTZ(new Date()),
  diffbalance: 0,
  type: ""
};

__design_view = "objectList";
var __design_system = {
  "_id": "_design/objectList",
  "views": {
    "getCouchDBTime": {
      "map": "function (doc) {\n  emit(null,new Date());\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_authorize = {
  "_id": "_design/objectList",
  "views": {
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username,doc);\n}"
    },
    "findCount": {
      "map": "function (doc) {\n  emit(null, 1);\n}"
    }
  },
  "language": "javascript"
};
var __design_balance = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCountByUsername": {
      "reduce": "_count",
      "map": "function (doc) {\n emit(null,1);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username)\n    emit(doc.username,null);\n}"
    },
    "findCountAndMonth": {
      "reduce": "_count",
      "map": "function (doc) {\n   var d = new Date(doc.updated); \n if (d != null) {\n var key = [doc.username,d.getMonth()];\n emit(key, null);\n }\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username)\n emit(doc.username,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n if(doc.username)\n emit(doc.username, doc);\n}"
    },
    "findByUsernameAndMonth": {
      "map": "function (doc) {\n   var d = new Date(doc.updated);\n if (d != null) {\n var key = [doc.username,d.getMonth()];\n emit(key, doc);\n }\n}"
    },
    "findByUsernameAndYearMonth": {
      "map": "function (doc) {\n   var d = new Date(doc.updated);\n if (d != null) {\n var key = [doc.username,d.getFullYear(),d.getMonth()];\n emit(key, doc);\n }\n}"
    },
    "findByYearMonth": {
      "map": "function (doc) {\n   var d = new Date(doc.updated);\n if (d != null) {\n var key = [d.getFullYear(),d.getMonth()];\n emit(key, doc);\n }\n}"
    },
    "findBalanceByUserAndDate": {
      "map": "function (doc) {\n   var d = new Date(doc.updated);\n if (d != null) {\n var key = [d.getFullYear(),\n d.getMonth(),\n d.getDate(),\n doc.username];\n emit(key, doc);\n }\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_bonustopupbalance = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username)\n    emit(doc.username,null);\n}"
    },
    "findCountYear": {
      "reduce": "_count",
      "map": "function (doc) {\n if(doc.year){\n emit([doc.year],1); \n}  \n}"
    },
    "findCountYearMonth": {
      "reduce": "_count",
      "map": "function (doc) {\n if(doc.year&&doc.month){\n emit([doc.year,doc.month],1); \n}  \n}"
    },
    "findByYearMonth": {
      "map": "function (doc) {\n if(doc.year&&doc.month){\n emit([doc.year,doc.month],doc); \n}  \n}"
    },
    "findByYear": {
      "map": "function (doc) {\n if(doc.year){\n emit([doc.year],doc); \n}  \n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username)\n emit(doc.username,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n if(doc.username)\n emit(doc.username, doc);\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_user = {
  "_id": "_design/objectList",
  "views": {
    "containText": {
      "map": "function(doc) {\r\n    var i;\r\n    if (doc.username) {\r\n        for (i = 0; i < doc.username.length; i += 1) {\r\n            emit(doc.username.slice(i), doc);\r\n        }\r\n    }\r\n}"
    },
    "countMembers": {
      "map": "function(doc) {\r\n    for(var word in doc.aboveparents) {\r\n        emit(doc.aboveparents[word],1);\r\n    }\r\n}",
      "reduce": "_count"
    },
    "countMembersByPackageValue": {
      "reduce": "_count",
      "map": "function(doc) {\r\n    for(var word in doc.aboveparents) {\r\n      emit([doc.aboveparents[word],doc.packagevalue],1);\r\n    }\r\n}"
    },
    "countMembersByPackageValueMonthYear": {
      "reduce": "_count",
      "map": "function(doc) {\r\n  var d = new Date(doc.createddate);\r\n  if (d != null) {\r\n    var my = [d.getFullYear(),\r\n    d.getMonth()];\r\n    for(var word in doc.aboveparents) {\r\n      emit([doc.aboveparents[word],doc.packagevalue,my],1);\r\n    }\r\n  }\r\n}"
    },
    "findByEmail": {
      "map": "function(doc) {\r\n    if(doc.email) {\r\n        emit(doc.email,doc);\r\n    }\r\n}"
    },
    "findByPhone": {
      "map": "function(doc) {\r\n    if(doc.phone1) {\r\n        emit(doc.phone1,doc);\r\n    }\r\n}"
    },
    "findUserByUsernameAndPhone1": {
      "map": "function(doc) {\r\n    if(doc.phone1&&user.username) {\r\n        emit([doc.username,doc.phone1],doc);\r\n    }\r\n}"
    },
    "findMembersByUsername": {
      "map": "function(doc) {\r\n    for(var word in doc.aboveparents) {\r\n      emit(doc.aboveparents[word],doc);\r\n    }\r\n}"
    },
    "findByParent": {
      "map": "function(doc) {\r\n    if(doc.parent) {\r\n        emit(doc.parent,doc);\r\n    }\r\n}"
    },
    "findTopUser": {
      "map": "function(doc) {\r\n    if(doc.memberlevel==0&&doc.parentgui==doc.gui) {\r\n        emit(null,doc);\r\n    }\r\n}"
    },
    "findMembersByIndexes": {
      "map": "function (doc) {\n\r emit(doc.index, doc);\n}"
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
    "changePassword": {
      "map": "function (doc) {\n  if(doc.username&&doc.password&&doc.phone1)\n  emit([doc.username,doc.password,doc.phone1], doc);\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_binary = {
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
    "findMembersByUsername": {
      "map": "function (doc) {\n  if(doc.username||doc.luser||doc.ruser) \n\r emit(doc.username, doc);\n}"
    },
    "findMembersByIndexes": {
      "map": "function (doc) {\n\r emit(doc.index, doc);\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }

  },
  "language": "javascript"
};
var __design_package = {
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
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_package_details = {
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
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_coupling_score = {
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
    },
    "findByUserGui": {
      "map": "function (doc) {\n  emit(doc.usergui, doc);\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_packagedetails = {
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
    "findActiveByUserName": {
      "map": "function (doc) {\n  if(doc.isactivated) \n emit(doc.username, doc);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }

  },
  "language": "javascript"
};
var __design_payment = {
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
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    },
    "findCountByUsername": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.username, 1);\n}"
    },
    "findCountPaymentRequestByUsername": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.paymentreason=='payment request') \n emit(doc.username, 1);\n}"
    },
    "findCountCashingRequestByUsername": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.paymentreason=='cashing request') \n emit(doc.username, 1);\n}"
    },
    "findPaymentRequestByUsername": {
      "map": "function (doc) {\n if(doc.paymentreason=='payment request') \n  emit(doc.username, doc);\n}"
    },
    "findCashingRequestByUsername": {
      "map": "function (doc) {\n if(doc.paymentreason=='cashing request') \n  emit(doc.username, doc);\n}"
    },
    "findCountPaymentRequest": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.paymentreason=='payment request') \n emit(null, 1);\n}"
    },
    "findCountCashingRequest": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.paymentreason=='cashing request') \n emit(null, 1);\n}"
    },
    "findPaymentRequest": {
      "map": "function (doc) {\n if(doc.paymentreason=='payment request') \n  emit(null, doc);\n}"
    },
    "findCashingRequest": {
      "map": "function (doc) {\n if(doc.paymentreason=='cashing request') \n  emit(null, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_topupfailure = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(1);\n}"
    },
    "findCountByUsername": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username) \n emit(doc.username);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  emit(doc.username, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_operatorLogCenterBalance = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findByDate": {
      "map": "function (doc) {\n  emit(doc.createddate, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_operatorCenterBalance = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findByDate": {
      "map": "function (doc) {\n  emit(doc.createddate, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_operatorbalance = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null,1);\n}"
    },
    "findCountByUsername": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.username) \n emit(doc.username,1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findByUsername": {
      "map": "function (doc) {\n  if(doc.username) \n emit(doc.username, doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_introductionslog = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findCountByMonthYear": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.month,doc.year],1);\n}"
    },
    "findByMonthYear": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  emit([doc.month,doc.year], doc);\n}"
    },
    "findByIntroductorMonthYear": {
      "map": "function (doc) {\n  emit([doc.introductor,doc.month,doc.year], doc);\n}"
    },
    "findCountByIntroductorMonthYear": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.introductor,doc.month,doc.year],1);\n}"
    },

  },
  "language": "javascript"
};
var __design_introductions = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findCountByMonthYear": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.month,doc.year],1);\n}"
    },
    "findByMonthYear": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  emit([doc.month,doc.year,doc.count], doc);\n}"
    },
    "findByUsernameMonthYear": {
      "map": "function (doc) {\n  emit([doc.username,doc.month,doc.year], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_useracceslog = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(doc.accesseddate,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null,1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findCountByUserNameAccessedDate": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.username,doc.accesseddate],1);\n}"
    },
    "findByUserNameAccessedDate": {
      "map": "function (doc) {\n  emit([doc.username,doc.accesseddate],1);\n}"
    }

  },
  "language": "javascript"
};
//console.log(createTodayRange());
//insertTest();
//fetchTest();
function createTodayRange() {
  var dateobj = convertTZ(new Date());
  var day = dateobj.getDate();
  var year = dateobj.getFullYear();
  var month = dateobj.getMonth() + 1;
  console.log(dateobj);
  var startTime = [year, month, day];
  console.log(startTime);
  return convertTZ(new Date());
}

function insertTest() {
  db = create_db("test");
  db.view(__design_view, "findByName", {
    key: [new Date("2017-08-23T15:26:27.001Z")],
    include_docs: true
  }, function (err, res) {
    if (err) console.log(err);
    else {
      if (res.rows.length) {
        res.rows.forEach(function (element) {
          console.log(element.value);
          //element.value.createddate=new Date();
          //db.insert(element.value,element.value._id,function(err,res){});
        }, this);
      } else {
        console.log("no test record");
      }
    }
  });
}

function fetchTest() {
  db = create_db("test");
  db.view(__design_view, "findByName", {
    keys: ["a", "ab"],
    include_docs: true
  }, function (err, res) {
    if (err) console.log(err);
    else {
      if (res.rows.length) {
        res.rows.forEach(function (element) {
          console.log(element.value);
        }, this);
      } else {
        console.log("no test record");
      }
    }
  });
}















function init_db(dbname, design) {
  // create a new database
  var db;
  async.eachSeries([
    db = create_db(dbname),
    db = nano.use(dbname),
    db.insert(design, function (err, res) {
      if (err) {
        db.get('_design/objectList', function (err, res) {
          if (err) console.log('could not find design ' + err.message);
          else {
            if (res) {
              var d = res;
              //console.log("d:"+JSON.stringify(d));
              db.destroy('_design/objectList', d._rev, function (err, res) {
                if (err) console.log(err);
                else {
                  //console.log(res);
                  db.insert(design, "_design/objectList", function (err, res) {
                    if (err) console.log('err insert new design ' + dbname);
                    else {
                      console.log('insert completed ' + dbname);
                    }
                  });
                }
              });
            } else {
              console.log("could not find design");
            }
          }
        });
      } else
        console.log('created design ' + dbname);
    })
  ], function (err) {
    console.log('exist ' + dbname);
  });
  //db = nano.use(dbname);
  //return db;
}







function authentication_path(path) {
  switch (path) {
    case "/bonus_balance_list_by_user":
      return 2;
    case "/bonus_to_main_balance":
      return 2;
    case "/cashing_list_by_username":
      return 2;
    case "/cashing_request":
      return 2;
    case "/cashing_request_list_admin":
      return 1;
    case "/change_password":
      return 2;
    case "/check_main_balance_by_user":
      return 2;
    case "/check_register_available_username":
      return 2;
    case "/check_register_max_phone":
      return 2;
    case "/check_register_need_balance_per_package":
      return 2;
    case "/check_register_password":
      return 2;
    case "/check_register_sponsor_code":
      return 2;
    case "/default_master":
      return 0;
    case "/get_member_count_by_package":
      return 2;
    case "/get_member_count_by_username":
      return 2;
    case "/get_package":
      return 2;
    case "/get_package_details":
      return 2;
    case "/get_routes":
      return 0;
    case "/get_sample":
      return 0;
    case "/get_topup_balance_by_user":
      return 2;
    case "/get_user_binary":
      return 2;
    case "/get_userdata":
      return 2;
    case "/heartbeat":
      return 2;
    case "/init_client":
      return 0;
    case "/login":
      return 0;
    case "/logout":
      return 2;
    case "/main_balance_list_by_user":
      return 2;
    case "/pay_first_balance":
      return 2;
    case "/pay_offer":
      return 2;
    case "/payment_list_admin":
      return 1;
    case "/payment_list_by_username":
      return 2;
    case "/payment_request":
      return 2;
    case "/payment_request_list_admin":
      return 1;
    case "/payment_request_list_by_username":
      return 2;
    case "/register":
      return 2;
    case "/send_bonus_topup":
      return 1;
    case "/send_offer":
      return 1;
    case "/show_admin_accessed_log":
      return 1;
    case "/show_bonus_topup_list":
      return 1;
    case "/show_coupling_list_by_user":
      return 2;
    case "/show_latest_members":
      return 2;
    case "/show_latest_members_list":
      return 2;
    case "/show_offer_list":
      return 2;
    case "/show_operator_failure":
      return 2;
    case "/show_operator_failure_by_user":
      return 2;
    case "/show_the_best_friend_by_month_year":
      return 2;
    case "/show_user_accessed_log":
      return 2;
    case "/topup":
      return 2;
    case "/transfer":
      return 2;
    case "/update_cashing_request":
      return 1;
    case "/update_payment_request":
      return 1;
    case "/upgrade":
      return 2;
    default:
      return 0;
  }
  return 0;
}





// function set_heartbeat_interval(client,resp){
//       client.clientuid=uuidV4();

//       set_client(client,resp);
//       set_authentication(client);
// }
/** */
app.post('/register', function (req, res) { //client.data.user
  var js = {};
  js.client = req.body;
  register(js.client.data.user, res);
});



init_redis();
init_db('adminaccesslog', __design_useracceslog);
init_db('useraccesslog', __design_useracceslog);
init_db('authorize', __design_authorize);
init_db('introductions', __design_introductions);
init_db('introductionslog', __design_introductionslog);
init_db('bonusbalance', __design_balance);
init_db('couplingscore', __design_coupling_score);
init_db('topupfailure', __design_topupfailure);
init_db('mainbalance', __design_balance);
init_db('topupbalance', __design_balance);
init_db('topupbalancesum', __design_balance);
init_db('operatorlogcenterbalance', __design_operatorLogCenterBalance);
init_db('operatorcenterbalance', __design_operatorCenterBalance);
init_db('operatorbalance', __design_operatorbalance);
//init_db('bonustopupbalance',__design_balance);
init_db('packagedetails', __design_packagedetails);
init_db('bonustopupbalance', __design_bonustopupbalance);
init_db('payment', __design_payment);
//init_db("system",__desing_system); 
init_db('user', __design_user);
init_db('userbinary', __design_binary);
init_db('package', __design_package);

init_master_user();
init_default_package();

function init_redis() {
  r_client.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
}

function init_default_master_user(js) {
  var db = create_db("user");
  db.view(__design_view, "findTopUser", function (err, res) {
    if (!err) {
      //__master_user._rev=res.rows[0].value._rev; // always update master user
      __master_user._rev = res.rows[0].value._rev;
      db.insert(__master_user, __master_user.gui, function (err, res) {
        //console.log(err); 
        if (err) {
          js.client.data.message = err;
          js.resp.send(js.client);
        } else {
          r_client.setAsync("__Master", JSON.stringify(__master_user)).then(function (body) {}).catch(function (err) {
            throw new Error("could not set master user for redis" + err);
            js.client.data.message = err;
            js.resp.send(js.client);;
          }).done();
          console.log("top user created!");
          js.resp.send("done!");
        }
      });
    } else {
      var l = {
        log: ("error %s", JSON.stringify(err)),
        logdate: convertTZ(new Date()),
        type: "error",
        gui: uuidV4()
      };
      logging(l);
      console.log(err);
      js.client.data.message = err;
      js.resp.send(js.client);;
    }

  });
}

function init_master_user() {
  var db = create_db("user");
  console.log("init master");
  r_client.getAsync("__Master").then(function (body) {
    //console.log("body: "+body);
    if (!body) {
      db.view(__design_view, "findTopUser", function (err, res) {
        // console.log("res"+JSON.stringify(res.rows[0].value));
        if (err) {
          //insert a top user
          console.log(err);
          //  db.insert(__master_user,__master_user.gui,function(err,res){
          //   //console.log(err); 
          //    if(err){
          //      throw new Error(err);
          //    }
          //    else{
          //      r_client.setAsync("__Master",JSON.stringify(__master_user)).then(function(body){

          //      }).catch(function(err){
          //        throw new Error("could not set master user for redis"+err);
          //      }).done();
          //      console.log("top user created!");
          //    }
          //  });
        } else if (res.rows.length) {
          console.log(res.rows);
          r_client.setAsync("__Master", JSON.stringify(res.rows[0].value)).then(function (body) {
            console.log('setAsync');
            console.log("Master has been set");
            init_admin();
          }).catch(function (err) {
            throw new Error("could not set master user for redis" + err);
          }).done();
        } else {
          //__master_user._rev=res.rows[0].value._rev; // always update master user
          db.insert(__master_user, __master_user.gui, function (err, res) {
            //console.log(err); 
            if (err) {
              throw new Error(err);
            } else {
              r_client.setAsync("__Master", JSON.stringify(__master_user)).then(function (body) {

              }).catch(function (err) {
                throw new Error("could not set master user for redis" + err);
              }).done();
              console.log("top user created!");
            }
          });
        }

      });
    } else {
      __master_user = JSON.parse(body);
    }
  });
}

function init_default_package() {
  var db = create_db("package");
  console.log("init package");
  r_client.getAsync("__Package").then(function (body) {
    if (!body) {
      db.view(__design_view, "findAll", function (err, res) {
        if (err) {
          console.log("error find default package")
        } else if (res.rows.length) {
          var arr = [];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
          r_client.setAsync("__Package", JSON.stringify(arr)).then(function (body) {
            console.log("default Package has been set");
            __default_package = arr;
          }).catch(function (err) {
            throw new Error("could not set default package for redis" + err);
          }).done();
        } else {
          var p = [];
          p.push({
            _id: "4f095522-f461-4a0b-afc4-0ad7cf05c722",
            gui: "4f095522-f461-4a0b-afc4-0ad7cf05c722",
            packagename: "The Best Friend",
            packagevalue: 1750000,
            isactive: true,
            createddate: convertTZ(new Date()),
          });
          p.push({
            _id: "afb6420f-26e6-4fab-87fd-b1d7a26fdfd5",
            gui: "afb6420f-26e6-4fab-87fd-b1d7a26fdfd5",
            packagename: "Close Friend",
            packagevalue: 350000,
            isactive: true,
            createddate: convertTZ(new Date()),
          });
          p.push({
            _id: "f8d36fb4-575e-4aaa-bd85-099031077699",
            gui: "f8d36fb4-575e-4aaa-bd85-099031077699",
            packagename: "The Friend",
            packagevalue: 100000,
            isactive: true,
            createddate: convertTZ(new Date()),
          });

          db.bulk({
            docs: p
          }, function (err, res) {
            if (err) console.log("package" + err);
            else {
              console.log("package" + res);
            }
          });
          r_client.setAsync("__Package", JSON.stringify(arr)).then(function (body) {
            console.log("default Package has been set");
            __default_package = p;
          }).catch(function (err) {
            throw new Error("could not set default package for redis" + err);
          }).done();
        }
      });
    }
    //else __default_package=JSON.parse(body);
  });
}



function showBonusBalance(js) {
  var db = create_db("bonusBalance");
  countBonusBalanceByUsername(js.client).then(function (res) {
    var count = res;
    findBonusBalanceByUsername(js.client, js.client.data.page, js.client.data.maxpage).then(function (arr) {
      js.client.data.balance = {
        arr: arr,
        count: count
      };
      js.resp.send(js.client);
    }).catch(function (err) {
      js.resp.send(JSON.stringify(err));
    }).done();
  }).catch(function (err) {
    js.resp.send(JSON.stringify(err));
  }).done();
}

function countBonusBalanceByUsername(user) {
  var deferred = Q.defer();
  var db = create_db('bonusbalance');
  db.view(__design_view, "findCountByUsername", {
    key: user.username,
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length)
        arr = res.rows[0].value;
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function findMainBalanceByUsername(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('mainbalance');
  db.view(__design_view, "findByUsername", {
    key: user.username,
    include_docs: true,
    descending: true,
    limit: maxpage,
    skip: page
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
};

function findBonusBalanceByUsername(user, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('bonusbalance');
  db.view(__design_view, "findByUsername", {
    key: user.username,
    include_docs: true,
    descending: true,
    limit: maxpage,
    skip: page
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
};

function addMainBalanceByUser(js, user) {
  var deferred = Q.defer();
  if (!user) user = js.user;
  if (!js.balance) throw new Error("empty balance object")
  if (js.balance.type.indexOf('main') > -1) {
    js.db = create_db('mainBalance');
  };
  js.db.view(__design_view, "findByUsername", {
    key: user.username,
    include_docs: true,
    limit: 1,
    skip: 0,
    descending: false
  }, function (err, body) {
    if (error) {
      deferred.reject(new Error(error));
    } else if (body.rows.length) {
      var b = {
        username: body.rows[0].value.username,
        usergui: body.rows[0].value.usergui,
        gui: uuidV4(),
        balance: body.rows[0].value.balance + js.balance.diffbalance,
        updated: convertTZ(new Date()),
        diffbalance: js.balance.diffbalance,
        type: js.balance.type
      };
      js.db.insert(js.balance, js.balance.gui, function (err, body) {
        if (err) {
          deferred.reject(new Error(err));
        } else {
          var db = create_db("user");
          db.view(__design_view, "findByUsername", {
            key: user.username,
            include_docs: true
          }, function (err, res) {
            if (err) deferred.reject(err);
            else {
              if (res.rows.length) {
                var u = res.rows[0].value;
                if (b.type.indexOf('main') > -1) {
                  u.mainbalance += b.balance;
                } else {
                  u.balancevalue += b.balance;
                  if (b.type == "intro") {
                    u.sponservalue += b.diffbalance;
                  }
                }
                if (b.type == "score") {
                  u.couplingbalance = 0;
                  u.couplingtotalmoney += b.diffbalance;
                }
                db.insert(u, u.gui, function (err, res) {
                  if (err) deferred.reject(err);
                  else deferred.resolve(js);
                });
              } else
                deferred.reject(new Error("Could not find this user"));
            }
          });
          //deferred.resolve(js);
        }
      });
    } else {
      var b = {
        username: user.username,
        usergui: user.gui,
        gui: uuidV4(),
        balance: js.balance.diffbalance,
        updated: convertTZ(new Date()),
        diffbalance: js.balance.diffbalance,
        type: js.balance.type
      };
      js.db.insert(js.balance, js.balance.gui, function (err, body) {
        if (err) {
          deferred.reject(new Error(err));
        } else {
          var db = create_db("user");
          db.view(__design_view, "findByUsername", {
            key: user.username,
            include_docs: true
          }, function (err, res) {
            if (err) deferred.reject(err);
            else {
              if (res.rows.length) {
                var u = res.rows[0].value;

                if (b.type.indexOf('main')) {
                  u.mainbalance = b.balance;
                } else
                  u.balancevalue += b.balance;
                if (js.balance.type == "score") {
                  u.couplingbalance = 0;
                  u.couplingtotalmoney += js.balance.diffbalance
                }
                db.insert(u, u.gui, function (err, res) {
                  if (err) deferred.reject(err);
                  else deferred.resolve(js);
                });
              } else
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
function addNewUser(js, parent, package, introductor, client) {
  var deferred = Q.defer();
  js.user.gui = uuidV4();
  js.user.usercode = js.user.username;
  js.user.createddate = convertTZ(new Date());
  js.user.memberlevel = parent.memberlevel + 1;
  js.user.parentname = parent.username;
  js.user.aboveparents = [];

  if (js.user.isleft && parent.userleftgui == "") {
    parent.userleftgui = js.user.username; // add a new member as the left side
    //parent.leftside.push(user.gui); // push new member as left side range    
    js.user.aboveparents.push(parent.username); //push the latest parent at first
    js.user.aboveparents = js.user.aboveparents.concat(parent.aboveparents); // push parent's parent first


  } else if (!js.user.isleft && parent.userrightgui == "") {
    parent.userrightgui = js.user.username; // add a new member as the right side
    //parent.rightside.push(user.gui); // push new member as right side range
    js.user.aboveparents.push(parent.username); //push the latest parent at first
    js.user.aboveparents = js.user.aboveparents.concat(parent.aboveparents); // push parent's parent first


  } else deferred.reject(new Error("position not correct"));

  js.user.packagevalue = package.packagevalue;
  js.user.packagename = package.packagename;
  js.user.packagegui = package.gui;

  /*** INIT */
  js.user.introductorgui = introductor.gui;
  js.user.introductorcode = introductor.usercode;
  js.user.registeredby = client.username;
  /*** */

  js.db.insert(js.user, js.user.username, function (err, body) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      //js.message="inserted "+JSON.stringify(body);
      //count member by new user
      // countTotalMembers(js.user.username).then(function(body){
      // totalmember, count left , right members, package1left, package1right, package2left, package2right , package3left, package3right
      js.db.insert(parent, parent.gui, function (err, res) {
        if (err) {
          deferred.reject(new Error(err));
        } else if (res) {
          js.db = create_db('userbinary');
          addBinaryTree(js, parent).then(function (body) {
            if (body) {
              console.log("add userbinary completely , + update parent");
              var db = create_db("packagedetails");
              var __doc = {
                gui: uuidV4(),
                userui: js.user.gui,
                packageui: js.package.gui,
                registerdate: convertTZ(new Date()),
                updateddate: convertTZ(new Date()),
                isactive: true,
                notactivedate: null,
              };
              // new package details
              db.insert(__doc, __doc.gui, function (err, res) {
                if (err) deferred.reject(err);
                else {
                  deferred.resolve(res);
                }
              });
            }
          });
          console.log("add user completely");
        }
      });
      // }).catch(function(err){
      // }).done();

    }
  });
  return deferred.promise;
}
// function countTotalMembers(username){
//   var deferred = Q.defer();
//   var db=create_db('user');
//   db.view(__design_view,'findByUsername',{key:username},function(err,res){
//     if(err)deferred.reject(err);
//     else{
//       if(res.rows.length){
//         var u=res.rows[0].value;
//         db.view(__design_view,'findByUsername',{key:u.parentname},function(err,res){
//           if(err)deferred.reject(err);
//           else{
//             if(res.rows.length){
//               var p=res.rows[0].value;              
//               if(u.isleft){
//                 p.leftside++;
//                 if(u.packagevalue==100000){
//                   p.package1left++;
//                 }
//                 else if(u.packagevalue==350000){
//                   p.package2left++;
//                 }
//                 else if(u.packagevalue==1750000){
//                   p.package3left++;
//                 }
//               }                
//               else{
//                 p.rightside++;
//                 if(u.packagevalue==100000){
//                   p.package1right++;
//                 }
//                 else if(u.packagevalue==350000){
//                   p.package2right++;
//                 }
//                 else if(u.packagevalue==1750000){
//                   p.package3right++;
//                 }
//               }                
//               db.insert(p,p.gui,function(err,res){
//                 if(err) deferred.reject(err);
//                 else{
//                   if(p.username!=p.parentname){
//                     countTotalMembers(p.username).then(function(body){                      
//                     }).catch(function(err){
//                       deferred.reject(err);
//                     }).done();
//                   }
//                   else{
//                     deferred.resolve(res);
//                   }
//                 }
//               });
//             }
//             else{
//               deferred.reject(new Error('not found this user'));
//             }
//           }
//         });
//       }
//       else{
//         deferred.reject(new Error('not found this user'));
//       }
//     }
//   });
//   return deferred.promise;
// }
function addBinaryTree(js, parent) {
  var deferred = Q.defer();
  var __doc = { // for current user
    usergui: js.user.gui,
    username: js.user.username,
    createddate: convertTZ(new Date()),
    updateddate: convertTZ(new Date()),
    luser: "",
    ruser: "",
    parent: parent.username,
    level: parent.memberlevel + 1,
    gui: uuidV4()
  };
  var p = { // for parents
    usergui: "",
    username: "",
    createddate: null,
    updateddate: null,
    luser: "",
    ruser: "",
    level: 0,
    parent: '',
    gui: uuidV4()
  };
  //js.db=create_db('userbinary');
  js.db.view(__design_view, "findUserByUsername", {
    key: parent.username,
    include_docs: true
  }, function (err, res) {
    if (err)
      deferred.reject(err);
    else {
      if (res.rows.length) {
        p = res.row[0].value;
        p.updateddate = convertTZ(new Date());
        if (js.user.isleft) {
          if (!p.luser)
            p.luser = js.user.username;
          else
            deferred.reject(new Error('left user exist for ' + p.usergui));
        } else {
          if (!p.ruser)
            p.ruser = js.user.username;
          else
            deferred.reject(new Error('right user exist for ' + p.usergui));
        }
        //p.level++;
        js.db.insert(p, p.gui, function (err, res) {
          if (err)
            throw new Error(err);
          else {
            js.db.insert(__doc, __doc.gui, function (err, res) {
              if (err)
                throw new Error(err);
              else
                deferred.resolve(__doc);
            });
          }
        });
      } else {
        deferred.reject(new Error('could not find a user by this GUI'));
      }
    }
  });

  return deferred.promise;
}



function register(register /*,needbalance*/ , resp) { //needbalance={main:0.5,bunus:0.5}
  var __doc = {
    username: "", // show *
    password: "", //show*
    usercode: "",
    createddate: convertTZ(new Date()), //not show
    gui: uuidV4(), //not show
    email: "", //show *
    phone1: "", //show *
    phone2: "", // show
    address: "", //show
    photo: "", //show
    memberlevel: "", // show , current level + 1
    ispaired: false, // not show
    parentgui: "",
    parentname: "", //as a userid or parentid  as a client GUI or current user gui
    isleft: false, // not show
    //isB:false,
    userleftgui: "", // not show
    userrightgui: "", // not show
    aboveparents: "",
    leftside: 0,
    rightside: 0,
    package1left: 0,
    package1right: 0,
    package2left: 0,
    package2right: 0,
    package3left: 0,
    package3right: 0,

    packagevalue: 0, //not show
    packagename: "", // not show
    packagegui: "", // not show
    balancevalue: 0, // total the rest balance from all income: introduction, bonus , coupoling
    Lcoupling: 0, //not show
    Rcoupling: 0, // not show
    couplingbalance: 0, // the rest balance after get from couplingscore , need to consider when need to pay, 
    couplingtotalmoney: 0, // the money collected from couplingscore
    introductorgui: "", //not show
    introductorcode: "",
    isfreeuser: true,
    registeredby: "",
    maxproduct: 0,
    maxpaid: 0,
    firstbalance: 0,
    mainbalance: 0,
    offeredbonus: 0,
    topupbalance: 0,
    bonustopupbalance: 0
  };
  var payment = {
    usergui: "",
    username: "",
    paymentdate: convertTZ(new Date()),
    paymentvalue: 0,
    paymentby: "",
    paidbygui: "",
    payreason: "",
    attache: "",
    description: "",
    gui: uuidV4()
  };
  var bonusBalance = { // score , introduction
    username: "",
    usergui: "",
    gui: "",
    balance: 0,
    updated: convertTZ(new Date()),
    diffbalance: 0,
    remark: ""
  };
  var topupBalance = { // for topup only, 
    username: "",
    usergui: "",
    gui: "",
    balance: 0,
    updated: convertTZ(new Date()),
    diffbalance: 0,
    remark: ""
  };
  var mainBalancet = { // real money from pe-paid at company, 
    username: "",
    usergui: "",
    gui: "",
    balance: 0,
    updated: convertTZ(new Date()),
    diffbalance: 0,
    remark: ""
  };
  var bonusTopupBalance = { // for topup only, 
    username: "",
    usergui: "",
    gui: "",
    balance: 0,
    updated: convertTZ(new Date()),
    diffbalance: 0,
    remark: ""
  };
  var client = __cur_client;

  var js = {
    db: create_db("user"),
    client: client,
    resp: resp,
    user: register /*,needbalance:needbalance*/
  };
  js.topuser = __master_user;

  // find client exist ==>
  findClientExist(js).then(function (body) {
    // find user  ==>
    var registra = body;
    js.registra = registra;
    findUserByUserName(registra).then(function (body) {
      // find if a new user is qualify for max phone number  ==>
      js.user.password = js.user.password.trim();
      if (body.length > 0)
        throw Error('you could not use this username');
      if (!validatePassword(js.user.password))
        throw Error('password must be length >=6');
      // FIND max number can use to register a new account ==>
      findMaxPhoneNumber(js.user).then(function (body) {

        if (body.length > 3) throw new Error("this number could not be registered in more than 3 accounts");
        // find a parent
        findParentByUsername(js).then(function (body) {
          // find introductioncode
          var parent = body[0];

          // MUST be UPLINE ONLY TODO* MUST BE UPLINE, PUT aboveparents property to solve this problem ==>
          findUserByIntroductionCode(js).then(function (body) {
            var introductor = body;

            if (introductor.gui != parent.gui || parent.aboveparents.indexOf(introductor.username) < 0) {
              throw new Error("introductor code is not in the same upline");
            }
            // find register package , later use this for upgrade ==>
            js.db = create_db("package");
            findRegisterPackageByUser(js).then(function (body) {
              var package = body;

              //js.db=create_db("bonusBalance");// find both bonus balance and register balance for registration
              findNeedBalanceByUserGui(js, registra).then(function (body) {
                var registrabalance = body;

                if ( /*registrabalance.bonus.balance!=registra.balancevalue||*/ registrabalance.main.balance != registra.mainbalance) {
                  throw new Error('balance is abnormal please contact admin');
                }
                // TODO** IF BALANCE NOT ENOUGH COULD NOT MAKE A REGISTER  ==>OK
                // need to check if bonus balance or main balance must be use not less than 50% of each, and sum of both must be enough for register

                // if(/*js.needbalance.main>registrabalance.main.balance||*/js.needbalance.bonus>registrabalance.bonus.balance)
                //   throw new Error('balance is abnormal please contact admin');

                // // if(js.needbalance.bonus.balance>package.packagevalue/2){
                // //   throw new Error("max register amount is 50%");
                // // }                  
                // if((js.needbalance.main/*+js.needbalance.bonus*/)!=package.packagevalue){
                //   throw new Error("register value and package has not equal value");
                // }
                //completeRegistration(js,parent,package,introductor,client,maxproduct,maxpaid,firstbalance,introductionvalue,fee,theregistrabalance,score)
                switch (registra.packagevalue) {
                  case 1750000:
                    switch (package.packagevalue) {
                      case 1750000:
                        {
                          completeRegistration(js, parent, package, introductor, client, registrabalance, registra, false, 75, 1750000, 125000, 250000, 5 * 107500, 837500, 100000);
                          // process payment on other processinvoice
                        }
                      case 350000:
                        {
                          completeRegistration(js, parent, package, introductor, client, registrabalance, registra, false, 15, 350000, 25000, 50000, 107500, 167500, 20000);
                        }
                      case 100000:
                        {
                          completeRegistration(js, parent, package, introductor, client, registrabalance, registra, true, 0, 0, 25000, 40000, 35000, 0, 0);
                        }
                    }
                  case 350000:
                    switch (package.packagevalue) {
                      case 1750000:
                        {
                          completeRegistration(js, parent, package, introductor, client, registrabalance, registra, false, 75, 1750000, 125000, 200000, 5 * 107500, 837500, 100000);
                          // process payment on other processinvoice
                        }
                      case 350000:
                        {
                          completeRegistration(js, parent, package, introductor, client, registrabalance, registra, false, 15, 350000, 25000, 40000, 107500, 167500, 20000);
                        }
                      case 100000:
                        {
                          completeRegistration(js, parent, package, introductor, client, registrabalance, registra, true, 0, 0, 25000, 40000, 35000, 0, 0);
                        }
                    };
                  case 100000:
                    {
                      js.resp.send(JSON.stringify(new Error("could not be registered please upgrade your package")));
                    }

                }
              });
            });
          });
        });
      });
    });
  }).catch(function (err) {
    js.resp.send(JSON.stringify(err));
  }).done();

}

function completeRegistration(js, parent, package, introductor, client, isfree, maxproduct, maxpaid, firstbalance, introductionvalue, fee, theregistrabalance, score) {
  /////// Insert a new user

  //var isfree=false;
  js.user.gui = uuidV4();
  js.user.isfreeuser = isfree;
  js.user.maxproduct = maxproduct;
  //js.user.isB=parent.isB;
  js.user.maxpaid = maxpaid; //// 1750000 daily max payment                          
  js.user.memberlevel = parent.memberlevel + 1;
  js.user.createddate = convertTZ(new Date());

  js.db = create_db("user");
  // add a new user
  // add new binary tree 

  addNewUser(js, parent, package, introductor, client).then(function (body) {
    var month = convertTZ(new Date()).getMonth() + 1;
    var year = convertTZ(new Date()).getFullYear();
    addTheBestFriendByMonthYear(introductor, month, year).then(function (boy) {
      addTheBestFriendLog(js.user, introductor, month, year).then(function (body) {
        js.user.firstbalance = firstbalance; // 125.000 top-up new user added
        js.balance = {
          username: js.user.username,
          usergui: js.user.gui,
          gui: uuidV4(),
          balance: 0,
          updated: convertTZ(new Date()),
          diffbalance: 0,
          type: "none"
        };

        //js.balance.balance+=js.balance.diffbalance;
        //var js={db:create_db('balance'),balance:balance};
        js.db = create_db('bonusBalance');
        // add top up value for a new user 125.000 --- OK
        addMainBalanceByUser(js, js.user).then(function (body) {
          console.log(body);
          var __doc = {
            usergui: js.user.gui,
            username: js.user.username,
            paymentdate: convertTZ(new Date()),
            paymentvalue: js.user.firstbalance,
            paymentby: __master_user.username,
            paidbygui: __master_user.gui,
            payreason: "system first balance",
            bankinfo: '',
            targetuser: js.user.username,
            status: "approved",
            attache: "",
            description: "",
            receiveddate: convertTZ(new Date()),
            certifieddate: convertTZ(new Date()),
            approveddate: convertTZ(new Date()),
            gui: uuidV4()
          };
          makePayment(__doc).then(function (body) {
            //// insert  to introductor 250.000 ---OK
            js.balance = {
              username: introductor.username,
              usergui: introductor.gui,
              gui: uuidV4(),
              balance: 0,
              updated: convertTZ(new Date()),
              diffbalance: introductionvalue,
              type: "intro"
            };
            js.balance.balance += js.balance.diffbalance;
            js.introductor = introductor;

            addMainBalanceByUser(js, introductor).then(function (body) {
              console.log(body);
              var __doc = {
                usergui: introductor.gui,
                username: introductor.username,
                paymentdate: convertTZ(new Date()),
                paymentvalue: introductionvalue,
                paymentby: __master_user.username,
                paidbygui: __master_user.gui,
                payreason: "system intro",
                bankinfo: "",
                targetuser: introductor.username,
                status: "approved",
                attache: "",
                description: "",
                receiveddate: convertTZ(new Date()),
                certifieddate: convertTZ(new Date()),
                approveddate: convertTZ(new Date()),
                gui: uuidV4()
              };
              makePayment(__doc);

              js.balance = {
                username: js.topuser.username,
                usergui: js.topuser.gui,
                gui: uuidV4(),
                balance: 0,
                updated: convertTZ(new Date()),
                diffbalance: fee,
                type: "fee"
              };
              js.balance.balance += js.balance.diffbalance;
              addMainBalanceByUser(js, js.topuser).then(function (body) {
                //// the rest money===> 1750000- 125000- 250.000- 107500 -100000 =1.167.500
                // normally each parent get 100.000 max, but limit by max pay and total parent will get average value 
                // by total number of parent.
                //js.db=create_db("user");
                var __doc = {
                  usergui: js.topuser.gui,
                  username: js.topuser.username,
                  paymentdate: convertTZ(new Date()),
                  paymentvalue: fee,
                  paymentby: __master_user.username,
                  paidbygui: __master_user.gui,
                  payreason: "system fee",
                  bankinfo: "",
                  targetuser: js.topuser.username,
                  status: "approved",
                  attache: "",
                  description: "",
                  receiveddate: convertTZ(new Date()),
                  certifieddate: convertTZ(new Date()),
                  approveddate: convertTZ(new Date()),
                  gui: uuidV4()
                };
                makePayment(__doc);

                js.parent = parent;
                js.theregistrabalance = theregistrabalance;
                // get all above parent , 

                var totalparent = 0;
                js.db = create_db("user");
                js.score = score;
                ////return score to all parent 100.000 OK
                addCouplingScore(js, parent).then(function (body) {
                  //********************TODO */
                  var pArr = parent.aboveparents;
                  pArr.push(parent.username);
                  //pArr=pArr.reverse();
                  // find qualified above parents
                  //js.theregistrabalance
                  //TODO: qualifiedParents
                  // - balance >0 on couplingscore
                  js.db = create_db("user");

                  searchForQualifiedParents(js, pArr).then(function (body) {
                    var qp = body;
                    var averageValue = js.theregistrabalance / qp.length;
                    var theRestValue = 0;
                    // pretend overppay  
                    if (averageValue > js.score) {
                      theRestValue = (js.score - averageValue) * qp.length; //add to topuser
                      averageValue = js.score; //this value add to every above qualified parent
                      // TODO : NEED TO ADD TO TOPUSER here
                      js.balance = {
                        username: js.topuser.username,
                        usergui: js.topuser.gui,
                        gui: uuidV4(),
                        balance: 0,
                        updated: convertTZ(new Date()),
                        diffbalance: theRestValue,
                        type: "rest"
                      };
                      js.db = create_db("bonusBalance");
                      addMainBalanceByUser(js, js.topuser).then(function (body) {
                        if (body) {
                          console.log("rest value has been added to topup ");
                          var __doc = {
                            usergui: js.topuser.gui,
                            username: js.topuser.username,
                            paymentdate: convertTZ(new Date()),
                            paymentvalue: theRestValue,
                            paymentby: __master_user.username,
                            paidbygui: __master_user.gui,
                            attache: "",
                            bankinfo: "",
                            targetuser: js.topuser.username,
                            status: "approved",
                            payreason: "system rest",
                            description: "",
                            receiveddate: convertTZ(new Date()),
                            certifieddate: convertTZ(new Date()),
                            approveddate: convertTZ(new Date()),
                            gui: uuidV4()
                          };
                          makePayment(__doc);
                        }
                      });
                    }
                    // - under limit of max paid per day
                    for (var index = 0; index < qp.length; index++) {
                      var db = create_db("bonusBalance");
                      var now = convertTZ(new Date());
                      var nowArr = [now.getFullYear(), (now.getMonth() + 1), now.getDate()];
                      db.view(__design_view, "findBalanceByUserAndDate", {
                        key: [nowArr, qp[index].username], // create a funtion today value only
                        include_docs: true,
                      }, function (err, res) {
                        if (err) throw new Error(err);
                        else {
                          if (res.rows.length) {
                            var sum = 0;
                            for (var i = 0, len = res.rows.length; i < len; i++) {
                              if (rews.rows[i].value.type == "score") // score, introduction, fee ,
                                sum += res.rows[i].value.balance;
                            }
                            if (sum > qp[index].maxpaid) { // ignore payment for this transaction
                              // insert to topuser balance
                              // update topuser
                              js.balance = {
                                username: js.topuser.username,
                                usergui: js.topuser.gui,
                                gui: uuidV4(),
                                balance: 0,
                                updated: convertTZ(new Date()),
                                diffbalance: averageValue,
                                type: "over-recieved"
                              };
                              addMainBalanceByUser(js, js.topuser).then(function (body) {
                                if (body) {
                                  // insert to qp balance
                                  // update qp
                                  var __doc = {
                                    usergui: js.topuser.gui,
                                    username: js.topuser.username,
                                    paymentdate: convertTZ(new Date()),
                                    paymentvalue: averageValue,
                                    paymentby: __master_user.username,
                                    paidbygui: __master_user.gui,
                                    payreason: "system over-recieved",
                                    attache: "",
                                    bankinfo: "",
                                    targetuser: js.topuser.username,
                                    status: "approved",
                                    description: "",
                                    receiveddate: convertTZ(new Date()),
                                    certifieddate: convertTZ(new Date()),
                                    approveddate: convertTZ(new Date()),
                                    gui: uuidV4()
                                  };
                                  makePayment(__doc);
                                  js.balance = {
                                    username: qp[index].username,
                                    usergui: qp[index].gui,
                                    gui: uuidV4(),
                                    balance: 0,
                                    updated: convertTZ(new Date()),
                                    diffbalance: 0,
                                    type: "score"
                                  };
                                  addMainBalanceByUser(js, qp[index]).then(function (body) {
                                    if (body) {
                                      var __doc = {
                                        usergui: qp[index].gui,
                                        username: qp[index].username,
                                        paymentdate: convertTZ(new Date()),
                                        paymentvalue: 0,
                                        paymentby: __master_user.username,
                                        paidbygui: __master_user.gui,
                                        payreason: "system score",
                                        attache: "",
                                        bankinfo: "",
                                        targetuser: qp[index].username,
                                        status: "approved",
                                        description: "",
                                        receiveddate: convertTZ(new Date()),
                                        certifieddate: convertTZ(new Date()),
                                        approveddate: convertTZ(new Date()),
                                        gui: uuidV4()
                                      };
                                      makePayment(__doc);
                                      deductBalanceForRegister(js);
                                      console.log("update user couplingscore completed");
                                    }
                                  });
                                }
                              });
                            }
                            if (sum + averageValue > qp[index].maxpaid) {
                              var averageValue2 = (sum + averageValue) - qp[index].maxpaid
                              // insert to topuser balance
                              // update topuser
                              js.balance = {
                                username: js.topuser.username,
                                usergui: js.topuser.gui,
                                gui: uuidV4(),
                                balance: 0,
                                updated: convertTZ(new Date()),
                                diffbalance: averageValue2,
                                type: "over-recieved"
                              };
                              addMainBalanceByUser(js, js.topuser).then(function (body) {
                                if (body) {
                                  // insert to qp balance
                                  // update qp
                                  var __doc = {
                                    usergui: js.topuser.gui,
                                    username: js.topuser.username,
                                    paymentdate: convertTZ(new Date()),
                                    paymentvalue: averageValue2,
                                    paymentby: __master_user.username,
                                    paidbygui: __master_user.gui,
                                    payreason: "system over-recieved",
                                    attache: "",
                                    bankinfo: "",
                                    targetuser: js.topuser.username,
                                    status: "approved",
                                    description: "",
                                    receiveddate: convertTZ(new Date()),
                                    certifieddate: convertTZ(new Date()),
                                    approveddate: convertTZ(new Date()),
                                    gui: uuidV4()
                                  };
                                  makePayment(__doc);
                                  js.balance = {
                                    username: qp[index].username,
                                    usergui: qp[index].gui,
                                    gui: uuidV4(),
                                    balance: 0,
                                    updated: convertTZ(new Date()),
                                    diffbalance: averageValue - averageValue2,
                                    type: "score"
                                  };
                                  addMainBalanceByUser(js, qp[index]).then(function (body) {
                                    if (body) {
                                      var __doc = {
                                        usergui: qp[index].gui,
                                        username: qp[index].username,
                                        paymentdate: convertTZ(new Date()),
                                        paymentvalue: js.balance,
                                        paymentby: __master_user.username,
                                        paidbygui: __master_user.gui,
                                        payreason: "system over-recieved",
                                        attache: "",
                                        bankinfo: "",
                                        targetuser: qp[index].username,
                                        status: "approved",
                                        description: "",
                                        receiveddate: convertTZ(new Date()),
                                        certifieddate: convertTZ(new Date()),
                                        approveddate: convertTZ(new Date()),
                                        gui: uuidV4()
                                      };
                                      makePayment(__doc);
                                      deductBalanceForRegister(js);
                                      console.log("update user couplingscore completed" + qp[index].username);

                                    }
                                  });
                                }
                              });

                            } else {

                              js.balance = {
                                username: qp[index].username,
                                usergui: qp[index].gui,
                                gui: uuidV4(),
                                balance: 0,
                                updated: convertTZ(new Date()),
                                diffbalance: averageValue,
                                type: "score"
                              };
                              addMainBalanceByUser(js, qp[index]).then(function (body) {
                                if (body) {
                                  // update couplingscore of qp[index] current user
                                  var __doc = {
                                    usergui: qp[index].gui,
                                    username: qp[index].username,
                                    paymentdate: convertTZ(new Date()),
                                    paymentvalue: js.balance,
                                    paymentby: __master_user.username,
                                    paidbygui: __master_user.gui,
                                    payreason: "system over-recieved",
                                    attache: "",
                                    bankinfo: "",
                                    targetuser: qp[index].username,
                                    status: "approved",
                                    description: "",
                                    receiveddate: convertTZ(new Date()),
                                    certifieddate: convertTZ(new Date()),
                                    approveddate: convertTZ(new Date()),
                                    gui: uuidV4()
                                  };
                                  makePayment(__doc);
                                  js.db = create_db("user");
                                  qp[index].couplingbalance = 0;
                                  js.db.insert(qp[index], qp[index].gui, function (err, res) {
                                    if (err)
                                      throw new Error(err);
                                    else {
                                      deductBalanceForRegister(js);
                                      console.log("update user couplingscore completed" + qp[index].username);
                                    }
                                  });
                                }
                              });
                            }
                          }
                          console.log("no balance record for " + qp[index].username);
                        }
                      });
                    };

                  });

                });
              });
            });
          }).catch(function (err) {
            js.client.data.message = err;
            js.resp.send(js.client);
          }).done();
        });
      }).catch(function (err) {
        js.client.data.message = err;
        js.resp.send(js.client);;
      }).done();
    }).catch(function (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    }).done();
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);;
  }).done();
}

function deductBalanceForRegister(js) {
  // deduct money from registra user
  //mainBalance
  js.db = create_db("mainBalance");
  js.balance = {
    username: js.regsi.registra.username,
    usergui: js.regsi.registra.gui,
    gui: uuidV4(),
    balance: 0,
    updated: convertTZ(new Date()),
    diffbalance: -1 * (js.package.packagevalue),
    type: "registermain"
  };
  console.log("update user balance completed" + js.registra.username);
  addMainBalanceByUser(js, js.registra).then(function (boy) {
    if (body) {
      var __doc = {
        usergui: js.registra.gui,
        username: js.registra.username,
        paymentdate: convertTZ(new Date()),
        paymentvalue: js.balance.diffbalance,
        paymentby: __master_user.username,
        paidbygui: __master_user.gui,
        payreason: "system registermain",
        attache: "",
        bankinfo: "",
        targetuser: js.registra.username,
        status: "approved",
        description: "",
        receiveddate: convertTZ(new Date()),
        certifieddate: convertTZ(new Date()),
        approveddate: convertTZ(new Date()),
        gui: uuidV4()
      };
      makePayment(__doc);
      console.log("deduct main balance from registra completed " + registra.username);
      js.resp.send("registratrion was completed");
    }
  });
}

function findUserByUserName(user) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.view(__design_view, "findByUserName", {
    key: user.username,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length)
        arr.push(res.rows[0].value);
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function validatePassword(p) {
  if (p.length > 5) return true;
  return false;
}

function findMaxPhoneNumber(user) {
  var deferred = Q.defer();
  js.db.view(__design_view, "findByPhone", {
    key: user.phone1,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}


function findUserByIntroductionCode(js) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.view(__design_view, "findByIntroductorcode", {
    key: js.user.introductorcode,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function findClientExist(js) {
  var deferred = Q.defer();
  js.db.view(__design_view, "findExist", {
    key: js.client.username,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function findNeedBalanceByUserGui(js, registra) {
  //var userCurrentBalance=0;
  //js.needbalance={main:0.5,bonus:0.5}
  var deferred = Q.defer();
  js.db = create_db("mainBalance");
  js.db.view(__design_view, "findByGui", {
    key: registra.gui,
    include_docs: true,
    descending: true,
    limit: 1
  }, function (err, body) {
    if (err) {
      deferred.reject(err);
    } else {
      if (!body.rows.length) {
        deferred.reject(new Error("no record"));
      } else {
        mainBalance = body.rows[0].value;
        js.db = create_db("bonusBalance");
        js.db.view(__design_view, "findByGui", {
          key: registra.gui,
          include_docs: true,
          descending: true,
          limit: 1
        }, function (err, body) {
          if (err) deferred.reject(err);
          else {
            bonusBalance = body.rows[0].value;
            deferred.resolve({
              main: mainBalance,
              bonus: bonusBalance
            });
          }
        });

      }
    }
  });
  return deferred.promise;
}

function findRegisterPackageByUser(js) {
  var deferred = Q.defer();
  js.db.view(__design_view, "findByGui", {
    key: js.package.gui,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function findPackageDetailsByUser(js) {
  var deferred = Q.defer();
  js.db.view(__design_view, "findByUserGui", {
    key: js.user.gui,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function findByUserGui(js) {
  var deferred = Q.defer();
  js.db.view(__design_view, "findByUserGui", {
    key: js.user.gui,
    include_docs: true
  }, function (err, res) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}





function showCouplingScoreByUser(js) {
  js.db = create_db('couplingscore');
  getCouplingScoreByUser(js).then(function (body) {
    js.client.data.couplingscore = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);;
  });
}

function getCountCouplingScoreByUser(user) {
  var deferred = Q.defer();
  var db = create_db('couplingscore');
  db.view(__design_view, "findCountByUsername", {
    key: user.username,
    include_docs: true,
    descending: true,
  }, function (err, res) {
    if (err)
      deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          res.rows.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function getCouplingScoreByUser(js) {
  var deferred = Q.defer();
  var db = create_db('couplingscore');
  getCountCouplingScoreByUser(js.client.data.user, js.client.data.page, js.client.data.maxpage).then(function (body) {
    if (body) {
      var count = body[0];
      // var __doc={
      //   usergui:"",
      //   username:"",
      //   Lscore:0,
      //   Rscore:0,
      //   balance:0,
      //   createddate:convertTZ(new Date()),
      //   gui:uuidV4()
      //   };
      js.db.view(__design_view, "findByUsername", {
        key: js.client.data.user.username,
        include_docs: true,
        descending: true,
        limit: maxpage,
        skip: page
      }, function (err, res) {
        if (err)
          deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(res.rows[index].value);
            }
          }
          deferred.resolve({
            arr: arr,
            count: count
          });
        }
      });
    }
  }).catch(function (err) {
    deferred.reject(err);
  }).done();
  return deferred.promise;
}

function addCouplingScore(js, parent) { //add for above parent only, which search from first parent 
  //find exsit coupling score
  var deferred = Q.defer();
  //if(!parent) parent=js.user;
  // find first parent looks for all above parents
  js.db.view(__design_view, "findByUsername", {
    key: parent.username,
    include_docs: true,
    descending: false,
  }, function (error, result) {
    if (error)
      deferred.reject(error);
    if (result.rows.length) {
      u = result.rows[0];
      var db = create_db("couplingscore");
      // search for couplingscore data of each parent
      db.view(__design_view, "findByUsername", {
        key: u.username,
        include_docs: true,
        descending: false,
        limit: 1
      }, function (err, res) {
        if (err) deferred.reject(error);
        else {
          c = res.rows[0].value;
          //if(curUser=="")
          curUser = js.user;

          if (curUser.isleft)
            c.Lscore += js.score;
          else {
            c.Rscore += js.score;
          }
          if (c.Lscore > c.Rscore && (c.Lscore && c.Rscore)) {
            c.balance = c.Lscore - c.Rscore
            c.Lscore -= c.balance;
          } else if (c.Lscore < c.Rscore && (c.Lscore && c.Rscore)) {
            c.balance = c.Rscore - c.Lscore;
            c.Rscore -= c.balance;
          }
          // insert new couplingscore 
          js.db.insert(c, c.gui, function (err, res) {
            if (err) deferred.reject(err);
            else {
              // add coupling score to above user
              u.Lcoupling = c.Lscore; //not show
              u.Rcoupling = c.Rscore; // not show
              u.couplingbalance += c.balance; // this must be total money of balance
              //u.balancevalue=c.balance;
              //u.couplingtotalmoney+=u.balancevalue;
              //update count total member
              if (curUser.isleft) {
                u.leftside++;
                if (curUser.packagevalue == 100000) {
                  u.package1left++;
                } else if (curUser.packagevalue == 350000) {
                  u.package2left++;
                } else if (curUser.packagevalue == 1750000) {
                  u.package3left++;
                }
              } else {
                u.rightside++;
                if (curUser.packagevalue == 100000) {
                  u.package1right++;
                } else if (curUser.packagevalue == 350000) {
                  u.package2right++;
                } else if (curUser.packagevalue == 1750000) {
                  u.package3right++;
                }
              }

              js.db.insert(u, u.gui, function (err, res) {
                if (err) deferred.reject(err);
                else {
                  console.log("add coupling score to user completely " + u.username + " score:" + c.balance);
                  if (u.username != __master_user.username) {
                    js.user = curUser;
                    addCouplingScore(js, {
                      username: curUser.parentname
                    }).then(function (body) {
                      console.log("finish add coupling for " + u.username + " score:" + c.balance);
                    });
                  } else
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

function findParentByUsername(js) {
  var deferred = Q.defer();
  js.db.view(__design_view, "findByUsername", {
    key: js.user.parentname,
    include_docs: true,
    descending: false,
    limit: 1,
  }, function (err, rs) {
    if (error)
      deferred.reject(new Error(err));
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function searchForQualifiedParents(js, pArr) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.view(__design_view, "searchForQualifiedParents", {
      keys: pArr
    },
    function (err, res) {
      if (err)
        deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function findQualifiedParents(js, pArr) {
  var deferred = Q.defer();
  var db = create_db('user');
  db.view(__design_view, "findQualifiedParents", {
      key: pArr,
      include_docs: true
    },
    function (err, res) {
      if (err)
        deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}


// ສິ່ງທີ່ຈະໃຫ້ແລ້ວໃນທິດນີ້ ຫນ້າຕາແລະການເຮັດວຽກ
// - ລົງທະບຽນ ==> OK


// - ລາຍຊື່ຕາມ ຕົ້ນໄມ້ binary
// function showBinaryTree(username) {
//   var deferred = Q.defer();
//   var db = create_db("userbinary");
//   db.view(__design_view, "findByUsername", {
//     key: username,
//   }, function (err, res) {
//     if (err) deferred.reject(err);
//     else {
//       var arr = [];
//       if (res.rows.length) {
//         arr.push(res.rows[0].value)
//       }
//       deferred.resolve(arr);
//     }
//   });
//   return deferred.promise;
// }
// - ລາຍງານ, ຄະແນນ ເງິນ ຈຳນວນ ສະມາຊິກຂອງຜູ້ໃຊ້ເອງ




function showMainBalance(js) {
  var db = create_db("mainbalance");
  db.view(__design_view, "findCountByUsername", {
    key: js.client.username
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      if (res.rows.length) {
        var count = res.rows[0].value;
        db.view(__design_view, "findByUsername", {
          key: js.client.username,
          descending: true,
          limit: js.client.data.maxpage,
          skip: js.client.data.page
        }, function (err, res) {
          if (err) {
            js.client.data.message = err;
            js.resp.send(js.client);;
          } else {
            var arr = [];
            if (res.rows.length) {
              for (i = 0; l = res.rows.length, i < l; i++) {
                arr.push(res.rows[i].value);
              }
            }
            js.client.data.balance = {
              arr: arr,
              count: count
            };
            js.client.data.message = "OK";
            js.resp.send(js.client);
          }
        });
      }
    }
  });
}


function get_member_count_by_year_month(js) {
  getMemberCountByPackageYearMonth(js.client.data.user, js.client.data.package, js.client.data.my.year, js.client.data.my.month).then(function (body) {
    if (body) {
      js.client.data.user.count = body;
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getMemberCountByPackageYearMonth(user, package, year, month) {
  var deferred = Q.defer();
  var db = create_db("user");
  db.view(__design_view, "findByUsername", {
    key: user.username,
    limit: 1
  }, function (err, res) {
    if (err) deferred.reject(err);
    else if (res.rows.length) {
      db.view(__design_view, "countMembersByPackageValueMonthYear", {
        key: [user.username, package.packagevalue, [year, month]]
      }, function (err, res) {
        if (err)
          deferred.reject(err);
        else {
          // if (res.rows[0].value.packagevalue == package.packagevalue && user.ismember)
          //   deferred.resolve(res.rows[0].value + 1);
          // else
            deferred.resolve(res.rows[0].value);
        }
      });
    } else {
      deferred.resolve(0);
    }
  });
  return deferred.promise;
}

function showTotalMemberByUsername(js) {
  getMemberCountByPackage(js.client.data.user, js.client.data.package).then(function (body) {
    if (body) {
      js.client.data.user.count = body;
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getMemberCountByPackage(user, package) {
  var deferred = Q.defer();
  var db = create_db("user");
  db.view(__design_view, "findByUsername", {
    key: user.username,
    limit: 1
  }, function (err, res) {
    if (err) deferred.reject(err);
    else if (res.rows.length) {
      db.view(__design_view, "countMembersByPackageValue", {
        key: [user.username, package.packagevalue]
      }, function (err, res) {
        if (err)
          deferred.reject(err);
        else {
          // if (res.rows[0].value.packagevalue == package.packagevalue && user.ismember)
          //   deferred.resolve(res.rows[0].value + 1);
          // else
            deferred.resolve(res.rows[0].value);
        }
      });
    } else {
      deferred.resolve(0);
    }
  });
  return deferred.promise;
}

function showMemberCountByUsername(js) {
  var db = create_db('user')
  getMemberCount(js.client.data.user).then(function (body) {
    if (body) {
      js.client.data.user.count = body;
      js.resp.send(js.client);
    }
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  }).done();
}

function getMemberCount(user) {
  var deferred = Q.defer();
  var db = create_db("user");
  db.view(__design_view, "findByUsername", {
    key: user.username,
    limit: 1
  }, function (err, res) {
    if (err) deferred.reject(err);
    else if (res.rows.length) {
      db.view(__design_view, "countMembers", {
        key: user.username
      }, function (err, res) {
        if (err)
          deferred.reject(err);
        else {
          // if (user.ismember)
          //   deferred.resolve(res.rows[0].value + 1);
          // else
            deferred.resolve(res.rows[0].value);
        }
      });
    } else {
      deferred.resolve(0);
    }
  });
  return deferred.promise;
}



function countOperatorBalance() {
  var deferred = Q.defer();
  var db = create_db('operatorbalance');
  db.view(__design_view, 'findCount', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function showOperatorBalance(js) {
  var deferred = Q.defer();
  var db = create_db('operatorbalance');
  countOperatorBalance().then(function (body) {
    db.view(__design_view, 'findAll', {
      decending: true,
      skip: js.client.data.page,
      limit: js.client.data.maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {

          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve({
          arr: arr,
          count: body
        });
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();
  return deferred.promise;
}

function countOperatorBalanceByUsername(user) {
  var deferred = Q.defer();
  var db = create_db('operatorbalance');
  db.view(__design_view, 'findCountByUsername', {
    key: user.username
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {

        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function showOperatorBalanceByUsername(js) {
  var deferred = Q.defer();
  var db = create_db('operatorbalance');
  countOperatorBalanceByUsername(js.client.data.user).then(function (body) {
    db.view(__design_view, 'findAll', {
      decending: true,
      key: js.client.data.user.username,
      skip: js.client.data.page,
      limit: js.client.data.maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve({
          arr: arr,
          count: body
        });
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();
}

function countOperatorLogCenterBalanceOffline() {
  var deferred = Q.defer();
  var db = create_db('operatorlogcenterbalance');
  db.view(__design_view, 'findCount', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

function showOperatorLogCenterBalanceOffline(sd, ed) {
  var deferred = Q.defer();
  var db = create_db('operatorlogcenterbalance');
  countOperatorLogCenterBalanceOffline().then(function (body) {
    db.view(__design_view, 'findAll', {
      decending: true,
      startkey: sd,
      endkey: ed,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        if (res.rows.length) {
          var arr = [];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve({
          arr: arr,
          count: body
        });
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();

  return deferred.promise;
}

function showOperatorLogCenterBalanceOnline(sd, ed) {
  // var sd=new Date();
  // sd=sd.getTime()-(2*60*60*1000);
  // var ed=new Date();
  var deferred = Q.defer();
  ltc.queryDetailsLTC(convertTZ(new Date(sd)).toISOString(), ed.toISOString()).then(function (body) {
    deferred.resolve(body);
  }).catch(function (err) {
    var l = {
      log: ("error %s", JSON.stringify(err)),
      logdate: convertTZ(new Date()),
      type: "error",
      gui: uuidV4()
    };
    logging(l);
    deferred.reject(err);
  }).done();
  return deferred.promise;
}

function operatorCenterBalance() { // record operator centerbalance 's balance
  var deferred = Q.defer();
  var db = create_db('operatorcenterbalance');
  ltc.checkBalanceCenterLTC().then(function (body) {
    var o = body;
    o.gui = uuidV4();
    o.createddate = convertTZ(new Date());
    db.insert(o, o.gui, function (err, res) {
      if (err) throw new Error(err);
      else {
        console.log('operatorLogCenterBalance OK');
        deferred.resolve(o);
      }
    });
  }).catch(function (err) {
    var l = {
      log: ("error %s", JSON.stringify(err)),
      logdate: convertTZ(new Date()),
      type: "error",
      gui: uuidV4()
    };
    logging(l);
    deferred.reject(err);
  }).done();
  return deferred.promise;
}

function operatorLogCenterBalance() { // record operator query details by 15 minutes
  var deferred = Q.defer();
  var sd = convertTZ(new Date());
  sd = sd.getTime() - (15 * 1000); //run every 15 minutes
  var ed = convertTZ(new Date());
  var db = create_db('operatorlogcenterbalance');
  ltc.queryDetailsLTC(new Date(sd).toISOString(), ed.toISOString()).then(function (body) {
    var o = body;
    o.gui = uuidV4();
    o.createddate = convertTZ(new Date());
    db.insert(o, o.gui, function (err, res) {
      if (err) throw new Error(err);
      else {
        console.log('operatorLogCenterBalance OK');
        deferred.resolve(o);
      }
    });
  }).catch(function (err) {
    var l = {
      log: ("error %s", JSON.stringify(err)),
      logdate: convertTZ(new Date()),
      type: "error",
      gui: uuidV4()
    };
    logging(l);
    deferred.reject(err);
  }).done();
  return deferred.promise;
}


function countTopupFailureByUsername(js) {
  var deferred = Q.defer();
  db = create_db('topupfailure');
  db.view(__design_view, 'findCountByUsername', {
      key: js.client.data.user.username,
      decending: true
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.lenth) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function countTopupFailure() {
  var deferred = Q.defer();
  db = create_db('topupfailure');
  db.view(__design_view, 'findCount', {
      decending: true
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.lenth) {
          arr.push(res.rows[0].value);
        }
        deferred.resolve(arr);
      }
    });
  return deferred.promise;
}

function showTopUpFailure(js) {
  var deferred = Q.defer();
  db = create_db('topupfailure');
  countTopupFailure().then(function (body) {
    db.view(__design_view, 'findAll', {
        decending: true,
        skip: js.client.data.page,
        limit: js.client.data.pagemax
      },
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.lenth) {
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(res.rows[index].value);
            }
          }
          deferred.resolve({
            arr: arr,
            count: body
          });
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();;
  return deferred.promise;
}

function showTopUpFailureByUsername(js) {
  var deferred = Q.defer();
  db = create_db('topupfailure');
  countTopupFailureByUsername(js).then(function (body) {
    db.view(__design_view, 'findByUsername', {
        key: js.client.data.user.username,
        decending: true,
        skip: js.client.data.page,
        limit: js.client.data.pagemax
      },
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.lenth) {
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(res.rows[index].value);
            }
          }
          deferred.resolve({
            arr: arr,
            count: body
          });
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  }).done();
  return deferred.promise;
}


function connectOperator(phone, value) {
  if (phone.indexOf('205') == 0 || phone.indexOf('309') == 0) {
    return LTCSERVICE.topupLTC(phone, value);
  } else if (phone.indexOf('202') == 0 || phone.indexOf('302') == 0) {
    //ETL
  } else if (phone.indexOf('207') == 0) {
    // BEELINE
  } else if (phone.indexOf('209') == 0 || phone.indexOf('309') == 0) {
    // UNITEL
  }

}
// decide when and how often generate this report
function generateBonusTopupBalance(js) {
  // set bonustopupbalance
  db = create_db("bonusTopupBalance");
  var __doc = {
    month: 0,
    year: 0,
    gui: uuidV4(),
    level1: 0,
    level2: 0,
    level3: 0,
    sum: 0
  };
  db.view(__design_view, "findByYearMonth", {
    key: [convertTZ(new Date()).getFullYear(), convertTZ(new Date()).getMonth() + 1],
    descending: true,
    include_docs: true,
    limit: 1
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      if (res.rows.length) __doc = res.rows[0].value;
      __doc.level1 = __doc.level2 = __doc.level3 = __doc.sum = 0;

      var db2 = create_db("topupbalancesum");
      db2.view(__design_view, "findByYearMonth", {
          key: [convertTZ(new Date()).getFullYear(), convertTZ(new Date()).getMonth() + 1]
        },
        function (err, res) {
          if (err) {
            js.client.data.message = err;
            js.resp.send(js.client);
          } else {
            for (var index = 0; index < res.rows.length; index++) {
              __doc = queryBonusTopup(__doc, array[index].value.balance);
            }
            db.insert(__doc, __doc.gui, function (err, res) {
              if (err) {
                js.client.data.message = err;
                js.resp.send(js.client);;
              } else {
                js.client.data.bonustopupbalance = __doc;
                js.resp.send(js.client);
              }
            });
          }
        });
    }
  });
}

function queryBonusTopup(balance, value) {
  while (value > 100000) {
    if (value >= 300000) {
      balance.level3++;
      value -= 300000;
    } else if (value >= 200000) {
      balance.level2++;
      value -= 200000;
    } else if (value >= 100000) {
      balance.level1++;
      value -= 100000;
    }
  }
  balance.sum = balance.level1 + balance.level2 + balance.level3;
  return balance;
}


function showTopupBalanceSumByUsername(js) {
  var db = create_db('topupbalancesum');
  db.view(__design_view, "findByUsernameAndYearMonth", {
      key: [js.client.data.user.username, js.client.data.year, js.client.data.month],
      include_docs: true
    },
    function (err, res) {
      if (err) {
        js.client.data.message = err;
        js.resp.send(js.client);;
      } else {
        var arr = [];
        if (res.rows.length)
          for (var index = 0; index < res.rows.length; index++) {
            var element = res.rows[index].value;
            element._rev = "";
            arr.push(element);
          }
        js.client.data.topupbalancesum = arr;
        js.client.data.message = 'OK';
        js.resp.send(js.client);
      }
    });
}



function showBonusTopupBalanceSumValueByUser(js) {
  var db = create_db("topupbalancesum");
  var __doc = {
    month: 0,
    year: 0,
    gui: uuidV4(),
    level1: 0,
    level2: 0,
    level3: 0,
    sum: 0
  };
  db.view(__design_view, "findByUserAndYearMonth", {
    key: [js.client.data.user.username, js.client.data.year, js.client.data.month],
    include_docs: true
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      var arr = [];
      if (res.rows.length) {
        //var count=res.rows[0].value;
        for (var index = 0; index < res.rows.length; index++) {
          var element = res.rows[index].value;
          __doc.gui = uuidV4();
          __doc.level1 = __doc.level2 = __doc.level3 = __doc.sum;
          __doc.username = element.username;
          __doc = queryBonusTopup(__doc, element.balance);
          __doc.value1 = __doc.level1 * 100000 * 0.02;
          __doc.value2 = __doc.level2 * 200000 * 0.02;
          __doc.value3 = __doc.level3 * 300000 * 0.02;
          __doc.sumvalue = __doc.value1 + __doc.value2 + __doc.value3;
          arr.push(__doc);
        };
      }
      js.client.data.bonustopupbalance = arr;
      js.resp.send(js.client);
    }
  });
}



function showBonusTopupBalanceValueAll(js) {
  var db = create_db("topupbalancesum");
  var __doc = {
    month: 0,
    year: 0,
    gui: uuidV4(),
    level1: 0,
    level2: 0,
    level3: 0,
    sum: 0
  };
  db.view(__design_view, "findByYearMonth", {
    key: [js.client.data.year, js.client.data.month],
    include_docs: true
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      var arr = [];
      if (res.rows.length) {
        //var count=res.rows[0].value;        
        for (var index = 0; index < res.rows.length; index++) {
          var element = res.rows[index].value;
          __doc.gui = uuidV4();
          __doc.level1 = __doc.level2 = __doc.level3 = __doc.sum;
          __doc.username = element.username;
          __doc = queryBonusTopup(__doc, element.balance);
          __doc.value1 = __doc.level1 * 100000 * 0.02;
          __doc.value2 = __doc.level2 * 200000 * 0.02;
          __doc.value3 = __doc.level3 * 300000 * 0.02;
          __doc.sumvalue = __doc.value1 + __doc.value2 + __doc.value3;
          arr.push(__doc);
        }
      }
      js.client.data.bonustopupbalance = arr;
      js.client.data.message = 'OK';
      js.resp.send(js.client);
    }
  });
}
// show by month  this show for all users total number for each level
function showBonusTopupBalance(js) {
  var db = create_db("bonusTopupBalance");
  var __doc = {
    month: 0,
    year: 0,
    gui: uuidV4(),
    level1: 0,
    level2: 0,
    level3: 0,
    sum: 0
  };
  db.view(__design_view, "findByYearMonth", {
    key: [js.client.data.year, js.client.data.month],
    include_docs: true
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      var arr = [];
      if (res.rows.length) {
        //var count=res.rows[0].value;        
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      js.client.data.bonustopupbalance = arr;
      js.client.data.message = 'OK';
      js.resp.send(js.client);
    }
  });
}
// show for admin only which can show for whole years and many months
function showBonusTopupBalanceByYear(js) {
  var db = create_db("bonusTopupBalance");
  var __doc = {
    month: 0,
    year: 0,
    gui: uuidV4(),
    level1: 0,
    level2: 0,
    level3: 0,
    sum: 0
  };
  db.view(__design_view, "findByYear", {
    key: [js.client.data.year, ],
    include_docs: true
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      var arr = [];
      if (res.rows.length) {
        //var count=res.rows[0].value;      
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(res.rows[index].value);
        }
      }
      js.client.data.bonustopupbalance = arr;
      js.client.data.message = 'OK';
      js.resp.send(js.client);
    }
  });
}







function checkRegisterPassword(js) {
  if (!validatePassword(js.client.data.user.password)) {
    js.client.data.message = "password must be more than 5";
  } else
    js.client.data.message = "OK";
  js.resp.send(js.client);
}

function checkRegisterSponserCode(js) {
  var obj = js.client.data;
  findUserByIntroductionCode(obj).then(function (body) {
    if (body) {
      js.client.data.message = "OK";
      js.resp.send(js.client);
    } else {
      js.client.data.message = "could not find sponsor code";
      js.resp.send(js.client);
    }
  });
}

function checkRegisterNeedBalancePerPackage(js) {
  var db = create_db('user');
  db.view(__design_view, "findByUsername", {
    key: js.client.username
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else if (res.rows.length) {
      var registra = res.rows[0].value;
      findNeedBalanceByUserGui(js, registra).then(function (body) {
        var registrabalance = body;
        if ( /*registrabalance.bonus.balance!=registra.balancevalue||*/ registrabalance.main.balance != registra.mainbalance) {
          js.client.data.message = "Error: balance is abnormal";
          js.resp.send(js.client);
        }
        if (registrabalance.main.balance <= js.client.data.package.packagevalue) {
          js.client.data.message = "Error: you don't have enough fund";
          js.resp.send(js.client);
        }
        js.client.data.message = ("OK:main:%s / package: %s", registrabalance.main.balance, js.client.data.package.packagevalue);
        js.resp.send(js.client);
      });
    } else {
      js.client.data.message = "could not find current user";
      js.resp.send(js.client);
    }
  });

}

//
function transferBalance(js) {
  var db = create_db('user');
  db.view(__design_view, 'findByUsername', {
    key: js.client.username
  }, function (err, res) {
    if (err) {
      js.client.data.message = err;
      js.resp.send(js.client);;
    } else {
      if (res.rows.length) {
        var u = res.rows[0].value;
        var d = js.client.data.user;
        js.client.data.user = u;
        //js.client.data.transferbalance  
        js.client.data.transferbalance.type = 'transfer';
        js.client.data.transferbalance.updated = convertTZ(new Date());
        if (js.client.data.transferbalance.diffbalance < u.mainbalance) {
          js.client.data.message = "not enough balance";
          js.resp.send(js.client);
          return;
        }
        if (js.client.data.transferbalance.username != u.username || js.client.data.transferbalance.diffbalance < 1) {
          js.client.data.message = " wrong username or balance must be positive";
          js.resp.send(js.client);
          return;
        }
        js.client.data.balance = js.client.data.transferbalance;
        updateTopupBalance(js).then(function (body) {
          u.mainbalance -= js.client.data.balance.balance;
          updateUser(u).then(function (body) {
            if (err) {
              js.client.data.message = err;
              js.resp.send(js.client);;
            } else {
              db.view(__design_view, 'findByUsername', {
                key: d.username
              }, function (err, res) {
                var d = res.rows[0].value;
                d.mainbalance += js.client.data.balance.balance;
                js.client.data.user = d;
                updateTopupBalance(js).then(function (body) {
                  updateUser(d).then(function (body) {
                    js.client.data.message = "transfer balance completely user:" + u.username + "-->" + d.username;
                    js.resp.send(js.client);
                  }).catch(function (err) {
                    js.client.data.message = err;
                    js.resp.send(js.client);;
                  }).done();
                }).catch(function (err) {
                  js.client.data.message = err;
                  js.resp.send(js.client);;
                }).done();
              });
            }
          }).catch(function (err) {
            js.client.data.message = err;
            js.resp.send(js.client);;
          }).done();
        }).catch(function (err) {
          js.client.data.message = err;
          js.resp.send(js.client);;
        }).done();
      } else {
        js.client.data.message = 'username not found!';
        js.resp.send(js.client);
      }
    }
  });

}

function checkphone(phone) {
  if (phone == '205') {
    return 5;
  } else if (phone == '202') {
    return 2;
  } else if (phone == '207') {
    return 7;
  } else if (phone == '209') {
    return 9;
  }
  return 0;
}

function topupbalance(phone, value) {
  switch (checkphone(phone)) {
    case 2:
      return topupETL(phone, value);
      break;
    case 5:
      return topupLaotel(phone, value);
      break;
    case 7:
      return topupBeeline(phone, value);
      break;
    case 9:
      return topupUnitel(phone, value);
      break;
  }
}




function logging(log) {
  var l = {
    log: "",
    logdate: "",
    type: "",
    gui: uuidV4()
  };
  var db = create_db("logs");
  db.insert(log, log.gui, function (err, body) {
    if (err) console.log(err);
    else {
      console.log("log oK" + body);
    }
  });
}



function displayJson(arr) {
  arr.sort();
  var html = "<html><head>";
  html += "<script>";
  html += "js=JSON.stringify(" + JSON.stringify(arr) + ",undefined,2);";
  html += "window.onload = function() {";
  html += "console.log('window - onload'+js);document.getElementById('content').innerHTML=js;"
  html += "};";
  html += "</script>";
  html += "</head>";
  html += "<body><pre id='content'></pre>";
  html += "</body>";
  html += "</html>";
  return html;
}

function deleteFile(itemgui, name) {
  var deferred = Q.defer();
  var path = _current_picture_path + '/' + itemgui + '/' + name;
  fs.unlink(path, function (err) {
    if (err && err.code == 'ENOENT') {
      // file doens't exist
      deferred.reject('Could not find this file, so can not delete this file ' + link);
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      deferred.reject(JSON.parse(err) + ' /' + link);
    } else {
      deferred.resolve('removed ' + link);
    }
  });
  return deferred.promise;
}

function makePhotoFromBase64(content, itemgui, name) {
  var deferred = Q.defer();
  base64.decode(content, _current_picture_path + '/' + itemgui + '/' + name, function (err, res) {
    if (err) deferred.reject(err);
    else deferred.resolve(_current_picture_path + '/' + itemgui + '/' + name); //put _current_icture_path for correct URL
  });
  return deferred.promise;
}

function makeBase64FromFile(itemgui, name) { // IF use only base64 string we can give short link which need request base64 string only
  var deferred = Q.defer();
  base64.encode(_current_picture_path + '/' + itemgui + '/' + name, function (err, base64String) {
    if (err) deferred.reject(err);
    else deferred.resolve(base64String);
  });
  return deferred.promise;
}

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //var possible = "0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}











app.listen(3000, "0.0.0.0", function () {
  console.log('Example app listening on port 3000!')
});