<template>
  <div class="loading">
    <img src="./loading.gif" height="36" width="36" alt=""/>
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: 'Loading ...'
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size: 16px
      font-weight: 700
      color: #80858a
</style>
