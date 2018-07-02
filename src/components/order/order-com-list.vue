<template>
  <div class="order_com_list">
    <template v-for="item in orderList">
      <div class="item" v-if="item.type === '2'" :key="item.crtTime" @click="goHotelOrder(item.result[0].pre_id)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content">
          <img class="img" v-lazy="getFm(item.result[0].img)"/>
          <p class="name">{{item.result[0].name}}</p>
          <p class="room">{{item.result[0].roomType}}</p>
          <p class="money">￥{{normal(item.result[0].money)}}</p>
        </div>
        <div class="handle">
          <x-button mini class="btn buy" @click.native.stop.prevent="addComment(item.result[0].hotelId, '1')">去评价</x-button>
          <x-button mini v-if="item.result[0].invoiceId == ''" class="btn" @click.native.stop.prevent="addInvoice(item.result[0].pre_id, 0)">追加发票</x-button>
          <x-button mini class="btn" @click.native.stop.prevent="goRefundHotel(item.result[0].pre_id)">申请退款</x-button>
        </div>
      </div>
      <div class="item" v-else-if="item.type === '0'" :key="item.crtTime" @click="goGoodsOrder(item.result[0].pre_id, item.result[0].codeType)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content"  v-for="good in item.result" :key="good.commodityId">
          <img v-lazy="good.img"/>
          <p class="name">{{good.name}}</p>
          <p class="money" v-if="good.codeType != '1'">￥{{floatPrice(good.price)}}</p>
          <p class="money" v-if="good.codeType == '1'">{{good.price}}积分</p>
        </div>
        <div class="handle">
          <x-button mini class="btn buy" @click.native.stop.prevent="addComment(item.result[0].commodityId, '2')">去评价</x-button>
          <x-button mini v-if="item.result[0].invoiceId == ''" @click.native.stop.prevent="addInvoice(item.result[0].pre_id, 1)" class="btn buy">追加发票</x-button>
          <x-button mini v-if="item.result[0].codeType != '1'" class="btn refund" @click.native.stop.prevent="goRefundGoods(item.result[0].pre_id, '2')">申请退款</x-button>
        </div>
      </div>
      <div class="item" v-else-if="item.type === '1'" :key="item.crtTime" @click="goVipOrder(item.result[0].pre_id)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content">
          <img v-lazy="item.result[0].img"/>
          <p class="name">{{item.result[0].name}}</p>
          <p class="money">￥{{floatPrice(item.result[0].price)}}</p>
        </div>
        <div class="handle">
          <x-button mini v-if="item.result[0].invoiceId == ''" class="btn buy" @click.native.stop.prevent="addInvoice(item.result[0].pre_id, 2)">追加发票</x-button>
        </div>
      </div>
      <div class="item" v-else-if="item.type === '3'" :key="item.crtTime" @click="goCustomizedOrder(item.result[0].id)">
        <p class="title">下单时间：{{item.crtTime}}</p>
        <div class="content">
          <img src="../../common/images/customized-order.jpg"/>
          <p class="name">定制游</p>
          <p class="money">￥{{floatPrice(item.result[0].qian)}}</p>
        </div>
        <div class="handle">
          <x-button mini v-if="item.result[0].invoiceId == ''" class="btn" @click.native.stop.prevent="addInvoiceCustomized(item.result[0].id, 3)">追加发票</x-button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import {Tab, TabItem, Rater, Group, Cell, XButton} from 'vux'
export default {
  components: {Tab, TabItem, Rater, Group, Cell, XButton},
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
  methods: {
    normal(money){
      return ((parseFloat(money) / 100).toFixed(2))
    },
    goRefundHotel(id) {
      this.$router.push({path: `/orderRefundHotel`,query: {id: id}})
    },
    goRefundGoods(id, type) {
      this.$router.push({path: `/orderRefundGoods`,query: {id: id, type: type}})
    },
    getFm(str){
      return str.split(',')[0]
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    addComment(id, type){
      this.$router.push({path: `/addComment`, query: {id: id, type:type}})
    },
    goHotelOrder(id){
      this.$router.push({path: `/orderComPay/orderDetailHotel`, query: {id: id}})
    },
    goGoodsOrder(id, codeType) {
      if(codeType == '1'){
        this.$router.push({path: `/orderComPay/orderDetailGoods`, query: {id: id, type: 2, goodsType: 'card'}})
      }else{
        this.$router.push({path: `/orderComPay/orderDetailGoods`, query: {id: id, type: 2}})
      }
    },
    goVipOrder(id) {
      this.$router.push({path: `/orderComPay/orderDetailGoods`, query: {id: id, type: 1}})
    },
    goCustomizedOrder(id, type) {
      this.$router.push({path: `/orderDetailCustomized`, query: {id: id, type: type}})
    },
    addInvoice(preId, type){
      this.$router.push({path: `/mineInvoice`, query: {preId: preId, type: type}})
    },
    addInvoiceCustomized(id, type){
      this.$router.push({path: `/mineInvoice`, query: {tourismId: id, type: type}})
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .order_com_list {
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
        }
      }
    }
  }
</style>
