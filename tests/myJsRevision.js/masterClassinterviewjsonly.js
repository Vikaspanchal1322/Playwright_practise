const Booking = {
  name: "Vikas",
 cardNum : 99988989898,
 email :"vikaspanchal747@Gmail.com",
 valid : function(){
    console.log("booking person name is "+ this.name)

}


}
console.log(Booking.cardNum);
Booking.valid();


console.log("==========================================================")
// annonymous function in javascript 


function sayhello(){

    return "Vikas is Automation the code ";

}
const hlo = sayhello();
console.log(hlo)

const hloo = function(name){
return "my logic for announmusyus function is " + name ;

}
console.log(hloo("Vikas"))


console.log("==========================================================")


const fruits =["apple", "cheery" ,"banaana", "peach"]

fruits.forEach((fru , index) => {
                  console.log(`${index}:${fru}`)})



console.log("==========================================================")

// is java async ? explian





