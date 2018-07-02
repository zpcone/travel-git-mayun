<template>
  <div>
    <div class="vip_order_confirm">
      <header-back :title="title"></header-back>
      <scroll class="vip_order_confirm_wrap">
        <div>
          <group class="submit_order_address" v-if="!addressIdPre">
            <cell class="item"  link="/vipOrderConfirm/chooseAddress?type=vip">
              <div slot="title">
                <span style="vertical-align:middle;"  v-show="!addressInfo">添加收货地址</span>
                <div v-show="addressInfo">
                  <p><span class="name">{{addressInfoObj.name}}</span><span class="phone">{{addressInfoObj.phone}}</span></p>
                  <p class="address">{{addressInfoObj.address}}</p>
                </div>
              </div>
            </cell>
          </group>
          <div class="address_info" v-if="addressIdPre">
            <h3>收货人信息</h3>
            <div style="padding: 1rem 0">
              <p><span style="margin-right: 1rem">{{addressInfoPre.name}}</span><span class="phone">{{addressInfoPre.phone}}</span></p>
              <p class="address">{{addressInfoPre.address}}{{addressInfoPre.contentAddress}}</p>
            </div>
          </div>
          <div class="order_info">
            <p class="row">开通服务<span class="right">VIP会员</span></p>
            <p class="row">付款方式<span class="right">按年付费</span></p>
            <p class="row">应付金额<span class="right">{{money}}元/年</span></p>
          </div>
          <div class="write_content">
            <group>
              <cell class="icon_row" link="/vipOrderConfirm/mineInvoice">
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
          <div class="buy" @click="buy">立即支付<span class="price">{{money}}</span>元</div>
        </div>
      </scroll>
    </div>
    <router-view @addressInfo="onAddressInfoChange" @invoiceInfo="onInvoiceInfoChange"></router-view>
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
      addressIdPre: '',
      addressInfoPre: '',
      vipId: this.$route.query.vipId,
      addressInfo: '',
      invoiceInfo: ''
    }
  },
  created() {
    if(this.preId !== ''){
      this.getOrderInfo()
    }
  },
  computed: {
    money : function () {
      let money = this.$route.query.money
      return parseFloat(money).toFixed(2)
    },
    addressInfoObj: function () {
      let addrInfoStr = this.addressInfo.split('___')
      let addrObj = {
        id: addrInfoStr[0],
        name: addrInfoStr[1],
        phone: addrInfoStr[2],
        address: addrInfoStr[3]
      }
      return addrObj
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
    getOrderInfo() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getOrderUserInfo.service?token=' + token + '&orderId=' + _this.preId + '&type=1'
      }).then((res) => {
        if (res.status === 200) {
          _this.result = res.data.data[0].vipOrder.result
          _this.addressIdPre = res.data.data[0].vipOrder.addressId
          _this._initAddress(_this.addressIdPre)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _initAddress (id) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/getAddress.service?token=' + token + '&id=' + id).then((res) => {
        if (res.status === 200) {
          _this.addressInfoPre = res.data.data[0]
        }
      }).catch((error) => {
        console.log(error)
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
    onAddressInfoChange(addressInfo) {
      this.addressInfo = addressInfo
    },
    onInvoiceInfoChange(invoiceInfo){
      this.invoiceInfo = invoiceInfo
    },
    buy() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let openId = sessionStorage.getItem('openId')
      let addressId
      if(this.preId !== ''){
        addressId = this.addressIdPre
      }else{
        addressId = parseInt(this.addressInfoObj.id) > 0 ? parseInt(this.addressInfoObj.id) : 0
      }
      let crtTime = this.getCurrentTime()
      let money = this.money * 100
      if (!addressId) {
        _this.msg('请填写收货地址')
        return false
      } else {
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
                    url: '/api/toAppVipPrice.service?token=' + token + '&pre_id=' + _this.preId
                  }).then((res) => {
                    if (res.status === 200) {
                      let cardNum = res.data.data
                      _this.$router.push({path: `/orderSuccess`, query: {orderId: _this.preId, cardNum:cardNum, createTime: crtTime, totalPrice: _this.$route.query.money}})
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
            addressId: addressId,
            crtTime: crtTime,
            money: money,
            vipId: this.vipId,
            invoiceId: this.invoiceInfoObj.id,
            status: '1',
            codeType: '0'
          }
          this.$axios({
            method: 'post',
            url: '/api/toVipHotel.service?token=' + token,
            data: params,
            headers: {'Content-Type': 'application/json'}
          })
            .then((res) => {
              if (res.status === 200) {
                let preId = res.data.data.package.split('=')[1]
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
                          url: '/api/toAppVipPrice.service?token=' + token + '&pre_id=' + preId
                        }).then((res) => {
                          let cardNum = res.data.data
                          _this.$router.push({path: `/orderSuccess`, query: {orderId: preId, cardNum:cardNum, createTime: crtTime, totalPrice: _this.$route.query.money}})
                        }).catch((error) => {
                          console.log(error)
                        })
                      }
                    }
                  })
                })
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
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .vip_order_confirm{
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .vip_order_confirm_wrap{
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      .address_info{
        background: #fff;
        margin-bottom: 1rem;
        padding: 0 1rem;
        font-size: 1.4rem;
        h3{
          line-height: 4rem;
          border-bottom: 1px dashed #ddd;
        }
        p{
          line-height: 2rem;
        }
      }
      .submit_order_address {
        .weui-cells {
          margin-top: 0;
          &:before{
            display: none !important;
          }
          .item{
            font-size: 1.6rem;
            .name{
              margin-right: 2rem;
            }
          }
        }
      }
      .order_info{
        margin-top: 1rem;
        background: #fff;
        padding: 0 1rem;
        .row{
          line-height: 4.5rem;
          font-size: 1.4rem;
          border-bottom: 1px solid #ddd;
          color: @color-text-g;
          &:last-child{
            border-bottom: 0;
          }
          .right{
            float: right;
            color: #3b3b3b;
          }
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
