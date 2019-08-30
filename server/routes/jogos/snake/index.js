const db = require('../../../lib/lowdb')

const collection = db
  .get('jogos')

collection
  .insert({ id: 'snake', nome: 'Snake', salas: [] })
  .write()

  