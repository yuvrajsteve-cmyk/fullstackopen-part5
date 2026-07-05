const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const Note = require('./models/note')

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connecting:', error.message))

  Note.find({}).then(notes => {
    console.log('operation returend the following notes')
  })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})