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
  companyname: String,
  Company_image: String,
  ContactDetails: String
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

// Handle file upload POST request
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const message = req.body.message; // Corrected to 'req.body.message'

    console.log('message content:', message);

    const newImage = new PostsModel({
      name: originalname,
      data: buffer,
      contentType: mimetype,
      profliepic: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      PostedBy: 'New Only',
      Message: message,
      Date: Date.now(),
    });
    
    await newImage.save();

    res.redirect('/')
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while uploading the image.');
  }
});


app.get('/images', async (req, res) => {
  try {
    const images = await PostsModel.find(); // Fetch all images

    if (!images || images.length === 0) {
      return res.status(404).send('No images found');
    }

    res.render('image', { imagesData: images }); // Render all images
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
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








app.get('/', (req, res) => {
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
                        return res.status(404).send('No images found');
                      }
                  
                      res.render('Posts', {
                         imagesData: images,                        
                           Likeed: Likes,
                      commented: Comments,
                      Posted: Post,
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
             
            }
          }
        );
       
      }
    }
  );
});


app.post('/Like', async (req, res) => {
  const postId = req.body.postId;
  const userId = 'No man';
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

      res.redirect('/');
    }
  });
});




app.post('/comments', (req, res) => {
  const comment = req.body.comment;
   const postid = req.body.postId;
   console.log('Received postid:', postid);
  console.log('Received comment:', comment);
  const CommetSave = new CommentModel({
    CommentedBy: `The Only `,
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
  res.redirect("/",);
});


app.post("/AddnewItem", function (req, res) {

  if (req.isAuthenticated()) {
    const user = req.user.username;

    // Retrieve form data
    const productName = req.body.ProductName;
    const contactNumber = req.body.Contactnumber;
    const price = req.body.Price;
    const category = req.body.category;
    const imageLink1 = req.body.Imagelink1;
    const imageLink2 = req.body.Imagelink2;
    const imageLink3 = req.body.Imagelink3;
    const imageLink4 = req.body.Imagelink4;
    const details = req.body.Details;




    // // Validate the form input data before saving
    // if (!category || !price || !contactNumber || !productName) {
    //     return res.status(400).send("Please fill in all required fields");
    // }
    console.log(user);
    console.log(productName);
    console.log(contactNumber);
    console.log(price);
    console.log(category);
    console.log(imageLink1);
    console.log(imageLink2);
    console.log(imageLink3);
    console.log(imageLink4);
    console.log(details);


    const PayrollSave = new Productmodel(
      {

        Product_Name: productName,
        imageProductMain: imageLink1,
        imageProduct1: imageLink2,
        imageProduct2: imageLink3,
        imageProduct3: imageLink4,
        Contacts: contactNumber,
        price: price,
        ItemCategory: category,
        details: details,
        Date: Date.now(),
        PostedBy: user

      });
    PayrollSave.save()
      .then(() => res.redirect("/"))
      .catch(err => {
        console.error(err);
        res.status(500).send(`
          <div style="background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
            <strong>Error:</strong> ${err}
          </div>
        `);
      });

  } else {
    res.redirect('/')
  }



});








// Starting Sever
app.listen(5000, function () {
  console.log("Server started on port 5000");
});

app.post('/search', (req, res) => {
  const searchQuery = req.body.searchQueryName.toLowerCase();

  console.log("Search Query: ", searchQuery);
  Productmodel.find(
    {
      $or: [
        { Product_Name: { $regex: searchQuery, $options: "i" } },
        { price: { $regex: searchQuery, $options: "i" } },
        { details: { $regex: searchQuery, $options: "i" } }
      ]
    },
    function (err, Productresults) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        // console.log(EmployeeDetails);
        res.render("Market", { listTitle: "Today", Learn: Productresults });
      }
    }
  );
});
app.post('/search2', (req, res) => {
  const searchQuery = req.body.searchQueryName.toLowerCase();

  console.log("Search Query: ", searchQuery);
  Productmodel.find(
    {
      $or: [
        { Product_Name: { $regex: searchQuery, $options: "i" } },
        { price: { $regex: searchQuery, $options: "i" } },
        { details: { $regex: searchQuery, $options: "i" } }
      ]
    },
    function (err, Productresults) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        // console.log(EmployeeDetails);
        res.render("MyItems", { listTitle: "Today", Learn: Productresults });
      }
    }
  );
});

app.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


app.get("/Login.html", function (req, res) {
  if (req.isAuthenticated()) {

    Productmodel.find({}, function (err, Product) {
      if (err) {
        console.log(err);
      } else {
        const user = req.user.username;

        UserModel.find({ email: user }, function (err, users) {
          if (err) {
            console.log(err);
          } else {
            //  console.log("Number of users:", users.length);
            //  console.log("Logged-in user email:", user);
            res.render("AddnewItem", {
              listTitle: "Today",
              Learn: Product,
              userEmail: user,
              userEmailHTML: user.username,
              ComapanyNmae: user.companyname,
            });
          }
        });
      }
    });

  } else {
    res.redirect("/")
  }
});

app.post('/delete-item', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;
    const itemId = req.body.itemId;

    Productmodel.findOneAndDelete({ _id: itemId, PostedBy: user }, (err, deletedItem) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error occurred during deletion');
      } else if (!deletedItem) {
        res.status(404).send('Item not found or you do not have permission to delete it');
      } else {
        res.send('Item deleted successfully');
      }
    });
  } else {
    res.redirect('/');
  }
});

app.get("/MyItems.html", function (req, res) {
  if (req.isAuthenticated()) {
    const user = req.user.username;

    Productmodel.find({ PostedBy: user }, function (err, EmployeeDetails) {
      if (err) {
        console.log(err);
      } else {
        const user = req.user;

        UserModel.find({ PostedBy: user }, function (err, users) {
          if (err) {
            console.log(err);
          } else {
            // console.log("Number of users:", users.length);
            // console.log("Logged-in user email:", user);
            res.render("MyItems", {
              listTitle: "Today",
              Learn: EmployeeDetails,
              userEmail: user,
              userEmailHTML: user.username,
              ComapanyNmae: user.companyname,
            });
          }
        });
      }
    });

  } else {
    res.redirect("/")
  }
});




app.get('/Inbox.html', (req, res) => {

  if (req.isAuthenticated()) {
    const user = req.user.username;

    UserModel.find(
      { username: user },
      function (err, User) {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred while searching.");
        } else {
          Productmodel.find(


            { PostedBy: user },
            function (err, UserPosted) {
              if (err) {
                console.log(err);
                res.status(500).send("An error occurred while searching.");
              } else {
                // console.log("UsersPosts ", UserPosted);


                function getIdsFromUserPosted(UserPosted) {
                  return UserPosted.map(item => item._id.toString());
                }
                var ids = getIdsFromUserPosted(UserPosted);
                console.log(ids);
                ChatsModel.find({ ProductID: { $in: ids } }, function (err, FoundChats) {
                  if (err) {
                    console.log(err);
                    res.status(500).send("An error occurred while searching.");
                  } else {

                    Productmodel.find({ _id: { $in: ids } }, function (err, FoundProducts) {
                      if (err) {
                        console.log(err);
                        res.status(500).send("An error occurred while searching.");
                      } else {


                        const finalList = FoundChats.map(chat => {
                          const foundProduct = FoundProducts.find(product => product._id.toString() === chat.ProductID.toString());
                          if (foundProduct) {
                            return {
                              ...chat.toObject(),
                              Product_Name: foundProduct.Product_Name,
                              imageProductMain: foundProduct.imageProductMain
                            };
                          } else {
                            return chat.toObject();
                          }
                        });
                        
                        console.log(finalList);
                        
                        



                        // console.log("Messages", FoundChats);
                        res.render("inbox", {
                          Testing: 'testing',
                          Learn: finalList,
                          // Products: FoundProducts,
                          user: user,
                        });
                        // Process the FoundChats as needed
                        // res.render("Market", { Testing: 'testing', Learn: ProductDetails });
                      }
                    });


                  }
                });

              }
            }
          );



          console.log("Messages ", User);

        }
      }
    );


  } else {
    res.redirect("/")
  }

});





app.get('/outbox.html', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.username;

    ChatsModel.find({ PostedBy: user }, function (err, FoundChats) {
      if (err) {
        console.log(err);
        res.status(500).send("An error occurred while searching.");
      } else {
        const productIds = FoundChats.map(chat => chat.ProductID);

        Productmodel.find({ _id: { $in: productIds } }, function (err, FoundProducts) {
          if (err) {
            console.log(err);
            res.status(500).send("An error occurred while searching.");
          } else {
            const finalList = FoundChats.map(chat => {
              const foundProduct = FoundProducts.find(product => product._id.toString() === chat.ProductID.toString());
              if (foundProduct) {
                return {
                  ...chat.toObject(),
                  Product_Name: foundProduct.Product_Name,
                  imageProductMain: foundProduct.imageProductMain
                };
              } else {
                return chat.toObject();
              }
            });

            console.log(finalList);

            res.render("outbox", {
              Testing: 'testing',
              Learn: finalList,
              user: user,
            });
          }
        });
      }
    });
  } else {
    res.redirect("/");
  }
});




// app.get("/",function(req, res){
//   res.render("Market");
// });





app.post("/BuyerLogin.html", function (req, res) {

  if (req.isAuthenticated()) {
    const user = req.user.username;

    Productmodel.find(
      {},
      function (err, ProductDetails) {
        if (err) {
          console.log(err);
          res.status(500).send("An error occurred while searching.");
        } else {
          console.log("Employee number exits ", ProductDetails);

          res.render("Buyermarket", {
            Testing: 'testing',
            Learn: ProductDetails,
          });
        }
      }
    );

  } else {
    res.redirect("/")
  }


});


app.post("/Login.html", function (req, res) {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
  })
  req.logIn(user, function (err) {
    if (err) {
      console.log(err)
    } else {
      passport.authenticate("local")(req, res, function () {

        Productmodel.find({}, function (err, EmployeeDetails) {
          if (err) {
            console.log(err);
          } else {
            const user = req.user;

            UserModel.find({ email: user.email }, function (err, users) {
              if (err) {
                console.log(err);
              } else {
                // console.log("Number of users:", users.length);
                // console.log("Logged-in user email:", user);
                res.render("AddnewItem", {
                  listTitle: "Today",
                  Learn: EmployeeDetails,
                  userEmail: user,
                  userEmailHTML: user.username,
                  ComapanyNmae: user.companyname,
                });
              }
            });
          }
        });


      })
    }

  })

});






app.get("/UseRegister.html", function (req, res) {
  res.render("UserRegister");
});
app.post("/UseRegister.html", function (req, res) {

  UserModel.register({ username: req.body.username, StudentNumber: req.body.StudentNumber, }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/UseRegister.html");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    }
  });
});








app.get("/register.html", function (req, res) {
  res.render("registerpage");
});
app.post("/register.html", function (req, res) {

  UserModel.register({ username: req.body.username, StudentNumber: req.body.StudentNumber, }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register.html");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    }
  });
});

