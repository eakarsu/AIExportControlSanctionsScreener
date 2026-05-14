const pool = require('../db');

// Map route prefixes to entity_type names
const routeEntityMap = {
  'sanctioned-entities': 'sanctioned_entities',
  'transactions': 'transactions',
  'export-licenses': 'export_licenses',
  'compliance-documents': 'compliance_documents',
};

function auditLogMiddleware(req, res, next) {
  // Only log POST, PUT, DELETE
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) return next();

  // Determine entity type from URL
  const urlParts = req.path.split('/').filter(Boolean);
  const entityType = routeEntityMap[urlParts[0]] || urlParts[0];

  if (!entityType) return next();

  // Wrap res.json to capture entity_id from response
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    // Only log on success (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const entityId = data && (data.id || (req.params && req.params.id));
      const userId = req.user ? req.user.id : null;

      const action = req.method === 'POST' ? 'create' :
        req.method === 'PUT' ? 'update' : 'delete';

      pool.query(
        'INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details, ip_address) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          action,
          entityType,
          entityId || null,
          userId,
          JSON.stringify({ method: req.method, path: req.path, body: req.body }),
          req.ip,
        ]
      ).catch(() => {}); // Fire and forget; never block response
    }
    return originalJson(data);
  };

  next();
}

module.exports = auditLogMiddleware;
