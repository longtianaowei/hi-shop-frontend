<template>
	<view class="goods-item">
		<!-- 商品左侧图片 -->
		<view class="goods-item-left">
			<!-- 左侧勾选框 -->
			<radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right">
			<!-- 商品标题 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">¥{{goods.goods_price | tofixed}}</view>
				<!-- 商品数量 -->
				<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name:"my-goods",
		props: {
			goods: {
				type:Object,
				default: {}
			},
			// 是否展示图片
			showRadio: {
				type:Boolean,
				default: false
			},
			showNum: {
				type:Boolean,
				default:false,
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		filters: {
			// 把价格过滤带两个小数点
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			radioClickHandler() {
				this.$emit('radio-change',{
					// 商品id
					goods_id:this.goods.goods_id,
					// 商品最新勾选状态
					goods_state: !this.goods.goods_state
				})
			},
			numChangeHandler(val) {
				this.$emit('num-change', {
					goods_id:this.goods.goods_id,
					goods_count: +val
				})
			}
		},
	}
</script>

<style lang="scss">
	.goods-item {
		// 让 goods-item 项占满整个屏幕的宽度
		width: 750rpx;
		// 设置盒模型为 border-box
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content	:space-between;
			align-items: center;			
			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.goods-name {
			font-size: 13px;
		}
		.goods-info-box {
		    display: flex;
		    align-items: center;
		    justify-content: space-between;
		}
		.goods-price {
			font-size: 16px;
			color: #C00000;
		}
		
	}
</style>