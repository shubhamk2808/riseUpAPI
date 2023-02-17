const mongoose = require('mongoose')

const { MONGODB_URI } = process.env

exports.connect = () => {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(
            console.log("Databse connected successfully")
        )
        .catch((error) => {
            console.log("DB connection Failed");
            console.log(error);
            process.exit(1)
        })
}