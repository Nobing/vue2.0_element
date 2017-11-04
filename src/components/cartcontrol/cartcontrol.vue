<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseCart"></div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      //在购物车里面的添加商品
      addCart(event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)//创建数据
        } else {
          this.food.count++
        }
        this.$emit('add', event.target)//addCart函数触发的时候创建名为'add'的事件，然后在父组件插入的当前组件中就可以使用改事件
      },
      //在购物车里面的减少商品
      decreaseCart(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block

  .move-enter-active, .move-leave-active
    transition: all .4s linear
    opacity: 1
    transform: translate3d(0, 0, 0) rotate(0)

  .move-enter, .move-leave-to
    opacity: 0
    transform: translate3d(24px, 0, 0) rotate(180deg)

  .fade-enter-active, .fade-leave-active
    transition: all .4s
    opacity: 1

  .fade-enter, .fade-leave-to
    opacity: 0
</style>
