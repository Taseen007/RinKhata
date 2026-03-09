import app from './app';
import connectDB from './config/db';
import { config } from './config/env';

// Connect to MongoDB
connectDB();

// Start server
const PORT = config.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║     🚀 RinKhata API Server Running            ║
  ║                                               ║
  ║     Port: ${PORT}                               ║
  ║     Environment: ${config.NODE_ENV}              ║
  ║     API: http://localhost:${PORT}                ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('❌ Unhandled Rejection! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
