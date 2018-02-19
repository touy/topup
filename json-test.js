
balance = {
    arr: [
        {
        "username": "",
        "usergui": "",
        "gui": "737a6460-7d4d-430d-b7d5-77dd6e100486",
        "balance": 0,
        "updated": "2018-02-12T10:22:21+07:00",
        "diffbalance": 0,
        "type": "topup first balance"
      },
      {
        "username": "",
        "usergui": "",
        "gui": "737a6460-7d4d-430d-b7d5-77dd6e100486",
        "balance": 0,
        "updated": "2018-02-12T10:22:21+07:00",
        "diffbalance": 0,
        "type": "topup first balance"
      }
    ],
    count: 100
  };

client={
    "username": "",
    "logintoken": "",
    "logintime": null,
    "logintimeout": null,
    "registeruid": null,
    "confirmregisteruid": null,
    "browserinfo": "",
    "ip": "",
    "other": "",
    "lastaccess": null,
    "isexist": false,
    "clientjs": "",
    "fingerprint": "",
    
    "data": {
      "user": {},
      "balance": {},
      "couplingscore": {},
      "package": {},
      "packagedetails": {},
      "payment": {},
      "userbinary": {},
      "message": ""
    },
    
    "gui": "9335a43d-94b3-4b0e-96c7-39042f630db5",
    //"_property_name": "client"
  }
  client.data.message;
  client.data.user.username='MrA';
  client.data.user.password='123456';

      $('#uploadImage').submit(function(e){
        e.preventDefault();
        
        var title = $('#title').val(); 
        
        $(this).ajaxSubmit({
          data: {title: title},
          contentType: 'application/json',
          success: function(response){
            console.log('image uploaded and form submitted');     
            c=response;
            console.log(c.data.file);
            alert(c.data.file);
          }, 
          error:function(err){
            console.log(err);
            alert(err);
          }
      });
    return false;
});

  $('#firstname').val(client.data.user.username);
  $('#lastname').val('Filemon');
  $('#address_street').val('Rua del Percebe 13');
  $('#address_city').val('Madrid');
  $('#address_zip').val('28010');
  $("[name='emails[0]']").val('superintendencia@cia.es')



  client.oldpassword='';
  return client.data.balance=undefined


  
  send(client);