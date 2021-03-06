const dbconnection = require('../../database/dbconnection')
const assert = require('assert')
const jwt = require('jsonwebtoken')

module.exports = {
    login: (req, res, next) => {
      //Asserting input for validation
      const { emailAdress, password } = req.body

      const queryString = 'SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress=?'
      
      dbconnection.getConnection(function (err, connection) {
          if (err) throw err
          connection.query(
            queryString, [emailAdress],
              function (error, results) {
                connection.release()
                if (error) throw error
                
                if (results && results.length === 1) {
                  //There was a user with this email address.
                  //Checking if the password was correct...
                  console.log(results)

                  const user = results[0]
                  if (user.password === password) {
                    //Email and password correct!

                    jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {expiresIn: '7d'}, function(err, token) {
                      if (err) console.log(err)
                      if (token) {
                        console.log(token)
                        user.token = token
                        res.status(200).json({
                          statusCode: 200,
                          result: user,
                        })
                      }
                    });
                  } else {
                    //Password did not match.
                    res.status(401).json({
                      statusCode: 401,
                      message: 'Incorrect password!'
                    })
                  }
                } else {
                  //No user was found with this email address.
                  console.log('User not found')
                  res.status(404).json({
                    statusCode: 404,
                    message: 'Email not found'
                  })
                }
              }
          )
      })
    },

    validate: (req, res, next) => {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        res.status(401).json({
          statusCode: 401,
          message: "Authorization header missing"
        })
      } else {
        //Remove the word bearer from the token
        const token = authHeader.substring(7, authHeader.length)

        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            res.status(401).json({
              statusCode: 401,
              message: "Not authorized"
            })
          } else if (payload) {
            //User has access. Add userId from payload to the request for every subsequent endpoint.
            req.userId = payload.userId
            next()
          }
        })
      }
    },

    validateInput: (req, res, next) => {
      let user = req.body;
      const reEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      const rePass = /^[a-zA-Z0-9]{4,}$/
      let{emailAdress, password} = user;
      try {
        assert(typeof emailAdress === 'string', 'Email adress must be a string');
        assert.match(emailAdress, reEmail, 'Email adress must be valid')
        assert(typeof password === 'string', 'Password must be a string');
        assert.match(password, rePass, "Password must be valid")
        next();
      } catch(err) {
        const error = {
          statusCode: 400,
          message: err.message
        }
        next(error);
      }
    },
}
