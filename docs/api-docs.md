# API Documentation

## Base URL
`/api`

## Authentication
Protected endpoints require an `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Health

### GET `/api/health`
Response:

```
{ "status": "ok" }
```

## Auth

### POST `/api/auth/register`
Request body:

```
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### POST `/api/auth/login`
Request body:

```
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Accounts (Protected)

### GET `/api/accounts`
Current behavior: returns an empty array while Plaid integration is pending.

### POST `/api/accounts/connect`
Current behavior: returns `501 Not Implemented`.

## Transactions (Protected)

### GET `/api/transactions`
Returns all transactions for the authenticated user.

### POST `/api/transactions`
Request body:

```
{
  "amount": 120.5,
  "category": "Groceries",
  "merchant": "Target",
  "date": "2026-03-11T00:00:00.000Z",
  "type": "expense",
  "account": "account_id"
}
```

### PUT `/api/transactions/:id`
Updates a transaction by id (owned by the authenticated user).

### DELETE `/api/transactions/:id`
Deletes a transaction by id (owned by the authenticated user).

## Error Format
All error responses use:

```
{
  "message": "Human-readable error message"
}
```
