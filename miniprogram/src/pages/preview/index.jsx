import React, { useMemo, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtButton, AtTag, AtActionSheet } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import './index.scss'

export default function Preview() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState('c1')

  const courses = useMemo(() => ([
    {
      id: 'c1',
      name: '合唱排练',
      group_name: '少年团',
      teacher: '王老师',
      start_date: '2026-04-01',
      total_lessons: 20,
      students: [
        { id: 's1', student_no: '240159', name: '示例同学A', used_lessons: 3 },
        { id: 's2', student_no: '240003', name: '示例同学B', used_lessons: 5 },
        { id: 's3', student_no: '250275', name: '示例同学C', used_lessons: 2 }
      ]
    },
    {
      id: 'c2',
      name: '童声团排练',
      group_name: '童声3团',
      teacher: '李老师',
      start_date: '2026-03-15',
      total_lessons: 16,
      students: [
        { id: 's4', student_no: '250416', name: '示例同学D', used_lessons: 4 },
        { id: 's5', student_no: '250448', name: '示例同学E', used_lessons: 1 }
      ]
    }
  ]), [])

  const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId) || courses[0], [courses, selectedCourseId])

  useShareAppMessage(() => {
    return {
      title: '预览体验',
      path: '/pages/preview/index'
    }
  })

  useShareTimeline(() => {
    return {
      title: '预览体验'
    }
  })

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>预览体验</Text>
      </View>

      <View className='card'>
        <Text className='card-title'>说明</Text>
        <View className='card-content'>
          <Text>这里是展示的预览页面，无需登录，且不会触发任何授权。</Text>
        </View>
      </View>

      <View className='card'>
        <Text className='card-title'>排练列表（示例）</Text>
        <View className='memphis-course-list'>
          {courses.map(c => (
            <View
              key={c.id}
              className='memphis-course-row'
              onClick={() => {
                setSelectedCourseId(c.id)
                setDetailOpen(true)
              }}
            >
              <View className='memphis-course-main'>
                <View className='memphis-course-top'>
                  <Text className='memphis-course-title'>{c.name}</Text>
                </View>
                <Text className='memphis-course-note'>团: {c.group_name} | 指挥: {c.teacher || '无'} | 课时: {c.total_lessons}</Text>
              </View>
              <View className='memphis-course-actions'>
                <AtButton size='small' type='secondary'>查看</AtButton>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{ padding: '0 24rpx' }}>
        <AtButton type='secondary' onClick={() => Taro.navigateBack()}>
          返回首页
        </AtButton>
      </View>

      <AtActionSheet
        isOpened={detailOpen}
        title='课程详情（预览）'
        cancelText='关闭'
        onClose={() => setDetailOpen(false)}
        onCancel={() => setDetailOpen(false)}
      >
        <View style={{ padding: '20rpx 20rpx 20rpx 20rpx' }}>
          <View className='card' style={{ margin: 0 }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 30rpx', marginBottom: '20rpx' }}>
              <Text className='card-title' style={{ padding: 0, marginBottom: 0 }}>基本信息</Text>
              <Text style={{ fontSize: '26rpx', fontWeight: 900, color: 'rgba(29,27,49,0.55)' }}>
                开课：{selectedCourse.start_date || '未设置'}
              </Text>
            </View>
            <View className='memphis-kpi'>
              <View className='memphis-kpi-item'>
                <Text className='memphis-kpi-label'>所属团</Text>
                <Text className='memphis-kpi-value'>{selectedCourse.group_name}</Text>
              </View>
              <View className='memphis-kpi-item'>
                <Text className='memphis-kpi-label'>指挥</Text>
                <Text className='memphis-kpi-value'>{selectedCourse.teacher || '无'}</Text>
              </View>
              <View className='memphis-kpi-item'>
                <Text className='memphis-kpi-label'>总课时</Text>
                <Text className='memphis-kpi-value'>{selectedCourse.total_lessons}</Text>
              </View>
            </View>
          </View>

          <View className='card' style={{ marginTop: '20rpx' }}>
            <View className='memphis-row'>
              <Text style={{ fontSize: '32rpx', fontWeight: 900, color: '#1d1b31' }}>学生名单 ({selectedCourse.students.length}人)</Text>
              <AtTag type='primary' active>预览</AtTag>
            </View>
            {selectedCourse.students.map(s => (
              <View key={s.id} className='memphis-row memphis-divider'>
                <View>
                  <View>
                    <Text style={{ fontWeight: 900, fontSize: '30rpx', color: '#1d1b31' }}>{s.name}</Text>
                    <Text style={{ fontSize: '26rpx', color: 'rgba(29,27,49,0.55)', marginLeft: '10rpx' }}>({s.student_no})</Text>
                  </View>
                  <View style={{ fontSize: '24rpx', color: 'rgba(29,27,49,0.72)', marginTop: '10rpx' }}>
                    已上 <Text style={{ fontWeight: 900 }}>{s.used_lessons}</Text> · 剩余 <Text style={{ fontWeight: 900 }}>{selectedCourse.total_lessons - s.used_lessons}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </AtActionSheet>
    </View>
  )
}
