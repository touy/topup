module.exports = function (m) {
    const uuidV4 = require('uuid/v4');
    var moment = require('moment-timezone');
    var UB = [];
    var M = [];
    var ubin = [];
    var cm = [];
    var maxlevel = 10; // 11 levels
    if (m) maxlevel = m;
    //console.log("m: "+maxlevel);
    //members , company level
    function convertTZ(fromTZ) {
        return moment.tz(fromTZ, "Asia/Vientiane").format();
    }
    var __master_user = {
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

    function autoAssignment(js) {
        for (var attributename in __obj) {
            js[attributename] = __obj[attributename];
        }
        return js;
    }

    function calculateRange(level) {
        var range = 0;
        for (var index = 0; index < level + 1; index++) {
            range += Math.pow(2, index); // total range is 31 including master user
        }
        return range;
    }

    function checkExistUsername(username, mem) {
        for (var index = 0; index < mem.length; index++) {
            var element = mem[index];
            if (element.username == username) {
                username = "us" + makeid(4, 1);
                index = 0;
            }
        }
        return username;
    }
    module.generateMembers = function () {
        var m = {}; // member array 
        var p = { // master userdata
            gui: 'd2dfb6ac-1abd-47c0-b1b5-ef0465b1592d',
            username: 'souk@TheFriendd',
            aboveparents: 'souk@TheFriendd'
        };
        cm = [];
        ubin = [];
        var range = 0;
        range = calculateRange(maxlevel);
        cm.push(__master_user);
        ubin.push({ // master userbinary
            username: p.username,
            createddate: new Date(),
            updateddate: new Date(),
            luser: {},
            ruser: {},
            level: 0,
            gui: uuidV4()
        });
        var level = 1;
        //return console.log(range);
        for (var index = 1; index < range; index++) {
            if (calculateRange(level) <= index) {
                level++;
            }
            //console.log('level '+level+'index '+(index));

            m = getDefault();
            m = autoAssignment(m);
            m._id = uuidV4();
            m.gui = m._id;
            m.generatorid = index;
            if (level > 4) {
                var name = 'us' + makeid(4, 1);
                name = checkExistUsername(name, cm);
                m.username = name;
                m.password = 'LEADER';
                if (index == range - 1) {} else {
                    m.maxpaid = 350000;
                    m.maxproduct = 15;
                    m.packagename = 'Close Friend';
                    m.packagevalue = 350000;
                    m.packagegui = 'afb6420f-26e6-4fab-87fd-b1d7a26fdfd5';
                }
            } else
                m.username += index;

            m.usercode = m.username;
            //m.parentgui = p.gui;
            //m.parentname = p.username;
            //m.aboveparents = p.aboveparents;
            m.memberlevel = level;
            if (!(index % 2)) {
                m.isleft = false;
            } else {
                m.isleft = true;
            }
            cm.push(m);
            // var userbin = {
            //     username: m.username,
            //     createddate: new Date(),
            //     updateddate: new Date(),
            //     luser: '',
            //     ruser: '',
            //     level: level,
            //     gui: uuidV4()
            // };
            // ubin.push(userbin);
        }
        //console.log("ubin:  " + ubin.length);
        console.log("cm: " + cm.length);
        //assignBinaryTree(cm, ubin);
        // console.log("M:  "+M.length);
        // console.log("UB: "+UB.length);
        autoAssign(__master_user.username,'',range,-1,0,__master_user.username,__master_user.gui);
        return {
            member: cm,
            binarytree: UB
        };
    }
    function updateUserByUsername(username,user){
        for (var index = 0; index < cm.length; index++) {
            var element = cm[index];
            if (element.username == username) {
               cm[index]=user;
            }
        }        
    }
    function findUserByUsername(username){
        for (var index = 0; index < cm.length; index++) {
            var element = cm[index];
            if (element.username == username) {
                return element;
            }
        }
        return null;
    }
    function updateBinaryTreeByUsername(username,l,r){
        for (var index = 0; index < UB.length; index++) {
            var element = UB[index];
            if (element.username == username) {
                if(l)
                UB[index].luser=l;
                if(r)
                UB[index].ruser=r;
            }
        }
        return null;
    }
    function findTreeByUsername(username){
        for (var index = 0; index < ubin.length; index++) {
            var element = ubin[index];
            if (element.username == username) {
                return element;
            }
        }
        return null;
    }
    function autoAssign(lusername, rusername, range , i ,level, parent, parentgui){
        if(i<=range)
            return; 
        if (lusername) {                                             
                //var x=0;                                                    
            var x = (2 * i) + 1;
            if (i == -1) x = 0; // root            
            res={};
            res.index = x;
            res.username =lusername ;
            res.usergui=parentgui;            
            res.createddate=convertTZ(new Date()),
            res.updateddate= convertTZ(new Date()),
            res.parent = parent;
            UB[x] = res;
            if(x!=0){
                updateBinaryTreeByUsername(parent,lusername,rusername);   
                element=findUserByUsername(rusername);
                p=findUserByUsername(parent);
                element.aboveparents = [];
                element.parentname = parent;
                element.parentgui = parentgui;
                element.aboveparents.push(parent);
                if (p.aboveparents.length)
                    element.aboveparents = element.aboveparents.concat(p.aboveparents);
                element.introductorcode = __master_user.introductorcode;
                element.introductorgui = __master_user.gui;
                element.registeredby = 'master';
                updateUserByUsername(lusername,element);
            }                
            autoAssign(cm[(2 * x) + 1].username, cm[(2 * x) + 2].username, range, x,level+1, res.parent,res.parentgui);            
        }         
        if (rusername) {            
            var x = (2 * i) + 2;
            res={};
            res.index = x;
            res.username =rusername ;
            res.usergui=parentgui;            
            res.createddate=convertTZ(new Date()),
            res.updateddate= convertTZ(new Date()),
            res.parent = parent;
            UB[x] = res;
            updateBinaryTreeByUsername(parent,lusername,rusername);
            element=findUserByUsername(rusername);
            p=findUserByUsername(parent);
            element.aboveparents = [];
            element.parentname = parent;
            element.parentgui = parentgui;
            element.aboveparents.push(parent);
            if (p.aboveparents.length)
                element.aboveparents = element.aboveparents.concat(p.aboveparents);
            element.introductorcode = __master_user.introductorcode;
            element.introductorgui = __master_user.gui;
            element.registeredby = 'master';

            updateUserByUsername(rusername,element);
            autoAssign(cm[(2 * x) + 1].username, cm[(2 * x) + 2].username, range, x,level+1, res.parent,res.parentgui);            
        }
    }
    function assignBinaryTree(member, ubin) {
        var arr = [];
        var _arr = [];
        M = [];
        UB = [];
        var p = {};

        for (var index = 0; index < maxlevel+1; index++) {
            arr = getMemberByLevel(member, index);
            _arr = getMemberByLevel(member, index + 1);
            console.log("_arr:"+_arr.length);
            var x = 0;
            if (_arr.length) {    
                for (var i = 0; i < arr.length; i++) {
                    console.log("i index:"+(i*index));
                    var element = arr[i];
                    var ub = getBinaryTreeByUsername(element.username, ubin);
                    var elementL = _arr[x];
                    var elementR = '';
                    if (x + 1 < _arr.length)
                        elementR = _arr[++x];
                    ub.luser = elementL.username;
                    ub.ruser = elementR.username;
                    UB.push(ub);
                    elementL.aboveparents = [];
                    elementL.parentname = element.username;
                    elementL.parentgui = element.gui;
                    elementL.aboveparents.push(element.username);
                    if (element.aboveparents.length)
                        elementL.aboveparents = elementL.aboveparents.concat(element.aboveparents);
                    elementL.introductorcode = __master_user.introductorcode;
                    elementL.introductorgui = __master_user.gui;
                    elementL.registeredby = 'master';

                    elementR.aboveparents = [];
                    elementR.parentname = element.username;
                    elementR.parentgui = element.gui;
                    elementR.aboveparents.push(element.username);
                    if (element.aboveparents.length)
                        elementR.aboveparents = elementR.aboveparents.concat(element.aboveparents);
                    elementR.introductorcode = __master_user.introductorcode;
                    elementR.introductorgui = __master_user.gui;
                    elementR.registeredby = 'master';
                    if(!M.length) 
                        M.push(element); // add root first
                    M.push(elementL);
                    M.push(elementR);
                    x++;
                }
            }
            else{
                
            }

        }
    }

    function getMemberByLevel(member, l) {
        var arr = [];
        for (var index = 0; index < member.length; index++) {
            var element = member[index];
            if (element.memberlevel == l)
                arr.push(element);
        }
        return arr;
    }

    function getBinaryTreeByUsername(username, ubin) {
        for (var index = 0; index < ubin.length; index++) {
            var element = ubin[index];
            if (element.username == username)
                return element;
        }
    }

    function getDefault() {
        return {
            "_id": "", // NEED
            "gui": "", // NEED
            "username": "fd000", // NEED
            "usercode": "fd000", // NEED
            "parentgui": "d2dfb6ac-1abd-47c0-b1b5-ef0465b1592d", //NEED
            "parentname": "souk@TheFriendd", // NEED
            "isleft": true, // NEED
            "aboveparents": ""
        };
    }

    function makeid(length, type = 0) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        if (type == 1) {
            possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        } else if (type == 2) {
            possible = "abcdefghijklmnopqrstuvwxyz";
        } else if (type == 3) {
            possible = "0123456789";
        }
        //var possible = "0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var __obj = {
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
        "package1left": 0,
        "package1right": 0,
        "package2left": 0,
        "package2right": 0,
        "package3left": 0,
        "package3right": 0,
        "packagevalue": 1750000,
        "packagename": "The Best Friend",
        "packagegui": "4f095522-f461-4a0b-afc4-0ad7cf05c722",
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
        "maxproduct": 75,
        "maxpaid": 1750000
    };

    function deleteNodesChain(users, binarytree, username) {
        for (var index = 0; index < M.length; index++) {
            var element = users[index];
            if (!element) continue;
            if (element.username == username) {
                delete users[index]; // delete exist user
                for (var x = 0; x < binarytree.length; x++) {
                    var b = binarytree[x];
                    //console.log(x);
                    if (!b) continue;
                    if (b.username == username) {
                        delete binarytree[x]; // delete exist binarytree
                        if (b.luser)
                            deleteNode(users, binarytree, b.luser);
                        if (b.ruser)
                            deleteNode(users, binarytree, b.ruser);

                    }
                }
            }
        }
    }

    //generateMembers();
    //console.log(ubin);
    //console.log(cm);;
    //console.log(UB);
    //console.log(M);

    // for (var index = 0; index < M.length; index++) {
    //     var element = M[index];
    //     if(!element)continue;
    //     console.log({username:element.username,parentname:element.parentname,level:element.memberlevel,ruser:element.packagevalue,aboveparents:element.aboveparents})
    // }
    // console.log('deleting...........................');
    // deleteNode(M,UB,'fd0004');
    // console.log('after deteleted-------------------')
    // for (var index = 0; index < M.length; index++) {
    //     var element = M[index];
    //     if(!element)continue;
    //     console.log({index:element.generatorid,username:element.username,parentname:element.parentname,level:element.memberlevel,packagevalue:element.packagevalue,aboveparents:element.aboveparents})
    // }

    //company levels

    //sale
    //
    return module;
}