require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error('MONGO_URL is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MONGO_URL);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Database connected');
});

db.on('disconnected', () => {
  console.log('Database disconnected.');
});

module.exports = db;


















// const mongoose=require('mongoose');
// const dotenv=require('dotenv').config();
// const MONGO_URL=process.env.MONGO_URL;

// mongoose.connect(MONGO_URL,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }
// );

// const db=mongoose.connection;

// db.on('error',(err)=>{
//     console.log('MongoDB connection Error:' , err);
// });

// db.on('connected',()=>{
//     console.log('Database connected');
// });

db.on('disconnected', ()=>{
    console.log("Database disconnected.");
});

module.exports=db;
