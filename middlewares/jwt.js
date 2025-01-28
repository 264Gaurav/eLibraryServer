const jwt= require('jsonwebtoken');
const dotenv=require('dotenv')
const JWT_SECRET=process.env.JWT_SECRET;

const jwtAuthMiddleware=(req,res,next)=>{
    const token=req.headers['authorization']?.split(' ')[1]; //Bearer token  //token at index 1
    if(!token){
        return res.status(401).json({error:'Token not found'});
    }

    //token found then-
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        console.log(err);
        return res.status(403).json({error:'Invalid token'});
    }
}





//Function to generate jwt token 

const generateToken=(user)=>{
    //generate a new JWT token using user data 
    return jwt.sign({id:user.id ,user:user?.user},JWT_SECRET,{expiresIn:'48h'});
}



module.exports={jwtAuthMiddleware , generateToken} ;