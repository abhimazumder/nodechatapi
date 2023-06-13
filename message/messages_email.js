"use strict";

const AWS = require('aws-sdk');
const { checkAuth } = require('../utils/checkAuth');
const { fetchContent } = require('../utils/fetchContent');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email: _email, token } = checkAuth(event);

        const { email } = event.pathParameters;

        if (!email) {
            const error = new Error("Email parameter is missing!");
            error.statusCode = 400;
            throw error;
        }

        const params = {
            TableName: 'MessageDetails',
            FilterExpression: '#field = :value',
            ExpressionAttributeNames: {
                '#field': 'senderEmail',
            },
            ExpressionAttributeValues: {
                ':value': email,
            },
        };

        const data = await documentClient.scan(params).promise();

        for (let item of data.Items) {
            item = await fetchContent(item);
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify(data.Items),
        };
    }
    catch (err) {
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
}