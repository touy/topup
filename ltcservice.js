module.exports = function (__secret = '', __user = '', __minvalue = 5000) {
    const async = require('async');
    const uuidV4 = require('uuid/v4');
    const nano = require('nano')('http://admin:admin@localhost:5984');
    const fs = require('fs');
    var redis = require("redis");
    var bluebird = require('bluebird');
    r_client = redis.createClient();
    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);
    var moment = require('moment-timezone');
    const Q = require('q');
    var Promise = require('bluebird');
    var path = require('path');
    var passwordValidator = require('password-validator');
    var __design_view = "objectList";
    var phoneValidator = new passwordValidator();
    phoneValidator
      .is().min(10) // Minimum length 8 
      .is().max(10) // Maximum length 100 
      .has().not().letters() // Must not have lowercase letters 
      .has().digits() // Must have digits 
      .has().not().symbols()
      .has().not().spaces() // Should not have spaces 
    function convertTZ(fromTZ) {
        return moment.tz(fromTZ, "Asia/Vientiane").format();
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


    //var ltc=require("./ltctopup")('kP0SwtIzUA1pLBwsnZz3VA==','THEFRIEND');
    //var ltc = require("./ltctopup")('ea9uZEit0E7sXPeYoCJZDZWZVT+o10ZthvuldL8cJtQ=', 'ITCENTER');
    var ltc = require("./ltctopup")(__secret, __user);
    var __design_event_list = {
        "_id": "_design/objectList",
        "views": {
            "findBy": {//phone, target, owner
                "reduce": "_count",
                "map": "function (doc) {"+
                "for(prop in doc){"+
                "var prefix = doc[prop];"+
                "emit([0,prop,prefix,doc.updatedtime],doc);"+
                "emit([1,doc.updatedtime],doc);"+ // show previously
               " emit([2,prop,prefix],doc);"+ // accept gui only
              "}}"
            },
              "searchBy": {
                "reduce": "_count",
                "map": "function (doc) {\r\n  for(prop in doc){\r\n    var prefix = doc[prop];\r\n    var i;\r\n    if (prefix) {\r\n        for (i = 0; i < prefix.length; i += 1) {\r\n            emit([prop,prefix.slice(i)], doc);\r\n        }\r\n    }\r\n  }\r\n}"
              }, 
            "searchText": {
                "reduce": "_count",
              "map": "function (doc) {\r\n  var prefix;\r\n  for(prop in doc){\r\n    if(prop==\"_id\"||prop==\"_rev\"||prop==\"gui\"||typeof(doc[prop]===\"boolean\"))\r\n    continue;\r\n    if(!Date.parse(doc[prop]))\r\n         prefix += doc[prop];\r\n    else if(!isNAN(doc[prop]))\r\n        prefix += doc[prop];\r\n  }\r\n    var i;\r\n    if (prefix) {\r\n        for (i = 0; i < prefix.length; i += 1) {\r\n            emit([prefix.slice(i)], doc);\r\n        }\r\n    }\r\n  }"
            }
        },
        "language": "javascript"
    };
    var __design_centerbalance = {
        "_id": "_design/objectList",
        "views": {
            "findBy": {//phone, target, owner
                "reduce": "_count",
                "map": "function (doc) {"+
                "for(prop in doc){"+
                "var prefix = doc[prop];"+
                "emit([0,prop,prefix,doc.updatedtime],doc);"+
                "emit([1,doc.updatedtime],doc);"+ // show previously
               " emit([2,prop,prefix],doc);"+ // accept gui only
              "}}"
            },
              "searchBy": {
                "reduce": "_count",
                "map": "function (doc) {\r\n  for(prop in doc){\r\n    var prefix = doc[prop];\r\n    var i;\r\n    if (prefix) {\r\n        for (i = 0; i < prefix.length; i += 1) {\r\n            emit([prop,prefix.slice(i)], doc);\r\n        }\r\n    }\r\n  }\r\n}"
              }, 
            "searchText": {
                "reduce": "_count",
              "map": "function (doc) {\r\n  var prefix;\r\n  for(prop in doc){\r\n    if(prop==\"_id\"||prop==\"_rev\"||prop==\"gui\"||typeof(doc[prop]===\"boolean\"))\r\n    continue;\r\n    if(!Date.parse(doc[prop]))\r\n         prefix += doc[prop];\r\n    else if(!isNAN(doc[prop]))\r\n        prefix += doc[prop];\r\n  }\r\n    var i;\r\n    if (prefix) {\r\n        for (i = 0; i < prefix.length; i += 1) {\r\n            emit([prefix.slice(i)], doc);\r\n        }\r\n    }\r\n  }"
            }
        },
        "language": "javascript"
    };
    var __design_phonebalance = {
        "_id": "_design/objectList",
        "views": {
            "findBy": {//phone, target, owner
                "reduce": "_count",
                "map": "function (doc) {"+
                "for(prop in doc){"+
                "var prefix = doc[prop];"+
                "emit([0,prop,prefix,doc.updatedtime],doc);"+
                "emit([1,doc.updatedtime],doc);"+ // show previously
               " emit([2,prop,prefix],doc);"+ // accept gui only
              "}}"
            },
              "searchBy": {
                "reduce": "_count",
                "map": "function (doc) {\r\n  for(prop in doc){\r\n    var prefix = doc[prop];\r\n    var i;\r\n    if (prefix) {\r\n        for (i = 0; i < prefix.length; i += 1) {\r\n            emit([prop,prefix.slice(i)], doc);\r\n        }\r\n    }\r\n  }\r\n}"
              }, 
            "searchText": {
                "reduce": "_count",
              "map": "function (doc) {\r\n  var prefix;\r\n  for(prop in doc){\r\n    if(prop==\"_id\"||prop==\"_rev\"||prop==\"gui\"||typeof(doc[prop]===\"boolean\"))\r\n    continue;\r\n    if(!Date.parse(doc[prop]))\r\n         prefix += doc[prop];\r\n    else if(!isNAN(doc[prop]))\r\n        prefix += doc[prop];\r\n  }\r\n    var i;\r\n    if (prefix) {\r\n        for (i = 0; i < prefix.length; i += 1) {\r\n            emit([prefix.slice(i)], doc);\r\n        }\r\n    }\r\n  }"
            }
        },
        "language": "javascript"
    };

    init_db('centerbalance', __design_centerbalance);
    init_db('falurelist', __design_event_list);
    init_db('phonebalance', __design_phonebalance);
    init_db('retrylist', __design_event_list);
    init_db('successlist', __design_event_list);

    // var phone = '2055051550';
    // var topupvalue = 5000;
    // var target = 'IMEI';
    // var owner = 'owner';
    //var minvalue = 5000;

    module.checkCenterBalance = function () {
        var deferred = Q.defer();
        var db = create_db('centerbalance');
        try {
            ltc.checkBalanceCenterLTC().then((res) => {
                var cbres = res;
                if (res.CheckBalanceCenterResult.resultCode == '20') {
                    var b = {
                        lastbalance: res.CheckBalanceCenterResult.balance,
                        updatedtime: convertTZ(new Date()),
                        info: res,
                        gui: uuidV4()
                    }
                    db.insert(b, b.gui, (err, res) => {
                        if (err) deferred.reject(err);
                        else {
                            deferred.resolve(b);
                        }
                    });
                } else {
                    throw new Error(JSON.stringify(res));
                }
            }).catch((err) => {
                deferred.reject(err);
            });
        } catch (error) {
            deferred.reject(err);
        }
        return deferred.promise;
    }
    module.viewCenterBalance=function(starttime,endtime,page,maxpage){
        var deferred=Q.defer();
        findCenterBalance(starttime,endtime,true,0,1).then((res)=>{
            var count=res;            
            if(endtime=='') endtime=convertTZ(new Date());
            findCenterBalance(starttime,endtime,false,page,maxpage).then((res)=>{
                deferred.resolve({arr:res,count:count});
            }).catch((err)=>{
                deferred.reject(err);
            });
        }).catch((err)=>{
            deferred.reject(err);
        });
        return deferred.promise;
    }
    function findCenterBalance(starttime,endtime,iscount,page,maxpage ){
        var deferred=Q.defer();
        var db=create_db('centerbalance');
        if(endtime=='') endtime=convertTZ(new Date());
        db.view(__design_view,'findBy',{
            startkey:[1,endtime],endkey:[1,starttime],
            descending:true,
            reduce:iscount,
            skip:page,
            limit:maxpage},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                if(iscount)
                    deferred.resolve(arr[0]);
                else deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    module.checkPhoneBalance = function (phone, target, owner) {
        var deferred = Q.defer();
        var db = create_db('phonebalance');
        try {
            ltc.checkBalanceLTC(phone).then((res) => {
                if (res.CheckBalanceResult.resultCode == '20') {
                    var b = {
                        phone: phone,
                        topupvalue: 0,
                        imei: target,
                        owner: owner,
                        lastbalance: res.CheckBalanceResult.balance,
                        info: res,
                        updatedtime: convertTZ(new Date()),
                        gui: uuidV4()
                    }
                    db.insert(b, b.gui, (err, res) => {
                        if (err) deferred.reject(err);
                        else {
                            deferred.resolve(b);
                        }
                    });
                } else {
                    throw new Error(JSON.stringify(res));
                }
            }).catch((err) => {
                deferred.reject(err);
            });
        } catch (error) {
            deferred.reject(err);
        }
        return deferred.promise;
    }
    module.viewPhoneBalance=function(phone,starttime,endtime,page,maxpage){
        var deferred=Q.defer();
        findPhoneBalance(phone,starttime,endtime,true,0,1).then(res=>{
                var count=res;
                findPhoneBalance(phone,stat,endtime,false,page,maxpage).then(res=>{
                    deferred.resolve({arr:res,count:count});
                }).catch(err=>{
                    throw err;
                });            
            }).catch(err=>{
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function findPhoneBalance(phone,starttime,endtime,iscount,page,maxpage){
        var deferred=Q.defer();
        var db=create_db('phonebalance')
        db.view(__design_view,'findBy',{startkey:[0,"phone",phone,endtime],endkey:[0,"phone",phone,starttime],
            descending:true,reduce:iscount,
            skip:page,limit:maxpage},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index].value;
                        arr.push(element);
                    }
                }
                if(iscount)
                    deferred.resolve(arr[0]);
                else
                    deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function topupTarget(phone, topupvalue, target, owner) {
        var deferred = Q.defer();
        var db = create_db('phonebalance');
        try {
            this.checkCenterBalance().then((res) => {
                if (res.lastbalance > topupvalue) {
                    this.checkPhoneBalance(phone, target, owner).then((res) => {
                        var bres = res;
                        var curDate=convertTZ(new Date());
                        var preDate=convertTZ(curDate.setDate(new Date(curDate.getDate()-65)));
                        var secodMonth=convertTZ(curDate.setDate(new Date(curDate.getDate()-30)));
                        this.showSuccessList(phone,curDate,preDate,0,5).then(res=>{
                            var  pres=res.arr;
                            var  pcount=res.count;
                            var isSecondMonth=false;
                            if(!pres.length)
                                isSecondMonth=true;                            
                            else
                            for (let index = 0; index < pres.length; index++) {
                                const element = pres[index];
                                if((new Date(element.updatedtime))<=secodMonth)
                                    isSecondMonth=true;
                            }
                            if (res.lastbalance < __minvalue || isSecondMonth)
                            ltc.topupLTC(phone, topupvalue).then((res) => {
                                var tres = res;
                                if (res.TopupResult.resultCode == '20') {
                                    var b = {
                                        phone: phone,
                                        topupvalue: topupvalue,
                                        imei: target,
                                        owner: owner,
                                        lastbalance: res.TopupResult.amount,
                                        updatedtime: convertTZ(new Date()),
                                        gui: uuidV4()
                                    }
                                    db.insert(b, b.gui, (err, res) => {
                                        if (err) deferred.reject(err);
                                        else {
                                            this.checkPhoneBalance(phone, target, owner).then((res) => {
                                                findRetryByPhone(phone, '', '\u9999', 0, 1).then((res) => {
                                                    if (res.rows.length) {
                                                        updateRetryList(res[0]);
                                                    }
                                                }).catch((err) => {
                                                    throw err;
                                                });
                                                deferred.resolve({
                                                    phone: phone,
                                                    lastbalance: bres.lastbalance,
                                                    currentbalance: res.lastbalance,
                                                    amount: tres
                                                });
                                            }).catch((err) => {
                                                throw err;
                                            });
                                        }
                                    });
                                } else {
                                    throw new Error(JSON.stringify(res));
                                }
                            }).catch((err) => {
                                throw err;
                            });
                        else {
                            deferred.resolve({
                                phone: phone,
                                lastbalance: res.lastbalance,
                                currentbalance: res.lastbalance,
                                amount: topupvalue
                            });
                        }
                        }).catch(err=>{
                            throw err;
                        });
                    }).catch((err) => {
                        deferred.reject(err);
                    });
                } else {
                    throw new Error(JSON.stringify(res))
                }
            }).catch((err) => {
                deferred.reject(err);
            })
        } catch (error) {
            addRetryList(phone, topupvalue, target, owner);
            deferred.reject(error);
        }
        return deferred.promise;
    }
    module.testDirectTopup=function (phone, topupvalue) {
        var deferred=Q.defer();
        ltc.topupLTC(phone, topupvalue).then((res) => {
            var tres = res;
            if (res.TopupResult.resultCode == '20') {
                deferred.resolve(res);                
            } else {
                throw new Error(JSON.stringify(res));
            }
        }).catch((err) => {
           deferred.reject(err);
        });
        return deferred.promise;
    }
    module.directTopup = function (phone, topupvalue) {
        var deferred = Q.defer();
        var db=create_db('phonebalance');
        try {
            var owner='';
            var target='';
            console.log('Here');
            if(err=phoneValidator.validate(phone, {
                list: true
              }).length||phone.indexOf("205")!=0||isNaN(topupvalue)){
                  throw new Error("error "+ JSON.parse(err)+"| phone:"+phone+" value"+topupvalue)
            }
            // this.checkCenterBalance().then((res) => {
                //if (res.lastbalance > topupvalue) {
                    //this.checkPhoneBalance()
                    this.checkPhoneBalance(phone, target, owner).then((res) => {
                        const bres = res;
                        if (bres.lastbalance < __minvalue+1 ||!__minvalue)
                            ltc.topupLTC(phone, topupvalue).then((res) => {
                                const tres = res;
                                console.log(res);
                                if (tres.TopupResult.resultCode == '20') {
                                    const b = {
                                        phone: phone,
                                        topupvalue: topupvalue,
                                        imei: target,
                                        owner: owner,
                                        lastbalance: tres.TopupResult.amount,
                                        currentbalance: tres.lastbalance,
                                        updatedtime: convertTZ(new Date()),
                                        description:'topup OK',
                                        gui: uuidV4()
                                    }
                                    db.insert(b, b.gui, (err, res) => {
                                        if (err) deferred.reject(err);
                                        else {
                                            deferred.resolve(b);
                                        }
                                    });
                                } else {
                                    throw new Error(tres);
                                }
                            }).catch((err) => {
                                throw err;
                            });
                        else {
                            deferred.resolve({
                                phone: phone,
                                topupvalue: topupvalue,
                                imei: target,
                                owner: owner,
                                lastbalance: bres.lastbalance,
                                currentbalance: bres.lastbalance,
                                updatedtime: convertTZ(new Date()),
                                description:'ignore topup',
                                gui: uuidV4()
                            });
                        }
                    }).catch((err) => {
                        throw err;
                    });
                // } else {
                //     throw new Error("not enough fund "+JSON.stringify(res));
                // }
            // }).catch((err) => {
            //     deferred.reject(err);
            // });
        } catch (error) {
            deferred.reject(error);
        }
        return deferred.promise;
    }

    function addRetryList(phone, topupvalue, target, owner) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        var o = {
            phone: phone,
            topupvalue: topupvalue,
            target: target,
            owner: owner,
            createtime: convertTZ(new Date()),
            updatetime: convertTZ(new Date()),
            gui: uuidV4()
        };
        db.insert(o, o.gui, (err, res) => {
            if (err) deferred.reject(err);
            else deferred.resolve("OK");
        });
        return deferred.promise;
    }

    function updateRetryList(o) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        o.updatetime = convertTZ(new Date());
        if (o._rev) {
            o._delete = true;
            db.insert(o, o._id, (err, res) => {
                if (err) deferred.reject(err);
                else deferred.resolve("OK");
            });
        } else {
            deferred.reject(new Error('err retry object could not be updated'));
        }
        return deferred.promise;
    }

    function querySearchRetryList(by, starttime, endtime,iscount, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        db.view(__design_view, 'searchText', {
            descending: true,
            startkey: [by, endtime],
            endkey: [by, starttime],
            reduce:iscount,
            descending:true,
            limit: maxpage,
            skip: page
        }, (err, res) => {
            if (err) deferred.reject(err);
            else {
                var arr = [];
                var array = res.rows;
                if (array.length) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].value;
                        arr.push(element)
                    }
                }
                if(iscount)
                deferred.resolve(arr[0]);
                else
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function queryShowRetryList(starttime, endtime,iscount, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        db.view(__design_view, 'findBy', {
            descending: true,
            startkey: [1, endtime],
            endkey: [1, starttime],
            reduce:iscount,
            descending:true,
            limit: maxpage,
            skip: page
        }, (err, res) => {
            if (err) deferred.reject(err);
            else {
                var arr = [];
                var array = res.rows;
                if (array.length) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].value;
                        arr.push(element)
                    }
                }
                if(iscount)
                deferred.resolve(arr[0]);
                else
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
    module.showRetryList = function (by,starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');  
        if(by)
        querySearchRetryList(by,starttime,endtime,true,0,1).then((res)=>{
            var count=res;
            querySearchRetryList(by,type, starttime, endtime,false, page, maxpage).then((res) => {
                            deferred.resolve({arr:res,count:count});
                        }).catch((err) => {
                            deferred.reject(err);
                        });
        }).catch((err)=>{
            deferred.reject(err);
        });
        else      
        queryShowRetryList(starttime,endtime,true,0,1).then((res)=>{
                var count=res;
                queryShowRetryList(starttime, endtime,false, page, maxpage).then((res) => {
                                deferred.resolve({arr:res,count:count});
                            }).catch((err) => {
                                deferred.reject(err);
                            });
            }).catch((err)=>{
                deferred.reject(err);
        });

        return deferred.promise;
    }


    function addSuccessList(phone, topvalue, target, owner) {
        var deferred = Q.defer();
        var db = create_db('successlist');
        var o = {
            phone: phone,
            topupvalue: topupvalue,
            target: target,
            owner: owner,
            createtime: convertTZ(new Date()),
            updatetime: convertTZ(new Date()),
            gui: uuidV4()
        };
        db.insert(o, o.gui, (err, res) => {
            if (err) deferred.reject(err);
            else deferred.resolve("OK");
        });
        return deferred.promise;
    }
    function querySearchSuccesList(by, starttime, endtime,iscount, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('successlist');
        db.view(__design_view, 'searchText', {
            descending: true,
            startkey: [by, endtime],
            endkey: [by, starttime],
            reduce:iscount,
            descending:true,
            limit: maxpage,
            skip: page
        }, (err, res) => {
            if (err) deferred.reject(err);
            else {
                var arr = [];
                var array = res.rows;
                if (array.length) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].value;
                        arr.push(element)
                    }
                }
                if(iscount)
                deferred.resolve(arr[0]);
                else
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
    function queryShowSuccesList(starttime, endtime,iscount, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('successlist');
        db.view(__design_view, 'findBy', {
            descending: true,
            startkey: [1, endtime],
            endkey: [1, starttime],
            reduce:iscount,
            descending:true,
            limit: maxpage,
            skip: page
        }, (err, res) => {
            if (err) deferred.reject(err);
            else {
                var arr = [];
                var array = res.rows;
                if (array.length) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].value;
                        arr.push(element)
                    }
                }
                if(iscount)
                deferred.resolve(arr[0]);
                else
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
    module.showSuccessList = function (by, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();       
        if(by)
        querySearchSuccesList(by, starttime, endtime,true, page, maxpage).then(res=>{
            var count=res;
            querySearchSuccesList(by, starttime, endtime,false, page, maxpage).then((res) => {
                deferred.resolve({arr:res,count:count});
            }).catch((err) => {
                deferred.reject(err);
            });
        }).catch(err=>{
            deferred.reject(err);
        });
        else
            queryShowSuccesList(starttime,endtime,true,0,1).then((res)=>{
                var count=res;
                queryShowSuccesList(starttime, endtime,false, page, maxpage).then((res) => {
                    deferred.resolve({arr:res,count:count});
                }).catch((err) => {
                    deferred.reject(err);
                });
            }).catch((err)=>{
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function addFailedList(phone, topvalue, target, owner) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        var o = {
            phone: phone,
            topupvalue: topupvalue,
            target: target,
            owner: owner,
            createtime: convertTZ(new Date()),
            updatetime: convertTZ(new Date()),
            gui: uuidV4()
        };
        db.insert(o, o.gui, (err, res) => {
            if (err) deferred.reject(err);
            else deferred.resolve("OK");
        });
        return deferred.promise;
    }
    function querySearchFailedList(by, starttime, endtime,iscount, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        db.view(__design_view, 'searchText', {
            descending: true,
            startkey: [by, endtime],
            endkey: [by, starttime],
            reduce:iscount,
            descending:true,
            limit: maxpage,
            skip: page
        }, (err, res) => {
            if (err) deferred.reject(err);
            else {
                var arr = [];
                var array = res.rows;
                if (array.length) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].value;
                        arr.push(element)
                    }
                }
                if(iscount)
                deferred.resolve(arr[0]);
                else
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
    function queryShowFailedList(starttime, endtime,iscount, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        db.view(__design_view, 'findBy', {
            descending: true,
            startkey: [1, endtime],
            endkey: [1, starttime],
            reduce:iscount,
            descending:true,
            limit: maxpage,
            skip: page
        }, (err, res) => {
            if (err) deferred.reject(err);
            else {
                var arr = [];
                var array = res.rows;
                if (array.length) {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index].value;
                        arr.push(element)
                    }
                }
                if(iscount)
                deferred.resolve(arr[0]);
                else
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
   
    module.showfailedList = function (by, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        try {
            if (by) 
            querySearchFailedList(by,starttime,endtime,false,0,1).then((res)=>{
                var count=res;
                querySearchFailedList(by,starttime, endtime,false, page, maxpage).then((res) => {
                deferred.resolve({arr:res,count:count});
                }).catch((err) => {
                deferred.reject(err);
                });
            }).catch((err)=>{
                    deferred.reject(err);
                });
            else
            queryShowFailedList(starttime,endtime,false,0,1).then((res)=>{
                var count=res;
                queryShowFailedList(starttime, endtime,false, page, maxpage).then((res) => {
                deferred.resolve({arr:res,count:count});
                }).catch((err) => {
                    deferred.reject(err);
                });
            }).catch((err)=>{
                deferred.reject(err);
            });            
        } catch (error) {
            deferred.reject(error);
        }

        return deferred.promise;
    }

    module.refillGPSNumber = function (phone, topupvalue, target, owner) {
        var deferred = Q.defer();
        try {
            if(err=phoneValidator.validate(phone, {
                list: true
              }).length||phone.indexOf("205")!=0||isNaN(topupvalue)){
                deferred.reject( new Error("error "+ JSON.parse(err)+"| phone:"+phone+" value"+topupvalue));
            }else
            topupTarget(phone, toupvalue, target, owner).then((res) => {
                if (res) {
                    addSuccessList(phone, topupvalue, target, owner);
                    deferred.resolve(res);
                }
            }).catch((err) => {
                deferred.reject(err);
            });
        } catch (error) {
            addFailedList(phone, toupvalue, target, owner);
            deferred.reject(error);
        }
        return deferred.promise;
    }
    module.sendSMS=function(phone,message,header){
        var deferred=Q.defer();
        try {
            ltc.sendSMSLTC(phone,message,header).then((res)=>{
                deferred.resolve(res);
                }).catch((err)=>{
                    deferred.reject(err);
                });   
        } catch (error) {
            deferred.reject(error);
        }        
        return deferred.promise;
    }
    module.payment=function(phone,value){
        var deferred=Q.defer();
        try {
            ltc.paymentLTC(phone,value).then((res)=>{
                deferred.resolve(res);
                }).catch((err)=>{
                    deferred.reject(err);
                });   
        } catch (error) {
            deferred.reject(error);
        }        
        return deferred.promise;        
    }
    module.queryDetails=function(startdate,enddate){
        var deferred=Q.defer();
        try {
            ltc.queryDetails(startdate,enddate).then((res)=>{
                deferred.resolve(res);
                }).catch((err)=>{
                    deferred.reject(err);
                });   
        } catch (error) {
            deferred.reject(error);
        }        
        return deferred.promise;        
    }
    return module;
}