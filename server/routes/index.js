const io = require('../lib/ws')

let usuarios = []
let marcadores = 0
const tabuleiro = []
const LINHAS = 17
const COLUNAS = 50

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

function removerUsuario (data) {
  const index = usuarios.findIndex(usuario => usuario.id === data.id)

  if (index >= 0) {
    usuarios.splice(index, 1)
  }
}

function diferencaSegundos (dataInicio, dataFim) {
  const milisegundosInicial = new Date(dataInicio).getTime()
  const milisegundosFinal = new Date(dataFim).getTime()

  const diferenca = milisegundosFinal - milisegundosInicial

  return diferenca > 1000 * 10
}

setInterval(() => {
  usuarios.forEach(usuario => {
    if (diferencaSegundos(usuario.ultimoMovimento, new Date())) {
      removerUsuario(usuario)
    }
  })
}, 1000)

io.on('connection', function (socket) {
  console.log("Connected!")

  socket.on('get-tabuleiro', function () {
    socket.emit('refresh-tabuleiro', { tabuleiro, marcadores, usuarios, COLUNAS, LINHAS })
  })

  socket.on('remover-marcador', function (marcador) {
    const { linha, coluna } = marcador
    tabuleiro[linha][coluna].marcado = false
    marcadores--

    adicionarMarcador()
    socket.emit('refresh-tabuleiro', { tabuleiro, marcadores, usuarios, COLUNAS, LINHAS })
    socket.broadcast.emit('refresh-tabuleiro', {  tabuleiro, marcadores, usuarios, COLUNAS, LINHAS })
  })

  socket.on('join', function (data) {
    Object.assign(data, { pontuacao: 0, percurso: [] })

    usuarios = usuarios.filter(usuario => usuario.id !== data.id)

    usuarios.push(data)

    socket.broadcast.emit('list', usuarios)
  })

  socket.on('update', function (data) {
    const index = usuarios.findIndex(usuario => usuario.id === data.id)

    if (index >= 0) {
      data.ultimoMovimento = new Date()
      usuarios.splice(index, 1, data)
    }

    socket.broadcast.emit('update', data)
  })

  socket.on('logout', function (data) {
    removerUsuario(data)

    socket.broadcast.emit('list', usuarios)
  })
})