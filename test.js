
var checksum = 0; 
var str="@@W28,369800013220020,CCC,18";
//console.log(27+18/10);
for(var i = 0; i < str.length; i++) { 
  checksum = checksum ^ str.charCodeAt(i); 
}
console.log(checksum);

var command="@@";
flag="W";
position=18;
imei="369800013220020";
command+=(flag);
command+=(27);
command+=(",");
command+=(imei);
command+=(",CCC,");
command+=(position);
command+=("*");
checksum = 0;
for (i = 0; i < command.length; i += 1) {
    checksum += command.charAt(i);
}
command+=(checksum & 0xff);
console.log(checksum);



