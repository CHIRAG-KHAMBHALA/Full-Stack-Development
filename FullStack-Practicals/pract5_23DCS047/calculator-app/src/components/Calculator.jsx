import React from 'react';
import useCalculator from '../hooks/useCalculator';
import './Calculator.css';

const Calculator = () => {
  const {
    display,
    previousValue,
    operation,
    inputNumber,
    inputDecimal,
    clear,
    performOperation,
    handleEquals,
    handleBackspace
  } = useCalculator();

  return (
    <div className="calculator">
      <div className="display">
        <div className="previous-operation">
          {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
        </div>
        <div className="current-display">{display}</div>
      </div>
      <div className="buttons">
        <button className="operator" onClick={clear}>C</button>
        <button className="operator" onClick={handleBackspace}>⌫</button>
        <button className="operator" onClick={() => performOperation('/')}>÷</button>
        <button className="operator" onClick={() => performOperation('*')}>×</button>
        
        <button onClick={() => inputNumber(7)}>7</button>
        <button onClick={() => inputNumber(8)}>8</button>
        <button onClick={() => inputNumber(9)}>9</button>
        <button className="operator" onClick={() => performOperation('-')}>-</button>
        
        <button onClick={() => inputNumber(4)}>4</button>
        <button onClick={() => inputNumber(5)}>5</button>
        <button onClick={() => inputNumber(6)}>6</button>
        <button className="operator" onClick={() => performOperation('+')}>+</button>
        
        <button onClick={() => inputNumber(1)}>1</button>
        <button onClick={() => inputNumber(2)}>2</button>
        <button onClick={() => inputNumber(3)}>3</button>
        <button onClick={inputDecimal}>.</button>
        
        <button className="span-2" onClick={() => inputNumber(0)}>0</button>
        <button className="equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
