<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <tab></tab>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import VHeader from 'components/header/header.vue'
  import Tab from 'components/tab/tab.vue'
  import axios from 'axios'
  import {ERR_OK} from 'api/config'
  import {urlParse} from 'common/js/util'

  export default {
    data() {
      return {
        seller: {
          //localStorage相关
          id: (() => {
            let queryParam = urlParse()
            console.log(queryParam)
            return queryParam.id
          })()
        }
      }
    },
    created() {
      this.getSeller()
    },
    methods: {
      getSeller() {
        axios.get('/api/seller?id=' + this.seller.id).then((res) => {
          if (res.data.errno === ERR_OK) {
//            this.seller = res.data.data
            this.seller = Object.assign({}, this.seller, res.data.data)//localStorage相关
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      VHeader,
      Tab
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  //  .slide-enter-active,.slide-leave-active
  //    transition: all .5s
  //    transform: translate3d(0,0,0)
  //  .slide-enter,.slide-leave-to
  //    transform: translate3d(-100%,0,0)
</style>
