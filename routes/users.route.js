let User = require('../models/user.model').User;
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let auth = require('../controllers/auth');

router.post('/login', async (req, resp) => {
    let email = req.body.email;
    let password = req.body.password;

    let users = await User.find().where({email: email});  // find() give array
    if(users.length > 0) {
        // console.log(users);
        let comparisonResult = await bcrypt.compare(password, users[0].password);   // this gives boolean value - true or false
        // password will be encrypted and then compared with password saved in database as saved password is also encrypted
        // that is why the password came as request is encypted first using compare() function
        if(comparisonResult) {
            let token = auth.generateToken(users[0]);
            resp.cookie('auth_token', token);   // cookie is also a fumction of express as express provides this functionality where we can save cookies of each client
            resp.send({
                redirectURL: '/admin'
            });
        } else {
            resp.send({message: 'Rejected'});
        }
    } else {
        resp.send({message: 'Rejected'});
    }
})

router.post('/register', async (req, resp) => {
    let email = req.body.email;
    let password = req.body.password;

    let users = await User.find().where({email: email});    // find() give array
    if(users.length === 0) {
        let encryptedPass = await bcrypt.hash(password, 12); // encrypted password will be saved
        let newUser = new User({  // we can also directly write new User({ email, password }) - when key & value has same name
            email: email,
            password: encryptedPass
        })
        await newUser.save();
        resp.send({message: 'Done'});
    } else {
        resp.send({message: 'This email has been used'});
    }
})

module.exports = router;