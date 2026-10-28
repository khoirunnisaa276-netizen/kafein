const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname);
const host = '127.0.0.1';
const port = Number(process.env.PORT) || 5500;
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
  } catch {
    response.writeHead(400).end('Bad Request');
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR') {
        response.writeHead(404).end('Not Found');
        return;
      }
      console.error(`Unable to read ${filePath}:`, error);
      response.writeHead(500).end('Internal Server Error');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    response.end(contents);
  });
});

server.listen(port, host, () => {
  console.log(`Kafein running at http://${host}:${port}`);
});

server.on('error', error => {
  console.error(`Unable to start server: ${error.message}`);
  process.exitCode = 1;
});
