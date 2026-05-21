require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// ── ADD THIS LINE (was missing) ──────────────────────────────
const sequelize = require('./config/db');
// ─────────────────────────────────────────────────────────────

const apiRoutes = require('./routes/apiRoutes');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(logger);
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.SESSION_SECRET,  // ← use .env
    resave: false,
    saveUninitialized: true
}));

// ── MongoDB (keep temporarily) ───────────────────────────────
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// ── MySQL via Sequelize ──────────────────────────────────────
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connected successfully via Sequelize'))
  .catch(err => console.error('❌ MySQL connection failed:', err.message));
// ─────────────────────────────────────────────────────────────


// This creates the 'users' table in MySQL if it doesn't exist yet
// { alter: true } updates columns if you change the model later
// Never use { force: true } in production — it DROPS and recreates the table
sequelize.sync({ alter: true })
  .then(() => console.log('✅ MySQL tables synced'))
  .catch(err => console.error('❌ Sync error:', err));
// Routes
app.use('/', apiRoutes);

// Error handler
app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 8080}`);
});