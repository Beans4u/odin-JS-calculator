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

### OPERATION STATE / DATA

```JS
const operationState = {
    userOperand1: "",
    userOperand2: "",
    currentOperator: "",
}
```

### STATE MANAGEMENT / LABELS

```JS
const STATES = {
  IDLE: 'IDLE', // calculator hasn't been used yet. The user can enter the initial number or decimal for the first operand.
  // Allows the user to begin operations and stores the initial number or decimal in userOperand1. Exits on number or decimal clicked and begins mode OPERAND1_ACTIVE.

  OPERAND1_ACTIVE: 'OPERAND1_ACTIVE', // the user is entering numbers and optionally a decimal into the first operand. Stores initial number or decimal in userOperand1.
  // Gives the user space to build the first operand, and exits on operator clicked to OPERAND2_WAIT.

  OPERAND2_WAIT: 'OPERAND2_WAIT', // the user entered the first operand and clicked an operator, but did not enter numbers for second operand yet. Updates currentOperator if another operator button is clicked.
  // Gives user a chance to change the operator, and exits on number or decimal clicked.

  OPERAND2_ACTIVE: 'OPERAND2_ACTIVE', // the user is entering numbers and optionally a decimal for the second operand. On click of equals button or another operator, calls operate().
  // Gives user a chance to build the second operand and submit the operation for calculation by clicking a second operator for chaining, or the equals sign. Exits to RESULT.

  RESULT: 'RESULT', // the user calculated an operation, but did not yet enter additional numbers for a chained operation or clicked clear. If clear button or a number is clicked, moves to CLEAR_CLICKED to start fresh, and if an operator is clicked, returns to OPERAND2_WAIT to allow user to chain calculations. Exits on click of clear, number, or operator button.

  CLEAR_CLICKED: 'CLEAR_CLICKED', // the user wants to start fresh. Clears and resets the calculator and returns to IDLE mode.
  // Gives the user the option to start a new calculation (chain) from scratch.
}
```

### FSM CONTEXT / DATA

#### CALCULATOR STATE, DECIMAL USED ONCE PER OPERAND

**Decimal Intent:**  
To prevent user from submitting multiple decimals per operand, it will be disabled if it was already used once per operand.

```JS
const calculator = {
    currentState: STATES.IDLE,
    decimalUsed: false,
    equalsUsed: false,
}
```

### FSM DISPATCH

TODO: add CLEAR_CLICKED LOGIC to other states

```JS
calculatorButtons.addEventListener('click', function handleInput(event) {
  const dataValue = event.target.getAttribute('data-value');

  // change mode to CLEAR_CLICKED on click of 'clear' button to reset calculator for user
  if (event.target.matches('[data-value="clear"]'))
    calculator.currentState = STATES.CLEAR_CLICKED;

  switch (calculator.currentState) {
    case STATES.CLEAR_CLICKED:
      // Reset states
      calculator.currentState = STATES.IDLE;
      calculator.equalsUsed = false;

      // data wipe
      operationState.userOperand1 = '';
      operationState.userOperand2 = '';
      operationState.currentOperator = '';

      // reset bool flags
      if (calculator.decimalUsed) calculator.decimalUsed = false;
      if (calculator.equalsUsed) calculator.equalsUsed = false;

      console.log('clearing data then returning to state "IDLE"...');

      break;

    case STATES.IDLE:
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // prevent more than one decimal per operand
        if (dataValue === '.') {
          if (calculator.decimalUsed) return;
          calculator.decimalUsed = true;
        }

        // add initial digit or one optional decimal to userOperand1 for use in OPERAND1_ACTIVE mode
        operationState.userOperand1 = dataValue;
        console.log('Operand1 is now: ', operationState.userOperand1);

        // move to mode OPERAND1_ACTIVE
        calculator.currentState = STATES.OPERAND1_ACTIVE;
        console.log('User inputting numbers for Operand 1...');
      }

      break;

    case STATES.OPERAND1_ACTIVE:
      // append every digit and one optional decimal to userOperand1 for use in operate() call
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // prevent more than one decimal per operand
        if (dataValue === '.') {
          if (calculator.decimalUsed) return;
          calculator.decimalUsed = true;
        }

        // store the first operand for use in operate() call
        operationState.userOperand1 += dataValue;
        console.log('Operand1 is now: ', operationState.userOperand1);
      }

      // if user clicks operator, store it for the operate() call, and move to state OPERAND2_WAIT
      if (event.target.classList.contains('btn-ops')) {
        operationState.currentOperator = dataValue;

        // if decimalUsed is true, flip to false so it can be used in the next mode for the second operand
        if (calculator.decimalUsed) calculator.decimalUsed = false;

        // activate OPERAND2_WAIT mode to
        calculator.currentState = STATES.OPERAND2_WAIT;
        console.log('Switching to Wait Mode for operator: ', dataValue);
      }
      break;

    case STATES.OPERAND2_WAIT:
      if (event.target.classList.contains('btn-ops')) {
        // update currentOperator so the last-clicked operator btn is used in the operation
        operationState.currentOperator = dataValue;
        console.log('Operator updated to: ', dataValue);
      }

      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // prevent more than one decimal per operand
        if (dataValue === '.') {
          if (calculator.decimalUsed) return;
          calculator.decimalUsed = true;
        }
        // initial digit or one optional decimal is added to userOperand2 for use in operate()
        operationState.userOperand2 += dataValue;
        console.log('Operand2 is now: ', operationState.userOperand2);

        // if user clicks a number or decimal, move to state OPERAND2_ACTIVE
        calculator.currentState = 'OPERAND2_ACTIVE';
        console.log('User inputting numbers for operand2...');
      }

      break;

    case STATES.OPERAND2_ACTIVE:
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // prevent more than one decimal per operand
        if (dataValue === '.') {
          if (calculator.decimalUsed) return;
          calculator.decimalUsed = true;
        }

        // every digit and an optional decimal gets appended to userOperand2 for use in operate()
        operationState.userOperand2 += dataValue;
        console.log('Operand2 is updated to: ', operationState.userOperand2);
      }

      // update currentOperator for use in operate() on click of operator button
      if (event.target.classList.contains('btn-ops'))
        operationState.currentOperator = dataValue;

      if (dataValue === '=' || event.target.classList.contains('btn-ops')) {
        // update equalsUsed bool for branching in chained operations: after equals clicked, will exit chained operation and enter CLEAR_CLICKED mode.
        if (dataValue === '=') calculator.equalsUsed = true;
        console.log('Equals used?', calculator.equalsUsed);

        // call operate(userOperand1, userOperand2, currentOperator), and put that result into userOperand1 for chaining operations
        console.log(
          `Operation: ${operationState.userOperand1} ${operationState.currentOperator} ${operationState.userOperand2}`
        );
        operationState.userOperand1 = operate(
          operationState.userOperand1,
          operationState.userOperand2,
          operationState.currentOperator
        );
        console.log('result of operation: ', operationState.userOperand1);

        // reset userOperand2 and decimal bool for use in next operand
        operationState.userOperand2 = '';
        if (calculator.decimalUsed) calculator.decimalUsed = false;
        console.log(
          'state of decimalUsed bool and userOperand2: ',
          calculator.decimalUsed,
          operationState.userOperand2
        );
      }

      break;

    case STATES.RESULT:
      if (
        calculator.equalsUsed === true &&
        (event.target.classList.contains('btn-ops') || dataValue === '.')
      ) {
        console.log('equalsUsed (should be true): ', calculator.equalsUsed);

        // if chaining from an equals sign, but the next button pressed is a number, clear instead.
        calculator.currentState = STATES.CLEAR_CLICKED;
        console.log('clearing data then returning to state "IDLE"...');
        return;
      } else if (event.target.classList.contains('btn-ops')) {
        // return state to OPERAND2_WAIT to chain calculations
        calculator.currentState = STATES.OPERAND2_WAIT;
        console.log('Returning to Wait Mode...');
        return;
      }
      break;

    default:
      console.error('Calculator in unknown state.');
  }
});
```

TODO:

- [] Update PCODE with working code
- [] Add a RESULTS state that branches decision for = used instead of number in chained ops

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
    //   calculatorState.userOperatorUsed
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
      calculatorState.userOperatorUsed === false
    ) {
      calculatorState.userOperatorUsed = true;
      calculatorState.userOperator = event.target.getAttribute('data-value');
      console.log('user operator clicked: ', calculatorState.userOperatorUsed);
      return console.log('user operator value: ', calculatorState.userOperator);
    } else if (
      event.target.classList.contains('btn-ops') &&
      calculatorState.userOperatorUsed === true
    ) {
    }
  }
);

```
