//var ltc=require("./ltctopup")('kP0SwtIzUA1pLBwsnZz3VA==','THEFRIEND');
var ltc = require("./ltcservice")('ea9uZEit0E7sXPeYoCJZDZWZVT+o10ZthvuldL8cJtQ=', 'ITCENTER',5000);
//var ltc = require("./ltcservice")('kP0SwtIzUA1pLBwsnZz3VA==', 'THEFRIEND');
ltc.checkCenterBalance().then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(JSON.stringify(err));
});
ltc.checkPhoneBalance('2059894463','IMEI','TEST').then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(JSON.stringify(err));
});
var moment = require('moment');
function convertTZ(fromTZ) {
    return moment.tz(fromTZ, "Asia/Vientiane").format();
}
var starttime=convertTZ(moment().subtract(1, 'days'));
var endtime='';
var page=0;
var maxpage=10;
ltc.viewCenterBalance(starttime,endtime,page,maxpage).then((res)=>{
    //console.log(JSON.stringify(res));
}).catch((err)=>{
    console.log(JSON.stringify(err));
});