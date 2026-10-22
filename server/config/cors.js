const getAllowedOrigins = () => {
  const envOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  return [
    ...envOrigins,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
};

const isOriginAllowed = (origin) => {
  // Allow requests without Origin (curl, server-to-server, Postman, mobile)
  if (!origin) return true;

  const normalized = origin.trim().replace(/\/+$/, '');
  const allowed = getAllowedOrigins();

  if (allowed.includes(normalized)) return true;

  // Allow any Vercel preview or production deployment (*.vercel.app)
  if (/^https:\/\/.*\.vercel\.app$/.test(normalized)) {
    return true;
  }

  // Allow localhost or 127.0.0.1 on any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

module.exports = {
  isOriginAllowed,
  corsOptions,
};
