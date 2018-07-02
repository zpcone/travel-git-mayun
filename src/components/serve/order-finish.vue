<template>
  <div class="order_finish">
    <header-back :title="title"></header-back>
    <div class="order_finish_wrap">
      <img class="logo" src="../../common/images/logo.png"/>
      <p class="title">恭喜您预约成功</p>
      <p>我们的客服会尽快与您取得联系，请保持电话畅通。</p>
    </div>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
export default {
  components: {HeaderBack},
  data () {
    return {
      title: '预约成功'
    }
  },
  methods: {
    buy() {
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../common/css/variable.less";
  .order_finish {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: @color-text-w;
    overflow: hidden;
    z-index: 100;
    .order_finish_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 15rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: @font-size-medium;
      .logo{
        width: 40%;
      }
      .title{
        font-size: @font-size-large;
        padding: 1.5rem 0;
      }
    }
  }
</style>
