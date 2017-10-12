const uuidV4 = require('uuid/v4');
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
  //members , company level
  function autoAssignment(js){
    for(var attributename in __obj){
        js[attributename]=__bj[attributename];
    }
    return js;
  }  
  
  function generateMembers(js){
    var m = {};
    var p ={gui:'d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d',username:'souk@TheFriendd',aboveparents:'souk@TheFriendd'};
    var range=31;
    
    var ubin=[];
    ubin.push({
        username:p.username,
        createddate:new Date(),
        updateddate:new Date(),
        luser:{},
        ruser:{},
        level:0,
        gui:uuidV4()
        });
    var level=0;
    for (var index = 0; index < range; index++) {
        m=getDefault();
        m._id=uuidV4();
        m.gui=m._id;
        m.username+index;
        m.usercode=m.username;
        m.parentgui=p.gui;
        m.parentname=p.username;
        m.aboveparents=p.aboveparents;
        if(index%2==0)
            m.isleft=true;
        else m.isleft=false;   

        m=autoAssignment(m);
        cm.push(m);         

        var userbin={
            username:p.username,
            createddate:new Date(),
            updateddate:new Date(),
            luser:{},
            ruser:{},
            level:level+1,
            gui:uuidV4()
            };
        
        
        
        if(m.isleft)
            userbin.luser=m.username;
        else
            userbin.ruser=m.username;        
        ubin.push(userbin);  

        if(2^(level+1)<index){ 
            level++;
        } 
    }
    
    for (var index = 0; index < cm.length; index++) {
        if(index==0){

        }
        
    }

    
  }

  function getDefault(){
    return {
        "_id": "", // NEED
        "gui":"", // NEED
        "username": "FD000", // NEED
        "usercode": "FD000", // NEED
        "parentgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d", //NEED
        "parentname": "souk@TheFriendd", // NEED
        "isleft": true, // NEED
        "aboveparents": "souk@TheFriendd" // NEED
      };
  }

  var cm=[];
  var __obj={
    //"_id": "",// NEED
    //"gui":"",// NEED
    //"username": "FD0001",
    "password": "ORKPHANSA",
    "ID": "",
    "fullname": "",
    "birthdate": "",
    "gender": "",
    "address": "",
    "bankaccount": "",
    "bank": "",
    //"usercode": "FD0001",
    "createddate": "2017-08-19T12:16:12.563Z",    
    "email": "souk@TheFriendd.com",
    "phone1": "02059918889",
    "phone2": "",
    "photo": "",
    //"memberlevel": 1, //NEED
    "ispaired": false, //NO NEED
    //"parentgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d", //NEED
    //"parentname": "souk@TheFriendd", // NEED
    //"isleft": true, //NEED
    //"aboveparents": "souk@TheFriendd", //NEED
    "leftside": 0, 
    "rightside": 0, 
    "package1left":0, 
    "package1right":0, 
    "package2left":0, 
    "package2right":0, 
    "package3left":0, 
    "package3right":0,
    "packagevalue": 1750000,
    "packagename": "The Best Friend",
    "packagegui": "4f095522-f461-4a0b-afc4-0ad7cf05c722",
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
    "maxproduct": 75,
    "maxpaid": 1750000
  };




  //company levels

  //sale


  //