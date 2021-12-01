import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载，当路由被访问时才加载对应组件，同一个webpackChunkName生成一个js文件
const Layout = () => import(/* webpackChunkName: "HomeScreen" */ '../components/Layout.vue')
const Home = () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Home.vue')
const Login = () => import(/* webpackChunkName: "Login" */ '../pages/Login.vue')

// 【公告详情】
const AnnounceDetail = () => import(/* webpackChunkName: "Announce" */ '../pages/announce/AnnounceDetail.vue')

// 题目列表
const SubmissionList = () => import(/* webpackChunkName: "Problem" */ '../components/submission/SubmissionList.vue')
const ExternalProblemDetail = () => import(/* webpackChunkName: "Problem" */ '../components/submission/ProblemDetail.vue')

// 【题库】
const Practice = () => import(/* webpackChunkName: "Problem" */ '../pages/practice/Practice.vue')

// 【题集】
const ProblemSet = () => import(/* webpackChunkName: "ProblemSet" */ '../pages/problemSet/ProblemSet.vue')
const ProblemSetDetail = () => import(/* webpackChunkName: "ProblemSet" */ '../pages/problemSet/ProblemSetDetail.vue')

// 【竞赛】
const Contest = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/Contest.vue')
const ContestDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestDetail.vue')
const ContestProblemDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ProblemDetail.vue')
const ContestSubmissionDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/SubmissionDetail.vue')

// 【提交状态】
const Status = () => import(/* webpackChunkName: "Submission" */ '../pages/StatusList.vue')
const SubmissionDetail = () => import(/* webpackChunkName: "Submission" */ '../components/submission/SubmissionDetail.vue')

// 【观看直播】
const LiveCard = () => import(/* webpackChunkName: "Live" */ '../pages/live/LiveCard.vue')
const PlayerLive = () => import(/* webpackChunkName: "Live" */ '../pages/live/PlayerLive.vue')

// 【个人中心】
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ '../pages/UserCenter.vue')

/****************************    内部管理    ****************************/

// 【用户管理】
const UserList = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/UserList.vue')
const CreateUser = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/CreateUser.vue')
const GroupList = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/GroupList.vue')
const GroupDetailList = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/GroupDetailList.vue')

// 标程管理
const InternalProblemDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/ProblemDetail.vue')
const SampleList = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleList.vue')
const SampleDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleDetail.vue')

// 【题目管理】
const ProblemList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemList.vue')
const CreateProblem = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/CreateProblem.vue')
const ProblemTagList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemTagList.vue')

// 【题集管理】
const ProblemSetList = () => import(/* webpackChunkName: "ProblemSetManagement" */ '../pages/problemSetManagement/ProblemSetList.vue')
const CreateProblemSet = () => import(/* webpackChunkName: "ProblemSetManagement" */ '../pages/problemSetManagement/CreateProblemSet.vue')
const ProblemSetDetailList = () => import(/* webpackChunkName: "ProblemSetManagement" */ '../pages/problemSetManagement/ProblemSetDetailList.vue')

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
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        // 首页
        { path: '/home', component: Home },
        // 公告
        { path: '/announceDetail/:id', component: AnnounceDetail, name: 'announceDetail' },
        // 注册登陆
        { path: '/login', component: Login },
        // 用户中心
        { path: '/userCenter', component: UserCenter },
        // 外部提交
        { path: '/submissionStatus', component: Status },
        { path: '/problem/submissionDetail/:uuid', component: SubmissionDetail, name: 'submissionDetail' },
        { path: '/problem/problemDetail/:region/:inner_id/:problem_id', component: ExternalProblemDetail, name: 'externalProblemDetail' },
        { path: '/problem/submissionList/:region/:inner_id/:problem_id', component: SubmissionList, name: 'problemSubmissionList' },
        // 题库
        { path: '/practice', component: Practice },
        // 题集
        { path: '/problemSet', component: ProblemSet },
        { path: '/problemSetDetail/:region/list', component: ProblemSetDetail, name: 'problemSetDetail' },
        // 竞赛
        { path: '/contest', component: Contest },
        { path: '/contestDetail/:region/list', component: ContestDetail, name: 'contestDetail' },
        { path: '/contest/:region/problemDetail/:inner_id/:total', component: ContestProblemDetail, name: 'contestProblemDetail' },
        { path: '/contest/submissionDetail/:uuid', component: ContestSubmissionDetail, name: 'contestSubmissionDetail' },
        // 直播
        { path: '/playerLive', component: PlayerLive },
        { path: '/liveCard', component: LiveCard },

        /****************************    内部管理    ****************************/

        // 标程
        { path: '/problemManage/problemDetail/:id', component: InternalProblemDetail, name: 'problemDetail' },
        { path: '/problemManage/sampleList/:id', component: SampleList, name: 'sampleList' },
        { path: '/problemManage/sampleDetail/:uuid', component: SampleDetail, name: 'sampleDetail' },
        // 题目管理
        { path: '/problemManage', redirect: '/problemManage/list' },
        { path: '/problemManage/list', component: ProblemList },
        { path: '/problemManage/create', component: CreateProblem },
        { path: '/problemManage/tagList', component: ProblemTagList },
        // 题集管理
        { path: '/problemSetManage', redirect: '/problemSetManage/list' },
        { path: '/problemSetManage/list', component: ProblemSetList },
        { path: '/problemSetManage/create', component: CreateProblemSet },
        { path: '/problemSetManage/problemSetDetail/:region/list', component: ProblemSetDetailList, name: 'problemSetDetailList' },
        // 竞赛管理
        { path: '/contestManage', redirect: '/contestManage/list' },
        { path: '/contestManage/list', component: ContestList },
        { path: '/contestManage/create', component: CreateContest },
        { path: '/contestManage/contestDetail/:region/list', component: ContestDetailList, name: 'contestDetailList' },
        // 用户管理
        { path: '/userManage', redirect: '/userManage/list' },
        { path: '/userManage/list', component: UserList },
        { path: '/userManage/create', component: CreateUser },
        // 用户管理-小组管理
        { path: '/userManage', redirect: '/userManage/list' },
        { path: '/userManage/groupList', component: GroupList },
        { path: '/userManage/groupDetail/:id/list', component: GroupDetailList, name: 'groupDetailList' },
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
const whiteList = ['/login', '/home', '/practice', '/problemSet', '/contest']
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