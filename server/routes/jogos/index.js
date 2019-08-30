
const db = require('../../lib/lowdb')
const io = require('../../lib/ws')
  
const collection = db
  .get('jogos')

io.on('connection', function (socket) {
  socket.on('jogos/list', function (query) {
    return collection
      .find(query)
      .value()
  })

  socket.on('jogos/create', function (data) {
    collection
      .insert(data)
      .write()
  })
})