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

// - - - - -  RETURN CALCULATED RESULT IN operate() - - - - - -

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
      if (secondOperand === 0) {
        return console.log(
          "operate(num1, num2, op) | Divide by zero error: So you thought you'd divide by zero, eh?"
        );
      }
      return divideNums(firstOperand, secondOperand);
    default:
      return console.log(
        'operate(num1, num2, op) | SWITCH default: there was an error'
      ); //placeholder error handling, will be updated to append to UI
  }
}

// - - - - - FSM DATA, LABELS, AND DISPATCH - - - - - -

// - - - STATE MANAGEMENT / LABELS - - - -

const STATES = {
  IDLE: 'IDLE', // calculator hasn't been used yet. The user can enter the initial number or decimal for the first operand.
  // Allows the user to begin operations and stores the initial number or decimal in userOperand1. Exits on number or decimal clicked and begins mode OPERAND1_ACTIVE.

  OPERAND1_ACTIVE: 'OPERAND1_ACTIVE', // the user is entering numbers and optionally a decimal into the first operand. Stores initial number or decimal in userOperand1.
  // Gives the user space to build the first operand, and exits on operator clicked to OPERAND2_WAIT.

  OPERAND2_WAIT: 'OPERAND2_WAIT', // the user entered the first operand and clicked an operator, but did not enter numbers for second operand yet. Updates currentOperator if another operator button is clicked.
  // Gives user a chance to change the operator, and exits on number or decimal clicked.

  OPERAND2_ACTIVE: 'OPERAND2_ACTIVE', // the user is entering numbers and optionally a decimal for the second operand. On click of equals button or another operator, calls operate().
  // Gives user a chance to build the second operand and submit the operation for calculation by clicking a second operator for chaining, or the equals sign. Exits to RESULT.

  RESULT: 'RESULT', // the user calculated an operation, but did not yet enter additional numbers for a chained operation or clicked clear. If clear button or a number is clicked, moves to CLEAR_CALCULATOR to start fresh, and if an operator is clicked, returns to OPERAND2_WAIT to allow user to chain calculations. Exits on click of clear, number, or operator button.

  CLEAR_CALCULATOR: 'CLEAR_CALCULATOR', // the user wants to start fresh. Clears and resets the calculator and returns to IDLE mode.
  // Gives the user the option to start a new calculation (chain) from scratch.
};

// - - - OPERATION STATE / DATA - - - -

const operationState = {
  userOperand1: '',
  userOperand2: '',
  currentOperator: '',
  nextOperator: '',
};

// - - - CALCULATOR STATE, DECIMAL USED BOOL - - - -

const calculator = {
  currentState: STATES.IDLE,
  decimalUsed: false,
  equalsUsed: false,
};

// - - - DOM ELEMENTS - - - -

const calculatorButtons = document.querySelector('#button-container');

// - - - FSM DISPATCH - - - -
calculatorButtons.addEventListener('click', function handleInput(event) {
  const dataValue = event.target.getAttribute('data-value');

  // change mode to CLEAR_CALCULATOR on click of 'clear' button to reset calculator for user
  if (event.target.matches('[data-value="clear"]'))
    calculator.currentState = STATES.CLEAR_CALCULATOR;

  switch (calculator.currentState) {
    case STATES.CLEAR_CALCULATOR:
      console.log('>>> STATE: CLEAR_CALCULATOR <<<');
      resetCalculator();

      break;

    case STATES.IDLE:
      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // limit one decimal per operand
        if (limitDecimalsUsed(dataValue)) return;

        // update userOperand1 for use in OPERAND1_ACTIVE mode
        updateUserOperand1(dataValue);

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
        if (limitDecimalsUsed(dataValue)) return;

        // update userOperand1 for use in operate() call
        updateUserOperand1(dataValue);
      }

      if (event.target.classList.contains('btn-ops')) {
        // if user clicks operator, store it for the operate() call, and move to state OPERAND2_WAIT

        updateCurrentOperator(event, dataValue);

        // reset decimalUsed to allow use in userOperand2
        if (calculator.decimalUsed) calculator.decimalUsed = false;

        // activate OPERAND2_WAIT mode to start building the second operand

        changeStateToOperand2Wait();
      }

      break;

    case STATES.OPERAND2_WAIT:
      // ensure the last-clicked operator is used in operate() call

      updateCurrentOperator(event, dataValue);

      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // limit one decimal per operand
        if (limitDecimalsUsed(dataValue)) return;

        // set/update userOperand2 with number or decimal for use in operate() call
        updateUserOperand2(dataValue);

        // activate OPERAND2_ACTIVE to continue building operand2 or select operator
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
        if (limitDecimalsUsed(dataValue)) return;

        // update userOperand2 for use in operate() call
        updateUserOperand2(dataValue);
      }

      /// ---------- EQUALS OR OPERATOR CLICKED ------------
      if (event.target.classList.contains('btn-ops') || dataValue === '=') {
        // Set equalsUsed to control chaining (in STATE.RESULTS, a number after '=' triggers CLEAR_CALCULATOR).
        flipEqualsUsedToTrue(dataValue);

        // Set nextOperator for use in OPERAND2_WAIT if an operator was clicked
        updateNextOperator(event, dataValue);

        // call operate(userOperand1, userOperand2, currentOperator), using userOperand1 as the new starting value for chained operations for use in OPERAND2_WAIT

        callOperate();

        // TODO: display result
        console.log(
          `Current state: ${calculator.currentState}
          The result of the operation is: ${operationState.userOperand1}`
        );

        // reset userOperand2 and decimalUsed bool for use in chained operation
        resetDataForChaining();

        // change to RESULT mode
        changeStateToResult();
      }

      break;

    case STATES.RESULT:
      // return state to OPERAND2_WAIT to chain calculations on click of number or decimal if operator was used instead of equals
      if (
        calculator.equalsUsed === false &&
        (event.target.classList.contains('btn-nums') ||
          event.target.matches('[data-value="."]'))
      ) {
        console.log(`Current state: ${calculator.currentState}
          User clicked ${dataValue}. Changing to OPERATION2_WAIT mode...`);
        updateChainedOperator();
        updateUserOperand2(dataValue);
        changeStateToOperand2Active();
      }
      // if equals was used, then a new number or decimal was clicked, clear calculator to begin building a new operation.
      if (
        calculator.equalsUsed === true &&
        (event.target.classList.contains('btn-nums') ||
          event.target.matches('[data-value="."]'))
      ) {
        console.log(`Current state: ${calculator.currentState}
          User clicked ${dataValue}. Changing to CLEAR_CALCULATOR mode...`);
        calculator.equalsUsed = false;
        changeStateToClearCalculator(event, dataValue);
      }
      // if equals was used, then a new operator was clicked, update the operator and chain operation.
      if (
        calculator.equalsUsed === true &&
        event.target.classList.contains('btn-ops')
      ) {
        console.log(`Current state: ${calculator.currentState}
          User clicked ${dataValue}. Changing to OPERATION2_WAIT mode...`);
        calculator.equalsUsed = false;
        updateCurrentOperator(event, dataValue);
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

// - - - - - - - HELPER FUNCTIONS - - - - - - - -

// - - - - - OPERATIONS - - - - - -

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

function chainOperation(event) {
  if (event.target.classList.contains('btn-ops')) {
    // return state to OPERAND2_WAIT to chain calculations
    calculator.currentState = STATES.OPERAND2_WAIT;
    console.log(
      `Current state: ${calculator.currentState} | chainOperation(event)
      Returning to OPERAND2_WAIT. Waiting for user to enter first number for userOperand2...`
    );
  }
}

// - - - - - UPDATE OPERATORS - - - - - -

function updateCurrentOperator(event, buttonClicked) {
  const button = buttonClicked;
  if (event.target.classList.contains('btn-ops')) {
    // ensure the last-clicked operator is used in operate() call
    operationState.currentOperator = button;
    console.log(
      `Current state: ${calculator.currentState} | updateCurrentOperator(event, buttonClicked)  \n User updated currentOperator to: ${operationState.currentOperator}`
    );
  }
}

function updateNextOperator(event, buttonClicked) {
  const button = buttonClicked;
  if (event.target.classList.contains('btn-ops')) {
    operationState.nextOperator = button;
    console.log(
      `Current state: ${calculator.currentState} | updateNextOperator(event, buttonClicked)
      User selected additional operator to chain operation.
      User updated nextOperator to: ${operationState.nextOperator}`
    );
  }
}

function updateChainedOperator() {
  operationState.currentOperator = operationState.nextOperator;
  operationState.nextOperator = '';
}

// - - - - - UPDATE OPERANDS - - - - - -

function updateUserOperand1(buttonClicked) {
  const button = buttonClicked;
  operationState.userOperand1 += button;
  console.log(
    `Current state: ${calculator.currentState} | updateUserOperand1(buttonClicked)
    User updated number for Operand1: ${operationState.userOperand1}`
  );
}

function updateUserOperand2(buttonClicked) {
  const button = buttonClicked;
  operationState.userOperand2 += button;
  console.log(
    `Current state: ${calculator.currentState} | updateUserOperand2(buttonClicked)
    User updated number for Operand2: ${operationState.userOperand2}`
  );
}

// - - - - - UPDATE BOOLS - - - - - -

function flipEqualsUsedToTrue(buttonClicked) {
  const button = buttonClicked;
  if (button === '=') {
    calculator.equalsUsed = true;
    console.log(
      `Current state: ${calculator.currentState} | flipEqualsUsedToTrue(buttonClicked)
      equalsUsed = ${calculator.equalsUsed}
      User has selected equals and calculation will begin shortly...`
    );
  }
}

function limitDecimalsUsed(clickedButton) {
  // limit one decimal per operand
  if (clickedButton === '.') {
    if (calculator.decimalUsed) return true;
    calculator.decimalUsed = true;
  }
  return false;
}

// - - - - - RESET DATA - - - - - -

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

function resetCalculator() {
  // Reset states
  calculator.currentState = STATES.IDLE;
  calculator.equalsUsed = false;

  // data wipe
  operationState.userOperand1 = '';
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

// - - - - - CHANGE STATES - - - - - -
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

function changeStateToResult() {
  calculator.currentState = STATES.RESULT;
  console.log(
    `Current state: ${calculator.currentState} | changeStateToResult()
    Changing to RESULT mode. 
    If equals clicked: Waiting for user to clear or use an operator to chain operation...
    If chained from operator: Waiting for user to clear or update userOperand2...`
  );
}

function changeStateToClearCalculator(event, clickedButton) {
  // if equals was used, then a new number or decimal was clicked, clear calculator to begin building a new operation.
  calculator.currentState = STATES.CLEAR_CALCULATOR;

  console.log(
    `Current state: ${calculator.currentState} | changeStateToClearCalculator(event, clickedButton)
    equalsUsed (must be true): ${calculator.equalsUsed}
    Switching to CLEAR_CALCULATOR mode to clear data...`
  );

  return;
}
