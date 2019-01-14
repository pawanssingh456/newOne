var crypto = require("crypto");
const express = require("express");
const users = express.Router();
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const nodemailer = require('nodemailer');
const BCRYPT_SALT_ROUNDS = 12;
var path = require('path');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

require('dotenv').config();

const User = require("../models/User")
users.use(cors())
process.env.SECRET_KEY = 'secret'

users.post('/register', (req,res) => {
    const today = new Date()
    const token = crypto.randomBytes(20).toString('hex');
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        confirmed: req.body.confirmed,
        confirmationtoken: token,
        resetPasswordToken: '',
        resetPasswordExpires: '',
        created: today
    }

    const output = `
    <p>You have a SignUp Request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>Click <a href="http://localhost:5000/users/confirmation/${token}/${req.body.email}">here</a> to activate.</p>
  `;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    tls:{
        rejectUnauthorized:false
  }
});

let mailOptions = {
    from: '"MERN Demo" <pawanssingh456@gmail.com>',
    to: req.body.email,
    subject: 'Confirmation Email!',
    text: 'This is confirmation Email.',
    html: output
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});

    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user) {
            bcrypt.hash(req.body.password, 10, (err,hash) =>{
                userData.password = hash
                User.create(userData)
                .then(user => {
                    res.json({status: "Registered!"})
                })
                .catch(err => {
                    res.send('error: ' + err)
                })
            })
        }
        else{
            res.json({error: "user exists"})
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.post('/login', (req,res) => {
    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(user) {
            if(!user.confirmed)
            {
                res.json({error: "confirm your email"})
            }
            else{
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const payload = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn : 1440
                })
                res.send(token)
            }
            else{
                res.json({error: "user does not exist"})
            }
        }
    }
        else{
            res.json({error: "user does not exist"})
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findIne({
        _id: decoded._id
    })
    .then(user => {
        if(user){
            res.json(user)
        }
        else
        {
            res.send("user does not exist")
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

users.post('/forgotpassword', (req, res) => {
    if (req.body.email === '') {
      res.json('email required');
    }
    console.log(req.body.email);
    User.findOne({
        email: req.body.email
    })
    .then(user => {
      if (user === null) {
        console.log('email not in database');
        res.json('email not in db');
      } 
      else {
        const token = crypto.randomBytes(20).toString('hex');
        
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 360000;
 
                user.save();

                const output = `
                <p>Click <a href="http://localhost:5000/users/resetconfirmation/${token}/${req.body.email}">here</a> to reset password.</p>
            `;

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                },
                tls:{
                    rejectUnauthorized:false
            }
            });

            let mailOptions = {
                from: '"MERN Demo" <pawanssingh456@gmail.com>',
                to: req.body.email,
                subject: 'Reset Email!',
                text: 'This is Reset Email.',
                html: output
            };

            transporter.sendMail(mailOptions, function(err, response) {
                if (err) {
                  console.error('there was an error: ', err);
                } else {
                  console.log('here is the res: ', response);
                  res.status(200).json('recovery email sent');
                }
              });
      }
    })
    .catch(err => {
        res.send('error: ' + err) 
    })
  });

//forgot password ends

//reset confirmation
users.get('/resetconfirmation/:token/:email', (req, res, next) => {
    User.findOne({
        email: req.params.email,
    }).then(user => {
        if(Date.now() > user.resetPasswordExpires)
        {
            res.send("Reset Link Expired");
        }
        else{
            if(user.resetPasswordToken === req.params.token)
            {
                        localStorage.setItem('email1', req.params.email);
                 
                         res.sendFile(path.join(__dirname, '../public', 'index1.html'));
                        // res.render('../public/index1.html', {msg: user.email});

            }
            else{
                res.send("error");
            }
        }
    })
});
//reset confirmation ends

//confirmation email
users.get('/confirmation/:token/:email', (req, res, next) => {
    User.findOne({
        email: req.params.email,
    }).then(user => {
        if(user.confirmationtoken === req.params.token)
        {

              user.confirmed = true;
 
                user.save().then(emp => {

                    
                    res.sendFile(path.join(__dirname, '../public', 'index.html'));
                })

        }
        else{
            res.send("error");
        }
    })
});
//confirmation email ends


//update password

users.put('/updatePassword', (req, res, next) => {
    var email1 = localStorage.getItem('email1');
    User.findOne({
        email: email1
    }).then(user => {
      if (user != null) {
        console.log('user exists in db');
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
              user.password = hashedPassword;
              user.resetPasswordToken = null;
              user.resetPasswordExpires = null;
            user.save();
          })
          .then(() => {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
          });
      }
       else {
        console.log('no user exists in db to update');
        res.status(404).json('no user exists in db to update');
      }
    });
  });

//update password ends

module.exports = users
