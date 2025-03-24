# Contributing to Node.js Authentication System

First of all, thank you for considering contributing to this project! Here are the guidelines for contributing to make the process smooth and effective for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project follows a standard code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/sagar-1m/01_NodeJS-Authentication-System.git
   cd 01_NodeJS-Authentication-System
   ```
3. **Setup your environment**:
   ```bash
   npm install
   cp .env.example .env
   # Update .env with your credentials
   ```
4. **Start the development server**:
   ```bash
    npm run dev
   ```

## Development Workflow

1. **Create a new branch for each feature or bugfix**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
    git checkout -b bugfix/your-bugfix-name
   ```
2. **Make your changes**:
   - Follow the coding standards
   - Write tests
3. **Run tests**:
   ```bash
    npm test
   ```
4. **Commit your changes with a clear commit message**:
   ```bash
   git commit -m "feat: add social login functionality"
   # or
   git commit -m "fix: resolve login issue"
   ```
5. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a pull request on main branch

## Pull Request Process

1. Update the README.md if necessary with details of your changes
2. Update the .env.example file if you've added new environment variables
3. The PR will be merged once it has been reviewed and approved
4. Please squash your commits before merging
5. Your PR should include tests if applicable

## Coding Standards

- Use ESLint with the project's configuration
- Follow the existing code style and project structure
- Write JSDoc comments for all functions
- Use async/await for asynchronous operations
- Write descriptive variable and function names
- Keep functions small and focused on a single task
- Separate business logic from controllers
- Handle errors properly

## Reporting Bugs

**When reporting bugs, please include:**

1. A detailed description
2. Steps to reproduce the bug
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Your operating system and Node.js version

## Feature Requests

**When requesting a feature, please include:**

1. A detailed description of the feature
2. The problem you're facing without the feature
3. Provide examples of how the feature would be used
4. If possible, outline how the feature could be implemented

---

Thank you for contributing to make this authentication system better! 🚀

---
