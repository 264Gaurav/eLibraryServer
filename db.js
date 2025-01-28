const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
const MONGO_URL=process.env.MONGO_URL;

mongoose.connect(MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db=mongoose.connection;

db.on('error',(err)=>{
    console.log('MongoDB connection Error:' , err);
});

db.on('connected',()=>{
    console.log('Database connected');
});

db.on('disconnected', ()=>{
    console.log("Database disconnected.");
});

module.exports=db;
