<template>
  <div class="goods_detail">
    <header-back :title="title"></header-back>
    <scroll class="goods_detail_wrap">
      <div>
        <div class="swipe">
          <swiper loop auto :list="imageList" :index="imageList" :show-desc-mask="false" dots-position="center"></swiper>
        </div>
        <div class="content" v-if="goods != {}">
          <p class="title" v-html="goods.name"></p>
          <p class="price_now" v-if="goodsType == '' ">￥{{floatPrice(goods.price)}}</p>
          <p class="price_now" v-if="goodsType == 'card'">{{goods.price}}积分</p>
        </div>
        <group class="comment">
          <cell-box class="cell_box" :link="'/Mall/GoodsDetail/comment?goodsId=' + goodsId">
            <div class="cell_left">全部评价({{commentList.length}})</div>
            <span class="cell_right">查看全部</span>
          </cell-box>
        </group>
        <div class="comment_list">
          <div>
            <div class="item" v-for="(item, index) in commentList" :key="index">
              <img class="img" v-lazy="item.user.headimg">
              <div class="info">
                <p class="name">{{item.user.name}}</p>
                <rater class="score" :font-size="16" v-model="dataNumModel[index].score"></rater>
                <p class="room_comment">{{item.comment.content}}</p>
                <div class="img_list">
                  <img v-if="item != ''" v-for="item in commentImgList[index]" :key="item" :src="item"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="graphic" v-html="goods.content" style="padding-bottom: 5rem"></div>
      </div>
    </scroll>
    <div class="handle">
      <div class="msg item" @click="goKeFu">
        <span class="icon"></span>
        <span class="text">客服</span>
      </div>
      <div class="shopCard item" @click="goShopCard"  v-if="goodsType == '' ">
        <span class="icon"></span>
        <span class="text">购物车</span>
      </div>
      <span class="addShopCard" @click="layerOpen"  v-if="goodsType == '' ">加入购物车</span>
      <span class="buy" @click="layerOpen" v-if="goodsType == '' ">立即购买</span>
      <span class="buy" @click="buy" v-if="goodsType == 'card' ">立即兑换</span>
    </div>
    <div class="physical_detail_layer_bg" :class="{ active: isActive }" @click="layerClose"></div>
    <div class="physical_detail_layer_wrap" :class="{ active: isActive }">
      <img class="good_img" :src="goods.img" />
      <div class="layer_content">
        <div class="info">
          <p class="name">{{goods.name}}</p>
          <p class="price"  v-if="goodsType == '' ">￥{{floatPrice(goods.price)}}</p>
          <p class="price"  v-if="goodsType == 'card' ">{{goods.price}}积分</p>
        </div>
        <div class="num">
          <group>
            <x-number :min="1" v-model="amount" :title="numTitle" fillable></x-number>
          </group>
        </div>
        <div class="confirm">
          <span class="addShopCard" @click="addShopCard"  v-if="goodsType == '' ">加入购物车</span>
          <span class="buy" @click="buy">立即购买</span>
        </div>
        <div v-transfer-dom>
          <confirm v-model="kefu" confirm-text="拨号" title="客服电话" theme="android" @on-confirm="onKeFuConfirm">
            <p>18311420279</p>
          </confirm>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import {Swiper, SwiperItem, XNumber, Group, CellBox,Rater, Confirm, ConfirmPlugin, TransferDomDirective as TransferDom, ToastPlugin, Checker, CheckerItem} from 'vux'
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
export default {
  components: {Scroll, HeaderBack, Swiper, SwiperItem, XNumber, Group, CellBox, Rater, Confirm, Checker, CheckerItem},
  data () {
    return {
      title: '商品详情',
      goods: {},
      goodsId: this.$route.query.goodsId,
      kefu: false,
      goodsType: this.$route.query.goodsType || '',
      imageList: [],
      commentList: [],
      dataNumModel: [],
      commentImgList: [],
      numTitle: '购买数量',
      amount: 1,
      isActive: false
    }
  },
  directives: {
    TransferDom
  },
  created() {
    this._getDetail()
    this.getCommentList()
  },
  methods: {
    onKeFuConfirm(){
      location.href = 'tel:18311420279'
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    _getDetail () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getShop.service?token=' + token + '&id=' + _this.goodsId
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data.data[0])
          _this.goods = res.data.data[0]
          let imgs = _this.goods.img.split(',')
          imgs.forEach((item, index) => {
            _this.imageList.push({
              url: '',
              img: item
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getCommentList () {
      let _this = this
      let token = sessionStorage.getItem('token')
      let params = {
        type: 2,
        commodityId: _this.goodsId
      }
      this.$axios({
        method: 'post',
        url: '/api/getHotelComment.service?token=' + token,
        data: params,
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.status === 200) {
          if(res.data.data.length < 3){
            _this.commentList = res.data.data
          }else{
            _this.commentList = res.data.data.slice(0,2)
          }

          console.log(_this.commentList)
          let rest = []
          _this.commentList.forEach((item, index) => {
            let imgs = item.comment.imgs.split('___')
            _this.commentImgList.push(imgs)
            rest.push({
              score: parseFloat(item.comment.score)
            })
          })
          _this.dataNumModel = rest
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    goKeFu(){
      this.kefu = true
      console.log(12)
    },
    goShopCard() {
      this.$router.push({path: `/mineShopCart`})
    },
    layerOpen() {
      this.isActive = true
    },
    layerClose() {
      this.isActive = false
    },
    addShopCard() {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let commodityId = this.goods.id
      let num = this.amount
      let params = {
        userId: userId,
        commodityId: commodityId,
        num: num
      }
      this.$axios({
        method: 'post',
        url: '/api/addUserCar.service?token=' + token,
        data: JSON.stringify(params),
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.status === 200) {
          _this.$vux.toast.show({
            type: 'text',
            text: '添加成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
          _this.layerClose()
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    buy() {
      if(this.goodsType == 'card'){
        this.$router.push({path: `/submitOrderGoods`, query: {goodsType:'card',amount: this.amount, goodsId: this.goodsId}})
      }else{
        this.$router.push({path: `/submitOrderGoods`, query: {amount: this.amount, goodsId: this.goodsId}})
      }
    }
  }
}
</script>

<style lang="less">
  @import "../../common/css/variable.less";
  .weui-toast__content{
    font-size: 1.4rem;
  }
  .goods_detail{
    position: fixed;
    top:0;
    width: 100%;
    bottom:0;
    background:#fff;
    overflow: hidden;
    z-index: 100;
    .goods_detail_wrap{
      position: fixed;
      top:4.5rem;
      width: 100%;
      bottom:5.1rem;
      overflow: hidden;
      .swipe{
        box-shadow: 0 0 10px #ddd ;
      }
      .content{
        padding: 1rem 1.5rem 0;
        .title{
          line-height: 2rem;
          padding: 0.5rem 0 0.5rem 0;
          font-size: 1.6rem;
        }
        .price_now{
          color: #ef605a;
          font-size: 2rem;
          padding-bottom: 1rem;
        }
      }
      .graphic{
        padding-top: 1rem;
        img{
          width:100% ;
        }
      }
      .comment{
        .weui-cells{
          margin-top: 0;
          background: #eee;
          padding: 1rem 0 0 0;
          &:before{
            display: none;
          }
          .cell_box{
            padding-right: 30px;
            background: #fff;
            .cell_left{
              flex: 1;
              font-size: @font-size-medium-x;
            }
            .cell_right{
              font-size: @font-size-small-m;
            }
          }
        }
      }
      .comment_list{
        background: #eee;
        padding: 0 0 1rem 0;
        .item{
          background: #fff;
          position: relative;
          padding:1rem 0 1rem 6rem ;
          &:after{
            .halfBorderLineB;
          }
          .img{
            position: absolute;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            left: 1rem;
            top:1rem;
          }
          .info{
            overflow-y: auto;
            .name{
              font-size: 1.5rem;
              line-height: 2rem;
            }
            .score{
              position: absolute;
              right: 1rem;
              top:1rem;
            }
            .room_comment{
              padding: 0.5rem 0;
              line-height: 1.6rem;
              font-size: 1.4rem;
            }
            .img_list img{
              display: inline-block;
              width: 30%;
              height: 8rem;
              margin-right: 3%;
              margin-bottom: 1rem;
              float: left;
            }
          }
        }
      }
    }
    .handle{
      position: fixed;
      bottom: 0;
      display: flex;
      height: 5rem;
      width: 100%;
      font-size: 1.5rem;
      color: #fff;
      text-align: center;
      border-top: 1px solid #ddd;
      z-index: 1000;
      .item{
        width: 6rem;
        border-right: 1px solid #ddd;
        span{
          display: block;
          &.icon{
            height: 3rem;
          }
          &.text{
            font-size: 1.2rem;
            color: @color-text-g;
          }
        }
        &.star{
          .icon{
            background: url("../../common/images/icons/icon-st-g.png") no-repeat center center;
            background-size: 2.2rem auto;
          }
        }
        &.msg{
          .icon{
            background: url("../../common/images/icons/icon-kf-g.png") no-repeat center center;
            background-size: 2.2rem auto;
          }
        }
        &.shopCard{
          border-right: 0;
          .icon{
            background: url("../../common/images/icons/icon-sc-g.png") no-repeat center center;
            background-size: 2.2rem auto;
          }
        }
      }
      .addShopCard{
        flex: 1;
        line-height: 5rem;
        background: @color-theme-light;
      }
      .buy{
        flex: 1;
        line-height: 5rem;
        background: @color-theme;
      }
    }
    .physical_detail_layer_bg{
      position: fixed;
      display: none;
      top:0;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      &.active{
        opacity: 1;
        display: block;
      }
    }
    .physical_detail_layer_wrap{
      overflow: hidden;
      position: absolute;
      padding-top: 2rem;
      width: 100%;
      bottom: -100%;
      transition: all .3s linear;
      &.active{
        bottom: -1px;
      }
      .good_img{
        position: absolute;
        top: 0;
        left: 1rem;
        width: 9rem;
        height: 9rem;
      }
      .layer_content{
        padding: 0;
        background: #fff;
        .info{
          padding:1rem 0 0 11rem;
          height: 8rem;
          background: #fff;
          .name{
            font-size: 1.4rem;
            line-height: 1.8rem;
          }
          .price{
            font-size: 1.6rem;
            color: #ef605a;
          }
        }
        .specs{
          max-height: 250px;
          overflow-y: auto;
          padding: 1rem 1rem 3rem;
          .radio_row{
            .title{
              font-size: 1.4rem;
              line-height: 3rem;
            }
            .item {
              border: 1px solid #ddd;
              padding: 0.8rem 1.8rem;
              font-size: 1.4rem;
              border-radius: 3px;
              margin:0 1rem 1rem 0;
            }
            .item-selected {
              border: 1px solid @color-theme;
            }
          }
        }
        .num{
          font-size: 1.6rem;
          margin-bottom: 2rem;
          .weui-cells{
            margin-top: 0 !important;
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
        }
        .confirm{
          display: flex;
          height: 5rem;
          font-size: 1.6rem;
          color: #fff;
          text-align: center;
          line-height: 5rem;
          span{
            flex: 1;
            &.addShopCard{
              background-color: @color-theme-light;
            }
            &.buy{
              background-color: @color-theme;
            }
          }
        }
      }
    }
  }
</style>
