import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rinkhata';
    
    await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.log('⚠️  Running without database connection. Some features will not work.');
    console.log('💡 To fix: Install MongoDB locally or use MongoDB Atlas');
    // Don't exit - allow server to run for frontend development
  }
};

export default connectDB;
