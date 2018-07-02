<template>
  <div>
    <div class="customized-lead">
      <header-back :title="title"></header-back>
      <div class="customized-lead_wrap">
        <img :src="imageType3"/>
      </div>
      <div class="customized-lead_handle">
        <div class="buy" @click="buy">立即预约</div>
      </div>
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
      title: '定制游服务',
      imageType3: ''
    }
  },
  created() {
    this._initBanner()
  },
  methods: {
    buy() {
      this.$router.push({path: `/customized`})
    },
    _initBanner () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getBanner.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          let list = res.data.data
          _this.imageType3 = list.filter(item => item.type === '3')[0].img
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
  .customized-lead {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .customized-lead_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 6rem;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .customized-lead_handle{
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
      .buy{
        flex: 1;
        background: @color-theme;
      }
    }
  }
</style>
