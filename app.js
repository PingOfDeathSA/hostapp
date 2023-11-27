//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const multer = require('multer');
const passportLocalMongoose = require('passport-local-mongoose');
const { render } = require("ejs");
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
mongoose.set('strictQuery', true);
const nodemailer = require('nodemailer');



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('trust proxy', 1);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(session({
  secret: 'THeTerminatorIsHere',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collectionName: 'sessions',
    ttl: 60 * 60 // 1 hour
  })
}));


app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb+srv://PingOfDeathSA:Ronald438@cluster0.kqlfkdc.mongodb.net/BlogpostDB');



const userschema = new mongoose.Schema({
  email: String,
  password: String,

});
const usersProfilechema = new mongoose.Schema({
  user: String,
  name: String,
  data: Buffer,
  contentType: String,
  Date: {
    type: Date,
    required: true,
    default: Date.now
  },

});

const UserProfleModel = mongoose.model("UserProfile", usersProfilechema);



const passwordresetschema = new mongoose.Schema({
  token: String,
  user: String,
});


userschema.plugin(passportLocalMongoose);





const UserModel = mongoose.model("User", userschema);

passport.use(UserModel.createStrategy());
passport.use(new LocalStrategy({ username: 'email' }, UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


const UserSave = new UserModel({
  email: "Student@gmail.com",
  password: "testing@443547",
  StudentNumber: '20232234',

});
// const ChatsSave = new ChatsModel({
//   email: "Student@gmail.com",
//   password: "testing@443547",
//   StudentNumber: '20232234',
//   Date: Date.now(),

// });

const PostSchema = mongoose.Schema({
  PostedBy: {
    type: String || Number,
  },
  PostedImage: {
    type: String || Number,
  },
  Message:  {
    type: String || Number,
  },
  profliepic: {
    type: String || Number,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now
  },
  name: String,
  data: Buffer,
  contentType: String,

});

const ComentSchema = mongoose.Schema({
  CommentedBy: {
    type: String || Number,
  },
  Message: {
    type: String || Number,
  }, 
profilelike: {
  type: String || Number,
},
Postid: {
  type: String || Number,
}, 

  Date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const LikeSchema = mongoose.Schema({
  Likeby: {
    type: String, Number, // Allows either String or Number
  },
  Postid: {
    type: String, Number, // Allows either String or Number
  },
  status: {
    type: String,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const imageSchema = new mongoose.Schema({
  PostedBy: {
    type: String || Number,
  },
  PostedImage: {
    type: String || Number,
  },
  Message:  {
    type: String || Number,
  },
  profliepic: {
    type: String || Number,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now
  },
  name: String,
  data: Buffer,
  contentType: String,
});

const CommentModel = mongoose.model("Comment", ComentSchema);

const LikesModel = mongoose.model("Likes", LikeSchema);

const PostsModel = mongoose.model("Posts", PostSchema);

const Imagemodel = mongoose.model('Image', imageSchema);
const TokenModel = mongoose.model("Token_collec", passwordresetschema);


app.get("/UseRegister.html", function (req, res) {
  res.render("registerpage");
});
app.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/", function (req, res) {
  res.render("login");
});


app.post("/", function (req, res) {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  });

  req.logIn(user, function (err) {
    if (err) {
      // handling error 
      return res.render('errorlogin');
    }

    passport.authenticate("local", function (err, user, info) {
      if (err) {

        // handling error 
        return res.render('errorlogin');
      }

      if (!user) {
        // handling error 
        return res.render('errorlogin');
      }
      const userName = user.username;
      res.redirect('/Dashboard.html')
    })(req, res);
  });
});

app.post("/UseRegister.html", function (req, res) {
  const username = req.body.username;

  // Check if the username already exists in the database
  UserModel.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
      res.redirect("/UseRegister.html");
    } else {
      if (foundUser) {
        // Username already exists
        console.log("Username already exists");
        res.render('UserAlreadyregistered')
      } else {
        // Username does not exist, proceed with registration
        UserModel.register({ username: username }, req.body.password, function (err, user) {
          if (err) {

            res.redirect("/UseRegister.html");
          } else {
            // sending new registered users a welcome email
            console.log('sending email to new user')
            const emailBody = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      h1 {
        color: #333;
      }
      p {
        margin-bottom: 20px;
        font-size: 800;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: rgb(26, 25, 25);
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to XV-Bolgs!</h1>
    <p>
      Dear ${username},
    </p>
    <p>
    Thank you for joining XV-Bolgs! We're excited to have you as part of our Users.
  </p>

    <p>
      If you have any questions or need assistance, feel free to contact us at mailapi348@gmail.com.
    </p>
    <p>
      Best regards,<br>
      The XV-Bolgs Team
    </p>
  </body>
</html>
`;
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'mailapi348@gmail.com',
                pass: 'lhhoqgnfyjfgpvvg'
              }
            });

            const mailOptions = {
              from: 'mailapi348@gmail.com',
              to: username,
              subject: 'Welcome to PaperPlus',
              html: emailBody
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`Email sent to ${username}`);
              }
            });


            passport.authenticate("local")(req, res, function () {
              res.redirect('/Dashboard.html')
            });
          }
        });
      }
    }
  });
});


app.get('/Dashboard.html', (req, res) => {
  // authenticating the user
  if (req.isAuthenticated()) {
    const user = req.user.username;
    // fetching the user info from mongoDB
    UserModel.find({ email: user }, function (err, userfound) {
      if (err) {
        console.log(err)
      } else {
        PostsModel.find(
          {},
          function (err, Post) {
            if (err) {
              console.log(err);
              res.status(500).send("An error occurred while searching.");
            } else {
              // console.log("Employee number exits ", Post);
              CommentModel.find(
                {},
                function (err, Comments) {
                  if (err) {
                    console.log(err);
                    res.status(500).send("An error occurred while searching.");
                  } else {   
                    
                    LikesModel.find(
                      {status: 'true'},
                      async function (err, Likes) {
                        if (err) {
                          console.log(err);
                          res.status(500).send("An error occurred while searching.");
                        } else {
      
                          try {
                            const images = await Imagemodel.find(); 
                        
                            if (!images || images.length === 0) {
                              // return res.status(404).send('No images found');
                            }
                            UserProfleModel.find(
                              {},
                              async function (err, ProfileImage) {
                                if (err) {
                                  console.log(err);
                                  res.status(500).send("An error occurred while searching.");
                                } else {
              
                                  try {
                                  
                                    res.render('Posts', {
                                      ProfileImage: ProfileImage,
                                       imagesData: images,                        
                                         Likeed: Likes,
                                    commented: Comments,
                                    Posted: Post,
                                    userisuser: user
                                      });
                                  } catch (error) {
                                    console.error(error);
                                    res.status(500).send('Internal Server Error');
                                  }
                                  //  console.log(Likes)   
                                  // res.render("Posts", {
                                  //   Likeed: Likes,
                                  //   commented: Comments,
                                  //   Posted: Post,
                                  // });
                                }
                              }
                            );


                          } catch (error) {
                            console.error(error);
                            res.status(500).send('Internal Server Error');
                          }
                          //  console.log(Likes)   
                          // res.render("Posts", {
                          //   Likeed: Likes,
                          //   commented: Comments,
                          //   Posted: Post,
                          // });
                        }
                      }
                    );
                   
                  }
                }
              );
             
            }
          }
        );
      }
    });
  } else {
    res.redirect("/")
  }
});

app.post('/delete', async (req, res) => {
  const postId = req.body._id; 

  try {
    
    const postsToDelete = await PostsModel.find({ _id: postId });

    if (postsToDelete.length === 0) {
      return res.status(404).json({ message: 'No posts found for deletion' });
    }

 
    const deletionResult = await PostsModel.deleteMany({ _id: postId });

    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No posts were deleted' });
    }

    res.redirect('/Dashboard.html')
 
  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the posts' });
  }
});

// Handle file upload POST request
app.post('/upload', upload.single('image'), async (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;
    // fetching the user info from mongoDB
    UserModel.find({ email: user }, async function (err, userfound) {
      if (err) {
        console.log(err)
      } else {
    
        try {
          const { originalname, buffer, mimetype } = req.file;
          const message = req.body.message; // Corrected to 'req.body.message'
        
          console.log('message content:', message);
        
          const newImage = new PostsModel({
            name: originalname,
            data: buffer,
            contentType: mimetype,
            profliepic: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            PostedBy: user,
            Message: message,
            Date: Date.now(),
          });
          
          await newImage.save();
        
          res.redirect('/Dashboard.html')
        } catch (error) {
          console.error(error);
          res.status(500).send('An error occurred while uploading the image.');
        }

      }
    });
  } else {
    res.redirect("/")
  }
  
});






// Assuming PostsModel is your Mongoose model for posts
function createDummyPosts(numberOfPosts) {
  const dummyPosts = [];
  for (let i = 0; i < numberOfPosts; i++) {
    const post = new PostsModel({
      profliepic: "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      PostedBy: 'The Only',
      Message: `The Fitnessista is a women’s fitness blog helping women lead a healthy lifestyle through balanced diets and rigorous workouts. It regularly publishes healthy food recipes and has an impressive catalog of fitness blog posts. The blog also has some posts on motherhood and pregnancy. `,
      Date: Date.now(),
    });
    dummyPosts.push(post);
  }
  return dummyPosts;
}

const numberOfPostsToCreate = 1;
const fiftyDummyPosts = createDummyPosts(numberOfPostsToCreate);

//Save each dummy post individually
// fiftyDummyPosts.forEach((post, index) => {
//   post.save(function (err) {
//     if (err) {
//       console.log(`Error saving post ${index + 1}:`, err);
//     } else {
//       console.log(`Post ${index + 1} added`);
//     }
//   });
// });


app.post('/profile_picture', upload.single('image'), async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user.username;
      // Fetching the user info from MongoDB
      const userFound = await UserModel.findOne({ username: user });
      
      if (userFound) {
        const { originalname, buffer, mimetype } = req.file;

        console.log('Message content:', originalname);

        // Check if user profile exists
        const userProfile = await UserProfleModel.findOne({ user: user });

        if (!userProfile) {
          // If profile doesn't exist, create a new one
          const newProfile = new UserProfleModel({
            name: originalname,
            data: buffer,
            contentType: mimetype,
            user: user,
            date: Date.now(),
          });

          await newProfile.save();
        } else {
          userProfile.name = originalname;
          userProfile.data = buffer;
          userProfile.contentType = mimetype;

          await userProfile.save();
        }

        return res.redirect('/Dashboard.html');
      } else {
        return res.status(404).send('User not found');
      }
    } else {
      return res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while uploading the image.');
  }
});




app.post('/Like', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;
    // fetching the user info from mongoDB
    UserModel.find({ email: user }, async function (err, userfound) {
      if (err) {
        console.log(err)
      } else {
    
        const postId = req.body.postId;
        const userId = user;
        const likedStatus = req.body.like;
      
        let found = false;
      
        // Find all documents matching the userId and postId
        LikesModel.find({ Likeby: userId, Postid: postId }, async (err, existingLikes) => {
          if (err) {
            console.error(err);
            // Handle the error
          } else {
            for (const existingLike of existingLikes) {
              if (existingLike.Likeby === userId && existingLike.Postid === postId) {
                found = 'true';
                const DBlikeStatus = existingLike.status;
      
                if (DBlikeStatus === 'false') {
                  existingLike.status = 'true';
                } else {
                  existingLike.status = 'false';
                }
      
                existingLike.Date = Date.now();
      
                try {
                  const updatedLike = await existingLike.save();
                  console.log('Updated Like:', updatedLike);
                } catch (err) {
                  console.error(err);
                  // Handle the error
                }
              }
            }
      
            if (!found) {
              console.log('No existing like found');
              const newLike = new LikesModel({
                Likeby: userId,
                status: likedStatus,
                Date: Date.now(),
                Postid: postId,
              });
      
              try {
                const savedLike = await newLike.save();
                console.log('New like created:', savedLike);
              } catch (err) {
                console.error(err);
                // Handle the error
              }
            }
      
            res.redirect('/Dashboard.html')
          }
        });
  
      }
    });
  } else {
    res.redirect("/")
  }
  
});




app.post('/comments', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;
    // fetching the user info from mongoDB
    UserModel.find({ email: user }, function (err, userfound) {
  
      if (err) {
        console.log(err)
      } else {
        const comment = req.body.comment;
        const postid = req.body.postId;
        console.log('Received postid:', postid);
       console.log('Received comment:', comment);
       const CommetSave = new CommentModel({
         CommentedBy: user,
         Message: comment,
         profilelike:'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
         Postid: postid,
         Date: Date.now(),
       });
       CommetSave.save(function (err) {
                 if (err) {
                   console.log(err);
                 } else {
                   console.log("CommentedBy added");
                 }
       });
       res.redirect('/Dashboard.html')
      }
    })
  } else {
    res.redirect("/")
  }
 
});

app.get("/forgotpassword.html", function (req, res) {
  res.render("passwordreset");
});




app.post("/forgotpassword.html", function (req, res) {
  const username = req.body.username;

  // Check if the username already exists in the TokenModel
  UserModel.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log("error No user Found")

    } else {
      if (foundUser) {

        // Check if the username already exists in the TokenModel
        TokenModel.findOne({ user: username }, function (err, foundToken) {
          if (err) {
            res.render("User email not found");
          } else {
            if (foundToken) {
              // User already has a token, delete the token
              TokenModel.deleteOne({ user: username }, function (err) {
                if (err) {
                  console.error(err);
                  // Handle the error condition
                } else {
                  console.log("Previous token deleted");
                  // Proceed with generating and sending a new token
                  generateAndSendToken(username);
                }
              });
            } else {
              // User does not have a token, proceed with generating and sending a new token
              generateAndSendToken(username);
            }
          }
        });

        function generateAndSendToken(username) {
          // Generate a reset token
          const tokenLength = 32;
          const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let token = "";
          for (let i = 0; i < tokenLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
          }

          // Save the token and user in the TokenModel
          TokenModel.create({ token: token, user: username }, function (err, results) {
            if (err) {
              console.error(err);
              // Handle the error condition
            } else {
              console.log("Token saved:", results);

              // Send the token to the user
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'mailapi348@gmail.com',
                  pass: 'lhhoqgnfyjfgpvvg'
                }
              });

              const mailOptions = {
                from: 'mailapi348@gmail.com',
                to: username,
                subject: 'Password Reset Instructions',
                text: `Dear ${username},\n\nPlease use the following token to reset your password: ${token}`
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.error(error);
                  // Handle the error condition
                } else {
                  console.log(`Email sent to ${username}: ${info.response}`);
                  // Redirect or send a response indicating that the token has been sent
                  res.render("ResertPage");
                }
              });
            }
          });
        }
      } else {
        res.render('tokenrror')
      }
    }
  });


});




app.get("/Resetpassword.html", function (req, res) {
  res.render("ResetPage");
});

app.post("/Resetpassword.html", function (req, res) {
  const username = req.body.username;
  const token = req.body.token;
  const newPassword = req.body.password;

  // Check if the username and token match in the TokenModel
  TokenModel.findOne({ user: username, token: token }, function (err, foundToken) {
    if (err) {
      console.log(err);
      // Handle the error condition
    } else {
      if (foundToken) {
        // Username and token match

        // Find and delete the user in the UserModel
        UserModel.findOneAndDelete({ username: username }, function (err, deletedUser) {
          if (err) {
            console.log(err);
            // Handle the error condition
          } else {
            if (deletedUser) {
              // Register the user with the new email and password
              UserModel.register({ username: username, email: username }, newPassword, function (err, user) {
                if (err) {
                  console.log(err);
                  // Handle the error condition
                  res.redirect("/UseRegister.html");
                } else {
                  passport.authenticate("local")(req, res, function () {
                    // Delete the user's token from the TokenModel
                    TokenModel.deleteOne({ user: username }, function (err) {
                      if (err) {
                        console.log(err);
                        // Handle the error condition
                      } else {
                        console.log("Token deleted");
                        res.redirect("/Dashboard.html");
                      }
                    });
                  });
                }
              });
            } else {
              // User not found in the UserModel
              res.status(404).send("User not found. Please check your credentials.");
            }
          }
        });
      } else {
        // Username and token do not match in the TokenModel
        res.render('invalidtoken');
      }
    }
  });
});
app.listen(5000, function () {
  console.log("Server started on port 5000");
});
