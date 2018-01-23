'use strict'
const config = require('../config/index')
// Constants
const CORRELATION_HEADER = config.CORRELATION_HEADER

module.exports = (req, res, next) => {
  req.correlationId = req.headers[CORRELATION_HEADER] || ''
  next()
}
