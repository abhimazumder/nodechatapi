"use strict";

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.handler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === 'REMOVE') {

            const { content } = record.dynamodb.Keys;
            const objectKey = content.S;
            
            const params = {
                Bucket: 'nodechatapi-dev-mys3bucket2-1dyh810yatk7',
                Key: objectKey,
            }
            await s3.deleteObject(params).promise();
        }
      }
}