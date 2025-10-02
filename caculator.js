let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

const calcScreen = document.getElementById('calc-screen');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operation]');
const clearButton = document.querySelector('[data-clear]');
const percentageButton = document.querySelector('[data-percentage]');
const equalsButton = document.querySelector('[data-equals]');

function initCalculator() {
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      appendNumber(button.textContent);
      updateDisplay();
    });
  });

  operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.textContent !== '=') {
        chooseOperation(button.textContent);
      }
    });
  });

  equalsButton.addEventListener('click', calculate);

  clearButton.addEventListener('click', clear);

  percentageButton.addEventListener('click', applyPercentage);

  const plusMinusButton = document.querySelector('.button-grid button:nth-child(2)');
  plusMinusButton.addEventListener('click', toggleSign);

  const decimalButton = document.querySelector('.button-grid button:nth-last-child(2)');
  decimalButton.addEventListener('click', appendDecimal);
}

function appendNumber(number) {
  if (currentOperand === '0' || shouldResetScreen) {
    currentOperand = number;
    shouldResetScreen = false;
  } else {
    currentOperand += number;
  }
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentOperand = '0.';
    shouldResetScreen = false;
    return;
  }

  if (!currentOperand.includes('.')) {
    currentOperand += '.';
  }
}

function chooseOperation(selectedOperation) {
  if (currentOperand === '') return;

  if (previousOperand !== '') {
    calculate();
  }

  operation = selectedOperation;
  previousOperand = currentOperand;
  shouldResetScreen = true;
}

function calculate() {
  if (previousOperand === '' || currentOperand === '' || operation === null) return;

  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let result;

  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '−':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      if (current === 0) {
        alert('Cannot divide by zero!');
        clear();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  result = Math.round(result * 100000000) / 100000000;

  currentOperand = result.toString();
  operation = null;
  previousOperand = '';
  shouldResetScreen = true;
  updateDisplay();
}

// Clear calculator
function clear() {
  currentOperand = '0';
  previousOperand = '';
  operation = null;
  updateDisplay();
}

function applyPercentage() {
  const current = parseFloat(currentOperand);
  currentOperand = (current / 100).toString();
  updateDisplay();
}

function toggleSign() {
  if (currentOperand !== '0') {
    currentOperand = currentOperand.startsWith('-')
      ? currentOperand.slice(1)
      : '-' + currentOperand;
    updateDisplay();
  }
}

function updateDisplay() {
  let displayValue = currentOperand;
  if (displayValue.length > 12) {
    const num = parseFloat(displayValue);
    displayValue = num.toExponential(6);
  }

  calcScreen.textContent = displayValue;
}

document.addEventListener('keydown', (event) => {
  if (event.key >= '0' && event.key <= '9') {
    appendNumber(event.key);
    updateDisplay();
  } else if (event.key === '.') {
    appendDecimal();
    updateDisplay();
  } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
    let operationSymbol;
    switch (event.key) {
      case '+': operationSymbol = '+'; break;
      case '-': operationSymbol = '−'; break;
      case '*': operationSymbol = '×'; break;
      case '/': operationSymbol = '÷'; break;
    }
    chooseOperation(operationSymbol);
  } else if (event.key === 'Enter' || event.key === '=') {
    calculate();
  } else if (event.key === 'Escape' || event.key === 'Delete') {
    clear();
  } else if (event.key === '%') {
    applyPercentage();
  }
});

document.addEventListener('DOMContentLoaded', initCalculator);
