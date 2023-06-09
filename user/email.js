"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');
const { checkAuth } = require('../utils/checkAuth');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let statusCode;
    try {
        const response = checkAuth(event);
        if (!isEmail(response)) {
            statusCode = 401;
            throw new Error(response);
        };

        const { email } = event.pathParameters;

        if (!email) {
            statusCode = 400;
            throw new Error("Email is required!");
        }

        const params1 = {
            TableName: 'UserDetails',
            Key: {
                email: email
            },
        };

        const data = await documentClient.get(params1).promise();

        if (!data.Item) {
            statusCode = 404;
            throw new Error("User doesn't exist!");
        }

        const { name, profilePicture, createdAt } = data.Item;

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify({
                email: email,
                name: name,
                profilePicture: profilePicture,
                createdAt: createdAt,
            }),
        }
    } catch (err) {
        return {
            statusCode: statusCode || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify({
                message: err.message
            })
        };
    }
};
