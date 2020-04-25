const Express = require('express')
const dotenv = require('dotenv')
const AppRouter = require('./routes/index')
const Cors = require('cors')
const App = Express()

dotenv.config()
App.use(Express.json())
App.use(Cors())

App.use('/picter/api/', AppRouter)
App.use('/picter/api/image', Express.static('uploads'))

App.listen(process.env.APP_PORT, () => {
  console.log(`Server runnin on port ${process.env.APP_PORT}`)
})
