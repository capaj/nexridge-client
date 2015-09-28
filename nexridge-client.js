import Knex from 'tgriesser/knex/build/knex'
import rpcClient from "socket.io-rpc-client"

function Nexridge(serverUrl) {
  var rpc = rpcClient(serverUrl)

  let query = Knex({})
  query.then = function(){
    var cache = []
    let JSON = JSON.stringify(o, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return
        }
        cache.push(value)
      }
      return value
    });
    cache = null
    return rpc('query')(JSON)
  }
  return query
}

export default Nexridge


