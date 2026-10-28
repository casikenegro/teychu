import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

export function createStaticServer() {
  return createServer(async (request, response) => {
    const result = await resolveRequest(request.url);
    response.writeHead(result.status, result.headers);
    response.end(result.body);
  });
}

export async function resolveRequest(requestUrl) {
  try {
    const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
    const requestedPath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = normalize(join(root, requestedPath));

    if (!filePath.startsWith(root) || !(await stat(filePath)).isFile()) {
      throw new Error('Not found');
    }

    return {
      status: 200,
      headers: {
        'cache-control': 'no-cache',
        'content-type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream'
      },
      body: await readFile(filePath)
    };
  } catch {
    return {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: 'Not found'
    };
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createStaticServer().listen(port, '127.0.0.1', () => {
    console.log(`TEYCHU local: http://127.0.0.1:${port}`);
  });
}
