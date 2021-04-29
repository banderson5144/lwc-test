var https = require('https');

var obSessionId = '';

function loginOb()
{
    const xFormBody = `${encodeURIComponent('email')}=${encodeURIComponent(process.env.OB_USERNAME)}&${encodeURIComponent('password')}=${encodeURIComponent(process.env.OB_PASSWORD)}`;

    var options = {
        host: 'app1.ownbackup.com',
        path: '/api/auth/v1/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(xFormBody),
            'Accept': 'application/json'
        }
    };
    
    return new Promise((resolve,reject) => {
        const req = https.request(options, function (res) {
            // This may need to be modified based on your server's response.
            res.setEncoding('utf8');

            let responseBody = '';

            // Build JSON string from response chunks.
            res.on('data', (chunk) => responseBody += chunk);

            res.on('end', function () {
                
                const parsedBody = JSON.parse(responseBody);

                console.log('Logged in successfully to OB');
                console.log(parsedBody.session_id);
                obSessionId = parsedBody.session_id;

                resolve();
            });
        });

        req.write(xFormBody);
        req.end();
        req.on('error', function (e) { reject(e); });
    });
}

function logoutOb()
{
    var options = {
        host: 'app1.ownbackup.com',
        path: '/api/auth/v1/logout',
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'X-SESSION-ID': obSessionId
        }
    };
    
    return new Promise((resolve,reject) => {
        const req = https.request(options, function (res) {
            // This may need to be modified based on your server's response.
            res.setEncoding('utf8');

            let responseBody = '';

            // Build JSON string from response chunks.
            res.on('data', (chunk) => responseBody += chunk);

            res.on('end', function () {
                console.log('Logged out successfully to OB');

                resolve();
            });
        });

        req.end();
        req.on('error', function (e) { reject(e); });
    });
}

function getBkupObjs(sessionId)
{
    var options = {
        host: 'app1.ownbackup.com',
        path: '/api/v1/services/49983/backups/9721666/objects',
        method: 'GET',
        headers: {
            'Accept': '*/*',
            'X-SESSION-ID': obSessionId
        }
    };

    return new Promise((resolve,reject) => {
        const req = https.request(options, function (res) {
            // This may need to be modified based on your server's response.
            res.setEncoding('utf8');

            let responseBody = '';

            // Build JSON string from response chunks.
            res.on('data', (chunk) => responseBody += chunk);

            res.on('end', function () {
                
                const parsedBody = JSON.parse(responseBody);

                resolve(parsedBody);
            });
        });

        req.end();
        req.on('error', function (e) { reject(e); });
    });
}

module.exports.loginOb = loginOb;
module.exports.getBkupObjs = getBkupObjs;
module.exports.logoutOb = logoutOb;