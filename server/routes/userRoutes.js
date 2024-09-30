const router = require('express').Router();
const userCtrl = require('../controllers/auth');
const User = require('../models/User'); // Adjust path as necessary
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Path to store the image
    },
    filename: (req, file, cb) => {
        // Use the username from the request body to create a unique filename
        const username = req.body.username.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize the username
        const extension = path.extname(file.originalname);
        cb(null, `${username}${extension}`); // Save file as username_timestamp.extension
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/i; 
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

router.post('/register', upload.single('image'), async (req, res) => {
    let imagePath = req.file ? req.file.path : null;

    try {
        const { username, email, role, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Delete the uploaded image if user creation fails
            if (imagePath) {
                fs.unlinkSync(imagePath);
            }
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            role,
            password: hashedPassword,
            image: imagePath // Store the path to the image
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        // Delete the uploaded image if user creation fails
        if (imagePath) {
            fs.unlinkSync(imagePath);
        }
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);

module.exports = router;
