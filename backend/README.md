# Vehicle Maintenance Log Backend

This is the backend server for the Vehicle Maintenance Log application. It is built with Node.js, Express, and MongoDB.

## Prerequisites
- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- MongoDB database (local or cloud)

## Environment Variables
Create a `.env` file in the `backend/` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
EMAIL_FROM=your_email_address
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_SECURE=true_or_false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

## Installation

1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running the Server

- For development (with auto-reload):
  ```sh
  npm run dev
  ```
- For production:
  ```sh
  npm start
  ```

The server will start on the port specified in your code (default is usually 5000 or as set in your code).

## Project Structure
- `controllers/` - Route handlers
- `models/` - Mongoose models
- `routes/` - Express route definitions
- `middleware/` - Custom middleware
- `utils/` - Utility functions (email, token, etc.)

## License
MIT 