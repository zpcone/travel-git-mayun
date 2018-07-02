<template>
  <div class="purse_book">
    <header-back :title="title"></header-back>
    <scroll class="purse_book_wrap">
      <div class="write_content">
        <group label-width="10rem" label-margin-right="2rem" label-align="left">
          <div class="input_row">
            <label>房间数</label><input type="number" v-model="num" placeholder="请填写人数">
          </div>
          <div class="input_row">
            <label>入住人</label><input v-model="name" placeholder="请填写姓名">
          </div>
          <div class="input_row phone">
            <label>联系电话</label><input type="number" v-model="phone" placeholder="请填写联系电话">
          </div>
          <div class="input_row code">
            <label>验证码</label><input v-model="code">
            <button class="identify" ref="code">{{tip}}</button>
          </div>
          <datetime title="预计到店时间" v-model="time" value-text-align="left" class="date_time"></datetime>
        </group>
        <group>
          <x-textarea  class="textarea" :max="100" placeholder="请在此处写下您的需求: 如尽快安排房间等"></x-textarea>
        </group>
      </div>
    </scroll>
    <div class="purse_book_handle">
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
      title: '商旅服务',
      purpose: 0,
      time: '',
      name: '',
      phone: '',
      code: '',
      tip: '获取验证码',
      address: [],
      num: '',
      price: 60,
      tea: 0
    }
  },
  methods: {
    buy() {
      this.$router.push({path: `/orderFinish`})
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .purse_book {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 100;
    .purse_book_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 0;
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
            width: 10rem;
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
    .purse_book_handle{
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
