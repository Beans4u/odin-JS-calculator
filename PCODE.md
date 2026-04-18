# PSEUDOCODE

A place for my implementation notes and working out logic.

## FUNCTIONS: CALCULATE BY OPERATOR

**Step 1 & 2: create calculation logic**  
Create math operator functions for add, sub, mult, div.  
Test in browser console.

**PSEUDO**  
_The pseudo is sometimes more work for me to think of in terms of descriptive code rather than just coding it when it's very simple, I'm just coding it._

```js
function addNums(num1, num2) {
  const result = num1 + num2;
  const rounded = Math.round((result + Number.EPSILON) * 100) / 100;
  return rounded;
}
function subtractNums(num1, num2) {
  const result = num1 - num2;
  const rounded = Math.round((result + Number.EPSILON) * 100) / 100;
  return rounded;
}
function multiplyNums(num1, num2) {
  const result = num1 * num2;
  const rounded = Math.round((result + Number.EPSILON) * 100) / 100;
  return rounded;
}
function divideNums(num1, num2) {
  const result = num1 / num2;
  const rounded = Math.round((result + Number.EPSILON) * 100) / 100;
  return rounded;
}

// TESTING PLAYGROUND

//basic test - use valid numbers only
// let userNum1 = 2;
// let userNum2 = 4;

// console.log(addNums(userNum1, userNum2));
// console.log(subtractNums(userNum1, userNum2));
// console.log(multiplyNums(userNum1, userNum2));
// console.log(divideNums(userNum1, userNum2));
```

## FUNCTION: CALL OPERATOR-BASED CALCULATIONS

**PSEUDO**  
_The pseudo is sometimes more work for me to think of in terms of descriptive code rather than just coding it when it's very simple, I'm just coding it._

**Step 3: create function for calc logic**  
Create `operate()` function, will take operator and 2 nums  
Calls math function based on operator used.

```JS
//Operator variables
const OPERATOR = {
  ADDED_BY: '+',
  SUBTRACTED_BY: '-',
  MULTIPLIED_BY: '*',
  DIVIDED_BY: '/',
};

function operate(num1, num2, op) {
  let firstOperand = Number(num1);
  let secondOperand = Number(num2);

  // short-circuit if invalid number
  if (Number.isNaN(firstOperand) || Number.isNaN(secondOperand)) {
    return console.log('Error catch: Please enter a valid number'); //placeholder error handling, will be updated to append to UI
  }

  switch (op) {
    case OPERATOR.ADDED_BY:
      return addNums(firstOperand, secondOperand);
    case OPERATOR.SUBTRACTED_BY:
      return subtractNums(firstOperand, secondOperand);
    case OPERATOR.MULTIPLIED_BY:
      return multiplyNums(firstOperand, secondOperand);
    case OPERATOR.DIVIDED_BY:
      if (secondOperand === 0) {
        return console.log(
          "Divide by zero error: So you thought you'd divide by zero, eh?"
        );
      }
      return divideNums(firstOperand, secondOperand);
    default:
      return console.log('SWITCH default: there was an error'); //placeholder error handling, will be updated to append to UI
  }
}

// - - - - - TESTING PLAYGROUND - - - - - -
// Note: user input is always passed in as a string

//basic test
// let userNum1 = '2';
// let userNum2 = '4';

// long decimals are rounded (used parseFloat in return)
// let userNum1 = '2.22538145386154';
// let userNum2 = 4.22615648145355254518994584;

// multiple decimals are handled
// let userNum1 = '2.2222256785.38146154';
// let userNum2 = '4.2264.8.4.5194584';

// can divide by zero
let userNum1 = '6';
let userNum2 = '0';

console.log('operate - add: ', operate(userNum1, userNum2, OPERATOR.ADDED_BY));
console.log(
  'operate - add: ',
  operate(userNum1, userNum2, OPERATOR.SUBTRACTED_BY)
);
console.log(
  'operate - add: ',
  operate(userNum1, userNum2, OPERATOR.MULTIPLIED_BY)
);
console.log(
  'operate - add: ',
  operate(userNum1, userNum2, OPERATOR.DIVIDED_BY)
);
```

## STRUCTURE: HTML, CSS

For the event listeners and actions

```css
#calc-chassis /*(as parent container) */
#display-screen

#btn-decimal
#btn-clear
```

## STYLE: CSS

for CSS styling (colours per button type)

```css
.btn
.btn-nums
.btn-ops
.btn-other
```

### DATA-ATTRIBUTES: HTML

For JS actions

**Digits**

- `data-value="0" -> "9"`

**Operators**

- `data-value="+"`
- `data-value="-"`
- `data-value="*"`
- `data-value="/"`

**Controls**

- `data-value="."`
- `data-value="="`
- `data-value="clear"`

## STATE: DISPLAY

Still thinking about this, but I have this here for now:

```JS
const numberState = {
  numState1: 0,
  numState2: 0,
  runningTotal: 0,
};
```

## EVENT HANDLERS

### DOM ELEMENTS

```JS
const calculatorButtons = document.querySelector('#button-container');
const numberButtons = document.querySelectorAll('.btn-nums');
let displayScreen = document.getElementById('display-screen');
const SCREEN_FULL = 'max characters reached';

// testing
// console.log('Number Button Nodes: ', numberButtons);
// console.log('Display Screen: ', displayScreen);
// const operatorButtons = document.querySelectorAll('btn-ops');
// const otherButtons = document.querySelectorAll('btn-other');
```

### HANDLE NUMBER CLICKED DISPLAY

Any number buttons clicked will update the display with the number button value. e.g. if button "1" is clicked, the display shows "1". If "2" is clicked, it updates to "12".

```JS
numberButtons.forEach((button) => {
  button.addEventListener('click', function handleNumClickedDisplay(event) {
    console.log('button-clicked: ', event.target.getAttribute('data-value'));

    // print the data-value to the screen
    const printValue = event.target.getAttribute('data-value');

    if (displayScreen.textContent.length > 10) {
      return (displayScreen.textContent = SCREEN_FULL);
    }
    displayScreen.textContent += printValue;
    return console.log('print value: ', displayScreen.textContent.length);
  });
});
```

### HANDLE CLEAR DISPLAY

Clicking the clear button resets the display to 0.

**Housecleaning/to-do**: Reset state on click (state will be built alongside `handleOperate`).

```JS
calculatorButtons.addEventListener('click', function handleClearDisplay(event) {
  console.log('button-clicked: ', event.target.getAttribute('data-value'));
  console.log(
    'event target has clear attribute?: ',
    event.target.matches('[data-value="clear"]')
  );
  if (event.target.matches('[data-value="clear"]')) {
    return (displayScreen.textContent = '0');
  }
});
```

### HANDLE OPERATE

```JS

// Get user input from button clicks

//


```
