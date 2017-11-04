<template>
    <div class="tab border-1px border-1pxt">
      <router-link class="tab-item" to="/goods">商品</router-link>
      <router-link class="tab-item" to="/ratings">评论</router-link>
      <router-link class="tab-item" to="/seller">商家</router-link>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin.styl"
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      border-1pxt(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align:center
        display: block
        font-size: 14px
      .active
        color: rgb(240, 20, 20)
</style>
