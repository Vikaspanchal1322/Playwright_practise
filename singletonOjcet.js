const singlton ={1:"a" , 2 :"b" , 3 : "Vikas" }
const singlton2 ={4:"5" , 5 :"r" , 6 : "Vikas" }

const merger ={singlton2 ,singlton}
console.log(merger) // array ka array ka chapp jayega 
// to avoid this below command user for perfect merger 
//const merger2 = Object.assign({} , singlton, singlton2)  // type 1 for perfect 

//console.log( "see the perfect merger "   , merger2)

// type 2 for perfect 
const merger2 = {...singlton , ...singlton2}
console.log( "see the perfect merger "   , merger2)

