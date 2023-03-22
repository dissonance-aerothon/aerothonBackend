import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

const gameSchema = new mongoose.Schema({
  name: String,
  url: String,
  author: String,
  publishedDate: Date,
});

const Game = mongoose.model('Game', gameSchema);

const blogSchema = new mongoose.Schema({
  data: Object,
});

const Blog = mongoose.model('Blog', blogSchema);

export { Blog, User, Game };
