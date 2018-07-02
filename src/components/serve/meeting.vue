<template>
  <div class="meeting_book">
    <header-back :title="title"></header-back>
    <div class="meeting_book_wrap">
      <div class="write_content">
        <group label-width="8rem" label-margin-right="2rem" label-align="left">
          <!--<div class="input_row">
            <label>选择用途</label>
            <checker v-model="purpose" radio-required default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="0">活动场地</checker-item>
              <checker-item value="1">会议房间</checker-item>
            </checker>
          </div>-->
          <datetime title="开始时间" v-model="startTime" value-text-align="left" class="date_time"></datetime>
          <datetime title="结束时间" v-model="endTime" value-text-align="left" class="date_time"></datetime>
          <x-address title="会议地址" class="address" v-model="address" value-text-align="left" raw-value :list="addressData"></x-address>
          <div class="input_row">
            <label>姓名</label><input v-model="name" placeholder="请填写您的姓名">
          </div>
          <div class="input_row phone">
            <label>电话</label><input type="number" v-model="phone" placeholder="请填写联系电话">
          </div>
          <div class="input_row">
            <label>参加人数</label><input type="number" v-model="num" placeholder="">
          </div>
          <div class="input_row">
            <label>预算经费</label><input type="number" v-model="price" placeholder="元">
          </div>
          <div class="input_row">
            <label>需求</label>
            <checker v-model="tea" radio-required default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="0">会场</checker-item>
              <checker-item value="1">住宿</checker-item>
              <checker-item value="2">餐饮</checker-item>
              <checker-item value="3">茶歇</checker-item>
            </checker>
          </div>
        </group>
        <group>
          <x-textarea v-model="serve"  class="textarea" :max="100" placeholder="请在此处写下您的需求: 如尽快安排房间等"></x-textarea>
        </group>
      </div>
    </div>
    <div class="meeting_handle">
      <div class="buy" @click="buy">立即预约</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name, CellBox, Datetime, Picker, ToastPlugin, XTextarea, Checker, CheckerItem } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, XAddress, Group, Cell, CellBox, Datetime, Picker, XTextarea, Checker, CheckerItem},
  data () {
    return {
      title: '会议预订',
      purpose: '0',
      startTime: '',
      endTime: '',
      name: '',
      phone: '',
      num: '',
      price: '',
      addressData: ChinaAddressV4Data,
      address: [],
      tea: '0',
      serve: ''
    }
  },
  created() {
  },
  methods: {
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
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
    buy() {
      let alertMsg = ''
      let token = sessionStorage.getItem('token')
      let _this = this
      let startTime = this.startTime
      let endTime = this.endTime
      let name = this.name
      let phone = this.phone
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let address = this.getName(this.address)
      let num = this.num
      let price = this.price
      let params = {
        name: name,
        phone: phone,
        talkTime: startTime + '  ' + endTime,
        address: address,
        num: num,
        price: price,
        isTalk: this.tea,
        /*yt: this.purpose,*/
        otherContent: this.serve
      }
      if (!startTime) {
        alertMsg = '请填写开始时间'
      } else if (!endTime) {
        alertMsg = '请填写结束时间'
      } else if (!name) {
        alertMsg = '请填写您的姓名'
      } else if (!phone) {
        alertMsg = '请填写联系电话'
      } else if (!regPhone.test(phone)) {
        alertMsg = '联系电话格式不正确'
      } else if (!address) {
        alertMsg = '请填写会议地址'
      } else if (!num) {
        alertMsg = '请填写参加人数'
      } else if (!price) {
        alertMsg = '请填写预算经费'
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
  .meeting_book {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .meeting_book_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      overflow-y: auto;
      .write_content{
        padding-bottom: 3rem;
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
        .vux-cell-value{
          font-size: @font-size-medium;
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
            width: 8rem;
            min-width: 8rem;
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
        }
      }
    }
    .meeting_handle{
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
