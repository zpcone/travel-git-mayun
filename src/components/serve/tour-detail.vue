<template>
  <div class="tour_detail">
    <header-back :title="title"></header-back>
    <scroll class="tour_detail_wrap">
      <div  style="padding-bottom: 2rem">
        <div class="travel_info travel">
          <img v-lazy="detail.img"/>
          <p class="title">{{detail.name}}</p>
          <p class="price"><span>￥{{detail.price}}</span> /人起（团期：一日）（含交通）</p>
          <p class="teamDate" @click="selectTeamDate" style="color"> <span>请选择团期</span></p>
        </div>
        <div class="travel_info travel">
          <p class="term"><img src="../../common/images/icons/icon-address-black.png"/>{{detail.cfd}}出发</p>
        </div>
        <div style="height:44px;">
          <sticky scroll-box="vux_view_box_body" ref="sticky" :offset="46" :check-sticky-support="false">
            <tab :line-width="1" active-color="#3366cc">
              <tab-item selected>行程亮点</tab-item>
              <tab-item>费用包含</tab-item>
              <tab-item>预订须知</tab-item>
              <tab-item>其他事项</tab-item>
            </tab>
          </sticky>
        </div>
        <div class="travel_lights travel">
          <div style="padding: 1rem" v-html="detail.xq"></div>
        </div>
      </div>
    </scroll>
    <div class="tour_detail_handle">
      <div class="msg" @click="goKeFu">
        <span class="icon"></span>
        <span class="text">客服</span>
      </div>
      <div class="buy" @click="buy">立即预约</div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="kefu" confirm-text="拨号" title="客服电话" theme="android" @on-confirm="onKeFuConfirm">
        <p>18311420279</p>
      </confirm>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Sticky, Tab, TabItem, Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea ,Confirm, TransferDomDirective as TransferDom } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Sticky, Tab, TabItem, Group, Cell, CellBox, Datetime, Picker, XTextarea, Confirm},
  data () {
    return {
      title: '旅游景点详情',
      kefu: false,
      detail: {}
    }
  },
  created() {
    this._initTour()
  },
  directives: {
    TransferDom
  },
  methods: {
    selectTeamDate() {
      this.$router.push({
        path: '/selectedTeamDate'
      })
      // console.log('jglfdl')
    },
    onKeFuConfirm(){
      location.href = 'tel:18311420279'
    },
    goKeFu(){
      this.kefu = true
    },
    buy() {
      this.$router.push({path: `/tourSubmit`, query: {sceneryId: this.$route.params.id}})
    },
    _initTour () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getScenery.service?token=' + token + '&id=' + this.$route.params.id
      }).then((res) => {
        if (res.status === 200) {
          _this.detail = res.data.data[0]
          console.log(res.data)
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
  .tour_detail {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 10000;
    .tour_detail_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      .travel{
        margin-bottom: 1rem;
        background: @color-text-w;
        &.travel_info{
          .title{
            font-size: @font-size-medium-x;
            line-height: 2rem;
            padding: 0.5rem 1rem;
          }
          .price{
            border-top: 1px solid #eee;
            font-size: @font-size-medium;
            line-height: 4rem;
            padding: 0 1rem;
            span{
              color: #ef605a;
            }
          }
          .teamDate{
            border-top: 1px solid #eee;
            font-size: @font-size-medium;
            line-height: 4rem;
            padding: 0 1rem;
            span{
              color: rgb(51, 102, 204);
            }
          }

          .term{
            img{
              width: 1.2rem;
              height: auto;
              vertical-align: middle;
              margin-right: 10px;
            }
            font-size: @font-size-medium;
            line-height: 2rem;
            padding: 0.5rem 1rem;
          }
        }
        .title{
          font-size: @font-size-large;
          line-height: 4rem;
          padding: 0 1rem;
        }
        img{
          width: 100%;
          height: 16rem;
        }
      }
    }
    .tour_detail_handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      width: 100%;
      font-size: 1.5rem;
      text-align: center;
      color: @color-text-w;
      .msg {
        width: 6rem;
        border-right: 1px solid #ddd;
        background: #fff;
        span {
          display: block;
          &.icon {
            height: 3rem;
            background: url("../../common/images/icons/icon-kf-g.png") no-repeat center center;
            background-size: 2.2rem auto;
          }
          &.text {
            font-size: 1.2rem;
            color: @color-text-g;
          }
        }
      }
      .buy{
        flex: 1;
        background: @color-theme;
        line-height: 5rem;
      }
    }
  }
</style>
