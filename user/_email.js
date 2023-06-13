"use strict";

const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email } = event.pathParameters;

        if (!email) {
            const error = new Error("Email is required!");
            error.statusCode = 400;
            throw error;
        }

        const params1 = {
            TableName: 'UserDetails',
            Key: {
                email: email
            },
        };

        const data = await documentClient.get(params1).promise();

        if (!data.Item) {
            const error = new Error("User doesn't exist!");
            error.statusCode = 400;
            throw error;
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
        if (err.message === "jwt malformed" || err.message === "jwt expired") {
            err.statusCode = 403;
        }
        return {
            statusCode: err.statusCode || 500,
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
