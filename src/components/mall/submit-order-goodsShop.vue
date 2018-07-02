<template>
  <div>
    <div class="submit_order_goodsShop">
      <header-back :title="title"></header-back>
      <scroll class="submit_order_goods_wrap">
        <div style="padding-bottom: 4rem">
          <group class="submit_order_address" v-if="!addressIdPre">
            <cell class="item"  link="/submitOrderGoodsShop/chooseAddress?type=goodsShop">
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
            <div class="item" v-for="item in goodsList" :key="item.id">
              <div class="top">
                <img class="good_img" :src="item.img" />
                <div class="info">
                  <p class="name">{{item.name}}</p>
                  <p class="price">￥{{floatPrice(item.price)}}</p>
                </div>
                <span class="amount">×{{item.num}}</span>
              </div>
              <div class="bottom">
                <p>小计：<span class="price">￥{{getMoney(item)}}</span></p>
              </div>
            </div>
          </div>
          <div class="write_content">
            <group>
              <cell class="icon_row" :link="'/submitOrderGoodsShop/mineTicket?type=goodsShop&money='+total">
                <span slot="title">
                  <img class="icon" src="../../common/images/icons/icon-ticket.png"/>
                  <span style="vertical-align:middle;">领券</span>
                </span>
                <span v-if="ticketInfoObj.id!=''">-￥{{ticketInfoObj.xianjin}}.00</span>
              </cell>
            </group>
            <group>
              <cell class="icon_row" link="/submitOrderGoodsShop/mineInvoice?type=goodsShop">
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
      </scroll>
      <div class="submit_order_handle">
        <div class="order">应付总额：<span class="price">￥{{totalPrice}}</span></div>
        <div class="buy" @click="buy">提交订单</div>
      </div>
    </div>
    <router-view @addressInfo="onAddressInfoChange" @invoiceInfo="onInvoiceInfoChange" @ticketInfo="onTicketInfoChange"></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, CellBox, XInput, Datetime, XAddress, PopupPicker, Picker, ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, Cell, CellBox, XInput, Datetime, PopupPicker, Picker},
  data () {
    return {
      title: '订单结算',
      preId: this.$route.query.preId || '',
      result: '',
      addressIdPre: '',
      addressInfoPre: '',
      goodsList: [],
      addressInfo: '',
      invoiceInfo: '',
      ticketInfo: '',
      goodsArr: this.$route.query.goods,
      total: this.$route.query.total,
      totalPrice: this.$route.query.total
    }
  },
  computed: {
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
    this._getGoods()
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
    getMoney(item) {
      return (parseFloat(item.price) * item.num).toFixed(2)
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
    onTicketInfoChange(ticketInfo) {
      let total = this.total
      this.ticketInfo = ticketInfo
      let xianjin = this.ticketInfoObj.xianjin
      this.totalPrice = (total - xianjin).toFixed(2) > 0 ? (total - xianjin).toFixed(2) : 0
    },
    onInvoiceInfoChange(invoiceInfo){
      this.invoiceInfo = invoiceInfo
    },
    _getGoods () {
      let goodsArr = JSON.parse(this.goodsArr)
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'post',
        url: '/api/getShops.service?token=' + token,
        data: goodsArr,
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.status === 200) {
          _this.goodsList = res.data.data
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
      let couponId = this.ticketInfoObj.id
      let invoiceId = this.invoiceInfoObj.id
      let crtTime = this.getCurrentTime()
      let money = Math.round(parseFloat(this.totalPrice) * 100)
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
          let params = []
          for(let i = 0; i < this.goodsList.length; i++){
            params.push({
              userId: userId,
              addressId: addressId,
              openId: openId,
              commodityId: this.goodsList[i].id,
              num: this.goodsList[i].num,
              crtTime: crtTime,
              money: money,
              couponId:  couponId,
              invoiceId: invoiceId,
              status: '1',
              codeType: '0'
            })
          }
          this.$axios({
            method: 'post',
            url: '/api/toCommodityCar.service?token=' + token,
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
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/css/variable.less";
  .submit_order_goodsShop{
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
      bottom:5rem;
      overflow: hidden;
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
</style>
