<template>
  <div class="wrapper">
    <div class="content">
      <p class="title">2048</p>
      <button class="menu-btn" :disabled="notPrev" @click="keepGoing">继续游戏</button>
      <button class="menu-btn" @click="restart">重新开始</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        prev: null,
        notPrev: true,
      }
    },
    methods: {
      keepGoing() {
        this.$store.commit('setPrevResult', JSON.parse(this.prev));
        this.$router.push('/game')
      },
      restart() {
        this.$router.push('/game')
      },
    },
    mounted() {
      this.prev = window.localStorage.getItem('prevResult');
      if (this.prev) {
        this.notPrev = false;
      }
    }
  }
</script>

<style scoped>
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .title {
    margin-bottom: 10vw;
    color: transparent;
    font-size: 24vw;
    font-weight: 700;
    font-style: italic;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    background: linear-gradient(to right, #e9bc6a, #f9a709, #f77401, #f54301, #f50e04, #c00740, #84007c, #5d34a3, #405fbf, #268bdc, #37b7fa, #4dc7a0, #93cd3d, #62a922, #368810, #206800);
    -webkit-background-clip: text;
  }


  .menu-btn {
    display: block;
    margin-bottom: 2vw;
    width: 75vw;
    height: 16vw;
    border: unset;
    font-size: 6vw;
    line-height: 16vw;
    color: #fff;
    background: #405dbe;
    border-radius: 2vw;
    outline: unset;
  }

  .menu-btn:disabled {
    background: #b4b4b4;
    opacity: .5;
  }
</style>
