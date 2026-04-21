export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/manage/index',
    'pages/manage/student/index',
    'pages/manage/course/index',
    'pages/manage/course/detail',
    'pages/parent/index'
  ],
  lazyCodeLoading: 'requiredComponents',
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  enableShareAppMessage: true,
  enableShareTimeline: true
})
