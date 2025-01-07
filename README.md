
# Prince Garg - Assignment

This is a backend application built with **NestJS** for handling various functionalities, including user authentication, document management, and more. The project follows best practices and is designed to be easily extended and maintained.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PrinceGarg10/jk-assignment.git
   cd jk-assignment
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

## Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values in the `.env` file.

## Running the Application

- **Development Mode**:
  ```bash
  yarn start:dev
  ```

- **Production Mode**:
  ```bash
  yarn run build
  yarn start
  ```

- **Testing**:
  ```bash
  yarn test
  ```

## Swagger & API Documentation

Access the Swagger UI at:
```plaintext
http://localhost:3000/apis/
```

## Note on Redis

For the **logout functionality** to work, Redis must be enabled.

## File Structure

```plaintext
PrinceGarg10-jk-assignment/
├── README.md
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   └── modules/
└── test/
    └── app.e2e-spec.ts
```
