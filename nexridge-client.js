'use strict'
let Knex = require('knex/build/knex')
let rpcClient = require('socket.io-rpc-client')

function nexridge (serverUrl) {
  var rpc = rpcClient(serverUrl)

  return function () {
    let qb = Knex({})

    var query = qb.apply(qb, arguments)
    query.then = function () {
      var cache = []
      delete query.client
      let queryPayload = JSON.parse(JSON.stringify(query, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return
          }
          cache.push(value)
        }
        return value
      }))
      cache = null

      var promise = rpc('nexridge.query')(queryPayload)
      promise.then.apply(promise, arguments)
    }
    return query
  }
}

module.exports = nexridge
