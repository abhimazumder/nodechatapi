"use strict";

const AWS = require('aws-sdk');
const { checkAuth } = require('../utils/checkAuth');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email, token } = checkAuth(event);

        const { name } = JSON.parse(event.body);

        if (!name) {
            const error = new Error("Name field is required!");
            error.statusCode = 400;
            throw error;
        }

        const params = {
            TableName: "UserDetails",
            Key: { email: email },
            UpdateExpression: "set #attrName = :attrValue",
            ExpressionAttributeNames: {
                "#attrName": "name",
            },
            ExpressionAttributeValues: {
                ":attrValue": name,
            },
            ReturnValues: "UPDATED_NEW",
        }

        await documentClient.update(params).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "PUT",
            }
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

};