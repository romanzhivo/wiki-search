const http = require('http');
const https = require('https');

function wikiServer(reqString, success, error) {
    const getData = reqString;

    const options = {
        hostname: 'ru.wikipedia.org',
        port: 443,
        path: `/w/api.php?${getData}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', (chunk) => {
            if(success instanceof Function) success({success: 1, data: data});
        });
    });

    req.on('error', (e) => {
        if(error instanceof Function) error({success: 0, data: undefined});
    });

    req.end();
}

module.exports = wikiServer;