"use strict";

const AWS = require('aws-sdk');
const { v4 } = require('uuid');
const { checkAuth } = require('../utils/checkAuth');
const { formDataParser } = require('../utils/formDataParser');

const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email, token } = checkAuth(event);

        const formData = await formDataParser(event);
        const file = formData.files.file;

        if (!file) {
            const error = new Error("Image file is required!");
            error.statusCode = 400;
            throw error;
        }

        const params1 = {
            TableName: "UserDetails",
            Key: {
                email: email
            },
        };

        const data1 = await documentClient.get(params1).promise();

        if (data1.Item.profilePicture) {
            const params2 = {
                Bucket: "nodechatapi-dev-mys3bucket-uw9lggtd3eia",
                Key: data1.Item.profilePicture,
            };
            await s3.deleteObject(params2).promise();
        }
        const params3 = {
            Bucket: "nodechatapi-dev-mys3bucket-uw9lggtd3eia",
            Key: `${v4()}_${file.filename.filename}`,
            Body: `${file.buffer.data}`,
            ContentType: file.filename.mimetype
        };

        const data2 = await s3.upload(params3).promise();
        const objectKey = data2.Key;

        const params4 = {
            TableName: "UserDetails",
            Key: {
                email: email
            },
            UpdateExpression: 'SET #newField = :newValue',
            ExpressionAttributeNames: {
                '#newField': 'profilePicture'
            },
            ExpressionAttributeValues: {
                ':newValue': `${objectKey}`
            },
        }
        await documentClient.update(params4).promise();

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