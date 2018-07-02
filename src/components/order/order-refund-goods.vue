<template>
  <div class="order_refund_goods">
    <header-back :title="title"></header-back>
    <div  v-if="order.status == 2">
      <scroll class="order_goods_wrap">
        <div style="padding-bottom: 1rem">
          <div class="order_info_wrap">
            <p class="row">订单编号：{{order.pre_id}}</p>
          </div>
          <div class="goods_info_wrap" v-for="(item, index) in goods" :key="index">
            <img class="good_img" v-lazy="item.img" />
            <div class="info">
              <p class="name">{{item.name}}</p>
              <p class="price" v-if="goodsType == ''">￥{{floatPrice(item.price)}}</p>
              <p class="price" v-if="goodsType == 'card'">{{item.price}}积分</p>
            </div>
          </div>
          <div class="add_comment_wrap">
            <group>
              <p class="problem">问题描述</p>
              <x-textarea v-model="content"  class="textarea" :max="200" placeholder="请在此处描述问题"></x-textarea>
            </group>
            <group>
              <div class="upImg">
                <div class="upImgBtn"  @click="uploadInvoice">
                  <img src="../../common/images/upload-default.png"/>
                </div>
                <div class="upImgList" id="upImgList">
                  <div class="item" v-for="(item, index) in upImgList" :key="index">
                    <img :src="item"/>
                  </div>
                </div>
              </div>
            </group>
          </div>
        </div>
      </scroll>
      <div class="add_comment_handle">
        <div class="buy" @click="save">立即发布</div>
      </div>
    </div>
    <div class="order_refund_goods_wrap" v-if="order.status != 2">
      <div class="refund_submit" v-if="order.status == 6">
        <img src="../../common/images/refund-success.png" />
        <p>退款申请已提交</p>
        <p class="desc">请您耐心等候我们的客服与您取得联系</p>
        <x-button class="btn" type="primary" @click.native="goBack()">返回订单中心</x-button>
      </div>
      <div class="refund_submit" v-if="order.status == 7">
        <img src="../../common/images/refund-success.png" />
        <p>退款成功！</p>
        <p class="desc">请到您的微信钱包查收退款！</p>
        <x-button class="btn" type="primary" @click.native="goBack()">返回订单中心</x-button>
      </div>
      <div class="refund_submit" v-if="order.status == 8">
        <img src="../../common/images/refund-fail.png" />
        <p>退款失败！</p>
        <x-button class="btn" type="primary" @click.native="goBack()">返回订单中心</x-button>
        <x-button class="btn" type="primary">联系客服</x-button>
      </div>
    </div>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
import {Group, Cell, XButton, XTextarea} from 'vux'
export default {
  components: {HeaderBack, Scroll, Group, Cell, XButton, XTextarea},
  data () {
    return {
      title: '申请退款',
      hasAddress: false,
      preId: this.$route.query.id,
      goodsType: this.$route.query.goodsType || '',
      upImgList: [],
      address: {},
      goods: [],
      order: {},
      vip: {},
      coupon: {}
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    uploadImg(img) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/appfileUpload.service?token=' + token + '&mediaId=' + img).then((res) => {
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
        url: '/api/getOrderUserInfo.service?token=' + token + '&orderId=' + _this.$route.query.id + '&type=' + _this.$route.query.type
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data)
          if(_this.$route.query.type === '1'){
            _this.goods.push({
              good:res.data.data[0].vip
            })
            _this.order = res.data.data[0].vipOrder
          }else{
            let goods = res.data.data
            goods.forEach((item, index) => {
              _this.goods.push(item.commodity)
            })
            _this.order = res.data.data[0].commodityOrder
          }
          _this.address = res.data.data[0].address
          _this.coupon = res.data.data[0].coupon
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    save(){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/updateCommodityOrderStatus.service?token=' + token + '&pre_id=' + _this.preId + '&status=6'
      }).then((res) => {
        if (res.status === 200) {
          _this._getDetail()
        }
      }).catch((error) => {
        console.log(error)
      })

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "../../common/css/variable.less";
.order_refund_goods{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 1000;
  .order_goods_wrap{
    position: fixed;
    top:4.5rem;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    .goods_info_wrap{
      background: #fff;
      padding: 1rem 1rem 1rem 10rem;
      height: 7rem;
      position: relative;
      border-top: 1px dashed #ddd;
      .good_img{
        position: absolute;
        width: 8rem;
        height: 7rem;
        left: 1rem;
        top: 1rem;
      }
      .info{
        padding: 1rem 0 0 0;
        .name{
          font-size: 1.6rem;
          line-height: 2rem;
          margin-bottom: 0.5rem;
        }
        .price{
          line-height: 2rem;
          font-size: 1.4rem;
          color: #ef605a;
        }
      }
    }
    .order_info_wrap{
      margin-top: 1rem;
      background: #fff;
      padding: 0 1rem;
      .row{
        line-height: 2.5rem;
        padding: 1rem;
        font-size: 1.4rem;
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

    }
    .add_comment_wrap{
      overflow: hidden;
      padding-bottom: 4rem;
      .problem{
        line-height: 4rem;
        padding-left: 1rem;
        background: #fff;
        font-size: 1.4rem;
      }
      .weui-cells{
        margin-top: 0 !important;
        padding-top: 1rem !important;
        background: #eee !important;
      }
      .weui-cells:before,.weui-cells:after{
        display: none !important;
      }
      .weui-cell{
        background: #fff !important;
      }
      .handle{
        padding: 1rem;
        text-align: center;
        .order_button{
          margin-right: 2rem;
        }
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
  }
  .add_comment_handle{
    display: flex;
    position: fixed;
    bottom: 0;
    height: 5rem;
    line-height: 5rem;
    width: 100%;
    font-size: 1.5rem;
    text-align: center;
    color: #fff;
    align-items: center;
    .buy{
      flex: 1;
      background: #3366cc;
    }
  }
  .order_refund_goods_wrap{
    position: fixed;
    top:4.5rem;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    background: #fff;
    .refund_submit{
      text-align: center;
      margin-top: 20%;
      padding: 0 8%;
      img{
        width: 6rem;
        margin: 1rem auto;
        display: inline-block;
      }
      p{
        line-height: 3rem;
        color: @color-theme;
        font-size: 1.8rem;
        &.desc{
          color: #666;
          font-size: 1.2rem;
        }
      }
      .btn{
        margin-top: 2rem;
        font-size: 1.4rem;
        .custom-primary-blue;
      }
    }
  }
}
</style>
