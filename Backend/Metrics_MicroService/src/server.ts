import app from './app';
import connectDB from './config/db'; // Adjust the path as necessary

// Connect to MongoDB and start the metrics service
connectDB()
  .then(() => {
    app.listen(5008, () => {
      console.log('Metrics service is running on port 5008');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
