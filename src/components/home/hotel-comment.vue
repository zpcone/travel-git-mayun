<template>
  <div class="hotel_comment">
    <header-back :title="title"></header-back>
    <div class="hotel_comment_wrap">
      <tab :line-width="1" custom-bar-width="60px" active-color="#3366cc">
        <tab-item selected @on-item-click="onItemClick">全部</tab-item>
        <tab-item @on-item-click="onItemClick">晒图</tab-item>
      </tab>
      <scroll class="comment_list">
        <div style="padding-bottom: 2rem">
          <div class="item" v-for="(item, index) in commentList" :key="index">
          <img class="img" v-lazy="item.user.headimg">
          <div class="info">
            <p class="name">{{item.user.name}}</p>
            <p class="room_name" v-if="item.room">{{item.room.name}}</p>
            <rater class="score" :font-size="16" v-model="dataNumModel[index].score"></rater>
            <p class="room_comment">{{item.comment.content}}</p>
            <div class="img_list">
              <img v-if="item != ''" v-for="item in imgList[index]" :key="item" :src="item"/>
            </div>
          </div>
        </div>
        </div>
      </scroll>
    </div>
    <div class="loading-container" v-if="commentList.length===0">
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
      title: '用户评论',
      commentList: [],
      listEmpty: false,
      dataNumModel: [],
      imgList: [],
      comment: {},
      hotel: {},
      user: {},
      hotelId: this.$route.query.hotelId || '',
      goodsId: this.$route.query.goodsId || ''
    }
  },
  created() {
    this.getCommentList(0)
  },
  methods: {
    onItemClick(index) {
      this.getCommentList(index)
    },
    getCommentList (index) {
      let _this = this
      let token = sessionStorage.getItem('token')
      let params
      if(this.hotelId != ''){
        params = {
          type: 1,
          hotelId: this.hotelId
        }
      }else if(this.goodsId != ''){
        params = {
          type: 2,
          commodityId: this.goodsId
        }
      }
      this.$axios({
        method: 'post',
        url: '/api/getHotelComment.service?token=' + token,
        data: params,
        headers: {'Content-Type': 'application/json'}
    }).then((res) => {
        if (res.status === 200) {
          if(index === 1){
            _this.commentList = res.data.data.filter(item => item.comment.imgs != '')
          }else{
            _this.commentList = res.data.data
          }
          if(_this.commentList.length === 0){
            _this.listEmpty = true
          }
          console.log(_this.commentList)
          let rest = []
          _this.commentList.forEach((item, index) => {
            let imgs = item.comment.imgs.split('___')
            _this.imgList.push(imgs)
            rest.push({
              score: parseFloat(item.comment.score)
            })
          })
          _this.dataNumModel = rest
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
  .hotel_comment {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: @color-text-w;
    z-index: 1000;
    .hotel_comment_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
      .vux-tab{
        z-index: 100;
      }
      .comment_list{
        position: fixed;
        width: 100%;
        top: 9rem;
        left: 0;
        bottom: 0;
        .item{
          position: relative;
          padding:1rem 0 1rem 6rem ;
          &:after{
            .halfBorderLineB;
          }
          .img{
            position: absolute;
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            left: 1rem;
            top:1rem;
          }
          .info{
            overflow-y: auto;
            .name{
              font-size: 1.5rem;
              line-height: 2rem;
            }
            .room_name{
              font-size: @font-size-small;
              color: @color-text-g;
              line-height: 2rem;
            }
            .score{
              position: absolute;
              right: 1rem;
              top:1rem;
            }
            .room_comment{
              padding: 0.5rem 0;
              line-height: 1.6rem;
              font-size: 1.4rem;
            }
            .img_list img{
              display: inline-block;
              width: 30%;
              height: 8rem;
              margin-right: 3%;
              margin-bottom: 1rem;
              float: left;
            }
          }
        }
      }
    }
  }
</style>
