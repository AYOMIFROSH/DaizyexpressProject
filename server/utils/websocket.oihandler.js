const https = require('https');

// Function to send a notification
const notifyWebSocketServer = (event, data) => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ event, data });
        const options = {
            hostname: 'websocket-oideizy.onrender.com',
            port: 443,
            path: '/notify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            console.log(`Status code: ${res.statusCode}`);
            res.on('data', (chunk) => {
                console.log(`Response: ${chunk.toString()}`);
            });
            resolve(res);
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);  // Reject the promise on error
        });

        req.write(postData);
        req.end();
    });
};

module.exports = notifyWebSocketServer;

