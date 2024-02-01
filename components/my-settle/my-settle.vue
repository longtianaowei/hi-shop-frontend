<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
		</label>
		
		<!-- 合计区域 -->
		<view class="amount-box">
			合计：<text class="amount">¥{{checkedGoodsAmount}}</text>
		</view>
		
		<!-- 结算区域 -->
		<view class="btn-settle" @click="settlement"> 
			结算({{checkedCount}})
		</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations,mapState} from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时秒数
				seconds:3,
				// 定时器id
				timer:null
			};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			// 是否全选
			isFullCheck() {
				return this.total === this.checkedCount
			},
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck)
			},
			settlement() {
				if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
				
				if(!this.addstr) return uni.$showMsg('请选择收货地址')
				
				// if(!this.token) return uni.$showMsg('请先登陆')
				if(!this.token) return this.delayNavigate()
				
				// 实现微信支付功能
				this.payOrder()
			},
			showTips(n) {
				uni.showToast({
					icon:'none',
					title:'请登陆后再结算！' + n + '秒后自动跳转到登陆页',
					mask:true,
					duration:1500
				})
			},
			delayNavigate() {
				this.seconds = 3
				this.showTips(this.seconds)
				this.timer = setInterval(() => {
					this.seconds--
					if(this.seconds <= 0) {
						clearInterval(this.timer)
						
						uni.switchTab({
							url:'/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									// 跳转方式
									openType:'switchTab',
									// 从哪个页面跳转过去的
									from: '/pages/cart/cart'
								})
							}
						})
						return
					}
					this.showTips(this.seconds)
				},1000)
			},
			async payOrder() {
				  const orderInfo = {
				    // 开发期间，注释掉真实的订单价格，
				    // order_price: this.checkedGoodsAmount,
				    // 写死订单总价为 1 分钱
				    order_price: 0.01,
				    consignee_addr: this.addstr,
				    goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
				  }
				// 发起请求
				const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 得到服务器响应的订单号
				const orderNumber = res.message.order_number
				
				// 订单预支付
				const {data:res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				if(res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
				const payInfo = res2.message.pay
				
				// 发起微信支付
				const [err,succ] = await uni.requestPayment(payInfo)
				if(err) return uni.$showMsg('订单未完成支付！')
				// 完成了支付，进一步查询支付结果
				const [data,res3] = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				if(res3.meta.status !== 200) return uni.$showMsg('订单未完成支付')
				
				// 检测到订单完成支付
				uni.showToast({
					title:'支付完成',
					icon:'success'
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  width: 100%;
	  height: 50px;
	  // 将背景色从 cyan 改为 white
	  background-color: white;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding-left: 5px;
	  font-size: 14px;
	
	  .radio {
	    display: flex;
	    align-items: center;
	  }
	
	  .amount {
	    color: #c00000;
	  }
	
	  .btn-settle {
	    height: 50px;
	    min-width: 100px;
	    background-color: #c00000;
	    color: white;
	    line-height: 50px;
	    text-align: center;
	    padding: 0 10px;
	  }
	}
</style>