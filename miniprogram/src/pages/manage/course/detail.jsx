import React, { useState, useEffect } from 'react'
import { View, Text, Switch, ScrollView } from '@tarojs/components'
import { AtButton, AtTag, AtActionSheet, AtActionSheetItem, AtCalendar, AtCheckbox } from 'taro-ui'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../../utils/api'

export default function CourseDetail() {
  const [courseId, setCourseId] = useState(null)
  const [course, setCourse] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [studentPickerOpen, setStudentPickerOpen] = useState(false)
  const [studentFilterGroup, setStudentFilterGroup] = useState('全部')
  const [selectedStudentIds, setSelectedStudentIds] = useState([])
  
  // checkin mode
  const [isCheckinMode, setIsCheckinMode] = useState(false)
  const [attendDate, setAttendDate] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  
  const [attendanceList, setAttendanceList] = useState([])
  const [attendDateOpen, setAttendDateOpen] = useState(false)

  useShareAppMessage(() => {
    return {
      title: course ? `${course.name} - 课程详情` : '课程详情',
      path: `/pages/manage/course/detail?id=${courseId}`
    }
  })

  useShareTimeline(() => {
    return {
      title: course ? `${course.name} - 课程详情` : '课程详情',
      query: `id=${courseId}`
    }
  })

  const fetchCourseDetail = async (id) => {
    try {
      const data = await request(`/course/detail?course_id=${id}`)
      setCourse(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchAllStudents = async () => {
    try {
      const data = await request('/student/list')
      setAllStudents(data)
    } catch (e) {
      console.error(e)
    }
  }
  
  const fetchAttendanceList = async (id, dateStr) => {
    try {
      const data = await request(`/attendance/list?course_id=${id}&attend_date=${dateStr}`)
      setAttendanceList(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const instance = getCurrentInstance()
    const id = instance.router.params.id
    const mode = instance.router.params.mode
    if (mode === 'checkin') {
      setIsCheckinMode(true)
    }
    if (id) {
      setCourseId(id)
      fetchCourseDetail(id)
      fetchAllStudents()
      fetchAttendanceList(id, attendDate)
    }
  }, [])
  
  useEffect(() => {
    if (courseId && attendDate) {
      fetchAttendanceList(courseId, attendDate)
    }
  }, [attendDate, courseId])

  const handleAddStudent = async () => {
    try {
      if (!selectedStudentIds.length) {
        Taro.showToast({ title: '请选择学生', icon: 'none' })
        return
      }
      const toAdd = selectedStudentIds.filter(id => !enrolledIds.has(id))
      if (!toAdd.length) {
        Taro.showToast({ title: '所选学生已在课程中', icon: 'none' })
        return
      }
      await Promise.all(
        toAdd.map(studentId =>
          request('/course/addStudent', 'POST', {
            student_id: studentId,
            course_id: parseInt(courseId, 10)
          })
        )
      )
      Taro.showToast({ title: '添加成功', icon: 'success' })
      setSelectedStudentIds([])
      setStudentFilterGroup('全部')
      setStudentPickerOpen(false)
      fetchCourseDetail(courseId)
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveStudent = async (studentId) => {
    Taro.showModal({
      title: '确认',
      content: '确定要移除该学生吗？',
      success: async function (res) {
        if (res.confirm) {
          try {
            await request('/course/removeStudent', 'POST', {
              student_id: studentId,
              course_id: parseInt(courseId, 10)
            })
            Taro.showToast({ title: '移除成功', icon: 'success' })
            fetchCourseDetail(courseId)
          } catch (e) {
            console.error(e)
          }
        }
      }
    })
  }

  const handleDeleteStudent = async (student) => {
    Taro.showModal({
      title: '删除学生（不可恢复）',
      content: `将删除「${student.name}(${student.student_no})」的学生信息，并从所有课程中移除，同时删除签到记录与家长绑定。确定继续？`,
      confirmText: '删除',
      cancelText: '取消',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await request('/student/delete', 'POST', { student_id: student.id })
          Taro.showToast({ title: '已删除', icon: 'success' })
          fetchCourseDetail(courseId)
          fetchAllStudents()
          fetchAttendanceList(courseId, attendDate)
        } catch (e) {
          console.error(e)
          Taro.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    })
  }

  const toggleAttendance = async (studentId, isChecked) => {
    try {
      if (isChecked) {
        await request('/attendance/checkin', 'POST', {
          student_id: studentId,
          course_id: parseInt(courseId, 10),
          attend_date: attendDate
        })
      } else {
        await request('/attendance/delete', 'POST', {
          student_id: studentId,
          course_id: parseInt(courseId, 10),
          attend_date: attendDate
        })
      }
      // Refresh course detail for updated used_lessons and attendance list
      fetchCourseDetail(courseId)
      fetchAttendanceList(courseId, attendDate)
      Taro.showToast({ title: '操作成功', icon: 'success' })
    } catch (e) {
      console.error(e)
    }
  }

  if (!course) return <View className='container'><Text>Loading...</Text></View>

  const checkedStudentIds = attendanceList.map(a => a.student_id)
  const enrolledIds = new Set(course.students.map(s => s.id))
  const filteredStudents = allStudents.filter(s => {
    const g = s.group_name || '未分组'
    return studentFilterGroup === '全部' ? true : g === studentFilterGroup
  })
  const selectableStudentIds = filteredStudents.filter(s => !enrolledIds.has(s.id)).map(s => s.id)
  const selectedStudentIdSet = new Set(selectedStudentIds)
  const hasAllSelectableInFilter = selectableStudentIds.length > 0 && selectableStudentIds.every(id => selectedStudentIdSet.has(id))

  const toggleSelectAllInFilter = () => {
    if (!selectableStudentIds.length) return
    if (hasAllSelectableInFilter) {
      const removeSet = new Set(selectableStudentIds)
      setSelectedStudentIds(prev => prev.filter(id => !removeSet.has(id)))
      return
    }
    const next = new Set(selectedStudentIds)
    selectableStudentIds.forEach(id => next.add(id))
    setSelectedStudentIds(Array.from(next))
  }

  return (
    <View className='container' style={{ paddingBottom: '60rpx' }}>
      <View className='header'>
        <Text className='title'>{course.name} 详情</Text>
      </View>
      
      <View className='card'>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 30rpx', marginBottom: '20rpx' }}>
          <Text className='card-title' style={{ padding: 0, marginBottom: 0 }}>基本信息</Text>
          <Text style={{ fontSize: '26rpx', fontWeight: 900, color: 'rgba(29,27,49,0.55)' }}>
            开课：{course.start_date || '未设置'}
          </Text>
        </View>
        <View className='memphis-kpi'>
          <View className='memphis-kpi-item'>
            <Text className='memphis-kpi-label'>所属团</Text>
            <Text className='memphis-kpi-value'>{course.group_name}</Text>
          </View>
          <View className='memphis-kpi-item'>
            <Text className='memphis-kpi-label'>老师</Text>
            <Text className='memphis-kpi-value'>{course.teacher || '无'}</Text>
          </View>
          <View className='memphis-kpi-item'>
            <Text className='memphis-kpi-label'>总课时</Text>
            <Text className='memphis-kpi-value'>{course.total_lessons}</Text>
          </View>
        </View>
      </View>

      <View className='card'>
        <View className='memphis-row'>
          <Text style={{ fontSize: '32rpx', fontWeight: 900, color: '#1d1b31' }}>学生名单 ({course.students.length}人)</Text>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Text className='memphis-subtitle' style={{ marginRight: '12rpx' }}>签到模式</Text>
            <Switch checked={isCheckinMode} onChange={e => setIsCheckinMode(e.detail.value)} color='#ff5ca8' />
          </View>
        </View>
        
        {isCheckinMode && (
          <View className='memphis-form' style={{ paddingBottom: '20rpx' }}>
            <View
              className='memphis-picker-row'
              hoverClass='memphis-picker-row--hover'
              onClick={() => setAttendDateOpen(true)}
            >
              <Text className='memphis-picker-title'>签到日期</Text>
              <Text className='memphis-picker-value'>{attendDate}</Text>
            </View>
          </View>
        )}

        {course.students.length === 0 && <Text className='empty-text'>暂无学生</Text>}
        
        {course.students.map(s => {
          const isChecked = checkedStudentIds.includes(s.id)
          const remaining = course.total_lessons - s.used_lessons
          return (
            <View key={s.id} className='memphis-row memphis-divider'>
              <View>
                <View>
                  <Text style={{ fontWeight: 900, fontSize: '30rpx', color: '#1d1b31' }}>{s.name}</Text>
                  <Text style={{ fontSize: '26rpx', color: 'rgba(29,27,49,0.55)', marginLeft: '10rpx' }}>({s.student_no})</Text>
                </View>
                <View style={{ fontSize: '24rpx', color: 'rgba(29,27,49,0.72)', marginTop: '10rpx' }}>
                  已上 <Text style={{ fontWeight: 900 }}>{s.used_lessons}</Text> · 剩余 <Text style={{ fontWeight: 900 }}>{remaining}</Text>
                </View>
              </View>
              <View>
                {isCheckinMode ? (
                  <AtTag 
                    type='primary' 
                    active={isChecked}
                    onClick={() => toggleAttendance(s.id, !isChecked)}
                  >
                    {isChecked ? '已签到' : '未签到'}
                  </AtTag>
                ) : (
                  <View className='memphis-student-actions'>
                    <View className='memphis-action-btn delete' style={{ padding: '4rpx 16rpx', fontSize: '24rpx' }} onClick={() => handleRemoveStudent(s.id)}>移除</View>
                  </View>
                )}
              </View>
            </View>
          )
        })}
        
        {!isCheckinMode && (
          <View style={{ marginTop: '20px' }}>
            <View className='memphis-form'>
              <View
                className='memphis-picker-row'
                hoverClass='memphis-picker-row--hover'
                onClick={() => setStudentPickerOpen(true)}
              >
                <Text className='memphis-picker-title'>选择学生</Text>
                <Text className='memphis-picker-value'>
                  {selectedStudentIds.length ? `已选${selectedStudentIds.length}人` : '请选择'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <AtActionSheet
        isOpened={attendDateOpen}
        title='选择签到日期'
        cancelText='关闭'
        onClose={() => setAttendDateOpen(false)}
        onCancel={() => setAttendDateOpen(false)}
      >
        <View style={{ padding: '0 20rpx 10rpx 20rpx' }}>
          <AtCalendar
            isSwiper={true}
            minDate={course.start_date || '1970-01-01'}
            onSelectDate={(e) => {
              const dateStr = e?.value?.start
              if (dateStr) {
                setAttendDate(dateStr)
              }
              setAttendDateOpen(false)
            }}
          />
        </View>
      </AtActionSheet>

      <AtActionSheet
        isOpened={studentPickerOpen}
        title='选择学生'
        cancelText='关闭'
        className='memphis-action-sheet'
        onClose={() => setStudentPickerOpen(false)}
        onCancel={() => setStudentPickerOpen(false)}
      >
        <View style={{ padding: '0 20rpx 20rpx 20rpx' }}>
          <ScrollView scrollX style={{ whiteSpace: 'nowrap', padding: '12rpx 0' }}>
            <View style={{ display: 'flex', gap: '12rpx' }}>
              <AtTag
                type='primary'
                active={studentFilterGroup === '全部'}
                onClick={() => setStudentFilterGroup('全部')}
              >
                全部
              </AtTag>
              {[...new Set(allStudents.map(s => s.group_name || '未分组'))].map(g => (
                <AtTag
                  key={g}
                  type='primary'
                  active={studentFilterGroup === g}
                  onClick={() => setStudentFilterGroup(g)}
                >
                  {g}
                </AtTag>
              ))}
            </View>
          </ScrollView>

          <View className='memphis-filter-row'>
            <Text className='memphis-filter-left'>
              当前分类：{studentFilterGroup}
            </Text>
            <View className='memphis-filter-right'>
              <AtButton
                size='small'
                type='secondary'
                disabled={!selectableStudentIds.length}
                onClick={toggleSelectAllInFilter}
                customStyle={{ display: 'inline-flex', width: 'auto' }}
              >
                {hasAllSelectableInFilter ? '取消全选' : '全选'}
              </AtButton>
            </View>
          </View>

          <ScrollView scrollY style={{ height: '900rpx' }}>
            <AtCheckbox
              options={filteredStudents.map(s => ({
                value: s.id,
                label: `${s.name} (${s.student_no})`,
                desc: s.group_name || '未分组',
                disabled: enrolledIds.has(s.id)
              }))}
              selectedList={selectedStudentIds}
              onChange={(list) => setSelectedStudentIds(list)}
            />
          </ScrollView>

          <View style={{ marginTop: '18rpx' }}>
            <AtButton type='primary' onClick={handleAddStudent}>
              确认添加 ({selectedStudentIds.length})
            </AtButton>
          </View>
        </View>
      </AtActionSheet>
    </View>
  )
}
