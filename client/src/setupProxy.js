'use strict';

const { createProxyMiddleware } = require('http-proxy-middleware');

function proxyTarget(env = process.env) {
  const explicit = env.REACT_APP_API_PROXY_TARGET || env.BACKEND_URL;
  if (explicit) {
    const url = new URL(explicit);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('API proxy target must use HTTP or HTTPS');
    return url.origin;
  }

  const configuredBackendPort = Number(env.BACKEND_PORT);
  const frontendPort = Number(env.PORT || env.FRONTEND_PORT || env.CLIENT_PORT);
  const port = Number.isInteger(configuredBackendPort) && configuredBackendPort > 0
    ? configuredBackendPort
    : Number.isInteger(frontendPort) && frontendPort > 1
      ? frontendPort - 1
      : 4000;
  return `http://127.0.0.1:${port}`;
}

module.exports = function setupProxy(app) {
  app.use('/api', createProxyMiddleware({
    target: proxyTarget(),
    changeOrigin: true,
    ws: false,
  }));
};

module.exports.proxyTarget = proxyTarget;
