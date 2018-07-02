<template>
  <div>
    <div class="tour_lead">
      <div class="header-back">
        <span class="icon-back" @click="goBack()"></span>
        <input class="search" v-model="search" placeholder="请输入目的地或关键词"/>
      </div>
      <div class="tour_lead_wrap">
        <div class="swipe">
          <swiper loop auto :list="banners" :index="banners" dots-class="dots" :show-desc-mask=false dots-position="center"></swiper>
        </div>
        <div class="tour-lead-list">
          <div class="item_row item_row1">
            <div class="item item1" @click="goUrl('1')">
              精品私家团
              <!-- <img v-lazy="kinds[0].imgs" /> -->
            </div>
            <div class="item item2">
              <div class="part">
                <div class="single" @click="goUrl('2')">
                  酒店+
                  <!-- <img v-lazy="kinds[1].imgs" /> -->
                </div>
                <div class="single" @click="goUrl('3')">
                  ico+
                  <!-- <img v-lazy="kinds[2].imgs" /> -->
                </div>
              </div>
              <div class="part padded-t-5" @click="goUrl('4')">
                惊喜购
                <!-- <img v-lazy="kinds[3].imgs" /> -->
              </div>
            </div>
          </div>
          <div class="item_row item_row2">
            <div class="item item1" @click="goUrl('5')">
              当季热销
              <!-- <img v-lazy="kinds[4].imgs" /> -->
            </div>
            <div class="item item2">
              <div class="part part2">
                <div class="single" @click="goUrl('6')">
                  私人订制
                  <!-- <img v-lazy="kinds[5].imgs" /> -->
                </div>
                <div class="single" @click="goUrl('7')">
                  奢享之旅
                  <!-- <img v-lazy="kinds[6].imgs" /> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {Swiper, SwiperItem} from 'vux'
export default {
  components: {Swiper, SwiperItem},
  data() {
    return {
      title: '旅游服务',
      search: '',
      banners: [],
      kinds: []
    }
  },
  mounted() {
    this._initBanner()
    this._initkinds()
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    goUrl(itemId) {
      if(itemId === '2'){
        this.$router.push({path: `/hotel`})
      }else if(itemId === '1'){
        this.$router.push({path: `/tour`,query: {page: itemId, modelType: 0}})
      }else if(itemId === '3'){
        this.$router.push({path: `/tour`,query: {page: itemId, modelType: 1}})
      }else if(itemId === '4'){
        this.$router.push({path: `/tour`,query: {page: itemId, modelType: 2}})
      }else if(itemId === '5'){
        this.$router.push({path: `/tour`,query: {page: itemId, modelType: 3}})
      }else if(itemId === '6'){
        this.$router.push({path: `/customizedLead`})
      }else if(itemId === '7'){
        this.$router.push({path: `/tour`,query: {page: itemId, modelType: 4}})
      }
    },
    _initBanner () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'GET',
        url: 'http://bravrshow.com/api2/findAllImg.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.banners = res.data.data.map((item) => {
              return {
                url: '',
                img: item.imgs,
                title: item.sceneryName
              }
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _initkinds () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'GET',
        url: 'http://bravrshow.com/api2/findAllPage.service?token=' + token
      }).then((res) => {
        if (res.status === 200) {
          _this.kinds = res.data.data
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
  .tour_lead{
    position: fixed;
    top:0;
    width: 100%;
    bottom:0;
    background:#eee;
    overflow: hidden;
    z-index: 100;
    .header-back{
      position: fixed;
      top:0;
      width: 100%;
      height: 5rem;
      background: #fff;
      padding: 0 5rem;
      border-bottom: 1px solid #ddd;
      z-index: 100000000;
      box-sizing: border-box;
      .icon-back{
        position: absolute;
        width: 5rem;
        height: 5rem;
        top:0;
        left: 0;
        background: url("../../common/images/icons/icon-back.png") center center no-repeat;
        background-size: 1rem ;
      }
      .search{
        width: 100%;
        height: 3rem;
        border-radius: 20px;
        outline: none;
        padding-left: 2rem;
        margin-top: 1rem;
        border: 0;
        background: #dedede;
      }
    }
    .tour_lead_wrap{
      position: fixed;
      top: 5rem;
      width: 100%;
      bottom:0;
      display: flex;
      flex-direction: column;
      .swipe{
        height: 170px;
        .vux-slider > .vux-swiper {
          height: 170px !important;
        }
      }
      .tour-lead-list{
        flex: 1;
        position: relative;
        overflow: hidden;
        margin-top: 5px;
        .item_row{
          &.item_row1{
            height: 60%;
          }
          &.item_row2{
            height: 40%;
            margin-top: 5px;
          }
          .item{
            display: inline-block;
            width: 50%;
            height: 100%;
            float: left;
            box-sizing: border-box;
            &.item1{
              padding-right: 1%;
            }
            &.item2{
              .part{
                height: 50%;
                &.padded-t-5{
                  padding-top: 5px;
                  box-sizing: border-box;
                }
                &.part2 {
                  height: 100%;
                }
                .single{
                  display: inline-block;
                  width: 50%;
                  float: left;
                  height: 100%;
                  padding-right: 1%;
                  box-sizing: border-box;
                  &:last-child{
                    padding-right: 0;
                  }
                }
              }
            }
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
