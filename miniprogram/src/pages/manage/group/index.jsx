import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { request } from '../../../utils/api'

export default function GroupManage() {
  const [groups, setGroups] = useState([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editGroup, setEditGroup] = useState({ id: null, name: '' })

  useShareAppMessage(() => {
    return {
      title: '团管理',
      path: '/pages/index/index'
    }
  })

  useShareTimeline(() => {
    return {
      title: '团管理'
    }
  })

  const fetchGroups = async () => {
    try {
      const data = await request('/group/list')
      setGroups(data || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const role = Taro.getStorageSync('role')
    if (role !== 'admin') {
      Taro.reLaunch({ url: '/pages/index/index' })
      return
    }
    fetchGroups()
  }, [])

  const handleCreate = async () => {
    const name = (newName || '').trim()
    if (!name) {
      Taro.showToast({ title: '请输入团名称', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      await request('/group/create', 'POST', { name })
      setNewName('')
      Taro.showToast({ title: '添加成功', icon: 'success' })
      fetchGroups()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (g) => {
    setEditGroup({ id: g.id, name: g.name })
    setEditOpen(true)
  }

  const closeEdit = () => {
    setEditOpen(false)
    setEditGroup({ id: null, name: '' })
  }

  const handleUpdate = async () => {
    const name = (editGroup.name || '').trim()
    if (!name) {
      Taro.showToast({ title: '请输入团名称', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      await request('/group/update', 'POST', { id: editGroup.id, name })
      Taro.showToast({ title: '已更新', icon: 'success' })
      closeEdit()
      fetchGroups()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (g) => {
    Taro.showModal({
      title: '删除团',
      content: `确定删除「${g.name}」吗？`,
      confirmText: '删除',
      cancelText: '取消',
      success: async (res) => {
        if (!res.confirm) return
        setLoading(true)
        try {
          await request('/group/delete', 'POST', { id: g.id })
          Taro.showToast({ title: '已删除', icon: 'success' })
          fetchGroups()
        } catch (e) {
          console.error(e)
          const msg = e?.message === 'Group is in use' ? '该团已被学生/课程使用，无法删除' : '删除失败'
          Taro.showToast({ title: msg, icon: 'none' })
        } finally {
          setLoading(false)
        }
      }
    })
  }

  return (
    <View className='container'>
      <View className='header'>
        <Text className='title'>团管理</Text>
      </View>

      <View className='card'>
        <Text className='card-title'>新增团</Text>
        <View className='memphis-form'>
          <AtInput
            name='group_name'
            title='团名称'
            type='text'
            placeholder='例如：启蒙6团'
            value={newName}
            onChange={(v) => setNewName(v)}
          />
        </View>
        <View style={{ marginTop: '15px', padding: '0 15px' }}>
          <AtButton type='primary' loading={loading} onClick={handleCreate}>添加</AtButton>
        </View>
      </View>

      <View className='card'>
        <Text className='card-title'>团列表</Text>
        {groups.length === 0 && <Text className='empty-text'>暂无数据</Text>}
        <View className='memphis-course-list'>
          {groups.map(g => (
            <View key={g.id} className='memphis-course-row'>
              <View className='memphis-course-main'>
                <View className='memphis-course-top'>
                  <Text className='memphis-course-title'>{g.name}</Text>
                </View>
                <Text className='memphis-course-note'>用于所属团选择与筛选</Text>
              </View>
              <View className='memphis-course-actions' style={{ display: 'flex', gap: '12rpx' }}>
                <AtButton size='small' type='secondary' onClick={() => openEdit(g)}>编辑</AtButton>
                <AtButton size='small' type='secondary' onClick={() => handleDelete(g)}>删除</AtButton>
              </View>
            </View>
          ))}
        </View>
      </View>

      {editOpen ? (
        <AtModal isOpened onClose={closeEdit}>
          <AtModalHeader>修改团名称</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='edit_group_name'
              title='团名称'
              type='text'
              placeholder='请输入团名称'
              value={editGroup.name}
              onChange={(v) => setEditGroup(prev => ({ ...prev, name: v }))}
            />
          </AtModalContent>
          <AtModalAction>
            <AtButton type='secondary' onClick={closeEdit}>取消</AtButton>
            <AtButton type='primary' loading={loading} onClick={handleUpdate}>确定</AtButton>
          </AtModalAction>
        </AtModal>
      ) : null}
    </View>
  )
}

