"use strict";

const AWS = require('aws-sdk');
const validator = require('validator');
const uuid = require('uuid');
const { checkAuth } = require('../utils/checkAuth');

const s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    let statusCode;

    try {
        const response = checkAuth(event);
        if (!validator.isEmail(response)) {
            statusCode = 401;
            throw new Error(response);
        };
        
        const params = {
            Bucket: 'nodechatapi-dev-mys3bucket-uw9lggtd3eia',
            Key: `${uuid.v4()}.jpg`,
            Body: event.file,
            ContentType: 'image/jpeg',
          };

          const s3Object = await s3.upload({params}).promise();

          const objectKey = s3Object.Key;

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "multipart/form-data",
                "Access-Control-Allow-Methods": "PUT",
            },
            body : objectKey,
        }
    }
    catch (err) {
        return {
            statusCode: statusCode || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "multipart/form-data",
                "Access-Control-Allow-Methods": "PUT",
            },
            body: JSON.stringify({
                message: err.message,
            }),
        };
    }

};


/*

            */