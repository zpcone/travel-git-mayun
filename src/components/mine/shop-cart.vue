<template>
  <div class="shop_cart">
    <header-back :title="title"></header-back>
    <scroll class="shop_cart_wrap" :data="goodsList" v-if="goodsList.length > 0">
      <div class="shop_cart_goods_info"  ref="list" style="padding-bottom: 1rem">
        <swipeout>
          <swipeout-item transition-mode="follow"  class="item" v-for="(item, index) in goodsList" :key="index">
            <div slot="right-menu">
              <swipeout-button @click.native="deleteGoods(item.carId)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="content">
              <div class="radio_row">
                <input type="checkbox" class="check" :data-goodsId="item.id" :data-price="item.price" @click.stop="getTotalPrice" :id="index" name="goodsCheck" :value="item.id" v-model="dataCheckModel">
                <label :for="index"></label>
              </div>
              <img class="good_img" v-lazy="item.img" />
              <div class="info">
                <p class="name">{{item.name}}</p>
                <p class="price">￥{{floatPrice(item.price)}}</p>
              </div>
              <group class="amount">
                <x-number :min="1" v-model="dataNumModel[index].num" :value="item.num" fillable @on-change="getTotalPrice"></x-number>
              </group>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </scroll>
    <actionsheet v-model="showAct" :menus="actMsg" @on-click-menu-delete="onDelete(deleteGoodsId)" show-cancel></actionsheet>
    <div class="shop_cart_handle" v-if="goodsList.length > 0">
      <div class="order">应付总额：<span class="price">￥{{total}}</span></div>
      <div class="buy" @click="buy">提交订单</div>
    </div>
    <div class="loading-container" v-if="goodsList.length===0">
      <loading v-if="!listEmpty"></loading>
      <empty v-if="listEmpty"></empty>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Empty from 'components/base/empty'
import Loading from 'components/base/loading'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import { Group, ToastPlugin, Actionsheet, XNumber, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Scroll, Empty, Loading, HeaderBack,Actionsheet, Group, XNumber, Swipeout, SwipeoutItem, SwipeoutButton},
  data () {
    return {
      title: '我的购物车',
      listEmpty: false,
      goodsList: [],
      dataNumModel: [],
      dataCheckModel: [],
      goodsCheck: [],
      total: 0.00,
      deleteGoodsId: '',
      showAct: false,
      actMsg: {
        'title.noop': '确定删除吗?',
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created() {
    this._getGoodsList()
  },
  methods: {
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    deleteGoods(id) {
      this.showAct = true
      this.deleteGoodsId = id
    },
    onDelete(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/deleteUserCar.service?token=' + token + '&userCarId=' + id
      }).then((res) => {
        if (res.data.status === 200) {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
          _this._getGoodsList()
        } else {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除失败',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getTotalPrice() {
      this.goodsCheck = []
      let checkArr = document.getElementsByClassName('check')
      let totalPrice = 0.00
      for (let i = 0; i < checkArr.length; i++) {
        if (checkArr[i].checked) {
          this.goodsCheck.push({'id': checkArr[i].getAttribute('data-goodsId'), 'num': this.dataNumModel[i].num})
          totalPrice = totalPrice + parseInt(this.dataNumModel[i].num) * parseFloat(checkArr[i].getAttribute('data-price')).toFixed(2)
        }
      }
      this.total = parseFloat(totalPrice).toFixed(2)
    },
    _getGoodsList () {
      let _this = this
      let userId = sessionStorage.getItem('userId')
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getUserCar.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.goodsList = []
          let goodsMap = res.data.data
          for (let key in goodsMap) {
            _this.goodsList.push(goodsMap[key])
          }
          let rest = []
          _this.goodsList.forEach((item, index) => {
            rest.push({
              num: item.num
            })
          })
          _this.dataNumModel = rest
          if(_this.goodsList.length === 0){
            _this.listEmpty = true
          }
          console.log(_this.goodsList)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    buy() {
      if (this.goodsCheck.length > 0) {
        this.$router.push({path: `/submitOrderGoodsShop`, query: {total: this.total, goods: JSON.stringify(this.goodsCheck)}})
      } else {
        this.$vux.toast.show({
          type: 'text',
          text: '请选择商品',
          time: '1000',
          width: '20rem',
          position: 'middle'
        })
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/css/variable.less";
  .shop_cart{
    position: fixed;
    top: 0;
    width: 100%;
    bottom:0;
    background:#eee;
    overflow: hidden;
    z-index: 100;
    .shop_cart_wrap{
      position: fixed;
      top:4.5rem;
      width: 100%;
      bottom:5rem;
      overflow: hidden;
      .shop_cart_goods_info{
        padding-bottom: 1rem;
        .weui-cells, .vux-no-group-title{
          margin-top: 0 !important;
        }
        .weui-cells:after, .weui-cells:before{
          display: none !important;
        }
        .weui-cell{
          padding: 0 !important;
        }
        .vux-number-selector{
          color: @color-theme !important;
          svg{
            fill: @color-theme !important;
          }
          &.vux-number-disabled svg{
            fill: #ccc !important;
          }
        }
        .item{
          position: relative;
          margin-bottom: 1rem;
          background: #fff;
          .content{
            padding:1.5rem 1rem 1.5rem 13rem;
            min-height: 8rem;
            .radio_row{
              position: absolute;
              width: 4rem;
              height: 8rem;
              left: 0;
              top: 0;
              text-align: center;
              input{
                position: absolute;
                left: 0;
                opacity: 0;
                width: 4rem;
                height: 8rem;
                top: 0;
                z-index: 100000;
              }
              label{
                position: absolute;
                left: 10px;
                width: 16px;
                height: 16px;
                top:4rem;
                border-radius: 50%;
                border: 1px solid #999;
              }
              input:checked+label {
                background-color: @color-theme;
                border: 1px solid @color-theme;
              }
              input:checked+label::after {
                position: absolute;
                content: "";
                width: 4px;
                height: 8px;
                top: 2px;
                left: 5px;
                border: 2px solid #fff;
                border-top: none;
                border-left: none;
                transform: rotate(45deg)
              }
            }
            .good_img{
              position: absolute;
              width: 8rem;
              height: 8rem;
              left: 4rem;
              top: 1.5rem;
            }
            .info{
              line-height: 2rem;
              .name{
                font-size: 1.5rem;
                .wrap2();
                margin-top: 1rem;
              }
              .spec{
                font-size: 1.2rem;
                color: #666666;
              }
              .price{
                color: #ef605a;
                margin-top: 0.5rem;
                font-size: 1.6rem;
              }
            }
            .amount{
              position: absolute;
              right: 1rem;
              bottom: 1rem;
            }
          }
        }
      }
    }
    .shop_cart_handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      line-height: 5rem;
      width: 100%;
      font-size: 1.5rem;
      text-align: center;
      border-top: 1px solid #ddd;
      color: #fff;
      background: #fff;
      .order{
        flex: 1;
        color: #666;
        .price{
          color: #ef605a;
          font-size: 1.8rem;
        }
      }
      .buy{
        display: inline-block;
        width: 13rem;
        background: @color-theme;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 45%;
      transform: translateY(-50%);
    }
  }
</style>
