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

### Step 5: Create and wire event handlers

TODO:

- [x] Decimals don't work in numberButtons.forEach (handleNumClickedDisplay), need to refactor.
  - I think this will work better if it handled display for all things based on conditions, return to calculator buttons delegation.
    - [x] Implement
- [x] create calc state for chaining operations
- [x] create and wire event handler to handle operations from user input

Once logic is complete:

- [] create and append text to the `display-screen`.
  - [] ...of numbers typed. clearing after beginning operand2 wait mode?
  - [] Clear then display result after `=` is clicked.

- Behaviour/testing:
  - [] reset `displayScreen` to `0` when `clear` is clicked
  - [x] Calculations chain if the user clicks on another operator instead of the `=`
  - [x] Clicking `=` does not calculate incomplete calculations, e.g. "1 + "
  - [x] When multiple operators are clicked, only the last one clicked is used
  - [x] disable the `.` button when used once per operand to handle that requirement. Use bool state?

### Step 6 & 7: "make it work", global error testing

- [x] On click of equals button / chaining operators: run `operate()` using stored values.
- [x] Result becomes the next first number.
- [x] long decimals are rounded (no overflow)
- [x] pressing `equals` with incomplete input does nothing
- [x] `clear` resets state
- [ ] `clear` resets display
- [x] division by zero shows 'snarky' error
  - [ ] convert to display from console log
- [x] operation only runs with: number -> operator -> number
- [x] repeated operators don't trigger calculation (last operator wins)
- [x] after displaying a result, entering a digit starts a new calculation

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
. _Prettier keeps erasing my empty paragraphs, so we're doing this Instagram-style_

## Below: TOP Calculator instructions

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
> i.e. create and wire event handler to the functions I previously made.

Your calculator’s display should also update to reflect the value of that number variable.

> i.e. wire the (same?) event handler to create and append text to the `display-screen`.

**Step six:**  
Make the calculator work! You’ll need to store the first and second numbers input by the user.

> isn't this handled in step 5?

... and then `operate()` on them when the user presses the `=` button, according to the operator that was selected between the numbers.

> isn't this handled in steps 3 and 5?

- Once operate has been called, update the display with the result of the operation.
- Figure out how to store all the values and call the operate function with them.

> i.e. again, aren't these step 5 problems? Methinks this step was just meant as a troubleshooting step.

**Step 7**
(a whole bunch of gotchas)

> i.e. my personal error testing checklist.
