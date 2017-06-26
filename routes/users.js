/**
 * Created by Nesrine on 05/05/2017.
 */
const express = require ('express');
const router = express.Router();
const passport= require('passport');
const jwt = require('jsonwebtoken');

const config=require('../config/database');

const User = require('../models/user');




//Register
router.post('/register', (req, res, next)=> {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        tags: req.body.tags
    });

User.addUser(newUser, (err, user) => {
    if(err){
        res.json({success: false, msg:'Erreur en créant le compte'});
    } else {
        res.json({success: true, msg:'Compte créee'});
}
});
});


//Authenticate
router.post('/authenticate', (req, res, next)=> {
    const username=req.body.username;
    const password=req.body.password;

    User.getUserByUsername(username,(err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg:'Utilisateur introuvable'});}
        User.comparePassword(password, user.password, (err, isMatch)=> { //comparePassword defined in user.js (models)
            if(err) throw err;
            if(isMatch) {
                const token=jwt.sign(user, config.secret, {//creating a token for the authentification
                    expiresIn: 604800 //Tokn expires in a week (in seconds)
                });
                res.json(
                    {   success: true,
                        token:'JWT '+token,
                        user:{//putting it this way will help us avoid sending the password with the object user
                        id:user._id,
                        name:user.name,
                        username:user.username,
                        email:user.email,
                        tags:user.tags
                    } });
            }
else {return res.json({success: false, msg:'Mot de passe incorrect'});}
        });
    });
});

//Profile
router.get('/profile', passport.authenticate('jwt',{session:false}),(req, res, next)=> { //passport.authenticate('jwt',{session:false}) is to protect the route when not authentified
   res.json({user:req.user});
});


module.exports=router;