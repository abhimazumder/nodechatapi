"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');
const bcrypt = require("bcryptjs");
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

        const { password } = JSON.parse(event.body);

        if(!password){
            statusCode = 400;
            throw new Error("New Password is required!");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const params = {
            TableName: "UserDetails",
            Key: { email: response },
            UpdateExpression: "set #attrName = :attrValue",
            ExpressionAttributeNames: {
                "#attrName": "password",
            },
            ExpressionAttributeValues: {
                ":attrValue": hash,
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
}