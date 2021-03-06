const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/user.routes')
const authRouter = require('./src/routes/auth.routes')
const mealRouter = require('./src/routes/meal.routes')
const { env } = require('process')

app.use(bodyParser.json());

app.all('*', (req, res, next) => {
  const method = req.method
  console.log(`Methode ${method} aangeroepen`)
  next()
});

app.use(userRouter)
app.use(authRouter)
app.use(mealRouter)

//Response for incorrect request
app.all('*', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'End-point not found',
  })
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode).json (err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;