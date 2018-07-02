<template>
  <div>
    <div class="tour_container">
      <header-back :title="title"></header-back>
      <div class="tour_top_wrap" ref="chooseCondition" v-if="page === '1'">
        <div class="tour_top_list">
          <p @click="layerOpen('range')">行程天数<span class="icon-down"></span></p>
          <p @click="changeOrder">人气指数<span class="icon-down"></span></p>
        </div>
      </div>
      <div class="tour_top_wrap" ref="chooseCondition" v-if="page === '3'">
        <div class="tour_grid">
          <div class="tour_item" v-for="(item,i) in tags" :key="i">
            <img v-lazy="item.ico">
            <p v-html="item.name"></p>
          </div>
        </div>
        <div class="tour_top_list">
          <p @click="changeOrder">目的地<span class="icon-down"></span></p>
          <p @click="layerOpen('range')">出行天数<span class="icon-down"></span></p>
        </div>
      </div>
      <div class="tour_top_wrap" ref="chooseCondition" v-if="page === '4'">
        <div class="tour_top_list">
          <p @click="layerOpen('range')">团购人数<span class="icon-down"></span></p>
          <p @click="changeOrder">惊喜指数<span class="icon-down"></span></p>
        </div>
      </div>
      <div class="tour_top_wrap" ref="chooseCondition" v-if="page === '5'">
        <div class="tour_grid tour_grid_img">
          <div class="tour_item" v-for="(item,i) in tags" :key="i">
            <img v-lazy="item.ico">
          </div>
        </div>
        <div class="tour_top_list">
          <p @click="changeOrder">售价范围<span class="icon-down"></span></p>
          <p @click="layerOpen('range')">出行天数<span class="icon-down"></span></p>
        </div>
      </div>
      <div class="tour_top_wrap" ref="chooseCondition" v-if="page === '7'">
        <div class="tour_top_list">
          <p @click="layerOpen('range')">行程天数<span class="icon-down"></span></p>
          <p @click="changeOrder">销量<span class="icon-down"></span></p>
          <p @click="changeOrder">惊喜指数<span class="icon-down"></span></p>
        </div>
      </div>
      <div class="tour_layer_bg" ref="mask2" :class="{ active: isActive }" @click="layerClose"></div>
      <div class="tour_layer_wrap" ref="mask" :class="{ active: isActive }">
        <div class="priceRange" v-if="page === '1' || page === '3' || page === '5' || page === '7'">
          <div id="term" class="no_range" style="margin-bottom: 5rem"></div>
        </div>
        <div class="priceRange" v-if="page === '4'">
          <div id="num" class="no_range" style="margin-bottom: 5rem"></div>
        </div>
        <div class="handle">
          <x-button mini class="btn" @click.native="searchReset">重置</x-button>
          <x-button mini class="btn confirm" @click.native="searchConfirm">确认</x-button>
        </div>
      </div>
      <scroll class="tour_list_wrap" ref="tourList">
        <div class="tour_list">
          <div class="item" v-for="item in sceneryList" :key="item.id" @click="goUrl(item.id)">
            <img class="img" v-lazy="item.fm" />
            <div class="info">
              <p class="name">{{item.name}}</p>
              <p class="price"><span class="red">￥{{item.price}}</span> 起 <span class="num">月销{{item.xiaoliang}}份</span></p>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import TourList from './tour-list'
import noUiSlider from 'nouislider'
import { XButton, Checklist, Grid, GridItem } from 'vux'
export default {
  components: { HeaderBack, Scroll, XButton, Checklist, TourList, Grid, GridItem },
  computed: {
    title () {
      if(this.page === '1'){
        return '私家团'
      }else if(this.page === '3'){
        return '主题游'
      }else if(this.page === '4'){
        return '惊喜购'
      }else if(this.page === '5'){
        return '当季热销'
      }else if(this.page === '7'){
        return '奢享之旅'
      }
    }
  },
  data() {
    return {
      page: this.$route.query.page,
      isActive: false,
      sType: '',
      sceneryList: [],
      tags: [],
      priceRange: [],
      order: 2,
      term: 0,
      modelType: this.$route.query.modelType,
      objectList: [{key: '1', value: '三星级'}, {key: '2', value: '四星级'}, {key: '3', value: '五星级'}],
      objectListValue: ['1', '2'],
      grids: [{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'},{name: '标签', icon: '../../images/default.png'}]
    }
  },
  mounted() {
    this._initTour()
    let height
    if(this.page === '3' || this.page === '5'){
      height = this.$refs.chooseCondition.offsetHeight + this.$refs.chooseCondition.offsetTop + 50
    }
    this.$refs.tourList.$el.style.top =  height + 'px'
    this.$refs.mask.style.top =  height + 'px'
    this.$refs.mask2.style.top =  height + 'px'
    if(this.page === '1' || this.page === '3' || this.page === '5' || this.page === '7'){
      this.initRangeTerm()
    } else if(this.page === '4'){
      this.initRangeNum()
    }
  },
  methods: {
    changeOrder() {
      this.layerClose()
      this.searchReset()
      if(this.order === 2){
        this.order = 3
      }else{
        this.order = 2
      }
      this._initTour('order', this.order)
    },
    initRangeTerm(){
      let _this = this
      let noRange = document.getElementById('term')
      noRange.style.height = '10px';
      noUiSlider.create(noRange, {
        start: [0],
        connect: true,
        handles: 1,
        step: 1,
        tooltips: true,
        format: {
          from: function(value) {
            return parseInt(value);
          },
          to: function(value) {
            return parseInt(value);
          }
        },
        range: {
          'min': 0,
          'max': 15
        },
        pips: {
          mode: 'positions',
          values: [0,20,40,60,80,100],
          density: 6
        }
      })
      noRange.noUiSlider.on('update', function(values, handle) {
        _this.priceRange[handle] = parseInt(values[handle])
      })
    },
    initRangeNum(){
      let _this = this
      let noRange = document.getElementById('num')
      noRange.style.height = '10px';
      noUiSlider.create(noRange, {
        start: [0],
        connect: true,
        handles: 1,
        step: 1,
        tooltips: true,
        format: {
          from: function(value) {
            return parseInt(value);
          },
          to: function(value) {
            return parseInt(value);
          }
        },
        range: {
          'min': 0,
          'max': 1000
        },
        pips: {
          mode: 'positions',
          values: [0,20,40,60,80,100],
          density: 6
        }
      })
      noRange.noUiSlider.on('update', function(values, handle) {
        _this.priceRange[handle] = parseInt(values[handle])
      })
    },
    goUrl(id) {
      this.$router.push({path: `/tour/${id}`})
    },
    layerOpen(con) {
      this.sType = con
      this.isActive = true
    },
    layerClose() {
      this.isActive = false
    },
    searchReset(){
      if (this.sType === 'range' && (this.page === '1' || this.page === '3' || this.page === '5' || this.page === '7')) {
        let noRange = document.getElementById('term')
        noRange.noUiSlider.set([0]);
      } else if (this.sType === 'range' && (this.page === '4')) {
        let noRange = document.getElementById('num')
        noRange.noUiSlider.set([0]);
      }
    },
    searchConfirm(){
      if (this.sType === 'range'  && (this.page === '1' || this.page === '3' || this.page === '5' || this.page === '7')) {
        this._initTour('term', this.priceRange[0] + '天')
      } else if (this.sType === 'range' && (this.page === '4')) {
        this._initTour('rs', this.priceRange[0])
      }
      this.isActive = false
    },
    _initTour () {
      let condition = ''
      for (let i in arguments) {
        if(i % 2 === 0){
          condition += '&' + arguments[i]
        }else{
          condition += '=' + arguments[i]
        }
      }
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: 'http://bravrshow.com/api2/getSceneryList.service?token=' + token + '&modelType=' + _this.modelType + condition
      }).then((res) => {
        if (res.status === 200) {
          _this.sceneryList = res.data.data.sceneryList
          _this.tags = res.data.data.tags
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
  @import "../../common/css/nouislider.css";
  .tour_container{
    position: fixed;
    top:0;
    width: 100%;
    bottom:0;
    background:#eee;
    overflow: hidden;
    z-index: 100;
    .tour_layer_bg{
      position: fixed;
      top: 9rem;
      height: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      z-index: 100000;
      transition: all .3s linear;
      &.active{
        opacity: 1;
        height: 100%;
      }
    }
    .tour_layer_wrap {
      position: fixed;
      max-height: 0;
      overflow: hidden;
      width: 100%;
      top: 9rem;
      transition: all .3s linear;
      z-index: 1000000;
      background: #fff;
      &.active {
        max-height: 100%;
      }
      .priceRange{
        height: 9rem;
        padding-top: 7rem;
        text-align: center;
        border-top: 1px solid #ddd;
        .no_range{
          width: 80%;
          margin: 0 auto;
        }
      }
      .xinji{
        max-height: 30rem;
        overflow-y: auto;
        .weui-cell{
          font-size: 1.5rem !important;
        }
        .weui-cells_checkbox .weui-icon-checked:before{
          font-size: 20px;
        }
        .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before{
          color: @color-theme;
        }
      }
      .handle{
        height: 6rem;
        text-align: center;
        border-top: 1px solid #ddd;
        .btn{
          margin:1.5rem 12%;
          height: 3rem;
          width: 20%;
          &.confirm{
            background: @color-theme;
            color: #fff;
          }
        }
      }
    }
    .tour_top_wrap{
      position: fixed;
      top:4.5rem;
      width: 100%;
      z-index: 100;
      .tour_grid{
        padding-top: 10px;
        background: #fff;
        overflow-y: auto;
        .tour_item{
          float: left;
          width: 25%;
          text-align: center;
          background: #fff;
          padding-bottom: 0.5rem;
          img{
            width: 3rem;
          }
          p{
            color: #3b3b3b;
            line-height: 2rem;
          }
        }
      }
      .tour_grid_img{
        padding: 10px 10px 0 0;
        .tour_item{
          padding-left: 10px;
          box-sizing: border-box;
        }
        img{
          width: 100% !important;
        }
      }
      .tour_top_list{
        background: @color-text-w;
        line-height: 4.5rem;
        font-size: @font-size-medium;
        text-align: center;
        display: flex;
        width: 100%;
        margin-top: 5px;
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
          .icon-down{
            display: inline-block;
            width: 0.8rem;
            height: 0.5rem;
            margin-left: 0.5rem;
            vertical-align: middle;
            .bgImage("../../common/images/icons/icon-pull-down.png");
          }
        }
      }
    }
    .tour_list_wrap{
      position: fixed;
      top: 9rem;
      width: 100%;
      bottom:0;
      overflow: hidden;
      .tour_list{
        padding-bottom: 2rem;
        .item{
          background: @color-text-w;
          position: relative;
          margin: 1rem 0;
          .img{
            width: 100%;
            height: 12rem;
          }
          .info{
            padding: 0.5rem 1rem;
            p{
              font-size: @font-size-small;
              color: @color-text-g;
              line-height: 2rem;
              &.name{
                font-size: @font-size-medium;
                color: @color-text-b;
                .wrap2;
              }
              &.price{
                color: @color-text-r;
                .red{
                  font-size: @font-size-large;
                  margin-right: 0;
                }
                .num{
                  color: @color-text-g;
                  font-size: @font-size-small;
                  float: right;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
