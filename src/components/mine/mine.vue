<template>
  <div class="mine">
    <scroll class="mine_wrap">
      <div style="padding-bottom: 2rem">
        <div class="mine_info">
          <div class="mine_info_wrap">
            <img class="img_header" v-lazy="user.headimg" />
            <p class="name">{{user.name}}</p>
            <p class="card">当前积分:{{user.card}}</p>
          </div>
          <div class="cardInfo" @click="goCardInfo">
            <img src="../../common/images/icons/card-info.png" />
            <span>积分明细</span>
          </div>
        </div>
        <div class="mine_grid">
          <grid :cols="2">
            <grid-item link="/orderPrePay" label="待付款">
              <img slot="icon" src="../../common/images/icons/icon-mine-grid1.png">
            </grid-item>
            <grid-item link="/orderComPay" >
              <img slot="icon" src="../../common/images/icons/icon-mine-grid2.png">
              <span slot="label">已完成</span>
            </grid-item>
          </grid>
        </div>
        <div class="mine_list">
          <group class="group">
            <cell class="item" link="/mallCard">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine6.png"/>
                <span style="vertical-align:middle;">积分商城</span>
              </span>
            </cell>
          </group>
          <group class="group">
            <cell class="item" link="/mineTicket">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine1.png"/>
                <span style="vertical-align:middle;">我的优惠券</span>
              </span>
            </cell>
          </group>
          <group class="group">
            <cell class="item" link="/mineAddress">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine2.png"/>
                <span style="vertical-align:middle;">我的收货地址</span>
              </span>
            </cell>
          </group>
          <group class="group">
            <cell class="item" link="/mineShopCart">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine3.png"/>
                <span style="vertical-align:middle;">我的购物车</span>
              </span>
            </cell>
          </group>
          <group class="group">
            <cell class="item" link="/mineCollection">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine4.png"/>
                <span style="vertical-align:middle;">我收藏的酒店</span>
              </span>
            </cell>
          </group>
          <group class="group">
            <cell class="item" link="/mineInvoice">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine5.png"/>
                <span style="vertical-align:middle;">我的发票</span>
              </span>
            </cell>
          </group>
          <group class="group">
            <cell class="item" link="/mineWish">
              <span slot="title">
                <img class="icon" src="../../common/images/icons/icon-mine7.png"/>
                <span style="vertical-align:middle;">我的心愿单</span>
              </span>
            </cell>
          </group>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import { Group, Cell, Grid, GridItem } from 'vux'
import Scroll from 'components/base/scroll'
export default {
  components: {Group, Cell, Scroll, Grid, GridItem},
  data () {
    return {
      user: {}
    }
  },
  created() {
    this._getUserInfo()
  },
  methods: {
    goCardInfo() {
      this.$router.push({path: `/cardInfo`})
    },
    _getUserInfo() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('openId')
      this.$axios({
        method: 'get',
        url: '/api/findByUser.service?token=' + token + '&user_id=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.user = res.data.data[0]
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "../../common/css/variable.less";
  .mine{
    position: fixed;
    top:0;
    width: 100%;
    bottom:5.1rem;
    background:#eee;
    overflow: hidden;
    .mine_wrap{
      height: 100%;
      overflow: hidden;
      .mine_info{
        height: 17rem;
        background: @color-theme;
        text-align: center;
        margin-bottom: 1rem;
        .mine_info_wrap{
          position: relative;
          display: inline-block;
          padding: 1rem 1rem 1rem 9rem;
          text-align: left;
          margin-top: 4rem;
          box-sizing: border-box;
          width: 75%;
          .img_header{
            position: absolute;
            left: 1rem;
            top:1rem;
            width: 7rem;
            height: 7rem;
            border-radius: 50%;
          }
          .name{
            font-size: 2rem;
            color: #fff;
            margin-top: 1rem;
            line-height: 3rem;
          }
          .card{
            font-size: 1.4rem;
            color: #fff;
          }
        }
        .cardInfo{
          position: fixed;
          top:1.5rem;
          right: 2rem;
          text-align: center;
          img{
            width: 1.5rem;
            display: block;
            margin: 0 auto 0.5rem;
          }
          span{
            color: #fff;
            font-size: 1rem;
          }
        }
      }
      .mine_grid{
        background: #fff;
        color: @color-theme;
        .weui-grid{
          text-decoration: none;
          &:before{
            top: 2rem;
            bottom: 2rem;
          }
          .weui-grid__label{
            color: @color-theme;
          }
        }
      }
      .mine_list{
        .group{
          background: #fff;
          .weui-cells{
            margin-top: 1rem;
            .item{
              font-size: 1.4rem;
              .icon{
                width: 1.8rem;
                vertical-align: middle;
                margin-right: 0.8rem;
              }
            }
          }
        }
      }
    }
  }
</style>
