import mongoose from 'mongoose';

// Hard-coded database configuration for MongoDB connection
const mongoURI = 'mongodb://127.0.0.1:27017/organizationsDB'; // Update with your MongoDB URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;