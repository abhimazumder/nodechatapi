# Project Name

Node Chat API

## Description

The serverless Node.js project leverages AWS Lambda, DynamoDB, and S3 storage to create a scalable Chat API. AWS Lambda executes the Node.js code, DynamoDB serves as the persistent storage for chat messages, and S3 provides object storage for additional data.

## Table of Contents

- [Endpoints](#endpoints)
  - [POST /auth/signup](#post-authsignup)
  - [POST /auth/login](#post-authlogin)
  - [POST /auth/refresh](#post-authrefresh)
  - [PUT /user/name](#put-username)
  - [POST /user/profile-picture](#post-userprofile-picture)
  - [PUT /user/password](#put-userpassword)
  - [GET /user/:email](#get-useremail)
  - [GET /media/token](#get-mediatoken)
  - [GET /media/profile-picture/:email](#get-mediaprofile-pictureemail)
  - [GET /media/chat/:messageId](#get-mediachatmessageid)
  - [POST /message](#post-message)
  - [GET /messages](#get-messages)
  - [GET /messages/:email](#get-messagesemail)


## Endpoints

### POST /auth/signup

- Method: POST
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/auth/signup`
- Request Headers:
  - `Content-Type: application/json`
- Expected request data:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

- Success Response:

```json
{
  "access_token": "JWT",
  "refresh_token": "JWT"
}
```

### POST /auth/login

- Method: POST
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/auth/login`
- Request Headers:
  - `Content-Type: application/json`
- Expected request data:

```json
{
  "email": "string",
  "password": "string"
}
```

- Success Response:

```json
{
  "access_token": "JWT",
  "refresh_token": "JWT"
}
```

### POST /auth/refresh

- Method: POST
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/auth/refresh`
- Request Headers:
  - `Content-Type: application/json`
- Expected request data:

```json
{
  "refresh_token": "JWT"
}
```

- Success Response:

```json
{
  "access_token": "JWT",
  "refresh_token": "JWT"
}
```

### PUT /user/name

- Method: PUT
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/user/name`
- Request Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data:

```json
{
  "name": "string"
}
```

- Success Response: OK

### POST /user/profile-picture

- Method: POST
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/user/profile-picture`
- Request Headers:
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer JWT`
- Expected request data:

```json
{
  "file": "An image"
}
```

- Success Response: OK

### PUT /user/password

- Method: PUT
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/user/password`
- Request

 Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data:

```json
{
  "password": "string"
}
```

- Success Response: OK

### GET /user/:email

- Method: GET
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/user/:email`
- Request Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data: {}

- Success Response:

```json
{
  "email": "string",
  "name": "string",
  "profilePicture": "string",
  "createdAt": "string"
}
```

### GET /media/token

- Method: GET
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/media/token`
- Request Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data: {}

- Success Response:

```json
{
  "token": "JWT"
}
```

### GET /media/profile-picture/:email

- Method: GET
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/media/profile-picture/:email`
- Request Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data: {}

- Success Response: Image file

### GET /media/chat/:messageId

- Method: GET
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/media/chat/:messageId`
- Request Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data: {}

- Success Response: Media in message

### POST /message

- Method: POST
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/message`
- Request Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer JWT`
- Expected request data:

```json
{
  "receiver": "string",
  "content": "string"
}
```

- Success Response:

```json
{
  "_id": "string"
}
```

### POST /message

- Method: POST
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/message`
- Request Headers:
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer JWT`
- Expected request data:

```json
{
  "receiver": "string",
  "file": "A File"
}
```

- Success Response:

```json
{
  "_id": "string"
}
```

### GET /messages

- Method: GET
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/messages`
- Request Headers:
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer JWT`
- Expected request data: {}

- Success Response:

```json
[
  {
    "content": "string",
    "isMedia": true,
    "sender": "ObjectId",
    "receiver": "ObjectId",
    "createdAt": "Date",
    "deliveredAt": "Date | null",
    "isDelivered": true
  },
  ...
]
```

### GET /messages/:email

- Method: GET
- Endpoint: `https://hudgf7xx94.execute-api.ap-south-1.amazonaws.com/dev/messages/:email`
- Request Headers:
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer JWT`
- Expected request data: {}

- Success Response:

```json
[
  {
    "content": "string",
    "isMedia": true,
    "sender": "ObjectId",
    "receiver": "ObjectId",
    "createdAt": "Date",
    "deliveredAt": "Date | null",
    "isDelivered": true
  },
  ...
]
```