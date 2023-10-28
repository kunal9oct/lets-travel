let express = require('express');
let app = express();
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');  // so that server can read the cookie correctly

let multer = require('multer');  // multer is used to read binary data file or convert it into readable 
// like binary data coming in formdata fromat example - input of type file is converted into binary data in formdata format 

let postsRouter = require('./routes/posts.route');
// so here is the begining of route and ending is in posts.route file
let callbackRequestsRouter = require('./routes/callback-requests.route');
let emailsRouter = require('./routes/emails.route');
let usersRouter = require('./routes/users.route');

let Post = require('./models/post.model').Post;
let auth = require('./controllers/auth');

//  !!!!!!!!     EJS       !!!!!!!!
app.set('view engine', 'ejs');

/* !!!!!!!!     adding callback request data from server, data which is made on the server    !!!!!!!!
let CallbackRequest = require('./models/callback-requests.model').CallbackRequest;

let cr = new CallbackRequest({
    id: '1234',
    phoneNumber: '+1111111111',
    date: new Date()
});
cr.save().then(() => console.log('Done'));
*/

let username = process.env.mongoUserName;
let password = process.env.mongoUserPass;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster-go.vwwxujb.mongodb.net/travels`, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.json());
let imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images'),   // for destination we use callback function which takes two values, 1st argument is what to do in case of error, 2nd argument is where to save
    filename: (req, file, cb) => cb(null, file.originalname)  // in 2nd argument you need to write what should be name of saved file
    // as we know that binary data is saved in req.file when it came as request from client, then their is key 'originalname' which saves the name of file when selected
});

// for our file name not to be changed while saving it from server
app.use(multer({ storage: imageStorage }).single('imageFile')); // we use key storage & as value multer diskStorage


// app.use(multer({dest: 'public/images'}).single('imageFile'));  
// we need to specify which key in formdata format is binary data
// as file should be saved somewhere, we can't let it br on server in binary data
// so we need to set destination in multer to tell where to save the file uploaded to server like image file or any text file uploaded to server using formdata format
let id = 1;

/*  !!!!!!   Manually adding post in server then saving to database   !!!!!!
let post1 = new Post({
    id: '2',
    title: 'Statue of Liberty',
    date: new Date(),  // this is function to get current date
    description: 'Some description',
    text: 'Some text.',
    country: 'USA',
    imageURL: '/images/img-2.jpg'   // slash '/' will directly take you to public folder which is root folder as mentioned in server file as express.static('public')
})

post1.save().then(() => console.log('Saved!'));
*/

app.use(express.static('public'));
app.use(cookieParser());  // so that cookies are automatically generated (or read by server - confirm this) for every request
// cookie-parser is a middleware which parses cookies attached to the client request object. 
app.use('/posts', postsRouter);    // first tell the URL or begining of url on which requests will come in 1st argument & then that router or export module to which we need to redirect
app.use('/callback-requests', callbackRequestsRouter);
app.use('/emails', emailsRouter);
app.use('/users', usersRouter);

app.get('/landmark', async (req, resp) => {
    let id = req.query.id;  // this id is passed by query string in href link in index.html file of main public html file
    let post = await Post.findOne({ id: id });
    resp.render('landmark', {
        title: post.title,
        imageURL: post.imageURL,
        date: post.date,
        text: post.text
    })
});

// let isLoggedIn = false;

// !!!!!!         check.Token() returns boolean value          !!!!!!
app.get('/admin', (req, resp) => {
    let token = req.cookies['auth_token'];  // cookies is object of req & it saves or reads cookies from browser
    // this req.cokkies is taking value of cookie by using its key name - auth_token
    if (token && auth.checkToken(token)) {  // we added token in condition as well to check if token exists as if in case their is no token and we don't get any error message
        resp.render('admin');
    } else {
        resp.redirect('/login');
        // resp.render('login');  // >>>> THIS IS LOGIN PAGE IS RENDERED WITH /ADMIN LINK BUT RATHER WE WANT IT TO BE RENDERED BY /LOGIN LINK. 
        // SO WE REDIRECTED THIS CONDITION TO GET REQUEST ON /LOGIN LINK IN WHICH WE RENDERED LOGIN OR SIGN-IN PAGE
    }
})

app.get('/login', (req, resp) => {
    let token = req.cookies['auth_token'];  // cookies is object of req & it saves or reads cookies from browser
    // this req.cokkies is taking value of cookie by using its key name - auth_token
    if (token && auth.checkToken(token)) {  // we added token in condition as well to check if token exists as if in case their is no token and we don't get any error message
        resp.redirect('/admin');
    } else {
        resp.render('login');  // >>>>>   this is login or sign-in page or html or ejs and we want this to be open with /login link. 
        // SO FIRST WE REDIRECTED REQUEST IN ABOVE IF ELSE STATEMENT WHERE LOGIN PAGE IS RENDERED WITH /ADMIN LINK BUT MADE FROM /ADMIN
    }
})

let port = process.env.PORT || 3000;    // this will provide port given to us by render service & || is used if that port doesn't work then use 3000
app.listen(port, () => console.log(`Listening ${port}...`));