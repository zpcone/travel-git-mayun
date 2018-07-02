<template>
  <div>
    <div class="mall_card">
      <header-back :title="title"></header-back>
      <scroll class="mall_card_wrap">
        <div>
          <goods-list :data="filterGoods"></goods-list>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import GoodsList from './card-goods-list'
import HeaderBack from 'components/base/header-back'
export default {
  components: {Scroll, GoodsList, HeaderBack},
  data () {
    return {
      title: '积分商城',
      goodsList: [],
      filterGoods: []
    }
  },
  created() {
    this._initGoods()
  },
  methods:{
    _initGoods () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/shopping.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.goodsList = res.data.data.shangpin
          _this.filterGoods = _this.goodsList.filter(item => item.codeType === '1')
          console.log(_this.filterGoods)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .mall_card {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    bottom: 0;
    z-index: 100;
    .mall_card_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
    }
  }
</style>
