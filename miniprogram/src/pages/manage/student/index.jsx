import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtInput, AtButton, AtList, AtListItem, AtAccordion, AtActionSheet, AtActionSheetItem, AtSwipeAction, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../../utils/api'

export default function StudentManage() {
  const [students, setStudents] = useState([])
  const [groupNames, setGroupNames] = useState([])
  const [newStudent, setNewStudent] = useState({ student_no: '', name: '', group_name: '' })
  const [openGroups, setOpenGroups] = useState({})
  const [groupSheetOpen, setGroupSheetOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState({ id: null, student_no: '', name: '', group_name: '' })
  const [editGroupSheetOpen, setEditGroupSheetOpen] = useState(false)

  useShareAppMessage(() => {
    return {
      title: '学生管理',
      path: '/pages/index/index'
    }
  })

  useShareTimeline(() => {
    return {
      title: '学生管理'
    }
  })

  const fetchStudents = async () => {
    try {
      const data = await request('/student/list')
      setStudents(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchGroups = async () => {
    try {
      const data = await request('/group/list')
      setGroupNames((data || []).map(g => g.name))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchStudents()
    fetchGroups()
  }, [])

  const groupedStudents = useMemo(() => {
    const grouped = {}
    groupNames.forEach(g => (grouped[g] = []))
    
    students.forEach(s => {
      const group = s.group_name || '未分组'
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(s)
    })
    
    // Filter out empty groups
    const result = {}
    Object.keys(grouped).forEach(k => {
      if (grouped[k].length > 0) {
        result[k] = grouped[k]
      }
    })
    return result
  }, [students, groupNames])

  const handleCreate = async () => {
    if (!newStudent.student_no || !newStudent.name) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    try {
      await request('/student/create', 'POST', newStudent)
      Taro.showToast({ title: '添加成功', icon: 'success' })
      setNewStudent({ student_no: '', name: '', group_name: '' })
      fetchStudents()
    } catch (e) {
      console.error(e)
    }
  }

  const openEdit = (s) => {
    setEditStudent({
      id: s.id,
      student_no: s.student_no || '',
      name: s.name || '',
      group_name: s.group_name || ''
    })
    setEditModalOpen(true)
  }

  const handleUpdate = async () => {
    if (!editStudent.id) return
    if (!editStudent.student_no || !editStudent.name) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }
    const dup = students.some(s => s.student_no === editStudent.student_no && s.id !== editStudent.id)
    if (dup) {
      Taro.showToast({ title: '学号已存在', icon: 'none' })
      return
    }
    try {
      await request('/student/update', 'POST', {
        id: editStudent.id,
        student_no: editStudent.student_no,
        name: editStudent.name,
        group_name: editStudent.group_name || null
      })
      Taro.showToast({ title: '已保存', icon: 'success' })
      setEditModalOpen(false)
      fetchStudents()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (s) => {
    Taro.showModal({
      title: '删除学生（不可恢复）',
      content: '将删除该学生信息，并从所有课程中移除，同时删除签到记录与家长绑定。确定继续？',
      confirmText: '删除',
      cancelText: '取消',
      success: async (res) => {
        if (!res.confirm) return
        try {
          await request('/student/delete', 'POST', { student_id: s.id })
          Taro.showToast({ title: '已删除', icon: 'success' })
          fetchStudents()
        } catch (e) {
          console.error(e)
          Taro.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    })
  }

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>学生管理</Text>
      </View>
      
      <View className='card'>
        <Text className='card-title'>新增学生</Text>
        <View className='memphis-form'>
        <AtInput 
          name='student_no' 
          title='学号' 
          type='text' 
          placeholder='学号' 
          value={newStudent.student_no} 
          onChange={(v) => setNewStudent({...newStudent, student_no: v})} 
        />
        <AtInput 
          name='name' 
          title='姓名' 
          type='text' 
          placeholder='姓名' 
          value={newStudent.name} 
          onChange={(v) => setNewStudent({...newStudent, name: v})} 
        />
        <View
          className='memphis-picker-row'
          hoverClass='memphis-picker-row--hover'
          onClick={() => setGroupSheetOpen(true)}
        >
          <Text className='memphis-picker-title'>所在团</Text>
          <Text className='memphis-picker-value'>{newStudent.group_name || '请选择'}</Text>
        </View>
        </View>
        <View style={{ marginTop: '15px', padding: '0 15px' }}>
          <AtButton type='primary' onClick={handleCreate}>添加</AtButton>
        </View>
      </View>

      <AtActionSheet
        isOpened={groupSheetOpen}
        title='选择所在团'
        cancelText='取消'
        onClose={() => setGroupSheetOpen(false)}
        onCancel={() => setGroupSheetOpen(false)}
      >
        <ScrollView scrollY style={{ maxHeight: '900rpx' }}>
          {groupNames.map(g => (
            <AtActionSheetItem
              key={g}
              onClick={() => {
                setNewStudent(prev => ({ ...prev, group_name: g }))
                setGroupSheetOpen(false)
              }}
            >
              {g}
            </AtActionSheetItem>
          ))}
        </ScrollView>
      </AtActionSheet>

      <View className='card' style={{ paddingBottom: '20px' }}>
        <Text className='card-title'>学生列表</Text>
        {students.length === 0 && <Text className='empty-text'>暂无学生数据</Text>}
        {Object.keys(groupedStudents).map(group => (
          <AtAccordion
            key={group}
            open={!!openGroups[group]}
            onClick={(open) => setOpenGroups(prev => ({ ...prev, [group]: open }))}
            title={group}
            note={`${groupedStudents[group].length}人`}
            hasBorder={false}
            isAnimation={false}
          >
            <AtList hasBorder={false}>
              {groupedStudents[group].map(s => (
                <AtSwipeAction
                  key={s.id}
                  autoClose
                  options={[
                    { text: '编辑', style: { backgroundColor: '#00d8ff', color: '#1d1b31', fontWeight: 900 } },
                    { text: '删除', style: { backgroundColor: '#ff2d55', color: '#fff', fontWeight: 900 } }
                  ]}
                  onClick={(item) => {
                    if (item.text === '编辑') openEdit(s)
                    if (item.text === '删除') handleDelete(s)
                  }}
                >
                  <AtListItem
                    title={s.name}
                    extraText={s.student_no}
                    hasBorder
                    arrow='right'
                    onClick={() => openEdit(s)}
                  />
                </AtSwipeAction>
              ))}
            </AtList>
          </AtAccordion>
        ))}
      </View>

      <AtModal isOpened={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <AtModalHeader>编辑学生</AtModalHeader>
        <AtModalContent>
          <View className='memphis-form'>
            <AtInput
              name='edit_student_no'
              title='学号'
              type='text'
              placeholder='学号'
              value={editStudent.student_no}
              onChange={(v) => setEditStudent(prev => ({ ...prev, student_no: v }))}
            />
            <AtInput
              name='edit_name'
              title='姓名'
              type='text'
              placeholder='姓名'
              value={editStudent.name}
              onChange={(v) => setEditStudent(prev => ({ ...prev, name: v }))}
            />
            <View
              className='memphis-picker-row'
              hoverClass='memphis-picker-row--hover'
              onClick={() => setEditGroupSheetOpen(true)}
            >
              <Text className='memphis-picker-title'>所在团</Text>
              <Text className='memphis-picker-value'>{editStudent.group_name || '请选择'}</Text>
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <AtButton type='secondary' onClick={() => setEditModalOpen(false)}>取消</AtButton>
          <AtButton type='primary' onClick={handleUpdate}>保存</AtButton>
        </AtModalAction>
      </AtModal>

      <AtActionSheet
        isOpened={editGroupSheetOpen}
        title='选择所在团'
        cancelText='取消'
        onClose={() => setEditGroupSheetOpen(false)}
        onCancel={() => setEditGroupSheetOpen(false)}
      >
        <ScrollView scrollY style={{ maxHeight: '900rpx' }}>
          {groupNames.map(g => (
            <AtActionSheetItem
              key={g}
              onClick={() => {
                setEditStudent(prev => ({ ...prev, group_name: g }))
                setEditGroupSheetOpen(false)
              }}
            >
              {g}
            </AtActionSheetItem>
          ))}
        </ScrollView>
      </AtActionSheet>
    </View>
  )
}
