export default {
	// 为当前模块开启命名空间
	namespaced:true,
	
	// 模块的state数据
	state: () => ({
		// 购物车相关数据
		cart:JSON.parse(uni.getStorageSync('cart') || '[]'),
	}),
	mutations: {
		addToCart(state, goods) {
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if(!findResult) {
				// 如果购物车没有这个商品直接push到数组后面
				state.cart.push(goods)
			}else{
				// 否则有直接数量加1
				findResult.goods_count++
			}
			this.commit('m_cart/saveToStorage')
		},
		saveToStorage(state) {
			uni.setStorageSync('cart',JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state,goods) {
			// 根据goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 有对应的商品信息对象
			if(findResult) {
				// 更新对应商品的勾选状态
				findResult.goods_state= goods.goods_state
				// 持久化到本地
				this.commit('m_cart/saveToStorage')
			}
		},
		updateGoodsCount(state,goods) {
			// 根据goods_id 查询购物车中对应商品的信息对象
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			if(findResult) {
				// 更新对应商品的数量
				findResult.goods_count = goods.goods_count
				// 持久化存储到本地
				this.commit('m_cart/saveToStorage')
				
			}
		},
		// 根据id删除购物车中的对应的商品
		removeGoodsById(state,goods_id) {
			// 调用数组的filter方法进行过滤
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的勾选状态,全选与否
		updateAllGoodsState(state,newState) {
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
		
	},
	getters: {
		total(state) {
			let c = 0
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		// 结算旁边的数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state)
			.reduce((total,item) => total += item.goods_count,0)
		},
		// 商品总价
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state)
			.reduce((total,item) => total += item.goods_count * item.goods_price,0)
			.toFixed(2)
		}
	}
	
}