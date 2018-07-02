<template>
  <div>
    <div class="hotel_list">
      <div class="item" v-for="item in data" :key="item.hotel.id" @click="goUrl(item.hotel.id)">
        <img class="img" v-lazy="getImgObj(item.hotel.fm)"/>
        <div class="info">
          <p class="name" v-html="item.hotel.name"></p>
          <p class="score"><span class="lg">10分</span><span>{{item.count}}人消费</span></p>
          <p class="place"><span>{{item.hotel.qu}}</span><span>距离我{{getDistance(item.mi)}}</span></p>
          <p class="price"><span class="red">￥{{floatPrice(item.price)}}</span> 起</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
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
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .hotel_list{
    padding-bottom: 2rem;
    .item{
      background: @color-text-w;
      position: relative;
      height: 12rem;
      margin: 1rem 0;
      .img{
        height: 12rem;
      }
      .info{
        padding: 0 1rem 0 16rem;
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
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
</style>
