const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        githubId: { type: String, unique: true, sparse: true, trim: true },
        username: {
            type: String,
            required: [true, 'username is required'],
            trim: true,
            minlength: [3, 'username must be at least 3 characters']
        },
        displayName: { type: String, trim: true },
        email: {
            type: String,
            required: [true, 'email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+.\S+$/, 'a valid email is required']
        },
        role: { type: String, enum: ['student', 'admin'], default: 'student' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);