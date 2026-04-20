import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtInput, AtButton, AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtCalendar } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../../utils/api'

const GROUPS = ['少年团', '女声团', '混声团', 'Dreamers', '童声2团', '童声3团', '启蒙1团', '启蒙2团', '启蒙3团', '启蒙4团', '启蒙5团', '启蒙六团']

export default function CourseManage() {
  const [courses, setCourses] = useState([])
  const [newCourse, setNewCourse] = useState({ name: '', group_name: '', teacher: '', start_date: '', total_lessons: '20' })
  const [groupSheetOpen, setGroupSheetOpen] = useState(false)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)

  useShareAppMessage(() => {
    return {
      title: '课程管理',
      path: '/pages/index/index'
    }
  })

  useShareTimeline(() => {
    return {
      title: '课程管理'
    }
  })

  const fetchCourses = async () => {
    try {
      const data = await request('/course/list')
      setCourses(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCreate = async () => {
    if (!newCourse.name || !newCourse.group_name) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    try {
      await request('/course/create', 'POST', {
        ...newCourse,
        total_lessons: parseInt(newCourse.total_lessons, 10)
      })
      Taro.showToast({ title: '添加成功', icon: 'success' })
      setNewCourse({ name: '', group_name: '', teacher: '', start_date: '', total_lessons: '20' })
      fetchCourses()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>课程管理</Text>
      </View>
      
      <View className='card'>
        <Text className='card-title'>新增课程</Text>
        <View className='memphis-form'>
        <AtInput 
          name='name'
          title='课程名称'
          type='text' 
          placeholder='课程名称' 
          value={newCourse.name}
          onChange={(v) => setNewCourse({...newCourse, name: v})} 
        />
        <View
          className='memphis-picker-row'
          hoverClass='memphis-picker-row--hover'
          onClick={() => setGroupSheetOpen(true)}
        >
          <Text className='memphis-picker-title'>所属团</Text>
          <Text className='memphis-picker-value'>{newCourse.group_name || '请选择'}</Text>
        </View>
        <AtInput 
          name='teacher'
          title='老师'
          type='text' 
          placeholder='老师姓名' 
          value={newCourse.teacher}
          onChange={(v) => setNewCourse({...newCourse, teacher: v})} 
        />
        <View
          className='memphis-picker-row'
          hoverClass='memphis-picker-row--hover'
          onClick={() => setDateSheetOpen(true)}
        >
          <Text className='memphis-picker-title'>开课日期</Text>
          <Text className='memphis-picker-value'>{newCourse.start_date || '请选择日期'}</Text>
        </View>
        <AtInput 
          name='total_lessons'
          title='总课时'
          type='number'
          placeholder='默认20' 
          value={newCourse.total_lessons}
          onChange={(v) => setNewCourse({...newCourse, total_lessons: v})} 
          border={false}
        />
        </View>
        <View style={{ marginTop: '15px', padding: '0 15px' }}>
          <AtButton type='primary' onClick={handleCreate}>添加</AtButton>
        </View>
      </View>

      <AtActionSheet
        isOpened={groupSheetOpen}
        title='选择所属团'
        cancelText='取消'
        onClose={() => setGroupSheetOpen(false)}
        onCancel={() => setGroupSheetOpen(false)}
      >
        {GROUPS.map(g => (
          <AtActionSheetItem
            key={g}
            onClick={() => {
              setNewCourse(prev => ({ ...prev, group_name: g }))
              setGroupSheetOpen(false)
            }}
          >
            {g}
          </AtActionSheetItem>
        ))}
      </AtActionSheet>

      <AtActionSheet
        isOpened={dateSheetOpen}
        title='选择开课日期'
        cancelText='关闭'
        onClose={() => setDateSheetOpen(false)}
        onCancel={() => setDateSheetOpen(false)}
      >
        <View style={{ padding: '0 20rpx 10rpx 20rpx' }}>
          <AtCalendar
            isSwiper={true}
            onSelectDate={(e) => {
              const dateStr = e?.value?.start
              if (dateStr) {
                setNewCourse(prev => ({ ...prev, start_date: dateStr }))
              }
              setDateSheetOpen(false)
            }}
          />
        </View>
      </AtActionSheet>

      <View className='card'>
        <Text className='card-title'>课程列表</Text>
        {courses.length === 0 && <Text className='empty-text'>暂无课程数据</Text>}
        <AtList>
          {courses.map(c => (
            <AtListItem 
              key={c.id} 
              title={c.name}
              note={`团: ${c.group_name} | 老师: ${c.teacher || '无'}`}
              extraText={`课时: ${c.total_lessons}`}
              arrow='right'
              onClick={() => Taro.navigateTo({ url: `/pages/manage/course/detail?id=${c.id}` })}
            />
          ))}
        </AtList>
      </View>
    </View>
  )
}
