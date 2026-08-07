import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8000);

const mimeTypes = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.wav': 'audio/wav',
});

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://127.0.0.1:${port}`);
  const pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);

  return path.normalize(path.join(rootDirectory, pathname));
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'content-type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    response.end(data);
  });
}

http
  .createServer((request, response) => {
    const filePath = resolveRequestPath(request.url);

    if (!filePath.startsWith(rootDirectory)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    sendFile(response, filePath);
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Jogo disponivel em http://127.0.0.1:${port}/`);
  });
