'use strict'

const appmetrics = require('appmetrics')

const metricsHost = process.env.METRICS_HOST || 'localhost'
const metricsPort = process.env.METRICS_PORT || 8125
const metricsPrefix = 'dd-frontend.'

function initialiseMonitoring() {
  appmetrics.configure({mqtt: 'off'})
  const appmetricsStatsd = require('appmetrics-statsd')

  return appmetricsStatsd.StatsD(null, metricsHost, metricsPort, metricsPrefix) // eslint-disable-line new-cap
}

module.exports = (function () {
  return {
    metrics: initialiseMonitoring
  }
})()
