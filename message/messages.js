"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');
const { checkAuth } = require('../utils/checkAuth');

const documentClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
    try {
        const response = checkAuth(event);
        if (!isEmail(response)) {
            response.statusCode = 401;
            throw response;
        };

        const params = {
            TableName: 'MessageDetails',
        };

        const data = await documentClient.scan(params).promise();

        for (const message of data.Items) {
            const fileExtension = message.content.split('.').pop();
            if (fileExtension.toLowerCase() === 'txt') {
                const params = {
                    Bucket: 'nodechatapi-dev-mys3bucket2-1dyh810yatk7',
                    Key: message.content,
                };
                const data = await s3.getObject(params).promise();
                message.content = data.Body.toString('utf-8');
            }
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
        return {
            statusCode: err.statusCode || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }
}