//middleware function : fetchuser::to fetch user data
const JWT_SECRET = "Sakhilsharma";
var jwt = require('jsonwebtoken');
const fetchuser = (req, res, next) => {
    //Get the user from the JWT token  and add id to req body
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "please authenticate using valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(req.user.id);
        next();//call next async function where it is placed

    } catch (error) {
        res.status(401).send({ error: "please authenticate using valid token" })
    }


}
module.exports = fetchuser;