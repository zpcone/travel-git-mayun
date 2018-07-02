<template>
  <div class="order_detail_goods">
    <header-back :title="title"></header-back>
    <scroll class="order_detail_goods_wrap">
      <div style="padding-bottom: 1rem">
        <div class="address_info_wrap" v-if="hasAddress">
          <p><span class="name">{{address.name}}</span><span class="phone">{{address.phone}}</span></p>
          <p class="address">地址：{{address.address}}{{address.contentAddress}}</p>
        </div>
        <div class="goods_info_wrap" v-for="(item, index) in goods" :key="index">
          <img class="good_img" v-lazy="item.good.img" />
          <div class="info">
            <p class="name">{{item.good.name}}</p>
            <p class="price" v-if="goodsType == ''">￥{{floatPrice(item.good.price)}}</p>
            <p class="price" v-if="goodsType == 'card'">{{item.good.price}}积分</p>
          </div>
          <span class="amount" v-if="type == '2'">×{{item.order.num}}</span>
        </div>
        <div class="order_info_wrap">
          <p class="row">订单编号：{{order.pre_id}}</p>
          <p class="row">下单时间：{{order.crtTime}}</p>
          <p class="row" v-if="coupon">优惠金额<span class="right"><span class="price">-{{coupon.jian === ''? coupon.xianjin : coupon.jian}}元</span></span></p>
          <p class="row">支付方式：微信支付</p>
          <p class="row" v-if="goodsType == ''">支付总额<span class="right"><span class="price">{{normal(order.money)}}元</span></span></p>
          <p class="row" v-if="goodsType == 'card'">支付总额<span class="right"><span class="price">{{goods.price}}积分</span></span></p>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
export default {
  components: {HeaderBack, Scroll},
  data () {
    return {
      title: '订单详情',
      hasAddress: false,
      type: this.$route.query.type || '',
      goodsType: this.$route.query.goodsType || '',
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
        url: '/api/getOrderUserInfo.service?token=' + token + '&orderId=' + _this.$route.query.id + '&type=' + _this.type
      }).then((res) => {
        if (res.status === 200) {
          let rest = []
          let order = {}
          if(_this.type == 1){
            rest.push({
              good:res.data.data[0].vip
            })
            order = res.data.data[0].vipOrder
          }else{
            let goods = res.data.data
            goods.forEach((item, index) => {
              rest.push({
                good:item.commodity,
                order:item.commodityOrder
              })
            })
            order = res.data.data[0].commodityOrder
          }
          _this.goods = rest
          _this.order = order
          console.log(_this.goods)
          _this.address = res.data.data[0].address
          _this.coupon = res.data.data[0].coupon
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
.order_detail_goods{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 1000;
  .order_detail_goods_wrap{
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
      .amount{
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 1.4rem;
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
  }
}
</style>
