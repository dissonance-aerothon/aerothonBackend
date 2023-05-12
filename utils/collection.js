import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verified: Boolean,
  roles: Array,
});

const User = mongoose.model('User', userSchema);

const fabricationSchema = new mongoose.Schema({
  item: String,
  itemId: String,
  rawMaterial: String,
  quantity: String,
  startDate: Date,
  endDate: Date,
});

const Fabrication = mongoose.model('Fabrication', fabricationSchema);

const subAssemblySchema = new mongoose.Schema({
  assemblyId: String,
  process: String,
  itemId: String,
  machineId: String,
  startDate: Date,
  endDate: Date,
});

const SubAssembly = mongoose.model('SubAssembly', subAssemblySchema);

const assemblySchema = new mongoose.Schema({
  process: String,
  processId: String,
  machineId: String,
  startDate: Date,
  endDate: Date,
});

const Assembly = mongoose.model('Assembly', assemblySchema);

export { User, Fabrication, SubAssembly, Assembly };
