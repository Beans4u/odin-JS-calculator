// + + + + + + CORE OPERATION FUNCTIONS + + + + + + +

// - - - - - CALCULATION FUNCTIONS CALLED IN operate() - - - - - -

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
    return console.log(
      'operate(num1, num2, op) | Error catch: Please enter a valid number'
    ); //placeholder error handling, will be updated to append to UI
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
      return console.log(
        'operate(num1, num2, op) | SWITCH default: there was an error'
      ); // TODO: placeholder error handling, will be updated to append to UI
  }
}

// + + + + + + FSM DATA, LABELS, AND DISPATCH + + + + + + +

// - - - STATE MANAGEMENT / LABELS - - - -

// "State" and "mode" are used interchangeably in this document.

const STATES = {
  IDLE: 'IDLE', // calculator hasn't been used yet. The user can enter the initial number or decimal for the first operand.
  // Allows the user to begin operations and stores the initial number or decimal in userOperand1. Exits on number or decimal clicked and begins mode OPERAND1_ACTIVE.

  OPERAND1_ACTIVE: 'OPERAND1_ACTIVE', // the user is entering numbers and optionally a decimal into the first operand. Stores initial number or decimal in userOperand1.
  // Gives the user space to build the first operand, and exits on operator clicked to OPERAND2_WAIT.

  OPERAND2_WAIT: 'OPERAND2_WAIT', // the user entered the first operand and clicked an operator, but did not enter numbers for second operand yet. Updates currentOperator if another operator button is clicked.
  // Gives user a chance to change the operator, and exits on number or decimal clicked.

  OPERAND2_ACTIVE: 'OPERAND2_ACTIVE', // the user is entering numbers and optionally a decimal for the second operand. On click of equals button or another operator, calls operate().
  // Gives user a chance to build the second operand and submit the operation for calculation by clicking a second operator for chaining, or the equals sign. Exits to RESULT.

  RESULT: 'RESULT', // the user calculated an operation, but did not yet enter additional numbers for a chained operation or clicked clear. If clear button or a number is clicked, moves to CLEAR_CALCULATOR to start fresh, and if the operation is chained, returns to OPERAND2_ACTIVE to continue building userOperand2. Exits on click of clear, number, or operator button.

  CLEAR_CALCULATOR: 'CLEAR_CALCULATOR', // the user wants to start fresh. Clears and resets the calculator, then returns to IDLE mode.
  // Gives the user the option to start a new calculation (chain) from scratch.
};

// - - - OPERATION DATA - - - -

const operationState = {
  userOperand1: '0',
  userOperand2: '0',
  currentOperator: '',
  nextOperator: '',
};

// - - - CALCULATOR: CURRENT STATE, DECIMAL USED & EQUALS USED BOOLS - - - -

const calculator = {
  currentState: STATES.IDLE,
  decimalUsed: false,
  equalsUsed: false,
};

// - - - DOM ELEMENTS - - - -

const calculatorButtons = document.querySelector('#button-container');

// - - - - - FSM DISPATCH - - - - - -
calculatorButtons.addEventListener('click', function handleInput(event) {
  const buttonValue = event.target.getAttribute('data-value');

  // clear '0' from userOperand1 if the user starts with a non-zero number.
  clearZeroOperand1(buttonValue);

  // change mode to CLEAR_CALCULATOR on click of 'clear' button to reset calculator for user
  if (event.target.matches('[data-value="clear"]'))
    calculator.currentState = STATES.CLEAR_CALCULATOR;

  // + + + FSM SWITCH STATEMENT + + +
  switch (calculator.currentState) {
    case STATES.CLEAR_CALCULATOR:
      resetCalculator();
      clearDisplay();

      break;

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
      // limit one decimal per operand
      if (limitDecimalsUsed(buttonValue)) return;

      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
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

        // displayScreen to keep 0 placeholder in userOperand1 and userOperand2 if `0` or `.` are the first buttons clicked.
        clearZeroOperand2(buttonValue);
        addZeroOperand2(buttonValue);

        // display leading zero / decimal if not cleared
        displayOperation(buttonValue);

        // set/update userOperand2 with number or decimal for use in operate() call
        updateUserOperand2(buttonValue);

        // display updated userOperand2
        displayOperation(buttonValue);

        // activate OPERAND2_ACTIVE state to continue building operand2 or select operator
        changeStateToOperand2Active();
      }

      break;

    case STATES.OPERAND2_ACTIVE:
      // limit one decimal per operand
      if (limitDecimalsUsed(buttonValue)) return;

      // displayScreen to keep 0 placeholder in userOperand1 and userOperand2 if `0` or `.` are the first buttons clicked.
      clearZeroOperand2(buttonValue);

      /// ---------- NUMBER OR DECIMAL CLICKED ------------
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // update userOperand2 for use in operate() call
        updateUserOperand2(buttonValue);

        //display updated userOperand2
        displayOperation(buttonValue);
      }

      /// ---------- EQUALS OR OPERATOR CLICKED ------------

      if (event.target.classList.contains('btn-ops') || buttonValue === '=') {
        clearDisplay();

        // Set equalsUsed to control chaining (in STATES.RESULT, a number after '=' triggers CLEAR_CALCULATOR).
        flipEqualsUsedToTrue(buttonValue);

        // Set nextOperator for use in OPERAND2_WAIT if an operator was clicked
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
      // clear nextOperand before sending back to OPERAND2_ACTIVE if user chains operation, which otherwise would conflict with display logic.
      updateChainedOperator();

      // limit one decimal per operand
      if (limitDecimalsUsed(buttonValue)) return;

      // ensure the last-clicked operator is used in operate() call
      if (event.target.classList.contains('btn-ops')) {
        updateCurrentOperator(buttonValue);

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
        clearZeroOperand2(buttonValue);
        // updateChainedOperator();
        updateUserOperand2(buttonValue);
        // display updated userOperand2
        displayOperation(buttonValue);
        console.log(
          `Current state: ${calculator.currentState} | Displaying operation
            User selected number or decimal for userOperand2. Checking operators...
            nextOperator: >>>[${operationState.nextOperator}]<<< (must be empty)
            currentOperator: >>>[${operationState.currentOperator}]<<< (must have value)`
        );
        changeStateToOperand2Active();
      }
      // if equals was used, then a number or decimal was clicked, clear calculator to begin building a new operation.
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
      // if equals was used, then a new operator was clicked, update the operator and chain operation.
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

// + + + + + + + + HELPER FUNCTIONS + + + + + + + + + +

// - - - OPERATIONS - - - -

function callOperate() {
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

// - - - UPDATE OPERATORS - - - -

function updateCurrentOperator(buttonClicked) {
  if (event.target.classList.contains('btn-ops')) {
    // ensure the last-clicked operator is used in operate() call
    operationState.currentOperator = buttonClicked;
    console.log(
      `Current state: ${calculator.currentState} | updateCurrentOperator(buttonClicked)  \n User updated currentOperator to: ${operationState.currentOperator}`
    );
  }
}

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

// - - - UPDATE OPERANDS - - - -

function updateUserOperand1(buttonClicked) {
  operationState.userOperand1 += buttonClicked;
  console.log(
    `Current state: ${calculator.currentState} | updateUserOperand1(buttonClicked)
    User updated number for Operand1: ${operationState.userOperand1}`
  );
}

function updateUserOperand2(buttonClicked) {
  operationState.userOperand2 += buttonClicked;
  console.log(
    `Current state: ${calculator.currentState} | updateUserOperand2(buttonClicked)
    User updated number for Operand2: ${operationState.userOperand2}`
  );
}

// - - - UPDATE BOOLS - - - -

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

// - - - RESET DATA - - - -

function resetDataForChaining() {
  operationState.userOperand2 = '0';
  if (calculator.decimalUsed) calculator.decimalUsed = false;
  console.log(
    `Current state: ${calculator.currentState} | resetDataForChaining()
    Resetting decimalUsed and userOperand2 to allow for chained operations...
    decimalUsed bool (must be false): ${calculator.decimalUsed}
    userOperand2 -->[${operationState.userOperand2}]<-- (must be zero).`
  );
}

function resetCalculator() {
  // Reset states
  calculator.currentState = STATES.IDLE;
  calculator.equalsUsed = false;

  // data wipe
  operationState.userOperand1 = '0';
  operationState.userOperand2 = '0';
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

function resetCalculatorFromResult(buttonClicked) {
  // Reset states
  calculator.currentState = STATES.OPERAND1_ACTIVE;
  calculator.equalsUsed = false;

  // data wipe
  addZeroOperand1(buttonClicked); // if decimal clicked, adds a zero in front of it, otherwise uses number value clicked.
  operationState.userOperand2 = '0';
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

// - - - - - CHANGE STATES - - - - - -

// - - - OPERANDS - - - -

function changeStateToOperand1Active() {
  calculator.currentState = STATES.OPERAND1_ACTIVE;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToOperand1Active()
    Switching to mode OPERAND1_ACTIVE. 
    Waiting for user to use an operator or to continue adding numbers to Operand1...`
  );
}

function changeStateToOperand2Wait() {
  calculator.currentState = STATES.OPERAND2_WAIT;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToOperand2Wait()
    Switching to mode OPERAND2_WAIT. 
    Waiting for user to update userOperand2 or use an operator...`
  );
}

function changeStateToOperand2Active() {
  calculator.currentState = STATES.OPERAND2_ACTIVE;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToOperand2Active()
    Switching to OPERAND2_ACTIVE mode. 
    Waiting for user to use an operator or select more numbers for userOperand2...`
  );
}

// - - - RESULT & CLEAR_CALCULATOR - - - -

function changeStateToResult() {
  calculator.currentState = STATES.RESULT;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToResult()
    Changing to RESULT mode. 
    If equals clicked: Waiting for user to clear or use an operator to chain operation...
    If chained from operator: Waiting for user to clear or update userOperand2...`
  );
}

function changeStateToClearCalculator() {
  // if equals was used, then a new number or decimal was clicked, clear calculator to begin building a new operation.
  calculator.currentState = STATES.CLEAR_CALCULATOR;

  console.log(
    `Current state: ${calculator.currentState} | changeStateToClearCalculator()
    equalsUsed (must be true): ${calculator.equalsUsed}
    Switching to CLEAR_CALCULATOR mode to clear data...`
  );

  return;
}

// + + + + + + DISPLAY SCREEN + + + + + + +

// - - - DOM ELEMENTS - - - -

let displayScreen = document.getElementById('display-screen');

// - - - DISPLAY USER CLICKS - - - -

function displayOperation(buttonClicked) {
  // prevent equals from displaying
  if (buttonClicked === '=') return;

  // create a space around the operator
  if (event.target.classList.contains('btn-ops')) {
    displayScreen.textContent = `${operationState.userOperand1} ${operationState.currentOperator}`;
  }

  if (event.target.classList.contains('btn-nums') || buttonClicked === '.') {
    // display currentOperator instead of nextOperator
    if (operationState.nextOperator === '') {
      // do not display userOperand2 if not building yet
      if (operationState.userOperand2 === '0') {
        displayScreen.textContent = `${operationState.userOperand1} ${operationState.currentOperator}`;
      } else if (operationState.userOperand2 !== '0') {
        displayScreen.textContent = `${operationState.userOperand1} ${operationState.currentOperator} ${operationState.userOperand2}`;
      }
    }
    // display nextOperator instead of currentOperator
    if (operationState.nextOperator) {
      // do not display userOperand2 if not building yet
      if (operationState.userOperand2 === '0') {
        displayScreen.textContent = `${operationState.userOperand1} ${operationState.nextOperator}`;
      } else if (operationState.userOperand2 !== '0') {
        displayScreen.textContent = `${operationState.userOperand1} ${operationState.nextOperator} ${operationState.userOperand2}`;
      }
    }
  }

  return;
}

// - - - DISPLAY RESULT - - - -

function displayResult(buttonClicked) {
  if (buttonClicked === '=')
    displayScreen.textContent = operationState.userOperand1;

  if (operationState.userOperand1 == 'Infinity') {
    return (displayScreen.textContent = 'One does not simply divide by 0!');
  }
  if (operationState.nextOperator) {
    if (event.target.classList.contains('btn-ops'))
      return (displayScreen.textContent = `${operationState.userOperand1} ${operationState.nextOperator}`);
  } else if (operationState.nextOperator === '') {
    return (displayScreen.textContent = `${operationState.userOperand1} ${operationState.currentOperator}`);
  }
}

// - - - CLEAR DISPLAY - - - -

function clearDisplay() {
  displayScreen.textContent = '0';
  console.log(`Current state: ${calculator.currentState} | clearDisplay()
    Clearing display.`);
}

// - - - CLEAR ZERO IF NON-ZERO TYPED FIRST - - - -

function clearZeroOperand1(buttonClicked) {
  // ensure operator and equals buttons don't clear the screen
  if (event.target.classList.contains('btn-nums') || buttonClicked === '.') {
    if (
      // remove the leading '0' from the displayScreen so the user will see one digit when typing a non-zero number rather than two digits starting with 0.
      buttonClicked !== 0 &&
      operationState.userOperand1 === '0' &&
      buttonClicked !== '.'
    ) {
      displayScreen.textContent = '';
      operationState.userOperand1 = '';
      console.log(`Current state: ${calculator.currentState} | clearZeroOperand1(buttonClicked) 
    Clearing leading 0. userOperand2 should now lead with non-zero number: >>>[${operationState.userOperand2}]<<< (should be empty)`);
    }
  }
}

function addZeroOperand1(buttonClicked) {
  // ensure operator and equals buttons don't clear the screen
  if (event.target.classList.contains('btn-nums') || buttonClicked === '.') {
    if (
      // add a leading '0' in front of the decimal on the displayScreen so the user will see 0.# rather than .#
      buttonClicked === '.'
    ) {
      operationState.userOperand1 = '0.';
      console.log(`Current state: ${calculator.currentState} | addZeroOperand1(buttonClicked) 
    Adding leading 0. userOperand1 should now lead with zero: >>>[${operationState.userOperand1}]<<< (should be '0.')`);
    } else {
      operationState.userOperand1 = buttonClicked;
    }
  }
}

function clearZeroOperand2(buttonClicked) {
  if (
    (buttonClicked !== '0' || buttonClicked !== '.') &&
    operationState.userOperand2.length === 1 &&
    operationState.userOperand2 === '0' &&
    buttonClicked !== '.'
  ) {
    operationState.userOperand2 = '';
    console.log(`Current state: ${calculator.currentState} | clearZeroOperand2() 
    Clearing leading 0. userOperand2 should now lead with non-zero number: >>>[${operationState.userOperand2}]<<< (should be empty)`);
  }
}

function addZeroOperand2(buttonClicked) {
  if (
    (buttonClicked === '0' || buttonClicked === '.') &&
    operationState.userOperand2 === '0'
  ) {
    operationState.userOperand2 = '0';
    console.log(`Current state: ${calculator.currentState} | clearZeroOperand2(buttonClicked) 
    Keeping leading 0 for decimal. Display should now show '0.': ${operationState.userOperand2}`);
  }
}
