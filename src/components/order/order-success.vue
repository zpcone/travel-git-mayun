<template>
  <div class="order_success">
    <header-back :title="title"></header-back>
      <div class="order_success_wrap">
        <div class="order_info_wrap">
          <p class="row">订单编号：{{orderId}}</p>
          <p class="row">下单时间：{{createTime}}</p>
          <p class="row">支付方式：微信支付</p>
          <p class="row" v-if="goodsType == ''">订单总额<span class="right"><span class="price">￥{{totalPrice}}</span></span></p>
          <p class="row" v-if="goodsType == 'card'">本次消费<span class="right"><span class="price">{{totalPrice}}积分</span></span></p>
          <p class="row" v-if="goodsType == '' && cardNum != ''">本次消费奖励<span class="right"><span class="price">{{cardNum}}积分</span></span></p>
        </div>
        <div class="handle">
          <x-button type="default" plain  mini  class="order_button" link="/orderAll">查看订单</x-button>
          <x-button type="primary" plain  mini  link="/home">回到首页</x-button>
        </div>
      </div>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import { Flexbox, FlexboxItem, XButton } from 'vux'
export default {
  components: {HeaderBack, Flexbox, FlexboxItem, XButton},
  data () {
    return {
      title: '支付成功',
      orderId: this.$route.query.orderId,
      goodsType: this.$route.query.goodsType || '',
      cardNum: this.$route.query.cardNum || '',
      createTime: this.$route.query.createTime,
      totalPrice: this.$route.query.totalPrice
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.order_success{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#fff;
  overflow: hidden;
  z-index: 1000000;
  .order_success_wrap{
    padding-top: 4.5rem;
    overflow: hidden;
    .order_info_wrap{
      margin-top: 1rem;
      background: #fff;
      padding: 0 1rem;
      border-bottom: 1px solid #ddd;
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
            &.total{
              font-size: 1.8rem;
            }
          }
        }
      }

    }
    .handle{
      padding: 1rem;
      text-align: center;
      .order_button{
        margin-right: 2rem;
      }
    }
  }
}
</style>
