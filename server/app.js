const Express = require('express')
const dotenv = require('dotenv')
const App = Express()

dotenv.config()
App.use(Express.json())

App.listen(process.env.APP_PORT, () => {
  console.log(`Server runnin on port ${process.env.APP_PORT}`)
})
