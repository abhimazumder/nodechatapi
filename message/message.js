"use strict";

const AWS = require('aws-sdk');
const { v4 } = require('uuid');
const { checkAuth } = require('../utils/checkAuth');
const { getDate, getDateTime } = require('../utils/getTime');
const { formDataParser } = require('../utils/formDataParser');

const documentClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
    try {
        const { email, token } = checkAuth(event);

        const contentType = event.headers['Content-Type'];
        let _id;

        if (contentType === 'application/json') {
            _id = await handleApplicationJSON(event, email);
        } else if (contentType.startsWith('multipart/form-data')) {
            _id = await handleMultiPartFormData(event, email);
        } else {
            const error = new Error('Unsupported Content-Type!');
            error.code = 415;
            throw error;
        }

        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify({
                _id: _id,
            })
        };
    } catch (err) {
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

const handleApplicationJSON = async (event, sender) => {
    const { receiver, content } = JSON.parse(event.body);

    if (!receiver || !content) {
        const error = new Error("Missing required fields: receiver or content!");
        error.code = 400;
        throw error;
    }

    const params1 = {
        TableName: 'UserDetails',
        Key: {
            email: receiver,
        },
    };

    const data1 = await documentClient.get(params1).promise();

    if (!data1.Item) {
        const error = new Error("Receiver doesn't exist!");
        error.code = 404;
        throw error;
    }
    
    const objectKey = `${sender}/${getDate()}/${receiver}/${v4()}.txt`;

    const params2 = {
        Bucket: 'nodechatapi-dev-mys3bucket2-1dyh810yatk7',
        Key: objectKey,
        Body: content,
        ContentType: 'text/plain',
    };

    await s3.upload(params2).promise();

    const _id = v4();

    const params = {
        TableName: 'MessageDetails',
        Item: {
            _id: _id,
            content: objectKey,
            isMedia: false,
            senderEmail: sender,
            receiverEmail: receiver,
            createdAt: getDateTime(),
            deliveredAt: null,
            isDelivered: true
        }
    };

    await documentClient.put(params).promise();

    return _id;
};

const handleMultiPartFormData = async (event, sender) => {
    const formData = await formDataParser(event);
    const { receiver } = formData.fields;
    const { file } = formData.files;

    if (!receiver || !file) {
        const error = new Error("Missing required fields: receiver or file!");
        error.code = 400;
        throw error;
    }

    const params1 = {
        TableName: 'UserDetails',
        Key: {
            email: receiver,
        },
    };

    const data1 = await documentClient.get(params1).promise();

    if (!data1.Item) {
        const error = new Error("Receiver doesn't exist!");
        error.code = 404;
        throw error;
    }

    const objectKey = `${sender}/${getDate()}/${receiver}/${v4()}_${file.filename.filename}`;

    const params2 = {
        Bucket: "nodechatapi-dev-mys3bucket2-1dyh810yatk7",
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.filename.mimetype,
    };

    await s3.upload(params2).promise();

    const _id = v4();

    const params = {
        TableName: 'MessageDetails',
        Item: {
            _id: _id,
            content: objectKey,
            isMedia: true,
            senderEmail: sender,
            receiverEmail: receiver,
            createdAt: getDateTime(),
            deliveredAt: null,
            isDelivered: true
        }
    };

    await documentClient.put(params).promise();

    return _id;
};
