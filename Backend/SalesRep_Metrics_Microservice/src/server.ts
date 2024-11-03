import app from './app';
import connectDB from './config/db'; 

// Connect to MongoDB and start the metrics service
connectDB()
  .then(() => {
    app.listen(5009, () => {
      console.log('Metrics service is running on port 5009');
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });