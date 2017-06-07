
// packages.js
// ========
module.exports=function (uuidV4,nano,WS,db_name,design_view){
var __uuidV4 = uuidV4;
var __WS=WS;
var __nano = nano;
var __dbname=db_name;
var __designview=design_view;
var __glob=require("./client");
var __resp={};
//response for WS

// JSON.stringify({
//           _isstring:true,
//                 json:{data:"wrong json format: userdata"},
//                 updatetime:new Date(),
//                 _iserror:false,
//                 _isread:false,
//                 actioncode:"error"
//         });
module._init=function(){
  __resp=__glob._json(false);
  return this;
}
module._json=function(){
    return {
    usergui:"",
    username:"",
    Lscore:0,
    Rscore:0,
    createddate:new Date(),
    gui:uuidV4()
    };
}
module.create_db=function(dbname){
    var db;
    nano.db.create(dbname, function(err,body) {
        // specify the database we are going to use    
        if (!err) {
            console.log('database '+dbname+' created!');
        }
        else
            console.log(dbname+" :"+err);   
    });
    db = nano.use(dbname);
    return db;
};
module._test=function(){
  //var CS="ok";
  var p_array={};
  var p1=this._json;
 
  var p2=p1;
  //p2.username="u2";
  p2.createddate=new Date();
  this._add(p1);
  this._add(p2);
  // package_add(p3);

  //var WS=__WS;
  //package_changes(0,2,WS);

  var count=this._count(__WS);
  var p=10;

  this._list(0,1,__WS,0);

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

module._count=function(){
  var db=this.create_db(db_name);
  var count=0;
  db.view(__designview,"findCount",function(error,result){
    //console.log("count: "+result);
    if(result!=null){
      if(result.rows[0]!=null)
        count=result.rows[0].value;
      console.log("%s count1 %s",__dbname,count);
      }
      else 
        console.log("%s error %s",__dbname, error);
      console.log("%s count2 %s",__dbname,count);
  });
  console.log("%s count3 %s",__dbname,count);
},

module._list=function( page, maxPerPage,isdetails){
  var db=this.create_db(db_name);
  var p_array=[];
  db.view(__designview,"findAll",{
      descending: true,
       //include_docs: true,
      limit: maxPerPage,
      skip: page * maxPerPage
    },function(error,result){
    if(!error){
        var max_row=result.total_rows;
        var off_set=result.offset;
             
        p_array=[];

        result.rows.forEach( function(element, index) {
          
          var doc=element.value;
          var _rev=doc._rev;
          var _id=doc._id;
          var id=doc.id;
          if(isdetails==1){
            delete doc.id;
            delete doc._id;
            delete doc._rev;
            }
          console.log("--%s",doc.username);
        //   if(doc.username!="")
        //     db.destroy(doc.username,doc._rev,function(error,result){
        //       if(error)
        //         console.log("%s",JSON.stringify(error));
        //     });
            //this._add(doc);
            //p_array.push(doc);
            
            //TEST ONLY

            // doc.packagename="P updated : "+(new Date());
            module._ed(doc);
        });
        return p_array;
        // console.log("TEST ADD");
        // console.log(JSON.stringify(p_array));  
        // WS.send(JSON.stringify({
        //   _isstring:false,
        //         json:p_array,
        //         updatetime:new Date(),
        //         _iserror:true,
        //         _isread:false,
        //         actioncode:"packagedetails"
        // }));
      }
      else 
        console.log(" error %s %s",__dbname, error);
  });
},
module._add=function(p){
  
  var db=this.create_db(db_name);
  db.view(__designview,"findExist",{
      key: p.gui     
    },function(error,result){
    if(result!=null){
          if(result.rows[0]==null){            
            db.insert(p,p.gui,function(err,res){
                if (!err){
                    console.log("add %s doc successfully! ",__dbname);        
                }
                else 
                  console.log("%s %s -",__dbname,err);
                });
            }
            else
              console.log("add %s failed, exist! %s",__dbname,p);        
    }
    else {
      console.log("exist %s %s-",__dbname,error);
    }
  }); 
},
module._ed=function(p){
  var db=this.create_db(db_name);
  if(p.gui!=null){
    db.view(__designview,"findByUsername",{
      key: p.gui,
      include_docs: true
    },function(error,result){
      if(result.rows[0]!=null){
        p._rev=result.rows[0].doc._rev;        
        db.insert(p,p.gui,function(err,res){
          if (!err){
            console.log("%s update successfully uid:%s",__dbname,p);
          }
          else 
            console.log("update error %s  %s-",__dbname,err);
        });
      }
      else {
        console.log("%s not exist %s -",__dbname,error);
      }
      }); 
  }  
  },

module._del=function(p){
  var db=this.create_db(db_name);
  db.view(__designview,"findByUsername",{
      key: p.gui,
      include_docs: true
    },function(error,result){      
    if(result.rows[0]!=null){
      
      p=result.rows[0].doc;
      p._delete=true;
      p._rev=result.rows[0].doc._rev;
      db.destroy(p.gui,p._rev,function(error,result){
      if (!error){
          console.log("delete %s doc successfully! : %s",__dbname,p);        
      }
      });

      // db.insert(p,p.packagegui,function(error,result){
      // if (!error){
      //     console.log("delete package doc successfully! : %s",p.packagegui);        
      // }
      // });
    }
    else {
      console.log("%s delete error",__dbname);
    }
  });
},


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

// package details
// function package_details( page, maxPerPage,WS){
//   var db=create_db(db_name);
//   var p_array=[];
//   db.view(__designview,"findAll",{
//       descending: true,
//        //include_docs: true,
//       limit: maxPerPage,
//       skip: page * maxPerPage
//     },function(error,result){
//     if(!error){
//         var max_row=result.total_rows;
//         var off_set=result.offset;
//         result.rows.forEach( function(element, index) {
//           var doc=element.value;
//           var _rev=doc._rev;
//           var _id=doc._id;
//           var id=doc.id;          
//           p_array.push(doc);
         
//          //TEST ONLY

//          // doc.packagename="P updated : "+(new Date());
//          // package_ed(doc);
//         });
//         // console.log("TEST ADD");
//         // console.log(JSON.stringify(p_array));  
//         WS.send(JSON.stringify({
//           _isstring:false,
//                 json:p_array,
//                 updatetime:new Date(),
//                 _iserror:true,
//                 _isread:false,
//                 actioncode:"packagedetails"
//         }));
//       }
//       else 
//         console.log("Pakcage_list error %s", error);
//   });
// }

