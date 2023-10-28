let uniqid = require('uniqid');
// !!!!!!!!   REMEMBER WE ARE USING ../ TO TELL THAT YOU NEED TO GET OUT OF THIS FOLDER TO FIND POST.MODEL FILE
let Post = require('../models/post.model').Post;  // require() function brings or imports the export object of post.model file and we add dot(.) to use key in that object
// './' is used to tell that current folder to function & we don't need to add .js because require automatically fetch it

let express = require('express');
let router = express.Router();  // with the help of router we can redirect requests from one file to another
// so requests on app.js will be redirected to posts.route

let authMiddleware = require('../middleware/auth');

// first server will get data from database then from client side it will be downloaded to show on webpage
// !!!!!!!!   REMEMBER THAT THIS URL OR LINK ON WHICH REQUEST CAME IS END PART PRESENT IN POSTS.ROUTE FILE SO WE ONLY USE SLASH AS /POSTS IS USED IN BEGINING FILE THAT IS APP.JS
router.get('/', async (req, resp) => {
    let posts = await Post.find();  // the class we make using schema is the actual representation of collection in the database
    resp.send(posts);   // It is this class which saves or take data from client side to save it in collection of database you mentioned
});

router.get('/:id', async (req, resp) => {
    let id = req.params.id;
    let post = await Post.findOne({id: id});
    resp.send(post);
});

router.post('/', authMiddleware, async (req, resp) => {
    let reqBody = req.body;
    let imgPath;
    if(reqBody.imageURL) {
        imgPath = reqBody.imageURL;
    } else {
    //    let slash = '&#92;';      // this is character html code for backward slash 
    //    imgPath = req.file.path.substring(req.file.path.indexOf('\'), req.file.path.length);  // but backward slash doesn't take as character in string, that is why it's necessay to better specify index number rather finding it by character
        imgPath = req.file.path.substring(7, req.file.path.length); 
//  !!!!!!!  WHEN WE SAVE IMAGE FILE IN MULTER.DISK STORAGE THEN YOU NEED TO MAKE THAT SAVE CORRECT PATH IN DATABASE BECAUSE IN INDEX.HTML SRC FOR IMAGE TAG WILL BE TAKEN FROM DB
//  !!!!!!!  BUT PROBLEM IS THAT THE SRC SAVED IN IMAGEURL KEY HAS PUBLIC IN ADDRESS BUT THIS HOME PAGE HTML IS ALREADY INSIDE PUBLIC FOLDER
//  !!!!!!!  ALSO AS LOCALHOST:3000 WILL BE TAKING US TO PUBLIC FOLDER AS EXPRESS.STATIC IS SAVED PUBLIC, SO IN SRC IT'S FINDING PUBLIC INSIDE PUBLIC FOLDER
//  !!!!!!!  WHICH CREATES PROBLEM, SO WE SPECIFY TO THAT TAKE SRC FOR IMAGE FROM 7 INDEX FOR SAVING IN DATABASE FROM WHERE IT WILL GO TO HOME PAGE INDEX.HTML 
//  !!!!!!!  WHY '7', THEN SEE IN REQ.FILE THEN SEE IN PATH KEY - THEIR YOU NEED TO SEE WHICH SLASH IS USED AND AFTER WHICH INDEX PUBLIC WORD IS OMITTED  !!!!!!!
        // req.file has whole info on file which we selected like it's name, date same way 'path' key has info on image
    }
    let newPost = new Post({
        id: uniqid(),   //'' +id++,
        title: reqBody.title,
        date: new Date(),
        description: reqBody.description,
        text: reqBody.text,
        country: reqBody.country,
        imageURL: imgPath
    })
    await newPost.save();
    // console.log(req.file);   // binary data are saved in file key not in body key
    resp.send('Created');
});

router.delete('/:id', authMiddleware, async (req, resp) => {
    let id = req.params.id;
    await Post.deleteOne({id: id});  // 1st 'id' is key in POST class or array saved in database & then 2nd 'id' is req.params.id
    resp.send('Deleted');
})

router.put('/:id', authMiddleware, async(req, resp) => {
    let id = req.params.id;
    await Post.updateOne({id: id}, req.body);
    resp.send('Updated');
})

module.exports = router;