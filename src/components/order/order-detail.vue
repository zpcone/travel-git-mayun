<template>
  <div class="order_serve_pay">
    <header-back :title="title"></header-back>
    <scroll class="order_serve_pay_wrap">
      <div style="padding-bottom: 1rem">
        <div class="address_info_wrap" v-if="hasAddress">
          <p><span class="name">{{address.name}}</span><span class="phone">{{address.phone}}</span></p>
          <p class="address">地址：{{address.province}}{{address.city}}{{address.area}}{{address.detail}}</p>
        </div>
        <div class="goods_info_wrap">
          <img class="good_img" :src="serve.headImage" />
          <div class="info">
            <p class="name">{{serve.name}}</p>
            <p class="price">￥{{serve.price}}</p>
          </div>
        </div>
        <div class="serve_info_wrap">
          <p class="row">体检人姓名<span class="right">{{order.name}}</span></p>
          <p class="row">预约时间<span class="right">{{order.time}}</span></p>
          <p class="row">预留手机号<span class="right">{{order.phone}}</span></p>
          <p class="row">保健中心<span class="right">{{center.name}}</span></p>
        </div>
        <div class="order_info_wrap">
          <p class="row">订单编号：{{order.orderId}}</p>
          <p class="row">下单时间：{{order.createTime}}</p>
          <p class="row">支付方式：微信支付</p>
          <p class="row">商品总额<span class="right"><span class="price">￥{{order.price}}</span></span></p>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
export default {
  components: {HeaderBack, Scroll},
  data () {
    return {
      title: '订单详情',
      hasAddress: false,
      address: {},
      serve: {},
      order: {},
      center: {}
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      let _this = this
      this.$axios.get('/v1/order/serve/' + this.$route.query.id).then((res) => {
        if (res.data.errorCode === '200') {
          if (res.data.data.addr) {
            _this.hasAddress = true
            _this.address = res.data.data.addr
          }
          _this.serve = res.data.data.serve
          _this.order = res.data.data.order
          _this.center = res.data.data.center
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
.order_serve_pay{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 100;
  .order_serve_pay_wrap{
    position: fixed;
    top:4.5rem;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    .address_info_wrap {
      background: #fff;
      font-size: 1.6rem;
      padding: 1rem;
      p{
        line-height: 2.5rem;
        &.address{
          font-size: 1.4rem;
          color: #666;
        }
        .name{
          margin-right: 2rem;
        }
      }
    }
    .goods_info_wrap{
      background: #fff;
      padding: 1rem 1rem 1rem 10rem;
      height: 7rem;
      position: relative;
      margin-top: 1rem;
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
    .serve_info_wrap{
      margin-top: 1rem;
      background: #fff;
      padding: 0 1rem;
      .row{
        line-height: 4.5rem;
        font-size: 1.4rem;
        border-bottom: 1px solid #ddd;
        &:last-child{
          border-bottom: 0;
        }
        .right{
          float: right;
        }
      }

    }
    .order_info_wrap{
      margin-top: 1rem;
      background: #fff;
      padding: 0 1rem;
      .row{
        line-height: 4.5rem;
        height: 4.5rem;
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
  }
}
</style>
