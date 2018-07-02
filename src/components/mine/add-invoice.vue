<template>
  <div class="add_invoice">
    <header-back :title="title"></header-back>
    <scroll class="add_invoice_wrap">
      <div class="write_content"  style="padding-bottom: 3rem">
        <group label-width="9rem" label-margin-right="2rem" label-align="left">
          <div class="input_row">
            <label>单位名称</label><input v-model="company" placeholder="必填">
          </div>
          <div class="input_row phone">
            <label>纳税人辨识码</label><input v-model="num" placeholder="必填">
          </div>
          <div class="input_row">
            <label>注册地址</label><input v-model="address" placeholder="">
          </div>
          <div class="input_row">
            <label>注册电话</label><input v-model="phone" placeholder="">
          </div>
          <div class="input_row">
            <label>开户银行</label><input v-model="bank" placeholder="">
          </div>
          <div class="input_row">
            <label>银行账号</label><input v-model="bankAccount" placeholder="">
          </div>
        </group>
        <group>
          <div class="upload_row" @click="uploadInvoice">
            <p class="title">上传发票信息</p>
            <img class="upImg" v-lazy="imgInvoice" />
          </div>
        </group>
      </div>
    </scroll>
    <div class="handle">
      <div class="save" @click="saveInvoice">保存</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import wx from 'weixin-js-sdk'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, Cell, CellBox, Datetime, Picker, XTextarea},
  data () {
    return {
      title: '添加发票',
      queryId: this.$route.query.id,
      company: '',
      num: '',
      phone: '',
      address: '',
      bank: '',
      imgInvoice: '',
      file: '',
      bankAccount: ''
    }
  },
  created() {
    if (this.queryId > 0) {
      this.title = '编辑发票'
      this._initInvoice()
    }
  },
  methods: {
    uploadImg(img) {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/appfileUpload.service?token=' + token + '&mediaId=' + img).then((res) => {
        if (res.data.status === 200) {
          _this.imgInvoice = res.data.data
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
    _initInvoice () {
      let _this = this
      this.$axios.get('/api/getUserInvoice.service?token=22&id=' + this.queryId).then((res) => {
        if (res.status === 200) {
          _this.company = res.data.data[0].name
          _this.num = res.data.data[0].sbm
          _this.phone = res.data.data[0].phone
          _this.address = res.data.data[0].address
          _this.bank = res.data.data[0].bank
          _this.bankAccount = res.data.data[0].bankAccount
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    saveInvoice() {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let alertMsg = ''
      let _this = this
      let name = this.company
      let sbm = this.num
      let phone = this.phone
      let address = this.address
      let bank = this.bank
      let bankCard = this.bankAccount
      let type = ''
      let params = {}
      if (!name) {
        alertMsg = '请填写单位名称'
      } else if (!sbm) {
        alertMsg = '请填写识别码'
      } else {
        if (this.queryId > 0) {
          type = 'updateUserInvoice'
          params = {
            id: this.queryId,
            name: name,
            sbm: sbm,
            phone: phone,
            userId: userId,
            address: address,
            bank: bank,
            bankCard: bankCard,
            img: this.imgInvoice
          }
        } else {
          type = 'addUserInvoice'
          params = {
            name: name,
            sbm: sbm,
            phone: phone,
            userId: userId,
            address: address,
            bank: bank,
            bankCard: bankCard,
            img: this.imgInvoice
          }
        }
        this.$axios({
          method: 'post',
          url: '/api/' + type + '.service?token=' + token,
          data: params,
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
<style lang="less">
  @import "../../common/css/variable.less";
  .add_invoice {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 1000;
    .add_invoice_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 6rem;
      .write_content{
        .date_time{
          text-decoration: none !important;
          color: #3b3b3b !important;
          font-size: @font-size-large !important;
          line-height: 22px;
        }
        .weui-cells{
          margin-top: 1rem;
        }
        .weui-cells:after, .weui-cell:before{
          display: none;
        }
        .weui-label{
          font-size: @font-size-large;
          line-height: 24px;
        }
        .weui-textarea{
          font-size: @font-size-medium;
        }
        .input_row{
          padding: 1rem 1.5rem;
          position: relative;
          display: flex;
          align-items: center;
          &:after{
            .halfBorderLineB;
          }
          label{
            font-size: @font-size-large;
            width: 9rem;
            margin-right: 2rem;
            display: inline-block;
          }
          input{
            border: 1px solid #eee;
            border-radius: 4px;
            font-size: @font-size-medium;
            height: 26px;
            flex: 1;
            text-indent: 1rem;
            caret-color: #3b3b3b;
          }
          button.identify {
            position: absolute;
            right: 2rem;
            background: @color-theme;
            color: #fff;
            border: 0;
            font-size: 1.2rem;
            height: 2.4rem;
            padding: 0 0.5rem;
            border-radius: 3px;
          }
        }
        .upload_row{
          position: relative;
          .uploadImg{
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
          .title{
            font-size: @font-size-medium;
            line-height: 4.5rem;
            padding-left: 1.5rem;
          }
          .upImg{
            width: 80%;
            margin-left: 10%;
          }
        }
      }
    }
    .handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      line-height: 5rem;
      width: 100%;
      font-size: 1.6rem;
      text-align: center;
      border-top: 1px solid #ddd;
      color: #fff;
      background: #fff;
      .save{
        flex: 1;
        background: @color-theme;
      }
    }
  }
</style>
