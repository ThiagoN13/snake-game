<template>
  <div id="lobby">
    <c-card-sala
      v-for="(sala, index) in salas"
      :key="index"
      :sala="sala.nome"
      :jogadores="sala.jogadores"
      @click.native="btnComecar(sala)">
    </c-card-sala>
  </div>
</template>

<script>
import cCardSala from '../../components/cards/c-card-sala'

export default {
  name: 'lobby',

  components: {
    cCardSala
  },

  data () {
    return {
      salas: [
        { nome: 'Sala 1', jogadores: 10, jogo: 'snake', id: 1 }
      ]
    }
  },

  methods: {
    btnComecar (sala) {
      const { jogo, id } = sala
      this.$router.push(`/lobby/${jogo}/${id}/nick`)
    }
  }
}
</script>
