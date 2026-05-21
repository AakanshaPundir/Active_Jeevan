const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ✅ Render Pages
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/bmi', (req, res) => res.render('bmi'));
router.get('/checkout', (req, res) => res.render('checkout'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/preferences', (req, res) => res.render('preferences'));
router.get('/trainer', (req, res) => res.render('trainer'));
router.get('/tracker', (req, res) => res.render('tracker'));

// ✅ Render user page with full user info
router.get('/user', (req, res) => {
    const user = req.session.user || { username: 'Guest' };
    res.render('user', { user });
});

// ✅ Render profile page with full user info
router.get('/profile', (req, res) => {
    const user = req.session.user || { username: 'Guest' };
    res.render('profile', { user });
});

// ✅ Login handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.user = user;
            return res.redirect('/user');
        } else {
            return res.redirect('/register');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


// ✅ Register handler with more fields
const User = require('../models/User'); // require the Mongoose model

router.post('/register', async (req, res) => {
    const { username, email, password, phone, condition, trainer } = req.body;

    try {
        const exists = await User.findOne({ $or: [ { username }, { email } ] });
        if (exists) {
            return res.status(400).send("User already exists!");
        }

        const newUser = new User({ username, email, password, phone, condition, trainer });
        await newUser.save();

        res.status(201).redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving user");
    }
});


module.exports = router;
