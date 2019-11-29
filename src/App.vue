<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  html, body {
    min-width: 100vw;
    min-height: 100vh;
  }
  #app {
    position: relative;
    padding: 3vw;
    min-width: 100vw;
    min-height: 100vh;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background: #e8e8e8;
    box-sizing: border-box;
  }
</style>
