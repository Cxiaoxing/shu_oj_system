import Vue from 'vue'
import VueRouter from 'vue-router'

const Test = () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Test.vue')

// 路由懒加载，当路由被访问时才加载对应组件，同一个webpackChunkName生成一个js文件
const Home = () => import(/* webpackChunkName: "HomeScreen" */ '../components/Home.vue')
const Login = () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Login.vue')
const Welcome = () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Welcome.vue')

// 【公告详情】
const AnnounceDetail = () => import(/* webpackChunkName: "Announce" */ '../pages/announce/AnnounceDetail.vue')

// 【题集】
const Practice = () => import(/* webpackChunkName: "Problem" */ '../pages/practice/Practice.vue')
const PracticeProblemDetail = () => import(/* webpackChunkName: "Problem" */ '../pages/practice/ProblemDetail.vue')

// 【竞赛】
const Contest = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/Contest.vue')
const ContestDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestDetail.vue')
const ContestProblemDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ProblemDetail.vue')

// 【提交状态】
const Status = () => import(/* webpackChunkName: "Submission" */ '../pages/StatusList.vue')
const SubmissionDetail = () => import(/* webpackChunkName: "Submission" */ '../components/SubmissionDetail.vue')

// 【观看直播】
const LiveCard = () => import(/* webpackChunkName: "Live" */ '../pages/live/LiveCard.vue')
const PlayerLive = () => import(/* webpackChunkName: "Live" */ '../pages/live/PlayerLive.vue')

// 【个人中心】
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ '../pages/UserCenter.vue')

/****************************    内部管理    ****************************/

// 【用户管理】
const UserList = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/UserList.vue')
const CreateUser = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/CreateUser.vue')

// 【标程管理】
const ProblemDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/ProblemDetail.vue')
const SampleList = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleList.vue')
const SampleResultDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleResultDetail.vue')

// 【题库管理】
const ProblemList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemList.vue')
const ProblemSetList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemSetList.vue')
const ProblemSetDetailList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemSetDetailList.vue')
const CreateProblem = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/CreateProblem.vue')

// 【竞赛管理】
const ContestList = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestList.vue')
const ContestDetailList = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestDetailList.vue')
const CreateContest = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/CreateContest.vue')

// 【直播管理】
const Live = () => import(/* webpackChunkName: "LiveManagement" */ '../pages/liveManagement/Live.vue')

// 【公告管理】
const AnnounceList = () => import(/* webpackChunkName: "AnnounceManagement" */ '../pages/announceManagement/AnnounceList.vue')
const CreateAnnounce = () => import(/* webpackChunkName: "AnnounceManagement" */ '../pages/announceManagement/CreateAnnounce.vue')


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    /* 路由重定向 ，用户访问根路径就自动方位登录 */
    { path: '/', redirect: '/home' }, /* 重定向至home */
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        // 测试
        { path: '/test/:id', component: Test },
        // 首页
        { path: '/welcome', component: Welcome },
        // 公告
        { path: '/announceDetail/:id', component: AnnounceDetail, name: 'announceDetail' },
        // 注册登陆
        { path: '/login', component: Login },
        // 用户中心
        { path: '/userCenter', component: UserCenter },
        // 主题集
        { path: '/practice', component: Practice },
        { path: '/practice/problemDetail/:id', component: PracticeProblemDetail, name: 'practiceProblemDetail' },
        // 竞赛
        { path: '/contest', component: Contest },
        { path: '/contestDetail/:region/:title/list', component: ContestDetail, name: 'contestDetail' },
        { path: '/contest/:region/problemDetail/:id/:inner_id/:total', component: ContestProblemDetail, name: 'contestProblemDetail' },
        // 提交记录
        { path: '/status', component: Status },
        // 提交详情
        { path: '/submissionDetail/:uuid', component: SubmissionDetail, name: 'submissionDetail' },
        // 直播
        { path: '/playerLive', component: PlayerLive },
        { path: '/liveCard', component: LiveCard },

        // 题目管理
        { path: '/problemManage', redirect: '/problemManage/list' },
        { path: '/problemManage/list', component: ProblemList },
        { path: '/problemManage/setList', component: ProblemSetList },
        { path: '/problemManage/setDetail/:region/list', component: ProblemSetDetailList, name: 'problemSetDetailList' },
        { path: '/problemManage/create', component: CreateProblem },
        // 标程管理
        { path: '/problemManage/problemDetail/:id', component: ProblemDetail, name: 'problemDetail' },
        { path: '/problemManage/sampleList/:id', component: SampleList, name: 'sampleList' },
        { path: '/problemManage/sampleResultDetail/:uuid', component: SampleResultDetail, name: 'sampleResultDetail' },
        // 竞赛管理
        { path: '/contestManage', redirect: '/contestManage/list' },
        { path: '/contestManage/list', component: ContestList },
        { path: '/contestManage/create', component: CreateContest },
        { path: '/contestManage/contestDetail/:region/list', component: ContestDetailList, name: 'contestDetailList' },
        // 用户管理
        { path: '/userManage', redirect: '/userManage/list' },
        { path: '/userManage/list', component: UserList },
        { path: '/userManage/create', component: CreateUser },
        // 直播管理
        { path: '/liveManage/live', component: Live },
        // 公告管理
        { path: '/announceManage', redirect: '/announceManage/list' },
        { path: '/announceManage/list', component: AnnounceList },
        { path: '/announceManage/create', component: CreateAnnounce },
      ]
    }
  ]
})

// 无需登录的即可访问的路由列表
const whiteList = ['/login', '/welcome', '/practice', '/contest']
router.beforeEach((to, from, next) => {
  // to: 即将要进入的目标 路由对象
  // from: 当前导航正要离开的路由
  // next: 放行函数
  // to.path 在 whiteList 即可直接通行
  if (whiteList.includes(to.path)) {
    return next()
  } else {
    const isLogin = window.localStorage.getItem('isLogin')
    if (!isLogin) {
      return next('/login')
    } else {
      const role = window.localStorage.getItem('role')
      if (to.path.indexOf('Manage') !== -1 && role !== 'sup' && role !== 'admin') {
        return next(false)
      } else {
        next()
      }
    }
  }
})

export default router