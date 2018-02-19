//web post
const async = require('async');
const express = require('express');
const app = express();
const uuidV4 = require('uuid/v4');
const nano = require('nano')('http://admin:admin@localhost:5984');
const LTCSERVICE = require('./ltctopup')();
const fs = require('fs');
//const _current_picture_path = './_doc_/';
const _current_picture_path = '_doc_/';
const base64 = require('file-base64');
var __client_ip = '';
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
const Q = require('q');
var Promise = require('bluebird');
//Promise.promisifyAll(nano);
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
const bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
app.use(bodyParser());
var methodOverride = require('method-override');
app.use(cors());
app.use(methodOverride());


app.use(errorHandler)

function errorHandler(err, req, res, next) {
  var l = {
    log: err,
    logdate: convertTZ(new Date()),
    type: "error",
    gui: uuidV4()
  };
  errorLogging(l);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', {
    error: err
  });
}

function errorLogging(log) {
  var db = create_db("errorlogs");
  console.log(log);
  db.insert(log, log.gui, function (err, body) {
    if (err) console.log(err);
    else {
      console.log("log oK ");
    }
  });
}



__design_view = "objectList";
const requestIp = require('request-ip');
var __login_kw = 'Authen';
var __client_ip = "";
app.use(requestIp.mw());
var __cur_client = {};
app.use('/doc_object', express.static(path.join(__dirname, '_doc_')));

function convertTZ(fromTZ) {
  return moment.tz(fromTZ, "Asia/Vientiane").format();
}
var __design_shop = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit([doc.name],doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.name,1);\n}"
    },
    "findByShopName": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  emit(doc.name, doc);\n}"
    },
    "findByOwnerName": {
      "map": "function (doc) {\n  emit(doc.owner, doc);\n}"
    },
    "findByUserToken": {
      "map": "function (doc) {\n  emit(doc.usertoken, doc);\n}"
    }

  },
  "language": "javascript"
};
var __design_item = {
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
      "map": "function (doc) {\n  emit(doc.name,doc.shopname,doc.ownername,1);\n}"
    },
    "findCountByGui": {
      "map": "function (doc) {\n  emit(doc.gui,doc);\n}"
    },
    "findCountByShopName": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.shopname,1);\n}"
    },
    "findCountByItemNameShopName": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.anem,doc.shopname],1);\n}"
    },
    "findCountByOwnerName": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.ownername,1);\n}"
    },
    "findCountByShopNameOwnerName": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.shopname,doc.ownername,doc.isactive],1);\n}"
    },
    "findCountByShopNameOwnerNameAll": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.shopname,doc.ownername],1);\n}"
    },
    "findByShopName": {
      "map": "function (doc) {\n if(doc.isactive&&doc.isapproved) \n emit(doc.shopname,doc);\n}"
    },
    "findByOwnerName": {
      "map": "function (doc) {\n if(doc.isapproved) \n emit(doc.ownername,doc);\n}"
    },
    "findByItemNameShopName": {
      "map": "function (doc) {\n if(doc.isapproved) \n emit([doc.name,doc.shopname],doc);\n}"
    },
    "findByShopnameOwnerName": {
      "map": "function (doc) {\n emit([doc.shopname,doc.ownername,doc.isactive],doc);\n}"
    },
    "findByShopnameOwnerNameAll": {
      "map": "function (doc) {\n  emit([doc.shopname,doc.ownername],doc);\n}"
    },
    "findCountByApprovalItem": {
      "reduce": "_count",
      "map": "function (doc) {\n emit([doc.isactive],1);\n}"
    },
    "findByApprovalItem": {
      "map": "function (doc) {\n emit([doc.isactive,doc.updateddate],doc);\n}"
    },
    "findKW": {
      "map": "function(doc) {\r\n    var i;\r\n    if (doc.keyword&&doc.isactive) {\r\n        for (i = 0; i < doc.keyword.length; i += 1) {\r\n            emit(doc.keyword.slice(i), doc);\r\n        }\r\n    }\r\n}"
    },
  },
  "language": "javascript"
};
var __design_doc = {
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
    "findByGui": {
      "map": "function (doc) {\n  emit(doc.gui,doc);\n}"
    },
    "findCountByItemGui": {
      "reduce": "_count",
      "map": "function (doc) {\n  if(doc.isactive) \n emit([doc.itemgui],1);\n}"
    },
    "findCountByItemGuiOwnerName": {
      "reduce": "_count",
      "map": "function (doc) {\n   emit([doc.itemgui,doc.ownername],1);\n}"
    },
    "findCountByItemGuiAll": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.itemgui],1);\n}"
    },
    "findByItemGui": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  if(doc.isactive) \n emit([doc.itemgui,doc.createddate], doc);\n}"
    },
    "findByItemGuiAll": {
      "map": "function (doc) {\n  emit([doc.itemgui,doc.createddate], doc);\n}"
    },
    "findByItemGuiOwnerName": {
      "map": "function (doc) {\n  emit([doc.itemgui,doc.ownername], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_approvallist = {
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
    "findCountByOwnerName": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.ownername],1);\n}"
    },
    "findByOwnerName": {
      "map": "function (doc) {\n  emit([doc.ownername,doc.approvesubmiteddate], doc);\n}"
    },
    "findByApprover": {
      "map": "function (doc) {\n  emit([doc.approvedby], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_itemaddon = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(doc.createddate,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null,1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findCountByOwnerNameShopName": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.ownername,doc.shopname],1);\n}"
    },
    "findByOwnerNameShopName": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  emit([doc.ownername,doc.shopname], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_searchkw = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null,1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findCountByIsActive": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.isactive,1);\n}"
    },
    "findByIsActive": {
      "map": "function (doc) {\n  emit([doc.isactive,doc.createddate],doc);\n}"
    },
    "findCountByOwnerNameShopNameIsActive": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit([doc.ownername,doc.shopname,doc.isactive],1);\n}"
    },
    "findByOwnerNameShopNameIsActive": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  emit([doc.ownername,doc.shopname,doc.isactive,doc.createddate], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_ads = {
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(doc.createddate,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null,1);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.gui,1);\n}"
    },
    "findCountByIsActive": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.isactive,1);\n}"
    },
    "findByIsActive": {
      //"map": "function (doc) {\n  emit(['by_count',doc.month,doc.year], doc);\n}"
      "map": "function (doc) {\n  emit([doc.isactive,doc.createddate], doc);\n}"
    }
  },
  "language": "javascript"
};
var __design_log = {
  "_id": "_design/objectList",
  "views": {
    "findByTime": {
      "map": "function (doc) {\n  emit(doc.logdate,doc);\n}"
    },
    "countByType": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.type,doc);\n}"
    },
    "findByType": {
      "map": "function (doc) {\n  emit(doc.type,doc);\n}"
    }
  }
}
// var _pp='/pp';
// var _prp='/prp';
// var _ap='/ap';
var _pp = '';
var _prp = '';
var _ap = '';
init_db('ads', __design_ads);
init_db('shop', __design_shop);
init_db('item', __design_item);
init_db('approvallist', __design_approvallist);
init_db('itemaddon', __design_itemaddon);
init_db('searchkw', __design_searchkw);
init_db('doc', __design_doc);
init_db('errorlogs', __design_log);
var ads = {
  photo: [],
  title: '',
  url: '',
  gui: '',
  isslide: false,
  createddate: '',
  visitcount: '',
  isactive: true,
}

var shop = {
  name: '',
  photo: [],
  owner: '',
  contact: '',
  address: '',
  gui: '',
  createddate: '',
  gpslat: '',
  gpslon: '',
  updateddate: '',
  visitcount: 0,
  maxitem: 0,
  usertoken: '' //usergui
}
var item = {
  shopname: '',
  name: '',
  ownername: '',
  //owndergui:'',    
  gui: '',
  itemprice: 0,
  itemqtty: 0,
  link: '',
  category: '',
  visitcount: 0,
  itemtitle: '', //max 100 characters
  description: '',
  createddate: '',
  updateddate: '',
  keyword: '',
  isapproved: false,
  lastapproved: '',
  isactive: true,
  lastactive: '',
  lastdeactive: '',
  photo:[]
}
var approvallist = {
  itemgui: '',
  ownername: '',
  ownergui: '',
  approvesubmiteddate: '',
  approveddate: '',
  approvedby: '',
  gui: '',
  name: ''
}
var itemaddon = {
  shopname: '',
  ownername: '',
  owndergui: '',
  createddate: '',
  itemcount: 10,
  value: 200000,
  approvedby: '',
  gui: '',
}
var searchkw = {
  shopname: '',
  ownername: '',
  approvedby: '',
  itemname: '',
  itemgui: '',
  price: 0,
  searchcount: 0,
  searchmax: 1,
  createddate: '',
  updateddate: '',
  closedate: '',
  isactive: false,
  gui: '',
}
var doc = {
  itemgui: '',
  createddate: '',
  link: '',
  type: '',
  isactive: true,
  gui: '',
  name: '',
  content: ''
}

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, '_doc_')));



var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      //console.log('current path:'+_current_picture_path);  
      cb(null, _current_picture_path);
    },
    filename: function (req, file, cb) {
      filepath=file.originalname.replace(path.extname(file.originalname), "") + '-' + makeid(6) + '-' + Date.now() + path.extname(file.originalname);
      //console.log('uploading filename:'+filepath);      
      cb(null, filepath);
    }
  }),
  fileFilter: function (req, file, cb) {
    console.log('original filename:'+file.originalname);
    var ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'), null);
    }
    cb(null, true);
  }
}).single('file_up');

// UPLOAD image file

app.post('/upload_img', upload, function (req, res) {
  // client
  // return client 
  // client.data.file
  var js = {};js.client={};
  js.client =req.body;//It is special  
  console.log(req.body);
  js.file = req.file  //It is special
  console.log('files');
  console.log(req.files);

  console.log('file');
  console.log(req.files);
  

  console.log('Uploade Successful ', js.file);
  js.client.data = {};
  js.client.data.message = "OK file uploaded";
  js.client.data.file = '/images/' + js.file.file_up; // client remove /images/ then save 
  res.send(js.client);
});

// GET sample data 
app.get('/get_sample', function (req, res) {
  var arr = [];
  ads._property_name = 'ads';
  arr.push(ads);
  shop._property_name = 'shop';
  arr.push(shop);
  item._property_name = 'item';
  arr.push(item);
  approvallist._property_name = 'approvallist';
  arr.push(approvallist);
  itemaddon._property_name = 'itemaddon';
  arr.push(itemaddon);
  searchkw._property_name = 'searchkw';
  arr.push(searchkw);
  doc._property_name = 'doc';
  arr.push(doc);
  html = displayJson(arr);
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
app.get('/', function (req, res) {
  res.send("welcome to The Friendd ads");
});
// first page here 
//PUBLIC , count EventAds
app.post('/count_event_ads', function (req, res) {
  // client
  // return client
  // client.data.message='OK'
  // client.data.counteventads=0
  var js = {};
  js.client = req.body;
  js.resp = res;
  countEventAds(js.client.data.ads.gui).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.counteventads = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
});

//Public , show front page monthly or weekly ==> event page ads
app.post('/show_event_ads', function (req, res) {
  // client
  // client.data.page 
  //client.data.maxpage
  // return client
  // client.data.message='OK'
  // client.data.ads={arr:{},0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showEventAds(js); // load photos or url ....
});

function showEventAds(js) {
  displayEventAds(true, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.ads = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountEventAdsByIsActive(isactive) {
  var deferred = Q.defer();
  var db = create_db('ads');
  db.view(__design_view, 'findCountByIsActive', {
    key: isactive
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value)
        deferred.resolve(arr[0]);
      }
    }
  });
  return deferred.promise;
}

function displayEventAds(isactive, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('ads');
  findCountEventAdsByIsActive(isactive).then(function (body) {
    db.view(__design_view, 'findByIsActive', {
        startkey: [isactive, ""],
        endkey: [isactive, "\u9999"],
        decending: true,
        skip: 0,
        limit: maxpage
      },
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < res.rows.length; index++) {
              //delete res.rows[index].value._rev;
              //delete res.rows[index].value.gui;
              arr.push(res.rows[index].value);
            }
            deferred.resolve({
              arr: arr,
              count: body
            });
          }
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}
//ADMIN , show front page monthly or weekly ==> event page ads
app.post('/show_event_ads_list', function (req, res) {
  // client.data.user,
  //client.data.page
  //client.data.maxpage
  // return client
  // client.data.message='OK'
  // client.data.ads={arr:{},0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showEventAds(js); // load photos or url ....
});

function showEventAdsList(js) {
  displayEventAdsList(js.client.data.ads.isactive, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = 'OK'
    js.client.data.ads = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountEventAdsByIsActiveList(isactive) {
  var deferred = Q.defer();
  var db = create_db('ads');
  db.view(__design_view, 'findCountByIsActive', {
    key: isactive
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value)
        deferred.resolve(arr[0]);
      }
    }
  });
  return deferred.promise;
}

function displayEventAdsList(isactive, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('ads');
  findCountEventAdsByIsActiveList(isactive).then(function (body) {
    db.view(__design_view, 'findByIsActive', {
        startkey: [isactive, ""],
        endkey: [isactive, "\u9999"],
        decending: true,
        skip: 0,
        limit: maxpage
      },
      function (err, res) {
        if (err) deferred.reject(err);
        else {
          var arr = [];
          if (res.rows.length) {
            for (var index = 0; index < res.rows.length; index++) {
              arr.push(res.rows[index].value);
            }
            deferred.resolve({
              arr: arr,
              count: body
            });
          }
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}
//ADMIN update event ads
app.post('/update_event_ads', function (req, res) {
  // client.user, 
  //client.data.ads._rev
  //return client
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  updateEventAds(js); // load photos or url ....
});

function updateEventAds(js) {
  editEventAds(js.client.data.ads).then(function (body) {
    js.client.data.message = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountEventAds() {
  var deferred = Q.defer();
  var db = create_db('ads');
  db.view(__design_view, 'findCount', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

function editEventAds(ads) {
  var deferred = Q.defer();
  var db = create_db('ads');
  if (ads._rev) {
    ads.visitcount++;
  } else {
    ads.gui = uuidV4();
    ads.createddate = convertTZ(new Date());
  }
  db.insert(ads, ads.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

function findEventAdsByGui(gui) {
  var deferred = Q.defer();
  var db = create_db('ads');
  db.view(__design_view, 'findByGui', {
    key: gui
  }, function (err, res) {
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

function countEventAds(adsgui) {
  var deferred = Q.defer();
  var db = create_db('ads');
  findEventAdsByGui(adsgui).then(function (body) {
    editEventAds(body).then(function (body) {
      deferred.resolve(body);
    }).catch(function (err) {
      deferred.reject(err);
    });
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

//PUBLIC , edit Keyword ads
app.post('/show_registered_KW_ads', function (req, res) {
  // client ,
  // client.data.page, 
  //client.data.maxpage
  //return client
  // client.message='OK'
  // client.data.searchkw ={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showRegisteredKWAds(js);
});

function showRegisteredKWAds(js) {
  // check if registered user visit
  getRegisteredKWAds(js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.searchkw = body;
    js.client.data.message = 'OK'
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function getCountRegisteredKWAds() {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  db.view(__design_view, 'findCountByIsActive', {
    key: true
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length)
        arr.push(res.rows[0].value);
      deferred.resolve(res.rows[0].value);
    }
  });
  return deferred.promise;
}

function getRegisteredKWAds(page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  getCountRegisteredKWAds().then(function (body) {
    db.view(__design_view, 'findByIsActive', {
      startkey: [true, '\u9999'],
      endkey: [true, '\u9999'],
      decending: true,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) {
        deferred.reject(err);
      } else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            res.rows[index].value.searchcount++;
            res.rows[index].value.updateddate = convertTZ(new Date());
            if (res.row[index].isactive)
              arr.push(findItemByGui(res.rows[index].value));
            updateRegisteredKWAds(res.rows[index].value);
          }
          deferred.resolve({
            arr: arr,
            count: body
          });
        }
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function findItemByGui(item) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findByGui', {
    key: item.gui
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.row.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

function updateRegisteredKWAds(ads) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  if (ads.searchcount > ads.searchmax) {
    ads.isactive = false;
    ads.updateddate = convertTZ(new Date());
    ads.closedate = ads.updateddate;
  }
  db.insert(ads, ads.gui, function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

// PUBLIC , search item
app.post('/show_searched_item', function (req, res) {
  // client.data.sk , 
  //client.data.page , 
  //client.data.maxpage
  //return client
  // client.data.message='OK'
  //client.data.item={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showSearchedItems(js);
});

function showSearchedItems(js) {
  getSearchedItems(js.client.data.sk, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function getSearchedItems(sk, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findKW', {
    key: sk,
    skip: page,
    limit: maxpage
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.row.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr);
    }
  });
  return deferred.promise;
}

// User , edit shop
app.post('/edit_shop', function (req, res) {
  //client ,
  //client.data.shop._rev
  //return client
  // client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  editShop(js);
});

function editShop(js) {
  updateShop(js.client.data.shop).then(function (body) {
    js.client.data.message = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountByOwner(ownername) {
  var deferred = Q.defer();
  var db = create_db('shop');
  db.view(__design_view, 'findCountByOwnerName', {
    key: ownername
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

function findCountByShopName(shopname) {
  var deferred = Q.defer();
  var db = create_db('shop');
  db.view(__design_view, 'findCountByShopName', {
    key: shopname
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

function updateShop(shop) {
  var deferred = Q.defer();
  var db = create_db('shop');
  findCountByOwner(shop.owner).then(function (body) {
    if (body) deferred.resolve('you can have only one shop');
    else
      findCountByShopName(shop.name).then(function (body) {
        if (body) deferred.resolve('could not use this shop name');
        else {
          if (shop._rev) {
            shop.visitcount++;
            shop.updateddate = convertTZ(new Date());
          } else {
            shop.gui = uuidV4();
            shop.createddate = convertTZ(new Date());
          }

          db.insert(shop, shop.gui, function (err, res) {
            if (err) deferred.reject(err);
            else {
              deferred.resolve('OK add a new shop completely');
            }
          });
        }
      });
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}
// User , edit shop
app.post('/find_exist_shop', function (req, res) {
  //client ,
  //client.data.shop
  //return client
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  findExistShop(js);
});

function findExistShop(js) {
  findCountByShopName(js.client.data.shop.name).then(function (body) {
    if (!body)
      js.client.data.shop = {};
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}
// Public , show shop
app.post('/show_shop', function (req, res) {
  //client ,
  //client.data.shop
  //return client
  // client.data.message='OK'
  // client.data.shop={}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showShop(js);
});

function showShop(js) {
  displayShop(js.client.data.shop.name).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.shop = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayShop(shopname) {
  var deferred = Q.defer();
  var db = create_db('shop');
  db.view(__design_view, 'findByShopName', {
    key: shopname
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      res.rows[0]._rev = '';
      res.rows[0].gui = '';
      deferred.resolve(res.rows[0].value);
    }
  });
  return deferred.promise;
}
//Admin , shop list by admin
app.post('/show_shop_list', function (req, res) {
  //client.data.page,
  //client.data.maxpage
  //return client
  //client.data.message='OK'
  //client.data.shop={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showShopList(js);
});

function showShopList(js) {
  displayShopList(js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.shop = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountShopList() {
  var deferred = Q.defer();
  var db = create_db('shop');
  db.view(__design_view, 'findCount', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res.rows[0].value);
    }
  });
  return deferred.promise;
}

function displayShopList(page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('shop');
  findCountShopList().then(function (body) {
    db.view(__design_view, 'findAll', {
      startkey: [""],
      endkey: ["\u9999"],
      decending: true,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        for (var index = 0; index < res.rows.length; index++) {
          arr.push(array[index].value);
        }
        deferred.resolve({
          arr: arr,
          count: body
        });
      }
    });
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}
//User  , edit shope
app.post('/show_shop_details', function (req, res) {
  //client.data.user ,
  //client.data.shop
  //return client
  //client.data.message='OK'
  //client.data.shop={}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showShopDetails(js);
});

function showShopDetails(js) {
  displayShop(js.client.data.shop.name).then(function (body) {
    js.client.data.message = 'OK'
    js.client.data.shop = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayShopDetails(shopname) {
  var deferred = Q.defer();
  var db = create_db('shop');
  db.view(__design_view, 'findByShopName', {
    key: shopname
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res.rows[0].value);
    }
  });
  return deferred.promise;
}
//User , edit item
app.post('/edit_item', function (req, res) {
  //client.data.user ,
  //client.data.shop, 
  //client.data.item
  //return client
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  editItem(js);
});

function editItem(js) {
  updateItem(js.client.data.item, false).then(function (body) {
    js.client.data.message = body;
    //js.client.data.item = item;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountByItemNameShopName(name, shopname) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findCountByItemNameShopName', {
    key: [name, shopname]
  }, function (err, res) {
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

function updateItem(item, approval) {
  var deferred = Q.defer();
  var db = create_db('item')
  findCountByItemNameShopName(item.name, item.shopname).then(function (body) {
    if (!body) deferred.reject('you could not use this this name');
    else {
      item.isapproved = approval;
      if (item._rev)
        item.visitcount++;
      else
        item.createddate = convertTZ(new Date());
      item.updateddate = convertTZ(new Date());
      if (item.isapproved)
        item.lastapproved = convertTZ(new Date());
      if (item.isactive)
        item.lastactive = convertTZ(new Date());
      else
        item.lastdeactive = convertTZ(new Date());
      db.insert(item, item.gui, function (err, res) {
        if (err) deferred.reject(err);
        else {
          deferred.resolve(res);
        }
      });
    }
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}
// FOR ADMIN, edit item
app.post('/approve_item', function (req, res) {
  // client.data.item
  //return client
  // client.data.message='OK'
  // client.data.item={}
  var js = {};
  js.client = req.body;
  js.resp = res;
  approveItem(js);
});

function approveItem(js) {
  updateItem(js.client.data.item, true).then(function (body) {
    js.client.data.message = body;
    js.client.data.item = item;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}
// FOR public , item
app.post('/show_item', function (req, res) {
  // client.data.item , 
  //client.data.shop
  //return client
  //client.data.message='OK'
  //client.data.item
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItem(js);
});

function showItem(js) {
  displayItem(js.client.data.item.name, js.client.data.shop.name).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayItem(itemname, shopname) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findByItemNameShopName', {
    key: [itemname, shopname]
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        for (var index = 0; index < res.rows.length; index++) {
          res.rows[index].value._rev = '';
          res.rows[index].value.gui = '';
          arr.push(res.rows[index].value);
        }
      }
      deferred.resolve(arr);
    }
  })
  return deferred.promise;
}
//FOR user ,edit item
app.post('/show_item_details', function (req, res) {
  //client.data.user ,
  //client.data.shop , 
  //client.data.item , 
  //return client
  // client.data.message='OK'
  // client.data.item
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItemDetails(js);
});

function showItemDetails(js) {
  displayItemDetails(js.client.data.item.name, js.client.data.shop.name).then(function (body) {
    js.client.data.message = 'OK'
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayItemDetails(itemname, shopname) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findByItemNameShopName', {
    key: [itemname, shopname]
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
  })
  return deferred.promise;
}

// FOR user  , items list by shop owner
app.post('/show_item_list_by_shop_owner', function (req, res) {
  //client.data.user ,
  //client.data.shop, 
  //client.data.item.isactive, //
  //client.data.maxpage, 
  //client.data.page
  //return client
  //client.data.message='OK'
  //client.data.item={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItemListByShopOwner(js);
});

function showItemListByShopNameOwnerName(js) {
  displayItemListShopNameOwnerName(js.client.data.shop.name, js.client.username, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = "OK"
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountItemByShopNameOwnerName(shopname, ownername) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findCountByShopNameOwnerNameAll', {
    key: [shopname, ownername]
  }, function (err, res) {
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

function displayItemListShopNameOwnerName(shopname, ownername, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('item');
  findCountItemByShopNameOwnerName(shopname, ownername).then(function (body) {
    db.view(__design_view, 'findByShopnameOwnerNameAll', {
      key: [shopname, ownername],
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            res.rows[index].value._rev = '';
            res.rows[index].value.gui = '';
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
  });

  return deferred.promise;
}

// FOR User by Active , item
app.post('/show_item_list_by_shop_owner_active', function (req, res) {
  //client.data.user ,
  //client.data.shop,/
  // client.data.item.isactive, 
  //client.data.maxpage, 
  //client.data.page
  //return client
  //client.data.message='OK'
  //client.data.item={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItemListByShopNameOwnerNameIsActive(js);
});

function showItemListByShopNameOwnerNameIsActive(js) {
  displayItemListShopNameOwnerName(js.client.data.shop.name, js.client.username, js.client.data.item.isactive, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = "OK"
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountItemByShopNameOwnerNameIsActive(shopname, ownername, isactive) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findCountByShopNameOwnerName', {
    key: [shopname, ownername, isactive]
  }, function (err, res) {
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

function displayItemListShopNameOwnerNameIsActive(shopname, ownername, isactive, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('item');
  findCountItemByShopNameOwnerName(shopname, ownername).then(function (body) {
    db.view(__design_view, 'findByShopnameOwnerName', {
      key: [shopname, ownername, isactive],
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            res.rows[index].value._rev = '';
            res.rows[index].value.gui = '';
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
  });

  return deferred.promise;
}

// FOR pulbic , show item by shop
app.post('/show_item_list_by_shop', function (req, res) {
  //client.data.user ,
  //client.data.shop , 
  //client.data.maxpage, 
  //client.data.page
  //return client
  //client.data.message='OK'
  //client.data.item={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItemListByShopOwner(js);
});

function showItemListByShop(js) {
  displayItemListShop(js.client.data.shop.name, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.message = "OK"
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountItemByShopName(shopname) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findCountByShopName', {
    key: [shopname]
  }, function (err, res) {
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

function displayItemListShop(shopname, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('item');
  findCountItemByShopName(shopname).then(function (body) {
    db.view(__design_view, 'findByShopName', {
      key: [shopname],
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            res.rows[index].value._rev = '';
            res.rows[index].value.gui = '';
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
  });

  return deferred.promise;
}

//FOR ADMIN , show approved item
app.post('/show_approval_item', function (req, res) {
  // client.data.maxpage, 
  //client.data.page
  //client.data.item.isapproved
  // client
  //return client
  // client.data.message="OK"
  //client.data.item
  var js = {};
  js.client = req.body;
  js.resp = res;
  showApprovalItem(js);
});

function showApprovalItem(js) {
  displayByApprovalItem(js.client.data.item.isapproved).then(function (body) {
    js.client.data.item = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountByApprovalItem(isapproved) {
  var deferred = Q.defer();
  var db = create_db('item');
  db.view(__design_view, 'findCountByApprovalItem', {
      key: isapproved,
      decending: true
    },
    function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          arr.push(res.rows[0].value);
        }
        deferred.resolve(arr[0]);
      }
    });
  return deferred.promise;
}

function displayByApprovalItem(isapproved) {
  var deferred = Q.defer();
  var db = create_db('item');
  findCountByApprovalItem(isapproved).then(function (body) {
    db.view(__design_view, 'findByApprovalItem', {
        startkey: [isapproved, ""],
        endkey: [isapproved, "\u9999"],
        decending: true
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
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

// FOR USER ONLY , update doc (photo, other pdf)
app.post('/update_doc_by_user', function (req, res) {
  //client.data.user, 
  //client.data.item, 
  //client.data.doc
  // return client
  //client.data.message="OK"
  var js = {};
  js.client = req.body;
  js.resp = res;
  editDocByUser(js);
});

function editDocByUser(js) {
  updateDocByUser(js.client.data.item.gui, js.client.data.user.username).then(function (body) {
    js.client.data.message = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountDocByItemGui(itemgui) {
  var deferred = Q.defer();
  var db = create_db('doc');
  db.view(__design_view, 'findCountByItemGuiAll', {
      key: itemgui,
      decending: true
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

function updateDocByUser(doc, username) {
  var deferred = Q.defer();
  var db = create_db('doc');
  findCountDocByItemGuiOwnerName(doc.itemgui, username).then(function (body) {
    if (!doc._rev)
      if (6 > body + 1) deferred.resolve('Could not add more than 5 photo');
      else {
        if (!doc._rev) {
          doc.gui = new uuidV4();
          //doc.link = body;
          db.insert(doc, doc.gui, function (err, res) {
            if (err) deferred.reject(err);
            else {
              deferred.resolve("OK");
            }
          });
        } else {
          doc.content = '';
          db.insert(doc, doc.gui, function (err, res) {
            if (err) deferred.reject(err);
            else {
              if (doc._deleted) {
                // delete picture
                deleteFile(doc.link).then(function (body) {
                  deferred.resolve("OK");
                }).catch(function (err) {
                  deferred.reject(err);
                });
                // } else if (doc._rev) {
                //   // make a picture from base64
                //   makePhotoFromBase64(doc.content, doc.itemgui, doc.name).then(function (body) {
                //     deferred.resolve("OK");
                //   }).catch(function (err) {
                //     deferred.reject(err);
                //   });
              } else
                deferred.resolve("OK");
            }
          });
        }
      }
  }).catch(function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function deleteFile(link) {
  var deferred = Q.defer();
  var path = _current_picture_path  + link;
  fs.unlink(path, function (err) {
    if (err && err.code == 'ENOENT') {
      // file doens't exist
      deferred.reject('Could not find this file, so can not delete this file ' + link);
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      deferred.reject("error " + JSON.parse(err) + ' /' + link);
    } else {
      deferred.resolve('OK removed ' + link);
    }
  });
  return deferred.promise;
}

function makePhotoFromBase64(content, itemgui, name) {
  var deferred = Q.defer();
  base64.decode(content, _current_picture_path  + itemgui + '/' + name, function (err, res) {
    if (err) deferred.reject(err);
    else deferred.resolve(_current_picture_path  + itemgui + '/' + name); //put _current_icture_path for correct URL
  });
  return deferred.promise;
}

function makeBase64FromFile(itemgui, name) { // IF use only base64 string we can give short link which need request base64 string only
  var deferred = Q.defer();
  base64.encode(_current_picture_path  + itemgui + '/' + name, function (err, base64String) {
    if (err) deferred.reject(err);
    else deferred.resolve(base64String);
  });
  return deferred.promise;
}

//FOR USER , show doc by item gui and owner
app.post('/show_doc_by_itemgui_owner', function (req, res) {
  //client.data.user,  
  //client.data.item.gui
  //return client
  // client.message='OK'
  //client.data.item={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showDocByItemGuiOwnerName(js);
});

function showDocByItemGuiOwnerName(js) {
  displayDocByItemGuiOwner(js.client.data.item.gui, js.client.data.user.username).then(function (body) {
    js.client.data.message = 'OK';
    js.client.data.doc = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountDocByItemGuiOwnerName(itemgui, ownername) {
  var deferred = Q.defer();
  var db = create_db('doc');
  db.view(__design_view, 'findCountByItemGuiOwnerName', {
      key: [itemgui, ownername],
      decending: true
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

function displayDocByItemGuiOwner(itemgui, ownername) {
  var deferred = Q.defer();
  var db = create_db('doc');
  findCountDocByItemGuiOnwerName(itemgui, ownername).then(function (body) {
    db.view(__design_view, 'findByItemGuiOwnerName', {
      key: [itemgui, ownername]
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            res.rows[index].value.gui = '';
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
  });
  return deferred.promise;
}
//For PUBLIC , doc
app.post('/show_doc_by_itemgui', function (req, res) {
  // client.data.item
  //return client
  //client.data.doc={arr:{},count:0}
  //client.data.message='OK'
  var js = {};
  js.client = req.body;
  js.resp = res;
  showDocByItemGui(js);
});

function showDocByItemGui(js) {
  displayDocByItemGui(js.client.data.item.gui).then(function (body) {
    js.client.data.doc = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayDocByItemGui(itemgui) {
  var deferred = Q.defer();
  var db = create_db('doc');
  findCountDocByItemGui(itemgui).then(function (body) {
    db.view(__design_view, 'findByItemGui', {
      key: itemgui
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            //res.rows[index].value.gui = '';
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
  });
  return deferred.promise;
}

//ADMIN ONLY , register search keyword
app.post('/register_search_kw', function (req, res) {
  //client.data.keyword, 
  // client.data.user
  //return client
  // client.data.message='OK';
  var js = {};
  js.client = req.body;
  js.resp = res;
  registerSearchKW(js);
});

function registerSearchKW(js) {
  updateSearchKW(kw).then(function (body) {
    js.client.data.message = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function findCountSearchKW(isactive) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  db.view(__design_view, 'findCountByIsActive', {
    key: isactive
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

function updateSearchKW(kw) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  if (kw._rev) {
    if (kw.searchcount >= kw.searchmax) {
      kw.updateddate = convertTZ(new Date());
      kw.closedate = kw.updateddate;
      kw.isactive = true;
    }
  } else {
    kw.searchcount = 0;
    kw.searchmax = 0;
    kw.createddate = convertTZ(new Date());
    kw.updateddate = kw.createddate;
    kw.closedate = kw.updateddate;
    kw.isactive = false;
  }
  db.insert(kw, kw.gui, function (err, res) {
    if (err) deferred.reject(err);
    else {
      deferred.resolve(res);
    }
  });
  return deferred.promise;
}

// ADMIN ONLY show keyword list
app.post('/show_search_kw_list', function (req, res) {
  //client.data.keyword, 
  //client.data.maxpage, client.data.page
  //return client
  //client.data.message='OK'
  //client.data.keyword={arr:{},count=0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showSearchKWList(js);
});

function showSearchKWList(js) {
  displaySearchKWList(js.client.data.keyword.isactive, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.keyword = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displaySearchKWList(isactive, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  findCountSearchKW(isactive).then(function (body) {
    db.view(__design_view, 'findByIsActive', {
      startkey: [isactive, ""],
      endkey: [isactive, "\u9999"],
      decending: true,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[0].value);
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
  });
  return deferred.promise;
}

// USER ONLY , search keywords list
app.post('/show_search_kw_by_user', function (req, res) {
  //client.data.user, 
  //client.data.maxpage,client.data.page, 
  //client.data.shop
  //return client
  //client.data.message='OK'
  //client.data.keyword={arr:{},count=0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showSearchKWByUser(js);
});

function showSearchKWByUser(js) {
  displaySearchKWByUser(js.client.data.user.username, js.client.data.shop.shopname, js.client.data.keyword.isactive, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.keyword = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displaySearchKWByUser(ownername, shopname, isactive, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  findCountSearchKWByUser(ownername, shopname, isactive).then(function (body) {
    db.view(__design_view, 'findByOwnerNameShopNameIsActive', {
      startkey: [ownername, shopname, isactive, ""],
      endkey: [ownername, shopname, isactive, "\u9999"],
      decending: true,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[0].value);
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
  });
  return deferred.promise;
}

function findCountSearchKWByUser(ownername, shopname, isactive) {
  var deferred = Q.defer();
  var db = create_db('searchkw');
  db.view(__design_view, 'findCountByOwnerNameShopNameIsActive', {
    key: [ownername, shopname, isactive]
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}
//ADMIN ONLY , edit item add on
app.post('/edit_itemaddon', function (req, res) {
  //client.data.user, 
  //client.data.shop
  //client.data.itemaddon
  //return client
  //client.data.message='OK'

  var js = {};
  js.client = req.body;
  js.resp = res;
  editItemAddon(js);
});

function editItemAddon(js) {
  var itemaddon = js.clien.data.itemaddon;
  itemaddon.gui = uuidV4();
  itemaddon.createddate = convertTZ(new Date());
  updateItemaddon(itemaddon).then((res) => {
    js.client.data.message = res;
    js.resp.send(js.client);
  }).catch((err) => {
    js.client.data.message = JSON.stringify(err);
    js.resp.send(js.client);
  });
}

function updateItemaddon(itemaddon) {
  var deferred = Q.defer();
  var db = create_db('itemaddon');
  if (itemaddon._id && itemaddon._id != undefined) {
    db.insert(itemaddon, itemaddon._id, (err, res) => {
      if (err) deferred.reject(err);
      else {
        deferred.resolve('OK');
      }
    });
  } else {
    db.insert(itemaddon, itemaddon._id, (err, res) => {
      if (err) deferred.reject(err);
      else {
        deferred.resolve('OK');
      }
    });
  }
  return deferred.promise;
}

//ADMIN , show itemaddon
app.post('/show_item_addon', function (req, res) {
  //client.data.maxpage,client.data.page, 
  //return client
  //client.data.message='OK'
  //client.data.itemaddon={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItemAddOn(js);
});

function showItemAddOn(js) {
  displayItemAddOn(js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.itemaddon = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayItemAddOn(page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('itemaddon');
  findCountItemAddOn().then(function (body) {
    db.view(__design_view, 'findAll', {
      startkey: [""],
      endkey: ["\u9999"],
      decending: true,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            arr.push(res.rows[0].value);
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
  });
  return deferred.promise;
}

function findCountItemAddOn() {
  var deferred = Q.defer();
  var db = create_db('itemaddon');
  db.view(__design_view, 'findCount', {}, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

// User , itemaddon
app.post('/show_item_addon_by_user', function (req, res) {
  //client.data.user, client.data.maxpage,client.data.page, client.data.shop
  //return client
  // client.data.message='OK'
  //client.data.itemaddon={arr:{},count:0}
  var js = {};
  js.client = req.body;
  js.resp = res;
  showItemAddOnByUser(js);
});

function showItemAddOnByUser(js) {
  displayItemAddOnByUser(js.client.data.user.username, js.client.data.shop.shopname, js.client.data.keyword.isactive, js.client.data.page, js.client.data.maxpage).then(function (body) {
    js.client.data.itemaddon = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayItemAddOnByUser(ownername, shopname, isactive, page, maxpage) {
  var deferred = Q.defer();
  var db = create_db('itemaddon');
  findCountItemAddOnByUser(ownername, shopname, isactive).then(function (body) {
    db.view(__design_view, 'findByOwnerNameShopName', {
      startkey: [ownername, shopname, isactive, ""],
      endkey: [ownername, shopname, "\u9999"],
      decending: true,
      skip: page,
      limit: maxpage
    }, function (err, res) {
      if (err) deferred.reject(err);
      else {
        var arr = [];
        if (res.rows.length) {
          for (var index = 0; index < res.rows.length; index++) {
            delete res.rows[0].value._rev;
            delete res.rows[0].value.gui;
            delete res.rows[0].value._id;
            arr.push(res.rows[0].value);
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
  });
  return deferred.promise;
}

function findCountItemAddOnByUser(ownername, shopname) {
  var deferred = Q.defer();
  var db = create_db('itemaddon');
  db.view(__design_view, 'findCountByOwnerNameShopName', {
    key: [ownername, shopname]
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length) {
        arr.push(res.rows[0].value);
      }
      deferred.resolve(arr[0]);
    }
  });
  return deferred.promise;
}

// public, init client
app.all('/init_client', function (req, res) {
  //client
  //return client
  var js = {};
  js.client = req.body;
  js.resp = res;
  __cur_client = js.client;

})
//Public , doc
app.post('/show_doc_base64_by_gui', function (req, res) { //client.data.user,  client.data.doc
  var js = {};
  js.client = req.body;
  js.resp = res;
  showDocBase64ByGui(js);
});

function showDocBase64ByGui(js) {
  displayDocBase64ByGui(js.client.data.doc.gui).then(function (body) {
    js.client.data.doc = body;
    js.resp.send(js.client);
  }).catch(function (err) {
    js.client.data.message = err;
    js.resp.send(js.client);
  });
}

function displayDocBase64ByGui(docgui) {
  var deferred = Q.defer();
  var db = create_db('doc');
  db.view(__design_view, 'findByGui', {
    Key: docgui
  }, function (err, res) {
    if (err) deferred.reject(err);
    else {
      var arr = [];
      if (res.rows.length)
        arr.push(res.rows[0].value);
      makeBase64FromFile(arr[0].gui, arr[0].name).then(function (body) {
        deferred.resolve(body);
      }).catch(function (err) {
        deferred.reject(err);
      });
    }
  });
  return deferred.promise;
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

app.all('*', function (req, res, next) {
  //common action
  //console.log(res);  
  var client = req.body;
  var keyword = __login_kw;
  var auth = authentication_path(req.path);
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
              });
            }
          }).catch(function (err) {
            res.send(err);
          });
        } else if (auth == 2) //CHECK authorization User 
          var u = {
            username: c.username,
            workingpage: req.path,
            clientuid: c.clientuid,
            logintoken: c.logintoken
          }
        updateUserAccessLog(u).then(function (body) {
          next();
        }).catch(function (err) {
          res.send(err);
        });
        //   next();
      } else
        res.send(new Error("not Allow"));
    }).catch(function (err) {
      res.send(err);
      //render error
    });
  } else if (req.path != '/init_client') {
    // console.log(client.clientuid +" != "+ __cur_client.clientuid);
    // if (client.clientuid != __cur_client.clientuid||__cur_client.clientuid=='undefined') /// HERE IF WE NEED TO CHECK IF EVEN PUBLIC NEED CLIENTUID
    //   res.send('not allow!');
    //   //next();
    // else
    next();
  } else
    next();
});

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

function authentication_path(path) {
  switch (path) {
    case '/edit_shop':
      return 2;
      break;
    case '/find_exist_shop':
      return 2;
      break;
    case '/show_shop_details':

      return 2;
      break;
    case '/edit_item':

      return 2;
      break;
    case '/show_item_details':

      return 2;
      break;
    case '/show_item_list_by_shop_owner':

      return 2;
      break;
    case '/show_item_list_by_shop_owner_active':

      return 2;
      break;
    case '/update_doc_by_user':

      return 2;
      break;
    case '/show_doc_by_itemgui_owner':

      return 2;
      break;
    case '/show_search_kw_by_user':

      return 2;
      break;
    case '/show_item_addon_by_user':

      return 2;
      break;
    case '/show_shop_list':

      return 1;
      break;
    case '/approve_item':

      return 1;
      break;
    case '/show_approval_item':

      return 1;
      break;
    case '/register_search_kw':

      return 1;
      break;
    case '/edit_itemaddon':

      return 1;
      break;
    case '/show_item_addon':

      return 1;
      break;
    case '/show_event_ads_list':

      return 1;
      break;
    case '/update_event_ads':

      return 1;
      break;
    case '/init_client':

      return 0;
      break;
    case '/show_doc_by_gui':

      return 0;
      break;
    case 'show_event_ads':
      return 0;
      break;
    case '/count_event_ads':
      return 0;
      break;
    default:
      return 0;
      break;
  }
  return 0;
}

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //var possible = "0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}




app.listen(4000, "0.0.0.0", function () {
  console.log('Example app listening on port 4000!')
});