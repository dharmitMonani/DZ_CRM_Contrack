const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

console.log('FRONTEND_URL =', process.env.FRONTEND_URL);
console.log('NODE_ENV =', process.env.NODE_ENV);

connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://dz-crm-contract.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman, mobile apps, curl, etc.
      if (!origin) {
        return callback(null, true);
      }

      // Exact match
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (
        origin.includes('.vercel.app') &&
        origin.includes('dz-crm-contract')
      ) {
        return callback(null, true);
      }

      console.log('❌ CORS Blocked Origin:', origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'DZ CRM API is running'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 DZ CRM Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});