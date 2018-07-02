<template>
  <div class="room_book_confirm">
    <header-back :title="title"></header-back>
    <scroll class="room_book_confirm_wrap">
      <div style="padding-bottom: 5rem">
        <div class="order_price">需支付：<span class="price">{{total}}元</span></div>
        <div class="detail">
          <p class="hotel">{{hotelName}}</p>
          <p class="title">{{room.name}}</p>
          <p class="time"><span>入住：{{reserve.startTime}}</span><span>离开：{{reserve.endTime}}</span></p>
        </div>
        <div class="detailInfo">
          <h3>联系人信息</h3>
          <p>联系人: {{reserve.name}}</p>
          <p>联系电话：{{reserve.phone}}</p>
          <p>预订房间数：{{reserve.num}}间</p>
          <p>到店时间：{{reserve.inTime}}</p>
          <p v-show="reserve.content !== ''">其他需求：{{reserve.content}}</p>
        </div>
        <div class="detailInfo">
          <h3>房客信息</h3>
          <p v-for="(item, index) in nameArr" :key="index">房客{{index + 1}}: {{item}}</p>
        </div>
        <div class="write_content">
          <group>
            <cell class="icon_row" :link="'/roomBookConfirm/mineTicket?money='+total">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-ticket.png"/>
                <span style="vertical-align:middle;">领券</span>
              </span>
              <span v-if="ticketInfoObj.id!=''">-￥{{ticketInfoObj.xianjin}}.00</span>
            </cell>
          </group>
          <group>
            <cell class="icon_row" link="/roomBookConfirm/mineInvoice?type=hotel">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-invoice.png"/>
                <span style="vertical-align:middle;">开具发票</span>
              </span>
              <span v-html="invoiceInfoObj.name"></span>
            </cell>
          </group>
          <group>
            <p class="pay_way">支付方式</p>
            <cell class="icon_row">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-wechat.png"/>
                <span style="vertical-align:middle;">微信支付</span>
              </span>
              <span class="right_icon"></span>
            </cell>
          </group>
        </div>
      </div>
      <div class="room_book_confirm_handle">
        <div class="buy" @click="buy">立即支付<span class="price">{{totalPrice}}</span>元</div>
      </div>
    </scroll>
    <router-view @invoiceInfo="onInvoiceInfoChange" @ticketInfo="onTicketInfoChange"></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import { Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, Cell, CellBox, Datetime, Picker, XTextarea},
  data () {
    return {
      title: '嘉人和收银台',
      preId: this.$route.query.preId || '',
      result: '',
      hotelName: this.$route.query.hotelName,
      totalPrice: '',
      total: '',
      reserve: {},
      room: {},
      nameArr: [],
      invoiceInfo: '',
      ticketInfo: ''
    }
  },
  computed: {
    ticketInfoObj: function () {
      let ticketInfoStr = this.ticketInfo.split('___')
      let ticketObj = {
        id: ticketInfoStr[0],
        xianjin: ticketInfoStr[1]
      }
      return ticketObj
    },
    invoiceInfoObj: function () {
      let invoiceInfoStr = this.invoiceInfo.split('___')
      let invoiceObj = {
        id: invoiceInfoStr[0],
        name: invoiceInfoStr[1]
      }
      return invoiceObj
    }
  },
  created() {
    this.getReserve()
    if(this.preId !== ''){
      this.getOrderInfo()
    }
  },
  methods: {
    getOrderInfo() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getOrderUserInfo.service?token=' + token + '&orderId=' + _this.preId + '&type=0'
      }).then((res) => {
        if (res.status === 200) {
          _this.result = res.data.data[0].hotelOrder.result
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    datedifference(sDate1, sDate2){
      let dateSpan,iDays
      sDate1 = Date.parse(sDate1)
      sDate2 = Date.parse(sDate2)
      dateSpan = sDate2 - sDate1
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays
    },
    getRoom (roomId, num, days) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getRooms.service?token=' + token + '&id=' + roomId
      }).then((res) => {
        if (res.status === 200) {
          _this.room = res.data.data[0]
          let price = _this.room.price
          _this.total = (parseFloat(days) * parseFloat(num) * parseFloat(price)).toFixed(2)
          _this.totalPrice = (parseFloat(days) * parseFloat(num) * parseFloat(price)).toFixed(2)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getReserve() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getReserve.service?token=' + token + '&id=' + _this.$route.query.reserveId
      }).then((res) => {
        if (res.status === 200) {
          console.log(res)
          _this.reserve = res.data.data[0]
          let days = _this.datedifference(_this.reserve.startTime, _this.reserve.endTime)
          let roomId = _this.reserve.roomId
          let num = _this.reserve.num
          _this.getRoom(roomId, num, days)
          _this.nameArr = res.data.data[0].people.split(',')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    msg(msg) {
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        time: '1000',
        width: '20rem',
        position: 'middle'
      })
    },
    getCurrentTime() {
      let now = new Date();
      let year = now.getFullYear()
      let month = now.getMonth() + 1
      let day = now.getDate()
      let hh = now.getHours()
      let mm = now.getMinutes()
      let ss = now.getSeconds()
      let currentTime = year + "-";
      if (month < 10) {
        currentTime += "0"
      }
      currentTime += month + "-"
      if(day < 10){
        currentTime += "0"
      }
      currentTime += day + " "
      if(hh < 10){
        currentTime += "0"
      }
      currentTime += hh + ":";
      if (mm < 10) {
        currentTime += '0';
      }
      currentTime += mm + ":";
      if (ss < 10) {
        currentTime += '0';
      }
      currentTime += ss;
      return(currentTime);
    },
    onTicketInfoChange(ticketInfo) {
      let total = this.total
      this.ticketInfo = ticketInfo
      let xianjin = this.ticketInfoObj.xianjin
      this.totalPrice = (total - xianjin).toFixed(2) > 0 ? (total - xianjin).toFixed(2) : 0
    },
    onInvoiceInfoChange(invoiceInfo){
      this.invoiceInfo = invoiceInfo
    },
    buy() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let openId = sessionStorage.getItem('openId')
      let crtTime = this.getCurrentTime()
      let hotelId = this.reserve.hotelId
      let roomId = this.reserve.roomId
      let money = (this.totalPrice) * 100
      if (this.preId !== '') {
        let resultJson = JSON.parse(this.result)
        wx.ready(function() {
          wx.chooseWXPay({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            timestamp: resultJson['timeStamp'], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: resultJson['nonceStr'], // 支付签名随机串，不长于 32 位
            package: resultJson['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: resultJson['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: resultJson['paySign'], // 支付签名
            success: function (res) {
              if (res.errMsg === 'chooseWXPay:ok') {
                _this.$axios({
                  method: 'get',
                  url: '/api/toAppHotelPrice.service?token=' + token + '&pre_id=' + _this.preId
                }).then((res) => {
                  if (res.status === 200) {
                    let cardNum = res.data.data
                    _this.$router.push({path: `/orderSuccess`, query: {orderId: _this.preId,cardNum:cardNum, createTime: crtTime, totalPrice: _this.totalPrice}})
                  }
                }).catch((error) => {
                  console.log(error)
                })
              }
            }
          })
        })
      }else{
        let params = {
          userId: userId,
          openId: openId,
          hotelId: hotelId,
          roomId: roomId,
          reserveId: this.$route.query.reserveId,
          crtTime: crtTime,
          money: money,
          couponId:  this.ticketInfoObj.id,
          invoiceId: this.invoiceInfoObj.id,
          status: '1',
          codeType: '0'
        }
        this.$axios({
          method: 'post',
          url: '/api/toTakeHotel.service?token=' + token,
          data: params,
          headers: {'Content-Type': 'application/json'}
        })
          .then((res) => {
            if (res.status === 200) {
              let preId = res.data.data.package.split('=')[1]
              if(money === 0 || money == '0'){
                _this.$router.push({path: `/orderSuccess`, query: {orderId: preId, createTime: crtTime, totalPrice: _this.totalPrice}})
              }else{
                wx.ready(function() {
                  wx.chooseWXPay({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    timestamp: res.data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: res.data.data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: res.data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: res.data.data.paySign, // 支付签名
                    success: function (res) {
                      if (res.errMsg === 'chooseWXPay:ok') {
                        _this.$axios({
                          method: 'get',
                          url: '/api/toAppHotelPrice.service?token=' + token + '&pre_id=' + preId
                        }).then((res) => {
                          let cardNum = res.data.data
                          _this.$router.push({path: `/orderSuccess`, query: {orderId: preId,cardNum:cardNum, createTime: crtTime, totalPrice: _this.totalPrice}})
                        }).catch((error) => {
                          console.log(error)
                        })
                      }
                    }
                  })
                })
              }
            } else {
              _this.msg('系统错误')
            }
          }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .room_book_confirm{
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .room_book_confirm_wrap{
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      .order_price{
        text-align: right;
        padding: 1rem;
        line-height: 2rem;
        background: #fff;
        margin-bottom: 1rem;
        font-size: @font-size-medium;
        .price{
          color: @color-text-r;
          font-size: @font-size-medium-x;
        }
      }
      .detail{
        background: @color-text-w;
        padding: 1rem;
        margin-bottom: 1rem;
        line-height: 2rem;
        font-size: @font-size-medium;
        .hotel{
          font-size: @font-size-large-x;
        }
        .title{
          font-size: @font-size-large;
          line-height: 3rem;
        }
        .time{
          span{
            margin-right: 2rem;
          }
        }
        .list{
          margin-top: 1rem;
          span{
            border-left: 1px solid @color-text-d;
            display: inline-block;
            padding: 0 0.5rem;
            line-height: 1.8rem;
            border-radius: 2px;
            font-size: @font-size-small;
            margin-bottom: 1rem;
            &:first-child{
              border-left: 0;
              padding-left: 0;
            }
          }
        }
      }
      .detailInfo{
        padding: 1rem;
        background: #ffffff;
        font-size: @font-size-medium;
        margin-bottom: 1rem;
        h3{
          border-bottom: 1px dashed #ddd;
          line-height: 3rem;
        }
        p{
          line-height: 3rem;
        }
      }
      .write_content{
        .weui-cells{
          margin-top: 1rem;
        }
        .pay_way{
          font-size: @font-size-medium;
          padding: 1rem 15px;
          line-height: 2rem;
        }
        .icon_row{
          font-size: @font-size-medium;
          .icon{
            width: 1.8rem;
            vertical-align: middle;
            margin-right: 0.5rem;
          }
          .vux-label{
            span{
              font-size: @font-size-medium;
            }
          }
          .right_icon{
            width: 11px;
            height: 11px;
            border-radius: 50%;
            background: #fff;
            border:1px solid @color-theme;
            display: inline-block;
            position: relative;
            &:after{
              position: absolute;
              left: 3px;
              top: 3px;
              content: '';
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: @color-theme;
            }
          }
        }
      }
    }
    .room_book_confirm_handle{
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
        .price{
          color: @color-text-r;
        }
      }
    }
  }
</style>
