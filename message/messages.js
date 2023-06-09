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

        const { email } = event.pathParameters; 
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: email ? JSON.stringify(handleMessage(email)) : JSON.stringify(handleAllMessages()),
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

const handleAllMessages = async () => {
    const params = {
        TableName: 'MessageDetails',
    };

    const data = await documentClient.scan(params).promise();

    return formatData(data.Items);
}

const handleMessage = async (email) => {
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

    const data = await dynamodb.scan(params).promise();

    return formatData(data.Items);  
}

const formatData = async (dataItems) => {
    for (const message of dataItems) {
        const params = {
            Bucket: 'nodechatapi-dev-mys3bucket2-1dyh810yatk7',
            Key: message.content,
        };
        const data = await s3.getObject(params).promise();
        const fileExtension = message.content.split('.').pop();
        if (fileExtension.toLowerCase() === 'txt') {
            message.content = data.Body.toString('utf-8');
        } else {
            const imageString = new Buffer.from(data.Body).toString('base64');
            message.content = imageString;
        }
    }

    return dataItems;
}