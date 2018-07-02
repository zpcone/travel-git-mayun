<template>
  <div>
    <div class="vip_serve">
      <header-back :title="title"></header-back>
      <scroll class="vip_serve_wrap">
        <div class="list">
          <div class="item" v-for="item in list" :key="item.id" @click="goDetail(item.id)">
            <img class="img" v-lazy="item.img"/>
            <p class="title">{{item.name}}</p>
            <p class="price">￥{{floatPrice(item.price)}}</p>
          </div>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
export default {
  components: {HeaderBack, Scroll},
  data () {
    return {
      title: '尊享服务',
      list: []
    }
  },
  created() {
    this._initVip()
  },
  methods: {
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    goDetail(id) {
      this.$router.push({path: `/vip/${id}`})
    },
    _initVip () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getVip.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.list = res.data.data
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
  .vip_serve {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .vip_serve_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      .list{
        .item{
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          background: @color-text-w;
          font-size: @font-size-large;
          .img{
            width: 100%;
            height: 16rem;
            background: #d1d1d1;
          }
          .title{
            line-height: 3rem;
            padding: 0 1rem;
          }
          .price{
            color: @color-text-r;
            padding: 0 1rem;
          }
        }
      }
    }
  }
</style>
