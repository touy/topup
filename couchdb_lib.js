module.exports = function(p) { 


// NEED TO CREAT IT FIRST
// use it and assign here 
//var docDB=null;
var adapter = require("couch_adapter")({db:p.db,url:p.url,user:p.user,pass:p.pass});
var errors=require("./errors");
//console.log(p);

// var db=nano.db.create("test",function(err){
//         if(err){
//         //console.error(err);
//         }
//         else console.log("created %s","test");
//       });
// nano.db.use("test");
return {
	create:function(doc){
		var r="";
		adapter.create(doc).then((result) => {			
	        r= result;
	    })
		return r;
	},

	read_by_id:function (id){
		var r="";
		adapter.read(id).then((result) => {
			//console.log(result);
	        r=result;
	    })
		return r;
	},
	read_and_paging:function(skip,limit){		
		var r="";
		adapter.readBulk(skip, limit).then((result) => {
			console.log(result);	        
			r=result;
	    })
		return r;
	},
	search_and_paging:function(skip,limit,kw){		
		var r="";
		adapter.readBulk(skip, limit).then((result) => {
			//console.log(result);
	        r= result;
	    })
		return r;
	},
	update:function (doc){
		var r="";
		adapter.update(updatedb).then((result) => {
			//console.log(result);
	        r= result;
	    })
		return r;
	},
	 // all
	 getList:function (docdb){
	 	var docDB=docdb;
	 	docDB.list(function (err, body) {
		  if (err) {
		    console.log(err);
		  } else {
		    console.log(body.rows);
		  }
		})
	 },
	 searchUser:function (docdb,kw,cb){
	 	var docDB=docdb;
	 	docDB.view(
	    'by_name', 'by_name', {keys: [kw], include_docs: true},
	    errors.wrapNano(function(err, result) {
	      if (err) {
	        cb(err);
	      }
	      else {
	        result = result.rows.map(function(row) {
	          return row.doc;
	        });
	        cb(null, result);
	      }
	    })
	  );
	 }
	}
};