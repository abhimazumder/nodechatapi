"use strict";

const AWS = require("aws-sdk");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { createTokens } = require("../utils/createTokens");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let statusCode;
    try {
        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
            statusCode = 400;
            throw new Error("Missing required fields: email, or password!");
        }

        if (!validator.isEmail(email)) {
            statusCode = 422;
            throw new Error("Invalid email address!");
        }

        const params = {
            TableName: "UserDetails",
            Key: {
                email: email
            }
        }

        const data = await documentClient.get(params).promise();

        if (!data.Item) {
            statusCode = 404;
            throw new Error("User doesn't exists!");
        }

        const isValid = await bcrypt.compare(password, data.Item.password);

        if (!isValid) {
            statusCode = 400;
            throw new Error("Email/Password is not valid!")
        }

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
    }
    catch (err) {
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