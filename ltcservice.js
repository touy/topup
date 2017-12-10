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
    var __design_view = "objectList";

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
    var __design_failedlist = {
        "_id": "_design/objectList",
        "views": {
            "findAll": {
                "map": "function (doc) {\n  emit(null,doc);\n}"
            },
            "findCount": {
                "reduce": "_count",
                "map": "function (doc) {\n  emit(1);\n}"
            },
            "findCountByPhone": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],1);\n}"
            },
            "findByPhone": {
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],doc);\n}"
            },
            "findCountByTarget": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],1);\n}"
            },
            "findByTarget": {
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],doc);\n}"
            },
            "findCountByOwner": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],1);\n}"
            },
            "findByOnwer": {
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],doc);\n}"
            },
        },
        "language": "javascript"
    };
    var __design_successlist = {
        "_id": "_design/objectList",
        "views": {
            "findAll": {
                "map": "function (doc) {\n  emit(null,doc);\n}"
            },
            "findCount": {
                "reduce": "_count",
                "map": "function (doc) {\n  emit(1);\n}"
            },
            "findCountByPhone": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],1);\n}"
            },
            "findByPhone": {
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],doc);\n}"
            },
            "findCountByTarget": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],1);\n}"
            },
            "findByTarget": {
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],doc);\n}"
            },
            "findCountByOwner": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],1);\n}"
            },
            "findByOnwer": {
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],doc);\n}"
            },
        },
        "language": "javascript"
    };

    var __design_retrylist = {
        "_id": "_design/objectList",
        "views": {
            "findAll": {
                "map": "function (doc) {\n  emit(null,doc);\n}"
            },
            "findCount": {
                "reduce": "_count",
                "map": "function (doc) {\n  emit(1);\n}"
            },
            "findCountByPhone": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],1);\n}"
            },
            "findByPhone": {
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],doc);\n}"
            },
            "findCountByTarget": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],1);\n}"
            },
            "findByTarget": {
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],doc);\n}"
            },
            "findCountByOwner": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],1);\n}"
            },
            "findByOnwer": {
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],doc);\n}"
            },
        },
        "language": "javascript"
    };
    var __design_centerbalance = {
        "_id": "_design/objectList",
        "views": {
            "findAll": {
                "map": "function (doc) {\n  emit(null,doc);\n}"
            },
            "findCount": {
                "reduce": "_count",
                "map": "function (doc) {\n  emit(1);\n}"
            },
            "findCountByUpdatedTime": {
                "reduce": "_count",
                "map": "function (doc) {\n  emit(doc.updatedtime,doc);\n}"
            },
            "findByUpdatedTime": {
                "map": "function (doc) {\n  emit(doc.updatedtime,doc);\n}"
            },
        },
        "language": "javascript"
    };
    var __design_phonebalance = {
        "_id": "_design/objectList",
        "views": {
            "findAll": {
                "map": "function (doc) {\n  emit(null,doc);\n}"
            },
            "findCount": {
                "reduce": "_count",
                "map": "function (doc) {\n  emit(1);\n}"
            },
            "findCountByPhone": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],1);\n}"
            },
            "findByPhone": {
                "map": "function (doc) {\n  if(doc.phone) \n emit([doc.phone,updatedtime],doc);\n}"
            },
            "findCountByTarget": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],1);\n}"
            },
            "findByTarget": {
                "map": "function (doc) {\n  if(doc.target) \n emit([doc.target,updatedtime],doc);\n}"
            },
            "findCountByOwner": {
                "reduce": "_count",
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],1);\n}"
            },
            "findByOnwer": {
                "map": "function (doc) {\n  if(doc.owner) \n emit([doc.owner,updatedtime],doc);\n}"
            },
        },
        "language": "javascript"
    };

    init_db('centerbalance', __design_centerbalance);
    init_db('falurelist', __design_failedlist);
    init_db('phonebalance', __design_phonebalance);
    init_db('retrylist', __design_retrylist);
    init_db('successlist', __design_successlist);

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
                    throw new Error(res);
                }
            }).catch((err) => {
                throw err;
            });
        } catch (error) {
            deferred.reject(err);
        }
        return deferred.promise;
    }
    module.viewCenterBalance=function(starttime,endtime,page,maxpage){
        var deferred=Q.defer();
        findCountCenterBalance(starttime,endtime).then((res)=>{
            var count=res;            
            if(endtime=='') endtime=convertTZ(new Date());
            findCenterBalance(starttime,endtime,page,maxpage).then((res)=>{
                deferred.resolve({arr:res,count:count});
            }).catch((err)=>{
                deferred.reject(err);
            });
        }).catch((err)=>{
            deferred.reject(err);
        });
        return deferred.promise;
    }
    function findCountCenterBalance(starttime,endtime){
        var deferred=Q.defer();
        var db=create_db('centerbalance');
        if(endtime=='') endtime=convertTZ(new Date());
        db.view(__design_view,'findCountByUpdatedTime',{startkey:starttime,endkey:endtime},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        return deferred.promise;
    }
    function findCenterBalance(starttime,endtime,page,maxpage){
        var deferred=Q.defer();
        var db=create_db('centerbalance');
        findCountCenterBalance(starttime,endtime).then((res)=>{
            var count=res;
            db.view(__design_view,'findByUpdatedTime',{
                startkey:endtime,// reverse it here when set descending=true;
                endkey:starttime,// reverse it here when set descending=true;
                descending:true,
                skip:page,
                limit:maxpage
            },(err,res)=>{
                if(err)deferred.reject(err);
                else{
                    var arr=[];
                    var array=res.rows;
                    if(res.rows.length){
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index].value;
                            arr.push(element);
                        }
                    }
                    deferred.resolve({arr:arr,count:count});
                }
            });
        }).catch((err)=>{
            deferred.reject(err);
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
                    throw new Error(res);
                }
            }).catch((err) => {
                throw err;
            });
        } catch (error) {
            deferred.reject(err);
        }
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
                        if (res.lastbalance < __minvalue)
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
                                    throw new Error(res);
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
                    }).catch((err) => {
                        throw err;
                    });
                } else {
                    throw new Error(res)
                }
            }).catch((err) => {
                throw err;
            })
        } catch (error) {
            addRetryList(phone, topupvalue, target, owner);
            deferred.reject(error);
        }
        return deferred.promise;
    }
    module.directTopup = function (phone, toupvalue) {
        var deferred = Q.defer();
        try {
            this.checkCenterBalance().then((res) => {
                if (res.lastbalance > topupvalue) {
                    this.checkPhoneBalance(phone, target, owner).then((res) => {
                        var bres = res;
                        if (res.lastbalance < __minvalue)
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
                                    throw new Error(res);
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
                    }).catch((err) => {
                        throw err;
                    });
                } else {
                    throw new Error(res);
                }
            }).catch((err) => {
                throw err;
            });
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
    function findCountRetryList(by,type,starttime,endtime){
        var deferred=Q.defer();
        var db=create_db('retrylist');
        if(type=='phone')
        db.view(__design_view,'findCountByPhone',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else if(type=='target')
        db.view(__design_view,'findCountByTarget',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else if(type=='owner')
        db.view(__design_view,'findCountByOwner',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else{
            deferred.reject(new Error('error wrong type'));
        }
        return deferred.promise;
    }
    function findRetryByPhone(phone, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        db.view(__design_view, 'findByPhone', {
            descending: true,
            startkey: [phone, endtime],
            endkey: [phone, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function findRetryByTarget(target, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        db.view(__design_view, 'findByTarget', {
            descending: true,
            startkey: [target, endtime],
            endkey: [target, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function findRetryByOwner(owner, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        db.view(__design_view, 'findByOwner', {
            descending: true,
            startkey: [owner, endtime],
            endkey: [owner, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    module.viewRetryList = function (by, type, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        if (type=='phone') {
            findCountRetryList(by,type,starttime,endtime).then((res)=>{
            var count=res;
            findRetryByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                            deferred.resolve({arr:res,count:count});
                        }).catch((err) => {
                            deferred.reject(err);
                        });
            }).catch((err)=>{

            });
            
        } else if (type=='target') {
            findCountRetryList(by,type,starttime,endtime).then((res)=>{
                var count=res;
                findRetryByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                                deferred.resolve({arr:res,count:count});
                            }).catch((err) => {
                                deferred.reject(err);
                            });
            }).catch((err)=>{
                deferred.reject(err);
            });
        } else if (type=='owner') {
            findCountRetryList(by,type,starttime,endtime).then((res)=>{
                var count=res;
                findRetryByPhone(owner, starttime, endtime, page, maxpage).then((res) => {
                                deferred.resolve({arr:res,count:count});
                            }).catch((err) => {
                                deferred.reject(err);
                            });
            }).catch((err)=>{
                deferred.reject(err);
            });
            
        }
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

    function findSuccessByPhone(phone, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('successlist');
        db.view(__design_view, 'findByPhone', {
            descending: true,
            startkey: [phone, endtime],
            endkey: [phone, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function findSuccessByTarget(target, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('successlist');
        db.view(__design_view, 'findByTarget', {
            descending: true,
            startkey: [target, endtime],
            endkey: [target, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function findSuccessByOwner(owner, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('retrylist');
        db.view(__design_view, 'findByOwner', {
            descending: true,
            startkey: [owner, endtime],
            endkey: [owner, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
    function findCountSuccessList(by,type,starttime,endtime){
        var deferred=Q.defer();
        var db=create_db('successlist');
        if(type=='phone')
        db.view(__design_view,'findCountByPhone',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else if(type=='target')
        db.view(__design_view,'findCountByTarget',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else if(type=='owner')
        db.view(__design_view,'findCountByOwner',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else{
            deferred.reject(new Error('error wrong type'));
        }
        return deferred.promise;
    }
    module.viewSuccessList = function (by,type, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('successlist');
        if (type=="phone") {
            findCountSuccessList(by,type,starttime,endtime).then((res)=>{
                var count=res;
                findSuccessByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                deferred.resolve({arr:res,count:count});
            }).catch((err) => {
                deferred.reject(err);
            });
            }).catch((err)=>{
                deferred.reject(err);
            });
            
        } else if (type=="target") {
            findCountSuccessList(by,type,starttime,endtime).then((res)=>{
                var count=res;
                findSuccessByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                deferred.resolve(res);
            }).catch((err) => {
                deferred.reject(err);
            });
            }).catch((err)=>{
                deferred.reject(err);
            });            
        } else if (type=="owner") {
            findCountSuccessList(by,type,starttime,endtime).then((res)=>{
                var count=res;
                findSuccessByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                deferred.resolve(res);
            }).catch((err) => {
                deferred.reject(err);
            });
            }).catch((err)=>{
                deferred.reject(err);
            });
            
        }
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

    function findFailedByPhone(phone, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        db.view(__design_view, 'findByPhone', {
            descending: true,
            startkey: [phone, endtime],
            endkey: [phone, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function findFailedByTarget(target, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        db.view(__design_view, 'findByTarget', {
            descending: true,
            startkey: [target, endtime],
            endkey: [target, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }

    function findFailedByOwner(owner, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        db.view(__design_view, 'findByOwner', {
            descending: true,
            startkey: [owner, endtime],
            endkey: [owner, starttime],
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
                deferred.resolve(arr);
            }
        });
        return deferred.promise;
    }
    function findCountFailedList(by,type,starttime,endtime){
        var deferred=Q.defer();
        var db=create_db('failedlist');
        if(type=='phone')
        db.view(__design_view,'findCountByPhone',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else if(type=='target')
        db.view(__design_view,'findCountByTarget',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else if(type=='owner')
        db.view(__design_view,'findCountByOwner',{startkey:[by,starttime],endkey:[by,endtime]},(err,res)=>{
            if(err)deferred.reject(err);
            else{
                var arr=[];
                if(res.rows.length){
                    arr.push(res.rows[0].value);
                }
                deferred.resolve(arr[0]);
            }
        });
        else{
            deferred.reject(new Error('error wrong type'));
        }
        return deferred.promise;
    }
    module.viewfailedList = function (by,type, starttime, endtime, page, maxpage) {
        var deferred = Q.defer();
        var db = create_db('failedlist');
        try {
            if (type=="phone") {
                findCountFailedList(by,type,starttime,endtime).then((res)=>{
                    var count=res;
                    findFailedByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                    deferred.resolve({arr:res,count:count});
                }).catch((err) => {
                    deferred.reject(err);
                });
                }).catch((err)=>{
                    deferred.reject(err);
                });
                
            } else if (type=="target") {
                findCountFailedList(by,type,starttime,endtime).then((res)=>{
                    var count=res;
                    findFailedByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                    deferred.resolve({arr:res,count:count});
                }).catch((err) => {
                    deferred.reject(err);
                });
                }).catch((err)=>{
                    deferred.reject(err);
                });
                
            } else if (type=="owner") {
                findCountFailedList(by,type,starttime,endtime).then((res)=>{
                    var count=res;
                    findFailedByPhone(by, starttime, endtime, page, maxpage).then((res) => {
                    deferred.resolve({arr:res,count:count});
                }).catch((err) => {
                    deferred.reject(err);
                });
                }).catch((err)=>{
                    deferred.reject(err);
                });
                
            }
        } catch (error) {
            deferred.reject(error);
        }

        return deferred.promise;
    }

    module.refillGPSNumber = function (phone, topupvalue, target, owner) {
        var deferred = Q.defer();
        try {
            topupTarget(phone, toupvalue, target, owner).then((res) => {
                if (res) {
                    addSuccessList(phone, topupvalue, target, owner);
                    deferred.resolve(res);
                }
            }).catch((err) => {
                throw err;
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
                    throw err;
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
                    throw err;
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
                    throw err;
                });   
        } catch (error) {
            deferred.reject(error);
        }        
        return deferred.promise;        
    }
    return module;
}