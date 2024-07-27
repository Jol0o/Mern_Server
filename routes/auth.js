const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const auth = require('../middleware/authmiddleware');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ msg: 'User registered' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/updateUser', auth, async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ msg: 'User details updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
