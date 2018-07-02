<template>
  <div class="header-back">
    <span class="icon-back" @click="goBack()"></span>
    <p class="title" v-html="title"></p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>
<style scoped lang="less">
  .header-back{
    position: fixed;
    top:0;
    width: 100%;
    height: 4.4rem;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #ddd;
    z-index: 100000000;
    .icon-back{
      position: absolute;
      width: 4.4rem;
      height: 4.4rem;
      top:0;
      left: 0;
      background: url("../../common/images/icons/icon-back.png") center center no-repeat;
      background-size: 1rem ;
    }
    .title{
      line-height: 4.4rem;
      font-size: 1.6rem;
      color: #3b3b3b;
      font-weight: bold;
    }
  }
</style>
