const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to validate and parse income input
function validateIncomeInput(input, fieldName) {
    const errors = [];
    
    // Check if input is provided
    if (!input || input.trim() === '') {
        errors.push(`${fieldName} is required`);
        return { isValid: false, errors, value: null };
    }
    
    // Remove any commas and dollar signs for parsing
    const cleanedInput = input.toString().replace(/[$,]/g, '').trim();
    
    // Check if it's a valid number
    if (isNaN(cleanedInput) || !isFinite(cleanedInput)) {
        errors.push(`${fieldName} must be a valid number`);
        return { isValid: false, errors, value: null };
    }
    
    const numericValue = parseFloat(cleanedInput);
    
    // Check for negative values (assuming income can't be negative in this context)
    if (numericValue < 0) {
        errors.push(`${fieldName} cannot be negative`);
        return { isValid: false, errors, value: null };
    }
    
    // Check for reasonable maximum (optional business rule)
    if (numericValue > 999999999.99) {
        errors.push(`${fieldName} is too large (maximum: $999,999,999.99)`);
        return { isValid: false, errors, value: null };
    }
    
    return { isValid: true, errors: [], value: numericValue };
}

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Helper function to format number with commas (for display in input fields)
function formatNumberWithCommas(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Route to display the tax form
app.get('/', (req, res) => {
    res.render('tax-form', {
        pageTitle: 'Income Tax Calculator',
        errors: [],
        formData: {
            primaryIncome: '',
            secondaryIncome: '',
            primarySource: '',
            secondarySource: ''
        },
        result: null
    });
});

// Route to handle form submission and calculate total income
app.post('/calculate', (req, res) => {
    const { primaryIncome, secondaryIncome, primarySource, secondarySource } = req.body;
    let errors = [];
    let result = null;
    
    // Store form data for re-populating the form in case of errors
    const formData = {
        primaryIncome: primaryIncome || '',
        secondaryIncome: secondaryIncome || '',
        primarySource: primarySource || '',
        secondarySource: secondarySource || ''
    };
    
    try {
        // Validate income source descriptions
        if (!primarySource || primarySource.trim() === '') {
            errors.push('Primary income source description is required');
        }
        
        if (!secondarySource || secondarySource.trim() === '') {
            errors.push('Secondary income source description is required');
        }
        
        // Validate primary income
        const primaryValidation = validateIncomeInput(primaryIncome, 'Primary income');
        if (!primaryValidation.isValid) {
            errors = errors.concat(primaryValidation.errors);
        }
        
        // Validate secondary income
        const secondaryValidation = validateIncomeInput(secondaryIncome, 'Secondary income');
        if (!secondaryValidation.isValid) {
            errors = errors.concat(secondaryValidation.errors);
        }
        
        // If no errors, calculate the total
        if (errors.length === 0) {
            const totalIncome = primaryValidation.value + secondaryValidation.value;
            
            result = {
                primaryIncome: primaryValidation.value,
                secondaryIncome: secondaryValidation.value,
                totalIncome: totalIncome,
                primaryIncomeFormatted: formatCurrency(primaryValidation.value),
                secondaryIncomeFormatted: formatCurrency(secondaryValidation.value),
                totalIncomeFormatted: formatCurrency(totalIncome),
                primarySource: primarySource.trim(),
                secondarySource: secondarySource.trim(),
                calculationDate: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };
            
            // Update form data with formatted values for display
            formData.primaryIncome = formatNumberWithCommas(primaryValidation.value);
            formData.secondaryIncome = formatNumberWithCommas(secondaryValidation.value);
        }
        
    } catch (error) {
        console.error('Calculation error:', error);
        errors.push('An unexpected error occurred during calculation. Please try again.');
    }
    
    res.render('tax-form', {
        pageTitle: 'Income Tax Calculator',
        errors: errors,
        formData: formData,
        result: result
    });
});

// Route to reset the form
app.get('/reset', (req, res) => {
    res.redirect('/');
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).render('error', {
        pageTitle: 'Page Not Found',
        errorMessage: 'The page you requested could not be found.',
        errorCode: 404
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('error', {
        pageTitle: 'Server Error',
        errorMessage: 'An internal server error occurred. Please try again later.',
        errorCode: 500
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('===========================================');
    console.log('🏛️  TAX FORM CALCULATOR SERVER STARTED  🏛️');
    console.log('===========================================');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log('📊 Ready to calculate your total income');
    console.log('⚡ All calculations are performed server-side');
    console.log('✅ Input validation enabled');
    console.log('===========================================');
});
