<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">¥{{goods_info.goods_price}}</view>
			<!-- 商品信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品详情信息，为html格式要用rich-text富文本样式 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods-nav">
			<!-- fill 控制右侧按钮的样式 -->
			  <!-- options 左侧按钮的配置项 -->
			  <!-- buttonGroup 右侧按钮的配置项 -->
			  <!-- click 左侧按钮的点击事件处理函数 -->
			  <!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex'
	
	export default {
		computed: {
			...mapState('m_cart',['cart']),
			...mapGetters('m_cart',['total']),
		},
		// 监听total值的变化，通过第一个形参得到变化后的新值
		watch: {
			total: {
				handler(newVal) {
					const findResult = this.options.find((x) => x.text === '购物车')
					if(findResult) {
						// 动态为购物车按钮的info属性赋值
						findResult.info = newVal
					}
				},
				immediate:true
			}
		}, 
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				options: [{
					icon:'shop',
					text: '店铺',
				},
				{
					icon:'cart',
					text: '购物车',
					info: 0
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
					text:'加入购物车',
					backgroundColor: '#ff0000',
					color: '#fff'
				},
				{
					text:'立即购买',
					backgroundColor: '#ffa200',
					color: '#fff'
				}
				]
			};
		},
		onLoad(options) {
			// 获取商品列表id
			const goods_id = options.goods_id
			this.getGoodsDetail(goods_id)
 		},
		methods: {
			// 把m_cart模块中的addToCart方法映射到当前页面使用
			...mapMutations('m_cart',['addToCart']),
			// 请求商品详情数据
			async getGoodsDetail(goods_id) {
				const {data: res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
				if(res.meta.status !== 200) return uni.$showMsg()
				
				// 使用字符串的replace()方法，为img标签添加行内元素style样式，从而解决图片底部空白问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g,'<img style="display:block;" ').replace(/webp/g, 'jpg')
				this.goods_info = res.message
			},
			// 轮播图预览函数
			preview(index) {
				uni.previewImage({
					// 预览图片的索引
					current:index,
					// 所有图片的地址数组
					urls:this.goods_info.pics.map(x => x.pics_big)
				})
			},
			onClick(e) {
				if(e.content.text === '购物车') {
					// 切换购物车页面
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick(e) {
				if(e.content.text==='加入购物车') {
					const goods = {
						goods_id:this.goods_info.goods_id,
						goods_name:this.goods_info.goods_name,
						goods_price:this.goods_info.goods_price,
						goods_count:1,
						goods_small_logo:this.goods_info.goods_small_logo,
						goods_state:true
					}
					this.addToCart(goods)
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	// 商品信息区域样式
	.goods-info-box {
		padding: 10px;
		padding-right: 0;
		
		.price {
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}
		.goods-info-body{
			display: flex;
			justify-content: space-between;
			.goods-name {
				font-size: 13px;
				padding-right: 10px;
			}
			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}
		.yf{
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}
	.goods-detail-container {
	  // 给页面外层的容器，添加 50px 的内padding，
	  // 防止页面内容被底部的商品导航组件遮盖
	  padding-bottom: 50px;
	}
	.goods-nav {
	  // 为商品导航组件添加固定定位
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	}
</style>
