"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');

const s3 = new AWS.S3();

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    try {
        const { email } = event.pathParameters;

        if (!email) {
            const error = new Error("Email is missing!");
            error.statusCode = 400;
            throw error;
        }

        if (!isEmail(email)) {
            const error = new Error("Email is not valid!");
            error.statusCode = 422;
            throw error;
        }

        const params1 = {
            TableName: 'UserDetails',
            Key: {
                email: email
            },
        }

        const data1 = await documentClient.get(params1).promise();

        if (!data1.Item) {
            const error = new Error("User doesn't exists!");
            error.statusCode = 404;
            throw error;
        }

        if (!data1.Item.profilePicture) {
            const error = new Error("User doesn't have a profile picture!");
            error.statusCode = 404;
            throw error;
        }

        const params2 = {
            Bucket: 'nodechatapi-dev-mys3bucket-uw9lggtd3eia',
            Key: data1.Item.profilePicture,
        };

        const data2 = await s3.getObject(params2).promise();

        const profilePicture = new Buffer.from(data2.Body).toString('base64');

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET",
            },
            body: JSON.stringify(profilePicture),
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
