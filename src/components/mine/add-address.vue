<template>
  <div class="add_address">
    <header-back :title="title"></header-back>
    <div class="add_address_wrap">
        <div class="write_content">
          <group label-width="8rem" label-margin-right="2rem" label-align="left">
            <div class="input_row">
              <label>收货人</label><input v-model="name">
            </div>
            <div class="input_row phone">
              <label>联系电话</label><input v-model="phone">
            </div>
            <x-address title="所在地区" placeholder="请选择地区" v-model="address" :list="addressData" value-text-align="left" ></x-address>
            <x-textarea title="详细地址" placeholder="请填写详细地址信息" v-model="addressInfo" :show-counter="false" :rows="3"></x-textarea>
          </group>
        </div>
        <div class="handle">
          <div class="save" @click="saveAddress">保存</div>
        </div>
      </div>
  </div>
</template>
<script>
import Vue from 'vue'
import HeaderBack from 'components/base/header-back'
import { Group, Cell, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name, ToastPlugin, XTextarea } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {HeaderBack, Group, Cell, XAddress, XTextarea},
  data() {
    return {
      title: '添加新地址',
      name: '',
      phone: '',
      address: [],
      addressInfo: '',
      queryId: this.$route.query.id,
      addressData: ChinaAddressV4Data
    }
  },
  created() {
    if (this.queryId > 0) {
      this.title = '编辑地址'
      this._initAddress()
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
    _initAddress () {
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/getAddress.service?token=' + token + '&id=' + this.queryId).then((res) => {
        if (res.status === 200) {
          _this.name = res.data.data[0].name
          _this.phone = res.data.data[0].phone
          _this.addressInfo = res.data.data[0].contentAddress
          let addressArr = res.data.data[0].address.split(' ')
          _this.address.push(addressArr[0])
          _this.address.push(addressArr[1])
          _this.address.push(addressArr[2])
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    saveAddress() {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      let alertMsg = ''
      let _this = this
      let name = this.name
      let phone = this.phone
      let detail = this.addressInfo
      let addressStr = this.getName(this.address)
      let type = ''
      let params = {}
      if (!name) {
        alertMsg = '请填写收货人姓名'
      } else if (!phone) {
        alertMsg = '请填写联系电话'
      } else if (!regPhone.test(phone)) {
        alertMsg = '联系电话格式不正确'
      } else if (!addressStr) {
        alertMsg = '请选择地区'
      } else if (!detail) {
        alertMsg = '请填写详细地址'
      } else {
        if (this.queryId > 0) {
          type = 'updateAddress'
          params = {
            id: this.queryId,
            name: name,
            phone: phone,
            userId: userId,
            address: addressStr,
            contentAddress: detail
          }
        } else {
          type = 'saveAddress'
          params = {
            name: name,
            phone: phone,
            userId: userId,
            address: addressStr,
            contentAddress: detail
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import "../../common/css/variable.less";
.add_address{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 100;
  .add_address_wrap{
    position: fixed;
    top:4.5rem;
    width: 100%;
    bottom:0;
    overflow: hidden;
    .write_content{
      .weui-cells{
        margin-top: 0;
      }
      .weui-cells:before{
        display: none;
      }
      .date_time{
        text-decoration: none !important;
        color: #3b3b3b !important;
        font-size: 1.6rem !important;
        line-height: 22px;
      }
      .weui-label{
        font-size: 1.6rem !important;
        line-height: 24px;
      }
      .input_row{
        padding: 8px 15px;
        position: relative;
        display: flex;
        align-items: center;
        label{
          font-size: 1.6rem;
          width: 8rem;
          margin-right: 2rem;
          display: inline-block;
        }
        input{
          border: 1px solid #eee;
          border-radius: 4px;
          font-size: 1.4rem;
          height: 26px;
          flex: 1;
          text-indent: 1rem;
          caret-color: #3b3b3b;
        }
        &:after {
          content: " ";
          position: absolute;
          bottom: 0;
          right: 0;
          height: 1px;
          border-top: 1px solid #D9D9D9;
          color: #D9D9D9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
          left: 15px;
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
}
</style>
