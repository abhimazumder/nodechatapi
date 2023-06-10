const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const fetchContent = async (dataItems) => {
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

module.exports = { fetchContent };