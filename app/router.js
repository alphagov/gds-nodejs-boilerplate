'use strict'

// Local dependencies
const healthcheck = require('./healthcheck')
const index = require('./index')

// Export
module.exports.bind = app => {
  app.use(healthcheck.router)
  app.use(index.router)
}
