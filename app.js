const express = require('express')
const managerRouter = require('./route/managerRouter')
const studentRouter = require('./route/studentRouter')
const session = require('express-session')
const bodyParser = require('body-parser')
let app = express()

app.use(express.static('static'))

app.use(bodyParser.urlencoded({ extended: false }))

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat'
  // resave: false,
  // saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use('/manager', managerRouter)

app.use('/student', studentRouter)

app.listen(8080, () => {
  console.log('success')
})
