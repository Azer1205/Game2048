<template>
  <div class="wrapper">
    <div class="header" ref="header">
      <div class="operate">
        <button @click="fallback">回退</button>
        <button @click="init">重置</button>
        <button @click="saveCurrentResult">保存</button>
      </div>
      <div class="goal history" style="margin-bottom: 0;">历史记录：<span>{{historyGoal > 0 ? historyGoal : '-'}}</span>
      </div>
      <div class="goal">分数：<span>{{goal}}</span></div>
    </div>

    <div class="container" v-if="updated" ref="container">
      <div class="row" v-for="row in result">
        <div :class="'col col-' + col" v-for="col in row">{{col}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        size: this.$store.state.size || 4, // 当前游戏的阶数
        limit: 16, // 确定 4 加入的起点阀值
        max: 0, // 当前所有数值中最大值
        result: [[]], // 用于存储当前的数据矩阵
        updated: true,
        prev: null, // 上一步
        prevGoal: 0,
        goal: 0, // 分数
        over: false,
        historyGoal: 0,
      }
    },
    methods: {
      init() { // 初始化
        this.over = false;
        this.goal = 0;
        this.prevGoal = 0;
        this.prev = null;
        this.result = [];
        for (let row = 0; row < this.size; row++) {
          this.result.push([]);
          for (let col = 0; col < this.size; col++) {
            this.result[row].push(0)
          }
        }
        // 在随机位置添加两个初始方块
        this.addNewBlock();
        this.addNewBlock();
      },
      addNewBlock() { // 添加新方块
        let num = 2;
        num = this.max >= this.limit && Math.random() * 10 > 7 ? 4 : 2;

        let empty = this.checkEmpty();
        if (empty.length <= 0 && this.checkOver(empty)) {
          return;
        }

        let index = Math.round(Math.random() * empty.length) % empty.length,
          selected = empty[index];

        this.result[selected.i][selected.j] = num;
      },
      checkEmpty() {  // 确定此时还有那些位置是空着的
        let empty = [];
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (!this.result[i][j]) {
              empty.push({
                i: i,
                j: j,
              })
            }
          }
        }
        return empty;
      },
      checkOver(arr) { // 判断是否已经完全没有可合并的方块，即是否游戏结束
        const empty = arr || this.checkEmpty();
        if (empty.length <= 0) {
          let flag = true;
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              if ((i < 3 && this.result[i][j] === this.result[i + 1][j]) ||
                (j < 3 && this.result[i][j] === this.result[i][j + 1])) {
                flag = false;
              }
            }
          }
          console.log(flag ? 'Game over !' : 'testing !');
          if (flag && !this.over) {
            debugger;
            this.over = true;
            let history = JSON.parse(window.localStorage.getItem('historyResult')) || 0;
            history = Math.max(history, this.goal);
            window.localStorage.setItem('history', JSON.stringify(history));
          }
          return flag;
        }
      },
      merge(arr) { // 合并相同数值的方块
        let oArr = [], nArr = [];
        // 提取有效数值
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]) {
            oArr.push(arr[i]);
          }
        }
        // 合并相同值
        for (let i = 0; i < oArr.length;) {
          if (oArr[i] === oArr[i + 1]) {
            oArr[i] *= 2;
            oArr[i + 1] = 0;
            this.max = Math.max(oArr[[i]], this.max);
            this.goal += oArr[i];
            if (this.historyGoal < this.goal) {
              this.historyGoal = this.goal;
              window.localStorage.setItem('history', this.historyGoal);
            }

            i++;
          }
          i++;
        }
        // 数值重新排列
        for (let i = 0; i < oArr.length; i++) {
          if (oArr[i]) {
            nArr.push(oArr[i]);
          }
        }
        // 数组补全
        let len = nArr.length;
        for (let i = 0; i < arr.length - len; i++) {
          nArr.push(0);
        }

        return nArr;
      },
      move(direction) { // 移动控制
        if (!direction) { // 没有移动方向
          return;
        }
        const _this = this;
        _this.updated = false;
        let origin = JSON.stringify(_this.result);
        const goal = _this.goal;
        if (direction === 'ArrowUp') {
          for (let j = 0; j < 4; j++) {
            let temp = [];
            for (let i = 0; i < 4; i++) {
              temp.push(_this.result[i][j]);
            }
            let result = _this.merge(temp);

            // 填装回原矩阵
            for (let i = 0; i < 4; i++) {
              _this.result[i][j] = result[i];
            }
          }
        } else if (direction === 'ArrowRight') {
          for (let i = 0; i < 4; i++) {
            let temp = [];
            for (let j = 3; j >= 0; j--) {
              temp.push(_this.result[i][j]);
            }
            let result = _this.merge(temp);

            _this.result[i] = result.reverse();
          }
        } else if (direction === 'ArrowDown') {
          for (let j = 0; j < 4; j++) {
            let temp = [];
            for (let i = 3; i >= 0; i--) {
              temp.push(_this.result[i][j]);
            }
            let result = _this.merge(temp);

            // 填装回原矩阵
            for (let i = 3; i >= 0; i--) {
              _this.result[i][j] = result[result.length - 1 - i];
            }
          }
        } else if (direction === 'ArrowLeft') {
          for (let i = 0; i < _this.result.length; i++) {
            let temp = [];
            for (let j = 0; j < _this.result[i].length; j++) {
              temp.push(_this.result[i][j]);
            }
            _this.result[i] = _this.merge(temp);
          }
        } else {
          return;
        }
        if (JSON.stringify(_this.result) !== origin) {
          _this.addNewBlock();
          _this.prev = JSON.parse(origin);
          _this.prevGoal = goal;
        } else {
          this.checkOver();
        }
        _this.updated = true;
      },
      saveCurrentResult() {
        const result = JSON.stringify(this.result);
        window.localStorage.setItem('prevResult', result);
        window.localStorage.setItem('prevGoal', this.goal);
      },
      fallback() {
        if (this.prev) {
          this.result = JSON.parse(JSON.stringify(this.prev));
          this.goal = JSON.parse(JSON.stringify(this.prevGoal));
        }
      },
      setOperateType() {
        const container = this.$refs.container;
        window.addEventListener('keydown', e => {
          this.move(e.code);
        });
        container.ontouchstart = se => {
          const startX = se.changedTouches[0].pageX,
            startY = se.changedTouches[0].pageY;

          container.ontouchend = ee => {
            const endX = ee.changedTouches[0].pageX,
              endY = ee.changedTouches[0].pageY;
            const moveX = endX - startX, moveY = endY - startY;

            const direaction =
              Math.abs(moveX) > Math.abs(moveY) ?
                (moveX !== 0 ? (moveX > 0 ? 'ArrowRight' : 'ArrowLeft') : null) :
                (moveY !== 0 ? (moveY > 0 ? 'ArrowDown' : 'ArrowUp') : null);
            this.move(direaction)
          }
        }
      },
      reset() {

      }
    },
    mounted() {
      /* TODO
      *   1. GameOver 弹窗
      *     1.1 重新开始
      *     1.2 关闭弹窗 --> 通过“回退”回到上一步
      *   2. 从心开始警示弹窗
      *     2.1 继续游戏
      *     2.2 开始新游戏 --> 游戏存档会被清楚
      * */
      if (this.$store.state.prevResult) {
        this.result = this.$store.state.prevResult;
        this.goal = +window.localStorage.getItem('prevGoal');
      } else {
        this.init();
      }
      this.historyGoal = window.localStorage.getItem('history') || 0;
      this.setOperateType();
    },
  }
</script>

<style scoped>

  .wrapper {
    padding-top: 3vw;
  }

  .operate {
    display: flex;
    justify-content: space-around;
    margin-bottom: calc(20 / 375 * 100vw);
  }

  .operate button {
    width: calc(60 / 375 * 100vw);
    height: calc(36 / 375 * 100vw);
    border: unset;
    font-size: calc(16 / 375 * 100vw);
    color: #fff;
    border-radius: calc(4 / 375 * 100vw);
    background: #cbc2b3;
    outline: unset;
  }

  .operate button.active {
    background: #e9bc6a;
  }

  .goal {
    margin-bottom: calc(20 / 375 * 100vw);
    text-align: left;
    color: #666;
    font-size: calc(24 / 375 * 100vw);
  }

  .goal.history {
    opacity: .6;
  }

  .container {
    margin: 0 auto;
    padding: 3vw;
    width: 94vw;
    height: 114.5vw; /* (5 / 4 * 94) - 2 */
    background: #bcaea0;
    border-radius: 2vw;
    box-sizing: border-box;
  }

  .row {
    margin-bottom: 3vw;
    display: flex;
    justify-content: space-between;

    &:last-child {
      margin-bottom: unset;
    }
  }

  .col {
    width: 19.75vw; /* （(88 - 6 - 9) / 4） */
    height: 24.6875vw; /* （79 / 4 * 5 / 4） */
    line-height: 24.6875vw;
    color: #fff;
    background: #cbc2b3;
    border-radius: 2vw;
  }

  .col-0 {
    color: transparent;
  }

  .col-2 {
    background: #e9bc6a;
    font-size: calc(36 / 375 * 100vw);
  }

  .col-4 {
    background: #f9a709;
    font-size: calc(36 / 375 * 100vw);
  }

  .col-8 {
    background: #f77401;
    font-size: calc(36 / 375 * 100vw);
  }

  .col-16 {
    background: #f54301;
    font-size: calc(32 / 375 * 100vw);
  }

  .col-32 {
    background: #f50e04;
    font-size: calc(32 / 375 * 100vw);
  }

  .col-64 {
    background: #c00740;
    font-size: calc(32 / 375 * 100vw);
  }

  .col-128 {
    background: #84007c;
    font-size: calc(28 / 375 * 100vw);
  }

  .col-256 {
    background: #5d34a3;
    font-size: calc(28 / 375 * 100vw);
  }

  .col-512 {
    background: #405fbf;
    font-size: calc(28 / 375 * 100vw);
  }

  .col-1024 {
    background: #268bdc;
    font-size: calc(24 / 375 * 100vw);
  }

  .col-2048 {
    background: #37b7fa;
    font-size: calc(24 / 375 * 100vw);
  }

  .col-4096 {
    background: #4dc7a0;
    font-size: calc(24 / 375 * 100vw);
  }

  .col-8192 {
    background: #93cd3d;
    font-size: calc(24 / 375 * 100vw);
  }

  .col-16384 {
    background: #62a922;
    font-size: calc(20 / 375 * 100vw);
  }

  .col-32768 {
    background: #368810;
    font-size: calc(20 / 375 * 100vw);
  }

  .col-65536 {
    background: #206800;
    font-size: calc(20 / 375 * 100vw);
  }

</style>
