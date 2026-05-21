const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ── OLD: Mongoose User model (keep temporarily) ──────────────
const User = require('../models/User');

// ── NEW: Sequelize User model ─────────────────────────────────
const UserSQL = require('../models/UserSQL');

// ✅ Render Pages (no changes needed here)
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/bmi', (req, res) => res.render('bmi'));
router.get('/checkout', (req, res) => res.render('checkout'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/preferences', (req, res) => res.render('preferences'));
router.get('/trainer', (req, res) => res.render('trainer'));
router.get('/tracker', (req, res) => res.render('tracker'));

// ✅ Render user page
router.get('/user', (req, res) => {
    const user = req.session.user || { username: 'Guest' };
    res.render('user', { user });
});

// ✅ Render profile page
router.get('/profile', (req, res) => {
    const user = req.session.user || { username: 'Guest' };
    res.render('profile', { user });
});


// ── LOGIN ─────────────────────────────────────────────────────
// OLD Mongoose login (commented out, not deleted)
/*
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
*/

// ✅ NEW Sequelize login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // find user by email in MySQL
        const user = await UserSQL.findOne({ where: { email } });

        if (!user) {
            return res.render('login', { error: 'User not found' });
        }

        // compare entered password with hashed password in DB
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { error: 'Wrong password' });
        }

        // save user in session
        req.session.user = user;
        req.session.userId = user.id;
        return res.redirect('/user');

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


// ── REGISTER ──────────────────────────────────────────────────
// OLD Mongoose register (commented out, not deleted)
/*
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
*/

// ✅ NEW Sequelize register
router.post('/register', async (req, res) => {
    const { name, email, password, age, weight, height } = req.body;
    try {
        // check if email already exists in MySQL
        const exists = await UserSQL.findOne({ where: { email } });
        if (exists) {
            return res.render('register', { error: 'Email already registered' });
        }

        // create user — password is auto-hashed by beforeCreate hook in UserSQL.js
        await UserSQL.create({ name, email, password, age, weight, height });

        return res.redirect('/login');

    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Error registering user' });
    }
});


module.exports = router;