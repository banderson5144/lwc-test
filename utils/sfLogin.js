var jwt = require('salesforce-jwt-bearer-token-flow');
//let privateKey = require('fs').readFileSync('./src/server/keys/server.key', 'utf8');
let privateKey = process.env.SF_JWT;

// console.log(privateKey);

function loginToSf()
{
    return new Promise((resolve,reject) =>
    {
        jwt.getToken({
            iss: process.env.SF_CLIENT_ID,
            sub: process.env.SF_USERNAME,
            aud: 'https://login.salesforce.com',
            privateKey: privateKey
        }, function(err, response) {
            if (err)
            {
                console.error(err);
            }else
            {
                console.log('Successfully connected to Org');
                resolve(response);
            }
        });
    });
}

module.exports.loginToSf = loginToSf;