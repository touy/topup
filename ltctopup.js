module.exports = function (__secret='',__user='') {
    const uuidV4 = require('uuid/v4');
    const Q=require('q');
    const crypto = require('crypto');
    const ltcScretKeys=__secret;
    const ltcUser=__user;
    module.ltcEncrypt=function (query){
        var deferred=Q.defer();
        var exec = require('child_process').exec;
        var child = exec('java -jar '+__dirname+'/ltc_encrypt.jar '+query+' '+ltcScretKeys,
          function (error, stdout, stderr){
            var newlines=/[\r\n]+/;
            var lines=stdout.split(newlines)
            //console.log(lines[2]);
            if(error !== null){
              console.log("Error -> "+error);
                deferred.reject(error);
            }
            else
                deferred.resolve(lines[2]);
            //ltcDecrypt(lines[2]);
        });
        return deferred.promise;
      }
      module.test=function(text){
          console.log(text);
          return text;
      }
      module.ltcDecrypt=function(query){
        var deferred=Q.defer();
        var exec = require('child_process').exec;
        var child = exec('java -jar '+__dirname+'/ltc_decrypt.jar '+query+' '+ltcScretKeys,
          function (error, stdout, stderr){
            var newlines=/[\r\n]+/;
            var lines=stdout.split(newlines)
            //console.log(lines[2]);
            if(error !== null){
              console.log("Error -> "+error);
                deferred.reject(error);
            }
            else
                deferred.resolve(lines[2]);
            //ltcDecrypt(lines[2]);
        });
        return deferred.promise;
      }
      
      module.topupLTC=function (phone,value){
        var deferred=Q.defer();
        m=validatePhone(phone);
        m1=validateValue(value);
        if(m!="OK"||m1!="OK")
            throw new Error(m+m1);
        const soap = require('soap');
        const url = 'http://ltcservice.laotel.com:6848/Services.asmx?WSDL';
        const type='3';
        const trans_id=cryptoRandomNumber((Number.MAX_SAFE_INTEGER-281474976710655), Number.MAX_SAFE_INTEGER);
        this.ltcEncrypt(phone+value+ltcUser+trans_id).then(function(body){
            const args = {amount:value,msisdn:phone,user_id:ltcUser,trans_id:trans_id,key:body};
            soap.createClient(url, function(err, client) {
                client.Topup(args, function(err, result) {
                    //console.log(result);
                    //var res=[];res.push(result);
                    deferred.resolve(result);
                });
            });
        }).catch(function(err){
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
      }
      module.paymentLTC=function(phone,value){
        var deferred=Q.defer();
        m=validatePhone(phone);
        m1=validateValue(value);
        if(m!="OK"||m1!="OK")
            throw new Error(m+m1);
        const soap = require('soap');
        const url = 'http://ltcservice.laotel.com:6848/Services.asmx?WSDL';
        const type='3';
        const trans_id=cryptoRandomNumber((Number.MAX_SAFE_INTEGER-281474976710655), Number.MAX_SAFE_INTEGER);
        this.ltcEncrypt(type+phone+value+ltcUser+trans_id).then(function(body){
            var args = {type:type,amount:value,msisdn:phone,user_id:ltcUser,trans_id:trans_id,key:body};
            soap.createClient(url, function(err, client) {
                client.Payment(args, function(err, result) {
                    console.log(result);
                    //var res=[];res.push(result);
                    deferred.resolve(result);
                });
            });
        }).catch(function(err){
            console.log(err);
            deferred.reject(err);
        });
        return defered.promise;
      }
      module.sendSMSLTC=function(phone,message,header){
        var deferred=Q.defer();
        m=validatePhone(phone);        
        if(m!="OK")
            throw new Error(m);
        var soap = require('soap');
        var url = 'http://ltcservice.laotel.com:6848/Services.asmx?WSDL';
        var type='3';
        var trans_id=cryptoRandomNumber((Number.MAX_SAFE_INTEGER-281474976710655), Number.MAX_SAFE_INTEGER);
        this.ltcEncrypt(phone+message+ltcUser+header).then(function(body){
            var args = {message:message,header:header,msisdn:phone,user_id:ltcUser,key:body};
            soap.createClient(url, function(err, client) {
                client.SendSMS (args, function(err, result) {
                    //var res=[];res.push(result);
                    deferred.resolve(result);
                    //console.log(result);
                });
            });
        }).catch(function(err){
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
      }
      module.queryDetailsLTC=function(startdate,enddate){
        var deferred=Q.defer();
        if(validateTime(startdate)!="OK"||validateTime(enddate)!=='OK')
            throw new Error('Invalid Time');
        var soap = require('soap');
        var url = 'http://ltcservice.laotel.com:6848/Services.asmx?WSDL';
        var type='3';
        
        this.ltcEncrypt(type+ltcUser).then(function(body){
            var args = {type:type,startDate:startdate,endDate:enddate,user_id:ltcUser,key:body};
            soap.createClient(url, function(err, client) {
                client.queryDetail(args, function(err, result) {
                   // console.log(JSON.stringify( result));
                    //var res=[];res.push(result);
                    deferred.resolve(result);
                });
            });
        }).catch(function(err){
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
      }
    
      module.checkBalanceCenterLTC=function(){
        var deferred=Q.defer();
        var soap = require('soap');
        var url = 'http://ltcservice.laotel.com:6848/Services.asmx?WSDL';
        this.ltcEncrypt(ltcUser).then(function(body){
            var args = {user_id:ltcUser,key:body};
            soap.createClient(url, function(err, client) {
                client.CheckBalanceCenter(args, function(err, result) {
                    //console.log(result);
                   // var res=[];res.push(result);
                    deferred.resolve(result);
                });
            });
        }).catch(function(err){
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
      }
      module.checkBalanceLTC=function(phone){
        var deferred=Q.defer();
        m=validatePhone(phone);
        if(m!="OK")
            throw new Error(m);
        var soap = require('soap');
        var url = 'http://ltcservice.laotel.com:6848/Services.asmx?WSDL';
        var type='3';
        this.ltcEncrypt(type+phone+ltcUser).then(function(body){
            var args = {type:type,msisdn:phone,user_id:ltcUser,key:body};
            soap.createClient(url, function(err, client) {
                client.CheckBalance (args, function(err, result) {
                    //console.log(result);
                    //var res=[];res.push(result);
                    deferred.resolve(result);
                });
            });
        }).catch(function(err){
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    }
    function validateTime(time){
        if((new Date(time)).getTime()<1)
            return "it's not correct time";
        return 'OK';
    }
    function validatePhone(phone){// must be 8 digit, start with 205 , and number
        if(isNaN(phone))
            return "It's not a number";
        if(phone.length>8&&phone.length<8)
            return "length is not well";
        if(phone.indexOf('205')!=0)
            return "it's not LTC number";
        return 'OK';
    }
    function validateValue(value){ //must be positive integer, from 5000 to 500000 and number
        try {
            number=parseInt(value);
        } catch (error) {
            return 'number is not valid';
        }
        if(number<5000&&number>500000)
            return 'value must be lower than 500.001 and higher than 4.999';        
        return 'OK';
    }
    
    
    function cryptoRandomNumber(minimum, maximum){
        
        var distance = maximum-minimum;
        
        if(minimum>=maximum){
            console.log('Minimum number should be less than maximum');
            return false;
        } else if(distance>281474976710655){
            console.log('You can not get all possible random numbers if range is greater than 256^6-1');
            return false;
        } else if(maximum>Number.MAX_SAFE_INTEGER){
            console.log('Maximum number should be safe integer limit');
            return false;
        } else {
            var maxBytes = 6;
            var maxDec = 281474976710656;
            
            // To avoid huge mathematical operations and increase function performance for small ranges, you can uncomment following script
            /*
            if(distance<256){
                maxBytes = 1;
                maxDec = 256;
            } else if(distance<65536){
                maxBytes = 2;
                maxDec = 65536;
            } else if(distance<16777216){
                maxBytes = 3;
                maxDec = 16777216;
            } else if(distance<4294967296){
                maxBytes = 4;
                maxDec = 4294967296;
            } else if(distance<1099511627776){
                maxBytes = 4;
                maxDec = 1099511627776;
            }
            */
            
            var randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
            var result = Math.floor(randbytes/maxDec*(maximum-minimum+1)+minimum);
            
            if(result>maximum){
                result = maximum;
            }
            return result;
        }
    }

    return module;    
}

