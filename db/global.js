
module.exports=function(){
    var __init="OK";
module._json=function(isString){
    if(isString)
        return JSON.stringify({
          _isstring:true,
                json:{data:"wrong json format: userdata"},
                updatetime:new Date(),
                _iserror:false,
                _isread:false,
                actioncode:"error"
        });
    else
        return {
          _isstring:false,
                json:{data:"wrong json format: userdata"},
                updatetime:new Date(),
                _iserror:false,
                _isread:false,
                actioncode:"error"
         };
};
module._submit=function(WS,resp){
    try{
        WS.send(JSON.stringify(JSON.parse(resp)));
    }
    catch(error){
        WS.send(resp);
    }   
};
return module;
}