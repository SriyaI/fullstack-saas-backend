import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import Database from './database.js';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount={
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID? process.env.FIREBASE_PRIVATE_KEY.replace(/\n/gm, "\n") : undefined,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
  }
  

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const router = express.Router();
router.use(express.json());

const database = new Database(config);

router.post('/google-signin', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Add this line to log the request body
    const { idToken } = req.body;
    console.log("Received ID Token:", idToken); // Add this line to log the idToken

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken.token);
    console.log('Decoded Token:', decodedToken);

    // Find or create user in your database
    let user = await database.readUserByEmail(decodedToken.email);

    if (!user) {
      // Create a new user if not found in the database
      user = await database.createUser({
        email: decodedToken.email,
        name: decodedToken.name,
        // Add other user properties if needed
      });
    }
    console.log(user,"user")
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '2m'
      });
    console.log(token, "token")
    res.status(200).json({ token });

    // Generate and return JWT token if needed

  } catch (error) {
    console.error('Error during Google Sign-In:', error.message);
    res.status(401).json({ error: 'Invalid ID token' });
  }
});

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
    console.log(user,"user")
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '2m'
    });
    console.log(token, "token")
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