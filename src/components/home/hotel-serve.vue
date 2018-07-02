<template>
  <div class="hotel_serve">
    <header-back :title="title"></header-back>
    <scroll class="hotel_serve_wrap">
      <div>
        <div class="serve">
          <p class="title">可提供服务</p>
          <div class="ico_row">
            <p v-for="item in codes" :key="item.id">
              <img class="icon" :src="item.icon">
              <span class="text">{{item.content}}</span>
            </p>
          </div>
        </div>
        <div class="traffic">
          <p class="title">交通信息</p>
          <div v-html="bus"></div>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
export default {
  components: {Scroll, HeaderBack},
  data () {
    return {
      title: '尊享服务',
      codes: [],
      bus: ''
    }
  },
  created() {
    this._getHotel()
  },
  methods: {
    _getHotel () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: '/api/getHotelRoom.service?token=' + token + '&hotelId=' + _this.$route.query.hotelId
      }).then((res) => {
        if (res.status === 200) {
          _this.bus = res.data.data.hotel.bus
          let codes = res.data.data.codes
          if(codes.length > 5){
            for(let i = 0; i < 5; i++){
              _this.codes.push(codes[i])
            }
          }else{
            _this.codes = res.data.data.codes
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
  .hotel_serve {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 10000;
    .hotel_serve_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      .serve{
        background: @color-text-w;
        padding: 1rem;
        margin-bottom: 1rem;
        .title{
          font-size: @font-size-large;
          line-height: 4rem;
        }
        .ico_row{
          p{
            display: inline-block;
            text-align: center;
            margin-right: 1rem;
            padding: 1rem;
            .icon{
              width: 1.5rem;
            }
            .text{
              display: block;
              font-size: @font-size-small-s;
            }
          }
        }
      }
      .traffic {
        background: @color-text-w;
        padding: 1rem 1rem 2rem 1rem;
        margin-bottom: 1rem;
        .title{
          font-size: @font-size-large;
          line-height: 3rem;
        }
      }
    }
  }
</style>
