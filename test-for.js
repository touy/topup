var arr=[];
for(i=0;i<1000*1000;i++){
    arr.push(i);
}
count=0;
var now=new Date();
for(i=0;i<arr.length;i++){
  count++;
}
var end=new Date();
console.log('FOR');
console.log(end-now);

var count=0;
var now=new Date();
arr.forEach(ele=>{
    count++;
});

var end=new Date();
console.log('FOREACH');
console.log(end-now);