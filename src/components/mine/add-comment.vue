<template>
  <div class="add_comment">
    <header-back :title="title"></header-back>
    <div class="add_comment_wrap">
      <div>
        <group>
          <cell title="打分">
            <rater v-model="score"></rater>
          </cell>
        </group>
        <group>
          <x-textarea v-model="content"  class="textarea" :max="200" placeholder="评论内容"></x-textarea>
        </group>
        <group>
          <div class="upImg">
            <div class="upImgBtn" @click="uploadInvoice">
              <img src="../../common/images/upload-default.png"/>
            </div>
            <div class="upImgList" id="upImgList">
              <div class="item" v-for="(item, index) in upImgList" :key="index">
                <img :src="item"/>
              </div>
            </div>
          </div>
        </group>
      </div>
    </div>
    <div class="add_comment_handle">
      <div class="buy" @click="save">立即发布</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
import {Rater, Group, Cell, XTextarea, ToastPlugin} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Rater, Group, Cell, XTextarea},
  data () {
    return {
      title: '发表评论',
      type: this.$route.query.type,
      id: this.$route.query.id,
      roomId: this.$route.query.roomId,
      score: 0,
      content: '',
      upImgList: [],
      imgs: ''
    }
  },
  created() {
  },
  methods: {
    uploadImg(img) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/appfileUpload.service?token=' + token + '&mediaId=' + img).then((res) => {
        if (res.data.status === 200) {
          _this.upImgList.push(res.data.data)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    uploadInvoice(){
      let _this = this
      wx.ready(function() {
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            wx.uploadImage({
              localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                let serverId = res.serverId; // 返回图片的服务器端ID
                _this.uploadImg(serverId)
              }
            })
          }
        })
      })
    },
    msg(msg) {
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        time: '1000',
        width: '20rem',
        position: 'middle'
      })
    },
    save(){
      let alertMsg = ''
      let token = sessionStorage.getItem('token')
      let _this = this
      let userId = sessionStorage.getItem('userId')
      let score = this.score
      let content = this.content
      let imgs = this.upImgList.join('___')
      let type = this.type
      let params = {}
      if (type == '1'){
        params = {
          hotelId: this.id,
          roomId: this.roomId,
          type: type,
          score: score,
          content: content,
          imgs: imgs,
          userId:userId
        }
      } else if(type === '2'){
        params = {
          commodityId: this.id,
          type: type,
          score: score,
          content: content,
          imgs: imgs,
          userId:userId
        }
      }
      if (!score) {
        alertMsg = '请打分'
      } else if (!content) {
        alertMsg = '请填写评论内容'
      } else {
        this.$axios({
          method: 'post',
          url: '/api/addComment.service?token=' + token,
          data: JSON.stringify(params),
          headers: {'Content-Type': 'application/json'}
        })
          .then((res) => {
            if (res.status === 200) {
              _this.msg('操作成功')
              setTimeout(function () {
                _this.$router.back()
              }, 1000)
            } else {
              _this.msg('系统错误')
            }
          }).catch((error) => {
          console.log(error)
        })
      }
      if (alertMsg !== ''){
        _this.msg(alertMsg)
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "../../common/css/variable.less";
.add_comment{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#fff;
  overflow: hidden;
  z-index: 1000;
  .add_comment_wrap{
    padding-top: 4.5rem;
    overflow: hidden;
    .weui-cells{
      margin-top: 0 !important;
      padding-top: 1rem !important;
      background: #eee !important;
    }
    .weui-cells:before,.weui-cells:after{
      display: none !important;
    }
    .weui-cell{
      background: #fff !important;
    }
    .handle{
      padding: 1rem;
      text-align: center;
      .order_button{
        margin-right: 2rem;
      }
    }
    .upImg{
      background: #fff;
      padding: 1rem;
      .upImgBtn{
        position: relative;
        img{
          width: 8rem;
          height: 8rem;
          border-radius: 4px;
        }
        .uploadImg{
          width: 8rem;
          height: 8rem;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
        }
      }
      .upImgList{
        .item{
          display: inline-block;
          margin: 0 1rem 1rem 0;
          img{
            width: 8rem;
            height: 8rem;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .add_comment_handle{
    display: flex;
    position: fixed;
    bottom: 0;
    height: 5rem;
    line-height: 5rem;
    width: 100%;
    font-size: 1.5rem;
    text-align: center;
    color: #fff;
    align-items: center;
    .buy{
      flex: 1;
      background: #3366cc;
    }
  }
}
</style>
