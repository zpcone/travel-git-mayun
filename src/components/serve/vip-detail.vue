<template>
  <div class="vip_detail">
    <header-back :title="title"></header-back>
    <scroll class="vip_detail_wrap">
      <div class="content" v-html="vip.content">
      </div>
      <div class="vip_detail_handle">
        <div class="order">会员特惠<span class="price">￥{{floatPrice(vip.price)}}</span>/年</div>
        <div class="buy" @click="buy">快速下单</div>
      </div>
    </scroll>
  </div>
</template>
<script>
import Vue from 'vue'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import {ToastPlugin} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Scroll, HeaderBack},
  data () {
    return {
      title: 'vip详情',
      vip: {}
    }
  },
  created() {
    this._initDetail()
  },
  methods: {
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    _initDetail () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getVip.service?token=' + token + '&id=' + this.$route.params.id
      }).then((res) => {
        if (res.status === 200) {
          _this.vip = res.data.data[0]
          console.log(_this.vip)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    buy() {
      this.$router.push({path: `/vipOrderConfirm`, query: {money: this.vip.price, vipId: this.$route.params.id}})
    }
  }
}
</script>
<style scoped="" lang="less">
  @import "../../common/css/variable.less";
  .vip_detail{
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: @color-text-w;
    overflow: hidden;
    z-index: 100;
    .vip_detail_wrap{
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
    }
    .vip_detail_handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      line-height: 5rem;
      width: 100%;
      font-size: 1.5rem;
      text-align: center;
      color: @color-text-w;
      align-items: center;
      border-top: 1px solid @color-text-d;
      .order{
        flex: 1;
        color: @color-text-g;
        background: @color-text-w;
        .price{
          color: @color-text-r;
          font-size: 1.8rem;
        }
      }
      .buy{
        flex: 1;
        background: @color-theme;
      }
    }
  }
</style>
