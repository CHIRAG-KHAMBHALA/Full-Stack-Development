const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse form data and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set view engine to handle HTML files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', (filePath, options, callback) => {
    const fs = require('fs');
    fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);
        const rendered = content.toString();
        return callback(null, rendered);
    });
});

// Helper function to validate if input is a number
function isValidNumber(input) {
    return !isNaN(input) && !isNaN(parseFloat(input)) && isFinite(input);
}

// Helper function to perform calculations
function calculate(num1, num2, operation) {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    
    switch (operation) {
        case 'add':
            return n1 + n2;
        case 'subtract':
            return n1 - n2;
        case 'multiply':
            return n1 * n2;
        case 'divide':
            if (n2 === 0) {
                throw new Error('Cannot divide by zero! 🤔');
            }
            return n1 / n2;
        default:
            throw new Error('Invalid operation selected! 😅');
    }
}

// Route to display the calculator form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'calculator.html'));
});

// Route to handle calculator operations
app.post('/calculate', (req, res) => {
    const { number1, number2, operation } = req.body;
    let result = null;
    let error = null;
    let operationSymbol = '';
    
    try {
        // Validate inputs
        if (!number1 || !number2) {
            throw new Error('Please enter both numbers! 📝');
        }
        
        if (!isValidNumber(number1)) {
            throw new Error('First number is not valid! Please enter numbers only. 🔢');
        }
        
        if (!isValidNumber(number2)) {
            throw new Error('Second number is not valid! Please enter numbers only. 🔢');
        }
        
        if (!operation) {
            throw new Error('Please select an operation! ➕➖✖️➗');
        }
        
        // Perform calculation
        result = calculate(number1, number2, operation);
        
        // Set operation symbol for display
        switch (operation) {
            case 'add': operationSymbol = '+'; break;
            case 'subtract': operationSymbol = '-'; break;
            case 'multiply': operationSymbol = '×'; break;
            case 'divide': operationSymbol = '÷'; break;
        }
        
        // Format result to avoid long decimals
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(2));
        }
        
    } catch (err) {
        error = err.message;
    }
    
    // Send response with calculation data
    res.send(generateResultPage(number1, number2, operation, operationSymbol, result, error));
});

// Function to generate the result page HTML
function generateResultPage(num1, num2, operation, symbol, result, error) {
    const fs = require('fs');
    let template = fs.readFileSync(path.join(__dirname, 'views', 'calculator.html'), 'utf8');
    
    // Insert result or error into the template
    let resultHTML = '';
    if (error) {
        resultHTML = `
            <div class="result error">
                <h2>Oops! Something went wrong! 😊</h2>
                <p>${error}</p>
                <p>Don't worry, try again! 💪</p>
            </div>
        `;
    } else {
        resultHTML = `
            <div class="result success">
                <h2>Great job! Here's your answer! 🎉</h2>
                <div class="calculation">
                    ${num1} ${symbol} ${num2} = <span class="answer">${result}</span>
                </div>
                <p>Well done! Want to try another calculation? 😊</p>
            </div>
        `;
    }
    
    // Replace the placeholder in the template
    template = template.replace('<!-- RESULT_PLACEHOLDER -->', resultHTML);
    
    // Pre-fill the form if there was an error
    if (error) {
        template = template.replace('value=""', `value="${num1 || ''}"`);
        template = template.replace(/value=""/g, `value="${num2 || ''}"`);
        if (operation) {
            template = template.replace(`value="${operation}"`, `value="${operation}" selected`);
        }
    }
    
    return template;
}

// Start the server
app.listen(PORT, () => {
    console.log(`🎉 Kids Calculator is running on http://localhost:${PORT}`);
    console.log('Have fun calculating! 🧮✨');
});
