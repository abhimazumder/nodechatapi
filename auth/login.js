"use strict";

const AWS = require("aws-sdk");
const { isEmail } = require('validator');
const bcrypt = require("bcryptjs");
const { createTokens } = require("../utils/createTokens");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);

        if (!email || !password) {
            const error = new Error("Missing required fields: email or password!");
            error.statusCode = 400;
            throw error;
        }

        if (!isEmail(email)) {
            const error = new Error("Invalid email address!");
            error.statusCode = 422;
            throw error;
        }

        const params = {
            TableName: "UserDetails",
            Key: {
                email: email
            }
        }

        const data = await documentClient.get(params).promise();

        if (!data.Item) {
            const error = new Error("User doesn't exists!");
            error.statusCode = 404;
            throw error;
        }

        const isValid = await bcrypt.compare(password, data.Item.password);

        if (!isValid) {
            const error = new Error("Email/Password is not valid!");
            error.statusCode = 400;
            throw error;
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
            statusCode: err.statusCode || 500,
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