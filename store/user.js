export default {
	// 开启命名空间
	namespaced: true,
	
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登陆成功之后的token
		token: uni.getStorageSync('token') || '',
		userinfo:JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		 // 重定向的 object 对象 { openType, from }
		redirectInfo: null
	}),
	mutations: {
		// 更新收货地址 
		updateAddress(state,address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		// 更新用户基本信息
		updateUserInfo(state,userinfo) {
			state.userinfo = userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		// 更新token
		updateToken(state,token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向的信息对象
		updateRedirectInfo(state,info) {
			state.redirectInfo = info
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