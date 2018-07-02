<template>
  <div class="mine_collection">
    <header-back :title="title"></header-back>
    <scroll class="mine_collection_wrap">
      <div style="padding-bottom: 3rem">
        <swipeout class="hotel_list">
          <swipeout-item transition-mode="follow" class="item"  v-for="item in hotelList" :key="item.hotel.id">
            <div slot="right-menu">
              <swipeout-button @click.native="deleteCollection(item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="content"  @click="goUrl(item.hotel.id)">
              <img class="img" v-lazy="getImgObj(item.hotel.fm)"/>
              <div class="info">
                <p class="name" v-html="item.hotel.name"></p>
                <p class="score"><span class="lg">10分</span><span>{{item.count}}人消费</span></p>
                <p class="place"><span>{{item.hotel.qu}}</span><span>距离我{{getDistance(item.mi)}}</span></p>
                <p class="price"><span class="red">￥{{floatPrice(item.price)}}</span> 起</p>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </div>
    </scroll>
    <actionsheet v-model="showAct" :menus="actMsg" @on-click-menu-delete="onDelete(hotelId)" show-cancel></actionsheet>
    <div class="loading-container" v-if="hotelList.length===0">
      <loading v-if="!listEmpty"></loading>
      <empty v-if="listEmpty"></empty>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Empty from 'components/base/empty'
import Loading from 'components/base/loading'
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import {ToastPlugin,Actionsheet, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Loading, Empty, Scroll, HeaderBack,Actionsheet, Swipeout, SwipeoutItem, SwipeoutButton},
  data () {
    return {
      title: '我收藏的酒店',
      listEmpty: false,
      hotelList: [],
      hotelId: '',
      showAct: false,
      actMsg: {
        'title.noop': '确定删除吗?',
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created() {
    this._initCollection()
  },
  methods: {
    deleteCollection(id) {
      this.showAct = true
      this.hotelId = id
    },
    onDelete(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/deleteUserHotel.service?token=' + token + '&userHotelId=' + id).then((res) => {
        if (res.data.status === 200) {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
          _this._initCollection()
        } else {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除失败',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    _addRecord (id) {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let _this = this
      let params = {
        userId: userId,
        hotelId: id
      }
      this.$axios({
        method: 'post',
        url:  '/api/saveUserRecord.service?token=' + token,
        data: JSON.stringify(params),
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
      }).catch((error) => {
        console.log(error)
      })
    },
    getImgObj(src){
      let imgObj = {
        src: src,
        error: require('../../common/images/hotel-default.png'),
        loading: require('../../common/images/hotel-default.png')
      }
      return imgObj
    },
    goUrl(id) {
      console.log(this.$route.path)
      this._addRecord(id)
      this.$router.push({path: `/hotel/hotel${id}`, query: {hotelId: id}})
    },
    getDistance(mi) {
      if (mi > 1000) {
        return (mi / 1000).toFixed(2) + 'km'
      } else {
        return mi.toFixed(2) + 'm'
      }
    },
    _initCollection () {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let lat = sessionStorage.getItem('lat')
      let lng = sessionStorage.getItem('lng')
      this.$axios({
        method: 'get',
        url: '/api/getUserHotel.service?token=' + token + '&userId=' + userId + '&lat=' + lat + '&lng=' + lng
      }).then((res) => {
        if (res.status === 200) {
          _this.hotelList = res.data.data
          console.log(_this.hotelList)
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
<style scoped lang="less">
  @import "../../common/css/variable.less";
  .mine_collection {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #eee;
    z-index: 1000;
    .mine_collection_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .hotel_list{
        padding-bottom: 2rem;
        .item{
          background: @color-text-w;
          margin: 1rem 0;
          .content{
            position: relative;
            height: 12rem;
            .img{
              position: absolute;
              top:0;
              left: 0;
              height: 12rem;
            }
            .info{
              padding: 0 1rem 0 16rem;
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
                  padding-left: 5rem;
                  color: @color-text-b;
                  padding-top: 1rem;
                }
                &.score{
                  padding-left: 3rem;
                  .lg{
                    font-size: @font-size-large;
                    color: @color-text-b;
                  }
                }
                &.place{
                  padding-left: 1rem;
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
      }
    }
  }
</style>
