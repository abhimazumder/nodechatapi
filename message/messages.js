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
        
        const params = {
            TableName: 'MessageDetails',
        };
    
        const data = await documentClient.scan(params).promise();

        for(let item of data.Items){
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