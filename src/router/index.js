import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../components/login.vue'
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

// 内部【标程管理】
// import ProblemDetail from '../components/Sample/ProblemDetail.vue'
const ProblemDetail = () => import(/* webpackChunkName: "Sample" */ '../components/Sample/ProblemDetail.vue')
// import SampleResultDetail from '../components/Sample/SampleResultDetail.vue'
const SampleResultDetail = () => import(/* webpackChunkName: "Sample" */ '../components/Sample/SampleResultDetail.vue')
// import SampleList from '../components/Sample/SampleList.vue'
const SampleList = () => import(/* webpackChunkName: "Sample" */ '../components/Sample/SampleList.vue')

// 内部【题库管理】
// import QuestionBank from '../components/Problem/QuestionBank.vue'
const QuestionBank = () => import(/* webpackChunkName: "ProblemManagement" */ '../components/Problem/QuestionBank.vue')
// import ProblemSet from '../components/Problem/ProblemSet.vue'
const ProblemSet = () => import(/* webpackChunkName: "ProblemManagement" */ '../components/Problem/ProblemSet.vue')
// import ProblemSetDetailList from '../components/Problem/ProblemSetDetailList.vue'
const ProblemSetDetailList = () => import(/* webpackChunkName: "ProblemManagement" */ '../components/Problem/ProblemSetDetailList.vue')
// import ProblemResultDetail from '../components/Problem/ProblemResultDetail.vue'
const ProblemResultDetail = () => import(/* webpackChunkName: "ProblemManagement" */ '../components/Problem/ProblemResultDetail.vue')
// import CreateProblem from '../components/Problem/CreateProblem.vue'
const CreateProblem = () => import(/* webpackChunkName: "ProblemManagement" */ '../components/Problem/CreateProblem.vue')

// 内部【用户管理】
// import UserList from '../components/User/UserList.vue'
const UserList = () => import(/* webpackChunkName: "UserManagement" */ '../components/User/UserList.vue')

// 内部【竞赛管理】
// import ContestBank from '../components/Contest/ContestBank.vue'
const ContestBank = () => import(/* webpackChunkName: "ContestManagement" */ '../components/Contest/ContestBank.vue')
// import ContestDetailList from '../components/Contest/ContestDetailList.vue'
const ContestDetailList = () => import(/* webpackChunkName: "ContestManagement" */ '../components/Contest/ContestDetailList.vue')
// import CreateContest from '../components/Contest/CreateContest.vue'
const CreateContest = () => import(/* webpackChunkName: "ContestManagement" */ '../components/Contest/CreateContest.vue')

// 内部【直播管理】
// import Live from '../components/Live.vue'
const Live = () => import(/* webpackChunkName: "LiveManagement" */ '../components/Live.vue')

// 外部【题集】
// import Practice from '../components/Practice.vue'
const Practice = () => import(/* webpackChunkName: "Problem" */ '../components/Practice.vue')
// import ProblemSetDetail from '../components/ProblemDetail.vue'
const ProblemSetDetail = () => import(/* webpackChunkName: "Problem" */ '../components/ProblemDetail.vue')
// import ProblemResult from '../components/ProblemResult.vue'
const ProblemResult = () => import(/* webpackChunkName: "Problem" */ '../components/ProblemResult.vue')

// 外部【竞赛】
// import Contest from '../components/Contest.vue'
const Contest = () => import(/* webpackChunkName: "Contest" */ '../components/Contest.vue')
// import ContestDetail from '../components/ContestDetail.vue'
const ContestDetail = () => import(/* webpackChunkName: "Contest" */ '../components/ContestDetail.vue')
// import ContestProblemDetail from '../components/ContestProblemDetail.vue'
const ContestProblemDetail = () => import(/* webpackChunkName: "Contest" */ '../components/ContestProblemDetail.vue')

// 外部【提交状态】
// import StatusList from '../components/StatusList.vue'
const StatusList = () => import(/* webpackChunkName: "Submission" */ '../components/StatusList.vue')
// import SubmissionDetail from '../components/SubmissionDetail.vue'
const SubmissionDetail = () => import(/* webpackChunkName: "Submission" */ '../components/SubmissionDetail.vue')

// 外部【观看直播】
// import PlayerLive from '../components/PlayerLive.vue'
const LiveCard = () => import(/* webpackChunkName: "Live" */ '../components/LiveCard.vue')
const PlayerLive = () => import(/* webpackChunkName: "Live" */ '../components/PlayerLive.vue')

// 外部【个人中心】
// import UserCenter from '../components/UserCenter.vue'
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ '../components/UserCenter.vue')



Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    /* 路由重定向 ，用户访问根路径就自动方位登录 */
    { path: '/', redirect: '/home' }, /* 重定向至home */
    { path: '/login', component: login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        
        { path: '/welcome', component: Welcome }, // 外部
        { path: '/practice', component: Practice }, // 外部
        { name: 'problem', path: '/problem/:id', component: ProblemDetail },  // 内部
        { name: 'problemResult', path: '/problemResult/:id', component: ProblemResult },  // 内部
        { path: '/questionBank', component: QuestionBank },// 内部
        { path: '/problemSet', component: ProblemSet },// 内部
        { name: 'problemSetDetailList', path: '/problemSetDetailList/:region', component: ProblemSetDetailList },//内部
        { name: 'problemDetail', path: '/problemDetail/:id', component: ProblemSetDetail },  // 外部
        { name: 'problemResultDetail', path: '/problemResultDetail/:id', component: ProblemResultDetail },  // 外部
        { path: '/createProblem', component: CreateProblem },// 内部
        { path: '/contest', component: Contest },// 外部
        { name: 'contestDetail', path: '/contestDetail/:region/:title', component: ContestDetail },// 外部
        { name: 'contestProblemDetail', path: '/contestProblemDetail/:region/:id/:inner_id/:total', component: ContestProblemDetail },// 外部
        { path: '/contestBank', component: ContestBank },// 内部
        { path: '/createContest', component: CreateContest },// 内部
        { name: 'contestDetailList', path: '/contestDetailList/:region', component: ContestDetailList },// 内部
        { path: '/userList', component: UserList },// 内部
        { path: '/userCenter', component: UserCenter },// 外部
        { path: '/statusList', component: StatusList },// 外部
        { name: 'submissionDetail', path: '/submissionDetail/:uuid', component: SubmissionDetail },// 外部
        { name: 'sampleList', path: '/sampleList/:id', component: SampleList },// 内部
        { name: 'sampleResultDetail', path: '/sampleResultDetail/:uuid', component: SampleResultDetail },// 内部
        { path: '/live', component: Live },// 内部
        { path: '/playerLive', component: PlayerLive },// 外部
        { path: '/liveCard', component: LiveCard },// 外部
      ]
    }
  ]
})

// 无需登录的即可访问的路由列表
const whiteList = ['/login','/welcome','/practice','/contest']
// 需登录且需管理员或超级管理员才可访问的路由列表
const adminList = ['/userList','/questionBank','/createProblem','problemResult','problem','/problemSet','problemSetDetailList','/contestBank','/createContest', 'contestDetailList','sampleList','sampleResultDetail','/live']
router.beforeEach((to, from, next) => {
  // to: 即将要进入的目标 路由对象
  // from: 当前导航正要离开的路由
  // next: 放行函数
  // to.path 在 whiteList 即可直接通行
  if (whiteList.includes(to.path)) {
    return next()
  } else {
    const cookieStr = window.localStorage.getItem('isLogin')
    // 如果当前为未登录状态，则跳转至首页
    if (!cookieStr) {
      return next('/login')
    } else {
      const role = window.localStorage.getItem('role')
      if (adminList.includes(to.path) || adminList.includes(to.name)) {
        // 如果当前为登录状态且不是管理员，但访问的是 adminList 中的路由，则中断当前导航
        if (role === '') {
          return next(false)
        } else {
          next()
        }
      } else {
        next()
      }
    }
  }
})

export default router