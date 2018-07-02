<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/home">
      <span class="tab-link-icon icon-home"></span>
      <p class="tab-link-text">首页</p>
    </router-link>
    <router-link tag="div" class="tab-item" to="/mall">
      <span class="tab-link-icon icon-mall"></span>
      <p class="tab-link-text">商城</p>
    </router-link>
    <router-link tag="div" class="tab-item" to="/order">
      <span class="tab-link-icon icon-order"></span>
      <p class="tab-link-text">订单</p>
    </router-link>
    <router-link tag="div" class="tab-item" to="/mine">
      <span class="tab-link-icon icon-mine"></span>
      <p class="tab-link-text">我的</p>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../common/css/variable.less";
  .tab{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 5rem;
    background: #fff;
    border-top: 1px solid #ddd;
    display: flex;
    align-items: center;
    .tab-item{
      flex: 1;
      text-align :center;
      .tab-link-icon{
        display: inline-block;
        width: 2.2rem;
        height: 2rem;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        &.icon-home{
          background-image: url('../../common/images/icons/index1.png');
        }
        &.icon-mall{
          background-image: url('../../common/images/icons/index2.png');
        }
        &.icon-order{
          background-image: url('../../common/images/icons/index3.png');
        }
        &.icon-mine{
          background-image: url('../../common/images/icons/index4.png');
        }
      }
      .tab-link-text{
        font-size: 1.2rem;
        color: #3b3b3b;
        line-height: 12px;
      }
      &.router-link-active{
        .tab-link-text{
          color : @color-theme
        }
        .icon-home {
          background-image: url('../../common/images/icons/index1-a.png');
        }
        .icon-mall {
          background-image: url('../../common/images/icons/index2-a.png');
        }
        .icon-order{
          background-image: url('../../common/images/icons/index3-a.png');
        }
        .icon-mine {
          background-image: url('../../common/images/icons/index4-a.png');
        }
      }
    }
  }
</style>
