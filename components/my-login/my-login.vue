<template>
	<view class="login-container">
		<!-- 提示登陆的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登陆按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登陆</button>
		<!-- 登陆提示 -->
		<view class="tips-text">登陆后尽享更多权益</view>
	</view>
</template>

<script>
	import {mapMutations,mapState} from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('m_user',['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo','updateToken','updateRedirectInfo']),
			getUserInfo(e) {
				console.log(e);	if(e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登陆授权')
				// 用户信息存储到vuex
				this.updateUserInfo(e.detail.userInfo)
				// 获取登陆成功后token
				this.getToken(e.detail)
			},
			
			// getUserProfile() {
			//     uni.getUserProfile({
			//      desc: '请求授权', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			//      success: (res) => {
			//       console.log(res)
			//       // 这部分是更新用户信息的
			//       this.updateUserInfo(res.userInfo)
			//       this.getToken(res)
			//      },
			//      fail: (res) => {
			//       return uni.$showMsg("已取消登录授权")
			//      }
			//     })
			//    },
			async getToken(info) {
				// 调用微信登陆接口
				const [err,res] = await uni.login().catch(err => err)
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				  // 准备参数对象
				  const query = {
				    code: res.code,
				    encryptedData: info.encryptedData,
				    iv: info.iv,
				    rawData: info.rawData,
				    signature: info.signature
				  }
				
				// 换取token
				const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				// uni.$showMsg('登陆成功')
				// 登陆接口失效，下方写死token
				// this.updateToken(loginResult.message.token)
				this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
				this.navigateBack()
			},
			navigateBack() {
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url:this.redirectInfo.from,
						complete() {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;
		
		&::after {
			content: '';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}
		
		// 登陆按钮
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}
		
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>œ