require('dotenv').config();
const { app, httpServer } = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket/socketHandler');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  initSocket(httpServer);
  
  const server = httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle graceful shutdown
  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
