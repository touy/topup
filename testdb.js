
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