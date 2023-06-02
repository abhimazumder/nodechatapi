"use strict";

const AWS = require("aws-sdk");
const { isEmail } = require('validator');
const bcrypt = require("bcryptjs");
const { createTokens } = require("../utils/createTokens");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  let statusCode;

  try {
    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      statusCode = 400;
      throw new Error("Missing required fields: name, email, or password!");
    }

    if (!isEmail(email)) {
      statusCode = 422;
      throw new Error("Invalid email address!");
    }

    const params1 = {
      TableName: "UserDetails",
      Key: {
        email: email,
      },
    };

    const data = await documentClient.get(params1).promise();

    if (data.Item) {
      statusCode = 409;
      throw new Error("Email address already exists!");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const params2 = {
      TableName: "UserDetails",
      Item: {
        name: name,
        email: email,
        password: hash,
      },
    };

    await documentClient.put(params2).promise();

    const tokens = createTokens(email);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify({
        tokens: tokens,
      }),
    };
  } catch (err) {
    return {
      statusCode: statusCode || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};