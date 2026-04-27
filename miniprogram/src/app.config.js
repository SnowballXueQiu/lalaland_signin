export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/preview/index',
    'pages/manage/index',
    'pages/manage/student/index',
    'pages/manage/course/index',
    'pages/manage/course/detail',
    'pages/manage/group/index',
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
