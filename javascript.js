document.addEventListener('DOMContentLoaded', function() {
    // Display elements
    const currentOperationDisplay = document.getElementById('current-operation');
    const previousOperationDisplay = document.getElementById('previous-operation');
    
    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let resetScreen = false;
    let fullEquation = '';
    
    // Operator symbols mapping
    const operatorSymbols = {
      '+': ' + ',
      '-': ' − ',
      '*': ' × ',
      '/': ' ÷ '
    };
    
    // Event listeners for number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', () => {
        appendNumber(button.getAttribute('data-number'));
      });
    });
    
    // Event listeners for operator buttons
    document.querySelectorAll('[data-operator]').forEach(button => {
      button.addEventListener('click', () => {
        appendOperator(button.getAttribute('data-operator'));
      });
    });
    
    // Event listeners for special buttons
    document.getElementById('clear-btn').addEventListener('click', clearDisplay);
    document.getElementById('backspace-btn').addEventListener('click', backspace);
    document.getElementById('decimal-btn').addEventListener('click', appendDecimal);
    document.getElementById('equals-btn').addEventListener('click', calculate);
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboard);
    
    function handleKeyboard(e) {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        appendNumber(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        appendDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        appendOperator(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
      }
    }
    
    function updateDisplay() {
      // Always show the full equation being built in the current display
      currentOperationDisplay.textContent = fullEquation || currentOperand;
      previousOperationDisplay.textContent = previousOperand;
    }
    
    function appendNumber(number) {
      if (currentOperand === '0' || resetScreen) {
        currentOperand = number;
        resetScreen = false;
      } else if (currentOperand.length < 12) {
        currentOperand += number;
      }
      
      // Update the full equation
      if (operation === null) {
        // We're working on the first operand
        fullEquation = currentOperand;
      } else {
        // We're working on the second operand
        const parts = fullEquation.split(operatorSymbols[operation]);
        fullEquation = parts[0] + operatorSymbols[operation] + currentOperand;
      }
      
      updateDisplay();
    }
    
    function appendDecimal() {
      if (resetScreen) {
        currentOperand = '0.';
        resetScreen = false;
      } else if (!currentOperand.includes('.')) {
        currentOperand += '.';
      }
      
      // Update the full equation
      if (operation === null) {
        fullEquation = currentOperand;
      } else {
        const parts = fullEquation.split(operatorSymbols[operation]);
        fullEquation = parts[0] + operatorSymbols[operation] + currentOperand;
      }
      
      updateDisplay();
    }
    
    function clearDisplay() {
      currentOperand = '0';
      previousOperand = '';
      operation = null;
      fullEquation = '0';
      resetScreen = false;
      updateDisplay();
    }
    
    function backspace() {
      if (currentOperand.length === 1) {
        currentOperand = '0';
      } else {
        currentOperand = currentOperand.slice(0, -1);
      }
      
      // Update full equation
      if (operation === null) {
        fullEquation = currentOperand;
      } else {
        const parts = fullEquation.split(operatorSymbols[operation]);
        fullEquation = parts[0] + operatorSymbols[operation] + currentOperand;
      }
      
      updateDisplay();
    }
    
    function appendOperator(op) {
      if (operation !== null) {
        // If we already have an operation, calculate the result first
        calculate(false);
      }
      
      operation = op;
      
      // Update full equation
      fullEquation = currentOperand + operatorSymbols[op];
      
      resetScreen = true;
      updateDisplay();
    }
    
    function calculate(showResult = true) {
      if (operation === null) return;
      
      let computation;
      const parts = fullEquation.split(operatorSymbols[operation]);
      const prev = parseFloat(parts[0]);
      const current = parseFloat(currentOperand);
      
      if (isNaN(prev) || isNaN(current)) return;
      
      switch (operation) {
        case '+':
          computation = prev + current;
          break;
        case '-':
          computation = prev - current;
          break;
        case '*':
          computation = prev * current;
          break;
        case '/':
          if (current === 0) {
            currentOperand = 'Error';
            fullEquation = 'Error';
            updateDisplay();
            return;
          }
          computation = prev / current;
          break;
        default:
          return;
      }
      
      // Format the result
      if (computation.toString().includes('.') && computation.toString().split('.')[1].length > 8) {
        computation = computation.toFixed(8);
      }
      
      // Move the full equation to the previous display and show result
      if (showResult) {
        previousOperand = fullEquation + ' =';
        currentOperand = computation.toString();
        fullEquation = computation.toString();
        operation = null;
        resetScreen = true;
      } else {
        currentOperand = computation.toString();
        fullEquation = computation.toString();
      }
      
      updateDisplay();
    }
    
    // Initialize
    updateDisplay();
  });