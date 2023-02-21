const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    //grab tooken from cookie
    console.log(req.cookies, "check token");
    const { token } = req.cookies

    //if no token, stop there
    if (!token) {
        res.status(403).send('Please login first')
    }
    //decode the token and get id
    try {
        const decodedToken = jwt.verify(token, 'shhhh')
        console.log(decodedToken, "decoded");
        req.user=decodedToken
    } catch (error) {
        console.log(error)
        res.status(401).send('invalid token')
    }
    //query to DB for that user is id 


    return next()
}

module.exports = auth 