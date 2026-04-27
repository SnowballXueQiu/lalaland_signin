import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Taro from '@tarojs/taro'
import { getBaseUrl } from '../../utils/api'

export default function ManageIndex() {
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const role = Taro.getStorageSync('role')
    if (role !== 'admin') {
      Taro.reLaunch({ url: '/pages/index/index' })
    }
  }, [])

  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    Taro.showLoading({ title: '导出中...' })
    try {
      const downloadRes = await Taro.downloadFile({
        url: `${getBaseUrl()}/export/excel`
      })
      if (downloadRes.statusCode < 200 || downloadRes.statusCode >= 300) {
        throw new Error('导出失败')
      }
      const saveRes = await Taro.saveFile({ tempFilePath: downloadRes.tempFilePath })
      Taro.hideLoading()
      await Taro.openDocument({
        filePath: saveRes.savedFilePath,
        fileType: 'xlsx',
        showMenu: true
      })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: error.message || '导出失败',
        icon: 'none'
      })
    } finally {
      setExporting(false)
    }
  }

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
          <AtListItem
            title={exporting ? '导出数据中...' : '导出数据'}
            note='导出 Excel 多工作表'
            arrow='right'
            iconInfo={{ size: 20, color: '#f6c343', value: 'download' }}
            onClick={handleExport}
          />
        </AtList>
      </View>
    </View>
  )
}
