<template>
  <div class="c-nickname">
    <input
      type="text"
      placeholder="Nickname"
      class="c-input-nick"
      v-model="nickname">

    <button @click="btnComecar" class="c-button-ok">
      Ok!
    </button>
  </div>
</template>

<script>
export default {
  name: 'nickname',

  data () {
    return {
      nickname: ''
    }
  },

  methods: {
    btnComecar () {
      localStorage.setItem('nickname', this.nickname)

      const { id, jogo } = this.$route.params

      this.$router.push(`/jogos/${jogo}/${id}`)
    }
  }
}
</script>

<style>
  .c-nickname {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .c-input-nick {
    display: block;
    margin: 0 auto
  }

  .c-button-ok {
    margin-top: 10px
  }
</style>