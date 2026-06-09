function reverseString(string){
return string.replaceAll(" ", "_");
}
console.log(reverseString('Hello My Name is Vikas')); //Output:'olleH'

function ispeli (num){
 let num1 = num.split('').reverse().join('')

 return (num1==num )? "yes its pelidorme" : "no its not pelidorme";

}

console.log(ispeli("121"))