'use strict'
const path = require('path')
const envfile = require('envfile')

const TEST_ENV = envfile.parseFileSync(path.join(__dirname, '../test.env'))

if (TEST_ENV) {
  Object.keys(TEST_ENV).forEach(property => {
    process.env[property] = TEST_ENV[property]
  })
}
