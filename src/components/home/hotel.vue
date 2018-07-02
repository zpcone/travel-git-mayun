<template>
  <div>
    <div class="hotel_page">
      <header-back :title="title"></header-back>
      <div class="hotel_top_list">
        <p class="address">
          <x-address title="区域位置"  @on-hide="addsSearch" @on-show="checkMask" class="province" v-model="address" raw-value :list="addressData"></x-address>
        </p>
        <p  @click="layerOpen('range')">价格<span class="icon-down"></span></p>
        <p  @click="layerOpen('xinji')">星级<span class="icon-down"></span></p>
        <p  @click="layerOpen('shang')">选择商圈<span class="icon-down"></span></p>
      </div>
      <div class="hotel_layer_bg" :class="{ active: isActive }" @click="layerClose"></div>
      <div class="hotel_layer_wrap" :class="{ active: isActive }">
        <div class="xinji" v-show="sType === 'xinji'">
          <checklist :max="1" label-position="left" :options="xinjiList" v-model="xinjiListValue"></checklist>
        </div>
        <div class="priceRange" v-show="sType === 'range'">
          <div id="noRange" class="no_range" style="margin-bottom: 5rem"></div>
        </div>
        <div class="xinji" v-show="sType === 'shang'">
          <checklist :max="1" label-position="left" :options="shangList" v-model="shangListValue"></checklist>
        </div>
        <div class="handle">
          <x-button mini class="btn" @click.native="searchReset">重置</x-button>
          <x-button mini class="btn confirm" @click.native="searchConfirm">确认</x-button>
        </div>
      </div>
      <scroll class="hotel_list_wrap" :data="hotelList">
        <hotel-list :data="hotelList"></hotel-list>
      </scroll>
      <div class="loading-container" v-if="hotelList.length===0">
        <loading v-if="!listEmpty"></loading>
        <empty v-if="listEmpty"></empty>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Loading from 'components/base/loading'
import Empty from 'components/base/empty'
import Scroll from 'components/base/scroll'
import HotelList from './hotel-list'
import noUiSlider from 'nouislider'
import { Checklist,XAddress,XButton, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
export default {
  components: {HotelList,Empty, Loading,XButton, XAddress, HeaderBack, Scroll, Checklist},
  data() {
    return {
      title: '酒店+',
      addressData: ChinaAddressV4Data,
      isActive: false,
      listEmpty: false,
      lng: this.$route.query.lng,
      lat: this.$route.query.lat,
      sType: 'xinji',
      hotelList: [],
      xinjiList: [{key: '0', value: '经济型'}, {key: '1', value: '舒适/三星'}, {key: '2', value: '高档/四星'}, {key: '3', value: '豪华/五星'}],
      xinjiListValue: [],
      shangListValue:[],
      shangList:[],
      sLat: '',
      sLng: '',
      address: [],
      priceRange: [],
      price: false,
      grade: false,
      district: false
    }
  },
  created() {
    let shi = sessionStorage.getItem('dingwei')
    this._initHotel('shi', shi, 'lng', this.lng, 'lat',this.lat)
    this._initShang()
  },
  mounted(){
    this.initRange()
  },
  methods: {
    initRange(){
      let _this = this
      let noRange = document.getElementById('noRange')
      noRange.style.height = '10px';
      noUiSlider.create(noRange, {
        start: [0, 2000],
        connect: true,
        step: 100,
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
          'max': 2000
        },
        pips: {
          mode: 'positions',
          values: [0,25,50,75,100],
          density: 5
        }
      })
      noRange.noUiSlider.on('update', function(values, handle) {
        _this.priceRange[handle] = parseInt(values[handle])
      })
    },
    searchReset(){
      let _this = this
      if (this.sType === 'xinji') {
        this.xinjiListValue = []
      } else if (this.sType === 'shang') {
        this.shangListValue = []
      } else if (this.sType === 'range') {
        let noRange = document.getElementById('noRange')
        noRange.noUiSlider.set([0, 2000]);
      }
    },
    searchConfirm(){
      let _this = this
      if (this.sType === 'xinji') {
        let level = this.xinjiListValue[0]
        this._initHotel('level', level)
      } else if (this.sType === 'shang') {
        let shang = this.shangListValue
        this._initlan(shang)
      } else if (this.sType === 'range') {
        this._initHotel('price', this.priceRange[0],'maxPrice', this.priceRange[1])
      }
      this.isActive = false
    },
    checkMask(){
      if(this.isActive){
        this.isActive = false
      }
    },
    addsSearch(boolean){
      if(boolean){
        let address = this.getName(this.address).split(' ')[2]
        this._initHotel('qu', address)
      }
    },
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    layerOpen(con) {
      this.sType = con
      this.isActive = true
    },
    layerClose() {
      this.isActive = false
    },
    _initShang () {
      let token = sessionStorage.getItem('token')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/codes.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data.data)
          let list = res.data.data.filter(item => item.name === '商圈')
          list.forEach((item, index) => {
            _this.shangList.push({
              key: item.content,
              value: item.content
            })
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _initlan (address) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getJwd.service?token=' + token + '&address=' + address
      }).then((res) => {
        if (res.status === 200) {
          let data = JSON.parse(res.data.data)
          let location = data.result.location
          _this.sLng = location.lng
          _this.sLat = location.lat
          _this._initHotel('lat', _this.sLat, 'lng', _this.sLng)

        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _initHotel (arg1,arg1v,arg2,arg2v,arg3,arg3v) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getHotel.service?token=' + token + '&' + arg1 + '=' + arg1v + '&' + arg2 + '=' + arg2v + '&' + arg3 + '=' + arg3v
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data.data)
          _this.hotelList = res.data.data
          if(_this.hotelList.length === 0){
            _this.listEmpty = true
          }
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
  .hotel_page{
    position: fixed;
    top:0;
    width: 100%;
    bottom:0;
    background:#eee;
    overflow: hidden;
    z-index: 100;
    .hotel_layer_bg{
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
    .hotel_layer_wrap {
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
    .hotel_top_list{
      position: fixed;
      top:4.5rem;
      width: 100%;
      height: 4.5rem;
      background: @color-text-w;
      line-height: 4.5rem;
      font-size: @font-size-medium;
      text-align: center;
      display: flex;
      z-index: 1000;
      .address{
        .weui-cell{
          padding: 0;
        }
        .weui-cell__hd{
          width: 100%;
        }
        .weui-cell_access .weui-cell__ft, .vux-cell-value{
          display: none;
        }
      }
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
    .hotel_list_wrap{
      position: fixed;
      top:9rem;
      width: 100%;
      bottom:0;
    }
  }
</style>
