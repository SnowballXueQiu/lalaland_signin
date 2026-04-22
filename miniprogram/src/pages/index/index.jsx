import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../utils/api'
import './index.scss'

export default function Index() {
  const [loading, setLoading] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)

  useShareAppMessage(() => {
    return {
      title: '培训/合唱团管理系统',
      path: '/pages/index/index'
    }
  })

  useShareTimeline(() => {
    return {
      title: '培训/合唱团管理系统'
    }
  })

  const handleLogin = async () => {
    setLoading(true)
    try {
      // In a real WeChat environment, this gets the actual code.
      // In H5/web, this will fail unless polyfilled, so we simulate it if we are not in weapp
      let code = "admin_code" // For local testing, use 'admin_code' to simulate admin, 'parent_code' for parent
      let mockOpenid = Taro.getStorageSync('mock_openid')
      if (!mockOpenid) {
        mockOpenid = `mock_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`
        Taro.setStorageSync('mock_openid', mockOpenid)
      }
      
      if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
        const loginRes = await Taro.login()
        if (loginRes.code) {
          code = loginRes.code
        } else {
          throw new Error('微信登录失败')
        }
      }

      const res = await request('/auth/login', 'POST', { code, mock_openid: mockOpenid })
      Taro.setStorageSync('openid', res.openid)
      Taro.setStorageSync('role', res.role)

      if (res.role === 'admin') {
        Taro.navigateTo({ url: '/pages/manage/index' })
      } else {
        Taro.navigateTo({ url: '/pages/parent/index' })
      }
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async () => {
    if (!adminPassword) {
      Taro.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    setAdminLoading(true)
    try {
      const res = await request('/auth/admin_password_login', 'POST', { password: adminPassword })
      Taro.setStorageSync('openid', res.openid)
      Taro.setStorageSync('role', res.role)
      setAdminModalOpen(false)
      setAdminPassword('')
      Taro.navigateTo({ url: '/pages/manage/index' })
    } catch (e) {
      console.error(e)
      Taro.showToast({ title: '密码错误', icon: 'none' })
    } finally {
      setAdminLoading(false)
    }
  }

  const closeAdminModal = () => {
    setAdminModalOpen(false)
    setAdminPassword('')
  }

  return (
    <View className='login-page'>
      <View className='login-hero'>
        <Text className='login-title'>爱乐之城</Text>
        <Text className='login-subtitle'>排练次数统计面板</Text>
        <View className='music-chips'>
          <Text className='music-chip music-chip-blue'>合唱</Text>
        </View>
      </View>
      <View className='login-card'>
        <AtButton
          type='primary'
          circle
          loading={loading}
          onClick={handleLogin}
        >
          微信一键登录
        </AtButton>
      </View>

      <View className='admin-entry'>
        <AtButton size='small' type='secondary' circle onClick={() => setAdminModalOpen(true)}>
          管理
        </AtButton>
      </View>

      {adminModalOpen ? (
        <AtModal isOpened onClose={closeAdminModal}>
          <AtModalHeader>管理员登录</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='admin_password'
              title='密码'
              type='password'
              placeholder='请输入超管密码'
              value={adminPassword}
              onChange={(v) => setAdminPassword(v)}
            />
          </AtModalContent>
          <AtModalAction>
            <AtButton type='secondary' onClick={closeAdminModal}>取消</AtButton>
            <AtButton type='primary' loading={adminLoading} onClick={handleAdminLogin}>确定</AtButton>
          </AtModalAction>
        </AtModal>
      ) : null}
    </View>
  )
}
