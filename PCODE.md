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
#button-container
```

## STYLE: CSS

for CSS styling (colours per button type)

```css
.btn-nums
.btn-ops
.btn-controls
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

## EVENT HANDLERS

### STATE: DECIMAL USED ONCE PER OPERAND

TODO: Work out logic.

**Intent:**  
To prevent user from submitting multiple decimals per operand, it will be disabled if it was already used once per operand.

It will flip to true when used once.  
It will flip to false on click of the `=` or operator (`+`, `-`, `*`, `/`) buttons.

```JS
const decimalUsed = false;
```

### STATE MANAGEMENT

```JS
const fsmConfig = {
    // IDLE - hasn't been used yet

    // OPERAND1_ACTIVE the user is entering numbers for the first operand
        // every digit gets appended to operand1
        // if user clicks operator, move to mode OPERATOR_CLICKED

    // OPERAND2_ACTIVE the user is entering numbers for the second operand
        // every digit gets appended to operand2
        // if user clicks an operator, call operate(operand1, operand2, currentOperator)
            // put that result into operand1
            // clear operand2
            // start newOperator as currentOperator

    // OPERAND2_WAIT the user clicked an operator but did not enter numbers yet
        // if the user clicks an operator, update newOperator as currentOperator

    // EQUALS_CLICKED the user wants the result of the calculation
        // call operate(operand1, operand2, currentOperator)
        // display result on screen
        // if user clicks an operator, put the result of operate into operand1
        // if user clicks an operand, call clear()

    // CLEAR_CLICKED the user wants to start fresh
        // return state to IDLE
}
```

### HANDLE OPERATE

TODO: Work out logic

Will send the values of number and operator buttons clicked to the function operate().

```JS

// Get user input from button clicks

//


```

.
.
.
.
.
.
.
.
.
.
.

## Code graveyard, for reference only

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
// const otherButtons = document.querySelectorAll('btn-controls');
```

### HANDLE NUMBER CLICKED DISPLAY

Any number buttons clicked will update the display with the number button value.
e.g. if button `1` is clicked, the display shows `"1"`. If `2` is clicked, it updates to `"12"`.

```JS
numberButtons.forEach((button) => {
  button.addEventListener('click', function handleNumClickedDisplay(event) {
    console.log('button-clicked: ', event.target.getAttribute('data-value'));

    // print the data-value to the screen
    const printValue = event.target.getAttribute('data-value');

    if (displayScreen.textContent.length > 20) {
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

housekkeping: remove zero when user starts entering numbers

```js
calculatorState.ENTERING_OPERAND === 0
  ? (calculatorState.ENTERING_OPERAND = event.target.getAttribute('data-value'))
  : (calculatorState.ENTERING_OPERAND +=
      event.target.getAttribute('data-value'));
```

### HANDLE OPERAND STATE

```JS
// - - - HANDLE OPERAND STATE - - - -

calculatorButtons.addEventListener('click', function handleOperandState(event) {
  //   console.log('button-clicked: ', event.target.getAttribute('data-value'));

  if (
    event.target.classList.contains('btn-nums') &&
    calculatorState.operatorClicked === false
  ) {
    calculatorState.userOperand1 += event.target.getAttribute('data-value');
    return console.log('userOperand 1: ', calculatorState.userOperand1);
  } else if (
    event.target.classList.contains('btn-nums') &&
    calculatorState.operatorClicked === true
  ) {
    calculatorState.userOperand2 += event.target.getAttribute('data-value');
    return console.log('userOperand 2: ', calculatorState.userOperand2);
  }
});
```

### HANDLE OPERATOR STATE

```JS
// - - - HANDLE OPERATOR STATE - - - -

calculatorButtons.addEventListener(
  'click',
  function handleOperatorState(event) {
    // console.log('button-clicked: ', event.target.className);
    // console.log(
    //   'button clicked data value: ',
    //   event.target.getAttribute('data-value')
    // );
    // console.log(
    //   'FUNC SCOPE user operator used: ',
    //   calculatorState.userOperatorlUsed
    // );
    // console.log(
    //   'FUNC SCOPE user operator value: ',
    //   calculatorState.userOperator
    // );

    // if operator is used,
    // flip used bool from false to true
    // update userOp state to value of op button

    if (
      event.target.classList.contains('btn-ops') &&
      calculatorState.userOperatorlUsed === false
    ) {
      calculatorState.userOperatorlUsed = true;
      calculatorState.userOperator = event.target.getAttribute('data-value');
      console.log('user operator clicked: ', calculatorState.userOperatorlUsed);
      return console.log('user operator value: ', calculatorState.userOperator);
    } else if (
      event.target.classList.contains('btn-ops') &&
      calculatorState.userOperatorlUsed === true
    ) {
    }
  }
);

```
