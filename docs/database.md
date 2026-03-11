# Database Schema

## Overview
MongoDB is used with Mongoose models. Relationships are represented by ObjectId references.

## Collections

### Users (`User`)
- `name`: String, required
- `email`: String, required, unique, lowercased
- `password`: String, required, hashed (not selected by default)
- `createdAt`, `updatedAt`: timestamps

### Accounts (`Account`)
- `user`: ObjectId (ref: User), required
- `name`: String, required
- `institution`: String
- `type`: String
- `subtype`: String
- `balance`: Number, default 0
- `mask`: String
- `plaidAccountId`: String
- `plaidAccessToken`: String (not selected by default)
- `createdAt`, `updatedAt`: timestamps

### Transactions (`Transaction`)
- `user`: ObjectId (ref: User), required
- `account`: ObjectId (ref: Account)
- `amount`: Number, required
- `currency`: String, default "USD"
- `category`: String, default "Uncategorized"
- `merchant`: String
- `date`: Date, default now
- `type`: String enum: "income" | "expense"
- `plaidTransactionId`: String
- `createdAt`, `updatedAt`: timestamps

## Relationships
- One User has many Accounts
- One User has many Transactions
- One Account has many Transactions

## Indexes
- Users: unique index on `email`
