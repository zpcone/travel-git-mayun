<template>
  <div class="order_detail_hotel">
    <header-back :title="title"></header-back>
    <scroll class="order_detail_hotel_wrap">
      <div style="padding-bottom: 3rem">
        <div class="order_price" v-if="type === 'pre'">需支付：<span class="price">{{detail.qian}}元</span></div>
        <div class="order_info_wrap">
          <p class="title">客户信息</p>
          <p class="row">客户姓名：{{detail.customer}}</p>
          <p class="row">联系电话：{{detail.phone}}</p>
          <p class="row">联系邮箱：{{detail.email}}</p>
          <p class="row">同行人数：{{detail.num}}</p>
          <p class="row">人均消费：{{detail.price}}元/人</p>
          <p class="row">往返时间：{{detail.talkTime}}  —  {{detail.outTime}}</p>
          <p class="row">定制内容：{{switchContent(detail.content)}}</p>
          <p class="row">酒店星级选择：{{switchStar(detail.hotelStar)}}</p>
          <p class="row">出发地：{{detail.province}}</p>
          <p class="row">目的地：{{detail.city}}</p>
        </div>
        <div class="order_info_wrap" v-if="detail.otherContent != ''">
          <p class="title">您的其他需求</p>
          <p class="area">{{detail.otherContent}}</p>
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
      type: this.$route.query.type || '',
      detail: {}
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    switchContent(str) {
      let arr = str.split(',')
      let arrS = []
      arr.forEach(function(item, index){
        if(item == '0'){
          arrS.push('门票')
        }else if(item == '1'){
          arrS.push('用车')
        }else if(item == '2'){
          arrS.push('酒店')
        }else if(item == '3'){
          arrS.push('路线规划')
        }else if(item == '4'){
          arrS.push('导游')
        }
      })
      return arrS.join(', ')
    },
    switchStar(str) {
      let n = ''
      switch(str){
        case '0':
          n = '三星级'
          break
        case '1':
          n = '四星级'
          break;
        case '2':
          n = '五星级'
          break;
        default:
          n = '五星级'
      }
      return n
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    normal(money){
      return ((parseFloat(money) / 100).toFixed(2))
    },
    _getDetail() {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/findByMyTourismFilePrice.service?token=' + token + '&tourismId=' + _this.$route.query.id
      }).then((res) => {
        if (res.status === 200) {
          _this.detail = res.data.data
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
@import "../../common/css/variable.less";
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
    .order_price{
      text-align: right;
      padding: 1rem;
      line-height: 2rem;
      background: #fff;
      margin-bottom: 1rem;
      font-size: @font-size-medium;
      .price{
        color: @color-text-r;
        font-size: @font-size-medium-x;
      }
    }
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
      font-size: 1.4rem;
      .row{
        line-height: 2.5rem;
        padding: 1rem;
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
      .title{
        height: 4rem;
        line-height: 4rem;
        padding-left: 10px;
        border-bottom: 1px dotted #ddd;
      }
      .area{
        padding: 1rem;
        line-height: 2rem;
      }
    }
  }
}
</style>
