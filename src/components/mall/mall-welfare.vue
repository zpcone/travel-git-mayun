<template>
  <div class="mall_welfare">
    <header-back :title="title"></header-back>
    <div class="mall_welfare_wrap">
      <div class="swipe">
        <swiper loop auto :list="imageList" :index="imageList" dots-class="dots" :show-desc-mask=false dots-position="center"></swiper>
      </div>
      <tab :line-width="1" custom-bar-width="60px" active-color="#3366cc">
        <tab-item selected @on-item-click="onItemClick">新人专享</tab-item>
        <tab-item @on-item-click="onItemClick">更多福利</tab-item>
      </tab>
      <div class="welfare_list">
        <div class="item" v-for="item in list" :key="item.id">
          <img class="img" v-lazy="item.img">
          <div class="info">
            <p class="title">满{{item.man}}减{{item.jian}}</p>
            <p class="name">{{item.name}}</p>
            <p class="time">有效期：{{item.startTime}}--{{item.endTime}}</p>
            <p class="btn" @click="getCoupon(item.id)">立即领取</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import {Swiper, SwiperItem, Tab, TabItem, ToastPlugin} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Scroll, HeaderBack, Swiper, SwiperItem, Tab, TabItem},
  data () {
    return {
      title: '新人专享',
      list: [],
      imageList: []
    }
  },
  created() {
    this.couponList(0)
    this._initBanner()
  },
  methods: {
    _initBanner () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getBanner.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          console.log(res)
          let list = res.data.data
          let filterImages = list.filter(item => item.type === '12')
          console.log(filterImages)
          filterImages.forEach((item, index) => {
            _this.imageList.push({
              url: item.url,
              img: item.img
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    onItemClick(index) {
      this.couponList(index)
    },
    getCoupon(couponId) {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      this.$axios({
        method: 'post',
        url: '/api/addUserCoupon.service?token=' + token + '&userId=' + userId,
        data: {couponId: couponId},
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.status === 200) {
          this.$vux.toast.show({
            type: 'text',
            text: '领取成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    couponList (status) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getCoupon.service?status=' + status + '&token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.list = res.data.data
          console.log(_this.list)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../common/css/variable.less";
  .mall_welfare {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #eee;
    z-index: 1000;
    .mall_welfare_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .welfare_list{
        padding: 0 0 2rem 0;
        .item{
          position: relative;
          padding:1rem 0 1rem 12rem ;
          background: @color-text-w;
          margin-bottom: 1rem;
          .img{
            position: absolute;
            width: 10rem;
            height: 8rem;
            left: 1rem;
            top:1rem;
          }
          .info{
            height: 8rem;
            line-height: 1.5rem;
            .title{
              font-size: @font-size-medium-x;
              line-height: 2rem;
              .wrap;
            }
            .name{
              font-size: @font-size-medium;
              line-height: 2rem;
              .wrap;
            }
            .time{
              font-size: @font-size-small;
              color: @color-text-g;
            }
            .btn{
              padding: 0.2rem 1rem;
              line-height: 1.6rem;
              border-radius: 3px;
              color: @color-text-w;
              font-size: @font-size-small;
              display: inline-block;
              background: @color-theme;
              margin-top: 0.5rem;
            }
          }
        }
      }
    }
  }
</style>
