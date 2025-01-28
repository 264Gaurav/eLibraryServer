const express = require('express');
const router = express.Router();
const User = require('../models/Person');
const {jwtAuthMiddleware , generateToken} =require('../middlewares/jwt');

const checkAdminRole = async (userID) => {
    try{
         const user = await User.findById(userID);
         if(user.role === 'admin'){
             return true;
         }
    }catch(err){
         return false;
    }
 }

 const checkAuthorRole = async (userID) => {
    try{
         const user = await User.findById(userID);
         if(user.role === 'author'){
             return true;
         }
    }catch(err){
         return false;
    }
 }



// Create a new user  //signup
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        const user = await User.findOne({ email:data.email });
        if (user) return res.status(404).json({ message: 'User already exist' });
        
        const newUser = new User(data);
        const response = await newUser.save();

        res.status(200).json({response:response});
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
});

//Login route 
router.post('/login' , async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        //if username and password is correct
        const token = generateToken(user);
        res.json({message:"Logged in successfully" , token });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
})



//profile route 
router.get('/profile',jwtAuthMiddleware , async(req,res)=>{
    try {
        const userData= req.user;
        console.log("userData" , userData);

        const user = await User.findById(userData.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
});


//update profil route 
router.put('/profile/password',jwtAuthMiddleware , async(req,res)=>{
    try {
        const userData= req.user; //data extracted from jwt token 
        console.log("userData" , userData);
        const{currentPassword , newPassword}=req.body; //data extracted from req body 
        console.log(currentPassword , newPassword);
        console.log("userData" , userData);

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        if(currentPassword===newPassword)
            return res.status(400).json({ message: 'New password cannot be the same as current password' });

        //check if the user's current password mathches 
        const user = await User.findById(userData.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        //if the user's current password matches, update the password
        user.password = newPassword;
        console.log(user);
        await user.save();

       res.status(200).json({message: 'Password updated successfully'});

    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
})




//          // Get all users
// router.get(`/`, async (req, res) => {
//     try {
//         const response = await User.find();
//         res.status(200).json(response);
//         console.log('User data fetched.');
//     } catch (err) {
//         console.error('Error:', err.message);
//         res.status(500).send(`Server Error: ${err.message}`);
//     }
// });


//                  // Get users by type
// router.get('/:userType', async (req, res) => {
//     try {
//         const userType = req.params.userType;
//         if (['admin', 'author', 'reader'].includes(userType)) {
//             const response = await User.find({ user: userType });
//             res.status(200).json(response);
//             console.log(`${userType} data fetched.`);
//         } else {
//             res.status(404).send('Invalid user type');
//         }
//     } catch (err) {
//         console.error('Error:', err.message);
//         res.status(500).send(`Server Error: ${err.message}`);
//     }
// });


//           // Update a user by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const updatedUserData = req.body;
//         const response = await User.findByIdAndUpdate(userId, updatedUserData, {
//             new: true,
//             runValidators: true
//         });

//         if (!response) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         console.log('User updated:', response);
//         res.status(200).json(response);
//     } catch (err) {
//         console.error('Error:', err.message);
//         res.status(500).send(`Server Error: ${err.message}`);
//     }
// });



//             // Delete a user by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const response = await User.findByIdAndDelete(userId);

//         if (!response) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         console.log("User account deleted");
//         res.status(200).json("User account deleted successfully.");
//     } catch (err) {
//         console.error('Error:', err.message);
//         res.status(500).send(`Server Error: ${err.message}`);
//     }
// });




module.exports = router;
