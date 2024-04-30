# 🌋 Developer Portal 🌋

## Getting Started

These instructions will get your copy of the Developer Portal up and running on your local machine for development and testing purposes. Follow these simple steps:

### Prerequisites

Make sure you have Node.js installed on your system. We use `nvm` (Node Version Manager) to manage Node.js versions:

1. **Install and use the proper version of Node.js:**

   ```bash
   nvm install && nvm use
   ```

   This command installs and switches to the Node.js version specified in the `.nvmrc` file located in the project's root directory.

2. **Install project dependencies:**

   ```bash
   npm ci
   ```

   Using `npm ci` helps ensure that your package versions match those in `package-lock.json`, providing a more consistent installation process.

3. **Start the application in development mode:**

   ```bash
   npm run dev
   ```

   This command compiles and launches the application, making it available at [http://localhost:3000](http://localhost:3000).
