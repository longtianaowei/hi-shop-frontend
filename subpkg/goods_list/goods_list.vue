<template>
	<view>
		<view class="goods-list">
			<view v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item)">
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数
				queryObj: {
					// 查询关键词
					query: '',
					// 商品ID
					cid: '',
					// 当前页数
					pagenum: 1,
					// 每页显示条数
					pagesize: 10
				},
				// 商品列表数据
				goodsList: [],
				// 总数量，用于分页
				total:0,
				// 节流的标志
				isLoding: false
			};
		},
		onLoad(options) {
			// 获取页面传递过来的参数
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			this.getGoodsList()
		},
		methods: {
			async getGoodsList(cb) {
				// 打开节流阀
				this.isLoding = true
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				// 关闭节流阀
				this.isLoding = false
				// 只要数据请求完毕，就立即按需调用cb回掉函数，这里为关闭下拉刷新框
				cb && cb()
				if(res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(item) {
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			}
		},
		onReachBottom() {
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum*this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 节流 判断是否有请求其他数据
			if (this.isLoding) return
			// 页数加1重新请求
			this.queryObj.pagenum += 1
			this.getGoodsList()
		},
		onPullDownRefresh() {
			// 重置数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.goodsList = []
			this.isLoding = false
			// 重新请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}

	}
</script>

<style lang="scss">
	
</style>
