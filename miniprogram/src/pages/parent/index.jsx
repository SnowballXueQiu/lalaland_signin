import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTag } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../utils/api'

export default function ParentIndex() {
  const [openid, setOpenid] = useState('')
  const [children, setChildren] = useState([])
  const [bindInfo, setBindInfo] = useState({ student_no: '', student_name: '' })
  // 全局显示模式: 'remaining' | 'used'
  const [displayMode, setDisplayMode] = useState('remaining')
  const [attendanceModal, setAttendanceModal] = useState({ visible: false, dates: [], courseName: '' })

  useShareAppMessage(() => ({ title: '合唱团家长端', path: '/pages/index/index' }))
  useShareTimeline(() => ({ title: '合唱团家长端' }))

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
    if (openid) fetchChildren()
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
      content: `确定要解绑团员 ${studentName} 吗？解绑后将无法查看该团员的课程和课时信息。`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await request('/parent/unbind', 'POST', { openid, student_id: studentId })
            Taro.showToast({ title: '解绑成功', icon: 'success' })
            fetchChildren()
          } catch (e) {
            console.error(e)
          }
        }
      }
    })
  }

  const viewAttendanceDetail = async (studentId, courseId, courseName) => {
    try {
      Taro.showLoading({ title: '加载中...' })
      const data = await request(`/parent/attendance?openid=${openid}&student_id=${studentId}&course_id=${courseId}`)
      Taro.hideLoading()
      const dates = (data.dates || []).map(d => String(d))
      setAttendanceModal({ visible: true, dates, courseName })
    } catch (e) {
      Taro.hideLoading()
      console.error(e)
    }
  }

  const closeModal = () => {
    setAttendanceModal({ visible: false, dates: [], courseName: '' })
  }

  const isUsedMode = displayMode === 'used'

  // 分段切换控件
  const SegmentedControl = () => (
    <View
      style={{
        display: 'flex',
        border: '4rpx solid #1d1b31',
        borderRadius: '12rpx',
        overflow: 'hidden',
        boxShadow: '4rpx 4rpx 0 #1d1b31'
      }}
    >
      <View
        onClick={() => setDisplayMode('remaining')}
        style={{ padding: '8rpx 22rpx', background: !isUsedMode ? '#1d1b31' : '#fff' }}
      >
        <Text style={{ fontSize: '24rpx', fontWeight: 900, color: !isUsedMode ? '#ffd640' : 'rgba(29,27,49,0.4)' }}>剩余次数</Text>
      </View>
      <View style={{ width: '4rpx', background: '#1d1b31' }} />
      <View
        onClick={() => setDisplayMode('used')}
        style={{ padding: '8rpx 22rpx', background: isUsedMode ? '#1d1b31' : '#fff' }}
      >
        <Text style={{ fontSize: '24rpx', fontWeight: 900, color: isUsedMode ? '#ffd640' : 'rgba(29,27,49,0.4)' }}>已签到</Text>
      </View>
    </View>
  )

  return (
    <ScrollView scrollY className='container' style={{ height: '100vh' }}>
      <View className='header'>
        <Text className='title'>家长端</Text>
      </View>

      {/* 绑定团员 */}
      <View className='card'>
        <Text className='card-title'>绑定团员</Text>
        <AtInput
          name='student_no'
          title='编号'
          type='text'
          placeholder='团员编号'
          value={bindInfo.student_no}
          onChange={(v) => setBindInfo({ ...bindInfo, student_no: v })}
        />
        <AtInput
          name='student_name'
          title='姓名'
          type='text'
          placeholder='团员姓名'
          value={bindInfo.student_name}
          onChange={(v) => setBindInfo({ ...bindInfo, student_name: v })}
          border={false}
        />
        <View style={{ marginTop: '20rpx', padding: '0 30rpx' }}>
          <AtButton type='primary' onClick={handleBind}>绑定</AtButton>
        </View>
      </View>

      {/* 我的团员 */}
      <View className='card'>
        {/* 标题栏 + 全局切换 */}
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30rpx', marginBottom: '20rpx' }}>
          <Text style={{ fontSize: '32rpx', fontWeight: 900, color: '#1d1b31' }}>我的团员</Text>
          <SegmentedControl />
        </View>

        {children.length === 0 && (
          <Text className='empty-text'>暂未绑定团员</Text>
        )}

        {children.map((child, childIdx) => (
          <View key={child.id}>
            {/* 学生信息行 */}
            <View style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18rpx 30rpx',
              background: '#ffd640',
              borderTop: '4rpx solid #1d1b31',
              borderBottom: '4rpx solid #1d1b31'
            }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: '34rpx', fontWeight: 900, color: '#1d1b31', display: 'block' }}>
                  {child.name}
                </Text>
                <Text style={{ fontSize: '26rpx', color: 'rgba(29,27,49,0.65)', fontWeight: 700, display: 'block', marginTop: '4rpx' }}>
                  {child.student_no} · {child.group_name || '未分组'}
                </Text>
              </View>
              <View style={{ flexShrink: 0, marginLeft: '20rpx' }}>
                <AtButton size='small' type='secondary' onClick={() => handleUnbind(child.id, child.name)}>
                  解绑
                </AtButton>
              </View>
            </View>

            {/* 课程列表 */}
            {child.courses.length === 0 && (
              <Text className='empty-text'>暂无课程</Text>
            )}
            {child.courses.map((course, idx) => (
              <View
                key={idx}
                className='memphis-course-row'
                style={{ borderTop: idx === 0 ? 'none' : '2rpx solid rgba(29,27,49,0.08)' }}
              >
                <View className='memphis-course-main'>
                  <Text className='memphis-course-title' style={{ display: 'block', marginBottom: '8rpx' }}>{course.course_name}</Text>
                  <Text className='memphis-course-note' style={{ display: 'block' }}>
                    {'总课时 ' + course.total_lessons + ' · 已签到 ' + course.used_lessons + ' · 剩余 ' + course.remaining_lessons}
                  </Text>
                </View>

                {/* 数字展示 */}
                <View style={{
                  background: isUsedMode ? '#00d8ff' : '#ff5ca8',
                  border: '4rpx solid #1d1b31',
                  borderRadius: '16rpx',
                  boxShadow: '4rpx 4rpx 0 #1d1b31',
                  padding: '6rpx 16rpx',
                  minWidth: '76rpx',
                  textAlign: 'center',
                  marginRight: '20rpx',
                  flexShrink: 0
                }}>
                  <Text style={{ fontSize: '44rpx', fontWeight: 900, color: '#1d1b31', lineHeight: 1.1, display: 'block' }}>
                    {isUsedMode ? course.used_lessons : course.remaining_lessons}
                  </Text>
                  <Text style={{ fontSize: '22rpx', fontWeight: 900, color: 'rgba(29,27,49,0.6)', display: 'block' }}>
                    {isUsedMode ? '已签到' : '剩余'}
                  </Text>
                </View>

                {/* 详情按钮 */}
                <View style={{ flexShrink: 0 }}>
                  <AtButton
                    size='small'
                    type='secondary'
                    onClick={() => viewAttendanceDetail(child.id, course.course_id, course.course_name)}
                  >
                    详情
                  </AtButton>
                </View>
              </View>
            ))}

            {/* 学生间分隔 */}
            {childIdx < children.length - 1 && (
              <View style={{ height: '16rpx', background: 'rgba(29,27,49,0.04)', borderTop: '4rpx solid #1d1b31' }} />
            )}
          </View>
        ))}
      </View>

      {/* 签到日期弹窗 */}
      <AtModal isOpened={attendanceModal.visible} onClose={closeModal}>
        <AtModalHeader>{attendanceModal.courseName} · 签到记录</AtModalHeader>
        <AtModalContent>
          {attendanceModal.dates.length === 0 ? (
            <View style={{ textAlign: 'center', padding: '30rpx 0' }}>
              <Text style={{ fontSize: '28rpx', color: '#999', fontWeight: 900 }}>暂无签到记录</Text>
            </View>
          ) : (
            <View style={{ paddingTop: '16rpx', paddingBottom: '10rpx' }}>
              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20rpx' }}>
                <Text style={{ fontSize: '28rpx', fontWeight: 900, color: '#1d1b31' }}>共签到</Text>
                <AtTag type='primary' active>{attendanceModal.dates.length} 次</AtTag>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '14rpx' }}>
                {attendanceModal.dates.map((d, i) => (
                  <View key={i} style={{
                    background: i % 3 === 0 ? '#ffd640' : i % 3 === 1 ? '#00d8ff' : '#ff5ca8',
                    border: '3rpx solid #1d1b31',
                    borderRadius: '12rpx',
                    boxShadow: '4rpx 4rpx 0 #1d1b31',
                    padding: '10rpx 18rpx'
                  }}>
                    <Text style={{ fontSize: '26rpx', fontWeight: 900, color: '#1d1b31' }}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </AtModalContent>
        <AtModalAction>
          <AtButton onClick={closeModal}>关闭</AtButton>
        </AtModalAction>
      </AtModal>

    </ScrollView>
  )
}
