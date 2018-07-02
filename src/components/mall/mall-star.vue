<template>
  <div>
    <div class="mall_star">
      <header-back :title="title"></header-back>
      <scroll class="mall_star_wrap" :data="sceneryList">
        <div>
          <div class="swipe">
            <swiper loop auto :list="imageList" :index="imageList" dots-class="dots" :show-desc-mask=false dots-position="center"></swiper>
          </div>
          <tour-list :data="sceneryList" type="star"></tour-list>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import TourList from 'components/serve/tour-list'
import {Swiper, SwiperItem} from 'vux'
export default {
  components: {Scroll, HeaderBack, TourList, Swiper, SwiperItem},
  data () {
    return {
      title: '明星线TOP.10',
      sceneryList: [],
      imageList: []
    }
  },
  created() {
    this._initTour()
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
          let filterImages = list.filter(item => item.type === '2')
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
    _initTour () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getScenery.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.sceneryList = res.data.data
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
  .mall_star {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #eee;
    z-index: 1000;
    .mall_star_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .star_list {
        background: #eee;
        padding-bottom: 1rem;
        .item{
          background: @color-text-w;
          position: relative;
          height: 12rem;
          margin: 1rem 0 0 0;
          .img{
            position: absolute;
            top:0;
            left: 0;
            height: 12rem;
          }
          .info{
            padding: 0 1rem 0 16rem;
            p{
              font-size: @font-size-small;
              color: @color-text-g;
              line-height: 2.5rem;
              span{
                display: inline-block;
                margin-right: 1rem;
              }
              &.name{
                font-size: @font-size-large;
                padding-left: 3rem;
                color: @color-text-b;
                padding-top: 1rem;
                text-indent: 2rem;
                min-height: 4rem;
                .wrap2;
              }
              &.score{
                padding-left: 2rem;
              }
              &.price{
                .red{
                  font-size: @font-size-large;
                  margin-right: 0;
                  color: @color-text-r;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
