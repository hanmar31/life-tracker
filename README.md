# Life Tracker


Life Tracker is a habit tracking web application built with JavaScript, Web Components, Express, and MongoDB. The application allows users to create, manage, and track daily, weekly, and monthly habits through interactive calendar-based views.

## Repository Information
This project was primarily developed and manages through GitLab during the course.

GitLab was used for:
- Issue tracking
- Milestone planning.
- Wiki documentaion.
- Requirement planning and tracking.
- CI pipeline integration.

A public GitHub repository is also available for:
- Public source code access.
- Deployment integration with Render.
- Long-tem project availability.

The application is deployed and available online through Render.

### Links
GitLab Repository: 
- Project Hub: https://gitlab.lnu.se/1dv613/student/hm223dq/project-hub
- Code Repository: https://gitlab.lnu.se/1dv613/student/hm223dq/workspace/life-tracker

GitHub Repository:
- https://github.com/hanmar31/life-tracker

Live Application:
- https://life-tracker-bzml.onrender.com/

## Features
- Create, edit, and delete habits.
- Support for:
    - Daily habits
    - Daily habits for only specific days.
    - Weekly habits
    - Monthly habits
- Interactive daily, weekly, and monthly views.
- Navigate between days, weeks, and months.
- Completion tracking history.
- Responsive UI for desktop, tablet, and mobile.
- Touchscreen-friendly interactions.
- Keyboard accessibility improvements.
- Persistent data storage using MongoDB.
- Automated testing.
- CI/CD pipelien using GitLab.

## Technologies Used

### Frontend 
    - JavaScript (ES Modules)
    - Web Components
    - Shadow DOM
    - HTML/CSS

### Backend
    - Node.js
    - Express.js
    - MongoDB
    - Mongoose
### Testing
    - Jest
    - Playwright
### DevOps/Tools
    - GitLab CI/CD
    - ESLint
    - Nodemon

## Installation
Clone the repository:
git clone https://github.com/hanmar31/life-tracker.git

Install dependencies:
npm install

Create a .env file and configure your environment variables.

Start development server:
npm run dev

Start production server:
npm start

## Running Tests
Run unit tests using Jest:
npm test

Run Playwright end-to-end tests:
npx playwright test

## Branch Strategy
The project follows a feature branch workflow.

### Main Branches
- main
    - Contains the stable and working version of the application.
- backup
    - Acts as an additional saftey branch containing a backup of the current stable verison of main.

### Feature Development
Each new feature, improvment or bugfix is developed in its own seperate feature branch.

Examples:
    - feature/weekly-view
    - feature/monthly-view
    - feature/automated-testing

Features are only merged into main after:
- The functionality works correctly.
- Testing has been complted.
- No major regression are detected.

Merged feature branches are deleted after integration to keep the repository clean and easier to maintain.

This workflow helps:
- Isolate development work.
- Reduce risk of breaking the stable application.
- Simplifi debugging and code management.
- Support safter expermentation during development.

## Automated Testing
The project uses both unit testing and end-to-end testing. For more detailed information about testing, see TESTING.md.

### Jest
Jest is used for unit testing isolated application logic such as:
- Validation logic
- Habit completion logic
- State-related functionality

### Playwright
Playwright is used for browser-based end-to-end testing of important user flows such as:
- Creating habits
- Deleteing habits
- Navigation adn rendering behavior

## CI/CD Pipeline
The project uses a CI/CD workflow with GitLab CI and Render.

### Continuous Integration
GitLab CI automatically runs:
- ESLint checks
- Jest unit tests
- Playwirght end-to-end tests.

The pipeline runs on every push and merge request to ensure code quality and application stability.

### Continuous Deployment
The application is deployed on Render. Render automatically redeploys the application whenever changes are pushed to the connected GitHub repository.

## Future Improvements
- More advanced statistics and analytics.
- User authentication
- Different features for different types of habits.
- Habit streak tracking.
- Improved accessibility auditing.
- Additional automated integration tests.

## License

This project was developed as part of the 1DV613 Software Development Project course at Linnaeus University.

## Author
Hanna Mårtensson