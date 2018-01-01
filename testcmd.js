//var ltc=require("./ltctopup")('kP0SwtIzUA1pLBwsnZz3VA==','THEFRIEND');
var ltc = require("./ltcservice")('ea9uZEit0E7sXPeYoCJZDZWZVT+o10ZthvuldL8cJtQ=', 'ITCENTER',5000);
//var ltc = require("./ltcservice")('kP0SwtIzUA1pLBwsnZz3VA==', 'THEFRIEND',5000);
// ltc.testDirectTopup('2056706660',5000).then(res=>{
//     console.log(res.TopupResult.resultCode);
// }).catch((err)=>{
//     console.log(JSON.stringify(err));
// });

ltc.directTopup('2056706660',5000).then(res=>{
    console.log("topup result");
    console.log(res);
}).catch((err)=>{
    console.log(JSON.stringify(err));
});

// ltc.checkCenterBalance().then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(JSON.stringify(err));
// });
// ltc.checkPhoneBalance('2055280960','IMEI','TEST').then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(JSON.stringify(err));
// });
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

// var product={
//     pid='',
//     pname='',
//     pvalue=0,
//     pamount=0
// };

// var stock=[
//     {   pid='1',
//         pname='p1',
//         pvalue = 2000,
//         pamount = 200//-100 , 100
//     },
//     {   pid='2',
//         pname='p2',
//         pvalue = 1000,
//         pamount = 100//-50 , 50
//     }
// ];

// var cart=[
//     orderid='',
//     cart='',
//     username='',
//     shopname='',
//     sale='',
//     createdate='',
//     totalvalue=0,
//     products=
//     []   
// ];
