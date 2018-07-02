<template>
  <div class="empty">
    <img src="../../common/images/logo.png">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无内容'
    }
  }
}
</script>
<style scoped lang="less">
  .empty{
    width: 100%;
    text-align: center;
    top:50%;
    left:50%;
    position: absolute;
    -webkit-transform: translateY(-50%)  translateX(-50%);
    transform: translateY(-50%)  translateX(-50%);
    z-index:100;
    img{
      width: 12rem;
      margin-bottom: 1rem;
    }
    .desc{
      font-size: 1.4rem;
      color: #3b3b3b;
      line-height: 2rem;
    }
  }
</style>
