import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载，当路由被访问时才加载对应组件，同一个webpackChunkName生成一个js文件
const Home = () => import(/* webpackChunkName: "HomeScreen" */ '../components/Home.vue')
const Login = () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Login.vue')
const Welcome = () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Welcome.vue')


// 内部【标程管理】
const ProblemDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/ProblemDetail.vue')
const SampleResultDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleResultDetail.vue')
const SampleList = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleList.vue')

// 内部【题库管理】
const QuestionBank = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/QuestionBank.vue')
const ProblemSet = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemSet.vue')
const ProblemSetDetailList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemSetDetailList.vue')
const CreateProblem = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/CreateProblem.vue')

// 内部【用户管理】
const UserList = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/UserList.vue')
const CreateUser = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/CreateUser.vue')

// 内部【竞赛管理】
const ContestBank = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestBank.vue')
const ContestDetailList = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestDetailList.vue')
const CreateContest = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/CreateContest.vue')

// 内部【直播管理】
const Live = () => import(/* webpackChunkName: "LiveManagement" */ '../pages/liveManagement/Live.vue')

// 内部【公告管理】
const Announce = () => import(/* webpackChunkName: "AnnounceManagement" */ '../pages/announceManagement/AnnounceList.vue')
const CreateAnnounce = () => import(/* webpackChunkName: "AnnounceManagement" */ '../pages/announceManagement/CreateAnnounce.vue')

// 外部【题集】
const Practice = () => import(/* webpackChunkName: "Problem" */ '../pages/problem/Practice.vue')
const ProblemSetDetail = () => import(/* webpackChunkName: "Problem" */ '../pages/problem/ProblemDetail.vue')

// 外部【竞赛】
const Contest = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/Contest.vue')
const ContestDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestDetail.vue')
const ContestProblemDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestProblemDetail.vue')

// 外部【提交状态】
const StatusList = () => import(/* webpackChunkName: "Submission" */ '../pages/StatusList.vue')
const SubmissionDetail = () => import(/* webpackChunkName: "Submission" */ '../components/SubmissionDetail.vue')

// 外部【观看直播】
const LiveCard = () => import(/* webpackChunkName: "Live" */ '../pages/live/LiveCard.vue')
const PlayerLive = () => import(/* webpackChunkName: "Live" */ '../pages/live/PlayerLive.vue')

// 外部【个人中心】
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ '../pages/UserCenter.vue')

// 外部【公告详情】
const AnnounceDetail = () => import(/* webpackChunkName: "Announce" */ '../pages/announce/AnnounceDetail.vue')



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
        { path: '/problemDetail/:id', component: ProblemSetDetail, name: 'problemDetail' },
        // 竞赛
        { path: '/contest', component: Contest },
        { path: '/contestDetail/:region/:title', component: ContestDetail, name: 'contestDetail' },
        { path: '/contestProblemDetail/:region/:id/:inner_id/:total', component: ContestProblemDetail, name: 'contestProblemDetail' },
        // 提交记录
        { path: '/statusList', component: StatusList },
        // 提交详情
        { path: '/submissionDetail/:uuid', component: SubmissionDetail, name: 'submissionDetail' },
        // 直播
        { path: '/playerLive', component: PlayerLive },
        { path: '/liveCard', component: LiveCard },

        // 题目管理
        { path: '/problemManage', redirect: '/problemManage/list' },
        { path: '/problemManage/problemDetail/:id', component: ProblemDetail, name: 'problem' },
        { path: '/problemManage/list', component: QuestionBank },
        { path: '/problemManage/setList', component: ProblemSet },
        { path: '/problemManage/setDetail/:region/list', component: ProblemSetDetailList, name: 'problemSetDetailList' },
        { path: '/problemManage/create', component: CreateProblem },
        // 标程
        { path: '/problemManage/sampleList/:id', component: SampleList, name: 'sampleList' },
        { path: '/problemManage/sampleResultDetail/:uuid', component: SampleResultDetail, name: 'sampleResultDetail' },
        // 竞赛管理
        { path: '/contestManage', redirect: '/contestManage/list' },
        { path: '/contestManage/list', component: ContestBank },
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
        { path: '/announceManage/list', component: Announce },
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