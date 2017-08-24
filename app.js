const express = require('express');
var exphbs  = require('express-handlebars');
const uuidV4 = require('uuid/v4');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
var dateFormat = require('dateformat');
const fs = require('fs');
const app = express();
var helpers = require('handlebars-helpers')();
var errors=require("./errors");
var bodyParser = require('body-parser')
var methodOverride = require('method-override')


// var cradle = require('cradle');
// var cdb=new(cradle.Connection)('http://localhost', 5984, {user:"admin",pass:"admin"
//       // cache: true,
//       // raw: false,
//       // forceSave: true,
//       // request: {
//       //   //Pass through configuration to `request` library for all requests on this connection.
//       //}
//   });

// app.use(function(err, req, res, next) {
//     console.log("error");
//    if (err instanceof NotFound) {
//        res.render('404');
//    } else {
//        res.render('500', {error: err, stack: err.stack});
//    }
//    next();
// });
app.use(function (req,res,next){
  //console.log("before request %",req);
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)



function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send(JSON.stringify({ error: 'Something failed!' }));
  } else {
    next(err)
  }
}
function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}


var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        indexing:function(index){return index+1},
        header: function () { return 'FOO!'; },
        scripts: function () { return 'BAR!'; },
        style: function () { return 'BAR!'; },
        bottom: function () { return 'BAR!'; },
        raw:function(options){return options.fn();}
    },
    defaultLayout: 'main', 
    extname: 'handlebars' ,
    layoutDir:__dirname + '/views/layouts/'

});

//app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: 'handlebars' ,layoutDir:__dirname + '/views/layouts/'}));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/static',express.static('public')); 

//var couch =require('./init_couchdb');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });




var nano = require('nano')('http://admin:admin@localhost:5984');


// nano.db.create('topup',function(err){
//   if(err){
//   console.error(err);
//   }
// });
// var topupdb=nano.db.use('topup');




function showerrors(code,res,description)
{
  switch (code) {
    case "404":
      res.render('404',{
        helpers:{
          errdescription:description,
          errorcode:code,
          errormsg:"we could not find this page"
        }
    });
      break;
      case "500":
      res.render('500',{
        helpers:{
          errdescription:description,
          errorcode:code,
          errormsg:"Something wrong please check again"
        }
    });
      break;
    default:
      res.render('errors',{
        helpers:{
          errdescription:description,
          errorcode:code,
          errormsg:"Unknown error!"

        }
    });
      break;
  }
}


var t_client={
    username:"",
    logintoken:"",
    logintime:null,
    logintimeout:null,
    clientuid:uuidV4(),
    registeruid:uuidV4(),
    confirmregisteruid:"",
    browserinfo:"",
    ip:"req.ip",
    other:"",
    lastaccess:Date(),    
    isexist:false
    };
var t_clients=[];
var t_newclient={};
var t_currentclient={};
/*************************VIEW*************************/

// first access
app.get('/', function (req, res,next) {
    var client={
    username:"",
    logintoken:"",
    logintime:null,
    logintimeout:null,
    clientuid:null,
    registeruid:null,
    confirmregisteruid:null,
    browserinfo:"",
    ip:req.ip,
    other:"",
    lastaccess:null,
    isexist:false,
    clientjs:"",
    fingerprint:"",
    data:""
    };
    res.render('index',{
        helpers:{
         // generateclient:true,
          client:JSON.stringify(client)
        }
    });
});

// get new client info
app.get('/newclientinfo', function (req, res,next) {
   var client={
    username:"",
    logintoken:"",
    logintime:new Date(),
    logintimeout:null,
    clientuid:new uuidV4(),
    registeruid:null,
    confirmregisteruid:null,
    browserinfo:"",
    ip:req.ip,
    other:"",
    lastaccess:new Date(),
    isexist:false,
    clientjs:"",
    fingerprint:"",
    data:""
    };
    res.render('newclientinfo',{
        layout:false,
        helpers:{
         client:JSON.stringify(client)
        }
    });
});

// login page

//
app.get('/home', function (req, res,next) {    
    try {
      var client=Redis.createClient().get("client");

      console.log('client: %s',client);
      if(client.isexist)// token exist need to check token validation
      {
        // check login token validation 
          //if valid go to user page

          //if not go to home page to login
      }
      else// show log in page 
      {
        //show login
      }
    } catch(e) {      
      console.log('ERROR: %s',e);
    }
    res.render('home',{
        helpers:{
          raw:function(options){return options.fn();
          },
         client:JSON.stringify(client)
        }
    });
});

app.get('/packages/:p', function (req, res,next) {
  var p=JSON.parse(req.params.p);
  var package={
        gui:uuidV4(),
        packagename:"P1",
        packagevalue:"",
        isactive:true,
        createddate:new Date(), 
        relationvalue:"",
        bonusbalance:0, // new member get instantly balance after register
        introductionscore:0, // only the introductor got balance instantly after got a new member
        memberscorebonus:0, // all upline members got score but not yet the balance till coupling happen.
        maxpaidperday:0
      }; 
      //ເງືອນໄຂການຈ່າຍ 350.000
      //1. 40.000 ຄ່າແນະນຳ
      //2. 25.000 ມູນຄ່າໂທ
      //3. ບລສ  75.000
      //4. ມູນຄ່າຈັບຄູ່ຕ້ອງໃຫ້ຜູ້ແນະນຳກ່ອນ: 20.000
      //5. ມູນຄ່າຈັບຄູ່ 20.000 ໃຫ້ ແຕ່ລະຄົນ(ຊຶ່ງບໍ່ເກີນ 20.000) ຈາກ (350.000-40.000-25000-75000)
      //6. ຖ້າເກີນ 20.000 ແມ່ນ ສ່ວນເກີນເຂົ້າບໍລິສັດ
//ເງື່ອນໄຂ ຂອງ PACKAGE

    p1=package;
    p2=p1;
    p3=p2;
    p1.gui=uuidV4();
    p1.packagename="P1";
    p1.packagevalue=100000;
    p1.relationvalue=0;
    p1.bonusbalance=0;
    p1.introductionscore=40000;
    p1.memberscorebonus=25000;
    p1.maxpaidperday=0;
    
    p2.gui=uuidV4();
    p2.packagename="P2";
    p2.packagevalue=350000;
    p2.relationvalue=20000;
    p2.bonusbalance=0;
    p2.introductionscore=40000;
    p2.memberscorebonus=25000;
    p2.maxpaidperday=p2.packagevalue;

    p3.gui=uuidV4();
    p3.packagename="P1";
    p3.packagevalue=1750000;
    p3.relationvalue=100000;
    p3.bonusbalance=0;
    p3.introductionscore=200000;
    p3.memberscorebonus=125000;
    p3.maxpaidperday=p3.packagevalue;

    packages=[];
    packages.push([p1,p2,p3]);
  if(!p){
    res.send(packages);
  }
  else{
    packages.forEach(function(element) {
      if(element.packagename==p.packagename)
        res.send(p);
    }, this);
  }
});

app.post('/login/:p', function (req, res,next) {
  var p=JSON.parse(req.params.p);
  
});

app.get('/confirm-register', function (req, res,next) {
  res.render('confirm-register',{
        helpers:{
          raw:function(options){return options.fn();
          }
        }
    });
});
app.get('/login', function (req, res,next) {
  res.render('login',{
        helpers:{
          raw:function(options){return options.fn();
          }
        }
    });
});
app.get('/forget-password', function (req, res,next) {
  res.render('forget-password',{
        helpers:{
          raw:function(options){return options.fn();
          }
        }
    });
});


app.get('/pre-register', function (req, res,next) {
  var js=[
    {
      name:"A",
      surname:"AA"
    },
    {
      name:"B",
      surname:"Bb"
    }
  ];
  //RESTFULL
  res.render('pre-register',{
        layout:false,
        helpers:{
          raw:function(options){return options.fn();
          },
          showhelpers:function(){return "show helpers";
          },
          showjson:function(){
            return JSON.stringify(js);
          }
        }
    });
});

app.get('/user', function (req, res,next) {
  //var client=JSON.parse(req.params.client);
  res.render('user',{
        helpers:{
          raw:function(options){return options.fn();
          },
          //client:JSON.stringify(client)
        }
    });
});
app.get('/chat', function (req, res,next) {
  //var client=JSON.parse(req.params.client);
  res.render('chat',{
        helpers:{
          raw:function(options){return options.fn();
          },
          client:JSON.stringify(client)
        }
    });
});
app.get('/user-profile', function (req, res,next) {
  res.render('user',{
        helpers:{
          raw:function(options){return options.fn();
          }
        }
    });
});

app.get('/log', function (req, res,next) {
    var command=req.params.command;//view
    var keyword=req.params.search;
    var loglist=[
      {
        logtime:dateFormat(new Date(),"dd/mm/yyyy hh:MM:ss"),
        logname:"a",
        log:"A log"
      },
      {
        logtime:dateFormat(new Date(),"dd/mm/yyyy hh:MM:ss"),
        logname:"b",
        log:"b log"
      },
      {
        logtime:dateFormat(new Date(),"dd/mm/yyyy hh:MM:ss"),
        logname:"c",
        log:"c log"
      },
      {
        logtime:dateFormat(new Date(),"dd/mm/yyyy hh:MM:ss"),
        logname:"d",
        log:"d log"
      }
    ];

    res.render('log',{
        command:'view',
        helpers:{
          indexing_x:function(index){
            return index;
          }
        },
        loglist:function(){
          loglist.forEach( function(element, index) {
            element.logname=element.logname+"---";
          });
          return loglist;
        }
        // Override `foo` helper only for this rendering.
        });
});
app.post('/packages', function (req, res,next) {
    res.render('packages',{
        edit: true,
        // Override `foo` helper only for this rendering.
        });
});

/*************************VIEW*************************/
var log={
  logtime:Date(),
  logname:"",
  log:"",
  gui:uuidV4()
};
var packages={
  packagegui:uuidV4(),
  pacakgename:"",
  packagevalue:"",
  isactive:"",
  createddate:"", 
  relationvalue:""
}
var packagedetails={
  userui:"",
  packageui:"",
  registerdate:Date(),
  isactive:"",
  notactivedate:"",

}
var gconfig={
  balancetransferfee:"",
  couplingvalue:0,
  membercouplinglimitperday:0,//
  maxphonenumberforpackage:2
}
var users={
  username:"",
  password:"",
  createddate:Date(),
  gui:uuidV4(),
  parent:"",
  email:"",
  phone1:"",
  phone2:"",
  address:"",
  photo:"",
  memberlevel:"",
  twinusergui:"",
  binid:""
};
var coupling={
  usergui:"",
  usergui1:"",
  usergui2:"",
  couplingdate:Date(),
  couplingvalue:0,
  gui:uuidV4()
}
var relation={
  usergui:"",
  usergui1:"",
  packagegui:"",
  createdate:"",
  bonusvalue:0,
  leftside:true
}
var payment={
  usergui:"",
  paymentdate:Date(),
  paymentvalue:0,
  paymentby:"",
  paidbygui:"",
  payreason:"",
  description:"",
  gui:uuidV4()

}
var gconfig={
  balancetransferfee:"",
  couplingvalue:0,
  membercouplinglimitperday:0,//
  maxphonenumberforpackage:2
}

var receive={
  usergui:"",
  receivedate:Date(),
  receivevalue:0,
  receivefrom:"",
  description:"",
  gui:uuidV4()
}
var logintoken={
  usergui:"",
  tokendate:Date(),
  token:"",
  tokenenddate:"",
  ip:""
};

var topupvalue={
  usergui:"",
  topupvalue:0,
  topupfee:0,
  topupdate:Date(),
  gui:uuidV4(),
  paymentgui:""
};

var memberbonus={
  usergui:"",
  bonusdate:Date(),
  bonusvalue:0,
  reason:"",
  gui:uuidV4(),
  description:"",
  receivegui:""
};
var transfering={
  gui:uuidV4(),
  usergui1:"",
  usergui2:"",
  transferdate:Date(),
  transfervalue:0,
  transferfee:0
}

var loginlog={
  username:"",
  logtime:Date(),
  log:""
};
var logindata={
    username:"",
    password:"",
    logindata:new Date(),
    loginstatus:"",
    loginsuccessed:false
    };
var actionlog={
  logtime:Date(),
    logname:"",
    log:"",
    usergui:""
};

//admin page 
//user page









var Redis = require("redis");

function r_Update(key,newvalue, cb) {  
  var replied = false;
  var newValue=newvalue;

  var redis = Redis.createClient();
  redis.once('error', done);
  redis.watch(key);

  redis.get(key, function(err, value) {
    if (err) {
      return done(err);
    }
    //newValue =Number(value) + 1;
    //newValue=value;
    redis.multi().
      set(key, newValue).
      exec(done);
  });

  function done(err, result) {
    redis.quit();

    if (! replied) {
      if (!err && !result) {
        err = new Error('Conflict detected');
      }

      replied = true;
      cb(err, newValue);
    }
  }
}

function update_by_key(key,newvalue, cb) {  
  r_Update(key,newvalue, callback);

  function callback(err, result) {
    if (err && err.message == 'Conflict detected') {
      r_Update(key, callback);
    }
    else {
      cb(err, result);
    }
  }
}


// for(var i = 0 ; i < 10 ; i ++) {

//   Redis.createClient().set("A",i);
//   update_by_key('A',i, function(err, newValue) {
//     if (err) {
//       throw err;
//     }
//     console.log('successfully set new value to %j', newValue);
//   });
// }
















/***********************DATA*******************************/
wss.on('connection', function connection(ws) {
  const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  //START

  console.log('start');    
  ws.on('close', function incoming(message) {
    console.log('close: %s', message);    
  });
  ws.on('open', function incoming(message) {
    console.log("Open!!!!!!!!!!!!!!!!!!!!!");
        
  });

  
  ws.on('message',function(message) {
    
  //console.log(' message received %s',message);
    //  var client={
    // username:"",
    // logintoken:"",
    // logintime:null,
    // logintimeout:null,
    // clientuid:null,
    // registeruid:null,
    // confirmregisteruid:null,
    // browserinfo:"",
    // ip:"",
    // other:"",
    // lastaccess:null,
    // isexist:false,
    // clientjs:"",
    // fingerprint:"",
    // data:""
    // };
    try {
    var data=JSON.parse(message);
    var c=data.json;//client
      switch (data.actioncode) {
        case "init":
          check_init(ws,c);
        break;
        case "shakehands":
        //shakehands(ws,c);
          c.data="shake hands accepted";
         ws.send(JSON.stringify({
                _isstring:true,
                json:c,
                updatetime:new Date(),
                _iserror:false,
                _isread:false,
                actioncode:"shakehands"
          }));
        break;
        case "heartbeats":
        heartbeats(ws,c);
        break;

        case "login":
          user_login(ws,c);
          break;
        case "register":
          c.data=register_new_user(ws,c);
          break;
        case "forgetpassword":
          rs=forgetpassword_process(ws,c);
          break;
        case "userprofile":

        break;
        case "userchildren":

        break;

        default:
          ws.send(JSON.stringify({
                _isstring:false,
                json:{data:"wrong command"},
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
          }));
          break;
      }
    } catch(e) {
      ws.send(JSON.stringify({
                _isstring:false,
                json:{data:e},
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
          }));
    }
  
  });
  
  // END START
});
/***********************DATA*******************************/
function check_init(ws,c){
  // if not, need to relogin 
        if(c.logintoken==null || c.logintoken=="" ||c.logintoken=="undified")
        {
          c.data="error need to login";
          c.lastaccess=new Date();
          ws.send(JSON.stringify({
                _isstring:false,
                json:c,
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
          }));
          return ;
        }
        else
        {
          var r_client = Redis.createClient();
          var cx=c;
          var key=c.clientuid+c.fingerprint+c.registeruid;
          var r=r_client.get(key,function(err,reply){
                  cx=reply;
                  // it's exist on system and used to online or not 
                  return (reply== null)? false:true;});
            if(!r)
            {
              cx.data={data:"error need to login"};
              ws.send(JSON.stringify({
                _isstring:false,
                json:cx,
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
                }));
                return ;
            }
            else
            {
               cx=c;
               //same token but different IP 
               if(cx.ip!=c.ip)
               {
                  c.ip=ws._socket.remoteAddress;
                }
                  
              else if(x.logintoken!=c.logintoken)
              {
                  cx.logintoken=uuidV4();
              }
              else if(cx.logintoken==c.logintoken&&cx.ip==c.ip)
               //same token same IP not more than 15 minutes , it's the saem session
              {
                cx.lastaccess=new Date();
                var d=new Date();
                d.setDate(d.getDate()+30);
                cx.logintimeout=d;
                cx.isonline=true;
              }

               // different token , need to generate new token 
               
                update_by_key(key,cx, function(err, newValue) {
                    if (err) {
                      throw err;
                    }
                    console.log('successfully set new value to %j', newValue);
                  });
                 ws.send(JSON.stringify({
                           _isstring:false,
                           json:cx,
                           updatetime:new Date(),
                           _iserror:false,
                           _isread:false,
                           actioncode:"init"
                     }));
            }
        }
}

/*lgoin()*/
function user_login(ws,message){
  
  var userdb=create_db("userdb");
  var loginlogdb=create_db("loginlog");
  //var couchdb=require("couchdb_lib");
  try {
      var c=message;
      //var c=v.json;
      var ip=ws.upgradeReq.connection.remoteAddress;    
      
      var logindata={
      username:"",
      password:"",
      logindata:new Date(),
      loginstatus:"",
      loginsuccessed:false
      };
      
      var loginlog={
      username:"",
      logtime:Date(),
      log:""
      };
      var client={
      username:"",
      logintoken:"",
      logintime:null,
      logintimeout:null,
      clientuid:null,
      registeruid:null,
      confirmregisteruid:null,
      browserinfo:"",
      ip:"",
      other:"",
      lastaccess:null,
      isexist:false,
      clientjs:"",
      fingerprint:"",
      isonline:false,
      data:""
      };
      //var cdata=c.data;    
      //delete v["data"];
      
      //c.data="";
      console.log("compare client %s",JSON.stringify(c));
      
      // if(!compareJson(client,c))
      // {
      //   console.log("compare login info");
      //    client.data="wrong json format: userdata";

      //     ws.send(JSON.stringify({
      //       _isstring:false,
      //             json:client,
      //             updatetime:new Date(),
      //             _iserror:true,
      //             _isread:false,
      //             actioncode:"error"
      //     }));
      //     console.log("response errors");

      //     return;
      // }
       console.log("compare login info");
      //check username and password
      //client=v;
      //v=null;
      //delete v;
      client=c;
      //client.data=cdata;
     
      // if(!compareJson(logindata,client.data))
      // {
      //   client.data={data:"wrong json format: userdata"};
      //     ws.send(JSON.stringify({
      //       _isstring:false,
      //             json:client,
      //             updatetime:new Date(),
      //             _iserror:true,
      //             _isread:false,
      //             actioncode:"error"
      //     }));
      //     return;
      // }
      //check here 
     console.log("check user login");
      var login=userdb.view('users', 'findByUserLogin',[logindata.username,logindata.password], function(err, body) {
      return (err!=null)?true:false;
      });

      if(!login)
      {
        console.log("user not exist");
        client.data={data:"wrong username or password"};
          ws.send(JSON.stringify({
            _isstring:false,
                  json:client,
                  updatetime:new Date(),
                  _iserror:true,
                  _isread:false,
                  actioncode:"error"
          }));
          loginlog.username=logindata.username+","+logindata.password;
          loginlog.logintime=new Date();
          loginlog.log="Error wrong username and password";
          loginlogdb.insert(loginlog,function(err,body,header){
          });
          return;
      }
      console.log("user exist");
      client.data="success login";
          ws.send(JSON.stringify({
            _isstring:false,
                  json:client,
                  updatetime:new Date(),
                  _iserror:false,
                  _isread:false,
                  actioncode:"login"
          }));
          loginlog.username=logindata.username+","+logindata.password;
          loginlog.logintime=new Date();
          loginlog.log="Error wrong username and password";
          loginlogdb.insert(loginlog,function(err,body,header){
          });
        c=client;
        
        update_by_key(c.clientuid+c.fingerprint+c.registeruid,JSON.stringify(c), function(err, newValue) {
          if (err) {
            throw err;
          }
          console.log('successfully set new value to %j', newValue);
        });
    }
    catch(e)
    {throw e;}
  }
//shakehands
// function shakehands(ws,c){

// }
//heartbeats
function heartbeats(ws,c){

}
//forgot password
function forgetpassword_process(ws,message)
{
  var userdb=create_db("userdb");
  var v=JSON.parse(message);
  var c=v.json;
  var u=userdb.view("users","findByUserName",[c.username],function (err,body){
    return body;
  });
  if(u==null)
  {
    ws.send(JSON.stringify({
            _isstring:false,
                  json:{data:"user not exist"},
                  updatetime:new Date(),
                  _iserror:true,
                  _isread:false,
                  actioncode:"error"
          }));
          return;
  }
  else 
  {
    if(u.email!="")
    ws.send(JSON.stringify({
            _isstring:false,
                  json:{data:"sent password to your email"+u.email},
                  updatetime:new Date(),
                  _iserror:true,
                  _isread:false,
                  actioncode:"error"
          }));
    else if(u.phone1!="")
      ws.send(JSON.stringify({
            _isstring:false,
                  json:{data:"sent password to your phone1"+u.phone1},
                  updatetime:new Date(),
                  _iserror:true,
                  _isread:false,
                  actioncode:"error"
          }));
    else if(u.phone2!="")
      ws.send(JSON.stringify({
            _isstring:false,
                  json:{data:"sent password to your phone"+u.phone2},
                  updatetime:new Date(),
                  _iserror:true,
                  _isread:false,
                  actioncode:"error"
          }));
    else 
      ws.send(JSON.stringify({
            _isstring:false,
                  json:{data:"please ask your upper level for help"},
                  updatetime:new Date(),
                  _iserror:true,
                  _isread:false,
                  actioncode:"error"
          }));
    return;
  }

}

/*PACKAGES*/





/*END PACKAGES*/
//response handler
function resp_handle(r,actioncode,jsondata){
  r.__resp.actioncode=actioncode;
  r.__resp.updatedtime=new Date();
  r.__resp.json=jsondata;
  r.__glob._submit(r.__WS,r.__resp);
}
//




/*Register()*/
function register_new_user(ws,message){
  
  //var userdb=create_db("userdb");
  //var couchdb=require("couchdb_lib");
  var package_db=require("./db/packages")(uuidV4,nano,ws,"packages","objectList")._init();
  var userbinary_db=require("./db/userbinary")(uuidV4,nano,ws,"userbinary","objectList")._init();
  var packagedetails_db=require("./db/packagedetails")(uuidV4,nano,ws,"packagedetails","objectList")._init();
  var coupling_db=require("./db/coupling")(uuidV4,nano,ws,"coupling","objectList")._init();
  var couplingscore_db=require("./db/couplingscore")(uuidV4,nano,ws,"couplingscore","objectList")._init();
  var balances_db=require("./db/balances")(uuidV4,nano,ws,"balances","objectList")._init();
  var payment_db=require("./db/payment")(uuidV4,nano,ws,"payment","objectList")._init();
  var userdata_db=require("./db/userdata")(uuidV4,nano,ws,"userdata","objectList")._init();
  var client_db=require("./db/client")(uuidV4,nano,ws,"client","UserData")._init();
  var _all_d={};

  
  _all_d.userbinary_db=userbinary_db;
  _all_d.packagedetails_db=packagedetails_db;
  _all_d.package_db=package_db;
  _all_d.userbinary_db=userbinary_db;
  _all_d.coupling_db=coupling_db;
  _all_d.couplingscore_db=couplingscore_db;
  _all_d.balances_db=balances_db;
  _all_d.payment_db=payment_db;
  _all_d.userdata_db=userdata_db;
  _all_d.client_db=client_db;

    //_all_d.d=d;
    //_all_d.uin=uin;
    //_all_d.parent_u=parent_u;

  try {
    var v=message;// v= client for register
    //check client or v info first as always
    var data=v.data;
    _all_d.data=data;
    /*
      client={
        data:{
          package:"",
          userbinary:"",
          packagedetails:"",
          coupling:"",
          couplingscore:",
          balances:"",
          payment:"",
          userdata
        }
      }
        
    */

    var ip=ws.upgradeReq.connection.remoteAddress;
    //compare client ip and current IP 

    //client
    // var c={
    // username:"",
    // logintoken:"",
    // logintime:null,
    // logintimeout:null,
    // clientuid:null,
    // registeruid:null,
    // confirmregisteruid:null,
    // browserinfo:"",
    // ip:"",
    // other:"",
    // lastaccess:null,
    // isexist:false,
    // clientjs:"",
    // fingerprint:"",
    // isonline:false,
    // data:""
    // };

      var package={
        gui:uuidV4(),
        packagename:"P1",
        packagevalue:"",
        isactive:true,
        createddate:new Date(), 
        relationvalue:"",
        bonusbalance:0, // new member get instantly balance after register
        introductionscore:0, // only the introductor got balance instantly after got a new member
        memberscorebonus:0, // all upline members got score but not yet the balance till coupling happen.
        maxpaidperday:0
      }; 
      //ເງືອນໄຂການຈ່າຍ 350.000
      //1. 40.000 ຄ່າແນະນຳ
      //2. 25.000 ມູນຄ່າໂທ
      //3. ບລສ  75.000
      //4. ມູນຄ່າຈັບຄູ່ຕ້ອງໃຫ້ຜູ້ແນະນຳກ່ອນ: 20.000
      //5. ມູນຄ່າຈັບຄູ່ 20.000 ໃຫ້ ແຕ່ລະຄົນ(ຊຶ່ງບໍ່ເກີນ 20.000) ຈາກ (350.000-40.000-25000-75000)
      //6. ຖ້າເກີນ 20.000 ແມ່ນ ສ່ວນເກີນເຂົ້າບໍລິສັດ
//ເງື່ອນໄຂ ຂອງ PACKAGE
    
    // process client
    // base on current user if , current user can register a new member
    var clients=Redis.createClient().get("client");      

    //check if current client is logging in the redis
    //check if current client is logging in the database
    
    // process packages
    // find given package exist ?
    //TODO: 05 JUNE 2017, process package first or process userbinary first
    _all_d.package_db._exist(_all_d.data.package,function(error2,result2){
      if(result2!=null){
            if(result2.rows[0]==null){                        
              //not exist
                resp__handler(_all_d.data.package_db,"not exist",{data:("%s not exist %s",_all_d.data.package_db.__dbname,JSON.stringify(e))}); 
            }
            else{
            //exist
            _all_d.data.data.package=resutl2.rows[0];

            _all_d.client_db._exist(v,function(error,result){
            if(result!=null){
              if(result.rows[0]==null){  
                    resp__handler(_all_d.client_db,"not exist",{data:("%s not exist",_all_d.client_db.__dbname)});           
              }
              else{
                var c=result.rows[0];
                    _all_d.data.data.userdata.gui=uuidV4();
                    if(_all_d.data.data.package.packagevalue>100000)
                      _all_d.data.data.userdata.isfreeuser=false;
                    else 
                      _all_d.data.data.userdata.isfreeuser=true;

                    // TODO: introductor
                    var uin=null;
                    if(_all_d.data.data.userdata.introductorcode){
                    }

                    // set parent if  exist and set level value
                    var u_parent=null;
                    

                    _all_d.data.userdata_db._exist(_all_d.data.data.userdata,function(error1,result1){
                    if(result1!=null){
                      if(result1.rows[0]!=null){                        
                            resp__handler(_all_d.data.userdata_db,"exist",{data:("%s exist",_all_d.data.userdata_db.__dbname)}); 
                      }
                      else{
                        var u=result1.rows[0];
                        _all_d.data.data.userdata.memberlevel=u_parent.memberlevel+1;
                        _all_d.data.data.userdata.parentgui=u_parent.gui;
                        _all_d.data.data.userdata.packagevalue=data.package.packagevalue;
                        _all_d.data.data.userdata.gui=data.package.gui;
                        _all_d.data.data.userdata.usercode=m_code();

                        _all_d.data.userbinary_db._newMember({username:_all_d.data.data.userdata.username},function(error1_1,result1_1){
                          if(!error1_1){
                            if(result1_1.rows[0]!=null){
                              //update user binary 
                              var d=reustl1_1.rows[0];
                              if(!d.luser&&_all_d.data.data.userdata.luser){     
                                d.luser=_all_d.data.data.userdata.luser;
                                // check if coupling with the right user
                                if(!d.ruser){
                                  // not coupling yet
                                } 
                                else{
                                  // coupling need to push bonus
                                }
                              }
                              else if(!d.ruser&&_all_d.data.data.userdata.ruser){
                                d.ruser=_all_d.data.data.userdata.ruser;
                                _all_d.data.userbinary_db._add(d,d.username,function(e,r){
                                  if(e){
                                    resp__handler(_all_d.data.userbinary_db,"error",{data:("%s error %s",_all_d.data.userbinary_db.__dbname,JSON.stringify(e0))}); 
                                  };
                                });

                                resp__handler(_all_d.data.userbinary_db,"success",{data:("%s success",_all_d.data.userbinary_db.__dbname)}); 
                              }
                              else{
                                resp__handler(_all_d.data.userbinary_db,"wrongside",{data:("%s choose otherside",_all_d.data.userbinary_db.__dbname)}); 
                              }                              
                            }
                            else{
                              //insert new user
                              // top user exist and can add a new member
                              _all_d.data.userdata_db._add(_all_d.data.data.userdata,function(e0,r0){
                                if(e0){
                                  resp__handler(_all_d.data.userdata_db,"error",{data:("%s error %s",_all_d.data.userdata_db.__dbname,JSON.stringify(e0))}); 
                                }
                                else{
                                 ///TODO 
                                }
                              });
                              // insert a new userbinary
                            if(_all_d.data.data.userdata.luser){     
                                d=data.userdata;
                                _all_d.data.userbinary_db.insert(d,d.username,function(e,r){
                                  if(e){                                     
                                    resp__handler(_all_d.data.userbinary_db,"error",{data:("%s error %s",_all_d.data.userbinary_db.__dbname,JSON.stringify(e))}); 
                                  };
                                });
                                resp__handler(_all_d.data.userbinary_db,"success",{data:("%s success %s",_all_d.data.userbinary_db.__dbname,JSON.stringify(e))}); 
                              }
                              else if(_all_d.data.data.userdata.ruser){
                                d=ata.userdata;
                                _all_d.data.userbinary_db.insert(d,d.username,function(e,r){
                                  if(e){
                                      resp__handler(_all_d.data.userbinary_db,"error",{data:("%s error %s",_all_d.data.userbinary_db.__dbname,JSON.stringify(e))});                                     
                                  };
                                });
                                resp__handler(_all_d.userbinary_db,"success",{data:("%s success %s",_all_d.userbinary_db.__dbname,JSON.stringify(e))}); 

                              }
                              else{
                                resp__handler(_all_d.userbinary_db,"wrongside",{data:("%s choose otherside %s",_all_d.userbinary_db.__dbname,JSON.stringify(e))}); 
                              }                              
                            }
                          }
                          }); 
                      }
                    }
                    else {
                      resp__handler(_all_d.userdata_db,"error",{data:("%s error %s",_all_d.userdata_db.__dbname,JSON.stringify(e))});
                    }
                    });
              }
            }
            else{
              resp__handler(_all_d.client_db,"error",{data:("%s error %s",_all_d.client_db.__dbname,JSON.stringify(e))});
            }
          });
        }

      }
      else {                            
        resp__handler(_all_d.package_db,"not exist",{data:("%s not exist %s",_all_d.package_db.__dbname,JSON.stringify(e))});
      }
    });
    

   
    
    
    
    
    

    var received={};
    var invoice={};

    var gconfig={
      balancetransferfee:"",
      couplingvalue:0,
      membercouplinglimitperday:0,//
      maxphonenumberforpackage:2
    }

    
    var topuppackage={};
    var topupbalance={
      username:"",
      usergui:"",
      gui:"",
      balance:0,
      updated:new Date(),
      diffbalance:0
    };
    var transfer={};
    var transferfee={};
    var loaningpackage={}; // loan once per month per user with exact amount
    var loaningbalance={}; 
    var returnloan={};

    

    // if(!compareJson(userdata,v.data)
    // {
    //     ws.send(JSON.stringify({
    //       _isstring:false,
    //             json:{data:"wrong json format: userdata"},
    //             updatetime:new Date(),
    //             _iserror:true,
    //             _isread:false,
    //             actioncode:"error"
    //     }));
    //     return;
    //   }
    userdata=v.userdata;    
    delete v["data"];
    // if(!compareJson(client,v))
    // {
    //     ws.send(JSON.stringify({
    //       _isstring:false,
    //             json:{data:"wrong json format: userdata"},
    //             updatetime:new Date(),
    //             _iserror:true,
    //             _isread:false,
    //             actioncode:"error"
    //     }));
    //     return;
    //   }
    client=v;
    //check before insert    
    var u=userdb.view("users","findByUserName",[client.username],function(err,body){
      return body;
    });
    if(u==null)
      {
        ws.send(JSON.stringify({
          _isstring:false,
                json:{data:"user not exist"},
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
        }));
        return;
      }
    if((!userdata.isleft&&u.userright!="")||(userdata.isleft&&u.userleft!=""))
    {
      ws.send(JSON.stringify({
          _isstring:false,
                json:{data:"set wrong user' side"},
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
        }));
        return;
    }

    userdata.parentgui=u.gui;
    userdata.gui=new uuidV4();
    userdata.memberlevel=u.memberlevel+1;
    userdata.createddate=new Date();

    if(userdata.isleft){
      u.userleftgui=userdata.gui;
    }
    else{
      u.userrightgui=userdata.gui;
    }
    if(u.userrightgui!=""&&u.userleftgui!="")
      u.ispaired=true;

        
    // calculate user score and bonus


    ////update U ( parent)

    userdb.insert(u,u.rev,function(err,res){
      if(!error) {
        console.log("Updated parent");
      } else {
        console.log("could not update parent");
      }
    });
    //insert a child as a new user
    userdb.insert(userdata, function(err, body, header) { 
        if(err) { 
            //response.writeHead(500, { "Content-Type": "text/plain" }); 
            ws.send(JSON.stringify({
          _isstring:false,
                json:{data:err},
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
        })); 
        } else { 
            ws.send(JSON.stringify({
          _isstring:false,
                json:{data:"success"},
                updatetime:new Date(),
                _iserror:false,
                _isread:false,
                actioncode:"registerauser"
        })); 
        } 
    }); 
    }
    catch(e)
    {
      ws.send(JSON.stringify(
        {_isstring:false,
          json:{data:e},
          updatetime:new Date(),
          _iserror:true,
          _isread:false,
                actioncode:"error"
              }
        ));
      return;
    }
    return userdata;
  }


/*customo function */
function send_error_or_success(c,ws,err){

}
function compareJson(js1,js2){
  Object.keys(js1).array.forEach( function(element, index) {
    if(!(Object.keys(js2).indexOf(element)>-1))
      return false;
  });
  return true;
}
function create_db(dbname){
  var db;
  nano.db.create(dbname, function(err,body) {
    // specify the database we are going to use    
    if (!err) {
    console.log('database '+dbname+' created!');
  }
    else
    console.log(dbname+" :"+err);   
  });
  db = nano.use(dbname);
  return db;
  function checkLoginvalidation()
  {
    var db=create_db("client");
    db.view('topup', 'findByLoginToken', function(err, body) {
    if (!err) {
      console.log(body);
    }

    });
  }

  // var db = cdb.database(dbname);
  // db.exists(function (err, exists) {
  //   if (err) {
  //     console.log('error', err);
  //   } else if (exists) {
  //     console.log(exists);
  //   } else {
  //     console.log('database does not exists.');
  //     db.create();
  //     /* populate design documents */
  //   }
  // });
}
function initdata(ws,message)
  {
    var c={
    username:"",
    logintoken:"",
    logintime:null,
    logintimeout:null,
    clientuid:null,
    registeruid:null,
    confirmregisteruid:null,
    browserinfo:"",
    ip:"",
    other:"",
    lastaccess:null,
    isexist:false,
    clientjs:"",
    fingerprint:"",
    isonline:false,
    data:""
    };
    try {
      c=message;
      var c_data=c.data;
      c.data=null;
      //check client if exist

      if(!r_client.get(c.clientuid+c.fingerprint+c.registeruid,function(err,reply){
        return (reply== null)? false:true;
      })){
        // c.clientuid=uuidV4();
        // c.registeruid=uuidV4();
        // c.isexist=false;
        // c.isonline=true;
        // r_client.set(c.clientuid+c.fingerprint+c.registeruid,c,redis.print);
        //GO TO LOGIN PAGE
      }
      else
      {
        c.isexist=true;
        c.isonline=true;
        // r_client.set(c.clientuid+c.fingerprint+c.registeruid,c,redis.print);
        //UPDATE WHEN IT EXIST ON server
        update_by_key(c.clientuid+c.fingerprint+c.registeruid,c, function(err, newValue) {
        if (err) {
          throw err;
        }
        console.log('successfully set new value to %j', newValue);
      });
      }
      //c.data=c_data;
      //r_client.quit();
      ws.send(JSON.stringify({
                _isstring:false,
                json:JSON.stringify(c),
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
          }));
    } catch (e) {
      console.log('Error: %s',e);
      ws.close();
    }
    console.log('received: %s',c.data);
  }

function shakehands(ws,message){
      console.log('shakehands %s',message);
    try {
    var c=message;
    //var c=v.json;//client
      if (c!=null) {
        // TODO: check if client exist in redist and update it
         ws.send(JSON.stringify({
                _isstring:true,
                json:c,
                updatetime:new Date(),
                _iserror:false,
                _isread:false,
                actioncode:"shakehands"
          }));
        }
    } catch(e) {
      c.data=e;
      ws.send(JSON.stringify({
                _isstring:true,
                json:c,
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
          }));
    }
  };

function m_code(){
  return randomIntInc(1000000,100000000);
}
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

server.listen(88, function listening() {
  console.log('Listening on %d', server.address().port);
});
