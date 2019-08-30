<template>
<div class="home" id="home" :class="{ 'game-over': gameOver }">
  <c-painel :usuario="usuario" :usuarios="listaUsuarios">
    <div>
      Marcadores: {{ marcadores }}
    </div>
  </c-painel>

  <div v-if="gameOver" class="container-game-over">
    <b>Você perdeu!</b>
    <button @click="recomecar" class="btn-remover">
      Recomeçar!
    </button>
  </div>

  <div class="tabuleiro">

    <div class="grids">
      <div
        v-for="(linha, linhaIndex) in tabuleiro"
        :key="linhaIndex"
        class="linhas"
        :id="linhaIndex">
        <div
          v-for="(coluna, colunaIndex) in linha"
          :ref="`${linhaIndex}:${colunaIndex}`"
          :key="colunaIndex"
          :id="`${linhaIndex}:${colunaIndex}`"
          class="colunas"
          :class="{
            'marcado': coluna.marcado,
            'usuario': usuario.linha === linhaIndex && usuario.coluna === colunaIndex,
            'percurso': isPercurso(linhaIndex, colunaIndex, usuario),
            'adversario': isAdversario(linhaIndex, colunaIndex),
            'percurso-adversario': isPercursoAdversario(linhaIndex, colunaIndex)
          }">
          </div>
      </div>
    </div>

  </div>

  <audio id="up">
    <source src="../../../assets/audio/up.mp3" type="audio/mpeg">
  </audio>

</div>
</template>

<script>
import cPainel from '../../../components/painel/c-painel'

export default {
  name: 'home',

  components: {
    cPainel
  },

  data () {
    return {
      gameOver: false,
      spawnPorTempo: false,
      tempoMarcador: 1,
      intervaloMarcador: null,
      tabuleiro: [],
      marcadores: 0,
      linhas: 40,
      colunas: 40,
      usuario: {},
      usuarios: [],
      intervalMovimento: null,
      ultimaTecla: 'ArrowRight'
    }
  },

  mounted () {
    this.usuario = this.esquemaUsuario()

    this.$ws.emit('refresh-list', this.usuario)
    this.$ws.emit('get-tabuleiro', this.usuario)

    document.addEventListener('keydown', this.moverUsuario)

    window.onbeforeunload = this.deslogar

    this.mover()

    this.registrarEventos()
  },

  methods: {
    registrarEventos () {
        this.$ws.on('refresh-tabuleiro', (data) => {
        const { tabuleiro = [], marcadores = 0, usuarios = [], LINHAS, COLUNAS } = data

        this.tabuleiro = tabuleiro
        this.marcadores = marcadores
        this.usuarios = usuarios
        this.linhas = LINHAS
        this.colunas = COLUNAS

        setTimeout(() => {
          this.focarUsuario(this.usuario.linha, this.usuario.coluna)
        })
      })

      this.$ws.on('list', (data = []) => {
        this.usuarios = data
      })

      this.$ws.on('update', (data) => {
        const index = this.usuarios.findIndex(usuario => usuario.id === data.id)

        if (index >= 0) {
          this.usuarios.splice(index, 1, data)
        }
      })

      this.$ws.emit('join', this.usuario)
    },

    deslogar () {
      document.removeEventListener('keydown', this.moverUsuario)
      this.$ws.emit('logout', this.usuario)
    },

    recomecar () {
      this.$ws.emit('logout', this.usuario)
      this.gameOver = false

      this.$ws.emit('join', this.usuario)
    },

    mover () {
      if (this.gameOver) return clearInterval(this.intervalMovimento)

      this.intervalMovimento = setInterval(() => {
        this.moverUsuario({ key: this.ultimaTecla })
      }, 1000)
    },

    isPercurso (linha, coluna, usuario = {}) {
      const { percurso = [] } = usuario

      return percurso.some(caminho => {
        return caminho[0] === linha && caminho[1] === coluna
      })
    },

    isPercursoAdversario (linha, coluna) {
      return this.listaUsuarios.some(usuario => this.isPercurso(linha, coluna, usuario))
    },

    isAdversario (linha, coluna) {
      const isAdversario = this.usuarios.some(usuario => {
        const { percurso = [] } = usuario

        return usuario.id !== this.usuario.id && usuario.linha === linha && usuario.coluna === coluna
      })

      return isAdversario
    },

    moverUsuario (event) {
      if (event.preventDefault) {
        event.preventDefault()
      }

      if (this.gameOver) return

      const keyName = event.key
      let { linha, coluna, percurso = [], pontuacao } = this.usuario
      const percursoOriginal = { linha, coluna }

      switch (keyName) {
        case 'ArrowRight':
          coluna += 1
          break
        case 'ArrowDown':
          linha += 1
          break
        case 'ArrowLeft':
          coluna -= 1
          break
        case 'ArrowUp':
          linha -= 1
          break
      }

      if (coluna < 0 || linha < 0 || coluna >= this.colunas + 1 || linha >= this.linhas + 1) {
        return
      }

      if (this.isPercurso(linha, coluna, this.usuario)) {
        const [ caminho = [] ] = percurso

        if (caminho[0] === linha && caminho[1] === coluna) return

        this.gameOver = true
        return this.$ws.emit('logout', this.usuario)
      }

      if (this.isPercursoAdversario(linha, coluna) || this.isAdversario(linha, coluna)) {
        this.gameOver = true
        return this.$ws.emit('logout', this.usuario)
      }

      this.ultimaTecla = keyName

      percurso.splice(percurso.length - 1, 1)
      if (pontuacao > 0) {
        this.usuario.percurso.unshift([ percursoOriginal.linha, percursoOriginal.coluna ])
      }

      Object.assign(this.usuario, { linha, coluna, percurso })

      this.$ws.emit('update', this.usuario)

      // this.focarUsuario(this.usuario.linha, this.usuario.coluna)

      this.marcarPonto(linha, coluna, percursoOriginal)
    },

    marcarPonto (linha, coluna, percursoOriginal) {
      if (this.tabuleiro[linha][coluna].marcado) {
        const audio = document.getElementById('up')
        this.usuario.pontuacao++

        this.$ws.emit('update', this.usuario)

        audio.play()

        this.usuario.percurso.unshift([ percursoOriginal.linha, percursoOriginal.coluna ])

        this.$ws.emit('remover-marcador', { linha, coluna })
      }
    },

    esquemaUsuario () {
      const { linha, coluna } = this.spawnUsuario()
      let nome = localStorage.getItem('nickname')
      const blackList = [null, undefined, '']

      if (blackList.includes(nome)) {
        nome = Date.now().toString(32)
      }

      return {
        id: Date.now().toString(32),
        nome,
        pontuacao: 0,
        percurso: [],
        coluna,
        linha
      }
    },

    spawnUsuario () {
      const linha = Math.floor(Math.random() * this.linhas)
      const coluna = Math.floor(Math.random() * this.colunas)

      return { linha, coluna }
    },

    focarUsuario (linha, coluna) {
      const elemento = document.getElementById(`${linha}:${coluna}`)
      const tabuleiro = document.getElementById('home')

      if (elemento) {
        const coordenadas = elemento.getBoundingClientRect()
        const { width, height } = tabuleiro.getBoundingClientRect()
        const { x, y } = coordenadas

        tabuleiro.scrollTo(x + (width / 2), y + (height / 2))
      }
    }
  },

  computed: {
    listaUsuarios () {
      return this.usuarios.filter(usuario => usuario.id !== this.usuario.id)
    }
  }
}
</script>

<style scoped>
.home {
  margin: 0;
  overflow: auto;
  height: 100vh;
  width: 100vw;
  background-color: #FFFF;
}

.tabuleiro {
  margin: 10px
}

.tabuleiro table {
  border: 1px solid black;
}

.grids {
  border: 1px solid black;
  display: grid;
  grid-auto-flow: row;
  width: max-content
}

.container-game-over {
  position: absolute;
  top: 50%;
  right: 50%;
}

.btn-remover {
  display: block;
  margin-top: 10px;
  width: 100%
}

.colunas {
  padding: 10px;
  height: 10px;
  width: 5px;
  grid-gap: 0;
}

.linhas {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 0;
}

.marcado {
  background-color: red
}

.usuario {
  background-color: yellow
}

.percurso {
  background-color: green
}

.adversario {
  background-color: #A9A9A9
}

.percurso-adversario {
  background-color: #cccccc
}

.game-over {
  background-color: #DCDCDC
}

.game-over .usuario {
  opacity: .4;
}

.game-over .marcado {
  opacity: .4;
}

.game-over .percurso {
  opacity: .4;
}

.col-auto {
  flex: 0 0 auto;
  width: auto;
  max-width: 100%;
}
</style>
