# 🌋 HRM Portal 🌋

## Getting Started

These instructions will get your copy of the HRM Portal up and running on your local machine for development and testing purposes. Follow these simple steps:

### Prerequisites

Make sure you have Node.js installed on your system. We use [`nvm` (Node Version Manager)](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to manage Node.js versions:

1. **Install and use the proper version of Node.js:**

   ```bash
   nvm install 20 && nvm use 20
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

## File and Folder Naming Conventions

To maintain consistency and clarity in our project's codebase, we adhere to specific naming conventions for files and folders. To create new pages, shared components, services, hooks, and end-to-end tests (e2e), use the following command:

```bash
npm run plop
```

This command launches a console interface that guides you through creating new files, ensuring that all naming conventions are followed correctly.

## UI Components

UI components are general interface elements used throughout the application. These components range from basic elements like buttons and inputs to more complex composite interfaces.

### Usage and Creation

When creating new UI components or utilizing existing ones, it's important to follow the guidelines and component structures provided in the Shadcn UI library.

For detailed documentation on how to use or create these UI components, refer to the Shadcn UI documentation available at [Shadcn UI Components](https://ui.shadcn.com/docs/components).
All general UI components are stored under: _`src/components/ui`_

## Project Structure

Our project uses a structured directory layout to organize the various parts of the application. Below is an overview of the key directories and their intended purposes:

### Routing

- For information on how routing is handled in your Next.js application, refer to the Next.js documentation on [Pages and Routing](https://nextjs.org/docs/app/building-your-application/routing/pages).

### Directory Structure

        .
        ├── ...
        ├───assets/
        │   ├───fonts
        │   ├───images
        │   └───videos
        ├───src/
        │   ├───app/
        │   │   ├───page/
        │   │   │   ├───components/
        │   │   │   ├───hooks/
        │   │   │   ├───page.tsx
        │   │   ├───global.css
        │   │   ├───layout.tsx
        │   │   └───page.tsx
        │   ├───components
        │   │   ├───ui
        │   │   ├───SharedComponent/
        │   │   │   ├───index.ts
        │   │   │   ├───SharedComponent.tsx
        │   │   │   └───SharedComponent.test.tsx
        │   │   │   └───types.ts
        │   ├───constants/
        |   │   ├───index.ts
        │   ├───services
        │   ├───types/
        │   │   └───models/
        │   ├───utils
        |   ├───hooks
        ...
        .# .env, package.json, .nvmrc,
        .# .eslintrc, tsconfig.json, .gitignore,
        .# etc...
        ...
        └── README.md
