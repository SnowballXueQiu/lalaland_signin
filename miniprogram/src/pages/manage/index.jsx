import { useEffect, useState } from 'react'
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
      const exportUrl = `${getBaseUrl()}/export/excel`
      let filePath = ''

      try {
        const downloadRes = await Taro.downloadFile({ url: exportUrl })
        if (downloadRes.statusCode >= 200 && downloadRes.statusCode < 300) {
          filePath = downloadRes.tempFilePath
        }
      } catch (downloadError) {
        console.warn('downloadFile failed, falling back to request', downloadError)
      }

      if (!filePath) {
        const response = await Taro.request({
          url: exportUrl,
          method: 'GET',
          responseType: 'arraybuffer'
        })
        if (response.statusCode < 200 || response.statusCode >= 300) {
          throw new Error('导出失败')
        }

        filePath = `${Taro.env.USER_DATA_PATH}/lalaland-export.xlsx`
        const fileSystem = Taro.getFileSystemManager()
        await new Promise((resolve, reject) => {
          fileSystem.writeFile({
            filePath,
            data: response.data,
            success: resolve,
            fail: reject
          })
        })
      }

      Taro.hideLoading()
      await Taro.openDocument({
        filePath,
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
            note='快速进入课程签到模式'
            arrow='right'
            iconInfo={{ size: 20, color: '#ff5ca8', value: 'check-circle' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/checkin/index' })}
          />
          <AtListItem
            title='学生管理'
            note='新增、编辑和删除学生'
            arrow='right'
            iconInfo={{ size: 20, color: '#2d8cf0', value: 'user' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/student/index' })}
          />
          <AtListItem
            title='课程管理'
            note='管理课程、学生与签到'
            arrow='right'
            iconInfo={{ size: 20, color: '#19be6b', value: 'calendar' }}
            onClick={() => Taro.navigateTo({ url: '/pages/manage/course/index' })}
          />
          <AtListItem
            title='团管理'
            note='维护团名称和分组列表'
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
