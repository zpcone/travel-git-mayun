<template>
  <div class="tour_submit">
    <header-back :title="title"></header-back>
    <div class="tour_submit_wrap">
      <div class="write_content">
        <group label-width="8rem" label-margin-right="2rem" label-align="left">
          <div class="input_row">
            <label>联系人</label><input v-model="name" placeholder="请填写姓名">
          </div>
          <div class="input_row phone">
            <label>联系电话</label><input v-model="phone" placeholder="请填写联系电话">
          </div>
          <div class="input_row">
            <label>跟团人数</label><input v-model="num" placeholder="请填写人数">
          </div>
        </group>
        <group>
          <x-textarea  class="textarea" v-model="need" :max="200" placeholder="请在此处写下您的其他需求"></x-textarea>
        </group>
      </div>
    </div>
    <div class="tour_submit_handle">
      <div class="buy" @click="buy">立即预约</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, Cell, CellBox, Datetime, Picker, XTextarea},
  data () {
    return {
      title: '信息提交',
      name: '',
      phone: '',
      num: '',
      need: ''
    }
  },
  methods: {
    msg(msg) {
      this.$vux.toast.show({
        type: 'text',
        text: msg,
        time: '1000',
        width: '20rem',
        position: 'middle'
      })
    },
    buy() {
      let alertMsg = ''
      let token = sessionStorage.getItem('token')
      let _this = this
      let name = this.name
      let phone = this.phone
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let num = this.num
      let content = this.need
      let params = {
        name: name,
        phone: phone,
        num: num,
        content: content,
        sceneryId: this.$route.query.id
      }
      if (!name) {
        alertMsg = '请填写您的姓名'
      } else if (!phone) {
        alertMsg = '请填写联系电话'
      } else if (!regPhone.test(phone)) {
        alertMsg = '联系电话格式不正确'
      } else if (!num) {
        alertMsg = '请填写人数'
      } else {
        this.$axios({
          method: 'post',
          url: '/api/saveSceneryOrder.service?token=' + token,
          data: JSON.stringify(params),
          headers: {'Content-Type': 'application/json'}
        })
          .then((res) => {
            if (res.status === 200) {
              _this.msg('操作成功')
              setTimeout(function () {
                _this.$router.push({path: `/orderFinish`})
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
  .tour_submit {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .tour_submit_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
      overflow-y: auto;
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
            width: 8rem;
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
      }
    }
    .tour_submit_handle{
      display: flex;
      position: fixed;
      bottom: 0;
      height: 5rem;
      line-height: 5rem;
      width: 100%;
      font-size: 1.5rem;
      text-align: center;
      color: @color-text-w;
      align-items: center;
      .buy{
        flex: 1;
        background: @color-theme;
      }
    }
  }
</style>
