import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "HomeScreen" */ '../components/Layout.vue'),
      redirect: '/home',
      children: [
        // 首页
        {
          path: '/home',
          component: () => import(/* webpackChunkName: "HomeScreen" */ '../pages/Home.vue')
        },
        // 公告
        {
          path: '/announceDetail/:id',
          name: 'announceDetail',
          component: () => import(/* webpackChunkName: "Announce" */ '../pages/announce/AnnounceDetail.vue'),
        },
        // 注册登陆
        {
          path: '/login',
          component: () => import(/* webpackChunkName: "Login" */ '../pages/Login.vue')
        },
        // 用户中心
        {
          path: '/userCenter',
          component: () => import(/* webpackChunkName: "UserCenter" */ '../pages/UserCenter.vue')
        },
        // 外部提交
        {
          path: '/submissionStatus',
          component: () => import(/* webpackChunkName: "Submission" */ '../pages/StatusList.vue')
        },
        {
          path: '/problem/submissionDetail/:uuid',
          name: 'submissionDetail',
          component: () => import(/* webpackChunkName: "Submission" */ '../components/submission/SubmissionDetail.vue'),
        },
        {
          path: '/problem/problemDetail/:region/:inner_id/:problem_id',
          name: 'externalProblemDetail',
          component: () => import(/* webpackChunkName: "Problem" */ '../components/submission/ProblemDetail.vue'),
        },
        {
          path: '/problem/submissionList/:region/:inner_id/:problem_id',
          name: 'problemSubmissionList',
          component: () => import(/* webpackChunkName: "Problem" */ '../components/submission/SubmissionList.vue'),
        },
        // 题库
        {
          path: '/practice',
          component: () => import(/* webpackChunkName: "Problem" */ '../pages/practice/Practice.vue')
        },
        // 题集
        {
          path: '/problemSet',
          component: () => import(/* webpackChunkName: "ProblemSet" */ '../pages/problemSet/ProblemSet.vue')
        },
        {
          path: '/problemSetDetail/:region/list',
          name: 'problemSetDetail',
          component: () => import(/* webpackChunkName: "ProblemSet" */ '../pages/problemSet/ProblemSetDetail.vue'),
        },
        // 竞赛
        {
          path: '/contest',
          component: () => import(/* webpackChunkName: "Contest" */ '../pages/contest/Contest.vue')
        },
        {
          path: '/contestDetail/:region/list',
          name: 'contestDetail',
          component: () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ContestDetail.vue'),
        },
        {
          path: '/contest/:region/problemDetail/:inner_id/:total',
          name: 'contestProblemDetail',
          component: () => import(/* webpackChunkName: "Contest" */ '../pages/contest/ProblemDetail.vue'),
        },
        // 直播
        { path: '/playerLive', component: () => import(/* webpackChunkName: "Live" */ '../pages/live/PlayerLive.vue') },
        { path: '/liveCard', component: () => import(/* webpackChunkName: "Live" */ '../pages/live/LiveCard.vue') },

        /****************************    内部管理    ****************************/

        // 标程
        {
          path: '/problemManage/problemDetail/:id',
          name: 'problemDetail',
          component: () => import(/* webpackChunkName: "Sample" */ '../components/sample/ProblemDetail.vue'),
        },
        {
          path: '/problemManage/sampleList/:id',
          name: 'sampleList',
          component: () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleList.vue'),
        },
        {
          path: '/problemManage/sampleDetail/:uuid',
          name: 'sampleDetail',
          component: () => import(/* webpackChunkName: "Sample" */ '../components/sample/SampleDetail.vue'),
        },
        // 题目管理
        {
          path: '/problemManage',
          redirect: '/problemManage/list'
        },
        {
          path: '/problemManage/list',
          component: () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemList.vue')
        },
        {
          path: '/problemManage/create',
          component: () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/CreateProblem.vue')
        },
        {
          path: '/problemManage/tagList',
          component: () => import(/* webpackChunkName: "ProblemManagement" */ '../pages/problemManagement/ProblemTagList.vue')
        },
        // 题集管理
        {
          path: '/problemSetManage',
          redirect: '/problemSetManage/list'
        },
        {
          path: '/problemSetManage/list',
          component: () => import(/* webpackChunkName: "ProblemSetManagement" */ '../pages/problemSetManagement/ProblemSetList.vue')
        },
        {
          path: '/problemSetManage/create',
          component: () => import(/* webpackChunkName: "ProblemSetManagement" */ '../pages/problemSetManagement/CreateProblemSet.vue')
        },
        {
          path: '/problemSetManage/problemSetDetail/:region/list',
          name: 'problemSetDetailList',
          component: () => import(/* webpackChunkName: "ProblemSetManagement" */ '../pages/problemSetManagement/ProblemSetDetailList.vue'),
        },
        // 竞赛管理
        {
          path: '/contestManage',
          redirect: '/contestManage/list'
        },
        {
          path: '/contestManage/list',
          component: () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestList.vue')
        },
        {
          path: '/contestManage/create',
          component: () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/CreateContest.vue')
        },
        {
          path: '/contestManage/contestDetail/:region/list',
          name: 'contestDetailList',
          component: () => import(/* webpackChunkName: "ContestManagement" */ '../pages/contestManagement/ContestDetailList.vue'),
        },
        // 用户管理
        {
          path: '/userManage',
          redirect: '/userManage/list'
        },
        {
          path: '/userManage/list',
          component: () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/UserList.vue')
        },
        {
          path: '/userManage/create',
          component: () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/CreateUser.vue')
        },
        // 小组管理
        {
          path: '/userManage',
          redirect: '/userManage/list'
        },
        {
          path: '/userManage/groupList',
          component: () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/GroupList.vue')
        },
        {
          path: '/userManage/groupDetail/:id/list',
          name: 'groupDetailList',
          component: () => import(/* webpackChunkName: "UserManagement" */ '../pages/userManagement/GroupDetailList.vue'),
        },
        // 直播管理
        {
          path: '/liveManage/live',
          component: () => import(/* webpackChunkName: "LiveManagement" */ '../pages/liveManagement/Live.vue')
        },
        // 公告管理
        {
          path: '/announceManage',
          redirect: '/announceManage/list'
        },
        {
          path: '/announceManage/list',
          component: () => import(/* webpackChunkName: "AnnounceManagement" */ '../pages/announceManagement/AnnounceList.vue')
        },
        {
          path: '/announceManage/create',
          component: () => import(/* webpackChunkName: "AnnounceManagement" */ '../pages/announceManagement/CreateAnnounce.vue')
        },
      ]
    }
  ]
})


// 无需登录的即可访问的路由列表
const whiteList = ['/login', '/home', '/practice', '/problemSet', '/contest']
router.beforeEach((to, from, next) => {
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