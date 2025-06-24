const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <body>
        <h1>Basic Node.js Server Working!</h1>
        <p>Port: 8080</p>
        <p>URL: ${req.url}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Basic server running on http://localhost:8080');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});