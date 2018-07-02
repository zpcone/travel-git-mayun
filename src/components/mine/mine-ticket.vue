<template>
  <div class="ticket">
    <header-back :title="title"></header-back>
    <scroll class="ticket_wrap">
      <div>
        <swipeout class="list">
          <swipeout-item transition-mode="follow"  class="item" v-for="item in list" :key="item.id">
            <div slot="right-menu">
              <swipeout-button @click.native="deleteTicketId(item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="content"  @click="getTicketInfo(item)" >
              <div class="title"></div>
              <div class="info">
                <div class="left" v-if="item.type==='0'">
                  <p class="price">￥<span class="pri">{{item.jian}}</span></p>
                  <p class="desc">满{{item.man}}元使用</p>
                </div>
                <div class="left" v-if="item.type==='1'">
                  <p class="price">￥<span class="pri">{{item.xianjin}}</span></p>
                  <p class="desc">现金券</p>
                </div>
                <p class="time_title">使用期限: </p>
                <p class="time">{{item.startTime}}--{{item.endTime}}</p>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <swipeout class="list">
          <swipeout-item transition-mode="follow"  class="item" v-for="item in filterList" :key="item.id">
            <div slot="right-menu">
              <swipeout-button @click.native="deleteInvoiceId(item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="content">
              <div class="title" style="background: #808080"></div>
              <div class="info">
                <div class="left" v-if="item.type==='0'" style="color: #808080">
                  <p class="price">￥<span class="pri">{{item.jian}}</span></p>
                  <p class="desc">满{{item.man}}元使用</p>
                </div>
                <div class="left" v-if="item.type==='1'" style="color: #808080">
                  <p class="price">￥<span class="pri">{{item.xianjin}}</span></p>
                  <p class="desc">现金券</p>
                </div>
                <p class="time_title" style="color: #808080">使用期限: </p>
                <p class="time" style="color: #808080">{{item.startTime}}--{{item.endTime}}</p>
              </div>
          </div>
          </swipeout-item>
        </swipeout>
      </div>
    </scroll>
    <actionsheet v-model="showAct" :menus="actMsg" @on-click-menu-delete="onDelete(ticketId)" show-cancel></actionsheet>
    <div class="loading-container" v-if="totalList.length===0">
      <loading v-if="!listEmpty"></loading>
      <empty v-if="listEmpty"></empty>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import Empty from 'components/base/empty'
import Loading from 'components/base/loading'
import {XButton, ToastPlugin, Actionsheet, XNumber, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Loading, Empty, HeaderBack, Scroll, Actionsheet, XButton, XNumber, Swipeout, SwipeoutItem, SwipeoutButton},
  data () {
    return {
      title: '我的优惠券',
      listEmpty: false,
      ticketInfo: '',
      totalList: [],
      list: [],
      filterList: [],
      ticketId: '',
      showAct: false,
      actMsg: {
        'title.noop': '确定删除吗?',
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created() {
    this._initCoupon()
    this.$watch('ticketInfo', (newTicketInfo) => {
      this.$emit('ticketInfo', newTicketInfo)
    })
  },
  methods: {
    deleteTicketId(id) {
      this.showAct = true
      this.ticketId = id
    },
    onDelete(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/deleteCoupon.service?token=' + token + '&id=' + id).then((res) => {
        if (res.status === 200) {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
          _this._initCoupon()
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
    getTicketInfo(item) {
      let _this = this
      if(item.type === '0'){
        this.ticketInfo = item.id + '___' + item.jian
      }else if (item.type === '1'){
        this.ticketInfo = item.id + '___' + item.xianjin
      }
      setTimeout(function () {
        if (location.hash !== '#/mineTicket') {
          _this.$router.back()
        }
      }, 100)
    },
    _initCoupon () {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getCouponList.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.totalList = res.data.data.couponList
          let list = res.data.data.couponList
          let money = _this.$route.query.money
          if(_this.totalList.length === 0){
            _this.listEmpty = true
          }
          if (location.hash !== '#/mineTicket') {
            let filterXinjin = list.filter(item => parseInt(item.xianjin) <= parseFloat(money))
            let filterMan = list.filter(item => parseInt(item.man) <= parseFloat(money))
            let filterListMan = list.filter(item => parseInt(item.man) > parseFloat(money))
            let filterListXian = list.filter(item => parseInt(item.xianjin) > parseFloat(money))
            _this.filterList = filterListXian.concat(filterListMan)
            _this.list = filterXinjin.concat(filterMan)
          } else {
            _this.list = list
          }
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
  .ticket {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #fff;
    overflow: hidden;
    z-index: 1000;
    .ticket_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      .list{
        padding: 1rem;
        box-sizing: border-box;
        .item{
          border-radius: 8px;
          margin-bottom: 1rem;
          overflow: hidden;
          box-shadow: 0 0 10px #ccc ;
          .title{
            height: 0.5rem;
            background: @color-theme;
          }
          .info{
            padding: 3rem 1rem 1rem 12rem;
            font-size: @font-size-medium;
            line-height: 2rem;
            height: 4rem;
            position: relative;
            background: #fff;
            .left{
              position: absolute;
              top: 2rem;
              left: 0;
              min-width: 11rem;
              text-align: center;
              color: @color-theme;
              .price{
                font-size: @font-size-medium;
                .pri{
                  font-size: 30px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
