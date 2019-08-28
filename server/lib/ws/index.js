
const io = require('socket.io')(3001)

let usuarios = []
let marcadores = 0
const tabuleiro = []
const LINHAS = 40
const COLUNAS = 40

criarTabuleiro()
adicionarMarcador()

function criarTabuleiro () {
  for (let linha = 0; linha <= LINHAS; linha++) {
    tabuleiro[linha] = []

    for (let coluna = 0; coluna <= COLUNAS; coluna++) {
      tabuleiro[linha].push({ marcado: false })
    }
  }
}

function adicionarMarcador () {
  const linha = Math.floor(Math.random() * LINHAS)
  const coluna = Math.floor(Math.random() * COLUNAS)

  tabuleiro[linha][coluna].marcado = true

  marcadores++
}

io.on('connection', function (socket) {
  console.log("Connected!")

  socket.on('get-tabuleiro', function () {
    socket.emit('refresh-tabuleiro', {  tabuleiro, marcadores, usuarios })
  })

  socket.on('remover-marcador', function (marcador) {
    const { linha, coluna } = marcador
    tabuleiro[linha][coluna].marcado = false
    marcadores--

    adicionarMarcador()
    socket.emit('refresh-tabuleiro', {  tabuleiro, marcadores, usuarios })
    socket.broadcast.emit('refresh-tabuleiro', {  tabuleiro, marcadores, usuarios })
  })

  socket.on('join', function (data) {
    usuarios = usuarios.filter(usuario => usuario.id !== data.id)

    usuarios.push(data)

    socket.broadcast.emit('list', usuarios)
  })

  socket.on('update', function (data) {
    const index = usuarios.findIndex(usuario => usuario.id === data.id)

    if (index >= 0) {
      usuarios.splice(index, 1, data)
    }

    socket.broadcast.emit('update', data)
  })

  socket.on('logout', function (data) {
    const index = usuarios.findIndex(usuario => usuario.id === data.id)

    if (index >= 0) {
      usuarios.splice(index, 1)
    }

    socket.broadcast.emit('list', usuarios)
  })
})