<template>
  <div class="cards-list">
    <c-card-jogo
      v-for="(jogo, index) in jogos"
      :key="index"
      :titulo="jogo.nome"
      :imagem="jogo.imagem"
      @click.native="selecionarJogo(jogo)">
    </c-card-jogo>
  </div>
</template>

<script>
import cCardJogo from '../../components/cards/c-card-jogo'

export default {
  name: 'game',

  components: {
    cCardJogo
  },

  data () {
    return {
      jogos: [
        { nome: 'Snake', imagem: 'https://i.redd.it/b3esnz5ra34y.jpg' },
        { nome: 'Mina', imagem: 'https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif' },
        { nome: 'Advinha', imagem: 'https://media.giphy.com/media/LwIyvaNcnzsD6/giphy.gif' }
      ]
    }
  },

  methods: {
    selecionarJogo (jogo = {}) {
      const { nome = '' } = jogo
      this.$router.push(`/lobby/${nome.toLowerCase()}`)
    }
  }
}
</script>

<style>
.cards-list {
  z-index: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>