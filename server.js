const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

// Initialize SQLite database in memory for zero-dependency reliability and easy resets
const db = new DatabaseSync(':memory:');

// Create tables
db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    secret_note TEXT
  );
`);

db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );
`);

// Seed Products (for Repeater Lab)
const insertProduct = db.prepare(`
  INSERT INTO products (id, name, price, description, secret_note)
  VALUES (?, ?, ?, ?, ?)
`);
insertProduct.run(1, 'Alpha-X Developer Laptop', 1249.99, '16-inch high-performance developer workstation with 32GB RAM and 1TB SSD.', 'Standard retail item. Ship via standard logistics.');
insertProduct.run(2, 'Quantum Phone v4', 849.50, 'Secure next-gen smartphone featuring built-in quantum cryptography module.', 'Standard retail item. Restricted export rules apply.');
insertProduct.run(3, 'SonicBuds Pro', 149.99, 'Active noise-cancelling wireless earbuds with spatial audio support.', 'Standard retail item.');
insertProduct.run(999, 'Developer Workstation Notes', 0.00, 'Developer Debug Log: Source backups are archived locally in /backup.zip for easy restore.', 'INTERNAL NOTE: Remember to delete /backup.zip before staging to production!');
insertProduct.run(1337, 'Flagship Admin Mainframe Console', 99999.99, 'Classified hardware terminal for system administrators. FLAG{REPEATER_TAMPERING_SUCCESS}', 'RESTRICTED DEPLOYMENT. System Flag unlocked.');

// Seed Users (for Intruder Username Enumeration Lab)
const insertUser = db.prepare(`
  INSERT INTO users (username, password, role)
  VALUES (?, ?, ?)
`);
insertUser.run('admin', 'sunshine', 'admin');
insertUser.run('security', 'burpsuite', 'analyst');
insertUser.run('guest', 'guest123', 'user');
insertUser.run('support', 'helpdesk911', 'staff');
insertUser.run('maintenance', 'grease123', 'staff');

// Server configuration
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Counter for Sequencer Lab
let sessionCounter = 1000;

// Global Progress Object (stored in memory, resets with server)
let progressStore = {
  proxy: false,
  target: false,
  history: false,
  repeater: false,
  intruder: false,
  comparer: false,
  decoder: false,
  sequencer: false,
  organizer: false,
  logger: false,
  collaborator: false
};

// Helper for Mock JWT Tokens
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateMockJWT(payload, role) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(role === 'admin' ? 'admin_signature_payload' : 'user_signature_payload');
  return `${headerB64}.${payloadB64}.${signature}`;
}

// Global Middleware to pass progress state to all templates
app.use((req, res, next) => {
  res.locals.progress = progressStore;
  next();
});

// Reset endpoint
app.post('/api/reset', (req, res) => {
  sessionCounter = 1000;
  for (let key in progressStore) {
    progressStore[key] = false;
  }
  res.json({ success: true, message: 'All labs and progress have been reset.' });
});

// Flag completion validator helper
app.post('/api/submit-flag', (req, res) => {
  const { lab, flag } = req.body;
  const flags = {
    proxy: 'FLAG{PROXY_INTERCEPT_OK}',
    target: 'FLAG{DEVELOPER_BACKDOOR_FOUND}',
    history: 'FLAG{HTTP_HISTORY_BIO_SAVED}',
    repeater: 'FLAG{REPEATER_TAMPERING_SUCCESS}',
    intruder: 'FLAG{INTRUDER_PIN_CRACKED}',
    comparer: 'FLAG{JWT_COMPARER_SUCCESS}',
    decoder: 'FLAG{URL_Decode_OK}',
    sequencer: 'FLAG{SEQUENCER_PREDICTABLE_TOKENS}',
    organizer: 'FLAG{ORGANIZER_KEYS_SAVED}',
    logger: 'FLAG{LOGGER_SECRET}',
    collaborator: 'FLAG{OUT_OF_BAND_SIMULATION}'
  };

  if (flags[lab] && flags[lab] === flag.trim()) {
    progressStore[lab] = true;
    return res.json({ success: true, message: `Correct flag! Lab completed successfully.` });
  } else {
    return res.json({ success: false, message: `Incorrect flag. Please try again.` });
  }
});

// --------------------------------------------------
// ROUTING DEFINITIONS
// --------------------------------------------------

// Homepage
app.get('/', (req, res) => {
  res.render('index', { title: 'Dashboard' });
});

// 1. Proxy Lab
app.get('/proxy', (req, res) => {
  res.render('proxy', { title: 'Proxy Lab', submission: null });
});

app.post('/proxy/submit', (req, res) => {
  // Capture request data exactly as received
  const receivedData = {
    method: req.method,
    headers: req.headers,
    body: req.body,
    cookies: req.headers.cookie || 'None',
    url: req.url
  };

  // Custom response if they modified credentials
  let resultMessage = "Login failed. Invalid credentials.";
  let flagFound = null;

  if (req.body.username === 'admin' && req.body.password === 'admin_override') {
    resultMessage = "Access Granted! Flag: FLAG{PROXY_INTERCEPT_OK}";
    flagFound = "FLAG{PROXY_INTERCEPT_OK}";
  } else if (req.headers['x-admin-bypass'] === 'true') {
    resultMessage = "Admin Bypass Header Detected! Access Granted! Flag: FLAG{PROXY_INTERCEPT_OK}";
    flagFound = "FLAG{PROXY_INTERCEPT_OK}";
  } else if (req.headers.cookie && req.headers.cookie.includes('admin_session=true')) {
    resultMessage = "Admin Session Cookie Detected! Access Granted! Flag: FLAG{PROXY_INTERCEPT_OK}";
    flagFound = "FLAG{PROXY_INTERCEPT_OK}";
  }

  res.render('proxy', {
    title: 'Proxy Lab',
    submission: receivedData,
    resultMessage,
    flagFound
  });
});

// 2. Target Lab (Hidden URLs mapped here)
app.get('/target', (req, res) => {
  res.render('target', { title: 'Target Lab', queryPage: req.query.page || 'home' });
});

// Hidden target endpoints
app.get('/admin', (req, res) => {
  res.status(403).send(`
    <html>
      <head><title>403 Forbidden</title></head>
      <body style="background:#0a0e17; color:#ef4444; font-family:sans-serif; text-align:center; padding-top:10%;">
        <h1>403 Forbidden</h1>
        <p style="color:#9ca3af;">Access to this area is restricted to localhost administrators only.</p>
        <!-- NOTE: Local developers can bypass this by visiting /secret directly in development -->
      </body>
    </html>
  `);
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT id, username, role FROM users').all();
  res.json(users);
});

app.get('/secret', (req, res) => {
  res.send(`
    <html>
      <head><title>Secret Dev Vault</title></head>
      <body style="background:#0a0e17; color:#06b6d4; font-family:sans-serif; padding:5%; line-height:1.6;">
        <h1>Confidential Developer Area</h1>
        <p style="color:#f3f4f6;">You discovered the secret dev site! Flag: FLAG{SITEMAP_DISCOVERY_COMPLETED}</p>
        <p style="color:#9ca3af;">However, the production backend backdoor is located at: <strong>/debug-api-v2</strong></p>
      </body>
    </html>
  `);
});

app.get('/backup.zip', (req, res) => {
  // Return a mock ZIP file
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="backup.zip"');
  res.send(Buffer.from("PK\x03\x04\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x1c\x00backup_readme.txtUT\t\x00\x03\x00\x00\x00\x00\x00\x00\x00ux\x0b\x00\x01\x04\xf5\x01\x00\x00\x04\x14\x00\x00\x00Burp Suite Target Sitemap Backup: Use /debug-api-v2 endpoint for emergency restore operations. PK\x01\x02\x1e\x03\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\r\x00\x10\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xb0\x81\x00\x00\x00\x00backup_readme.txtUT\x05\x00\x03\x00\x00\x00\x00ux\x0b\x00\x01\x04\xf5\x01\x00\x00\x04\x14\x00\x00\x00PK\x05\x06\x00\x00\x00\x00\x01\x00\x01\x00;\x00\x00\x00\x00\x00\x00\x00\x00\x00"));
});

app.get('/debug-api-v2', (req, res) => {
  res.json({
    status: "debug_mode_enabled",
    notes: "Backdoor endpoint activated.",
    flag: "FLAG{DEVELOPER_BACKDOOR_FOUND}"
  });
});

// 3. HTTP History Lab
app.get('/history', (req, res) => {
  res.render('history', { title: 'HTTP History Lab' });
});

app.get('/history/search', (req, res) => {
  const query = req.query.q || '';
  // Generate random API search logs
  res.json({
    query,
    timestamp: Date.now(),
    results: [
      { id: 101, title: `Search result for: ${query} (Item A)` },
      { id: 102, title: `Search result for: ${query} (Item B)` }
    ]
  });
});

app.post('/history/update-bio', (req, res) => {
  const bio = req.body.bio || '';
  res.json({
    status: 'success',
    updated_bio: bio,
    flag: 'FLAG{HTTP_HISTORY_BIO_SAVED}'
  });
});

// 4. Repeater Lab
app.get('/repeater', (req, res) => {
  res.render('repeater', { title: 'Repeater Lab', product: null, error: null });
});

app.get('/product', (req, res) => {
  const productId = req.query.id;
  if (!productId) {
    return res.render('repeater', { title: 'Repeater Lab', product: null, error: 'No Product ID provided. Usage: /product?id=1' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(productId);

    if (product) {
      return res.render('repeater', { title: 'Repeater Lab', product, error: null });
    } else {
      return res.render('repeater', { title: 'Repeater Lab', product: null, error: `Product ID [${productId}] not found.` });
    }
  } catch (err) {
    return res.render('repeater', { title: 'Repeater Lab', product: null, error: `Database error: ${err.message}` });
  }
});

// 5. Intruder Lab
app.get('/intruder', (req, res) => {
  res.render('intruder', { title: 'Intruder Lab' });
});

app.post('/intruder/guess', (req, res) => {
  const guess = parseInt(req.body.guess, 10);
  if (isNaN(guess)) {
    return res.json({ status: "error", message: "Please provide a valid integer guess." });
  }
  if (guess === 17) {
    return res.json({ status: "success", flag: "FLAG{INTRUDER_SNIPER_NUMBER}", message: "Correct! You guessed the secret number!" });
  } else {
    return res.json({ status: "fail", message: "Incorrect guess. Try again." });
  }
});

app.post('/intruder/pin', (req, res) => {
  const pin = req.body.pin;
  if (!pin) {
    return res.json({ status: "error", message: "PIN parameter missing." });
  }
  if (pin === '0074') {
    return res.json({ status: "success", flag: "FLAG{INTRUDER_PIN_CRACKED}", message: "Access granted! PIN authenticated." });
  } else {
    return res.status(403).json({ status: "denied", message: "Access Denied. Invalid PIN code." });
  }
});

app.post('/intruder/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).send("Error: Username missing.");
  }

  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username);

  if (!user) {
    // Shorter message if user doesn't exist
    return res.status(400).send("Error: User not found.");
  }

  if (user.password === password) {
    return res.send(`Authentication Successful! Welcome, ${username}. Flag: FLAG{USER_ENUMERATION_SUCCESS}`);
  } else {
    // Noticeably longer message if user exists but password is bad
    return res.status(400).send(`Error: Password is incorrect for existing user.`);
  }
});

// 6. Comparer Lab
app.get('/comparer', (req, res) => {
  res.render('comparer', { title: 'Comparer Lab' });
});

app.get('/comparer/tokens', (req, res) => {
  const userToken = generateMockJWT({
    user: "guest_user",
    role: "guest",
    iat: 1780000000,
    perm: ["read:public", "read:docs"],
    uuid: "a8f3-8b7c-4011"
  }, 'user');

  const adminToken = generateMockJWT({
    user: "admin_superuser",
    role: "admin",
    iat: 1780000001,
    perm: ["read:public", "read:docs", "read:private", "write:system", "execute:commands"],
    uuid: "a8f3-8b7c-4012"
  }, 'admin');

  res.json({ userToken, adminToken });
});

app.post('/comparer/check-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ status: "error", code: 401, message: "Missing or malformed Authorization header." });
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('.');
  if (parts.length !== 3) {
    return res.json({ status: "error", code: 400, message: "Invalid JWT format." });
  }

  try {
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);

    if (payload.role === 'admin' && parts[2] === base64UrlEncode('admin_signature_payload')) {
      return res.json({
        status: "success",
        code: 200,
        authorized: true,
        user: payload.user,
        role: payload.role,
        timestamp: Date.now(),
        privileges: payload.perm,
        flag: "FLAG{JWT_COMPARER_SUCCESS}",
        environment: "Production Cluster Admin Server console activated",
        debug_notes: "Comparisons successfully resolved standard JWT structural diffs."
      });
    } else {
      return res.json({
        status: "success",
        code: 200,
        authorized: false,
        user: payload.user,
        role: payload.role,
        timestamp: Date.now(),
        privileges: payload.perm || ["guest"],
        flag: "Access Denied: Standard Guest Dashboard",
        environment: "Staging Sandbox Demo Cluster only",
        debug_notes: "Upgrade permissions to admin to reveal production secrets."
      });
    }
  } catch (e) {
    return res.json({ status: "error", code: 400, message: "Failed to parse token details." });
  }
});

// 7. Decoder Lab
app.get('/decoder', (req, res) => {
  // Generate a mock JWT for the Decoder Lab
  const decoderJWT = generateMockJWT({ role: "administrator", flag: "FLAG{JWT_DECODED_SECRET}" }, 'admin');
  res.render('decoder', { title: 'Decoder Lab', decoderJWT });
});

// 8. Sequencer Lab
app.get('/sequencer', (req, res) => {
  res.render('sequencer', { title: 'Sequencer Lab' });
});

app.get('/sequencer/generate', (req, res) => {
  sessionCounter++;
  const token = `SESSION-${sessionCounter}`;
  // Set the session cookie
  res.cookie('SESSION-TOKEN', token, { httpOnly: true });
  res.json({ token, flag: "FLAG{SEQUENCER_PREDICTABLE_TOKENS}" });
});

// 9. Organizer Lab
app.get('/organizer', (req, res) => {
  res.render('organizer', { title: 'Organizer Lab' });
});

// Endpoints for Organizer to hit to populate history
app.post('/api/auth/login', (req, res) => {
  res.setHeader('X-Security-Header', 'Strict-Localhost-Only');
  res.json({
    status: "success",
    message: "Login parsed.",
    api_key: "KEY_77492_SECRET_RESTRICTED"
  });
});

app.get('/api/debug/config', (req, res) => {
  res.json({
    environment: "dev_testing",
    db_type: "sqlite_in_memory",
    backup_path: "c:/xampp/htdocs/database.db",
    flag_reference: "FLAG{ORGANIZER_KEYS_SAVED}"
  });
});

app.get('/api/admin/system-diagnostics', (req, res) => {
  res.json({
    cpu_usage: "12%",
    memory_available: "1.4GB",
    active_session_tokens: sessionCounter - 1000,
    integrity_check: "OK"
  });
});

// 10. Logger Lab
app.get('/logger', (req, res) => {
  res.render('logger', { title: 'Logger Lab' });
});

// Background requests for Logger
app.get('/api/telemetry', (req, res) => {
  res.json({ status: "logged", ts: Date.now() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: "healthy", connections: 4 });
});

app.get('/api/ping', (req, res) => {
  res.send("pong");
});

app.get('/api/status', (req, res) => {
  res.json({ system: "online", disk: "ok" });
});

app.get('/api/admin/debug-flag', (req, res) => {
  // Check for the custom secret header
  if (req.headers['x-debug-key'] === 'teach-burp') {
    return res.json({
      status: "authorized",
      flag: "FLAG{LOGGER_SECRET}"
    });
  }
  res.status(403).json({ status: "unauthorized", message: "Debug secret header 'X-Debug-Key' mismatched." });
});

// 11. Collaborator Theory Lab
app.get('/collaborator', (req, res) => {
  res.render('collaborator', { title: 'Collaborator Theory Lab' });
});

app.post('/api/collaborator/trigger', (req, res) => {
  const { domain } = req.body;
  if (!domain || domain.trim() === '') {
    return res.json({ success: false, message: "Please specify a domain/payload address." });
  }

  // Simulate callbacks back to the collaborator
  // We send a list of simulated server interaction steps
  const simulationSteps = [
    { type: 'info', msg: `SSRF Payload processed on server. Parsed host: ${domain}` },
    { type: 'dns', msg: `Lookup request generated: Resolving IP for ${domain}...` },
    { type: 'dns_ok', msg: `DNS lookup succeeded. Collaborator NS responded. Query logged at Collaborator.` },
    { type: 'http', msg: `SSRF Triggered: Sending HTTP GET request to http://${domain}/robots.txt...` },
    { type: 'http_ok', msg: `HTTP request received by Collaborator IP. Server header: BurpCollaborator/1.0` },
    { type: 'flag', msg: `Callback Verification Complete. Flag: FLAG{OUT_OF_BAND_SIMULATION}` }
  ];

  res.json({ success: true, steps: simulationSteps });
});

// Start server
server.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`Burp Suite Interactive Training Lab running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`=============================================================`);
});
