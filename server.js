// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Configure multer to save files in the 'uploads' folder with the original filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Adding a timestamp to avoid name conflicts
    }
});

// Define file filter to allow specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'audio/mpeg', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

// Set up multer to use the storage and fileFilter options
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Serve static files from a "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to handle the base URL
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload Project!');
});

// Endpoint for uploading multiple files
app.post('/upload', upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    res.send('Files uploaded successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
