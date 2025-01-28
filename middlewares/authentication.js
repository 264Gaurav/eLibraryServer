// passport is a popular middleware for Node.js that facilitates user authentication. It is flexible and can be easily integrated with different
//  strategies for authentication, including local authentication (username and password), OAuth, OpenID, and more.
// passport-local is one such strategy provided by Passport for authenticating with a username and password.

const passport=require('passport');
const LocalStrategy= require('passport-local').Strategy;

const User=require('../models/Person');


passport.use(new LocalStrategy(async (username, password, done) => {
    try{
        // console.log(`Received credential - ${username} ${password}`); //sensitive
        const user=await User.findOne({username:username});
        console.log(user)
        if(!user) return done(null, false, {message: 'Invalid username'});

        const isPasswordMatch=await user.comparePassword(password);
        if(isPasswordMatch) return done(null , user);
       
        else return done(null , false , {message: 'Incorrect Password.'});
       

    }catch(err){
        console.error('Error:', err.message);
        return done(null, false, {message: 'Server Error'});
    }
} ));




module.exports=passport; //export configured passport