# Simple Calculator Specifications

## Overview
A simple, elegant web-based calculator that performs basic arithmetic operations.

## UI Components
- **Display**: 
  - Shows current input and results.
  - Clear distinction between current operand and previous history (optional but good).
- **Buttons**:
  - **Digits**: 0-9
  - **Decimal**: .
  - **Operators**: 
    - Add (+)
    - Subtract (-)
    - Multiply (*)
    - Divide (/)
  - **Actions**:
    - Equals (=) - Computes result
    - Clear (C) - Clears current entry (or all, for simplicity)
    - All Clear (AC) - Resets everything

## Functional Requirements

### Operations
1. **Addition (+)**: Sums two numbers.
2. **Subtraction (-)**: Subtracts second number from first.
3. **Multiplication (*)**: Multiplies two numbers.
4. **Division (/)**: Divides first number by second.
   - **Error Handling**: Division by zero should display "Error" or "Cannot divide by zero".

### Logic Behavior
- **Input Limit**: Reasonable character limit for display (e.g., 10-12 digits) to prevent overflow issues visually.
- **Chained Operations**: 
  - Example: `5 + 3 - 2 =` should equal `6`.
  - Pressing an operator after another operator should replace the first one (e.g., `5 +` -> `*` becomes `5 *`).
- **Floating Point**: Support decimal calculations (e.g., `0.1 + 0.2`). Note: Handle JS floating point precision if possible, but basic is fine for "simple".

## Tech Stack
- HTML5
- CSS3 (Vanilla, Modern Flexbox/Grid)
- JavaScript (Vanilla ES6+)
