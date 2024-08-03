import express from 'express';
import { config } from './config.js';
import Database from './database.js';

// Import App routes
import user from './user.js';
import openapi from './openapi.js';
import cors from 'cors';

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json()); // JSON parsing middleware

// Development only - don't do in production
// Run this to create the table in the database
if (process.env.NODE_ENV === 'development') {
  const database = new Database(config);
  database
    .executeQuery(
      `CREATE TABLE Users (
        id int NOT NULL IDENTITY PRIMARY KEY,
        email varchar(255) NOT NULL UNIQUE,
        password varchar(255),
        name varchar(255),
        company varchar(255)
      );`
    )
    .then(() => {
      console.log('Table created');
    })
    .catch((err) => {
      // Table may already exist
      console.error(`Error creating table: ${err}`);
    });
}

// Connect App routes
app.use('/api-docs', openapi);
app.use('/users', user);
app.use('*', (_, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
