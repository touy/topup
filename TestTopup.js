const async= require('async');
const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4');
const nano = require('nano')('http://admin:admin@localhost:5984');
const LTCSERVICE=require('./ltctopup')();
//const nano = require('nano')('http://localhost:5984');
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
var __default_package={};
function convertTZ(fromTZ){
  return moment.tz(fromTZ,"Asia/Vientiane").format();
}
// Add headers
__master_user={
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
  "parentname": "souk@TheFriendd",
  "isleft": null,
  "aboveparents": "",
  "leftside": 0,
  "rightside": 0,
  "package1left":0,
  "package1right":0,
  "package2left":0,
  "package2right":0,
  "package3left":0,
  "package3right":0,
  "packagevalue": 0,
  "packagename": "",
  "packagegui": "",
  "balancevalue": 0, //bonus balance
  "mainbalance":0, // main balance from cash
  "firstbalance":0,
  "offeredbonus":0,
  "topupbalance":0,
  "bonustopupbalance":0,
  "Lcoupling": 0,
  "Rcoupling": 0,
  "couplingbalance": 0,
  "couplingtotalmoney": 0,
  "sponservalue":0,
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
app.post('/change_password', function (req, res) {//client.data.user
    //js.client.oldpassword1==client.oldpassword2;
    //js.client.data.user.phone1=client.secret;

    var js={};
    js.client=req.body;
    js.resp=res;  
    js.client.data.user.phone1=js.client.data.user.secret;
    delete js.client.data.user.secret;
    
    change_password(js);
 });


app.get('/init_client',function(req,res){// GET new GUI
  client_ip = req.clientIp;
  if(__cur_client.clientuid!=req.body.clientuid)
    res.send(get_init_client(client_ip));
  else
    res.send('good client');
});


app.post('/register', function (req, res) {//client.data.user
  var js={};
  js.client=req.body;
 register(js.client.data.user,res);
});

app.post('/login', function (req, res) {//client.data.user
  //client.data.user.username
  //client.data.user.password

  console.log("LOGIN ");
  //var client=req.body;
  var js={};
  js.client=req.body;
  js.resp=res;
  login(js);
});
app.post('/logout',function (req,res){//client
  var js={};
  js.client=req.body;
  js.resp=res;
  logout(js);
});

app.post('/heartbeat', function (req, res) {//client
  var js={};
  js.client=req;
  js.resp=res;
 heartbeat(js);
});


app.post('/get_userdata', function (req, res) {//client
  var js={};
  js.client=req.body;
  js.resp=res;
 showUserInfo(js);
});

app.post('/get_package', function (req, res) {//
  var js={};
  js.resp=res;
  showPackages(js);
});

app.post('/get_package_details', function (req, res) {//client.data.user
  var js={};
  js.user=req.body;
  js.resp=res;
  showPackageDetailsByUser(js);
});

app.post('/get_user_binary',function (req,res){//client.data.user
  var js={};
  js.user=req.body;
  js.resp=res
  showUserBinary(js);
});
// app.post('/show_user_binary_tree',function (req,res){
//   var js={};
//   js.client=req.body;
//   js.resp=res;
//   showBinaryTree(js);
// });

app.post('/get_topup_balance_by_user',function(req,res){//client
  var js={};
  js.client=req.body;
  js.resp=res;
  showTopupBalanceByUser(js);
});


app.post('/check_main_balance_by_user',function(req,res){//client
  var js={};
  js.client=req.body;
  js.resp=res;
  checkMainBalanceByUser(js);
});

app.post('/upgrade',function(req,res){//client.data.user , client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  upgradePackage(js);
});


app.post('/pay_first_balance',function(req,res){//client 
  var js={};
  js.client=req.body;
  js.resp=res;
  payFirsBalance(js);
});
function getTopUpBalanceByUser(user){
  var deferred=Q.deferr();
  db=create_db('topupBalance');
  db.view(__design_view,'findByUsername',
  {key:user.username,decending:true,limit:1},
  function(err,res){
    if(err)
      deferred.reject(err);
    else{
      if(res.rows.length){
        t=res.rows[0].value
        deferred.resolve(t);
      }
      else
        deferred.reject(new Error('No record'));
    }
  });
  return deferred.promise;
}
function payFirsBalance(js){
  var db=create_db('user');
  db.view(__design_view,'findByUsername',
  {key:js.client.username}
  ,function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var u=res.rows[0].value;     
        js.client.data.user=u;    
        js.client.data.topupbalance={
          username:u.username,
          usergui:u.gui,
          gui:uuidV4(),
          balance:0,
          updated:convertTZ(new Date()),
          diffbalance:u.firstbalance,
          type:"topup first balance"
        };
        updateTopupBalance(js).then(function(body){        
          u.firstbalance=0;
          db.insert(u,u.gui,function(err,res){
            if(err) js.resp.send(err);
            else{
              LTCSERVICE.topupLTC(u.phone1,u.firstbalance);               
              js.client.data.user.message="Pay first balance completely";
              js.resp.send(js.client);
            }
          });
        }).catch(function(err){
          js.resp.send(err);
        }).done();
      }
      else{
        js.client.data.user.message='username not found!';
        js.resp.send(js.client);
      }
    }
  });
}

app.post('/pay_offer',function(req,res){//client
  var js={};
  js.client=req.body;
  js.resp=res;
  payOffer(js);
});
function payOffer(js){
  var db=create_db('user');
  db.view(__design_view,'findByUsername',
  {key:js.client.username}
  ,function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var u=res.rows[0].value;     
        js.client.data.user=u;    
        js.client.data.topupbalance={
          username:u.username,
          usergui:u.gui,
          gui:uuidV4(),
          balance:0,
          updated:convertTZ(new Date()),
          diffbalance:u.offeredbonus,
          type:"topup offered bonus"
        };
        updateTopupBalance(js).then(function(body){        
          u.offeredbonus=0;
          db.insert(u,u.gui,function(err,res){
            if(err) js.resp.send(err);
            else{
              LTCSERVICE.topupLTC(u.phone1,u.offeredbonus);               
              js.client.data.user.message="Pay offer bonus completely";
              js.resp.send(js.client);
            }
          });
        }).catch(function(err){
          js.resp.send(err);
        }).done();
      }
      else{
        js.client.data.user.message='username not found!';
        js.resp.send(js.client);
      }
    }
  });
}



// for admin only
app.post('/show_offer_list',function(req,res){//?
  var js={};
  js.client=req.body;
  js.resp=res;
  showOfferList(js);
});
// for admin only
app.post('/show_bonus_topup_list',function(req,res){//?
  var js={};
  js.client=req.body;
  js.resp=res;
  showBonusTopUpList(js);
});




//admin only
app.post('/send_offer',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  sendOffer(js);
});
//admin only
app.post('/send_bonus_topup',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  sendBonusTopUpBalanceByUser(js);
});

function makePayment(p){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.insert(p,p.gui,function(err,res){
    if(err)deferred.reject(err);
    else{
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}
function sendOffer(js){
  var db=create_db('user');
  db.view(__design_view,'findByUsername',
  {key:js.client.data.user.username}
  ,function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var u=res.rows[0].value;             
          u.offeredbonus=js.client.data.user.offeredbonus;
          db.insert(u,u.gui,function(err,res){
            if(err) js.resp.send(err);
            else{
              var __doc={
                usergui:u.gui,
                username:u.username,
                paymentdate:Date(),
                paymentvalue:u.offeredbonus,
                paymentby:__master_user.username,
                paidbygui:__master_user.gui,
                payreason:"system offer", // cashing , request confirm, 
                attache:"",
                bankinfo:js.client.data.payment.bankinfo,
                targetuser:u.username,
                status:"approved",
                description:"",
                receiveddate:Date(), //
                certifieddate:Date(), //
                approveddate:Date(), //
                gui:uuidV4()
                };
              makePayment(__doc).then(function(body){
                js.client.data.user.message="Send offer bonus completely";
                js.resp.send(js.client);
              }).catch(function(err){                
                js.resp.send(err);
              }).done();    
            }
          });
      }
      else{
        js.client.data.user.message='username not found!';
        js.resp.send(js.client);
      }
    }
  });
}

app.post('/bonus_to_main_balance',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  bonusToMainBalance(js);
});
function updateBonusBalance(user,balance){
  var deferred=Q.defer();
  var db=create_db('bonusbalance');
  findBonusBalanceByUsername(user,0,1).then(function(arr){   
    if(arr.length<1) deferred.reject(new Error('No record'));
    else{
      var b=arr[0];
      balance.balance=b.balance+balance.diffbalance;
      db.insert(balance,balance.gui,function(err,res){
        if(err) deferred.reject(err);
        else{
          deferred.resolve(res);
        }
      });
    }
  }).catch(function(err){
    deferred.reject(err);
  }).done();
  return deferred.promise;
}
function updateMainBalance(user,balance){
  var deferred=Q.defer();
  var db=create_db('mainbalance');
  findMainBalanceByUsername(user,0,1).then(function(arr){   
    if(arr.length<1) deferred.reject(new Error('No record'));
    else{
      var b=arr[0];
      balance.balance=b.balance+balance.diffbalance;
      db.insert(balance,balance.gui,function(err,res){
        if(err) deferred.reject(err);
        else{
          deferred.resolve('update OK');
        }
      });
    }
  }).catch(function(err){
    deferred.reject(err);
  }).done();
  return deferred.promise;
}
function bonusToMainBalance(js){
  var db=create_db('user');
  db.view(__design_view,'findByUsername',
  {key:js.client.username}
  ,function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var u=res.rows[0].value;
        var __balance_doc={
          username:u.username,
          usergui:u.gui,
          gui:uuidV4(),
          balance:0,
          updated:convertTZ(new Date()),
          diffbalance:-js.client.data.balance.diffbalance,
          type:"bonus to main"
        };             
        findBonusBalanceByUsername(js.client,0,1).then(function(body){  
          var bonusbalance=body[0];
          if(u.balancevalue<js.client.data.balance.diffbalance){
            js.resp.send('not enough balance');
            return ;
          }
          updateBonusBalance(u,__balance_doc).then(function(body){
            __balance_doc.diffbalance*=-1;
            updateMainBalance(u,__balance_doc).then(function(body){
              u.balancevalue-=js.client.data.balance.diffbalance;  
              u.mainbalance+=js.client.data.balance.diffbalance;                  
              db.insert(u,u.gui,function(err,res){
                if(err) js.resp.send(err);
                else{
                  var __doc={
                    usergui:u.gui,
                    username:u.username,
                    targetuser:u.username,
                    paymentdate:Date(),
                    paymentvalue:u.offeredbonus,
                    paymentby:__master_user.username,
                    paidbygui:__master_user.gui,
                    payreason:"system offer",
                    attache:"",
                    bankinfo:"",
                    description:"",
                    status:"approved", // checked, inspected , approved, declined
                    receiveddate:Date(),
                    certifieddate:Date(),
                    approveddate:Date(),
                    gui:uuidV4()
                    };
                  makePayment(__doc).then(function(body){
                    js.client.data.user.message="Send offer bonus completely";
                    js.resp.send(js.client);
                  }).catch(function(err){                
                    js.resp.send(err);
                  }).done();    
                }
              });
            }).catch(function(err){
              js.resp.send(err);
            }).done();
          }).catch(function(err){
            js.resp.send(err);
          }).done();                                          
        }).catch(function(err){
          js.resp.send(err);
        }).done();              
      }
      else{
        js.client.data.user.message='username not found!';
        js.resp.send(js.client);
      }
    }
  });
}

app.post('/topup',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  topUp(js);
});
function topUp(js){
  processTopUp(js);
}

app.post('/show_operator_failure_by_user',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showTopUpFailureByUsername(js);
});
app.post('/show_operator_failure',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  //admin only
  showTopUpFailure();
});

app.post('/transfer',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  transferBalance();
});

app.post('/main_balance_list_by_user',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showMainBalance(js)
});
app.post('/bonus_balance_list_by_user',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showBonusBalance(js);
});

app.post('/payment_request',function(req,res){//ask checking paid for main balance, and check request cash out
  var js={};
  js.client=req.body;
  js.resp=res;
  sendPaymentRequest(js);
});
function sendPaymenetRequest(js){
  var __doc={
    usergui:__master_user.gui,
    username:__master_user.username,
    paymentdate:Date(),
    paymentvalue:js.client.data.payment.paymentvalue,
    paymentby:js.client.data.payment.username,
    paidbygui:js.client.data.payment.usergui,
    payreason:"payment request",
    bankinfo:js.client.data.payment.bankinfo,
    targetuser:js.client.data.payment.targetuser,
    status:"",
    attache:js.client.data.payment.attache,
    description:js.client.data.payment.description,
    receiveddate:'',
    certifieddate:'',
    approveddate:'',
    gui:uuidV4()
    };
  if(__doc.paymentvalue<=0){
    js.client.data.message=new Error('payment value must be positive integer');
    js.resp.send(js.client);
    return;
  }
  var users={};
  users.user={};
  users.user.username=__doc.targetuser;
  findUserByUserName(users).then(function(body){
    var db=create_db('payment');
    db.insert(__doc,__doc.gui,function(err,res){
      if(err) js.resp.send(err);
      else{
          js.client.data.message='request for payment confirmation sent';
          js.resp.send(js.client);
      }
    });
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
  
}
app.post('/update_payment_request',function(req,res){//ask checking paid for main balance, and check request cash out
  var js={};
  js.client=req.body;
  js.resp=res;
  updatePaymentRequest(js);
});
function updatePaymentRequest(js){ // js.client.data.payment for admin only
  //check
  //certify
  //approve and send new balance to mainbalance
  var deferred=Q.defer();
  var db=create_db('payment');
  var p=js.client.data.payment;
  var mark='';
  if(js.client.data.payment.status=='declined'){
    p.receiveddate=convertTZ(new Date());
    p.certifieddate=convertTZ(new Date());
    p.approveddate=convertTZ(new Date());
    p.description+=js.client.username;
  }
  if(p.receiveddate!=''&&p.certifieddate!=''&&p.approveddate!=''){
    mark='approved';
  }
  else if(p.receiveddate!=''&&p.certifieddate!=''&&p.approveddate==''){
    mark='certified';
  }
  else if(p.receiveddate!=''&&p.certifieddate==''&&p.approveddate==''){
    mark='checked';
  }
  else if(p.receiveddate==''&&p.certifieddate==''&&p.approveddate==''){
    mark='nothing';
    mark='wrong process, please try again ';
    js.client.data.message=mark;
    js.resp.send(js.client);
    return;
  }
  else{
    mark='wrong process, please try again ';
    js.client.data.message=mark;
    js.resp.send(js.client);
    return;
  }
  if(p._rev)
  makePayment(js.client.data.payment).then(function(body){
    if(mark=='approved'){
      //send balance to that user
      var b={
        username:__master_user.username,
        usergui:__master_user.usergui,
        gui:uuidV4(),
        balance:0,
        updated:convertTZ(new Date()),
        diffbalance:-js.client.data.payment.paymentvalue,
        type:"payment request"
      };
      updateMainBalance(__master_user,b).then(function(body){
        b.username=js.client.data.payment.targetuser;
        b.usergui=js.client.data.payment.usergui;
        b.diffbalance*=-1;
        updateMainBalance(js.client.data.payment.targetuser,b).then(function(body){
        }).catch(function (err){
          js.client.data.message=err;
          js.resp.send(js.client);
        }).done();          
      }).catch(function(err){
        js.client.data.message=err;
        js.resp.send(js.client);
      }).done();
    }
    else if(mark == 'certified'){
      //notify to user or sms or chat
    }
    else if(mark=='checked'){
      //notify to user or sms or chat
    }
    js.client.data.message='payment request has been updated '+mark;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
        

  return deferred.promise;
}


app.post('/cashing_request',function(req,res){//ask checking paid for main balance, and check request cash out
  var js={};
  js.client=req.body;
  js.resp=res;
  sendCashingRequest(js);
});
function sendCashingRequest(js){
  var __doc={
    usergui:__master_user.gui,
    username:__master_user.username,
    paymentdate:Date(),
    paymentvalue:-js.client.data.payment.paymentvalue,
    paymentby:js.client.data.payment.username,
    paidbygui:js.client.data.payment.usergui,
    payreason:"cashing",
    bankinfo:js.client.data.payment.bankinfo,
    targetuser:js.client.data.payment.username,
    status:"",
    attache:js.client.data.payment.attache,
    description:js.client.data.payment.description,
    receiveddate:'',
    certifieddate:'',
    approveddate:'',
    gui:uuidV4()
    };
  if(__doc.paymentvalue>=0){
    js.client.data.message=new Error('Payment value must be positive integer');
    js.resp.send(js.client);
    return;
  }
  if(js.client.data.payment.targetuser!=js.client.data.payment.username||js.client.data.payment.targetuser!=js.client.username||js.client.username!=js.client.data.payment.username){
    js.client.data.message=new Error('you could not cash-out to other usernme');
    js.resp.send(js.client);
    return;
  }
  var users={};
  users.user={};
  users.user.username=js.client.data.payment.username;
  findUserByUserName(js).then(function(body){
    var u=body[0];
    if(u.bankaccount!=__doc.bankinfo){
      js.client.data.message=new Error('Bank info not the same');
      js.resp.send(js.client);
      return;
    }
    var b={
      username:js.client.data.payment.targetuser,
      usergui:js.client.data.payment.usergui,
      gui:uuidV4(),
      balance:0,
      updated:convertTZ(new Date()),
      diffbalance:-js.client.data.payment.paymentvalue,
      type:"cashing request"
    };
      updateMainBalance(js.client.data.payment,b).then(function(body){
        makePayment(__doc).then(function(body){
        }).catch(function(err){
          js.client.data.message=err;
          js.resp.send(js.client);
        }).done();
      }).catch(function(err){
        js.client.data.message=err;
        js.resp.send(js.client);
      }).done(); 
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
app.post('/update_cashing_request',function(req,res){//ask checking paid for main balance, and check request cash out
  var js={};
  js.client=req.body;
  js.resp=res;
  updateCashingRequest(js);
});
function updateCashingRequest(js){ // js.client.data.payment for admin only
  //check
  //certify
  //approve and send new balance to mainbalance
  var deferred=Q.defer();
  var db=create_db('payment');
  var p=js.client.data.payment;
  var mark='';
  if(js.client.data.payment.status=='declined'){
    p.receiveddate=convertTZ(new Date());
    p.certifieddate=convertTZ(new Date());
    p.approveddate=convertTZ(new Date());
    p.description+=js.client.username;
  }
  if(p.receiveddate!=''&&p.certifieddate!=''&&p.approveddate!=''){
    mark='approved';
  }
  else if(p.receiveddate!=''&&p.certifieddate!=''&&p.approveddate==''){
    mark='certified';
  }
  else if(p.receiveddate!=''&&p.certifieddate==''&&p.approveddate==''){
    mark='checked';
  }
  else if(p.receiveddate==''&&p.certifieddate==''&&p.approveddate==''){
    mark='nothing';
  }
  else{
    mark='wrong process, please try again ';
    js.client.data.message=mark;
    js.resp.send(js.client);
    return;
  }
  if(js.client.data.payment._rev)
  makePayment(p).then(function(body){
    js.client.data.message='payment request has been updated '+mark;
    js.resp.send(js.client);
  }).catch(function(err){
  }).done();

  return deferred.promise;
}


app.post('/payment_list_by_username',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showPaymentListByUsername(js);
});
function showPaymentListByUsername(js){
  getPaymentListByUsername(js.client,js.client.data.page,js.client.data.maxpage).then(function(body){
    js.client.data.payment=body;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}

function getPaymentListByUsername(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.view(__design_view,'findCountByUsername',{key:user.username},function(err,res){
    if(err)deferred.reject(err);
    else if(!res.rows.length) deferred.reject("user no record");
    else{
      var count=res.rows[0].value;
      db.view(__design_view,'findByUsername',{key:user.username,decending:true,skip:page,limit:maxpage},function(err,res){
        if(err)deferred.reject(err);
        else if(!res.rows.length) deferred.reject("payment no record");
        else{
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(array[index].value);
          }         
          deferred.resolve({arr:arr,count:count});
        }
      });
    }
  });
  return deferred.promise;
}

app.post('/payment_list_admin',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showPaymentList(js);
});
function showPaymentList(js){
  getPaymentList(s.client.data.page,js.client.data.maxpage).then(function(body){
    js.client.data.payment=body;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}

function getPaymentList(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.view(__design_view,'findCount',{},function(err,res){
    if(err)deferred.reject(err);
    else if(!res.rows.length) deferred.reject("user no record");
    else{
      var count=res.rows[0].value;
      db.view(__design_view,'findall',{decending:true,skip:page,limit:maxpage},function(err,res){
        if(err)deferred.reject(err);
        else if(!res.rows.length) deferred.reject("payment no record");
        else{
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(array[index].value);
          }         
          deferred.resolve({arr:arr,count:count});
        }
      });
    }
  });
  return deferred.promise;
}

app.post('/payment_request_list_by_username',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showPaymentRequestListByUsername(js);
});
function showPaymentRequestListByUsername(js){
  getPaymentRequestListByUsername(js.client,js.client.data.page,js.client.data.maxpage).then(function(body){
    js.client.data.payment=body;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getPaymentRequestListByUsername(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.view(__design_view,'findCountPaymentRequestByUsername',{key:user.username},function(err,res){
    if(err)deferred.reject(err);
    else if(!res.rows.length) deferred.reject("user no record");
    else{
      var count=res.rows[0].value;
      db.view(__design_view,'findPaymentRequestByUsername',{key:user.username,decending:true,skip:page,limit:maxpage},function(err,res){
        if(err)deferred.reject(err);
        else if(!res.rows.length) deferred.reject("payment no record");
        else{
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(array[index].value);
          }         
          deferred.resolve({arr:arr,count:count});
        }
      });
    }
  });
  return deferred.promise;
}

app.post('/cashing_list_by_username',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showCashingListByUsername(js);
});
function showCashingListByUsername(js){
  getCashingListByUsername(js.client,js.client.data.page,js.client.data.maxpage).then(function(body){
    js.client.data.payment=body;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getCashingListByUsername(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.view(__design_view,'findCountCashingRequestByUsername',{key:user.username},function(err,res){
    if(err)deferred.reject(err);
    else if(!res.rows.length) deferred.reject("user no record");
    else{
      var count=res.rows[0].value;
      db.view(__design_view,'findCashingRequestByUsername',{key:user.username,decending:true,skip:page,limit:maxpage},function(err,res){
        if(err)deferred.reject(err);
        else if(!res.rows.length) deferred.reject("cashing no record");
        else{
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(array[index].value);
          }         
          deferred.resolve({arr:arr,count:count});
        }
      });
    }
  });
  return deferred.promise;
}



app.post('/payment_request_list_admin',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showPaymentRequestList(js);
});
function showPaymentRequestList(js){
  getPaymentRequestList(js.client.data.page,js.client.data.maxpage).then(function(body){
    js.client.data.payment=body;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getPaymentRequestList(page,maxpage){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.view(__design_view,'findCountPaymentRequest',{},function(err,res){
    if(err)deferred.reject(err);
    else if(!res.rows.length) deferred.reject("user no record");
    else{
      var count=res.rows[0].value;
      db.view(__design_view,'findPaymentRequest',{decending:true,skip:page,limit:maxpage},function(err,res){
        if(err)deferred.reject(err);
        else if(!res.rows.length) deferred.reject("payment no record");
        else{
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(array[index].value);
          }         
          deferred.resolve({arr:arr,count:count});
        }
      });
    }
  });
  return deferred.promise;
}
app.post('/cashing_request_list_admin',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showCashingList(js);
});
function showCashingList(js){
  getCashingList(js.client,js.client.data.page,js.client.data.maxpage).then(function(body){
    js.client.data.payment=body;
    js.resp.send(js.client);
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getCashingList(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('payment');
  db.view(__design_view,'findCountCashingRequest',{},function(err,res){
    if(err)deferred.reject(err);
    else if(!res.rows.length) deferred.reject("user no record");
    else{
      var count=res.rows[0].value;
      db.view(__design_view,'findCashingRequest',{decending:true,skip:page,limit:maxpage},function(err,res){
        if(err)deferred.reject(err);
        else if(!res.rows.length) deferred.reject("cashing no record");
        else{
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(array[index].value);
          }         
          deferred.resolve({arr:arr,count:count});
        }
      });
    }
  });
  return deferred.promise;
}
app.post('/get_member_count_by_package',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember
  var js={};
  js.client=req.body;
  js.resp=res;
  get_total_member_by_package(js);
});
app.post('/get_member_count',function(req,res){//js.client.data.user , js.client.data.user.ismember
  var js={};
  js.client=req.body;
  js.resp=res;
  get_total_member(js);
});
app.post('/show_coupling_list_by_user',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  showCouplingScoreByUser(js);// show who has the most introduction codes by month
});
app.post('/show_the_best_friend_by_month_year',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  showTheBestFriendByMonthYear(js);// show who has the most introduction codes by month
});
function findTheBestFriendByMonthYear(user,month,year){
  var deferred=Q.defer();
  var db=create_db('introductions');
  db.view(__design_view,'findTheBestFriendByMonthYear',{key:[user.username,month,year]},
  function(err,res){
    if(err) deferred.reject(err);
    else{
      var arr=[];
      for (var index = 0; index < res.rows.length; index++) {
        arr.push(res.rows[index]);        
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}
function addTheBestFriendByMonthYear(user,month,year){
  var deferred=Q.defer();
  var db=create_db('introductions');
  findTheBestFriendByMonthYear(user,month,year).then(function(body){
    var introd={
      gui:uuidV4(),
      username:'',
      month:0,
      year:0,
      count:0
    };
    if(body.length){
      introd=body[0];
    }
    introd.count++;
    db.insert(introd,introd.gui,
    function(err,res){
      if(err) deferred.reject(err);
      else{
        deferred.resolve('OK');
      }
    });
  }).catch(function(err){
    deferred.reject(err);
  }).done();
  
  return deferred.promise;
}
function addTheBestFriendLog(user,introd,month,year){
  var deferred=Q.defer();
  var db=create_db('introductions');
    var introdlog={
      gui:uuidV4(),
      username:user.username,
      introductor:introd,
      month:0,
      year:0,
      createddate:convertTZ(new Date())
    };
    db.insert(introd,introd.gui,
    function(err,res){
      if(err) deferred.reject(err);
      else{
        deferred.resolve('OK');
      }
    });  
  return deferred.promise;

}
function findCountTheBestFriendByMonthYear(month,year){
  var deferred=Q.defer();
  var db=create_db('introductions');
  db.view(__design_view,'findCountByMonthYear',{key:[month,year]},
  function(err,res){
    if(err) deferred.reject(err);
    else{
      var arr=[];
      for (var index = 0; index < res.rows.length; index++) {
        arr.push(res.rows[index].value);        
      }
      deferred.resolve(arr[0].value);
    }
  });
  return deferred.promise;
}
function showTheBestFriendByMonthYear(js){ // get from the most introduction by month  from introductions
  var introd={
    gui:uuidV4(),
    username:'',
    month:0,
    year:0,
    count:0
  };
  var db=create_db('introductions');
  //TODO
  findCountTheBestFriendByMonthYear(js.client.data.month,js.client.data.year).then(
    function(body){
      var count=body[0];
      db.view(__desing_view,'findByMonthYear',{startkey:[js.client.data.month,js.client.data.year],endkey:[js.client.data.month,js.client.data.year,{}],decending:true,skip:js.client.data.page,limit:js.client.data.maxpage},
      ,function(err,res){
        if(err)js.resp.send(err);
        else if(res.rows.length){
          var arr=[];
          for (var index = 0; index < array.length; index++) {
            arr.push(array[index]);
          }
          js.client.data.thebestfriend={arr:arr,count:count};
          js.resp.send(js.client);
        }
        else{
          js.client.data.thebestfriend={arr:arr,count:count};
        }
      });
  }).catch(function (err){
    js.client.message=err;
    js.resp.send(js.client);
  }).done();  
}
//


//for a certain user
app.post('/show_latest_members',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showLatestMembers(js).then(
    function(body){
      js.client.data.latestmember=body;
      js.resp.send(client);
  }).catch(
    function(err){
      js.client.data.message=err;
      js.resp.send(client);
    }).done();//{month:0,year:0,package1:0,package2:0,package3:0}
});
function countLatestMember(user,month,year){
  var deferred=Q.defer();
  var db=create_db('introductionslog');
    db.view(__design_view,'findCountByIntroductorMonthYear',{key:[user.username,month,year]},
    function(err,res){
      if(err) deferred.reject(err);
      else{
        var arr=[];
        if(res.rows.length){
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });  
  return deferred.promise;
}
function showLatestMembers(js){
  var deferred=Q.defer();
  var db=create_db('introductionslog');
  countLatestMember(js.client,js.client.data.month,js.client.data.year).then(function(body){
    var count=body[0];
    db.view(__design_view,'findByIntroductorMonthYear',{key:[js.client.username,js.client.data.month,js.client.data.year],decending:true,skip:js.client.data.page,limit:js.client.data.maxpage},
    function(err,res){
      if(err) deferred.reject(err);
      else{
        var arr=[];
        if(res.rows.length){
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve({arr:arr,count:count});
      }
    }); 
  }).catch(function(err){
    deferred.reject(err);
  }).done();
     
  return deferred.promise;

}
// for admin
app.post('/show_latest_members_list',function(req,res){//js.client.data.user , js.client.data.package
  var js={};
  js.client=req.body;
  js.resp=res;
  showLatestMembersList(js).then(
    function(body){
      js.client.data.latestmember=body;
      js.resp.send(client);
  }).catch(
    function(err){
      js.client.data.message=err;
      js.resp.send(client);
    }).done();//{month:0,year:0,package1:0,package2:0,package3:0}
});
function countLatestMemberList(month,year){
  var deferred=Q.defer();
  var db=create_db('introductionslog');
    db.view(__design_view,'findCountByIntroductorMonthYear',{key:[month,year]},
    function(err,res){
      if(err) deferred.reject(err);
      else{
        var arr=[];
        if(res.rows.length){
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve(arr);
      }
    });  
  return deferred.promise;
}
function showLatestMembersList(js){
  var deferred=Q.defer();
  var db=create_db('introductionslog');
  countLatestMemberList(js.client,js.client.data.month,js.client.data.year).then(function(body){
    var count=body[0];
    db.view(__design_view,'findByMonthYear',{key:[js.client.data.month,js.client.data.year],decending:true,skip:js.client.data.page,limit:js.client.data.maxpage},
    function(err,res){
      if(err) deferred.reject(err);
      else{
        var arr=[];
        if(res.rows.length){
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);
          }
        }
        deferred.resolve({arr:arr,count:count});
      }
    }); 
  }).catch(function(err){
    deferred.reject(err);
  }).done();
     
  return deferred.promise;

}


//RESET bonus topup monthly.




app.get('/default_master',function(req,res){
  var js={};
  js.client=req.body;
  js.resp=res;
  init_default_master_user(js);
});
///*********************** */
// FOR REGISTER CHECKING PROCESS
app.post('/check_registe_available_username',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  checkRegisterAvailableUser(js);
});
app.post('/check_register_max_phone',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  checkRegisterMaxphone(js);
});
app.post('/check_register_password',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  checkRegisterPassword(js);
});
app.post('/check_register_sponsor_code',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  checkRegisterSponserCode(js);
});
app.post('/check_register_need_balance_per_package',function(req,res){//js.client.data.user,js.client.data.package , js.client.data.user.ismember, js.client.data.user.month ,js.client.data.user.year
  var js={};
  js.client=req.body;
  js.resp=res;
  checkRegisterNeedBalancePerPackage(js);
});




app.all('*',function(req,res,next){
  //common action
  console.log(res);
  var client=req.body;
  var keyword="Authen";  
  if(authentication_path(req.path)){
    r_client.getAsync(keyword+client.clientuid).then(function(body) {
      if(body){
        next();
      }
      else
        res.send(new Error("not Allow"));
    }).catch(function(err){
      res.send("redis: "+err);
      //render error
    }).done();
  }
  else if(req.path!='/init_client'){
    if(client.clientuid!=__cur_client.clientuid)
      res.send('not allow!');    
    else
      res.send('OK!');
  }
  else 
    next();
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
      diffbalance:0,
      type:""
    };

__design_view="objectList";
var __desing_system={
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
var __design_balance={
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
      "reduce":"_count",
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
var __design_bonustopupbalance={
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
var __design_user={
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
    "findByParent": {
      "map": "function(doc) {\r\n    if(doc.parent) {\r\n        emit(doc.parent,doc);\r\n    }\r\n}"
    },
    "findTopUser": {
      "map": "function(doc) {\r\n    if(doc.memberlevel==0&&doc.parentgui==doc.gui) {\r\n        emit(null,doc);\r\n    }\r\n}"
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
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }

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
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
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
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
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
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
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
    },
    "findBy_Id": {
      "map": "function (doc) {\n if(doc._id) \n emit([doc._id], doc);\n}"
    }
    
  },
  "language": "javascript"
};
var __design_payment={
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
var __design_topupfailure={
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
var __design_operatorLogCenterBalance={
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
var __design_operatorCenterBalance={
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
var __design_operatorbalance={
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
var __design_introductionslog={
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
var __design_introductions={
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
      if(err){
        db.get('_design/objectList',function(err,res){
          if(err) console.log('could not find design '+err.message);
          else{
            if(res){
              var d=res;
              //console.log("d:"+JSON.stringify(d));
              db.destroy('_design/objectList',d._rev,function(err,res){
                if(err) console.log(err);
                else{
                  //console.log(res);
                  db.insert(design,"_design/objectList",function(err,res){
                    if(err) console.log('err insert new design '+dbname);
                    else{
                      console.log('insert completed '+dbname);
                    }
                  });
                }
              });
            }
            else{
              console.log("could not find design");
            }
          }
        });
      }
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
    __cur_client=c;
  return c;
}

function set_client(js){
   
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
  var keyword="Authen";
  console.log("client.clientuid"+js.client.clientuid)
  
  if(js.client.clientuid==""||js.client.logintoken==""){
    js.client.clientuid="";
    keyword="NOBODY";
    throw new Error("Client not init, please check");
  } 

  r_client.getAsync(keyword+js.client.clientuid+js.client.logintoken).then(function(res) {
    //console.log("res"+JSON.stringify(res));
    if(res){
      r_client.del(keyword+js.client.clientuid+js.client.logintoken);
      js.client.clientuid=uuidV4();
      //client.logintoken=uuidV4();
    }
    delete js.client.data;
    //js.client.clientuid=uuidV4();
    js.client.logintoken=uuidV4();
    r_client.setAsync(keyword+js.client.clientuid+js.client.logintoken, JSON.stringify(js.client),'EX',15*60).then(function(res) {      
      if(js.resp&&res){
        __cur_client=js.client;
        js.resp.send(res);     
      }   
    });
  }).catch(function(err){
    js.resp.send(err);
  }).done(); 
  
}
function change_password(js){
  if(js.client.data.user.password1==js.client.data.user.password2){ 
    
    //delete js.client.data.user.password1;
    delete js.client.data.user.password2;
    changePassword(js).then(function(body){
      js.client.data.message=body;
      js.resp.send(js.client);
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
  var password=js.client.data.user.oldpassword;
  delete js.client.data.user.oldpassword;
  db.view(__design_view,'changePassword',{key:[username,password,phone1],include_docs:true},function(err,res){
    if(err) deferred.reject(err);
    else{
      if(res.rows.length){
        u=res.rows[0].value;
        //delete u._rev;
        u.password=js.client.data.user.password1;
        
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

function authentication_path(path){
  switch (path) {
    case '/login':
      
      return true;
      break;
    case '/logout':
    
      return true;
    break;
    case '/get_main_balance':
    
      return true;
    break;
    case '/get_bonus_balance':
    
      return true;
    break;
    case '/get_topup_balance':
    
      return true;
    break;
    case '/get_bonus_topup_balance':
    
      return true;
    break;
    case '/check_main_balance':
    
      return true;
    break;
    case '/get_coupling_socre':
    
      return true;
    break;
    case '/get_user_binary_tree':
    
      return true;
    break;
    case '/get_user_binary':
    
      return true;
    break;
    case '/get_balance':
    
      return true;
    break;
    case '/get_payment_list':
    
      return true;
    break;
    case '/get_package_details':
    
      return true;
    break;
    case '/get_userdata':
    
      return true;
    break;
    case '/heartbeat':
    
      return true;
    break;
    case '/register':
    
      return true;
    break;
    case '/get_package':
    
      return true;
    break;
    case '/change_password':
    
      return true;
    break;
    case '/upgrade':
    
      return true;
    break;
    case '/default_master':
      return true;
    break;
    
    default:
      break;
  }
  return false;
}



function logout(js,resp){
  var keyword="Authen";
  r_client.getAsync(keyword+js.client.clientuid+js.client.logintoken).then(function(res) {
    //console.log("res"+JSON.stringify(res));
    if(res){
      r_client.del(keyword+js.client.clientuid+js.client.logintoken,function(err,res){
        js.client.logintoken="";
        js.client.logintime="";
        js.client.username="";
        js.client.data={};
        __cur_client=js.client;
        js.resp.send(js.client);
        
      });
    }
  }).catch(function(err){
    js.resp.send(err);
  }).done();
}
/**HEARTBEAT */
function heartbeat(js){
  // UPDATE HEARTBEAT
  if(js.client.logintoken==__cur_client.logintoken){
    
    r_client.getAsync(keyword+js.client.clientuid+js.client.logintoken).then(function(body){
    if(body.user.username==__cur_client.username){

      js.client.data={};
      js.client.username=body.user.username;
      //js.client.logintime=convertTZ(new Date());
      //js.client.logintoken=uuidV4();
      js.client.lastaccess=convertTZ(new Date());
      //set_client(client,resp);
      set_client(js);
      js.resp.send(js.client);
    }
    else{
      js.client.data={}; 
      js.client.data.message="NO this Username and password";
      js.resp.send(js.client);
    }
    }).catch(function(err){
      console.log(err);
      js.resp.send(err)
    }).done(); 
  }
}
// function set_heartbeat_interval(client,resp){
//       client.clientuid=uuidV4();
      
//       set_client(client,resp);
//       set_authentication(client);
// }
/** */
init_redis();
init_db('introductions',__design_introduction);
init_db('introductionslog',__design_introductionslog);
init_db('bonusbalance',__design_balance);
init_db('couplingscore',__design_coupling_score);
init_db('topupfailure',__design_topupfailure);
init_db('mainbalance',__design_balance);
init_db('topupbalance',__design_balance);
init_db('topupbalancesum',__design_balance);
init_db('operatorlogcenterbalance',__design_operatorLogCenterBalance);
init_db('operatorcenterbalance',__design_operatorCenterBalance);
init_db('operatorbalance',__design_operatorbalance);
//init_db('bonustopupbalance',__design_balance);
init_db('packagedetails',__design_packagedetails);
init_db('bonustopupbalance',__design_bonustopupbalance);
init_db('payment',__design_payment);
//init_db("system",__desing_system); 
init_db('user',__design_user);
init_db('package',__design_package);

init_master_user();
init_default_package();

function init_redis(){
  r_client.flushdb( function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});
}

function init_default_master_user(js){
  var db=create_db("user");
  db.view(__design_view,"findTopUser",function(err,res){
    if(!err){
      //__master_user._rev=res.rows[0].value._rev; // always update master user
      __master_user._rev=res.rows[0].value._rev;
      db.insert(__master_user,__master_user.gui,function(err,res){
        //console.log(err); 
         if(err){
           throw new Error(err);
           js.resp.send(err);
         }
         else{
           r_client.setAsync("__Master",JSON.stringify(__master_user)).then(function(body){

           }).catch(function(err){
             throw new Error("could not set master user for redis"+err);
             js.resp.send(err);
           }).done();
           console.log("top user created!");
           js.resp.send("done!");
         }
       });
    }
    else{
      var l={
        log:("error %s",JSON.stringify(err)),
        logdate:new Date(),
        type:"error",
        gui:uuidV4()
      };
      logging(l);
      console.log(err);
      js.resp.send(err);
    }
      
  });
} 
function init_master_user(){
    var db=create_db("user");
    console.log("init master");
    r_client.getAsync("__Master").then(function(body){
      //console.log("body: "+body);
      if(!body){ 
        db.view(__design_view,"findTopUser",function(err,res){
          // console.log("res"+JSON.stringify(res.rows[0].value));
           if(err){
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
           }          
           else if(res.rows.length){
             console.log(res.rows);
             r_client.setAsync("__Master",JSON.stringify(res.rows[0].value)).then(function (body){
               console.log('setAsync');
               console.log("Master has been set");
             }).catch(function(err){
               throw new Error("could not set master user for redis"+err);
             }).done();
           }
           else{
            //__master_user._rev=res.rows[0].value._rev; // always update master user
            db.insert(__master_user,__master_user.gui,function(err,res){
              //console.log(err); 
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
             
         });
      }
      else {
        __master_user=JSON.parse(body);
      }
    });
}
function init_default_package(){
  var db=create_db("package");
  console.log("init package");
  r_client.getAsync("__Package").then(function(body){
    if(!body){
      db.view(__design_view,"findAll",function(err,res){     
        if(err){        
          console.log("error find default package")
        }          
        else if(res.rows.length){
          var arr=[];
          res.rows.forEach(function(element) {
            arr.push(element.value);
          }, this);
          r_client.setAsync("__Package",JSON.stringify(arr)).then(function (body){          
            console.log("default Package has been set");
            __default_package=arr;
          }).catch(function(err){
            throw new Error("could not set default package for redis"+err);
          }).done();
        }
        else{
          var p=[];
          p.push({
            _id:"4f095522-f461-4a0b-afc4-0ad7cf05c722",
            gui:"4f095522-f461-4a0b-afc4-0ad7cf05c722",
            packagename:"The Best Friend",
            packagevalue:1750000,
            isactive:true,
            createddate:new Date(),           
          });
          p.push({
            _id:"afb6420f-26e6-4fab-87fd-b1d7a26fdfd5",
            gui:"afb6420f-26e6-4fab-87fd-b1d7a26fdfd5",
            packagename:"Close Friend",
            packagevalue:350000,
            isactive:true,
            createddate:new Date(),           
          });
          p.push({
            _id:"f8d36fb4-575e-4aaa-bd85-099031077699",
            gui:"f8d36fb4-575e-4aaa-bd85-099031077699",
            packagename:"The Friend",
            packagevalue:100000,
            isactive:true,
            createddate:new Date(),           
          });

          db.bulk({docs:p},function(err,res){
            if(err) console.log("package"+err);
            else{
              console.log("package"+res); 
            }
          });
          r_client.setAsync("__Package",JSON.stringify(arr)).then(function (body){          
            console.log("default Package has been set");
            __default_package=p;
          }).catch(function(err){
            throw new Error("could not set default package for redis"+err);
          }).done();
        }
      });  
    }
    //else __default_package=JSON.parse(body);
  });
}
function login(js){
  console.log("HI LOGIN");
  //var js=client.data;
  //console.log(js.client.data);
  check_authentication(js.client.data).then(function(body){
    // console.log("body:"+JSON.stringify(body));
    // console.log("client.data:"+JSON.stringify(client.data));

    // encrypt password and compare here 

    if(body.user.username==js.client.data.user.username&&body.user.password==js.client.data.user.password){
      js.client.data={};
      js.client.username=body.user.username;
      js.client.logintime=convertTZ(new Date());
      js.client.logintoken=uuidV4();
      js.client.isexist=true;
      //set_client(client,resp);
      js.client.lastaccess=convertTZ(new Date());
      set_client(js);
      js.resp.send(js.client);
    }
    else{  
      js.client.username="";
      js.client.logintime="";
      js.client.logintoken="";
      js.client.data={}; 
      js.client.lastaccess=convertTZ(new Date());
      set_client(js);
      js.client.data.message="NO this Username and password";
      js.resp.send(js.client);
    }
  }).catch(function(err){
    console.log(err);
  }).done(); 
}
function check_authentication(js){
  var deferred=Q.defer();
  var db=create_db("user");
  //console.log(js);
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


function showBonusBalance(js){
    var db=create_db("bonusBalance");    
    countBonusBalanceByUsername(js.client).then(function(res){      
      var count=res;
      findBonusBalanceByUsername(js.client,js.client.data.page,js.client.data.maxpage).then(function(arr){   
        js.client.data.balance={arr:arr,count:count};
        js.resp.send(js.client);
      }).catch(function(err){
        js.resp.send(JSON.stringify(err));
      }).done();
    }).catch(function(err){
      js.resp.send(JSON.stringify(err));
    }).done();
}
function countBonusBalanceByUsername(user){
  var deferred=Q.defer();
  js.db.view(__design_view,"findCount",{
      key: user.username,
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
function findMainBalanceByUsername(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('mainbalance');
  db.view(__design_view,"findByUsername",{
      key: user.username,
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
function findBonusBalanceByUsername(user,page,maxpage){
  var deferred=Q.defer();
  var db=create_db('bonusbalance');
  db.view(__design_view,"findByUsername",{
      key: user.username,
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

function addMainBalanceByUser(js,user){
  var deferred=Q.defer();
  if(!user) user=js.user;
  if(!js.balance) throw new Error("empty balance object")
  if(js.balance.type.indexOf('main')>-1){
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
                if(b.type.indexOf('main')>-1){
                  u.mainbalance+=b.balance;
                }
                else{
                  u.balancevalue+=b.balance;
                  if(b.type=="intro"){
                    u.sponservalue+=b.diffbalance;
                  }
                }                                
                if(b.type=="score"){
                  u.couplingbalance=0;
                  u.couplingtotalmoney+=b.diffbalance; 
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
    parent.userleftgui=js.user.username; // add a new member as the left side
    //parent.leftside.push(user.gui); // push new member as left side range
    js.user.aboveparents.push(parent.aboveparents); // push parent's parent first
    js.user.aboveparents.push(parent.username);//push the latest parent at last
  }
  else if(!js.user.isleft&&parent.userrightgui==""){
    parent.userrightgui=js.user.username; // add a new member as the right side
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
        //count member by new user
        // countTotalMembers(js.user.username).then(function(body){
          // totalmember, count left , right members, package1left, package1right, package2left, package2right , package3left, package3right
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
function check_available_user(js){

  findUserByUserName(js.client.data).then(function(body){
    if(body[0].username==js.client.data.user.username){
      js.client.data.message="you can't use this user name";
      js.resp.send(js.client);
    }
    else{
      js.client.data.message="this user is OK";      
      js.resp.send(js.client);
    }
  }).done();
}



function register(register/*,needbalance*/,resp){//needbalance={main:0.5,bunus:0.5}
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
    parentgui:"",
    parentname:"",//as a userid or parentid  as a client GUI or current user gui
    isleft:false, // not show
    //isB:false,
    userleftgui:"" ,// not show
    userrightgui:"",// not show
    aboveparents:"",
    leftside:0,
    rightside:0,
    package1left:0,
    package1right:0,
    package2left:0,
    package2right:0,
    package3left:0,
    package3right:0,

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
      attache:"",
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
    
    var js={db:create_db("user"),client:client,resp:resp,user:register/*,needbalance:needbalance*/};
    js.topuser=__master_user;

     // find client exist ==>
    findClientExist(js).then(function(body){
      // find user  ==>
      var registra=body;
      js.registra=registra;
      findUserByUserName(js).then(function(body){    
        // find if a new user is qualify for max phone number  ==>
        js.user.password=js.user.password.trim();
        if(body.length>0)
          throw Error('you could not use this username');
        if(!validatePassword(js.user.password))
          throw Error('password must be length >=6');
        // FIND max number can use to register a new account ==>
        findMaxPhoneNumber(js).then(function(body){
          
          if(body.length>3) throw new Error("this number could not be registered in more than 3 accounts");   
          // find a parent
          findParentByUsername(js).then(function (body){
            // find introductioncode
            var parent=body;
            
            // MUST be UPLINE ONLY TODO* MUST BE UPLINE, PUT aboveparents property to solve this problem ==>
            findUserByIntroductionCode(js).then(function (body){
              var introductor=body;
              
              if(introductor.gui!=parent.gui || parent.aboveparents.indexOf(introductor.gui)<1){
                throw new Error("introductor code is not in the same upline");   
              }
              // find register package , later use this for upgrade ==>
              js.db=create_db("package");
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
                  
                  // if(/*js.needbalance.main>registrabalance.main.balance||*/js.needbalance.bonus>registrabalance.bonus.balance)
                  //   throw new Error('balance is abnormal please contact admin');
                  
                  // // if(js.needbalance.bonus.balance>package.packagevalue/2){
                  // //   throw new Error("max register amount is 50%");
                  // // }                  
                  // if((js.needbalance.main/*+js.needbalance.bonus*/)!=package.packagevalue){
                  //   throw new Error("register value and package has not equal value");
                  // }
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
    var month=convertTZ(new Date()).getMonth()+1;
    var year=convertTZ(new Date()).getFullYear();
    addTheBestFriendByMonthYear(introductor,month,year).then(function(boy){
      addTheBestFriendLog(js.user,introductor,month,year).then(function(body){
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
      addMainBalanceByUser(js,js.user).then(function(body){
        console.log(body);
        var __doc={
          usergui:js.user.gui,
          username:js.user.username,
          paymentdate:Date(),
          paymentvalue:js.user.firstbalance,
          paymentby:__master_user.username,
          paidbygui:__master_user.gui,
          payreason:"system first balance",
          bankinfo:'',
          targetuser:js.user.username,
          status:"approved",
          attache:"",
          description:"",
          receiveddate:Date(),
          certifieddate:Date(),
          approveddate:Date(),
          gui:uuidV4()
          };
        makePayment(__doc);
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

        addMainBalanceByUser(js,introductor).then(function(body){
          console.log(body); 
          var __doc={
            usergui:introductor.gui,
            username:introductor.username,
            paymentdate:Date(),
            paymentvalue:introductionvalue,
            paymentby:__master_user.username,
            paidbygui:__master_user.gui,
            payreason:"system intro",
            bankinfo:"",
            targetuser:introductor.username,
            status:"approved",
            attache:"",
            description:"",
            receiveddate:Date(),
            certifieddate:Date(),
            approveddate:Date(),
            gui:uuidV4()
            };
          makePayment(__doc);

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
          addMainBalanceByUser(js,js.topuser).then(function(body){                                                                                                            
            //// the rest money===> 1750000- 125000- 250.000- 107500 -100000 =1.167.500
            // normally each parent get 100.000 max, but limit by max pay and total parent will get average value 
            // by total number of parent.
            //js.db=create_db("user");
            var __doc={
              usergui:js.topuser.gui,
              username:js.topuser.username,
              paymentdate:Date(),
              paymentvalue:fee,
              paymentby:__master_user.username,
              paidbygui:__master_user.gui,
              payreason:"system fee",
              bankinfo:"",
              targetuser:js.topuser.username,
              status:"approved",
              attache:"",
              description:"",
              receiveddate:Date(),
              certifieddate:Date(),
              approveddate:Date(),
              gui:uuidV4()
              };
            makePayment(__doc);

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
                addMainBalanceByUser(js,js.topuser).then(function(body){                  
                    if(body){
                      console.log("rest value has been added to topup ");
                      var __doc={
                        usergui:js.topuser.gui,
                        username:js.topuser.username,
                        paymentdate:Date(),
                        paymentvalue:theRestValue,
                        paymentby:__master_user.username,
                        paidbygui:__master_user.gui,
                        attache:"",
                        bankinfo:"",
                        targetuser:js.topuser.username,
                        status:"approved",
                        payreason:"system rest",
                        description:"",
                        receiveddate:Date(),
                        certifieddate:Date(),
                        approveddate:Date(),
                        gui:uuidV4()
                        };
                      makePayment(__doc);
                    }
                }); 
              }
                // - under limit of max paid per day
              qp.forEach(function(element) {
                var db=create_db("bonusBalance");
                var now=convertTZ(new Date());
                var nowArr=[now.getFullYear(),(now.getMonth()+1),now.getDate()];
                db.view(__design_view,"findBalanceByUserAndDate",{
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
                        addMainBalanceByUser(js,js.topuser).then(function(body){
                          if(body){
                            // insert to qp balance
                            // update qp
                            var __doc={
                              usergui:js.topuser.gui,
                              username:js.topuser.username,
                              paymentdate:Date(),
                              paymentvalue:averageValue,
                              paymentby:__master_user.username,
                              paidbygui:__master_user.gui,
                              payreason:"system over-recieved",
                              attache:"",
                              bankinfo:"",
                              targetuser:js.topuser.username,
                              status:"approved",
                              description:"",
                              receiveddate:Date(),
                              certifieddate:Date(),
                              approveddate:Date(),
                              gui:uuidV4()
                              };
                            makePayment(__doc);
                            js.balance={
                              username:qp.username,
                              usergui:qp.gui,
                              gui:uuidV4(),
                              balance:0,
                              updated:convertTZ(new Date()),
                              diffbalance:0,
                              type:"score"
                            };
                            addMainBalanceByUser(js,qp).then(function(body){
                              if(body){
                                var __doc={
                                  usergui:qp.gui,
                                  username:qp.username,
                                  paymentdate:Date(),
                                  paymentvalue:0,
                                  paymentby:__master_user.username,
                                  paidbygui:__master_user.gui,
                                  payreason:"system score",
                                  attache:"",
                                  bankinfo:"",
                                  targetuser:qp.username,
                                  status:"approved",
                                  description:"",
                                  receiveddate:Date(),
                                  certifieddate:Date(),
                                  approveddate:Date(),
                                  gui:uuidV4()
                                  };
                                makePayment(__doc);
                                deductBalanceForRegister(js);
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
                          addMainBalanceByUser(js,js.topuser).then(function(body){
                            if(body){
                              // insert to qp balance
                              // update qp
                              var __doc={
                                usergui:js.topuser.gui,
                                username:js.topuser.username,
                                paymentdate:Date(),
                                paymentvalue:averageValue2,
                                paymentby:__master_user.username,
                                paidbygui:__master_user.gui,
                                payreason:"system over-recieved",
                                attache:"",
                                bankinfo:"",
                                targetuser:js.topuser.username,
                                status:"approved",
                                description:"",
                                receiveddate:Date(),
                                certifieddate:Date(),
                                approveddate:Date(),
                                gui:uuidV4()
                                };
                              makePayment(__doc);
                              js.balance={
                                username:qp.username,
                                usergui:qp.gui,
                                gui:uuidV4(),
                                balance:0,
                                updated:convertTZ(new Date()),
                                diffbalance:averageValue-averageValue2,
                                type:"score"
                              };
                              addMainBalanceByUser(js,qp).then(function(body){
                                if(body){
                                  var __doc={
                                    usergui:qp.gui,
                                    username:qp.username,
                                    paymentdate:Date(),
                                    paymentvalue:js.balance,
                                    paymentby:__master_user.username,
                                    paidbygui:__master_user.gui,
                                    payreason:"system over-recieved",
                                    attache:"",
                                    bankinfo:"",
                                    targetuser:qp.username,
                                    status:"approved",
                                    description:"",
                                    receiveddate:Date(),
                                    certifieddate:Date(),
                                    approveddate:Date(),
                                    gui:uuidV4()
                                    };
                                  makePayment(__doc);
                                  deductBalanceForRegister(js);
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
                        addMainBalanceByUser(js,qp).then(function(body){
                          if(body){
                              // update couplingscore of qp current user
                              var __doc={
                                usergui:qp.gui,
                                username:qp.username,
                                paymentdate:Date(),
                                paymentvalue:js.balance,
                                paymentby:__master_user.username,
                                paidbygui:__master_user.gui,
                                payreason:"system over-recieved",
                                attache:"",
                                bankinfo:"",
                                targetuser:qp.username,
                                status:"approved",
                                description:"",
                                receiveddate:Date(),
                                certifieddate:Date(),
                                approveddate:Date(),
                                gui:uuidV4()
                                };
                              makePayment(__doc);
                              js.db=create_db("user");
                              qp.couplingbalance=0;
                              js.db.insert(qp,qp.gui,function(err,res){
                                if(err)
                                  throw new Error(err);
                                else{
                                  deductBalanceForRegister(js);
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
  }).catch(function(err){
    js.resp.send(error);
  }).done();
    }).catch(function(err){
      js.resp.send(err);
    }).done();
    
  }).catch(function(error){
    js.resp.send(error);
  }).done();                          
}

function deductBalanceForRegister(js){
  // deduct money from registra user
  //mainBalance
  js.db=create_db("mainBalance");
  js.balance={
    username:js.regsi.registra.username,
    usergui:js.regsi.registra.gui,
    gui:uuidV4(),
    balance:0,
    updated:convertTZ(new Date()),
    diffbalance:-1*(js.package.packagevalue),
    type:"registermain"
  };
  console.log("update user balance completed"+js.registra.username);
  addMainBalanceByUser(js,js.registra).then(function(boy){
    if(body){
      var __doc={
        usergui:js.registra.gui,
        username:js.registra.username,
        paymentdate:Date(),
        paymentvalue:js.balance.diffbalance,
        paymentby:__master_user.username,
        paidbygui:__master_user.gui,
        payreason:"system registermain",
        attache:"",
        bankinfo:"",
        targetuser:js.registra.username,
        status:"approved",
        description:"",
        receiveddate:Date(),
        certifieddate:Date(),
        approveddate:Date(),
        gui:uuidV4()
        };
      makePayment(__doc);
      console.log("deduct main balance from registra completed "+registra.username);
      js.resp.send("registratrion was completed");
    }
  });
}

function findUserByUserName(js){
  var deferred=Q.defer();
  var db=create_db('user');
  jdb.view(__design_view,"findByUserName",{
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
          //js.body=arr;
          deferred.resolve(arr);
        }
      }
    });
    return deferred.promise;
}
function validatePassword(p){
  if(p.length>5)return true;
  return false;
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
function showPackages(js){
  if(__default_package){
    js.resp.send(__default_package);
  }
  else{
    js.db=create_db('package')
    getPackage().then(function(body){
      if(body)
        js.resp.send(body);
    }).catch(function(err){
      js.resp.send(err);
    });
  }
  
  
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
    return deferred.promise;
}
function showPackageDetailsByUser(js){
  getPackageDetailsByUser(js.client.data.user).then(function(body){
    if(body)
      js.resp.send(body);
  }).catch(function(err){
    js.resp.send(err);
  });
}
function getPackageDetailsByUser(user){
  var deferred=Q.defer();
  var db=create_db('packagedetails');
  db.view(__design_view,"findByUsername", {
      key:user.username,
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
        }
          deferred.resolve(arr);
      }
    });
    return deferred.promise;
}

function showUserBinary(js){
  getUserBinaryByUser(js.client.data.user).then(function(body){
    if(body)
      js.resp.send(body);
  }).catch(function(err){
    if(err)
      js.resp.send(err);
  })
}
function getUserBinaryByUser(user){
  var deferred=Q.defer();
  var db=create_db('userbinary');
  db.view(__design_view,"findByUsername", {
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
            e={};
            e.username=element.value.username;
            e.packagevalue=element.value.packagevalue;
            e.packagegui=element.value.packagegui;
            e.leftside=element.value.leftside;
            e.rightside=element.value.rightside;
            e.gui=element.value.gui;
            arr.push(e);
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
function showCouplingScoreByUser(js){
    js.db=create_db('couplingscore');
    getCountCouplingScoreByUser(js.client).then(function(body){
      js.client.data.couplingscore;
      js.resp.send(js.client);
    }).catch(function(err){
      js.resp.send(err);
    });
}
function getCountCouplingScoreByUser(user){
  var deferred=Q.defer();
  var db=create_db('couplingscore');
  db.view(__design_view,"findCountByUsername", {
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
function getCouplingScoreByUser(js){
  var deferred=Q.defer();
  var db=create_db('couplingscore');
  getCountCouplingScoreByUser(js.client,js.client.data.page,js.client.data.maxpage).then(function(body){
    if(body){
      var count=body[0];
      // var __doc={
      //   usergui:"",
      //   username:"",
      //   Lscore:0,
      //   Rscore:0,
      //   balance:0,
      //   createddate:convertTZ(new Date()),
      //   gui:uuidV4()
      //   };
        js.db.view(__design_view,"findByUsername", {
          key:js.client.username,
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
              deferred.resolve({arr:arr,count:count});
            }
            else{
              deferred.resolve(arr);
            }
          }
        });
    }
  }).catch(function(err){
    deferred.reject(err);
  }).done();
  return deferred.promise;
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
          u=result.rows[0];          
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
                      u.Lcoupling=c.Lscore;//not show
                      u.Rcoupling=c.Rscore;// not show
                      u.couplingbalance+=c.balance;// this must be total money of balance
                      //u.balancevalue=c.balance;
                      //u.couplingtotalmoney+=u.balancevalue;
                      //update count total member
                      if(curUser.isleft){
                        u.leftside++;
                        if(curUser.packagevalue==100000){
                          u.package1left++;
                        }
                        else if(curUser.packagevalue==350000){
                          u.package2left++;
                        }
                        else if(curUser.packagevalue==1750000){
                          u.package3left++;
                        }
                      }                
                      else{
                        u.rightside++;
                        if(curUser.packagevalue==100000){
                          u.package1right++;
                        }
                        else if(curUser.packagevalue==350000){
                          u.package2right++;
                        }
                        else if(curUser.packagevalue==1750000){
                          u.package3right++;
                        }
                      }

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

function findParentByUsername(js){
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
function upgradePackage(js){
  var db=create_db("user");
  //find user if exist
  db.view(__design_view,"findByUsername",{key:js.client.data.user.username},function(err,res){
    if(err)
      js.resp.send(err);
    else{
      if(res.rows.length){
        db=create_db("packagedetails");
        u=res.rows[0].value;
        //find if user has a registeration of package
        db.view(__design_view,"findActiveByUserGUI",{key:js.client.data.user.username,descending:true},function(err,res){
          if(err){
            js.client.data.message=JSON.stringify(err);
            js.resp.send(js.client);
          }
          else{
            if(res.rows.length){
              var d=res.rows[0].value;
              var __doc={
                gui:uuidV4(),
                userui:js.client.data.user.username,
                packageui:js.client.data.package.gui,
                registerdate:convertTZ(new Date()),
                updateddate:convertTZ(new Date()),
                isactive:true,
                notactivedate:null,
                };
              d.updateddate=convertTZ(new Date());
              d.notactivedate=convertTZ(new Date());
              d.isactive=false;
              db.insert(d,d.gui,function(err,res){
                if(err) js.resp.send(err);
                else{
                  db.insert(__doc,__doc.gui,function(err,res){
                    if(err){
                      js.client.data.message=JSON.stringify(err);
                      js.resp.send(js.client);
                    } 
                    else{
                      u.packagevalue=js.client.data.package.packagevalue;
                      u.packagegui=js.client.data.package.gui;
                      u.packagename=js.client.data.package.packagename;
                      updateUser(u).then(function(body){
                        if(body){
                          js.client.data.message="Upgrade package was completed";
                          js.resp.send(js.client);
                        }
                      }).catch(function(err){
                        js.client.data.message=JSON.stringify(err);
                        js.resp.send(js.client);
                      });                      
                    }
                  });
                }
              });
              
            }
            else{
              var __doc={
                gui:uuidV4(),
                userui:js.client.data.user.username,
                packageui:js.client.data.package.gui,
                registerdate:convertTZ(new Date()),
                updateddate:convertTZ(new Date()),
                isactive:true,
                notactivedate:null,
                };
              db.insert(__doc,__doc.gui,function(err,res){
                if(err) {
                  js.client.data.message=JSON.stringify(err);
                  js.resp.send(client);
                }
                else{
                  js.client.data.message="Upgrade package was completed";
                  js.resp.send(js.client);
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
function showBinaryTree(js){
  var db=create_db("userbinary");
  db.view(__design_view,"findByUsername",{key:js.client.data.user.username,descending:true},function(err,res){
    if(err) resp.send(err);
    else{
      if(res.rows.length){
        js.client.data.userbinary=res.rows[0].value;
        js.client.data.message="OK";
        js.resp.send(js.client);
      }
    }
  });
}
// - ລາຍງານ, ຄະແນນ ເງິນ ຈຳນວນ ສະມາຊິກຂອງຜູ້ໃຊ້ເອງ


function checkMainBalanceByUser(js){
  var db=create_db("mainBalance");
  db.view(__design_view,"findCount",{key:js.client.username,reduce:true},function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:js.client.username,descending:true,limi:1},function(err,res){
          if(err) js.resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              if(arr[0].balance>js.client.data.package.packagevalue)
                js.client.data.message="insufficient funds";
              else{
                js.client.data.balance={arr:arr,count:count};
                js.client.data.message="OK";
              }                
              js.resp.send(js.client);  
            }
          }
        });
      }
    }
  });
}

function showMainBalance(js){
  var db=create_db("mainBalance");
  db.view(__design_view,"findCount",{key:js.client.username,reduce:true},function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var count=res.rows[0].value;
        db.view(__design_view,"findByUsername",{key:js.client.username,descending:true,limit:js.client.data.maxpage,skip:js.client.data.page},function(err,res){
          if(err) js.resp.send(err);
          else{
            if(res.rows.length){
              var arr=[];
              for(i=0;l=rows.length,i<l;i++){
                arr.push(res.rows[i].value);          
              }
              js.client.data.balance={arr:arr,count:count};
              js.client.data.message="OK";
              js.resp.send(js.client);  
            }
          }
        });
      }
    }
  });
}

function getCountBalanceByUser(user){
  var deferred=Q.defer();
  db.view(__design_view,"findCountByUsername",{key:js.client.username},function(err,res){
    if(err) deferred.reject(err);
    else{
      var arr=[];
      if(res.rows.length){
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}
function showTopupBalanceByUser(js){
  var db=create_db("topupbalance");
  getCountBalanceByUser(js.client.username).then(function(body){
    var count=body[0];
    db.view(__design_view,"findByUsername",{key:js.client.username,descending:true,limit:js.client.data.maxpage,skip:js.client.data.page},function(err,res){
      if(err) js.resp.send(err);
      else{
        if(res.rows.length){
          var arr=[];
          for(i=0;l=res.rows.length,i<l;i++){
            arr.push(res.rows[i].value);          
          }
          js.client.data.balance={arr:arr,count:count};
          js.client.data.message="OK";
          js.resp.send(js.client);  
        }
      }
    });
  }).catch(function(err){

  }).done();
        
}
function get_member_count_by_year_month(js){
  getMemberCountByPackageYearMonth(js.client.data.user,js.client.data.package,js.client.data.my.year,js.client.data.my.month).then(function(body){
    if(body){
      js.client.data.user.count=body;
      js.resp.send(js.client);
    }
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getMemberCountByPackageYearMonth(user,package,year,month){
  var deferred=Q.defer();
  var db=create_db("user");
  db.view(__design_view,"findByUsername",{key:user.username,limit:1},function(err,res){
    if(err) deferred.reject(err);
    else if(res.rows.length){
      db.view(__design_view,"countMembersByPackageValueMonthYear",{key:[user.username,package.packagevalue,[year,month]]},function(err,res){
        if(err)
          deferred.reject(err);
        else{
          if(res.rows[0].value.packagevalue==package.packagevalue&&user.ismember)
            deferred.resolve(res.rows[0].value+1);
          else
            deferred.resolve(res.rows[0].value);
        }
      });
    }else{
      deferred.resolve(0);
    }
  });
  return deferred.promise;
}
function get_total_member_by_package(js){
  getMemberCountByPackage(js.client.data.user,js.client.data.package).then(function(body){
    if(body){
      js.client.data.user.count=body;
      js.resp.send(js.client);
    }
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getMemberCountByPackage(user,package){
  var deferred=Q.defer();
  var db=create_db("user");
  db.view(__design_view,"findByUsername",{key:user.username,limit:1},function(err,res){
    if(err) deferred.reject(err);
    else if(res.rows.length){
      db.view(__design_view,"countMembersByPackageValue",{key:[user.username,package.packagevalue]},function(err,res){
        if(err)
          deferred.reject(err);
        else{
          if(res.rows[0].value.packagevalue==package.packagevalue&&user.ismember)
            deferred.resolve(res.rows[0].value+1);
          else
            deferred.resolve(res.rows[0].value);
        }
      });
    }else{
      deferred.resolve(0);
    }
  });
  return deferred.promise;
}
function get_total_member(js){
  getMemberCount(js.client.data.user).then(function(body){
    if(body){
      js.client.data.user.count=body;
      js.resp.send(js.client);
    }
  }).catch(function(err){
    js.client.data.message=err;
    js.resp.send(js.client);
  }).done();
}
function getMemberCount(user){
  var deferred=Q.defer();
  var db=create_db("user");
  db.view(__design_view,"findByUsername",{key:user.username,limit:1},function(err,res){
    if(err) deferred.reject(err);
    else if(res.rows.length){
      db.view(__design_view,"countMembers",{key:user.username},function(err,res){
        if(err)
          deferred.reject(err);
        else{
          if(user.ismember)
            deferred.resolve(res.rows[0].value+1);
          else
            deferred.resolve(res.rows[0].value);
        }
      });
    }
    else{
      deferred.resolve(0);
    }
  });
  return deferred.promise;
}

function updateTopupBalance(js){
  var deferred=Q.defer();
  var db=create_db("topupbalance");
  db.view(__design_view,"findByUsername",{key:js.client.data.user.username,descending:true,limit:1},function(err,res){
    if(err) deferred.reject(err);
    else{
      var top={}
      if(!res.rows.length)//if = null
        top={
          username:js.client.data.user.username,
          usergui:js.client.data.user.gui,
          gui:uuidV4(),
          balance:0,
          updated:convertTZ(new Date()),
          diffbalance:js.client.data.balance.diffbalance,
          type:"topup"
        };
      else{
        top.balance+=js.client.data.balance.diffbalance;
        top.diffbalance=js.client.data.balance.diffbalance;
      }
      db.insert(top,top.gui,function(err,res){
        if(err) deferred.reject(err);
        else deferred.resolve(res);
      });
    }
  });
  return deferred.promise;
}

function countOperatorBalance(){
  var deferred=Q.defer();
  var db=create_db('operatorbalance');     
    db.view(__design_view,'findCount',{},function(err,res){
      if(err) deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);          
          }    
          deferred.resolve(body); 
        }
        else{
          deferred.resolve(body);
        }
      }
    });  
  return deferred.promise;
}
function showOperatorBalance(js){
  var deferred=Q.defer();
  var db=create_db('operatorbalance');
  countOperatorBalance().then(function(body){    
    db.view(__design_view,'findAll',{decending:true,skip:js.client.data.page,limit:js.client.data.maxpage},function(err,res){
      if(err) deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);          
          }    
          deferred.resolve({arr:arr,count:body}); 
        }
        else{
          deferred.resolve({arr:arr,count:body});
        }
      }
    });
  }).catch(function(err){
    deferred.reject(err);
  }).done();  
  return deferred.promise;
}
function countOperatorBalanceByUsername(user){
  var deferred=Q.defer();
  var db=create_db('operatorbalance');     
    db.view(__design_view,'findCount',{key:user.username},function(err,res){
      if(err) deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);          
          }    
          deferred.resolve(arr); 
        }
        else{
          deferred.resolve(arr);
        }
      }
    });  
  return deferred.promise;
}
function showOperatorBalanceByUsername(js){
  var deferred=Q.defer();
  var db=create_db('operatorbalance');
  countOperatorBalanceByUsername(js.client.data.user).then(function(body){    
    db.view(__design_view,'findAll',{decending:true,key:js.client.data.user.username,skip:js.client.data.page,limit:js.client.data.maxpage},function(err,res){
      if(err) deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);          
          }    
          deferred.resolve({arr:arr,count:body}); 
        }
        else{
          deferred.resolve({arr:arr,count:body});
        }
      }
    });
  }).catch(function(err){
    deferred.reject(err);
  }).done();
}

function countOperatorLogCenterBalanceOffline(){
  var deferred=Q.defer();
  var db=create_db('operatorlogcenterbalance');     
    db.view(__design_view,'findCount',{},function(err,res){
      if(err) deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);          
          }    
          deferred.resolve(body); 
        }
        else{
          deferred.resolve(body);
        }
      }
    });  
  return deferred.promise;
}
function showOperatorLogCenterBalanceOffline(sd,ed){
  var deferred=Q.defer();
  var db=create_db('operatorlogcenterbalance');
  countOperatorLogCenterBalanceOffline().then(function(body){    
    db.view(__design_view,'findAll',{decending:true,startkey:sd,endkey:ed,skip:page,limit:maxpage},function(err,res){
      if(err) deferred.reject(err);
      else{
        if(res.rows.length){
          var arr=[];
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[index].value);          
          }    
          deferred.resolve({arr:arr,count:body}); 
        }
        else{
          deferred.resolve({arr:arr,count:body});
        }
      }
    });
  }).catch(function(err){
    deferred.reject(err);
  }).done();
  
  return deferred.promise;
}
function showOperatorLogCenterBalanceOnline(sd,ed){
  // var sd=new Date();
  // sd=sd.getTime()-(2*60*60*1000);
  // var ed=new Date();
  var deferred=Q.defer();
  ltc.queryDetailsLTC(new Date(sd).toISOString(),ed.toISOString()).then(function(body){
    deferred.resolve(body);
  }).catch(function(err){
    var l={
      log:("error %s",JSON.stringify(err)),
      logdate:new Date(),
      type:"error",
      gui:uuidV4()
    };
    logging(l);
    deferred.reject(err);
  }).done();
  return deferred.promise;
}
function operatorCenterBalance(){// record operator centerbalance 's balance
  var deferred=Q.defer();
  var db=create_db('operatorcenterbalance');  
  ltc.checkBalanceCenterLTC().then(function(body){
    var o=body;
    o.gui=uuidV4();
    o.createddate= convertTZ(new Date());
    db.insert(o,o.gui,function(err,res){
      if(err) throw new Error(err);
      else{
        console.log('operatorLogCenterBalance OK');
        deferred.resolve(o);
      }
    });
  }).catch(function(err){
    var l={
      log:("error %s",JSON.stringify(err)),
      logdate:new Date(),
      type:"error",
      gui:uuidV4()
    };
    logging(l);
    deferred.reject(err);
  }).done();
  return deferred.promise;
}
function operatorLogCenterBalance(){ // record operator query details by 15 minutes
  var deferred=Q.defer();
  var sd=new Date();
  sd=sd.getTime()-(15*1000);//run every 15 minutes
  var ed=new Date();
  var db=create_db('operatorlogcenterbalance');
  ltc.queryDetailsLTC(new Date(sd).toISOString(),ed.toISOString()).then(function(body){
    var o=body;
    o.gui=uuidV4();
    o.createddate= convertTZ(new Date());
    db.insert(o,o.gui,function(err,res){
      if(err) throw new Error(err);
      else{
        console.log('operatorLogCenterBalance OK');
        deferred.resolve(o);
      }
    });
  }).catch(function(err){
    var l={
      log:("error %s",JSON.stringify(err)),
      logdate:new Date(),
      type:"error",
      gui:uuidV4()
    };
    logging(l);
    deferred.reject(err);
  }).done();
  return deferred.promise;
}


function countTopupFailureByUsername(js){
  var deferred=Q.defer();
  db=create_db('topupfailure');
  db.view(__design_view,'findCountByUsername',
  {key:js.client.data.user.username,decending:true},
  function(err,res){
    if(err)deferred.reject(err);
    else{
      var arr=[];
      if(res.rows.lenth){    
        for (var key in res.rows) {
          arr.push(key.value);                      
        }    
        deferred.resolve(arr);
      }
      else{
        deferred.resolve(arr);
      }
    }
  });
  return deferred.promise;
}
function countTopupFailure(){
  var deferred=Q.defer();
  db=create_db('topupfailure');
  db.view(__design_view,'findCount',
  {decending:true},
  function(err,res){
    if(err)deferred.reject(err);
    else{
      var arr=[];
      if(res.rows.lenth){    
        for (var key in res.rows) {
          arr.push(key.value);                      
        }    
        deferred.resolve(arr);
      }
      else{
        deferred.resolve(arr);
      }
    }
  });
  return deferred.promise;
}
function showTopUpFailure(js){
  var deferred=Q.defer();
  db=create_db('topupfailure');
  db.view(__design_view,'findAll',
  {decending:true,skip:js.client.data.page,limit:js.client.data.pagemax},
  function(err,res){    
    if(err)deferred.reject(err);
    else{
      var arr=[];
      countTopupFailure().then(function(body){
        if(res.rows.lenth){    
          for (var key in res.rows) {
            arr.push(key.value);                      
          }    
          deferred.resolve({arr:arr,count:body});
        }
        else{
          deferred.resolve({arr:arr,count:body});
        }
      }).catch(function(err){
        deferred.reject(err);
      }).done();
    }
  });
  return deferred.promise;
}
function showTopUpFailureByUsername(js){
  var deferred=Q.defer();
  db=create_db('topupfailure');
  db.view(__design_view,'findByUsername',
  {key:js.client.data.user.username,decending:true,skip:js.client.data.page,limit:js.client.data.pagemax},
  function(err,res){
    if(err)deferred.reject(err);
    else{
      var arr=[];
      countTopupFailure().then(function(body){
        if(res.rows.lenth){    
          for (var key in res.rows) {
            arr.push(key.value);                      
          }    
          deferred.resolve({arr:arr,count:body});
        }
        else{
          deferred.resolve({arr:arr,count:body});
        }
      }).catch(function(err){
        deferred.reject(err);
      }).done();
    }
  });
  return deferred.promise;
}

function processTopUp(js){
  // deduct from main balance
  var db=create_db('mainbalance');
  db.view(__design_view,"findByUsername",
  {key:js.client.data.user.username,include_docs:true,descending:true,limit:1}
  ,function(err,res){
    if(err) js.resp.send(err);
    else{
      var t={
        username:js.client.data.user.username,
        usergui:js.client.data.user.gui,
        gui:uuidV4(),
        balance:0,
        updated:convertTZ(new Date()),
        diffbalance:0,
        type:"topup"
      };
      if(res.rows.length){
        var mb=[];
        mb.push(res.rows[0].value);
        // need to turn js.client.data.topupbalance.diffbalance to be minus value, before this function
        if(js.client.data.topupbalance.diffbalance>=0){
          js.resp.send(new Error('value to top up must be lower than 0'));
          return ;
        }

        if(mb[0].balance<-1*js.client.data.topupbalance.diffbalance){
          js.client.data.message="not enough for main balance";
          js.resp.send(js.client);
          return;
        }
        mb[0].balance+=js.client.data.topupbalance.diffbalance;
        mb[0].diffbalance=js.client.data.topupbalance.diffbalance;
        t.balance=mb[0].balance;
        t.diffbalance=mb[0].diffbalance;
        // insert new record for main balance
        db.insert(t,t.gui,function(err,res){
          if(err) js.resp.send(err);
          else{
            //update userinfo
            db=create_db("user");
            db.view(__design_view,"findByUsername",
            {key:js.client.data.user.username,include_docs:true},
            function(err,res){
              if(err) js.resp.send(err);
              else{
                if(res.rows.length){
                  var u=res.rows[0].value;
                  u.mainbalance=t.balance;
                  u.topupbalance+=-1*t.diffbalance;
                  u.balance=u.topupbalance;
                  updateUser(u).then(function(res){
                    // update topupbalance
                    updateTopupBalance(js).then(function(err,res){
                      // view topupbalancesum                    
                    var db=create_db('topupbalancesum');
                    db.view(__design_view,"findByUsernameAndYearMonth",
                    {key:[js.client.data.user.username,js.client.data.year,js.client.data.month],include_docs:true,descending:true,limit:1},
                    function(err,res){
                      if(err)js.resp.send(err);
                      else{
                        var t={
                          username:js.client.data.user.username,
                          usergui:js.client.data.user.gui,
                          gui:uuidV4(),
                          balance:0,
                          updated:convertTZ(new Date()),
                          diffbalance:0,
                          type:"topupsum"
                        };
                        if(res.rows.length){
                          //update
                          t=res.rows[0].value;
                          t.balance+=js.client.data.topupbalance.diffbalance;
                          t.diffbalance=js.client.data.topupbalance.diffbalance;                          
                        }
                        else{
                          //insert new
                          t.balance=js.client.data.topupbalance.diffbalance;
                          t.diffbalance=js.client.data.topupbalance.diffbalance;
                        }
                        db.insert(t,t.gui,function(err,res){
                          if(err) js.resp.send(err);
                          else{
                            var r=connectOperator(js.client.data.topup.phone,t.balance);
                            if(r!='OK'){
                              js.client.data.message="topup completely "+js.client.data.user.username;
                              js.resp.send(js.client); 
                            }
                            else{
                              db=create_db('topupfailure');
                              var f={
                                gui:uuidV4(),
                                username:u.username,
                                usergui:u.gui,
                                phone:js.client.data.topup.phone,
                                value:t.balance,
                                createddate:convertTZ(new Date()),
                                lastretry:convertTZ(new Date()),
                                failedreason:'operator failed, '+r,
                                redo:0,
                                status:'failed' // retry , ok,  
                              };
                              db.insert(f,f.gui,function(err,res){
                                if(err) js.resp.send(err);
                                else{
                                  js.client.data.message='top up failed and put to the queu';
                                  js.resp.send(js.client);
                                }
                              })
                            }                   
                          }
                        });
                      }
                    }); 
                    }).catch(function(err){
                      js.resp.send(err);
                    }).done();                                                 
                  }).catch(function(err){
                    js.resp.send(err);
                  }).done();
                }
                else{
                  js.client.data.message="Could not find this username";
                  js.resp.send(js.client);
                  return;
                }
              }
            });
            
          }
        });
      }
      else{
        js.client.data.message="could not find record";
        js.resp.send(js.client);
      }
    }
  });
}
function connectOperator(phone,value){
  if(phone.indexOf('205')==0 || phone.indexOf('309')==0){
    return LTCSERVICE.topupLTC(phone,value); 
  }
  else if(phone.indexOf('202')==0||phone.indexOf('302')==0){
    //ETL
  }
  else if(phone.indexOf('207')==0){
    // BEELINE
  }
  else if(phone.indexOf('209')==0 ||phone.indexOf('309')==0){
    // UNITEL
  }
  
}
// decide when and how often generate this report
function generateBonusTopupBalance(js){
  // set bonustopupbalance
  db=create_db("bonusTopupBalance");
  var __doc={
    month:0,
    year:0,
    gui:uuidV4(),
    level1:0,
    level2:0,
    level3:0,
    sum:0
  };
  db.view(__design_view,"findByYearMonth",{key:[convertTZ(new Date()).getFullYear(),convertTZ(new Date()).getMonth()+1],descending:true,include_docs:true,limit:1},function(err,res){
    if(err)js.resp.send(err);
    else{
      if(res.rows.length)__doc=res.rows[0].value;
      __doc.level1=__doc.level2=__doc.level3=__doc.sum=0;
      
      var db2=create_db("topupbalancesum");
      db2.view(__design_view,"findByYearMonth",
      {key:[convertTZ(new Date()).getFullYear(),convertTZ(new Date()).getMonth()+1]},
      function(err,res){
        if(err)js.resp.send(err)
        else{
          for (var index = 0; index < res.rows.length; index++) {                     
            __doc=queryBonusTopup(__doc,array[index].value.balance);
          }
          db.insert(__doc,__doc.gui,function(err,res){
            if(err) js.resp.send(err);
            else{
              js.client.data.bonustopupbalance=__doc;              
              js.resp.send(js.client);
            }
          }); 
        }
      });                               
    }
  }); 
}
function queryBonusTopup(balance,value){
  while (value>100000) {
    if(value>=300000){
      balance.level3++;
      value-=300000;
    }
    else if(value>=200000){
      balance.level2++;
      value-=200000;
    }
    else if(value>=100000){
      balance.level1++;
      value-=100000;
    } 
  }  
  balance.sum=balance.level1+balance.level2+balance.level3;
  return balance;
}


function showTopupBalanceSumByUsername(js){
  var db=create_db('topupbalancesum');
  db.view(__design_view,"findByUsernameAndYearMonth",
  {key:[js.client.data.user.username,js.client.data.year,js.client.data.month],include_docs:true},
  function(err,res){
    if(err) js.resp.send(err);
    else{
      var arr=[];
      res.rows.forEach(function(element) {
        element._rev="";
        arr.push(element);
      }, this);
      js.client.data.topupbalancesum=arr;
      js.resp.send(js.client);
    }
  });
}
function showTopupBalanceSumByAllUser(js){
  var db=create_db('topupbalancesum');
  db.view(__design_view,"findByYearMonth",
  {key:[js.client.data.year,js.client.data.month],include_docs:true},
  function(err,res){
    if(err) js.resp.send(err);
    else{
      var arr=[];
      res.rows.forEach(function(element) {
        element._rev="";
        arr.push(element);
      }, this);
      js.client.data.topupbalancesum=arr;
      js.resp.send(js.client);
    }
  });
}

function showBonusTopupBalanceSumValueByUser(js){  
  var db=create_db("topupbalancesum");
  var __doc={
    month:0,
    year:0,
    gui:uuidV4(),
    level1:0,
    level2:0,
    level3:0,
    sum:0
  };
  db.view(__design_view,"findByUserAndYearMonth",{key:[js.client.data.user.username,js.client.data.year,js.client.data.month],include_docs:true},function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        //var count=res.rows[0].value;
        var arr=[];
        res.rows.forEach(function(element) {
          __doc.gui=uuidV4();
          __doc.level1=__doc.level2=__doc.level3=__doc.sum;
          __doc.username=element.username;
          __doc=queryBonusTopup(__doc,element.balance);
          __doc.value1= __doc.level1*100000*0.02;
          __doc.value2=__doc.level2*200000*0.02;
          __doc.value3=__doc.level3*300000*0.02;
          __doc.sumvalue=__doc.value1+__doc.value2+__doc.value3;
          arr.push(__doc);
        }, this);
        js.client.data.bonustopupbalance=arr;
        js.resp.send(js.client);
      }
    }
  });
}
function sendBonusTopUpBalanceByUser(js){
  var db =create_db("user");
  db.view(__design_view,"findByUsername",{key:js.client.data.user.username},function(err,res){
    if(err) js.resp.send(err);
    else if(res.rows.length){
      var u=res.rows[0].value;
      //update userinfo
      u.bonustopupbalance+=js.client.data.bonustopupbalance.sumvalue;      
      //process topup here
      topupbalance(u.phone1,js.client.data.bonustopupbalance.sumvalue);
      //update bonustopupbalancesum
      db=create_db("topupbalancesum");
      db.view(__design_view,"findByUsernameAndYearMonth",{key:[js.client.data.user.username,js.client.data.year,js.client.data.month]},
      function(err,res){
        if(err)js.resp.send(err);
        else if(res.rows.length){
          var t=res.rows[0].value;
          t.type="paidbonus";
          db.insert(t,t.gui,function(err,res){
            if(err)js.resp.send(err);
            else{
              var p={
                usergui:u.gui,
                username:u.username,
                paymentdate:Date(),
                paymentvalue:u.bonustopupbalance,
                paymentby:__master_user.username,
                paidbygui:__master_user.gui,
                payreason:"system bonus topup", // cashing , request confirm, 
                attache:"",
                bankinfo:'',
                targetuser:u.username,
                status:"approved",
                description:"",
                receiveddate:Date(), //
                certifieddate:Date(), //
                approveddate:Date(), //
                gui:uuidV4()
                };
              makePayment(p).then(function(body){
                js.client.data.message="completed pay bonus topup balance by this user: "+u.username+"/"+js.client.data.bonustopupbalance.sumvalue;
                js.resp.send(js.client);  
              }).catch(function(err){
                js.resp.send(err);
              }).done();
            }
          });
        }
        else{
          js.client.data.message="could not find this bonus topup balance by this user";
          js.resp.send(js.client);
        }
      });
      
    }
    else{
      js.client.data.message="could not find this user";
      js.resp.send(js.client);
    }
  });
}
function showBonusTopupBalanceValueAll(js){  
  var db=create_db("topupbalancesum");
  var __doc={
    month:0,
    year:0,
    gui:uuidV4(),
    level1:0,
    level2:0,
    level3:0,
    sum:0
  };
  db.view(__design_view,"findByYearMonth",{key:[js.client.data.year,js.client.data.month],include_docs:true},function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        //var count=res.rows[0].value;
        var arr=[];
        res.rows.forEach(function(element) {
          __doc.gui=uuidV4();
          __doc.level1=__doc.level2=__doc.level3=__doc.sum;
          __doc.username=element.username;
          __doc=queryBonusTopup(__doc,element.balance);
          __doc.value1= __doc.level1*100000*0.02;
          __doc.value2=__doc.level2*200000*0.02;
          __doc.value3=__doc.level3*300000*0.02;
          __doc.sumvalue=__doc.value1+__doc.value2+__doc.value3;
          arr.push(__doc);
        }, this);
        js.client.data.bonustopupbalance=arr;
        js.resp.send(js.client);
      }
    }
  });
}
// show by month  this show for all users total number for each level
function showBonusTopupBalance(js){  
  var db=create_db("bonusTopupBalance");
  var __doc={
    month:0,
    year:0,
    gui:uuidV4(),
    level1:0,
    level2:0,
    level3:0,
    sum:0
  };
  db.view(__design_view,"findByYearMonth",{key:[js.client.data.year,js.client.data.month],include_docs:true},function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        //var count=res.rows[0].value;
        var arr=[];
        res.rows.forEach(function(element) {
          arr.push(element);
        }, this);
        js.client.data.bonustopupbalance=arr;
        js.resp.send(js.client);
      }
    }
  });
}
// show for admin only which can show for whole years and many months
function showBonusTopupBalanceByYear(js){  
  var db=create_db("bonusTopupBalance");
  var __doc={
    month:0,
    year:0,
    gui:uuidV4(),
    level1:0,
    level2:0,
    level3:0,
    sum:0
  };
  db.view(__design_view,"findByYear",{key:[js.client.data.year,],include_docs:true},function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        //var count=res.rows[0].value;
        var arr=[];
        res.rows.forEach(function(element) {
          arr.push(element);
        }, this);
        js.client.data.bonustopupbalance=arr;
        js.resp.send(js.client);
      }
    }
  });
}
// - ຂໍ້ມູນຜູ້ໃຊ້
function showUserInfo(js){
  var user={username:js.client.username};
  
  viewUser(user).then(function(body){
    if(body){
      js.client.data.message={message:"OK"};
      js.client.data.user=body;
      js.client.data.user.password="";
      js.client.data.user._rev='';
      js.resp.send(js.client);  
    }
  }).catch(function(err){
    js.client.data.message=JSON.stringify(err);
    js.resp.send(js.client);
  }).done();
}
function viewUser(user){
  var deferred=Q.defer();
  db=create_db("user");
  //console.log("here view user");
  db.view(__design_view,"findByUserName",
  {key:user.username},
  function(err,res){
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
  return deferred.promise;
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
  return deferred.promise;
}
function checkRegisterAvailableUser(js){ // username password, phone1
  var obj={};
  obj.user=js.client.data.user;
  findUserByUserName(obj).then(function(body){    
    if(body.length>0){
      js.client.data.message+=", this username exist";      
    }          
    else
      js.client.data.message="OK";
  }).catch(function(err){
    js.client.data.message=err;
   // js.resp.send(js.client);
  }).done(function(){
    js.resp.send(js.client);
  });
}
function checkRegisterMaxphone(js){
  findMaxPhoneNumber(obj).then(function(body){
    if(body){
      js.client.data.message+=", could not use this phone number";        
    }      
    else{
      js.client.data.message="OK";
    }
  }).catch(function(err){
    js.client.data.message=err;
//    js.resp.send(js.client);
  }).done(function(){
    js.resp.send(js.client);
  });
}
function checkRegisterPassword(js){
  if(!validatePassword(js.client.data.user.password)){
    js.client.data.message="password must be more than 5";
  }
  else
    js.client.data.message="OK";
  js.resp.send(js.client);
}

function checkRegisterSponserCode(js){
  var obj=js.client.data;
  findUserByIntroductionCode(obj).then(function (body){
    if(body){
      js.client.data.message="OK";
      js.resp.send(js.client);
    }
    else{
      js.client.data.message="could not find sponsor code";
      js.resp.send(js.client);
    }
  });
}
function checkRegisterNeedBalancePerPackage(js){
  var db=create_db('user');
  db.view(__design_view,"findByUsername",{key:js.client.username},function(err,res){
    if(err)js.resp.send(err);
    else if(res.rows.length){
      var registra=res.rows[0].value;
      findNeedBalanceByUserGui(js,registra).then(function(body){
        var registrabalance=body;        
        if(/*registrabalance.bonus.balance!=registra.balancevalue||*/registrabalance.main.balance!=registra.mainbalance){
          js.client.data.message="Error: balance is abnormal";
          js.resp.send(js.client);
        }
        if(registrabalance.main.balance<=js.client.data.package.packagevalue){
          js.client.data.message="Error: you don't have enough fund";
          js.resp.send(js.client);
        }
        js.client.data.message=("OK:main:%s / package: %s",registrabalance.main.balance,js.client.data.package.packagevalue);
        js.resp.send(js.client);
      });
    }
    else{
      js.client.data.message="could not find current user";
      js.resp.send(js.client);
    }
  });
  
}

//
function transferBalance(js){
  var db=create_db('user');
  db.view(__design_view,'findByUsername',
  {key:js.client.username}
  ,function(err,res){
    if(err) js.resp.send(err);
    else{
      if(res.rows.length){
        var u=res.rows[0].value;     
        var d=js.client.data.user;
        js.client.data.user=u;  
        //js.client.data.transferbalance  
        js.client.data.transferbalance.type='transfer';
        js.client.data.transferbalance.updated=convertTZ(new Date());      
        if(js.client.data.transferbalance.diffbalance<u.mainbalance){
          js.client.data.message="not enough balance";
          js.resp.send(js.client);
          return;
        }
        if(js.client.data.transferbalance.username!=u.username||js.client.data.transferbalance.diffbalance<1)        {
          js.client.data.message=" wrong username or balance must be positive";
          js.resp.send(js.client);
          return;
        }
        js.client.data.balance=js.client.data.transferbalance;
        updateTopupBalance(js).then(function(body){        
          u.mainbalance-=js.client.data.balance.balance;
          updateUser(u).then(function(body){
            if(err) js.resp.send(err);
            else{
              db.view(__design_view,'findByUsername',
              {key:d.username}
              ,function(err,res){
                var d=res.rows[0].value;
                d.mainbalance+=js.client.data.balance.balance;
                js.client.data.user=d;            
                updateTopupBalance(js).then(function(body){
                  updateUser(d).then(function(body){
                    js.client.data.user.message="transfer balance completely user:"+u.username+"-->"+d.username;
                    js.resp.send(js.client);
                  }).catch(function (err){
                    js.resp.send(err);        
                  }).done();
                }).catch(function(err){
                  js.resp.send(err);
                }).done();                
              });                                      
            }
          }).catch(function(err){
            js.resp.send(err);
          }).done();
        }).catch(function(err){
          js.resp.send(err);
        }).done();
      }
      else{
        js.client.data.user.message='username not found!';
        js.resp.send(js.client);
      }
    }
  });

}

function checkphone(phone){
  if(phone=='205'){
    return 5;
  }
  else if(phone=='202'){
    return 2;
  }
  else if(phone=='207'){
    return 7;
  }
  else if(phone=='209'){
    return 9;
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




function logging(log){
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