import mongoose from 'mongoose';

const connectDB = () => {
  mongoose
    .connect('mongodb://127.0.0.1:27017/Chat-App')
    .then(() => console.log('Connected to ChatDB database'))
    .catch((error) => console.error('Error connecting to ChatDB database:', error));
};

export default connectDB;
