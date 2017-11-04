<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
              @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
                <div class="icon">
                  <img width="57" height="57" v-lazy="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cart-control @add="_drop" :food="food"></cart-control>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shop-cart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shop-cart>
      <div class="loading-container" v-if="!goods.length">
        <loading></loading>
      </div>
    </div>
    <food :food="selectedFood" ref="foodEl" @add="_drop" :addFood="addFood"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import ShopCart from 'components/shopcart/shopcart'
  import CartControl from 'components/cartcontrol/cartcontrol'
  import Food from 'components/food/food'
  import Loading from 'components/loading/loading'
  import axios from 'axios'
  import {ERR_OK} from 'api/config'
  import BScroll from 'better-scroll'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,//记录当前滚去的高度
        selectedFood: {}//传入当前打开的商品
      }
    },
    computed: {
      //实时计算高度，运用对比检测当前滚动到哪一个区块，然后返回listHeight索引值
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      //数据发生变化时遍历出含有count对象的数组
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      setTimeout(() => {
        this.getGoods()
      }, 1000)
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      getGoods() {
        axios.get('/api/goods').then((res) => {
          if (res.data.errno === ERR_OK) {
            this.goods = res.data.data
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeight()
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //点击的索引值跟foodList的索引值做匹配，然后跳转到foodList第i个区块相应的位置
      selectMenu(index, event) {
        //不加判断点击事件会触发两次
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodList
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 200)
      },
      //点击打开相应商品详情页
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.foodEl.show()//调用子组件的方法
      },
      //因为两个子组件不可以直接调用方法，所以父组件做中介，创建一个方法用来调用子组件的方法，然后传入给另外一个子组件
      addFood(target) {
          this._drop(target)
      },
      //调用子组件的小球动画函数
      _drop(target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      //初始化better-scroll
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)) + 4
        })
      },
      //获取每个区块的高度然后塞进listHeight数组里面
      _calculateHeight() {
        let foodList = this.$refs.foodList
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      ShopCart,
      CartControl,
      Food,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"

  .goods
    display: flex
    position: absolute
    width: 100%
    top: 174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 25px
        border-left: 2px solid #d9ddel
        font-style: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          width: 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px
            height: 14px
            line-height: 14px
            font-style: 14px
            font-weight: 700
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 10px/14px
              font-weight: 700
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              font-weight: 700
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
