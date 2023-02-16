const express = require('express');
// const mongoose = require('mongoose');
// const config = require('config');
require('dotenv').config()

const app = express();

app.get("/", (req, res)=>{
    res.send("<h1>Hello !</h1>")
})
// // Load configuration settings
// const dbConfig = config.get('database');
// const serverConfig = config.get('server');

// // Connect to MongoDB
// mongoose.connect(dbConfig.url, dbConfig.options)
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((err) => {
//     console.error(err);
//   });

// Start the server
// const port = serverConfig.port;
const port = process.env.PORT || process.env.SECRET_PORT || 3000;

console.log(port, "port")
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});