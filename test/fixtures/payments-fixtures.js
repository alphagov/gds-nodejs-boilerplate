'use strict'
const Payer = require('../../common/classes/Payer.class')
const PaymentRequest = require('../../common/classes/PaymentRequest.class')
// Create random values if none provided
const randomExternalId = () => Math.random().toString(36).substring(7)
const randomAmount = () => Math.round(Math.random() * 10000) + 1
const randomUrl = () => 'https://' + randomExternalId() + '.com'
// todo add pactified
module.exports = {
  validTokenExchangeResponse: (opts = {}) => {
    const data = {
      external_id: opts.external_id || randomExternalId(),
      amount: opts.amount || randomAmount(),
      description: opts.description || 'buy Silvia a coffee',
      type: opts.type || 'CHARGE',
      state: opts.state || randomAmount(),
      return_url: opts.return_url || randomUrl(),
      gateway_account_id: opts.gatewayAccountId || randomAmount()
    }
    return {
      getPlain: () => {
        return data
      }
    }
  },
  validCreatePayerResponse: (opts = {}) => {
    const data = {
      payer_external_id: opts.payer_external_id || randomExternalId()
    }
    return {
      getPlain: () => {
        return data
      }
    }
  },
  validPayer: (opts = {}) => {
    const data = {
      payer_external_id: opts.payer_external_id || randomExternalId(),
      account_holder_name: opts.account_holder_name || 'mr. payment',
      email: opts.email || 'aa@bb.com',
      account_number: opts.account_number || '12345678',
      sort_code: opts.sort_code || '123456',
      requires_authorisation: opts.requires_authorisation || 'false',
      country_code: opts.country_code || 'GB',
      address_line1: opts.address_line1 || 'line1',
      address_line2: opts.address_line2 || 'line2',
      postcode: opts.postcode || 'postcode',
      city: opts.city || 'city'
    }
    return new Payer(data)
  },
  validPaymentRequest: (opts = {}) => {
    const data = {
      external_id: opts.external_id || randomExternalId(),
      return_url: randomUrl() || opts.return_url,
      gateway_account_id: 23 || opts.gateway_account_id,
      description: opts.description || 'buy Silvia a coffee',
      amount: opts.amount || randomAmount(),
      type: 'CHARGE' || opts.type,
      state: 'NEW' || opts.state
    }
    return new PaymentRequest(data)
  }
}
