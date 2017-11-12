var modArr=[];
modArr.push({"username":0,"luser":1,"ruser":2});
modArr.push({"username":1,"luser":3,"ruser":4});
modArr.push({"username":2,"luser":5,"ruser":6});
modArr.push({"username":3,"luser":7,"ruser":8});
modArr.push({"username":4,"luser":9,"ruser":10});

modArr.push({"username":5,"luser":'',"ruser":''});
modArr.push({"username":6,"luser":13,"ruser":14});
modArr.push({"username":7,"luser":'',"ruser":16});
modArr.push({"username":16,"luser":'',"ruser":''});
var i=0;

function init(){
    modArr[0].index=0;
  var rt=modArr[0];
//   var ex=rt;
  //console.log(ex.l);
  setIndexing(rt);
}
init();
console.log(modArr);
function setIndexing(rt){
    //console.log(++countindexing);
    
    var ul='';
    if(rt.luser)
      ul=setIndexByUsername(rt.luser,rt.index*2+1);
    
      var ur='';
    if(rt.ruser)
      ur=setIndexByUsername(rt.ruser,rt.index*2+2);
    
    if(ul)
      setIndexing(ul);
    
    if(ur)
      setIndexing(ur);
    //return;
  }
  function setIndexByUsername(username,i){
    //console.log(username+" "+i);
    var user='';
    //if(username)
    for(var index=0;index<modArr.length;index++){
      if(modArr[index].username==username){
        modArr[index].index=i;
        user=modArr[index];
        //updateIndexing(user);
      }
    }
    return user;
  }