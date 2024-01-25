<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
	<!-- 搜索建议列表 -->
	<view class="sugg-list" v-if="searchResults.length !== 0">
		<view class="sugg-item" v-for="(item,index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)">
			<view class="goods-name">{{item.goods_name}}</view>
			<uni-icons type="arrowright" size="16"></uni-icons>
		</view>
	</view>
	<!-- 搜索历史 -->
	<view class="history-box" v-else>
		<!-- 标题区域 -->
		<view class="history-title">
			<text>搜索历史</text>
			<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			<!-- 搜索历史列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,index) in historys" :key="index" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
		// 搜索框防抖处理
		// 延时器的timerId
		timer: null,
		// 搜索历史关键词
		kw: '',
		// 搜索列表数据
		searchResults: [],
		// 搜索历史列表数据
		historyList: []
      };
    },
	onLoad() {
		this.historyList = JSON.parse(uni.getStorage('kw') || '[]')
	},
	methods: {
		input(e) {
			// console.log(e);
			// 先清除timer对应的延时器
			clearTimeout(this.timer)
			// 启用定时器
			this.timer = setTimeout(()=> {
				// 500毫秒没有触发新的输入事件，则为搜索关键词赋值
				this.kw = e.value
				this.getSearchList()
			},500)
		},
		async getSearchList() {
			// 判断关键词是否为空
			if(this.kw === '') {
				this.searchResults = []
				return
			}
			const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
			if(res.meta.status !== 200) return uni.$showMsg()
			this.searchResults = res.message
			this.saveSearchHistory()
		},
		// 保存搜索记录
		saveSearchHistory() {
			// this.historyList.push(this.kw)
			// 上面存在搜索记录重复问题
			// 数组转set对象
			const set = new Set(this.historyList)
			// 先删后加
			set.delete(this.kw)
			set.add(this.kw)
			// set对象转数组
			this.historyList = Array.from(set)
			// 搜索记录本地持久化
			uni.setStorageSync('kw',JSON.stringify(this.historyList))
		},
		cleanHistory() {
			// 清除搜索记录
			this.historyList = []
			uni.setStorage('kw', '[]')
		},
		gotoDetail(goods_id) {
			uni.navigateTo({
				url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
			})
		},
		gotoGoodsList(kw) {
			uni.navigateTo({
				url:'/subpkg/goods_list/goods_list?query=' + kw
			})
		}
	},
	computed: {
		historys() {
			return [...this.historyList].reverse()
		}
	}
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .sugg-list {
	  padding: 0 5px;
	  .sugg-item {
		  font-size: 12px;
		  padding: 13px 0;
		  border-bottom: 1px solid #efefef;
		  display: flex;
		  align-items: center;
		  justify-content: space-around;
		  .goods-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 3px;
		  }
	  }
  }
  .history-box {
	  padding: 0 5px;
	  
	  .history-title {
		  display: flex;
		  justify-content: space-around;
		  align-items: center;
		  height: 40px;
		  font-size: 13px;
		  border-bottom: 1px solid #efefef;
	  }
	  .history-list {
		  display: flex;
		  flex-wrap: wrap;
		  .uni-tag {
			  margin-top: 5px;
			  margin-right: 5px;
		  }
	  }
  }
</style>
