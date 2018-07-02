<template>
  <div class="address_page">
    <header-back :title="title"></header-back>
    <scroll class="address_wrap" :data="addressList">
      <div>
        <div class="list">
          <div class="item" v-for="item in addressList" :key="item.id">
            <div class="content">
              <p><span class="name">{{item.name}}</span><span class="phone">{{item.phone}}</span></p>
              <p class="desc">{{item.address}}{{item.contentAddress}}</p>
            </div>
            <div class="handle">
              <div class="radio_row">
                <input type="radio" :id="item.id" :value="getAddressInfo(item)" name="address" v-model="addressInfo">
                <label :for="item.id"></label>
              </div>
              <div class="but_row">
                <button class="but_primary but" @click="addAddress(item.id)">编辑</button>
                <button class="but_default but" @click="deleteAddress(item.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
        <div class="add" @click="addAddress(0)">＋新增地址</div>
      </div>
    </scroll>
    <actionsheet v-model="showAct" :menus="actMsg" @on-click-menu-delete="onDelete(addressId)" show-cancel></actionsheet>
    <router-view></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import Scroll from 'components/base/scroll'
import HeaderBack from 'components/base/header-back'
import { Group, Actionsheet, Cell, ToastPlugin, XButton } from 'vux'
Vue.use(ToastPlugin)
export default {
  components: {Scroll, Actionsheet, HeaderBack, Group, Cell, XButton},
  data () {
    return {
      title: '我的收货地址',
      addressList: [],
      addressInfo: '',
      addressId: '',
      showAct: false,
      actMsg: {
        'title.noop': '确定删除吗?',
        delete: '<span style="color:red">删除</span>'
      }
    }
  },
  created() {
    this._initAddress()
    this.$watch('addressInfo', (newAddressInfo) => {
      this.$emit('addressInfo', newAddressInfo)
    })
  },
  watch: {
    $route(to, from) {
      if(from.path.indexOf('addAddress') > 0) {
        this._initAddress()
      }
    }
  },
  methods: {
    addAddress(id) {
      let type = this.$route.query.type
      if (type === 'goods') {
        this.$router.push({path: `/submitOrderGoods/chooseAddress/addAddress`, query: {id: id}})
      } else if (type === 'goodsShop') {
        this.$router.push({path: `/submitOrderGoodsShop/chooseAddress/addAddress`, query: {id: id}})
      } else if (type === 'vip') {
        this.$router.push({path: `/vipOrderConfirm/chooseAddress/addAddress`, query: {id: id}})
      } else {
        this.$router.push({path: `/addAddress`, query: {id: id}})
      }
    },
    deleteAddress(id) {
      this.showAct = true
      this.addressId = id
    },
    onDelete(id){
      let _this = this
      let token = sessionStorage.getItem('token')
      this.$axios.get('/api/deleteAddress.service?token=' + token + '&addressId=' + id).then((res) => {
        if (res.data.status === 200) {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除成功',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
          _this._initAddress()
        } else {
          _this.$vux.toast.show({
            type: 'text',
            text: '删除失败',
            time: '1000',
            width: '20rem',
            position: 'middle'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getAddressInfo(item) {
      return item.id + '___' + item.name + '___' + item.phone + '___' + item.address + item.contentAddress
    },
    _initAddress () {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let _this = this
      this.$axios({
        method: 'get',
        url: '/api/getAddress.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          _this.addressList = res.data.data
          console.log(_this.addressList)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../common/css/variable.less";
.address_page{
  position: fixed;
  top:0;
  width: 100%;
  bottom:0;
  background:#eee;
  overflow: hidden;
  z-index: 100;
  .address_wrap{
    position: fixed;
    top:4.5rem;
    width: 100%;
    bottom:0;
    overflow: hidden;
    .list{
      padding-bottom: 0.1rem;
      .item{
        padding: 1rem;
        background: #fff;
        margin-bottom: 1rem;
        .content{
          padding-bottom: 0.5rem;
          p{
            line-height: 2.5rem;
            font-size: 1.4rem;
            .phone{
              margin-left: 2rem;
            }
          }
        }
        .handle{
          padding-top: 1rem;
          border-top: 1px solid #dddddd;
          display: flex;
          text-align: center;
          .radio_row{
            width: 10rem;
            text-align: left;
            input{
              width: 2rem;
              height: 2rem;
            }
          }
          .but_row{
            text-align: right;
            flex: 1;
            padding-right: 1rem;
            .but{
              margin: 0 1rem;
              padding: 0.6rem 1.8rem;
              border-radius: 3px;
              font-size: 1.2rem;
              border: none;
              color: #fff;
              outline: none;
              &.but_primary {
                background-color: @color-theme;
                &:active {
                  background-color: @color-theme-light;
                }
              }
              &.but_default {
                background-color: #808080;
                &:active {
                  background-color: #999;
                }
              }
            }
          }
        }
      }
    }
    .add{
      display: inline-block;
      width: 70%;
      height: 3.6rem;
      border-radius: 4px;
      border:1px solid @color-theme;
      color: @color-theme;
      text-align: center;
      font-size: 1.6rem;
      line-height: 3.6rem;
      margin: 1rem 15% 2rem;
    }
  }
}
</style>
