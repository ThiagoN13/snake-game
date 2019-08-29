<template>
<div class="home">
  <aside class="painel">
    <table>
      <tr>
        <th>
          Posição
        </th>
        <th>
          Usuário
        </th>
        <th>
          Pontuação
        </th>
      </tr>
      <tr>
        <td>
          X
        </td>
        <td>
          {{ usuario.nome }}
        </td>
        <td>
          {{ usuario.pontuacao }}
        </td>
      </tr>
      <tr v-for="(jogador, index) in listaUsuarios" :key="index">
        <td>
          {{ index + 1 }}
        </td>
        <td>
          {{ jogador.nome }}
        </td>
        <td>
          {{ jogador.pontuacao }}
        </td>
      </tr>
    </table>

    <button @click="atualizarLista">
      Atualizar Lista
    </button>

    <div>
      <input type="text" v-model="usuario.nome" @blur="onAlteracaoNome">
    </div>

    <div>
      Marcadores: {{ marcadores }}
    </div>
  </aside>

  <div class="tabuleiro" :class="{ 'game-over': gameOver }">
    <div v-if="gameOver">
      <b>Você perdeu!</b>
      <button @click="recomecar">Recomeçar</button>
    </div>

    <table>
      <tr v-for="(linha, linhaIndex) in tabuleiro" :key="linhaIndex" class="linhas" :id="linhaIndex">
        <td
          v-for="(coluna, colunaIndex) in linha"
          :ref="`${linhaIndex}:${colunaIndex}`"
          :key="colunaIndex"
          :id="colunaIndex"
          class="colunas"
          :style="{ width: '10px' }"
          :class="{
            'marcado': coluna.marcado,
            'usuario': usuario.linha === linhaIndex && usuario.coluna === colunaIndex,
            'percurso': isPercurso(linhaIndex, colunaIndex, usuario),
            'adversario': isAdversario(linhaIndex, colunaIndex),
            'percurso-adversario': isPercursoAdversario(linhaIndex, colunaIndex)
          }">
        </td>
      </tr>
    </table>
  </div>

  <audio id="up">
    <source src="../assets/audio/up.mp3" type="audio/mpeg">
  </audio>

</div>
</template>

<script>
export default {
  name: 'home',

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

  created () {
    // this.spawnMarcadores()

    this.usuario = this.esquemaUsuario()

    this.$ws.emit('refresh-list', this.usuario)
    this.$ws.emit('get-tabuleiro', this.usuario)

    this.$ws.on('refresh-tabuleiro', (data) => {
      const { tabuleiro = [], marcadores = 0, usuarios = [], LINHAS, COLUNAS } = data

      this.tabuleiro = tabuleiro
      this.marcadores = marcadores
      this.usuarios = usuarios
      this.linhas = LINHAS
      this.colunas = COLUNAS
    })

    this.$ws.on('list', (data) => {
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

  mounted () {
    document.addEventListener('keydown', this.moverUsuario)

    window.onbeforeunload = this.deslogar

    this.mover()
  },

  methods: {
    deslogar () {
      document.removeEventListener('keydown', this.moverUsuario)
      this.$ws.emit('logout', this.usuario)
    },

    recomecar () {

    },

    mover () {
      if (this.gameOver) return clearInterval(this.intervalMovimento)

      this.intervalMovimento = setInterval(() => {
        this.moverUsuario({ key: this.ultimaTecla })
      }, 500)
    },

    atualizarLista () {
      this.$ws.emit('refresh-list', this.usuario)
    },

    onAlteracaoNome () {
      this.$ws.emit('update', this.usuario)
    },

    isPercurso (linha, coluna, usuario) {
      return usuario.percurso.some(caminho => {
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

      return {
        id: Date.now().toString(32),
        nome: Date.now().toString(32),
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
  display: flex;
}

.tabuleiro table {
  border: 1px solid black;
}

.painel {
  text-align: left;
  display: inline-block;
  padding: 10px;
  width: 20%;
}

.painel table {
  margin-bottom: 20px
}

.colunas {
  padding: 10px;
  height: 10px;
  width: 5px
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
