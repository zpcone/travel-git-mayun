<template>
  <div>
    <div class="room_book">
      <header-back :title="title"></header-back>
      <div class="room_book_wrap">
        <div style="padding-bottom: 6rem">
          <div class="detail">
            <p class="title">{{room.name}}</p>
            <p class="time"><span>入住：{{startTime}}</span><span>离开：{{endTime}}</span></p>
          </div>
          <div class="write_content">
            <group label-width="10rem" label-margin-right="2rem" label-align="left">
              <div class="input_row phone">
                <label>联系人</label><input v-model="name" placeholder="请填写联系人">
              </div>
              <div class="input_row phone">
                <label>联系电话</label><input v-model="phone" placeholder="请填写联系电话">
              </div>
              <popup-picker title="房间数" :data="listNum" v-model="num" @on-change="onChange"></popup-picker>
              <div class="input_row" v-for="(item,index) in nameModel" :key="index">
                <label>入住人</label><input v-model="item.name"  placeholder="请填写姓名">
              </div>
              <datetime title="预计到店时间" v-model="time" format="YYYY-MM-DD HH:mm" value-text-align="left" class="date_time"></datetime>
            </group>
            <group>
              <x-textarea  class="textarea" v-model="other" :max="100" placeholder="请在此处写下您的需求: 如尽快安排房间等"></x-textarea>
            </group>
          </div>
        </div>
      </div>
      <div class="room_book_handle">
        <div class="buy" @click="buy">快速下单</div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { PopupPicker,Group, Cell, CellBox, Datetime, Picker, ToastPlugin, XTextarea } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {PopupPicker,HeaderBack, Scroll, Group, Cell, CellBox, Datetime, Picker, XTextarea},
  data () {
    return {
      listNum: [["1间","2间","3间","4间","5间","6间","7间","8间","9间","10间"]],
      title: this.$route.query.hotelName,
      startTime: this.$route.query.startTime,
      endTime: this.$route.query.endTime,
      room: {},
      name: '',
      num: ["1间"],
      price: '',
      nameModel: [{name: '', num: 1}],
      phone: '',
      time: '',
      other: ''
    }
  },
  created() {
    this._getDetail()
  },
  methods: {
    onChange (val) {
      this.nameModel = []
      let num = parseInt(val[0].substr(0,val[0].length - 1))
      for(let i = 0; i < num; i++){
        this.nameModel.push({
          name: '',
          num: i
        })
      }
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
    _getDetail () {
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getRooms.service?token=22&id=' + _this.$route.query.roomId
      }).then((res) => {
        if (res.status === 200) {
          _this.room = res.data.data[0]
          _this.price = _this.room.price
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    buy() {
      console.log()
      let nameArr = []
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let _this = this
      let hotelId = this.$route.query.hotelId
      let roomId = this.$route.query.roomId
      let startTime = this.startTime
      let endTime = this.endTime
      let num = this.nameModel.length
      let name = this.name
      let phone = this.phone
      let inTime = this.time
      let content = this.other
      if (!name) {
        _this.msg('请填写联系人')
        return false
      }else if (!phone) {
        _this.msg('请填写联系电话')
        return false
      } else if (!regPhone.test(phone)) {
        _this.msg('联系电话格式不正确')
        return false
      }
      for(let i = 0; i < this.nameModel.length; i++){
        if(this.nameModel[i].name === ''){
          _this.msg('请填写入住人姓名')
          return false
        }else{
          nameArr.push(this.nameModel[i].name)
        }
      }
      if (!inTime) {
        _this.msg('请选择预计到店时间')
        return false
      } else {
        let params = {
          userId: userId,
          hotelId: hotelId,
          roomId: roomId,
          startTime: startTime,
          endTime: endTime,
          num: num,
          name: name,
          people: nameArr.join(','),
          phone: phone,
          inTime: inTime,
          content: content,
          status: '0'
        }
        this.$axios({
          method: 'post',
          url: '/api/hotelRoomYd.service?token=' + token,
          data: params,
          headers: {'Content-Type': 'application/json'}
        })
          .then((res) => {
            if (res.status === 200) {
              let reserveId = res.data.data
              setTimeout(function () {
                _this.$router.push({path: `/roomBookConfirm`, query: {reserveId: reserveId,hotelName: _this.title}})
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
  .room_book {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: 0;
    background: #eee;
    overflow: hidden;
    z-index: 200;
    .room_book_wrap {
      position: fixed;
      top: 4.5rem;
      width: 100%;
      bottom: 5rem;
      overflow-y: auto;
      .detail{
        background: @color-text-w;
        padding: 1rem;
        margin-bottom: 1rem;
        line-height: 2rem;
        font-size: @font-size-medium;
        .title{
          font-size: @font-size-large;
          line-height: 3rem;
        }
        .time{
          span{
            margin-right: 2rem;
          }
        }
        .list{
          margin-top: 1rem;
          span{
            border-left: 1px solid @color-text-d;
            display: inline-block;
            padding: 0 0.5rem;
            line-height: 1.8rem;
            border-radius: 2px;
            font-size: @font-size-small;
            margin-bottom: 1rem;
            &:first-child{
              border-left: 0;
              padding-left: 0;
            }
          }
        }
      }
      .write_content{
        .vux-popup-picker-select{
          text-align: left !important;
        }
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
        .icon_row{
          font-size: @font-size-medium;
          .icon{
            width: 1.8rem;
            vertical-align: middle;
            margin-right: 0.5rem;
          }
        }
      }
    }
    .room_book_handle{
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
