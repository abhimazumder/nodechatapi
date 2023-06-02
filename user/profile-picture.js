"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');
const uuid = require('uuid');
const { checkAuth } = require('../utils/checkAuth');
const { formDataParser } = require('../utils/formDataParser');

const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let statusCode;

    try {
        const response = checkAuth(event);
        if (!isEmail(response)) {
            statusCode = 401;
            throw new Error(response);
        };

        const fields = await formDataParser(event);
        const file = fields.files.file;

        if (!file) {
            statusCode = 400;
            throw new Error("Image file is required!");
        }

        const params1 = {
            Bucket: "nodechatapi-dev-mys3bucket-uw9lggtd3eia",
            Key: `${uuid.v4()}.${file.filename.filename.split(".").pop()}`,
            Body: `${file.buffer.data}`,
            ContentType: file.filename.mimetype
        };

        const data = await s3.upload(params1).promise();
        const objectKey = data.Key;

        const params2 = {
            TableName: "UserDetails",
            Key: {
                email: response
            },
            UpdateExpression: 'SET #newField = :newValue',
            ExpressionAttributeNames: {
                '#newField': 'profilePicture'
            },
            ExpressionAttributeValues: {
                ':newValue': `${objectKey}`
            },
        }

        await documentClient.update(params2).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "multipart/form-data",
                "Access-Control-Allow-Methods": "POST",
            },
        }
    }
    catch (err) {
        return {
            statusCode: statusCode || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "multipart/form-data",
                "Access-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }

};