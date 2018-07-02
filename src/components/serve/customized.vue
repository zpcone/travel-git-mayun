<template>
  <div class="customized_book">
    <header-back :title="title"></header-back>
    <div class="customized_book_wrap">
      <div class="write_content">
        <group label-width="8rem" label-margin-right="2rem" label-align="left">
          <x-address title="出发地" class="address" v-model="address" value-text-align="left" raw-value :list="addressData" hide-district></x-address>
          <x-address title="目的地" class="address" v-model="destination" value-text-align="left" raw-value :list="addressData" hide-district></x-address>
          <datetime title="出发时间" v-model="startTime" value-text-align="left" class="date_time"></datetime>
          <datetime title="返程时间" v-model="endTime" value-text-align="left" class="date_time"></datetime>
          <div class="input_row">
            <label>客户姓名</label><input v-model="name" placeholder="请填写姓名">
          </div>
          <div class="input_row phone">
            <label>联系电话</label><input type="number" v-model="phone" placeholder="请填写联系电话">
          </div>
          <div class="input_row phone">
            <label>联系邮箱</label><input v-model="email" placeholder="请填写联系邮箱">
          </div>
          <div class="input_row">
            <label>同行人数</label><input type="number" v-model="num" placeholder="请填写人数">
          </div>
        </group>
        <div class="customized_content">
          <div class="cContent item">
            <p class="title">人均消费</p>
            <checker v-model="price" radio-required default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="0">0-9999元</checker-item>
              <checker-item value="1">10000-29999元</checker-item>
              <checker-item value="2">30000元以上</checker-item>
            </checker>
          </div>
          <div class="cContent item">
            <p class="title">定制内容</p>
            <checker v-model="cContent" type="checkbox" default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="0">门票</checker-item>
              <checker-item value="1">用车</checker-item>
              <checker-item value="2">酒店</checker-item>
              <checker-item value="3">路线计划</checker-item>
              <checker-item value="4">导游</checker-item>
            </checker>
          </div>
          <div class="cHotel item">
            <p class="title">酒店星级选择</p>
            <checker v-model="cHotel" radio-required default-item-class="purpose_item" selected-item-class="purpose_item_selected">
              <checker-item value="0">三星级</checker-item>
              <checker-item value="1">四星级</checker-item>
              <checker-item value="2">五星级</checker-item>
            </checker>
          </div>
        </div>
        <group>
          <x-textarea v-model="serve"  class="textarea" :max="100" placeholder="请在此处写下您的需求: 如尽快安排房间等"></x-textarea>
        </group>
      </div>
    </div>
    <div class="customized_handle">
      <div class="buy" @click="buy">立即预约</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name, Datetime, Picker, ToastPlugin, XTextarea, Checker, CheckerItem } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Scroll, Group, XAddress, Datetime, Picker, XTextarea, Checker, CheckerItem},
  data () {
    return {
      title: '定制游服务',
      addressData: ChinaAddressV4Data,
      address: [],
      destination: [],
      startTime: '',
      endTime: '',
      num: '',
      price: '0',
      name: '',
      phone: '',
      email: '',
      cContent: ['0'],
      cHotel: '0',
      cDinner: '',
      serve: ''
    }
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
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let _this = this
      let province = this.getName(this.address)
      let city = this.getName(this.destination)
      let startTime = this.startTime
      let endTime = this.endTime
      let num = this.num
      let price = this.price
      let name = this.name
      let phone = this.phone
      let email = this.email
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let params = {
        province: province,
        city: city,
        talkTime: startTime,
        outTime: endTime,
        num: num,
        price: price,
        customer: name,
        phone: phone,
        email: email,
        content: this.cContent.join(','),
        hotelStar: this.cHotel,
        eat: this.cDinner,
        otherContent: this.serve,
        userId: userId,
        money: parseFloat(price) * parseInt(num),
        invoiceId: '',
        status: 0
      }
      if (!name) {
        _this.msg('请填写您的姓名')
        return false
      } else if (!phone) {
        _this.msg('请填写联系电话')
        return false
      } else if (!regPhone.test(phone)) {
        _this.msg('联系电话格式不正确')
        return false
      } else if (!email) {
        _this.msg('请填写联系邮箱')
        return false
      } else if (!price) {
        _this.msg('请填写人均消费预算')
        return false
      } else if (!num) {
        _this.msg('请填写同行人数')
        return false
      } else if (!startTime) {
        _this.msg('请填写出发时间')
        return false
      } else if (!endTime) {
        _this.msg('请填写返程时间')
        return false
      } else if (!province) {
        _this.msg('请填写出发地')
        return false
      } else if (!city) {
        _this.msg('请填写目的地')
        return false
      } else {
        this.$axios({
          method: 'post',
          url: '/api/saveTourism.service?token=' + token,
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
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .customized_book {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .customized_book_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      overflow-y: auto;
      .write_content{
        padding-bottom: 4rem;
        .address{
          position: relative;
          &:after{
            .halfBorderLineB;
          }
        }
        .vux-cell-value{
          font-size:  @font-size-medium;
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
          margin-top: 1rem;
          &:first-child{
            margin-top: 0;
          }
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
        .customized_content{
          .item{
            margin: 1rem 0;
            background: @color-text-w;
            .title{
              line-height: 2rem;
              padding: 1rem;
              font-size: @font-size-large;
              position: relative;
              &:after{
                .halfBorderLineB;
              }
            }
            .vux-checker-box{
              padding:1.5rem 1rem;
              .purpose_item{
                padding:0.5rem 1rem;
                border-radius: 3px;
                border: 1px solid @color-text-d;
                margin-right: 0.5rem;
                font-size: @font-size-medium;
              }
              .purpose_item_selected{
                background: @color-theme;
                color: #fff;
                border: 1px solid @color-theme;
              }
            }
          }
        }
      }
    }
    .customized_handle{
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
