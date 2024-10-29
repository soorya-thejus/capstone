const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 6000;

app.use('/api/leads', createProxyMiddleware({ target: 'http://localhost:5001/api/leads', changeOrigin: true }));
app.use('/api/deals', createProxyMiddleware({ target: 'http://localhost:5002/api/deals', changeOrigin: true }));
app.use('/api/accounts', createProxyMiddleware({ target: 'http://localhost:5003/api/accounts', changeOrigin: true }));

app.use('/api/projects', createProxyMiddleware({ target: 'http://localhost:5004/api/projects', changeOrigin: true }));
app.use('/api/contacts', createProxyMiddleware({ target: 'http://localhost:5005/api/contacts', changeOrigin: true }));
app.use('/api/orgs', createProxyMiddleware({ target: 'http://localhost:5006/api/orgs', changeOrigin: true }));
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});