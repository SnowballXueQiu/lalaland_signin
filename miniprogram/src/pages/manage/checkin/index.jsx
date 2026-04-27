import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { request } from '../../../utils/api'
import Taro from '@tarojs/taro'
import './index.scss'

export default function CheckinIndex() {
  const [courses, setCourses] = useState([])

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

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>快捷签到</Text>
      </View>
      <View className='card'>
        <Text className='card-title'>选择课程以开始签到</Text>
        {courses.length === 0 && <Text className='empty-text'>暂无课程</Text>}
        <View className='memphis-course-list'>
          {courses.map(c => (
            <View 
              key={c.id} 
              className='memphis-course-row' 
              hoverClass='memphis-course-row--hover'
              onClick={() => Taro.navigateTo({ url: `/pages/manage/course/detail?id=${c.id}&mode=checkin` })}
            >
              <View className='memphis-course-main'>
                <View className='memphis-course-top'>
                  <Text className='memphis-course-title'>{c.name}</Text>
                </View>
                <Text className='memphis-course-note'>团: {c.group_name} | 老师: {c.teacher || '无'} | 课时: {c.total_lessons}</Text>
              </View>
              <View className='memphis-course-actions'>
                <View className='memphis-action-btn' style={{ background: '#ff5ca8', color: '#fff' }}>去签到</View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
