module.exports = function (m) {
    const uuidV4 = require('uuid/v4');
    var moment = require('moment-timezone');
    var UB = [];
    var M = [];
    var ubin = [];
    var cm = [];
    var maxlevel = 10; // 12 levels
    if(m) maxlevel=m;
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
    var names=['souk','touy','noy','vanh','seng','sone','teng','bua','kham','thong','tia','my','mou','xay','vone','veng','vong','terng','done',
    'kai','phet','pa','keo','nang','mone','deth','na','vieng','chan','vi','hieng','dao','da','duang','xieng','pone','thid','phone',
    'hom','boun','ki','ky','noi','mai','la','yai','joy','hong','lit','ngeun','od','lek','xang'];
    function getName(){
        //var name='';
        r1=Math.floor((Math.random() * (names.length-1)) + 1);
        r2=Math.floor((Math.random() * (names.length-1)) + 1);
        return names[r1]+names[r2]+makeid(3,3);
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
    function checkExistUsername(username,mem){
        for (var index = 0; index < mem.length; index++) {
            var element = mem[index];
            if(element.username==username){
                username="us"+makeid(4, 1);
                index=0;
            }            
        }
        return username;
    }
    module.addMemberFromRoot=function(root,broot) {
        var m = {}; // member array 
        var p = root;
        //var b=broot;        
        cm=[];
        ubin=[];
        var range = 0;
        range = calculateRange(3);
        cm.push(p);
        //ubin.push(b);        
        ubin.push(broot);
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
        
            var name=getName();
            name = checkExistUsername(name,cm);
            m.username = name;
            m.password = 'LEADER';
            m.email='';
            m.phone1='';
            m.maxpaid = 350000;
            m.maxproduct = 15;
            m.packagename = 'Close Friend';
            m.packagevalue = 350000;
            m.packagegui = 'afb6420f-26e6-4fab-87fd-b1d7a26fdfd5';

            m.usercode = m.username;
            m.parentgui = p.gui;
            m.parentname = p.username;
            m.aboveparents = p.aboveparents;
            m.memberlevel = level+p.memberlevel;
            // if (!(index % 2)) {
            //     m.isleft = false;
            // } else {
            //     m.isleft = true;
            // }
            cm.push(m);
            var userbin = {
                username: m.username,
                usergui:m.gui,
                createddate: new Date(),
                updateddate: new Date(),
                luser: '',
                ruser: '',
                level: level+p.memberlevel,
                parent:p.parentname,
                index:0,
                gui: uuidV4()
            };
            ubin.push(userbin);
            // console.log('member level '+p.memberlevel+" level"+level);
        }   
        //console.log("ubin:  "+ubin.length);
        // console.log("cm: "+cm.length);
        // console.log("ubin: "+ubin.length);
        // //assignBinaryTree(cm, ubin);
        // //console.log('start from '+__master_user.username);
        // console.log(ubin);
        autoExtend(p.username,'',-1,p.username);
        //return;
        //console.log("M:  "+cm.length);
        //console.log("UB: "+ubin.length);
        // for (var index = 0; index < ubin.length; index++) {
        //     var element = ubin[index];
        //  //   console.log("username:"+element.username+", l:"+element.luser+", r:"+element.ruser+" parent:"+element.parent+" index:"+element.index+" level"+element.level);
        // }
        //curuser=cm[0];
        //curtree=ubin[0];
        //console.log(curuser);
        //console.log(curtree);
        //cm.splice(0,1);
        for (var index = 0; index < cm.length; index++) {
            var element = cm[index];
            if(element.username==root.username){
                cm.splice(index,1);
            }                
        }
        var b={};
        for (var index = 0; index < ubin.length; index++) {
            var element = ubin[index];
            if(element.username==root.username){
                b=ubin[index];
                ubin.splice(index,1);
            }                
        }
        //ubin.splice(0,1);
        //return {member:cm,binarytree:ubin,curuser:curuser,curtree:curtree};
        // console.log("ubin length "+ubin.length);
        // console.log("cm length "+cm.length);
        return {member:cm,binarytree:ubin,b:b};
    }
    module.generateMembers=function() {
        var m = {}; // member array 
        var p = { // master userdata
            gui: 'd2dfb6ac-1abd-47c0-b1b5-ef0465b1592d',
            username: 'souk@TheFriendd',
            aboveparents: 'souk@TheFriendd'
        };
        cm=[];
        ubin=[];
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
            index:0,
            parent:p.username,
            gui: uuidV4()
        });
        var level = 1;
        //return console.log(range);
        var goldException=[62,125,126,251,252,253,254];
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
                var name=getName();
                name = checkExistUsername(name,cm);
                m.username = name;
                m.password = 'LEADER';
                m.email='';
                m.phone1='';                
                if (goldException.indexOf(index)>-1) {

                } else {
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
            // if (!(index % 2)) {
            //     m.isleft = false;
            // } else {
            //     m.isleft = true;
            // }
            cm.push(m);
            var userbin = {
                username: m.username,
                usergui:m.gui,
                createddate: new Date(),
                updateddate: new Date(),
                luser: '',
                ruser: '',
                level: level,
                parent:'',
                index:0,
                gui: uuidV4()
            };
            ubin.push(userbin);
        }   
        //console.log("ubin:  "+ubin.length);
        //console.log("cm: "+cm.length);
        //assignBinaryTree(cm, ubin);
        //console.log('start from '+__master_user.username);
        autoAsign(__master_user.username,'',-1,__master_user.parentname);
        //console.log("M:  "+cm.length);
        //console.log("UB: "+ubin.length);
        // for (var index = 0; index < ubin.length; index++) {
        //     var element = ubin[index];
        //  //   console.log("username:"+element.username+", l:"+element.luser+", r:"+element.ruser+" parent:"+element.parent+" index:"+element.index+" level"+element.level);
        // }

        return {member:cm,binarytree:ubin};
    }
    function updateUserByUsername(username,user){
        for (var index = 0; index < cm.length; index++) {
            var element = cm[index];
            if(username==element.username){
                cm[index]=user;
                return user;
            }            
        }
    }
    function updateUserBinaryByUsername(username,ub){
        for (var index = 0; index < ubin.length; index++) {
            var element = ubin[index];
            if(username==element.username){
                if(ub.luser)
                    ubin[index].luser=ub.luser;
                else if(ub.ruser)
                    ubin[index].ruser=ub.ruser;
                return ub;
            }                
        }
        return null;
    }
    function getUserBinaryByUsername(username){
        for (var index = 0; index < ubin.length; index++) {
            var element = ubin[index];
            if(element==undefined){
                // console.log('ubin');
                // console.log(element);
                continue;
            }
            else                
                if(username==element.username)
                    return element;
        }
        return null;
    }
    function getUserByUsername(username){
        for (var index = 0; index < cm.length; index++) {
            var element = cm[index];
            if(username==element.username)
                return element;
        }
        return null;
    }
    function autoExtend(lusername,rusername,i,parent){
        if(lusername){
            var x=(2*i)+1;
            if(i==-1) x=0;
            var u=cm[x];
            //console.log("user: "+lusername+" parent:"+parent+"");
            //console.log(cm);


            var p=getUserByUsername(parent);
            var ub=getUserBinaryByUsername(lusername);            
            var pb=getUserBinaryByUsername(parent);
            // console.log("user: "+lusername+" parent:"+parent+"");
            if(x){
                cm[x].aboveparents = [];
                cm[x].parentname = p.username;
                cm[x].parentgui = p.gui;
                cm[x].introductorcode = __master_user.introductorcode;
                cm[x].introductorgui = __master_user.gui;
                cm[x].registeredby = 'master';
                cm[x].isleft=true;
                cm[x].aboveparents.push(p.username);
                cm[x].aboveparents = cm[x].aboveparents.concat(p.aboveparents);
                pb.luser=lusername;                                        
                updateUserBinaryByUsername(parent,pb); 
                ub.parent=p.parentname;
                ub.index=x;  
                updateUserBinaryByUsername(lusername,ub);
            }
            //console.log(cm[x]);                        

            lu='';
            ru='';
            //console.log(cm[(2*x)+1]===undefined);
            if(cm[(2*x)+1]!==undefined)
                lu=cm[(2*x)+1].username;
            if(cm[(2*x)+2]!==undefined)
                ru=cm[(2*x)+2].username;
            //console.log(lu+"/"+ru);
            // if(lu==''&&ru=='')
            //     return;
            //console.log("l:"+lu+", ru"+ru," user:"+ub.username+" parent"+ub.parent+ " level"+ub.level +" index:"+ub.index);
            autoExtend(lu,ru,x,u.username);
        }
        if(rusername){            
            var x=(2*i)+2;
            if(i==-1) x=0;
            var u=cm[x];
//            console.log(cm);
            // console.log("user: "+lusername+" parent:"+parent+"");
            var p=getUserByUsername(parent);            
            var ub=getUserBinaryByUsername(rusername);            
            var pb=getUserBinaryByUsername(parent);
            if(x){
                cm[x].aboveparents = [];
                cm[x].parentname = p.username;
                cm[x].parentgui = p.gui;
                cm[x].introductorcode = __master_user.introductorcode;
                cm[x].introductorgui = __master_user.gui;
                cm[x].registeredby = 'master';
                cm[x].isleft=false;
                cm[x].aboveparents.push(p.username);
                cm[x].aboveparents = cm[x].aboveparents.concat(p.aboveparents);
                pb.ruser=rusername;                                        
                updateUserBinaryByUsername(parent,pb);
                ub.parent=parent;
                ub.index=x;
                updateUserBinaryByUsername(rusername,ub);
            }
            //console.log(cm[x]);                        
            lu='';
            ru='';
            //console.log(cm[(2*x)+1]===undefined);
            if(cm[(2*x)+1]!==undefined)
                lu=cm[(2*x)+1].username;
            if(cm[(2*x)+2]!==undefined)
                ru=cm[(2*x)+2].username;
            //console.log(lu+"/"+ru);

            // if(lu==''&&ru=='')
            //     return;
            //console.log("l:"+lu+", ru"+ru," user:"+ub.username+" parent"+ub.parent+ " level"+ub.level +" index:"+ub.index);
            autoExtend(lu,ru,x,u.username);
        }
        
    }
    function autoAsign(lusername,rusername,i,parent){
        if(lusername){
            var x=(2*i)+1;
            if(i==-1) x=0;
            var u=cm[x];
            //console.log("user: "+lusername+" parent:"+parent+"");
            //console.log(cm);

            var p=getUserByUsername(parent);
            // console.log("p:"+p.username);
            // console.log("u:"+u.username);
            cm[x].aboveparents = [];
            cm[x].parentname = p.username;
            cm[x].parentgui = p.gui;
            cm[x].introductorcode = __master_user.introductorcode;
            cm[x].introductorgui = __master_user.gui;
            cm[x].registeredby = 'master';
            cm[x].isleft=true;
            var ub=getUserBinaryByUsername(lusername);            
            var pb=getUserBinaryByUsername(parent);
            if(x){
                cm[x].aboveparents.push(p.username);
                cm[x].aboveparents = cm[x].aboveparents.concat(p.aboveparents);
                pb.luser=lusername;                                        
                updateUserBinaryByUsername(parent,pb);
            }
            //console.log(cm[x]);                        
            ub.parent=p.parentname;
            ub.index=x;
            updateUserBinaryByUsername(lusername,ub);
            lu='';
            ru='';
            //console.log(cm[(2*x)+1]===undefined);
            if(cm[(2*x)+1]!==undefined)
                lu=cm[(2*x)+1].username;
            if(cm[(2*x)+2]!==undefined)
                ru=cm[(2*x)+2].username;
            //console.log(lu+"/"+ru);
            // if(lu==''&&ru=='')
            //     return;
            //console.log("l:"+lu+", ru"+ru," user:"+ub.username+" parent"+ub.parent+ " level"+ub.level +" index:"+ub.index);
            autoAsign(lu,ru,x,u.username);
        }
        if(rusername){            
            var x=(2*i)+2;
            if(i==-1) x=0;
            var u=cm[x];
//            console.log(cm);
            var p=getUserByUsername(parent);
            // console.log("p:"+p.username);
            // console.log("u:"+u.username);
            cm[x].aboveparents = [];
            cm[x].parentname = p.username;
            cm[x].parentgui = p.gui;
            cm[x].introductorcode = __master_user.introductorcode;
            cm[x].introductorgui = __master_user.gui;
            cm[x].registeredby = 'master';
            cm[x].isleft=false;
            var ub=getUserBinaryByUsername(rusername);            
            var pb=getUserBinaryByUsername(parent);
            if(x){
                cm[x].aboveparents.push(p.username);
                cm[x].aboveparents = cm[x].aboveparents.concat(p.aboveparents);
                pb.ruser=rusername;                                        
                updateUserBinaryByUsername(parent,pb);
            }
            //console.log(cm[x]);                        
            ub.parent=parent;
            ub.index=x;
            updateUserBinaryByUsername(rusername,ub);
            lu='';
            ru='';
            //console.log(cm[(2*x)+1]===undefined);
            if(cm[(2*x)+1]!==undefined)
                lu=cm[(2*x)+1].username;
            if(cm[(2*x)+2]!==undefined)
                ru=cm[(2*x)+2].username;
            //console.log(lu+"/"+ru);
            // if(lu==''&&ru=='')
            //     return;
            //console.log("l:"+lu+", ru"+ru," user:"+ub.username+" parent"+ub.parent+ " level"+ub.level +" index:"+ub.index);
            autoAsign(lu,ru,x,u.username);
        }
    }
    // function assignBinaryTree(member, ubin) {
    //     var arr = [];
    //     var _arr = [];
    //     M=[];UB=[];
    //     var p = {};        
        
    //     for (var index = 0; index < maxlevel; index++) {
    //         arr = getMemberByLevel(member, index);
    //         _arr = getMemberByLevel(member, index + 1);
    //         var x = 0;
    //         for (var i = 0; i < arr.length; i++) {
    //             var element = arr[i];
    //             var ub = getBinaryTreeByUsername(element.username, ubin);
    //             var elementL = _arr[x];
    //             var elementR = '';
    //             if (x + 1 < _arr.length)
    //                 elementR = _arr[++x];
    //             ub.luser = elementL.username;
    //             ub.ruser = elementR.username;
    //             UB.push(ub);
    //             x++;
    //             elementL.aboveparents = [];
    //             elementL.parentname = element.username;
    //             elementL.parentgui = element.gui;
    //             elementL.aboveparents.push(element.username);
    //             if (element.aboveparents.length)
    //                 elementL.aboveparents = elementL.aboveparents.concat(element.aboveparents);
    //             elementL.introductorcode = __master_user.introductorcode;
    //             elementL.introductorgui = __master_user.gui;
    //             elementL.registeredby = 'master';

    //             elementR.aboveparents = [];
    //             elementR.parentname = element.username;
    //             elementR.parentgui = element.gui;
    //             elementR.aboveparents.push(element.username);
    //             if (element.aboveparents.length)
    //                 elementR.aboveparents = elementR.aboveparents.concat(element.aboveparents);
    //             elementR.introductorcode = __master_user.introductorcode;
    //             elementR.introductorgui = __master_user.gui;
    //             elementR.registeredby = 'master';
    //             // if(!M.length) 
    //             //      M.push(element); // add root first
    //             if(!index) 
    //                 updateUserByUsername(element.username,element); // add root first
    //             if(elementL)
    //                 updateUserByUsername(elementL.username,elementL);
    //             if(elementR)
    //                 updateUserByUsername(elementR.username,elementR);
    //             // // M.push(elementL);
    //             // M.push(elementR);


    //         }
    //     }
    // }

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

    function makeid(length, type) {
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