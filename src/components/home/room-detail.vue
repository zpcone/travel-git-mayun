<template>
  <div class="room_detail">
    <header-back :title="room.name"></header-back>
    <scroll class="room_detail_wrap">
      <div style="padding-bottom: 4rem">
        <div class="swipe">
          <swiper :show-desc-mask="false" loop auto :list="imageList" :index="imageList"></swiper>
        </div>
        <div class="content_wrap">
          <div class="room_desc">
            <p v-for="item in serveList" :key="item.id">
              <span class="label">{{item.name}}：</span><span>{{item.content}}</span>
            </p>
          </div>
          <div class="room_rules">
            <p class="title">退订政策</p>
            <div class="text" v-html="room.cancel"></div>
          </div>
        </div>
      </div>
      <div class="room_detail_handle">
        <div class="order"><span class="price">￥{{floatPrice(room.price)}}</span></div>
        <div class="buy" @click="buy">预订</div>
      </div>
    </scroll>
    <div class="hotel_layer_bg" :class="{ active: isActive }" @click="layerClose"></div>
    <div class="hotel_layer_wrap" :class="{ active: isActive }">
      <div>
        <p>12313</p>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import {Swiper, SwiperItem, ToastPlugin} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Scroll, HeaderBack, Swiper, SwiperItem},
  data () {
    return {
      isActive: false,
      room: {},
      serveList: [],
      imageList: []
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    _getDetail () {
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getRooms.service?token=22&id=' + _this.$route.query.roomId
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data)
          _this.room = res.data.data[0]
          let imgs = res.data.data[0].img.split(',')
          imgs.forEach((item, index) => {
            _this.imageList.push({
              url: '',
              img: item
            })
          })
          let serves = res.data.data[0].services.split(',')
          serves.forEach((item, index) => {
            let it = item.split('|')
            _this.serveList.push({
              id: index,
              name: it[0],
              content: it[1]
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    layerOpen() {
      this.isActive = true
    },
    layerClose() {
      this.isActive = false
    },
    buy() {
      this.$router.push({path: `/roomBook` , query: {startTime: this.$route.query.startTime,endTime: this.$route.query.endTime,days: this.$route.query.days, hotelName: this.$route.query.hotelName, hotelId: this.$route.query.hotelId ,roomId: this.$route.query.roomId}})
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../common/css/variable.less";
  .room_detail{
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: @color-text-w;
    overflow: hidden;
    z-index: 100;
    .room_detail_wrap{
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      .room_desc{
        padding: 1rem;
        overflow-y: auto;
        position: relative;
        &:after{
          .halfBorderLineB;
        }
        p{
          line-height: 2.5rem;
          display: inline-block;
          width: 50%;
          float: left;
          font-size: @font-size-medium;
          .label{
            color: @color-text-g;
            margin-right: 1rem;
          }
        }
      }
      .room_rules{
        padding: 1rem;
        .title{
          line-height: 2rem;
          font-size: @font-size-large;
          padding-bottom: 0.5rem;
        }
        .text{
          text-indent: 2rem;
          font-size: @font-size-medium;
          line-height: 2rem;
        }
      }
      .hotel_layer_bg{
        position: fixed;
        display: none;
        top: 9rem;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        opacity: 0;
        z-index: 100000;
        &.active{
          opacity: 1;
          display: block;
        }
      }
      .hotel_layer_wrap {
        overflow: hidden;
        position: absolute;
        padding-top: 2rem;
        width: 100%;
        top: -100%;
        transition: all .3s linear;
        &.active {
          top: 9rem;
        }
      }
    }
    .room_detail_handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      line-height: 5rem;
      align-items: center;
      width: 100%;
      font-size: 1.5rem;
      text-align: center;
      color: @color-text-w;
      border-top: 1px solid #ddd;
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
        line-height: 5rem;
      }
    }
  }
</style>
