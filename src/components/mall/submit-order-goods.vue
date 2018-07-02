<template>
  <div>
    <div class="submit_order_goods">
      <header-back :title="title"></header-back>
      <div class="submit_order_goods_wrap">
        <group class="submit_order_address" v-if="!addressIdPre">
          <cell class="item"  link="/submitOrderGoods/chooseAddress?type=goods">
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
        <div class="submit_order_goods_info">
          <div class="item">
            <div class="top">
              <img class="good_img" :src="goods.img" />
              <div class="info">
                <p class="name">{{goods.name}}</p>
                <p class="price" v-if="goodsType === ''">￥{{floatPrice(goods.price)}}</p>
                <p class="price" v-if="goodsType === 'card'">{{goods.price}}积分</p>
              </div>
              <span class="amount" v-if="goodsType === ''">×{{amount}}</span>
            </div>
            <div class="bottom">
              <p  v-if="goodsType === ''">小计：<span class="price">￥{{money}}</span></p>
              <p  v-if="goodsType === 'card'">小计：<span class="price">{{goods.price}}积分</span></p>
            </div>
          </div>
        </div>
        <div class="write_content">
          <group  v-if="goodsType === ''">
            <cell class="icon_row" :link="'/submitOrderGoods/mineTicket?type=goods&money='+money">
                <span slot="title">
                  <img class="icon" src="../../common/images/icons/icon-ticket.png"/>
                  <span style="vertical-align:middle;">领券</span>
                </span>
              <span v-if="ticketInfoObj.id!=''">-￥{{ticketInfoObj.xianjin}}.00</span>
            </cell>
          </group>
          <group>
            <cell class="icon_row" link="/submitOrderGoods/mineInvoice?type=goods">
                <span slot="title">
                  <img class="icon" src="../../common/images/icons/icon-invoice.png"/>
                  <span style="vertical-align:middle;">开具发票</span>
                </span>
                <span v-html="invoiceInfoObj.name"></span>
            </cell>
          </group>
          <group v-if="goodsType === 'card'">
            <p class="pay_way">积分兑换</p>
            <cell class="icon_row">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine6.png"/>
                <span style="vertical-align:middle;">积分</span>
              </span>
              <span>共{{user.card}}积分 ， 可用{{user.card}}积分</span>
            </cell>
          </group>
          <group v-if="goodsType === ''">
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
        <div class="submit_order_handle">
          <div class="order" v-if="goodsType === ''">应付总额：<span class="price">￥{{totalPrice}}</span></div>
          <div class="order" v-if="goodsType === 'card'">应付总额：<span class="price">{{goods.price}}积分</span></div>
          <div class="buy" @click="buy">提交订单</div>
        </div>
      </div>
    </div>
    <router-view @addressInfo="onAddressInfoChange" @invoiceInfo="onInvoiceInfoChange" @ticketInfo="onTicketInfoChange"></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, CellBox, XInput, Datetime, XAddress, PopupPicker, Picker, ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Group, Cell, CellBox, XInput, Datetime, PopupPicker, Picker},
  data () {
    return {
      title: '订单结算',
      preId: this.$route.query.preId || '',
      result: '',
      addressIdPre: '',
      addressInfoPre: '',
      goodsType: this.$route.query.goodsType || '',
      goods: {},
      user: {},
      addressInfo: '',
      invoiceInfo: '',
      ticketInfo: '',
      totalPrice: 0.00,
      total: 0.00,
      goodsId: this.$route.query.goodsId,
      amount: this.$route.query.amount
    }
  },
  computed: {
    money: function () {
      return (parseFloat(this.goods.price) * this.amount).toFixed(2)
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
    this._getDetail()
    this._getUserInfo()
    if(this.preId !== ''){
      this.getOrderInfo()
    }
  },
  methods: {
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
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
    onAddressInfoChange(addressInfo) {
      this.addressInfo = addressInfo
    },
    onInvoiceInfoChange(invoiceInfo){
      this.invoiceInfo = invoiceInfo
    },
    getOrderInfo() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getOrderUserInfo.service?token=' + token + '&orderId=' + _this.preId + '&type=2'
      }).then((res) => {
        if (res.status === 200) {
          _this.result = res.data.data[0].commodityOrder.result
          _this.addressIdPre = res.data.data[0].commodityOrder.addressId
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
    _getUserInfo() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('openId')
      this.$axios({
        method: 'get',
        url: '/api/findByUser.service?token=' + token + '&user_id=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.user = res.data.data[0]
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _getDetail () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getShop.service?token=' + token + '&id=' + _this.goodsId
      }).then((res) => {
        if (res.status === 200) {
          _this.goods = res.data.data[0]
          _this.totalPrice = (parseFloat(_this.goods.price) * _this.amount).toFixed(2)
          _this.total = (parseFloat(_this.goods.price) * _this.amount).toFixed(2)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    buy() {
      let _this = this
      let addressId
      if(this.preId !== ''){
        addressId = this.addressIdPre
      }else{
        addressId = parseInt(this.addressInfoObj.id) > 0 ? parseInt(this.addressInfoObj.id) : 0
      }
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let openId = sessionStorage.getItem('openId')
      let crtTime = this.getCurrentTime()
      let money = (this.totalPrice) * 100
      let jifen = parseInt(this.goods.price)
      let cardjifen = parseInt(this.user.card)
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
                    url: '/api/toAppCommodityPrice.service?token=' + token + '&pre_id=' + _this.preId
                  }).then((res) => {
                    if (res.status === 200) {
                      let cardNum = res.data.data
                      _this.$router.push({path: `/orderSuccess`, query: {orderId: _this.preId, createTime: crtTime,cardNum:cardNum, totalPrice: _this.totalPrice}})
                    }
                  }).catch((error) => {
                    console.log(error)
                  })
                }
              }
            })
          })
        }else{
          if(this.goodsType == ''){
            let params = {
              userId: userId,
              addressId: addressId,
              openId: openId,
              commodityId: this.goodsId,
              crtTime: crtTime,
              money: money,
              couponId:  this.ticketInfoObj.id,
              invoiceId: this.invoiceInfoObj.id,
              num: this.amount,
              status: '1',
              codeType: '0'
            }
            this.$axios({
              method: 'post',
              url: '/api/toCommodityHotel.service?token=' + token,
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
                              url: '/api/toAppCommodityPrice.service?token=' + token + '&pre_id=' + preId
                            }).then((res) => {
                              if (res.status === 200) {
                                let cardNum = res.data.data
                                _this.$router.push({path: `/orderSuccess`, query: {orderId: preId, cardNum:cardNum, createTime: crtTime, totalPrice: _this.totalPrice}})
                              }
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
          }else if(this.goodsType == 'card'){
            if(cardjifen < jifen){
              _this.msg('可用积分不足')
              return false
            }
            let params = {
              userId: userId,
              addressId: addressId,
              openId: openId,
              commodityId: this.goodsId,
              crtTime: crtTime,
              money: jifen,
              couponId:  this.ticketInfoObj.id,
              invoiceId: this.invoiceInfoObj.id,
              num: this.amount,
              status: '1',
              codeType: '1'
            }
            this.$axios({
              method: 'post',
              url: '/api/toCommodityCard.service?token=' + token,
              data: params,
              headers: {'Content-Type': 'application/json'}
            })
              .then((res) => {
                if (res.status === 200) {
                  let preId = res.data.data
                  _this.$router.push({path: `/orderSuccess`, query: {goodsType: _this.goodsType,orderId: preId, createTime: crtTime, totalPrice: _this.goods.price}})
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/css/variable.less";
  .submit_order_goods{
    position: fixed;
    top:0;
    width: 100%;
    bottom:0;
    background:#eee;
    overflow: hidden;
    z-index: 100;
    .submit_order_goods_wrap{
      position: fixed;
      top:4.5rem;
      width: 100%;
      bottom:0;
      overflow-x: hidden;
      overflow-y: auto;
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
      .submit_order_goods_info{
        margin-top: 1rem;
        .item {
          background: #fff;
          padding: 1rem 1rem 0;
          margin-bottom: 1rem;
          .top{
            padding-left: 9rem;
            padding-bottom: 1rem;
            min-height: 8rem;
            position: relative;
            border-bottom: 1px solid #eee;
            .good_img{
              position: absolute;
              width: 8rem;
              height: 8rem;
              left: 0;
              top: 0;
            }
            .info{
              padding: 1rem 0 0 0;
              .name{
                font-size: 1.5rem;
                line-height: 2rem;
              }
              .price{
                line-height: 2rem;
                font-size: 1.4rem;
                color: #ef605a;
              }
            }
            .amount{
              position: absolute;
              bottom: 1rem;
              right: 1rem;
              font-size: 1.4rem;
            }
          }
          .bottom{
            line-height: 3rem;
            text-align: right;
            font-size: 1.4rem;
            .price{
              font-size: 1.6rem;
              color: #ef605a;
            }
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
      .submit_order_handle{
        display: flex;
        position: fixed;
        bottom: 0;
        height: 5rem;
        line-height: 5rem;
        width: 100%;
        font-size: 1.5rem;
        text-align: center;
        border-top: 1px solid #ddd;
        color: #fff;
        background: #fff;
        .order{
          flex: 1;
          color: #666;
          .price{
            color: #ef605a;
            font-size: 1.8rem;
          }
        }
        .buy{
          display: inline-block;
          width: 13rem;
          background: @color-theme;
        }
      }
    }
  }
</style>
