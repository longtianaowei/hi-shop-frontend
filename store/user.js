export default {
	// 开启命名空间
	namespaced: true,
	
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}')
	}),
	mutations: {
		// 更新收货地址 
		updateAddress(state,address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},
	
	getters: {
		// 收货详细地址的计算属性
		addstr(state) {
			if(!state.address.provinceName) return ''
			
			// 拼接详细地址省市区
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	},
}