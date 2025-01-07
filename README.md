# Prince Garg - Assignment

This is a backend application built using **NestJS**. It includes various modules for managing users, authentication, documents, and other core functionalities. The project uses **TypeORM** and **PostgreSQL** for data management and storage. It also utilizes **JWT** for authentication and **Redis** for session management and logout functionality.

## Installation

Follow these steps to get the project running on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/PrinceGarg10/jk-assignment.git
   cd jk-assignment
   ```

2. Install the required dependencies:
   ```bash
   yarn install
   ```

## Environment Variables

The application requires environment variables to configure various services such as the API, database, JWT, and Redis. These are defined in the `.env.example` file.

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and fill in the necessary values, such as API configuration, database credentials, JWT secrets, and Redis settings.

### `.env.example` Breakdown:

```plaintext
# API configuration
API_PORT=4001             # Port where the API will run
API_PREFIX=/api/v1        # Prefix for all API endpoints

# Swagger API documentation
SWAGGER_ENABLE=1          # Enable Swagger API documentation (1 = enabled, 0 = disabled)
BASE_URL=http://localhost # Base URL for the API

# Database ORM configuration (PostgreSQL)
PG_USERNAME=princegarg    # PostgreSQL username
PG_HOST=localhost         # PostgreSQL host
PG_PORT=1487              # PostgreSQL port
PG_PASSWORD=              # PostgreSQL password (set your own)
PG_DATABASE=Test          # PostgreSQL database name

# JWT configuration
JWT_SECRET=pass           # Secret used for JWT token signing
JWT_ISSUER=DEFAULT_ISSUER # JWT token issuer

# REDIS (used for session management)
REDIS=1                   # Enable Redis (1 = enabled, 0 = disabled)
```

Make sure to replace the placeholders with actual values:
- **Database**: Ensure you provide your **PostgreSQL** credentials.
- **JWT**: Set a strong secret key for JWT token signing.
- **Redis**: Set Redis to `1` if you plan to use Redis for session management and the logout functionality.

## Running the Application

### Development Mode
To run the application in development mode, use the following command:
```bash
yarn start:dev
```
This will start the server with auto-reloading on code changes.

### Production Mode
To build and run the application in production mode, use these commands:
```bash
yarn run build
yarn start
```
This will compile the project into a build folder and run the production server.

### Testing
To run the test cases with Jest, use the following command:
```bash
yarn test
```

## Swagger & API Documentation

You can view the API documentation and interact with the endpoints using **Swagger** UI. The documentation is available at:
```plaintext
http://localhost:4001/apis/
```
This is the URL for the Swagger interface, where you can explore the API endpoints.

## Database (PostgreSQL) & TypeORM

This application uses **TypeORM** to manage interactions with a **PostgreSQL** database. TypeORM is an Object-Relational Mapper (ORM) for TypeScript and JavaScript, allowing you to work with relational databases in an object-oriented manner.

1. **PostgreSQL**: Ensure that PostgreSQL is installed and running on your machine or in a Docker container. You need to configure the connection details (username, password, database) in your `.env` file.

2. **TypeORM**: TypeORM is used to define entities (database models) and interact with the database in a simple and efficient way. You will find the entities under the `src/modules/` folder (e.g., `user.entity.ts` and `document.entity.ts`).

To connect to the PostgreSQL database, the application uses the connection settings defined in the `.env` file. The connection configuration is set up in the `app.module.ts` file where the `TypeOrmModule` is imported and configured.

Example PostgreSQL configuration in `.env`:
```plaintext
PG_USERNAME=princegarg
PG_HOST=localhost
PG_PORT=1487
PG_PASSWORD=your-db-password
PG_DATABASE=Test
```

## Note on Redis

For the **logout functionality** to work correctly, Redis must be enabled. Ensure that Redis is configured and running to handle session management.

You can set the `REDIS` variable to `1` in the `.env` file to enable Redis:

```plaintext
REDIS=1
```

If Redis is not needed, you can set it to `0` to disable it.

## File Structure

Here’s a breakdown of the project structure and the purpose of each file/folder:

```plaintext
PrinceGarg10-jk-assignment/
├── README.md               # Project documentation (this file)
├── nest-cli.json           # Configuration for NestJS CLI
├── package.json            # Project dependencies and scripts
├── tsconfig.build.json     # TypeScript build configuration
├── tsconfig.json           # TypeScript compiler options
├── .env.example            # Example environment variables file
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration for code formatting
├── src/                    # Source code directory
│   ├── server.ts           # Entry point to the application
│   └── modules/            # Application modules (feature folders)
│       ├── app.controller.ts          # Main application controller
│       ├── app.service.ts            # Main application service
│       ├── auth/                    # Authentication module
│       │   ├── auth.controller.ts    # Authentication controller
│       │   ├── auth.service.ts       # Authentication service
│       │   ├── jwt-strategy.ts      # JWT authentication strategy
│       │   ├── dto/                  # Data transfer objects for login
│       │   │   └── login-request.dto.ts
│       ├── user/                    # User management module
│       │   ├── user.controller.ts    # User controller
│       │   ├── user.service.ts       # User service
│       │   ├── dto/                  # DTOs for user creation and update
│       │   └── entity/               # User entity (database schema)
│       ├── document/                # Document management module
│       │   ├── document.controller.ts # Document controller
│       │   ├── document.service.ts    # Document service
│       │   ├── dto/                   # DTOs for creating/updating documents
│       │   └── entity/                # Document entity (database schema)
│       ├── common/                  # Common utilities and shared services
│       │   ├── constants/             # Common constants (roles, statuses)
│       │   ├── provider/              # Providers for logging, configuration
│       │   └── interceptor/           # Custom interceptors and filters
│       ├── shared/                   # Shared services (e.g., Redis, File system)
│       ├── guard/                    # Route guards for authentication and roles
│       ├── decorators/               # Custom decorators for request handling
│       └── utils/                    # Utility classes (e.g., hashing, random generation)
└── test/                       # Test cases for the application
    ├── app.e2e-spec.ts           # End-to-end tests
    └── jest-e2e.json             # Jest configuration for end-to-end testing
```

### Key Directories and Files:

1. **`src/`**: This is where the main application code resides. It contains various feature modules, each responsible for a specific functionality (e.g., authentication, user management, document handling).

2. **`modules/`**: Inside this folder, you’ll find the different feature modules, such as:
   - **`auth/`**: Handles user authentication (login, JWT generation).
   - **`user/`**: Manages user CRUD operations and profiles.
   - **`document/`**: Handles document creation, updates, and fetching.
   - **`common/`**: Contains shared resources like constants, logging, and interceptors.
   - **`shared/`**: Contains shared services such as Redis, file handling, etc.
   - **`guard/`**: Holds guards to protect routes based on authentication and user roles.
   - **`utils/`**: Contains utility classes for common operations like hashing or random data generation.

3. **`test/`**: This directory contains test files. The `app.e2e-spec.ts` file includes the end-to-end tests for your application, which can be run using Jest.

4. **`tsconfig.json` and `tsconfig.build.json`**: These files configure TypeScript for both development and production builds.

5. **`nest-cli.json`**: This is the configuration file for the NestJS CLI, which helps in managing the project structure
