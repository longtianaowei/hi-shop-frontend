import {mapGetters} from 'vuex'

export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	onShow() {
		this.setBadge()
	},
	methods: {
		setBadge() {
			uni.setTabBarBadge({
				index:2,
				text:this.total + '',
			})
		}
	},
	watch: {
		// 监听total购物车图标上方小数字的变化
		total() {
			this.setBadge()
		}
	}
}