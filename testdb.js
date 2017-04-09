//var nano = require('nano')('http://admin:admin@localhost:5984');
var errors=require("./errors");
//var couchdbIterator = require('couchdb-iterator');
//var adapter = require("couch_adapter");
// nano.db.create("test",function(err){
//         if(err){
//         //console.error(err);
//         }
//         else console.log("created %s","test");
//       });
// var couchdb=require("./couchdb_lib")({db:"test",url:'http://localhost:5984',user:"admin",pass:"admin"});
// console.log(couchdb.create(
//     {  "test": "test",
//   "name": "test",
//   "id": "12345"}));
//console.log(couchdb.read_and_paging(2,10));

// var dbtest=nano.db.use("test");
// couchdbIterator(dbtest, (row, index) => {
//     console.log("index:"+index, "id:"+row.id, "key:"+row.key, "value:"+row.value);
//     // Do something with `row`; you may return a promise here 
// }).then((rowsCount) => {
//     console.log(`Iteration completed! ${rowsCount}`);
// }, (err) => {
//     console.log('Iteration failed', err);
// });
var cradle = require('cradle');
var cdb=new(cradle.Connection)('http://localhost', 5984,{user:"admin",pass:"admin"}/*, {
      cache: true,
      raw: false,
      forceSave: true,
      request: {
        //Pass through configuration to `request` library for all requests on this connection.
      }
  }*/);


 var db=cdb.database("test");
db.exists(function (err, exists) {
    if (err) {
      console.log('error', err);
    } else if (exists) {
      console.log(exists);
    } else {
      console.log('database does not exists.');
      db.create();
      /* populate design documents */
    }
  });

 db.save({
      name: 'darth', id: 'dark',time:new Date()
  }, function (err, res) {
      console.log("new ");
  });

db.get(['e944a49538f3e16bf86c8f5aa0032370','e944a49538f3e16bf86c8f5aa0004eda'], function (err, doc) {
      console.log("get");
  });

// db.save('_design/test4', {
//     "_id":"_design/test4",
//     "views":{
//         testFind: {
//           map: function (doc) {
//               if (doc.name) emit(doc.name, doc);
//           }
//       }
//     }
//   });

db.view('test/',{key:"03"},function(error,docs){
    if (error) {
    console.log(error);
    return;
  }
  console.log(docs);
});
