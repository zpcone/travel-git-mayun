<template>
  <div>
    <div class="order_page">
      <scroll class="order_wrap">
        <div>
          <group class="order_group">
            <cell class="item" link="/orderAll?orderType=5">
              <span slot="title">全部订单</span>
            </cell>
          </group>
          <div class="order_grid">
            <grid>
              <grid-item link="/orderAll?orderType=2" label="酒 店">
                <img slot="icon" src="../../common/images/icons/icon-order-1.png">
              </grid-item>
              <grid-item link="/orderAll?orderType=4" label="旅 游">
                <img slot="icon" src="../../common/images/icons/icon-order-2.png">
              </grid-item>
              <grid-item link="/orderAll?orderType=1">
                <img slot="icon" src="../../common/images/icons/icon-order-3.png">
                <span slot="label">VIP会员</span>
              </grid-item>
              <grid-item link="/orderAll?orderType=3" label="定制游">
                <img slot="icon" src="../../common/images/icons/icon-order-4.png">
              </grid-item>
              <grid-item link="/orderAll?orderType=0" >
                <img slot="icon" src="../../common/images/icons/icon-order-5.png">
                <span slot="label">商 品</span>
              </grid-item>
            </grid>
          </div>
          <div class="browse" v-if="goodsList.length>0 || hotelList.length>0">
            <p class="title">最近浏览</p>
            <div class="order_page_scroll">
              <keep-alive>
                <div>
                  <div class="record_hotel_list">
                    <div class="item" v-for="item in hotelList" :key="item.hotel.id" @click="goHotelUrl(item.hotel.id)">
                      <img class="img" v-lazy="getFm(item.hotel.img)"/>
                      <div class="info">
                        <p class="name" v-html="item.hotel.name"></p>
                        <p class="score"><span class="lg">10分</span><span>{{item.count}}人消费</span></p>
                        <p class="place"><span>{{item.hotel.qu}}</span><span>距离我{{getDistance(item.mi)}}</span></p>
                        <p class="price"><span class="red">￥{{floatPrice(item.price)}}</span> 起</p>
                      </div>
                    </div>
                  </div>
                  <div class="record_goods_list">
                    <div class="item" v-for="item in goodsList" :key="item.crtTime + item.id" @click="goGoodsUrl(item.id)">
                      <div class="content">
                        <img v-lazy="item.img"/>
                        <p class="name">{{item.name}}</p>
                        <p class="money">￥{{floatPrice(item.price)}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </keep-alive>
          </div>
          </div>
        </div>
      </scroll>
      <div class="loading-container" v-if="listEmpty">
        <loading></loading>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import Loading from 'components/base/loading'
import { Group, Cell, Grid, GridItem } from 'vux'
export default {
  components: {Loading, Scroll, Group, Cell, Grid, GridItem},
  data () {
    return {
      listEmpty: true,
      goodsList: [],
      hotelList: []
    }
  },
  created() {
    this._initRecord()
  },
  methods: {
    getFm(str){
      return str.split(',')[0]
    },
    goHotelUrl(id) {
      this.$router.push({path: `/order/hotelDetail`, query: {hotelId: id}})
    },
    goGoodsUrl(id) {
      this.$router.push({path: `/order/goodsDetail`, query: {goodsId: id}})
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    getDistance(mi) {
      if (mi > 1000) {
        return (mi / 1000).toFixed(2) + 'km'
      } else {
        return mi.toFixed(2) + 'm'
      }
    },
    _initRecord () {
      let _this = this
      let userId = sessionStorage.getItem('userId')
      let token = sessionStorage.getItem('token')
      let lng = sessionStorage.getItem('lng')
      let lat = sessionStorage.getItem('lat')
      this.$axios({
        method: 'get',
        url: '/api/findUserRecord.service?token=' + token + '&userId=' + userId + '&lat=' + lat + '&lng=' + lng
      }).then((res) => {
        if (res.status === 200) {
          _this.listEmpty = false
          _this.goodsList = res.data.data.commodityList
          _this.hotelList = res.data.data.hotelList
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
  .order_page {
    position: fixed;
    top:0;
    width: 100%;
    bottom:5.1rem;
    background:#eee;
    overflow: hidden;
    .order_wrap {
      height: 100%;
      overflow: auto;
      .order_group{
          background: #fff;
          .weui-cells:after,.weui-cells:before{
            display: none;
          }
          .weui-cells{
            margin-top: 0;
            .item{
              font-size: @font-size-medium-x;
              line-height: 2.5rem !important;
            }
          }
        }
      .order_grid{
        background: #fff;
        color: @color-theme;
        .weui-grid{
          text-decoration: none;
          &:before{
            border:0;
          }
          .weui-grid__label{
            color: @color-text-g;
          }
        }
      }
      .browse{
        margin-top: 1rem;
        .title{
          line-height: 3rem;
          font-size: @font-size-medium-x;
          background: #fff;
          padding: 1rem;
          border-bottom: 1px solid #ddd;
        }
        .order_page_scroll{
          .record_hotel_list{
            .item{
              background: @color-text-w;
              position: relative;
              height: 12rem;
              margin: 1rem 0;
              .img{
                position: absolute;
                width: 13rem;
                height: 10rem;
                top:1rem;
                left: 1rem;
              }
              .info{
                padding: 0 1rem 0 15rem;
                p{
                  .wrap;
                  font-size: @font-size-small;
                  color: @color-text-g;
                  line-height: 2.5rem;
                  span{
                    display: inline-block;
                    margin-right: 1rem;
                  }
                  &.name{
                    font-size: @font-size-large;
                    color: @color-text-b;
                    padding-top: 1rem;
                  }
                  &.score{
                    .lg{
                      font-size: @font-size-large;
                      color: @color-text-b;
                    }
                  }
                  &.price{
                    .red{
                      font-size: @font-size-large;
                      margin-right: 0;
                      color: @color-text-r;
                    }
                  }
                }
              }
            }
          }
          .record_goods_list {
            padding-bottom: 2rem;
            .item {
              padding: 1rem 1rem 1rem 15rem;
              position: relative;
              margin-bottom: 1rem;
              height: 10rem;
              background: #fff;
              .content {
                padding-top: 2rem;
                img {
                  position: absolute;
                  width: 13rem;
                  height: 10rem;
                  top:1rem;
                  left: 1rem;
                }
                .name {
                  line-height: 2.5rem;
                  margin-bottom: 1rem;
                  font-size: @font-size-large;
                  .wrap2;
                }
                .money {
                  color: #ef605a;
                  font-size: @font-size-large;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
