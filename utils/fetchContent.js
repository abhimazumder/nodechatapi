const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const fetchContent = async (item) => {
        const params = {
            Bucket: 'nodechatapi-dev-mys3bucket2-1dyh810yatk7',
            Key: item.content,
        };
        const data = await s3.getObject(params).promise();
        const fileExtension = item.content.split('.').pop();
        if (fileExtension.toLowerCase() === 'txt') {
            item.content = data.Body.toString('utf-8');
        } else {
            item.content = new Buffer.from(data.Body).toString('base64');
        }

    return item;
}

module.exports = { fetchContent };