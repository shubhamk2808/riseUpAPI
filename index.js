const express = require('express');
// require('./databse/database.js').connect()
const mongoose = require('mongoose');
// const config = require('config');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const User = require('./models/user');
const auth = require('./middlewares/auth');
mongoose.set("strictQuery", false);
const app = express();
app.use(express.json())
app.use(cookieParser())
app.get("/", (req, res) => {
  res.send("<h1>Hello !</h1>")
})

app.post('/register', async (req, res) => {
  console.log(req.body, "req n res:::");
  try {
    //get all the data from body
    const { firstName, lastName, email, password } = req.body
    //all the data should exists
    if (!(firstName && lastName && email && password)) {
      res.status(400).send('all fields are compulsory')
    }
    //check if user is already exist
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({"message":'User has alreaady exists with this email'})
    }
    //encrypt the password
    const EncryptedPass = await bcrypt.hash(password, 10)
    //save the user in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: EncryptedPass
    })
    //generate a token for user and send it
    const token = jwt.sign(
      { id: user._id, email: user.email },
      'shhhh', //process.env.jwtsecret
      {
        expiresIn: '2h'
      }
    )
    user.token = token
    user.password = undefined
      console.log(user);
    res.status(200).json(user)

  } catch (error) {
    console.log(error)
  }

})

app.post('/login', async (req, res) => {
  try {
    //get all the data from body
    const { email, password } = req.body
    //validation
    if (!(email && password)) {
      res.status(400).send('email or password is missing')
    }
    //find user in DB
    const user = await User.findOne({ email })
    //if user is not there, then what ?
    if (!user) {
      res.status(404).send('user is not exists')
    }
    //match the password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id },
        'shhhh', //process.env.jwtsecret
        {
          expiresIn: '2h'
        }
      )
      user.token = token
      user.password = undefined
      //send a token in user cookies
      //cookie section
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
      };
      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user
      })
    }
  } catch (error) {

  }
})

app.get('/dashboard', auth, (req, res)=>{
 console.log(req.user, "req user:::")
  res.send('welcome to dashboard')
})

app.get('/settings', auth,  (req, res)=>{
  res.send("Here are your all settings")
})

app.get('/logout', (req, res) => {
  res.clearCookie('token'); // 'token' is the name of the cookie set during login
  // res.redirect('/login');
  res.status(200).send('Logged out Successfully')
});


// // Load configuration settings
// const dbConfig = config.get('database');
// const serverConfig = config.get('server');
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log("Database connection Failed")
    console.error(err);
  });

// Start the server
// const port = serverConfig.port;
const port = process.env.PORT || process.env.SECRET_PORT || 3000;

console.log(port, "port")
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
}); 