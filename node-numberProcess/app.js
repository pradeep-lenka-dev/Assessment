const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Placeholder arrays to simulate files A to D
let fileA = [];
let fileB = [];
let fileC = [];
let fileD = [];

let completedFiles = new Set();

app.use(bodyParser.json());

// Function to check if all files have at least one number
function checkCompletion() {
    return completedFiles.size === 4;
}

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Endpoint to handle number input and processing
app.post('/process-number', (req, res, next) => {
    if (checkCompletion()) {
        return res.status(400).json({ error: 'Input process already completed. No further numbers allowed.' });
    }

    const { number } = req.body;

    if (!number || typeof number !== 'number' || number < 1 || number > 25) {
        return res.status(400).json({ error: 'Invalid number. Please enter a number between 1 and 25.' });
    }

    const multipliedNumber = number * 7;

    if (multipliedNumber > 140) {
        fileA.push(multipliedNumber);
        completedFiles.add('A');
    } else if (multipliedNumber > 100) {
        fileB.push(multipliedNumber);
        completedFiles.add('B');
    } else if (multipliedNumber > 60) {
        fileC.push(multipliedNumber);
        completedFiles.add('C');
    } else {
        fileD.push(multipliedNumber);
        completedFiles.add('D');
    }

    // Check if all files have at least one number
    if (checkCompletion()) {
        res.redirect(303, '/get-files');
    } else {
        res.status(200).json({ message: 'Number processed successfully.' });
    }
});

// Endpoint to retrieve all numbers saved in files A to D
app.get('/get-files', (req, res) => {
    const files = {
        fileA: fileA,
        fileB: fileB,
        fileC: fileC,
        fileD: fileD
    };

    res.status(200).json(files);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
