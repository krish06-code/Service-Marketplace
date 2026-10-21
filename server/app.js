const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const httpServer = http.createServer(app);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const routes = [
  ['/api/auth', './routes/auth'],
  ['/api/users', './routes/users'],
  ['/api/providers', './routes/providers'],
  ['/api/categories', './routes/categories'],
  ['/api/services', './routes/services'],
  ['/api/bookings', './routes/bookings'],
  ['/api/reviews', './routes/reviews'],
  ['/api/messages', './routes/messages'],
  ['/api/notifications', './routes/notifications'],
  ['/api/payments', './routes/payments'],
  ['/api/search', './routes/search'],
  ['/api/favourites', './routes/favourites'],
  ['/api/admin', './routes/admin']
];

routes.forEach(([pathUrl, routePath]) => {
  try {
    app.use(pathUrl, require(routePath));
  } catch (err) {
    console.error(`Failed to mount route ${pathUrl}:`, err);
  }
});

app.use(errorHandler);

module.exports = { app, httpServer };
