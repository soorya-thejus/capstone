import app from './app';
import connectDB from './config/db';

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(5006, () => {
      console.log('Server is running on port 5006');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });