# PSEUDOCODE

A place for my implementation notes and working out logic.

## FUNCTIONS: CALCULATE

**Step 1 & 2: create calculation logic**  
Create math operator functions for add, sub, mult, div.  
Test in browser console.

**PSEUDO**  
_The pseudo is sometimes more work for me to think of in terms of descriptive code rather than just coding it when it's very simple, I'm just coding it._

```js
function addNums(num1, num2) {
  return num1 + num2;
}
function subtractNums(num1, num2) {
  return num1 - num2;
}
function multiplyNums(num1, num2) {
  return num1 * num2;
}
function divideNums(num1, num2) {
  return num1 / num2;
}

// basic test
let userNum1 = 2;
let userNum2 = 4;

// long decimals are rounded
let userNum1 = 2.222228385415678538145386154;
let userNum2 = 4.22645167818453478415648145355254518994584;

console.log(addNums(userNum1, userNum2));
console.log(subtractNums(userNum1, userNum2));
console.log(multiplyNums(userNum1, userNum2));
console.log(divideNums(userNum1, userNum2));
```

## FUNCTIONS: CALCULATE

**PSEUDO**  
_The pseudo is sometimes more work for me to think of in terms of descriptive code rather than just coding it when it's very simple, I'm just coding it._

**Step 3: create function for calc logic**  
Create `operate()` function, will take operator and 2 nums  
Calls math function based on operator used.

```JS
//Operator variables
const addOp = '+';
const subtractOp = '-';
const multiplyOp = '*';
const divideOp = '/';

function operate(num1, num2, operator) {
  if (!Number(num1) || !Number(num2))
    return alert('Please enter a valid number'); //placeholder error handling
  switch (operator) {
    case '+':
      return addNums(num1, num2);
    case '-':
      return subtractNums(num1, num2);
    case '*':
      return multiplyNums(num1, num2);
    case '/':
      return divideNums(num1, num2);
    default:
      return alert('there was an error'); //placeholder error handling
  }
}

// testing playground

//basic test
// let userNum1 = 2;
let userNum2 = '4';

// long decimals are rounded (used parseFloat in return)
let userNum1 = '2.22222838545678538145386154';
// let userNum2 = 4.22645167818453478415648145355254518994584;

// more than one decimal (used Number to validate)
// let userNum1 = '2.22222838545678538145386154';
// let userNum2 = 4.22645167.81845347841564814.5355254518994584;

console.log('operate - add: ', operate(userNum1, userNum2, addOp));
console.log('operate - sub: ', operate(userNum1, userNum2, subtractOp));
console.log('operate - mult: ', operate(userNum1, userNum2, multiplyOp));
console.log('operate - div: ', operate(userNum1, userNum2, divideOp));
```
