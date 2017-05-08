function formatDate(dateObj,format)
{
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var curr_date = dateObj.getDate();
    var curr_month = dateObj.getMonth();
    curr_month = curr_month + 1;
    var curr_year = dateObj.getFullYear();
    var curr_min = dateObj.getMinutes();
    var curr_hr= dateObj.getHours();
    var curr_sc= dateObj.getSeconds();
    if(curr_month.toString().length == 1)
    curr_month = '0' + curr_month;      
    if(curr_date.toString().length == 1)
    curr_date = '0' + curr_date;
    if(curr_hr.toString().length == 1)
    curr_hr = '0' + curr_hr;
    if(curr_min.toString().length == 1)
    curr_min = '0' + curr_min;

    if(format ==1)//dd-mm-yyyy
    {
        return curr_date + "-"+curr_month+ "-"+curr_year;       
    }
    else if(format ==2)//yyyy-mm-dd
    {
        return curr_year + "-"+curr_month+ "-"+curr_date;       
    }
    else if(format ==3)//dd/mm/yyyy
    {
        return curr_date + "/"+curr_month+ "/"+curr_year;       
    }
    else if(format ==4)// MM/dd/yyyy HH:mm:ss
    {
        return curr_month+"/"+curr_date +"/"+curr_year+ " "+curr_hr+":"+curr_min+":"+curr_sc;       
    }
    else if(format ==5)// dd/MM/yyyy HH:mm:ss
    {
        return curr_date+"/"+ curr_month+"/"+curr_year+ " "+curr_hr+":"+curr_min+":"+curr_sc;       
    }
}
function saveLocalDB(c)
{
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("client",c);
        return 1;
    }
    else{
        alert("Sorry, your browser does not support Web Storage...");
        return 0;
    }
    return 0;

}
function isJson(str) {
    //console.log("string %s",str);
        try {
                if (angular.isString(str)) {
                JSON.parse(str);
                }
                else if (angular.isObject(str)) {
                //JSON.parse(JSON.stringify(str));
                }
            }
            catch (e) {
                console.log("e %s",e);
            return false;
        }
        return true;
}
function updateClient(client){
    var clientjs = new ClientJS();
    console.log("clientjs %s",clientjs);
    if(client.logintoken!="")
    {
        console.log("login");
        var d=new Date();
        client.logintime=d;     
        client.browserinfo=clientjs.getUserAgent();         
        client.clientjs=clientjs;
        client.isexist=true;
        client.lastaccess=new Date();
        d.setDate(d.getDate()+30);//timeout would be current time + 30days
        client.logintimeout=d;
        //client.ip=y_client.ip;
        client.fingerprint=clientjs.fingerprint;
        //if(client.logintimeout<=d)
            //window.location="/home/"+JSON.stringify(client); //redirect to login page login timeout
    }
    else
    {
        //need to login
        console.log("need login %s",clientjs);
        client.clientjs=clientjs;
        client.isexist=false;
        client.lastaccess=new Date();
        client.fingerprint=clientjs.fingerprint;
        //window.location="/home/"+JSON.stringify(client);
    }
    return client;
}
var fullUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var fullHost=location.hostname+(location.port ? ':'+location.port: '');


var app = angular.module('topup', ['ngWebSocket','ngStorage']);

app.factory('ST', function($http,$localStorage,$sessionStorage) {

    return {
        saveStorage:function (c){
            $localStorage.client=c;
            return 1;
        },
        saveSessionStorage:function (){

        },
        storage:function (){
            if( $localStorage.client==null)
                return $http.get('/newclientinfo').then(function(response) {
                    console.log(response.data);
                    html = response.data;
                    $localStorage.client=html;
                    return html;
                });
            return $localStorage.client;
        }
    };
}).factory('WS', function($websocket,ST) {
                        var ws = $websocket("ws://" + document.location.host +document.location.pathname );
                        var service ={};
                        service.callbacks=[];

                        var res_data={};
                        ws.onMessage(function (event) {
                            //console.log('message: ', event.json);
                            angular.forEach(service.callbacks,function(callback){
                                callback(event);
                            });                            
                        });
                        ws.onError(function (event) {
                            console.log('connection Error', event);
                        });
                        ws.onClose(function (event) {
                            console.log('connection closed', event);
                        });
                        ws.onOpen(function () {
                            //something here ?
                        });

                    return {
                        getData : function (){
                            //console.log("res_data %s",JSON.stringify(res_data));
                            return res_data
                        },
                        init:function(){
                            //console.log("client open %s",JSON.stringify(client));                     
                            ///client=loadLocalDB(client);
                            //redirect to the home page to login or pre-register
                            //console.log("client open %s",JSON.stringify(client));
                            var client =ST.storage();

                            if(isJson(client))
                                //window.location="/home/"+JSON.stringify(client);
                            {
                                var c={
                                    _isstring:true,
                                    json:client,
                                    updatetime:new Date(),
                                    _iserror:false,
                                    _isread:false,
                                    actioncode:"init"
                                    };
                                    ws.send(JSON.stringify(c));
                            }
                            else 
                                throw new Error("onopen socket error");
                        },                        
                        status: function () {
                            return ws.readyState;
                        },
                        send: function (message) {
                            if (angular.isString(message)) {
                                ws.send(message).then(function(data){
                                    console.log("sent return data %s",data);
                                    return data;
                                });
                            }
                            else if (angular.isObject(message)) {
                                ws.send(JSON.stringify(message));
                            }
                        },
                        subscribe:function (callback){
                            service.callbacks.push(callback);
                        }
                    };
                });