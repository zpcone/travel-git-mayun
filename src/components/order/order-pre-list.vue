<template>
  <div class="order_pre_list">
    <template  v-for="item in orderList">
      <div class="item" v-if="item.type === '2'" :key="item.crtTime" @click="goHotelOrder(item.result[0].reserviId, item.result[0].name, item.result[0].pre_id)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content">
          <img class="img" v-lazy="getFm(item.result[0].img)"/>
          <p class="name">{{item.result[0].name}}</p>
          <p class="room">{{item.result[0].roomType}}</p>
          <p class="money">￥{{normal(item.result[0].money)}}</p>
        </div>
        <div class="handle">
          <x-button mini class="btn" @click.native.stop.prevent="cancelHotel(item.result[0].pre_id)">取消订单</x-button>
          <x-button mini class="btn">去付款</x-button>
        </div>
      </div>
      <div class="item" v-else-if="item.type === '0'" :key="item.crtTime" @click="goGoodsOrder(item.result)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content"  v-for="good in item.result" :key="good.commodityId">
          <img v-lazy="good.img"/>
          <p class="name">{{good.name}}</p>
          <p class="money">￥{{floatPrice(good.price)}}</p>
        </div>
        <div class="handle">
          <x-button mini class="btn" @click.native.stop.prevent="cancelGoods(item.result[0].pre_id)">取消订单</x-button>
          <x-button mini class="btn">去付款</x-button>
        </div>
      </div>
      <div class="item" v-else-if="item.type === '1'" :key="item.crtTime" @click="goVipOrder(item.result[0].price, item.result[0].vipId, item.result[0].pre_id)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content">
          <img v-lazy="item.result[0].img"/>
          <p class="name">{{item.result[0].name}}</p>
          <p class="money">￥{{floatPrice(item.result[0].price)}}</p>
        </div>
        <div class="handle">
          <x-button mini plain class="btn" @click.native.stop.prevent="cancelVip(item.result[0].pre_id)">取消订单</x-button>
          <x-button mini plain class="btn">去付款</x-button>
        </div>
      </div>
      <div class="item" v-else-if="item.type === '3'" :key="item.crtTime">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content">
          <img src="../../common/images/customized-order.jpg"/>
          <p class="name">定制游</p>
          <p class="money">￥{{floatPrice(item.result[0].qian)}}</p>
        </div>
        <div class="handle" v-if="item.result[0].status == '0'">
          <x-button mini plain class="btn default" @click.native.stop.prevent="goCustomizedOrder(item.result[0].id)">待处理</x-button>
        </div>
        <div class="handle" v-if="item.result[0].status == '2'">
          <x-button mini plain class="btn" @click.native.stop.prevent="cancelCustomized(item.result[0].id)">取消订单</x-button>
          <x-button mini plain class="btn" @click.native.stop.prevent="goCustomizedConfirm(item.result[0].id)">去付款</x-button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import {Tab, TabItem, Rater, Group, Cell, XButton, TransferDomDirective as TransferDom, Confirm} from 'vux'
export default {
  components: {Confirm, Tab, TabItem, Rater, Group, Cell, XButton},
  props: {
    orderList: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
    }
  },
  directives: {
    TransferDom
  },
  methods: {
    normal(money){
      return ((parseFloat(money) / 100).toFixed(2))
    },
    getFm(str){
      return str.split(',')[0]
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    cancelHotel(id){
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确认取消订单吗？',
        onConfirm () {
          let token = sessionStorage.getItem('token')
          _this.$axios({
            method: 'get',
            url: '/api/updateHotelOrderStatus.service?token=' + token + '&pre_id=' + id + '&status=0'
          }).then((res) => {
            if (res.status === 200) {
              _this._getOrderList()
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    cancelGoods(id){
      let _this = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确认取消订单吗？',
        onConfirm() {
          let token = sessionStorage.getItem('token')
          _this.$axios({
            method: 'get',
            url: '/api/updateCommodityOrderStatus.service?token=' + token + '&pre_id=' + id + '&status=0'
          }).then((res) => {
            if (res.status === 200) {
              _this._getOrderList()
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    cancelVip(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$vux.confirm.show({
        title: '提示',
        content: '确认取消订单吗？',
        onConfirm() {
          _this.$axios({
            method: 'get',
            url: '/api/updateVipOrderStatus.service?token=' + token + '&pre_id=' + id + '&status=0'
          }).then((res) => {
            if (res.status === 200) {
              _this._getOrderList()
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    cancelCustomized(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$vux.confirm.show({
        title: '提示',
        content: '确认取消订单吗？',
        onConfirm() {
          _this.$axios({
            method: 'get',
            url: '/api/updateTourism.service?token=' + token + '&id=' + id + '&status=5'
          }).then((res) => {
            if (res.status === 200) {
              _this._getOrderList()
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    goHotelOrder(reserveId, hotelName, preId){
      this.$router.push({path: `/roomBookConfirm`, query: {reserveId: reserveId, hotelName: hotelName, preId: preId}})
    },
    goGoodsOrder(arr) {
      if(arr.length === 1){
        this.$router.push({path: `/submitOrderGoods`, query: {goodsId: arr[0].commodityId, amount: arr[0].num, preId: arr[0].pre_id}})
      }else if(arr.length > 1){
        let goods = []
        arr.forEach((item, index) => {
          goods.push({
            id: item.commodityId,
            num: item.num
          })
        })
        this.$router.push({path: `/submitOrderGoodsShop`, query: {total: parseFloat(arr[0].money / 100).toFixed(2), goods: JSON.stringify(goods), preId: arr[0].pre_id}})
      }
    },
    goVipOrder(money, vipId, preId) {
      this.$router.push({path: `/vipOrderConfirm`, query: {money: money, vipId: vipId, preId: preId}})
    },
    goCustomizedOrder(id, type) {
      this.$router.push({path: `/orderDetailCustomized`, query: {id: id, type: type}})
    },
    goCustomizedConfirm(id) {
      this.$router.push({path: `/orderCustomizedConfirm`, query: {id: id}})
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .order_pre_list {
    .item {
      margin-bottom: 1rem;
      background: #fff;
      .title{
        line-height: 2rem;
        padding: 1rem;
        font-size: @font-size-small;
        position: relative;
        &:after{
          .halfBorderLineB();
        }
      }
      .content {
        padding: 2rem 1rem 1rem 12rem;
        position: relative;
        height: 7rem;
        border-bottom: 1px dotted #ddd;
        img {
          position: absolute;
          width: 10rem;
          height: 8rem;
          top:1rem;
          left: 1rem;
        }
        .name {
          line-height: 2.5rem;
          font-size: @font-size-large;
          color: #3b3b3b;
          .wrap2;
        }
        .room {
          line-height: 2rem;
          font-size: @font-size-medium;
        }
        .money {
          color: #ef605a;
          font-size: @font-size-large;
        }
      }
      .handle{
        padding: 1rem;
        text-align: right;
        .btn{
          .custom-primary-blue;
          padding: 0.8rem 1.2rem;
          line-height: 1;
          font-size: @font-size-small;
          margin: 0 0.5rem;
          &.default{
            background: #888 !important;
            border: 0;
          }
        }
      }
    }
  }
</style>
