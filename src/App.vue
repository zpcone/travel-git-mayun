<template>
  <div id="app">
    <router-view></router-view>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import FooterNav from 'components/base/footer-nav.vue'
export default {
  components: {FooterNav},
  data() {
    return {
      page: window.location.href.split('#')[1],
      oId: this.getQueryString('oId')
    }
  },
  watch: {
    $route(to, from) {
      if (from.path !== to.path) {
        this.wxConfig()
        this.page = window.location.href.split('#')[1]
        this.wxShare()
      }
    }
  },
  created () {
    sessionStorage.setItem('userId',this.oId)
    sessionStorage.setItem('openId',this.oId)
    sessionStorage.setItem('token','22')
    try {
      document.body.removeChild(document.getElementById('appLoading'))
    } catch (e) {
    }
    this.wxConfig()
    this.wxShare()
  },
  methods: {
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let result = window.location.search.substr(1).match(reg)
      if (result != null) {
        return decodeURIComponent(result[2]);
      } else {
        return null;
      }
    },
    wxConfig() {
      this.$axios.get('/api/getWxConfig.service?token=22&url=' + window.location.href).then((res) => {
        if (res.status === 200) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.data.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'getLocation', 'chooseWXPay', 'chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    wxShare() {
      let page = this.page
      wx.ready(function () {
        wx.onMenuShareAppMessage({
          desc: '嘉人和自定义分享',
          link: 'http://jr-trip.com/login.html?sharePage=' + page, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://jr-trip.com/logo.png', // 分享图标
          success: function () {
          },
          cancel: function () {
          }
        })
        wx.onMenuShareTimeline({
          desc: '嘉人和自定义分享',
          link: 'http://jr-trip.com/login.html?sharePage=' + page, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://jr-trip.com/logo.png', // 分享图标
          success: function () {
          },
          cancel: function () {
          }
        })
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #3b3b3b;
}
</style>
