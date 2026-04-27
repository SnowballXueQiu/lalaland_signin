import React, { useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Taro from '@tarojs/taro'

export default function ManageIndex() {
  useEffect(() => {
    const role = Taro.getStorageSync('role')
    if (role !== 'admin') {
      Taro.reLaunch({ url: '/pages/index/index' })
    }
  }, [])

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>管理员后台</Text>
      </View>
      <View className='card'>
        <Text className='card-title'>快捷入口</Text>
        <AtList hasBorder={false}>
          <AtListItem
            title='快捷签到'
            arrow='right'
            iconInfo={{ size: 20, color: '#ff5ca8', value: 'check-circle' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/checkin/index' })}
          />
          <AtListItem
            title='学生管理'
            arrow='right'
            iconInfo={{ size: 20, color: '#2d8cf0', value: 'user' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/student/index' })}
          />
          <AtListItem
            title='课程管理'
            arrow='right'
            iconInfo={{ size: 20, color: '#19be6b', value: 'calendar' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/course/index' })}
          />
          <AtListItem
            title='团管理'
            arrow='right'
            iconInfo={{ size: 20, color: '#8a2be2', value: 'list' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/group/index' })}
          />
        </AtList>
      </View>
    </View>
  )
}
