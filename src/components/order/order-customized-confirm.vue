<template>
  <div class="order_detail_customized">
    <header-back :title="title"></header-back>
    <scroll class="order_detail_customized_wrap">
      <div style="padding-bottom: 7rem">
        <div class="order_price">需支付：<span class="price">{{detail.qian}}元</span></div>
        <div class="order_info_wrap">
          <p class="title">客户信息</p>
          <p class="row">客户姓名：{{detail.customer}}</p>
          <p class="row">联系电话：{{detail.phone}}</p>
          <p class="row">联系邮箱：{{detail.email}}</p>
          <p class="row">同行人数：{{detail.num}}</p>
          <p class="row">人均消费：{{detail.price}}元/人</p>
          <p class="row">往返时间：{{detail.talkTime}}  —  {{detail.outTime}}</p>
          <p class="row">定制内容：{{switchContent(detail.content)}}</p>
          <p class="row">酒店星级选择：{{switchStar(detail.hotelStar)}}</p>
          <p class="row">出发地：{{detail.province}}</p>
          <p class="row">目的地：{{detail.city}}</p>
        </div>
        <div class="order_info_wrap" v-if="detail.otherContent != ''">
          <p class="title">您的其他需求</p>
          <p class="area">{{detail.otherContent}}</p>
        </div>
        <div class="order_info_wrap">
          <p class="title">上传附件</p>
          <div class="upImg">
            <div class="upImgBtn" @click="uploadInvoice">
              <img src="../../common/images/upload-default.png"/>
            </div>
            <div class="upImgList" id="upImgList">
              <div class="item" v-for="(item, index) in upImgList" :key="index">
                <img :src="item"/>
              </div>
            </div>
          </div>
        </div>
        <div class="write_content">
          <group>
            <cell class="icon_row" link="/orderCustomizedConfirm/mineInvoice?type=customized">
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
      <div class="confirm_handle">
        <div class="buy" @click="buy">立即支付<span class="price">{{detail.qian}}</span>元</div>
      </div>
    </scroll>
    <router-view @addressInfo="onAddressInfoChange" @invoiceInfo="onInvoiceInfoChange"></router-view>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
import {Group, Cell, XButton} from 'vux'
export default {
  components: {HeaderBack, Scroll, Group, Cell, XButton},
  data () {
    return {
      title: '订单详情',
      tourismId: this.$route.query.id,
      invoiceInfo: '',
      upImgList: [],
      imgs: '',
      detail: {}
    }
  },
  computed: {
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
  },
  methods: {
    switchContent(str) {
      let arr = str.split(',')
      let arrS = []
      arr.forEach(function(item, index){
        if(item == '0'){
          arrS.push('门票')
        }else if(item == '1'){
          arrS.push('用车')
        }else if(item == '2'){
          arrS.push('酒店')
        }else if(item == '3'){
          arrS.push('路线规划')
        }else if(item == '4'){
          arrS.push('导游')
        }
      })
      return arrS.join(', ')
    },
    switchStar(str) {
      let n = ''
      switch(str){
        case '0':
          n = '三星级'
          break
        case '1':
          n = '四星级'
          break;
        case '2':
          n = '五星级'
          break;
        default:
          n = '五星级'
      }
      return n
    },
    onInvoiceInfoChange(invoiceInfo){
      this.invoiceInfo = invoiceInfo
    },
    uploadImg(img) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/addTourismFile.service?token=' + token + '&filePath=' + img + '&fileName=' + Math.random() + '&time=' + new Date()).then((res) => {
        if (res.data.status === 200) {
          _this.upImgList.push(res.data.data)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    uploadInvoice(){
      let _this = this
      wx.ready(function() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            wx.uploadImage({
              localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                _this.uploadImg(serverId)
              }
            })
          }
        })
      })
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    normal(money){
      return ((parseFloat(money) / 100).toFixed(2))
    },
    _getDetail() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/findByMyTourismFilePrice.service?token=' + token + '&tourismId=' + _this.tourismId
      }).then((res) => {
        if (res.status === 200) {
          _this.detail = res.data.data
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
    buy() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let openId = sessionStorage.getItem('openId')
      let money = parseFloat(this.detail.qian).toFixed(2) * 100
      let tourismId = this.tourismId
      let crtTime = this.getCurrentTime()
      this.$axios({
        method: 'get',
        url: '/api/toTourism.service?token=' + token + '&money=' + money + '&openId=' + openId + '&tourismId=' + tourismId
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
                      url: '/api/updateTourism.service?token=' + token + '&id=' + tourismId + '&status=3' + '&invoiceId=' + _this.invoiceInfoObj.id
                    }).then((res) => {
                      _this.$router.push({path: `/orderSuccess`, query: {orderId: preId, createTime: crtTime, totalPrice: _this.detail.qian}})
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
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../common/css/variable.less";
.order_detail_customized{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 1000;
  .order_detail_customized_wrap{
    position: fixed;
    top:4.5rem;
    width: 100%;
    bottom: 0;
    overflow: hidden;
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
    .order_info_wrap{
      margin-top: 1rem;
      background: #fff;
      padding: 0 1rem;
      font-size: 1.4rem;
      .row{
        line-height: 2.5rem;
        padding: 1rem;
        border-bottom: 1px solid #ddd;
        &:last-child{
          border-bottom: 0;
        }
        .right{
          float: right;
          .price{
            color: #ef605a;
            font-size: 1.8rem;
          }
        }
      }
      .title{
        height: 4rem;
        line-height: 4rem;
        padding-left: 10px;
        border-bottom: 1px dotted #ddd;
      }
      .area{
        padding: 1rem;
        line-height: 2rem;
      }
      .upImg{
        background: #fff;
        padding: 1rem;
        .upImgBtn{
          position: relative;
          img{
            width: 8rem;
            height: 8rem;
            border-radius: 4px;
          }
          .uploadImg{
            width: 8rem;
            height: 8rem;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
          }
        }
        .upImgList{
          .item{
            display: inline-block;
            margin: 0 1rem 1rem 0;
            img{
              width: 8rem;
              height: 8rem;
              border-radius: 4px;
            }
          }
        }
      }
    }
    .write_content {
      .weui-cells {
        margin-top: 1rem;
      }
      .pay_way {
        font-size: @font-size-medium;
        padding: 1rem 15px;
        line-height: 2rem;
      }
      .icon_row {
        font-size: @font-size-medium;
        .icon {
          width: 1.8rem;
          vertical-align: middle;
          margin-right: 0.5rem;
        }
        .vux-label {
          span {
            font-size: @font-size-medium;
          }
        }
        .right_icon {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid @color-theme;
          display: inline-block;
          position: relative;
          &:after {
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
  .confirm_handle{
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
