import Router from 'vue-router'
import Vue from 'vue'
import Lobby from '../pages/lobby/salas'
import ListaJogos from '../pages/jogos/lista'
import Nickname from '../pages/jogador/nickname'
import Snake from '../pages/jogos/snake/tabuleiro'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/jogos/snake/:id',
      name: 'Tabuleiro',
      component: Snake
    },
    {
      path: '/lobby/:jogo',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/lobby/:jogo/:id/nick',
      name: 'Nickname',
      component: Nickname
    },
    {
      path: '/',
      name: 'game',
      component: ListaJogos
    }
  ]
})