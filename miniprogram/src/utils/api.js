import Taro from '@tarojs/taro'

const BASE_URL = 'https://s1.imlihe.com/lalaland'

export const request = async (url, method = 'GET', data = {}) => {
  try {
    const res = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'content-type': 'application/json'
      }
    })
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data
    } else {
      Taro.showToast({
        title: res.data.detail || 'Request failed',
        icon: 'none'
      })
      throw new Error(res.data.detail || 'Request failed')
    }
  } catch (error) {
    Taro.showToast({
      title: error.message || 'Network error',
      icon: 'none'
    })
    throw error
  }
}
