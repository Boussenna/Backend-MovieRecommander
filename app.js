/**
 * Created by Nesrine on 05/05/2017.
 */
const express=require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors=require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
//Connect to database
mongoose.connect(config.database);
//On connection do this
mongoose.connection.on('connected', ()=> {
    console.log('connected to database'+config.database);
});


//When error found, show error
mongoose.connection.on('error', (err)=> {
    console.log('Database error:'+err);
});


const app = express();


const users = require('./routes/users');
//Port Number
const port =3000;
//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));
//Body Parser Middleware
app.use(bodyParser.json());
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Apply
require('./config/passport')(passport);


app.use('/users', users);
//Index route
app.get('/',(req, res) => {
    res.send('Invalid Endpoint');
});


//every route shall go to index.html once we build the ang2 app
/*app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});*/


//start server
app.listen(port, () => {
    console.log('Server started on port'+port);
});

