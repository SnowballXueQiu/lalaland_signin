import Taro from '@tarojs/taro'
import { request } from './api'

export const loginWithWechat = async () => {
  // H5/local builds keep the existing mock login behaviour used by this project.
  let code = 'admin_code'
  let mockOpenid = Taro.getStorageSync('mock_openid')

  if (!mockOpenid) {
    mockOpenid = `mock_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`
    Taro.setStorageSync('mock_openid', mockOpenid)
  }

  if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    const loginRes = await Taro.login()
    if (!loginRes.code) {
      throw new Error('微信登录失败')
    }
    code = loginRes.code
  }

  const session = await request('/auth/login', 'POST', { code, mock_openid: mockOpenid })
  Taro.setStorageSync('openid', session.openid)
  Taro.setStorageSync('role', session.role)
  return session
}

export const navigateToRoleHome = (role) => {
  const url = role === 'admin' ? '/pages/manage/index' : '/pages/parent/index'
  return Taro.navigateTo({ url })
}
