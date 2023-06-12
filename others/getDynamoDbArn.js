const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'ap-south-1' });

async function getStreamInfo(tableName) {
  const params = {
    TableName: tableName
  };

  try {
    const response = await dynamodb.describeTable(params).promise();
    const streamArn = response.Table.LatestStreamArn;
    const streamId = response.Table.LatestStreamLabel;
    return { streamArn, streamId };
  } catch (error) {
    console.error('Error retrieving stream information:', error);
    throw error;
  }
}

const tableName = 'MessageDetails';
getStreamInfo(tableName)
  .then(result => {
    console.log('Stream ARN:', result.streamArn);
    console.log('Stream ID:', result.streamId);
  })
  .catch(error => {
    console.error('Error:', error);
  });
