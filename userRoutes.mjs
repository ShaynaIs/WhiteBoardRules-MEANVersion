import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connectDB from "./conn.mjs";

dotenv.config();
const router = express.Router();
const db = await connectDB();
const users = db.collection("users");

// User registration
router.post('/register', async (req, res) => {
    const { firstname, lastname, username, email, password, icon_url } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await createUser(firstname, lastname, username, email, hashedPassword, icon_url);
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Attempting to login username: " + username);
    const user = await findUserByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: token, username: user.username, icon_url: user.icon_url});
    } else {
        res.status(401).send('Invalid credentials');
    }
});



async function createUser(firstname, lastname, username, email, passwordHash, icon_url) {
    return await users.insertOne({ firstname, lastname, username, email, password: passwordHash, icon_url: icon_url });
}

async function findUserByUsername(username) {
    return await users.findOne({ username });
}

export default router;