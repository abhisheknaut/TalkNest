const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://anautiyal206_db_user:<db_password>@cluster0.rwmcdcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const userSchema = new mongoose.Schema({
  Username: String,
  email:String,
  About:String,
  image:String,
}); 

module.exports = mongoose.model('users', userSchema);


