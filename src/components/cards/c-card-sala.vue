<template>
<div class="c-card-sala">
  <div class="container">
    <div class="imagem-sala"></div>
    <div class="size">
      <h4>PROTEGIDO</h4>
      <span>SIM</span>

    </div>
    <div class="price">
      <h4>JOGADORES</h4>
      <span>10</span>
    </div>

    <div class="color shirtColor">
      <div>Clique para</div>
      <span>jogar</span>
    </div>

    <div class="nome-sala">
      Iniciar
    </div>
  </div>
</div>
</template>

<style>
:root {
  --size: 400px;
}

.c-card-sala {
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  background-color: var(--blue);
  color: cornsilk;
  font-family: "Roboto Condensed", sans-serif;
}

.container {
  cursor: pointer;
  width: var(--size);
  height: var(--size);
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
  justify-items: center;
  align-items: center;
  filter: drop-shadow(0px 0px 7px rgba(1, 1, 1, .7));
}

.imagem-sala {
  grid-column: 1/span 2;
  grid-row: 1 /span 2;
  width: var(--size);
  height: var(--size);
  background-size: cover;
  clip-path: polygon(
    20% 20%,
    50% 20%,
    50% 20%,
    80% 20%,
    80% 50%,
    80% 50%,
    80% 80%,
    50% 80%,
    50% 80%,
    20% 80%,
    20% 50%,
    20% 50%
  );
  transition: all 0.7s cubic-bezier(0.895, 0.03, 0.685, 0.22);
  background-color: #148bff;
}


h4, ul, span {
  padding: 0;
  margin: 0;
}

.size, .color {
  grid-column: 1;
  grid-row: 1;
  justify-self: center;
  z-index: 1;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

.size ul li,
.color ul li {
  list-style: none;
  width: 20px;
  height: 20px;
  margin: 5px;
  padding: 5px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.color {
  grid-column: 2;
  grid-row: 2;
}

.color ul li span {
  width: 10px;
  height: 10px;
  border-radius: 50px;
  display: inline-block;
}

.price {
  grid-column: 2;
  grid-row: 1;
  justify-self: center;
  z-index: 1;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

.price h4 {
  margin-bottom: 8px;
}

.price span {
  width: 20px;
  height: 20px;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.5);
}

.nome-sala {
  grid-column: 1;
  grid-row: 2;
  align-self: center;
  justify-self: center;
  z-index: 1;
  transition: all 0.7s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}

.imagem-sala:hover {
  clip-path: polygon(
    20% 0%,
    50% 0%,
    50% 20%,
    100% 20%,
    100% 50%,
    80% 50%,
    80% 100%,
    50% 100%,
    50% 80%,
    0% 80%,
    0% 50%,
    20% 50%
  );
  transform: rotate(-15deg);
  transition: all 0.4s cubic-bezier(0.86, 0, 0.07, 1);
}
.imagem-sala:hover ~ * {
  opacity: 1;
  transform: rotate(-15deg);
  transition: all 0.4s cubic-bezier(0.86, 0, 0.07, 1);
}
</style>