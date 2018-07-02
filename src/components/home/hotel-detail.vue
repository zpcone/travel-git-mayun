<template>
  <div>
    <div class="hotel_detail">
      <header-back :title="title"></header-back>
      <span class="rightIcon" :class="[isTalk === 0 ?  'icon_star': 'icon_star_s']" @click="addHotelStar"></span>
      <div class="hotel_detail_wrap">
        <div>
          <div class="swipe">
            <swiper @click.native="goImg(hotelId)" :show-desc-mask="false" loop auto  dots-class="dots-bottom" :list="imageList" :index="imageList"></swiper>
            <p class="hotel_name">{{hotel.name}}</p>
          </div>
          <div class="content_wrap">
            <div class="icon_text" v-html="hotel.address"></div>
            <group>
              <cell-box v-if="comment.length>0" class="cell_box" :link="'/hotel/hotelDetail/comment?hotelId=' + hotelId">
                <div class="cell_left">
                  <p class="score"><span class="score_num">{{floatPrice1(score)}}</span>分</p>
                </div>
                <span class="cell_right">查看{{comment.length}}条评论</span>
              </cell-box>
              <cell-box class="cell_box" :link="'/hotel/hotelDetail/serve?hotelId=' + hotelId">
                <div class="cell_left">
                  <div class="ico_row">
                    <p v-for="item in codes" :key="item.id">
                      <img class="icon" :src="item.icon">
                      <span class="text">{{item.content}}</span>
                    </p>
                  </div>
                </div>
                <span class="cell_right">详情</span>
              </cell-box>
            </group>
            <div class="check_time">
              <div class="left">
                <div id="checkinout">
                  <div id="firstSelect">
                    <div class="Date_lr">
                      <span>入住</span>
                      <input id="startDate" type="text" value="" readonly>
                    </div>
                    <div class="Date_lr">
                      <span>离店</span>
                      <input id="endDate" type="text" value="" readonly>
                    </div>
                  </div>
                </div>
              </div>
              <span class="right">共<span class="NumDate">1</span>晚</span>
            </div>
            <div class="content" v-html="hotel.content"></div>
          </div>
          <div class="room_wrap">
            <div class="room_list_filter" style="display: none">
              <p class="desc">
                <span>含一餐</span>
                <span>大床房</span>
                <span>价格降序</span>
                <span>立即预订</span>
              </p>
            </div>
            <div class="room_list">
              <div class="item" v-for="item in roomList" :key="item.id" @click="goUrl(item.id)">
                <div class="right_info">
                  <p class="name">{{item.name}}</p>
                  <p class="desc">{{item.content}}</p>
                  <p class="price">￥<span class="large_font">{{floatPrice(item.price)}}</span></p>
                </div>
                <x-button mini class="book">预订</x-button>
              </div>
            </div>
          </div>
        </div>
        <div class="hotel_layer_bg" :class="{ active: isActive }" @click="layerClose"></div>
        <div class="hotel_layer_wrap" :class="{ active: isActive }">
          <div>
            <p>12313</p>
          </div>
        </div>
      </div>
      <div class="mask_calendar">
        <div class="calendar"></div>
      </div>
    </div>
    <router-view title="家庭房"></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import $ from 'jquery'
import '../../common/js/date.js'
import {Swiper, SwiperItem, XNumber, Group, CellBox, XButton, ToastPlugin, Checker, CheckerItem} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Swiper, SwiperItem, XButton, XNumber, Group, CellBox, Checker, CheckerItem},
  data () {
    return {
      title: '酒店详情',
      banner: [],
      hotelId: this.$route.query.hotelId,
      hotel: {},
      isTalk: 0,
      roomList: [],
      isActive: false,
      goods: {},
      comment: [],
      score: 0,
      codes: [],
      imageList: []
    }
  },
  created() {
    this.jqueryDate()
    this._getHotel()
  },
  methods: {
    msg(msg) {
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        time: '1000',
        width: '20rem',
        position: 'middle'
      })
    },
    floatPrice1(price) {
      return parseFloat(price).toFixed(1)
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    jqueryDate() {
      $(function() {
        $('#firstSelect').on('click', function (e) {
          e.stopPropagation()
          e.preventDefault()
          $('.mask_calendar').show()
        })
        $('.mask_calendar').on('click', function (e) {
          e.stopPropagation()
          e.preventDefault()
          if (e.target.className === 'mask_calendar') {
            $('.calendar').slideUp(200)
            $('.mask_calendar').fadeOut(200)
          }
        })
        $('#firstSelect').calendarSwitch({
          selectors: {
            sections: '.calendar'
          },
          index: 4, // 展示的月份个数
          animateFunction: 'slideToggle', // 动画效果
          controlDay: true, // 知否控制在daysnumber天之内，这个数值的设置前提是总显示天数大于90天
          daysnumber: '90', // 控制天数
          comeColor: '#2EB6A8', // 入住颜色
          outColor: '#2EB6A8', // 离店颜色
          comeoutColor: '#E0F4F2', // 入住和离店之间的颜色
          callback: function() { // 回调函数
            $('.mask_calendar').fadeOut(200)
            let startDate = $('#startDate').val() // 入住的天数
            let endDate = $('#endDate').val() // 离店的天数
            let NumDate = $('.NumDate').text() // 共多少晚
          },
          comfireBtn: '.comfire' // 确定按钮的class或者id
        })
        let b = new Date()
        let ye = b.getFullYear()
        let mo = b.getMonth() + 1
        mo = mo < 10 ? '0' + mo : mo
        let da = b.getDate()
        da = da < 10 ? '0' + da : da
        $('#startDate').val(ye + '-' + mo + '-' + da)
        let b2 = new Date(b.getTime() + 24 * 3600 * 1000)
        let ye2 = b2.getFullYear()
        let mo2 = b2.getMonth() + 1
        mo2 = mo2 < 10 ? '0' + mo2 : mo2
        let da2 = b2.getDate()
        da2 = da2 < 10 ? '0' + da2 : da2
        $('#endDate').val(ye2 + '-' + mo2 + '-' + da2)
      })
    },
    goBackHome() {
      this.$router.back()
    },
    goImg(id) {
      this.$router.push({path: '/hotel/hotelDetail/hotelImg', query: {hotelId: id}})
    },
    addHotelStar() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let hotelId = this.hotelId
      if(_this.isTalk === 0){
        let params = {
          userId: userId,
          hotelId: hotelId
        }
        this.$axios({
          method: 'post',
          url:  '/api/addUserHotel.service?token=' + token,
          data: JSON.stringify(params),
          headers: {'Content-Type': 'application/json'}
        }).then((res) => {
          if (res.status === 200) {
            _this.isTalk = 1
            _this.msg('收藏成功')
          }else{
            _this.msg('收藏失败')
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        this.$axios.get('/api/deleteUserHotel.service?token=' + token + '&userHotelId=' + hotelId).then((res) => {
          if (res.status === 200) {
            _this.isTalk = 0
            _this.msg('取消成功')
          }else{
            _this.msg('取消失败')
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    goUrl(roomId) {
      this.$router.push({path: `/hotel/hotelDetail/room${roomId}`, query: {startTime: $('#startDate').val(),endTime: $('#endDate').val(),days: $('.NumDate').text(), hotelName: this.hotel.name, hotelId: this.$route.query.hotelId ,roomId: roomId}})
    },
    layerOpen() {
      this.isActive = true
    },
    layerClose() {
      this.isActive = false
    },
    _getHotel () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getHotelRoom.service?token=' + token + '&hotelId=' + _this.hotelId
      }).then((res) => {
        if (res.status === 200) {
          _this.hotel = res.data.data.hotel
          setTimeout(function () {
            _this.roomList = res.data.data.roomlist
            console.log(_this.roomList)
          },200)
          _this.isTalk = res.data.data.isTalk
          _this.comment = res.data.data.comment
          _this.score = res.data.data.score
          let codes = res.data.data.codes
          if(codes.length > 5){
            for(let i = 0; i < 5; i++){
              _this.codes.push(codes[i])
            }
          }else{
            _this.codes = res.data.data.codes
          }
          let imgs = res.data.data.hotel.img.split(',')
          imgs.forEach((item, index) => {
            _this.imageList.push({
              url: '',
              img: item
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/calendar.css";
  @import "../../common/css/variable.less";
  .hotel_detail{
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .rightIcon{
      position: fixed;
      z-index: 10000000000;
      right: 10px;
      width: 4.5rem;
      height: 4.5rem;
      &.icon_star{
        background: url("../../common/images/icons/icon-st-s.png") no-repeat center center;
        background-size: auto 2rem;
        float: right;
      }
      &.icon_star_s{
        background: url("../../common/images/icons/icon-st-s-s.png") no-repeat center center;
        background-size: auto 2rem;
        float: right;
      }
    }
    .mask_calendar {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.4);
      display: none;
      z-index: 9999;
    }
    .calendar {
      height: 400px;
      position: fixed;
      bottom: 0;
      left: 0;
    }
    .hotel_detail_wrap{
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      overflow-x: hidden;
      overflow-y: auto;
      .swipe{
        position: relative;
        .hotel_back{
          position: absolute;
          top:0;
          width: 100%;
          height: 4rem;
          z-index: 100;
          span{
            width: 4rem;
            height: 4rem;
            &.icon_back{
              background: url("../../common/images/icons/icon-bc-s.png") no-repeat center center;
              background-size: auto 2rem;
              float: left;
            }

          }
        }
        .dots-bottom{
          margin-top: 2rem;
        }
        .hotel_name{
          position: absolute;
          bottom:0;
          height: 4rem;
          line-height: 4rem;
          font-size: 1.5rem;
          background: @color-background-d;
          width: 100%;
          color: @color-text-w;
          padding: 0 1rem;
          .wrap()
        }
      }
      .content_wrap{
        .icon_text{
          .wrap2;
          line-height: 2rem;
          padding: 1rem 1rem 1rem 3.2rem;
          background: url("../../common/images/icons/icon-address-black.png") no-repeat 1rem center;
          background-size: auto 2rem;
          font-size: @font-size-medium;
          background-color: #fff;
        }
        .weui-cells{
          margin-top: 1rem;
          .cell_box{
            padding-right: 30px;
            .cell_left{
              flex: 1;
              font-size: @font-size-medium;
              .score{
                color: @color-text-r;
                .score_num{
                  font-size: @font-size-large;
                }
              }
              .ico_row{
                p{
                  display: inline-block;
                  text-align: center;
                  margin-right: 1rem;
                  .icon{
                    width: 1.5rem;
                  }
                  .text{
                    display: block;
                    font-size: @font-size-small-s;
                  }
                }
              }
            }
            .cell_right{
              color: @color-theme;
              float: right;
              font-size: @font-size-small;
            }
          }
        }
        .check_time{
          padding: 1rem 30px 1rem 1rem;
          line-height: 2rem;
          background: @color-text-w;
          display: flex;
          align-items: center;
          .left{
            flex: 1;
            .Date_lr{
              input{
                border: 0;
                padding-left: 1rem;
                font-size: 1.5rem;
                outline: none;
                color: #3b3b3b;
              }
              span{
                font-size: 1.3rem;
                color: #666;
              }
            }
          }
          .right{
            color: @color-theme;
            font-size: @font-size-small;
          }
        }
        .content{
          margin-top: 1rem;
          padding: 1rem;
          background: #fff;
          font-size: @font-size-medium;
          img{
            max-width: 100%;
          }
        }
      }
      .room_wrap{
        padding-bottom: 2rem;
        margin-top: 1rem;
        .room_list_filter{
          background: @color-text-w;
          display: flex;
          font-size: @font-size-small;
          padding: 1rem;
          position: relative;
          &:before{
            .halfBorderLineB;
          }
          .desc{
            flex: 1;
            span{
              border: 1px solid @color-text-d;
              display: inline-block;
              padding: 0 0.5rem;
              line-height: 2rem;
              border-radius: 2px;
              margin-right: 1rem;
              font-size: @font-size-small;
            }
          }
          .select{
            display: inline-block;
            width: 6rem;
          }
        }
        .room_list{
          background: @color-text-w;
          .item{
            padding: 1rem 9rem 1rem 1rem;
            position: relative;
            &:before{
              .halfBorderLineB;
            }
            .right_info{
              .name{
                font-size: @font-size-large;
              }
              .desc{
                line-height: 2rem;
                padding: 0.5rem 0;
                font-size: @font-size-small-m;
                color: @color-text-g;
              }
              .price{
                font-size: @font-size-large;
                color: @color-text-r;
              }
            }
            .book{
              position: absolute;
              right: 2rem;
              top: 50%;
              transform: translate(0,-50%);
              .custom-primary-blue;
              padding: 0.6rem 1.5rem;
              line-height: 1;
            }

          }

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
  }
</style>
