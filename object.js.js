const username = {
     name: "Viks Panchal",
     age : 28,
     Email : "vikaspanchal747@gmail.com"
     
}

username.greeting =function(){

console.log("tell your name first ");


}
console.log(username.greeting()) // make sure when call function () is must in console.log statement 

username.age = 55
//Object.freeze(username)
username.name= "tjs tjs"
console.log(username.age);
console.log(username.name);

