# Secure SaaS Application

This repository contains a Secure SaaS application with login functionality, developed using React for the frontend and Node.js for the backend. The application is deployed on Azure and includes end-to-end UI testing with Cypress.

## Azure Deployment as CI/CD pipeline:
- **Frontend**: Azure static web app
  - [Live Demo](https://white-bush-038b79700.5.azurestaticapps.net)
- **Backend**: Azure webapp

## Table of Contents
- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Testing](#testing)
- [Deployment](#deployment)

## Project Overview

This project is a secure SaaS application that allows users to register, log in, and view their profile. It uses JWT for authentication and integrates Google Sign-In via Firebase. The backend is built with Node.js, and the frontend is developed using React. Cypress is used for end-to-end UI testing.

Landing page/Login Page

<img src="https://github.com/user-attachments/assets/0c2d59c9-411f-4820-907e-0d84fe719611" alt="Description" style="width: 300px; height: auto;">

Click Register in the page for New user

<img src="https://github.com/user-attachments/assets/3e7d8101-636a-4900-bec9-c9bbbb00d77e" alt="Description" style="width: 300px; height: auto;">

After Register is submitted, it will take you back to Login screen. Give the Login credentials which are created and click Login. You will see the profile screen as below.

<img src="https://github.com/user-attachments/assets/99b5f4fd-9925-42e1-b189-498f5693593f" alt="Description" style="width: 300px; height: auto;">

For Sign in with google account, go to Login page/Landing page

<img src="https://github.com/user-attachments/assets/0c2d59c9-411f-4820-907e-0d84fe719611" alt="Description" style="width: 300px; height: auto;">

After Sign in with Google, Profile of the user is displayed.

<img src="https://github.com/user-attachments/assets/207de0d7-80e4-4d67-9028-6b9e7cbf0f8b" alt="Description" style="width: 300px; height: auto;">




## Folder Structure

### Backend
- `config.js` - Configuration settings for the application.
- `database.js` - Database connection and setup.
- `index.js` - Entry point for the backend application.
- `openapi.js` - OpenAPI configuration for the API.
- `openApiSchema.yml` - OpenAPI schema definition.
- `package-lock.json` - Automatically generated for any operations where npm modifies the node_modules directory.
- `package.json` - Project metadata and dependencies.
- `person.js` - Example file related to person data (if used).
- `user.json` - Example user data file (if used).

### Frontend
- `cypress/` - Cypress configuration and tests.
  - `e23/` - End-to-end tests for login and registration.
    - `login.cy.js` - Login test cases.
    - `register.cy.js` - Registration test cases.
  - `public/` - Public assets.
    - `index.html` - HTML template for the frontend.
  - `src/` - Source code for the React application.
    - `components/` - React components and their styles.
      - `Login.jsx` - Login component.
      - `Login.css` - Styles for the Login component.
      - `Profile.jsx` - Profile component.
      - `Profile.css` - Styles for the Profile component.
      - `Register.jsx` - Register component.
      - `Register.css` - Styles for the Register component.
    - `redux/` - Redux setup and configuration.
      - `actions/` - Redux actions.
        - `authActions.js` - Authentication actions.
        - `types.js` - Action types.
      - `reducers/` - Redux reducers.
        - `authReducer.js` - Authentication reducer.
        - `rootReducer.js` - Root reducer combining all reducers.
      - `store.js` - Redux store configuration.
    - `utils/` - Utility functions.
      - `api.js` - API utility functions.
    - `App.js` - Main application component.
    - `App.test.js` - Tests for the App component.
    - `firebase.js` - Firebase configuration.
    - `index.js` - Entry point for the React application.
    - `reportWebVitals.js` - Web vitals reporting.
    - `setupTests.js` - Setup file for testing.
  - `cypress.config.js` - Cypress configuration file.
  - `staticwebapp.config.json` - Configuration for Azure Static Web Apps.

## Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/SriyaI/fullstack-saas-backend.git
    ```
2. Navigate to the backend directory:
    ```bash
    cd backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Configure environment variables in the `.env` file.
5. Start the backend server:
    ```bash
    npm start
    ```

## Frontend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/SriyaI/fullstack-saas-frontend.git
    ```
2. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the frontend server:
    ```bash
    npm start
    ```

## Testing

### End-to-End Testing with Cypress

1. Navigate to the Cypress folder:
    ```bash
    cd frontend/cypress
    ```
2. Run Cypress tests:
    ```bash
    npx cypress open
    ```

### Running Unit Tests

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Run unit tests:
    ```bash
    npm test
    ```

## Deployment

The application is deployed on Azure. For deployment instructions, refer to Azure documentation or your specific deployment setup.
