
// packages.js
// ========

module.exports=function (uuidV4,nano,WS,db_name,design_view){
var __doc={
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
var __uuidV4 = uuidV4;
var __WS=WS;
var __nano = nano;
var __dbname=db_name;
var __designview=design_view;
var __glob=require("./global")();
var __resp={};
var __design={
  "_id": "_design/objectList",
  "views": {
    "findAll": {
      "map": "function (doc) {\n  emit(null,doc);\n}"
    },
    "findCount": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(null);\n}"
    },
    "findExist": {
      "reduce": "_count",
      "map": "function (doc) {\n  emit(doc.packagename,1);\n}"
    },
    "findByGUI": {
      "map": "function (doc) {\n  emit(doc.gui, 1);\n}"
    }
  },
  "language": "javascript"
};
function handle_result(error,result){
   if(!error){
            if(result.rows[0]==null){                        
              __resp.actioncode="not exist";
              __resp.updatedtime=new Date();
              __resp.json={data:("%s not exist",__dbname)};
              __glob.submit(__WS,__resp);
          }
            else{
              __resp.actioncode="exist";
              __resp.updatedtime=new Date();
              __resp.json={data:result.rows[0]};
              __glob.submit(__WS,__resp);
            }
      }
      else {
        __resp.actioncode="error";
        __resp.updatedtime=new Date();
        __resp.json={data:("%s error",error)};
        __glob.submit(__WS,__resp);
      }
}
function handle_list(error,result){
    if(!error){
        var max_row=result.total_rows;
        var off_set=result.offset;         
        p_array=[];
        result.rows.forEach( function(element, index) {
          var doc=element.value;
          var _rev=doc._rev;
          var _id=doc._id;
          var id=doc.id;
          if(isdetails=1){
            delete doc.id;
            delete doc._id;
            delete doc._rev;
          }
          p_array.push(doc);
        });
        __resp.actioncode="success";
        __resp.updatedtime=new Date();
        __resp.json={data:p_array};
        __glob.submit(__WS,__resp);
      }
      else{
        __resp.actioncode="error";
        __resp.updatedtime=new Date();
        __resp.json={data:("error %s",JSON.stringify(error))};
        __glob.submit(__WS,__resp);
      } 
  }
function handle_edit(error,result){
  
    if(!error){
          if(result.rows[0]==null){            
            db.insert(p,p.gui,function(err,res){
                if(!err){                       
                      __resp.actioncode="success";
                      __resp.updatedtime=new Date();
                      __resp.json={data:("%s edit successfully",__dbname)};
                      __glob.submit(__WS,__resp);
                }
                else {
                  __resp.actioncode="error";
                  __resp.updatedtime=new Date();
                  __resp.json={data:("%s error",err)};
                  __glob.submit(__WS,__resp);
                }
              });
            }
            else{
              __resp.actioncode="error";
              __resp.updatedtime=new Date();
              __resp.json={data:("add %s failed, exist! %s",__dbname,err)};
              __glob.submit(__WS,__resp);
            }              
    }
    else {
      __resp.actioncode="error";
      __resp.updatedtime=new Date();
      __resp.json={data:("add %s failed, exist! %s",__dbname,error)};
      __glob.submit(__WS,__resp);
    }
}

function handle_delete(error,result){
  if(result.rows[0]!=null){
      p=result.rows[0].doc;
      p._delete=true;
      //p._rev=result.rows[0].doc._rev;
      if(p.id.indexOf("_design")==-1){
        db.destroy(p.gui,p._rev,edit_handler(err,res));
      }
    }
    else {
      console.log("%s delete error",__dbname);
    }
}
module._init=function(){
  //console.log("%s",__glob);
  __resp=__glob._json();
  
  var db=this.create_db(__dbname);
  //this._delA();
  db.insert(__design,handle_edit);
  return this;
}

module._json=function (){
  return __doc; 
}
module.create_db=function(dbname){
    var db;
    nano.db.create(dbname, function(err,body) {
        // specify the database we are going to use    
        if (!err) {
          console.log('database '+dbname+' created!');
        }
        else{
          console.log(dbname+" :"+err);
        } 
    });
    db = nano.use(dbname);
    return db;
};
module._test=function(){
  //var CS="ok";
  var p_array={};
  var id_1=uuidV4();
  var id_2=uuidV4();
  var p1=this._json();
  var p2=this._json();
  var p3=this._json();
  //this._add(p1);
  //this._add(p2);
  //this._add(p3);

  var WS=__WS;
  //package_changes(0,2,WS);

  var count=this._count(__WS);
  var p=10;

  this._list(0,2,__WS,0);

},

//package_changes(0,2WS);

module._changes=function(page, maxPerPage){
  var db=this.create_db(__dbname);
  db.changes(__dbname,/*{
      descending: false,
      include_docs: true,
      limit: maxPerPage,
      skip: page * maxPerPage
    },*/function(err, body) {
      if (!err) {
        console.log("changes:"+JSON.stringify(body));                

      }      
  });
},

module._exist=function(p,cb){
  var db=this.create_db(__dbname);
  if(cb){
    db.view(__designview,"findExist",{
        key: [p.packagename]      
      },cb);
  }
  else{
    db.view(__designview,"findExist",{
        key: [p.packagename]      
      },handle_result);
  }
}

module._count=function(cb){
  var db=this.create_db(__dbname);
  var count=0;
  if(cb){
    db.view(__designview,"findCount",cb);
  }
  else{
    db.view(__designview,"findCount",handle_result);
  }
  return 0;
},
module._list=function( page, maxPerPage,isdetails){
  var db=this.create_db(__dbname);
  var p_array=[];
  db.view(__designview,"findAll",{
      descending: true,
       //include_docs: true,
      limit: maxPerPage,
      skip: page * maxPerPage
  },handle_list);
},
module._add=function(p,cb){
  
  var db=this.create_db(__dbname);
  if(cb){
    db.view(__designview,"findExist",{
    key:[p.packagename]},cb);
  }
  else
  db.view(__designview,"findExist",{
      key: [p.packagename]      
    },edit_handler); 
}
module._ed=function(p,cb){
  var db=this.create_db(__dbname);
  if(p.gui!=null){
    if(cb){
      db.view(__designview,"findByGUI",{
        key:p.gui,
        include_docs:true
      },cb);
    }
    else
    db.view(__designview,"findByGUI",{
      key: p.gui,
      include_docs: true
    },edit_handler); 
  }  
}
module._delA=function(p,cb){
  var db=this.create_db(__dbname);
  if(cb){
    db.list(cb);
  }
  else
  db.list(function(error, result) {
    if (!error) {
      result.rows.forEach(function(p) {
        //console.log("here %s",p.id);
        if(p.id.indexOf("_design")==-1/*&&p.id.indexOf("")*/){
          db.destroy(p.gui,p.packagename,edit_handler);
      }
    });
    }
  });
}
module._del=function(p,cb){
  var db=this.create_db(__dbname);
  if(cb){
    db.view(__designview,"findByGUI",{key:p.gui,include_docs:true},cb);
  }
  else
  db.view(__designview,"findByGUI",{
      key: p.gui,
      include_docs: true
    },handle_delete);
}

module._validate=function(p){
  var pe={
        "packagegui": "05cdd8bd-318e-4d5a-88fb-71d6b3c98b94",
        "packagename": "P2",
        "packagevalue": "",
        "isactive": "",
        "createddate": "2017-05-24T05:33:20.913Z",
        "relationvalue": "",
        "bonusbalance": 0,
        "introductionscore": 0,
        "memberscorebonus": 0
      };
      // COMPARE p to pe 
      
      return 0;
    };
return module;
}
