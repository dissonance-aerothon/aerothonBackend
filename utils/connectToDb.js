import mongoose from 'mongoose';

class ConnectToDB {
  connect = () => {
    mongoose.connect(
      'mongodb+srv://shubham:shubham@cluster0.ydxquyv.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
      console.log('Connected to MongoDB');
    });
  };
}
export default ConnectToDB;
