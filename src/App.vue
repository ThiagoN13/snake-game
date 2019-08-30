<template>
  <div id="app" :style="{ 'background-color': corAtual }">
    <router-view></router-view>
  </div>
</template>

<script>
import { obtainArrayOfInterpolatedColors, getRandomColor } from './lib/cores'

export default {
  name: 'app',

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
  }
}
</script>

<style>
#lobby {
  width: 100%;
  height: 100%;
  transition: 2s background-color ease
}

</style>