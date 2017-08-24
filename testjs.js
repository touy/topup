//String str = "@@Q25,353358017784062,A10*"; 
// int b = 0; 
// for (char c: str.toCharArray()) { 
// b += (int)c; 
// } 
// b %= 256; 
// String checksum = Integer.toHexString(b); 
// System.out.println(checksum); 
function checksum(str,tohex){
    var b=0;
    var arr=str.split(''); 
    for (i=0;i<arr.length;i++) { 
        b += arr[i].charCodeAt(0); 
    } 
    b %= 256;
    if(tohex)
        return b.toString(16); 
    return b;
}
function process_current_user_balance(){
    
    // _all_d.packagedetails_db=packagedetails_db;
    // _all_d.package_db=package_db;
    // _all_d.balances_db=balances_db;
    // _all_d.payment_db=payment_db;
    // _all_d.userdata_db=userdata_db;
    // _all_d.client_db=client_db;
    var p=_all_d.data.package;
    var register_package_value=0;
    try {
        _all_d.packagedetails_db._findADetail(p,function (error,result){
        if(!error){
            if(result.rows[0]==null){            
                var p_d=result.rows[0];
                if(p_d.userui==_all_d.data.userdata.userui && p_d.isactive){
                    
                }
                else throw  new Error("package or package details problem"+JSON.stringify(p_d));
            }
            else throw  new Error("result problem on find a details");
        }
        else throw  new Error("error on find a details");
        });
    } catch (error) {
        console.log(error);
    }
}
function process_pay_coupling(){

}
function process_pay_new_user(){

}
function process_pay_company(){

}
function process_store_ads_credit(){

}

function process_introductor(ex,rex){
    
    if(ex){
        resp__handler(_all_d.packagedetails_db,"can't find current user's package",{data:("%s error",_all_d.packagedetails_db.__dbname)}); 
    }
    else{
    var p_c=rex.rows[0];
    // check seletected package
    switch(p_c.packagevalue){
        case 1750000:
        switch (_all_d.data.package.packagevalue){
            case 1750000:{
            // no bonus
            
            // check current user balance
            
            // 250.000 introduction

            // 100.000 coupling
            
            // 1750000 daily max payment
            
            // 125.000 top-up new user added
            
            // 75.000 top-up to company
            
            // 60 post on online-store

            // calculate bonus per package and binary, level    

            // process coupling
            
            // process couplingscore
                
            // process balance
            
            // process payment
        }
        case 350000:{
            // no bonus
            // 50.000 introduction
            // 20.000 coupling
            // 350.000 daily max payment
            // 25.000 top-up new user added
            // 75.000 top-up to company
            // 15 post on online-store

            // calculate bonus per package and binary, level    
        
            // process coupling
            
            // process couplingscore
                
            // process balance
            
            // process payment

        }
        case 100000:{
            // no bonus
            // 40.000 introduction
            // 0 coupling
            // 0 daily max payment
            // 25.000 top-up new user added
            // 35.000 top-up to company
            // 0 post on online-store

            // calculate bonus per package and binary, level    
        
            // process coupling
            
            // process couplingscore
                
            // process balance
            
            // process payment
            
        }  
        }
        
        ;
        case 350000:
        switch (_all_d.data.package.packagevalue) {
            case 1750000 :{
            // no bonus
            // 200.000 introduction
            // 100.000 coupling
            // 1750000 daily max payment
            // 125.000 top-up new user added
            // 75.000 top-up to company
            // 60 post on online-store

            // calculate bonus per package and binary, level    
            
            // process coupling
                
            // process couplingscore
                    
            // process balance
                
            // process payment
            }
            case 350000 :{
            // no bonus
            // 40.000 introduction
            // 20.000 coupling
            // 350.000 daily max payment
            // 25.000 top-up new user added
            // 75.000 top-up to company
            // 15 post on online-store

                // calculate bonus per package and binary, level    
            
                // process coupling
                
                // process couplingscore
                    
                // process balance
                
                // process payment
            }
            case 100000:{
            // no bonus
            // 40.000 introduction
            // 0 coupling
            // 0 daily max payment
            // 25.000 top-up new user added
            // 35.000 top-up to company
            // 0 post on online-store

            // calculate bonus per package and binary, level    
            
            // process coupling
            
            // process couplingscore
                
            // process balance
            
            // process payment
            }
        };
        case 100000:
        // no bonus
        // no introduction
        // no coupling
        // no daily max payment
        // top-up new user added
        // no post on online-store

        
        // calculate bonus per package and binary, level    
        
        // process coupling
        
        // process couplingscore
            
        // process balance
        
        // process payment
        ;
    }

    }
}

function add_new_member(){
    //uin : user as a introductor
    // parent_u: user as a parent of a new user
    // d : as a data
    
    _all_d.userbinary_db._add(_all_d.data,_all_d.data.username,function(e,r){
        if(e){
            resp__handler(_all_d.userbinary_db,"error",{data:("%s error",_all_d.userbinary_db.__dbname)}); 
        }
        else{
        // insert userdata and package to package details 
        var packagedetails={
            userui:_all_d.data.userdata.username,
            packageui:_all_d.data.package.gui,
            registerdate:Date(),
            isactive:true,
            notactivedate:true    
            };
        // process packagedetails
        _all_d.packagedetails_db._add(packagedetails);
        var package={
            gui:uuidV4(),
            packagename:"P1",
            packagevalue:"",
            isactive:true,
            createddate:new Date(), 
            relationvalue:"",
            bonusbalance:0, // new member get instantly balance after register
            introductionscore:0, // only the introductor got balance instantly after got a new member
            memberscorebonus:0, // all upline members got score but not yet the balance till coupling happen.
            maxpaidperday:0
        };
        // check current introductor user's package 
        _all_d.packagedetails_db._exist({usergui:_all_d.uin.username},process_introductor);
            
        }
    });
}                                                                