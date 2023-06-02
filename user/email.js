"use strict";

const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let statusCode;
    try {
        const { email } = event.pathParameters;

        if (!email) {
            statusCode = 400;
            throw new Error("Email is required!");
        }

        const params = {
            TableName: "UserDetails",
            Key: {
                email: email
            },
        };

        const data = await documentClient.get(params).promise();

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
            body: {
                
            }
        };
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
