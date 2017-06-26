/**
 * Created by Nesrine on 06/05/2017.
 */
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//Bring the model
const User = require('../models/user');
//Bring the database conf
const config = require('../config/database');

//Make this code accessible
module.exports = function (passport) {

    let opts ={};
    opts.jwtFromRequest=ExtractJwt.fromAuthHeader();
    opts.secretOrKey=config.secret;
    passport.use(new JwtStrategy(opts,(jwt_payload, done)=>{
        console.log(jwt_payload);
        User.getUserById(jwt_payload._doc, (err,user)=> {
            if (err) {
                return done(err, false);
            }
            if (user) {
               return done(null, user);
            } else {
                return done(null, false);
}
});
        }));
}
