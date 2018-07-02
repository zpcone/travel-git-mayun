<template>
  <div>
  <div class="mall">
    <scroll class="mall_wrap">
      <div>
        <div class="swipe">
          <swiper :show-desc-mask="false" loop auto :list="imageList" :index="imageList" dots-class="dots" dots-position="center"></swiper>
        </div>
        <div class="mall_list_1">
          <p @click="goUrl(1)"><span class="icon icon_m"></span>新人专享</p>
          <p @click="goUrl(2)"><span class="icon icon_n"></span>最新活动</p>
        </div>
        <div class="mall_list_2">
          <div class="item" @click="goUrl(3)">
            <img v-lazy="imageType7" />
          </div>
          <div class="item" @click="goUrl(4)">
            <img v-lazy="imageType8" />
          </div>
          <div class="item block" @click="goUrl(5)">
            <img v-lazy="imageType9" />
          </div>
        </div>
        <div class="kind_list_top">
          <scroller lock-y :scrollbar-x=false>
            <tab :line-width="2" ref="scrollX" active-color="#3366cc" bar-active-color="#3366cc" style="width: 100%">
              <tab-item :selected="index === 0" v-for="(item, index) in kinds" :key="item.id" @on-item-click="onItemClick(item.content)">{{item.content}}</tab-item>
            </tab>
          </scroller>
        </div>
        <goods-list :data="filterGoods"></goods-list>
      </div>
    </scroll>
  </div>
  <router-view></router-view>
  </div>
</template>
<script>
import Scroll from 'components/base/scroll'
import GoodsList from './goods-list'
import {Swiper, SwiperItem, Scroller, Tab, TabItem} from 'vux'
export default {
  components: {Scroll, GoodsList, Swiper, SwiperItem, Scroller, Tab, TabItem},
  data () {
    return {
      goods: {},
      kinds: [],
      goodsList: [],
      filterGoods: [],
      imageList: [],
      imageType7: '',
      imageType8: '',
      imageType9: ''
    }
  },
  created() {
    this._initMall()
    this._initBanner()
  },
  methods:{
    _initMall () {
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/shopping.service?token=22'
      }).then((res) => {
        if (res.status === 200) {
          let rest = res.data.data.shangpin
          _this.goodsList = rest.filter(item => item.codeType !== '1')
          _this.kinds = res.data.data.fenlei
          _this.filterData(_this.kinds[0].content)
          if (_this.kinds.length > 5) {
            _this.$refs.scrollX.$el.style.width = (_this.kinds.length * 80) + 'px'
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _initBanner () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getBanner.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          let list = res.data.data
          let filterImages = list.filter(item => item.type === '6')
          _this.imageType7 = list.filter(item => item.type === '7')[0].img
          _this.imageType8 = list.filter(item => item.type === '8')[0].img
          _this.imageType9 = list.filter(item => item.type === '9')[0].img
          filterImages.forEach((item, index) => {
            _this.imageList.push({
              url: item.url,
              img: item.img
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    onItemClick(type) {
      this.filterData(type)
    },
    filterData(condition) {
      this.filterGoods = this.goodsList.filter(item => item.type === condition)
    },
    goUrl(itemId) {
      if (itemId === 1) {
        this.$router.push({path: `/mallWelfare`})
      } else if (itemId === 2) {
        this.$router.push({path: `/mallActivities`})
      } else if (itemId === 3) {
        this.$router.push({path: `/mallStar`})
      } else if (itemId === 4) {
        this.$router.push({path: `/mallNews`})
      } else if (itemId === 5) {
        this.$router.push({path: `/mallSale`})
      }
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .mall {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 5.1rem;
    .mall_wrap {
      position: fixed;
      top: 0;
      width: 100%;
      bottom: 5.1rem;
      .mall_list_1{
        width: 100%;
        height: 4.5rem;
        line-height: 4.5rem;
        font-size: @font-size-medium;
        text-align: center;
        display: flex;
        p{
          position: relative;
          flex: 1;
          &:after{
            content: " ";
            position: absolute;
            top: 1rem;
            bottom: 1rem;
            right: 0;
            width: 1px;
            background: @color-text-d;
          }
          &:last-child:after{
            display: none;
          }
          .icon{
            display: inline-block;
            width: 1.8rem;
            height: 2.2rem;
            margin-right: 0.5rem;
            vertical-align: middle;
            &.icon_m{
              .bgImage("../../common/images/icons/icon-m.png");
            }
            &.icon_n{
              .bgImage("../../common/images/icons/icon-n.png");
            }
          }
        }
      }
      .mall_list_2{
        overflow-y: auto;
        .item{
          width: 49.5%;
          float: left;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0.5rem;
          &.block{
            width: 100%;
          }
          &:nth-child(2n+1){
            margin-right: 1%;
          }
          img{
            width: 100%;
            height: 9rem;
          }
        }
        .cus{
          position: absolute;
          padding: 1rem 3rem;
          font-size: @font-size-large;
          background: @color-background-w;
          color: @color-text-g;
        }
      }
      .kind_list_top{
        height: 4.5rem;
        position: relative;
        .vux-tab {
          background-color: #fff;
          height: 44px;
          position: relative;
          overflow-x: scroll;
        }
      }
    }
  }
</style>
