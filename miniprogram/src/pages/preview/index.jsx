import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import GuestPreview from '../../components/GuestPreview'

export default function Preview() {
  useShareAppMessage(() => ({
    title: '爱乐之城 · 预览体验',
    path: '/pages/index/index'
  }))

  useShareTimeline(() => ({
    title: '爱乐之城 · 预览体验'
  }))

  return <GuestPreview />
}
