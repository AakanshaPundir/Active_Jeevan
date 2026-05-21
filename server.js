const express = require('express');
const path = require('path');
const app = express();
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
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


/*const mongoose = require('mongoose');
mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));*/


// Routes
app.use('/', apiRoutes);

// Error handler
app.use(errorHandler);

app.listen(8080, () => {
    console.log('🚀 Server running on http://localhost:8080');
});
