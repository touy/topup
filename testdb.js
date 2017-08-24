
var uuidV4 = require('uuid/v4');
var nano = require('nano')('http://admin:admin@localhost:5984');
var WS=null;
var package_db=require("./db/packages")(uuidV4,nano,WS,"packages","objectList")._init();
//var userbinary_db=require("./db/userbinary")(uuidV4,nano,WS,"userbinary","objectList");


//package_db.uuidV4=require('uuid/v4');;
//package_db._test();
package_db._test();
//package_db._delA();
//userbinary_db._test();
var package={
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
//URL: /packages
//URL: /packages/{UID}


var userbinary={
    username:"u1",
    createddate:new Date(),
    updateddate:new Date(),
    luser:"",
    ruser:"",
    level:0,
    gui:uuidV4()
};
// SET WHEN REGISTER ONLY and query when need member on left or right hand side


var packagedetails={
    gui:uuidV4(),
    userui:"",
    packageui:"",
    registerdate:new Date(),
    updateddate:new Date(),
    isactive:true,
    notactivedate:null,
};
// URL: /packagedetails
// URL: /packagedetails/{usergui,[UID]}

var coupling={
    usergui:"",
    usergui1:"",
    usergui2:"",
    level:0,
    couplingdate:Date(),
    couplingvalue:0,
    gui:uuidV4(),
    isacouple:false
};
// server side
var couplingscore={
    usergui:"",
    username:"",
    Lscore:0,
    Rscore:0,
    createddate:new Date(),
    gui:uuidV4()
};
// server side

var balances={
    usergui:"",
    username:"",
    createddate:new Date(),
    balancevalue:0,
    description:"",
    gui:uuidV4()
};
// URL: /balance/{usergui}

var payment={
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
// NOT YET

var userdata={
    username:"",// show *
    password:"",//show*
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
    introductorcode:"" //not show
}; 
//URL: /userdata/{logintoken}

var client={
    //....
        data:{
          package:"",
          userbinary:"",
          packagedetails:"",
          coupling:"",// server side
          couplingscore:"",// server side
          balances:"", 
          payment:"",
          userdata:"",
          //....
        }
      };
//URL: /client



var login={
    username:"",
    password:"",
    logintoken:""
};
//actioncode: login
//URL: /login/{login}


var register={
    //....
        data:{
          package:"",
          userbinary:"",
          packagedetails:"",
          //coupling:"",
          //couplingscore:"",
          //balances:"",
          payment:"",
          userdata:"",
        }
      };
//actioncode: register
// URL: /register/{register}

var packet={
          _isstring:false,
                json:{data:"user not exist"},
                updatetime:new Date(),
                _iserror:true,
                _isread:false,
                actioncode:"error"
        };
// PACKET




//PROCESS
// 1. LOGIN
// 2. REGISTER
// 3. view USER PROFILE
// 4. view user score and member list 