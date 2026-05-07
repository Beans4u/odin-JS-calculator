# Project Journal

**Purpose:** to create a space for me to work through problems.

## MVP Focus

Single-operation calculator (a operator b), chained step-by-step, with safe state handling and clear/reset functionality. See [DESIGN constraints](DESIGN.md) for more.

## Project planning, next steps: Assignment page instructions, interpreted

Starting fresh - I misunderstood some instructions three days ago when I parsed this, which confused me when I worked on it later with less-fresh eyes. I re-parsed the instructions, and need to refactor some of my work.

### Steps 1 & 2: Create functions that return result of calculation

- [x] Create functions add, subtract, multiply, divide, that returns result of said calcs.
- [x] Behaviour/testing:
  - [x] Must round to 2 _(for now - the requirement is that they don't overflow the display screen iirc)_
  - [x] Handle divide by zero safely.

### Step 3: Create operate() that calls the above calc functions

- [x] Create `operate(operand, operand, operator)`.
- [x] Create variables for the operator and operands

### Step 4: Create HTML skeleton of calculator

- [x] Create the HTML UI with num & op buttons.
- [x] Create `clear` and `equals` buttons.
- [x] Create display screen for calculations with dummy numbers.
- [x] I also went ahead and filled it with classes and data-attributes I assumed I'd be using later :D

### Step 5a: Create and wire event handlers

TODO:

- [x] Decimals don't work in numberButtons.forEach (handleNumClickedDisplay), need to refactor.
  - I think this will work better if it handled display for all things based on conditions, return to calculator buttons delegation.
    - [x] Implement
- [x] create calc state for chaining operations
- [x] create and wire event handler to handle operations from user input

- Behaviour/testing:
  - [x] Calculations chain if the user clicks on another operator instead of the `=`
  - [x] Clicking `=` does not calculate incomplete calculations, e.g. "1 + "
  - [x] When multiple operators are clicked, only the last one clicked is used
  - [x] disable the `.` button when used once per operand to handle that requirement. Use bool state?

  ### Step 5b: Display numbers on screen

create and append text to the `display-screen`:

- [x] Display updates as user enters numbers/decimal
- [x] Clear screen then display result when `=` is clicked.
- [x] Reset `displayScreen` to `0` when `clear` is clicked
- [x] Result displayed after evaluation using `operate()`

### Step 6 & 7: "make it work", global error testing

<details>
<summary>Steps 6 and 7: QA</summary>
**Step 6:**  
Make the calculator work! You’ll need to store the first and second numbers input by the user and then operate() on them when the user presses the = button, according to the operator that was selected between the numbers.
You should already have the code that can populate the display, so once operate has been called, update the display with the result of the operation.
This is the hardest part of the project. You need to figure out how to store all the values and call the operate function with them. Don’t feel bad if it takes you a while to figure out the logic.

Make the calculator work! You’ll need to store the first and second numbers input by the user.

> isn't this handled in step 5?

... and then `operate()` on them when the user presses the `=` button, according to the operator that was selected between the numbers.

> isn't this handled in steps 3 and 5?

- Once operate has been called, update the display with the result of the operation.
- Figure out how to store all the values and call the operate function with them.

> i.e. again, aren't these step 5 problems? These are likely intended as troubleshooting steps.

**Step 7:**  
GOTCHAS (assignment page): watch out for and fix these bugs if they show up in your code:

- [x] Your calculator must not evaluate more than one pair of numbers at a time.
- [x] Enter a number (12).
- [x] Enter an operator (+).
- [x] Enter a second number (7).
- [x] Enter another operator (-): evaluate 12 + 7, must display 19.
- [x] Enter another number (1).
- [x] Enter another operator or equals (=): evaluate 19 - 1, must display 18.
- [x] Review this flow with: 12 + 7 - 1 = into the calculator.
- [x] Round long decimals to prevent display overflow.
- - [x] **TODO:** I phoned it in by limiting to two decimals. Find a better solution.
- [x] Pressing = too early may cause issues.
- [x] Pressing clear must fully reset all data.
- [x] Bug: clicking an operand before initial numbers displays operands on the `displayScreen`, and more than one decimal can be printed. I broke something on refactor of CLEAR_CALCULATOR.
- [x] Show a snarky error if dividing by 0 (don’t crash).
- [x] Only evaluate when two numbers and an operator are present. If an operator button is clicked more than once, use the last-clicked operator in the operation.
- - [x] Bug: `displayScreen` clears on multiple operators clicked
- [x] After showing a result, entering a digit must start a new calculation (not append).
- - [x] Bug: chaining from `equals` clears `displayScreen` and displays only `userOperand2`

COMPLETE:

- [x] Bug: `userOperand1` retains new value when number or decimal is clicked after equals sign.
- [x] Check for redundancy in clearZeroOperand1, the comment I wrote said zero doesn't clear if `0` is clicked first, but it should be that only if the operand as a decimal before any non-zero number.
- [x] On click of equals button / chaining operators: run `operate()` using stored values.
- [x] Result becomes the next first number.
- [x] long decimals are rounded (no overflow)
- [x] pressing `equals` with incomplete input does nothing
- [x] `clear` resets state
- [x] `clear` resets display
- [x] division by zero shows 'snarky' error
  - [x] convert to display from console log
- [x] operation only runs with: number -> operator -> number
- [x] repeated operators don't trigger calculation (last operator wins)
- [x] after calculating the result, entering a digit starts a new calculation
</details>

## Below: parsing the TOP calculator assignment instructions

> The [instructions from TOP](https://www.theodinproject.com/lessons/foundations-calculator) that I re-parsed. My space to think through the text.

**Step 1:**  
 Your calculator is going to contain functions for all of the basic math operators you typically find on calculators, so start by creating functions for the following items and testing them in your browser’s console:

- add
- subtract
- multiply
- divide

> translation: create calc functions to obtain the result for the above calculation types

**Step two:**  
A calculator operation will consist of a number, an operator, and another number. For example, 3 + 5.  
Create three variables, one for each part of the operation. You’ll use these variables to update your display later.

> Translation: operate() will use a number + operator + number, e.g. 3 + 5. Create a variable for each of those (total of three), e.g. `num1`, `num2`, `OPERATOR`

**Step three:**  
Create a new function `operate` that takes an operator and two numbers and then calls one of the above functions on the numbers.

> Translation:
>
> - Create `operate()` with parameters for `num1`, `num2`, and `OPERATOR`, so: `operate(number1, number2, operator)`.
> - It calls one of the four calc functions we just made

**Step four:**  
Create a basic HTML calculator with buttons for each digit and operator (including `=`).

- Don’t worry about making them functional just yet.
- There should also be a display for the calculator. Go ahead and fill it with some dummy numbers so it looks correct.
- Add a “clear” button.

> translation: create HTML skeleton of calculator including a display with dummy numbers.
> I also went ahead and filled it with classes and data-attributes I assumed I'd be using later

**Step five:**  
Create the functions that update one of your number variables when the calculator’s digit buttons are clicked.

> "one of your number variables", I assuming `num1` and `num2`, as required.
> i.e. create and wire event handler for the functions I previously made.

Your calculator’s display should also update to reflect the value of that number variable.

> i.e. wire an event handler to create and append text to the `display-screen`. This should really be a separate step to encourage separation of concerns.

**Step six:**  
Make the calculator work! You’ll need to store the first and second numbers input by the user.

> isn't this handled in step 5?

... and then `operate()` on them when the user presses the `=` button, according to the operator that was selected between the numbers.

> isn't this handled in steps 3 and 5?

- Once operate has been called, update the display with the result of the operation.
- Figure out how to store all the values and call the operate function with them.

> i.e. again, aren't these step 5 problems? These are likely intended as troubleshooting steps.

**Step Seven**

Gotchas: watch out for and fix these bugs if they show up in your code:

- Your calculator should not evaluate more than a single pair of numbers at a time. For example, this is how your calculator should function:
- Enter a number (12).
- Enter an operator (+).
- Enter a second number (7).
- Enter a second operator (-). At this point, it should evaluate the initial pair of numbers (12 + 7), then display the result (19).
- Enter another number (1).
- Enter another operator or equals sign (=). At this point, it should use the previous result (19) as the first number, the operator (-), and the new number (1) to calculate the new equation 19 - 1. You should see the result (18) on the display.
- To see what this looks like in action, feel free to input the equation we just explained 12 + 7 - 1 = into this online calculator.
- You should round answers with long decimals so that they don’t overflow the display.
- Pressing = before entering all of the numbers or an operator could cause problems!
- Pressing “clear” should wipe out any existing data. Make sure the user is really starting fresh after pressing “clear”.
- Display a snarky error message if the user tries to divide by 0… and don’t let it crash your calculator!
- Make sure that your calculator only runs an operation when supplied with two numbers and an operator by the user. Example: you enter a number (2), followed by an operator button (+). You press the operator button (+) a second consecutive time. Your calculator should not evaluate this as (2 + 2) and should not display the result (4). If consecutive operator buttons are pressed, your calculator should not run any evaluations, it should only take the last operator entered to be used for the next operation.
- When a result is displayed, pressing a new digit should clear the result and start a new calculation instead of appending the digit to the existing result. Check whether this is the case on your calculator!

> translation:
> i.e. my personal error testing checklist. Step 6 should be consolidated with step 7 as a project finalization checklist.
>
> - [ ] Your calculator must not evaluate more than one pair of numbers at a time.
> - [ ] Enter a number (12).
> - [ ] Enter an operator (+).
> - [ ] Enter a second number (7).
> - [ ] Enter another operator (-): evaluate 12 + 7, must display 19.
> - [ ] Enter another number (1).
> - [ ] Enter another operator or equals (=): evaluate 19 - 1, must display 18.
> - [ ] Review this flow with: 12 + 7 - 1 = into the calculator.
> - [ ] Round long decimals to prevent display overflow.
> - [ ] Pressing = too early may cause issues.
> - [ ] Pressing clear must fully reset all data.
> - [ ] Show a snarky error if dividing by 0 (don’t crash).
> - [ ] Only evaluate when two numbers and an operator are present. If an operator button is clicked more than once, use the last-clicked operator in the operation.
> - [ ] After showing a result, entering a digit must start a new calculation (not append).
