const jwt = require('jsonwebtoken') // import the jsonwebtoken for create the digital token
const bcrypt = require('bcrypt') // this is used for matching the passwords
const loginRouter = require('express').Router() // related the login all Routes aa fetched
const User = require('../models/user') // import the userModel to check the user from the database



loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

        // error handling
        if(!(user && passwordCorrect)) {
            return response.status(401).json({
                error: 'Invalid username or password'
            })
        }

        // genrating the token 
        const userForToken = {
            username: user.username,
            id: user._id
        }
        
        const token = jwt.sign(
            userForToken, 
            process.env.SECRET,
            { expiresIn: 60 * 60 }
        )

        

        response 
            .status(200)
            .send({token, username: user.username, name: user.name})

})

module.exports = loginRouter