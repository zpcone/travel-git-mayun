<template>
  <div class="mall_activities">
    <header-back :title="title"></header-back>
    <scroll class="mall_activities_wrap">
      <div>
        <div class="swipe">
          <swiper loop auto :list="imageList" :index="imageList" dots-class="dots" :show-desc-mask=false dots-position="center"></swiper>
        </div>
        <goods-list :data="goodsList"></goods-list>
      </div>
    </scroll>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import GoodsList from './goods-list'
import {Swiper, SwiperItem} from 'vux'
export default {
  components: {Scroll, HeaderBack, GoodsList, Swiper, SwiperItem},
  data () {
    return {
      title: '最新活动',
      goodsList: [],
      imageList: []
    }
  },
  created() {
    this._initMall()
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
          let filterImages = list.filter(item => item.type === '13')
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
    _initMall () {
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getCommodity.service?token=22'
      }).then((res) => {
        if (res.status === 200) {
          _this.goodsList = res.data.data
          console.log(res.data.data)
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
  .mall_activities {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    .mall_activities_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .activities_list {
        overflow-y: auto;
        padding: 1rem 0;
        .item {
          width: 50%;
          float: left;
          padding: 0 1rem;
          box-sizing: border-box;
          position: relative;
          margin-bottom: 1rem;
          &:nth-child(2n+1){
            padding-right: 0;
          }
          .content {
            img {
              width: 100%;
              height: 14rem;
            }
            .name {
              line-height: 2rem;
              font-size: @font-size-medium;
              .wrap2;
            }
            .money {
              font-size: @font-size-large;
              color: #ef605a;
            }
          }
        }
      }
    }
  }
</style>
