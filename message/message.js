"use strict";

const AWS = require('aws-sdk');
const { isEmail } = require('validator');
const { v4 } = require('uuid');
const { checkAuth } = require('../utils/checkAuth');
const { getDate, getDateTime } = require('../utils/getTime');
const { formDataParser } = require('../utils/formDataParser');

const documentClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
    try {
        const response = checkAuth(event);
        if (!isEmail(response)) {
            const error = new Error(response);
            error.code = 401;
            throw error;
        }
        const contentType = event.headers['Content-Type'];
        let _id;

        if (contentType === 'application/json') {
            _id = await handleApplicationJSON(event, response);
        } else if (contentType.includes('multipart/form-data')) {
            _id = await handleMultiPartFormData(event, response);
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
        return {
            statusCode: err.code || 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify({
                message: err.message,
                input: event,
            }),
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
    
    const objectKey = `${sender}/${getDate()}/${receiver}/${v4()}_${getDate()}.txt`;

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

    const objectKey = `${sender}/${getDate()}/${receiver}/${v4()}_${file.filename.split(".").pop()}`;

    const params2 = {
        Bucket: "nodechatapi-dev-mys3bucket2-1dyh810yatk7",
        Key: objectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
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
