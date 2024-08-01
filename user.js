import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import Database from './database.js';

const router = express.Router();
router.use(express.json());

const database = new Database(config);

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, company } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const rowsAffected = await database.createUser({
      email,
      password: hashedPassword,
      name,
      company
    });

    res.status(201).json({ rowsAffected });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await database.readUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(authHeader,"authheader")
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid or missing authorization header' });
      }
  
      const token = authHeader.split(' ')[1];
      console.log('Token:', token); // For debugging purposes, remove or comment out in production
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      const user = await database.readUserById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error('Error:', err.message); // More detailed error logging
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      res.status(500).json({ error: err.message });
    }
  });

export default router;
