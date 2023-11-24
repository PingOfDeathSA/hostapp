// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const multer = require('multer');
// const fs = require('fs'); 
// const passportLocalMongoose = require('passport-local-mongoose');
// const { render } = require("ejs");
// const MongoStore = require('connect-mongo')(session);
// const LocalStrategy = require('passport-local').Strategy;
// mongoose.set('strictQuery', true);
// const app = express();
// // Multer setup for file uploads


// app.use(session({
//     secret: 'THeTerminatorIsHere',
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({
//       mongooseConnection: mongoose.connection,
//       collectionName: 'sessions',
//       ttl: 60 * 60 // 1 hour
//     })
//   }));
  
  
//   app.use(passport.initialize());
//   app.use(passport.session());
//   mongoose.connect('mongodb+srv://PingOfDeathSA:Ronald438@cluster0.kqlfkdc.mongodb.net/BlogpostDB');
  
  

// // Define the schema for the uploaded file
// const FileSchema = new mongoose.Schema({
//   name: String,
//   base64: String,
//   contentType: String,
// });

// const FileModel = mongoose.model('File', FileSchema);


// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); 
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`); 
//   },
// });

// // Multer upload configuration
// const upload = multer({ storage: storage });

// // Route to render the upload form
// app.get('/', (req, res) => {
//   res.render('upload');
// });

// // Route handling file upload
// app.post('/uploadFile', upload.single('image'), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file found.');
//     }

//     const { originalname, mimetype, filename } = req.file;

//     // Generate a URL to access the uploaded file
//     const fileUrl = `/uploads/${filename}`;

   

//     res.status(200).send('File uploaded successfully.');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error uploading the file.');
//   }
// });