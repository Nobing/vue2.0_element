<template>
  <div>
    <transition name="move">
      <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cart-control :food="food" @add="addFood"></cart-control>
            </div>
            <transition name="fade">
              <div class="buy" v-show="!food.count||food.count===0" @click="addFirst($event)">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <rating-select :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @select="selectRating" @toggle="toggleContent"></rating-select>
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-for="rating in food.ratings" v-if="needShow(rating.rateType,rating.text)"
                    class="rating-item border-1px">
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" class="avatar" width="12" height="12">
                  </div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                    {{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {POSITIVE, NEGATIVE, ALL} from 'api/config'
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import CartControl from 'components/cartcontrol/cartcontrol'
  import RatingSelect from 'components/ratingselect/ratingselect'
  import Split from 'components/split/split'
  import {formatDate} from 'common/js/date'

  export default {
    props: {
      food: {
        type: Object
      },
      addFood: {
        type: Function
      }
    },
    //传入数据到子组件从而改变子组件的原数据
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '吐槽'
        }
      }
    },
    methods: {
      //此事件用于让父组件调用
      show() {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      //隐藏当前组件
      hide() {
        this.showFlag = false
      },
      //添加商品
      addFirst(event) {
        if (!event._constructed) {
          return
        }
        this.$emit('add', event.target)//addFirst函数触发的时候创建名为'add'的事件，然后在父组件插入的当前组件中就可以使用改事件
        Vue.set(this.food, 'count', 1)//创建数据的键值
      },
      //筛选评论的类型
      selectRating(type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      //用于是否显示全部评论
      toggleContent() {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      //点击按钮显示评论
      needShow(type, text) {
        //如果勾选了只看有内容的评价并且过滤出没有内容的item返回false
        if (this.onlyContent && text == false) {//主要作用是勾选了只看有内容的评价的按钮后的效果
          return false
        }
        //不进入上面判断的数据到这里再判断是否选择的类型是全部，是则显示
        if (this.selectType === ALL) {
          return true
        } else {// 选择的是推荐或吐槽的时候，判断当前的这条评论的类型是否和选择的类型一致，一致就显示，不一致就不显示
          return type === this.selectType
        }
      }
    },
    filters: {
      formatDate
//      formatDate(time) {
//        let add0 = (num) => {
//          return num < 10 ? '0' + num : '' + num
//        }
//        let date = new Date(time);
//        return add0(date.getFullYear()) + '-' + add0((date.getMonth() + 1)) + '-' + add0(date.getDate()) + ' ' + add0(date.getHours()) + ':' + add0(date.getMinutes()) + ':' + add0(date.getSeconds());
//      }
    },
    components: {
      CartControl,
      RatingSelect,
      Split
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .food
    position: fixed
    width: 100%
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    background: #ffffff
    &.move-enter-active, &.move-leave-active
      transition: all .3s linear
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        left: 0
        top: 10px
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #00a0dc
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        height: 10px
        line-height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 10px / 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          font-weight: 700
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #ffffff
        background: rgb(0, 160, 220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all .3s
        &.fade-enter, &.fade-leave-to
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: #5c646b
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
