<template>
  <div>
    <div class="order_com_pay1">
      <header-back :title="title"></header-back>
      <scroll class="order_com_pay1_wrap">
        <div style="padding-bottom: 3rem">
          <order-com-list :orderList="orderList"></order-com-list>
        </div>
      </scroll>
      <div v-if="orderList.length===0">
        <loading v-if="!listEmpty"></loading>
        <empty v-if="listEmpty"></empty>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderBack from 'components/base/header-back'
import Scroll from 'components/base/scroll'
import Loading from 'components/base/loading'
import Empty from 'components/base/empty'
import OrderComList from './order-com-list'
export default {
  components: {OrderComList, Loading, Empty, Scroll, HeaderBack},
  data () {
    return {
      title: '已完成订单',
      listEmpty: false,
      orderList: []
    }
  },
  created() {
    this._getOrderList()
  },
  methods: {
    _getOrderList () {
      let _this = this
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      this.$axios({
        method: 'get',
        url: '/api/getUserOrder1.service?token=' + token + '&userId=' + userId
      }).then((res) => {
        if (res.status === 200) {
          let listTotal = res.data.data
          listTotal.map(function(value,key,arr){
            value.result = [JSON.parse(value.result)]
          })
          let filterTotal = listTotal.filter(item => item.result[0].resultType == '2' || item.result[0].status == '3' || item.result[0].status == '4' || item.result[0].status == '5')
          let filterList = []
          filterTotal.forEach((item, index) => {
            if(JSON.stringify(filterList).indexOf(item.crtTime) > -1){
              filterList.forEach((it, i) => {
                if (it.crtTime == item.crtTime) {
                  filterList[i].result.push(item.result[0])
                }
              })
            }else{
              filterList.push(item)
            }
          })
          _this.orderList = filterList
          if(_this.orderList.length === 0){
            _this.listEmpty = true
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .order_com_pay1 {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #eee;
    z-index: 1000;
    .order_com_pay1_wrap {
      position: fixed;
      width: 100%;
      top: 4.5rem;
      left: 0;
      bottom: 0;
    }
  }
</style>
