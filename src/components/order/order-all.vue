<template>
  <div>
    <div class="order_all">
      <div class="header-back">
        <span class="icon-back" @click="goBack()"></span>
        <p class="title" @click="layerOpen">{{title}}<span class="icon-down"></span></p>
      </div>
      <div class="order_all_top">
        <tab :line-width="1" custom-bar-width="60px" active-color="#3366cc">
          <tab-item selected @on-item-click="onItemClick">待付款</tab-item>
          <tab-item @on-item-click="onItemClick">已完成</tab-item>
        </tab>
      </div>
      <div class="hotel_layer_bg" :class="{ active: isActive }" @click="layerClose"></div>
      <div class="hotel_layer_wrap" :class="{ active: isActive }">
        <group class="xinji">
          <radio :options="xinjiList" @on-change="change"></radio>
        </group>
      </div>
      <scroll class="order_all_wrap" v-if="listTotal.length > 0">
        <div style="padding-bottom: 3rem">
          <order-pre-list :orderList="orderList" v-if="payType === 0"></order-pre-list>
          <order-com-list :orderList="orderList" v-else-if="payType === 1"></order-com-list>
        </div>
        <div v-if="orderList.length === 0">
          <empty></empty>
        </div>
      </scroll>
      <div class="loading-container" v-if="listTotal.length === 0">
        <loading v-if="!listEmpty"></loading>
        <empty v-if="listEmpty"></empty>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import Loading from 'components/base/loading'
import Empty from 'components/base/empty'
import OrderPreList from './order-pre-list'
import OrderComList from './order-com-list'
import {Tab, TabItem, Radio, Group} from 'vux'
export default {
  components: {Tab, TabItem, Radio, Group, OrderPreList, OrderComList, Loading, Empty, Scroll, HeaderBack},
  data () {
    return {
      title: '全部订单',
      listEmpty: false,
      isActive: false,
      xinjiList: [{key: '5', value: '全部订单'}, {key: '2', value: '酒店'},{key: '4', value: '旅游'}, {key: '0', value: '商品'}, {key: '1', value: 'VIP会员'}, {key: '3', value: '定制游'}],
      payType: 0,
      orderType: this.$route.query.orderType || '',
      listTotal: [],
      orderList: []
    }
  },
  created() {
    this._getOrderList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    layerOpen() {
      this.isActive = true
    },
    layerClose() {
      this.isActive = false
    },
    change(value, label) {
      this.orderType = value
      this.title = label
      this._getOrderList()
      this.isActive = false
    },
    onItemClick(index) {
      this.payType = index
      this._getOrderList()
    },
    _getOrderList() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      this.$axios({
        method: 'get',
        url: '/api/getUserOrder1.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.listTotal = res.data.data
          let listTotal = _this.listTotal
          listTotal.map(function(value,key,arr){
            value.result = [JSON.parse(value.result)]
          })
          if(_this.orderType == 2){
            listTotal = listTotal.filter(item => item.type == '2')
          }else if(_this.orderType == 0){
            listTotal = listTotal.filter(item => item.type == '0')
          }else if(_this.orderType == 1){
            listTotal = listTotal.filter(item => item.type == '1')
          }else if(_this.orderType == 3){
            listTotal = listTotal.filter(item => item.type == '3')
          }else if(_this.orderType == 4){
            listTotal = listTotal.filter(item => item.type == '4')
          }
          if(listTotal.length === 0){
            _this.listEmpty = true
          }
          let filterTotal = []
          if(_this.payType === 0){
            filterTotal = listTotal.filter(item => item.result[0].resultType == '1' || item.result[0].status == '0' || item.result[0].status == '1' || item.result[0].status == '2')
          }else if(_this.payType === 1){
            filterTotal = listTotal.filter(item => item.result[0].resultType == '2' || item.result[0].status == '3' || item.result[0].status == '4' || item.result[0].status == '5')
          }
          let filterList = []
          filterTotal.forEach((item, index) => {
            if(JSON.stringify(filterList).indexOf(item.crtTime) > -1){
              filterList.forEach((it, i) => {
                if (it.crtTime === item.crtTime) {
                  filterList[i].result.push(item.result[0])
                }
              })
            }else{
              filterList.push(item)
            }
          })
          _this.orderList = filterList
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
  .order_all {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #eee;
    z-index: 1000;
    .order_all_top{
      position: fixed;
      top:4.5rem;
      width: 100%;
      z-index: 1000;
    }
    .header-back{
      position: fixed;
      top:0;
      width: 100%;
      height: 4.4rem;
      text-align: center;
      background: #fff;
      border-bottom: 1px solid #ddd;
      z-index: 100000000;
      .icon-back{
        position: absolute;
        width: 4.4rem;
        height: 4.4rem;
        top:0;
        left: 0;
        background: url("../../common/images/icons/icon-back.png") center center no-repeat;
        background-size: 1rem ;
      }
      .title{
        line-height: 4.4rem;
        font-size: 1.6rem;
        color: #3b3b3b;
        font-weight: bold;
        .icon-down{
          display: inline-block;
          width: 1.2rem;
          height: 0.8rem;
          margin-left: 0.5rem;
          vertical-align: middle;
          .bgImage("../../common/images/icons/icon-pull-down.png");
        }
      }
    }
    .hotel_layer_bg{
      position: fixed;
      top: 4.5rem;
      height: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      z-index: 10000000000;
      transition: all .3s linear;
      &.active{
        opacity: 1;
        height: 100%;
      }
    }
    .hotel_layer_wrap {
      position: fixed;
      max-height: 0;
      overflow: hidden;
      width: 100%;
      top: 4.5rem;
      transition: all .3s linear;
      z-index: 100000000000;
      background: #fff;
      &.active {
        max-height: 100%;
      }
      .xinji{
        max-height: 30rem;
        overflow-y: auto;
        .vux-no-group-title {
          margin-top: 0;
        }
        .weui-cells_radio .weui-check:checked + .weui-icon-checked:before{
          color: @color-theme;
        }
      }
    }
    .order_all_wrap {
      position: fixed;
      width: 100%;
      top: 9rem;
      left: 0;
      bottom: 0;
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 45%;
      transform: translateY(-50%);
      z-index: 1000000000;
    }
  }
</style>
