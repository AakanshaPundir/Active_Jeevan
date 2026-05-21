// models/UserSQL.js

// Step 1: Import DataTypes from sequelize
// DataTypes lets us define what kind of data each column holds
// (STRING = VARCHAR, INTEGER, FLOAT, TEXT, BOOLEAN, DATE, etc.)
const { DataTypes } = require('sequelize');

// Step 2: Import our Sequelize MySQL connection from config/db.js
// This is the same sequelize instance we set up and tested earlier
const sequelize = require('../config/db');

// Step 3: Import bcrypt for password hashing
// bcrypt turns plain passwords into secure hashed strings
// It's one-way — you can verify but never reverse it
const bcrypt = require('bcrypt');

// Step 4: Define the User model
// sequelize.define('ModelName', { columns }, { options })
// 'User' becomes the table name 'Users' automatically (Sequelize pluralizes it)
const User = sequelize.define('User', {

  // ── id ────────────────────────────────────────────────────────────────────
  // Every table needs a primary key
  // Sequelize adds this automatically, but being explicit is good practice
  id: {
    type: DataTypes.INTEGER,         // INTEGER column in MySQL
    autoIncrement: true,             // auto-increments: 1, 2, 3...
    primaryKey: true                 // marks this as the primary key
  },

  // ── name ──────────────────────────────────────────────────────────────────
  name: {
    type: DataTypes.STRING,          // VARCHAR(255) in MySQL
    allowNull: false,                // cannot be empty — required field
    validate: {
      notEmpty: true,                // rejects empty string ''
      len: [2, 100]                  // name must be between 2 and 100 characters
    }
  },

  // ── email ─────────────────────────────────────────────────────────────────
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,                    // no two users can have the same email
    validate: {
      isEmail: true                  // Sequelize checks it's a valid email format
    }
  },

  // ── password ──────────────────────────────────────────────────────────────
  // We store only the hashed version, never plain text
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]                  // minimum 6 characters before hashing
    }
  },

  // ── age ───────────────────────────────────────────────────────────────────
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,                 // optional field
    validate: {
      min: 1,                        // age must be at least 1
      max: 120                       // age cannot exceed 120
    }
  },

  // ── weight ────────────────────────────────────────────────────────────────
  // Stored in kg, supports decimals like 72.5
  weight: {
    type: DataTypes.FLOAT,           // FLOAT allows decimal numbers
    allowNull: true,
    validate: {
      min: 1,
      max: 500
    }
  },

  // ── height ────────────────────────────────────────────────────────────────
  // Stored in cm, supports decimals like 175.5
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 30,
      max: 300
    }
  },

  // ── avatar ────────────────────────────────────────────────────────────────
  // Stores the file path or URL of the user's profile picture
  // e.g. '/uploads/avatars/user123.jpg' or a full URL
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,                 // optional — not everyone uploads a photo
    defaultValue: '/images/default-avatar.png'  // fallback image
  }

}, {
  // ── Table Options ──────────────────────────────────────────────────────────

  tableName: 'users',                // exact MySQL table name (lowercase)
  timestamps: true,                  // automatically adds createdAt + updatedAt columns

});

// ── Step 5: Hash password BEFORE saving to database ───────────────────────
// This is a Sequelize "hook" — it runs automatically before every INSERT
// So even if someone forgets to hash in the route, it's always hashed here
User.beforeCreate(async (user) => {
  // 10 is the "salt rounds" — higher = more secure but slower
  // 10 is the recommended balance for most apps
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// ── Step 6: Also hash password on UPDATE (if it was changed) ──────────────
// Without this, if a user changes their password it would save as plain text
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {    // only re-hash if password field was modified
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// ── Step 7: Add comparePassword method ────────────────────────────────────
// Instance method — called on a specific user object, e.g:
//   const user = await User.findOne({ where: { email } });
//   const isMatch = await user.comparePassword('plainTextPassword');
User.prototype.comparePassword = async function (plainPassword) {
  // bcrypt.compare checks if plainPassword matches this user's hashed password
  // Returns true if match, false if not
  return await bcrypt.compare(plainPassword, this.password);
};

// Step 8: Export the model so routes can use it
module.exports = User;