<template>
  <div id="app">
    <c-header v-if="!isJogo"></c-header>

    <main class="c-main" :style="{ 'background-color': corAtual }">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { obtainArrayOfInterpolatedColors, getRandomColor } from './lib/cores'
import cHeader from './components/header/c-header'

export default {
  name: 'app',

  components: {
    cHeader
  },

  data () {
    return {
      cores: [],
      corAtual: null,
      indexCor: 0
    }
  },

  mounted () {
    this.cores = obtainArrayOfInterpolatedColors(getRandomColor(), getRandomColor(), 10)
    this.atualizarCor()

    setInterval(this.atualizarCor, 5000)
  },

  methods: {
    btnComecar () {
      this.$router.push('/tabuleiro')
    },

    atualizarCor () {
      this.corAtual = this.cores[this.indexCor]

      this.indexCor++

      if (this.indexCor === this.cores.length) {
        const novaCor = getRandomColor()

        this.cores = obtainArrayOfInterpolatedColors(novaCor, this.corAtual, 10)

        this.indexCor = 0
      }
    }
  },

  computed: {
    isJogo () {
      return this.$route.fullPath.includes('/jogos')
    }
  }
}
</script>

<style>
.c-main {
  height: 100%;
}
</style>