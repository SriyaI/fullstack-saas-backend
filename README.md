Secure SaaS Application
This repository contains a Secure SaaS application with login functionality, developed using React for the frontend and Node.js for the backend. The application is deployed on Azure and includes end-to-end UI testing with Cypress.
Azure Deployment as CI/CD pipeline:
Frontend: Azure static web app
https://white-bush-038b79700.5.azurestaticapps.net
Backend: Azure webapp

Table of Contents
•	Project Overview
•	Folder Structure
•	Backend Setup
•	Frontend Setup
•	Testing
•	Deployment
Project Overview
This project is a secure SaaS application that allows users to register, log in, and view their profile. It uses JWT for authentication and integrates Google Sign-In via Firebase. The backend is built with Node.js, and the frontend is developed using React. Cypress is used for end-to-end UI testing.
Folder Structure
Backend
•	config.js - Configuration settings for the application.
•	database.js - Database connection and setup.
•	index.js - Entry point for the backend application.
•	openapi.js - OpenAPI configuration for the API.
•	openApiSchema.yml - OpenAPI schema definition.
•	package-lock.json - Automatically generated for any operations where npm modifies the node_modules directory.
•	package.json - Project metadata and dependencies.
•	person.js - Example file related to person data (if used).
•	user.json - Example user data file (if used).
Frontend
•	cypress/ - Cypress configuration and tests.
o	e23/ - End-to-end tests for login and registration.
	login.cy.js - Login test cases.
	register.cy.js - Registration test cases.
o	public/ - Public assets.
	index.html - HTML template for the frontend.
o	src/ - Source code for the React application.
	components/ - React components and their styles.
	Login.jsx - Login component.
	Login.css - Styles for the Login component.
	Profile.jsx - Profile component.
	Profile.css - Styles for the Profile component.
	Register.jsx - Register component.
	Register.css - Styles for the Register component.
	redux/ - Redux setup and configuration.
	actions/ - Redux actions.
	authActions.js - Authentication actions.
	types.js - Action types.
	reducers/ - Redux reducers.
	authReducer.js - Authentication reducer.
	rootReducer.js - Root reducer combining all reducers.
	store.js - Redux store configuration.
	utils/ - Utility functions.
	api.js - API utility functions.
	App.js - Main application component.
	App.test.js - Tests for the App component.
	firebase.js - Firebase configuration.
	index.js - Entry point for the React application.
	reportWebVitals.js - Web vitals reporting.
	setupTests.js - Setup file for testing.
o	cypress.config.js - Cypress configuration file.
o	staticwebapp.config.json - Configuration for Azure Static Web Apps.
Backend Setup
Clone the repository:

git clone https://github.com/SriyaI/fullstack-saas-backend.git
cd backend
npm install
Configure environment variables .env file.
npm start
Frontend Setup
git clone https://github.com/SriyaI/fullstack-saas-frontend.git
cd frontend
npm install
npm start
Testing
End-to-End Testing with Cypress
Navigate to the Cypress folder:
cd frontend/cypress
Run Cypress tests:
npx cypress open
Running Unit Tests
Navigate to the frontend directory:
cd frontend
Run unit tests:
npm test
Deployment
The application is deployed on Azure. For deployment instructions, refer to Azure documentation or your specific deployment setup.

