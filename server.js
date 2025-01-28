const express=require('express');
const dotenv=require('dotenv').config();
const app=express();
const cors=require('cors');
app.use(cors());

const db=require('./db');  //impoorting database setup which has been configured using mongoose 
                            //(ODM- Object Data Modelling) library which acts as bridge b/w node js server and mongoDB database 

// const cors=require('cors'); //cross-origin resource sharing //scurity purpose
// app.use(cors);

const personRoutes=require('./routes/personRoutes');
const notesRoutes=require('./routes/notesRoutes');


const bodyParser=require('body-parser');
// app.use(express.json()); // Middleware to parse json request body into JS objects
app.use(bodyParser.json()) ;   // Middleware to parse any kind of data from req.body //json parser is one of its application //converts into JS object
                                    //and will store that object in req.body 

const port=process.env.PORT || 3110;



const passport =require('./middlewares/authentication');  //A middleware for Authentication
const { jwtAuthMiddleware } = require('./middlewares/jwt'); //jwt middleware for bearer token based authentication 

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local', {session: false});


//Logging Middleware Function //to record the history of login 
const logRequest=(req,res,next)=>{
    console.log(`[ ${new Date().toLocaleString()} ]  Request made to ${req.originalUrl}`);
    next();
}
app.use(logRequest); //app will use logRequest middleware


app.get('/' ,(req,res)=>{
    res.send('HOME ROUTE , HOME PAGE');
});




app.use('/users', personRoutes);
app.use('/notes' , notesRoutes);


                                                        //server status 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});