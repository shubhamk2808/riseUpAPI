const express = require('express');
// require('./databse/database.js').connect()
const mongoose = require('mongoose');
// const config = require('config');
require('dotenv').config()
mongoose.set("strictQuery", false);
const app = express();

app.get("/", (req, res)=>{
    res.send("<h1>Hello !</h1>")
})
// // Load configuration settings
// const dbConfig = config.get('database');
// const serverConfig = config.get('server');

// // Connect to MongoDB
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