"use strict";

const AWS = require('aws-sdk');
const validator = require('validator');
const { checkAuth } = require('../utils/checkAuth');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let statusCode;

    try {
        const response = checkAuth(event);
        if (!validator.isEmail(response)) {
            statusCode = 401;
            throw new Error(response);
        };

        const { name } = JSON.parse(event.body);

        if (!name) {
            statusCode = 400;
            throw new Error("Name field is missing!");
        }

        const params = {
            TableName: "UserDetails",
            Key: { email: response },
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
        return {
            statusCode: statusCode || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "PUT",
            },
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }

};