var ltc=require("./ltctopup")('kP0SwtIzUA1pLBwsnZz3VA==','THEFRIEND');
//console.log(ltc.test('test'));

ltc.checkBalanceCenterLTC();

// // ltc.topupLTC('2055899974',5000);
// // ltc.checkBalanceLTC('2054445447');
// // ltc.sendSMSLTC('2059918880','top up 2055899974 OK 5000','header OK');
// // ltc.sendSMSLTC('2055899974','top up 2055899974 OK 5000','header OK');

// // ltc.paymentLTC('2058538459',5000);
// // ltc.checkBalanceLTC('2058538459');
// // ltc.sendSMSLTC('2059918880','payment 2058538459 OK','header OK');
// // ltc.sendSMSLTC('2058538459','payment 2058538459 OK','header OK');


// // ltc.checkBalanceCenterLTC();

// var sd=new Date();
// sd=sd.getTime()-(2*60*60*1000);
// var ed=new Date();
// ltc.queryDetailsLTC(new Date(sd).toISOString(),ed.toISOString());
// ltc.checkBalanceLTC('2055051574');
// ltc.checkBalanceLTC('2059028957');
// ltc.checkBalanceLTC('2055280995');
// ltc.checkBalanceLTC('2055281004');
// ltc.checkBalanceLTC('2055281087');
// ltc.checkBalanceLTC('2055280960');
// ltc.checkBalanceLTC('2055280971');
// ltc.checkBalanceLTC('2055280962');
var phone='2055051550';
var topupvalue=5000;
var target='IMEI';
var owner='owner';
ltc.checkBalanceCenterLTC().then((res)=>{    
    console.log(res);    
    if(res.CheckBalanceCenterResult.resultCode=='20'){
        var b={
            lastbalance:res.CheckBalanceCenterResult.balance,
            updatetime:new Date(),
            target:target,
            owner:owner,
            phone:phone,
            value:topupvalue
        }
        //save to db
        if(b.lastbalance>topupvalue){
            ltc.checkBalanceLTC(phone).then((res)=>{
                console.log(res); 
                try {
                    if(res.CheckBalanceResult.resultCode=='20'){
                        // save to database
                        var b={
                            phone:phone,
                            balance:res.CheckBalanceResult.balance,
                            updatetime:new Date(),
                            target:target,
                            owner:owner
                        };
                        
                        //check if it's not online for long time( broken) then ignore
                        // check if balance is more than 10.000 and last topup is more than 1 month
                        var lastonline=3;
                        var lasttopup=2;
                        if(b.balance<5001||b.balance>5000&&lasttopup>1&&lastonline<4){
                            //topoup
                            var b={
                                phone:phone,
                                balance:res.CheckBalanceResult.balance,
                                updatetime:new Date(),
                                target:target,
                                owner:owner,
                                topup:true,
                            };
                            //save to database
                            
                        ltc.topupLTC(phone,topupvalue).then((res)=>{
                            ltc.checkBalanceLTC(phone).then((res)=>{
                                try {
                                    if(res.CheckBalanceResult.resultCode=='20'){
                                        // save to database
                                        var b={
                                            phone:phone,
                                            balance:res.CheckBalanceResult.balance,
                                            updatetime:new Date(),
                                            target:target,
                                            owner:owner
                                        };
                                    }
                                }
                                catch(error){
    
                                }
                            });
                        }).catch((err)=>{
                        
                        });
                            
                        }else{
                            var b={
                                phone:phone,
                                balance:res.CheckBalanceResult.balance,
                                updatetime:new Date(),
                                target:target,
                                owner:owner
                            };
                        }

                    }else{
                        throw new Error(res);
                    }   
                } catch (error) {
                    var b={
                        phone:phone,
                        error:error,
                        updatetime:new Date(),
                        target:'IMEI',
                        owner:'owner',
                        lastretry:new Date(),
                        isdone:false,
                        needretry:true,
                    };
                    //queur retry
                    console.log(error);
                }
            }).catch((err)=>{
                var b={
                    phone:phone,
                    error:err,
                    updatetime:new Date(),
                    target:'IMEI',
                    owner:'owner',
                    lastretry:new Date(),
                    isdone:false
                };
                //queur retry
                console.log(err);
            });
        }
        else{
            var b={
                phone:phone,
                error:err,
                updatetime:new Date(),
                target:'IMEI',
                owner:'owner',
                lastretry:new Date(),
                isdone:false
            };
            throw new Error('not enough balance');
        }
    }

}).catch((err)=>{
    var b={
        phone:phone,
        error:err,
        updatetime:new Date(),
        target:'IMEI',
        owner:'owner',
        lastretry:new Date(),
        isdone:false
    };
    console.log(err);
});


// // ltc.topupLTC('2055899974',5000).then((res)=>{

// }).catch((err)=>{
    
//     });


// // ltc.paymentLTC('2058538459',5000).then((res)=>{

// }).catch((err)=>{
    
//     });

// // ltc.sendSMSLTC('2055899974','top up 2055899974 OK 5000','header OK').then((res)=>{

// }).catch((err)=>{
    
//     });

//generate number

// var os = require("os");

// console.log(os.cpus());


// var arr=[];
// var m=1000000;
// for(i=0;i<m;i++){
//   arr.push({value:i});
// }
// _foreach();
// _for();
// _foreach();
// _for();


// // FOREACH LOOP
// function _foreach(){
//     sd=new Date();
//     console.log('start FOREACH loop'+sd.getTime());
//     arr.forEach(function(e){
//       if(e.value==arr[m-1].value){
//         ed= new Date();
//         sum=ed.getTime()-sd;
//         console.log(e.value+'end FOREACH loop'+ed.getTime());   
//         console.log('total time'+sum);
//       }
//     });
    
// }
// function _for(){
//     // FOR LOOP
//     sd=new Date();
//     console.log('start FOR loop'+sd.getTime());
//     for(i=0;i<arr.length;i++){
//     if(arr[i].value==arr[m-1].value){
//         ed= new Date();
//         sum=ed.getTime()-sd;
//         console.log(arr[i].value+'end FOR loop'+ed.getTime());   
//         console.log('total time'+sum);
//     }
//     }
// }


