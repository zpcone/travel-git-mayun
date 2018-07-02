<template>
  <div class="card_info">
    <header-back :title="title"></header-back>
    <scroll class="card_info_wrap">
      <div class="list">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="text">
            <p v-if="item.type == 0">购物返积分</p>
            <p v-if="item.type == 1">抵现返积分</p>
            <p v-if="item.type == 2">积分兑换商品</p>
            <p class="time">{{item.crtTime}}</p>
          </div>
          <div class="num add" v-if="item.type == 0 || item.type == 1">+{{item.num}}</div>
          <div class="num reduce" v-if="item.type == 2">-{{item.num}}</div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, Cell, CellBox, Datetime, Picker, XTextarea},
  data () {
    return {
      title: '积分明细',
      list: []
    }
  },
  created() {
    this._initCardInfo()
  },
  methods: {
    _initCardInfo () {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('openId')
      this.$axios.get('/api/getCardUser.service?token=' + token + '&userId=' + userId).then((res) => {
        if (res.status === 200) {
          console.log(res)
          _this.list = res.data.data
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
  .card_info {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 1000;
    .card_info_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      .list{
        .item{
          background: #fff;
          padding: 0.5rem 1rem;
          border-bottom: 1px dashed #ddd;
          display: flex;
          align-items: center;
          &:last-child{
            border-bottom: 0;
          }
          .text{
            flex: 1;
            p{
              line-height: 2rem;
              font-size: 1.4rem;
              .wrap();
              &.time{
                font-size: 1.2rem;
              }
            }
          }
          .num{
            font-size: 1.4rem;
            &.reduce{
              color: #ef605a;
            }
            &.add{
              color: #04be02;
            }
          }
        }
      }
    }
  }
</style>
