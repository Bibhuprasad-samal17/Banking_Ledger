# Banking Ledger API

A RESTful banking ledger backend built with Node.js and Express, featuring double-entry bookkeeping, JWT authentication, and idempotent transaction processing.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Accounts](#accounts)
  - [Transactions](#transactions)
- [Data Models](#data-models)
- [Authentication Flow](#authentication-flow)

---

## Features

- **JWT Authentication** — Secure registration and login with token stored as an HTTP cookie
- **Double-Entry Bookkeeping** — Every transfer creates a paired DEBIT and CREDIT ledger entry via an immutable `Ledger` model
- **Idempotency Keys** — Prevents duplicate transaction processing
- **Account Status Gating** — Transactions only allowed between `ACTIVE` accounts (`ACTIVE` / `FROZEN` / `CLOSED`)
- **Email Notifications** — Welcome email on registration via Gmail OAuth2 (Nodemailer)
- **Secure Password Storage** — Passwords hashed with bcrypt, never returned from the database

---

## Tech Stack

| Layer       | Technology                         |
|-------------|------------------------------------|
| Runtime     | Node.js                            |
| Framework   | Express 5                          |
| Database    | MongoDB + Mongoose 9               |
| Auth        | JWT (`jsonwebtoken`) + `bcryptjs`  |
| Email       | Nodemailer (Gmail OAuth2)          |
| Utilities   | `cookie-parser`, `dotenv`          |
| Dev Tooling | nodemon                            |

---

## Project Structure

```
Banking_Ledger/
├── server.js                        # Entry point — starts HTTP server
├── package.json
├── middleware/
│   └── auth.middleware.js           # JWT verification middleware
└── src/
    ├── app.js                       # Express app, middleware, routes
    ├── config/
    │   └── db.js                    # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js       # Register / Login logic
    │   ├── account.controller.js    # Account creation logic
    │   └── transaction.controller.js# Transfer logic
    ├── models/
    │   ├── user.model.js            # User schema
    │   ├── account.model.js         # Account schema + balance helper
    │   ├── transaction.model.js     # Transaction schema
    │   └── ledger.model.js          # Immutable ledger entry schema
    ├── routes/
    │   ├── auth.routes.js
    │   ├── account.routes.js
    │   └── transaction.routes.js
    └── services/
        └── email.service.js         # Nodemailer email sending
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** — local instance or MongoDB Atlas cluster
- **Gmail account** with OAuth2 credentials (for email notifications)

### Installation

```bash
git clone https://github.com/Bibhuprasad-samal17/Banking_Ledger.git
cd Banking_Ledger
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/banking_ledger

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (Gmail OAuth2)
EMAIL_USER=your_gmail@gmail.com
CLIENT_ID=your_google_oauth2_client_id
CLIENT_SECRET=your_google_oauth2_client_secret
REFRESH_TOKEN=your_google_oauth2_refresh_token
```

> To obtain Gmail OAuth2 credentials, follow the [Google OAuth2 guide](https://developers.google.com/identity/protocols/oauth2).

### Running the Server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

The server starts on **http://localhost:3000**.

---

## API Reference

All request and response bodies use `application/json`.

### Authentication

#### Register

```
POST /api/auth/register
```

Creates a new user account and returns a JWT token. Also sends a welcome email.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `201`:**

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "<jwt>"
}
```

The JWT is also set as an HTTP cookie (`token`, 3-day expiry).

---

#### Login

```
POST /api/auth/login
```

Authenticates an existing user and returns a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`:**

```json
{
  "success": true,
  "user": { ... },
  "token": "<jwt>"
}
```

---

### Accounts

> All account endpoints require authentication. Include the JWT in the `Authorization` header or via the cookie.

**Header:** `Authorization: Bearer <token>`

---

#### Create Account

```
POST /api/accounts
```

Creates a new bank account for the authenticated user. Currency defaults to `INR`.

**Response `201`:**

```json
{
  "success": true,
  "account": {
    "_id": "...",
    "user": "<userId>",
    "currency": "INR",
    "status": "ACTIVE",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Transactions

> Requires authentication.

#### Transfer Funds

```
POST /api/transactions
```

Transfers funds between two accounts using double-entry bookkeeping. An idempotency key must be provided to prevent duplicate transfers.

**Request Body:**

```json
{
  "fromAccount": "<accountId>",
  "toAccount": "<accountId>",
  "amount": 500,
  "idempotencyKey": "unique-key-per-transfer"
}
```

**Response `201`:**

```json
{
  "success": true,
  "transaction": {
    "_id": "...",
    "fromAccount": "...",
    "toAccount": "...",
    "ammount": 500,
    "status": "COMPLETED",
    "idempotencyKey": "unique-key-per-transfer"
  }
}
```

**Error Cases:**

| Status | Reason |
|--------|--------|
| `400` | Missing required fields |
| `409` | Duplicate idempotency key (transaction already processed) |
| `403` | One or both accounts are not `ACTIVE` |
| `404` | Account not found |

---

## Data Models

### User

| Field       | Type   | Rules                                    |
|-------------|--------|------------------------------------------|
| `email`     | String | Required, unique, lowercase              |
| `name`      | String | Required, unique                         |
| `password`  | String | Required, min 6 chars, hidden by default |
| `createdAt` | Date   | Auto-generated                           |
| `updatedAt` | Date   | Auto-generated                           |

---

### Account

| Field      | Type     | Rules                                      |
|------------|----------|--------------------------------------------|
| `user`     | ObjectId | Ref: `User`, required                      |
| `status`   | String   | `ACTIVE` / `FROZEN` / `CLOSED`, default `ACTIVE` |
| `currency` | String   | Default `"INR"`                            |

Compound index on `{ user, currency }` for efficient per-user balance lookups.

---

### Transaction

| Field            | Type     | Rules                                          |
|------------------|----------|------------------------------------------------|
| `fromAccount`    | ObjectId | Ref: `Account`, required                       |
| `toAccount`      | ObjectId | Ref: `Account`, required                       |
| `ammount`        | Number   | Required, min `0`                              |
| `status`         | String   | `PENDING` / `COMPLETED` / `FAILED` / `reversed` |
| `idempotencyKey` | String   | Required, unique                               |

---

### Ledger (Immutable)

Double-entry ledger. Every transaction generates two entries (one DEBIT, one CREDIT). All fields are immutable after creation.

| Field         | Type     | Rules                        |
|---------------|----------|------------------------------|
| `account`     | ObjectId | Ref: `Account`, required     |
| `transaction` | ObjectId | Ref: `Transaction`, required |
| `type`        | String   | `DEBIT` / `CREDIT`, required |
| `ammount`     | Number   | Required                     |

---

## Authentication Flow

1. User registers or logs in → server returns a signed JWT (3-day expiry)
2. JWT is stored as an HTTP cookie (`token`) and in the response body
3. Protected routes read the token from:
   - Cookie: `token`
   - Header: `Authorization: Bearer <token>`
4. Middleware verifies the token, fetches the user from the database, and attaches it to `req.user`
