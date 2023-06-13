"use strict";

const AWS = require('aws-sdk');
const { checkAuth } = require('../utils/checkAuth');
const { fetchContent } = require('../utils/fetchContent');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email, token } = checkAuth(event);

        const { messageId } = event.pathParameters;

        if (!messageId) {
            const error = new Error("MessageId is missing!");
            error.statusCode = 400;
            throw error;
        }

        const params = {
            TableName: 'MessageDetails',
            Key: {
                senderEmail: `${email}`,
                _id: `${messageId}`,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data.Item) {
            const error = new Error("MessageId is not valid!");
            error.statusCode = 404;
            throw error;
        }

        if (!data.Item.isMedia) {
            const error = new Error("Content is not media!");
            error.statusCode = 415;
            throw error;
        }

        const message = await fetchContent(data.Item);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify(message.content),
        }
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