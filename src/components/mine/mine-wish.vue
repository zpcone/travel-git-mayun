<template>
  <div class="mine_wish">
    <header-back :title="title"></header-back>
    <div class="mine_wish_wrap">
      <div class="msg">
        <group>
          <x-textarea v-model="content"  :rows="5" autosize class="textarea" placeholder="谢谢你的意见或建议"></x-textarea>
          <div class="upImg">
            <div class="upImgBtn" @click="uploadInvoice" v-if="canUpload">
              <img src="../../common/images/upload-default.png"/>
            </div>
            <div class="upImgList" id="upImgList">
              <div class="item" v-for="(item, index) in upImgList" :key="index">
                <img :src="item"/>
                <icon type="clear" class="delete" @click.native="delImg(index)"></icon>
              </div>
            </div>
          </div>
        </group>
        <div class="imgs_num">
          <span>{{upImgList.length}}</span>/3
        </div>
      </div>
      <p class="tip">每一条反馈JR旅游都会认真对待，我们将定期选出优秀反馈意见，发送积分奖励哦</p>
    </div>
    <div class="add_comment_handle">
      <div class="buy" @click="save">立即提交</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import HeaderBack from 'components/base/header-back'
import {Rater, Group, Cell, XTextarea, ToastPlugin, Icon} from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Rater, Group, Cell, XTextarea, Icon},
  data () {
    return {
      canUpload: true,
      title: '我的心愿单',
      content: '',
      upImgList: [],
      imgs: ''
    }
  },
  methods: {
    delImg(index) {
      this.upImgList.splice(index, 1)
      this.checkUpload()
    },
    checkUpload() {
      if (this.upImgList.length >= 3) {
        this.canUpload = false
      } else {
        this.canUpload = true
      }
    },
    uploadImg(img) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/appfileUpload.service?token=' + token + '&mediaId=' + img).then((res) => {
        if (res.data.status === 200) {
          _this.upImgList.push(res.data.data)
          _this.checkUpload()
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
      let token = sessionStorage.getItem('token')
      let _this = this
      let userId = sessionStorage.getItem('userId')
      let content = this.content
      let imgs = this.upImgList.join('___')
      if (!content) {
        _this.msg('请填写反馈内容')
        return false
      } else {
        this.$axios({
          method: 'get',
          url: '/api/saveWish.service?token=' + token + '&userId=' + userId + '&content=' + content + '&img=' + imgs
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "../../common/css/variable.less";
.mine_wish{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#fff;
  overflow: hidden;
  z-index: 1000;
  .mine_wish_wrap{
    padding-top: 4.5rem;
    overflow: hidden;
    .msg{
      padding: 10px 5px 0 5px;
      position: relative;
      .imgs_num{
        position: absolute;
        bottom: 5px;
        right: 10px;
        font-size: 15px;
        color: #666;
      }
    }
    .weui-cells{
      margin-top: 0 !important;
      padding-top: 0 !important;
      background: #eee !important;
      border: 1px solid #ddd;
    }
    .weui-cells:before,.weui-cells:after{
      display: none !important;
    }
    .weui-cell{
      background: #fff !important;
    }
    .upImg{
      background: #fff;
      padding: 1rem 1rem 0;
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
          margin: 0 1rem 0.5rem 0;
          position: relative;
          img{
            width: 8rem;
            height: 8rem;
            border-radius: 4px;
          }
          .delete{
            position: absolute;
            right: -12px;
            top:-8px;
            font-size: 20px;
            color: #e64340;
          }
        }
      }
    }
    .tip{
      font-size: 1.2rem;
      color: #888;
      line-height: 1.8rem;
      margin-top: 1rem;
      padding: 0 1rem;
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
