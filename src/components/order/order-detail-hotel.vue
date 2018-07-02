<template>
  <div class="order_detail_hotel">
    <header-back :title="title"></header-back>
    <scroll class="order_detail_hotel_wrap">
      <div style="padding-bottom: 1rem">
        <div class="goods_info_wrap">
          <img class="good_img" v-lazy="getFm(hotel.img)" />
          <div class="info">
            <p class="name">{{hotel.name}}</p>
            <p class="name">{{room.name}}</p>
            <p class="price">￥{{floatPrice(room.price)}}</p>
          </div>
        </div>
        <div class="order_info_wrap">
          <p class="row">订单编号：{{order.pre_id}}</p>
          <p class="row">下单时间：{{order.crtTime}}</p>
          <p class="row">支付方式：微信支付</p>
          <p class="row">商品总额<span class="right"><span class="price">￥{{normal(order.money)}}</span></span></p>
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
      hotel: {},
      room: {},
      order: {}
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
    getFm(str){
      return str.split(',')[0]
    },
    _getDetail() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getOrderUserInfo.service?token=' + token + '&orderId=' + _this.$route.query.id + '&type=0'
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data)
          _this.hotel = res.data.data[0].hotel
          _this.order = res.data.data[0].hotelOrder
          _this.room = res.data.data[0].room
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
.order_detail_hotel{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 1000;
  .order_detail_hotel_wrap{
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
