import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

const blogSchema = new mongoose.Schema({
  data: Object,
});

const Blog = mongoose.model('Blog', blogSchema);

export { User, Blog };
