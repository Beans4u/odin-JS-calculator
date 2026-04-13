# Design

## Calculator MVP Constraints

Scope creep defeated me on the last assignment. This section determines the _minimum required scope_ as described on the [Calculator assignment page](https://www.theodinproject.com/lessons/foundations-calculator) to complete the assignment. Anything outside this should be treated as optional polish and deferred until MVP is fully working.

MVP: Basically, a state machine that correctly processes one pair of numbers at a time and supports chaining.

### 1. Core arithmetic functions

Implement and test:

- `add(a, b)`
- `subtract(a, b)`
- `multiply(a, b)`
- `divide(a, b)`

### 2. Core operate function

- `operate(operator, a, b)`
- Must call the correct arithmetic function based on the operator

### 3. Basic UI structure

- Buttons for digits (0–9)
- Buttons for operators (+, -, \*, /)
- `=` button
- `clear` button
- Display area (can start with placeholder text)

(No functionality required at this stage)

### 4. Input handling (core interaction)

- Clicking digits builds a number
- Display updates as user types
- Must store current input value(s)

### 5. Basic calculation flow

Must support:

- first number → operator → second number → `=`
- Result displayed after evaluation using `operate()`

### 6. Chained operations (required behavior)

Must support sequential calculations:

Example:  
12 + 7 - 1

Behavior:

- Evaluate `12 + 7`
- Use result as next first number
- Continue with next operator

### 7. Clear functionality

- Resets all stored values
- Resets display
- Returns calculator to initial state

### 8. Required edge-case handling

- Prevent division by zero (no crash)
- Handle repeated operator input (keep only last operator)
- Handle pressing `=` without complete input safely
- Round or limit long decimal outputs

## NOT part of MVP (avoid until everything above works and if there is still time)

- Keyboard support
- Backspace button
- Decimal input (`.`)
- Comma formatting (e.g. 1,000,000)
- UI polish / animations
- Expression parsing (parentheses, precedence)
- History feature
