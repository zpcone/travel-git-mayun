<template>
  <div>
    <div class="mall_goods_list">
      <div class="item" v-for="item in data" :key="item.id" @click="goUrl(item.id)">
        <div class="content">
          <img v-lazy="item.img"/>
          <p class="name">{{item.name}}</p>
          <p class="money">{{item.price}}积分</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  methods: {
    floatPrice(price) {
      return parseFloat(price).toFixed(2)
    },
    _addRecord (id) {
      let token = sessionStorage.getItem('token')
      let userId = sessionStorage.getItem('userId')
      let _this = this
      let params = {
        userId: userId,
        commodityId: id
      }
      this.$axios({
        method: 'post',
        url:  '/api/saveUserRecord.service?token=' + token,
        data: JSON.stringify(params),
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
      }).catch((error) => {
        console.log(error)
      })
    },
    goUrl(id) {
      this.$router.push({path: `/mallCard/goods`, query: {goodsId: id, goodsType:'card'}})
    }
  }
}
</script>
<style lang="less">
  @import "../../common/css/variable.less";
  .mall_goods_list {
    overflow-y: auto;
    padding: 1rem 0;
    .item {
      width: 50%;
      float: left;
      padding: 0 1rem;
      box-sizing: border-box;
      position: relative;
      margin-bottom: 1rem;
      &:nth-child(2n+1){
        padding-right: 0;
      }
      .content {
        img {
          width: 100%;
          height: 14rem;
          background: #d1d1d1;
        }
        .name {
          line-height: 2rem;
          font-size: @font-size-medium;
          .wrap2;
        }
        .money {
          font-size: @font-size-large;
          color: #ef605a;
        }
      }
    }
  }
</style>
