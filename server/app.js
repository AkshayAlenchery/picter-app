const Express = require('express')

const App = Express()

App.use(Express.json())

App.listen(8000, () => {
  console.log('Server runnin on port 8000')
})
