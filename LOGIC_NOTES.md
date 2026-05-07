# LOGIC NOTES BY SPEC

A place for my implementation notes and working out logic.

Updated to double as project documentation and a place to store useful debugging console.logs to keep the source file clean.

## FUNCTIONS: CALCULATE BY OPERATOR

Core calculation logic for operations.

<details>
<summary>**Assignment Steps 1 & 2: Core arithmetic functions**</summary>
Your calculator is going to contain functions for all of the basic math operators you typically find on calculators, so start by creating functions for the following items and testing them in your browser’s console:

- add
- subtract
- multiply
- divide

A calculator operation will consist of a number, an operator, and another number. For example, 3 + 5. Create three variables, one for each part of the operation. You’ll use these variables to update your display later.

</details>

```js
function addNums(num1, num2) {
  const result = num1 + num2;
  return result;
}
function subtractNums(num1, num2) {
  const result = num1 - num2;
  return result;
}
function multiplyNums(num1, num2) {
  const result = num1 * num2;
  return result;
}
function divideNums(num1, num2) {
  const result = num1 / num2;
  return result;
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

<details>
<summary>**Assignment Step 3: create function for calc logic**</summary>
Assignment page: Create a new function `operate` that takes an operator and two numbers and then calls one of the above functions on the numbers.

> Translation:
>
> - Create `operate()` with parameters for `num1`, `num2`, and `OPERATOR`, so: `operate(number1, number2, operator)`.
> - It calls one of the four calc functions we just made

</details>

Create `operate()` function, will take operator and 2 nums  
Calls math function based on operator used.

```JS
// - - - OPERATORS FOR DISPATCH IN operate() - - - -
const OPERATOR = {
  ADDED_BY: '+',
  SUBTRACTED_BY: '-',
  MULTIPLIED_BY: '*',
  DIVIDED_BY: '/',
};

// - - - - - RETURN CALCULATED RESULT IN operate() - - - - - -

function operate(num1, num2, op) {
  let firstOperand = Number(num1);
  let secondOperand = Number(num2);

  // short-circuit if invalid number
  if (Number.isNaN(firstOperand) || Number.isNaN(secondOperand)) {
    return;
  }

  switch (op) {
    case OPERATOR.ADDED_BY:
      return addNums(firstOperand, secondOperand);
    case OPERATOR.SUBTRACTED_BY:
      return subtractNums(firstOperand, secondOperand);
    case OPERATOR.MULTIPLIED_BY:
      return multiplyNums(firstOperand, secondOperand);
    case OPERATOR.DIVIDED_BY:
      return divideNums(firstOperand, secondOperand);
    default:
      return displayScreen.textContent = 'there was an error';
  }
}

// - - - - - TESTING PLAYGROUND - - - - - -
// Note: user input is always passed in as a string

//basic test
// let userNum1 = '2';
// let userNum2 = '4';

// long decimals are rounded to two decimal places
// let userNum1 = '2.22538145386154';
// let userNum2 = 4.22615648145355254518994584;

// multiple decimals are handled
// let userNum1 = '2.2222256785.38146154';
// let userNum2 = '4.2264.8.4.5194584';

// test divide by zero
let userNum1 = '6';
let userNum2 = '0';

console.log('TESTING PLAYGROUND: operate() | operate - add: ', operate(userNum1, userNum2, OPERATOR.ADDED_BY));
console.log(
  'TESTING PLAYGROUND: operate() | operate - subtract: ',
  operate(userNum1, userNum2, OPERATOR.SUBTRACTED_BY)
);
console.log(
  'TESTING PLAYGROUND: operate() | operate - multiply: ',
  operate(userNum1, userNum2, OPERATOR.MULTIPLIED_BY)
);
console.log(
  'TESTING PLAYGROUND: operate() | operate - divide: ',
  operate(userNum1, userNum2, OPERATOR.DIVIDED_BY)
);
```

## STRUCTURE: HTML, CSS

<details>
<summary>**Assignment Step 4: create HTML skeleton** </summary>
Assignment page: Create a basic HTML calculator with buttons for each digit and operator (including `=`).

- Don’t worry about making them functional just yet.
- There should also be a display for the calculator. Go ahead and fill it with some dummy numbers so it looks correct.
- Add a “clear” button.

> translation: create HTML skeleton of calculator including a display with dummy numbers.
> I also went ahead and filled it with classes and data-attributes I assumed I'd be using later

</details>

For the event listeners and actions:

```css
/*(parent container) */
#calc-chassis

/* children */
#display-screen
#button-container
```

### STYLE: CSS

For CSS styling (colours per button type):

```css
.btn-nums
.btn-ops
.btn-controls
```

### DATA-ATTRIBUTES: HTML

For JS actions:

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

## FSM DATA, LABELS, AND DISPATCH

<details>
<summary>**Assignment Step 5: create functions to update num vars on click**</summary>
Create the functions that update one of your number variables when the calculator’s digit buttons are clicked.
  
> "one of your number variables", I assuming `num1` and `num2`, as required.
> i.e. create and wire event handler for the functions I previously made.

Your calculator’s display should also update to reflect the value of that number variable.

> i.e. wire an event handler to create and append text to the `display-screen`. This should really be a separate step to encourage separation of concerns.

</details>

### STATE MANAGEMENT / LABELS

"State" and "mode" are used interchangeably in this document.

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

  RESULT: 'RESULT', // the user calculated an operation, but did not yet enter additional numbers for a chained operation or clicked clear. If equals was used, number input starts a new operation in OPERAND1_ACTIVE. If an operator chained the calculation, number input continues chaining in OPERAND2_ACTIVE.
};
```

### OPERATION DATA

```JS
const operationState = {
  userOperand1: '0',
  userOperand2: '',
  currentOperator: '',
  nextOperator: '',
};
```

### CALCULATOR STATE, DECIMAL USED ONCE PER OPERAND

```JS
const calculator = {
    currentState: STATES.IDLE,
    decimalUsed: false,
    equalsUsed: false,
}
```

### DOM ELEMENTS

```JS
const calculatorButtons = document.querySelector('#button-container');
```

### FSM DISPATCH

```JS
calculatorButtons.addEventListener('click', function handleInput(event) {
  const buttonValue = event.target.getAttribute('data-value');

  // clear '0' from userOperand1 if the user starts with a non-zero number.
  clearStartingZeroOperand1(buttonValue);

  // when 'clear' clicked, reset calculator
  if (event.target.matches('[data-value="clear"]')) {
    resetCalculator();
    clearDisplay();
  }

  // + + + FSM SWITCH STATEMENT + + +
  switch (calculator.currentState) {
    case STATES.IDLE:
      // limit one decimal per operand
      if (limitDecimalsUsed(buttonValue)) return;

      // prevent operator from printing to displayScreen in IDLE mode
      if (event.target.classList.contains('btn-ops')) return;

      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // update userOperand1 for use in OPERAND1_ACTIVE mode
        updateUserOperand1(buttonValue);
        displayOperation(buttonValue);

        // move to mode OPERAND1_ACTIVE to continue building operand1 or select operator
        changeStateToOperand1Active();
      }

      break;

    case STATES.OPERAND1_ACTIVE:
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // limit one decimal per operand
        if (limitDecimalsUsed(buttonValue)) return;

        // update userOperand1 for use in operate() call
        updateUserOperand1(buttonValue);

        // display updated userOperand1
        displayOperation(buttonValue);
      }

      if (event.target.classList.contains('btn-ops')) {
        // if user clicks operator, store it for the operate() call, and move to state OPERAND2_WAIT
        updateCurrentOperator(buttonValue);

        // display updated operator
        displayOperation(buttonValue);

        // reset decimalUsed to allow use in userOperand2
        resetDataForChaining();

        // activate OPERAND2_WAIT mode to start building the second operand
        changeStateToOperand2Wait();
      }

      break;

    case STATES.OPERAND2_WAIT:
      if (event.target.classList.contains('btn-ops')) {
        // ensure the last-clicked operator is used in operate() call
        updateCurrentOperator(buttonValue);
        displayOperation(buttonValue);
      }

      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // limit one decimal per operand
        if (limitDecimalsUsed(buttonValue)) return;

        // displayScreen to add a leading 0 if `0` or `.` are the first buttons entered into userOperand2.
        addLeadingZeroOperand2(buttonValue);
        displayOperation(buttonValue);

        // update userOperand2 with number or decimal for use in operate() call
        updateUserOperand2(buttonValue);
        displayOperation(buttonValue);

        // activate OPERAND2_ACTIVE state to continue building operand2 or select operator
        changeStateToOperand2Active();
      }

      break;

    case STATES.OPERAND2_ACTIVE:
      /// ---------- NUMBER OR DECIMAL CLICKED ------------
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // limit one decimal per operand
        if (limitDecimalsUsed(buttonValue)) return;

        // displayScreen to add a leading 0 if `0` or `.` are the first buttons entered into userOperand2.
        addLeadingZeroOperand2(buttonValue);
        updateUserOperand2(buttonValue);
        displayOperation(buttonValue);
      }

      /// ---------- EQUALS OR OPERATOR CLICKED ------------

      if (event.target.classList.contains('btn-ops') || buttonValue === '=') {
        clearDisplay();

        // Set equalsUsed to control chaining (in STATES.RESULT, a number or decimal after '=' clears calculator).
        flipEqualsUsedToTrue(buttonValue);

        // Store nextOperator for chained operations in RESULT state
        updateNextOperator(buttonValue);

        // call operate(userOperand1, userOperand2, currentOperator), using userOperand1 as the new starting value for chained operations for use in OPERAND2_WAIT
        callOperate();

        // prevent operator from displaying after equals clicked
        if (buttonValue === '=') {
          operationState.currentOperator = '';
          console.log(
            `Current state: ${calculator.currentState}
            User selected equals.
            resetting operators...
            nextOperator: >>>[${operationState.nextOperator}]<<< (must be empty)
            currentOperator: >>>[${operationState.currentOperator}]<<< (must be empty)`
          );
        }
        displayResult(buttonValue);

        // reset userOperand2 and decimalUsed bool for use in chained operation
        resetDataForChaining();

        // change to RESULT mode
        changeStateToResult();
      }

      break;

    case STATES.RESULT:
      // clear nextOperand before changing state to OPERAND2_ACTIVE if user chains operation, which otherwise would conflict with display logic.
      updateChainedOperator();

      // limit one decimal per operand
      if (limitDecimalsUsed(buttonValue)) return;

      // ensure the last-clicked operator is used in operate() call
      if (event.target.classList.contains('btn-ops')) {
        updateCurrentOperator(buttonValue);
        // display updated operator
        displayOperation(buttonValue);
      }

      // if operator was used instead of equals, update userOperand2 and return state to OPERAND2_ACTIVE to chain calculations on click of number or decimal
      if (
        calculator.equalsUsed === false &&
        (event.target.classList.contains('btn-nums') ||
          event.target.matches('[data-value="."]'))
      ) {
        console.log(`Current state: ${calculator.currentState}
          User updated userOperand2 to: ${buttonValue}. Changing to OPERATION2_ACTIVE mode...`);
        addLeadingZeroOperand2(buttonValue);
        updateUserOperand2(buttonValue);
        displayOperation(buttonValue);
        console.log(
          `Current state: ${calculator.currentState} | Displaying operation
            User selected number or decimal for userOperand2. Checking operators...
            nextOperator: >>>[${operationState.nextOperator}]<<< (must be empty)
            currentOperator: >>>[${operationState.currentOperator}]<<< (must have value)`
        );
        changeStateToOperand2Active();
      }
      // if equals was clicked, followed by a number or decimal, clear calculator to begin building a new operation.
      if (
        calculator.equalsUsed === true &&
        (event.target.classList.contains('btn-nums') ||
          event.target.matches('[data-value="."]'))
      ) {
        console.log(`Current state: ${calculator.currentState}
          User clicked ${buttonValue}. Starting new operation in OPERAND1_ACTIVE mode...`);
        resetCalculatorFromResult(buttonValue);
        clearDisplay();
        displayOperation(buttonValue);
        changeStateToOperand1Active();
      }
      // if equals was clicked, followed by a new operator, continue chaining from the result.
      if (
        calculator.equalsUsed === true &&
        event.target.classList.contains('btn-ops')
      ) {
        console.log(`Current state: ${calculator.currentState}
          User clicked ${buttonValue}. Changing to OPERATION2_WAIT mode...`);
        calculator.equalsUsed = false;
        updateCurrentOperator(buttonValue);
        displayOperation(buttonValue);
        changeStateToOperand2Active();
      }

      break;

    default:
      console.error(
        `Current state: ${calculator.currentState}
        An unknown error has occurred.`
      );
  }
});
```

### HELPER FUNCTIONS

#### OPERATIONS

Handle running calculations and updating operation data. Used for calling `operate()` and managing chained calculations.

```JS
unction callOperate() {
  console.log(
    `Current state: ${calculator.currentState} | callOperate()
    operate() called. Operation: ${operationState.userOperand1} ${operationState.currentOperator} ${operationState.userOperand2}`
  );

  operationState.userOperand1 = operate(
    operationState.userOperand1,
    operationState.userOperand2,
    operationState.currentOperator
  );

  console.log(
    `Current state: ${calculator.currentState} | callOperate()
    Result of operate() and new starting value of userOperand1: ${operationState.userOperand1}`
  );
}
```

#### UPDATE OPERATORS

Functions to update the `currentOperator`, and to store the `nextOperator` when chaining calculations.

```JS
function updateCurrentOperator(buttonClicked) {
  if (event.target.classList.contains('btn-ops')) {
    // ensure the last-clicked operator is used in operate() call
    operationState.currentOperator = buttonClicked;
    console.log(
      `Current state: ${calculator.currentState} | updateCurrentOperator(buttonClicked)  \n User updated currentOperator to: ${operationState.currentOperator}`
    );
  }
}
```

```JS
function updateNextOperator(buttonClicked) {
  if (event.target.classList.contains('btn-ops')) {
    operationState.nextOperator = buttonClicked;
    console.log(
      `Current state: ${calculator.currentState} | updateNextOperator(buttonClicked)
      User selected additional operator to chain operation.
      User updated nextOperator to: ${operationState.nextOperator}`
    );
  }
}
```

function `updateChainedOperator` is a handoff between `currentOperator` and `nextOperator`, used in the RESULTS state.

```JS
function updateChainedOperator() {
  operationState.currentOperator = operationState.nextOperator;
  operationState.nextOperator = '';
  console.log(
    `Current state: ${calculator.currentState} | updateChainedOperator(buttonClicked)
      User selected additional operator in chained operation.
      nextOperator handed off to currentOperator.
      nextOperator: >>>[${operationState.nextOperator}]<<< (must be empty)
      currentOperator: ${operationState.currentOperator}`
  );
}
```

#### UPDATE OPERANDS

Functions for updating operand values from button clicks. Builds the numbers the user enters one character at a time, which is later used in `operate()`.

```JS
function updateUserOperand1(buttonClicked) {
  operationState.userOperand1 += buttonClicked;
  console.log(
    `Current state: ${calculator.currentState} | updateUserOperand1(buttonClicked)
    User updated number for Operand1: ${operationState.userOperand1}`
  );
}
```

```JS
function updateUserOperand2(buttonClicked) {
  operationState.userOperand2 += buttonClicked;
  console.log(
    `Current state: ${calculator.currentState} | updateUserOperand2(buttonClicked)
    User updated number for Operand2: ${operationState.userOperand2}`
  );
}
```

#### UPDATE BOOLS

Functions for updating calculator flags to restrict decimal usage, and branching in the RESULT state with equals bool.

```JS
function flipEqualsUsedToTrue(buttonClicked) {
  if (buttonClicked === '=') {
    calculator.equalsUsed = true;
    console.log(
      `Current state: ${calculator.currentState} | flipEqualsUsedToTrue(buttonClicked)
      equalsUsed = ${calculator.equalsUsed}
      User has selected equals and calculation will begin shortly...`
    );
  }
}
```

```JS
function limitDecimalsUsed(buttonClicked) {
  // limit one decimal per operand
  if (buttonClicked === '.') {
    if (calculator.decimalUsed) return true;
    calculator.decimalUsed = true;
    console.log(`Current state: ${calculator.currentState} | limitDecimalsUsed(buttonClicked)
    User has selected decimal.
    decimalUsed updated to (should be true): ${calculator.decimalUsed}`);
  }
  return false;
}
```

#### RESET DATA

Functions for clearing calculator data and resetting state between operations.

```JS
function resetDataForChaining() {
  operationState.userOperand2 = '';
  if (calculator.decimalUsed) calculator.decimalUsed = false;
  console.log(
    `Current state: ${calculator.currentState} | resetDataForChaining()
    Resetting decimalUsed and userOperand2 to allow for chained operations...
    decimalUsed bool (must be false): ${calculator.decimalUsed}
    userOperand2 -->[${operationState.userOperand2}]<-- (must be empty).`
  );
}
```

```JS
function resetCalculator() {
  // Reset states
  calculator.currentState = STATES.IDLE;
  calculator.equalsUsed = false;

  // data wipe
  operationState.userOperand1 = '0';
  operationState.userOperand2 = '';
  operationState.currentOperator = '';
  operationState.nextOperator = '';

  // reset bool flags
  if (calculator.decimalUsed) calculator.decimalUsed = false;
  if (calculator.equalsUsed) calculator.equalsUsed = false;

  console.log(
    `Current state: ${calculator.currentState} | resetCalculator()
    clearing data then returning to IDLE mode...`
  );
}
```

```JS
function resetCalculatorFromResult(buttonClicked) {
  // Reset states
  calculator.currentState = STATES.OPERAND1_ACTIVE;
  calculator.equalsUsed = false;

  // data wipe
  addLeadingZeroOperand1(buttonClicked); // allows decimal and zero as first numbers from RESULT state
  operationState.userOperand2 = '';
  operationState.currentOperator = '';
  operationState.nextOperator = '';

  // reset bool flags
  if (calculator.decimalUsed) calculator.decimalUsed = false;
  if (calculator.equalsUsed) calculator.equalsUsed = false;

  console.log(
    `Current state: ${calculator.currentState} | resetCalculatorFromResult(buttonClicked)
    User started new calculation. Clearing data then returning to OPERAND1_ACTIVE mode...
    userOperand1 is now: >>>[${buttonClicked}]<<< (must have value)`
  );
}

```

#### CHANGE STATES

Responsible for transitioning the calculator FSM between modes by updating `calculator.currentState`.

##### OPERANDS

```JS
function changeStateToOperand1Active() {
  calculator.currentState = STATES.OPERAND1_ACTIVE;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToOperand1Active()
    Switching to mode OPERAND1_ACTIVE.
    Waiting for user to use an operator or to continue adding numbers to Operand1...`
  );
}
```

```JS
function changeStateToOperand2Wait() {
  calculator.currentState = STATES.OPERAND2_WAIT;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToOperand2Wait()
    Switching to mode OPERAND2_WAIT.
    Waiting for user to update userOperand2 or use an operator...`
  );
}
```

```JS
function changeStateToOperand2Active() {
  calculator.currentState = STATES.OPERAND2_ACTIVE;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToOperand2Active()
    Switching to OPERAND2_ACTIVE mode.
    Waiting for user to use an operator or select more numbers for userOperand2...`
  );
}
```

##### RESULT

```JS
function changeStateToResult() {
  calculator.currentState = STATES.RESULT;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToResult()
    Changing to RESULT mode.
    If equals clicked: Waiting for user to clear or use an operator to chain operation...
    If chained from operator: Waiting for user to update userOperand2 or select operator...`
  );
}
```

## DISPLAY SCREEN

### DOM ELEMENTS

```JS
let displayScreen = document.getElementById('display-screen');
```

### DISPLAY USER CLICKS

Assignment page ("design spec"): Any number buttons clicked will update the display with the number button value.
e.g. if button `1` is clicked, the display shows `"1"`. If `2` is clicked, it updates to `"12"`.

Implemented: Updates `displayScreen` based on the current operands, operators, and chaining state.
Prevents equals from printing to the display.

```JS
function displayOperation(buttonClicked) {
  // prevent equals from displaying
  if (buttonClicked === '=') return;

  const formattedUserOperand1 = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 17,
  }).format(operationState.userOperand1);

  const formattedUserOperand2 = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 17,
  }).format(operationState.userOperand2);

  // create a space around the operator
  if (event.target.classList.contains('btn-ops')) {
    displayScreen.textContent = `${formattedUserOperand1} ${operationState.currentOperator}`;
  }

  if (event.target.classList.contains('btn-nums') || buttonClicked === '.') {
    // display currentOperator instead of nextOperator
    if (operationState.nextOperator === '') {
      // do not display userOperand2 if not building yet
      if (operationState.userOperand2 === '') {
        displayScreen.textContent = `${formattedUserOperand1} ${operationState.currentOperator}`;
      } else if (operationState.userOperand2 !== '') {
        displayScreen.textContent = `${formattedUserOperand1} ${operationState.currentOperator} ${formattedUserOperand2}`;
      }
    }
    // display nextOperator instead of currentOperator
    if (operationState.nextOperator) {
      // do not display userOperand2 if not building yet
      if (operationState.userOperand2 === '') {
        displayScreen.textContent = `${formattedUserOperand1} ${operationState.nextOperator}`;
      } else if (operationState.userOperand2 !== '') {
        displayScreen.textContent = `${formattedUserOperand1} ${operationState.nextOperator} ${formattedUserOperand2}`;
      }
    }
  }

  return;
}
```

### DISPLAY RESULT

Function for printing calculation results to `displayScreen`. Also handles divide-by-zero messaging and operator display after calculations resolve.

```JS
function displayResult(buttonClicked) {
  const formattedUserOperand1 = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 17,
  }).format(operationState.userOperand1);

  const formattedUserOperand2 = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 17,
  }).format(operationState.userOperand2);

  if (buttonClicked === '=') displayScreen.textContent = formattedUserOperand1;

  if (operationState.userOperand1 == 'Infinity') {
    return (displayScreen.textContent = 'One does not simply divide by 0!');
  }
  if (operationState.nextOperator) {
    if (event.target.classList.contains('btn-ops'))
      return (displayScreen.textContent = `${formattedUserOperand1} ${operationState.nextOperator}`);
  } else if (operationState.nextOperator === '') {
    return (displayScreen.textContent = `${formattedUserOperand1} ${operationState.currentOperator}`);
  }
}
```

Testing quick copy

```JS
// TODO: remove this bug checker:
  console.log(
    `Current state: ${calculator.currentState} | Displaying operation
            User selected a number. Checking operators to resolve bug...
            nextOperator: >>>[${operationState.nextOperator}]<<<
            currentOperator: >>>[${operationState.currentOperator}]<<<`
  );
```

### CLEAR DISPLAY

Resets `displayScreen` back to its default value.

```JS
function clearDisplay() {
  displayScreen.textContent = '0';
  console.log(`Current state: ${calculator.currentState} | clearDisplay()
    Clearing display.`);
}
```

### CLEAR ZERO IF NON-ZERO ENTERED FIRST

Removes the default zero value from `userOperand1` when the user begins entering a non-zero number, which prevents values such as `01`, `02`, etc. from appearing on the display.

```JS
function clearStartingZeroOperand1(buttonClicked) {
  if (event.target.classList.contains('btn-nums')) {
    if (
      // remove the leading '0' so the user will see one digit when typing a non-zero number rather than two digits starting with 0.
      buttonClicked !== 0 &&
      operationState.userOperand1 === '0'
    ) {
      operationState.userOperand1 = '';
      console.log(`Current state: ${calculator.currentState} | clearStartingZeroOperand1(buttonClicked)
    Clearing leading 0. userOperand1 should now lead with non-zero number: >>>[${operationState.userOperand1}]<<< (should be empty)`);
    }
  }
}
```

### ADD ZERO IF DECIMAL ENTERED FIRST

Prepend a leading zero when a decimal is entered first, ensuring decimals display as `0.#` instead of `.#`.

```JS
function addLeadingZeroOperand1(buttonClicked) {
  if (
    // add a leading '0' in front of the decimal on the displayScreen so the user will see '0.#' rather than '.#'
    buttonClicked === '.'
  ) {
    operationState.userOperand1 = '0.';
    console.log(`Current state: ${calculator.currentState} | addLeadingZeroOperand1(buttonClicked)
    Adding leading 0. userOperand1 should now lead with zero and decimal: >>>[${operationState.userOperand1}]<<< (should be '0.')`);
  } else {
    operationState.userOperand1 = buttonClicked;
  }
}
```

```JS
function addLeadingZeroOperand2(buttonClicked) {
  // add a leading '0' in front of the decimal so the user will see '0.#' rather than '.#'
  if (buttonClicked === '.' && operationState.userOperand2 === '') {
    operationState.userOperand2 = '0';

    console.log(`Current state: ${calculator.currentState} | addLeadingZeroOperand2(buttonClicked)
    Adding leading 0. userOperand2 should now lead with zero: >>>[${operationState.userOperand2}]<<< (should be '0.')`);
  }
}
```

## Further reading

For more information, find The Odin Project's assignment page, [Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator), the [Design](/DESIGN.md) document, [DEV_LOG](/DEV_LOG.md), or the [README](/README.md).
