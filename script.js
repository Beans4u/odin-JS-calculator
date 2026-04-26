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

  RESULT: 'RESULT', // the user calculated an operation, but did not yet enter additional numbers for a chained operation or clicked clear. If clear button or a number is clicked, moves to CLEAR_CLICKED to start fresh, and if an operator is clicked, returns to OPERAND2_WAIT to allow user to chain calculations. Exits on click of clear, number, or operator button.

  CLEAR_CLICKED: 'CLEAR_CLICKED', // the user wants to start fresh. Clears and resets the calculator and returns to IDLE mode.
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

  // change mode to CLEAR_CLICKED on click of 'clear' button to reset calculator for user
  if (event.target.matches('[data-value="clear"]'))
    calculator.currentState = STATES.CLEAR_CLICKED;

  switch (calculator.currentState) {
    case STATES.CLEAR_CLICKED:
      console.log('>>> STATE: CLEAR_CLICKED <<<');
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
        console.log('>>> STATE: IDLE <<<');
        updateUserOperand1(dataValue);

        // move to mode OPERAND1_ACTIVE to continue building operand1 or select operator
        console.log('>>> STATE: IDLE <<<');
        changeToOperand1ActiveState();
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
        console.log('>>> STATE: OPERAND1_ACTIVE <<<');
        updateUserOperand1(dataValue);
      }

      if (event.target.classList.contains('btn-ops')) {
        // if user clicks operator, store it for the operate() call, and move to state OPERAND2_WAIT
        console.log('>>> STATE: OPERAND1_ACTIVE <<<');
        updateCurrentOperator(event, dataValue);

        // reset decimalUsed to allow use in userOperand2
        if (calculator.decimalUsed) calculator.decimalUsed = false;

        // activate OPERAND2_WAIT mode to start building the second operand
        console.log('>>> STATE: OPERAND1_ACTIVE <<<');
        changeToOperand2WaitState();
      }

      break;

    case STATES.OPERAND2_WAIT:
      // ensure the last-clicked operator is used in operate() call
      console.log('>>> STATE: OPERAND2_WAIT <<<');
      updateCurrentOperator(event, dataValue);

      if (
        event.target.classList.contains('btn-nums') ||
        event.target.matches('[data-value="."]')
      ) {
        // limit one decimal per operand
        if (limitDecimalsUsed(dataValue)) return;

        // set/update userOperand2 with number or decimal for use in operate() call
        console.log('>>> STATE: OPERAND2_WAIT <<<');
        updateUserOperand2(dataValue);

        // activate OPERAND2_ACTIVE to continue building operand2 or select operator
        console.log('>>> STATE: OPERAND2_WAIT <<<');
        changeToOperand2ActiveState();
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
        console.log('>>> STATE: OPERAND2_ACTIVE <<<');
        updateUserOperand2(dataValue);
      }

      /// ---------- EQUALS OR OPERATOR CLICKED ------------

      if (dataValue === '=' || event.target.classList.contains('btn-ops')) {
        // Set equalsUsed to control chaining (in STATE.RESULTS, a number after '=' triggers CLEAR_CLICKED).
        flipEqualsUsedToTrue(dataValue);

        // Set nextOperator for use in OPERAND2_WAIT if an operator was clicked
        console.log('>>> STATE: OPERAND2_ACTIVE <<<');
        updateNextOperator(event, dataValue);

        // call operate(userOperand1, userOperand2, currentOperator), using userOperand1 as the new starting value for chained operations for use in OPERAND2_WAIT
        console.log('>>> STATE: OPERAND2_ACTIVE <<<');
        callOperate();

        // reset userOperand2 and decimalUsed bool for use in chained operation
        console.log('>>> STATE: OPERAND2_ACTIVE <<<');
        resetDataForChaining();

        // change to RESULT state after operate() call, on click of `=` or operator.
        console.log('>>> STATE: OPERAND2_ACTIVE <<<');
        changeToResultState();
      }

      break;

    case STATES.RESULT:
      if (
        calculator.equalsUsed === false &&
        (event.target.classList.contains('btn-num') ||
          event.target.matches('[data-value="."]'))
      ) {
        // return state to OPERAND2_WAIT to chain calculations
        console.log('>>> STATE: RESULT <<<');
        changeToClearClickedState(event, dataValue);
      }

      break;

    default:
      console.error(
        '>>> STATE: DEFAULT <<< \n An error has occurred. Calculator in DEFAULT state.'
      );
  }
});

// - - - - - - - HELPER FUNCTIONS - - - - - - - -

// - - - - - OPERATIONS - - - - - -

function callOperate() {
  console.log(
    `--- callOperate() --- \n operate() called. Operation: ${operationState.userOperand1} ${operationState.currentOperator} ${operationState.userOperand2}`
  );
  operationState.userOperand1 = operate(
    operationState.userOperand1,
    operationState.userOperand2,
    operationState.currentOperator
  );
  console.log(
    '--- callOperate() --- \n result of operate() and new starting value of userOperand1: ',
    operationState.userOperand1
  );
}

function chainOperation(event) {
  if (event.target.classList.contains('btn-ops')) {
    // return state to OPERAND2_WAIT to chain calculations
    calculator.currentState = STATES.OPERAND2_WAIT;
    console.log(
      '--- chainOperation(event) --- \n Returning to OPERAND2_WAIT. Waiting for user to enter first number for userOperand2...'
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
      '--- updateCurrentOperator(event, buttonClicked) --- \n User updated currentOperator to: ',
      operationState.currentOperator
    );
  }
}

function updateNextOperator(event, buttonClicked) {
  const button = buttonClicked;
  if (event.target.classList.contains('btn-ops')) {
    operationState.nextOperator = button;
    console.log(
      '--- updateNextOperator(event, buttonClicked) --- \n User selected additional operator to chain operation. \n User updated nextOperator to: ',
      operationState.nextOperator
    );
  }
}

// - - - - - UPDATE OPERANDS - - - - - -

function updateUserOperand1(buttonClicked) {
  const button = buttonClicked;
  operationState.userOperand1 = button;
  console.log(
    '--- updateUserOperand1(buttonClicked) --- \n User updated number for Operand1: ',
    operationState.userOperand1
  );
}

function updateUserOperand2(buttonClicked) {
  const button = buttonClicked;
  operationState.userOperand2 += button;
  console.log(
    '--- updateUserOperand2(buttonClicked) --- \n User updated number for Operand2: ',
    operationState.userOperand2
  );
}

// - - - - - UPDATE BOOLS - - - - - -

function flipEqualsUsedToTrue(buttonClicked) {
  const button = buttonClicked;
  if (button === '=') {
    calculator.equalsUsed = true;
    console.log(
      '--- flipEqualsUsedToTrue(buttonClicked) --- \n equalsUsed = ',
      calculator.equalsUsed,
      '\n User has selected equals and calculation will begin shortly...'
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
    '--- resetDataForChaining() --- \n Resetting decimalUsed and userOperand2 to allow for chained operations... \n decimalUsed bool (must be false): ',
    calculator.decimalUsed,
    '\n userOperand2 -->[ ',
    operationState.userOperand2,
    ']<-- (must be empty): '
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
    '--- resetCalculator() --- \n clearing data then returning to IDLE mode...'
  );
}

// - - - - - CHANGE STATES - - - - - -
function changeToOperand1ActiveState() {
  calculator.currentState = STATES.OPERAND1_ACTIVE;
  console.log(
    '--- changeToOperand1ActiveState() --- \n Switching to mode OPERAND1_ACTIVE. Waiting for user to use an operator or to continue adding numbers to Operand1...'
  );
}

function changeToOperand2WaitState() {
  calculator.currentState = STATES.OPERAND2_WAIT;
  console.log(
    '--- changeToOperand2WaitState() --- \n Switching to mode OPERAND2_WAIT. Waiting for user to enter first number for userOperand2...'
  );
}

function changeToOperand2ActiveState() {
  calculator.currentState = STATES.OPERAND2_ACTIVE;
  console.log(
    '--- changeToOperand2ActiveState() --- \n Switching to OPERAND2_ACTIVE mode. Waiting for user to use an operator or select more numbers for userOperand2...'
  );
}

function changeToResultState() {
  calculator.currentState = STATES.RESULT;
  console.log(
    '--- changeToResultState() --- \n Changing to RESULT mode. Waiting for user to clear or select a new initial number for userOperand2...'
  );
}

// TODO: not working yet. Returns to OPERAND2_WAIT when number is clicked.
function changeToClearClickedState(event, clickedButton) {
  if (calculator.equalsUsed === true) {
    if (event.target.classList.contains('btn-nums') || clickedButton === '.') {
      // clear if next button pressed is a number.
      calculator.currentState = STATES.CLEAR_CLICKED;

      console.log(
        '--- changeToClearClickedState(event, clickedButton) --- \n Switching to CLEAR_CLICKED mode to clear data... \n equalsUsed (must be true): ',
        calculator.equalsUsed
      );
    }
  }

  return;
}
