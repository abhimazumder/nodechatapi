const busboy = require('busboy');

function formDataParser(event) {
  return new Promise((resolve, reject) => {
    const busboyInstance = busboy({ headers: event.headers });

    const files = {};
    const fields = {};

    busboyInstance.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const buffers = [];
      file.on('data', (data) => {
        buffers.push(data);
      });
      file.on('end', () => {
        const fileBuffer = Buffer.concat(buffers);
        files[fieldname] = {
          buffer: fileBuffer,
          filename,
          encoding,
          mimetype,
        };
      });
    });

    busboyInstance.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboyInstance.on('finish', () => {
      resolve({ files, fields });
    });

    busboyInstance.on('error', (err) => {
      reject(err);
    });

    busboyInstance.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboyInstance.end();
  });
}

module.exports = { formDataParser };
