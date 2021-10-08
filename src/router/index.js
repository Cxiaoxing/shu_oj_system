import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Login from '../pages/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../pages/Login.vue')
// import Welcome from '../pages/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../pages/Welcome.vue')


// 内部【标程管理】
// import ProblemDetail from '../components/sample/ProblemDetail.vue'
const ProblemDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/ProblemDetail.vue')
// import SampleResultDetail from '../components/sample/SampleResultDetail.vue'
const SampleResultDetail = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleResultDetail.vue')
// import SampleList from '../components/sample/SampleList.vue'
const SampleList = () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleList.vue')

// 内部【题库管理】
// import QuestionBank from '../pages/problemManagement/QuestionBank.vue'
const QuestionBank = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/QuestionBank.vue')
// import ProblemSet from '../pages/problemManagement/ProblemSet.vue'
const ProblemSet = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemSet.vue')
// import ProblemSetDetailList from '../pages/problemManagement/ProblemSetDetailList.vue'
const ProblemSetDetailList = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemSetDetailList.vue')
// import CreateProblem from '../pages/problemManagement/CreateProblem.vue'
const CreateProblem = () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/CreateProblem.vue')

// 内部【用户管理】
// import UserList from '../pages/User/UserList.vue'
const UserList = () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/UserList.vue')

// 内部【竞赛管理】
// import ContestBank from '../pages/contestManagement/ContestBank.vue'
const ContestBank = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestBank.vue')
// import ContestDetailList from '../pages/contestManagement/ContestDetailList.vue'
const ContestDetailList = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestDetailList.vue')
// import CreateContest from '../pages/contestManagement/CreateContest.vue'
const CreateContest = () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/CreateContest.vue')

// 内部【直播管理】
// import Live from '../pages/Live.vue'
const Live = () => import(/* webpackChunkName: "LiveManagement" */ '../pages/liveManagement/Live.vue')

// 外部【题集】
// import Practice from '../pages/Practice.vue'
const Practice = () => import(/* webpackChunkName: "Problem" */ '../pages/problem/Practice.vue')
// import ProblemSetDetail from '../pages/ProblemDetail.vue'
const ProblemSetDetail = () => import(/* webpackChunkName: "Problem" */ '../pages/problem/ProblemDetail.vue')

// 外部【竞赛】
// import Contest from '../pages/contest/Contest.vue'
const Contest = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/Contest.vue')
// import ContestDetail from '../pages/contest/ContestDetail.vue'
const ContestDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestDetail.vue')
// import ContestProblemDetail from '../pages/contest/ContestProblemDetail.vue'
const ContestProblemDetail = () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestProblemDetail.vue')

// 外部【提交状态】
// import StatusList from '../pages/StatusList.vue'
const StatusList = () => import(/* webpackChunkName: "Submission" */ '../pages/StatusList.vue')
// import SubmissionDetail from '../components/SubmissionDetail.vue'
const SubmissionDetail = () => import(/* webpackChunkName: "Submission" */ '../components/SubmissionDetail.vue')

// 外部【观看直播】
// import PlayerLive from '../pages/PlayerLive.vue'
const LiveCard = () => import(/* webpackChunkName: "Live" */ '../pages/live/LiveCard.vue')
const PlayerLive = () => import(/* webpackChunkName: "Live" */ '../pages/live/PlayerLive.vue')

// 外部【个人中心】
// import UserCenter from '../pages/UserCenter.vue'
const UserCenter = () => import(/* webpackChunkName: "UserCenter" */ '../pages/UserCenter.vue')



Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    /* 路由重定向 ，用户访问根路径就自动方位登录 */
    { path: '/', redirect: '/home' }, /* 重定向至home */
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        
        { path: '/welcome', component: Welcome }, // 外部
        { path: '/practice', component: Practice }, // 外部
        { name: 'problem', path: '/problem/:id', component: ProblemDetail },  // 内部
        { path: '/questionBank', component: QuestionBank },// 内部
        { path: '/problemSet', component: ProblemSet },// 内部
        { name: 'problemSetDetailList', path: '/problemSetDetailList/:region', component: ProblemSetDetailList },//内部
        { name: 'problemDetail', path: '/problemDetail/:id', component: ProblemSetDetail },  // 外部
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
const adminList = ['/userList','/questionBank','/createProblem','problem','/problemSet','problemSetDetailList','/contestBank','/createContest', 'contestDetailList','sampleList','sampleResultDetail','/live']
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