import { useMemo, useRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import {
  AtActionSheet,
  AtButton,
  AtInput,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtModalHeader,
  AtTag
} from 'taro-ui'
import Taro from '@tarojs/taro'
import { request } from '../../utils/api'
import { loginWithWechat, navigateToRoleHome } from '../../utils/auth'
import './index.scss'

const PREVIEW_COURSES = [
  {
    id: 'c1',
    name: '合唱排练',
    group_name: '少年团',
    teacher: '王老师',
    start_date: '2026-04-01',
    total_lessons: 20,
    students: [
      { id: 's1', student_no: '240159', name: '示例团员A', used_lessons: 3 },
      { id: 's2', student_no: '240003', name: '示例团员B', used_lessons: 5 },
      { id: 's3', student_no: '250275', name: '示例团员C', used_lessons: 2 }
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
      { id: 's4', student_no: '250416', name: '示例团员D', used_lessons: 4 },
      { id: 's5', student_no: '250448', name: '示例团员E', used_lessons: 1 }
    ]
  }
]

export default function GuestPreview() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState(PREVIEW_COURSES[0].id)
  const [memberLoading, setMemberLoading] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)
  const memberLoginLock = useRef(false)
  const adminLoginLock = useRef(false)

  const selectedCourse = useMemo(
    () => PREVIEW_COURSES.find(course => course.id === selectedCourseId) || PREVIEW_COURSES[0],
    [selectedCourseId]
  )

  const openPreviewDetail = (courseId) => {
    setSelectedCourseId(courseId)
    setDetailOpen(true)
  }

  const requestMemberLogin = async (featureName) => {
    if (memberLoginLock.current) return
    memberLoginLock.current = true

    try {
      let modalResult
      try {
        modalResult = await Taro.showModal({
          title: '登录后使用',
          content: `${featureName}需要登录后关联您的团员信息。是否现在登录？`,
          cancelText: '继续预览',
          confirmText: '立即登录',
          confirmColor: '#1d1b31'
        })
      } catch (error) {
        console.error(error)
        Taro.showToast({ title: '登录提示打开失败', icon: 'none' })
        return
      }

      if (!modalResult.confirm) return

      setMemberLoading(true)
      Taro.showLoading({ title: '登录中...', mask: true })

      let session
      let loginError
      try {
        session = await loginWithWechat()
      } catch (error) {
        console.error(error)
        loginError = error
      } finally {
        Taro.hideLoading()
      }

      if (loginError) {
        Taro.showToast({ title: '登录失败', icon: 'none' })
        return
      }

      try {
        await navigateToRoleHome(session.role)
      } catch (error) {
        console.error(error)
        Taro.showToast({ title: '页面打开失败', icon: 'none' })
      }
    } finally {
      setMemberLoading(false)
      memberLoginLock.current = false
    }
  }

  const handleAdminLogin = async () => {
    if (adminLoginLock.current) return
    if (!adminPassword) {
      Taro.showToast({ title: '请输入密码', icon: 'none' })
      return
    }

    adminLoginLock.current = true
    setAdminLoading(true)
    try {
      let session
      try {
        session = await request('/auth/admin_password_login', 'POST', { password: adminPassword })
      } catch (error) {
        console.error(error)
        Taro.showToast({ title: '密码错误', icon: 'none' })
        return
      }

      Taro.setStorageSync('openid', session.openid)
      Taro.setStorageSync('role', session.role)
      setAdminModalOpen(false)
      setAdminPassword('')

      try {
        await Taro.navigateTo({ url: '/pages/manage/index' })
      } catch (error) {
        console.error(error)
        Taro.showToast({ title: '页面打开失败', icon: 'none' })
      }
    } finally {
      setAdminLoading(false)
      adminLoginLock.current = false
    }
  }

  const closeAdminModal = () => {
    if (adminLoading) return
    setAdminModalOpen(false)
    setAdminPassword('')
  }

  const openProtectedFeature = (featureName) => {
    setDetailOpen(false)
    requestMemberLogin(featureName)
  }

  return (
    <View className='container guest-preview'>
      <View className='header guest-preview__header'>
        <View>
          <Text className='title'>爱乐之城</Text>
          <Text className='guest-preview__subtitle'>排练次数统计面板</Text>
        </View>
        <AtTag type='primary' active>预览模式</AtTag>
      </View>

      <View className='card guest-preview__notice'>
        <Text className='card-title'>欢迎预览</Text>
        <View className='card-content'>
          <Text>当前可直接浏览示例内容；查看个人数据、绑定团员等功能需登录后使用。</Text>
        </View>
      </View>

      <View className='card'>
        <Text className='card-title'>排练列表（示例）</Text>
        <View className='memphis-course-list'>
          {PREVIEW_COURSES.map(course => (
            <View
              key={course.id}
              className='memphis-course-row guest-preview__course-row'
              onClick={() => openPreviewDetail(course.id)}
            >
              <View className='memphis-course-main'>
                <View className='memphis-course-top'>
                  <Text className='memphis-course-title'>{course.name}</Text>
                </View>
                <Text className='memphis-course-note'>团: {course.group_name} | 指挥: {course.teacher || '无'} | 排练次数: {course.total_lessons}</Text>
              </View>
              <View className='memphis-course-actions'>
                <AtButton size='small' type='secondary'>预览详情</AtButton>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className='card guest-preview__member-card'>
        <Text className='card-title'>团员端功能</Text>
        <View className='card-content guest-preview__member-copy'>
          <Text>登录后可绑定团员、查看个人排练次数和签到记录。</Text>
        </View>
        <View className='guest-preview__actions'>
          <AtButton
            type='primary'
            circle
            loading={memberLoading}
            disabled={memberLoading}
            onClick={() => requestMemberLogin('进入团员端')}
          >
            团员端
          </AtButton>
          <AtButton
            type='secondary'
            circle
            disabled={memberLoading}
            onClick={() => requestMemberLogin('绑定团员')}
          >
            绑定团员
          </AtButton>
        </View>
      </View>

      <View className='guest-preview__admin-entry'>
        <AtButton size='small' type='secondary' circle onClick={() => setAdminModalOpen(true)}>
          管理
        </AtButton>
      </View>

      <AtActionSheet
        isOpened={detailOpen}
        title='排练详情（示例）'
        cancelText='关闭'
        onClose={() => setDetailOpen(false)}
        onCancel={() => setDetailOpen(false)}
      >
        <View className='guest-preview__detail'>
          <View className='card guest-preview__detail-card'>
            <View className='guest-preview__detail-heading'>
              <Text className='card-title guest-preview__detail-title'>基本信息</Text>
              <Text className='guest-preview__date'>起始日期：{selectedCourse.start_date || '未设置'}</Text>
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
                <Text className='memphis-kpi-label'>总排练次数</Text>
                <Text className='memphis-kpi-value'>{selectedCourse.total_lessons}</Text>
              </View>
            </View>
          </View>

          <View className='card guest-preview__student-card'>
            <View className='memphis-row'>
              <Text className='guest-preview__student-title'>团员名单 ({selectedCourse.students.length}人)</Text>
              <AtTag type='primary' active>示例</AtTag>
            </View>
            {selectedCourse.students.map(student => (
              <View key={student.id} className='memphis-row memphis-divider'>
                <View>
                  <View>
                    <Text className='guest-preview__student-name'>{student.name}</Text>
                    <Text className='guest-preview__student-no'>({student.student_no})</Text>
                  </View>
                  <View className='guest-preview__lesson-count'>
                    已上 <Text className='guest-preview__count-strong'>{student.used_lessons}</Text> · 剩余 <Text className='guest-preview__count-strong'>{selectedCourse.total_lessons - student.used_lessons}</Text>
                  </View>
                </View>
              </View>
            ))}
            <View className='guest-preview__detail-action'>
              <AtButton
                type='primary'
                loading={memberLoading}
                disabled={memberLoading}
                onClick={() => openProtectedFeature('查看我的签到记录')}
              >
                查看我的签到记录
              </AtButton>
            </View>
          </View>
        </View>
      </AtActionSheet>

      {adminModalOpen ? (
        <AtModal isOpened onClose={closeAdminModal} closeOnClickOverlay={!adminLoading}>
          <AtModalHeader>管理员登录</AtModalHeader>
          <AtModalContent>
            <View className='guest-preview__admin-copy'>管理员功能需要密码验证，预览内容无需登录。</View>
            <AtInput
              name='admin_password'
              title='密码'
              type='password'
              placeholder='请输入超管密码'
              value={adminPassword}
              onChange={value => setAdminPassword(value)}
            />
          </AtModalContent>
          <AtModalAction>
            <AtButton type='secondary' disabled={adminLoading} onClick={closeAdminModal}>继续预览</AtButton>
            <AtButton type='primary' loading={adminLoading} disabled={adminLoading} onClick={handleAdminLogin}>登录</AtButton>
          </AtModalAction>
        </AtModal>
      ) : null}
    </View>
  )
}
