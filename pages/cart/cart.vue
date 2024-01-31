<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 地址组件 -->
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(item,index) in cart" :key="index">
				 <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
				<uni-swipe-action-item :options="options" @click="swipeActionClickHandler(item.goods_id)">
					<my-goods :goods="item" :showRadio="true" :showNum="true"
					@radio-change="radioChangeHandler" 
					@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		  <!-- 结算区域 -->
		<my-settle></my-settle>
	</view>
	  <!-- 空白购物车为空显示的盒子 -->
	  <view class="empty-cart" v-else>
	    <image src="/static/cartEmpty.png" class="empty-img"></image>
	    <text class="tip-text">空空如也~</text>
	  </view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState,mapMutations} from 'vuex'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				options: [{
					text:'删除',
					style: {
						backgroundColor: '#C00000'
					}
				}]
			};
		},
		computed: {
			...mapState('m_cart', ['cart'])
		},
		methods: {
			...mapMutations('m_cart',['updateGoodsState', 'updateGoodsCount','removeGoodsById']),
			// 勾选框发生变化
			radioChangeHandler(e) {
				this.updateGoodsState(e)
			},
			// 商品数量发生变化
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			swipeActionClickHandler(goods_id) {
				this.removeGoodsById(goods_id)
			}
			
		},
		
	}
</script>

<style lang="scss">
	.cart-container {
	  padding-bottom: 50px;
	  .cart-title {
	    height: 40px;
	    display: flex;
	    align-items: center;
	    font-size: 14px;
	    padding-left: 5px;
	    border-bottom: 1px solid #efefef;
	    .cart-title-text {
	      margin-left: 10px;
	    }
	  }
	}
	
	.empty-cart {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  padding-top: 150px;
	
	  .empty-img {
	    width: 90px;
	    height: 90px;
	  }
	
	  .tip-text {
	    font-size: 12px;
	    color: gray;
	    margin-top: 15px;
	  }
	}
</style>
