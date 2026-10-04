const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDirectory = path.resolve(__dirname, 'public');
const port = Number(process.env.PORT) || 5800;
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2'
};

function setSecurityHeaders(resp) {
    resp.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https://images.unsplash.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    resp.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
    resp.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    resp.setHeader('X-Content-Type-Options', 'nosniff');
    resp.setHeader('X-Frame-Options', 'DENY');
}

function sendNotFound(req, resp) {
    fs.readFile(path.join(publicDirectory, '404.html'), (err, page) => {
        setSecurityHeaders(resp);
        if (err) {
            resp.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            resp.end('Page Not Found');
            return;
        }

        resp.writeHead(404, {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/html; charset=utf-8'
        });
        resp.end(req.method === 'HEAD' ? undefined : page);
    });
}

function serveFile(req, resp, requestPath) {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(requestPath);
    } catch {
        sendNotFound(req, resp);
        return;
    }

    const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
    let filePath = path.resolve(publicDirectory, relativePath);

    if (!filePath.startsWith(`${publicDirectory}${path.sep}`)) {
        sendNotFound(req, resp);
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError) {
            sendNotFound(req, resp);
            return;
        }

        if (stats.isDirectory()) filePath = path.join(filePath, 'index.html');

        fs.readFile(filePath, (readError, data) => {
            setSecurityHeaders(resp);
            if (readError) {
                resp.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                resp.end(req.method === 'HEAD' ? undefined : 'Internal Server Error');
                return;
            }

            const extension = path.extname(filePath).toLowerCase();
            resp.writeHead(200, {
                'Cache-Control': 'no-cache',
                'Content-Type': contentTypes[extension] || 'application/octet-stream'
            });
            resp.end(req.method === 'HEAD' ? undefined : data);
        });
    });
}

const server = http.createServer((req, resp) => {
    let requestPath;
    try {
        requestPath = new URL(req.url, 'http://localhost').pathname;
    } catch {
        sendNotFound(req, resp);
        return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        setSecurityHeaders(resp);
        resp.writeHead(405, {
            'Allow': 'GET, HEAD',
            'Content-Type': 'text/plain; charset=utf-8'
        });
        resp.end('Method Not Allowed');
        return;
    }

    if (requestPath === '/healthz') {
        setSecurityHeaders(resp);
        resp.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' });
        resp.end(req.method === 'HEAD' ? undefined : JSON.stringify({ status: 'ok' }));
        return;
    }

    serveFile(req, resp, requestPath);
});

server.listen(port, '0.0.0.0', () => {
    console.log(`OmSai Tours & Travels listening on port ${port}`);
});