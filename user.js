import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import Database from './database.js';
import admin from 'firebase-admin';
const serviceAccount={
    "type": "service_account",
    "project_id": "assignment-4c669",
    "private_key_id": "412002d2c51a78f2c6d19c829c8d549e04004cc4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDW/enGSwaMCtFQ\nc/FneiiP4/lvRFH00DLnIPUWYwZxLk3X5old8qJEaIIRWuAxddEgy9C0dCGMN0nv\nDti9XhoS3zJ/T0naClnIzud4bp0VLussNfqOe8hQQCzMDs5eKSy+QCjpi4JNz0Yf\nPOMs0rMNq3KXpfCLNUj2eWrpR8Ox15DQWYC0Klmbk7/pnFHeN/IAznipHVMaRrAd\nSYmhtyl4EIdU8djdg9spoGn1TFJ417xkHr7w+VjJhlXDAeF72atwBBhkiEGOhmWN\n/EH2TOKkmxtWYiIyrmqvgWJPzbL7YXQ+rKG0t1VBYy+m1o2jAKqO6v3KvjXrIEn0\nhjwcNXHfAgMBAAECggEAEfFH+N4bEkX22RWMEJw/1V5r207i3iEgFm0IN1GVYI3C\nPmIFldshkr78F/GzIz2XcfrAlMbaY+bbW0GscgVv/KI3Byv5WGKjwqAN7l2g63sq\nclqg6hJHkfcBJhiYPYCHNOuK3o7flZnWWtYMiZmeCuaDnkdhj2SnjbZtZ0GvgeB6\nExbMrYJgCd0vpTmY4pZ4cX2IM/4UVkcRWBn5nagABvxAons53oUrzoty3RqdH3C3\nahfQQUhcnZn636Z3iwuOsu/CG2JLC2IORQ9fKg5kBcqE2wiFqngTgiF0NRfq455y\nF3eomDnVCBhS62p4N4+ofCUw/POZPQ+QAzwXfy7yJQKBgQDsXFWL3GOoCwh8nme8\nzYjptckQsbEfx9CcZONHZDkzWQNYsyEGGwL9H9abnjZl15P26WxgU9VveYuJlHqp\nfFRStHzzrpe1jx8EgeFUXlKdXkey3gTR30uqjMyJYwgtHcTk2RsPeTYA3EVW33xQ\ne5banMasJCNvQN8TPWYS6O4AywKBgQDo2woHUP+nL6WpE08RmsnlosIdZ6vXAYQ0\n2a+vhhTILs/KsUSUPXtOPj6otNxL+B5zglyzO5faJjmibPM8U7focpWUqWCN+ogK\ntcRIEjTR6k4ium98+mXpMoFAnoH77fpG/lQXBg6rMsLbb3U3O0+xZDKKmxYlKCtm\nL2Le4m0UvQKBgQDpr0SY+fXBn97tLsQLw/44axV2nugrLqgO6CRZYjq3jKslWD0v\nRyeGUaMhyqOnvyM4fII9HsWn6DjQdm9sAFNyTaY4Wwb9Z5pYH31Dp9nwYtVqf92u\nDiJGZdyXfMUJriQLyqbZfpKo+R7JDD5haD+2tkgqy7QI+89Ru2OfEJK3TwKBgQCC\nGvENiXpu5baAM+O4CG7KuhgP6f8f0R8XkJITVq2B9HXx4P5afcfJvgmwpe15HReW\nnr5A/wknwLfvQ0Tc7kIRxQRC3iiu687bfRhA1LtilrI1wUnN4PLUS33gpzAlnaB7\nzlsZyi6kBWbOyQYLaD5s9Xkv7NuAw2MMY2mw837TWQKBgQDVW4CCaFGUuCy29OwM\n9UAzkYXEdzyDTU/KDW0vFt1mKq/TpZCtNlTq2hSFOyoToUe2hWPzHr5DjUpKmOmX\n2qT1T7a7bj0xKgIHVe2MLdSA8+0ctLdzzDeGFxqkDmHH6K5beQamJCL0R4rldlhf\nLYe/j0dGYanhkNiXrJ+KxZgAmA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-wpvf6@assignment-4c669.iam.gserviceaccount.com",
    "client_id": "106169587741702481557",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wpvf6%40assignment-4c669.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
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