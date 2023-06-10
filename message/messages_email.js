"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');
const { checkAuth } = require('../utils/checkAuth');
const { fetchContent } = require('../utils/fetchContent');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const response = checkAuth(event);
        if (!isEmail(response)) {
            response.statusCode = 401;
            throw response;
        };
        
        const { email } = event.pathParameters;

        if(!email){
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
    
        const dataItems = await fetchContent(data.Items);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify(dataItems),
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