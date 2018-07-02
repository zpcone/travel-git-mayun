<template>
  <div class="business_book">
    <header-back :title="title"></header-back>
    <div class="business_book_wrap">
      <div class="write_content" style="padding-bottom: 2rem">
        <group label-width="9rem" label-align="left">
          <div class="input_row">
            <label>企业名称</label><input v-model="cName" placeholder="请填写企业名称">
          </div>
          <div class="input_row">
            <label>所属行业</label><input v-model="trade" placeholder="请填写所属行业">
          </div>
          <div class="input_row">
            <label>商旅需求</label>
            <checker v-model="purpose" radio-required default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="1">酒店</checker-item>
              <checker-item value="0">机票</checker-item>
            </checker>
          </div>
          <div class="input_row">
            <label>出差人数</label>
            <checker v-model="num" radio-required default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="0">100人以下</checker-item>
              <checker-item value="1">101-500人</checker-item>
              <checker-item value="2">501-1000人</checker-item>
              <checker-item value="3">1000人以上</checker-item>
            </checker>
          </div>
         <!-- <div class="input_row">
            <label>差旅预算</label><input v-model="price" placeholder="元/月">
          </div>-->
          <div class="input_row phone">
            <label>联系人</label><input v-model="name" placeholder="请填写联系人">
          </div>
          <div class="input_row phone">
            <label>联系电话</label><input type="number" v-model="phone" placeholder="请填写联系电话">
          </div>
        </group>
        <group style="margin-top: 1rem">
          <x-textarea  class="textarea" v-model="need" :max="200" placeholder="请在此处写下您的其他需求"></x-textarea>
        </group>
      </div>
    </div>
    <div class="business_handle">
      <div class="buy" @click="buy">立即预约</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Datetime, ToastPlugin, XTextarea, Checker, CheckerItem } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, Datetime, XTextarea, Checker, CheckerItem},
  data () {
    return {
      title: '商旅服务',
      cName: '',
      trade: '',
      purpose: '1',
      num: '0',
      price: '',
      name: '',
      phone: '',
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
      let name = this.cName
      let industry = this.trade
      let content = this.purpose
      let number = this.num
      let price = this.price
      let customer = this.name
      let otherContent = this.need
      let phone = this.phone
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let params = {
        name: name,
        industry: industry,
        content: content,
        number: number,
        /*price: price,*/
        customer: customer,
        phone: phone,
        otherContent: otherContent
      }
      if (!name) {
        alertMsg = '请填写企业名称'
      } else if (!industry) {
        alertMsg = '请填写所属行业'
      } else if (!price) {
        alertMsg = '请填写差旅预算'
      } else if (!customer) {
        alertMsg = '请填写联系人姓名'
      } else if (!phone) {
        alertMsg = '请填写联系电话'
      } else if (!regPhone.test(phone)) {
        alertMsg = '联系电话格式不正确'
      } else {
        this.$axios({
          method: 'post',
          url: '/api/saveMeeting.service?token=' + token,
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
  .business_book {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .business_book_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      overflow-y: auto;
      .write_content{
        .purpose_item {
          padding-left: 2rem;
          line-height: 1;
          margin-right: 2rem;
          font-size: @font-size-medium;
          position: relative;
          &:before{
            position: absolute;
            left: 0;
            content: '';
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: #fff;
            border:1px solid #ddd;
          }
        }
        .purpose_item_selected {
          &:before{
            border: 1px solid @color-theme;
          }
          &:after{
            position: absolute;
            left: 4px;
            top:4px;
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: @color-theme;
            border:1px solid #ddd;
          }
        }
        .date_time{
          text-decoration: none !important;
          color: #3b3b3b !important;
          font-size: @font-size-large !important;
          line-height: 22px;
          &:after{
            .halfBorderLineB;
          }
        }
        .weui-cells{
          margin-top: 0;
        }
        .weui-cells:after, .weui-cell:before, .weui-cells:before{
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
            min-width: 9rem;
            width: 9rem;
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
        }
      }
    }
    .business_handle{
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
