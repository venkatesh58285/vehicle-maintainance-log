# Vehicle Maintenance Log Frontend

This is the frontend for the Vehicle Maintenance Log application, built with React and Vite.

## Prerequisites
- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

## Environment Variables / API Keys
If you want to use the Gemini AI chatbot feature, you need a Gemini API key. By default, the API key is hardcoded in `src/components/Chatbot.jsx`:

```
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```

**For security, you should move your API key to an environment variable or a secure location before deploying.**

## Installation

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running the App

- For development:
  ```sh
  npm run dev
  ```
- To build for production:
  ```sh
  npm run build
  ```
- To preview the production build:
  ```sh
  npm run preview
  ```

The app will start on the port specified by Vite (default is 5173).

## Project Structure
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages
- `src/context/` - React context providers
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions and validation

## License
MIT
