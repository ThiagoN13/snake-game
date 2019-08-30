<template>
  <div class="painel">
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
      <tr v-for="(jogador, index) in usuarios" :key="index">
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

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'c-painel',
  props: {
    usuario: {
      type: Object,
      required: true
    },
    usuarios: {
      type: Array
    }
  }
}
</script>

<style>
.painel {
  border-radius: 10px;
  margin: 15px;
  padding: 10px;
  background-color: #DCDCDC;
  position: fixed;
  text-align: left;
  width: auto;
  right: 0;
  top: 0;
  box-shadow: 0 10px 6px -6px #777;
}

.painel table {
  margin-bottom: 20px
}
</style>