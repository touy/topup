var ltc=require("./ltctopup")();
//console.log(ltc.test('test'));

ltc.checkBalanceCenterLTC();

// ltc.topupLTC('2055899974',5000);
// ltc.checkBalanceLTC('2054445447');
// ltc.sendSMSLTC('2059918880','top up 2055899974 OK 5000','header OK');
// ltc.sendSMSLTC('2055899974','top up 2055899974 OK 5000','header OK');

// ltc.paymentLTC('2058538459',5000);
// ltc.checkBalanceLTC('2058538459');
// ltc.sendSMSLTC('2059918880','payment 2058538459 OK','header OK');
// ltc.sendSMSLTC('2058538459','payment 2058538459 OK','header OK');


// ltc.checkBalanceCenterLTC();

var sd=new Date();
sd=sd.getTime()-(2*60*60*1000);
var ed=new Date();
ltc.queryDetailsLTC(new Date(sd).toISOString(),ed.toISOString());
ltc.checkBalanceLTC('2056706660');