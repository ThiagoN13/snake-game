const db = require('../../lib/lowdb')
const io = require('../../lib/ws')
  
const collection = db
  .get('salas')

io.on('connection', function (socket) {
  socket.on('salas/list', function (query) {
    return collection
      .find(query)
      .value()
  })

  socket.on('salas/create', function (data) {
    collection
      .insert(data)
      .write()
  })
})