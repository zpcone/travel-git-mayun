<template>
  <div class="mall_sale">
    <header-back :title="title"></header-back>
    <div class="mall_sale_top">
      <scroller lock-y :scrollbar-x=false>
        <tab :line-width="2" id="scrollX" ref="scrollX" active-color="#3366cc" bar-active-color="#3366cc" style="width: 100%">
          <tab-item :selected="index === 0" v-for="(item, index) in kinds" :key="item.id" @on-item-click="onItemClick(item.content)">{{item.content}}</tab-item>
        </tab>
      </scroller>
    </div>
    <scroll class="mall_sale_wrap">
      <goods-list :data="filterGoods"></goods-list>
      <empty v-if="filterGoods.length===0 && goodsList.length>0"></empty>
    </scroll>
    <div class="loading-container" v-if="goodsList.length===0">
      <loading v-if="!listEmpty"></loading>
      <empty v-if="listEmpty"></empty>
    </div>
  </div>
</template>
<script>
import Loading from 'components/base/loading'
import Empty from 'components/base/empty'
import HeaderBack from 'components/base/header-back'
import GoodsList from './goods-list'
import Scroll from 'components/base/scroll'
import {Scroller, Tab, TabItem} from 'vux'
export default {
  components: {Loading, Empty, Scroll, GoodsList, HeaderBack, Scroller, Tab, TabItem},
  data () {
    return {
      title: 'JR特卖会',
      goodsList: [],
      listEmpty: false,
      filterGoods: [],
      kinds: []
    }
  },
  created() {
    this._initMall()
  },
  methods: {
    mounted () {
    },
    onItemClick(type) {
      this.filterData(type)
    },
    filterData(condition) {
      this.filterGoods = this.goodsList.filter(item => item.type === condition)
    },
    _initMall () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/shopping.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.goodsList = res.data.data.shangpin
          if(_this.goodsList.length === 0){
            _this.listEmpty = true
          }
          _this.kinds = res.data.data.fenlei
          _this.filterData(_this.kinds[0].content)
          if (_this.kinds.length > 5) {
            document.getElementById('scrollX').style.width = _this.kinds.length * 80 + 'px'
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
  .mall_sale {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #fff;
    z-index: 1000;
    .mall_sale_top{
      position: fixed;
      top: 4.5rem;
      width: 100%;
      height: 4.5rem;
      z-index: 100;
      .list{
        position: relative;
        width: 60rem;
        line-height: 4.5rem;
        font-size: @font-size-medium;
        span{
          box-sizing: border-box;
          line-height: 4.2rem;
          display: inline-block;
          padding: 0 1rem;
          &.active{
            color: @color-theme;
            border-bottom: 0.2rem solid @color-theme;
          }
        }
      }
      .vux-tab {
        background-color: #fff;
        height: 44px;
        position: relative;
        overflow-x: scroll;
      }
    }
    .mall_sale_wrap {
      position: fixed;
      width: 100%;
      top: 9rem;
      left: 0;
      bottom: 0;
      .sale_list {
        overflow-y: auto;
        padding: 1rem 0;
        .item {
          width: 50%;
          float: left;
          padding: 0 1rem;
          box-sizing: border-box;
          position: relative;
          margin-bottom: 1rem;
          &:nth-child(2n+1){
            padding-right: 0;
          }
          .content {
            img {
              width: 100%;
              height: 14rem;
            }
            .name {
              line-height: 2rem;
              font-size: @font-size-medium;
              .wrap2;
            }
            .money {
              font-size: @font-size-large;
              color: #ef605a;
            }
          }
        }
      }
    }
  }
</style>
