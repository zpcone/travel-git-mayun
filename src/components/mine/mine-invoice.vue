<template>
  <div>
    <div class="invoice">
      <header-back :title="title"></header-back>
      <span class="addOrder" v-if="preId !== '' || tourismId !== ''" @click="updateOrder">确认</span>
      <scroll class="invoice_wrap">
        <div>
          <swipeout class="list">
            <swipeout-item transition-mode="follow"  class="item" v-for="(item, index) in invoiceList" :key="index">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteInvoiceId(item.id)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content" class="content">
                <div class="radio_row">
                  <input type="radio" :value="getInvoiceInfo(item)" v-model="invoiceInfo" name="invoice" :id="item.id">
                  <label :for="item.id"></label>
                </div>
                <p class="title">{{item.name}}</p>
                <p class="num">{{item.sbm}}</p>
                <x-button mini class="book" @click.native="addInvoice(item.id)">修改</x-button>
              </div>
            </swipeout-item>
          </swipeout>
          <div class="add" @click="addInvoice(0)">＋新增发票信息</div>
        </div>
      </scroll>
    </div>
    <actionsheet v-model="showAct" :menus="actMsg" @on-click-menu-delete="onDelete(invoiceId)" show-cancel></actionsheet>
    <router-view></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import {XButton, ToastPlugin, Actionsheet, XNumber, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Actionsheet, XButton, XNumber, Swipeout, SwipeoutItem, SwipeoutButton},
  data () {
    return {
      title: '我的发票',
      preId: this.$route.query.preId || '',
      tourismId: this.$route.query.tourismId || '',
      type: this.$route.query.type || '',
      invoiceInfo: '',
      invoiceList: [],
      invoiceId: '',
      showAct: false,
      actMsg: {
        'title.noop': '确定删除吗?',
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created() {
    this._initInvoice()
    this.$watch('invoiceInfo', (newInvoice) => {
      this.$emit('invoiceInfo', newInvoice)
    })
  },
  watch: {
    $route(to, from) {
      if(from.path.indexOf('addInvoice') > 0) {
        this._initInvoice()
      }
    }
  },
  methods: {
    updateOrder() {
      if(this.invoiceInfo){
        let invoiceId = this.invoiceInfo.split('___')[0]
        let _this = this
        let token = sessionStorage.getItem('token')
        if (_this.type == 3) {
          _this.$axios({
            method: 'get',
            url: '/api/updateTourism.service?token=' + token + '&id=' + _this.tourismId + '&invoiceId=' + invoiceId
          }).then((res) => {
            if (res.status === 200) {
              _this.$vux.toast.show({
                type: 'text',
                text: '追加成功',
                time: '1000',
                width: '20rem',
                position: 'middle'
              })
              setTimeout(function(){
                _this.$router.back()
              },800)
            }
          }).catch((error) => {
            console.log(error)
          })
        }else{
          _this.$axios({
            method: 'get',
            url: '/api/zjCoupon.service?token=' + token + '&pre_id=' + _this.preId + '&orderType=' + _this.type + '&invoiceId=' + invoiceId
          }).then((res) => {
            if (res.status === 200) {
              _this.$vux.toast.show({
                type: 'text',
                text: '追加成功',
                time: '1000',
                width: '20rem',
                position: 'middle'
              })
              setTimeout(function(){
                _this.$router.back()
              },800)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      }else{
        this.$vux.toast.show({
          type: 'text',
          text: '请选择发票',
          time: '1000',
          width: '20rem',
          position: 'middle'
        })
      }
    },
    addInvoice(id) {
      let type = this.$route.query.type
      if (type === 'goods') {
        this.$router.push({path: `/submitOrderGoods/mineInvoice/addInvoice`, query: {id: id}})
      } else if (type === 'goodsShop') {
        this.$router.push({path: `/submitOrderGoodsShop/mineInvoice/addInvoice`, query: {id: id}})
      } else if (type === 'hotel') {
        this.$router.push({path: `/roomBookConfirm/mineInvoice/addInvoice`, query: {id: id}})
      } else if (type === 'vip') {
        this.$router.push({path: `/vipOrderConfirm/mineInvoice/addInvoice`, query: {id: id}})
      } else if (type === 'customized') {
        this.$router.push({path: `/orderCustomizedConfirm/mineInvoice/addInvoice`, query: {id: id}})
      } else {
        this.$router.push({path: `/addInvoice`, query: {id: id}})
      }
    },
    deleteInvoiceId(id) {
      this.showAct = true
      this.invoiceId = id
    },
    onDelete(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/deleteUserInvoice.service?token=' + token + '&invoiceId=' + id).then((res) => {
        if (res.status === 200) {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
          _this._initInvoice()
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
    getInvoiceInfo(item) {
      return item.id + '___' + item.name
    },
    _initInvoice () {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getUserInvoice.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.invoiceList = res.data.data
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped lang="less">
  @import "../../common/css/variable.less";
  .invoice {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 1000;
    .addOrder{
      position: fixed;
      z-index: 10000000000;
      right: 10px;
      width: 4.5rem;
      height: 4.5rem;
      line-height: 4.5rem;
      font-size: 1.6rem;
      color: @color-theme;
    }
    .invoice_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      .list{
        .item{
          margin-bottom: 1rem;
          background: #fff;
          .content{
            padding: 1rem 8rem 1rem 4rem;
            font-size: @font-size-medium;
            line-height: 2.2rem;
            position: relative;
            .radio_row{
              position: absolute;
              left: 1rem;
              top:2rem;
              input{
                width: 2rem;
                height: 2rem;
              }
            }
            .book{
              position: absolute;
              right: 2rem;
              top:2rem;
              .custom-primary-blue;
              padding: 0.6rem 1.5rem;
              line-height: 1;
            }
          }
        }
      }
      .add{
        display: inline-block;
        width: 70%;
        height: 3.6rem;
        border-radius: 4px;
        border:1px solid @color-theme;
        color: @color-theme;
        text-align: center;
        font-size: 1.6rem;
        line-height: 3.6rem;
        margin: 1rem 15% 2rem;
      }
    }
  }
</style>
