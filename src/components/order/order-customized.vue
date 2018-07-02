<template>
  <div class="order_customized-pre">
    <header-back :title="title"></header-back>
    <scroll class="order_customized-pre_wrap">
      <div style="padding-bottom: 3rem">
        <div class="order_goods_list" v-if="filterVip.length>0">
          <div class="item" @click="goCustomizedOrder(item.id)"  v-for="item in filterVip" :key="item.id">
            <p class="title">下单时间：{{item.crtTime}}</p>
            <div class="content">
              <img src="../../common/images/customized-order.jpg"/>
              <p class="name">定制游</p>
              <p class="money">￥{{floatPrice(item.qian)}}</p>
            </div>
            <div class="handle" v-if="item.status === '0'">
              <x-button mini plain class="btn default">待处理</x-button>
            </div>
            <div class="handle" v-if="item.status === '2'">
              <x-button mini plain class="btn" @click.native.stop.prevent="cancelVip(item.id)">取消订单</x-button>
              <x-button mini plain class="btn" @click.native.stop.prevent="goCustomizedConfirm(item.id)" >去付款</x-button>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <div class="loading-container" v-if="filterVip.length===0">
      <loading v-if="!listEmpty"></loading>
      <empty v-if="listEmpty"></empty>
    </div>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import Loading from 'components/base/loading'
import Empty from 'components/base/empty'
import {Confirm, Group, Cell, XButton} from 'vux'
export default {
  components: {Loading, Empty, Scroll, HeaderBack, Confirm, Group, Cell, XButton},
  data () {
    return {
      title: '定制游',
      listEmpty: false,
      vipList: [],
      filterVip: []
    }
  },
  created() {
    this._getOrderList()
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
    cancelVip(id){
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
    goCustomizedOrder(id, type) {
      this.$router.push({path: `/orderDetailCustomized`, query: {id: id, type: type}})
    },
    goCustomizedConfirm(id) {
      this.$router.push({path: `/orderCustomizedConfirm`, query: {id: id}})
    },
    _getOrderList () {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      this.$axios({
        method: 'get',
        url: '/api/findByMyTourism.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.vipList = res.data.data
          _this.filterVip = _this.vipList.filter(item => item.status === '0' || item.status === '1' || item.status === '2')
          if(_this.filterVip.length === 0){
            _this.listEmpty = true
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .order_customized-pre {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #eee;
    z-index: 1000;
    .order_customized-pre_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .order_goods_list {
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
              margin-bottom: 1rem;
              color: #3b3b3b;
              .wrap2;
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
    }
  }
</style>
