import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtInput, AtButton, AtCard, AtList, AtListItem } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../utils/api'

export default function ParentIndex() {
  const [openid, setOpenid] = useState('')
  const [children, setChildren] = useState([])
  const [bindInfo, setBindInfo] = useState({ student_no: '', student_name: '' })

  useShareAppMessage(() => {
    return {
      title: '合唱团家长端',
      path: '/pages/index/index'
    }
  })

  useShareTimeline(() => {
    return {
      title: '合唱团家长端'
    }
  })

  useEffect(() => {
    const storedOpenid = Taro.getStorageSync('openid')
    if (storedOpenid) {
      setOpenid(storedOpenid)
    } else {
      Taro.showToast({ title: '未登录', icon: 'none' })
      Taro.redirectTo({ url: '/pages/index/index' })
    }
  }, [])

  const fetchChildren = async () => {
    if (!openid) return
    try {
      const data = await request(`/parent/children?openid=${openid}`)
      setChildren(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (openid) {
      fetchChildren()
    }
  }, [openid])

  const handleBind = async () => {
    if (!bindInfo.student_no || !bindInfo.student_name || !openid) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    try {
      await request('/parent/bind', 'POST', {
        openid,
        student_no: bindInfo.student_no,
        student_name: bindInfo.student_name
      })
      Taro.showToast({ title: '绑定成功', icon: 'success' })
      setBindInfo({ student_no: '', student_name: '' })
      fetchChildren()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUnbind = (studentId, studentName) => {
    Taro.showModal({
      title: '确认解绑',
      content: `确定要解绑孩子 ${studentName} 吗？解绑后将无法查看该孩子的课程和课时信息。`,
      success: async function (res) {
        if (res.confirm) {
          try {
            await request('/parent/unbind', 'POST', {
              openid,
              student_id: studentId
            })
            Taro.showToast({ title: '解绑成功', icon: 'success' })
            fetchChildren()
          } catch (e) {
            console.error(e)
          }
        }
      }
    })
  }

  return (
    <ScrollView scrollY className='container' style={{ height: '100vh' }}>
      <View className='header'>
        <Text className='title'>家长端</Text>
      </View>
      
      <View className='card'>
        <Text className='card-title'>绑定孩子</Text>
        <AtInput 
          name='student_no'
          title='学号'
          type='text' 
          placeholder='孩子学号' 
          value={bindInfo.student_no}
          onChange={(v) => setBindInfo({...bindInfo, student_no: v})} 
        />
        <AtInput 
          name='student_name'
          title='姓名'
          type='text' 
          placeholder='孩子姓名' 
          value={bindInfo.student_name}
          onChange={(v) => setBindInfo({...bindInfo, student_name: v})} 
          border={false}
        />
        <View style={{ marginTop: '15px', padding: '0 15px' }}>
          <AtButton type='primary' onClick={handleBind}>绑定</AtButton>
        </View>
      </View>

      <View className='card'>
        <Text className='card-title'>我的孩子</Text>
        {children.length === 0 && <Text className='empty-text'>暂未绑定孩子</Text>}
        
        {children.map(child => (
          <View key={child.id} style={{ padding: '0 30rpx', marginBottom: '30rpx' }}>
            <AtCard
              title={`${child.name} (${child.student_no})`}
              extra={child.group_name || '未分组'}
            >
              <View style={{ marginBottom: '18rpx' }}>
                <AtButton size='small' type='secondary' onClick={() => handleUnbind(child.id, child.name)}>
                  解绑
                </AtButton>
              </View>

              {child.courses.length === 0 && <Text className='empty-text'>暂无课程</Text>}
              {child.courses.length > 0 && (
                <AtList hasBorder={false}>
                  {child.courses.map((course, idx) => (
                    <AtListItem
                      key={idx}
                      title={course.course_name}
                      note={`总课时 ${course.total_lessons} · 已上 ${course.used_lessons}`}
                      extraText={`剩余 ${course.remaining_lessons}`}
                      hasBorder={false}
                    />
                  ))}
                </AtList>
              )}
            </AtCard>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
