import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import GuestPreview from '../../components/GuestPreview'

export default function Index() {
  useShareAppMessage(() => ({
    title: '爱乐之城 · 排练次数统计',
    path: '/pages/index/index'
  }))

  useShareTimeline(() => ({
    title: '爱乐之城 · 排练次数统计'
  }))

  return <GuestPreview />
}
