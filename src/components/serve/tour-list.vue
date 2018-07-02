<template>
  <div class="tour_list_w">
    <div class="tour_list">
      <div class="item" v-for="item in data" :key="item.id" @click="goUrl(item.id)">
        <img class="img" v-lazy="getImgObj(item.fm)" />
        <div class="info">
          <p class="name">{{item.name}}</p>
          <p class="score">{{item.count}}人消费</p>
          <p class="price"><span class="red">￥{{item.price}}</span> 起</p>
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
    },
    type: {
      type: String,
      default: 'tour'
    }
  },
  methods: {
    getImgObj(src){
      let imgObj = {
        src: src,
        error: require('../../common/images/hotel-default.png'),
        loading: require('../../common/images/hotel-default.png')
      }
      return imgObj
    },
    goUrl(id) {
      if (this.type === 'tour'){
        this.$router.push({path: `/tour/${id}`})
      } else if (this.type === 'star') {
        this.$router.push({path: `/mallStar/${id}`})
      } else if (this.type === 'news') {
        this.$router.push({path: `/mallNews/${id}`})
      }
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .tour_list_w{
    .tour_list{
      .item{
        background: @color-text-w;
        position: relative;
        height: 12rem;
        margin: 1rem 0;
        .img{
          position: absolute;
          top:0;
          left: 0;
          height: 12rem;
        }
        .info{
          padding: 0 1rem 0 16rem;
          p{
            font-size: @font-size-small;
            color: @color-text-g;
            line-height: 2.5rem;
            span{
              display: inline-block;
              margin-right: 1rem;
            }
            &.name{
              font-size: @font-size-large;
              padding-left: 3rem;
              color: @color-text-b;
              padding-top: 1rem;
              text-indent: 2rem;
              min-height: 4rem;
              .wrap2;
            }
            &.score{
              padding-left: 2rem;
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
</style>
