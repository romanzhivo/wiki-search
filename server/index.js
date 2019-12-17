const http = require('http');
const url = require('url');
const API = require('./functions');

const hostname = '127.0.0.1';
const port = 8001;

const server = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);
    const pathName = parsedURL.pathname;
    const isAPI = parsedURL.pathname.split('/')[1].toLowerCase() === 'api';
    let responseData = {};
    let method = req.method;
    let requestedFunction = getRequestedFunctionName(pathName);
    let requestedParams = parsedURL.query;

    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type');
    res.setHeader('Access-Control-Expose-Headers', 'Date');

    if(method.toLowerCase() === 'options')  {
        res.end();
        return;
    }

    if(!isAPI || !requestedFunction || API[requestedFunction] instanceof  Function === false) {
        bedRequestEnd(res);
        return;
    }

    API[requestedFunction](requestedParams).then(
        (success)=>{
            console.log('Удача', success);
            res.statusCode = 200;
            res.end(JSON.stringify(success));
        },
        (error)=>{
            console.log('Неудача', error);
            responseData.success = error.success;
            responseData.data = error.data;

            res.statusCode = 400;
            res.end(JSON.stringify(responseData));
        }
    )
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Private functions
function bedRequestEnd(res) {
    res.statusCode = 400;
    res.end(JSON.stringify({error: "Bad request"}));
}

function getRequestedFunctionName(pathName) {
    const pathArr = pathName.split('/').filter((el)=>{return el});
    let funcName = '';

    pathArr.forEach((el, i) => {
        if(el && i > 0) {
            let firstFraction = i === 1 ? el : el.charAt(0).toUpperCase();
            let secondFraction = i === 1 ? '' : el.substring(1);

            funcName += firstFraction + secondFraction;
        }
    });

    return funcName;
}
// Private functions : END