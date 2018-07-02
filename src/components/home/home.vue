<template>
  <div class="home">
    <div class="home_wrap">
      <div class="top_content" :style="homeBg">
        <div class="service_list">
          <div class="item house" @click="goUrl(1)"><span>酒店</span><span>预订</span></div>
          <div class="item meeting" @click="goUrl(2)"><span>会议</span><span>预订</span></div>
          <div class="item business" @click="goUrl(3)"><span>商旅</span><span>服务</span></div>
          <div class="item customized" @click="goUrl(4)"><span>定制游</span><span>服务</span></div>
          <div class="item vip" @click="goUrl(5)"><span>VIP</span><span>会员</span></div>
          <div class="item tour" @click="goUrl(6)"><span>旅游</span><span>服务</span></div>
          <div class="item purse" @click="goUrl(7)"></div>
        </div>
        <div class="search_form">
          <div class="input_row">
            <span class="span_icon icon_search"></span>
            <div class="address row_item">
              <x-address :title="addressTitle" @on-hide="changeAddress" class="province" v-model="address" raw-value :list="addressData" hide-district></x-address>
            </div>
          </div>
          <div class="input_row">
            <span class="span_icon icon_time"></span>
            <div id="checkinout" class="row_item checkTime">
              <div id="firstSelect">
                <div class="Date_lr">
                  <input id="startDate" type="text" value="" readonly>
                </div>
                —
                <div class="Date_lr">
                  <input id="endDate" type="text" value="" readonly>
                </div>
              </div>
              <span style="display: none">共<span class="NumDate">1</span>晚</span>
            </div>
          </div>
          <button class="search" @click="search">查找酒店</button>
        </div>
      </div>
    </div>
    <div class="home_board" @click="goBusiness">
      <img v-lazy="imageType2" />
    </div>
    <div class="mask_calendar">
      <div class="calendar"></div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import $ from 'jquery'
import '../../common/js/date.js'
import { Group, Cell, CellBox, XInput, Datetime, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name, PopupPicker, Picker, ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Group, Cell, CellBox, XInput, Datetime, XAddress, PopupPicker, Picker},
  data() {
    return {
      title: '嘉人和',
      homeBg: {backgroundImage: 'url(' + require('../../common/images/home-bg.jpg') + ')'},
      addressData: ChinaAddressV4Data,
      addressTitle: '',
      address: [],
      imageType1: '',
      imageType2: ''
    }
  },
  created() {
    this._initBanner()
    this._getLocation()
    this.jqueryDate()
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
          let list = res.data.data
          _this.imageType1 = list.filter(item => item.type === '1')[0].img
          _this.imageType2 = list.filter(item => item.type === '2')[0].img
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    jqueryDate() {
      $(function() {
        $('#firstSelect').on('click', function (e) {
          console.log(12)
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
          comeColor: '#3366cc', // 入住颜色
          outColor: '#3366cc', // 离店颜色
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
        $('#startDate').val(ye + '.' + mo + '.' + da)
        let b2 = new Date(b.getTime() + 24 * 3600 * 1000)
        let ye2 = b2.getFullYear()
        let mo2 = b2.getMonth() + 1
        mo2 = mo2 < 10 ? '0' + mo2 : mo2
        let da2 = b2.getDate()
        da2 = da2 < 10 ? '0' + da2 : da2
        $('#endDate').val(ye2 + '.' + mo2 + '.' + da2)
      })
    },
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let result = window.location.hash.substr(1).match(reg)
      if (result != null) {
        return decodeURIComponent(result[2]);
      } else {
        return null;
      }
    },
    changeAddress() {
      let address = this.getName(this.address).split(' ')
      if (address[1] === '市辖区' || address[1] === '县') {
        this.addressTitle = address[0]
      } else {
        this.addressTitle = address[1]
      }
      sessionStorage.setItem('dingwei', this.addressTitle)
    },
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    _getLocation() {
      let _this = this
      wx.ready(function() {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            let longitude = res.longitude
            let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
            sessionStorage.setItem('lng', longitude)
            sessionStorage.setItem('lat', latitude)
            _this._getCity(latitude, longitude)
          }
        })
      })
    },
    _getCity (lat, lng) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/jwd.service?token=' + token + '&lat=' + lat + '&lng=' + lng
      }).then((res) => {
        if (res.status === 200) {
          _this.address.push(res.data.data.addressComponent.province)
          _this.address.push(res.data.data.addressComponent.city)
          _this.addressTitle = res.data.data.addressComponent.city
          sessionStorage.setItem('dingwei', _this.addressTitle)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    goUrl(itemId) {
      if (itemId === 1) {
        this.search()
      } else if (itemId === 2) {
        this.$router.push({path: `/meeting`})
      } else if (itemId === 3) {
        this.$router.push({path: `/business`})
      } else if (itemId === 4) {
        this.$router.push({path: `/customizedLead`})
      } else if (itemId === 5) {
        this.$router.push({path: `/vip`})
      } else if (itemId === 6) {
        this.$router.push({path: `/tourLead`})
      } else if (itemId === 7) {
      }
    },
    goBusiness() {
      this.$router.push({path: `/business2`})
    },
    search() {
      let startDate = $('#startDate').val()
      let endDate = $('#endDate').val()
      let lat = sessionStorage.getItem('lat')
      let lng = sessionStorage.getItem('lng')
      this.$router.push({path: `/hotel`, query:{startDate:startDate, endDate:endDate, lng:lng, lat:lat}})
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  @import "../../common/css/calendar.css";
  .home{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 5.1rem;
    z-index: 10;
    .home_wrap{
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      bottom: 16rem;
      .top_content{
        width: 100%;
        height: 100%;
        position: relative;
        background-size: 100% 100%;
        box-sizing: border-box;
        padding-top: 10%;
        .service_list{
          height: 55%;
          position: relative;
          .item{
            position: absolute;
            background: @color-background-l;
            padding: 1rem;
            color: #f2f2f2;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.5);
            text-align: center;
            font-size: @font-size-medium;
            width: 3rem;
            left: 50%;
            top:50%;
            animation:myMove 2s ;
            -webkit-animation:myMove 2s ;
            &.moveActive{
              animation:itemMove 2s;
              -webkit-animation:itemMove 2s;
            }
            span{
              display: block;
              padding: 0.1rem 0;
              text-align: center;
            }
            &.house{
              font-size: @font-size-medium-x;
              width: 3.4rem;
              margin-left: 5rem;
              margin-top: -7rem;
            }
            &.meeting{
              font-size: @font-size-small-s;
              width: 2.4rem;
              padding: 0.6rem;
              margin-left: 5rem;
              margin-top: 2rem;
            }
            &.business{
              margin-left: -2rem ;
              margin-top: 6rem;
              width: 3rem;
              font-size: @font-size-small-m
            }
            &.customized{
              margin-left: -10rem;
              margin-top: 3rem;
              width: 4.2rem;
              font-size: 12px;
              padding: 1rem 0.3rem;
            }
            &.vip{
              font-size: @font-size-small-s;
              width: 2.4rem;
              padding: 0.6rem;
              margin-left: -10rem;
              margin-top: -4rem;
            }
            &.tour{
              margin-left: -3rem;
              margin-top: -10.5rem;
              width: 3rem;
              font-size: @font-size-small-m;
              padding: 0.8rem;
            }
            &.purse{
              margin-left: -4rem;
              margin-top: -4rem;
              width: 5rem;
              height: 5rem;
              padding: 1.3rem;
              background:url("../../common/images/icons/home-icon-purse.png") no-repeat center;
              background-size: 4.5rem auto;
            }
          }
        }
        .search_form{
          height: 45%;
          padding: 0 4rem;
          font-size: @font-size-medium;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          .input_row{
            margin-bottom: 1rem;
            width: 100%;
            position: relative;
            .span_icon{
              position: absolute;
              left: 1rem;
              width: 1.6rem;
              height: 1.6rem;
              top:0.8rem;
              &.icon_search{
                background:url("../../common/images/icons/icon-address-blue.png") no-repeat center;
                background-size: auto 1.6rem;
              }
              &.icon_time{
                .bgImage("../../common/images/icons/icon-time.png")
              }
            }
            .row_item{
              color: @color-text-w;
              height: 3.2rem;
              line-height: 3.2rem;
              background: @color-background-l;
              border-radius: 4px;
              padding-left: 3.5rem;
              &.address{
                .province{
                  padding-left: 0.3rem;
                  .weui-cell{
                    padding: 0;
                  }
                  .weui-label{
                    font-size: @font-size-medium;
                  }
                  .weui-cell__ft, .vux-cell-value{
                    display: none !important;
                  }
                }
              }
              &.checkTime{
                #firstSelect{
                  .Date_lr{
                    display: inline;
                    input{
                      color: #fff;
                      background: none;
                      border: 0;
                      outline: none;
                      width: 8rem;
                      text-align: center;
                      font-size: @font-size-medium;
                    }
                  }
                }
              }
            }
          }
          .search{
            width: 100%;
            color: @color-text-w;
            line-height: 3.4rem;
            background: @color-theme;
            border: 0;
            border-radius: 4px;
            font-size: @font-size-medium;
            padding: 0;
          }
        }
      }
    }
    .home_board{
      position: fixed;
      width: 100%;
      height: 10rem;
      bottom: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 100%;
        height: 100%;
      }
      .cus{
        position: absolute;
        padding: 1rem 3rem;
        font-size: @font-size-large-x;
        background: @color-background-w;
        color: @color-text-g;
      }
    }
  }
  @keyframes myMove
  {
    0% {transform: scale(0.7);}
    100% {transform: scale(1);}
  }
  @keyframes itemMove
  {
    0% {transform: scale(1);}
    100% {transform: scale(0.6);}
  }
</style>
