# Project Journal

**Purppse:** to create a space for me to work through problems.

## MVP Focus

Single-operation calculator (a operator b), chained step-by-step, with safe state handling and clear/reset functionality. See [DESIGN constraints](DESIGN.md) for more.

## Project planning, next steps

2026-04-13  
Need to start thinking about project. I think I'll follow along with the assignment workflow to get started. I should commit my skeleton first.

### Assignment page instructions, interpreted

2026-04-13  
**Required behaviour:**

- [] Support chained operations (e.g. `12 + 7 - 1`).
- [] Only calculate when 2 numbers + operator exist.
- [] Clear resets all state.
- [] Handle divide by zero safely.
- [] Repeated operators don't trigger calc (last op wins).

**Step 1 & 2: create calculation logic**

- [x] Create math operator functions for add, sub, mult, div.
- [x] Test in browser console.

**Step 3: create function for calc logic**

- [x] Create `operate()` function, will take operator and 2 nums
- [x] Calls math function based on operator used.

**Step 4: create UI**

- [] Create the HTML UI with num & op buttons.
- [] Create `clear` and `equals` buttons.
- [] Create display screen for calculations.

**Step 5: event handling, input**  
_On button click:_

- [] Update display.
- [] Store input in calc state (first num, op, second num).

**Step 6: calc, state flow**

- [] On click of equals button / chaining operators: run `operate()` using stored values.
- [] Display result of `operate()` on screen.
- [] Result becomes the next first number.

**Step 7: error testing:**

- [x] long decimals are rounded (no overflow)
- [ ] pressing `equals` with incomplete input does nothing
- [ ] `clear` resets state and display
- [ ] division by zero shows 'snarky' error
- [ ] operation only runs with: number -> operator -> number
- [ ] repeated operators don't trigger calculation (last operator wins)
- [ ] after displaying a result, entering a digit starts a new calculation
