# Backend - Task Management System

## Project Overview

The backend for the Task Management System is developed using NestJS and serves as the API for the frontend. It connects to a MongoDB database and handles task management operations.

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)
- MongoDB (for database)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SweSwe-Nyein/task-management-backend.git
    ```

2. Navigate to the backend directory:

    ```bash
    cd task-management-backend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the `backend` directory with the following demo configuration:

    ```dotenv
    DATABASE_HOST=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
    ```

   Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your actual MongoDB connection details.

### Running the Development Server
Start the backend server in development mode:

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`.

### Building for Production

To build the backend for production, run:

```bash
npm run build
```
