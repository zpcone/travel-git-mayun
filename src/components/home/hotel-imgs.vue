<template>
  <div class="hotel_img">
    <header-back :title="title"></header-back>
    <div class="hotel_img_wrap">
      <tab :line-width="1" custom-bar-width="60px" active-color="#3366cc">
        <tab-item selected @on-item-click="onItemClick">全部({{imgList.length}})</tab-item>
        <tab-item @on-item-click="onItemClick" v-for="(value, key, index) in kindsList" :key="index">{{key}}({{value.length}})</tab-item>
      </tab>
      <scroll class="hotel_img_list">
        <div style="padding-bottom: 2rem">
          <img class="img" src="item" v-for="item in filterImg" :key="item" />
        </div>
      </scroll>
    </div>
    <div class="loading-container" v-if="imgList.length===0">
      <loading v-if="!listEmpty"></loading>
      <empty v-if="listEmpty"></empty>
    </div>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Empty from 'components/base/empty'
import Loading from 'components/base/loading'
import Scroll from 'components/base/scroll'
import {Tab, TabItem, Rater, Group, Cell} from 'vux'
export default {
  components: {Scroll, HeaderBack, Empty, Loading, Tab, TabItem, Rater, Group, Cell},
  data () {
    return {
      title: '酒店图片',
      listEmpty: false,
      imgList: [],
      kindsList: {},
      kinds:[],
      filterImg: [],
      hotelId: this.$route.query.hotelId || ''
    }
  },
  created() {
    this.getImgList()
  },
  methods: {
    onItemClick(index) {
      if(index === 0){
        this.filterImg = this.imgList
      }else{
        this.filterImg = this.kindsList[this.kinds[index - 1]]
      }
    },
    getImgList () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getHotelCode.service?token=' + token + '&hotelId=' + _this.hotelId
    }).then((res) => {
        if (res.status === 200) {
          let result = res.data.data
          _this.imgList = result
          if(result.length === 0){
            _this.listEmpty = true
          }
          result.forEach((item, index) => {
            _this.filterImg.push(item.img)
            if (_this.kindsList[item.codeName]) {
              _this.kindsList[item.codeName].push(item.img)
            } else {
              _this.kinds.push(item.codeName)
              _this.kindsList[item.codeName] = [item.img]
            }
          })
          console.log(_this.kinds)
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
  .hotel_img {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: @color-text-w;
    z-index: 1000;
    .hotel_img_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .vux-tab{
        z-index: 100;
      }
      .hotel_img_list{
        .img{
          width: 46%;
          display: inline-block;
          margin: 10px 2% 0;
        }
      }
    }
  }
</style>
