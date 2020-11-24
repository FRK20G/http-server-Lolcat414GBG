const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();

const mime = {
    html: 'text/html',
    css: 'text/css',
    svg: 'image/svg+xml',
    js: 'text/javascript',
    mp3: 'audio/mpeg',
    ico: 'image/x-icon'
};

server.on('request', (request, response) => {
    console.log('------Request------');
    console.log('Request url: ', request.url);
    console.log('dirname: ', __dirname);
    console.log('File extension: ', path.extname(request.url));
    console.log('-------End request---------');
    //Ta ut file extension från url:en som efterfrågas
    //const fileExtension = path.extname(request.url);

    if (request.url === '/') {
        const src = fs.createReadStream('index.html');
        src.pipe(response);
    } else {
        const baseUrl = __dirname + request.url;
        const src = fs.createReadStream(baseUrl);

        const type = mime[path.extname(baseUrl).slice(1)] || 'text/plain';

        console.log('Type---> ', type);

        src.on('open', () => {
            response.setHeader('Content-Type', type);

            if (type === 'audio/mpeg') {
                const stats = fs.statSync(__dirname + request.url);
                const fileSize = stats.size;
                response.setHeader('Content-Length', fileSize);
                response.setHeader('Accept-Ranges', 'bytes');
            }

            src.pipe(response);
        });

        src.on('error', () => {
            response.end('Sidan kan inte hittas');
        });
    }
});

server.listen(8000);