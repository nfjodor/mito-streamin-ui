<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import 'styles/fonts';

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}
body {
  background: #303030 url(~@/assets/broken_noise.png);
}
#app {
  position: relative;
  z-index: 1;
}
</style>
