'use strict'

// NPM dependencies
const expect = require('chai').expect
const supertest = require('supertest')
const { describe, it } = require('mocha')

// Local dependencies
const getApp = require('../../server').getApp

describe('GET /healthcheck endpoint', () => {
  it('should return HTTP 200 status with expected JSON', done => {
    supertest(getApp())
      .get('/healthcheck')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        const response = JSON.parse(res.text)
        expect(response.ping.healthy).to.equal(true)
      })
      .end(done)
  })
})
